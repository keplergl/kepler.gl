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
import Base from 'components/common/icons/base';

export default class IconLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'icon-layer-icon',
    totalColor: 3
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          className="cr1"
          d="M42.27,33.59l-4.34,4.34-4.34-4.34a13.25,13.25,0,0,1-8.9-12.52h0A13.24,13.24,0,0,1,37.93,7.83h0A13.24,13.24,0,0,1,51.17,21.07h0A13.25,13.25,0,0,1,42.27,33.59ZM37.93,28.3a7.22,7.22,0,1,0-7.22-7.22A7.22,7.22,0,0,0,37.93,28.3Z"
        />
        <path
          className="cr2"
          d="M18.68,48.79l-2.44,2.44L13.8,48.79a7.44,7.44,0,0,1-5-7h0a7.44,7.44,0,0,1,7.44-7.44h0a7.44,7.44,0,0,1,7.44,7.44h0A7.44,7.44,0,0,1,18.68,48.79Zm-2.44-3a4.06,4.06,0,1,0-4.06-4.06A4.06,4.06,0,0,0,16.24,45.81Z"
        />
        <path
          className="cr3"
          d="M48.85,55.52l-2.2,2.2-2.2-2.2a6.73,6.73,0,0,1-4.52-6.36h0a6.72,6.72,0,0,1,6.72-6.72h0a6.72,6.72,0,0,1,6.72,6.72h0A6.73,6.73,0,0,1,48.85,55.52Zm-2.2-2.69A3.67,3.67,0,1,0,43,49.17,3.67,3.67,0,0,0,46.65,52.83Z"
        />
      </Base>
    );
  }
}
