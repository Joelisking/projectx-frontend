import {
  type Action,
  type ThunkAction,
  configureStore,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import {
  type TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined"
  ? createWebStorage("local")
  : createNoopStorage();
import { PersistConfig } from "redux-persist/lib/types";

import { api } from "./api";
import { rootReducer } from "./reducer";
import common from "./slices/common";

const persistConfig: PersistConfig<unknown> = {
  key: "campusmarketplace",
  storage,
  version: 1,
  blacklist: [api.reducerPath], // Don't persist API cache
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    persistedReducer,
    common,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production" && {
    name: "campus-marketplace",
  },
});

setupListeners(reduxStore.dispatch);

export const useDispatch = (): ReduxDispatch =>
  useReduxDispatch<ReduxDispatch>();
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;

/** Types */

export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;

export const reduxPersistor = persistStore(reduxStore);
