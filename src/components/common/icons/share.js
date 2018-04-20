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

export default class Share extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-share'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M58 50c0 5.523-4.477 10-10 10s-10-4.477-10-10c0-.432.037-.854.09-1.272L22.236 39.81A9.95 9.95 0 0 1 16 42c-5.523 0-10-4.477-10-10s4.477-10 10-10a9.95 9.95 0 0 1 6.236 2.19l15.854-8.918A10.03 10.03 0 0 1 38 14c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10a9.95 9.95 0 0 1-6.236-2.19L25.91 30.728c.053.418.09.84.09 1.272s-.037.854-.09 1.272l15.854 8.918A9.95 9.95 0 0 1 48 40c5.523 0 10 4.477 10 10z" />
      </Base>
    );
  }
};
