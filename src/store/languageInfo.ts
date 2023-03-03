import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILanguageData {
    language: string;
}

export interface ILanguageState {
    language: ILanguageData;
}

export enum LanguageActionTypes {
    LanguageData = "language/getLanguageData"
}

export interface LanguageDataAction {
    type: LanguageActionTypes.LanguageData;
    payload: ILanguageData;
}

/**
 * Create Slice
 */
const slice = createSlice({
    name: "language",
    initialState: {
        language: ""
    } as ILanguageData,
    reducers: {
        setLanguageData: (state: ILanguageData, action: PayloadAction<ILanguageData>) => {
            const { language } = action.payload;

            return {
                ...state,
                language: language
            };
        }
    }
});

export default slice.reducer;
export const { setLanguageData } = slice.actions;
