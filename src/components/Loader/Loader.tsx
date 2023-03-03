import React from "react";
import styled, { keyframes } from "styled-components";
import { ThemeColorProps } from "../../pages/Questionnaire";

const Loader = (props: any) => {
    return (
        <Main heightOfThePage={props.heightOfThePage}>
            <Container data-testid="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </Container>
        </Main>
    );
};
const Main = styled.div<{ heightOfThePage: string }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${(props: ThemeColorProps) => props.heightOfThePage + "vh" || "100vh"};
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
`;
const animation = keyframes`
 0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const Container = styled.div`
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 64px;
        height: 64px;
        margin: 8px;
        border: 8px solid #ccc;
        border-radius: 50%;
        animation: ${animation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #ccc transparent transparent transparent;
    }
    div:nth-child(1) {
        animation-delay: -0.45s;
    }
    div:nth-child(2) {
        animation-delay: -0.3s;
    }
    div:nth-child(3) {
        animation-delay: -0.15s;
    }
`;

export default Loader;
