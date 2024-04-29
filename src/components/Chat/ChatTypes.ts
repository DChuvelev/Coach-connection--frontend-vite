import { Role } from "../redux/slices/generalTypes";

export interface chatUser {
  id: string;
  name: string;
  role: Role;
}

export interface Props {
  withUser: chatUser;
}
