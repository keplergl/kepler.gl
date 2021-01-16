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

export default class HeatmapLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'heatmap-layer-icon',
    totalColor: 3
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M51.87,21C49.55,16.67,43.77,15.29,39,18a11.42,11.42,0,0,0-1.65,1.13c-2.73,2.14-2.12,3-6,4.89-2.27,1.07-3.42,1.08-6.88,1.4l-2.24.21a14,14,0,0,0-2.86.84c-6.64,2.73-10.11,9.86-7.76,15.94s9.63,8.79,16.27,6.07A14,14,0,0,0,31.77,46l0,0,.06-.07c.43-.4.8-.78,1.14-1.14a2.66,2.66,0,0,0,.32-.36l.17-.19c3-3.53,2-5,4.9-7.39,2.38-1.93,5.41-.95,9-3C52.19,31.15,54.19,25.43,51.87,21ZM26,44.59a8.7,8.7,0,0,1-2.26.59A7.16,7.16,0,0,1,16,40.85c-1.44-3.72.68-8.08,4.73-9.74A8.33,8.33,0,0,1,23,30.53a7.15,7.15,0,0,1,7.71,4.32C32.19,38.57,30.06,42.93,26,44.59Z"
          className="cr2"
          style={{opacity: 0.8}}
        />
        <path
          d="M57,18.18A14.56,14.56,0,0,0,42.25,10.7a16.62,16.62,0,0,0-6.12,2,17.35,17.35,0,0,0-2.39,1.65,20.15,20.15,0,0,0-2.83,2.73,4.52,4.52,0,0,1-2,1.45,5.88,5.88,0,0,1-2.26.63l-1.45.14-1.27.12-2.33.22-.2,0-.18,0a18.88,18.88,0,0,0-4,1.18c-9.6,3.93-14.51,14.57-11,23.71A17.59,17.59,0,0,0,24.81,55.4,20.19,20.19,0,0,0,30,54.05a20,20,0,0,0,5.26-3.19l.82-.71.05-.08,1-1c.21-.22.41-.45.59-.66l.13-.15a20,20,0,0,0,3.39-5.48c.36-.87.36-.87.68-1.14a9.09,9.09,0,0,1,1.56-.32,18.79,18.79,0,0,0,6.69-2.19,16.56,16.56,0,0,0,7.88-9.9A14.93,14.93,0,0,0,57,18.18ZM47.63,34.27a13.93,13.93,0,0,1-5.06,1.61,7.75,7.75,0,0,0-3.86,1.36,7.06,7.06,0,0,0-2.33,3.24,14.17,14.17,0,0,1-2.51,4.09l-.1.11a5.11,5.11,0,0,1-.43.47c-.31.35-.7.73-1.14,1.14l-.09.09-.12.09a14.4,14.4,0,0,1-4,2.44,14.73,14.73,0,0,1-3.84,1c-5.87.69-11.13-2.27-13.08-7.35-2.45-6.32,1.16-13.76,8-16.59a15,15,0,0,1,3-.87l2.29-.22.9-.07,2-.2a10.88,10.88,0,0,0,3.85-1.08,9.43,9.43,0,0,0,3.77-2.76A14.75,14.75,0,0,1,37,18.71a11.5,11.5,0,0,1,1.71-1.17,11.08,11.08,0,0,1,4.16-1.36,9.26,9.26,0,0,1,9.42,4.64C54.75,25.42,52.65,31.47,47.63,34.27Z"
          className="cr1"
          style={{opacity: 0.36}}
        />
        <path
          d="M33,44.79a9.53,9.53,0,0,1-1.13,1.14C32.3,45.53,32.67,45.15,33,44.79Z"
          className="cr1"
          style={{opacity: 0.36}}
        />
        <path
          d="M25.83,44.13c-3.82,1.55-8,0-9.33-3.46s.65-7.55,4.45-9.1,8,0,9.33,3.46S29.63,42.57,25.83,44.13Z"
          className="cr3"
        />
        <path d="M31.81,46a.09.09,0,0,1,0,0h0Z" className="cr3" />
      </Base>
    );
  }
}
