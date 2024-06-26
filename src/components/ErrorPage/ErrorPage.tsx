import React from "react";

const ErrorPage: React.FC = () => {
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
