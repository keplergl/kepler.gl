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

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Icons} from 'kepler.gl/components';

export default class ClipboardIcon extends Component {
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
      <Icons.Base {...this.props}>
        <path d="M44.015 44h4v10.599C48.015 56.494 46.209 58 44 58H12c-2.209 0-3.985-1.506-3.985-3.401V13.4C8.015 11.505 9.79 10 12 10h7.015V8c0-1.104.782-2 1.886-2H35.1c1.104 0 1.916.896 1.916 2v2H44c2.209 0 4.015 1.505 4.015 3.401V25h-4V14h-32v7h15v4h-15v7h6.947c-.2 1-.314 1.309-.314 1.999 0 .69.115 1.001.314 2.001h-6.947v7h15v4h-15v7h32V44zm-7.432-12v-7.146L24.08 31.6c-1.91 1.03-1.91 3.77 0 4.8l12.503 6.746V36h19.433v-4H36.583z"/>
      </Icons.Base>
    );
  }
}
