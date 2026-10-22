// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';
import type {ZarrAxisConfig, ZarrVariableInfo} from '@kepler.gl/constants';
import {getZarrAxis, getZarrForecastAxes} from '@kepler.gl/table';

const Select = styled.select`
  width: 100%;
  margin: 4px 0 8px;
  padding: 6px;
  color: ${props => props.theme.textColor};
  background: ${props => props.theme.inputBgd};
  border: 1px solid ${props => props.theme.inputBorderColor};
`;

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
  return (
    <div>
      <label>
        Timeline axis
        <Select
          aria-label="Timeline axis"
          value={value}
          onChange={event => {
            const next = event.target.value;
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
        >
          <option value="auto">Automatic time</option>
          <option value="off">Off</option>
          {dims.map(d => (
            <option key={d.name} value={`dimension:${d.name}`}>
              {d.name}
            </option>
          ))}
          {forecasts.map(
            (f, index) =>
              f.kind === 'forecast' && (
                <option key={index} value={`forecast:${index}`}>
                  Valid time: {f.referenceTime} + {f.leadTime}
                </option>
              )
          )}
          <option value="calendar">Combined calendar date</option>
        </Select>
      </label>
      {config.kind === 'calendar' ? (
        <>
          {(['year', 'month', 'day'] as const).map(part => (
            <label key={part}>
              {part}
              <Select
                aria-label={`${part} dimension`}
                value={config[part] ?? ''}
                onChange={event => update({...config, [part]: event.target.value || undefined})}
              >
                <option value="">
                  {part === 'day' ? 'Monthly (no day dimension)' : 'Select dimension'}
                </option>
                {dims.map(d => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </label>
          ))}
          <label>
            Calendar
            <Select
              aria-label="Calendar"
              value={config.calendar ?? 'proleptic_gregorian'}
              onChange={event => update({...config, calendar: event.target.value})}
            >
              {['proleptic_gregorian', 'standard', 'noleap', 'all_leap', '360_day'].map(
                calendar => (
                  <option key={calendar} value={calendar}>
                    {calendar}
                  </option>
                )
              )}
            </Select>
          </label>
        </>
      ) : null}
      {axis.error ? <div role="status">{axis.error}</div> : null}
    </div>
  );
}
