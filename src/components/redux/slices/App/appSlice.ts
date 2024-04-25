import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LangChoice } from "../../../../utils/models";
import {
  LoginFormData,
  UserToRegister,
  ThunkStatus,
  statusType,
} from "../generalTypes";
import { AppDoneMessages, CurrentUser, User, initialState } from "./appTypes";
import {
  registerUserThunk,
  loginThunk,
  setUserpicThunk,
  updateUserInfoThunk,
  initUserFromTokenThunk,
} from "./appAsync";
import { dbApiRequest } from "../../../../utils/constants/requests";

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
    resetAuthError: (state, action: PayloadAction) => {
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
    },
    setDoneMessage: (
      state,
      action: PayloadAction<AppDoneMessages | undefined>
    ) => {
      state.doneMessage = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUserThunk.pending, (state, action) => {
        state.authStatus = "loading";
        state.doneMessage = "registerAndLoginSuccess";
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        // state.appStatus = "done";
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.error.message;
      })
      .addCase(loginThunk.pending, (state, action) => {
        state.authStatus = "loading";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.loggedIn = true;
        state.appStatus = "done";
        if (!state.doneMessage) state.doneMessage = "loginSuccess"; // In case it's not a part of reg process
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.authStatus = "failed";
        state.authMessage = action.error.message;
      })
      .addCase(setUserpicThunk.pending, (state, action) => {
        if (!state.doneMessage) {
          //In case it's not a part of reg+login process
          state.appStatus = "waiting";
          state.doneMessage = "userPicUpdateSuccess";
        }
      })
      .addCase(
        setUserpicThunk.fulfilled,
        (state, action: PayloadAction<User>) => {
          if (!state.doneMessage) {
            //In case it's not a part of reg+login process
            state.appStatus = "done";
          }
          state.currentUser.avatar = action.payload.avatar;
        }
      )
      .addCase(setUserpicThunk.rejected, (state, action) => {
        state.appStatus = "error";
        state.errorMessage = "failedToLoadPic";
      })
      .addCase(updateUserInfoThunk.pending, (state, action) => {
        state.appStatus = "waiting";
      })
      .addCase(updateUserInfoThunk.fulfilled, (state, action) => {
        state.doneMessage = "savedUserInfo";
        state.appStatus = "done";
      })
      .addCase(updateUserInfoThunk.rejected, (state, action) => {
        state.appStatus = "error";
        state.errorMessage = "failedToUpdUserInfo";
      })
      .addCase(initUserFromTokenThunk.pending, (state, action) => {
        state.appStatus = "waiting";
      })
      .addCase(initUserFromTokenThunk.fulfilled, (state, action) => {
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
} = appSlice.actions;
