import { Coach } from "../App/appTypes";
import { statusType } from "../generalTypes";
import { CoachFinder } from "../../../CoachSelector/CoachSelectorTypes";
export interface CoachInfo
  extends Omit<Coach, "password" | "status" | "email" | "role"> {}

export interface CoachesState {
  coachesList: Array<CoachInfo>;
  status: statusType;
  error: string | undefined;
  slideShowCounter: number;
  slideShowtimerId: number;
  coachFinderValues: CoachFinder;
  gptAnswer: GptSelectedCoach;
}

export const emptyCoachFinderFormValues: CoachFinder = {
  gender: [],
  languages: [],
  skills: [],
  sertification: [],
  paymentOptions: [],
};

export const gptAnswerInit = {
  coachId: "",
  text: "",
};

export const initialState: CoachesState = {
  coachesList: [],
  status: "normal",
  error: "",
  slideShowCounter: 0,
  slideShowtimerId: 0,
  coachFinderValues: emptyCoachFinderFormValues,
  gptAnswer: gptAnswerInit,
};

export interface GptSelectedCoach {
  coachId: string;
  text: string;
}
