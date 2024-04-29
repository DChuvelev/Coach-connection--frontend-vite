import React, { useEffect, useState } from "react";
import "./CoachPage.css";
import { Props } from "./CoachPageTypes";
import { Navigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { CoachInfo } from "../redux/slices/Coaches/coachesTypes";
import {
  calculateAge,
  formTranslatedString,
  getAvatar,
} from "../../utils/functions";
import { translations } from "../../utils/constants/translations";
import {
  resetGptAnswerId,
  resetGptAnswerText,
} from "../redux/slices/Coaches/coachesSlice";
import { chatApi } from "../../utils/api/ChatApi";
import {
  createChatThunk,
  getChatByIdThunk,
} from "../redux/slices/Chats/chatsAsync";
import { Chat } from "../Chat/Chat";

const CoachPage: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const coaches = useAppSelector((state) => state.coaches.coachesList);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const gptText = useAppSelector((state) => state.coaches.gptAnswer.text);
  const params = useParams();
  const currentCoach = coaches.find(
    (coach) => coach._id === params.coachId
  ) as CoachInfo;
  const [aiPromptOpacity, setAiPromptOpacity] = useState(0);
  const [aiPromptDisplay, setAiPromptDisplay] = useState("flex");

  useEffect(() => {
    dispatch(resetGptAnswerId());
    if (gptText !== "") {
      setTimeout(() => {
        setAiPromptOpacity(1);
      }, 50);
    }
    return () => {
      dispatch(resetGptAnswerText());
    };
  }, []);

  const closeGptAnswer = () => {
    setAiPromptOpacity(0);
    setTimeout(() => {
      dispatch(resetGptAnswerText());
      setAiPromptDisplay("none");
    }, 2000);
  };

  const coachInfoArray = currentCoach
    ? [
        {
          left: translations.common.name[currentLanguage],
          right: [currentCoach.name],
        },
        {
          left: translations.profile.gender[currentLanguage],
          right: [
            translations.profile.genderTypes[currentCoach.gender][
              currentLanguage
            ],
          ],
        },
        {
          left: translations.profile.age[currentLanguage],
          right: [calculateAge(currentCoach.birthDate)],
        },
        {
          left: translations.profile.language[currentLanguage],
          right: formTranslatedString(
            translations.profile.languagesList,
            currentCoach.languages,
            currentLanguage
          ),
        },
        {
          left: translations.coach.chooseSkills[currentLanguage],
          right: formTranslatedString(
            translations.coach.skills,
            currentCoach.skills,
            currentLanguage
          ),
        },
        {
          left: translations.coach.chooseSertification[currentLanguage],
          right: formTranslatedString(
            { ...translations.coach.sert, ...translations.coach.sertLevelList },
            [
              currentCoach.sertification,
              ...currentCoach.sertificationLevel,
            ].filter((item) => item != "levFollowing"),
            currentLanguage
          ),
        },
        {
          left: translations.coach.choosePayment[currentLanguage],
          right: formTranslatedString(
            translations.coach.paymentOptions,
            currentCoach.paymentOptions,
            currentLanguage
          ),
        },
        {
          left: translations.coach.describePaymentScheme[currentLanguage],
          right: currentCoach.paymentOptions.includes("money")
            ? currentCoach.paymentScheme
            : "",
        },
        {
          left: translations.profile.aboutShort[currentLanguage],
          right: currentCoach.about,
        },
      ]
    : [];

  const getChatWithCoach = async () => {
    console.log("Click");
    await dispatch(createChatThunk(currentCoach._id));
  };

  return (
    <>
      {currentCoach === undefined && <Navigate to="/" />}
      {currentCoach && (
        <div className="coach-page">
          <div className="coach-page__info">
            {coachInfoArray
              .filter((infoItem) => infoItem.right != "")
              .map((infoItem, idx) => {
                return (
                  <p key={idx}>
                    <span className="coach-page__info-left">{`${infoItem.left}: `}</span>
                    <span className="coach-page__info-right">
                      {`${infoItem.right}`}
                    </span>
                  </p>
                );
              })}
          </div>
          <div className="coach-page__img-cont">
            <img
              className="coach-page__image"
              src={getAvatar(currentCoach)}
              alt={currentCoach.name}
            />
          </div>
          <div
            className="coach-page__gpt"
            style={{ opacity: aiPromptOpacity, display: aiPromptDisplay }}
            onClick={closeGptAnswer}
          >
            <p className="coach-page__gpt-text">{gptText}</p>
          </div>
          <div className="coach-page__text">
            <button type="button" onClick={getChatWithCoach}>
              GetChat
            </button>
          </div>
          <div className="coach-page__chat">
            <Chat
              withUser={{
                id: currentCoach._id,
                name: currentCoach.name,
                role: "coach",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CoachPage;
