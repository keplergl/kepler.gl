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
import styled from 'styled-components';
import {rgbToHex} from 'utils/color-utils';
import SingleColorPalette from 'components/side-panel/layer-panel/single-color-palette';
import ColorRangeSelector from 'components/side-panel/layer-panel/color-range-selector';
import ColorPalette from 'components/side-panel/layer-panel/color-palette';
import {StyledPanelDropdown} from 'components/common/styled-components';
import onClickOutside from 'react-onclickoutside';

const ColorBlock = styled.div`
  width: 32px;
  height: 18px;
  border-radius: 1px;
  background-color: ${props => `rgb(${props.color.slice(0, 3).join(',')})`};
`;

const ColorSelectorInput = styled.div`
  ${props =>
    props.inputTheme === 'secondary'
      ? props.theme.secondaryInput
      : props.theme.input};
  height: ${props => props.theme.inputBoxHeight};

  .color-selector__selector__label {
    text-transform: capitalize;
    font-size: 12px;
    text-align: center;
    color: ${props => props.theme.inputPlaceholderColor};
  }
`;

const InputBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;

  .color-select__input-group {
    flex-grow: 1;
  }
  .color-select__input-group:nth-child(2) {
    margin-left: 12px;
  }
`;

class ColorSelector extends Component {
  static propTypes = {
    colorSets: PropTypes.arrayOf(
      PropTypes.shape({
        selectedColor: PropTypes.oneOfType([
          PropTypes.arrayOf(PropTypes.any),
          PropTypes.object
        ]),
        setColor: PropTypes.func.isRequired,
        isRange: PropTypes.bool,
        label: PropTypes.string
      })
    ),
    inputTheme: PropTypes.string,
    disabled: PropTypes.bool,
    customPalette: PropTypes.object,
    setCustomPalette: PropTypes.func,
    showSketcher: PropTypes.bool
  };

  static defaultProps = {
    colorSets: []
  };

  state = {
    editing: false
  };

  handleClickOutside = e => {
    if (this.state.editing !== false && !this.props.showSketcher) {
      this.setState({editing: false});
    }
  };

  _onSelectColor = (color, e) => {
    e.stopPropagation();
    if (this.props.colorSets[this.state.editing]) {
      this.props.colorSets[this.state.editing].setColor(color);
    }
  };

  _showDropdown = (e, i) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({editing: i});
  };

  render() {
    const {
      colorSets,
      disabled,
      inputTheme,
      customPalette,
      setCustomPalette,
      showSketcher,
      onToggleSketcherUpdater
    } = this.props;
    const {editing} = this.state;
    const currentEditing =
      colorSets[editing] && typeof colorSets[editing] === 'object';

    return (
      <div className="color-selector">
        <InputBoxContainer>
          {colorSets.map((cSet, i) => (
            <div className="color-select__input-group" key={i}>
              <ColorSelectorInput
                className="color-selector__selector"
                active={editing === i}
                disabled={disabled}
                inputTheme={inputTheme}
                onMouseDown={e => this._showDropdown(e, i)}
              >
                {cSet.isRange ? (
                  <ColorPalette colors={cSet.selectedColor.colors} />
                ) : (
                  <ColorBlock
                    className="color-selector__selector__block"
                    color={cSet.selectedColor}
                  />
                )}
                {cSet.label ? (
                  <div className="color-selector__selector__label">
                    {cSet.label}
                  </div>
                ) : null}
              </ColorSelectorInput>
            </div>
          ))}
        </InputBoxContainer>
        {currentEditing ? (
          <StyledPanelDropdown className="color-selector__dropdown">
            {colorSets[editing].isRange ? (
              <ColorRangeSelector
                selectedColorRange={colorSets[editing].selectedColor}
                onSelectColorRange={this._onSelectColor}
                customPalette={customPalette}
                setCustomPalette={setCustomPalette}
                showSketcher={showSketcher}
                onToggleSketcherUpdater={onToggleSketcherUpdater}
              />
            ) : (
              <SingleColorPalette
                selectedColor={rgbToHex(colorSets[editing].selectedColor)}
                onSelectColor={this._onSelectColor}
              />
            )}
          </StyledPanelDropdown>
        ) : null}
      </div>
    );
  }
}

export default onClickOutside(ColorSelector);
