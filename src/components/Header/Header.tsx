import React, { useContext } from "react";
import styled, { createGlobalStyle, ThemeContext } from "styled-components";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import companyLogo from "../../assets/images/coherent-logo.png";
import useHeaderScroll from "../../hooks/useHeaderScroll";
import { useEffect, useState } from "react";

import DropdownList from "../DropdownList";
import { ThemeColorProps } from "../../pages/Questionnaire";

function Header({
    productTitle,
    pageHeader,
    onBack,
    langList,
    isLangChanged,
    setIsLangChanged
}: {
    productTitle: string;
    pageHeader: string;
    onBack: (() => void) | null;
    langList: any;
    isLangChanged: boolean;
    setIsLangChanged: (isLangChanged: boolean) => void;
}) {
    const { show } = useHeaderScroll();
    const [maxTitleWidth, setMaxTitleWidth] = useState(window.innerWidth - 170);
    const { isRtl } = useContext(ThemeContext);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setMaxTitleWidth(window.innerWidth - 170);
        });
    }, []);

    return (
        <Container data-testid="header">
            <Wrapper>
                <HeaderContainer
                    data-testid="companyLogoWrapper"
                    className={show ? "show" : "hide"}
                >
                    <SideContainer />

                    <HeaderCenterContainer>
                        <StyledImg
                            data-testid="company-logo"
                            src={companyLogo}
                            alt="Coherent Explainer"
                        />
                    </HeaderCenterContainer>
                    <SideContainer>
                        <GlobalStyle />

                        <DropdownList
                            langList={langList}
                            isLangChanged={isLangChanged}
                            setIsLangChanged={setIsLangChanged}
                        />
                    </SideContainer>
                </HeaderContainer>
            </Wrapper>
            <SubHeaderWrapper className={show ? "show" : "hide"}>
                <SubHeaderContainer
                    data-testid="productTitleWrapper"
                    className={show ? "show" : "hide"}
                >
                    <SideContainer />

                    <CenterContainer>
                        <TitleText
                            maxWidth={maxTitleWidth}
                            data-testid="product-title-tooltip"
                            className="title-text"
                        >
                            {productTitle}
                        </TitleText>
                    </CenterContainer>
                    <SideContainer>
                        {/* {!readOnly && (
              <MoreDrawer isDesktop={isDesktop} isSummaryPage={isSummaryPage} />
            )} */}
                    </SideContainer>
                </SubHeaderContainer>
                <PageHeaderContainer>
                    <SideContainer>
                        {!!onBack && (
                            <Button
                                type="link"
                                icon={<StyledLeftOutlined rotate={isRtl ? 180 : 0} />}
                                onClick={() => {
                                    // expEvents.icon("Back");
                                    onBack();
                                }}
                            />
                        )}
                    </SideContainer>
                    <CenterContainer>
                        <PageHeader data-testid="quotation">{pageHeader}</PageHeader>
                    </CenterContainer>
                    <SideContainer>{/* <Currency>{currency}</Currency> */}</SideContainer>
                </PageHeaderContainer>
            </SubHeaderWrapper>
        </Container>
    );
}

const GlobalStyle = createGlobalStyle`
.language-dropdown {
  .ant-dropdown-menu {
    padding: 0px;
    width: 138px;
    background: #000000;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.4);
    margin-right: 8px;
    &:active {
      font-weight: bold !important;
      font-size: 18px;
    }
  }

  .ant-dropdown-menu-item {
    display: flex;
    flex-direction: column;
    width: 138px;
    align-items: flex-end;
  }

  .ant-btn.ant-dropdown-open svg {
    color: #9C43FF !important;
  }

  .ant-dropdown-menu-item-active,
  .selected {
    font-weight: 700 !important;
    background: #f0f0f0 !important;
  }
  
  .notSelected:hover {
    font-weight: normal !important;
    background: #f5f5f5 !important;
  }
}
`;

const Container = styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
`;

const Wrapper = styled.div`
    background: #ffffff;
`;

const HeaderContainer = styled.div`
    align-items: center;
    color: #ffffff;
    display: flex;
    filter: drop-shadow(rgba(0, 0, 0, 0.1) 0px 1px 5px);
    height: 58px;
    transition: visibility 0.3s, opacity 0.3s linear;
    transition-delay: 0s;
    &.show {
        visibility: visible;
        opacity: 1;
    }
    &.hide {
        opacity: 0;
        visibility: hidden;
    }
`;

const SideContainer = styled.div`
    display: flex;
    flex: 0 0 60px;
    justify-content: center;
`;

const HeaderCenterContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    padding: 9px 0px;
`;

const StyledImg = styled.img`
    -ms-interpolation-mode: nearest-neighbor;
    image-rendering: crisp-edges;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    max-height: 40px;
    max-width: 100%;
`;

const SubHeaderWrapper = styled.div`
    transition: top 0.1s linear;
    transition-delay: 0s;
    position: relative;
    &.show {
        top: 0px;
    }
    &.hide {
        top: -58px;
    }
`;
const SubHeaderContainer = styled.div`
    align-items: center;
    background: #f2f2f2;
    display: flex;
    min-height: 43px;
    padding: 5px 0px;
`;

const CenterContainer = styled.div`
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
`;

const TitleText = styled.div<{ maxWidth: number }>`
    color: #262626;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.3;
    max-width: ${(props: ThemeColorProps) => props.maxWidth || "100"}px;
    overflow: hidden;
    text-align: center;

    @media screen and (max-width: 335px) {
        max-width: 100%;
    }
`;

const PageHeaderContainer = styled.div`
    align-items: center;
    background: #ffffff;
    display: flex;
    filter: drop-shadow(0px 1px 0px rgba(0, 0, 0, 0.1));
    height: 44px;
`;

const PageHeader = styled.div`
    color: #262626;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 1px;
    line-height: 19px;
    padding: 10px 0;
    text-align: center;
    text-transform: uppercase;
    word-break: break-word;
`;

export const ControlContainer = styled.div`
    text-align: center;
`;

const StyledLeftOutlined = styled(LeftOutlined)`
    color: #201a3d;
    font-size: 20px;
`;

export default Header;
