// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import ItemSelector from '../common/item-selector/item-selector';
import FieldSelectorFactory from '../common/field-selector';
import Switch from '../common/switch';
import TippyTooltip from '../common/tippy-tooltip';
import {ArrowDown} from '../common/icons';
import {IconRoundSmall, Input, PanelLabel, PanelLabelBold} from '../common/styled-components';
import {
  TIME_AGGREGATION,
  AGGREGATION_TYPES,
  ALL_FIELD_TYPES,
  DEFAULT_COLOR_UI,
  DEFAULT_TIME_FORMAT,
  SCALE_TYPE_NAMES,
  durationMillisecond,
  durationSecond,
  durationMinute,
  durationHour,
  durationDay,
  durationWeek,
  durationMonth,
  durationYear
} from '@kepler.gl/constants';
import {
  TimeRangeFilter,
  RangeFilter,
  Field,
  ColorRange,
  ColorUI,
  NestedPartial
} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';
import {
  getDefaultTimeFormat,
  getNumericPlotInterval,
  isLayerHistogramSupported,
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

const TIME_FORMAT_OPTIONS = ['12-hour', '24-hour'] as const;
const GROUP_SOURCE_OPTIONS = [
  {id: 'independent', label: 'Independent'},
  {id: 'layer', label: 'From layer'}
];
const SELECTOR_WIDTH = '160px';

type HourCycle = (typeof TIME_FORMAT_OPTIONS)[number];

const FORMAT_TOKENS =
  /(\[[^[]*\])|(\\.)|(LTS|LT|[Hh]mm(ss)?|[Hh]{1,2}|k{1,2}|mm?|ss?|S{1,9}|[Aa]|.)/g;

function tokenizeTimeFormat(format: string): string[] {
  const tokens = format.match(FORMAT_TOKENS) || [];
  return tokens.flatMap(token => {
    if (token !== 'LT' && token !== 'LTS') {
      return token;
    }
    const localizedFormat = moment.localeData().longDateFormat(token);
    return localizedFormat?.match(FORMAT_TOKENS) || token;
  });
}

function getHourTokenCycle(token: string): HourCycle | null {
  if (/^(H{1,2}|k{1,2}|Hmm(ss)?)$/.test(token)) {
    return '24-hour';
  }
  if (/^(h{1,2}|hmm(ss)?)$/.test(token)) {
    return '12-hour';
  }
  return null;
}

function getHourCycle(format: string): HourCycle | null {
  for (const token of tokenizeTimeFormat(format)) {
    const hourCycle = getHourTokenCycle(token);
    if (hourCycle) {
      return hourCycle;
    }
  }
  return null;
}

function getLocaleHourCycle(): HourCycle {
  return getHourCycle(moment.localeData().longDateFormat('LT')) || '24-hour';
}

function updateHourCycle(format: string, hourCycle: HourCycle): string {
  const tokens = tokenizeTimeFormat(format);
  const hourIndexes: number[] = [];
  const meridiemIndexes: number[] = [];

  tokens.forEach((token, index) => {
    if (getHourTokenCycle(token)) {
      hourIndexes.push(index);
      if (/^[Hh]mm(ss)?$/.test(token)) {
        tokens[index] = `${hourCycle === '24-hour' ? 'H' : 'h'}${token.slice(1)}`;
      } else {
        tokens[index] = hourCycle === '24-hour' ? 'HH' : token.length === 2 ? 'hh' : 'h';
      }
    } else if (/^[Aa]$/.test(token)) {
      meridiemIndexes.push(index);
    }
  });

  if (!hourIndexes.length) {
    return `${format} ${hourCycle === '24-hour' ? 'HH:mm' : 'hh:mm A'}`;
  }

  if (hourCycle === '24-hour') {
    meridiemIndexes.forEach(index => {
      tokens[index] = '';
      const adjacentIndex = index < hourIndexes[0] ? index + 1 : index - 1;
      if (/^\s$/.test(tokens[adjacentIndex] || '')) {
        tokens[adjacentIndex] = '';
      }
    });
    return tokens.join('');
  }

  if (!meridiemIndexes.length) {
    const localeTokens = tokenizeTimeFormat(moment.localeData().longDateFormat('LT'));
    const localeHourIndex = localeTokens.findIndex(token => Boolean(getHourTokenCycle(token)));
    const localeMeridiemIndex = localeTokens.findIndex(token => /^[Aa]$/.test(token));
    const meridiemToken = localeMeridiemIndex >= 0 ? localeTokens[localeMeridiemIndex] : 'A';

    if (localeMeridiemIndex >= 0 && localeMeridiemIndex < localeHourIndex) {
      tokens.splice(hourIndexes[0], 0, meridiemToken, ' ');
    } else {
      const lastTimeTokenIndex = tokens.reduce(
        (lastIndex, token, index) =>
          index >= hourIndexes[0] && /^(m{1,2}|s{1,2}|S{1,9})$/.test(token) ? index : lastIndex,
        hourIndexes[hourIndexes.length - 1]
      );
      tokens.splice(lastTimeTokenIndex + 1, 0, ' ', meridiemToken);
    }
  }

  return tokens.join('');
}

const SettingsPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  margin-bottom: 8px;
  background: ${props => props.theme.panelContentBackground};
  border-top: 1px solid ${props => props.theme.panelBorderColor};
  border-bottom: 1px solid ${props => props.theme.panelBorderColor};
  gap: 12px;

  .timezone-field-selector {
    max-width: 100%;
  }

  .timezone-field-selector .item-selector__dropdown {
    ${props => props.theme.secondaryInput};
  }
`;

const HideSettingsButton = styled(IconRoundSmall)`
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: ${props => props.theme.panelContentBackground};
  color: ${props => props.theme.textColor};

  &:hover {
    background: ${props => props.theme.panelBackgroundHover};
    color: ${props => props.theme.panelHeaderIconHover};
  }

  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: -2px;
  }
`;

const AxisSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AxisHeader = styled(PanelLabelBold).attrs({as: 'div'})`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.textColor};
  margin-bottom: 0;
  white-space: nowrap;
