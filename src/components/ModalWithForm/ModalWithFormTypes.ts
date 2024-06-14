import { ActiveModalsList } from "../AppTypes";

export interface FormInfo {
  formType: string;
  name: string;
  btnTxt: string;
  redirBtnTxt: string;
  btnTxtTypeBusy: string;
}

export interface FormCallbacks {
  handleSubmit: () => void;
  handleRedir: () => void;
}

export const defaultFormInfo: FormInfo = {
  formType: "",
  name: "",
  btnTxt: "",
  redirBtnTxt: "",
  btnTxtTypeBusy: "",
};

export interface Props {
  formInfo: FormInfo;
  formCallbacks: FormCallbacks;
  activeModal: ActiveModalsList;
  onClose: () => void;
  isBusy: boolean;
  errorMessage: string | undefined;
}
