// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {SidebarFactory, CollapseButtonFactory} from '@kepler.gl/components';
import styled from 'styled-components';

const StyledSideBarContainer = styled.div`
  .side-panel--container {
    transform:scale(0.85);
    transform-origin: top left;
    height: 117.64%;
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
    padding-left: 0;

    .side-bar {
      height: 100%;
    }
    .side-bar__close {
      right: -30px;
      top: 14px;
    }
  }
`;

// Custom sidebar will render kepler.gl default side bar
// adding a wrapper component to edit its style
function CustomSidebarFactory() {
  const CloseButton = CollapseButtonFactory();
  const Sidebar = SidebarFactory(CloseButton);
  const CustomSidebar = (props) => (
    <StyledSideBarContainer>
      <Sidebar {...props}/>
    </StyledSideBarContainer>
  );
  return CustomSidebar;
}

export default CustomSidebarFactory;
