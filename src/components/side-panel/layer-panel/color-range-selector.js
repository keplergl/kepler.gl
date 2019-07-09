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
import uniq from 'lodash.uniq';
import styled from 'styled-components';
import ItemSelector from 'components/common/item-selector/item-selector';
import {PanelLabel} from 'components/common/styled-components';
import RangeSlider from 'components/common/range-slider';
import Switch from 'components/common/switch';
import ColorPalette from './color-palette';
import CustomPalette from './custom-palette';
import {COLOR_RANGES} from 'constants/color-ranges';
import {numberSort} from 'utils/data-utils';

const ALL_TYPES = uniq(
  COLOR_RANGES.map(c => c.type)
    .filter(ctype => ctype)
    .concat(['all'])
);
const ALL_STEPS = uniq(COLOR_RANGES.map(d => d.colors.length)).sort(numberSort);

const StyledColorConfig = styled.div`
  padding: 12px 12px 0 12px;
`;

const ColorRangeSelector = styled.div`
  padding-bottom: 12px;
`;

export default class ColorRangeSelect extends Component {
  static propTypes = {
    colorRanges: PropTypes.arrayOf(PropTypes.any),
    selectedColorRange: PropTypes.object,
    onSelectColorRange: PropTypes.func.isRequired,
    customPalette: PropTypes.object,
    setCustomPalette: PropTypes.func,
    showSketcher: PropTypes.bool,
    onToggleSketcherUpdater: PropTypes.func
  };

  static defaultProps = {
    colorRanges: COLOR_RANGES,
    onSelectColorRange: () => {}
  };

  state = {
    config: {
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
      },
      custom: {
        type: 'switch',
        value: false,
        options: [true, false]
      }
    }
  };

  _updateConfig = ({key, value}) => {
    const currentValue = this.state.config[key].value;
    // change default custom palette to selected color range
    if (key === 'custom' && value !== currentValue) {
      this.props.setCustomPalette({
        name: 'Custom Palette',
        type: null,
        category: 'Uber',
        colors: this.props.selectedColorRange.colors
      });
    }

    if (value !== currentValue) {
      this.setState({
        config: {
          ...this.state.config,
          [key]: {
            ...this.state.config[key],
            value
          }
        }
      });
    }
  };

  _onCustomPaletteCancel = () => {
    this.setState({
      config: {
        ...this.state.config,
        custom: {
          ...this.state.config.custom,
          value: false
        }
      }
    });
  };

  render() {
    const {config} = this.state;
    const {
      customPalette,
      setCustomPalette,
      showSketcher,
      onToggleSketcherUpdater
    } = this.props;

    return (
      <ColorRangeSelector className="color-range-selector">
        <StyledColorConfig>
          {(config.custom.value ? ['custom'] : Object.keys(config)).map(key => (
            <PaletteConfig
              key={key}
              label={key}
              config={config[key]}
              onChange={value => this._updateConfig({key, value})}
            />
          ))}
        </StyledColorConfig>

        {config.custom.value ? (
          <CustomPalette
            customPalette={customPalette}
            setCustomPalette={setCustomPalette}
            showSketcher={showSketcher}
            onToggleSketcherUpdater={onToggleSketcherUpdater}
            onSelect={this.props.onSelectColorRange}
            selected={this.props.selectedColorRange}
            onApply={this.props.onSelectColorRange}
            onCancel={this._onCustomPaletteCancel}
          />
        ) : (
          <ColorPaletteGroup
            config={config}
            colorRanges={this.props.colorRanges}
            onSelect={this.props.onSelectColorRange}
            selected={this.props.selectedColorRange}
          />
        )}
      </ColorRangeSelector>
    );
  }
}

const StyledPaletteConfig = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .color-palette__config__label {
    flex-grow: 1;
  }
  .color-palette__config__select {
    flex-grow: 1;
  }
  .item-selector .item-selector__dropdown {
    ${props => props.theme.secondaryInput};
  }
`;

const PaletteConfig = ({
  category,
  label,
  config: {type, value, options},
  onChange
}) => (
  <StyledPaletteConfig
    className="color-palette__config"
    onClick={e => e.stopPropagation()}
  >
    <div className="color-palette__config__label">
      <PanelLabel>{label}</PanelLabel>
    </div>
    {type === 'select' && (
      <div className="color-palette__config__select">
        <ItemSelector
          selectedItems={value}
          options={options}
          multiSelect={false}
          searchable={false}
          onChange={onChange}
        />
      </div>
    )}
    {type === 'slider' && (
      <div className="color-palette__config__slider">
        <div className="color-palette__config__slider__slider">
          <RangeSlider
            range={options}
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
        checked={value}
        id={`${category}-${label}-toggle`}
        onChange={() => onChange(!value)}
        secondary
      />
    )}
  </StyledPaletteConfig>
);

const StyledColorRange = styled.div`
  padding: 0 8px;
  :hover {
    background-color: ${props => props.theme.panelBackgroundHover};
    cursor: pointer;
  }
`;

const ColorPaletteGroup = ({config = {}, onSelect, selected, colorRanges}) => {
  const {steps, reversed, type} = config;

  const filtered = colorRanges.filter(colorRange => {
    const isType =
      !type || type.value === 'all' || type.value === colorRange.type;
    const isStep = !steps || Number(steps.value) === colorRange.colors.length;

    return isType && isStep;
  });

  const isReversed = Boolean(reversed && reversed.value);

  return (
    <div className="color-palette__group">
      {filtered.map(colorRange => (
        <StyledColorRange
          className="color-ranges"
          key={colorRange.name}
          onClick={e =>
            onSelect(
              {
                ...colorRange,
                reversed: isReversed,
                colors: isReversed
                  ? colorRange.colors.slice().reverse()
                  : colorRange.colors
              },
              e
            )
          }
        >
          <ColorPalette
            colors={colorRange.colors}
            isReversed={isReversed}
            isSelected={
              colorRange.name === selected.name &&
              isReversed === Boolean(selected.reversed)
            }
          />
        </StyledColorRange>
      ))}
    </div>
  );
};
