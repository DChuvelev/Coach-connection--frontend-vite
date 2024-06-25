import { CoachInfo } from "../components/redux/slices/Coaches/coachesTypes";
import { LangChoice, TranslationsObjectSegment } from "./constants/langs";
import { dbApiRequest } from "./constants/requests";
import { Translations } from "./constants/translations";

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

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getOptionsList = ({
  list,
  addProps,
  type,
  disabled,
  currentLanguage,
  labelClassName,
  textClassName,
}: {
  list: TranslationsObjectSegment;
  addProps: object;
  type: string;
  disabled: boolean;
  currentLanguage: LangChoice;
  labelClassName: string;
  textClassName: string;
}) => {
  const listAsArray = Object.keys(list)
    .filter((item) => item != "")
    .map((item) => {
      const currentKey = item as keyof typeof list;
      return {
        id: item,
        ...list[currentKey],
      };
    });

  const res = listAsArray.map((item) => {
    const itemWithTranslations = item as { id: string } & Translations;
    return (
      <div key={itemWithTranslations.id}>
        <label className={labelClassName}>
          <input
            type={type}
            {...addProps}
            value={itemWithTranslations.id}
            disabled={disabled}
          />
          <p className={textClassName}>
            {itemWithTranslations[currentLanguage]}
          </p>
        </label>
      </div>
    );
  });
  return <>{res}</>;
};
