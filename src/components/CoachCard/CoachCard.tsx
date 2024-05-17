import "./CoachCard.css";
import { Props } from "./CoachCardTypes";
import { dbApiRequest } from "../../utils/constants/requests";
import { Link } from "react-router-dom";
export const CoachCard: React.FC<Props> = ({ coach, handleCardClick }) => {
  return (
    <Link to={`/coaches/${coach._id}`}>
      <li className="coach-card" onClick={() => handleCardClick(coach)}>
        <div className="coach-card__heading">
          <h2 className="coach-card__title">{coach.name}</h2>
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
