// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import React, {ChangeEventHandler, FC, FocusEventHandler, ReactNode, useCallback} from 'react';
import styled from 'styled-components';
import {shouldForwardProp} from './styled-components';

function noop() {
  return;
}

interface StyledSwitchInputProps {
  secondary?: boolean;
}

const StyledSwitchInput = styled.label.withConfig({shouldForwardProp})<StyledSwitchInputProps>`
  ${props => (props.secondary ? props.theme.secondarySwitch : props.theme.inputSwitch)};
`;

const StyledCheckboxInput = styled.label.withConfig({shouldForwardProp})`
  ${props => props.theme.inputCheckbox};
`;

const StyledRadioInput = styled.label.withConfig({shouldForwardProp})<StyledSwitchInputProps>`
  ${props => (props.secondary ? props.theme.secondaryRadio : props.theme.inputRadio)};
`;

const HiddenInput = styled.input.withConfig({shouldForwardProp})`
  position: absolute;
  opacity: 0;
`;

interface StyledCheckboxProps {
  type?: string;
  disabled?: boolean;
}

const StyledCheckbox = styled.div.withConfig({shouldForwardProp})<StyledCheckboxProps>`
  display: flex;
  min-height: ${props => props.theme.switchHeight}px;
  margin-left: ${props => (props.type === 'radio' ? 0 : props.theme.switchLabelMargin)}px;
  ${props =>
    props.disabled
      ? `
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  `
      : ''}
`;

interface CheckboxProps {
  id: string;
  type?: string;
  label?: ReactNode;
  name?: string;
  className?: string;
  value?: string | 'indeterminate';
  checked?: boolean;
  disabled?: boolean;

  error?: string;
  switch?: boolean;
  activeColor?: string;
  secondary?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
}

const Checkbox: FC<CheckboxProps> = ({
  id,
  type,
  label = '',
  name,
  className,
  value,
  checked = false,
  disabled = false,
  secondary,
  onBlur = noop,
  onChange = noop,
  onFocus = noop
}) => {
  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    args => {
      onFocus(args);
    },
    [onFocus]
  );

  const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    args => {
      onBlur(args);
    },
    [onBlur]
  );

  const inputType = type === 'radio' ? 'radio' : 'checkbox';

  const inputProps = {
    checked,
    disabled,
    id,
    name,
    onChange,
    value,
    secondary,
    type: inputType,
    onFocus: handleFocus,
    onBlur: handleBlur
  };

  const labelProps = {
    checked,
    disabled,
    secondary,
    htmlFor: id
  };

  const LabelElement =
    type === 'checkbox'
      ? StyledCheckboxInput
      : type === 'radio'
      ? StyledRadioInput
      : StyledSwitchInput;

  return (
    <StyledCheckbox
      type={type}
      className={classnames('kg-checkbox', className)}
      disabled={disabled}
    >
      <HiddenInput {...inputProps} />
      <LabelElement className="kg-checkbox__label" {...labelProps}>
        {label}
      </LabelElement>
    </StyledCheckbox>
  );
};

export default Checkbox;
