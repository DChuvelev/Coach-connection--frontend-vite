import React, { useEffect } from "react";
import "./ClientProfile.css";
import { Props } from "./ClientProfileTypes";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Client } from "../redux/slices/App/appTypes";
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from "../../utils/constants/commonValues";
import { Translations, translations } from "../../utils/constants/translations";
import { updateUserInfoThunk } from "../redux/slices/App/appAsync";

export const ClientProfile: React.FC<Props> = () => {
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Client>({
    defaultValues: currentUser,
  });
  const dispatch = useAppDispatch();

  let formValues = watch();

  const onSubmit = () => {
    dispatch(updateUserInfoThunk(formValues));
  };

  // useEffect(() => {
  //   console.log(formValues);
  // }, [formValues, setValue]);

  useEffect(() => {
    trigger();
  }, [currentLanguage, trigger]);

  const getOptionsList = ({
    list,
    addProps,
    type,
    disabled,
  }: {
    list: Object;
    addProps: Object;
    type: string;
    disabled: boolean;
  }) => {
    const listAsArray = Object.keys(list)
      .filter((item) => item != "")
      .map((item) => {
        const currentKey = item as keyof typeof list;
        return {
          id: item,
          ...list[currentKey],
        };
      });

    const res = listAsArray.map((item) => {
      const itemWithTranslations = item as { id: string } & Translations;
      return (
        <div key={itemWithTranslations.id}>
          <label className="client-profile__label">
            <input
              type={type}
              {...addProps}
              value={itemWithTranslations.id}
              disabled={disabled}
            />
            <p className="client-profile__label-text">
              {itemWithTranslations[currentLanguage]}
            </p>
          </label>
        </div>
      );
    });
    return <>{res}</>;
  };

  return (
    <div className="client-profile">
      <form className="client-profile__form" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="client-profile__fieldset">
          {/* ---------------  General info ---------------- */}

          <fieldset className="client-profile__general-info-fieldset ">
            <legend className="client-profile__legend">
              {translations.profile.generalInfo[currentLanguage]}
            </legend>
            <div className="client-profile__input-field">
              {/* ---------------  User name input ---------------- */}

              <label className="client-profile__label" htmlFor="user-name">
                {translations.common.name[currentLanguage]}
              </label>
              <input
                type="text"
                className="client-profile__input"
                id="user-name"
                placeholder={translations.common.name[currentLanguage]}
                {...register("name", {
                  minLength: {
                    value: MIN_USERNAME_LENGTH,
                    message: "User name should be at least 1 character",
                  },
                  maxLength: {
                    value: MAX_USERNAME_LENGTH,
                    message: "User name should be maximum 30 characters long",
                  },
                  required:
                    translations.common.errors.required_field[currentLanguage],
                })}
              />
              <p className="client-profile__error-message">
                {errors.name?.message}
              </p>
            </div>

            {/* ---------------  User gender input ---------------- */}

            <fieldset className="client-profile__input-fieldset_gender">
              <legend className="client-profile__legend">
                {translations.profile.gender[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.profile.genderTypes,
                addProps: register("gender"),
                type: "radio",
                disabled: false,
              })}
            </fieldset>

            {/* ---------------  User language input ---------------- */}

            <fieldset
              className="client-profile__lang-fieldset"
              style={errors.languages && { border: "3px solid red" }}
            >
              <legend className="client-profile__legend">
                {translations.profile.language[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.profile.languagesList,
                addProps: register("languages", {
                  validate: {
                    isEmpty: (val) => {
                      return (
                        val.length !== 0 ||
                        translations.profile.errors.checkAtLeastOne[
                          currentLanguage
                        ]
                      );
                    },
                  },
                }),
                type: "checkbox",
                disabled: false,
              })}
              <p className="client-profile__error-message">
                {errors.languages?.message}
              </p>
            </fieldset>

            {/* ---------------  User birthday input ---------------- */}

            <fieldset>
              <legend className="client-profile__legend">
                {translations.profile.birthDate[currentLanguage]}
              </legend>
              <input type="date" {...register("birthDate")} />
            </fieldset>

            {/* ---------------  User about input ---------------- */}

            <fieldset className="client-profile__about-fieldset">
              <legend className="client-profile__legend">
                {translations.profile.about[currentLanguage]}
              </legend>
              <textarea
                className="client-profile__about-input"
                {...register("about")}
              />
            </fieldset>
          </fieldset>
        </fieldset>
        <button type="submit">Save</button>
      </form>
      <div className="client-profile__right"></div>
    </div>
  );
};

// import React, { useEffect, useRef } from "react";

// import ModalWithForm from "../ModalWithForm/ModalWithForm";
//
// import { translations } from "../../utils/constants/translations";
// import {
//   MIN_PASSWORD_LENGTH,
//   MAX_PASSWORD_LENGTH,
//   MAX_USERPIC_FILE_SIZE,
//   MIN_USERNAME_LENGTH,
//   MAX_USERNAME_LENGTH,
// } from "../../utils/constants/commonValues";
// import downloadIcon from "../../images/download.svg";
//
// import { Props } from "./RegisterModalTypes";
// import { UserToRegister } from "../redux/slices/dbTypes";
// import {
//   setRegisterFormValues,
//   setLoginFormValues,
//   resetAuthError,
// } from "../redux/slices/appSlice";

// export const RegisterModal: React.FC<Props> = ({
//   formInfo,
//   formCallbacks,
//   activeModal,
//   onClose,
//   isBusy,
// }) => {
//   const currentLanguage = useAppSelector((store) => store.app.lang);
//   const registerFormValues = useAppSelector(
//     (state) => state.app.registerFormValues
//   );
//   const loginFormValues = useAppSelector((state) => state.app.loginFormValues);
//   const appError = useAppSelector((state) => state.app.error);
//

//   const formValues = watch();

//   useEffect(() => {
//     if (appError) dispatch(resetAuthError());
//   }, [formValues.email, formValues.role]);

//   const handleSubmitRegister = () => {
//     dispatch(setRegisterFormValues(formValues));
//     formCallbacks.handleSubmit();
//   };

//   const handleRedir = () => {
//     dispatch(setRegisterFormValues(formValues));
//     dispatch(
//       setLoginFormValues({
//         ...loginFormValues,
//         email: formValues.email,
//         password: formValues.password,
//       })
//     );
//     formCallbacks.handleRedir();
//   };

{
  /* <div className="client-profile__input-field">
          <div className="client-profile__input-field_type_file">
            <label className="client-profile__file-label" htmlFor="user-pic">
              <img src={downloadIcon} className="client-profile__file-icon" alt="" />
              <p className="client-profile__file-label-txt">
                {translations.common.download_avatar[currentLanguage]}
              </p>
              <input
                type="file"
                className="client-profile__input_type_file"
                id="user-pic"
                placeholder=""
                // name="userpic"
                // ref={fileRef}
                {...register("userpic", {
                  validate: {
                    fileSize: (val) => {
                      if (val?.item && val.item(0)) {
                        return (
                          val.item(0)!.size < MAX_USERPIC_FILE_SIZE ||
                          translations.common.errors.userpic_file_too_big[
                            currentLanguage
                          ]
                        );
                      } else {
                        return true;
                      }
                    },
                  },
                })}
              />
            </label>
            <p className="client-profile__filename">
              {formValues.userpic?.item && formValues.userpic.item(0)
                ? formValues.userpic.item(0)!.name
                : translations.common.file_not_loaded[currentLanguage]}
            </p>
          </div>
          {errors.userpic && (
            <p className="client-profile__error-message">{errors.userpic.message}</p>
          )}
        </div> */
}
