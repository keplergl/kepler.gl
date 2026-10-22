// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import React, {useState} from 'react';
import {fireEvent, screen, within} from '@testing-library/react';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import ZarrAxisSelector from './zarr-axis-selector';

const variable = {
  nonSpatialDims: [
    {name: 'band', size: 2, values: ['tavg', 'prec'], kind: 'category'},
    {name: 'year', size: 2, values: [2023, 2024]},
    {name: 'month', size: 2, values: [1, 2]},
    {name: 'day', size: 2, values: [28, 29]}
  ]
};

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {
      return undefined;
    }
    unobserve() {
      return undefined;
    }
    disconnect() {
      return undefined;
    }
  };
});

const renderSelector = component => renderWithTheme(<IntlWrapper>{component}</IntlWrapper>);

function openSelector(name) {
  const trigger = within(screen.getByRole('group', {name})).getByRole('button');
  fireEvent.keyDown(trigger, {key: 'Enter', keyCode: 13});
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  return trigger;
}

function selectOption(name, label) {
  const trigger = openSelector(name);
  fireEvent.click(within(document.querySelector('.list-selector')).getByText(label));
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
}

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
    const {queryByRole} = renderSelector(<Editor />);
    const select = label => selectOption('Timeline axis', label);
    for (const dimension of ['band', 'month']) {
      select(dimension);
      expect(onChange).toHaveBeenLastCalledWith({
        zarrAxis: {kind: 'dimension', dimension},
        zarrFrame: 0
      });
    }
    select('Combined calendar date');
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
    selectOption('month dimension', 'year');
    expect(queryByRole('status')).not.toBeNull();
    selectOption('month dimension', 'month');
    expect(queryByRole('status')).toBeNull();
    selectOption('year dimension', 'band');
    expect(onChange).toHaveBeenLastCalledWith({
      zarrAxis: expect.objectContaining({kind: 'calendar', year: 'band'}),
      zarrFrame: 0
    });
    selectOption('year dimension', 'year');
    selectOption('day dimension', 'Monthly (no day dimension)');
    expect(onChange).toHaveBeenLastCalledWith({
      zarrAxis: expect.objectContaining({kind: 'calendar', day: undefined}),
      zarrFrame: 0
    });
    selectOption('Calendar', '360_day');
    expect(onChange).toHaveBeenLastCalledWith({
      zarrAxis: expect.objectContaining({kind: 'calendar', calendar: '360_day'}),
      zarrFrame: 0
    });
    for (const kind of ['off', 'auto']) {
      select(kind === 'off' ? 'Off' : 'Automatic time');
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
    renderSelector(<ZarrAxisSelector variable={forecast} config={config} onChange={onChange} />);
    expect(
      within(screen.getByRole('group', {name: 'Timeline axis'})).getByRole('button')
    ).toHaveTextContent('Valid time: init_time + lead_time');
    selectOption('Timeline axis', 'Valid time: init_time + lead_time');
    expect(onChange).toHaveBeenLastCalledWith({zarrAxis: config, zarrFrame: 0});
  });

  it('searches long dimension lists using the shared dropdown', () => {
    const onChange = jest.fn();
    const manyDimensions = {
      nonSpatialDims: Array.from({length: 20}, (_, i) => ({name: `dim_${i}`, size: 2}))
    };
    const calendar = {kind: 'calendar', year: 'dim_0', month: 'dim_1'};
    for (const [name, config, expected] of [
      ['Timeline axis', {}, {kind: 'dimension', dimension: 'dim_19'}],
      ['year dimension', calendar, {...calendar, year: 'dim_19'}]
    ]) {
      const {unmount} = renderSelector(
        <ZarrAxisSelector variable={manyDimensions} config={config} onChange={onChange} />
      );
      openSelector(name);
      fireEvent.change(screen.getByPlaceholderText('Search'), {target: {value: 'dim_19'}});
      const list = within(document.querySelector('.list-selector'));
      expect(list.queryByText('dim_0')).toBeNull();
      fireEvent.click(list.getByText('dim_19'));
      expect(onChange).toHaveBeenLastCalledWith({zarrAxis: expected, zarrFrame: 0});
      unmount();
    }
  });
});
