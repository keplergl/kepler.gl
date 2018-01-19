import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {scaleBand} from 'd3-scale';
import {range} from 'd3-array';

// TODO: remove uber colors, replace with generic color schemes
import {ColorsByTheme, Themes} from 'constants/uber-colors';

// TODO: remove uber/react-accordion
import {Accordion, StatefulAccordionItem} from '@uber/react-accordion';

const PALLETE_HEIGHT = 8;
const PADDING = 6;

const propTypes = {
  width: PropTypes.number.isRequired,
  setColor: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired
};

export default class ColorSingleSelect extends Component {
  _onSelectColor = (color, e) => {
    e.stopPropagation();
    this.props.setColor(color);
  };

  render() {
    const {width, selectedColor} = this.props;

    return (
      <Accordion
        className="one-whole flush color-single-selector"
        style={{width, margin: 'auto'}}
      >
        <div
          className="display--inline-block color--block"
          style={{backgroundColor: selectedColor}}
        />
        <StatefulAccordionItem linkText={`" "`}>
          <ColorPalette
            width={width}
            selectedColor={selectedColor}
            onSelectColor={this._onSelectColor}
          />
        </StatefulAccordionItem>
      </Accordion>
    );
  }
}

ColorSingleSelect.propTypes = propTypes;

const ColorPalette = ({width, selectedColor, onSelectColor}) => {
  // max row length
  const rows = 16;
  const columns = Themes;
  const height = PALLETE_HEIGHT * rows + 2 * PADDING;

  const scale = scaleBand()
    .domain(range(0, columns.length, 1))
    .range([0, width - 2 * PADDING])
    .round(true);

  const bandWidth = scale.bandwidth();

  return (
    <div>
      <svg style={{width, height}}>
        {columns.map((theme, col) => (
          <g
            transform={`translate(${scale(col) -
              bandWidth / 2 +
              4 +
              PADDING}, 0)`}
            key={theme}
          >
            {range(1, rows + 1, 1).map((key, i) => (
              <rect
                className="cursor--pointer"
                width={bandWidth - 2}
                height={PALLETE_HEIGHT - 2}
                key={`${theme}_${key}`}
                x="2"
                y={PALLETE_HEIGHT * i + 2 + PADDING}
                style={{
                  fill: ColorsByTheme[theme][String(key)],
                  stroke:
                    selectedColor === ColorsByTheme[theme][String(key)]
                      ? '#ff0000'
                      : ColorsByTheme[theme][String(key)],
                  strokeWidth: 2
                }}
                onClick={e =>
                  onSelectColor(ColorsByTheme[theme][String(key)], e)
                }
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};
