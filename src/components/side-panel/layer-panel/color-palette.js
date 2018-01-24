import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  colors: PropTypes.array.isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  isSelected: PropTypes.bool,
  isReversed: PropTypes.bool
};

const defaultProps = {
  height: 10,
  colors: [],
  className: '',
  isSelected: false,
  isReversed: false
};

const PaletteWrapper = styled.div`
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
`;

const PaletteContainer = styled.div`
  display: flex;
  flex-grow: 1;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.isSelected ? '#FFFFFF' : 'transparent'};
  padding: 4px;
  border-radius: 4px;
`;

const ColorBlock = styled.div`
  flex-grow: 1;
`;

const ColorPalette = ({colors, height, className, isSelected, isReversed}) => (
  <PaletteContainer
    className={`color-range-palette ${className}`}
    isSelected={isSelected}
  >
    <PaletteWrapper className="color-range-palette__inner"
                    style={{height, transform: `scale(${isReversed ? -1 : 1}, 1)`}}>
      {colors.map(color => (
        <ColorBlock
          className="color-range-palette__block"
          key={color}
          style={{backgroundColor: color}}
        />
      ))}
    </PaletteWrapper>
  </PaletteContainer>
);

ColorPalette.propTypes = propTypes;
ColorPalette.defaultProps = defaultProps;

export default ColorPalette;
