import { CoachInfo } from "../redux/slices/Coaches/coachesTypes";

export interface Props {
  coach: CoachInfo;
  handleCardClick: (coach: CoachInfo) => void;
}
