// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ChangeEventHandler, FocusEventHandler, ReactNode} from 'react';
import Checkbox from './checkbox';

interface SwitchProps {
  checked?: boolean;
  type?: string;
  id: string;
  label?: ReactNode;
  error?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  value?: string;
  secondary?: boolean;
  disabled?: boolean;
  /** Names the control when `label` is empty or not rendered next to it. */
  'aria-label'?: string;
}

const Switch = (props: SwitchProps) => {
  const switchProps = {
    ...props,
    switch: props.type !== 'checkbox'
  };

  return <Checkbox {...switchProps} />;
};

export default Switch;
