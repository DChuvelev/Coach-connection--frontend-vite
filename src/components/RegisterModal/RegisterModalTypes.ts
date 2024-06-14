import { ActiveModalsList } from "../AppTypes";
import { FormInfo, FormCallbacks } from "../ModalWithForm/ModalWithFormTypes";
import { UserToRegister } from "../redux/slices/generalTypes";

export interface Props {
  formInfo: FormInfo;
  formCallbacks: FormCallbacks;
  activeModal: ActiveModalsList;
  onClose: () => void;
  isBusy: boolean;
}

export const registerFormDefaultData: UserToRegister = {
  role: "",
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  userpic: undefined,
};
