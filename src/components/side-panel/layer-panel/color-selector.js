import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {rgbToHex} from 'utils/color-utils';
import PanelDropdown from 'components/side-panel/panel-dropdown';
import SingleColorPalette from 'components/side-panel/layer-panel/single-color-palette';
import ColorRangeSelector from 'components/side-panel/layer-panel/color-range-selector';
import ColorPalette from 'components/side-panel/layer-panel/color-palette';

const propTypes = {
  selectedColor: PropTypes.array,
  selectedColorRange: PropTypes.object,
  setColor: PropTypes.func.isRequired,
  isRange: PropTypes.bool
};

const defaultProps = {
  selectedColor: [],
  selectedColorRange: {},
  setColor: () => {},
  isRange: false
};

const ColorBlock = styled.div`
  width: 32px;
  height: 18px;
  border-radius: 1px;
  background-color: ${props => `rgb(${props.color.join(',')})`};
`;

const ColorSelectorInput = styled.div`
  ${props => props.theme.input};
`;

const InputBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  
  .color-single-selector__selector:first-child {
    margin-right: 12px;
  }
`;

export default class ColorSelector extends Component {
  state = {
    showDropdown: false
  };

  _onSelectColor = (color, e) => {
    e.stopPropagation();
    this.props.setColor(color);
  };

  _showDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!this.state.showDropdown) {
      this.setState({showDropdown: true});
    }
  };

  _hideDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (this.state.showDropdown) {
      this.setState({showDropdown: false});
    }
  };

  render() {
    const {selectedColor, disabled, isRange, selectedColorRange} = this.props;
    return (
      <div
        className="color-single-selector"
        ref={comp => {
          this.container = comp;
        }}
      >
        <InputBoxContainer>
          <ColorSelectorInput
            className="color-single-selector__selector"
            active={this.state.showDropdown}
            disabled={disabled}
            onMouseDown={this._showDropdown}
          >
            {isRange ? (
              <ColorPalette
                colors={selectedColorRange.colors}/>
            ) : (
              <ColorBlock
                className="color-single-selector__selector__block"
                color={selectedColor}
              />
            )}
          </ColorSelectorInput>

          <ColorSelectorInput
            className="color-single-selector__selector"
            active={this.state.showDropdown}
            disabled={disabled}
            onMouseDown={this._showDropdown}
          >
            {isRange ? (
              <ColorPalette
                colors={selectedColorRange.colors}/>
            ) : (
              <ColorBlock
                className="color-single-selector__selector__block"
                color={selectedColor}
              />
            )}
          </ColorSelectorInput>
        </InputBoxContainer>
        {this.state.showDropdown ? (
          <PanelDropdown
            className="color-single-selector__dropdown"
            onClose={this._hideDropdown}
          >
            {isRange ? (
              <ColorRangeSelector
                selectedColorRange={selectedColorRange}
                onSelectColorRange={this._onSelectColor}
              />
            ) : (
              <SingleColorPalette
                selectedColor={rgbToHex(selectedColor)}
                onSelectColor={this._onSelectColor}
              />
            )}
          </PanelDropdown>
        ) : null}
      </div>
    );
  }
}

ColorSelector.propTypes = propTypes;
ColorSelector.defaultProps = defaultProps;
