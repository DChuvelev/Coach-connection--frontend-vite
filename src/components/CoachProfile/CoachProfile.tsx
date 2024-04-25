import React, { useEffect } from "react";
import "./CoachProfile.css";
import { Props } from "./CoachProfileTypes";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Coach } from "../redux/slices/App/appTypes";
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from "../../utils/constants/commonValues";
import { Translations, translations } from "../../utils/constants/translations";
import { updateUserInfoThunk } from "../redux/slices/App/appAsync";

export const CoachProfile: React.FC<Props> = () => {
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const currentLanguage = useAppSelector((state) => state.app.lang);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Coach>({
    defaultValues: currentUser,
    mode: "onChange",
  });
  const dispatch = useAppDispatch();

  let formValues = watch();

  const onSubmit = () => {
    dispatch(updateUserInfoThunk(formValues));
  };

  useEffect(() => {
    console.log(formValues);
    if (
      formValues.sertification !== "levFollowing" &&
      formValues.sertificationLevel.length !== 0
    ) {
      setValue("sertificationLevel", []);
    }
  }, [formValues, setValue]);

  useEffect(() => {
    trigger("sertificationLevel");
  }, [formValues.sertification, trigger]);

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
          <label className="coach-profile__label">
            <input
              type={type}
              {...addProps}
              value={itemWithTranslations.id}
              disabled={disabled}
            />
            <p className="coach-profile__label-text">
              {itemWithTranslations[currentLanguage]}
            </p>
          </label>
        </div>
      );
    });
    return <>{res}</>;
  };

  return (
    <div className="coach-profile">
      <form className="coach-profile__form" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="coach-profile__fieldset">
          {/* ---------------  General info ---------------- */}

          <fieldset className="coach-profile__general-info-fieldset ">
            <legend className="coach-profile__legend">
              {translations.profile.generalInfo[currentLanguage]}
            </legend>

            {/* ---------------  User name input ---------------- */}
            <fieldset className="coach-profile__name-birthday-fieldset">
              <legend className="coach-profile__legend">
                {translations.profile.nameAndBirthday[currentLanguage]}
              </legend>
              <div className="coach-profile__input-field">
                <input
                  type="text"
                  className="coach-profile__input"
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
                      translations.common.errors.required_field[
                        currentLanguage
                      ],
                  })}
                />
                <p className="coach-profile__error-message">
                  {errors.name?.message}
                </p>
              </div>

              <input type="date" {...register("birthDate")} />
            </fieldset>

            {/* ---------------  User gender input ---------------- */}

            <fieldset className="coach-profile__gender-fieldset">
              <legend className="coach-profile__legend">
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
              className="coach-profile__lang-fieldset"
              style={errors.languages && { border: "3px solid red" }}
            >
              <legend className="coach-profile__legend">
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
              <p className="coach-profile__error-message">
                {errors.languages?.message}
              </p>
            </fieldset>

            {/* ---------------  User about input ---------------- */}

            <fieldset className="coach-profile__about-fieldset">
              <legend className="coach-profile__legend">
                {translations.profile.about[currentLanguage]}
              </legend>
              <textarea
                className="coach-profile__about-input"
                {...register("about")}
              />
            </fieldset>
          </fieldset>

          {/* ---------------  Professional info ---------------- */}

          {/* ---------------  Skills ---------------- */}

          <fieldset className="coach-profile__prof-info-fieldset">
            <legend className="coach-profile__legend">
              {translations.coach.professionalInfo[currentLanguage]}
            </legend>
            <fieldset
              className="coach-profile__skills-fieldset"
              style={errors.skills && { border: "3px solid red" }}
            >
              <legend className="coach-profile__legend">
                {translations.coach.chooseSkills[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.coach.skills,
                addProps: register("skills", {
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
              <p className="coach-profile__error-message">
                {errors.skills?.message}
              </p>
            </fieldset>

            {/* ---------------  Sertification ---------------- */}

            <fieldset
              className="coach-profile__sert-fieldset"
              style={errors.sertificationLevel && { border: "3px solid red" }}
            >
              <legend className="coach-profile__legend">
                {translations.coach.chooseSertification[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.coach.sert,
                addProps: register("sertification"),
                type: "radio",
                disabled: false,
              })}
              <div className="coach-profile__sert-lev-container">
                {getOptionsList({
                  list: translations.coach.sertLevelList,
                  addProps: register("sertificationLevel", {
                    validate: {
                      isEmpty: (val) => {
                        return (
                          !(
                            watch().sertification === "levFollowing" &&
                            val.length === 0
                          ) ||
                          translations.profile.errors.checkAtLeastOne[
                            currentLanguage
                          ]
                        );
                      },
                    },
                  }),
                  type: "checkbox",
                  disabled: formValues.sertification !== "levFollowing",
                })}
                <p className="coach-profile__error-message">
                  {errors.sertificationLevel?.message}
                </p>
              </div>
            </fieldset>

            {/* ---------------  Payment options ---------------- */}
            <div className="coach-profile__divider" />

            <fieldset
              className="coach-profile__payment-fieldset"
              style={errors.paymentOptions && { border: "3px solid red" }}
            >
              <legend className="coach-profile__legend">
                {translations.coach.choosePayment[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.coach.paymentOptions,
                addProps: register("paymentOptions", {
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
              <p className="coach-profile__error-message">
                {errors.paymentOptions?.message}
              </p>
            </fieldset>

            <fieldset
              className="coach-profile__payment-scheme-fieldset"
              style={
                !formValues.paymentOptions.includes("money")
                  ? { border: "1px solid rgba(0,0,0,0.2)" }
                  : {}
              }
            >
              <legend
                className="coach-profile__legend"
                style={
                  !formValues.paymentOptions.includes("money")
                    ? { color: "rgba(0,0,0,0.2)" }
                    : {}
                }
              >
                {translations.coach.describePaymentScheme[currentLanguage]}
              </legend>
              <textarea
                className="coach-profile__payment-scheme-input"
                {...register("paymentScheme")}
                disabled={!formValues.paymentOptions.includes("money")}
              />
            </fieldset>
            <div className="coach-profile__divider" />

            {/* ---------------  Status ---------------- */}

            <fieldset
              className="coach-profile__status-fieldset"
              style={
                formValues.status === "busy"
                  ? { border: "3px solid orange" }
                  : {}
              }
            >
              <legend className="coach-profile__legend">
                {translations.coach.status[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.coach.statusChoise,
                addProps: register("status"),
                type: "radio",
                disabled: false,
              })}
            </fieldset>
          </fieldset>
        </fieldset>
        <button type="submit">Save</button>
      </form>
      <div className="coach-profile__right"></div>
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
  /* <div className="coach-profile__input-field">
          <div className="coach-profile__input-field_type_file">
            <label className="coach-profile__file-label" htmlFor="user-pic">
              <img src={downloadIcon} className="coach-profile__file-icon" alt="" />
              <p className="coach-profile__file-label-txt">
                {translations.common.download_avatar[currentLanguage]}
              </p>
              <input
                type="file"
                className="coach-profile__input_type_file"
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
            <p className="coach-profile__filename">
              {formValues.userpic?.item && formValues.userpic.item(0)
                ? formValues.userpic.item(0)!.name
                : translations.common.file_not_loaded[currentLanguage]}
            </p>
          </div>
          {errors.userpic && (
            <p className="coach-profile__error-message">{errors.userpic.message}</p>
          )}
        </div> */
}
