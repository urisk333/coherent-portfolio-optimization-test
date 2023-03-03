import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { AppDispatch } from "../store";
import { setSelectedFundsData } from "../store/selectedFunds";
import { useNavigate } from "react-router-dom";
import { setSelectedFundsArrayData } from "../store/selectedFundsArray";
import { mediaQueries } from "../styles/sc-theme";
import { ThemeColorProps } from "./Questionnaire";

interface IFundSelectionProps {
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean) => void;
    prevStateEn: INewObjectProps;
    prevStateZh: INewObjectProps;
    prevStateEnArray: IFundsProps[];
    prevStateZhArray: IFundsProps[];
    onCloseX: boolean;
    isLangChanged: boolean;
    setIsLangChanged: (isLangChanged: boolean) => void;
    applyColorForEachFund?: any;
    setPrevStateEn: (prevStateEn: INewObjectProps) => void;
    setPrevStateZh: (prevStateZh: INewObjectProps) => void;
    setPrevStateEnArray: (prevStateEnArray: IFundsProps[]) => void;
    setPrevStateZhArray: (prevStateZhArray: IFundsProps[]) => void;
}

export interface IFundsProps {
    [x: string]: any;
    Name: string;
    Link: string;
    Fund_ID: string;
    Color: string;
    Percentage: string;
}

export interface INewObjectProps {
    [key: string]: IFundsProps[];
}

const initialState = {
    Name: "",
    Link: "",
    Fund_ID: "",
    Color: "",
    Percentage: ""
};

