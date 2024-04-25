import { useAppSelector } from "../components/redux/hooks";
import { CurrentUser } from "../components/redux/slices/App/appTypes";
import { CoachInfo } from "../components/redux/slices/Coaches/coachesTypes";
import { dbApiRequest } from "./constants/requests";
import { Translations, translations } from "./constants/translations";
import { LangChoice } from "./models";

export const getAvatar = (user: CoachInfo) => {
  if (user?.avatar) {
    return `${dbApiRequest.baseUrl}/avatars/${user.avatar}`;
  } else return "";
};

export const calculateAge = (birthday: string) => {
  const today = new Date();
  const birthdayDate = new Date(birthday);
  let age = today.getFullYear() - birthdayDate.getFullYear();

  if (
    today.getMonth() < birthdayDate.getMonth() ||
    (today.getMonth() === birthdayDate.getMonth() &&
      today.getDate() < birthdayDate.getDate())
  ) {
    age--;
  }
  if (Number.isNaN(age)) return "";
  return age.toString();
};

type TranslationsSet = Record<string, Translations>;
type KeyNames = (keyof TranslationsSet)[];

export const formTranslatedString = (
  translObj: TranslationsSet,
  keysArray: KeyNames,
  currentLanguage: LangChoice
) => {
  let result = "";
  keysArray.forEach((key) => {
    if (key in translObj) {
      result += `${translObj[key][currentLanguage]}, `;
    }
  });
  if (result.endsWith(", ")) {
    return result.slice(0, -2);
  }
  return result;
};
