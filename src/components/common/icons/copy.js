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

export default class Copy extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-copy'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M37.2402913,45.4271845 L37.2402913,53.2402913 L9.66990291,53.2402913 L9.66990291,25.6699029 L17.4830097,25.6699029 L17.4830097,21 L8.59223301,21 C6.61650485,21 5,22.6165049 5,24.592233 L5,54.407767 C5,56.3834951 6.61650485,58 8.59223301,58 L38.407767,58 C40.3834951,58 42,56.3834951 42,54.407767 L42,45.5169903 L37.2402913,45.5169903 L37.2402913,45.4271845 Z" />
        <path d="M52.407767,7 L22.592233,7 C20.6165049,7 19,8.61650485 19,10.592233 L19,40.407767 C19,42.3834951 20.6165049,44 22.592233,44 L52.407767,44 C54.3834951,44 56,42.3834951 56,40.407767 L56,10.592233 C56,8.61650485 54.3834951,7 52.407767,7 Z M51.3300971,39.2402913 L23.7597087,39.2402913 L23.7597087,11.6699029 L51.4199029,11.6699029 L51.4199029,39.2402913 L51.3300971,39.2402913 Z" />
      </Base>
    );
  }
}
