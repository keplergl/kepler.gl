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

export default class DrawPolygon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    predefinedClassName: PropTypes.string,
    viewBox: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-draw-polygon',
    viewBox: '0 0 24 25'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M5 6L13 2L22 9L21 23L2 17L5 6Z"
          stroke="currentColor"
          fill="transparent"
          strokeWidth="1.5"
        />
        <path d="M10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z" />
        <path d="M11.5 16C12.3284 16 13 15.3284 13 14.5C13 13.6716 12.3284 13 11.5 13C10.6716 13 10 13.6716 10 14.5C10 15.3284 10.6716 16 11.5 16Z" />
        <path d="M15.5 12C16.3284 12 17 11.3284 17 10.5C17 9.67157 16.3284 9 15.5 9C14.6716 9 14 9.67157 14 10.5C14 11.3284 14.6716 12 15.5 12Z" />
        <path d="M22 11C23.1046 11 24 10.1046 24 9C24 7.89543 23.1046 7 22 7C20.8954 7 20 7.89543 20 9C20 10.1046 20.8954 11 22 11Z" />
        <path d="M21 25C22.1046 25 23 24.1046 23 23C23 21.8954 22.1046 21 21 21C19.8954 21 19 21.8954 19 23C19 24.1046 19.8954 25 21 25Z" />
        <path d="M2 19C3.10457 19 4 18.1046 4 17C4 15.8954 3.10457 15 2 15C0.89543 15 0 15.8954 0 17C0 18.1046 0.89543 19 2 19Z" />
        <path d="M13 4C14.1046 4 15 3.10457 15 2C15 0.89543 14.1046 0 13 0C11.8954 0 11 0.89543 11 2C11 3.10457 11.8954 4 13 4Z" />
        <path d="M5 8C6.10457 8 7 7.10457 7 6C7 4.89543 6.10457 4 5 4C3.89543 4 3 4.89543 3 6C3 7.10457 3.89543 8 5 8Z" />
      </Base>
    );
  }
}
