import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {rgbToHex} from 'utils/color-utils';
import SingleColorPalette from 'components/side-panel/layer-panel/single-color-palette';
import ColorRangeSelector from 'components/side-panel/layer-panel/color-range-selector';
import ColorPalette from 'components/side-panel/layer-panel/color-palette';
import {PanelLabel, StyledPanelDropdown} from "components/common/styled-components";
import listensToClickOutside from 'react-onclickoutside/decorator';

const propTypes = {
  colorSets: PropTypes.arrayOf(
    PropTypes.shape({
      selectedColor: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      setColor: PropTypes.func.isRequired,
      isRange: PropTypes.bool,
      label: PropTypes.string
    })
  ),
  disabled: PropTypes.bool
};

const defaultProps = {
  colorSets: []
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
  
  .color-select__input-group {
    flex-grow: 1;
  }
  .color-select__input-group:nth-child(2) {
    margin-left: 12px;
  }
`;

class ColorSelector extends Component {
  state = {
    editing: false
  };

  handleClickOutside = (e) => {
    this._hideDropdown(e);
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

  _hideDropdown = e => {
    e.stopPropagation();
    e.preventDefault();
    if (this.state.editing !== false) {
      this.setState({editing: false});
    }
  };

  render() {
    const {colorSets, disabled} = this.props;
    const {editing} = this.state;
    const currentEditing = colorSets[editing] && typeof colorSets[editing] === 'object';

    return (
      <div className="color-selector">
        <InputBoxContainer>
          {colorSets.map((cSet, i) => (
            <div className="color-select__input-group"  key={i}>
              {cSet.label ? <PanelLabel>{cSet.label}</PanelLabel> : null}
              <ColorSelectorInput
                className="color-selector__selector"
                active={editing === i}
                disabled={disabled}
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
              </ColorSelectorInput>
            </div>
          ))}
        </InputBoxContainer>
        {currentEditing ? (
          <StyledPanelDropdown
            className="color-selector__dropdown"
          >
            {colorSets[editing].isRange ? (
              <ColorRangeSelector
                selectedColorRange={colorSets[editing].selectedColor}
                onSelectColorRange={this._onSelectColor}
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

ColorSelector.propTypes = propTypes;
ColorSelector.defaultProps = defaultProps;

export default listensToClickOutside(ColorSelector);
