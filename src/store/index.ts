import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import optimization from "./optimizationData";
import results from "./questionnaireResults";
import language from "./languageInfo";
import funds from "./selectedFunds";
import fundsArray from "./selectedFundsArray";
import construct from "./constructData";

const reducer = combineReducers({
    // here we will be adding reducers
    optimization,
    results,
    language,
    funds,
    fundsArray,
    construct
});

const store = configureStore({
    reducer
});

export default store;
export type AppDispatch = typeof store.dispatch;
