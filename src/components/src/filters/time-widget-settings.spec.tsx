// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen, render, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {getDefaultFilter, mergePlotGroupBy} from '@kepler.gl/utils';
import {DEFAULT_COLOR_UI} from '@kepler.gl/constants';
import {ColorRange, Field, TimeRangeFilter} from '@kepler.gl/types';
import {Layer, KeplerGlLayers} from '@kepler.gl/layers';
import {IntlWrapper} from 'test/helpers/component-jest-utils';
import TimeWidgetSettingsFactory from './time-widget-settings';

const categoryField = {name: 'category', type: 'string'};
const FieldSelector: Parameters<typeof TimeWidgetSettingsFactory>[0] = props =>
  props.id === 'time-widget-group-by-field' ? (
    <>
      <button onClick={() => props.onSelect(categoryField)}>Select category</button>
      <button disabled={!props.value} onClick={() => props.onSelect(null)}>
        Clear category
      </button>
    </>
  ) : null;
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

function renderSettings(filter = baseFilter, onClose?: () => void, layers: Layer[] = []) {
  const setFilterPlot = jest.fn();
  const props = {
    onClose,
    filter,
    datasets: {},
    layers,
    setFilterPlot,
    onTimezoneChange: jest.fn(),
    onTimeFormatChange: jest.fn()
  };
  const rendered = render(<Settings {...props} />, {wrapper: IntlWrapper});
  return {...rendered, props, setFilterPlot};
}

const originalIntersectionObserver = window.IntersectionObserver;
beforeAll(() => {
  window.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn()
  }));
});
afterAll(() => {
  window.IntersectionObserver = originalIntersectionObserver;
});

