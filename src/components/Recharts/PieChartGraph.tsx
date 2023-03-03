import React, { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import { ISelectedFundsData } from "../../store/selectedFunds";
import { IFundsProps } from "../../pages/FundSelection";
import { ThemeColorProps } from "../../pages/Questionnaire";

interface PiePartProps {
    name: string;
    value: string;
    color: string;
}

interface PieChartGraphProps {
    data: ISelectedFundsData[];
    selectedFundsByLang?: ISelectedFundsData;
    response_data?: any;
}

const PiePart = (props: PiePartProps) => {
    const { name, value, color } = props;
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
                <RegularText>
                    <ColoredDot backgroundColor={color} />
                </RegularText>
                <RegularText>{name}</RegularText>
            </div>
            <RegularText>{(value || 0) + "%"}</RegularText>
        </div>
    );
};

function totalPercentage(data: IFundsProps[]) {
    return data
        ?.reduce((accumulator: number, currentValue: IFundsProps) => {
            return accumulator + (+currentValue.Percentage || 0);
        }, 0)
        .toFixed(1);
}

const PieChartGraph: FC<PieChartGraphProps> = (props) => {
    const { data, selectedFundsByLang, response_data } = props;

    const COLORS = data?.map((i: any) => i.Color);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <>
                <PieChart
                    width={180}
                    height={200}
                    style={{
                        marginRight: "auto",
                        marginLeft: "auto"
                    }}
                >
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="Percentage"
                    >
                        {data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
                {selectedFundsByLang && (
                    <DescriptionSection>
                        {Object.keys(selectedFundsByLang).map((i: any) => {
                            return (
                                <div key={i}>
                                    <div
                                        style={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <BoldText>
                                            {
                                                response_data?.outputs[
                                                    "Metadata.Input_Category" + i + "_Label"
                                                ]
                                            }
                                        </BoldText>
                                        <BoldText>
                                            {totalPercentage(selectedFundsByLang[i]) + "%"}
                                        </BoldText>
                                    </div>
                                    <HrDivider />
                                    {selectedFundsByLang[i]?.map((i: IFundsProps) => {
                                        return (
                                            <PiePart
                                                key={i.Name}
                                                name={i.Name}
                                                value={i.Percentage}
                                                color={i.Color}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </DescriptionSection>
                )}
            </>
        </ResponsiveContainer>
    );
};

export default PieChartGraph;

const RegularText = styled.div`
    font-size: 12px;
    color: rgba(115, 110, 120, 1);
`;

const BoldText = styled.div`
    font-size: 14px;
    font-weight: 700;
`;

const HrDivider = styled.div`
    width: 100%;
    height: 1px;
    border-width: 0;
    background-color: rgba(201, 198, 205, 1);
    margin-top: 5px;
    margin-bottom: 5px;
`;

const DescriptionSection = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
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
