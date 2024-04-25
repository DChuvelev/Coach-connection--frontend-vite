import { gptApiRequest } from "../constants/requests";
import { GptAnswer, GptApiConstructorProps } from "./GptApiTypes";

export default class GptApi {
  _baseUrl: string;
  _headers: HeadersInit;
  constructor({ baseUrl, headers }: GptApiConstructorProps) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  chooseMeACoach = async ({
    messages,
    token,
  }: {
    messages: Array<Record<string, string>>;
    token: string;
  }) => {
    let resp;
    try {
      resp = await fetch(`${this._baseUrl}/askGpt/chooseMeACoach`, {
        headers: { ...this._headers, authorization: `Bearer ${token}` },
        method: "POST",
        body: JSON.stringify(messages),
      });
      if (resp.ok) {
        const respFull: GptAnswer = await resp.json();
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
