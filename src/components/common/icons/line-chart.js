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

export default class LineChart extends Component {
  static propTypes = {
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-linechart'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M53.4647408,17.8549995L35.8387756,35.4809608L25.5911236,25.2333088L6.607347,44.2427025
	l3.6122975,3.6122971l15.371479-15.3714752l10.2476521,10.2476501l21.2638779-21.2382584L53.4647408,17.8549995z" />
      </Base>
    );
  }
};
