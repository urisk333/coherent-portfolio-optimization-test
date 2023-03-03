import React, { useEffect } from "react";
import { ConfigProvider } from "antd";
import { FC, ReactNode } from "react";
import styled from "styled-components";
import { mediaQueries } from "../../styles/sc-theme";
import { useLocation } from "react-router-dom";

interface DefaultLayoutProps {
    children: ReactNode;
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location]);

    return (
        <ConfigProvider>
            <Body>
                <Container>{children}</Container>
            </Body>
        </ConfigProvider>
    );
};

const bodyBg = mediaQueries("sm")`
  background-color: #fff;
`;

const Body = styled.div`
    background-color: #f2f2f2;
    flex: 1;
    ${bodyBg};
`;

const Container = styled.div(() => {
    const mQ = mediaQueries("sm")`
    border: 1px solid #e7e7e7;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    margin: 32px auto 32px auto;
    max-width: 600px;
  `;
    return `${mQ}`;
});

export default DefaultLayout;
