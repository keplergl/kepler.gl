// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen, render} from '@testing-library/react';
import {getDefaultFilter} from '@kepler.gl/utils';
import {DEFAULT_COLOR_UI} from '@kepler.gl/constants';
import {ColorRange, TimeRangeFilter} from '@kepler.gl/types';
import {IntlWrapper} from 'test/helpers/component-jest-utils';
import TimeWidgetSettingsFactory from './time-widget-settings';

const FieldSelector = () => null;
const ColorSelector: Parameters<typeof TimeWidgetSettingsFactory>[1] = props => (
  <>
    <button onClick={() => props.setColorUI?.({showDropdown: 0})}>Open palette</button>
    <button onClick={() => props.setColorUI?.({colorRangeConfig: {reversed: true}})}>
      Reverse palette
    </button>
    <button onClick={() => props.setColorUI?.({colorRangeConfig: {steps: 4}})}>Four colors</button>
  </>
);
const Settings = TimeWidgetSettingsFactory(FieldSelector, ColorSelector);
const palette: ColorRange = {
  name: 'Test palette',
  type: 'sequential',
  category: 'Custom',
  colors: ['#000000', '#888888', '#ffffff']
};
const baseFilter = {
  ...getDefaultFilter({dataId: 'data', id: 'time'}),
  id: 'time',
  type: 'timeRange',
  dataId: ['data'],
  name: ['timestamp'],
  domain: [0, 2048 * 1000],
  step: 1000,
  syncedWithLayerTimeline: false,
  syncTimelineMode: 0,
  invertTrendColor: false,
  plotType: {interval: '2-second'}
} as TimeRangeFilter;

function renderSettings(filter = baseFilter) {
  const setFilterPlot = jest.fn();
  const props = {
    filter,
    datasets: {},
    setFilterPlot,
    onTimezoneChange: jest.fn(),
    onTimeFormatChange: jest.fn()
  };
  const rendered = render(<Settings {...props} />, {wrapper: IntlWrapper});
  return {...rendered, props, setFilterPlot};
}

describe('TimeWidgetSettings interval commits', () => {
  test('edits locally until blur and accepts the exact 2048-bin boundary', () => {
    const {setFilterPlot} = renderSettings();
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '1'}});
    expect(setFilterPlot).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(setFilterPlot).toHaveBeenCalledWith({
      plotType: {interval: '1-second', defaultTimeFormat: expect.any(String)}
    });
    expect(screen.queryByText('Interval is too small')).not.toBeInTheDocument();
  });

  test('rejects intervals exceeding the bin limit and recovers with a valid edit', () => {
    const {setFilterPlot} = renderSettings({...baseFilter, domain: [0, 2049 * 1000]});
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '1'}});
    fireEvent.blur(input);
    expect(screen.getByText('Interval is too small')).toBeInTheDocument();
    expect(setFilterPlot).not.toHaveBeenCalled();
    fireEvent.change(input, {target: {value: '2'}});
    input.focus();
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(input).not.toHaveFocus();
    expect(setFilterPlot).toHaveBeenCalledTimes(1);
    expect(setFilterPlot.mock.calls[0][0].plotType.interval).toBe('2-second');
    expect(screen.queryByText('Interval is too small')).not.toBeInTheDocument();
  });

  test.each(['', '0', '-2'])('restores the saved interval for invalid input %p', value => {
    const {setFilterPlot} = renderSettings();
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value}});
    fireEvent.blur(input);
    expect(input).toHaveValue(2);
    expect(setFilterPlot).not.toHaveBeenCalled();
  });

  test('synchronizes local edits when the saved interval changes', () => {
    const {rerender, props, setFilterPlot} = renderSettings();
    fireEvent.change(screen.getByRole('spinbutton'), {target: {value: '9'}});
    rerender(<Settings {...props} filter={{...baseFilter, plotType: {interval: '3-minute'}}} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(3);
    fireEvent.blur(screen.getByRole('spinbutton'));
    expect(setFilterPlot.mock.calls[0][0].plotType.interval).toBe('3-minute');
  });
});

describe('TimeWidgetSettings group palettes', () => {
  function groupedFilter(colorRange = palette): TimeRangeFilter {
    return {
      ...baseFilter,
      yAxis: {name: 'value'} as TimeRangeFilter['yAxis'],
      plotType: {
        ...baseFilter.plotType,
        groupBy: {fieldName: 'category', colorRange, colorUI: DEFAULT_COLOR_UI}
      }
    };
  }

  test('dropdown UI changes preserve palette configuration without replacing colors', () => {
    const {setFilterPlot} = renderSettings(groupedFilter());
    fireEvent.click(screen.getByText('Open palette'));
    const update = setFilterPlot.mock.calls[0][0].plotType.groupBy;
    expect(update).toEqual({colorUI: {...DEFAULT_COLOR_UI, showDropdown: 0}});
    expect(update).not.toHaveProperty('colorRange');
  });

  test('reverses a custom palette without mutating saved filter colors', () => {
    const filter = groupedFilter();
    const original = [...palette.colors];
    const {setFilterPlot} = renderSettings(filter);
    fireEvent.click(screen.getByText('Reverse palette'));
    const update = setFilterPlot.mock.calls[0][0].plotType.groupBy;
    expect(update.colorRange.colors).toEqual([...original].reverse());
    expect(update.colorUI.colorRangeConfig).toEqual({
      ...DEFAULT_COLOR_UI.colorRangeConfig,
      reversed: true
    });
    expect(filter.plotType?.groupBy?.colorRange?.colors).toEqual(original);
  });

  test('selects a four-step preset for an unknown palette without changing the source', () => {
    const range = {...palette, category: 'Unregistered'};
    const {setFilterPlot} = renderSettings(groupedFilter(range));
    fireEvent.click(screen.getByText('Four colors'));
    const update = setFilterPlot.mock.calls[0][0].plotType.groupBy;
    expect(update.colorRange.colors).toHaveLength(4);
    expect(update.colorRange.colors.every(color => /^#[0-9a-f]{6}$/i.test(color))).toBe(true);
    expect(update.colorRange.name).not.toBe(range.name);
    expect(update.colorUI.colorRangeConfig.steps).toBe(4);
    expect(range.colors).toHaveLength(3);
  });
});
