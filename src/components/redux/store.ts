import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./slices/Clients/clientsSlice";
import appReducer from "./slices/App/appSlice";
import coachesReducer from "./slices/Coaches/coachesSlice";
import chatsReducer from "./slices/Chats/chatsSlice";

export const store = configureStore({
  reducer: {
    coaches: coachesReducer,
    clients: clientsReducer,
    chats: chatsReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // isSerializable: () => true,
        ignoredActions: ["app/setRegisterFormValues"],
        // ignoredActionPaths: [],
        ignoredPaths: ["app.registerFormValues"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
