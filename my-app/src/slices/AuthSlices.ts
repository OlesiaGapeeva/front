import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface UserData {
  email: string;
  fullname: string;
  phoneNumber: string;
  isSuperuser: boolean
}

interface DataState {
    user: UserData,
    isAuth: boolean,
    isAdmin: boolean,
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    user: {},
    isAuth: false,
    isAdmin: false,
  } as DataState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.user = action.payload
      console.log(`user is ${action.payload.email}`)
    },
    setIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload
    },
    setIsAdmin(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload
      console.log(`is admin: ${action.payload}`)
    }
  },
});

export const useUser = () =>
  useSelector((state: { authData: DataState }) => state.authData.user);

export const useIsAuth = () =>
  useSelector((state: { authData: DataState }) => state.authData.isAuth);

export const useIsAdmin = () =>
  useSelector((state: { authData: DataState }) => state.authData.isAdmin);

export const {
  setUser: setUserAction,
  setIsAuth: setIsAuthAction,
  setIsAdmin: setIsAdminAction,
} = dataSlice.actions;

export default dataSlice.reducer;
