import { error } from "console";
import { Coach } from "../App/appTypes";
import { statusType } from "../generalTypes";
import { devNull } from "os";
import { CoachFinder } from "../../../CoachSelector/CoachSelectorTypes";
import { GptAnswer } from "../../../../utils/api/GptApiTypes";
export interface CoachInfo
  extends Omit<Coach, "password" | "status" | "email" | "role"> {}

export interface CoachesState {
  coachesList: Array<CoachInfo>;
  status: statusType;
  error: string | undefined;
  slideShowCounter: number;
  slideShowtimerId: number;
  coachFinderValues: CoachFinder;
  gptAnswer: GptAnswer;
}

export const emptyCoachFinderFormValues: CoachFinder = {
  gender: [],
  languages: [],
  skills: [],
  sertification: [],
  paymentOptions: [],
};

export const initialState: CoachesState = {
  coachesList: [],
  status: "normal",
  error: "",
  slideShowCounter: 0,
  slideShowtimerId: 0,
  coachFinderValues: emptyCoachFinderFormValues,
  gptAnswer: [],
};
