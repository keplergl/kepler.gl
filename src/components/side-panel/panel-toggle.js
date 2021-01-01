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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';
import {Tooltip} from 'components/common/styled-components';

const propTypes = {
  panels: PropTypes.arrayOf(PropTypes.object),
  activePanel: PropTypes.string,
  togglePanel: PropTypes.func
};

const PanelHeaderBottom = styled.div.attrs({
  className: 'side-side-panel__header__bottom'
})`
  background-color: ${props => props.theme.sidePanelHeaderBg};
  border-bottom: 1px solid ${props => props.theme.sidePanelHeaderBorder};
  padding: 0 16px;
  display: flex;
  min-height: 30px;
`;

export function PanelTabFactory() {
  const PanelTab = styled.div.attrs({
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

  return PanelTab;
}

PanelToggleFactory.deps = [PanelTabFactory];
function PanelToggleFactory(PanelTab) {
  const PanelToggle = ({panels, activePanel, togglePanel}) => (
    <PanelHeaderBottom>
      {panels.map(panel => (
        <PanelTab
          key={panel.id}
          data-tip
          data-for={`${panel.id}-nav`}
          active={activePanel === panel.id}
          onClick={() => togglePanel(panel.id)}
        >
          <panel.iconComponent height="20px" />
          <Tooltip id={`${panel.id}-nav`} effect="solid" delayShow={500} place="bottom">
            <span>
              <FormattedMessage id={panel.label || panel.id} />
            </span>
          </Tooltip>
        </PanelTab>
      ))}
    </PanelHeaderBottom>
  );

  PanelToggle.propTypes = propTypes;
  return PanelToggle;
}

export default PanelToggleFactory;
