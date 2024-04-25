import { Gender } from "../redux/slices/App/appTypes";

export interface CoachFinder {
  gender: Array<string>;
  languages: Array<string>;
  skills: Array<string>;
  sertification: Array<string>;
  paymentOptions: Array<string>;
}
