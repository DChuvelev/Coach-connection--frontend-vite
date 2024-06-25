import React from "react";
import logoAlt from "../../images/Logo-new.svg";
import bellIcon from "../../images/Icons/Bell.svg";
import { CleverAvatar } from "../CleverAvatar/CleverAvatar";
import "./Header.css";
import { Link } from "react-router-dom";
import { translations } from "../../utils/constants/translations";
import { useAppSelector } from "../redux/hooks";
import { Props } from "./HeaderTypes";
import { appLangs } from "../../utils/constants/langs";
import { dbApiRequest } from "../../utils/constants/requests";

const Header: React.FC<Props> = ({
  handleRegister,
  handleUpdateUserInfo,
  handleLogin,
  handleOpenLangMenu,
  handleLogout,
}) => {
  const currentLanguage = useAppSelector((store) => store.app.lang);
  const loggedIn = useAppSelector((store) => store.app.loggedIn);
  const currentUser = useAppSelector((store) => store.app.currentUser);
  const currentPage = useAppSelector((state) => state.app.currentPage);
  return (
    <header className="header">
      <div className="header__menu">
        {/* -------------- Left side ------------------ */}

        <div className="header__menu-items">
          <Link to="/">
            <div className="header__logo-cont">
              <img
                src={logoAlt}
                className="header__logo"
                alt="CoachFinder logo"
              />
            </div>
          </Link>

          {loggedIn && (
            <>
              <Link
                className={`header__link ${
                  currentPage === "my_profile"
                    ? "header__link_type_selected"
                    : ""
                }`}
                to="/profile"
              >
                {translations.header.my_profile[currentLanguage]}
              </Link>
              {currentUser.role === "client" && (
                <Link
                  className={`header__link ${
                    currentPage === "find_a_coach"
                      ? "header__link_type_selected"
                      : ""
                  }`}
                  to="/coach-finder"
                >
                  {translations.header.find_a_coach[currentLanguage]}
                </Link>
              )}

              <Link
                className={`header__link ${
                  currentPage === "my_chats" ? "header__link_type_selected" : ""
                }`}
                to="/my-chats"
              >
                {/* <div> */}
                {translations.header.my_chats[currentLanguage]}
                {currentUser.gotNewMessagesInChatIDs.length > 0 && (
                  <img src={bellIcon} className="header__bell" alt="bell" />
                )}
                {/* </div> */}
              </Link>
            </>
          )}
        </div>

        {/* -------------- Middle ------------------ */}
        <div></div>

        {/* -------------- Right side ------------------ */}

        <div className="header__menu-items">
          {!loggedIn && (
            <>
              <div className="header__btn-container">
                <button className="header__menu-item-btn" onClick={handleLogin}>
                  {translations.header.login[currentLanguage]}
                </button>
              </div>
              <div className="header__btn-container">
                <button
                  className="header__menu-item-btn"
                  onClick={handleRegister}
                >
                  {translations.header.register[currentLanguage]}
                </button>
              </div>
            </>
          )}

          {loggedIn && (
            <>
              <div className="header__avatar">
                {/* <Link to="/profile"> */}
                <CleverAvatar
                  avatar={
                    dbApiRequest.baseUrl + "/avatars/" + currentUser.avatar
                  }
                  name={currentUser.name}
                  onClick={handleUpdateUserInfo}
                  isHovered={true}
                  color={
                    "status" in currentUser
                      ? currentUser.status === "active"
                        ? "green"
                        : "orange"
                      : "aqua"
                  }
                ></CleverAvatar>
                {/* </Link> */}
              </div>

              <div className="header__btn-container">
                <button
                  className="header__menu-item-btn"
                  onClick={handleLogout}
                >
                  {translations.header.logout[currentLanguage]}
                </button>
              </div>
            </>
          )}

          <div className="header__btn-container">
            <button
              className="header__menu-item-lang"
              onClick={handleOpenLangMenu}
            >
              <img
                className="header__menu-item-lang-icon"
                src={appLangs.find((lang) => lang.id === currentLanguage)?.flag}
                alt="Language"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
