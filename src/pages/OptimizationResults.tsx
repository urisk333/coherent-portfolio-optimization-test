import styled from "styled-components";
import DefaultLayout from "../components/Layout/DefaultLayout";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Loader from "../components/Loader/Loader";
import { Button, Col, Modal, Row, Select } from "antd";
import { ReactComponent as EfficientFrontierGraph } from "../assets/svgs/efficientFrontierGraph.svg";
import PieChartGraph from "../components/Recharts/PieChartGraph";
import { mediaQueries } from "../styles/sc-theme";
import StackedBarChart from "../components/Recharts/StackedBarChart";
import { IFundsProps } from "./FundSelection";
import { ThemeColorProps } from "./Questionnaire";

export interface QuestionnaireTypes {
    Age: number;
    SpouseQ: string;
    KidsQ: string;
    NewInvestorQ: string;
    DownturnQ: string;
}

interface DataForComparison {
    fund_id?: string;
    value?: number;
}

function OptimizationResults() {
    const { response_data } = useSelector((state: any) => state.optimization);
    const { selected_funds_en, selected_funds_zh } = useSelector((state: any) => state.funds);
    const { construct_data } = useSelector((state: any) => state.construct);

    const navigate = useNavigate();
    const { language } = useSelector((state: any) => state.language);

    const pageHeader = response_data?.outputs["Metadata.Input_Page5_Title"];
    const modalHeader = response_data?.outputs["Metadata.Input_Page6_Title"];

    const firstSection = response_data?.outputs["Metadata.Input_Page6_Section1_Label"];
    const secondSection = response_data?.outputs["Metadata.Input_Page6_Section2_Label"];
    const thirdSection = response_data?.outputs["Metadata.Input_Page6_Section3_Label"];

    const [loading, setLoading] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [selectedFundsByLang, setSelectedFundsByLang] = useState<any>([]);

    const langList = response_data?.outputs["languages"];
    const productTitle = response_data?.outputs["Metadata.Input_ProductTitle"];
    const pageIntro = response_data?.outputs["Metadata.Input_Page5_Instruction"];

    const miniTableTitle1: string = response_data?.outputs["Metadata.Input_Port1_Label"];
    const miniTableTitle2: string = response_data?.outputs["Metadata.Input_Port2_Label"];
    const miniTableTitle3: string = response_data?.outputs["Metadata.Input_Port3_Label"];

    const statTitle1 = response_data?.outputs["Metadata.Input_Stat1_Label"];
    const statTitle2 = response_data?.outputs["Metadata.Input_Stat2_Label"];
    const statTitle3 = response_data?.outputs["Metadata.Input_Stat3_Label"];

    const btnLabel = response_data?.outputs["Metadata.Config_Page6_Button"];
    const heightOfThePage = document.getElementById("root")?.clientHeight;

    useEffect(() => {
        if (language === "EN" || language === "") {
            setSelectedFundsByLang(selected_funds_en);
        } else {
            setSelectedFundsByLang(selected_funds_zh);
        }
    }, [language, selected_funds_en, selected_funds_zh]);

    const miniTable = (
        tableTitle: string,
        value: number,
        returnValue: number,
        riskValue: number,
        sharpeValue: number
    ) => {
        const [show, setShow] = useState(false);
        const [portfolioValue, setPortfolioValue] = useState<number>(value);
        const portfolioOpt = [
            { label: response_data?.outputs["Metadata.Input_Port2_Label"], value: 1, key: 1 },
            { label: response_data?.outputs["Metadata.Input_Port3_Label"], value: 2, key: 2 }
        ];

        const [modalReturnValue, setModalReturnValue] = useState("");
        const [modalRiskValue, setModalRiskValue] = useState("");
        const [modalSharpeValue, setModalSharpeValue] = useState("");

        const [dataForComparison, setDataForComparison] = useState<
            { [key: string]: number }[] | undefined
        >();
        const [yearStatValue, setYearStatValue] = useState("");

        useEffect(() => {
            switch (portfolioValue) {
                case 1:
                    setModalReturnValue(construct_data.outputs["stat.MinVarReturn"]);
                    setModalRiskValue(construct_data.outputs["stat.MinVarRisk"]);
                    setModalSharpeValue(construct_data.outputs["stat.MinSharpe"]);
                    setDataForComparison(construct_data.outputs["stat.MinVarWeights"]);
                    setYearStatValue("Min Var");
                    break;
                case 2:
                    setModalReturnValue(construct_data.outputs["stat.MaxSharpeReturn"]);
                    setModalRiskValue(construct_data.outputs["stat.MaxSharpeRisk"]);
                    setModalSharpeValue(construct_data.outputs["stat.MaxSharpe"]);
                    setDataForComparison(construct_data.outputs["stat.MaxSharpeWeights"]);
                    setYearStatValue("Max Sharpe");
                    break;
                default:
                // code block
            }
        }, [portfolioValue]);

        function getDataForComparisonChart(
            data: IFundsProps[],
            newData: { [key: string]: number }[] | undefined
        ) {
            const temp: DataForComparison[] | undefined = [];
            if (newData?.length) {
                for (const [k, v] of Object.entries(newData[0])) {
                    temp.push({ fund_id: k, value: v });
                }
            }

            function getPercentage(temp: DataForComparison[] | any[], j: IFundsProps) {
                return +(
                    temp?.find((l: DataForComparison) => l.fund_id === j.Fund_ID).value * 100
                ).toFixed(1);
            }

            if (temp?.length) {
                return Object.keys(data)
                    .map((i: any) => {
                        return {
                            [i]: data[i]?.map((j: IFundsProps) => {
                                return {
                                    ...j,
                                    Percentage: temp ? getPercentage(temp, j) : null
                                };
                            })
                        };
                    })
                    .reduce((obj, item) => Object.assign(obj, item), {});
            } else return [];
        }

        return (
            <div>
                <HeaderRow>
                    <BoldText>{tableTitle}</BoldText>
                    {portfolioValue != 0 && (
                        <OutlinedButton
                            onClick={() => {
                                setShow(true);
                                setPortfolioValue(portfolioValue);
                            }}
                            backgroundthemecolor={
                                response_data?.outputs["Metadata.Config_ThemeColour"][
                                    "BackGroundColor"
                                ]
                            }
                        >
                            Compare
                        </OutlinedButton>
                    )}
                </HeaderRow>
                <Rows>
                    <DivideText>
                        <RegularText>{statTitle1}</RegularText>
                        <BoldText>{returnValue && (returnValue * 100).toFixed(1) + "%"}</BoldText>
                    </DivideText>
                    <DivideText>
                        <RegularText>{statTitle2}</RegularText>
                        <BoldText>{riskValue && (riskValue * 100).toFixed(1) + "%"}</BoldText>
                    </DivideText>
                    <DivideText>
                        <RegularText>{statTitle3}</RegularText>
                        <BoldText>{sharpeValue && sharpeValue?.toFixed(1)}</BoldText>
                    </DivideText>
                </Rows>
                <Modal
                    title={<PageHeader>{modalHeader}</PageHeader>}
                    open={show}
                    onCancel={() => {
                        setShow(false);
                        setPortfolioValue(value);
                    }}
                    getContainer={false}
                    footer={null}
                >
                    <ModalContainer>
                        <Row
                            style={{
                                position: "sticky",
                                height: "112px",
                                display: "flex",
                                justifyContent: "space-between",
                                border: "1px solid #d9d9d9",
                                top: "0",
                                backgroundColor: "white",
                                zIndex: "1"
                            }}
                        >
                            <Col
                                span={12}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignContent: "space-between",
                                    padding: "15px",
                                    borderRight: "1px solid #d9d9d9"
                                }}
                            >
                                <BoldTextCentered>{miniTableTitle1}</BoldTextCentered>
                                <Button
                                    type="primary"
                                    style={{
                                        display: "inline-grid"
                                    }}
                                >
                                    {btnLabel}
                                </Button>
                            </Col>
                            <Col
                                span={12}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignContent: "space-between",
                                    padding: "15px",
                                    backgroundColor: "rgba(242, 242, 242, 0.6)"
                                }}
                            >
                                <Select
                                    value={portfolioOpt?.find(
                                        (i: any) => i.value === portfolioValue
                                    )}
                                    style={{ width: "100%" }}
                                    onChange={(e: any) => {
                                        setPortfolioValue(e);
                                    }}
                                    options={portfolioOpt}
                                    dropdownRender={(menu) => <StyledMenu>{menu}</StyledMenu>}
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        display: "inline-grid"
                                    }}
                                >
                                    {btnLabel}
                                </Button>
                            </Col>
                        </Row>
                        <HeaderStyle>
                            <BoldTextHeader>{firstSection}</BoldTextHeader>
                        </HeaderStyle>
                        <Row style={{ height: "fit-content" }}>
                            <Col span={12}>
                                <PieChartGraph
                                    data={Object.keys(selectedFundsByLang).reduce(function (
                                        res,
                                        v
                                    ) {
                                        return res.concat(selectedFundsByLang[v]);
                                    },
                                    [])}
                                    selectedFundsByLang={selectedFundsByLang}
                                    response_data={response_data}
                                />
                            </Col>
                            <Col span={12}>
                                <PieChartGraph
                                    data={Object.keys(
                                        getDataForComparisonChart(
                                            selectedFundsByLang,
                                            dataForComparison
                                        )
                                    ).reduce(function (res, v: any) {
                                        return res.concat(
                                            getDataForComparisonChart(
                                                selectedFundsByLang,
                                                dataForComparison
                                            )[v]
                                        );
                                    }, [])}
                                    selectedFundsByLang={getDataForComparisonChart(
                                        selectedFundsByLang,
                                        dataForComparison
                                    )}
                                    response_data={response_data}
                                />
                            </Col>
                        </Row>
                        <HeaderStyle>
                            <BoldTextHeader>{secondSection}</BoldTextHeader>
                        </HeaderStyle>
                        <StatSubtitle>
                            <div>{statTitle1}</div>
                            <Row>
                                <Col
                                    span={12}
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700"
                                    }}
                                >
                                    {(construct_data.outputs["stat.CurVarReturn"] * 100).toFixed(1)}
                                    %
                                </Col>
                                <Col
                                    span={12}
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700"
                                    }}
                                >
                                    {modalReturnValue && (+modalReturnValue * 100).toFixed(1) + "%"}
                                </Col>
                            </Row>
                        </StatSubtitle>
                        <StatSubtitle>
                            <div>{statTitle2}</div>
                            <Row>
                                <Col
                                    span={12}
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700"
                                    }}
                                >
                                    {(construct_data.outputs["stat.CurVarRisk"] * 100).toFixed(1)}%
                                </Col>
                                <Col
                                    span={12}
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700"
                                    }}
                                >
                                    {modalRiskValue && (+modalRiskValue * 100).toFixed(1) + "%"}
                                </Col>
                            </Row>
                        </StatSubtitle>
                        <StatSubtitle>
                            <div>{statTitle3}</div>
                            <Row>
                                <Col
                                    span={12}
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700"
                                    }}
                                >
                                    {construct_data.outputs["stat.CurSharpe"].toFixed(1)}
                                </Col>
                                <Col
                                    span={12}
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700"
                                    }}
                                >
                                    {modalSharpeValue && (+modalSharpeValue).toFixed(1)}
                                </Col>
                            </Row>
                        </StatSubtitle>
                        <HeaderStyle>
                            <BoldTextHeader>{thirdSection}</BoldTextHeader>
                            <ThinSubtitle>(Assume $100,000 of initial investment)</ThinSubtitle>
                        </HeaderStyle>
                        <div
                            style={
                                construct_data?.outputs["stat.20Yr_Stats"][4].Selected < 3000000
                                    ? { height: "400px" }
                                    : { height: "800px" }
                            }
                        >
                            <StackedBarChart
                                yearStatValue={yearStatValue}
                                year5data={construct_data?.outputs["stat.5Yr_Stats"]}
                                year10data={construct_data?.outputs["stat.10Yr_Stats"]}
                                year20data={construct_data?.outputs["stat.20Yr_Stats"]}
                                legendContent={[
                                    { name: miniTableTitle1, key: 1, abb: "Selected" },
                                    { name: miniTableTitle2, key: 2, abb: "Min Var" },
                                    { name: miniTableTitle3, key: 3, abb: "Max Sharpe" }
                                ]}
                            />
                        </div>
                    </ModalContainer>
                </Modal>
            </div>
        );
    };

    return (
        <React.Fragment>
            <Header
                productTitle={productTitle}
                pageHeader={pageHeader}
                langList={langList}
                isLangChanged={false}
                setIsLangChanged={() => {}}
                onBack={() => {
                    navigate("/construct-portfolio");
                }}
            />
            {loading && <Loader heightOfThePage={heightOfThePage} />}
            <DefaultLayout>
                <Container
                    backgroundThemeColor={
                        response_data?.outputs["Metadata.Config_ThemeColour"]["BackGroundColor"]
                    }
                >
                    <PageIntroMessage
                        color={
                            response_data?.outputs["Metadata.Config_ThemeColour"]["BackGroundColor"]
                        }
                    >
                        {pageIntro}
                    </PageIntroMessage>
                    <div>
                        <ThinText>
                            This allocations give you the lowest level of risk (the Minimum Variance
                            Portfolio) and the highest level of return per unit of risk (the Maximum
                            Sharpe Ratio Portfolio). You can select to compare one of these
                            portfolios below against your current portfolio.
                        </ThinText>
                        <br />
                        {!showMore && (
                            <ClickableText
                                color={
                                    response_data?.outputs["Metadata.Config_ThemeColour"][
                                        "BackGroundColor"
                                    ]
                                }
                                onClick={() => {
                                    setShowMore(true);
                                }}
                            >
                                More details
                            </ClickableText>
                        )}
                        {showMore && (
                            <div>
                                <BoldTextHeader>Portfolio optimization analysis</BoldTextHeader>
                                <br />
                                <EfficientFrontierGraph />

                                <br />
                                <br />
                                <ThinText>
                                    Portfolio optimization is a process of choosing the proportions
                                    of various assets to be held in a portfolio in such a way as to
                                    make the portfolio better than any other combination according
                                    to the selected objective function such as maximizing
                                    risk-adjusted return. <br /> <br />
                                    Portfolio optimization determines target weights for portfolio
                                    assets based on mathematical models that can use either
                                    historical or forecasted data as inputs. <br />
                                    <br />
                                    Optimization results are not guarantees of future performance.
                                </ThinText>
                            </div>
                        )}
                        <br />
                        {showMore && (
                            <ClickableText
                                color={
                                    response_data?.outputs["Metadata.Config_ThemeColour"][
                                        "BackGroundColor"
                                    ]
                                }
                                onClick={() => {
                                    setShowMore(false);
                                }}
                            >
                                Less details
                            </ClickableText>
                        )}
                        {showMore && <HrDivider />}
                    </div>
                    {miniTable(
                        miniTableTitle1,
                        0,
                        construct_data.outputs["stat.CurVarReturn"],
                        construct_data.outputs["stat.CurVarRisk"],
                        construct_data.outputs["stat.CurSharpe"]
                    )}
                    {miniTable(
                        miniTableTitle2,
                        1,
                        construct_data.outputs["stat.MinVarReturn"],
                        construct_data.outputs["stat.MinVarRisk"],
                        construct_data.outputs["stat.MinSharpe"]
                    )}
                    {miniTable(
                        miniTableTitle3,
                        2,
                        construct_data.outputs["stat.MaxSharpeReturn"],
                        construct_data.outputs["stat.MaxSharpeRisk"],
                        construct_data.outputs["stat.MaxSharpe"]
                    )}
                </Container>
            </DefaultLayout>
        </React.Fragment>
    );
}

