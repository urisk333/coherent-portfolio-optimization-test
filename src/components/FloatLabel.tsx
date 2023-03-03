import React from "react";
import { FC, ReactNode, useState } from "react";
import styled from "styled-components";

interface DefaultLayoutProps {
    children: ReactNode;
    label: string;
    value?: any;
    name: string;
}

const FloatLabel: FC<DefaultLayoutProps> = (props) => {
    const [focus, setFocus] = useState(false);
    const { children, label, value } = props;

    const labelClass = focus || (value && value.length !== 0) ? "label label-float" : "label";

    return (
        <div className="float-label" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
            <Label className={labelClass}>{label}</Label>
            {children}
        </div>
    );
};

export default FloatLabel;

const Label = styled.label`
    color: rgb(38, 38, 38);
    display: block;
    font-Size: 18px;
    font-Weight: 700;
    line-Height: normal;
    margin-Bottom: 6px;
    max-Width: 100%
}
`;
