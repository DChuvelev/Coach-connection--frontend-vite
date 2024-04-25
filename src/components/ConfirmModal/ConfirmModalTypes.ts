export interface Props {
  message: Array<string>;
  okBtnTxt: string;
  activeModal: string;
  onClose: () => void;
  onOk: () => void;
}