const Container = styled.div<{ backgroundThemeColor: string }>`
    padding: 20px;
    background-color: #fff;
    display: flex;
    flex-flow: column;
    gap: 20px;
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
    .ant-modal .ant-modal-header {
        margin-bottom: -1px;
        filter: drop-shadow(rgba(0, 0, 0, 0.1) 0px 1px 5px);
    }
`;

const OutlinedButton = styled(Button)<{ backgroundthemecolor: string }>`
    :not(:disabled):hover {
        border-color: ${(props: ThemeColorProps) =>
            props.backgroundthemecolor || "rgba(59, 140, 255, 1)"};
        color: ${(props: ThemeColorProps) => props.backgroundthemecolor || "rgba(59, 140, 255, 1)"};
    }
`;

const PageIntroMessage = styled.div<{ color: string }>`
    color: ${(props: ThemeColorProps) => props.color || "rgba(59, 140, 255, 1)"};
    font-size: 20px;
    font-weight: 700;
    line-height: 120%;
`;

const ThinText = styled.div`
    font-size: 14px;
    font-weight: 400;
`;

const BoldText = styled.div`
    font-size: 14px;
    font-weight: 700;
`;

const BoldTextCentered = styled.div`
    font-size: 14px;
    font-weight: 700;
    width: 100%;
    text-align: center;
`;

