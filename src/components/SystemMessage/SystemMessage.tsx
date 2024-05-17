import React from "react";
import "./SystemMessage.css";
import { Props } from "./SystemMessageTypes";
export const SystemMessage: React.FC<Props> = ({ message, color }) => {
  return (
    <div className="sys-msg__container">
      <div className="sys-msg__txt" style={{ color }}>
        {message}{" "}
      </div>
    </div>
  );
};
