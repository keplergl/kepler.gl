// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {CSSProperties} from 'react';

const getStyleClassFromColor = (totalColor: number, colors: string[]) =>
  new Array(totalColor)
    .fill(1)
    .reduce((accu, c, i) => `${accu}.cr${i + 1} {fill:${colors[i % colors.length]};}`, '');

const nop = () => {
  return;
};

const DEFAULT_STYLE: CSSProperties = {
  fill: 'currentColor'
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

export const Base: React.FC<BaseProps> = ({
  height = undefined,
  width = undefined,
  viewBox = '0 0 64 64',
  style = DEFAULT_STYLE,
  children,
  predefinedClassName = '',
  className = '',
  colors,
  totalColor,
  ...props
}) => {
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
};

Base.displayName = 'Base Icon';
