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

import PropTypes from 'prop-types';
import React from 'react';
import Base from './base';

export default class Picture extends React.Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-minus'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M55 8H9a1 1 0 0 0-1 1v46a1 1 0 0 0 1 1h46a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zm-3 36H12V12h40v32zM40.508 25.75l8.217 11.05c.98 1.319.047 3.2-1.587 3.2H16.987c-1.863 0-2.698-2.356-1.257-3.547l6.012-4.966a1.97 1.97 0 0 1 2.513 0l3.859 3.187a1.973 1.973 0 0 0 2.843-.347l6.378-8.578a1.973 1.973 0 0 1 3.173 0zM26 21a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      </Base>
    );
  }
}
