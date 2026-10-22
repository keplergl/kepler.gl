// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React, {useState} from 'react';
import {fireEvent} from '@testing-library/react';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import ZarrAxisSelector from './zarr-axis-selector';

const variable = {
  nonSpatialDims: [
    {name: 'band', size: 2, values: ['tavg', 'prec'], kind: 'category'},
    {name: 'year', size: 2, values: [2023, 2024]},
    {name: 'month', size: 2, values: [1, 2]},
    {name: 'day', size: 2, values: [28, 29]}
  ]
};

describe('ZarrAxisSelector', () => {
  it('selects categorical/numeric axes, combined dates and automatic/off modes, resetting the frame', () => {
    const onChange = jest.fn();
    function Editor() {
      const [config, setConfig] = useState({});
      return (
        <ZarrAxisSelector
          variable={variable}
          config={config}
          onChange={value => {
            onChange(value);
            setConfig(value.zarrAxis);
          }}
        />
      );
    }
    const {getByLabelText, queryByRole} = renderWithTheme(<Editor />);
    const select = value => fireEvent.change(getByLabelText('Timeline axis'), {target: {value}});
    for (const dimension of ['band', 'month']) {
      select(`dimension:${dimension}`);
      expect(onChange).toHaveBeenLastCalledWith({
        zarrAxis: {kind: 'dimension', dimension},
        zarrFrame: 0
      });
    }
    select('calendar');
    expect(onChange).toHaveBeenLastCalledWith({
      zarrAxis: {
        kind: 'calendar',
        year: 'year',
        month: 'month',
        day: 'day',
        calendar: 'proleptic_gregorian'
      },
      zarrFrame: 0
    });
    expect(queryByRole('status')).toBeNull();
    fireEvent.change(getByLabelText('month dimension'), {target: {value: 'year'}});
    expect(queryByRole('status')).not.toBeNull();
    for (const kind of ['off', 'auto']) {
      select(kind);
      expect(onChange).toHaveBeenLastCalledWith({zarrAxis: {kind}, zarrFrame: 0});
    }
  });

  it('offers forecast valid time and restores it regardless of saved property order', () => {
    const forecast = {
      nonSpatialDims: [
        {
          name: 'init_time',
          size: 1,
          values: [0],
          kind: 'time',
          standardName: 'forecast_reference_time'
        },
        {
          name: 'lead_time',
          size: 2,
          values: [0, 3600],
          kind: 'duration',
          standardName: 'forecast_period',
          units: 'seconds'
        }
      ]
    };
    const config = {leadTime: 'lead_time', kind: 'forecast', referenceTime: 'init_time'};
    const onChange = jest.fn();
    const {getByLabelText} = renderWithTheme(
      <ZarrAxisSelector variable={forecast} config={config} onChange={onChange} />
    );
    expect(getByLabelText('Timeline axis')).toHaveValue('forecast:0');
    fireEvent.change(getByLabelText('Timeline axis'), {target: {value: 'forecast:0'}});
    expect(onChange).toHaveBeenLastCalledWith({zarrAxis: config, zarrFrame: 0});
  });
});
