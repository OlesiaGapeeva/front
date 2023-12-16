import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


interface VacancyData {
  id: number,
  title: string,
  salary: number,
  city?: string | undefined| null,
  company: string,
  exp: string | undefined | null,
  image?: string | undefined | null;
  status: string
  time?: string | undefined | null;
}

interface RespData {
  id: number | null;
  status: string;
  creation_date: string;
  editing_date: string;
  approving_date: string
  full_name: string;
  suite: number | null;
}


interface DataState {
  currentRespId?: number | null;
  currentRespDate: string;
  vacancyFromResp: VacancyData[];
  resp: RespData[];
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    currentRespId: null,
    currentRespDate: '',
    vacancyFromResp: [],
    resp: []
  } as DataState,
  reducers: {
    setCurrentRespId(state, action: PayloadAction<number| null |undefined>) {
      state.currentRespId = action.payload;
      console.log("Current_Resp_id:", action.payload)
    },
    setCurrentRespDate(state, action: PayloadAction<string>) {
      state.currentRespDate = action.payload;
    },
    setVacancyFromResp(state, action: PayloadAction<VacancyData[]>) {
      state.vacancyFromResp = action.payload;
    },
    setResp(state, action: PayloadAction<RespData[]>) {
      state.resp = action.payload;
    }
  },
});

export const useCurrentRespId = () =>
  useSelector((state: { respData: DataState }) => state.respData.currentRespId);

export const useCurrentRespDate = () =>
  useSelector((state: { respData: DataState }) => state.respData.currentRespDate);

export const useVacancyFromResp = () =>
  useSelector((state: { respData: DataState }) => state.respData.vacancyFromResp);

export const useResp = () =>
  useSelector((state: { respData: DataState }) => state.respData.resp);

export const {
    setCurrentRespId: setCurrentRespIdAction,
    setCurrentRespDate: setCurrentRespDateAction,
    setVacancyFromResp: setVacancyFromRespAction,
    setResp: setRespAction

} = dataSlice.actions;

export default dataSlice.reducer;