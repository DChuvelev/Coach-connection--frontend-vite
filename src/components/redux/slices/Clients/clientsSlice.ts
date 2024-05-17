import { createSlice } from "@reduxjs/toolkit";
import { ThunkStatus } from "../generalTypes";
import { Client } from "../App/appTypes";

interface ClientsState {
  clientsList: Client[];
  status: ThunkStatus;
  error: string | null;
}

const initialState: ClientsState = {
  clientsList: [],
  status: "idle",
  error: null,
};

export const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    test: (state) => {
      console.log(state.status);
    },
  },
});

export default clientsSlice.reducer;
export const { test } = clientsSlice.actions;
