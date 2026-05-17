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
  durationMillisecond,
  durationSecond,
  durationMinute,
  durationHour,
  durationDay,
  durationWeek,
  durationMonth,
  durationYear
} from '@kepler.gl/constants';
import {TimeRangeFilter, Field} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {getDefaultTimeFormat} from '@kepler.gl/utils';

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

export type TimeWidgetSettingsProps = {
  filter: TimeRangeFilter;
  datasets: Datasets;
  setFilterPlot: (newProp: any, valueIndex?: number) => void;
};

function parseInterval(intervalId: string | undefined): {step: number; unit: string} {
  if (!intervalId) return {step: 1, unit: 'day'};
  const parts = intervalId.split('-');
  if (parts.length === 2) {
    return {step: parseInt(parts[0], 10) || 1, unit: parts[1]};
  }
  return {step: 1, unit: 'day'};
}

TimeWidgetSettingsFactory.deps = [FieldSelectorFactory];

function TimeWidgetSettingsFactory(FieldSelector: ReturnType<typeof FieldSelectorFactory>) {
  const TimeWidgetSettings: React.FC<TimeWidgetSettingsProps> = ({
    filter,
    datasets,
    setFilterPlot
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

    const onStepChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setStepValue(val);
      },
      []
    );

    const onStepBlur = useCallback(() => {
      const num = parseInt(stepValue, 10);
      if (num > 0) {
        applyInterval(num, unitValue);
      } else {
        setStepValue(String(parsedStep));
      }
    }, [stepValue, unitValue, parsedStep, applyInterval]);

    const onStepKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      },
      []
    );

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
          <AxisHeader><ArrowRight height="10px" />X Axis</AxisHeader>
          <AxisRow>
            <FieldBlock>
              <FieldLabel>Select Field</FieldLabel>
              <FieldValue>{filter.name}</FieldValue>
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
          </AxisRow>
          {intervalTooSmall ? (
            <ErrorMessage>Interval is too small</ErrorMessage>
          ) : null}
        </AxisSection>
        <AxisSection>
          <AxisHeader><ArrowRight height="10px" />Y Axis</AxisHeader>
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
      </SettingsPanel>
    );
  };

  return TimeWidgetSettings;
}

export default TimeWidgetSettingsFactory;
