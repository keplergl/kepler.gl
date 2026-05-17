// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import ItemSelector from '../common/item-selector/item-selector';
import Switch from '../common/switch';
import {INTERVAL_OPTIONS, TIME_AGGREGATION, AGGREGATION_TYPES} from '@kepler.gl/constants';
import {filterIntervalOptions} from '@kepler.gl/utils';
import {TimeRangeFilter} from '@kepler.gl/types';

const SettingsPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0 8px 0;
  gap: 16px;
`;

const SettingsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SettingsLabel = styled.span`
  color: ${props => props.theme.labelColor};
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
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

export type TimeWidgetSettingsProps = {
  filter: TimeRangeFilter;
  setFilterPlot: (newProp: any, valueIndex?: number) => void;
};

const TimeWidgetSettings: React.FC<TimeWidgetSettingsProps> = ({filter, setFilterPlot}) => {
  const {plotType} = filter;
  const currentInterval = plotType?.interval;
  const currentAggregation = plotType?.aggregation || AGGREGATION_TYPES.average;

  const intervalOptions = useMemo(
    () => filterIntervalOptions(INTERVAL_OPTIONS, filter.domain),
    [filter.domain]
  );

  const aggregationOptions = useMemo(() => TIME_AGGREGATION, []);

  const onIntervalChange = useCallback(
    (value: any) => {
      if (value) {
        setFilterPlot({plotType: {interval: value}});
      }
    },
    [setFilterPlot]
  );

  const onAggregationChange = useCallback(
    (value: any) => {
      if (value) {
        setFilterPlot({plotType: {aggregation: value}});
      }
    },
    [setFilterPlot]
  );

  const _toggleYAxisAutoRange = useCallback(
    () => setFilterPlot({plotType: {yAxisAutoRange: !filter.plotType?.yAxisAutoRange}}),
    [setFilterPlot, filter.plotType?.yAxisAutoRange]
  );

  const displayIntervalOption = useCallback(
    (opt: any) => {
      if (typeof opt === 'string') {
        return intervalOptions.find(o => o.id === opt)?.label || opt;
      }
      return opt?.label || '';
    },
    [intervalOptions]
  );

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
      <SettingsGroup>
        <SettingsLabel>X Axis:</SettingsLabel>
        <SelectorWrapper>
          <ItemSelector
            selectedItems={currentInterval}
            options={intervalOptions}
            multiSelect={false}
            onChange={onIntervalChange}
            getOptionValue={o => o.id}
            displayOption={displayIntervalOption}
            placement="top"
            searchable={false}
          />
        </SelectorWrapper>
      </SettingsGroup>
      {filter.yAxis ? (
        <SettingsGroup>
          <SettingsLabel>Y Axis:</SettingsLabel>
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
        </SettingsGroup>
      ) : null}
      {filter.yAxis ? (
        <SettingsGroup>
          <Switch
            checked={Boolean(filter.plotType?.yAxisAutoRange)}
            id={`${filter.id}-y-axis-auto-range`}
            onChange={_toggleYAxisAutoRange}
            secondary
            label="Fit Y"
          />
        </SettingsGroup>
      ) : null}
    </SettingsPanel>
  );
};

export default TimeWidgetSettings;
