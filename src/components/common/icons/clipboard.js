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

export default class Clipboard extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-clipboard'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          transform="translate(6.000000, 0.000000)"
          d="M46.8184484,5.81818182 L34.5871288,5.81818182 C33.3581445,2.44363636 30.1393762,7.10542736e-15 26.3353772,7.10542736e-15 C22.5313783,7.10542736e-15 19.31261,2.44363636 18.0836257,5.81818182 L5.85230605,5.81818182 C2.63353772,5.81818182 0,8.43636364 0,11.6363636 L0,58.1818182 C0,61.3818182 2.63353772,64 5.85230605,64 L46.8184484,64 C50.0372167,64 52.6707545,61.3818182 52.6707545,58.1818182 L52.6707545,11.6363636 C52.6707545,8.43636364 50.0372167,5.81818182 46.8184484,5.81818182 L46.8184484,5.81818182 Z M26.3353772,5.81818182 C27.9447614,5.81818182 29.2615303,7.12727273 29.2615303,8.72727273 C29.2615303,10.3272727 27.9447614,11.6363636 26.3353772,11.6363636 C24.7259931,11.6363636 23.4092242,10.3272727 23.4092242,8.72727273 C23.4092242,7.12727273 24.7259931,5.81818182 26.3353772,5.81818182 L26.3353772,5.81818182 Z M46.8184484,58.1818182 L5.85230605,58.1818182 L5.85230605,11.6363636 L11.7046121,11.6363636 L11.7046121,20.3636364 L40.9661424,20.3636364 L40.9661424,11.6363636 L46.8184484,11.6363636 L46.8184484,58.1818182 L46.8184484,58.1818182 Z"
        />
      </Base>
    );
  }
}
