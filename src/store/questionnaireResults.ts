import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRequestData {
    inputs: IInputs;
}

export interface IInputs {
    Age: number;
    SpouseQ: string;
    KidsQ: string;
    NewInvestorQ: string;
    DownturnQ: string;
}

export interface IRequestMeta {
    version_id: string;
    call_purpose: string;
    source_system: null;
    correlation_id: string;
    requested_output: null;
    service_category: string;
    compiler_type: string;
}

export interface IQuestionnaireState {
    request_data: IRequestData;
    request_meta: IRequestMeta;
}

export enum QuestionnaireActionTypes {
    QuestionnaireData = "results/getQuestionnaireData"
}

export interface QuestionnaireDataAction {
    type: QuestionnaireActionTypes.QuestionnaireData;
    payload: IQuestionnaireState;
}

/**
 * Create Slice
 */
const slice = createSlice({
    name: "results",
    initialState: {
        request_data: {},
        request_meta: {}
    } as IQuestionnaireState,
    reducers: {
        setQuestionnaireData: (
            state: IQuestionnaireState,
            action: PayloadAction<IQuestionnaireState>
        ) => {
            const { request_data, request_meta } = action.payload;

            return {
                ...state,
                request_data: { ...request_data },
                request_meta: { ...request_meta }
            };
        }
    }
});

export default slice.reducer;
export const { setQuestionnaireData } = slice.actions;
