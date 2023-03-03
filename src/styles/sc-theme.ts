export type ThemeType = typeof theme;

export interface DefaultTheme extends ThemeType {}

export const breakpoints = {
    xs: 375,
    sm: 768,
    md: 1280,
    lg: 1366,
    xl: 1440
};

export const theme = {
    colors: {
        primary: "#201A3D",
        secondary: "#9C43FF",
        action: "#305EB1",
        dark: "#201A3D",
        azureBlue: "#3b8CFF",
        grey: "#f4f4f4",
        grey2: "#4F4F4F",
        grey3: "#6E6E6E",
        grey4: "#BDBDBD",
        grey5: "#E0E0E0",
        grey6: "#DCDCDC",
        grey7: "#8C8C8C",
        grey8: "#F4F4F3",
        grey9: "#F2F2F2",
        grey10: "#BFBFBF",
        grey11: "#D9D9D9",
        pearl: "#ECECEB",
        lightGrey: "#F7F7F7",
        bodyBg: "#FFF",
        inputBorder: "#BDBDBD",
        error: "#DC5034",
        black80: "#262626",
        linkWater: "#F6F8FD",
        portGore: "#201A3D",
        warning: "#E31B23",
        warningBg: "#FBEDEB",
        headerBackground: "#FFFFFF",
        headerColor: "#FFFFFF",
        textLight: "#FFFFFF",
        textDark: "#262626"
    },
    padding: {
        boxStandard: "15px 20px",
        cta: "20px"
    },
    margin: {
        xs: "0.3em",
        sm: "0.5em",
        md: "1em",
        lg: "2em",
        xspx: "16px",
        mdpx: "20px",
        lgpx: "24px",
        cta: "20px",
        xlgpx: "36px"
    },
    font: "Arial",
    boxShadow: {
        variant1: "0px -1px 10px rgba(0, 0, 0, 0.25)"
    },
    fontSize: {
        sm: "12px",
        md: "14px",
        lg: "16px",
        xl: "20px",
        xxl: "28px"
    },
    headerHt: "58px",
    subHeaderHt: "53px",
    footerHt: "66px",
    subFooterHt: "40px",
    isRtl: false
};

export const mediaQueries = (key: keyof typeof breakpoints) => {
    return (style: TemplateStringsArray | string) =>
        `@media (min-width: ${breakpoints[key]}px) { ${style} }`;
};

export const mediaQueriesMax = (key: keyof typeof breakpoints) => {
    return (style: TemplateStringsArray | string) =>
        `@media (max-width: ${breakpoints[key]}px) { ${style} }`;
};
