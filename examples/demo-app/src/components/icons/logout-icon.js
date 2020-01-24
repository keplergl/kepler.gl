// Copyright (c) 2020 Uber Technologies, Inc.
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
import {Icons} from 'kepler.gl/components';
import PropTypes from 'prop-types';

export default class Logout extends Component {
  static propTypes = {
    height: PropTypes.string
  };

  static defaultProps = {
    height: '12px',
    predefinedClassName: 'data-ex-icons-logout'
  };

  render() {
    return (
      <Icons.IconWrapper {...this.props} viewBox={"0 0 12 12"}>
        <path d="M4.73333333,8.4 L5.66666667,9.33333333 L9,6 L5.66666667,2.66666667 L4.73333333,3.6 L6.46666667,5.33333333 L0,5.33333333 L0,6.66666667 L6.46666667,6.66666667 L4.73333333,8.4 Z M10.6666667,0 L1.33333333,0 C0.6,0 0,0.6 0,1.33333333 L0,4 L1.33333333,4 L1.33333333,1.33333333 L10.6666667,1.33333333 L10.6666667,10.6666667 L1.33333333,10.6666667 L1.33333333,8 L0,8 L0,10.6666667 C0,11.4 0.6,12 1.33333333,12 L10.6666667,12 C11.4,12 12,11.4 12,10.6666667 L12,1.33333333 C12,0.6 11.4,0 10.6666667,0 Z"></path>
      </Icons.IconWrapper>
    );
  }
};
