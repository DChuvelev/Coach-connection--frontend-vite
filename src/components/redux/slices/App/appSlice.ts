import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  LoginFormData,
  UserToRegister,
  ThunkStatus,
  statusType,
} from "../generalTypes";
import {
  AppDoneMessages,
  AppErrorMessages,
  CurrentPage,
  CurrentUser,
  ISocketNewMessageData,
  User,
  initialState,
} from "./appTypes";
import {
  registerUserThunk,
  loginThunk,
  setUserpicThunk,
  updateUserInfoThunk,
  initUserFromTokenThunk,
} from "./appAsync";
import { LangChoice } from "../../../../utils/constants/langs";

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeLang: (state, action: PayloadAction<LangChoice>) => {
      state.lang = action.payload;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setRegisterFormValues: (state, action: PayloadAction<UserToRegister>) => {
      state.registerFormValues = action.payload;
    },
    setLoginFormValues: (state, action: PayloadAction<LoginFormData>) => {
      state.loginFormValues = action.payload;
    },
    resetAuthError: (state) => {
      state.authStatus = "idle";
      state.authMessage = undefined;
    },
    setAuthStatus: (state, action: PayloadAction<ThunkStatus>) => {
      state.authStatus = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<CurrentUser>) => {
      state.currentUser = action.payload;
    },
    setAppStatus: (state, action: PayloadAction<statusType>) => {
      state.appStatus = action.payload;
      console.log(`App status set to ${action.payload}`);
    },
    setDoneMessage: (
      state,
      action: PayloadAction<AppDoneMessages | undefined>
    ) => {
      state.doneMessage = action.payload;
    },
    setErrorMessage: (
      state,
      action: PayloadAction<AppErrorMessages | undefined>
    ) => {
      state.errorMessage = action.payload;
    },
    triggerGotNewMessages: (
      state,
      action: PayloadAction<ISocketNewMessageData>
    ) => {
      state.currentUser.gotNewMessagesTik = Math.random();
      state.currentUser.triggeredChatId = action.payload.chatId;
      const chatIndex = state.currentUser.chats.findIndex(
        (chat) => chat._id === action.payload.chatId
      );
      if (chatIndex !== -1) {
        state.currentUser.chats[chatIndex].lastMessage = {
          timestamp: action.payload.timestamp,
          _id: action.payload.messageId,
        };
      }
    },
    sortUserChats: (state) => {
      const currentUserChats = state.currentUser.chats;
      if (currentUserChats && currentUserChats.length > 1) {
        // const chatsCopy = [...currentUserChats];
        currentUserChats.sort((a, b) => {
          if (!a.lastMessage)
            a.lastMessage = { timestamp: new Date().toISOString() };
          if (!b.lastMessage.timestamp)
            b.lastMessage = { timestamp: new Date().toISOString() };
          if (a.lastMessage.timestamp === b.lastMessage.timestamp) return 0;
          return a.lastMessage.timestamp > b.lastMessage.timestamp ? -1 : 1;
        });
        // console.log(chatsCopy);
      }
    },
    removeChatFromCurrentUser: (state, action: PayloadAction<string>) => {
      const idx = state.currentUser.chats.findIndex(
        (chat) => chat._id === action.payload
      );
      if (idx !== -1) {
        state.currentUser.chats.splice(idx, 1);
      }
    },
    setCurrentPage: (state, action: PayloadAction<CurrentPage>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.authStatus = "loading";
        state.doneMessage = "registerAndLoginSuccess";
      })
      .addCase(registerUserThunk.fulfilled, () => {
        // state.appStatus = "done";
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.error.message;
      })
      .addCase(loginThunk.pending, (state) => {
        state.authStatus = "loading";
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.authStatus = "succeeded";
        state.loggedIn = true;
        state.appStatus = "done";
        if (!state.doneMessage) state.doneMessage = "loginSuccess"; // In case it's not a part of reg process
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.error.message;
      })
      .addCase(setUserpicThunk.pending, (state) => {
        if (!state.doneMessage) {
          //In case it's not a part of reg+login process
          state.appStatus = "waiting";
          state.doneMessage = "userPicUpdateSuccess";
        }
      })
      .addCase(
        setUserpicThunk.fulfilled,
        (state, action: PayloadAction<User>) => {
          if (state.doneMessage === "userPicUpdateSuccess") {
            //In case it's not a part of reg+login process
            state.appStatus = "done";
          }
          state.currentUser.avatar = action.payload.avatar;
        }
      )
      .addCase(setUserpicThunk.rejected, (state) => {
        state.appStatus = "error";
        state.errorMessage = "failedToLoadPic";
      })
      .addCase(updateUserInfoThunk.pending, (state) => {
        state.appStatus = "waiting";
        state.authStatus = "loading";
      })
      .addCase(updateUserInfoThunk.fulfilled, (state) => {
        state.doneMessage = "savedUserInfo";
        state.appStatus = "done";
        state.authMessage = "";
        state.authStatus = "idle";
        // state.appStatus = "normal";
      })
      .addCase(updateUserInfoThunk.rejected, (state, action) => {
        if (
          action.error.message?.includes("User already exists") ||
          action.error.message?.includes("Wrong old password")
        ) {
          state.authStatus = "failed";
          state.appStatus = "normal";
          state.authMessage = action.error.message;
        } else {
          state.appStatus = "error";
          state.errorMessage = "failedToUpdUserInfo";
        }
      })
      .addCase(initUserFromTokenThunk.pending, (state) => {
        state.appStatus = "waiting";
      })
      .addCase(initUserFromTokenThunk.fulfilled, (state) => {
        state.doneMessage = "loginSuccess";
        state.appStatus = "done";
      })
      .addCase(initUserFromTokenThunk.rejected, (state, action) => {
        if (action.error.message?.includes("Error")) {
          //That means, that the server is up, but the token is not accepted.
          console.log(action.error.message);
          state.appStatus = "normal";
        } else {
          //The server is down
          state.appStatus = "error";
          state.errorMessage = "serverNotResponding";
        }
      });
  },
});

export default appSlice.reducer;
export const {
  changeLang,
  setRegisterFormValues,
  setLoginFormValues,
  resetAuthError,
  setAuthStatus,
  setCurrentUser,
  setLoggedIn,
  setAppStatus,
  setDoneMessage,
  setErrorMessage,
  triggerGotNewMessages,
  sortUserChats,
  removeChatFromCurrentUser,
  setCurrentPage,
} = appSlice.actions;
