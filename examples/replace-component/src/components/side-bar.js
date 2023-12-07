// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {SidebarFactory, Icons} from '@kepler.gl/components';
import styled from 'styled-components';

const StyledSideBarContainer = styled.div`
  .side-panel--container {
    transform: scale(0.85);
    transform-origin: top left;
    height: 117.64%;
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
    padding-left: 0;
  }
`;

const StyledCloseButton = styled.div`
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.primaryBtnBgd};
  color: ${props => props.theme.primaryBtnColor};
  display: flex;
  height: 46px;
  position: absolute;
  top: 0;
  width: 80px;
  right: 0;

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.primaryBtnBgdHover};
  }
`;

const CloseButtonFactory = () => {
  const CloseButton = ({onClick, isOpen}) => (
    <StyledCloseButton className="side-bar__close" onClick={onClick}>
      <Icons.ArrowRight
        height="18px"
        style={{transform: `rotate(${isOpen ? 180 : 0}deg)`, marginLeft: isOpen ? 0 : '30px'}}
      />
    </StyledCloseButton>
  );
  return CloseButton;
};

// Custom sidebar will render kepler.gl default side bar
// adding a wrapper component to edit its style
function CustomSidebarFactory(CloseButton) {
  const SideBar = SidebarFactory(CloseButton);
  const CustomSidebar = props => (
    <StyledSideBarContainer>
      <SideBar {...props} />
    </StyledSideBarContainer>
  );
  return CustomSidebar;
}

// You can add custom dependencies to your custom factory
CustomSidebarFactory.deps = [CloseButtonFactory];

export default CustomSidebarFactory;
