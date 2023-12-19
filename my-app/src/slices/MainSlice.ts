import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface VacancyData {
    id: number,
    title: string,
    salary: number,
    city?: string | undefined| null,
    company: string,
    exp: string,
    image?: string | undefined | null,
    status: string,
    info?: string,
    adress?: string |null
}

interface DataState {
  titleValue: string;
  vacancies: VacancyData[];
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    titleValue: '',
    vacancies: [],
  } as DataState,
  reducers: {
    setTitleValue(state, action: PayloadAction<string>) {
      state.titleValue = action.payload
    },
    setVacancies(state, action: PayloadAction<VacancyData[]>) {
      state.vacancies = action.payload
      console.log('ВАКАНСИИ', action.payload)
    },
  },
});

// Состояние, которое будем отображать в компонентах

export const useTitleValue = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.titleValue);

export const useVacancies = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.vacancies);


// Action, который будем применять в различных обработках
export const {
    setTitleValue: setTitleValueAction,
    setVacancies: setVacanciesAction,
} = dataSlice.actions;

export default dataSlice.reducer;