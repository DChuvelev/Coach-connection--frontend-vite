import React from "react";
import "./MyChatsList.css";
import { Props } from "./MyChatsListTypes";
import { useAppSelector } from "../redux/hooks";
import { IChatMember } from "../redux/slices/Chats/chatsTypes";
import { translations } from "../../utils/constants/translations";

const MyChatsList: React.FC<Props> = ({
  selectChatWith,
  selectedChatWithUserId,
}) => {
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const handleChatClick = (userId?: string) => {
    if (userId) selectChatWith(userId);
  };

  const getOtherChatMember = (chatMembers: IChatMember[] | undefined) => {
    if (chatMembers)
      return chatMembers.find((member) => member._id !== currentUser._id);
  };

  return (
    <div className="my-chats-list">
      <h3 className="my-chats-list__heading">
        {translations.chats.common.conversations[currentLanguage]}
      </h3>
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
                } ${
                  chat.members.findIndex(
                    (member) => member._id === selectedChatWithUserId
                  ) !== -1
                    ? "my-chats-list__button_type_selected-chat"
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
    </div>
  );
};

export default MyChatsList;
