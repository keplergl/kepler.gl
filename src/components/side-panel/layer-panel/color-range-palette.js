import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

const ColorRangePalette = ({colors, width, height, className, style}) => (
  <svg style={{...style, width, height}} className={className}>
    {colors
      .map((color, i) => (
        <rect
          key={i}
          width={width / colors.length}
          height={height}
          x={width / colors.length * i}
          style={{fill: color, stroke: 'none'}}
        />
      ))
      .concat(
        <rect
          x="0.5"
          y="0.5"
          key="selected"
          width={width - 1.5}
          height={height - 1.5}
          style={{
            stroke: 'none',
            fill: 'none',
            strokeWidth: 1.5
          }}
        />
      )}
  </svg>
);

ColorRangePalette.propTypes = propTypes;

export default ColorRangePalette;
