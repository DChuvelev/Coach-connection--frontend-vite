import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {} from "../App/appAsync";
import { dbApiRequest } from "../../../../utils/constants/requests";
import {
  CoachInfo,
  emptyCoachFinderFormValues,
  initialState,
} from "./coachesTypes";
import { getAllCoachesThunk, selectCoachByGptThunk } from "./coachesAsync";
import { CoachFinder } from "../../../CoachSelector/CoachSelectorTypes";
import { GptAnswer } from "../../../../utils/api/GptApiTypes";
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
    incCoachesSlideShowCounter: (state, action: PayloadAction) => {
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
    resetCoachFinderValues: (state, action: PayloadAction) => {
      state.coachFinderValues = emptyCoachFinderFormValues;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllCoachesThunk.pending, (state, action) => {})
      .addCase(getAllCoachesThunk.fulfilled, (state, action) => {})
      .addCase(selectCoachByGptThunk.pending, (state, action) => {
        state.status = "waiting";
      })
      .addCase(selectCoachByGptThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(
        selectCoachByGptThunk.fulfilled,
        (state, action: PayloadAction<GptAnswer>) => {
          state.gptAnswer = action.payload;
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
} = coachesSlice.actions;
