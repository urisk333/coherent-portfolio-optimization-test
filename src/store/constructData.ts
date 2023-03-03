import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IConstructData {
    outputs: IOutputs;
    warning: null;
    errors: null;
    service_chain: null;
}

interface IOutputs {}

export interface IConstructMeta {
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

export interface IConstructState {
    construct_data: IConstructData;
    construct_meta: IConstructMeta;
}

export enum ConstructActionTypes {
    GetConstructData = "construct/getConstructData"
}

export interface GetConstructDataAction {
    type: ConstructActionTypes.GetConstructData;
    payload: IConstructState;
}

/**
 * Create Slice
 */
const slice = createSlice({
    name: "construct",
    initialState: {
        construct_data: {},
        construct_meta: {}
    } as IConstructState,
    reducers: {
        setConstructData: (state: IConstructState, action: PayloadAction<IConstructState>) => {
            const { construct_data, construct_meta } = action.payload;

            return {
                ...state,
                construct_data: construct_data,
                construct_meta: construct_meta
            };
        }
    }
});

export default slice.reducer;
export const { setConstructData } = slice.actions;
