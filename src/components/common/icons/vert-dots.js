// Copyright (c) 2018 Uber Technologies, Inc.
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
import Base from './base';

export default class VertDots extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-vertdot'
  };

  render() {
    return (
      <Base {...this.props}>
        <rect x="35.01" y="48.31" width="6.44" height="6.44"/>
        <rect x="35.01" y="35.43" width="6.44" height="6.44"/>
        <rect x="35.01" y="22.55" width="6.44" height="6.44"/>
        <rect x="35.01" y="9.67" width="6.44" height="6.44"/>
        <rect x="22.13" y="48.31" width="6.44" height="6.44"/>
        <rect x="22.13" y="35.43" width="6.44" height="6.44"/>
        <rect x="22.13" y="22.55" width="6.44" height="6.44"/>
        <rect x="22.13" y="9.67" width="6.44" height="6.44"/>
      </Base>
    );
  }
}
