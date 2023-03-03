import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFundsProps } from "../pages/FundSelection";

export interface ISelectedFundsArrayState {
    selected_funds_en_array: IFundsProps[];
    selected_funds_zh_array: IFundsProps[];
}

export enum SelectedFundsArrayActionTypes {
    SelectedFundsArrayData = "fundsArray/getSelectedFundsArray"
}

export interface SelectedFundsArrayDataAction {
    type: SelectedFundsArrayActionTypes.SelectedFundsArrayData;
    payload: ISelectedFundsArrayState;
}

/**
 * Create Slice
 */
const slice = createSlice({
    name: "fundsArray",
    initialState: {
        selected_funds_en_array: [],
        selected_funds_zh_array: []
    } as ISelectedFundsArrayState,
    reducers: {
        setSelectedFundsArrayData: (
            state: ISelectedFundsArrayState,
            action: PayloadAction<ISelectedFundsArrayState>
        ) => {
            const { selected_funds_en_array, selected_funds_zh_array } = action.payload;

            return {
                ...state,
                selected_funds_en_array: [...selected_funds_en_array],
                selected_funds_zh_array: [...selected_funds_zh_array]
            };
        }
    }
});

export default slice.reducer;
export const { setSelectedFundsArrayData } = slice.actions;