function FundSelection({
    isModalVisible,
    setIsModalVisible,
    prevStateEn,
    prevStateZh,
    prevStateEnArray,
    prevStateZhArray,
    onCloseX,
    isLangChanged,
    setIsLangChanged,
    applyColorForEachFund,
    setPrevStateEn,
    setPrevStateZh,
    setPrevStateEnArray,
    setPrevStateZhArray
}: IFundSelectionProps) {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { response_data } = useSelector((state: any) => state.optimization);
    const { language } = useSelector((state: any) => state.language);
    const { selected_funds_en, selected_funds_zh } = useSelector((state: any) => state.funds);
    const { selected_funds_en_array, selected_funds_zh_array } = useSelector(
        (state: any) => state.fundsArray
    );
    const [fundsEnData, setFundsEnData] = useState<IFundsProps[]>([initialState]);
    const [fundsZhData, setFundsZhData] = useState<IFundsProps[]>([initialState]);
    const [buttonsCreated, setButtonsCreated] = useState<boolean>(false);
    const [selectedEnFunds, setSelectedEnFunds] = useState<IFundsProps[]>([
        ...selected_funds_en_array
    ]);
    const [selectedZhFunds, setSelectedZhFunds] = useState<IFundsProps[]>([
        ...selected_funds_zh_array
    ]);
    const [buttonID, setButtonID] = useState<string>();
    const [arrayLengthCheck, setArrayLengthCheck] = useState<boolean>(false);

    const pageHeader = response_data?.outputs["Metadata.Input_Page3_Title"];
    const fundSelectionInstruction = response_data?.outputs["Metadata.Input_Page3_Instruction"];
    const clearAllButton = response_data?.outputs["Metadata.Config_Page3_Button1"];
    const applyButton = response_data?.outputs["Metadata.Config_Page3_Button2"];

    const backgroundColor = response_data?.outputs["Metadata.Config_ThemeColour"].BackGroundColor;

    // --> TO DO: Refactor the code to avoid repeating the same code lines

    const createButtons = () => {
        Object.keys(response_data?.outputs).forEach((item: string) => {
            const fixedInputCategoryLabel = item.replace(/[0-9]/g, "");

            if (fixedInputCategoryLabel === "Metadata.Input_Category_Label") {
                const newBttnId = item.match(/(\d+)/)?.shift();
                const newBttn = document.createElement("button");
                newBttn.setAttribute("id", `${newBttnId}`);
                newBttn.setAttribute("name", "fund-button");
                document.querySelector("#button-container")?.appendChild(newBttn);
            }

            setButtonsCreated(true);
        });
    };

    useEffect(() => {
        if (isModalVisible && buttonID === undefined) {
            Object.keys(response_data?.outputs).forEach((item: string) => {
                const key = "1";
                if (item === "Metadata.Input_Category" + key + "_Funds") {
                    const fundsEN = response_data?.outputs[item].map((fund: IFundsProps) => {
                        return fund;
                    });

                    setFundsEnData(fundsEN);
                } else if (item === "Metadata.Input_Category" + key + "_Funds_ZH_TW") {
                    const fundsZH = response_data?.outputs[item].map((fund: IFundsProps) => {
                        return fund;
                    });

                    setFundsZhData(fundsZH);
                }
            });
        }
    }, [isModalVisible]);

    function getFunds(bttnId: string) {
        if (bttnId) {
            Object.keys(response_data?.outputs).forEach((item: string) => {
                if (item === "Metadata.Input_Category" + bttnId + "_Funds") {
                    const fundsEN = response_data?.outputs[item].map((fund: IFundsProps) => {
                        return fund;
                    });

                    setFundsEnData(fundsEN);
                } else if (item === "Metadata.Input_Category" + bttnId + "_Funds_ZH_TW") {
                    const fundsZH = response_data?.outputs[item].map((fund: IFundsProps) => {
                        return fund;
                    });

                    setFundsZhData(fundsZH);
                }
            });
        }
        setButtonID(bttnId);
    }

    useEffect(() => {
        if (isModalVisible && !buttonsCreated) {
            createButtons();
        }
    }, [isModalVisible]);

    useEffect(() => {
        const createdButtons = document.getElementsByName("fund-button");

        if (buttonID === undefined) {
            Array.from(createdButtons).map((bttn) => {
                if (bttn.id === "1") {
                    const style = document.createElement("style");
                    style.innerHTML =
                        ".blueBttnClass  { color: #fff; margin-right: 8px; height: 40px; border: 1px;" +
                        `background-color: ${backgroundColor};` +
                        "border-style: solid; border-color: #e7e7e7; font-size: 14px; font-weight: bold; padding: 10px 16px 10px 16px; border-radius: 2px;}" +
                        "button:hover {cursor: pointer}; overflow-x: hidden;";
                    document.head.appendChild(style);
                    bttn.className = "blueBttnClass";
                }
                if (bttn.id !== "1") {
                    const style = document.createElement("style");
                    style.innerHTML =
                        ".whiteBttnClass  { color: #262626; background-color: #fff; margin-right: 8px; height: 40px; border: 1px;" +
                        "border-style: solid; border-color: #e7e7e7; font-size: 14px; padding: 10px 16px 10px 16px; border-radius: 2px;}" +
                        "button:hover {cursor: pointer}; overflow-x: hidden;";
                    document.head.appendChild(style);
                    bttn.className = "whiteBttnClass";
                }
            });
        } else {
            Array.from(createdButtons).map((bttn) => {
                if (buttonID === bttn.id) {
                    const style = document.createElement("style");
                    style.innerHTML =
                        ".blueDynamicBttnClass  { color: #fff; margin-right: 8px; height: 40px; border: 1px;" +
                        `background-color: ${backgroundColor};` +
                        "border-style: solid; border-color: #e7e7e7; font-size: 14px; font-weight: bold; padding: 10px 16px 10px 16px; border-radius: 2px;}" +
                        "button:hover {cursor: pointer}; overflow-x: hidden;";
                    document.head.appendChild(style);
                    bttn.className = "blueDynamicBttnClass";
                } else {
                    const style = document.createElement("style");
                    style.innerHTML =
                        ".whiteDynamicBttnClass  { color: #262626; background-color: #fff; margin-right: 8px; height: 40px; border: 1px;" +
                        "border-style: solid; border-color: #e7e7e7; font-size: 14px; padding: 10px 16px 10px 16px; border-radius: 2px;}" +
                        "button:hover {cursor: pointer}; overflow-x: hidden;";
                    document.head.appendChild(style);
                    bttn.className = "whiteDynamicBttnClass";
                }
            });
        }
    }, [isModalVisible, buttonID]);

    useEffect(() => {
        if (isModalVisible) {
            const createdButtons = document.getElementsByName("fund-button");
            createdButtons.forEach((bttn) => {
                Object.keys(response_data?.outputs).forEach((item: string) => {
                    if (item === "Metadata.Input_Category" + `${bttn.id}` + "_Label") {
                        bttn.innerText = response_data?.outputs[item];
                        bttn.onclick = async () => getFunds(bttn.id);
                    }
                });

                const fundsStateSpan = document.createElement("span");
                fundsStateSpan.setAttribute("id", `${bttn.id}`);
                fundsStateSpan.setAttribute("name", "fund-button-span");
                bttn.appendChild(fundsStateSpan);
                const createdButtonsSpan = document.getElementsByName("fund-button-span");

                if (buttonID === undefined) {
                    Array.from(createdButtonsSpan).map((span) => {
                        if (span.id === "1") {
                            if (selected_funds_en_array.length || selected_funds_zh_array.length) {
                                const spanStyle = document.createElement("style");
                                spanStyle.innerHTML =
                                    ".spanBttnClass { display: inline-block; color: #262626; height: 20px; width: 28px; border-radius: 15px;" +
                                    "background-color: #fff; margin-left: 10px; padding-top: -2px; line-height: 20px; }";
                                document.head.appendChild(spanStyle);
                                span.className = "spanBttnClass";
                                span.innerText = selected_funds_en["1"]?.length;
                            } else {
                                const spanStyle = document.createElement("style");
                                spanStyle.innerHTML = ".spanBlankBttnClass { display: none; }";
                                document.head.appendChild(spanStyle);
                                span.className = "spanBlankBttnClass";
                            }
                        } else {
                            Array.from(createdButtonsSpan).map((span) => {
                                if (span.id !== "1") {
                                    if (
                                        selected_funds_en[span.id]?.length &&
                                        (selected_funds_en_array.length ||
                                            selected_funds_zh_array.length)
                                    ) {
                                        const spanStyle = document.createElement("style");
                                        spanStyle.innerHTML =
                                            ".spanOtherBttnClass { display: inline-block; color: #262626; height: 20px; width: 28px; border-radius: 15px;" +
                                            "background-color: #DEF0FF; margin-left: 10px; padding-top: -2px; line-height: 20px; }";
                                        document.head.appendChild(spanStyle);
                                        span.className = "spanOtherBttnClass";
                                        span.innerText = selected_funds_en[span.id]?.length;
                                    } else {
                                        const spanStyle = document.createElement("style");
                                        spanStyle.innerHTML =
                                            ".spanOtherBlankBttnClass { display: none; }";
                                        document.head.appendChild(spanStyle);
                                        span.className = "spanOtherBlankBttnClass";
                                    }
                                }
                            });
                        }
                    });
                } else {
                    Array.from(createdButtonsSpan).map((span) => {
                        if (span.id === buttonID) {
                            if (
                                selected_funds_en[span.id]?.length &&
                                (selected_funds_en_array.length || selected_funds_zh_array.length)
                            ) {
                                const spanStyle = document.createElement("style");
                                spanStyle.innerHTML =
                                    ".spanClickedBttnClass { display: inline-block; color: #262626; height: 20px; width: 28px; border-radius: 15px;" +
                                    "background-color: #fff; margin-left: 10px; padding-top: -2px; line-height: 20px; }";
                                document.head.appendChild(spanStyle);
                                span.className = "spanClickedBttnClass";
                                span.innerText = selected_funds_en[span.id]?.length;
                            } else {
                                const spanStyle = document.createElement("style");
                                spanStyle.innerHTML = ".spanClickedBttnClass { display: none; }";
                                document.head.appendChild(spanStyle);
                                span.className = "spanClickedBttnClass";
                            }
                        } else {
                            if (
                                selected_funds_en[span.id]?.length &&
                                (selected_funds_en_array.length || selected_funds_zh_array.length)
                            ) {
                                const spanStyle = document.createElement("style");
                                spanStyle.innerHTML =
                                    ".spanUnclickedBttnClass { display: inline-block; color: #262626; height: 20px; width: 28px; border-radius: 15px;" +
                                    "background-color: #DEF0FF; margin-left: 10px; padding-top: -2px; line-height: 20px; }";
                                document.head.appendChild(spanStyle);
                                span.className = "spanUnclickedBttnClass";
                                span.innerText = selected_funds_en[span.id]?.length;
                            } else {
                                const spanStyle = document.createElement("style");
                                spanStyle.innerHTML = ".spanUnclickedBttnClass { display: none; }";
                                document.head.appendChild(spanStyle);
                                span.className = "spanUnclickedBttnClass";
                            }
                        }
                    });
                }
            });
        }
    }, [isModalVisible, selected_funds_en_array, selected_funds_zh_array, buttonID]);

    async function selectFunds(value: string, checked: boolean) {
        let objEn: INewObjectProps = {};
        let objZh: INewObjectProps = {};
        if (language === "EN" || language === "") {
            if (buttonID === undefined) {
                const key = "1";

                if (checked) {
                    const selectedFund = response_data?.outputs[
                        "Metadata.Input_Category1_Funds"
                    ].find((item: IFundsProps) => {
                        if (item.Fund_ID === value) {
                            return item;
                        }
                    });
                    const equalZhFund = response_data?.outputs[
                        "Metadata.Input_Category1_Funds_ZH_TW"
                    ].find((zhFund: IFundsProps) => {
                        if (zhFund.Fund_ID === selectedFund.Fund_ID) {
                            return zhFund;
                        }
                    });
                    selectedEnFunds.push(selectedFund);
                    selectedZhFunds.push(equalZhFund);
                    dispatch(
                        setSelectedFundsArrayData({
                            selected_funds_en_array: [...selectedEnFunds],
                            selected_funds_zh_array: [...selectedZhFunds]
                        })
                    );

                    objEn = { [key]: [...selectedEnFunds] };
                    objZh = { [key]: [...selectedZhFunds] };

                    const fixedEnFunds = objEn[key].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (key === fundNumber) {
                            return value;
                        }
                    });
                    const filteredEnFunds = fixedEnFunds?.filter((item) => item !== undefined);

                    const fixedZhFunds = objZh[key].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (key === fundNumber) {
                            return value;
                        }
                    });
                    const filteredZhFunds = fixedZhFunds?.filter((item) => item !== undefined);
                    dispatch(
                        setSelectedFundsData({
                            selected_funds_en: {
                                ...selected_funds_en,
                                [key]: [...filteredEnFunds]
                            },
                            selected_funds_zh: {
                                ...selected_funds_zh,
                                [key]: [...filteredZhFunds]
                            }
                        })
                    );
                } else {
                    selectedEnFunds.map((item) => {
                        if (item.Fund_ID === value) {
                            const index = selectedEnFunds?.indexOf(item);
                            if (index > -1) {
                                selectedEnFunds?.splice(index, 1);
                            }
                            selectedZhFunds.map((zhFund) => {
                                if (zhFund.Fund_ID === item.Fund_ID) {
                                    const index = selectedZhFunds?.indexOf(zhFund);
                                    if (index > -1) {
                                        selectedZhFunds?.splice(index, 1);
                                    }
                                }
                            });
                        }
                    });
                    dispatch(
                        setSelectedFundsArrayData({
                            selected_funds_en_array: [...selectedEnFunds],
                            selected_funds_zh_array: [...selectedZhFunds]
                        })
                    );
                    objEn = { [key]: [...selectedEnFunds] };
                    objZh = { [key]: [...selectedZhFunds] };

                    const fixedEnFunds = objEn[key].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (key === fundNumber) {
                            return value;
                        }
                    });
                    const filteredEnFunds = fixedEnFunds?.filter((item) => item !== undefined);

                    const fixedZhFunds = objZh[key].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (key === fundNumber) {
                            return value;
                        }
                    });
                    const filteredZhFunds = fixedZhFunds?.filter((item) => item !== undefined);
                    dispatch(
                        setSelectedFundsData({
                            selected_funds_en: {
                                ...selected_funds_en,
                                [key]: [...filteredEnFunds]
                            },
                            selected_funds_zh: {
                                ...selected_funds_zh,
                                [key]: [...filteredZhFunds]
                            }
                        })
                    );
                }
            } else if (buttonID !== "") {
                if (checked) {
                    const selectedFund = fundsEnData?.find((item: IFundsProps) => {
                        if (item.Fund_ID === value) {
                            return item;
                        }
                    });
                    const equalZhFund = response_data?.outputs[
                        "Metadata.Input_Category" + `${buttonID}` + "_Funds_ZH_TW"
                    ].find((zhFund: IFundsProps) => {
                        if (zhFund.Fund_ID === selectedFund?.Fund_ID) {
                            return zhFund;
                        }
                    });
                    selectedEnFunds.push(selectedFund!);
                    selectedZhFunds.push(equalZhFund);

                    dispatch(
                        setSelectedFundsArrayData({
                            selected_funds_en_array: [...selectedEnFunds],
                            selected_funds_zh_array: [...selectedZhFunds]
                        })
                    );

                    objEn = { [buttonID]: [...selectedEnFunds] };
                    objZh = { [buttonID]: [...selectedZhFunds] };

                    const fixedEnFunds = objEn[buttonID].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (buttonID === fundNumber) {
                            return value;
                        }
                    });
                    const filteredEnFunds = fixedEnFunds?.filter((item) => item !== undefined);

                    const fixedZhFunds = objZh[buttonID].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (buttonID === fundNumber) {
                            return value;
                        }
                    });
                    const filteredZhFunds = fixedZhFunds?.filter((item) => item !== undefined);
                    dispatch(
                        setSelectedFundsData({
                            selected_funds_en: {
                                ...selected_funds_en,
                                [buttonID]: [...filteredEnFunds]
                            },
                            selected_funds_zh: {
                                ...selected_funds_zh,
                                [buttonID]: [...filteredZhFunds]
                            }
                        })
                    );
                } else {
                    selectedEnFunds.map((item) => {
                        if (item.Fund_ID === value) {
                            const index = selectedEnFunds?.indexOf(item);
                            if (index > -1) {
                                selectedEnFunds?.splice(index, 1);
                            }
                            selectedZhFunds.map((zhFund) => {
                                if (zhFund.Fund_ID === item.Fund_ID) {
                                    const index = selectedZhFunds?.indexOf(zhFund);
                                    if (index > -1) {
                                        selectedZhFunds?.splice(index, 1);
                                    }
                                }
                            });
                        }
                    });
                    dispatch(
                        setSelectedFundsArrayData({
                            selected_funds_en_array: [...selectedEnFunds],
                            selected_funds_zh_array: [...selectedZhFunds]
                        })
                    );

                    objEn = { [buttonID]: [...selectedEnFunds] };
                    objZh = { [buttonID]: [...selectedZhFunds] };

                    const fixedEnFunds = objEn[buttonID].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (buttonID === fundNumber) {
                            return value;
                        }
                    });
                    const filteredEnFunds = fixedEnFunds?.filter((item) => item !== undefined);

                    const fixedZhFunds = objZh[buttonID].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (buttonID === fundNumber) {
                            return value;
                        }
                    });
                    const filteredZhFunds = fixedZhFunds?.filter((item) => item !== undefined);
                    dispatch(
                        setSelectedFundsData({
                            selected_funds_en: {
                                ...selected_funds_en,
                                [buttonID]: [...filteredEnFunds]
                            },
                            selected_funds_zh: {
                                ...selected_funds_zh,
                                [buttonID]: [...filteredZhFunds]
                            }
                        })
                    );
                }
            }
        } else {
            if (buttonID === undefined) {
                const key = "1";

                if (checked) {
                    const selectedFund = response_data?.outputs[
                        "Metadata.Input_Category1_Funds_ZH_TW"
                    ].find((item: IFundsProps) => {
                        if (item.Fund_ID === value) {
                            return item;
                        }
                    });
                    const equalEnFund = response_data?.outputs[
                        "Metadata.Input_Category1_Funds"
                    ].find((enFund: IFundsProps) => {
                        if (enFund.Fund_ID === selectedFund.Fund_ID) {
                            return enFund;
                        }
                    });
                    selectedZhFunds.push(selectedFund);
                    selectedEnFunds.push(equalEnFund);
                    dispatch(
                        setSelectedFundsArrayData({
                            selected_funds_en_array: [...selectedEnFunds],
                            selected_funds_zh_array: [...selectedZhFunds]
                        })
                    );

                    objEn = { [key]: [...selectedEnFunds] };
                    objZh = { [key]: [...selectedZhFunds] };

                    const fixedEnFunds = objEn[key].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (key === fundNumber) {
                            return value;
                        }
                    });
                    const filteredEnFunds = fixedEnFunds?.filter((item) => item !== undefined);

                    const fixedZhFunds = objZh[key].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (key === fundNumber) {
                            return value;
                        }
                    });
                    const filteredZhFunds = fixedZhFunds?.filter((item) => item !== undefined);
                    dispatch(
                        setSelectedFundsData({
                            selected_funds_en: {
                                ...selected_funds_en,
                                [key]: [...filteredEnFunds]
                            },
                            selected_funds_zh: {
                                ...selected_funds_zh,
                                [key]: [...filteredZhFunds]
                            }
                        })
                    );
                } else {
                    selectedZhFunds.map((item) => {
                        if (item.Fund_ID === value) {
                            const index = selectedZhFunds.indexOf(item);
                            if (index > -1) {
                                selectedZhFunds.splice(index, 1);
                            }
                            selectedEnFunds.map((enFund) => {
                                if (enFund.Fund_ID === item.Fund_ID) {
                                    const index = selectedEnFunds?.indexOf(enFund);
                                    if (index > -1) {
                                        selectedEnFunds?.splice(index, 1);
                                    }
                                }
                            });
                        }
                    });
                }
                dispatch(
                    setSelectedFundsArrayData({
                        selected_funds_en_array: [...selectedEnFunds],
                        selected_funds_zh_array: [...selectedZhFunds]
                    })
                );

                objEn = { [key]: [...selectedEnFunds] };
                objZh = { [key]: [...selectedZhFunds] };

                const fixedEnFunds = objEn[key].map((value: IFundsProps) => {
                    const fundIdString = value.Fund_ID;
                    const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                    if (key === fundNumber) {
                        return value;
                    }
                });
                const filteredEnFunds = fixedEnFunds?.filter((item) => item !== undefined);

                const fixedZhFunds = objZh[key].map((value: IFundsProps) => {
                    const fundIdString = value.Fund_ID;
                    const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                    if (key === fundNumber) {
                        return value;
                    }
                });
                const filteredZhFunds = fixedZhFunds?.filter((item) => item !== undefined);
                dispatch(
                    setSelectedFundsData({
                        selected_funds_en: {
                            ...selected_funds_en,
                            [key]: [...filteredEnFunds]
                        },
                        selected_funds_zh: {
                            ...selected_funds_zh,
                            [key]: [...filteredZhFunds]
                        }
                    })
                );
            } else if (buttonID !== "") {
                if (checked) {
                    const selectedFund = fundsZhData?.find((item: IFundsProps) => {
                        if (item.Fund_ID === value) {
                            return item;
                        }
                    });
                    const equalEnFund = response_data?.outputs[
                        "Metadata.Input_Category" + `${buttonID}` + "_Funds"
                    ].find((enFund: IFundsProps) => {
                        if (enFund.Fund_ID === selectedFund?.Fund_ID) {
                            return enFund;
                        }
                    });
                    selectedZhFunds.push(selectedFund!);
                    selectedEnFunds.push(equalEnFund);
                    dispatch(
                        setSelectedFundsArrayData({
                            selected_funds_en_array: [...selectedEnFunds],
                            selected_funds_zh_array: [...selectedZhFunds]
                        })
                    );

                    objEn = { [buttonID]: [...selectedEnFunds] };
                    objZh = { [buttonID]: [...selectedZhFunds] };

                    const fixedEnFunds = objEn[buttonID].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (buttonID === fundNumber) {
                            return value;
                        }
                    });
                    const filteredEnFunds = fixedEnFunds?.filter((item) => item !== undefined);

                    const fixedZhFunds = objZh[buttonID].map((value: IFundsProps) => {
                        const fundIdString = value.Fund_ID;
                        const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                        if (buttonID === fundNumber) {
                            return value;
                        }
                    });
                    const filteredZhFunds = fixedZhFunds?.filter((item) => item !== undefined);
                    dispatch(
                        setSelectedFundsData({
                            selected_funds_en: {
                                ...selected_funds_en,
                                [buttonID]: [...filteredEnFunds]
                            },
                            selected_funds_zh: {
                                ...selected_funds_zh,
                                [buttonID]: [...filteredZhFunds]
                            }
                        })
                    );
                } else {
                    selectedZhFunds.map((item) => {
                        if (item.Fund_ID === value) {
                            const index = selectedZhFunds?.indexOf(item);
                            if (index > -1) {
                                selectedZhFunds?.splice(index, 1);
                            }
                            selectedEnFunds.map((enFund) => {
                                if (enFund.Fund_ID === item.Fund_ID) {
                                    const index = selectedEnFunds?.indexOf(enFund);
                                    if (index > -1) {
                                        selectedEnFunds?.splice(index, 1);
                                    }
                                }
                            });
                        }
                    });
                }
                dispatch(
                    setSelectedFundsArrayData({
                        selected_funds_en_array: [...selectedEnFunds],
                        selected_funds_zh_array: [...selectedZhFunds]
                    })
                );

                objEn = { [buttonID]: [...selectedEnFunds] };
                objZh = { [buttonID]: [...selectedZhFunds] };

                const fixedEnFunds = objEn[buttonID].map((value: IFundsProps) => {
                    const fundIdString = value.Fund_ID;
                    const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                    if (buttonID === fundNumber) {
                        return value;
                    }
                });
                const filteredEnFunds = fixedEnFunds?.filter((item) => item !== undefined);

                const fixedZhFunds = objZh[buttonID].map((value: IFundsProps) => {
                    const fundIdString = value.Fund_ID;
                    const fundNumber = fundIdString.match(/(\d+)/)?.shift();
                    if (buttonID === fundNumber) {
                        return value;
                    }
                });
                const filteredZhFunds = fixedZhFunds?.filter((item) => item !== undefined);
                dispatch(
                    setSelectedFundsData({
                        selected_funds_en: {
                            ...selected_funds_en,
                            [buttonID]: [...filteredEnFunds]
                        },
                        selected_funds_zh: {
                            ...selected_funds_zh,
                            [buttonID]: [...filteredZhFunds]
                        }
                    })
                );
            }
        }
    }

    const clearAllCheckboxes = () => {
        const values = document.querySelectorAll("input:checked") as NodeListOf<HTMLInputElement>;
        Array.from(values).map((item) => {
            item.checked = false;
        });
    };

    const enableAllTextInputs = () => {
        const values = document.querySelectorAll(
            "input[type=text]"
        ) as NodeListOf<HTMLInputElement>;
        Array.from(values).map((item) => {
            item.disabled = false;
        });
    };

    const updateNodelist = () => {
        const values = document.getElementsByTagName("input");
        return values;
    };

    useEffect(() => {
        if (language === "EN" || language === "") {
            const values = updateNodelist();

            Array.from(values).map((item) => {
                Object.keys(selected_funds_en).map((key) => {
                    if (buttonID === undefined) {
                        selected_funds_en["1"]?.forEach((fund: IFundsProps) => {
                            if (selected_funds_en["1"].length < 2) {
                                item.disabled = false;
                            } else {
                                if (fund?.Fund_ID !== item.value && item.checked !== true) {
                                    item.disabled = true;
                                }
                            }
                        });
                    } else {
                        if (buttonID === key) {
                            const fundKeyNum = item.value.match(/\d+/)?.shift();
                            if (buttonID !== fundKeyNum) {
                                const fixedValue = item.value.replace(/[0-9]/g, `${buttonID}`);
                                item.value = fixedValue;
                            }
                            selected_funds_en[buttonID]?.forEach((fund: IFundsProps) => {
                                if (selected_funds_en[buttonID].length < 2) {
                                    item.disabled = false;
                                } else {
                                    if (fund?.Fund_ID !== item.value && item.checked !== true) {
                                        item.disabled = true;
                                    }
                                }
                            });
                        }
                    }
                });
            });
            enableAllTextInputs();
        } else {
            const values = updateNodelist();
            Array.from(values).map((item) => {
                Object.keys(selected_funds_zh).map((key) => {
                    if (buttonID === undefined) {
                        selected_funds_zh["1"]?.forEach((fund: IFundsProps) => {
                            if (selected_funds_zh["1"].length < 2) {
                                item.disabled = false;
                            } else {
                                if (fund?.Fund_ID !== item.value && item.checked !== true) {
                                    item.disabled = true;
                                }
                            }
                        });
                    } else {
                        if (buttonID === key) {
                            const fundKeyNum = item.value.match(/\d+/)?.shift();
                            if (buttonID !== fundKeyNum) {
                                const fixedValue = item.value.replace(/[0-9]/g, `${buttonID}`);
                                item.value = fixedValue;
                            }
                            selected_funds_zh[buttonID]?.forEach((fund: IFundsProps) => {
                                if (selected_funds_zh[buttonID].length < 2) {
                                    item.disabled = false;
                                } else {
                                    if (fund?.Fund_ID !== item.value && item.checked !== true) {
                                        item.disabled = true;
                                    }
                                }
                            });
                        }
                    }
                });
            });
            enableAllTextInputs();
        }
    }, [selectedEnFunds.length, selectedZhFunds.length]);

    useEffect(() => {
        if (isModalVisible) {
            if (language === "EN" || language === "") {
                const values = updateNodelist();
                Array.from(values).map((item) => {
                    Object.keys(selected_funds_en).map((key) => {
                        if (buttonID === undefined) {
                            selected_funds_en["1"]?.forEach((fund: IFundsProps) => {
                                if (fund?.Fund_ID === item.value) {
                                    item.checked = true;
                                    item.disabled = false;
                                }
                                if (
                                    fund?.Fund_ID !== item.value &&
                                    item.checked !== true &&
                                    selected_funds_en["1"].length > 1
                                ) {
                                    item.disabled = true;
                                }
                            });
                        } else {
                            if (buttonID === key) {
                                const fundKeyNum = item.value.match(/\d+/)?.shift();
                                if (buttonID !== fundKeyNum) {
                                    const fixedValue = item.value.replace(/[0-9]/g, `${buttonID}`);
                                    item.value = fixedValue;
                                }
                                selected_funds_en[buttonID]?.forEach((fund: IFundsProps) => {
                                    if (fund?.Fund_ID === item.value) {
                                        item.checked = true;
                                        item.disabled = false;
                                    }
                                    if (
                                        fund?.Fund_ID !== item.value &&
                                        item.checked !== true &&
                                        selected_funds_en[buttonID].length > 1
                                    ) {
                                        item.disabled = true;
                                    }
                                });
                            }
                        }
                    });
                });
                enableAllTextInputs();
            } else {
                const values = updateNodelist();
                Array.from(values).map((item) => {
                    Object.keys(selected_funds_zh).map((key) => {
                        if (buttonID === undefined) {
                            selected_funds_zh["1"]?.forEach((fund: IFundsProps) => {
                                if (fund?.Fund_ID === item.value) {
                                    item.checked = true;
                                    item.disabled = false;
                                }
                                if (
                                    fund?.Fund_ID !== item.value &&
                                    item.checked !== true &&
                                    selected_funds_zh["1"].length > 1
                                ) {
                                    item.disabled = true;
                                }
                            });
                        } else {
                            if (buttonID === key) {
                                const fundKeyNum = item.value.match(/\d+/)?.shift();
                                if (buttonID !== fundKeyNum) {
                                    const fixedValue = item.value.replace(/[0-9]/g, `${buttonID}`);
                                    item.value = fixedValue;
                                }
                                selected_funds_zh[buttonID]?.forEach((fund: IFundsProps) => {
                                    if (fund?.Fund_ID === item.value) {
                                        item.checked = true;
                                        item.disabled = false;
                                    }
                                    if (
                                        fund?.Fund_ID !== item.value &&
                                        item.checked !== true &&
                                        selected_funds_zh[buttonID].length > 1
                                    ) {
                                        item.disabled = true;
                                    }
                                });
                            }
                        }
                    });
                });
                enableAllTextInputs();
            }
            setIsLangChanged(false);
        }
    }, [isModalVisible, selected_funds_en, selected_funds_zh, buttonID, language]);

    const removeNodeCheckedValues = () => {
        if (!isLangChanged) {
            const values = document.getElementsByTagName("input");

            Array.from(values).forEach((item) => {
                item.checked = false;
            });
        }
    };

    const removeNodeDisabledValues = () => {
        if (!isLangChanged) {
            const values = document.getElementsByTagName("input");

            Array.from(values).forEach((item) => {
                item.disabled = false;
            });
        }
    };

    const prevStateOnX = () => {
        if (onCloseX) {
            dispatch(
                setSelectedFundsData({
                    selected_funds_en: { ...prevStateEn },
                    selected_funds_zh: { ...prevStateZh }
                })
            );

            dispatch(
                setSelectedFundsArrayData({
                    selected_funds_en_array: [...prevStateEnArray],
                    selected_funds_zh_array: [...prevStateZhArray]
                })
            );
            setSelectedEnFunds([...prevStateEnArray]);
            setSelectedZhFunds([...prevStateZhArray]);
            removeNodeDisabledValues();
        }
    };

    const clearPrevStateOnX = () => {
        setPrevStateEn({});
        setPrevStateZh({});
        setPrevStateEnArray([]);
        setPrevStateZhArray([]);
    };

    const initArrayLengthCheck = () => {
        if (selectedEnFunds?.length === 0 || selectedZhFunds?.length === 0) {
            setArrayLengthCheck(false);
        } else {
            if (language === "EN" || language === "") {
                const arrayLengthCheck = Object.keys(selected_funds_en).map((key) => {
                    return selected_funds_en[key];
                });

                arrayLengthCheck.map((arr) => {
                    const lastKey =
                        Object.keys(selected_funds_en)[Object.keys(selected_funds_en).length - 1];
                    if (buttonID === undefined) {
                        if (selectedEnFunds?.length < 4) {
                            setArrayLengthCheck(false);
                        } else {
                            setArrayLengthCheck(true);
                        }
                    } else {
                        if (
                            arr.length === 2 &&
                            selectedEnFunds?.length === +lastKey * 2 &&
                            lastKey !== "1"
                        ) {
                            setArrayLengthCheck(true);
                        } else setArrayLengthCheck(false);
                    }
                });
            } else {
                const arrayLengthCheck = Object.keys(selected_funds_zh).map((key) => {
                    return selected_funds_zh[key];
                });

                arrayLengthCheck.map((arr) => {
                    const lastKey =
                        Object.keys(selected_funds_zh)[Object.keys(selected_funds_zh).length - 1];
                    if (buttonID === undefined) {
                        if (selectedEnFunds?.length < 4) {
                            setArrayLengthCheck(false);
                        } else {
                            setArrayLengthCheck(true);
                        }
                    } else {
                        if (
                            arr.length === 2 &&
                            selectedZhFunds?.length === +lastKey * 2 &&
                            lastKey !== "1"
                        ) {
                            setArrayLengthCheck(true);
                        } else setArrayLengthCheck(false);
                    }
                });
            }
        }
    };

    useEffect(() => {
        initArrayLengthCheck();
    }, [selectedEnFunds.length, selectedZhFunds.length, buttonID]);

    const modalFundItemBox = (item: IFundsProps) => {
        return (
            <div key={item.Fund_ID}>
                <FundSelectionItem key={item.Fund_ID}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%"
                        }}
                    >
                        <Input
                            id={item.Fund_ID}
                            type="checkbox"
                            className="checkbox"
                            value={item.Fund_ID}
                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                selectFunds(e.target.value, e.target.checked);
                            }}
                            backgroundThemeColor={backgroundColor}
                        ></Input>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%"
                            }}
                        >
                            <div
                                style={{
                                    marginLeft: "18px"
                                }}
                            >
                                {item.Name}
                            </div>
                            <a
                                style={{
                                    display: "flex",
                                    justifySelf: "end",
                                    width: "auto",
                                    color: "#262626",
                                    textDecoration: "underline",
                                    margin: "0px 14px 0 10px"
                                }}
                                onClick={() => {
                                    window.open(item.Link, "_blank");
                                }}
                            >
                                Link
                            </a>
                        </div>
                    </div>
                </FundSelectionItem>
                <ItemDivider />
            </div>
        );
    };

    return (
        <Container>
            <Modal
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    prevStateOnX();
                    removeNodeCheckedValues();
                }}
                footer={null}
                getContainer={false}
                title={<ModalHeader>{pageHeader}</ModalHeader>}
            >
                <ModalContainer style={{ padding: "0px 20px 6px 20px" }}>
                    <ModalIntroMessage
                        color={
                            response_data?.outputs["Metadata.Config_ThemeColour"]?.BackGroundColor
                        }
                    >
                        {fundSelectionInstruction}
                    </ModalIntroMessage>
                    <div
                        id="button-container"
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            overflowY: "hidden",
                            overflowX: "auto",
                            paddingBottom: "12px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }}
                    ></div>
                    <ModalDivider />
                    <FundSelectionBox>
                        {language === "EN" || language === ""
                            ? !fundsEnData[0].Name
                                ? response_data?.outputs["Metadata.Input_Category1_Funds"].map(
                                      (item: IFundsProps) => {
                                          return modalFundItemBox(item);
                                      }
                                  )
                                : fundsEnData?.map((item) => {
                                      return modalFundItemBox(item);
                                  })
                            : !fundsZhData[0].Name
                            ? response_data?.outputs["Metadata.Input_Category1_Funds_ZH_TW"].map(
                                  (item: IFundsProps) => {
                                      return modalFundItemBox(item);
                                  }
                              )
                            : fundsZhData?.map((item) => {
                                  return modalFundItemBox(item);
                              })}
                    </FundSelectionBox>
                </ModalContainer>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "20px",
                        position: "fixed",
                        bottom: "0",
                        backgroundColor: "white",
                        width: "-webkit-fill-available",
                        borderTop: "1px solid #d9d9d9"
                    }}
                >
                    <Button
                        type="default"
                        style={{
                            width: "47.5%",
                            height: "44px",
                            fontSize: "16px"
                        }}
                        onClick={() => {
                            clearAllCheckboxes();
                            setSelectedEnFunds([]);
                            setSelectedZhFunds([]);
                            dispatch(
                                setSelectedFundsArrayData({
                                    selected_funds_en_array: [],
                                    selected_funds_zh_array: []
                                })
                            );
                            dispatch(
                                setSelectedFundsData({
                                    selected_funds_en: {},
                                    selected_funds_zh: {}
                                })
                            );
                            clearPrevStateOnX();
                            removeNodeDisabledValues();
                        }}
                    >
                        {clearAllButton}
                    </Button>
                    <Button
                        type="primary"
                        style={{
                            width: "47.5%",
                            height: "44px",
                            fontSize: "16px",
                            backgroundColor: `${
                                arrayLengthCheck
                                    ? response_data?.outputs["Metadata.Config_ThemeColour"]
                                          .BackGroundColor
                                    : "#BDBDBD"
                            }`,
                            color: `${arrayLengthCheck ? "#FFF" : "#ECECEB"}`
                        }}
                        disabled={!arrayLengthCheck}
                        onClick={() => {
                            navigate("/construct-portfolio");
                            setIsModalVisible(false);
                            applyColorForEachFund && applyColorForEachFund();
                        }}
                    >
                        {applyButton}
                    </Button>
                </div>
            </Modal>
        </Container>
    );
}

