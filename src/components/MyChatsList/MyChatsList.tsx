import React, { useEffect } from "react";
import "./MyChatsList.css";
import { Props } from "./MyChatsListTypes";
import { useAppSelector } from "../redux/hooks";
import { IChatMember } from "../redux/slices/Chats/chatsTypes";

const MyChatsList: React.FC<Props> = ({ selectChatWith }) => {
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const handleChatClick = (userId?: string) => {
    if (userId) selectChatWith(userId);
  };

  const getOtherChatMember = (chatMembers: IChatMember[] | undefined) => {
    if (chatMembers)
      return chatMembers.find((member) => member._id !== currentUser._id);
  };

  return (
    <fieldset className="my-chats-list">
      <legend>Select chat with</legend>
      <div className="my-chats-list__container">
        {currentUser.chats.length > 0 &&
          currentUser.chats.map((chat, idx) => {
            return (
              <button
                key={idx}
                className={`my-chats-list__button ${
                  currentUser.gotNewMessagesInChatIDs.includes(chat._id)
                    ? "my-chats-list__button_type_chat-with-new-messages"
                    : ""
                }`}
                type="button"
                onClick={() => {
                  handleChatClick(getOtherChatMember(chat.members)?._id);
                }}
              >
                {getOtherChatMember(chat.members)?.name}
              </button>
            );
          })}
      </div>
    </fieldset>
  );
};

export default MyChatsList;
