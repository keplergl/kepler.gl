// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import ItemSelector from '../common/item-selector/item-selector';
import FieldSelectorFactory from '../common/field-selector';
import Switch from '../common/switch';
import {ArrowRight} from '../common/icons';
import {
  TIME_AGGREGATION,
  AGGREGATION_TYPES,
  ALL_FIELD_TYPES,
  DEFAULT_COLOR_UI,
  durationMillisecond,
  durationSecond,
  durationMinute,
  durationHour,
  durationDay,
  durationWeek,
  durationMonth,
  durationYear
} from '@kepler.gl/constants';
import {TimeRangeFilter, Field, ColorRange, ColorUI, NestedPartial} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {
  getDefaultTimeFormat,
  PLOT_NUM_GROUPS_ALL,
  PLOT_NUM_GROUPS_OPTIONS,
  DEFAULT_PLOT_NUM_GROUPS,
  MAX_PLOT_NUM_GROUPS,
  updateColorRangeByMatchingPalette,
  updateCustomColorRangeByColorUI
} from '@kepler.gl/utils';
import {FormattedMessage} from '@kepler.gl/localization';

import TimezoneSelector from './timezone-selector';
import ColorSelectorFactory, {ColorSet} from '../side-panel/layer-panel/color-selector';

const MAX_BINS = 2048;

const INTERVAL_UNITS = [
  {id: 'millisecond', label: 'Millisecond', duration: durationMillisecond},
  {id: 'second', label: 'Second', duration: durationSecond},
  {id: 'minute', label: 'Minute', duration: durationMinute},
  {id: 'hour', label: 'Hour', duration: durationHour},
  {id: 'day', label: 'Day', duration: durationDay},
  {id: 'week', label: 'Week', duration: durationWeek},
  {id: 'month', label: 'Month', duration: durationMonth},
  {id: 'year', label: 'Year', duration: durationYear}
];

const SettingsPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0 8px 0;
  gap: 12px;
`;

const AxisSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AxisHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
`;

const AxisRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 25px;
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const FieldLabel = styled.span`
  color: ${props => props.theme.labelColor};
  font-size: 10px;
  font-weight: 400;
  white-space: nowrap;
`;

const FieldValue = styled.span`
  color: ${props => props.theme.textColor};
  font-size: 11px;
  font-weight: 500;
  width: 160px;
  height: 28px;
  display: flex;
  align-items: center;
`;

const SelectorWrapper = styled.div`
  width: 120px;

  .item-selector__dropdown {
    background: ${props => props.theme.secondaryInputBgd};
    border-color: ${props => props.theme.secondaryInputBorderColor};
    height: 28px;
    padding: 2px 8px;
    font-size: 11px;
  }
`;

const FieldSelectorWrapper = styled.div`
  width: 160px;

  .item-selector__dropdown {
    background: ${props => props.theme.secondaryInputBgd};
    border-color: ${props => props.theme.secondaryInputBorderColor};
    height: 28px;
    padding: 2px 8px;
    font-size: 11px;
  }
`;

type StepInputProps = {
  $hasError?: boolean;
};

const StepInput = styled.input<StepInputProps>`
  width: 48px;
  height: 28px;
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 4px;
  border: 1px solid
    ${props => (props.$hasError ? props.theme.errorColor : props.theme.secondaryInputBorderColor)};
  background: ${props => props.theme.secondaryInputBgd};
  color: ${props => props.theme.textColor};
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  &:focus {
    border-color: ${props =>
      props.$hasError ? props.theme.errorColor : props.theme.primaryBtnBgd};
  }
`;

type UnitSelectorWrapperProps = {
  $hasError?: boolean;
};

const UnitSelectorWrapper = styled.div<UnitSelectorWrapperProps>`
  width: 110px;

  .item-selector__dropdown {
    background: ${props => props.theme.secondaryInputBgd};
    border-color: ${props =>
      props.$hasError ? props.theme.errorColor : props.theme.secondaryInputBorderColor};
    height: 28px;
    padding: 2px 8px;
    font-size: 11px;
  }
`;

const IntervalGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.errorColor};
  font-size: 10px;
  white-space: nowrap;
`;

const SwitchBlock = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
`;

type DisabledOverlayProps = {
  $disabled?: boolean;
};

const DisabledBlock = styled.div<DisabledOverlayProps>`
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
  pointer-events: ${props => (props.$disabled ? 'none' : 'auto')};
`;

const ColorSelectorWrap = styled.div`
  position: relative;
  width: 180px;

  .color-selector__dropdown {
    position: absolute;
    right: 0;
    bottom: calc(100% + 4px);
    z-index: 10;
    width: 292px;
    max-height: 360px;
  }
`;

const GROUP_BY_FIELD_TYPES = new Set<string>([
  ALL_FIELD_TYPES.string,
  ALL_FIELD_TYPES.boolean,
  ALL_FIELD_TYPES.integer,
  ALL_FIELD_TYPES.real,
  ALL_FIELD_TYPES.date
]);

const COLOR_RANGE_UI_KEYS = ['reversed', 'steps', 'colorBlindSafe', 'type'] as const;

function shouldUpdateGroupColorRange(next: NestedPartial<ColorUI>, current: ColorUI): boolean {
  const config = next.colorRangeConfig;
  if (!config) {
    return false;
  }
  return COLOR_RANGE_UI_KEYS.some(
    key =>
      Object.prototype.hasOwnProperty.call(config, key) &&
      config[key] !== current.colorRangeConfig?.[key]
  );
}

function colorRangeFromColorUI(
  currentRange: ColorRange,
  colorRangeConfig: ColorUI['colorRangeConfig'],
  next: NestedPartial<ColorUI>
): ColorRange {
  const isCustomReversed =
    currentRange.category === 'Custom' &&
    Boolean(next.colorRangeConfig) &&
    Object.prototype.hasOwnProperty.call(next.colorRangeConfig, 'reversed');
  if (isCustomReversed) {
    // The helper reverses colors in place. Copy them so filter state stays unchanged.
    return updateCustomColorRangeByColorUI(
      {...currentRange, colors: [...(currentRange.colors || [])]},
      colorRangeConfig
    );
  }
  const updated = updateColorRangeByMatchingPalette(currentRange, colorRangeConfig);
  if (updated !== currentRange) {
    return updated;
  }
  const baseColors = currentRange.colors?.length ? currentRange.colors : [];
  if (!baseColors.length) {
    return currentRange;
  }
  const steps = Math.max(2, colorRangeConfig.steps || baseColors.length);
  const colors = Array.from({length: steps}, (_, i) => baseColors[i % baseColors.length]);
  if (colorRangeConfig.reversed) {
    colors.reverse();
  }
  return {
    ...currentRange,
    colors,
    reversed: Boolean(colorRangeConfig.reversed)
  };
}

export type TimeWidgetSettingsProps = {
  filter: TimeRangeFilter;
  datasets: Datasets;
  setFilterPlot: (newProp: any, valueIndex?: number) => void;
  onTimezoneChange: (timezone: string) => void;
};

function parseInterval(intervalId: string | undefined): {step: number; unit: string} {
  if (!intervalId) return {step: 1, unit: 'day'};
  const parts = intervalId.split('-');
  if (parts.length === 2) {
    return {step: parseInt(parts[0], 10) || 1, unit: parts[1]};
  }
  return {step: 1, unit: 'day'};
}

TimeWidgetSettingsFactory.deps = [FieldSelectorFactory, ColorSelectorFactory];

