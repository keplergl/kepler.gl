// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import {SidebarFactory, CollapseButtonFactory} from 'kepler.gl/components';
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
