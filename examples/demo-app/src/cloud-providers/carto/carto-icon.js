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
import {Icons} from 'kepler.gl/components';
import PropTypes from 'prop-types';

class CartoIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '100%',
    viewBox: '0 0 92 36',
    predefinedClassName: 'data-ex-icons-carto'
  };

  render() {
    return (
      <Icons.IconWrapper {...this.props}>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g
            id="Logo-Scale-Negative"
            transform="translate(-162.000000, -282.000000)"
            fill="#2e3c43"
          >
            <g id="logo_carto_n_36" transform="translate(162.000000, 282.000000)">
              <path
                d="M74,36 C83.9411255,36 92,27.9411255 92,18 C92,8.0588745 83.9411255,0 74,0 C64.0588745,0 56,8.0588745 56,18 C56,27.9411255 64.0588745,36 74,36 Z"
                id="halo"
                fillOpacity="0.200000018"
              />
              <path
                d="M6.25280899,23.981602 C8.76747566,23.981602 10.220757,22.882802 11.2984713,21.390402 L8.9144367,19.684802 C8.22861851,20.521202 7.52647133,21.078802 6.33445401,21.078802 C4.73421159,21.078802 3.60751029,19.734002 3.60751029,18.012002 L3.60751029,17.979202 C3.60751029,16.306402 4.73421159,14.928802 6.33445401,14.928802 C7.4284973,14.928802 8.1796315,15.470002 8.83279168,16.273602 L11.2168263,14.420402 C10.204428,13.026402 8.70215964,12.042402 6.36711202,12.042402 C2.9053631,12.042402 0.358038428,14.666402 0.358038428,18.012002 L0.358038428,18.044802 C0.358038428,21.472402 2.98700813,23.981602 6.25280899,23.981602 L6.25280899,23.981602 Z M16.732047,23.752002 L20.0468349,23.752002 L20.8632851,21.685602 L25.2884453,21.685602 L26.1048955,23.752002 L29.5013284,23.752002 L24.6352851,12.190002 L21.5817613,12.190002 L16.732047,23.752002 Z M21.7940384,19.209202 L23.0840297,15.962002 L24.357692,19.209202 L21.7940384,19.209202 Z M35.6697093,23.752002 L38.8375361,23.752002 L38.8375361,20.275202 L40.2418305,20.275202 L42.5442201,23.752002 L46.1855881,23.752002 L43.4586443,19.750402 C44.8792677,19.143602 45.810021,17.979202 45.810021,16.208002 L45.810021,16.175202 C45.810021,15.043602 45.4671119,14.174402 44.7976227,13.502002 C44.0301595,12.731202 42.8218132,12.272002 41.0746097,12.272002 L35.6697093,12.272002 L35.6697093,23.752002 Z M38.8375361,17.782402 L38.8375361,15.010802 L40.9276487,15.010802 C41.9727049,15.010802 42.6421941,15.470002 42.6421941,16.388402 L42.6421941,16.421202 C42.6421941,17.257602 42.005363,17.782402 40.9439777,17.782402 L38.8375361,17.782402 Z M55.2605317,23.752002 L58.4283585,23.752002 L58.4283585,15.060002 L61.8574495,15.060002 L61.8574495,12.272002 L51.8477698,12.272002 L51.8477698,15.060002 L55.2605317,15.060002 L55.2605317,23.752002 Z M74,24 C77.3137085,24 80,21.3137085 80,18 C80,14.6862915 77.3137085,12 74,12 C70.6862915,12 68,14.6862915 68,18 C68,21.3137085 70.6862915,24 74,24 Z"
                id="logotype"
              />
            </g>
          </g>
        </g>
      </Icons.IconWrapper>
    );
  }
}

export default CartoIcon;
