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

export default class Fullscreen extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-fullscreen'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M 18.667969 37.332031 L 13.332031 37.332031 L 13.332031 50.667969 L 26.667969 50.667969 L 26.667969 45.332031 L 18.667969 45.332031 Z M 13.332031 26.667969 L 18.667969 26.667969 L 18.667969 18.667969 L 26.667969 18.667969 L 26.667969 13.332031 L 13.332031 13.332031 Z M 45.332031 45.332031 L 37.332031 45.332031 L 37.332031 50.667969 L 50.667969 50.667969 L 50.667969 37.332031 L 45.332031 37.332031 Z M 37.332031 13.332031 L 37.332031 18.667969 L 45.332031 18.667969 L 45.332031 26.667969 L 50.667969 26.667969 L 50.667969 13.332031 Z M 37.332031 13.332031 " />
      </Base>
    );
  }
}
