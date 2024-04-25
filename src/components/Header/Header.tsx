import React, { useContext } from "react";
import logoPath from "../../images/header-logo.svg";
import logoAlt from "../../images/Logo-new.png";
import langIcon from "../../images/langicon.svg";
import { CleverAvatar } from "../CleverAvatar/CleverAvatar";
import "./Header.css";
import { Link } from "react-router-dom";
import { translations } from "../../utils/constants/translations";
import { useAppSelector } from "../redux/hooks";
import { store } from "../redux/store";
import { Props } from "./HeaderTypes";
import { CoachCard } from "../CoachCard/CoachCard";

const Header: React.FC<Props> = ({
  handleFindCoach,
  handleRegister,
  handleLogin,
  handleOpenLangMenu,
  handleLogout,
}) => {
  const currentLanguage = useAppSelector((store) => store.app.lang);
  const loggedIn = useAppSelector((store) => store.app.loggedIn);
  const currentUser = useAppSelector((store) => store.app.currentUser);
  return (
    <header className="header">
      <div className="header__menu">
        {/* -------------- Left side ------------------ */}

        <div className="header__menu-items">
          <Link to="/">
            <div className="header__logo-cont">
              <img src={logoAlt} className="header__logo" alt="WTWR logo" />
            </div>
          </Link>

          {loggedIn && (
            <>
              <div className="header__user-name">
                <Link className="header__link" to="/profile">
                  {currentUser.name}
                </Link>
              </div>

              <div className="header__user-name">
                <Link className="header__link" to="/coach-finder">
                  {translations.header.find_a_coach[currentLanguage]}
                </Link>
              </div>
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
                <button
                  className="header__menu-item-btn"
                  onClick={handleFindCoach}
                >
                  {translations.header.find_a_coach[currentLanguage]}
                </button>
              </div>
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
                <Link to="/profile">
                  <CleverAvatar
                    avatar={currentUser.avatar}
                    name={currentUser.name}
                    color={
                      "status" in currentUser
                        ? currentUser.status === "active"
                          ? "green"
                          : "orange"
                        : "aqua"
                    }
                  ></CleverAvatar>
                </Link>
              </div>

              <div className="header__btn-container">
                <button
                  className="header__menu-item-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          )}

          <div className="header__btn-container">
            <button
              className="header__menu-item-lang"
              onClick={handleOpenLangMenu}
            >
              <img className="header__menu-item-lang-icon" src={langIcon} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
