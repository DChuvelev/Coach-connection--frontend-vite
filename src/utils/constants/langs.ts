import ruFlag from "../../images/flags/ru.svg";
import enFlag from "../../images/flags/gb.svg";

/* eslint-disable no-unused-vars */
export enum LangChoice {
  En = "en",
  Ru = "ru",
}

export type TranslationsObject = {
  [key in LangChoice]: string | string[];
};

export type TranslationsObjectSegment = {
  [fieldName: string]: TranslationsObject;
};

export const appLangs: { id: LangChoice; name: string; flag: string }[] = [
  {
    id: LangChoice.Ru,
    name: "Русский",
    flag: ruFlag,
  },
  {
    id: LangChoice.En,
    name: "English",
    flag: enFlag,
  },
];
/* eslint-enable no-unused-vars */

// export const spokenLangs = ["English", "Русский", "French", "German"];
