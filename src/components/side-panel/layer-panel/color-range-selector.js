import React, {Component} from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash.uniq';
import classnames from 'classnames';
import {Switch} from '@uber/react-switch';
import {Accordion, StatefulAccordionItem} from '@uber/react-accordion';

import {PanelLabel} from 'components/common/styled-components';
import RangeSlider from 'components/common/range-slider';
import ColorRangePalette from './color-range-palette';

import {COLOR_RANGES} from 'constants/color-ranges';
import {capitalizeFirstLetter} from 'utils/utils';

const PALETTE_HEIGHT = 12;

const ALL_COLORS = COLOR_RANGES.filter(
  colors => colors.category === 'ColorBrewer'
);

const ALL_TYPES = uniq(ALL_COLORS.map(c => c.type).concat(['all']));
const ALL_STEPS = uniq(ALL_COLORS.map(d => d.colors.length));

const propTypes = {
  width: PropTypes.number.isRequired,
  selectedColorRange: PropTypes.object.isRequired,
  onSelectColorRange: PropTypes.func.isRequired
};

export default class ColorRangeSelect extends Component {
  state = {
    configs: {
      Uber: {
        reversed: {
          type: 'switch',
          value: false
        }
      },
      ColorBrewer: {
        type: {
          type: 'select',
          value: 'all',
          options: ALL_TYPES
        },
        steps: {
          type: 'select',
          value: 6,
          options: ALL_STEPS
        },
        reversed: {
          type: 'switch',
          value: false,
          options: [true, false]
        }
      }
    }
  };

  _updateConfig = ({category, key, value}) => {
    const currentValue = this.state.configs[category][key].value;
    if (value !== currentValue) {
      this.setState({
        configs: {
          ...this.state.configs,
          [category]: {
            ...this.state.configs[category],
            [key]: {
              ...this.state.configs[category][key],
              value
            }
          }
        }
      });
    }
  };

  _renderPaletteConfig(category) {
    const config = this.state.configs[category];

    return (
      <div>
        {Object.keys(config).map(key => (
          <PaletteConfig
            key={key}
            label={key}
            category={category}
            config={config[key]}
            onChange={value => this._updateConfig({category, key, value})}
          />
        ))}
      </div>
    );
  }

  _renderEachCategory(category) {
    const {width} = this.props;

    return (
      <StatefulAccordionItem linkText={category}>
        {this._renderPaletteConfig(category)}
        <ColorPalette
          category={category}
          config={this.state.configs[category]}
          width={width}
          onSelect={this.props.onSelectColorRange}
          selected={this.props.selectedColorRange}
        />
      </StatefulAccordionItem>
    );
  }

  render() {
    const {width, selectedColorRange} = this.props;

    return (
      <div className="color-palette-selector">
        <ColorRangePalette
          width={width}
          height={PALETTE_HEIGHT}
          colors={selectedColorRange.colors}
        />
        <Accordion className="one-whole flush" style={{width, margin: 'auto'}}>
          {this._renderEachCategory('Uber')}
          {this._renderEachCategory('ColorBrewer')}
        </Accordion>
      </div>
    );
  }
}

const PaletteConfig = ({
  category,
  label,
  config: {type, value, options},
  onChange
}) => {
  return (
    <div className="color-palette__config" onClick={e => e.stopPropagation()}>
      <div className="">
        <PanelLabel>{label}</PanelLabel>
      </div>
      {type === 'select' && (
        <div className="select dark select--small flush">
          <select
            className="flush"
            id={label}
            value={value}
            onChange={({target}) => onChange(target.value)}
          >
            {options.map(option => (
              <option value={option} key={option}>
                {typeof option === 'string'
                  ? capitalizeFirstLetter(option)
                  : option}
              </option>
            ))}
          </select>
        </div>
      )}
      {type === 'slider' && (
        <div className="color-palette__config__slider">
          <div className="color-palette__config__slider__slider">
            <RangeSlider
              minValue={options[0]}
              maxValue={options[1]}
              value0={options[0]}
              value1={value}
              step={1}
              isRanged={false}
              showInput={false}
              onChange={val => onChange(val[1])}
            />
          </div>
          <div className="color-palette__config__slider__number">{value}</div>
        </div>
      )}
      {type === 'switch' && (
        <Switch
          style={{marginBottom: 0, marginRight: '-10px'}}
          checked={value}
          id={`${category}-${label}-toggle`}
          label=""
          size="small"
          onChange={() => onChange(!value)}
        />
      )}
    </div>
  );
};

function ColorPalette({category, config, width, onSelect, selected}) {
  const {steps, reversed, type} = config;

  const colorRanges = COLOR_RANGES.filter(colorRange => {
    const isCategory = colorRange.category === category;
    const isType =
      !type || type.value === 'all' || type.value === colorRange.type;
    const isStep = !steps || Number(steps.value) === colorRange.colors.length;

    return isCategory && isType && isStep;
  });

  const isReversed = Boolean(reversed && reversed.value);
  const padding = 14;

  return (
    <div>
      {colorRanges.map(colorRange => (
        <div
          className={classnames('color-ranges', {
            selected:
              colorRange.name === selected.name &&
              isReversed === Boolean(selected.reversed)
          })}
          style={{paddingLeft: padding, paddingRight: padding}}
          key={colorRange.name}
          onClick={e =>
            onSelect({
              colorRange: {
                ...colorRange,
                reversed: isReversed,
                colors: isReversed
                  ? colorRange.colors.slice().reverse()
                  : colorRange.colors
              }
            })
          }
        >
          <ColorRangePalette
            width={width - padding * 2 - 5}
            height={PALETTE_HEIGHT}
            colors={
              isReversed
                ? colorRange.colors.slice().reverse()
                : colorRange.colors
            }
          />
        </div>
      ))}
    </div>
  );
}

ColorRangeSelect.propTypes = propTypes;
