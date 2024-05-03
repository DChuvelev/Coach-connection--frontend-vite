import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { LangMenu } from "./LangMenu/LangMenu";
import { RegisterModal } from "./RegisterModal/RegisterModal";
import { LoginModal } from "./LoginModal/LoginModal";
// import { gptApi } from "../utils/api/GptApi";
import { translations } from "../utils/constants/translations";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  setLoginFormValues,
  setRegisterFormValues,
  resetAuthError,
  setAuthStatus,
  setCurrentUser,
  setLoggedIn,
  setAppStatus,
  setDoneMessage,
  setErrorMessage,
  triggerGotNewMessages,
} from "./redux/slices/App/appSlice";
import {
  initUserFromTokenThunk,
  loginThunk,
  refreshCurrentUserThunk,
  registerUserThunk,
} from "./redux/slices/App/appAsync";
import { FormInfo, defaultFormInfo } from "./ModalWithForm/ModalWithFormTypes";
import { loginFormDefaultData } from "./LoginModal/LoginModalTypes";
import { registerFormDefaultData } from "./RegisterModal/RegisterModalTypes";
import { UserToRegister } from "./redux/slices/generalTypes";
import { CoachProfile } from "./CoachProfile/CoachProfile";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { defaultUser } from "./redux/slices/App/appTypes";
import { ConfirmModal } from "./ConfirmModal/ConfirmModal";
import { ProtectedRoute } from "../utils/ProtectedRoute/ProtectedRoute";
import Preloader from "./Preloader/Preloader";
import { ClientProfile } from "./ClientProfile/ClientProfile";
import { SystemMessage } from "./SystemMessage/SystemMessage";
import {
  createRandomCoachThunk,
  getAllCoachesThunk,
} from "./redux/slices/Coaches/coachesAsync";
import CoachSelector from "./CoachSelector/CoachSelector";
import ErrorPage from "./ErrorPage/ErrorPage";
import CoachPage from "./CoachPage/CoachPage";
import SlideShow from "./SlideShow/SlideShow";
import io from "socket.io-client";
import { baseUrl } from "../utils/constants/requests";
import { delay } from "../utils/functions";
import { ActiveModalsList } from "./AppTypes";

