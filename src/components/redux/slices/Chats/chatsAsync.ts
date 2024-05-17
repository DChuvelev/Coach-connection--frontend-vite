import { createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../../../../utils/api/ChatApi";
import { RootState } from "../../store";
import {
  addChatToChatList,
  addMessages,
  clearChat,
  triggerRefreshTik,
} from "./chatsSlice";
import { IChat } from "./chatsTypes";
import { removeChatFromCurrentUser } from "../App/appSlice";

export const getChatByIdThunk = createAsyncThunk(
  "chats/getChatById",
  async (chatId: string) => {
    let resp;
    try {
      resp = await chatApi.getChatById({
        chatId: chatId,
        token: localStorage.getItem("jwt") as string,
      });
      // console.log(resp);
    } catch (err) {
      return Promise.reject(err);
    }
    return resp;
  }
);

export const createChatThunk = createAsyncThunk(
  "chats/createChat",
  async (userId: string) => {
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
  "chats/refreshChat",
  async (
    {
      chatId,
      chatIndexProvided,
    }: { chatId: string; chatIndexProvided?: number },
    { getState, dispatch }
  ) => {
    const chatsList = (getState() as RootState).chats.chatsList;
    let chatIndex;
    // dispatch(setChatsStatus("waiting"));
    if (chatIndexProvided) {
      // if chatIndex is provided, that means that the chat is already loaded and Chat component knows it's index
      chatIndex = chatIndexProvided;
    } else {
      chatIndex = chatsList.findIndex(
        //here we search in our loaded chats. If during this session currentUser already visited this user's page - the chat shoud be there.
        //If no - the search should return -1.
        (chat) => chat._id === chatId
      );
    }

    let resp: IChat;
    try {
      resp = await chatApi.refreshChat({
        chatId: chatId,
        //it should be defined if the chat was found and there is at least one message in it.
        lastMessageId:
          //When refreshing we reload only the messages that were added after the last message that we alredy have.
          chatIndex !== -1 && chatsList[chatIndex].messages.length > 0
            ? chatsList[chatIndex].messages[
                chatsList[chatIndex].messages.length - 1
              ]._id
            : undefined,
        token: localStorage.getItem("jwt") as string,
      });
      // console.log(resp);

      if (chatIndex === -1) {
        //That means that currentUser never visited the page of another chat member, so we should create a chat
        dispatch(
          addChatToChatList({
            _id: resp._id,
            members: resp.members,
            messages: [],
          })
        );
        // console.log(chatId);
        chatIndex = (getState() as RootState).chats.chatsList.findIndex(
          //After creating a chat we find its index in chats array to return it.
          (chat) => chat._id === chatId
        );
        // console.log(chatIndex);
      }
      dispatch(addMessages({ chatIndex: chatIndex, messages: resp.messages })); //No we can add the new loaded messages to the array.

      dispatch(triggerRefreshTik());

      return chatIndex;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const addMessageThunk = createAsyncThunk(
  "chats/addMessage",
  async ({
    chatId,
    authorId,
    text,
  }: {
    chatId: string;
    authorId: string;
    text: string;
  }) => {
    let resp;
    try {
      resp = await chatApi.addMessage({
        chatId,
        authorId,
        text,
        token: localStorage.getItem("jwt") as string,
      });
      // console.log(resp);
    } catch (err) {
      return Promise.reject(err);
    }
    return resp;
  }
);

export const checkChatThunk = createAsyncThunk(
  "chats/checkChat",
  async ({ chatId, membersIds }: { chatId: string; membersIds: string[] }) => {
    let resp;
    try {
      resp = await chatApi.checkChat({
        chatId,
        membersIds,
        token: localStorage.getItem("jwt") as string,
      });
      // console.log(resp);
    } catch (err) {
      return Promise.reject(err);
    }
    return resp;
  }
);

export const removeChatThunk = createAsyncThunk(
  "chats/removeChat",
  async (
    { withUserId, checkIfEmpty }: { withUserId: string; checkIfEmpty: boolean },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const chatToDelete = state.chats.chatsList.find((chat) =>
      chat.members.some((member) => member._id === withUserId)
    );
    if (chatToDelete && (!checkIfEmpty || chatToDelete.messages.length === 0)) {
      const chatToDeleteId = chatToDelete._id;
      let resp;
      try {
        resp = await chatApi.removeChat({
          chatId: chatToDeleteId,
          token: localStorage.getItem("jwt") as string,
        });
        dispatch(removeChatFromCurrentUser(chatToDeleteId)); //remove the chat from user chats list not to make unnecessary user reload
        dispatch(clearChat(chatToDeleteId)); //in chats state we just clear this chat. It should become invisible
        //for any searches. Removing it totally can impact array indexing, so we don't do that. Anyway, as it's already removed
        //from backend db - it will disappear on next page reload.
        // console.log(resp);
      } catch (err) {
        return Promise.reject(err);
      }

      return resp;
    }
  }
);
