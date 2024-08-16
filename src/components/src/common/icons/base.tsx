// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, CSSProperties} from 'react';

const getStyleClassFromColor = (totalColor: number, colors: string[]) =>
  new Array(totalColor)
    .fill(1)
    .reduce((accu, c, i) => `${accu}.cr${i + 1} {fill:${colors[i % colors.length]};}`, '');

const nop = () => {
  return;
};

export type BaseProps = {
  /** Set the height of the icon, ex. '16px' */
  height?: string;
  /** Set the width of the icon, ex. '16px' */
  width?: string;
  /** Set the viewbox of the svg */
  viewBox?: string;
  /** Path element */

  predefinedClassName?: string;
  className?: string;
  style?: CSSProperties;
  colors?: string[];
  totalColor?: number;
} & React.SVGAttributes<SVGSVGElement> &
  React.DOMAttributes<SVGSVGElement>;

export default class Base extends Component<BaseProps> {
  static displayName = 'Base Icon';

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
        onClick={nop}
        {...props}
      >
        {fillStyle ? <style type="text/css">{fillStyle}</style> : null}
        {children}
      </svg>
    );
  }
}
