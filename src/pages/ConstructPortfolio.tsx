import Header from "../components/Header/Header";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/Layout/DefaultLayout";
import Loader from "../components/Loader/Loader";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import PieChartGraph from "../components/Recharts/PieChartGraph";
import { ReactComponent as EditIcon } from "../assets/svgs/editIcon.svg";
import { CaretRightOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Col, InputNumber, Modal, Row, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import FundSelection, { IFundsProps, INewObjectProps } from "./FundSelection";
import { setSelectedFundsData } from "../store/selectedFunds";
import { AppDispatch } from "../store";
import { IConstructData, IConstructMeta, setConstructData } from "../store/constructData";
import { IRunnerProps, ThemeColorProps } from "./Questionnaire";
import { SERVICE_ID } from "../constants/constants";

const ConstructPortfolio = ({ runner }: IRunnerProps) => {
    const dispatch: AppDispatch = useDispatch();
    const { response_data } = useSelector((state: any) => state.optimization);
    const { request_data } = useSelector((state: any) => state.results);
    const { selected_funds_en, selected_funds_zh } = useSelector((state: any) => state.funds);
    const { selected_funds_en_array, selected_funds_zh_array } = useSelector(
        (state: any) => state.fundsArray
    );
    const { language } = useSelector((state: any) => state.language);
    const navigate = useNavigate();

    const [prevStateEn, setPrevStateEn] = useState<INewObjectProps>({});
    const [prevStateZh, setPrevStateZh] = useState<INewObjectProps>({});
    const [prevStateEnArray, setPrevStateEnArray] = useState<IFundsProps[]>([]);
    const [prevStateZhArray, setPrevStateZhArray] = useState<IFundsProps[]>([]);
    const [onCloseX, setOnCloseX] = useState<boolean>(false);
    const [isLangChanged, setIsLangChanged] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
    const [selectedFundsByLang, setSelectedFundsByLang] = useState<any>([]);
    const [showSection, setShowSection] = useState<any>(null);

    const langList = response_data?.outputs["languages"];
    const [isModalVisible, setIsModalVisible] = useState(false);

    const productTitle = response_data?.outputs["Metadata.Input_ProductTitle"];
    const pageHeader = response_data?.outputs["Metadata.Input_Page4_Title"];
    const pageTitle = response_data?.outputs["Metadata.Input_Page3_Title"];
    const pageIntro = response_data?.outputs["Metadata.Input_Page4_Instruction"];
    const pageButton = response_data?.outputs["Metadata.Config_Page4_Button"];

    const warningTitle = response_data?.outputs["Metadata.Input_Warning_Title"];
    const warningInstruction = response_data?.outputs["Metadata.Input_Warning_Instruction"];
    const button1 = response_data?.outputs["Metadata.Input_Warning_Button1"];
    const button2 = response_data?.outputs["Metadata.Input_Warning_Button2"];

    const heightOfThePage = document.getElementById("root")?.clientHeight;

    function hexToRgb(hexCode: string) {
        let hex = hexCode.replace("#", "");

        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }

        const r = parseInt(hex.substring(0, 2), 16),
            g = parseInt(hex.substring(2, 4), 16),
            b = parseInt(hex.substring(4, 6), 16);

        return `rgba(${r + "," + g + "," + b + ",0.3"})`;
    }

    useEffect(() => {
        if (language === "EN" || language === "") {
            setSelectedFundsByLang(selected_funds_en);
        } else {
            setSelectedFundsByLang(selected_funds_zh);
        }
    }, [language, selected_funds_en, selected_funds_zh]);

    useEffect(() => {
        if (selectedFundsByLang) {
            const temp: any = {};
            for (const i in selectedFundsByLang) {
                temp[i] = true;
            }
            setShowSection(temp);
        }
    }, [selectedFundsByLang]);

    function getLighterShades(key: any, randomNum: any, data: any) {
        return data[key].map((i: any, index: any) => {
            const randomShade = index === 0 ? 40 : 35 + +index * 17;
            const color = "hsl(" + randomNum + ", 100%, " + randomShade + "%)";
            return { ...i, Color: i.Color || color };
        });
    }

    function applyColorForEachFund() {
        if (selected_funds_en && selected_funds_zh) {
            const tempEn: { [key: number]: any } = {};
            const tempZh: { [key: number]: any } = {};

            let colors = [];
            const randomNum = Math.floor(Math.random() * (360 - 180 + 1) + 180);
            colors = Object.keys(selected_funds_en).map((i: any) => {
                return randomNum - +i * 180;
            });

            for (const key in selected_funds_en) {
                Object.assign(tempEn, {
                    [key]: getLighterShades(key, colors[+key - 1], selected_funds_en)
                });
            }

            for (const key in selected_funds_zh) {
                Object.assign(tempZh, {
                    [key]: getLighterShades(key, colors[+key - 1], selected_funds_zh)
                });
            }

            dispatch(
                setSelectedFundsData({
                    selected_funds_en: tempEn,
                    selected_funds_zh: tempZh
                })
            );
        }
    }

    useEffect(() => {
        applyColorForEachFund();
    }, []);

    function totalPercentage(data: any) {
        return data?.reduce((accumulator: any, currentValue: any) => {
            return accumulator + (currentValue.Percentage || 0);
        }, 0);
    }

    function checkForRecommended() {
        const recommended = Object.keys(selectedFundsByLang).map((i: any) => {
            return request_data.outputs["calc.Output_Category" + i].replace("%", "").split("-");
        });

        return Object.keys(selectedFundsByLang).some((i: any) => {
            return (
                totalPercentage(selectedFundsByLang[i]) >= +recommended[i - 1][0] &&
                totalPercentage(selectedFundsByLang[i]) <= +recommended[i - 1][1]
            );
        });
    }

    const inputWithSteps = (key: number, value: any) => {
        function handleIncrease() {
            const tempEn = selected_funds_en[key].map((i: any) => {
                if (i.Fund_ID === value.Fund_ID) {
                    return {
                        ...i,
                        Percentage: (i.Percentage ? +i.Percentage : 0) + 1
                    };
                } else return i;
            });

            const tempZh = selected_funds_zh[key].map((i: any) => {
                if (i.Fund_ID === value.Fund_ID) {
                    return {
                        ...i,
                        Percentage: (i.Percentage ? +i.Percentage : 0) + 1
                    };
                } else return i;
            });

            dispatch(
                setSelectedFundsData({
                    selected_funds_en: {
                        ...selected_funds_en,
                        [key]: tempEn
                    },
                    selected_funds_zh: {
                        ...selected_funds_zh,
                        [key]: tempZh
                    }
                })
            );
        }
        function handleDecrease() {
            const tempEn = selected_funds_en[key].map((i: any) => {
                if (i.Fund_ID === value.Fund_ID) {
                    return {
                        ...i,
                        Percentage: (i.Percentage ? +i.Percentage : 0) - 1
                    };
                } else return i;
            });

            const tempZh = selected_funds_zh[key].map((i: any) => {
                if (i.Fund_ID === value.Fund_ID) {
                    return {
                        ...i,
                        Percentage: (i.Percentage ? +i.Percentage : 0) - 1
                    };
                } else return i;
            });

            dispatch(
                setSelectedFundsData({
                    selected_funds_en: {
                        ...selected_funds_en,
                        [key]: tempEn
                    },
                    selected_funds_zh: {
                        ...selected_funds_zh,
                        [key]: tempZh
                    }
                })
            );
        }
        function handleChange(target: any) {
            const tempEn = selected_funds_en[key].map((i: any) => {
                if (i.Fund_ID === value.Fund_ID) {
                    return {
                        ...i,
                        Percentage: +target!.replace("%", "")
                    };
                } else return i;
            });

            const tempZh = selected_funds_zh[key].map((i: any) => {
                if (i.Fund_ID === value.Fund_ID) {
                    return {
                        ...i,
                        Percentage: +target!.replace("%", "")
                    };
                } else return i;
            });

            dispatch(
                setSelectedFundsData({
                    selected_funds_en: {
                        ...selected_funds_en,
                        [key]: tempEn
                    },
                    selected_funds_zh: {
                        ...selected_funds_zh,
                        [key]: tempZh
                    }
                })
            );
        }

        return (
            <div
                style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between"
                }}
                key={value.Fund_ID}
            >
                <div
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        borderRight: "1px solid #d9d9d9",
                        padding: "7px 10px",
                        cursor: "pointer"
                    }}
                    onClick={() => {
                        handleDecrease();
                    }}
                >
                    -
                </div>

                <InputNumber
                    type="text"
                    size="small"
                    onInput={(e: string) => {
                        if (e) {
                            handleChange(e);
                        }
                    }}
                    min={0}
                    max={100}
                    style={{
                        backgroundColor: "white",
                        padding: "3px",
                        width: "100%",
                        textAlignLast: "center"
                    }}
                    formatter={(value) => {
                        return `${value}%`;
                    }}
                    value={value.Percentage || 0}
                    controls={false}
                />
                <div
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        borderLeft: "1px solid #d9d9d9",
                        padding: "7px 10px",
                        cursor: "pointer"
                    }}
                    onClick={() => {
                        handleIncrease();
                    }}
                >
                    +
                </div>
            </div>
        );
    };

    const getStats = async () => {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        const tempAllocations = Object.keys(selectedFundsByLang).map((i: any) => {
            return {
                ["stat." + i + "_FundAllocation"]: response_data?.outputs[
                    "Metadata.Input_Category" + i + "_Funds"
                ]?.map((k: any) => {
                    const temp = selectedFundsByLang[i]?.find((j: any) => j.Fund_ID === k.Fund_ID);
                    return {
                        Allocation: temp?.Percentage ? temp.Percentage / 100 : 0,
                        Fund_ID: k.Fund_ID
                    };
                })
            };
        });

        if (runner?.execute) {
            const payload = {
                request_data: {
                    inputs: {
                        inputs: tempAllocations.reduce((obj, item) => Object.assign(obj, item), {})
                    }
                },
                request_meta: {
                    service_category: "stat",
                    compiler_type: "Neuron",
                    version_id: SERVICE_ID
                }
            };
            try {
                const { response_data, response_meta } = await runner.execute(payload);
                setLoading(false);
                setShowWarningModal(false);
                dispatch(
                    setConstructData({
                        construct_data: response_data as IConstructData,
                        construct_meta: response_meta as IConstructMeta
                    })
                );
                navigate("/results");
            } catch (e) {
                setLoading(false);
                console.log("Error executing wasm", e);
            }
        }
    };

    return (
        <React.Fragment>
            <Header
                productTitle={productTitle}
                pageHeader={pageHeader}
                langList={langList}
                onBack={() => {
                    navigate("/#/recommendation");
                }}
                isLangChanged={isLangChanged}
                setIsLangChanged={setIsLangChanged}
            />
            {loading && <Loader heightOfThePage={heightOfThePage} />}
            <WarningModal open={showWarningModal} closable={false} width={335} footer={null}>
                <div>
                    <ModalHeader>
                        <ModalTitle
                            color={
                                response_data?.outputs["Metadata.Config_ThemeColour"][
                                    "BackGroundColor"
                                ]
                            }
                        >
                            {warningTitle}
                        </ModalTitle>
                        <CloseOutlined
                            onClick={() => {
                                setShowWarningModal(false);
                            }}
                        />
                    </ModalHeader>
                    <ModalContent>{warningInstruction}</ModalContent>
                    <ModalFooter>
                        <Button
                            type={"default"}
                            onClick={() => {
                                getStats();
                                setShowWarningModal(false);
                            }}
                        >
                            {button1}
                        </Button>
                        <Button
                            type={"primary"}
                            onClick={() => {
                                setShowWarningModal(false);
                            }}
                        >
                            {button2}
                        </Button>
                    </ModalFooter>
                </div>
            </WarningModal>
            <DefaultLayout>
                <Container
                    backgroundThemeColor={
                        response_data?.outputs["Metadata.Config_ThemeColour"]["BackGroundColor"]
                    }
                >
                    <TopSection
                        backgroundColor={hexToRgb(
                            response_data?.outputs["Metadata.Config_ThemeColour"]?.BackGroundColor
                        )}
                    >
                        <TopSectionText>Recommendation</TopSectionText>
                        <LabelsDiv>
                            {Object.keys(selectedFundsByLang).map((i: any, index: any) => {
                                return (
                                    <div key={index}>
                                        <TopSectionThinText>
                                            {
                                                response_data?.outputs[
                                                    "Metadata.Input_Category" + i + "_Label"
                                                ]
                                            }
                                            {": "}
                                            <TopSectionBoldText>
                                                {request_data.outputs["calc.Output_Category" + i]}
                                            </TopSectionBoldText>
                                        </TopSectionThinText>
                                        <span
                                            style={{
                                                borderLeft: "1px solid #d9d9d9",
                                                display:
                                                    Object.keys(selectedFundsByLang).length ===
                                                    index + 1
                                                        ? "none"
                                                        : ""
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </LabelsDiv>
                    </TopSection>
                    <PageIntroDiv>{pageIntro}</PageIntroDiv>
                    <CenteredDiv>
                        <div
                            style={{
                                minHeight: "200px",
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            {totalPercentage(
                                Object.keys(selectedFundsByLang).reduce(function (res, v) {
                                    return res.concat(selectedFundsByLang[v]);
                                }, [])
                            ) ? (
                                <PieChartGraph
                                    data={Object.keys(selectedFundsByLang).reduce(function (
                                        res,
                                        v
                                    ) {
                                        return res.concat(selectedFundsByLang[v]);
                                    },
                                    [])}
                                    selectedFundsByLang={undefined}
                                    response_data={undefined}
                                />
                            ) : (
                                <Skeleton.Avatar
                                    style={{
                                        height: 180,
                                        width: 180,
                                        marginBottom: "20px"
                                    }}
                                    active={false}
                                    size={"large"}
                                    shape={"circle"}
                                />
                            )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <IconPlacement
                                onClick={() => {
                                    setIsModalVisible(true);
                                    setPrevStateEn({ ...selected_funds_en });
                                    setPrevStateZh({ ...selected_funds_zh });
                                    setPrevStateEnArray([...selected_funds_en_array]);
                                    setPrevStateZhArray([...selected_funds_zh_array]);
                                    setOnCloseX(true);
                                }}
                            >
                                <EditIcon /> <span>{pageTitle}</span>
                            </IconPlacement>
                        </div>
                    </CenteredDiv>
                    <MainSection>
                        {Object.keys(selectedFundsByLang).map((i: any, index: number) => {
                            return (
                                <div key={index}>
                                    <DropDownLabel
                                        onClick={() => {
                                            setShowSection({
                                                ...showSection,
                                                [i]: !showSection[i]
                                            });
                                        }}
                                        style={{ paddingBottom: "14px" }}
                                    >
                                        <span>
                                            {
                                                response_data?.outputs[
                                                    "Metadata.Input_Category" + i + "_Label"
                                                ]
                                            }
                                        </span>
                                        <CaretRightOutlined rotate={showSection[i] ? -90 : 90} />
                                    </DropDownLabel>
                                    {showSection[i] && (
                                        <DropDownContent>
                                            {selectedFundsByLang[i].map((fund: any) => {
                                                return (
                                                    <Row
                                                        key={fund.Fund_ID}
                                                        style={{ alignItems: "center" }}
                                                    >
                                                        <Col span={2}>
                                                            <ColoredDot
                                                                backgroundColor={fund.Color}
                                                            />
                                                        </Col>
                                                        <Col span={14}>{fund.Name}</Col>
                                                        <Col span={8}>
                                                            {inputWithSteps(i, fund)}
                                                        </Col>
                                                    </Row>
                                                );
                                            })}
                                        </DropDownContent>
                                    )}
                                </div>
                            );
                        })}
                    </MainSection>
                    <FooterSection
                        backgroundColor={
                            response_data?.outputs["Metadata.Config_BaseColour"]["BackGroundColor"]
                        }
                    >
                        <FooterHeadline>Assets composition</FooterHeadline>
                        {Object.keys(selectedFundsByLang).map((i: any) => {
                            return (
                                <FooterRow key={i}>
                                    <span>
                                        {
                                            response_data?.outputs[
                                                "Metadata.Input_Category" + i + "_Label"
                                            ]
                                        }
                                    </span>
                                    <span
                                        style={{
                                            fontWeight: "700"
                                        }}
                                    >
                                        {totalPercentage(selectedFundsByLang[i]) + "%"}
                                    </span>
                                </FooterRow>
                            );
                        })}
                        <HrDivider />
                        <TotalSection>
                            <SmallerText>Total: </SmallerText>
                            <BoldText>
                                {totalPercentage(
                                    Object.keys(selectedFundsByLang).reduce(function (res, v) {
                                        return res.concat(selectedFundsByLang[v]);
                                    }, [])
                                ) + "%"}
                            </BoldText>
                            <RegularText> / 100% </RegularText>
                        </TotalSection>

                        <CenteredDiv>
                            <PageButton
                                onClick={() => {
                                    checkForRecommended() ? getStats() : setShowWarningModal(true);
                                }}
                                disabled={
                                    totalPercentage(
                                        Object.keys(selectedFundsByLang).reduce(function (res, v) {
                                            return res.concat(selectedFundsByLang[v]);
                                        }, [])
                                    ) !== 100
                                }
                                type="primary"
                            >
                                {pageButton}
                            </PageButton>
                        </CenteredDiv>
                    </FooterSection>
                </Container>
                {
                    <FundSelection
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        applyColorForEachFund={applyColorForEachFund}
                        prevStateEn={prevStateEn}
                        prevStateZh={prevStateZh}
                        prevStateEnArray={prevStateEnArray}
                        prevStateZhArray={prevStateZhArray}
                        onCloseX={onCloseX}
                        isLangChanged={isLangChanged}
                        setIsLangChanged={setIsLangChanged}
                        setPrevStateEn={setPrevStateEn}
                        setPrevStateZh={setPrevStateZh}
                        setPrevStateEnArray={setPrevStateEnArray}
                        setPrevStateZhArray={setPrevStateZhArray}
                    />
                }
            </DefaultLayout>
        </React.Fragment>
    );
};

const Container = styled.div<{ backgroundThemeColor: string }>`
    background-color: #fff;
    display: flex;
    flex-flow: column;
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
        background-color: snow;
        color: black;
        height: auto;
        display: grid;
        place-items: center;
        padding-top: 13px;
        padding-bottom: 11px;
        width: auto;
        & span {
            font-size: 16px;
            line-height: 18px !important;
            word-break: break-word;
            font-weight: 700;
        }
        :hover {
            background-color: snow;
            border-color: ${(props: ThemeColorProps) =>
                props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
            color: ${(props: ThemeColorProps) =>
                props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
        }
        &:disabled {
            :hover {
                filter: none;
                border-color: transparent;
            }
            background-color: snow;
            color: darkgrey;
        }
    }
    .ant-modal,
    .ant-modal-content {
        height: auto;
        width: 100vw;
        margin: 0;
        top: 0;
        border-radius: 0px;
        dispay: none;
        padding: 0px;
    }
    .ant-input-number-sm {
        border-radius: 0px;
    }
    .ant-input-number:hover {
        border-color: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
    }
    .ant-input-number-focused {
        border-color: ${(props: ThemeColorProps) =>
            props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
    }
`;

const WarningModal = styled(Modal)`
    .ant-modal,
    .ant-modal-content {
        border-radius: 2px;
        padding: 0px;
    }
`;

const HrDivider = styled.div`
    width: 100%;
    height: 1px;
    border-width: 0;
    color: white;
    background-color: white;
`;

const ColoredDot = styled.span<{ backgroundColor: string }>`
    height: 8px;
    width: 8px;
    background-color: ${(props: ThemeColorProps) => props.backgroundColor || "#fff"};
    border-radius: 50%;
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
`;

const FooterSection = styled.div<{ backgroundColor: string }>`
    padding: 20px;
    background-color: ${(props: ThemeColorProps) => props.backgroundColor || "#201a3d"};
    gap: 20px;
    display: grid;
`;

const FooterHeadline = styled.div`
    font-weight: 700;
    font-size: 20px;
    color: white;
`;

const FooterRow = styled.div`
    display: flex;
    justify-content: space-between;
    color: white;
`;

const CenteredDiv = styled.div`
    justify-self: center;
    align-self: center;
`;

const TotalSection = styled.div`
    text-align: end;
    color: white;
`;

const SmallerText = styled.span`
    font-size: 14px;
`;

const RegularText = styled.span`
    font-size: 18px;
`;

const BoldText = styled.span`
    font-weight: 700;
    font-size: 18px;
`;

const TopSection = styled.div<{ backgroundColor: string }>`
    background-color: ${(props: ThemeColorProps) => props.backgroundColor || "#3b8cff"};
    padding: 17px;
    gap: 8px;
    display: grid;
`;

const TopSectionText = styled.span`
    font-weight: 400;
    font-size: 16px;
`;

const LabelsDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TopSectionThinText = styled.span`
    font-weight: 400;
    font-size: 14px;
`;

const TopSectionBoldText = styled.span`
    font-weight: 700;
    font-size: 14px;
`;

const PageIntroDiv = styled.div`
    font-weight: 700;
    font-size: 20px;
    padding: 20px;
`;

const MainSection = styled.div`
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const DropDownLabel = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
`;

const DropDownContent = styled.div`
    background-color: #f8f8f8;
    border: 1px solid #d9d9d9;
    padding: 20px;
    display: grid;
    gap: 10px;
`;

const IconPlacement = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    cursor: pointer;
`;

const PageButton = styled(Button)`
    height: auto;
    font-weight: 700;
    padding: 10px 30px;
    border-radius: 2px;
`;

const ModalHeader = styled.div`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalTitle = styled.span<{ color: string }>`
    color: ${(props: ThemeColorProps) => props.color || "rgba(59, 140, 255, 1)"};
    font-weight: 700;
    font-size: 16px;
`;

const ModalContent = styled.div`
    padding: 20px;
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
`;

const ModalFooter = styled.div`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export default ConstructPortfolio;
