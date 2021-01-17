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

export default class SquareSelect extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-select'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M57,15.36a8.38,8.38,0,0,1-8.32,8.32,8.35,8.35,0,0,1-8.32-8.32A8.38,8.38,0,0,1,48.64,7,8.35,8.35,0,0,1,57,15.36Z" />
        <path d="M57,48.64a8.31,8.31,0,0,1-16.35,2.08H23.39A8.31,8.31,0,1,1,13.27,40.61V23.39a8.3,8.3,0,0,1-6.24-8A8.38,8.38,0,0,1,15.36,7a8.3,8.3,0,0,1,8,6.24H36.16v4.16H23.39a7.88,7.88,0,0,1-2.16,3.79,7.88,7.88,0,0,1-3.79,2.16V40.61a8.29,8.29,0,0,1,6,6H40.61a8.29,8.29,0,0,1,6-6V27.84h4.16V40.61A8.3,8.3,0,0,1,57,48.64Z" />
      </Base>
    );
  }
}
