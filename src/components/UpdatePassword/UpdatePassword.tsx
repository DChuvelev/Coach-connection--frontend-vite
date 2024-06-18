import React from "react";
import "./UpdatePassword.css";
import { Props, IPasswordFormInputs } from "./UpdatePasswordTypes";
import { translations } from "../../utils/constants/translations";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "../../utils/constants/commonValues";
import { UpdateUserInfoForm } from "../UpdateUserInfoForm/UpdateUserInfoForm";
import { updateUserInfoThunk } from "../redux/slices/App/appAsync";
import { resetAuthError } from "../redux/slices/App/appSlice";

export const UpdatePassword: React.FC<Props> = () => {
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const backendErrorMessage = useAppSelector((state) => state.app.authMessage);
  const authStatus = useAppSelector((state) => state.app.authStatus);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPasswordFormInputs>({});

  const handleFocus = () => {
    if (backendErrorMessage) {
      dispatch(resetAuthError());
    }
  };

  const handleSaveNewPassword: SubmitHandler<IPasswordFormInputs> = (data) => {
    dispatch(updateUserInfoThunk({ ...data, updateType: "passwordUpdate" }));
  };
  return (
    <UpdateUserInfoForm
      isBusy={authStatus === "loading"}
      errorMessage={backendErrorMessage}
      handleSubmit={handleSubmit(handleSaveNewPassword)}
      btnTxtTypeBusy={translations.common.words.saving[currentLanguage]}
      btnTxt={translations.update.tabs.password.savePassword[currentLanguage]}
    >
      <div className="update-tab__input-field">
        <input
          type="password"
          className="update-tab__input"
          id="old-user-password"
          onFocus={handleFocus}
          placeholder={
            translations.update.tabs.password.oldPassword[currentLanguage]
          }
          {...register("oldPassword", {
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message:
                translations.common.errors.password_too_short[currentLanguage],
            },
            maxLength: {
              value: MAX_PASSWORD_LENGTH,
              message:
                translations.common.errors.password_too_long[currentLanguage],
            },
            required:
              translations.common.errors.required_field[currentLanguage],
          })}
        />
        <div className="update-tab__error-container">
          {errors.oldPassword && (
            <p className="update-tab__error-message">
              {errors.oldPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="update-tab__input-field">
        <input
          type="password"
          className="update-tab__input"
          id="user-password"
          placeholder={
            translations.update.tabs.password.newPassword[currentLanguage]
          }
          {...register("password", {
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message:
                translations.common.errors.password_too_short[currentLanguage],
            },
            maxLength: {
              value: MAX_PASSWORD_LENGTH,
              message:
                translations.common.errors.password_too_long[currentLanguage],
            },
            required:
              translations.common.errors.required_field[currentLanguage],
          })}
        />
        <div className="update-tab__error-container">
          {errors.password && (
            <p className="update-tab__error-message">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="update-tab__input-field">
        <input
          type="password"
          className="update-tab__input"
          id="confirm-password"
          placeholder={
            translations.update.tabs.password.confirmNewPassword[
              currentLanguage
            ]
          }
          {...register("confirmPassword", {
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message:
                translations.common.errors.password_too_short[currentLanguage],
            },
            maxLength: {
              value: MAX_PASSWORD_LENGTH,
              message:
                translations.common.errors.password_too_long[currentLanguage],
            },
            required:
              translations.common.errors.required_field[currentLanguage],
            validate: {
              passwordsMatch: (val, formVals) =>
                val === formVals.password ||
                translations.common.errors.passwords_should_match[
                  currentLanguage
                ],
            },
          })}
        />
        <div className="update-tab__error-container">
          {errors.confirmPassword && (
            <p className="update-tab__error-message">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
    </UpdateUserInfoForm>
  );
};
