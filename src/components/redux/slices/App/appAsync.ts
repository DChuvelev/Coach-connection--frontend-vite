import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbApi } from "../../../../utils/api/DbApi";
import { RootState } from "../../store";
import { CurrentUser } from "./appTypes";
import { RefObject } from "react";
import { setCurrentUser, setLoggedIn, setLoginFormValues } from "./appSlice";

export const registerUserThunk = createAsyncThunk(
  "app/registerUser",
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    const userToRegister = {
      email: state.app.registerFormValues.email,
      name: state.app.registerFormValues.name,
      password: state.app.registerFormValues.password,
      role: state.app.registerFormValues.role,
    };
    let resp;
    try {
      resp = await dbApi.registerUser(userToRegister);
    } catch (err) {
      return Promise.reject(err);
    }
    dispatch(
      setLoginFormValues({
        email: state.app.registerFormValues.email,
        password: state.app.registerFormValues.password,
        role: state.app.registerFormValues.role,
      })
    );
    await dispatch(loginThunk());
    const userPic = state.app.registerFormValues.userpic?.item(0);
    if (userPic) dispatch(setUserpicThunk(userPic));
    return resp;
  }
);

export const loginThunk = createAsyncThunk(
  "app/login",
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    const userToLogin = {
      email: state.app.loginFormValues.email,
      password: state.app.loginFormValues.password,
      role: state.app.loginFormValues.role,
    };
    let resp: CurrentUser & { token: string };
    try {
      resp = await dbApi.authorizeUser(userToLogin);
      const { token, ...restResp } = resp;
      dispatch(setLoggedIn(true));
      console.log(restResp);
      localStorage.setItem("jwt", token);
      dispatch(setCurrentUser(restResp));
    } catch (err) {
      return Promise.reject(err);
    }
    return resp;
  }
);

export const initUserFromTokenThunk = createAsyncThunk(
  "app/initUser",
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    let resp: CurrentUser;
    try {
      resp = await dbApi.checkToken(localStorage.getItem("jwt") as string);
      dispatch(setLoggedIn(true));
      dispatch(setCurrentUser(resp));
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const setUserpicThunk = createAsyncThunk(
  "app/setUserpic",
  async (userpic: File | undefined, { getState, dispatch }) => {
    const state = getState() as RootState;
    var dataToSend = new FormData();
    if (userpic) dataToSend.append("avatar", userpic);
    let resp;
    try {
      resp = await dbApi.updateUserpic({
        userpic: dataToSend,
        token: localStorage.getItem("jwt") as string,
      });
    } catch (err) {
      return Promise.reject(err);
    }
    return resp;
  }
);

export const updateUserInfoThunk = createAsyncThunk(
  "app/updateUserInfo",
  async (userInfo: CurrentUser, { getState, dispatch }) => {
    const state = getState() as RootState;
    let resp;
    try {
      resp = await dbApi.updateUserInfo({
        userInfo: userInfo,
        token: localStorage.getItem("jwt") as string,
      });
      dispatch(setCurrentUser(resp));
    } catch (err) {
      return Promise.reject(err);
    }
    return resp;
  }
);
