import React, { FC } from "react";
import { GlobalOutlined } from "@ant-design/icons";
import { Button, MenuProps } from "antd";
import { Dropdown } from "antd";
import styled from "styled-components";
import { AppDispatch } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { setOptimizationData } from "../store/optimizationData";
import { setLanguageData } from "../store/languageInfo";

interface IDropdownProps {
    langList: Langlist[];
    setIsLangChanged: (isLangChanged: boolean) => void;
}

interface Langlist {
    abbreviation: string;
    name: string;
}

const DropdownList: FC<any> = ({ langList, setIsLangChanged }: IDropdownProps) => {
    const { response_data, response_meta } = useSelector((state: any) => state.optimization);
    const dispatch: AppDispatch = useDispatch();

    const items: MenuProps["items"] = langList?.map((i: Langlist) => {
        return {
            label: i.name,
            key: i.abbreviation
        };
    });

    const getLanguage = async (language: string) => {
        if (language === "EN") {
            const setNewKeysEn = Object.fromEntries(
                Object.entries(response_data?.outputs?.translations?.en).map(([key, value]) => [
                    `Metadata.${key}`,
                    value
                ])
            );

            Object.entries(setNewKeysEn).map(([key, value]) => {
                if (key === "Metadata.Config_BaseColour") {
                    value = response_data.outputs["Metadata.Config_BaseColour"];
                    setNewKeysEn[key] = value;
                }
                if (key === "Metadata.Config_ThemeColour") {
                    value = response_data.outputs["Metadata.Config_ThemeColour"];
                    setNewKeysEn[key] = value;
                }
                if (key === "Metadata.Input_Category1_Funds") {
                    value = response_data.outputs["Metadata.Input_Category1_Funds"];
                    setNewKeysEn[key] = value;
                }
                if (key === "Metadata.Input_Category1_Funds_ZH_TW") {
                    value = response_data.outputs["Metadata.Input_Category1_Funds_ZH_TW"];
                    setNewKeysEn[key] = value;
                }
                if (key === "Metadata.Input_Category2_Funds") {
                    value = response_data.outputs["Metadata.Input_Category2_Funds"];
                    setNewKeysEn[key] = value;
                }
                if (key === "Metadata.Input_Category2_Funds_ZH_TW") {
                    value = response_data.outputs["Metadata.Input_Category2_Funds_ZH_TW"];
                    setNewKeysEn[key] = value;
                }
                if (key === "Metadata.Output_Risk_Appetite_Translation") {
                    value = response_data.outputs["Metadata.Output_Risk_Appetite_Translation"];
                    setNewKeysEn[key] = value;
                }
            });

            dispatch(
                setOptimizationData({
                    response_data: {
                        ...response_data,
                        outputs: {
                            ...response_data.outputs,
                            languages: response_data.outputs.languages,
                            translations: response_data.outputs.translations,
                            ...setNewKeysEn
                        }
                    },
                    response_meta: response_meta
                })
            );
        } else {
            const setNewKeysZhtw = Object.fromEntries(
                Object.entries(response_data?.outputs?.translations?.zhtw).map(([key, value]) => [
                    `Metadata.${key}`,
                    value
                ])
            );

            Object.entries(setNewKeysZhtw).map(([key, value]) => {
                if (key === "Metadata.Config_BaseColour") {
                    value = response_data.outputs["Metadata.Config_BaseColour"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Config_ThemeColour") {
                    value = response_data.outputs["Metadata.Config_ThemeColour"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Input_Category1_Funds") {
                    value = response_data.outputs["Metadata.Input_Category1_Funds"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Input_Category1_Funds_ZH_TW") {
                    value = response_data.outputs["Metadata.Input_Category1_Funds_ZH_TW"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Input_Category2_Funds") {
                    value = response_data.outputs["Metadata.Input_Category2_Funds"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Input_Category2_Funds_ZH_TW") {
                    value = response_data.outputs["Metadata.Input_Category2_Funds_ZH_TW"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Language1_Abbreviation") {
                    value = response_data.outputs["Metadata.Language1_Abbreviation"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Language1_Name") {
                    value = response_data.outputs["Metadata.Language1_Name"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Language2_Abbreviation") {
                    value = response_data.outputs["Metadata.Language2_Abbreviation"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Language2_Name") {
                    value = response_data.outputs["Metadata.Language2_Name"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Language_Number") {
                    value = response_data.outputs["Metadata.Language_Number"];
                    setNewKeysZhtw[key] = value;
                }
                if (key === "Metadata.Output_Risk_Appetite_Translation") {
                    value = response_data.outputs["Metadata.Output_Risk_Appetite_Translation"];
                    setNewKeysZhtw[key] = value;
                }
            });

            dispatch(
                setOptimizationData({
                    response_data: {
                        ...response_data,
                        outputs: {
                            ...response_data.outputs,
                            languages: response_data.outputs.languages,
                            translations: response_data.outputs.translations,
                            ...setNewKeysZhtw
                        }
                    },
                    response_meta: response_meta
                })
            );
        }
    };

    return (
        <Dropdown
            menu={{
                items,
                selectable: true,
                onClick: async (e) => {
                    await getLanguage(e.key);
                    dispatch(setLanguageData({ language: e.key }));
                    setIsLangChanged(true);
                }
            }}
            trigger={["click"]}
        >
            <Button
                onClick={(e: React.MouseEvent<HTMLElement>) => e.preventDefault()}
                type="text"
                icon={<StyledGlobalOutlined />}
            />
        </Dropdown>
    );
};

export default DropdownList;

const StyledGlobalOutlined = styled(GlobalOutlined)`
    font-size: 20px;
    color: #000000;
    padding-top: 1px;
`;
