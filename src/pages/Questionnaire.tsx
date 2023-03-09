import styled from "styled-components";
import { Button } from "antd";
import DefaultLayout from "../components/Layout/DefaultLayout";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header/Header";
import { useDispatch } from "react-redux";
import InputField, { ErrorMessageProps } from "../components/InputField";
import RadioField from "../components/RadioField";
import { AppDispatch } from "../store";
import { IRequestData, IRequestMeta, setQuestionnaireData } from "../store/questionnaireResults";
import FundSelection, { IFundsProps, INewObjectProps } from "./FundSelection";
import Loader from "../components/Loader/Loader";
import { WasmRunner } from "@coherentglobal/wasm-runner";
import { SERVICE_ID } from "../constants/constants";

export interface QuestionnaireTypes {
    Age: number;
    SpouseQ: string;
    KidsQ: string;
    NewInvestorQ: string;
    DownturnQ: string;
}

export interface ThemeColorProps {
    backgroundThemeColor?: string;
    backgroundthemecolor?: string;
    color?: string;
    backgroundColor?: string;
    displayShow?: boolean;
    maxWidth?: number;
    heightOfThePage?: string;
}

interface TranslationOutputRiskProps {
    EN?: string;
    TranslatedValue?: string;
}

export const pageCheck = (location: any) => ({
    getRecommendation: !location.hash || location.hash === "#/",
    ourRecimmendation: location.hash === "#/recommendation",
    readOnly: location.hash.indexOf("#/view") > -1,
    isError500: location.hash === "#/error",
    isError400: location.hash === "#/unauthorized",
    integrationHost: location.hash === "#/int-host"
});

export interface IRunnerProps {
    runner: null | WasmRunner;
}

