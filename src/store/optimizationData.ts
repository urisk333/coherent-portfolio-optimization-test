import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IResponseData {
    outputs: IOutputs;
    warning: null;
    errors: null;
    service_chain: null;
}

interface IOutputs {
    "Metadata.Language_Number": number;
    // "Metadata.Input_Q3_Option": string;
    // translations: ITranslations;
}

// interface ITranslations {
//     en: object;
// }

export interface IResponseMeta {
    service_id: string;
    version_id: string;
    version: string;
    process_time: number;
    call_id: string;
    compiler_type: string;
    compiler_version: string;
    source_hash: null;
    engine_id: string;
    correlation_id: string;
    parameterset_version_id: null;
    system: string;
    request_timestamp: Date;
}

export interface IOptimizationState {
    response_data: IResponseData;
    response_meta: IResponseMeta;
}

export enum OptimizationActionTypes {
    GetOptimizationData = "optimization/getOptimizationData"
}

export interface GetOptimizationDataAction {
    type: OptimizationActionTypes.GetOptimizationData;
    payload: IOptimizationState;
}

/**
 * Create Slice
 */
const slice = createSlice({
    name: "optimization",
    initialState: {
        response_data: {},
        response_meta: {}
    } as IOptimizationState,
    reducers: {
        setOptimizationData: (
            state: IOptimizationState,
            action: PayloadAction<IOptimizationState>
        ) => {
            const { response_data, response_meta } = action.payload;

            return {
                ...state,
                response_data: response_data,
                response_meta: response_meta
            };
        }
    }
});

export default slice.reducer;
export const { setOptimizationData } = slice.actions;
