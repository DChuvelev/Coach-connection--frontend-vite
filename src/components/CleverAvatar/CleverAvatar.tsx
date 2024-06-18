import React, { useState, useEffect } from "react";
import "./CleverAvatar.css";
import { Props } from "./CleverAvatarTypes";
export const CleverAvatar: React.FC<Props> = ({
  avatar,
  name,
  color,
  onClick,
  isHovered,
}) => {
  const [displayAvatar, setDisplayAvatar] = useState<boolean>();
  const [hoverState, setHoverState] = useState(false);

  const replaceAvatar = () => {
    setDisplayAvatar(false);
  };

  useEffect(() => {
    setDisplayAvatar(true);
  }, [avatar]);

  return (
    <div
      className={`clever-avatar__avatar-container ${
        isHovered && hoverState ? "clever-avatar__avatar-hover" : ""
      }`}
      onClick={onClick}
      style={{ border: `3px solid ${color}` }}
      onMouseOver={() => {
        setHoverState(true);
      }}
      onMouseOut={() => {
        setHoverState(false);
      }}
    >
      {displayAvatar && (
        <img
          src={avatar}
          onError={replaceAvatar}
          className="clever-avatar__user-avatar"
          alt="Avatar" // Actualy this is not needed here - when the avatar picture is not loaded I'm anyway replacing it
          style={{ opacity: 1 }}
        />
      )}
      <p className="clever-avatar__avatar-placeholder">
        {name.toUpperCase()[0]}
      </p>
    </div>
  );
};
