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
import Base from 'components/common/icons/base';

class S2LayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };
  static defaultProps = {
    height: '18px',
    predefinedClassName: 's2-layer-icon'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M25,22.42c-1.64-1.96-3.71-2.93-6.23-2.93c-1.6,0-2.94,0.41-4.03,1.23c-1.09,0.82-1.64,1.91-1.64,3.28
		c0,1.37,1.98,3,5.95,4.88c3.97,1.89,5.97,2.83,6.01,2.83c2.81,1.78,4.22,3.88,4.22,6.3c0,3.31-1.12,5.98-3.37,8.03
		c-2.25,2.05-5.32,3.07-9.22,3.07c-4.95,0-8.86-2.1-11.71-6.3l4.09-3.41c0.55,1.25,1.55,2.38,3.02,3.41
		c1.47,1.03,2.98,1.55,4.53,1.55c1.85,0,3.31-0.53,4.38-1.6c1.07-1.07,1.61-2.36,1.61-3.89c0-1.1-0.4-2.07-1.2-2.91
		c-0.8-0.84-3.49-2.12-8.09-3.84c-4.6-1.72-6.89-4.19-6.89-7.39c0-2.74,1.06-5.04,3.18-6.91c2.12-1.87,4.77-2.8,7.96-2.8
		c4.41,0,7.89,1.21,10.45,3.63L25,22.42z"
        />
        <path
          d="M57.55,43.6v4.64H31.86l9.7-10.4c4.62-4.84,7.33-7.87,8.15-9.1c0.82-1.23,1.23-2.23,1.23-3.01
		C50.98,25.51,51,25.3,51,25.08c0-1.42-0.56-2.68-1.67-3.79c-1.11-1.1-2.57-1.65-4.37-1.65c-1.81,0-3.22,0.62-4.25,1.87
		c-1.03,1.25-1.54,2.76-1.54,4.53h-6.8c0-3.2,1.12-5.84,3.37-7.92c2.25-2.08,5.3-3.12,9.16-3.12c3.48,0,6.42,1,8.81,2.99
		c2.39,1.99,3.59,4.48,3.59,7.47c0,2.81-2.54,6.72-7.62,11.74l-6.48,6.4H57.55z"
        />
      </Base>
    );
  }
}

export default S2LayerIcon;
