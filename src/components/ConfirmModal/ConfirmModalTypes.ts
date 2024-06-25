import { ActiveModalsList } from "../AppTypes";

export interface Props {
  message: Array<string>;
  okBtnTxt: string;
  activeModal: ActiveModalsList;
  onClose: () => void;
  onOk: () => void;
}
