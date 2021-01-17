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

const getStyleClassFromColor = (totalColor, colors) =>
  new Array(totalColor)
    .fill(1)
    .reduce((accu, c, i) => `${accu}.cr${i + 1} {fill:${colors[i % colors.length]};}`, '');

export default class Base extends Component {
  static displayName = 'Base Icon';

  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    /** Set the width of the icon, ex. '16px' */
    width: PropTypes.string,
    /** Set the viewbox of the svg */
    viewBox: PropTypes.string,
    /** Path element */
    children: PropTypes.node,

    predefinedClassName: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    height: null,
    width: null,
    viewBox: '0 0 64 64',
    predefinedClassName: '',
    className: '',
    style: {
      fill: 'currentColor'
    }
  };

  render() {
    const {
      height,
      width,
      viewBox,
      style,
      children,
      predefinedClassName,
      className,
      colors,
      totalColor,
      ...props
    } = this.props;
    const svgHeight = height;
    const svgWidth = width || svgHeight;

    const fillStyle =
      Array.isArray(colors) && totalColor && getStyleClassFromColor(totalColor, colors);

    return (
      <svg
        viewBox={viewBox}
        width={svgWidth}
        height={svgHeight}
        style={style}
        className={`${predefinedClassName} ${className}`}
        {...props}
      >
        {fillStyle ? <style type="text/css">{fillStyle}</style> : null}
        {children}
      </svg>
    );
  }
}
