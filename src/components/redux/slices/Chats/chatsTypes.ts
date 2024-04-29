import { translations } from "../../../../utils/constants/translations";
import { Role, statusType } from "../generalTypes";

export type ChatErrorMessages = keyof typeof translations.chats.errorMessages;

export interface IMessage {
  _id: string;
  text: string;
  date: string;
  authorId: string;
}

export interface IChatMember {
  memberId: string;
  role: Role;
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
}

export const initialChatsState: chatsState = {
  chatsList: [],
  chatsStatus: "starting",
  errorMessage: undefined,
};
