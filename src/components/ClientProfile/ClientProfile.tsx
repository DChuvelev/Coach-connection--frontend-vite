import React, { useEffect, useRef } from "react";
import "../CommonCSS/UserProfile.css";
import { Props } from "./ClientProfileTypes";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Client } from "../redux/slices/App/appTypes";
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from "../../utils/constants/commonValues";
import { translations } from "../../utils/constants/translations";
import { updateUserInfoThunk } from "../redux/slices/App/appAsync";
import { getOptionsList } from "../../utils/functions";
import { setCurrentPage } from "../redux/slices/App/appSlice";

export const ClientProfile: React.FC<Props> = () => {
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const aboutAreaRef = useRef<HTMLFieldSetElement>(null);

  const handleFocus = (
    ref: React.RefObject<HTMLFieldSetElement>,
    add: boolean
  ) => {
    if (ref.current) {
      if (add) {
        ref.current.classList.add("user-profile__textarea-fieldset_type_focus");
      } else {
        ref.current.classList.remove(
          "user-profile__textarea-fieldset_type_focus"
        );
      }
    }
  };

  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<Client>({
    defaultValues: currentUser,
    mode: "onChange",
  });
  const dispatch = useAppDispatch();

  const formValues = watch();

  const onSubmit = () => {
    dispatch(
      updateUserInfoThunk({ ...formValues, updateType: "profileUpdate" })
    );
  };

  useEffect(() => {
    trigger();
  }, [currentLanguage, trigger]);

  useEffect(() => {
    dispatch(setCurrentPage("my_profile"));
    return () => {
      dispatch(setCurrentPage(undefined));
    };
  }, []);

  return (
    <div className="user-profile">
      <form className="user-profile__form" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="user-profile__fieldset">
          {/* ---------------  General info ---------------- */}

          <fieldset className="user-profile__info-section-fieldset">
            <legend className="user-profile__legend">
              {translations.profile.common.generalInfo[currentLanguage]}
            </legend>

            {/* ---------------  User name input ---------------- */}

            <fieldset className="user-profile__row-fieldset">
              <legend className="user-profile__legend">
                {translations.profile.common.nameAndBirthday[currentLanguage]}
              </legend>
              <div className="user-profile__input-container">
                <input
                  type="text"
                  className="user-profile__text-input"
                  id="user-name"
                  placeholder={translations.common.words.name[currentLanguage]}
                  {...register("name", {
                    minLength: {
                      value: MIN_USERNAME_LENGTH,
                      message:
                        translations.common.errors.username_too_short[
                          currentLanguage
                        ],
                    },
                    maxLength: {
                      value: MAX_USERNAME_LENGTH,
                      message:
                        translations.common.errors.username_too_long[
                          currentLanguage
                        ],
                    },
                    required:
                      translations.common.errors.required_field[
                        currentLanguage
                      ],
                  })}
                />
                <p className="user-profile__error-message user-profile__error-message_type_name">
                  {errors.name?.message}
                </p>
              </div>

              {/* ---------------  User birth date input ---------------- */}

              <input
                type="date"
                className="user-profile__birthday-input"
                {...register("birthDate")}
              />
            </fieldset>

            {/* ---------------  User gender input ---------------- */}

            <fieldset className="user-profile__row-fieldset">
              <legend className="user-profile__legend">
                {translations.profile.common.gender[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.profile.genderTypes,
                addProps: register("gender"),
                type: "radio",
                disabled: false,
                currentLanguage,
                labelClassName: "user-profile__label",
                textClassName: "user-profile__label-text",
              })}
            </fieldset>

            {/* ---------------  User language input ---------------- */}

            <fieldset
              className={`user-profile__column-fieldset ${
                errors.languages && "user-profile__fieldset_type_error"
              }`}
            >
              <legend className="user-profile__legend">
                {translations.profile.common.language[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.profile.languagesList,
                currentLanguage,
                labelClassName: "user-profile__label",
                textClassName: "user-profile__label-text",
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
              <p className="user-profile__error-message">
                {errors.languages?.message}
              </p>
            </fieldset>

            {/* ---------------  User about input ---------------- */}

            <fieldset
              className="user-profile__textarea-fieldset"
              ref={aboutAreaRef}
            >
              <legend className="user-profile__legend">
                {translations.profile.common.about[currentLanguage]}
              </legend>
              <textarea
                className="user-profile__textarea-input"
                onFocus={() => handleFocus(aboutAreaRef, true)}
                {...register("about")}
                onBlur={(e) => {
                  register("about").onBlur(e);
                  handleFocus(aboutAreaRef, false);
                }}
              />
            </fieldset>
          </fieldset>
        </fieldset>
        <button type="submit" className="user-profile__save-btn">
          {translations.profile.common.saveProfile[currentLanguage]}
        </button>
      </form>
      <div className="user-profile__right"></div>
    </div>
  );
};
