import React from "react";
import "./Preloader.css";
export const Preloader: React.FC = () => {
  return (
    <div className="preloader__container">
      <div className="preloader__circle"></div>
    </div>
  );
};

export default Preloader;
