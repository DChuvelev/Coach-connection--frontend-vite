import "./CoachSelector.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { CoachCard } from "../CoachCard/CoachCard";
import { translations } from "../../utils/constants/translations";
import { useForm } from "react-hook-form";
import { CoachFinder } from "./CoachSelectorTypes";
import {
  CoachInfo,
  emptyCoachFinderFormValues,
} from "../redux/slices/Coaches/coachesTypes";
import { useEffect } from "react";
import {
  resetCoachFinderValues,
  setCoachFinderValues,
} from "../redux/slices/Coaches/coachesSlice";
import { selectCoachByGptThunk } from "../redux/slices/Coaches/coachesAsync";
import { setAppStatus, setCurrentPage } from "../redux/slices/App/appSlice";
import { formTranslatedString, getOptionsList } from "../../utils/functions";
import { LangChoice, appLangs } from "../../utils/constants/langs";
import { useNavigate } from "react-router-dom";

export default function CoachSelector() {
  const coachesList = useAppSelector((state) => state.coaches.coachesList);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const gptAnswer = useAppSelector((state) => state.coaches.gptAnswer);
  const navigate = useNavigate();
  const coachFinderGlobalValues = useAppSelector(
    (state) => state.coaches.coachFinderValues
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (gptAnswer.coachId !== "") {
      navigate(`/coaches/${gptAnswer.coachId}`);
    }
  }, [gptAnswer.coachId]);

  useEffect(() => {
    dispatch(setCurrentPage("find_a_coach"));
    return () => {
      dispatch(setCurrentPage(undefined));
    };
  });

  const resetForm = () => {
    dispatch(resetCoachFinderValues());
    reset(emptyCoachFinderFormValues);
  };

  const getCoachInfoJSON = (coach: CoachInfo) => {
    return JSON.stringify({
      name: coach.name,
      _id: coach._id,
      birthDate: coach.birthDate,
      speaksFollowingLanguages: formTranslatedString(
        translations.profile.languagesList,
        coach.languages,
        LangChoice.En
      ),
      fieldsOfActivity: formTranslatedString(
        translations.coach.skills,
        coach.skills,
        LangChoice.En
      ),
      sertification: formTranslatedString(
        translations.coach.sert,
        [coach.sertification],
        LangChoice.En
      ),
      sertificationAdditional: formTranslatedString(
        translations.coach.sertLevelList,
        coach.sertificationLevel,
        LangChoice.En
      ),
      paymentOptions: formTranslatedString(
        translations.coach.paymentOptions,
        coach.paymentOptions,
        LangChoice.En
      ),
      paymentScheme: coach.paymentScheme,
      about: coach.about,
    });
  };
  const chooseWithGpt = async () => {
    const currentUserOpenInfo = {
      gender: currentUser.gender,
      speaksFollowingLanguages: formTranslatedString(
        translations.profile.languagesList,
        currentUser.languages,
        LangChoice.En
      ),
      birthDate: currentUser.birthDate,
      request: currentUser.about,
    };

    let message = `Client: 
    ${JSON.stringify(currentUserOpenInfo)}
    Coaches list:\n`;
    coachesList.forEach((coach) => {
      message += `${getCoachInfoJSON(coach)}\n`;
    });
    message += `Language to answer: ${
      appLangs.find((lang) => lang.id === currentLanguage)?.name
    }`;

    dispatch(setAppStatus("waiting"));
    await dispatch(selectCoachByGptThunk(message));
    dispatch(setAppStatus("done"));
  };

  const { register, watch, reset } = useForm<CoachFinder>({
    defaultValues: coachFinderGlobalValues,
  });

  const formValues = watch();

  useEffect(() => {
    return () => {
      dispatch(setCoachFinderValues(watch()));
    };
  }, []);

  const filterCoaches = (coach: CoachInfo) => {
    for (const key in formValues) {
      const formKey = key as keyof CoachFinder;
      const coachKey = key as keyof CoachInfo;
      if (
        formValues[formKey] &&
        coach[coachKey] &&
        formValues[formKey].length //nothing is checked means that the field is off === no filter
      ) {
        let coachCurrentKeyArray: Array<string> = [];
        // make sure that both compared fields are string arrays;
        if (coach[coachKey] instanceof Array) {
          coachCurrentKeyArray = coach[coachKey] as Array<string>;
        } else {
          coachCurrentKeyArray.push(coach[coachKey] as string);
        }

        if (coachKey === "sertification") {
          // for sertification we need also to add values fron sertificationLevel array
          coachCurrentKeyArray.push(...coach.sertificationLevel);
        }

        const crossCheck = coachCurrentKeyArray.some((item) =>
          formValues[formKey].includes(item)
        );

        if (!crossCheck) return false;
      }
    }
    return true;
  };

  const formSertificationList = () => {
    const { levFollowing, ...sertFilterd } = translations.coach.sert;
    return { ...sertFilterd, ...translations.coach.sertLevelList };
  };

  return (
    <main className="coach-selector">
      <div className="coach-selector__sidebar">
        <h2>
          {translations.client.search.searchForCoachHeading[currentLanguage]}
        </h2>

        <div className="coach-selector__search-fields">
          {/* ----------- Gender -------------- */}
          <fieldset
            className="coach-selector__fieldset"
            style={
              formValues.gender && formValues.gender.length
                ? { border: "3px solid green" }
                : {}
            }
          >
            <legend className="coach-selector__legend">
              {translations.profile.common.gender[currentLanguage]}
            </legend>
            {getOptionsList({
              list: translations.profile.genderTypes,
              currentLanguage,
              labelClassName: "coach-selector__label",
              textClassName: "coach-selector__label-text",
              addProps: register("gender"),
              type: "checkbox",
              disabled: false,
            })}
          </fieldset>

          {/* ----------- Language -------------- */}

          <fieldset
            className="coach-selector__fieldset"
            style={
              formValues.languages && formValues.languages.length
                ? { border: "3px solid green" }
                : {}
            }
          >
            <legend className="coach-selector__legend">
              {translations.profile.common.language[currentLanguage]}
            </legend>
            {getOptionsList({
              list: translations.profile.languagesList,
              currentLanguage,
              labelClassName: "coach-selector__label",
              textClassName: "coach-selector__label-text",
              addProps: register("languages"),
              type: "checkbox",
              disabled: false,
            })}
          </fieldset>

          {/* ----------- Skills -------------- */}

          <fieldset
            className="coach-selector__fieldset"
            style={
              formValues.skills && formValues.skills.length
                ? { border: "3px solid green" }
                : {}
            }
          >
            <legend className="coach-selector__legend">
              {translations.coach.common.chooseSkills[currentLanguage]}
            </legend>
            {getOptionsList({
              list: translations.coach.skills,
              currentLanguage,
              labelClassName: "coach-selector__label",
              textClassName: "coach-selector__label-text",
              addProps: register("skills"),
              type: "checkbox",
              disabled: false,
            })}
          </fieldset>

          {/* ----------- Sertification -------------- */}

          <fieldset
            className="coach-selector__fieldset"
            style={
              formValues.sertification && formValues.sertification.length
                ? { border: "3px solid green" }
                : {}
            }
          >
            <legend className="coach-selector__legend">
              {translations.coach.common.chooseSertification[currentLanguage]}
            </legend>
            {getOptionsList({
              list: formSertificationList(),
              currentLanguage,
              labelClassName: "coach-selector__label",
              textClassName: "coach-selector__label-text",
              addProps: register("sertification"),
              type: "checkbox",
              disabled: false,
            })}
          </fieldset>

          {/* ----------- Payment options -------------- */}

          <fieldset
            className={`coach-selector__fieldset ${
              formValues.paymentOptions &&
              formValues.paymentOptions.length &&
              "coach-selector__fieldset_type_selected"
            }`}
            // style={
            //   formValues.paymentOptions && formValues.paymentOptions.length
            //     ? { border: "3px solid green" }
            //     : {}
            // }
          >
            <legend className="coach-selector__legend">
              {translations.coach.common.choosePayment[currentLanguage]}
            </legend>
            {getOptionsList({
              list: translations.coach.paymentOptions,
              currentLanguage,
              labelClassName: "coach-selector__label",
              textClassName: "coach-selector__label-text",
              addProps: register("paymentOptions"),
              type: "checkbox",
              disabled: false,
            })}
          </fieldset>

          {/* ----------- Buttons -------------- */}
          <div className="coach-selector__buttons">
            <button
              type="button"
              onClick={resetForm}
              className="coach-selector__btn coach-selector__btn_type_reset-form"
            >
              {translations.common.words.resetSearch[currentLanguage]}
            </button>
            <p className="coach-selector__text-ask-gpt">
              {translations.client.search.offerAssistanceText[currentLanguage]}
            </p>
            <button
              type="button"
              onClick={chooseWithGpt}
              className="coach-selector__btn coach-selector__btn_type_ask-gpt"
            >
              {translations.client.search.assistBtn[currentLanguage]}
            </button>
          </div>
        </div>
      </div>

      <div className="coach-selector__cards-container">
        <ul className="coach-selector__cards">
          {coachesList
            .filter((coach) => filterCoaches(coach))
            .map((coach, idx) => {
              return (
                <CoachCard key={idx} coach={coach} handleCardClick={() => {}} />
              );
            })}
        </ul>
      </div>
    </main>
  );
}
