import { PropsWithChildren } from "react";
import "./UpdateUserInfoForm.css";
import { Props } from "./UpdateUserInfoFormTypes";

export const UpdateUserInfoForm = ({
  children,
  isBusy,
  errorMessage,
  handleSubmit,
  btnTxtTypeBusy,
  btnTxt,
}: PropsWithChildren<Props>) => {
  return (
    <div className="update-user__form-container">
      <form className="update-user__form" onSubmit={handleSubmit}>
        {children}
        <button type="submit" className="update-user__submit-btn">
          {isBusy ? btnTxtTypeBusy : btnTxt}
        </button>
      </form>
      <div className="update-user__err-cont">
        {errorMessage && (
          <p className="update-user__error-message">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};
