import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IChat, IMessage, initialChatsState } from "./chatsTypes";
import { statusType } from "../generalTypes";

export const chatsSlice = createSlice({
  name: "chats",
  initialState: initialChatsState,
  reducers: {
    setChatsStatus: (state, action: PayloadAction<statusType>) => {
      state.chatsStatus = action.payload;
    },
    triggerRefreshTik: (state, action: PayloadAction) => {
      state.refreshTik = Math.random();
    },
    addChatToChatList: (state, action: PayloadAction<IChat>) => {
      state.chatsList.push(action.payload);
    },
    addMessages: (
      state,
      action: PayloadAction<{
        chatIndex: number;
        messages: IMessage[];
      }>
    ) => {
      // console.log(action.payload);
      state.chatsList[action.payload.chatIndex].messages.push(
        ...action.payload.messages
      );
    },
    setCurrentChatIndex: (state, action: PayloadAction<number>) => {
      state.currentChatIndex = action.payload;
    },
  },
  // extraReducers(builder) {
  //   builder
  //     .addCase(registerUserThunk.pending, (state, action) => {
  //       state.authStatus = "loading";
  //       state.doneMessage = "registerAndLoginSuccess";
  //     })
  // },
});

export default chatsSlice.reducer;
export const {
  setChatsStatus,
  addMessages,
  addChatToChatList,
  triggerRefreshTik,
  setCurrentChatIndex,
} = chatsSlice.actions;
