import React, { useEffect, useRef } from "react";
import "../CommonCSS/UserProfile.css";
import { Props } from "./CoachProfileTypes";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Coach } from "../redux/slices/App/appTypes";
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from "../../utils/constants/commonValues";
import { translations } from "../../utils/constants/translations";
import { updateUserInfoThunk } from "../redux/slices/App/appAsync";
import { getOptionsList } from "../../utils/functions";
import { setCurrentPage } from "../redux/slices/App/appSlice";

export const CoachProfile: React.FC<Props> = () => {
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const aboutAreaRef = useRef<HTMLFieldSetElement>(null);
  const paymentAreaRef = useRef<HTMLFieldSetElement>(null);

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

  const formValues = watch();

  useEffect(() => {
    dispatch(setCurrentPage("my_profile"));
    return () => {
      dispatch(setCurrentPage(undefined));
    };
  });

  const onSubmit = () => {
    dispatch(
      updateUserInfoThunk({ ...formValues, updateType: "profileUpdate" })
    );
  };

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

  useEffect(() => {
    // console.log(formValues);
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

          {/* ---------------  Professional info ---------------- */}

          {/* ---------------  Skills ---------------- */}

          <fieldset className="user-profile__info-section-fieldset">
            <legend className="user-profile__legend">
              {translations.coach.common.professionalInfo[currentLanguage]}
            </legend>

            <fieldset
              className={`user-profile__column-fieldset ${
                errors.skills && "user-profile__fieldset_type_error"
              }`}
            >
              <legend className="user-profile__legend">
                {translations.coach.common.chooseSkills[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.coach.skills,
                currentLanguage,
                labelClassName: "user-profile__label",
                textClassName: "user-profile__label-text",
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
              <p className="user-profile__error-message">
                {errors.skills?.message}
              </p>
            </fieldset>

            {/* ---------------  Sertification ---------------- */}

            <fieldset
              className={`user-profile__column-fieldset ${
                errors.sertificationLevel && "user-profile__fieldset_type_error"
              }`}
            >
              <legend className="user-profile__legend">
                {translations.coach.common.chooseSertification[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.coach.sert,
                currentLanguage,
                labelClassName: "user-profile__label",
                textClassName: "user-profile__label-text",
                addProps: register("sertification"),
                type: "radio",
                disabled: false,
              })}
              <div className="user-profile__sert-lev-container">
                {getOptionsList({
                  list: translations.coach.sertLevelList,
                  currentLanguage,
                  labelClassName: "user-profile__label",
                  textClassName: "user-profile__label-text",
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
                <p className="user-profile__error-message user-profile__error-message_type_sert-lev">
                  {errors.sertificationLevel?.message}
                </p>
              </div>
            </fieldset>

            {/* ---------------  Payment options ---------------- */}
            <div className="user-profile__divider" />

            <fieldset
              className={`user-profile__column-fieldset ${
                errors.paymentOptions && "user-profile__fieldset_type_error"
              }`}
            >
              <legend className="user-profile__legend">
                {translations.coach.common.choosePayment[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.coach.paymentOptions,
                currentLanguage,
                labelClassName: "user-profile__label",
                textClassName: "user-profile__label-text",
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
              <p className="user-profile__error-message">
                {errors.paymentOptions?.message}
              </p>
            </fieldset>

            <fieldset
              className="user-profile__textarea-fieldset"
              style={
                !formValues.paymentOptions.includes("money")
                  ? { borderColor: "rgba(0,0,0,0.2)" }
                  : {}
              }
              ref={paymentAreaRef}
            >
              <legend
                className="user-profile__legend"
                style={
                  !formValues.paymentOptions.includes("money")
                    ? { color: "rgba(0,0,0,0.2)" }
                    : {}
                }
              >
                {
                  translations.coach.common.describePaymentScheme[
                    currentLanguage
                  ]
                }
              </legend>
              <textarea
                className="user-profile__textarea-input user-profile__textarea-input_type_payment"
                {...register("paymentScheme")}
                disabled={!formValues.paymentOptions.includes("money")}
                onFocus={() => handleFocus(paymentAreaRef, true)}
                onBlur={(e) => {
                  register("paymentScheme").onBlur(e);
                  handleFocus(paymentAreaRef, false);
                }}
                style={
                  !formValues.paymentOptions.includes("money")
                    ? { color: "rgba(0,0,0,0.2)" }
                    : {}
                }
              />
            </fieldset>
            <div className="user-profile__divider" />

            {/* ---------------  Status ---------------- */}

            <fieldset
              className="user-profile__row-fieldset"
              style={
                formValues.status === "busy" ? { borderColor: "orange" } : {}
              }
            >
              <legend className="user-profile__legend">
                {translations.coach.common.status[currentLanguage]}
              </legend>
              {getOptionsList({
                list: translations.coach.statusChoise,
                currentLanguage,
                labelClassName: "user-profile__label",
                textClassName: "user-profile__label-text",
                addProps: register("status"),
                type: "radio",
                disabled: false,
              })}
            </fieldset>
          </fieldset>
        </fieldset>
        <button type="submit" className="user-profile__save-btn">
          {translations.profile.common.saveProfile[currentLanguage]}
        </button>
      </form>
    </div>
  );
};
