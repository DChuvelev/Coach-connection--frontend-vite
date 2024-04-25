import { FormInfo, FormCallbacks } from "../ModalWithForm/ModalWithFormTypes";
import { LoginFormData } from "../redux/slices/generalTypes";

export interface Props {
  formInfo: FormInfo;
  formCallbacks: FormCallbacks;
  activeModal: string;
  onClose: () => void;
  isBusy: boolean;
}

export const loginFormDefaultData: LoginFormData = {
  role: "",
  email: "",
  password: "",
};