const BoldTextHeader = styled.div`
    font-size: 16px;
    font-weight: 700;
`;

const RegularText = styled.div`
    font-size: 14px;
`;

const ClickableText = styled.div<{ color: string }>`
    color: ${(props: ThemeColorProps) => props.color || "#3b8cff"};
    text-decoration: underline;
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
`;

const DivideText = styled.div`
    display: flex;
    justify-content: space-between;
`;

const HeaderRow = styled.div`
    display: flex;
    border: 1px solid #d9d9d9;
    background-color: #f5f5f5;
    padding: 15px;
    align-items: center;
    justify-content: space-between;
`;

const Rows = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    border: 1px solid #d9d9d9;
    border-top: none;
`;

const HrDivider = styled.div`
    width: 100%;
    height: 1px;
    border-width: 0;
    color: #979797;
    background-color: #979797;
    margin-top: 10px;
`;

const PageHeader = styled.div`
    color: black;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 1px;
    line-height: 19px;
    padding: 20px;
    text-align: center;
    text-transform: uppercase;
    word-break: break-word;
    border: 1px solid #d9d9d9;
`;

const HeaderStyle = styled.div`
    background-color: rgba(240, 240, 240, 1);
    padding: 15px;
    border: 1px solid #d9d9d9;
`;

const ThinSubtitle = styled.div`
    font-size: 12px;
    font-weight: 500;
`;

const StatSubtitle = styled.div`
    padding: 10px;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: 1px solid #d9d9d9;
    gap: 10px;
    display: flex;
    flex-direction: column;
`;

const StyledMenu = styled.div`
    .ant-select-item-option-content {
        white-space: pre-wrap;
    }
`;

const ModalContainer = styled.div(() => {
    const mQ = mediaQueries("sm")`
    border: 1px solid #e7e7e7;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    margin: 0px auto 0px auto;
    max-width: 600px;
  `;
    return `${mQ}`;
});

export default OptimizationResults;
