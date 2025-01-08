// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {toArray} from '@kepler.gl/common-utils';
import {SCALE_TYPES} from '@kepler.gl/constants';
import {KeplerTable} from '@kepler.gl/table';
import {Bin, ColorMap, ColorUI, Field} from '@kepler.gl/types';
import {
  ColorBreak,
  ColorBreakOrdinal,
  colorBreaksToColorMap,
  colorMapToColorBreaks,
  isNumericColorBreaks as notOrdinalColorBreaks
} from '@kepler.gl/utils';
import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import ColumnStatsChartFactory from '../../common/column-stats-chart';
import {Edit} from '../../common/icons';
import {Button} from '../../common/styled-components';
import CustomPaletteFactory, {
  ColorPaletteItem,
  ColorSwatch,
  EditableColorRange,
  CategoricalSelector,
  SetColorUIFunc
} from './custom-palette';

const StyledColorBreaksPanel = styled.div.attrs({
  className: 'styled-color-breaks-panel'
})`
  margin-bottom: 10px;
`;

const StyledColorBreaksDisplay = styled.div.attrs({
  className: 'styled-color-breaks-display'
})`
  padding: 8px 12px 0 12px;
`;

const ColorBreaksPanelWrapper = styled.div``;

type EditButtonProps = {onClickEdit: () => void};

export const EditButton: React.FC<EditButtonProps> = ({onClickEdit}) => (
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
  if (!notOrdinalColorBreaks(currentBreaks)) {
    // don't display color breaks for ordinal breaks, user can change it in custom breaks
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

export type CategoricalColorDisplayProps = {
  colorMap?: ColorMap;
  onEdit: (() => void) | null;
};

export const CategoricalColorDisplay: React.FC<CategoricalColorDisplayProps> = ({
  colorMap,
  onEdit
}: CategoricalColorDisplayProps) => {
  return (
    <StyledColorBreaksDisplay>
      {onEdit ? <EditButton onClickEdit={onEdit} /> : null}
      {colorMap?.map((cm, index) => (
        <ColorPaletteItem className="disabled" key={index}>
          <div className="custom-palette-input__left">
            <ColorSwatch color={cm[1]} />
            <CategoricalSelector
              index={index}
              selectedValues={toArray(cm[0])}
              allValues={[]}
              editable={false}
            />
          </div>
        </ColorPaletteItem>
      ))}
    </StyledColorBreaksDisplay>
  );
};

export type ColorBreaksPanelProps = {
  colorBreaks: ColorBreak[] | ColorBreakOrdinal[] | null;
  colorUIConfig: ColorUI;
  dataset: KeplerTable | undefined;
  colorField: Field;
  isCustomBreaks: boolean;
  allBins: Bin[];
  filteredBins: Bin[];
  isFiltered: boolean;
  histogramDomain: number[];
  ordinalDomain: number[] | string[];
  setColorUI: SetColorUIFunc;
  onScaleChange: (v: string, visConfg?: Record<string, any>) => void;
  onApply: (e: React.MouseEvent) => void;
  onCancel: () => void;
};

ColorBreaksPanelFactory.deps = [CustomPaletteFactory, ColumnStatsChartFactory];

function ColorBreaksPanelFactory(
  CustomPalette: ReturnType<typeof CustomPaletteFactory>,
  ColumnStatsChart: ReturnType<typeof ColumnStatsChartFactory>
): React.FC<ColorBreaksPanelProps> {
  // eslint-disable-next-line complexity
  const ColorBreaksPanel: React.FC<ColorBreaksPanelProps> = ({
    colorBreaks,
    colorUIConfig,
    dataset,
    colorField,
    isCustomBreaks,
    allBins,
    filteredBins,
    isFiltered,
    histogramDomain,
    ordinalDomain,
    setColorUI,
    onScaleChange,
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

    const onColumnStatsChartChanged = useCallback(
      newColorBreaks => {
        const newColors = newColorBreaks.map(cb => cb.data);
        const newColorMap = colorBreaksToColorMap(newColorBreaks);

        const newCustomPalette = {
          ...customPalette,
          colorMap: newColorMap,
          colors: newColors
        };

        // update custom pallette editor
        if (!isEditingCustomBreaks) {
          setColorUI({
            colorRangeConfig: {
              customBreaks: true
            },
            customPalette: newCustomPalette
          });
        } else {
          setColorUI({customPalette: newCustomPalette});
        }

        // trigger the map to re-render using newCustomPalette
        onScaleChange(SCALE_TYPES.custom, newCustomPalette);
      },
      [setColorUI, customPalette, isEditingCustomBreaks, onScaleChange]
    );

    return (
      <ColorBreaksPanelWrapper>
        {dataset && allBins.length > 1 && notOrdinalColorBreaks(colorBreaks) ? (
          <ColumnStatsChart
            colorField={colorField}
            dataset={dataset}
            colorBreaks={currentBreaks}
            allBins={allBins}
            filteredBins={filteredBins}
            isFiltered={isFiltered}
            histogramDomain={histogramDomain}
            onChangedUpdater={onColumnStatsChartChanged}
          />
        ) : null}
        <StyledColorBreaksPanel>
          {isEditingCustomBreaks ? (
            <CustomPalette
              ordinalDomain={ordinalDomain}
              customPalette={customPalette}
              setColorPaletteUI={setColorUI}
              showSketcher={showSketcher}
              onApply={onApply}
              onCancel={onCilckCancel}
            />
          ) : currentBreaks && allBins.length > 1 && notOrdinalColorBreaks(colorBreaks) ? (
            <ColorBreaksDisplay
              currentBreaks={currentBreaks}
              onEdit={isCustomBreaks ? onClickEditCustomBreaks : null}
            />
          ) : customPalette.colorMap &&
            customPalette.type === 'customOrdinal' &&
            customPalette.name?.endsWith(colorField.name) ? (
            <CategoricalColorDisplay
              colorMap={customPalette.colorMap}
              onEdit={isCustomBreaks ? onClickEditCustomBreaks : null}
            />
          ) : null}
        </StyledColorBreaksPanel>
      </ColorBreaksPanelWrapper>
    );
  };

  return React.memo(ColorBreaksPanel);
}

export default ColorBreaksPanelFactory;
