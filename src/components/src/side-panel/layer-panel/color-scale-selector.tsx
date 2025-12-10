// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';

import {ALL_FIELD_TYPES, SCALE_TYPES} from '@kepler.gl/constants';
import {AggregatedBin, Layer, VisualChannelDomain} from '@kepler.gl/layers';
import {KeplerTable} from '@kepler.gl/table';
import {ColorRange, ColorUI, Field} from '@kepler.gl/types';
import {
  getLayerColorScale,
  getLegendOfScale,
  initCustomPaletteByCustomScale,
  histogramFromValues,
  histogramFromOrdinal,
  histogramFromThreshold,
  getHistogramDomain,
  hasColorMap
} from '@kepler.gl/utils';

import ColorBreaksPanelFactory, {ColorBreaksPanelProps} from './color-breaks-panel';
import {SetColorUIFunc} from './custom-palette';
import DropdownSelect from '../../common/item-selector/dropdown-select';
import Accessor from '../../common/item-selector/accessor';
import DropdownList from '../../common/item-selector/dropdown-list';
import LazyTippy from '../../map/lazy-tippy';
import Typeahead from '../../common/item-selector/typeahead';

type TippyInstance = any; // 'tippy-js'

const HISTOGRAM_BINS = 30;

export type ScaleOption = {
  label: string;
  value: string;
};
export type OnSelectFunc = (v: string, visConfg?: Record<string, any>) => void;

export type ContextProps = ColorBreaksPanelProps;

export type ColorScaleSelectorProps = {
  layer: Layer;
  field: Field;
  dataset: KeplerTable;
  scaleType: string;
  domain: VisualChannelDomain;
  range: ColorRange;
  onSelect: OnSelectFunc;
  setColorUI: SetColorUIFunc;
  colorUIConfig: ColorUI;
  options: ScaleOption[];
  disabled?: boolean;
  selectedItems: ScaleOption[];
  multiSelect: boolean;
  searchable: boolean;
  displayOption: string;
  getOptionValue: string;
  aggregatedBins?: AggregatedBin[];
  channelKey: string;
};

const DropdownPropContext = React.createContext({});
const POPPER_OPTIONS = {
  modifiers: [
    // zero offsets since they are already added in VerticalToolbar
    {name: 'offset', options: {offset: [0, 0]}}
  ]
};

const DropdownBottom = styled.div<{light?: boolean}>`
  border-top: 1px solid
    ${props =>
      props.light ? props.theme.dropdownListBorderTopLT : props.theme.dropdownListBorderTop};
`;

const StyledScaleSelectDropdown = styled.div`
  box-shadow: ${props => props.theme.dropdownListShadow};
  .list-selector {
    box-shadow: none;
    border-top: 0;
  }
  .list__item {
    padding: 4px 9px;
  }
`;
const DropdownWrapper = styled.div`
  border: 0;
  width: 100%;
  left: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  position: absolute;
  margin-top: ${props => props.theme.dropdownWapperMargin}px;
`;

const StyledColorScaleSelector = styled.div`
  position: relative;
  .typeahead {
    // adds padding to bottom of dropdown
    margin-bottom: 40px;
  }
  [data-tippy-root] {
    width: 100%;
  }
`;

function hideTippy(tippyInstance) {
  if (tippyInstance) {
    tippyInstance.hide();
  }
}
ColorScaleSelectorFactory.deps = [ColorBreaksPanelFactory];

