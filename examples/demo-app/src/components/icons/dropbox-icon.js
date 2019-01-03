// Copyright (c) 2019 Uber Technologies, Inc.
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
import {Icons} from 'kepler.gl/components';
import PropTypes from 'prop-types';

class DropboxIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-dropbox',
    totalColor: 1
  };

  render() {
    return (
      <Icons.IconWrapper {...this.props} viewBox={"0 0 416 416"} colors={['#0060ff']}>
        <path
          className="cr1"
          d="M348.911,169.42L220.258,91.062l81.133-67.164l128.732,79.217L348.911,169.42z M300.532,317.532
		l123.547-72.331l-74.31-62.858l-120.961,73.191L300.532,317.532z M201.328,255.534L80.355,182.343L6.06,245.201l123.559,72.331
		L201.328,255.534z M86.406,307.199v23.251l123.472,75.774V262.414l-81.989,67.168L86.406,307.199z M343.712,307.199l-41.453,22.388
		l-82.001-67.173v143.811l123.454-75.774V307.199z M209.878,91.062l-81.135-67.164L0,103.115l81.226,66.305L209.878,91.062z"/>
      </Icons.IconWrapper>
    );
  }
}

export default DropboxIcon;
