import React from 'react';
import r from 'r-dom';

import {ReactBaseComponent} from '../../../utils/react-utils';

const propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  colors: React.PropTypes.array.isRequired,
  className: React.PropTypes.string,
  style: React.PropTypes.object
};

export default class ColorRangePalette extends ReactBaseComponent {

  render() {
    const {colors, width, height, className} = this.props;
    const bandWidth = width / colors.length;
    const style = {...this.props.style, width, height};

    return r.svg({style, className}, [
      colors.map((color, i) => (
        r.rect({
          width: bandWidth,
          height,
          x: bandWidth * i,
          style: {fill: color, stroke: 'none'}
        })
      )).concat(r.rect({
        x: 0.5,
        y: 0.5,
        width: width - 1.5,
        height: height - 1.5,
        style: {
          stroke: 'none',
          fill: 'none',
          strokeWidth: 1.5
        }
      }))
    ]);
  }
}

ColorRangePalette.propTypes = propTypes;
ColorRangePalette.displayName = 'ColorRangePalette';
