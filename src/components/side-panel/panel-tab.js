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
import styled from 'styled-components';
import {Tooltip} from 'components/common/styled-components';
import {FormattedMessage} from 'localization';

export const StyledPanelTab = styled.div.attrs({
  className: 'side-panel__tab'
})`
  align-items: flex-end;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: ${props =>
    props.active ? props.theme.panelToggleBorderColor : 'transparent'};
  color: ${props => (props.active ? props.theme.subtextColorActive : props.theme.panelTabColor)};
  display: flex;
  justify-content: center;
  margin-right: ${props => props.theme.panelToggleMarginRight}px;
  padding-bottom: ${props => props.theme.panelToggleBottomPadding}px;
  width: ${props => props.theme.panelTabWidth};

  :hover {
    cursor: pointer;
    color: ${props => props.theme.textColorHl};
  }
`;

export function PanelTabFactory() {
  const PanelTab = ({isActive, onClick, panel}) => (
    <StyledPanelTab data-tip data-for={`${panel.id}-nav`} active={isActive} onClick={onClick}>
      <panel.iconComponent height="20px" />
      <Tooltip id={`${panel.id}-nav`} effect="solid" delayShow={500} place="bottom">
        <span>
          <FormattedMessage id={panel.label || panel.id} />
        </span>
      </Tooltip>
    </StyledPanelTab>
  );

  return PanelTab;
}

export default PanelTabFactory;