const ModalHeader = styled.div`
    color: #262626;
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

const FundSelectionBox = styled.div`
    height: calc(100vh - 315px);
    overflow-x: hidden;
    overflow-y: scroll;
`;

const ModalDivider = styled.div`
    width: 100%;
    height: 1px;
    border-width: 0;
    color: #e7e7e7;
    background-color: #e7e7e7;
    margin-top: 4px;
    margin-bottom: 10px;
`;

const ModalIntroMessage = styled.div<{ color: string }>`
    color: ${(props: ThemeColorProps) => props.color || "#3b8cff"};
    font-size: 20px;
    font-weight: 700;
    line-height: 120%;
    text-align: left;
    padding: 12px 0 12px 0;
`;

const FundSelectionItem = styled.div`
    font-size: 14px;
    font-weight: 400;
`;

const ItemDivider = styled.div`
    width: 100%;
    height: 1px;
    border-width: 0;
    color: #e7e7e7;
    background-color: #e7e7e7;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const Input = styled.input<{ backgroundThemeColor: string }>`
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    appearance: none;
    min-width: 24px;
    min-height: 24px;
    border-radius: 2px;
    outline-style: solid;
    outline-color: #e7e7e7;
    outline-width: 1px;
    &:checked {
        background-color: ${(props: any) => props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
        outline-color: ${(props: any) => props.backgroundThemeColor || "rgba(59, 140, 255, 1)"};
    }
    &:disabled {
        background-color: #bdbdbd;
    }
    &:checked:after {
        display: flex;
        justify-content: center;
        content: "✔";
        color: #fff;
        font-size: 18px;
        padding-top: 2px;
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

const Container = styled.div`
    .ant-modal,
    .ant-modal-content {
        height: 100vh;
        width: 100vw;
        margin: 0;
        top: 0;
        border-radius: 0px;
        padding: 0px;
        position: fixed;
    }
    .ant-modal .ant-modal-header {
        margin-bottom: -1px;
        filter: drop-shadow(rgba(0, 0, 0, 0.1) 0px 1px 5px);
    }
`;

export default FundSelection;
