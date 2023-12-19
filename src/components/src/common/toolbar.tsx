// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import styled from 'styled-components';

export interface ToolbarProps {
  show?: boolean;
}

const Toolbar = styled.div<ToolbarProps>`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.dropdownListShadow};
  font-size: 12px;
  transition: ${props => props.theme.transitionSlow};
  margin-top: ${props => (props.show ? '6px' : '20px')};
  opacity: ${props => (props.show ? 1 : 0)};
  transform: translateX(calc(-50% + 20px));
  pointer-events: ${props => (props.show ? 'all' : 'none')};
  z-index: 1000;

  .panel-header-dropdown__inner {
    box-shadow: none;
    background-color: transparent;
    display: flex;
  }
`;

Toolbar.displayName = 'Toolbar';

export default Toolbar;
