import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// import { VerifyOtpResponseDto } from "./endpoints";
import { ReduxState } from "../store";

export interface ModelState {
  modelId: string;
}

const initialState: ModelState = {
  modelId: "",
};

export const modelSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    selectModelId: (state, action: PayloadAction<string, string>) => {
      state.modelId = action.payload;
    },

    resetModelId: (state) => {
      state.modelId = "";
    },
  },
});

function createSelector<T>(
  fn: (d: ReduxState["persistedReducer"]["models"]) => T,
) {
  return ({ persistedReducer: { models } }: ReduxState) => fn(models);
}

export const models = createSelector((models) => models);

export const modelActions = modelSlice.actions;

const modelReducer = modelSlice.reducer;

export default modelReducer;
