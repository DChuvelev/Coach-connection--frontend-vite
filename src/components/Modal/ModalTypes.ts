import { ActiveModalsList } from "../AppTypes";

export interface Props {
  children: React.ReactNode;
  activeModal: ActiveModalsList;
  onClose: () => void;
}
