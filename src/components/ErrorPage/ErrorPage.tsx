import React from "react";
import { useRouteError } from "react-router-dom";
import { RouterError } from "./RouterTypes";

const ErrorPage = () => {
  const error = "Error";
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
