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
import PropTypes from 'prop-types';
import Base from './base';

export default class Columns extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '14px',
    predefinedClassName: 'data-ex-icons-columns'
  };

  render() {
    return (
      <Base viewBox="-2 -2 20 20" {...this.props}>
        <path d="M15.5 0.5H1.5C0.947715 0.5 0.5 0.947716 0.5 1.5V2.63333H8.5H16.5V1.5C16.5 0.947715 16.0523 0.5 15.5 0.5Z" />
        <path
          d="M0.5 17.0333V2.63333M16.5 17.0333V2.63333M16.5 2.63333V1.5C16.5 0.947715 16.0523 0.5 15.5 0.5H1.5C0.947715 0.5 0.5 0.947716 0.5 1.5V2.63333M16.5 2.63333H8.5H0.5"
          stroke="currentColor"
        />
        <rect x="2.1" y="6.36667" width="12.8" height="0.533333" rx="0.266667" />
        <rect x="2.1" y="9.56668" width="12.8" height="0.533333" rx="0.266667" />
        <rect x="2.1" y="12.7667" width="12.8" height="0.533333" rx="0.266667" />
      </Base>
    );
  }
}
