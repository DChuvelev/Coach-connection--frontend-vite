import "./CoachSelector.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { CoachCard } from "../CoachCard/CoachCard";
import { Translations, translations } from "../../utils/constants/translations";
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
import { setAppStatus } from "../redux/slices/App/appSlice";
export default function CoachSelector() {
  const coachesList = useAppSelector((state) => state.coaches.coachesList);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const gptAnswer = useAppSelector((state) => state.coaches.gptAnswer);
  const coachFinderGlobalValues = useAppSelector(
    (state) => state.coaches.coachFinderValues
  );
  const dispatch = useAppDispatch();

  const getOptionsList = ({
    list,
    addProps,
    type,
    disabled,
  }: {
    list: Object;
    addProps?: Object;
    type: string;
    disabled: boolean;
  }) => {
    const listAsArray = Object.keys(list)
      .filter((item) => item !== "")
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

  const resetForm = () => {
    dispatch(resetCoachFinderValues());
    reset(emptyCoachFinderFormValues);
  };

  const chooseWithGpt = async () => {
    let resp;
    const { _id, email, name, role, avatar, ...currentUserOpenInfo } =
      currentUser;
    let message = `Привет! Помоги подобрать коуча для меня. 
    Вот информация обо мне в объекте json: ${JSON.stringify(
      currentUserOpenInfo
    )}.
    А вот json объекты с информацией о коучах: \n`;
    coachesList.forEach((coach, idx) => {
      message += `${JSON.stringify(coach)}\n`;
    });
    message +=
      "Ответ сформулируй в виде объекта json с двумя ключами. coachId - поле _id выбранного коуча, text - аргументация.";

    // console.log(message);
    dispatch(setAppStatus("waiting"));

    await dispatch(selectCoachByGptThunk([{ role: "user", text: message }]));
    console.log(gptAnswer[0].message.text);
    dispatch(setAppStatus("done"));
  };

  const { register, watch, reset } = useForm<CoachFinder>({
    defaultValues: coachFinderGlobalValues,
  });

  const formValues = watch();

  useEffect(() => {
    // console.log(coachFinderGlobalValues);
    return () => {
      // console.log(watch());
      dispatch(setCoachFinderValues(watch()));
    };
  }, []);

  // useEffect(() => {
  //   console.log(formValues);
  // }, [formValues]);

  const filterCoaches = (coach: CoachInfo) => {
    for (const key in formValues) {
      const formKey = key as keyof CoachFinder;
      const coachKey = key as keyof CoachInfo;
      if (
        formValues[formKey] &&
        coach[coachKey] &&
        formValues[formKey].length //inothing is checked means that the field is off === no filter
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

        let crossCheck = coachCurrentKeyArray.some((item) =>
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
          {translations.client.main.searchForCoachHeading[currentLanguage]}
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
              {translations.profile.gender[currentLanguage]}
            </legend>
            {getOptionsList({
              list: translations.profile.genderTypes,
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
              {translations.profile.language[currentLanguage]}
            </legend>
            {getOptionsList({
              list: translations.profile.languagesList,
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
              {translations.coach.chooseSkills[currentLanguage]}
            </legend>
            {getOptionsList({
              list: translations.coach.skills,
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
              {translations.coach.chooseSertification[currentLanguage]}
            </legend>
            {getOptionsList({
              list: formSertificationList(),
              addProps: register("sertification"),
              type: "checkbox",
              disabled: false,
            })}
          </fieldset>

          {/* ----------- Payment options -------------- */}

          <fieldset
            className="coach-selector__fieldset"
            style={
              formValues.paymentOptions && formValues.paymentOptions.length
                ? { border: "3px solid green" }
                : {}
            }
          >
            <legend className="coach-selector__legend">
              {translations.coach.choosePayment[currentLanguage]}
            </legend>
            {getOptionsList({
              list: translations.coach.paymentOptions,
              addProps: register("paymentOptions"),
              type: "checkbox",
              disabled: false,
            })}
          </fieldset>

          {/* ----------- Buttons -------------- */}
          <div className="coach-selector__buttons">
            <button type="button" onClick={resetForm}>
              {translations.common.resetSearch[currentLanguage]}
            </button>
            <button type="button" onClick={chooseWithGpt}>
              Ask GPT
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
