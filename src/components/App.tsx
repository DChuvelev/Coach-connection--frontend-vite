import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { LangMenu } from "./LangMenu/LangMenu";
import { RegisterModal } from "./RegisterModal/RegisterModal";
import { LoginModal } from "./LoginModal/LoginModal";
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
  triggerGotNewMessages,
  sortUserChats,
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
import { CoachProfile } from "./CoachProfile/CoachProfile";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  ISocketNewMessageData,
  defaultUser,
} from "./redux/slices/App/appTypes";
import { ConfirmModal } from "./ConfirmModal/ConfirmModal";
import { ProtectedRoute } from "../utils/ProtectedRoute/ProtectedRoute";
import Preloader from "./Preloader/Preloader";
import { ClientProfile } from "./ClientProfile/ClientProfile";
import { SystemMessage } from "./SystemMessage/SystemMessage";
import { getAllCoachesThunk } from "./redux/slices/Coaches/coachesAsync";
import CoachSelector from "./CoachSelector/CoachSelector";
import ErrorPage from "./ErrorPage/ErrorPage";
import CoachPage from "./CoachPage/CoachPage";
import SlideShow from "./SlideShow/SlideShow";
import io from "socket.io-client";
import { baseUrl } from "../utils/constants/requests";
import { ActiveModalsList } from "./AppTypes";
import MyChats from "./MyChats/MyChats";
import { UpdateUserInfoModal } from "./UpdateUserInfoModal/UpdateUserInfoModal";

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
  const socket = io(`${baseUrl}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
  });
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

      const logInToSocket = () => {
        socket.emit("log_in", userInfoToSend);
        socket.on("new_message_in_chat", (data: ISocketNewMessageData) => {
          // console.log(`New message in chat with Id ${data.chatId}`);
          dispatch(triggerGotNewMessages(data));
        });
      };

      if (socket.connected) logInToSocket();

      socket.on("connect", () => {
        console.log(`Reconnected to socket id: ${socket.id}`);
        logInToSocket();
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
          // we don't need user refresh, as the triggered chat is opened, so all updates are made inside chat
          // but as we are not refreshing user we need to sort the chats order here.
          dispatch(sortUserChats());
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
      //we need user update in case when no chat is opened or opened another (not triggered with new message) chat
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

  //-------------------------- User login -------------------------------
  const confirmRedirectionToLogin = () => {
    setActiveModal("confirm-login");
  };

  const handleOpenLoginModal = () => {
    setActiveModal("form");
    setFormInfo({
      formType: "login",
      name: `${translations.header.login[currentLanguage]} ${translations.common.words.as[currentLanguage]}...`,
      btnTxt: translations.header.login[currentLanguage],
      redirBtnTxt: `${
        translations.common.words.or[currentLanguage]
      } ${translations.header.register[currentLanguage].toLowerCase()}`,
      btnTxtTypeBusy: translations.login.common.logging[currentLanguage],
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
        translations.common.words.or[currentLanguage]
      } ${translations.header.login[currentLanguage].toLowerCase()}`,
      btnTxtTypeBusy: translations.common.words.saving[currentLanguage],
    });
  };

  const handleSubmitRegister = () => {
    dispatch(registerUserThunk());
  };

  const handleRedirectFromRegisterToLogin = () => {
    handleOpenLoginModal();
  };

  //---------------------------- User update ------------------------------

  const handleOpenUpdateUserInfoModal = () => {
    setActiveModal("update-user-info");
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
          handleRegister={handleOpenRegisterModal}
          handleUpdateUserInfo={handleOpenUpdateUserInfoModal}
          handleLogin={handleOpenLoginModal}
          handleLogout={handleLogout}
        />
        <div className="app__content">
          {true && ( //here was appStatus === "normal" instead of true. Check if it's needed!!!
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
              <Route
                path="/my-chats"
                element={
                  <ProtectedRoute loggedIn={loggedIn}>
                    <MyChats />
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
        {activeModal === "update-user-info" && (
          <UpdateUserInfoModal onClose={handleModalClose} />
        )}
      </div>
    </>
  );
}

export default App;
