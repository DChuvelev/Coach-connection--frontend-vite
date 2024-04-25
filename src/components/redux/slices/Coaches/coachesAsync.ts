import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbApi } from "../../../../utils/api/DbApi";
import { RootState } from "../../store";
import { CoachInfo } from "./coachesTypes";
import {
  incCoachesSlideShowCounter,
  setCoachesList,
  setSlideShowTimerId,
} from "./coachesSlice";
import { gptApi } from "../../../../utils/api/GptApi";

export const getAllCoachesThunk = createAsyncThunk(
  "coaches/getAll",
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    let resp: { data: Array<CoachInfo> };
    try {
      resp = await dbApi.getAllCoaches(localStorage.getItem("jwt") as string);
      dispatch(setCoachesList(resp.data));
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const createRandomCoachThunk = createAsyncThunk(
  "coaches/createRandom",
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    let resp;
    try {
      resp = await dbApi.createRandomCoach();
      return resp;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const startSlideShowCounter = createAsyncThunk(
  "coaches/startSlideShowCounter",
  async (arg, { getState, dispatch }) => {
    dispatch(
      setSlideShowTimerId(
        window.setInterval(() => {
          dispatch(incCoachesSlideShowCounter());
        }, 8000)
      )
    );
  }
);

export const removeSlideShowCounter = createAsyncThunk(
  "coaches/removeSlideShowCounter",
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    dispatch(setSlideShowTimerId(0));
    window.clearInterval(state.coaches.slideShowtimerId);
  }
);

export const selectCoachByGptThunk = createAsyncThunk(
  "coaches/selectByGpt",
  async (messages: Array<Record<string, string>>, { getState, dispatch }) => {
    const state = getState() as RootState;
    let resp;
    try {
      resp = await gptApi.chooseMeACoach({
        messages: messages,
        token: localStorage.getItem("jwt") as string,
      });
      return resp;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);
