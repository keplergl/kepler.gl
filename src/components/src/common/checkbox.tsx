// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {ChangeEventHandler, Component, FocusEventHandler, ReactNode} from 'react';
import styled from 'styled-components';
import pick from 'lodash.pick';
import classnames from 'classnames';

function noop() {}

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
  display: none;
`;

interface StyledCheckboxProps {
  type?: string;
}

const StyledCheckbox = styled.div<StyledCheckboxProps>`
  display: flex;
  min-height: ${props => props.theme.switchHeight}px;
  margin-left: ${props => (props.type === 'radio' ? 0 : props.theme.switchLabelMargin)}px;
`;

interface CheckboxProps {
  id: string;
  type?: string;
  label?: ReactNode;
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
      >
        <HiddenInput {...inputProps} />
        <LabelElement className="kg-checkbox__label" {...labelProps}>
          {this.props.label}
        </LabelElement>
      </StyledCheckbox>
    );
  }
}
