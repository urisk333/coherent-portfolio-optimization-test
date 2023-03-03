import React, { FC } from "react";
import { Radio } from "antd";
import FloatLabel from "./FloatLabel";

export interface RadioFieldProps {
    label: string;
    name: string;
    value: string;
    options: OptionsProps[];
    onChange: (e: number) => void;
}

interface OptionsProps {
    label: string;
    value: string;
}

const RadioField: FC<RadioFieldProps> = ({ label, name, onChange, options, value }) => {
    return (
        <FloatLabel label={label} name={name}>
            <Radio.Group
                buttonStyle="solid"
                style={{ display: "flex" }}
                optionType={"button"}
                options={options}
                value={value && options[+value - 1].value}
                onChange={(e) => {
                    //value will be increased index (0 cannot be value in this case)
                    //this is because of the changing languages,
                    //so the value is always the same (number)
                    //and not the letter
                    const temp = options.findIndex((i: any) => i.value === e.target.value);
                    onChange(temp + 1);
                }}
            />
        </FloatLabel>
    );
};

export default RadioField;
