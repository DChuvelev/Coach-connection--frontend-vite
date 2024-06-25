import React, { SyntheticEvent, useEffect, useState } from "react";
import "./SlideShow.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAvatar } from "../../utils/functions";
import {
  removeSlideShowCounter,
  startSlideShowCounter,
} from "../redux/slices/Coaches/coachesAsync";
import { incCoachesSlideShowCounter } from "../redux/slices/Coaches/coachesSlice";
import { useNavigate } from "react-router-dom";
import { translations } from "../../utils/constants/translations";
import { Props } from "./SlideShowTypes";
import Preloader from "../Preloader/Preloader";

const SlideShow: React.FC<Props> = ({ redirectToLogin }) => {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const looggedIn = useAppSelector((state) => state.app.loggedIn);
  const coachesList = useAppSelector((state) => state.coaches.coachesList);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const [currentImage, setCurrentImage] = useState<
    HTMLImageElement | undefined
  >();
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
    if (coachesList && coachesList.length > 0) {
      if (coachesList[slideShowIndex]._id === currentUser._id) {
        moveToNextPicture();
      } else {
        const img = new Image();
        img.src = getAvatar(coachesList[slideShowIndex]);
        img.onerror = moveToNextPicture;
        img.onload = () => {
          setCurrentImage(img);
          setShouldAnimate(false);
          setTimeout(() => {
            setShouldAnimate(true);
          }, 100);
        };
      }
    }
  }, [slideShowIndex]);

  useEffect(() => {
    if (coachesList && coachesList.length > 0 && currentImage === undefined) {
      moveToNextPicture();
      //that's for the startup not to wait for slideShowCounter to show first image when everything is already loaded
    }
  }, [coachesList]);

  const handlePhotoClick: React.EventHandler<SyntheticEvent> = () => {
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
          {currentImage === undefined && <Preloader />}
          {currentImage !== undefined && (
            <div
              className={`slide-show__image-cont ${
                currentUser.role === "client"
                  ? "slide-show__image-cont_type_for-client"
                  : ""
              } ${shouldAnimate ? "slide-show__image-animate" : ""}`}
              onClick={
                currentUser.role === "client" ? handlePhotoClick : () => {}
              }
            >
              <img
                className="slide-show__image"
                src={currentImage?.src}
                alt="Coach photo"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SlideShow;
