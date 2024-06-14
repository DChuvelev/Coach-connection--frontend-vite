import React, { useEffect } from "react";
import "./RegisterModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "react-hook-form";
import { translations } from "../../utils/constants/translations";
import {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USERPIC_FILE_SIZE,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from "../../utils/constants/commonValues";
import downloadIcon from "../../images/download.svg";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Props } from "./RegisterModalTypes";
import { UserToRegister } from "../redux/slices/generalTypes";
import {
  setRegisterFormValues,
  setLoginFormValues,
  resetAuthError,
} from "../redux/slices/App/appSlice";

export const RegisterModal: React.FC<Props> = ({
  formInfo,
  formCallbacks,
  activeModal,
  onClose,
  isBusy,
}) => {
  const currentLanguage = useAppSelector((store) => store.app.lang);
  const registerFormValues = useAppSelector(
    (state) => state.app.registerFormValues
  );
  const loginFormValues = useAppSelector((state) => state.app.loginFormValues);
  const backendErrorMessage = useAppSelector((state) => state.app.authMessage);
  const dispatch = useAppDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<UserToRegister>({
    defaultValues: registerFormValues,
  });

  const formValues = watch();

  useEffect(() => {
    if (backendErrorMessage) dispatch(resetAuthError());
  }, [formValues.email, formValues.role]);

  const handleSubmitRegister = () => {
    dispatch(setRegisterFormValues(formValues));
    formCallbacks.handleSubmit();
  };

  const handleRedir = () => {
    dispatch(setRegisterFormValues(formValues));
    dispatch(
      setLoginFormValues({
        ...loginFormValues,
        email: formValues.email,
        password: formValues.password,
      })
    );
    formCallbacks.handleRedir();
  };

  return (
    <div className="register">
      <ModalWithForm
        formInfo={formInfo}
        formCallbacks={{
          handleRedir,
          handleSubmit: handleSubmit(handleSubmitRegister),
        }}
        activeModal={activeModal}
        onClose={onClose}
        isBusy={isBusy}
        errorMessage={backendErrorMessage}
      >
        <fieldset className="register__input-fieldset">
          <div className="register__input-field">
            <div className="register__toggle-switch">
              <label className="register__switch-btn-container">
                <input
                  type="radio"
                  value="coach"
                  {...register("role", {
                    required: translations.register.role.error[currentLanguage],
                  })}
                />
                <span className="register__switch-btn">
                  {translations.register.role.coach[currentLanguage]}
                </span>
              </label>
              <label className="register__switch-btn-container">
                <input
                  type="radio"
                  value="client"
                  {...register("role", {
                    required: translations.register.role.error[currentLanguage],
                  })}
                />
                <span className="register__switch-btn">
                  {translations.register.role.client[currentLanguage]}
                </span>
              </label>
            </div>
            {errors.role && (
              <p className="register__error-message">{errors.role.message}</p>
            )}
          </div>
          <div className="register__input-field">
            <input
              type="text"
              className="register__input"
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
              <p className="register__error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="register__input-field">
            {/* <label className='register__field-label' htmlFor='user-password'>Password</label> */}
            <input
              type="password"
              className="register__input"
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
              <p className="register__error-message">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="register__input-field">
            {/* <label className='register__field-label' htmlFor='confirm-password'>Confirm password</label> */}
            <input
              type="password"
              className="register__input"
              id="confirm-password"
              placeholder={
                translations.common.words.confirm_password[currentLanguage]
              }
              {...register("confirmPassword", {
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
                validate: {
                  passwordsMatch: (val, formVals) =>
                    val === formVals.password ||
                    translations.common.errors.passwords_should_match[
                      currentLanguage
                    ],
                },
              })}
            />
            {errors.confirmPassword && (
              <p className="register__error-message">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="register__input-field">
            {/* <label className='register__field-label' htmlFor='user-name'>Name</label> */}
            <input
              type="text"
              className="register__input"
              id="user-name"
              placeholder={translations.common.words.name[currentLanguage]}
              {...register("name", {
                minLength: {
                  value: MIN_USERNAME_LENGTH,
                  message:
                    translations.common.errors.username_too_short[
                      currentLanguage
                    ],
                },
                maxLength: {
                  value: MAX_USERNAME_LENGTH,
                  message:
                    translations.common.errors.username_too_long[
                      currentLanguage
                    ],
                },
                required:
                  translations.common.errors.required_field[currentLanguage],
              })}
            />
            {errors.name && (
              <p className="register__error-message">{errors.name.message}</p>
            )}
          </div>
          <div className="register__input-field">
            <div className="register__input-field_type_file">
              <label className="register__file-label" htmlFor="user-pic">
                <img
                  src={downloadIcon}
                  className="register__file-icon"
                  alt="Download"
                />
                <p className="register__file-label-txt">
                  {translations.common.words.download_avatar[currentLanguage]}
                </p>
                <input
                  type="file"
                  className="register__input_type_file"
                  id="user-pic"
                  placeholder=""
                  // name="userpic"
                  // ref={fileRef}
                  {...register("userpic", {
                    validate: {
                      fileSize: (val) => {
                        if (val?.item && val.item(0)) {
                          return (
                            val.item(0)!.size < MAX_USERPIC_FILE_SIZE ||
                            translations.common.errors.userpic_file_too_big[
                              currentLanguage
                            ]
                          );
                        } else {
                          return true;
                        }
                      },
                    },
                  })}
                />
              </label>
              <p className="register__filename">
                {formValues.userpic?.item && formValues.userpic.item(0)
                  ? formValues.userpic.item(0)!.name
                  : translations.common.words.file_not_loaded[currentLanguage]}
              </p>
            </div>
            {errors.userpic && (
              <p className="register__error-message">
                {errors.userpic.message}
              </p>
            )}
          </div>
        </fieldset>
      </ModalWithForm>
    </div>
  );
};
