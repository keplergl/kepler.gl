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

export default class CodeAlt extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-codealt'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M27.768 13.97v4.803a1.2 1.2 0 0 1-1.201 1.2H22.964v8.407a3.603 3.603 0 0 1-3.602 3.603 3.603 3.603 0 0 1 3.602 3.603v8.406H26.567a1.2 1.2 0 0 1 1.2 1.201v4.804a1.2 1.2 0 0 1-1.2 1.2h-6.005a4.804 4.804 0 0 1-4.803-4.803v-7.206a3.603 3.603 0 0 0-3.603-3.602H9.754a1.196 1.196 0 0 1-1.19-1.176h-.01v-4.829c0-.663.537-1.2 1.2-1.2h2.402a3.603 3.603 0 0 0 3.603-3.604v-7.205a4.804 4.804 0 0 1 4.803-4.804h6.005a1.2 1.2 0 0 1 1.2 1.201v.002zm27.584 21.616h-2.401a3.603 3.603 0 0 0-3.603 3.602v7.206a4.804 4.804 0 0 1-4.804 4.804H38.54a1.2 1.2 0 0 1-1.201-1.201V45.193c0-.663.537-1.2 1.2-1.2H42.143v-8.407a3.603 3.603 0 0 1 3.603-3.603 3.603 3.603 0 0 1-3.603-3.603v-8.406H38.54a1.2 1.2 0 0 1-1.201-1.201v-4.804c0-.663.537-1.2 1.2-1.2h6.005a4.804 4.804 0 0 1 4.804 4.803v7.205a3.603 3.603 0 0 0 3.603 3.603h2.401c.654 0 1.175.526 1.19 1.176h.011v4.829a1.2 1.2 0 0 1-1.2 1.2z" />
      </Base>
    );
  }
}
