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
import { setDoneMessage } from "../App/appSlice";

export const getAllCoachesThunk = createAsyncThunk(
  "coaches/getAll",
  async (_, { dispatch }) => {
    let resp: { data: Array<CoachInfo> };
    try {
      resp = await dbApi.getAllCoaches(localStorage.getItem("jwt") as string);
      dispatch(setCoachesList(resp.data));
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export const startSlideShowCounter = createAsyncThunk(
  "coaches/startSlideShowCounter",
  async (_, { dispatch }) => {
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
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    dispatch(setSlideShowTimerId(0));
    window.clearInterval(state.coaches.slideShowtimerId);
  }
);

export const selectCoachByGptThunk = createAsyncThunk(
  "coaches/selectByGpt",
  async (message: string, { dispatch }) => {
    let resp;
    try {
      resp = await gptApi.chooseMeACoach({
        message: message,
        token: localStorage.getItem("jwt") as string,
      });
      dispatch(setDoneMessage("gptAnswered"));
      return resp;
    } catch (err) {
      dispatch(setDoneMessage("gptDidntAnswer"));
      return Promise.reject(err);
    }
  }
);