describe('TimeWidgetSettings histogram grouping sources', () => {
  function categoryLayer(id = 'categories', dataId = 'data') {
    const layer = new KeplerGlLayers.PointLayer({id, dataId, label: `Map ${id}`});
    layer.config.colorField = {...categoryField, name: 'mapCategory'} as Field;
    layer.config.colorScale = 'ordinal';
    layer.config.colorDomain = ['A', 'B'];
    layer.config.visConfig.colorRange = palette;
    return layer;
  }

  function linkedFilter(layerId?: string): TimeRangeFilter {
    return {
      ...baseFilter,
      plotType: {
        ...baseFilter.plotType,
        groupBy: {
          source: 'layer',
          layerId,
          fieldName: 'category',
          numGroups: 4,
          groupOthers: true,
          colorRange: palette
        }
      }
    };
  }

  test('defaults to independent grouping and switches to a compatible layer', async () => {
    const user = userEvent.setup();
    const layer = categoryLayer();
    const wrongDataset = categoryLayer('unrelated', 'other-data');
    const continuous = categoryLayer('continuous');
    continuous.config.colorScale = 'linear';
    const {props, rerender, setFilterPlot} = renderSettings(baseFilter, undefined, [
      layer,
      wrongDataset,
      continuous
    ]);
    expect(screen.getByRole('button', {name: 'Select category'})).toBeInTheDocument();
    await user.click(screen.getByText('Independent'));
    await user.click(screen.getByText('From layer'));
    expect(setFilterPlot).toHaveBeenLastCalledWith({plotType: {groupBy: {source: 'layer'}}});

    rerender(<Settings {...props} filter={linkedFilter()} />);
    expect(screen.queryByRole('button', {name: 'Select category'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Open palette'})).not.toBeInTheDocument();
    fireEvent.keyDown(within(screen.getByTestId('time-widget-source-layer')).getByRole('button'), {
      key: 'Enter',
      keyCode: 13
    });
    expect(screen.queryByText('Map unrelated')).not.toBeInTheDocument();
    expect(screen.queryByText('Map continuous')).not.toBeInTheDocument();
    await user.click(screen.getByText('Map categories'));
    expect(setFilterPlot).toHaveBeenLastCalledWith({
      plotType: {groupBy: {source: 'layer', layerId: 'categories'}}
    });

    rerender(<Settings {...props} filter={linkedFilter('categories')} />);
    expect(screen.getByTitle('mapCategory')).toHaveTextContent('mapCategory');
    expect(screen.getByText('Ordinal')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('returns to independent grouping while retaining its field and palette', async () => {
    const user = userEvent.setup();
    const filter = linkedFilter('categories');
    const {props, rerender, setFilterPlot} = renderSettings(filter, undefined, [categoryLayer()]);
    await user.click(screen.getByText('From layer'));
    await user.click(screen.getByText('Independent'));
    expect(setFilterPlot).toHaveBeenLastCalledWith({
      plotType: {groupBy: {source: 'independent'}}
    });
    const groupBy = mergePlotGroupBy(
      filter.plotType?.groupBy,
      setFilterPlot.mock.calls[0][0].plotType.groupBy
    );
    rerender(<Settings {...props} filter={{...filter, plotType: {...filter.plotType, groupBy}}} />);
    expect(screen.getByRole('button', {name: 'Clear category'})).toBeEnabled();
    expect(screen.getByRole('button', {name: 'Open palette'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '4'})).toBeInTheDocument();
    expect(groupBy?.colorRange).toBe(palette);
    expect(groupBy?.layerId).toBe('categories');
  });

  test.each(['removed', 'unsupported'])('keeps an explicit %s source unavailable', kind => {
    const layer = categoryLayer();
    if (kind === 'unsupported') layer.config.colorScale = 'linear';
    const {setFilterPlot} = renderSettings(
      linkedFilter('categories'),
      undefined,
      kind === 'removed' ? [] : [layer]
    );
    expect(screen.getByText(/\(unavailable\)/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('unavailable');
    expect(screen.queryByRole('button', {name: 'Select category'})).not.toBeInTheDocument();
    expect(setFilterPlot).not.toHaveBeenCalled();
  });

  test('explains when the dataset has no compatible source layers', () => {
    renderSettings(linkedFilter());
    expect(screen.getByRole('status')).toHaveTextContent('No compatible layers');
    expect(
      within(screen.getByTestId('time-widget-source-layer')).getByRole('button')
    ).toHaveAttribute('aria-disabled', 'true');
  });

  test('keeps line-chart grouping independent without clearing the saved layer preference', () => {
    const filter = {
      ...linkedFilter('categories'),
      yAxis: {name: 'value'} as TimeRangeFilter['yAxis']
    };
    const {setFilterPlot} = renderSettings(filter, undefined, [categoryLayer()]);
    expect(screen.queryByTestId('time-widget-source-layer')).not.toBeInTheDocument();
    expect(screen.queryByText('From layer')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Select category'})).toBeInTheDocument();
    expect(setFilterPlot).not.toHaveBeenCalled();
  });
});

describe('TimeWidgetSettings field names', () => {
  test.each([undefined, 'measurements.device_session.completed_timestamp'])(
    'preserves the full X-axis field label with end field %p',
    endName => {
      const name = 'measurements.device_session.started_timestamp';
      const label = endName ? `${name} → ${endName}` : name;
      renderSettings({
        ...baseFilter,
        name: [name],
        ...(endName ? {endName: [endName]} : {})
      });

      expect(screen.getByTitle(label)).toHaveTextContent(label);
    }
  );
});

describe('TimeWidgetSettings dismissal', () => {
  test.each(['{Enter}', ' '])('activates the hide control by keyboard with %p', async key => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const {setFilterPlot} = renderSettings(baseFilter, onClose);
    await user.tab();
    expect(screen.getByRole('button', {name: 'Hide settings'})).toHaveFocus();
    await user.keyboard(key);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(setFilterPlot).not.toHaveBeenCalled();
  });

  test('commits a pending interval edit before hiding the panel', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const {setFilterPlot} = renderSettings(baseFilter, onClose);
    const input = screen.getByRole('spinbutton');
    await user.click(input);
    await user.clear(input);
    await user.type(input, '3');
    expect(setFilterPlot).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', {name: 'Hide settings'}));
    expect(setFilterPlot).toHaveBeenCalledWith({
      plotType: {interval: '3-second', defaultTimeFormat: expect.any(String)}
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(setFilterPlot.mock.invocationCallOrder[0]).toBeLessThan(
      onClose.mock.invocationCallOrder[0]
    );
  });
});

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

  test('selects and clears histogram categories without a Y-axis field', () => {
    const {setFilterPlot, props, rerender} = renderSettings();
    expect(props.filter.yAxis).toBeNull();
    expect(screen.getByRole('button', {name: 'Clear category'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button', {name: 'Select category'}));
    expect(setFilterPlot).toHaveBeenLastCalledWith({
      plotType: {groupBy: {fieldName: 'category'}}
    });

    rerender(<Settings {...props} filter={{...groupedFilter(), yAxis: null}} />);
    fireEvent.click(screen.getByRole('button', {name: 'Clear category'}));
    expect(setFilterPlot).toHaveBeenLastCalledWith({plotType: {groupBy: null}});
  });

  test('updates a histogram palette without selecting a Y-axis field', () => {
    const {setFilterPlot} = renderSettings({...groupedFilter(), yAxis: null});
    fireEvent.click(screen.getByRole('button', {name: 'Reverse palette'}));
    expect(setFilterPlot).toHaveBeenCalledWith({
      plotType: {
        groupBy: expect.objectContaining({
          colorRange: expect.objectContaining({colors: [...palette.colors].reverse()})
        })
      }
    });
  });

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
