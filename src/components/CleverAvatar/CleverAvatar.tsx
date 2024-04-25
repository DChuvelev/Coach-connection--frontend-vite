import React, { useState, useEffect } from "react";
import "./CleverAvatar.css";
import { dbApiRequest } from "../../utils/constants/requests";
import { Props } from "./CleverAvatarTypes";
export const CleverAvatar: React.FC<Props> = ({ avatar, name, color }) => {
  const [displayAvatar, setDisplayAvatar] = useState<boolean>();

  const replaceAvatar = () => {
    setDisplayAvatar(false);
  };

  useEffect(() => {
    setDisplayAvatar(true);
  }, [avatar]);

  return (
    <div
      className="clever-avatar__avatar-container"
      style={{ border: `3px solid ${color}` }}
    >
      {displayAvatar && (
        <img
          src={dbApiRequest.baseUrl + "/avatars/" + avatar}
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
