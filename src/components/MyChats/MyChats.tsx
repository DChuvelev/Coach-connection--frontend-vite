import React, { useEffect, useState } from "react";
import "./MyChats.css";
import { Props } from "./MyChatsTypes";
import MyChatsList from "../MyChatsList/MyChatsList";
import { Chat } from "../Chat/Chat";
import { setCurrentPage } from "../redux/slices/App/appSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import { translations } from "../../utils/constants/translations";

const MyChats: React.FC<Props> = () => {
  const [selectedChat, setSelectedChat] = useState<string>("");
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const dispatch = useDispatch();
  const selectChatWith = (userId: string) => {
    setSelectedChat(userId);
    // console.log(userId);
  };

  useEffect(() => {
    dispatch(setCurrentPage("my_chats"));
    return () => {
      dispatch(setCurrentPage(undefined));
    };
  });

  return (
    <div className="my-chats">
      <div className="my-chats__chats">
        <MyChatsList
          selectChatWith={selectChatWith}
          selectedChatWithUserId={selectedChat}
        />
        {selectedChat !== "" && <Chat withUserId={selectedChat} />}
        {selectedChat === "" && (
          <div className="my-chats__message">
            {currentUser.chats.length > 0
              ? translations.chats.common.selectChat[currentLanguage]
              : translations.chats.common.сhatListEmpty[currentLanguage]}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
