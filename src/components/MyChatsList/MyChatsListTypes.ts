import { CurrentUser } from "../redux/slices/App/appTypes";

export interface Props {
  selectChatWith: (userId: string) => void;
  selectedChatWithUserId: string | undefined;
}