function ColorScaleSelectorFactory(
  ColorBreaksPanel: ReturnType<typeof ColorBreaksPanelFactory>
): React.FC<ColorScaleSelectorProps> {
  const ColorScaleSelectDropdown = props => (
    <StyledScaleSelectDropdown>
      <DropdownList {...props} />
      <DropdownPropContext.Consumer>
        {(context: any) => (
          <DropdownBottom>
            <ColorBreaksPanel {...context} />
          </DropdownBottom>
        )}
      </DropdownPropContext.Consumer>
    </StyledScaleSelectDropdown>
  );

  const ColorScaleSelector: React.FC<ColorScaleSelectorProps> = ({
    layer,
    field,
    dataset,
    onSelect,
    scaleType,
    domain,
    aggregatedBins,
    range,
    setColorUI,
    colorUIConfig,
    channelKey,
    ...dropdownSelectProps
  }) => {
    const displayOption = Accessor.generateOptionToStringFor(dropdownSelectProps.displayOption);
    const getOptionValue = useMemo(
      () => Accessor.generateOptionToStringFor(dropdownSelectProps.getOptionValue),
      [dropdownSelectProps.getOptionValue]
    );
    const [tippyInstance, setTippyInstance] = useState<TippyInstance>();
    const isEditingColorBreaks = colorUIConfig?.colorRangeConfig?.customBreaks;

    // Stores the previous selection for live preview: when choosing Custom/Custom Ordinal, we apply a temporary palette.
    // Cancel restores {scale, range} from this ref; Confirm keeps the change and clears the ref.
    // If the user switches between different custom scale types (e.g., from "Custom" to "Custom Ordinal") or is already in a custom scale state,
    // this ref is updated to always store the most recent non-custom selection. Only the latest non-custom selection is restorable on cancel.
    const prevSelectionRef = React.useRef<{scale: string; range: ColorRange} | null>(null);

    // when custom color scale - but Confirm is not clicked yet
    const pendingOption = useMemo(
      () =>
        isEditingColorBreaks
          ? (dropdownSelectProps.options || []).find(
              o => getOptionValue(o) === colorUIConfig?.customPalette?.type
            ) || null
          : null,
      [
        isEditingColorBreaks,
        dropdownSelectProps.options,
        getOptionValue,
        colorUIConfig?.customPalette?.type
      ]
    );
    const colorScale = useMemo(
      () =>
        getLayerColorScale({
          range,
          domain,
          scaleType,
          layer
        }),
      [range, domain, scaleType, layer]
    );

    const colorBreaks = useMemo(() => {
      return colorScale
        ? getLegendOfScale({
            scale: colorScale.byZoom && domain ? colorScale(domain?.length - 1) : colorScale,
            scaleType,
            fieldType: field?.type ?? ALL_FIELD_TYPES.real
          })
        : null;
    }, [colorScale, scaleType, field?.type, domain]);

    const columnStats = field?.filterProps?.columnStats;

    const fieldValueAccessor = useMemo(() => {
      return field
        ? idx => dataset.getValue(field.name, idx)
        : idx => dataset.dataContainer.rowAsArray(idx);
    }, [dataset, field]);

    const ordinalDomain = useMemo(() => {
      return layer.config[layer.visualChannels[channelKey].domain] || [];
    }, [channelKey, layer.config, layer.visualChannels]);

    // aggregatedBins should be the raw data
    const allBins = useMemo(() => {
      if (field?.type === ALL_FIELD_TYPES.string) {
        // Use ordinal bins for string columns, as d3 could potentially generate invalid numeric bins, and crash
        return histogramFromOrdinal(ordinalDomain, dataset.allIndexes, fieldValueAccessor);
      }

      if (aggregatedBins) {
        return histogramFromValues(
          Object.values(aggregatedBins).map(bin => bin.i),
          HISTOGRAM_BINS,
          idx => aggregatedBins[idx].value
        );
      }
      return columnStats?.bins
        ? columnStats?.bins
        : histogramFromValues(dataset.allIndexes, HISTOGRAM_BINS, fieldValueAccessor);
    }, [aggregatedBins, columnStats, dataset, fieldValueAccessor, field?.type, ordinalDomain]);

    const histogramDomain = useMemo(() => {
      return getHistogramDomain({aggregatedBins, columnStats, dataset, fieldValueAccessor});
    }, [dataset, fieldValueAccessor, aggregatedBins, columnStats]);

    const isFiltered = aggregatedBins
      ? false
      : dataset.filteredIndexForDomain.length !== dataset.allIndexes.length;

    // get filteredBins (not apply to aggregate layer)
    const filteredBins = useMemo(() => {
      if (!isFiltered) {
        return allBins;
      }
      if (field?.type === ALL_FIELD_TYPES.string) {
        return histogramFromOrdinal(
          ordinalDomain as any,
          dataset.filteredIndexForDomain,
          fieldValueAccessor
        );
      }
      // numeric thresholds
      const filterEmptyBins = false;
      const thresholds = allBins.map(b => b.x0);
      return histogramFromThreshold(
        thresholds,
        dataset.filteredIndexForDomain,
        fieldValueAccessor,
        filterEmptyBins
      );
    }, [dataset, fieldValueAccessor, allBins, isFiltered, field?.type, ordinalDomain]);

    const onSelectScale = useCallback(
      val => {
        // highlight selected option
        if (!val) return;

        const selectedScale = getOptionValue(val);
        if (selectedScale === SCALE_TYPES.custom || selectedScale === SCALE_TYPES.customOrdinal) {
          const customPalette = initCustomPaletteByCustomScale({
            scale: selectedScale,
            field,
            range,
            colorBreaks,
            ...(selectedScale === SCALE_TYPES.customOrdinal ? {ordinalDomain} : {})
          });
          setColorUI({
            showColorChart: true,
            colorRangeConfig: {
              customBreaks: true
            },
            customPalette
          });
          // store previous selection for cancel, then preview custom on the map
          if (!prevSelectionRef.current) {
            prevSelectionRef.current = {scale: scaleType, range};
          }
          onSelect(selectedScale, customPalette);
        } else if (hasColorMap(range)) {
          // not custom
          // remove colorMap
          // eslint-disable-next-line no-unused-vars
          const {colorMap: _, ...newRange} = range;
          // reset colorUI before changing the scale
          setColorUI({
            showColorChart: false,
            colorRangeConfig: {
              customBreaks: false
            }
          });
          onSelect(selectedScale, newRange);
        } else {
          // reset colorUI before changing the scale
          setColorUI({
            showColorChart: false,
            colorRangeConfig: {
              customBreaks: false
            }
          });
          onSelect(selectedScale);
        }
      },
      [field, setColorUI, onSelect, range, getOptionValue, colorBreaks, ordinalDomain, scaleType]
    );

    const onApply = useCallback(() => {
      // change scale type only if confirmed
      const nextScaleType = colorUIConfig?.customPalette?.type || scaleType;
      onSelect(nextScaleType, colorUIConfig.customPalette);
      hideTippy(tippyInstance);
      prevSelectionRef.current = null;
    }, [onSelect, colorUIConfig.customPalette, tippyInstance, scaleType]);

    const onCancel = useCallback(() => {
      // restore previous selection if any
      if (prevSelectionRef.current) {
        const {scale: prevScale, range: prevRange} = prevSelectionRef.current;
        onSelect(prevScale, prevRange);
      }
      hideTippy(tippyInstance);
      prevSelectionRef.current = null;
    }, [tippyInstance, onSelect]);

    const isCustomBreaks =
      scaleType === SCALE_TYPES.custom || scaleType === SCALE_TYPES.customOrdinal;

    return (
      <DropdownPropContext.Provider
        value={{
          setColorUI,
          colorField: field,
          dataset,
          colorUIConfig,
          colorBreaks,
          isCustomBreaks,
          allBins,
          filteredBins,
          isFiltered,
          histogramDomain,
          ordinalDomain,
          onScaleChange: onSelect,
          onApply,
          onCancel
        }}
      >
        <StyledColorScaleSelector>
          <LazyTippy
            trigger="click"
            placement="bottom-start"
            appendTo="parent"
            interactive={true}
            hideOnClick={!isEditingColorBreaks}
            onCreate={setTippyInstance}
            popperOptions={POPPER_OPTIONS}
            render={attrs => (
              <DropdownWrapper {...attrs}>
                {/* @ts-ignore*/}
                {!dropdownSelectProps.disabled && (
                  <Typeahead
                    {...dropdownSelectProps}
                    displayOption={displayOption}
                    // @ts-ignore
                    getOptionValue={getOptionValue}
                    onOptionSelected={onSelectScale}
                    customListComponent={ColorScaleSelectDropdown}
                    searchable={false}
                    showOptionsWhenEmpty
                    selectedItems={
                      pendingOption ? [pendingOption] : dropdownSelectProps.selectedItems
                    }
                  />
                )}
              </DropdownWrapper>
            )}
          >
            <div className="dropdown-select">
              {/* @ts-ignore*/}
              <DropdownSelect
                {...dropdownSelectProps}
                displayOption={displayOption}
                value={pendingOption || dropdownSelectProps.selectedItems[0]}
              />
            </div>
          </LazyTippy>
        </StyledColorScaleSelector>
      </DropdownPropContext.Provider>
    );
  };
  return ColorScaleSelector;
}
export default ColorScaleSelectorFactory;
