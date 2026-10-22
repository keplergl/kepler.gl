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
  it('selects categorical/numeric axes and automatic/off modes, resetting the frame', () => {
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
    renderSelector(<Editor />);
    const select = label => selectOption('Timeline axis', label);
    for (const dimension of ['band', 'year', 'month', 'day']) {
      select(dimension);
      expect(onChange).toHaveBeenLastCalledWith({
        zarrAxis: {kind: 'dimension', dimension},
        zarrFrame: 0
      });
    }
    for (const kind of ['off', 'auto']) {
      select(kind === 'off' ? 'Off' : 'Automatic time');
      expect(onChange).toHaveBeenLastCalledWith({zarrAxis: {kind}, zarrFrame: 0});
    }
  });

  it('omits calendar composition controls and allows choosing an individual dimension', () => {
    const onChange = jest.fn();
    renderSelector(<ZarrAxisSelector variable={variable} onChange={onChange} />);
    for (const name of ['year dimension', 'month dimension', 'day dimension', 'Calendar']) {
      expect(screen.queryByRole('group', {name})).toBeNull();
    }
    expect(onChange).not.toHaveBeenCalled();
    const trigger = openSelector('Timeline axis');
    const list = within(document.querySelector('.list-selector'));
    expect(list.queryByText('Combined calendar date')).toBeNull();
    fireEvent.click(list.getByText('month'));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).toHaveBeenCalledWith({
      zarrAxis: {kind: 'dimension', dimension: 'month'},
      zarrFrame: 0
    });
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
    renderSelector(<ZarrAxisSelector variable={manyDimensions} onChange={onChange} />);
    openSelector('Timeline axis');
    fireEvent.change(screen.getByPlaceholderText('Search'), {target: {value: 'dim_19'}});
    const list = within(document.querySelector('.list-selector'));
    expect(list.queryByText('dim_0')).toBeNull();
    fireEvent.click(list.getByText('dim_19'));
    expect(onChange).toHaveBeenLastCalledWith({
      zarrAxis: {kind: 'dimension', dimension: 'dim_19'},
      zarrFrame: 0
    });
  });
});
