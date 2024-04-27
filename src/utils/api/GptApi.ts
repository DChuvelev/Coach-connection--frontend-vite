import { gptApiRequest } from "../constants/requests";
import { ChosenCoachGptAnswer, GptApiConstructorProps } from "./GptApiTypes";

export default class GptApi {
  _baseUrl: string;
  _headers: HeadersInit;
  constructor({ baseUrl, headers }: GptApiConstructorProps) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  chooseMeACoach = async ({
    message,
    token,
  }: {
    message: string;
    token: string;
  }) => {
    let resp;
    try {
      resp = await fetch(`${this._baseUrl}/askGpt/chooseMeACoach`, {
        headers: { ...this._headers, authorization: `Bearer ${token}` },
        method: "POST",
        body: JSON.stringify({ message: message }),
      });
      if (resp.ok) {
        const respFull: ChosenCoachGptAnswer = await resp.json();
        console.log(respFull);
        return respFull;
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      return Promise.reject("Server error");
    }
  };
}

export const gptApi = new GptApi(gptApiRequest);
