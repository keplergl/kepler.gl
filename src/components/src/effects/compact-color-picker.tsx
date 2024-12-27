// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';

import {rgbToHex} from '@kepler.gl/utils';

import {Button} from '../common/styled-components';
import Portaled from '../common/portaled';
import SingleColorPalette from '../side-panel/layer-panel/single-color-palette';

export type SingleColorPickerProps = {
  color: [number, number, number];
  onSetColor: (value: [number, number, number]) => void;
  label: string;
  Icon: React.ElementType;
};

export const StyledPanelDropdown = styled.div`
  ${props => props.theme.panelDropdownScrollBar}
  background-color: ${props => props.theme.panelBackground};
  box-shadow: ${props => props.theme.panelBoxShadow};
  border-radius: ${props => props.theme.panelBorderRadius};
  overflow-y: auto;
  max-height: 500px;
  position: relative;
  z-index: 999;
  width: 220px;
`;

const StyledConfigSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.div`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary2};
  margin-bottom: 8px;
`;

const StyledDropdownButtonWrapper = styled.div`
  align-self: flex-start;
  .button {
    color: ${props => props.theme.effectPanelTextSecondary2};
    display: flex;
    gap: 5px;
    border: none;
    transition: background 0.2s;
    background-color: ${props => props.theme.inputBgd};
    padding: 8px 5px 8px 10px;
    &:active {
      color: ${props => props.theme.effectPanelTextMain};
      background-color: ${props => props.theme.inputBgdHover};
    }
    &:hover {
      color: ${props => props.theme.effectPanelTextMain};
      background-color: ${props => props.theme.inputBgdHover};
    }
    & > svg {
      margin-right: 0;
    }
  }
`;

const DEFAULT_OFFSET = {
  top: 0,
  left: 0
};

const SingleColorPickerDropdown = ({
  isOpened,
  onClose,
  selectedColor,
  onSelectColor,
  offset = DEFAULT_OFFSET
}) => {
  const onSelectColorCb = useCallback(
    v => {
      onSelectColor(v);
    },
    [onSelectColor]
  );
  return (
    <Portaled top={offset.top} left={offset.left} isOpened={isOpened} onClose={onClose}>
      <StyledPanelDropdown>
        <SingleColorPalette selectedColor={selectedColor} onSelectColor={onSelectColorCb} />
      </StyledPanelDropdown>
    </Portaled>
  );
};

const CompactColorPicker: React.FC<SingleColorPickerProps> = ({
  color,
  onSetColor,
  Icon,
  label
}: SingleColorPickerProps) => {
  const [isColorPickerOpened, setIsColorPickerOpened] = React.useState(false);

  const hexColor = useMemo(() => {
    return rgbToHex(color);
  }, [color]);

  const colorBlockStyle = useMemo(
    () => ({
      width: 16,
      height: 16,
      backgroundColor: hexColor,
      borderRadius: 2
    }),
    [hexColor]
  );

  const toggleDropdown = useCallback(() => {
    setIsColorPickerOpened(!isColorPickerOpened);
  }, [isColorPickerOpened, setIsColorPickerOpened]);

  const closeDropdown = useCallback(() => {
    setIsColorPickerOpened(false);
  }, [setIsColorPickerOpened]);

  return (
    <StyledConfigSection>
      <SectionTitle>{label}</SectionTitle>
      <StyledDropdownButtonWrapper>
        <Button onClick={toggleDropdown}>
          <div style={colorBlockStyle} />
          <Icon />
        </Button>
      </StyledDropdownButtonWrapper>
      <SingleColorPickerDropdown
        isOpened={isColorPickerOpened}
        onClose={closeDropdown}
        selectedColor={hexColor}
        onSelectColor={onSetColor}
      />
    </StyledConfigSection>
  );
};

export default CompactColorPicker;
