import React, { useEffect, useState } from "react";
import "./UpdateAvatar.css";
import "../CommonCSS/UpdateUserTabs.css";
import { Props, avatarFormInputs } from "./UpdateAvatarTypes";
import downloadIcon from "../../images/download.svg";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { translations } from "../../utils/constants/translations";
import { SubmitHandler, useForm } from "react-hook-form";
import { MAX_USERPIC_FILE_SIZE } from "../../utils/constants/commonValues";
import { CleverAvatar } from "../CleverAvatar/CleverAvatar";
import { dbApiRequest } from "../../utils/constants/requests";
import { UpdateUserInfoForm } from "../UpdateUserInfoForm/UpdateUserInfoForm";
import { setUserpicThunk } from "../redux/slices/App/appAsync";

export const UpdateAvatar: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const [imageUrl, setImageUrl] = useState<string>("");
  const backendErrorMessage = useAppSelector((state) => state.app.authMessage);
  const authStatus = useAppSelector((state) => state.app.authStatus);
  const [fileError, setFileError] = useState("");
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<avatarFormInputs>({
    mode: "onChange",
  });

  const formValues = watch();

  useEffect(() => {
    if (formValues.userpic) {
      console.log("userpic change");
      const file = formValues.userpic[0];
      if (file) {
        setFileError("");
        setImageUrl(URL.createObjectURL(file));
      } else {
        setImageUrl("");
      }
    }
    // console.log(errors.userpic?.message);
  }, [formValues.userpic]);

  useEffect(() => {
    if (errors.userpic?.message) {
      console.log(`message change to ${errors.userpic?.message}`);
      setImageUrl("");
      setValue("userpic", undefined);
    }
  }, [errors.userpic?.message]);

  const handleSaveNewAvatar: SubmitHandler<avatarFormInputs> = (data) => {
    if (data.userpic && data.userpic.length !== 0) {
      const userPic = data.userpic?.item(0);
      if (userPic) {
        dispatch(setUserpicThunk(userPic));
      }
    } else {
      setFileError(
        translations.update.tabs.avatar.noFileSelected[currentLanguage]
      );
    }
  };

  return (
    <div className="update-avatar">
      <div className="update-avatar__avatar-cont">
        <CleverAvatar
          avatar={
            imageUrl === ""
              ? dbApiRequest.baseUrl + "/avatars/" + currentUser.avatar
              : imageUrl
          }
          name={currentUser.name}
          onClick={() => {}}
          isHovered={false}
          color={
            "status" in currentUser
              ? currentUser.status === "active"
                ? "green"
                : "orange"
              : "aqua"
          }
        ></CleverAvatar>
      </div>
      <UpdateUserInfoForm
        isBusy={authStatus === "loading"}
        errorMessage={`${
          backendErrorMessage ? backendErrorMessage : ""
        } ${fileError}`}
        handleSubmit={handleSubmit(handleSaveNewAvatar)}
        btnTxtTypeBusy={translations.common.words.saving[currentLanguage]}
        btnTxt={translations.update.tabs.avatar.saveAvatar[currentLanguage]}
      >
        <div className="update-avatar__input-field_type_file">
          <label className="update-avatar__file-label" htmlFor="user-pic">
            <img
              src={downloadIcon}
              className="update-avatar__file-icon"
              alt="Download"
            />
            <p className="update-avatar__file-label-txt">
              {translations.common.words.download_avatar[currentLanguage]}
            </p>
            <input
              type="file"
              className="update-avatar__input_type_file"
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
          <p className="update-avatar__filename">
            {formValues.userpic?.item && formValues.userpic.item(0)
              ? formValues.userpic.item(0)!.name
              : translations.common.words.file_not_loaded[currentLanguage]}
          </p>
        </div>
        <div className="update-tab__error-container">
          {errors.userpic && (
            <p className="update-tab__error-message">
              {errors.userpic.message}
            </p>
          )}
        </div>
      </UpdateUserInfoForm>
    </div>
  );
};
