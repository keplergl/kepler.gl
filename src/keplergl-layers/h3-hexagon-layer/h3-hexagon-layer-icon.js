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

import React from 'react';
import PropTypes from 'prop-types';
import Base from 'components/common/icons/base';

const H3HexagonLayerIcon = React.createClass({
  displayName: 'H3HexagonLayerIcon',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  },
  defaultProps: {
    height: '16px',
    predefinedClassName: 'h3-hexagon-layer-icon',
    totalColor: 4
  },
  render() {
    return (
      <Base {...this.props}>
        <path
          className="cr1"
          d="M36.7,9.36,41,16.68h8.27l4.7,8.13-4.16,7.33,4.16,7.33-4.7,8.13H40.93L36.7,54.92H27.31L23,47.6H14.76l-4.7-8.14,4.21-7.32-4.21-7.32,4.7-8.14H23l4.34-7.32H36.7m1.2-2.1H26.12l-.61,1-3.73,6.29H13.55l-.61,1-4.7,8.14-.6,1,.6,1,3.61,6.27L8.24,38.41l-.6,1,.6,1,4.7,8.14.61,1h8.28L25.5,56l.61,1H37.91l.61-1,3.62-6.27h8.32l.61-1,4.7-8.13.6-1-.59-1L52.2,32.14l3.57-6.29.59-1-.6-1-4.7-8.13-.61-1H42.18L38.51,8.3l-.61-1Z"
        />
        <polygon
          className="cr2"
          points="12.14 24.82 15.8 18.48 23.12 18.48 26.78 24.82 23.12 31.16 15.8 31.16 12.14 24.82"
          style={{opacity: 0.6}}
        />
        <polygon
          className="cr3"
          points="37.23 39.46 40.89 33.12 48.21 33.12 51.87 39.46 48.21 45.8 40.89 45.8 37.23 39.46"
          style={{opacity: 0.4}}
        />
        <polygon
          className="cr4"
          points="37.23 24.82 40.89 18.48 48.21 18.48 51.87 24.82 48.21 31.16 40.89 31.16 37.23 24.82"
          style={{opacity: 0.8}}
        />
        <polygon
          className="cr1"
          points="24.68 32.14 28.34 25.8 35.66 25.8 39.32 32.14 35.66 38.48 28.34 38.48 24.68 32.14"
        />
      </Base>
    );
  }
});

export default H3HexagonLayerIcon;
