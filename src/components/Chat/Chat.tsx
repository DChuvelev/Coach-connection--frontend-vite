import React, { MutableRefObject, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Props } from "./ChatTypes";
import "./Chat.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addMessageThunk,
  checkChatThunk,
  createChatThunk,
  refreshChatThunk,
  removeChatThunk,
} from "../redux/slices/Chats/chatsAsync";
import { setAppStatus, setErrorMessage } from "../redux/slices/App/appSlice";
import {
  setChatsStatus,
  setCurrentChatIndex,
  triggerRefreshTik,
} from "../redux/slices/Chats/chatsSlice";
import { refreshCurrentUserThunk } from "../redux/slices/App/appAsync";
import { useRef } from "react";
import { translations } from "../../utils/constants/translations";
import Preloader from "../Preloader/Preloader";

export const Chat: React.FC<Props> = ({ withUserId }) => {
  const [messageText, setMessageText] = useState("");
  // const [currentChatIndex, setcurrentChatIndex] = useState(-1);
  const currentChatIndex = useAppSelector(
    (state) => state.chats.currentChatIndex
  );
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const chatsList = useAppSelector((state) => state.chats.chatsList);
  const dispatch = useAppDispatch();
  const chatsStatus = useAppSelector((state) => state.chats.chatsStatus);
  const refreshTik = useAppSelector((state) => state.chats.refreshTik);
  const lastMessageRef: MutableRefObject<HTMLParagraphElement | null> =
    useRef(null);
  const inputAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // console.log(withUserId);
    const loadChat = async () => {
      if (withUserId) {
        let currentChatId = currentUser.chats.find(
          //check if there was already a chat between users. For now we got only chats
          //between two people.

          (chat) => {
            return (
              chat.members.length === 2 &&
              chat.members.findIndex((member) => member._id === withUserId) !==
                -1
            );
          }
        )?._id;

        let result: number = 0;

        try {
          if (!currentChatId) {
            console.log("Creating chat");
            //if there was no chat before - create it on backend and reload user
            currentChatId = await dispatch(
              createChatThunk(withUserId)
            ).unwrap();
            await dispatch(refreshCurrentUserThunk()).unwrap();
          }

          if (currentChatId) {
            // to this moment we should anyway have chat id, but typescript wants this check
            await dispatch(
              checkChatThunk({
                chatId: currentChatId,
                membersIds: [withUserId, currentUser._id],
              })
            );
            result = await dispatch(
              //now we need to load the chat info into chats state.
              refreshChatThunk({
                chatId: currentChatId,
              })
            ).unwrap();
            //and refresh current user - so we don't have this chat in new chats list
            await dispatch(refreshCurrentUserThunk()).unwrap();
          }

          dispatch(setCurrentChatIndex(result));
          setTimeout(() => {
            dispatch(setChatsStatus("normal"));
          }, 1); // don't know why, but redux needs some time to update all the state parts. So I give it to him

          setTimeout(() => {
            dispatch(triggerRefreshTik());
          }, 5); //needed to scroll messages to the bottom of the list
        } catch (err) {
          console.error(err);
          dispatch(setErrorMessage("serverNotResponding"));
          dispatch(setAppStatus("error"));
        }
      }
    };
    loadChat();
    return () => {
      const unMount = async () => {
        try {
          if (withUserId)
            await dispatch(
              removeChatThunk({ withUserId, checkIfEmpty: true })
            ).unwrap();
        } catch (err) {
          console.error(err);
          dispatch(setErrorMessage("serverNotResponding"));
          dispatch(setAppStatus("error"));
        }
      };
      unMount();
      dispatch(setChatsStatus("waiting"));
      dispatch(setCurrentChatIndex(-1));
    };
  }, [withUserId]);

  useEffect(() => {
    if (chatsStatus === "normal") {
      // console.log(refreshTik);
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [refreshTik]);

  useEffect(() => {
    const receiveNewMessages = async () => {
      if (chatsStatus === "normal" && currentUser.triggeredChatId) {
        if (currentUser.triggeredChatId === chatsList[currentChatIndex]._id) {
          await dispatch(
            refreshChatThunk({
              chatId: chatsList[currentChatIndex]._id,
              chatIndexProvided: currentChatIndex,
            })
          );
        }
      }
    };
    receiveNewMessages();
  }, [currentUser.gotNewMessagesTik]);

  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    evt
  ) => {
    setMessageText(evt.target.value);
    if (inputAreaRef.current?.scrollHeight) {
      const style = window.getComputedStyle(inputAreaRef.current);
      const computedMaxHeight = parseInt(style.maxHeight, 10);
      const computedHeight = parseInt(style.height, 10);
      const scrollHeight = inputAreaRef.current.scrollHeight;

      // console.log(
      //   `Computed height: ${computedHeight}, scroll: ${scrollHeight}`
      // );
      if (scrollHeight > computedMaxHeight) {
        inputAreaRef.current.style.overflow = `auto`;
        inputAreaRef.current.style.height = `${computedMaxHeight}px`;
      } else {
        inputAreaRef.current.style.overflow = `hidden`;
      }
      if (inputAreaRef.current.style.overflow === `hidden`) {
        if (scrollHeight > computedHeight) {
          inputAreaRef.current.style.height = `${inputAreaRef.current.scrollHeight}px`;
        } else if (scrollHeight < computedHeight) {
          inputAreaRef.current.style.height = `auto`;
          inputAreaRef.current.style.height = `${inputAreaRef.current.scrollHeight}px`;
        }
      }
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    // console.log(messageText);
    const sendMessage = async () => {
      try {
        if (messageText.length > 0)
          await dispatch(
            addMessageThunk({
              chatId: chatsList[currentChatIndex]._id,
              authorId: currentUser._id,
              text: messageText,
            })
          ).unwrap();
        setMessageText("");
      } catch {
        dispatch(setErrorMessage("serverNotResponding"));
        dispatch(setAppStatus("error"));
      }
    };
    sendMessage();
  };

  const timeDivider = (
    messageDate: string,
    prevMessageDate: string,
    minNoDivTime: number
  ): JSX.Element | null => {
    // console.log(prevMessageDate);
    const messageDateTime = DateTime.fromISO(messageDate);
    const prevMessageDateTime = DateTime.fromISO(prevMessageDate);

    const timeDiff = messageDateTime.diff(prevMessageDateTime, "seconds");

    if (timeDiff.seconds < minNoDivTime) {
      return null;
    }

    let className = "chat__message-divider"; // Base class

    if (!messageDateTime.hasSame(prevMessageDateTime, "year")) {
      className += " chat__message-divider_type_year";
    } else if (!messageDateTime.hasSame(prevMessageDateTime, "month")) {
      className += " chat__message-divider_type_month";
    } else if (!messageDateTime.hasSame(prevMessageDateTime, "day")) {
      className += " chat__message-divider_type_day";
    }

    const components = [];
    if (!messageDateTime.hasSame(prevMessageDateTime, "year")) {
      components.push(messageDateTime.toFormat("dd MMM yyyy")); // Include day, month, and year
    } else if (!messageDateTime.hasSame(prevMessageDateTime, "day")) {
      components.push(messageDateTime.toFormat("dd MMM")); // Add day and month
    }
    components.push(messageDateTime.toFormat("HH:mm")); // Add time

    return <div className={className}>{components.join(", ")}</div>;
  };
  return (
    <>
      {chatsStatus !== "normal" && <Preloader />}
      {chatsStatus === "normal" && (
        <div className="chat">
          <div className="chat__window">
            {chatsList[currentChatIndex].messages?.map(
              (message, index, arr) => {
                const isLastMessage =
                  index === chatsList[currentChatIndex].messages.length - 1;
                return (
                  <div className="chat__chat-item" key={message._id}>
                    {timeDivider(
                      message.timestamp,
                      arr[index - 1]?.timestamp,
                      10
                    )}
                    <div
                      className={`chat__message ${
                        currentUser._id === message.authorId
                          ? "chat__message_type_current-user"
                          : "chat__message_type_other-users"
                      }`}
                    >
                      <p
                        className="chat__message-txt"
                        {...(isLastMessage && { ref: lastMessageRef })}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <form className="chat__message-form" onSubmit={handleSubmit}>
            <textarea
              className="chat__input"
              placeholder={
                translations.chats.common.enterMessage[currentLanguage]
              }
              onChange={handleInputChange}
              value={messageText}
              ref={inputAreaRef}
            ></textarea>
            <div className="chat__buttons-cont">
              {/* Here we will put smiles, attachments, etc... */}
              <button type="submit" className="chat__send-btn">
                {translations.chats.common.sendMessage[currentLanguage]}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
