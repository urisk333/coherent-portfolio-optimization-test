import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFundsProps } from "../pages/FundSelection";

export interface ISelectedFundsData {
    [key: string]: IFundsProps[];
}

export interface ISelectedFundsState {
    selected_funds_en: ISelectedFundsData;
    selected_funds_zh: ISelectedFundsData;
}

export enum SelectedFundsActionTypes {
    SelectedFundsData = "funds/getSelectedFunds"
}

export interface SelectedFundsDataAction {
    type: SelectedFundsActionTypes.SelectedFundsData;
    payload: ISelectedFundsData;
}

/**
 * Create Slice
 */
const slice = createSlice({
    name: "funds",
    initialState: {
        selected_funds_en: {},
        selected_funds_zh: {}
    } as ISelectedFundsState,
    reducers: {
        setSelectedFundsData: (
            state: ISelectedFundsState,
            action: PayloadAction<ISelectedFundsState>
        ) => {
            const { selected_funds_en, selected_funds_zh } = action.payload;

            return {
                ...state,
                selected_funds_en: { ...selected_funds_en },
                selected_funds_zh: { ...selected_funds_zh }
            };
        }
    }
});

export default slice.reducer;
export const { setSelectedFundsData } = slice.actions;
