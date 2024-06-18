import React from "react";
import "./UpdateUserInfoModal.css";
import { Props } from "./UpdateUserInfoModalTypes";
import { Modal } from "../Modal/Modal";

import { UpdateEmail } from "../UpdateEmail/UpdateEmail";
import { UpdatePassword } from "../UpdatePassword/UpdatePassword";
import { UpdateAvatar } from "../UpdateAvatar/UpdateAvatar";
import { Tab } from "../MultiTab/MultiTabTypes";
import { MultiTab } from "../MultiTab/MultiTab";
import { useAppSelector } from "../redux/hooks";
import { translations } from "../../utils/constants/translations";

export const UpdateUserInfoModal: React.FC<Props> = ({ onClose }) => {
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const userUpdateTabs: Tab[] = [
    {
      component: () => <UpdateAvatar />,
      name: translations.update.tabs.avatar.avatar[currentLanguage],
    },
    {
      component: () => <UpdateEmail />,
      name: translations.update.tabs.email.email[currentLanguage],
    },
    {
      component: () => <UpdatePassword />,
      name: translations.update.tabs.password.password[currentLanguage],
    },
  ];

  return (
    <div className="update-user-info">
      <Modal onClose={onClose} activeModal="update-user-info">
        <MultiTab
          components={userUpdateTabs}
          heading={translations.update.common.updateUserInfo[currentLanguage]}
        />
        <div className="update-user-info__btn-container">
          <button
            type="button"
            className="update-user-info__done-btn"
            onClick={onClose}
          >
            {translations.update.common.done[currentLanguage]}
          </button>
        </div>
      </Modal>
    </div>
  );
};