function App() {
  const [activeModal, setActiveModal] = useState<ActiveModalsList>("");
  const [formInfo, setFormInfo] = useState<FormInfo>(defaultFormInfo);
  const currentLanguage = useAppSelector((state) => state.app.lang);
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.app.authStatus);
  const loggedIn = useAppSelector((state) => state.app.loggedIn);
  const appStatus = useAppSelector((state) => state.app.appStatus);
  const currentUser = useAppSelector((state) => state.app.currentUser);
  const appError = useAppSelector((state) => state.app.errorMessage);
  const doneMessage = useAppSelector((state) => state.app.doneMessage);
  const chatsState = useAppSelector((state) => state.chats);
  const socket = io(`${baseUrl}`);
  const navigate = useNavigate();

  //----------------------- Init -----------------------------------
  useEffect(() => {
    const asyncInit = async () => {
      await dispatch(getAllCoachesThunk());
      await dispatch(initUserFromTokenThunk());
    };
    asyncInit();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      const userInfoToSend = {
        token: localStorage.getItem("jwt") as string,
        userId: currentUser._id,
      };
      // console.log(userInfoToSend);
      socket.emit("log_in", userInfoToSend);

      socket.on("new_message_in_chat", (data: { chatId: string }) => {
        // console.log(`New message in chat with Id ${data.chatId}`);
        dispatch(triggerGotNewMessages(data.chatId));
      });
    }
  }, [currentUser?._id]);

  useEffect(() => {
    if (appStatus === "normal" && currentUser.triggeredChatId) {
      // console.log(currentUser.triggeredChatId);
      // console.log(chatsState);
      console.log(
        `Got new message in chat with ID ${currentUser.triggeredChatId}`
      );
      if (chatsState.currentChatIndex !== -1) {
        console.log(
          `Now chat with ID ${
            chatsState.chatsList[chatsState.currentChatIndex]._id
          } opened`
        );
        if (
          currentUser.triggeredChatId ===
          chatsState.chatsList[chatsState.currentChatIndex]._id
        ) {
          console.log(
            "This chat is opened. No user update needed\n----------------"
          );
          return;
        } else {
          console.log("Chat with a different Id opened.");
        }
      } else {
        console.log("No chat window opened.");
      }

      console.log(
        "Refreshing new chats list in current user info\n----------------"
      );
      dispatch(refreshCurrentUserThunk());
    }
  }, [currentUser.gotNewMessagesTik]);

  //---------------------- Common functions -----------------------------

  useEffect(() => {
    if (authStatus === "succeeded") {
      handleModalClose();
      dispatch(setAuthStatus("idle"));
    }
  }, [authStatus]);

  useEffect(() => {
    //Close DONE info modal after a pause
    // console.log(appStatus);
    if (appStatus === "done") {
      setTimeout(() => {
        dispatch(setAppStatus("normal"));
        dispatch(setDoneMessage(undefined));
      }, 1500);
    }
  }, [appStatus]);

  //--------------------- Modals ----------------------------------
  const resetFormsData = () => {
    dispatch(setLoginFormValues(loginFormDefaultData));
    dispatch(setRegisterFormValues(registerFormDefaultData));
  };
  const handleOpenLangMenu = () => {
    setActiveModal("lang-menu");
  };

  const handleModalClose = () => {
    resetFormsData();
    setActiveModal("");
    dispatch(resetAuthError());
  };

  const handleFindCoach = () => {
    // const userToRegister: UserToRegister = {
    //   name: "Dmitry",
    //   email: "d.chuvelev@gmail.com",
    //   password: "redttt",
    //   confirmPassword: "redttt",
    //   role: "client",
    //   userpic: undefined,
    // };
    // dispatch(setRegisterFormValues(userToRegister));
    // handleOpenRegisterModal();
    dispatch(createRandomCoachThunk());
  };

  //-------------------------- User login -------------------------------
  const confirmRedirectionToLogin = () => {
    setActiveModal("confirm-login");
  };

  const handleOpenLoginModal = () => {
    setActiveModal("form");
    setFormInfo({
      formType: "login",
      name: `${translations.header.login[currentLanguage]} ${translations.common.as[currentLanguage]}...`,
      btnTxt: translations.header.login[currentLanguage],
      redirBtnTxt: `${
        translations.common.or[currentLanguage]
      } ${translations.header.register[currentLanguage].toLowerCase()}`,
      btnTxtTypeBusy: translations.login.logging[currentLanguage],
    });
  };

  const handleSubmitLogin = () => {
    dispatch(loginThunk());
  };

  const handleRedirectFromLoginToRegister = () => {
    handleOpenRegisterModal();
  };

  //------------------------- User logout --------------------------

  const logout = () => {
    socket.disconnect();
    localStorage.removeItem("jwt");
    dispatch(setLoggedIn(false));
    dispatch(setCurrentUser(defaultUser));
    // history.push('/');
    handleModalClose();
    dispatch(setDoneMessage("loggedOut"));
    dispatch(setAppStatus("done"));
    navigate("/");
  };

  const handleLogout = () => {
    setActiveModal("confirm-logout");
  };

  //---------------------------- User registration ------------------------------

  const handleOpenRegisterModal = () => {
    setActiveModal("form");
    setFormInfo({
      formType: "register",
      name: translations.header.register[currentLanguage],
      btnTxt: translations.header.register[currentLanguage],
      redirBtnTxt: `${
        translations.common.or[currentLanguage]
      } ${translations.header.login[currentLanguage].toLowerCase()}`,
      btnTxtTypeBusy: translations.common.saving[currentLanguage],
    });
  };

  const handleSubmitRegister = () => {
    dispatch(registerUserThunk());
  };

  const handleRedirectFromRegisterToLogin = () => {
    handleOpenLoginModal();
  };

  return (
    <>
      {(appStatus === "waiting" || appStatus === "starting") && <Preloader />}
      {appStatus === "done" && (
        <SystemMessage
          message={
            doneMessage
              ? translations.appGlobal.doneMessages[doneMessage][
                  currentLanguage
                ]
              : undefined
          }
          color={"green"}
        />
      )}
      {appStatus === "error" && (
        <SystemMessage
          message={
            appError
              ? translations.appGlobal.errorMessages[appError][currentLanguage]
              : undefined
          }
          color={"red"}
        />
      )}
      <div className="app">
        <Header
          handleOpenLangMenu={handleOpenLangMenu}
          handleFindCoach={handleFindCoach}
          handleRegister={handleOpenRegisterModal}
          handleLogin={handleOpenLoginModal}
          handleLogout={handleLogout}
        />
        <div className="app__content">
          {appStatus === "normal" && (
            <Routes>
              <Route path="*" element={<ErrorPage />} />
              <Route
                path="/"
                element={
                  <SlideShow redirectToLogin={confirmRedirectionToLogin} />
                }
              ></Route>
              <Route
                path="/coach-finder"
                element={
                  <ProtectedRoute loggedIn={loggedIn}>
                    {currentUser.role === "client" && <CoachSelector />}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute loggedIn={loggedIn}>
                    {currentUser.role === "coach" && <CoachProfile />}
                    {currentUser.role === "client" && <ClientProfile />}
                  </ProtectedRoute>
                }
              />
              <Route path="/coaches/:coachId" element={<CoachPage />} />
            </Routes>
          )}
        </div>
        <Footer />
        {activeModal === "lang-menu" && (
          <LangMenu
            activeModal={activeModal}
            onClose={handleModalClose}
            handleClose={handleModalClose}
          />
        )}
        {activeModal === "form" && formInfo!.formType === "register" && (
          <RegisterModal
            formInfo={formInfo}
            formCallbacks={{
              handleSubmit: handleSubmitRegister,
              handleRedir: handleRedirectFromRegisterToLogin,
            }}
            activeModal={activeModal}
            onClose={handleModalClose}
            isBusy={authStatus === "loading"}
          />
        )}
        {activeModal === "form" && formInfo.formType === "login" && (
          <LoginModal
            formInfo={formInfo}
            formCallbacks={{
              handleSubmit: handleSubmitLogin,
              handleRedir: handleRedirectFromLoginToRegister,
            }}
            activeModal={activeModal}
            onClose={handleModalClose}
            isBusy={authStatus === "loading"}
          />
        )}
        {activeModal === "confirm-logout" && (
          <ConfirmModal
            message={translations.modals.confirmLogout.message[currentLanguage]}
            okBtnTxt={translations.modals.confirmLogout.okBtn[currentLanguage]}
            activeModal={activeModal}
            onOk={logout}
            onClose={handleModalClose}
          />
        )}
        {activeModal === "confirm-login" && (
          <ConfirmModal
            message={translations.modals.confirmLogin.message[currentLanguage]}
            okBtnTxt={translations.modals.confirmLogin.okBtn[currentLanguage]}
            activeModal={activeModal}
            onOk={handleOpenLoginModal}
            onClose={handleModalClose}
          />
        )}
      </div>
    </>
  );
}

export default App;
