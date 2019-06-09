// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import Switch from 'components/common/switch';
import {SidePanelDivider, Tooltip} from 'components/common/styled-components';
// import OverviewFactory from './Overview';
// import {
//   TRANSPORT_DESIRABILITY,
//   NON_TRANSPORT_MODE,
//   TRANSPORT_MODE
// } from 'constants/default-settings';

const StyledOverviewPanel = styled.div`
  padding-bottom: 6px;
`;

const StyledOverviewHeader = styled.div`
  font-size:1.5em;
`;

const StyledOverviewContent = styled.div`
  display: block;
  width: 100%;
`;

const StyledOverviewInfo = styled.div`
    margin: 10px;
`;

OverviewPanelFactory.deps = [];

function OverviewPanelFactory() {
  
  return class InteractionPanel extends Component {
    render() {
      return (
        <StyledOverviewPanel className="overview-panel">
          <StyledOverviewHeader className="overview-panel__section">
            Overview
          </StyledOverviewHeader>
          <StyledOverviewContent className="overview-panel__content">
            <StyledOverviewInfo>Actual Population: 30210</StyledOverviewInfo> 
            <StyledOverviewInfo>Sample Size: 1021</StyledOverviewInfo> 
          </StyledOverviewContent>
        </StyledOverviewPanel>
      );
    }
  };
}

export default OverviewPanelFactory;
