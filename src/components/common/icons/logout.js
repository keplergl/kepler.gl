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
import Base from './base';
import PropTypes from 'prop-types';

export default class Logout extends Component {
  static propTypes = {
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-logout'
  };

  render() {
    return (
      <Base {...this.props}>
        <polygon points="27.1024306 41.981391 23.3612739 45.7225477 10 32.3612739 23.3612739 19 27.1024306 22.7411567 20.1545681 29.6890191 46.0754395 29.6890191 46.0754395 35.0335286 20.1545681 35.0335286" />
        <path d="M50.7560765,8 L13.3445095,8 C10.4050293,8 8,10.4050293 8,13.3445095 L8,24.0335286 L13.3445095,24.0335286 L13.3445095,13.3445095 L50.7560765,13.3445095 L50.7560765,50.7560765 L13.3445095,50.7560765 L13.3445095,40.0670573 L8,40.0670573 L8,50.7560765 C8,53.6955566 10.4050293,56.1005859 13.3445095,56.1005859 L50.7560765,56.1005859 C53.6955566,56.1005859 56.1005859,53.6955566 56.1005859,50.7560765 L56.1005859,13.3445095 C56.1005859,10.4050293 53.6955566,8 50.7560765,8 Z" />
      </Base>
    );
  }
}
