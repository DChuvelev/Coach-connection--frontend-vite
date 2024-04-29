import { createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../../../../utils/api/ChatApi";
import { RootState } from "../../store";
import { addChatToChatList, addMessages } from "./chatsSlice";
import { IChat } from "./chatsTypes";

export const getChatByIdThunk = createAsyncThunk(
  "app/getChatById",
  async (chatId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    let resp;
    try {
      resp = await chatApi.getChatById({
        chatId: chatId,
        token: localStorage.getItem("jwt") as string,
      });
      console.log(resp);
    } catch (err) {
      return Promise.reject(err);
    }
    return resp;
  }
);

export const createChatThunk = createAsyncThunk(
  "app/createChat",
  async (userId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    let resp;
    try {
      resp = await chatApi.createChat({
        userId: userId,
        token: localStorage.getItem("jwt") as string,
      });
      return resp;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const refreshChatThunk = createAsyncThunk(
  "app/refreshChat",
  async ({ chatId }: { chatId: string }, { getState, dispatch }) => {
    const chatsList = (getState() as RootState).chats.chatsList;
    let chatIndex = chatsList.findIndex(
      //serching if the chat is already in chats state
      (chat) => chat._id === chatId
    );

    let resp: IChat;
    try {
      resp = await chatApi.refreshChat({
        chatId: chatId,
        lastMessageId:
          chatIndex !== -1 && chatsList[chatIndex].messages.length > 0
            ? chatsList[chatIndex].messages[
                chatsList[chatIndex].messages.length - 1
              ]._id
            : undefined,
        token: localStorage.getItem("jwt") as string,
      });
      console.log(resp);

      if (chatIndex === -1) {
        dispatch(
          addChatToChatList({
            _id: resp._id,
            members: resp.members,
            messages: [],
          })
        );
        // console.log(chatId);
        chatIndex = (getState() as RootState).chats.chatsList.findIndex(
          (chat) => chat._id === chatId
        );
        console.log(chatIndex);
      }
      dispatch(addMessages({ chatIndex: chatIndex, messages: resp.messages }));
      return chatIndex;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const addMessageThunk = createAsyncThunk(
  "app/addMessage",
  async (
    { chatId, author, text }: { chatId: string; author: string; text: string },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    let resp;
    try {
      resp = await chatApi.addMessage({
        chatId,
        author,
        text,
        token: localStorage.getItem("jwt") as string,
      });
      console.log(resp);
    } catch (err) {
      return Promise.reject(err);
    }
    return resp;
  }
);