function Questionnaire({ runner }: IRunnerProps) {
    const { t } = useTranslation("common");
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();
    const { response_data } = useSelector((state: any) => state.optimization);
    const { request_data } = useSelector((state: any) => state.results);
    const { selected_funds_en, selected_funds_zh } = useSelector((state: any) => state.funds);
    const { selected_funds_en_array, selected_funds_zh_array } = useSelector(
        (state: any) => state.fundsArray
    );
    const { language } = useSelector((state: any) => state.language);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [errors, setErrors] = useState<ErrorMessageProps[] | undefined>(undefined);
    const [outputRisk, setOutputRisk] = useState<string>("");
    const [prevStateEn, setPrevStateEn] = useState<INewObjectProps>({});
    const [prevStateZh, setPrevStateZh] = useState<INewObjectProps>({});
    const [prevStateEnArray, setPrevStateEnArray] = useState<IFundsProps[]>([]);
    const [prevStateZhArray, setPrevStateZhArray] = useState<IFundsProps[]>([]);
    const [onCloseX, setOnCloseX] = useState<boolean>(false);
    const [isLangChanged, setIsLangChanged] = useState<boolean>(false);

    const { getRecommendation, ourRecimmendation, readOnly } = pageCheck(location);

    const pageHeader = useMemo(() => {
        if (ourRecimmendation || readOnly) {
            return response_data?.outputs["Metadata.Input_Page2_Title"];
        }

        if (getRecommendation) {
            return response_data?.outputs["Metadata.Input_Page1_Title"];
        }

        return t("common.unknownPage.page");
    }, [getRecommendation, ourRecimmendation, t, readOnly, response_data]);

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingForInput, setLoadingForInput] = useState<boolean>(false);
    const [values, setValues] = useState<{ [key: string]: string }>({
        Age: "",
        SpouseQ: "",
        KidsQ: "",
        NewInvestorQ: "",
        DownturnQ: ""
    });

    const langList = response_data?.outputs["languages"];
    const productTitle = response_data?.outputs["Metadata.Input_ProductTitle"];
    const Age = response_data?.outputs["Metadata.Input_Q1_Label"];
    const SpouseQ = response_data?.outputs["Metadata.Input_Q2_Label"];
    const KidsQ = response_data?.outputs["Metadata.Input_Q3_Label"];
    const NewInvestorQ = response_data?.outputs["Metadata.Input_Q4_Label"];
    const DownturnQ = response_data?.outputs["Metadata.Input_Q5_Label"];

    const heightOfThePage = document.getElementById("root")?.clientHeight;

    const SpouseQOption = response_data?.outputs["Metadata.Input_Q2_Option"]
        ?.split(",")
        .map((i: string, index: number) => {
            return {
                label: i,
                value: index + 1
            };
        });
    const KidsQOption = response_data?.outputs["Metadata.Input_Q3_Option"]
        ?.split(",")
        .map((i: string, index: number) => {
            return {
                label: i,
                value: index + 1
            };
        });
    const NewInvestorQOption = response_data?.outputs["Metadata.Input_Q4_Option"]
        ?.split(",")
        .map((i: string, index: number) => {
            return {
                label: i,
                value: index + 1
            };
        });
    const DownturnQOption = response_data?.outputs["Metadata.Input_Q5_Option"]
        ?.split(",")
        .map((i: string, index: number) => {
            return {
                label: i,
                value: index + 1
            };
        });

    const pageIntro = response_data?.outputs["Metadata.Input_Page1_Instruction"];
    const pageRiskMessage = response_data?.outputs["Metadata.Input_Page2_Instruction"];

    const getRecommendationBtn = response_data?.outputs["Metadata.Config_Page1_Button"];
    const ourRecimmendationBtn = response_data?.outputs["Metadata.Config_Page2_Button"];

    const translationOutputRisk =
        response_data.outputs && response_data.outputs["Metadata.Output_Risk_Appetite_Translation"];

    useEffect(() => {
        if (request_data.outputs) {
            if (language === "EN" || language === "") {
                setOutputRisk(request_data.outputs && request_data.outputs["calc.Output_Risk"]);
            } else {
                const temp = translationOutputRisk?.find((i: TranslationOutputRiskProps) => {
                    return i.EN === request_data.outputs["calc.Output_Risk"];
                })?.TranslatedValue;
                setOutputRisk(temp);
            }
        }
    }, [language, request_data]);

    const onChange = (key: any, value: any) => {
        setValues({ ...values, [key]: value });
    };

    function inputsFilled() {
        for (const i in values) {
            while (values[i] === "") {
                return true;
            }
        }
    }

    function getFirstLetterOfResponse(options: any[], value: string) {
        const createdIndex = +value - 1;
        //same letters (Y and N) should be send for every language
        return options[createdIndex]?.value === 1
            ? "Y"
            : options[createdIndex]?.value === 2
            ? "N"
            : null;
    }

    const checkForAgeValidation = async () => {
        setLoadingForInput(true);
        const payload = {
            request_data: {
                inputs: {
                    "calc.Age": +values.Age
                }
            },
            request_meta: {
                service_category: "calc",
                compiler_type: "Neuron",
                version_id: SERVICE_ID
            }
        };

        try {
            console.log("Running wasm", payload);
            console.time("wasmCall");
            const response = await runner?.execute(payload);
            console.timeEnd("wasmCall");
            console.log("Done running wasm", response);
            setErrors(response?.response_data?.errors);
        } catch (e) {
            setErrors(undefined);
            console.log("Error executing wasm", e);
        } finally {
            setLoadingForInput(false);
        }
    };

    const questionnaireData = async () => {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (runner?.execute) {
            const payload = {
                request_data: {
                    inputs: {
                        "calc.Age": +values.Age,
                        "calc.SpouseQ": getFirstLetterOfResponse(SpouseQOption, values.SpouseQ),
                        "calc.KidsQ": getFirstLetterOfResponse(KidsQOption, values.KidsQ),
                        "calc.NewInvestorQ": getFirstLetterOfResponse(
                            NewInvestorQOption,
                            values.NewInvestorQ
                        ),
                        "calc.DownturnQ": getFirstLetterOfResponse(
                            DownturnQOption,
                            values.DownturnQ
                        )
                    }
                },
                request_meta: {
                    service_category: "calc",
                    compiler_type: "Neuron",
                    version_id: SERVICE_ID
                }
            };
            try {
                const { response_data, response_meta } = await runner.execute(payload);
                setLoading(false);
                dispatch(
                    setQuestionnaireData({
                        request_data: response_data as IRequestData,
                        request_meta: response_meta as IRequestMeta
                    })
                );
                setOutputRisk(response_data.outputs["calc.Output_Risk"]);
            } catch (e) {
                setLoading(false);
                console.log("Error executing wasm", e);
            }
        }
    };

    return (
        <React.Fragment>
            {loading && <Loader heightOfThePage={heightOfThePage} />}
            <Header
                productTitle={productTitle}
                pageHeader={pageHeader}
                langList={langList}
                isLangChanged={isLangChanged}
                setIsLangChanged={setIsLangChanged}
                onBack={
                    ourRecimmendation
                        ? () => {
                              window.location.hash = "#/";
                          }
                        : null
                }
            />
            <DefaultLayout>
                {getRecommendation && (
                    <Container
                        backgroundThemeColor={
                            response_data?.outputs["Metadata.Config_ThemeColour"]["BackGroundColor"]
                        }
                    >
                        <PageIntroMessage
                            color={
                                response_data?.outputs["Metadata.Config_ThemeColour"]
                                    ?.BackGroundColor
                            }
                        >
                            {pageIntro}
                        </PageIntroMessage>
                        <InputField
                            label={Age}
                            name="Age"
                            onChange={(e: string) => onChange("Age", e)}
                            value={values["Age"]}
                            errors={errors}
                            language={language}
                            onBlur={() => {
                                checkForAgeValidation();
                            }}
                        />
                        <RadioField
                            label={SpouseQ}
                            name={SpouseQ}
                            options={SpouseQOption}
                            onChange={(e: number) => onChange("SpouseQ", e)}
                            value={values["SpouseQ"]}
                        />
                        <RadioField
                            label={KidsQ}
                            name={KidsQ}
                            options={KidsQOption}
                            onChange={(e: number) => onChange("KidsQ", e)}
                            value={values["KidsQ"]}
                        />
                        <RadioField
                            label={NewInvestorQ}
                            name={NewInvestorQ}
                            options={NewInvestorQOption}
                            onChange={(e: number) => onChange("NewInvestorQ", e)}
                            value={values["NewInvestorQ"]}
                        />
                        <RadioField
                            label={DownturnQ}
                            name={DownturnQ}
                            options={DownturnQOption}
                            onChange={(e: number) => onChange("DownturnQ", e)}
                            value={values["DownturnQ"]}
                        />

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                onClick={async () => {
                                    setLoading(true);
                                    await questionnaireData();
                                    window.location.hash = "#/recommendation";
                                }}
                                type="primary"
                                disabled={!!errors || loadingForInput || inputsFilled()}
                            >
                                {getRecommendationBtn}
                            </Button>
                        </div>
                    </Container>
                )}
                {ourRecimmendation && request_data && (
                    <Container
                        backgroundThemeColor={
                            response_data?.outputs["Metadata.Config_ThemeColour"]["BackGroundColor"]
                        }
                    >
                        <GreySection>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                <PageRiskMessage>{pageRiskMessage}</PageRiskMessage>
                                <PageRiskClass
                                    color={
                                        response_data?.outputs["Metadata.Config_ThemeColour"]
                                            ?.BackGroundColor
                                    }
                                >
                                    {outputRisk}
                                    <PageRiskMessage>.</PageRiskMessage>
                                </PageRiskClass>
                            </div>
                            <div
                                style={{
                                    fontSize: "15px",
                                    lineHeight: "20px"
                                }}
                            >
                                {response_data.outputs["Metadata.Input_Page2_HelpText1"]}
                            </div>
                            <HrDivider />
                            <div
                                style={{
                                    fontSize: "15px",
                                    lineHeight: "25px"
                                }}
                            >
                                {Object.keys(response_data?.outputs).map((key: string) => {
                                    const fixedLabelKey = key?.replace(/[0-9]/g, "");

                                    if (fixedLabelKey === "Metadata.Input_Category_Label") {
                                        const categoryNumber = key?.match(/\d+/);
                                        return (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between"
                                                }}
                                                key={key}
                                            >
                                                <div>{response_data?.outputs[key]}</div>
                                                <div style={{ fontWeight: 700 }}>
                                                    {
                                                        request_data?.outputs[
                                                            "calc.Output_Category" + categoryNumber
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </GreySection>

                        <div
                            style={{
                                display: "flex",
                                textAlign: "center",
                                fontSize: "15px",
                                lineHeight: "20px"
                            }}
                        >
                            {response_data.outputs["Metadata.Input_Page2_HelpText2"]}
                        </div>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                onClick={() => {
                                    setIsModalVisible(true);
                                    setPrevStateEn({ ...selected_funds_en });
                                    setPrevStateZh({ ...selected_funds_zh });
                                    setPrevStateEnArray([...selected_funds_en_array]);
                                    setPrevStateZhArray([...selected_funds_zh_array]);
                                    setOnCloseX(true);
                                    // navigate("/construct-portfolio");
                                }}
                                type="primary"
                            >
                                {ourRecimmendationBtn}
                            </Button>
                        </div>
                    </Container>
                )}

                <FundSelection
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    prevStateEn={prevStateEn}
                    prevStateZh={prevStateZh}
                    prevStateEnArray={prevStateEnArray}
                    prevStateZhArray={prevStateZhArray}
                    onCloseX={onCloseX}
                    isLangChanged={isLangChanged}
                    setIsLangChanged={setIsLangChanged}
                    applyColorForEachFund={null}
                    setPrevStateEn={setPrevStateEn}
                    setPrevStateZh={setPrevStateZh}
                    setPrevStateEnArray={setPrevStateEnArray}
                    setPrevStateZhArray={setPrevStateZhArray}
                />
            </DefaultLayout>
        </React.Fragment>
    );
}

const Container = styled.div<{ backgroundThemeColor: string }>`
    padding: 20px 20px 76px 20px;
    background-color: #fff;
    display: flex;
    flex-flow: column;
    gap: 30px;
    .ant-radio-button-wrapper {
        height: auto;
        display: grid;
        place-items: center;
        padding-top: 13px;
        padding-bottom: 11px;
        width: 100%;
        & span {
            font-size: 16px;
            line-height: 18px !important;
            word-break: break-word;
            font-weight: 700;
        }
    }
    .ant-btn-primary {
        height: auto;
        display: grid;
        place-items: center;
        padding-top: 13px;
        padding-bottom: 11px;
        width: auto;
        background-color: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
        & span {
            font-size: 16px;
            line-height: 18px !important;
            word-break: break-word;
            font-weight: 700;
        }
        :hover {
            filter: drop-shadow(rgba(0, 0, 0, 0.3) 0px 1px 5px);
        }
        &:disabled {
            :hover {
                filter: none;
            }
            background-color: snow;
            color: darkgrey;
        }
    }
    .ant-select-selector {
        padding: 0px !important;
        .ant-select-selection-item {
            text-overflow: ellipsis;
            overflow: hidden;
            width: calc(100% - 60px);
            padding-right: 0px;
            margin-left: 20px;
            margin-right: 40px;
            display: block;
        }
    }
    .ant-input-number:hover {
        border-color: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
    }
    .ant-input-number-focused {
        border-color: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
    }
    .ant-radio-button-wrapper-checked: not(.ant-radio-button-wrapper-disabled) {
        color: #fff;
        background: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
        border-color: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
    }
    .ant-radio-button-wrapper: hover {
        color: ${(props: ThemeColorProps) => props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
    }
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
        color: #fff;
        background: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
        border-color: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
    }
`;

const PageIntroMessage = styled.div<{ color: string }>`
    color: ${(props: ThemeColorProps) => props.color || "#3b8cff"};
    font-size: 20px;
    font-weight: 700;
    line-height: 120%;
`;

const PageRiskMessage = styled.div`
    color: black;
    font-size: 18px;
    font-weight: 900;
    line-height: 25px;
    fontfamily: noto-sans-display, Helvetica, sans-serif;
`;

const PageRiskClass = styled.div<{ color: string }>`
    color: ${(props: ThemeColorProps) => props.color || "#3b8cff"};
    font-size: 18px;
    font-weight: 900;
    line-height: 25px;
    display: flex;
    justify-content: center;
`;

const GreySection = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #f7f7f7;
    text-align: center;
    padding: 15px;
    gap: 20px;
`;

const HrDivider = styled.div`
    width: 100%;
    height: 1px;
    border-width: 0;
    color: #979797;
    background-color: #979797;
`;

export default Questionnaire;
