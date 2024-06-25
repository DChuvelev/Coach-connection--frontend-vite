import React from "react";
import "./LangMenu.css";
import { LangChoice, appLangs } from "../../utils/constants/langs";

import { Modal } from "../Modal/Modal";
import { useAppDispatch } from "../redux/hooks";
import { changeLang } from "../redux/slices/App/appSlice";
import { ActiveModalsList } from "../AppTypes";
interface Props {
  handleClose: () => void;
  activeModal: ActiveModalsList;
  onClose: () => void;
}

export const LangMenu: React.FC<Props> = ({
  handleClose,
  activeModal,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const handleChangeLangLocal = (lang: LangChoice) => {
    dispatch(changeLang(lang));
    handleClose();
  };
  return (
    <Modal activeModal={activeModal} onClose={onClose}>
      <div>
        {appLangs.map((lang, idx) => {
          return (
            <button
              key={idx}
              className="lang-menu__item"
              onClick={() => {
                handleChangeLangLocal(lang.id);
              }}
            >
              <img
                src={lang.flag}
                className="lang-menu__flag"
                alt={lang.name}
              />
              <p className="lang-menu__lang-name">{lang.name}</p>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
