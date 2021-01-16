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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyledPanelDropdown} from 'components/common/styled-components';
import listensToClickOutside from 'react-onclickoutside';

class ClickOutsideCloseDropdown extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    show: PropTypes.bool,
    type: PropTypes.string
  };

  static defaultProps = {
    show: true,
    type: 'dark'
  };

  handleClickOutside = e => {
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
