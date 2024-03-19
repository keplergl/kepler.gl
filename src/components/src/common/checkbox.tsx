// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import pick from 'lodash.pick';
import React, {ChangeEventHandler, Component, FocusEventHandler, ReactNode} from 'react';
import styled from 'styled-components';

function noop() {
  return;
}

interface StyledSwitchInputProps {
  secondary?: boolean;
}

const StyledSwitchInput = styled.label<StyledSwitchInputProps>`
  ${props => (props.secondary ? props.theme.secondarySwitch : props.theme.inputSwitch)};
`;

const StyledCheckboxInput = styled.label`
  ${props => props.theme.inputCheckbox};
`;

const StyledRadiuInput = styled.label<StyledSwitchInputProps>`
  ${props => (props.secondary ? props.theme.secondaryRadio : props.theme.inputRadio)};
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
`;

interface StyledCheckboxProps {
  type?: string;
  disabled?: boolean;
}

const StyledCheckbox = styled.div<StyledCheckboxProps>`
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
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
}

export default class Checkbox extends Component<CheckboxProps> {
  static defaultProps = {
    disabled: false,
    checked: false,
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
    label: ''
  };

  state = {
    focused: false
  };

  handleFocus: FocusEventHandler<HTMLInputElement> = args => {
    this.setState({focused: true});
    this.props.onFocus(args);
  };

  handleBlur: FocusEventHandler<HTMLInputElement> = args => {
    this.setState({focused: false});
    this.props.onBlur(args);
  };

  render() {
    const inputProps = {
      ...pick(this.props, ['checked', 'disabled', 'id', 'onChange', 'value', 'secondary']),
      type: 'checkbox',
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    };

    const labelProps = {
      ...pick(this.props, ['checked', 'disabled', 'secondary']),
      htmlFor: this.props.id
    };

    const LabelElement =
      this.props.type === 'checkbox'
        ? StyledCheckboxInput
        : this.props.type === 'radio'
        ? StyledRadiuInput
        : StyledSwitchInput;

    return (
      <StyledCheckbox
        type={this.props.type}
        className={classnames('kg-checkbox', this.props.className)}
        disabled={this.props.disabled}
      >
        <HiddenInput {...inputProps} />
        <LabelElement className="kg-checkbox__label" {...labelProps}>
          {this.props.label}
        </LabelElement>
      </StyledCheckbox>
    );
  }
}
