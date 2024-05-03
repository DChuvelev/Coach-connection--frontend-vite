import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import "./SlideShow.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAvatar } from "../../utils/functions";
import {
  removeSlideShowCounter,
  startSlideShowCounter,
} from "../redux/slices/Coaches/coachesAsync";
import { incCoachesSlideShowCounter } from "../redux/slices/Coaches/coachesSlice";
import { Link, useNavigate } from "react-router-dom";
import { translations } from "../../utils/constants/translations";
import { Props } from "./SlideShowTypes";

const SlideShow: React.FC<Props> = ({ redirectToLogin }) => {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const looggedIn = useAppSelector((state) => state.app.loggedIn);
  const coachesList = useAppSelector((state) => state.coaches.coachesList);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const navigate = useNavigate();
  const slideShowIndex = useAppSelector(
    (state) => state.coaches.slideShowCounter
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(startSlideShowCounter());
    return () => {
      dispatch(removeSlideShowCounter());
    };
  }, []);

  const moveToNextPicture = () => {
    dispatch(incCoachesSlideShowCounter());
  };
  useEffect(() => {
    setShouldAnimate(false);
    setTimeout(() => {
      setShouldAnimate(true);
    }, 100);
  }, [slideShowIndex]);

  const handlePhotoClick: React.EventHandler<SyntheticEvent> = (evt) => {
    if (!looggedIn) {
      // console.log("Please, log in to see details");
      redirectToLogin();
    } else {
      navigate(`/coaches/${coachesList[slideShowIndex]._id}`);
    }
  };

  return (
    <>
      {coachesList.length > 0 && (
        <div className="slide-show">
          <h1 className="slide-show__heading">
            {translations.client.main.ourCoaches[currentLanguage]}
          </h1>

          <div
            className={`slide-show__image-cont ${
              shouldAnimate ? "slide-show__image-animate" : ""
            }`}
            onClick={handlePhotoClick}
          >
            <img
              className="slide-show__image"
              src={getAvatar(coachesList[slideShowIndex])}
              onError={moveToNextPicture}
              onLoad={
                coachesList[slideShowIndex]._id === currentUser._id
                  ? moveToNextPicture
                  : () => {}
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SlideShow;
