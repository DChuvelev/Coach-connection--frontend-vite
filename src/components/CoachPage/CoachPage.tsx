import React from "react";
import "./CoachPage.css";
import { Props } from "./CoachPageTypes";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { CoachInfo } from "../redux/slices/Coaches/coachesTypes";
import {
  calculateAge,
  formTranslatedString,
  getAvatar,
} from "../../utils/functions";
import { translations } from "../../utils/constants/translations";

const CoachPage: React.FC<Props> = () => {
  const coaches = useAppSelector((state) => state.coaches.coachesList);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const params = useParams();
  const currentCoach = coaches.find(
    (coach) => coach._id === params.coachId
  ) as CoachInfo;
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
          <div className="coach-page__text">Text</div>
          <div className="coach-page__chat">Chat</div>
        </div>
      )}
    </>
  );
};

export default CoachPage;
