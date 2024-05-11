import { translations } from "../../../../utils/constants/translations";
import { Role, statusType } from "../generalTypes";

export type ChatErrorMessages = keyof typeof translations.chats.errorMessages;

export interface IMessage {
  _id?: string;
  text?: string;
  timestamp: string;
  authorId?: string;
}

export interface IChatMember {
  _id: string;
  role: Role;
  name: string;
}

export interface IChat {
  _id: string;
  messages: IMessage[];
  members: IChatMember[];
}

export const emptyChat: IChat = {
  _id: "",
  messages: [],
  members: [],
};

export interface chatsState {
  chatsList: Array<IChat>;
  chatsStatus: statusType;
  errorMessage: ChatErrorMessages | undefined;
  refreshTik: number;
  currentChatIndex: number;
}

export const initialChatsState: chatsState = {
  chatsList: [],
  chatsStatus: "starting",
  errorMessage: undefined,
  refreshTik: 0,
  currentChatIndex: -1,
};