`;

const AxisRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-width: min(${SELECTOR_WIDTH}, 100%);
  max-width: 100%;
`;

const FieldLabel = styled(PanelLabel).attrs({as: 'span'})`
  white-space: nowrap;
`;

const FieldValue = styled.span`
  color: ${props => props.theme.textColor};
  font-size: ${props => props.theme.inputFontSize};
  font-weight: ${props => props.theme.inputFontWeight};
  width: ${SELECTOR_WIDTH};
  max-width: 100%;
  height: ${props => props.theme.inputBoxHeight};
  line-height: ${props => props.theme.inputBoxHeight};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SelectorWrapper = styled.div`
  width: ${SELECTOR_WIDTH};
  max-width: 100%;
`;

const FieldSelectorWrapper = styled.div`
  width: ${SELECTOR_WIDTH};
  max-width: 100%;
`;

type StepInputProps = {
  $hasError?: boolean;
  $fullWidth?: boolean;
};

const StepInput = styled(Input)<StepInputProps>`
  width: ${props => (props.$fullWidth ? SELECTOR_WIDTH : '48px')};
  min-width: 0;
  max-width: 100%;
  padding: ${props =>
    props.$fullWidth ? props.theme.inputPadding : props.theme.inputPaddingSmall};
  border-color: ${props =>
    props.$hasError ? props.theme.errorColor : props.theme.secondaryInputBorderColor};
  -moz-appearance: textfield;

  &:focus {
    border-color: ${props =>
      props.$hasError ? props.theme.errorColor : props.theme.secondaryInputBorderActiveColor};
  }
`;

type UnitSelectorWrapperProps = {
  $hasError?: boolean;
};

const UnitSelectorWrapper = styled.div<UnitSelectorWrapperProps>`
  width: 108px;
  min-width: 0;
  max-width: 100%;

  .item-selector__dropdown {
    border-color: ${props =>
      props.$hasError ? props.theme.errorColor : props.theme.secondaryInputBorderColor};
  }
`;

const IntervalGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.errorColor};
  font-size: ${props => props.theme.inputFontSize};
  white-space: nowrap;
`;

const SwitchBlock = styled.div`
  display: flex;
  align-items: center;
  height: ${props => props.theme.inputBoxHeight};
`;

