import React, { useState } from "react";
import "./MyChats.css";
import { Props } from "./MyChatsTypes";
import MyChatsList from "../MyChatsList/MyChatsList";
import { Chat } from "../Chat/Chat";

const MyChats: React.FC<Props> = () => {
  const [selectedChat, setSelectedChat] = useState<string>();

  const selectChatWith = (userId: string) => {
    setSelectedChat(userId);
    // console.log(userId);
  };
  return (
    <div className="my-chats">
      <div className="my-chats__chats">
        <MyChatsList
          selectChatWith={selectChatWith}
          selectedChatWithUserId={selectedChat}
        />
        {selectedChat !== "" && <Chat withUserId={selectedChat} />}
      </div>
    </div>
  );
};

export default MyChats;
