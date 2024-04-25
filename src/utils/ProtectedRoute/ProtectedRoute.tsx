import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
export const ProtectedRoute: React.FC<
  PropsWithChildren<{ loggedIn: boolean }>
> = ({ children, loggedIn }) => {
  // console.log(loggedIn);
  return (
    <>
      {loggedIn ? children : <Navigate to="/" />}
      {/* {children} */}
    </>
  );
};
