// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Button, Edit} from '@kepler.gl/components';
import {ColorUI} from '@kepler.gl/types';
import {colorMapToColorBreaks, isNumericColorBreaks} from '@kepler.gl/utils';
import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {ColorBreak, ColorBreakOrdinal} from '@kepler.gl/utils';
import CustomPaletteFactory, {
  ColorPaletteItem,
  ColorSwatch,
  EditableColorRange,
  SetColorUIFunc
} from './custom-palette';

const StyledColorBreaksPanel = styled.div`
  margin-bottom: 10px;
`;
const StyledColorBreaksDisplay = styled.div`
  padding: 8px 12px 0 12px;
`;

export const EditButton = ({onClickEdit}) => (
  <Button className="editp__button" link onClick={onClickEdit}>
    <Edit height="16px" />
    Edit
  </Button>
);

export type ColorBreaksDisplayProps = {
  currentBreaks?: ColorBreak[] | ColorBreakOrdinal[] | null;
  onEdit: (() => void) | null;
};

export const ColorBreaksDisplay: React.FC<ColorBreaksDisplayProps> = ({currentBreaks, onEdit}) => {
  if (!isNumericColorBreaks(currentBreaks)) {
    // TODO: implement display for ordinal breaks
    return null;
  }
  return (
    <StyledColorBreaksDisplay>
      {onEdit ? <EditButton onClickEdit={onEdit} /> : null}
      {currentBreaks.map((item, index) => (
        <ColorPaletteItem className="disabled" key={index}>
          <div className="custom-palette-input__left">
            <ColorSwatch color={item.data} />
            <EditableColorRange
              item={item}
              isLast={index === currentBreaks.length - 1}
              index={index}
              editable={false}
            />
          </div>
        </ColorPaletteItem>
      ))}
    </StyledColorBreaksDisplay>
  );
};

/**
 * ColorBreaksPanelProps
 */
export type ColorBreaksPanelProps = {
  colorBreaks: ColorBreak[] | ColorBreakOrdinal[] | null;
  colorUIConfig: ColorUI;
  isCustomBreaks: boolean;
  setColorUI: SetColorUIFunc;
  onApply: (e: React.MouseEvent) => void;
  onCancel: () => void;
};

ColorBreaksPanelFactory.deps = [CustomPaletteFactory];

function ColorBreaksPanelFactory(
  CustomPalette: ReturnType<typeof CustomPaletteFactory>
): React.FC<ColorBreaksPanelProps> {
  const ColorBreaksPanel: React.FC<ColorBreaksPanelProps> = ({
    colorBreaks,
    colorUIConfig,
    isCustomBreaks,
    setColorUI,
    onApply,
    onCancel
  }) => {
    const {customPalette, showSketcher, colorRangeConfig} = colorUIConfig;
    const isEditingCustomBreaks = Boolean(colorRangeConfig.customBreaks);

    const currentBreaks = useMemo(
      () => (isEditingCustomBreaks ? colorMapToColorBreaks(customPalette.colorMap) : colorBreaks),
      [customPalette.colorMap, isEditingCustomBreaks, colorBreaks]
    );

    const onClickEditCustomBreaks = useCallback(() => {
      setColorUI({
        colorRangeConfig: {
          customBreaks: true
        }
      });
    }, [setColorUI]);

    const onCilckCancel = useCallback(() => {
      setColorUI({
        showSketcher: false,
        colorRangeConfig: {
          customBreaks: false
        }
      });
      onCancel();
    }, [setColorUI, onCancel]);

    return (
      <StyledColorBreaksPanel>
        {isEditingCustomBreaks ? (
          <CustomPalette
            customPalette={customPalette}
            showSketcher={showSketcher}
            onApply={onApply}
            setColorPaletteUI={setColorUI}
            onCancel={onCilckCancel}
          />
        ) : currentBreaks ? (
          <ColorBreaksDisplay
            currentBreaks={currentBreaks}
            onEdit={isCustomBreaks ? onClickEditCustomBreaks : null}
          />
        ) : null}
      </StyledColorBreaksPanel>
    );
  };

  return React.memo(ColorBreaksPanel);
}

export default ColorBreaksPanelFactory;
