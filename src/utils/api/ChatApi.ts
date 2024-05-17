import { dbApiRequest } from "../constants/requests";
import { DbApiConstructorProps } from "./DbApiTypes";

export default class ChatApi {
  _baseUrl: string;
  _headers: HeadersInit;
  constructor({ baseUrl, headers }: DbApiConstructorProps) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    // console.log('DB constructor');
  }

  _request(url: string, reqObj: RequestInit, errMsg: string) {
    return fetch(url, reqObj).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((err) => {
          return Promise.reject(
            `${errMsg} ${err.message} ${
              err.validation ? err.validation.body.message : ""
            }`
          );
        });
      }
    });
  }

  getChatById({ token, chatId }: { token: string; chatId: string }) {
    return this._request(
      `${this._baseUrl}/chats/${chatId}`,
      {
        headers: { ...this._headers, authorization: `Bearer ${token}` },
        method: "GET",
      },
      "Error:"
    );
  }

  createChat({ token, userId }: { token: string; userId: string }) {
    return this._request(
      `${this._baseUrl}/chats/create/${userId}`,
      {
        headers: { ...this._headers, authorization: `Bearer ${token}` },
        method: "GET",
      },
      "Error:"
    );
  }

  checkChat({
    token,
    chatId,
    membersIds,
  }: {
    token: string;
    chatId: string;
    membersIds: string[];
  }) {
    return this._request(
      `${this._baseUrl}/chats/check/${chatId}`,
      {
        headers: { ...this._headers, authorization: `Bearer ${token}` },
        body: JSON.stringify({ members: membersIds }),
        method: "PATCH",
      },
      "Error:"
    );
  }

  removeChat({ token, chatId }: { token: string; chatId: string }) {
    return this._request(
      `${this._baseUrl}/chats/${chatId}`,
      {
        headers: { ...this._headers, authorization: `Bearer ${token}` },
        method: "DELETE",
      },
      "Error:"
    );
  }

  refreshChat({
    token,
    chatId,
    lastMessageId,
  }: {
    token: string;
    chatId: string;
    lastMessageId?: string;
  }) {
    return this._request(
      `${this._baseUrl}/chats/refresh/${chatId}/${lastMessageId}`,
      {
        headers: { ...this._headers, authorization: `Bearer ${token}` },
        method: "GET",
      },
      "Error:"
    );
  }

  addMessage({
    token,
    chatId,
    authorId,
    text,
  }: {
    token: string;
    chatId: string;
    authorId: string;
    text: string;
  }) {
    return this._request(
      `${this._baseUrl}/chats/addMessage`,
      {
        headers: { ...this._headers, authorization: `Bearer ${token}` },
        body: JSON.stringify({ chatId, authorId, text }),
        method: "POST",
      },
      "Error:"
    );
  }
}

export const chatApi = new ChatApi(dbApiRequest);
