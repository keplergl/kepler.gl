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

export default class Crosshairs extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-crosshairs'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M60.015 30h-4.12c-.961-11.648-10.237-20.932-21.88-21.908V4h-4v4.087C18.343 9.037 9.038 18.332 8.075 30h-4.06v4h4.06c.963 11.668 10.268 20.964 21.94 21.913V60h4v-4.092c11.643-.976 20.919-10.26 21.88-21.908h4.12v-4zm-8.131 0H39.723a8 8 0 0 0-5.708-5.73V12.103c9.42.954 16.928 8.473 17.869 17.897zm-21.87-17.9v12.155A7.999 7.999 0 0 0 24.248 30H12.086c.942-9.444 8.48-16.972 17.929-17.9zM12.087 34h12.161a7.999 7.999 0 0 0 5.768 5.745V51.9c-9.448-.928-16.987-8.456-17.93-17.9zm21.929 17.897V39.73A8 8 0 0 0 39.723 34h12.16c-.94 9.424-8.448 16.943-17.868 17.897z"/>
      </Base>
    );
  }
};
