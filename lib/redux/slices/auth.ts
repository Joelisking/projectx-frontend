import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// import { deleteCookie } from "cookies-next";
import { ReduxState } from "../store";

export interface AuthState {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    campusId?: string;
    campus?: string;
    isVerified: boolean;
    averageRating?: number;
    totalReviews?: number;
  } | null;
  accessToken?: string;
  refreshToken: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: undefined,
  refreshToken: "",
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: AuthState['user']; accessToken?: string; refreshToken?: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = undefined;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = undefined;
      state.refreshToken = "";
      state.error = null;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthState['user']>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});


// Selectors
export const selectAuth = (state: ReduxState) => state.persistedReducer.auth;
export const selectUser = (state: ReduxState) => state.persistedReducer.auth?.user;
export const selectIsAuthenticated = (state: ReduxState) => state.persistedReducer.auth?.isAuthenticated;
export const selectAuthLoading = (state: ReduxState) => state.persistedReducer.auth?.isLoading;
export const selectAuthError = (state: ReduxState) => state.persistedReducer.auth?.error;

export const authActions = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
