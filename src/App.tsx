import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { IResponseData, IResponseMeta, setOptimizationData } from "./store/optimizationData";
import { AppDispatch } from "./store";
import styled from "styled-components";
import Questionnaire from "./pages/Questionnaire";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import OptimizationResults from "./pages/OptimizationResults";
import ConstructPortfolio from "./pages/ConstructPortfolio";
import { WasmRunner } from "@coherentglobal/wasm-runner";
import { SERVICE_ID } from "./constants/constants";

export const AUTH_HEADERS = {
    Accept: "application/json",
    "x-synthetic-key": process.env.REACT_APP_SPARK_SECRET_KEY,
    "x-tenant-name": process.env.REACT_APP_SPARK_TENANT,
    "Content-Type": "application/json"
};

export const SPARK_URL = process.env.REACT_APP_SPARK_URL;

function App() {
    const [runner, setRunner] = useState<null | WasmRunner>(null);

    const initWasmRunner = async () => {
        const param = {
            id: SERVICE_ID,
            url: `https://excel.uat.us.coherent.global/agilno/api/v3/nodegen/public/getnodegenzipbyId/service/${SERVICE_ID}`
        };
        const wasmRunner = new WasmRunner(param);
        await wasmRunner.initialize();
        setRunner(wasmRunner);
    };

    useEffect(() => {
        const getMetadata = async () => {
            if (runner?.execute) {
                const payload = {
                    request_data: {
                        inputs: {}
                    },
                    request_meta: {
                        service_category: "Metadata",
                        compiler_type: "Neuron",
                        version_id: SERVICE_ID
                    }
                };
                try {
                    const { response_data, response_meta } = await runner.execute(payload);
                    dispatch(
                        setOptimizationData({
                            response_data: response_data as IResponseData,
                            response_meta: response_meta as IResponseMeta
                        })
                    );
                } catch (e) {
                    console.log("Error executing wasm", e);
                }
            }
        };
        getMetadata();
    }, [runner?.execute]);

    useEffect(() => {
        const init = async () => {
            await initWasmRunner();
        };
        init();
        return () => {
            setRunner(null);
        };
    }, []);

    const dispatch: AppDispatch = useDispatch();
    const { response_data } = useSelector((state: any) => state.optimization);
    const navigate = useNavigate();

    useEffect(() => {
        if (window.performance) {
            navigate("/");
        }
    }, [window.performance]);

    return (
        <Container>
            <Routes>
                <Route
                    path="/"
                    element={
                        response_data?.outputs ? <Questionnaire runner={runner} /> : <Loader />
                    }
                />
                <Route
                    path="/construct-portfolio"
                    element={
                        response_data?.outputs ? <ConstructPortfolio runner={runner} /> : <Loader />
                    }
                />
                <Route
                    path="/results"
                    element={response_data?.outputs ? <OptimizationResults /> : <Loader />}
                />
            </Routes>
        </Container>
    );
}

const Container = styled.div`
    flex-grow: 1;
`;

export default App;
