// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {StyledPanelDropdown} from '../common/styled-components';
import listensToClickOutside from 'react-onclickoutside';

type ClickOutsideCloseDropdownProps = {
  show: boolean;
  type: string;
  className: string;
  onClose: (e: Event) => void;
  children?: React.ReactNode;
};

class ClickOutsideCloseDropdown extends Component<ClickOutsideCloseDropdownProps> {
  static defaultProps = {
    show: true,
    type: 'dark'
  };

  handleClickOutside = (e: Event) => {
    if (typeof this.props.onClose === 'function' && this.props.show) {
      this.props.onClose(e);
    }
  };

  render() {
    return (
      <StyledPanelDropdown type={this.props.type} className={this.props.className}>
        {this.props.children}
      </StyledPanelDropdown>
    );
  }
}

export default listensToClickOutside(ClickOutsideCloseDropdown);
