import React from "react";
import "./UpdateEmail.css";
import { Props, IEmailFormInputs } from "./UpdateEmailTypes";
import { translations } from "../../utils/constants/translations";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { UpdateUserInfoForm } from "../UpdateUserInfoForm/UpdateUserInfoForm";
import { updateUserInfoThunk } from "../redux/slices/App/appAsync";
import { resetAuthError } from "../redux/slices/App/appSlice";

export const UpdateEmail: React.FC<Props> = () => {
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const authStatus = useAppSelector((state) => state.app.authStatus);
  const backendErrorMessage = useAppSelector((state) => state.app.authMessage);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: { email: currentUser.email },
  });

  const handleFocus = () => {
    if (backendErrorMessage) {
      dispatch(resetAuthError());
    }
  };

  const dispatch = useAppDispatch();

  const handleSaveNewEmail: SubmitHandler<IEmailFormInputs> = (data) => {
    dispatch(updateUserInfoThunk({ ...data, updateType: "emailUpdate" }));
  };

  return (
    <UpdateUserInfoForm
      isBusy={authStatus === "loading"}
      errorMessage={backendErrorMessage}
      handleSubmit={handleSubmit(handleSaveNewEmail)}
      btnTxtTypeBusy={translations.common.words.saving[currentLanguage]}
      btnTxt={translations.update.tabs.email.saveEmail[currentLanguage]}
    >
      <div className="update-tab__input-field">
        <input
          type="text"
          className="update-tab__input"
          id="user-email"
          onFocus={handleFocus}
          placeholder={translations.common.words.email[currentLanguage]}
          {...register("email", {
            required:
              translations.common.errors.required_field[currentLanguage],
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message:
                translations.common.errors.field_not_valid[currentLanguage],
            },
          })}
        />
        <div className="update-tab__error-container">
          {errors.email && (
            <p className="update-tab__error-message">{errors.email.message}</p>
          )}
        </div>
      </div>
    </UpdateUserInfoForm>
  );
};
