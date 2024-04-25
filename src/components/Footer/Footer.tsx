import React, { useContext } from "react";
import "./Footer.css";
import { translations } from "../../utils/constants/translations";
import { useAppSelector } from "../redux/hooks";
export default function Footer() {
  const currentLanguage = useAppSelector((state) => state.app.lang);
  return (
    <footer className="footer">
      <p className="footer__text">
        {translations.footer.developed[currentLanguage]}
      </p>
      <p className="footer__year">{new Date().getFullYear()}</p>
    </footer>
  );
}
