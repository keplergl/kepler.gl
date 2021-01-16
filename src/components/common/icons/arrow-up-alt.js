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
import Base from './base';

export default class ArrowUpAlt extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-arrow_up_alt'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M35.1724294,23.4869823 C33.9007391,22.4077948 32.0407391,22.5802323 30.9874294,23.8822323 L21.4022168,35.7397323 L21.4022168,3.80585729 C21.4022168,2.11829479 20.0731075,0.750419792 18.4333707,0.750419792 C16.7936338,0.750419792 15.4645245,2.11829479 15.4645245,3.80585729 L15.4645245,35.7397323 L5.87742937,23.8822323 C4.82882614,22.5802323 2.95282411,22.4077948 1.69713585,23.4869823 C0.433917229,24.5661698 0.26260144,26.4920448 1.31308727,27.789201 L16.1516703,46.1479823 C16.7155063,46.846451 17.552318,47.2504198 18.4333707,47.2504198 C19.3144233,47.2504198 20.151235,46.846451 20.7150711,46.1479823 L35.556478,27.789201 C36.6041399,26.4920448 36.4309415,24.5661698 35.1724294,23.4869823"
          transform="rotate(-180.000000)"
        />
      </Base>
    );
  }
}
