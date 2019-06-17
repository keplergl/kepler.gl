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

import React, {PureComponent} from 'react';
import styled from 'styled-components';
import JoinTablePanelFactory from './floating-panel/join-table-panel';
import {FLOATING_PANELS} from '../../constants/default-settings';

FloatingPanelContainerFactory.deps = [JoinTablePanelFactory];

const StyledFloatingPanelContainer = styled.div`
  left: ${props =>
    props.left +
    props.theme.sidePanel.margin.left +
    props.theme.sidePanel.margin.right}px;
  position: absolute;
  z-index: 99;
  top: ${props => props.theme.sidePanel.margin.top}px;
  padding-top: 120px;
`;

export default function FloatingPanelContainerFactory(JoinTablePanel) {
  class FloatingPanelContainer extends PureComponent {
    render() {
      const {activePanel} = this.props;
      return (
        <StyledFloatingPanelContainer left={this.props.left}>
          {activePanel === FLOATING_PANELS.joinData && <JoinTablePanel
            datasets={this.props.datasets}
            joinData={this.props.joinData}
            setJoinDataset={this.props.setJoinDataset}
            startJoinDataset={this.props.startJoinDataset}
            onClose={this.props.onClose}
          />}
        </StyledFloatingPanelContainer>
      );
    }
  }

  return FloatingPanelContainer;
}
