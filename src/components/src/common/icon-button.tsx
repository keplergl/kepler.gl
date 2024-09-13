// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MouseEvent, ReactNode} from 'react';
import styled from 'styled-components';
import {Button, ButtonProps} from './styled-components';

interface IconButtonProps extends ButtonProps {
  collapsed?: boolean;
  theme?: object;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

export const IconButton = styled(Button)<IconButtonProps>`
  width: ${props => (props.collapsed ? 0 : 32)}px;
  height: 32px;
  color: ${props => props.theme.playbackButtonColor};
  background-color: ${props => props.theme.playbackButtonBgColor};
  border-radius: 4px;
  margin-left: 7px;
  border: 0;
  padding: 0;

  .__react_component_tooltip {
    font-family: ${props => props.theme.fontFamily};
  }
  svg {
    margin: 0;
  }
  &.active {
    background-color: ${props => props.theme.playbackButtonActBgColor};
  }
`;

export default IconButton;
