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
import PropTypes from 'prop-types';
import Base from 'components/common/icons/base';

export default class TripLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    //height: null,
    size: 'tiny',
    height: '16px',
    predefinedClassName: 'trip-layer-icon'
  };

  render() {
    return (
      <Base {...this.props}>
        <g clipPath="url(#clip0)" className="cr1">
          <path d="M53.025 4.85005C50.25 2.07505 45.75 2.07505 42.975 4.85005C40.2 7.62505 40.2 12.2 42.975 14.975L48 20L53.025 14.9C55.8 12.2 55.8 7.62505 53.025 4.85005ZM48 11.375C47.175 11.375 46.5 10.7 46.5 9.87505C46.5 9.05005 47.175 8.37505 48 8.37505C48.825 8.37505 49.5 9.05005 49.5 9.87505C49.5 10.7 48.825 11.375 48 11.375Z" />
        </g>
        <g clipPath="url(#clip1)" className="cr2">
          <path d="M20.025 36.85C17.25 34.075 12.75 34.075 9.97502 36.85C7.20002 39.625 7.20002 44.2 9.97502 46.975L15 52L20.025 46.9C22.8 44.2 22.8 39.625 20.025 36.85ZM15 43.375C14.175 43.375 13.5 42.7 13.5 41.875C13.5 41.05 14.175 40.375 15 40.375C15.825 40.375 16.5 41.05 16.5 41.875C16.5 42.7 15.825 43.375 15 43.375Z" />
        </g>
        <path
          fill="none"
          stroke="#1FBAD6"
          strokeWidth="3"
          className="cr3"
          d="M17 53.5L36.4999 39.4997L34.7499 30.2497L32.9999 20.9998L44.4999 19.9997"
        />
        <defs>
          <clipPath id="clip0">
            <rect width="18" height="18" transform="translate(39 2)" />
          </clipPath>
          <clipPath id="clip1">
            <rect width="18" height="18" transform="translate(6 34)" />
          </clipPath>
        </defs>
      </Base>
    );
  }
}
