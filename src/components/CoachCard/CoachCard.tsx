import React, { useContext, useMemo } from "react";
import "./CoachCard.css";
import { Props } from "./CoachCardTypes";
import { useAppSelector } from "../redux/hooks";
import { dbApiRequest } from "../../utils/constants/requests";
import { Link } from "react-router-dom";
// import likeButton from '../../images/like-button.png';
// import likeButtonRed from '../../images/like-button-red.png';
export const CoachCard: React.FC<Props> = ({ coach, handleCardClick }) => {
  const currentUser = useAppSelector((state) => state.app.currentUser);
  // const isLikedByCurrentUser = useMemo(() => item.likes.some(user => user === currentUser._id), [currentUser._id, item.likes])
  // const likeCard = (evt) => {
  //     if (isLikedByCurrentUser) {
  //         handleDislike(evt, item);
  //     } else {
  //         handleLike(evt, item);
  //     }
  // }
  return (
    <Link to={`/coaches/${coach._id}`}>
      <li className="coach-card" onClick={() => handleCardClick(coach)}>
        <div className="coach-card__heading">
          <h2 className="coach-card__title">{coach.name}</h2>
          {/* {currentUser._id && (
          <img
            className="coach-card__heart"
            src={isLikedByCurrentUser ? likeButtonRed : likeButton}
            onClick={likeCard}
            alt="Like"
          />
        )}
        {!currentUser._id && <p className="coach-card__text">Likes:</p>}
        <p className="coach-card__number-of-likes">{item.likes.length}</p> */}
        </div>
        <img
          className="coach-card__image"
          src={dbApiRequest.baseUrl + "/avatars/" + coach.avatar}
          alt={coach.name}
        />
      </li>
    </Link>
  );
};