function TimeWidgetSettingsFactory(
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  ColorSelector: ReturnType<typeof ColorSelectorFactory>
) {
  const TimeWidgetSettings: React.FC<TimeWidgetSettingsProps> = ({
    filter,
    datasets,
    setFilterPlot,
    onTimezoneChange
  }) => {
    const {plotType} = filter;
    const currentInterval = plotType?.interval;
    const currentAggregation = plotType?.aggregation || AGGREGATION_TYPES.average;

    const {step: parsedStep, unit: parsedUnit} = useMemo(
      () => parseInterval(currentInterval),
      [currentInterval]
    );

    const [stepValue, setStepValue] = useState<string>(String(parsedStep));
    const [unitValue, setUnitValue] = useState<string>(parsedUnit);

    useEffect(() => {
      setStepValue(String(parsedStep));
    }, [parsedStep]);

    useEffect(() => {
      setUnitValue(parsedUnit);
    }, [parsedUnit]);

    const effectiveStep = useMemo(() => {
      const num = parseInt(stepValue, 10);
      return num > 0 ? num : parsedStep;
    }, [stepValue, parsedStep]);

    const isIntervalTooSmall = useCallback(
      (step: number, unit: string) => {
        const timeSpan = filter.domain ? filter.domain[1] - filter.domain[0] : 0;
        const unitDuration = INTERVAL_UNITS.find(u => u.id === unit)?.duration || durationDay;
        const count = timeSpan / (step * unitDuration);
        return count > MAX_BINS;
      },
      [filter.domain]
    );

    const intervalTooSmall = useMemo(() => {
      return isIntervalTooSmall(effectiveStep, unitValue);
    }, [isIntervalTooSmall, effectiveStep, unitValue]);

    const aggregationOptions = useMemo(() => TIME_AGGREGATION, []);

    const yAxisFields = useMemo(
      () =>
        ((datasets[filter.dataId[0]] || {}).fields || []).filter(
          (f: Field) => f.type === 'integer' || f.type === 'real'
        ),
      [datasets, filter.dataId]
    );

    const groupByFields = useMemo(
      () =>
        ((datasets[filter.dataId[0]] || {}).fields || []).filter((f: Field) =>
          GROUP_BY_FIELD_TYPES.has(f.type)
        ),
      [datasets, filter.dataId]
    );

    const groupBy = filter.plotType?.groupBy;

    const applyInterval = useCallback(
      (step: number, unit: string) => {
        if (isIntervalTooSmall(step, unit)) {
          return;
        }
        const intervalId = `${step}-${unit}`;
        const defaultTimeFormat = getDefaultTimeFormat(intervalId);
        setFilterPlot({plotType: {interval: intervalId, defaultTimeFormat}});
      },
      [setFilterPlot, isIntervalTooSmall]
    );

    const onStepChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setStepValue(val);
    }, []);

    const onStepBlur = useCallback(() => {
      const num = parseInt(stepValue, 10);
      if (num > 0) {
        applyInterval(num, unitValue);
      } else {
        setStepValue(String(parsedStep));
      }
    }, [stepValue, unitValue, parsedStep, applyInterval]);

    const onStepKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        (e.target as HTMLInputElement).blur();
      }
    }, []);

    const onUnitChange = useCallback(
      (value: any) => {
        if (value) {
          const unitId = typeof value === 'string' ? value : value.id;
          setUnitValue(unitId);
          applyInterval(effectiveStep, unitId);
        }
      },
      [effectiveStep, applyInterval]
    );

    const onAggregationChange = useCallback(
      (value: any) => {
        if (value) {
          setFilterPlot({plotType: {aggregation: value}});
        }
      },
      [setFilterPlot]
    );

    const _setFilterPlotYAxis = useCallback(
      value => setFilterPlot({yAxis: value}),
      [setFilterPlot]
    );

    const _toggleYAxisAutoRange = useCallback(
      () => setFilterPlot({plotType: {yAxisAutoRange: !filter.plotType?.yAxisAutoRange}}),
      [setFilterPlot, filter.plotType?.yAxisAutoRange]
    );

    const _setGroupByField = useCallback(
      field =>
        setFilterPlot({
          plotType: {groupBy: field ? {fieldName: field.name} : null}
        }),
      [setFilterPlot]
    );

    const _setNumGroups = useCallback(
      value => {
        if (value === null || value === undefined) {
          return;
        }
        setFilterPlot({plotType: {groupBy: {numGroups: value}}});
      },
      [setFilterPlot]
    );

    const _toggleGroupOthers = useCallback(
      () => setFilterPlot({plotType: {groupBy: {groupOthers: !groupBy?.groupOthers}}}),
      [setFilterPlot, groupBy?.groupOthers]
    );

    const _setGroupColor = useCallback(
      colorRange => setFilterPlot({plotType: {groupBy: {colorRange}}}),
      [setFilterPlot]
    );

    const _setGroupColorUI = useCallback(
      (next: NestedPartial<ColorUI>) => {
        const current = (groupBy?.colorUI || DEFAULT_COLOR_UI) as ColorUI;
        const merged = {
          ...current,
          ...next,
          colorRangeConfig: {
            ...current.colorRangeConfig,
            ...(next.colorRangeConfig || {})
          }
        } as ColorUI;
        const currentRange = groupBy?.colorRange;
        const colorRange =
          currentRange && shouldUpdateGroupColorRange(next, current)
            ? colorRangeFromColorUI(currentRange, merged.colorRangeConfig, next)
            : undefined;
        setFilterPlot({
          plotType: {
            groupBy: colorRange ? {colorUI: merged, colorRange} : {colorUI: merged}
          }
        });
      },
      [setFilterPlot, groupBy?.colorUI, groupBy?.colorRange]
    );

    const displayNumGroups = useCallback((opt: number) => String(opt), []);

    const displayUnitOption = useCallback((opt: any) => {
      if (typeof opt === 'string') {
        return INTERVAL_UNITS.find(u => u.id === opt)?.label || opt;
      }
      return opt?.label || '';
    }, []);

    const displayAggregationOption = useCallback(
      (opt: any) => {
        if (typeof opt === 'string') {
          return aggregationOptions.find(o => o.id === opt)?.label || opt;
        }
        return opt?.label || '';
      },
      [aggregationOptions]
    );

    return (
      <SettingsPanel className="time-widget--settings">
        <AxisSection>
          <AxisHeader>
            <ArrowRight height="10px" />X Axis
          </AxisHeader>
          <AxisRow>
            <FieldBlock>
              <FieldLabel>Select Field</FieldLabel>
              <FieldValue>
                {Array.isArray(filter.name) ? filter.name[0] : filter.name}
                {filter.endName?.[0] ? ` → ${filter.endName[0]}` : ''}
              </FieldValue>
            </FieldBlock>
            <FieldBlock>
              <FieldLabel>Interval</FieldLabel>
              <IntervalGroup>
                <StepInput
                  type="number"
                  min={1}
                  value={stepValue}
                  onChange={onStepChange}
                  onBlur={onStepBlur}
                  onKeyDown={onStepKeyDown}
                  $hasError={intervalTooSmall}
                />
                <UnitSelectorWrapper $hasError={intervalTooSmall}>
                  <ItemSelector
                    selectedItems={unitValue}
                    options={INTERVAL_UNITS}
                    multiSelect={false}
                    onChange={onUnitChange}
                    getOptionValue={o => o.id}
                    displayOption={displayUnitOption}
                    placement="top"
                    searchable={false}
                  />
                </UnitSelectorWrapper>
              </IntervalGroup>
            </FieldBlock>
            <FieldBlock>
              <FieldLabel>
                <FormattedMessage id="filterManager.timezone" />
              </FieldLabel>
              <TimezoneSelector timezone={filter.timezone} onChange={onTimezoneChange} />
            </FieldBlock>
          </AxisRow>
          {intervalTooSmall ? <ErrorMessage>Interval is too small</ErrorMessage> : null}
        </AxisSection>
        <AxisSection>
          <AxisHeader>
            <ArrowRight height="10px" />Y Axis
          </AxisHeader>
          <AxisRow>
            <FieldBlock>
              <FieldLabel>Select Field</FieldLabel>
              <FieldSelectorWrapper>
                <FieldSelector
                  fields={yAxisFields}
                  placement="top"
                  id="selected-time-widget-field"
                  value={filter.yAxis ? filter.yAxis.name : null}
                  onSelect={_setFilterPlotYAxis}
                  placeholder="placeholder.yAxis"
                  erasable
                  showToken={false}
                />
              </FieldSelectorWrapper>
            </FieldBlock>
            <DisabledBlock $disabled={!filter.yAxis}>
              <FieldBlock>
                <FieldLabel>Aggregation</FieldLabel>
                <SelectorWrapper>
                  <ItemSelector
                    selectedItems={currentAggregation}
                    options={aggregationOptions}
                    multiSelect={false}
                    onChange={onAggregationChange}
                    getOptionValue={o => o.id}
                    displayOption={displayAggregationOption}
                    placement="top"
                    searchable={false}
                  />
                </SelectorWrapper>
              </FieldBlock>
            </DisabledBlock>
            <DisabledBlock $disabled={!filter.yAxis}>
              <FieldBlock>
                <FieldLabel>Fit Y</FieldLabel>
                <SwitchBlock>
                  <Switch
                    checked={Boolean(filter.plotType?.yAxisAutoRange)}
                    id={`${filter.id}-y-axis-auto-range`}
                    onChange={_toggleYAxisAutoRange}
                    secondary
                  />
                </SwitchBlock>
              </FieldBlock>
            </DisabledBlock>
          </AxisRow>
        </AxisSection>
        {filter.yAxis ? (
          <AxisSection className="time-widget__group-by">
            <AxisHeader>
              <ArrowRight height="10px" />
              <FormattedMessage id="filterManager.groupBy" />
            </AxisHeader>
            <AxisRow>
              <FieldBlock>
                <FieldLabel>
                  <FormattedMessage id="filterManager.groupByField" />
                </FieldLabel>
                <FieldSelectorWrapper>
                  <FieldSelector
                    fields={groupByFields}
                    placement="top"
                    id="time-widget-group-by-field"
                    value={groupBy?.fieldName || null}
                    onSelect={_setGroupByField}
                    erasable
                    showToken={false}
                  />
                </FieldSelectorWrapper>
              </FieldBlock>
              <DisabledBlock $disabled={!groupBy?.fieldName}>
                <FieldBlock>
                  <FieldLabel>
                    <FormattedMessage id="filterManager.maxGroups" />
                  </FieldLabel>
                  <SelectorWrapper>
                    <ItemSelector
                      selectedItems={
                        groupBy?.numGroups === PLOT_NUM_GROUPS_ALL
                          ? MAX_PLOT_NUM_GROUPS
                          : groupBy?.numGroups ?? DEFAULT_PLOT_NUM_GROUPS
                      }
                      options={PLOT_NUM_GROUPS_OPTIONS}
                      multiSelect={false}
                      searchable={false}
                      onChange={_setNumGroups}
                      displayOption={displayNumGroups}
                      getOptionValue={opt => opt}
                      placement="top"
                      disabled={!groupBy?.fieldName}
                    />
                  </SelectorWrapper>
                </FieldBlock>
              </DisabledBlock>
              <DisabledBlock $disabled={!groupBy?.fieldName}>
                <FieldBlock>
                  <FieldLabel>
                    <FormattedMessage id="filterManager.groupOthers" />
                  </FieldLabel>
                  <SwitchBlock>
                    <Switch
                      checked={Boolean(groupBy?.groupOthers)}
                      id={`${filter.id}-group-others`}
                      onChange={_toggleGroupOthers}
                      disabled={!groupBy?.fieldName}
                      secondary
                    />
                  </SwitchBlock>
                </FieldBlock>
              </DisabledBlock>
              {groupBy?.fieldName && groupBy.colorRange ? (
                <FieldBlock>
                  <FieldLabel>
                    <FormattedMessage id="filterManager.seriesColors" />
                  </FieldLabel>
                  <ColorSelectorWrap>
                    <ColorSelector
                      colorSets={[
                        {
                          selectedColor: groupBy.colorRange,
                          isRange: true,
                          setColor: colorRange => _setGroupColor(colorRange as ColorRange)
                        } as ColorSet
                      ]}
                      colorUI={groupBy.colorUI || DEFAULT_COLOR_UI}
                      setColorUI={_setGroupColorUI}
                    />
                  </ColorSelectorWrap>
                </FieldBlock>
              ) : null}
            </AxisRow>
          </AxisSection>
        ) : null}
      </SettingsPanel>
    );
  };

  return TimeWidgetSettings;
}

export default TimeWidgetSettingsFactory;
