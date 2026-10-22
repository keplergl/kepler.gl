// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import type {ZarrAxisConfig, ZarrVariableInfo} from '@kepler.gl/constants';
import {getZarrAxis, getZarrForecastAxes} from '@kepler.gl/table';
import ItemSelector from '../../common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';

export default function ZarrAxisSelector({
  variable,
  config = {},
  pins = {},
  onChange
}: {
  variable: ZarrVariableInfo | null;
  config?: ZarrAxisConfig;
  pins?: Record<string, number>;
  onChange: (config: {zarrAxis: ZarrAxisConfig; zarrFrame: number}) => void;
}) {
  const forecasts = useMemo(() => (variable ? getZarrForecastAxes(variable) : []), [variable]);
  const axis = useMemo(() => getZarrAxis(variable, config, pins), [variable, config, pins]);
  const dims = variable?.nonSpatialDims ?? [];
  const value =
    config.kind === 'dimension'
      ? `dimension:${config.dimension}`
      : config.kind === 'forecast'
      ? `forecast:${forecasts.findIndex(
          f =>
            f.kind === 'forecast' &&
            f.referenceTime === config.referenceTime &&
            f.leadTime === config.leadTime
        )}`
      : config.kind ?? 'auto';
  const update = (zarrAxis: ZarrAxisConfig) => onChange({zarrAxis, zarrFrame: 0});
  const axisOptions = [
    {value: 'auto', label: 'Automatic time'},
    {value: 'off', label: 'Off'},
    ...dims.map(d => ({value: `dimension:${d.name}`, label: d.name})),
    ...forecasts.flatMap((f, index) =>
      f.kind === 'forecast'
        ? [{value: `forecast:${index}`, label: `Valid time: ${f.referenceTime} + ${f.leadTime}`}]
        : []
    ),
    {value: 'calendar', label: 'Combined calendar date'}
  ];
  const calendars = ['proleptic_gregorian', 'standard', 'noleap', 'all_leap', '360_day'];
  return (
    <div>
      <SidePanelSection role="group" aria-label="Timeline axis">
        <PanelLabel>Timeline axis</PanelLabel>
        <ItemSelector
          options={axisOptions}
          selectedItems={axisOptions.find(option => option.value === value) ?? null}
          getOptionValue="value"
          displayOption="label"
          filterOption="label"
          multiSelect={false}
          searchable={axisOptions.length > 10}
          showArrow
          onChange={next => {
            if (typeof next !== 'string') return;
            if (next.startsWith('dimension:'))
              update({kind: 'dimension', dimension: next.slice(10)});
            else if (next.startsWith('forecast:')) update(forecasts[Number(next.slice(9))]);
            else if (next === 'calendar')
              update({
                kind: 'calendar',
                year: dims.find(d => /^years?$/i.test(d.name))?.name ?? '',
                month: dims.find(d => /^months?$/i.test(d.name))?.name ?? '',
                day: dims.find(d => /^days?$/i.test(d.name))?.name,
                calendar: 'proleptic_gregorian'
              });
            else update({kind: next as 'auto' | 'off'});
          }}
        />
      </SidePanelSection>
      {config.kind === 'calendar' ? (
        <>
          {(['year', 'month', 'day'] as const).map(part => {
            const options = [
              {
                value: '',
                label: part === 'day' ? 'Monthly (no day dimension)' : 'Select dimension'
              },
              ...dims.map(d => ({value: d.name, label: d.name}))
            ];
            return (
              <SidePanelSection key={part} role="group" aria-label={`${part} dimension`}>
                <PanelLabel>{part}</PanelLabel>
                <ItemSelector
                  options={options}
                  selectedItems={
                    options.find(option => option.value === (config[part] ?? '')) ?? null
                  }
                  getOptionValue="value"
                  displayOption="label"
                  filterOption="label"
                  multiSelect={false}
                  searchable={dims.length > 10}
                  showArrow
                  onChange={next => {
                    if (typeof next === 'string') update({...config, [part]: next || undefined});
                  }}
                />
              </SidePanelSection>
            );
          })}
          <SidePanelSection role="group" aria-label="Calendar">
            <PanelLabel>Calendar</PanelLabel>
            <ItemSelector
              options={calendars}
              selectedItems={config.calendar ?? 'proleptic_gregorian'}
              multiSelect={false}
              searchable={false}
              showArrow
              onChange={next => {
                if (typeof next === 'string') update({...config, calendar: next});
              }}
            />
          </SidePanelSection>
        </>
      ) : null}
      {axis.error ? <div role="status">{axis.error}</div> : null}
    </div>
  );
}
