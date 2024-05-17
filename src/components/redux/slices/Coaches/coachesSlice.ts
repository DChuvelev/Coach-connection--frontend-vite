import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {} from "../App/appAsync";
import {
  CoachInfo,
  emptyCoachFinderFormValues,
  initialState,
} from "./coachesTypes";
import { getAllCoachesThunk, selectCoachByGptThunk } from "./coachesAsync";
import { CoachFinder } from "../../../CoachSelector/CoachSelectorTypes";
import { ChosenCoachGptAnswer } from "../../../../utils/api/GptApiTypes";
import { statusType } from "../generalTypes";

export const coachesSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    setCoachesList: (state, action: PayloadAction<Array<CoachInfo>>) => {
      state.coachesList = action.payload;
    },
    setStatus: (state, action: PayloadAction<statusType>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    incCoachesSlideShowCounter: (state) => {
      state.slideShowCounter++;
      // console.log(state.coachesList.length, state.slideShowCounter);
      if (state.slideShowCounter >= state.coachesList.length) {
        state.slideShowCounter = 0;
      }
    },
    setSlideShowTimerId: (state, action: PayloadAction<number>) => {
      state.slideShowtimerId = action.payload;
    },
    setCoachFinderValues: (state, action: PayloadAction<CoachFinder>) => {
      state.coachFinderValues = action.payload;
    },
    resetCoachFinderValues: (state) => {
      state.coachFinderValues = emptyCoachFinderFormValues;
    },
    resetGptAnswerId: (state) => {
      state.gptAnswer.coachId = "";
    },
    resetGptAnswerText: (state) => {
      state.gptAnswer.text = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllCoachesThunk.pending, () => {})
      .addCase(getAllCoachesThunk.fulfilled, () => {})
      .addCase(selectCoachByGptThunk.pending, (state) => {
        state.status = "waiting";
      })
      .addCase(selectCoachByGptThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(
        selectCoachByGptThunk.fulfilled,
        (state, action: PayloadAction<ChosenCoachGptAnswer>) => {
          state.gptAnswer.coachId = action.payload._id;
          state.gptAnswer.text = action.payload.text;
        }
      );
  },
});

export default coachesSlice.reducer;
export const {
  setCoachesList,
  incCoachesSlideShowCounter,
  setSlideShowTimerId,
  setCoachFinderValues,
  resetCoachFinderValues,
  resetGptAnswerId,
  resetGptAnswerText,
} = coachesSlice.actions;
