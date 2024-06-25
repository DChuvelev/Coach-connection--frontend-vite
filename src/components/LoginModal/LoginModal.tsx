import React, { useEffect } from "react";
import "./LoginModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "react-hook-form";
import { translations } from "../../utils/constants/translations";
import {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from "../../utils/constants/commonValues";
import { Props } from "./LoginModalTypes";
import { useAppSelector } from "../redux/hooks";
import { useAppDispatch } from "../redux/hooks";
import {
  setLoginFormValues,
  setRegisterFormValues,
  resetAuthError,
} from "../redux/slices/App/appSlice";
import { LoginFormData } from "../redux/slices/generalTypes";

export const LoginModal: React.FC<Props> = ({
  formInfo,
  formCallbacks,
  activeModal,
  onClose,
  isBusy,
}) => {
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const loginFormValues = useAppSelector((state) => state.app.loginFormValues);
  const registerFormValues = useAppSelector(
    (state) => state.app.registerFormValues
  );
  const backendErrorMessage = useAppSelector((state) => state.app.authMessage);
  const dispatch = useAppDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: loginFormValues,
  });

  const handleSubmitLogin = () => {
    dispatch(setLoginFormValues(formValues));
    formCallbacks.handleSubmit();
  };

  const handleRedir = () => {
    dispatch(setLoginFormValues(formValues));
    dispatch(
      setRegisterFormValues({
        ...registerFormValues,
        email: formValues.email,
        password: formValues.password,
      })
    );
    formCallbacks.handleRedir();
  };

  const formValues = watch();
  useEffect(() => {
    if (backendErrorMessage) dispatch(resetAuthError());
  }, [formValues.email, formValues.password, formValues.role]);

  return (
    <div className="login">
      <ModalWithForm
        formInfo={formInfo}
        formCallbacks={{
          handleRedir,
          handleSubmit: handleSubmit(handleSubmitLogin),
        }}
        activeModal={activeModal}
        onClose={onClose}
        isBusy={isBusy}
        errorMessage={backendErrorMessage}
      >
        <fieldset className="login__input-fieldset">
          <div className="login__input-field">
            <div className="login__toggle-switch">
              <label className="login__switch-btn-container">
                <input
                  type="radio"
                  value="coach"
                  {...register("role", {
                    required: translations.login.role.error[currentLanguage],
                  })}
                />
                <span className="login__switch-btn">
                  {translations.login.role.coach[currentLanguage]}
                </span>
              </label>
              <label className="login__switch-btn-container">
                <input
                  type="radio"
                  value="client"
                  {...register("role", {
                    required: translations.login.role.error[currentLanguage],
                  })}
                />
                <span className="login__switch-btn">
                  {translations.login.role.client[currentLanguage]}
                </span>
              </label>
            </div>
            {errors.role && (
              <p className="login__error-message">{errors.role.message}</p>
            )}
          </div>
          <div className="login__input-field">
            <input
              className="login__input"
              type="text"
              id="user-email"
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
            {errors.email && (
              <p className="login__error-message">{errors.email.message}</p>
            )}
          </div>
          <div className="login__input-field">
            <input
              className="login__input"
              type="password"
              id="user-password"
              placeholder={translations.common.words.password[currentLanguage]}
              {...register("password", {
                minLength: {
                  value: MIN_PASSWORD_LENGTH,
                  message:
                    translations.common.errors.password_too_short[
                      currentLanguage
                    ],
                },
                maxLength: {
                  value: MAX_PASSWORD_LENGTH,
                  message:
                    translations.common.errors.password_too_long[
                      currentLanguage
                    ],
                },
                required:
                  translations.common.errors.required_field[currentLanguage],
              })}
            />
            {errors.password && (
              <p className="login__error-message">{errors.password.message}</p>
            )}
          </div>
        </fieldset>
      </ModalWithForm>
    </div>
  );
};
