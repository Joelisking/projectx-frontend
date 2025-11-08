import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/auth";
import modelReducer from "./slices/models";

export const rootReducer = combineReducers({
  auth: authReducer,
  models: modelReducer,
});
