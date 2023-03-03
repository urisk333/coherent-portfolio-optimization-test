import React, { FC, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, LabelList } from "recharts";
import styled from "styled-components";
import createReactClass from "create-react-class";

interface StackedBarProps {
    yearStatValue: any;
    year5data: YearsProps[] | any;
    year10data: YearsProps[] | any;
    year20data: YearsProps[] | any;
    legendContent: LegendContentProps[];
}

interface YearsProps {
    "Column J": string;
    "Max Sharpe": number;
    "Min Var": number;
    Selected: number;
}

interface LegendContentProps {
    name: string;
    key: number;
    abb: string;
    color?: string;
}

const StackedBarChart: FC<StackedBarProps> = (props) => {
    const { yearStatValue, year5data, year10data, year20data, legendContent } = props;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [responsiveFontSize, setResposiveFontSize] = useState("10px");
    const [loaded, setLoaded] = useState(false);
    const yearStatValueStr: keyof YearsProps = yearStatValue;

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    });

    useEffect(() => {
        if (windowWidth < 450) {
            if (windowWidth < 780) {
                setResposiveFontSize("6px");
            } else setResposiveFontSize("8px");
        } else setResposiveFontSize("10px");
    }, [windowWidth]);

    function nFormatter(num: number) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "K" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        const item = lookup
            .slice()
            .reverse()
            .find(function (item) {
                return num >= item.value;
            });
        return item ? "$" + (num / item.value).toFixed(1).replace(rx, "$1") + item.symbol : "0";
    }

    function formatYAxis(value: any) {
        if (value === 0) return "Worst case";
        return value;
    }

    const legendContentTemp = legendContent
        ?.filter((i: LegendContentProps) => i.abb === "Selected" || i.abb === yearStatValue)
        .map((j: LegendContentProps) => {
            return {
                ...j,
                color: j.key === 1 ? "#9C43FF" : "#3B8CFF"
            };
        });

    const year5dataTemp = [
        {
            name: "Year 5",
            trans: year5data?.find((i: YearsProps) => i["Column J"] === "Min")?.Selected,
            minToMed: year5data?.find((i: YearsProps) => i["Column J"] === "Median")?.Selected,
            medToMax: year5data?.find((i: YearsProps) => i["Column J"] === "Max")?.Selected,
            transDrugi: year5data?.find((i: YearsProps) => i["Column J"] === "Min")[
                yearStatValueStr
            ],
            minToMedDrugi: year5data?.find((i: YearsProps) => i["Column J"] === "Median")[
                yearStatValueStr
            ],
            medToMaxDrugi: year5data?.find((i: YearsProps) => i["Column J"] === "Max")[
                yearStatValueStr
            ]
        }
    ];

    const year10dataTemp = [
        {
            name: "Year 10",
            trans: year10data?.find((i: YearsProps) => i["Column J"] === "Min")?.Selected,
            minToMed: year10data?.find((i: YearsProps) => i["Column J"] === "Median")?.Selected,
            medToMax: year10data?.find((i: YearsProps) => i["Column J"] === "Max")?.Selected,
            transDrugi: year10data?.find((i: YearsProps) => i["Column J"] === "Min")[
                yearStatValueStr
            ],
            minToMedDrugi: year10data?.find((i: YearsProps) => i["Column J"] === "Median")[
                yearStatValueStr
            ],
            medToMaxDrugi: year10data?.find((i: YearsProps) => i["Column J"] === "Max")[
                yearStatValueStr
            ]
        }
    ];

    const year20dataTemp = [
        {
            name: "Year 20",
            trans: year20data?.find((i: YearsProps) => i["Column J"] === "Min")?.Selected,
            minToMed: year20data?.find((i: YearsProps) => i["Column J"] === "Median")?.Selected,
            medToMax: year20data?.find((i: YearsProps) => i["Column J"] === "Max")?.Selected,
            transDrugi: year20data?.find((i: YearsProps) => i["Column J"] === "Min")[
                yearStatValueStr
            ],
            minToMedDrugi: year20data?.find((i: YearsProps) => i["Column J"] === "Median")[
                yearStatValueStr
            ],
            medToMaxDrugi: year20data?.find((i: YearsProps) => i["Column J"] === "Max")[
                yearStatValueStr
            ]
        }
    ];

    // To avoid overlapping between graph and legend
    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 100);
    }, []);

    const CustomLabel = createReactClass({
        render: function () {
            return (
                <text x={0} y={0} dy={22} dx={28} fill={"#666"}>
                    Best case
                </text>
            );
        }
    });

    return (
        <>
            {loaded && (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={[...year5dataTemp, ...year10dataTemp, ...year20dataTemp]}
                        margin={{
                            top: 30,
                            right: 20,
                            left: 0,
                            bottom: 15
                        }}
                    >
                        <XAxis dataKey="name" />
                        <YAxis
                            domain={["dataMin", "dataMax"]}
                            tickLine={false}
                            ticks={[0]}
                            tickFormatter={formatYAxis}
                            label={<CustomLabel />}
                        />

                        <Bar dataKey="trans" stackId="a" fill="transparent" legendType="none" />
                        <Bar dataKey="minToMed" stackId="a" fill="rgba(156, 67, 255, 1)">
                            <LabelList
                                dataKey="trans"
                                position="insideBottom"
                                fill="white"
                                formatter={(e: number) => {
                                    return nFormatter(e);
                                }}
                                style={{
                                    fontWeight: 700,
                                    fontSize: responsiveFontSize
                                }}
                                offset={1}
                            />
                        </Bar>
                        <Bar dataKey="medToMax" stackId="a" fill="rgba(104, 0, 220, 1)">
                            <LabelList
                                dataKey="minToMed"
                                position="insideBottom"
                                fill="white"
                                formatter={(e: number) => {
                                    return nFormatter(e);
                                }}
                                style={{
                                    fontWeight: 700,
                                    fontSize: responsiveFontSize
                                }}
                                offset={1}
                            />
                            <LabelList
                                dataKey="medToMax"
                                position="top"
                                fill="black"
                                formatter={(e: number) => {
                                    return nFormatter(e);
                                }}
                                style={{
                                    fontWeight: 700,
                                    fontSize: responsiveFontSize
                                }}
                                offset={1}
                            />
                        </Bar>
                        <Bar
                            dataKey="transDrugi"
                            stackId="b"
                            fill="transparent"
                            legendType="none"
                        />
                        <Bar dataKey="minToMedDrugi" stackId="b" fill="rgba(59, 140, 255, 1)">
                            <LabelList
                                dataKey="transDrugi"
                                position="insideBottom"
                                fill="white"
                                formatter={(e: number) => {
                                    return nFormatter(e);
                                }}
                                style={{
                                    fontWeight: 700,
                                    fontSize: responsiveFontSize
                                }}
                                offset={1}
                            />
                        </Bar>
                        <Bar dataKey="medToMaxDrugi" stackId="b" fill="rgba(0, 92, 223, 1)">
                            <LabelList
                                dataKey="minToMedDrugi"
                                position="insideBottom"
                                fill="white"
                                formatter={(e: number) => {
                                    return nFormatter(e);
                                }}
                                style={{
                                    fontWeight: 700,
                                    fontSize: responsiveFontSize
                                }}
                                offset={1}
                            />
                            <LabelList
                                dataKey="medToMaxDrugi"
                                position="top"
                                fill="black"
                                formatter={(e: number) => {
                                    return nFormatter(e);
                                }}
                                style={{
                                    fontWeight: 700,
                                    fontSize: responsiveFontSize
                                }}
                                offset={1}
                            />
                        </Bar>
                        <Legend
                            iconType="circle"
                            content={() => {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            marginTop: "10px"
                                        }}
                                    >
                                        {legendContentTemp.map(
                                            (e: LegendContentProps, index: number) => (
                                                <li
                                                    key={`item-${index}`}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        width: "50%"
                                                    }}
                                                >
                                                    <ColoredDot
                                                        backgroundColor={e.color}
                                                        style={{
                                                            marginTop: "8px"
                                                        }}
                                                    />
                                                    {e.name}
                                                </li>
                                            )
                                        )}
                                    </div>
                                );
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </>
    );
};

export default StackedBarChart;

const ColoredDot = styled.span<{ backgroundColor?: string }>`
    min-height: 8px;
    min-width: 8px;
    max-width: 8px;
    max-height: 8px;
    background-color: ${(props: any) => props?.backgroundColor || "#fff"};
    border-radius: 50%;
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
`;
