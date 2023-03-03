import React, { useEffect, useState } from "react";
import "./App.css";
import axios, { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { setOptimizationData } from "./store/optimizationData";
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
            id: "e8ba9e7e-169c-4752-8a8e-d6eb0c78cb01",
            url: "https://excel.uat.us.coherent.global/agilno/api/v3/nodegen/public/getnodegenzipbyId/service/b96b7a7b-7e7c-4ed0-93ea-6d844b5ff0ab"
        };
        const wasmRunner = new WasmRunner(param);
        await wasmRunner.initialize();
        setRunner(wasmRunner);
    };

    // Checking an option to get metadata

    // const initWasmRunner = async () => {
    //     const param = {
    //         id: "e8ba9e7e-169c-4752-8a8e-d6eb0c78cb01",
    //         url: "https://excel.uat.us.coherent.global/agilno/api/v3/nodegen/public/getnodegenzipbyId/service/b96b7a7b-7e7c-4ed0-93ea-6d844b5ff0ab"
    //     };
    //     const payload = {
    //         request_data: {
    //             inputs: {}
    //         },
    //         request_meta: {
    //             service_category: "Metadata",
    //             compiler_type: "Neuron",
    //             version_id: "e8ba9e7e-169c-4752-8a8e-d6eb0c78cb01",
    //             call_purpose: "Spark - API Tester",
    //             source_system: "SPARK",
    //             correlation_id: "",
    //             requested_output: null
    //         }
    //     };
    //     const wasmRunner = new WasmRunner(param);
    //     await wasmRunner.initialize();
    //     const response = await wasmRunner.execute(payload).catch((err) => {
    //         console.log("ERR: ", err);
    //         ({ error: err.v3 });
    //     });
    //     console.log("RES: ", response);
    // };

    // Close check

    useEffect(() => {
        const init = async () => {
            await initWasmRunner();
        };
        init();
    }, []);

    const dispatch: AppDispatch = useDispatch();
    const { response_data } = useSelector((state: any) => state.optimization);
    const navigate = useNavigate();

    useEffect(() => {
        if (window.performance) {
            navigate("/");
        }
    }, [window.performance]);

    const initData = async () => {
        return await axios
            .request({
                method: "POST",
                url: SPARK_URL,
                headers: AUTH_HEADERS,
                data: {
                    data: {},
                    request_meta: {
                        service_category: "Metadata",
                        compiler_type: "Neuron"
                    }
                }
            })
            .then((response: AxiosResponse) => {
                dispatch(
                    setOptimizationData({
                        response_data: response.data.response_data,
                        response_meta: response.data.response_meta
                    })
                );
            })
            .catch(
                (err: any) => {}
                // console.log("ERROR: ", err)
            );
    };

    useEffect(() => {
        initData();
    }, []);

    return (
        <Container>
            <Routes>
                <Route
                    path="/"
                    element={
                        response_data?.outputs ? (
                            <Questionnaire runner={runner} initWasmRunner={initWasmRunner} />
                        ) : (
                            <Loader />
                        )
                    }
                />
                <Route
                    path="/construct-portfolio"
                    element={response_data?.outputs ? <ConstructPortfolio /> : <Loader />}
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
