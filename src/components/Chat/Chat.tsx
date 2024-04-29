import React, { useEffect, useState } from "react";
import { Props } from "./ChatTypes";
import "./Chat.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addMessageThunk,
  createChatThunk,
  refreshChatThunk,
} from "../redux/slices/Chats/chatsAsync";
import { setAppStatus, setErrorMessage } from "../redux/slices/App/appSlice";
import { setChatsStatus } from "../redux/slices/Chats/chatsSlice";
import { refreshCurrentUserThunk } from "../redux/slices/App/appAsync";
import { IChat } from "../redux/slices/Chats/chatsTypes";

export const Chat: React.FC<Props> = ({ withUser }) => {
  const [messageText, setMessageText] = useState("");
  const [chatIdx, setChatIdx] = useState(0);
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const chatList = useAppSelector((state) => state.chats.chatsList);
  const dispatch = useAppDispatch();
  const chatsStatus = useAppSelector((state) => state.chats.chatsStatus);

  useEffect(() => {
    const loadChat = async () => {
      dispatch(setChatsStatus("waiting"));
      let currentChatId = currentUser.chats.find(
        //check if there was already a chat between users
        (chat) =>
          chat.members.length === 1 && chat.members[0].memberId === withUser.id
      )?.chatId;

      let result: number = 0;

      try {
        if (!currentChatId) {
          //if there was no chat before - create it on backend and reload user
          currentChatId = await dispatch(createChatThunk(withUser.id)).unwrap();
          await dispatch(refreshCurrentUserThunk()).unwrap();
        }

        if (currentChatId) {
          // to this moment we should anyway have chat id, but typescript wants this check
          result = await dispatch(
            //now we need to load the chat info into chats state.
            refreshChatThunk({
              chatId: currentChatId,
            })
          ).unwrap();
        }

        dispatch(setChatsStatus("normal"));
        setChatIdx(result);
      } catch (err) {
        dispatch(setErrorMessage("serverNotResponding"));
        dispatch(setAppStatus("error"));
      }
    };
    loadChat();
  }, []);

  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    evt
  ) => {
    setMessageText(evt.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    console.log(messageText);
    const sendMessageAndUpdateChat = async () => {
      try {
        await dispatch(
          addMessageThunk({
            chatId: chatList[chatIdx]._id,
            author: currentUser._id,
            text: messageText,
          })
        ).unwrap();
        console.log(chatIdx);
        await dispatch(
          refreshChatThunk({
            chatId: chatList[chatIdx]._id,
          })
        );
        setMessageText("");
      } catch {
        dispatch(setErrorMessage("serverNotResponding"));
        dispatch(setAppStatus("error"));
      }
    };
    sendMessageAndUpdateChat();
  };
  return (
    <>
      {chatsStatus === "normal" && (
        <div className="chat">
          <div className="chat__window"></div>
          <form className="chat__message-form" onSubmit={handleSubmit}>
            <textarea
              className="chat__input"
              placeholder="Input your message"
              onChange={handleInputChange}
              value={messageText}
            ></textarea>
            <button type="submit" className="chat__submit-btn">
              Send message
            </button>
          </form>
        </div>
      )}
    </>
  );
};
