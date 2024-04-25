import React, { useEffect, useRef, useState } from "react";
import "./SlideShow.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAvatar } from "../../utils/functions";
import {
  removeSlideShowCounter,
  startSlideShowCounter,
} from "../redux/slices/Coaches/coachesAsync";
import { incCoachesSlideShowCounter } from "../redux/slices/Coaches/coachesSlice";
import { Link } from "react-router-dom";
import { translations } from "../../utils/constants/translations";

const SlideShow: React.FC = () => {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const coachesList = useAppSelector((state) => state.coaches.coachesList);
  const currentLanguage = useAppSelector((state) => state.app.lang);
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

  return (
    <div className="slide-show">
      <h1 className="slide-show__heading">
        {translations.client.main.ourCoaches[currentLanguage]}
      </h1>

      <div
        className={`slide-show__image-cont ${
          shouldAnimate ? "slide-show__image-animate" : ""
        }`}
      >
        <Link
          to={`/coaches/${coachesList[slideShowIndex]._id}`}
          className="slide-show__link"
        >
          <img
            className="slide-show__image"
            src={getAvatar(coachesList[slideShowIndex])}
            onError={moveToNextPicture}
          />
        </Link>
      </div>
    </div>
  );
};

export default SlideShow;
