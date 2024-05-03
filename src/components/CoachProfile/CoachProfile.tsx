import React, { useEffect, useState } from "react";
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
import MyChatsList from "../MyChatsList/MyChatsList";
import { Chat } from "../Chat/Chat";

export const CoachProfile: React.FC<Props> = () => {
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const [selectedChat, setSelectedChat] = useState<string>("");

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

  const selectChatWith = (userId: string) => {
    setSelectedChat(userId);
    // console.log(userId);
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
      <div className="coach-profile__right">
        <MyChatsList selectChatWith={selectChatWith} />
        {selectedChat !== "" && <Chat withUserId={selectedChat} />}
      </div>
    </div>
  );
};
