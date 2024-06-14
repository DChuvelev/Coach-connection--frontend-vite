import { CoachInfo } from "../redux/slices/Coaches/coachesTypes";

/* eslint-disable no-unused-vars */
export interface Props {
  coach: CoachInfo;
  handleCardClick: (coach: CoachInfo) => void;
}
/* eslint-enable no-unused-vars */
