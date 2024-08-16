// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {MouseEventHandler} from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  color: ${props => props.theme.optionButtonColor};
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  transition: ${props => props.theme.transition};
  height: 2rem;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  text?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const noop = () => {
  return;
};
const Button = ({onClick = noop, disabled = false, text = '', children, ...props}: ButtonProps) => (
  <StyledButton {...props} onClick={disabled ? undefined : onClick}>
    {text || children}
  </StyledButton>
);

export default Button;