type DisabledOverlayProps = {
  $disabled?: boolean;
};

const DisabledBlock = styled.div<DisabledOverlayProps>`
  min-width: 0;
  max-width: 100%;
  opacity: ${props => (props.$disabled ? 0.4 : 1)};
  pointer-events: ${props => (props.$disabled ? 'none' : 'auto')};
`;

const ColorSelectorWrap = styled.div`
  position: relative;
  width: 180px;
  max-width: 100%;

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
  onClose?: () => void;
  filter: TimeRangeFilter | RangeFilter;
  datasets: Datasets;
  layers?: readonly Layer[];
  setFilterPlot: (newProp: any, valueIndex?: number) => void;
  onTimezoneChange: (timezone: string) => void;
  onTimeFormatChange: (timeFormat: string) => void;
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
    onClose,
    filter,
    datasets,
    layers = [],
    setFilterPlot,
    onTimezoneChange,
    onTimeFormatChange
  }) => {
    const isTimeFilter = filter.type === 'timeRange';
    const {plotType} = filter;
    const currentInterval = isTimeFilter ? plotType?.interval : undefined;
    const currentAggregation = plotType?.aggregation || AGGREGATION_TYPES.average;

    const {step: parsedStep, unit: parsedUnit} = useMemo(
      () => parseInterval(currentInterval),
      [currentInterval]
    );
    const intervalStep = useMemo(
      () => (isTimeFilter ? parsedStep : getNumericPlotInterval(filter)),
      [filter, isTimeFilter, parsedStep]
    );

    const [stepValue, setStepValue] = useState<string>(String(intervalStep));
    const [unitValue, setUnitValue] = useState<string>(parsedUnit);

    useEffect(() => {
      setStepValue(String(intervalStep));
    }, [intervalStep]);

    useEffect(() => {
      setUnitValue(parsedUnit);
    }, [parsedUnit]);

    const effectiveStep = useMemo(() => {
      const num = isTimeFilter ? parseInt(stepValue, 10) : Number(stepValue);
      return num > 0 ? num : intervalStep;
    }, [intervalStep, isTimeFilter, stepValue]);

    const isIntervalTooSmall = useCallback(
      (step: number, unit: string) => {
        const timeSpan = filter.domain ? filter.domain[1] - filter.domain[0] : 0;
        if (!isTimeFilter) {
          return timeSpan / step > MAX_BINS;
        }
        const unitDuration = INTERVAL_UNITS.find(u => u.id === unit)?.duration || durationDay;
        const count = timeSpan / (step * unitDuration);
        return count > MAX_BINS;
      },
      [filter.domain, isTimeFilter]
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
    const groupSource = groupBy?.source === 'layer' ? 'layer' : 'independent';
    const useLayerGrouping = !filter.yAxis && groupSource === 'layer';
    const sourceLayers = useMemo(
      () => layers.filter(layer => isLayerHistogramSupported(layer, filter.dataId[0])),
      [layers, filter.dataId]
    );
    const sourceLayer = sourceLayers.find(layer => layer.id === groupBy?.layerId);
    const sourceLayerOptions = useMemo(
      () => sourceLayers.map(layer => ({id: layer.id, label: layer.config.label || layer.id})),
      [sourceLayers]
    );
    const displaySourceLayer = useCallback(
      option => {
        if (typeof option !== 'string') return option?.label || '';
        const supported = sourceLayerOptions.find(layer => layer.id === option);
        if (supported) return supported.label;
        const label = layers.find(layer => layer.id === option)?.config.label || option;
        return `${label} (unavailable)`;
      },
      [layers, sourceLayerOptions]
    );

    const applyInterval = useCallback(
      (step: number, unit: string) => {
        if (isIntervalTooSmall(step, unit)) {
          return;
        }
        if (isTimeFilter) {
          const intervalId = `${step}-${unit}`;
          const defaultTimeFormat = getDefaultTimeFormat(intervalId);
          setFilterPlot({plotType: {interval: intervalId, defaultTimeFormat}});
        } else {
          setFilterPlot({plotType: {numericInterval: step}});
        }
      },
      [setFilterPlot, isIntervalTooSmall, isTimeFilter]
    );

    const onStepChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setStepValue(val);
    }, []);

    const onStepBlur = useCallback(() => {
      const num = isTimeFilter ? parseInt(stepValue, 10) : Number(stepValue);
      if (num > 0) {
        applyInterval(num, unitValue);
      } else {
        setStepValue(String(intervalStep));
      }
    }, [stepValue, unitValue, intervalStep, applyInterval, isTimeFilter]);

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

    const _setGroupSource = useCallback(
      source => {
        if (source === 'independent' || source === 'layer') {
          setFilterPlot({plotType: {groupBy: {source}}});
        }
      },
      [setFilterPlot]
    );

    const _setSourceLayer = useCallback(
      layerId => {
        if (sourceLayers.some(layer => layer.id === layerId)) {
          setFilterPlot({plotType: {groupBy: {source: 'layer', layerId}}});
        }
      },
      [setFilterPlot, sourceLayers]
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

    const timeFilter = isTimeFilter ? filter : null;
    const effectiveTimeFormat =
      (typeof timeFilter?.timeFormat === 'string'
        ? timeFilter.timeFormat
        : timeFilter?.defaultTimeFormat) || DEFAULT_TIME_FORMAT;
    const selectedTimeFormat = getHourCycle(effectiveTimeFormat) || getLocaleHourCycle();
    const xAxisName = (Array.isArray(filter.name) ? filter.name[0] : filter.name) || '';
    const xAxisLabel = `${xAxisName}${filter.endName?.[0] ? ` → ${filter.endName[0]}` : ''}`;

    const handleTimeFormatChange = useCallback(
      (value: unknown) => {
        if (value === '12-hour' || value === '24-hour') {
          onTimeFormatChange(updateHourCycle(effectiveTimeFormat, value));
        }
      },
      [effectiveTimeFormat, onTimeFormatChange]
    );

    return (
      <SettingsPanel className="time-widget--settings">
        {onClose ? (
          <TippyTooltip
            placement="top"
            delay={[500, 0]}
            render={() => <span role="tooltip">Hide settings</span>}
          >
            <HideSettingsButton
              as="button"
              type="button"
              className="time-widget__hide-settings"
              aria-label="Hide settings"
              onClick={onClose}
            >
              <ArrowDown height="18px" />
            </HideSettingsButton>
          </TippyTooltip>
        ) : null}
        <AxisSection>
          <AxisHeader>X Axis</AxisHeader>
          <AxisRow>
            <FieldBlock>
              <FieldLabel>Field</FieldLabel>
              <TippyTooltip
                placement="top"
                delay={[500, 0]}
                render={() => <span role="tooltip">{xAxisLabel}</span>}
              >
                <FieldValue>{xAxisLabel}</FieldValue>
              </TippyTooltip>
            </FieldBlock>
            <FieldBlock>
              <FieldLabel>{isTimeFilter ? 'Interval' : 'Bin size'}</FieldLabel>
              <IntervalGroup>
                <StepInput
                  secondary
                  type="number"
                  data-testid={isTimeFilter ? undefined : 'numeric-bin-size'}
                  min={isTimeFilter ? 1 : filter.step}
                  step={isTimeFilter ? 1 : 'any'}
                  value={stepValue}
                  onChange={onStepChange}
                  onBlur={onStepBlur}
                  onKeyDown={onStepKeyDown}
                  $hasError={intervalTooSmall}
                  $fullWidth={!isTimeFilter}
                />
                {isTimeFilter ? (
                  <UnitSelectorWrapper $hasError={intervalTooSmall}>
                    <ItemSelector
                      inputTheme="secondary"
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
                ) : null}
              </IntervalGroup>
            </FieldBlock>
            {isTimeFilter ? (
              <>
                <FieldBlock>
                  <FieldLabel>
                    <FormattedMessage id="filterManager.timezone" />
                  </FieldLabel>
                  <TimezoneSelector timezone={filter.timezone} onChange={onTimezoneChange} />
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel id="time-widget-time-format-label">
                    <FormattedMessage id="filterManager.timeFormat" />
                  </FieldLabel>
                  <SelectorWrapper
                    data-testid="time-widget-time-format"
                    aria-labelledby="time-widget-time-format-label"
                  >
                    <ItemSelector
                      inputTheme="secondary"
                      selectedItems={selectedTimeFormat}
                      options={TIME_FORMAT_OPTIONS}
                      multiSelect={false}
                      searchable={false}
                      placement="top"
                      onChange={handleTimeFormatChange}
                    />
                  </SelectorWrapper>
                </FieldBlock>
              </>
            ) : null}
          </AxisRow>
          {intervalTooSmall ? (
            <ErrorMessage>{isTimeFilter ? 'Interval' : 'Bin size'} is too small</ErrorMessage>
          ) : null}
        </AxisSection>
        <AxisSection>
          <AxisHeader>Y Axis</AxisHeader>
          <AxisRow>
            <FieldBlock>
              <FieldLabel>Select Field</FieldLabel>
              <FieldSelectorWrapper>
                <FieldSelector
                  inputTheme="secondary"
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
                <SelectorWrapper data-testid="time-widget-aggregation">
                  <ItemSelector
                    inputTheme="secondary"
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
        <AxisSection className="time-widget__group-by">
          <AxisHeader>
            <FormattedMessage id="filterManager.groupBy" />
          </AxisHeader>
          <AxisRow>
            {!filter.yAxis ? (
              <FieldBlock>
                <FieldLabel>Mode</FieldLabel>
                <SelectorWrapper>
                  <ItemSelector
                    inputTheme="secondary"
                    selectedItems={groupSource}
                    options={GROUP_SOURCE_OPTIONS}
                    multiSelect={false}
                    searchable={false}
                    placement="top"
                    onChange={_setGroupSource}
                    getOptionValue={option => option.id}
                    displayOption={option =>
                      typeof option === 'string'
                        ? GROUP_SOURCE_OPTIONS.find(source => source.id === option)?.label || ''
                        : option.label
                    }
                  />
                </SelectorWrapper>
              </FieldBlock>
            ) : null}
            {useLayerGrouping ? (
              <>
                <FieldBlock>
                  <FieldLabel>Source layer</FieldLabel>
                  <SelectorWrapper data-testid="time-widget-source-layer">
                    <ItemSelector
                      inputTheme="secondary"
                      selectedItems={groupBy?.layerId || null}
                      options={sourceLayerOptions}
                      multiSelect={false}
                      searchable={false}
                      placement="top"
                      onChange={_setSourceLayer}
                      getOptionValue={option => option.id}
                      displayOption={displaySourceLayer}
                      disabled={!sourceLayerOptions.length}
                    />
                  </SelectorWrapper>
                </FieldBlock>
                {sourceLayer ? (
                  <>
                    <FieldBlock>
                      <FieldLabel>Field</FieldLabel>
                      <TippyTooltip
                        placement="top"
                        delay={[500, 0]}
                        render={() => (
                          <span role="tooltip">{sourceLayer.config.colorField?.name}</span>
                        )}
                      >
                        <FieldValue>{sourceLayer.config.colorField?.name}</FieldValue>
                      </TippyTooltip>
                    </FieldBlock>
                    <FieldBlock>
                      <FieldLabel>Scale</FieldLabel>
                      <FieldValue>
                        {SCALE_TYPE_NAMES[sourceLayer.config.colorScale || ''] ||
                          sourceLayer.config.colorScale}
                      </FieldValue>
                    </FieldBlock>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <FieldBlock>
                  <FieldLabel>
                    <FormattedMessage id="filterManager.groupByField" />
                  </FieldLabel>
                  <FieldSelectorWrapper>
                    <FieldSelector
                      inputTheme="secondary"
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
                        inputTheme="secondary"
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
              </>
            )}
          </AxisRow>
          {useLayerGrouping && !sourceLayer && (groupBy?.layerId || !sourceLayers.length) ? (
            <PanelLabel as="div" role="status">
              {groupBy?.layerId
                ? 'The selected layer is unavailable or no longer supports grouped bins. Choose another layer.'
                : 'No compatible layers are available for this dataset.'}
            </PanelLabel>
          ) : null}
        </AxisSection>
      </SettingsPanel>
    );
  };

  return TimeWidgetSettings;
}

export default TimeWidgetSettingsFactory;
