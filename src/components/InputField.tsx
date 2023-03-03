import React, { FC } from "react";
import { InputNumber } from "antd";
import FloatLabel from "./FloatLabel";
import styled from "styled-components";

export interface InputFieldProps {
    label: string;
    name: string;
    value?: string;
    errors?: ErrorMessageProps[];
    language?: string;
    onChange: (e: string) => void;
    onBlur?: () => void;
}

export interface ErrorMessageProps {
    additional_details: string;
    error_category: string;
    error_type: string;
    message: string;
    source_path: string;
}

const InputField: FC<InputFieldProps> = ({
    label,
    name,
    onChange,
    value,
    errors,
    onBlur,
    language
}) => {
    const source =
        language === "EN" || language === ""
            ? "$.Input.calc.Input_Q1_Error"
            : "$.Input.calc.Input_Q1_Error_ZH_TW";

    function getErrorMsg() {
        const temp = errors?.find((i: ErrorMessageProps) => i.source_path === source);

        return temp?.message;
    }

    return (
        <FloatLabel label={label} name={name}>
            <InputNumber
                type="number"
                size="large"
                onInput={(e: string) => {
                    onChange(e);
                }}
                style={{
                    width: "50%",
                    height: "44px"
                }}
                value={value}
                status={errors ? "error" : ""}
                controls={false}
                onBlur={onBlur}
            />
            {errors && <Validation>{getErrorMsg()}</Validation>}
        </FloatLabel>
    );
};

export default InputField;

const Validation = styled.div`
    color: rgb(220, 80, 52);
    font-size: 16px;
    margin-top: 6px;
}
`;
