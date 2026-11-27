// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {appInjector} from '@kepler.gl/components';
import {KeplerGlLayers} from '@kepler.gl/layers';
import SchemaManager from '@kepler.gl/schemas';
import {KeplerTable} from '@kepler.gl/table';
import {theme} from '@kepler.gl/styles';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import LayerConfiguratorFactory from './layer-configurator';

const LayerConfigurator = appInjector.get(LayerConfiguratorFactory);

beforeAll(() => {
  window.IntersectionObserver = class {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  };
});

test('opts into layer tooltip fields and can restore dataset defaults', async () => {
  const {enableLayerTooltipFields} = getApplicationConfig();
  expect(enableLayerTooltipFields).toBe(true);
  const fields = ['lat', 'lng', 'value'].map((name, fieldIdx) => ({
    name,
    displayName: name,
    type: 'real',
    format: '',
    fieldIdx
  }));
  const dataset = new KeplerTable({info: {id: 'points', label: 'Points'}, color: [0, 0, 0]});
  await dataset.importData({data: {fields, rows: [[40, -70, 1]]}});
  const layer = new KeplerGlLayers.PointLayer({dataId: dataset.id});
  layer.config.columns.lat = {value: 'lat', fieldIdx: 0};
  layer.config.columns.lng = {value: 'lng', fieldIdx: 1};
  const updateLayerConfig = jest.fn(config => layer.updateLayerConfig(config));
  const RenderLayer = () => {
    const [, setRevision] = React.useState(0);
    const onChange = (config: Parameters<typeof layer.updateLayerConfig>[0]) => {
      updateLayerConfig(config);
      setRevision(previous => previous + 1);
    };
    return (
      <IntlWrapper>
        <LayerConfigurator
          layer={layer}
          datasets={{[dataset.id]: dataset}}
          layerTypeOptions={[]}
          openModal={jest.fn()}
          updateLayerConfig={onChange}
          updateLayerType={jest.fn()}
          updateLayerVisConfig={jest.fn()}
          updateLayerVisualChannelConfig={jest.fn()}
          updateLayerColorUI={jest.fn()}
          updateLayerTextLabel={jest.fn()}
        />
      </IntlWrapper>
    );
  };

  const view = render(<RenderLayer />, {
    wrapper: ({children}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
  });
  const label = screen.getByText('Tooltip fields');
  fireEvent.click(label);
  const group = within(label.closest('.layer-config-group') as HTMLElement);
  const toggle = group.getByLabelText('Use layer-specific fields');
  expect(toggle).not.toBeChecked();
  fireEvent.click(toggle);
  expect(updateLayerConfig).toHaveBeenLastCalledWith({tooltipFields: []});

  fireEvent.click(group.getByText('Select a field'));
  fireEvent.click(screen.getByText('value'));
  expect(updateLayerConfig).toHaveBeenLastCalledWith({tooltipFields: ['value']});

  try {
    initApplicationConfig({enableLayerTooltipFields: false});
    view.rerender(<RenderLayer />);
    expect(screen.queryByText('Tooltip fields')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Use layer-specific fields')).not.toBeInTheDocument();
    expect(layer.config.tooltipFields).toEqual(['value']);

    initApplicationConfig({enableLayerTooltipFields: true});
    view.rerender(<RenderLayer />);
    fireEvent.click(screen.getByText('Tooltip fields'));
    expect(screen.getByLabelText('Use layer-specific fields')).toBeChecked();
  } finally {
    initApplicationConfig({enableLayerTooltipFields});
  }

  fireEvent.click(screen.getByLabelText('Use layer-specific fields'));
  expect(updateLayerConfig).toHaveBeenLastCalledWith({tooltipFields: undefined});
});

test('can change the data source without expanding the column settings', async () => {
  const fields = ['lat', 'lng'].map((name, fieldIdx) => ({
    name,
    displayName: name,
    type: 'real',
    format: '',
    fieldIdx
  }));
  const primary = new KeplerTable({
    info: {id: 'primary', label: 'Primary points'},
    color: [0, 0, 0]
  });
  const alternative = new KeplerTable({
    info: {id: 'alternative', label: 'Alternative points'},
    color: [0, 0, 0]
  });
  await Promise.all(
    [primary, alternative].map(dataset => dataset.importData({data: {fields, rows: [[40, -70]]}}))
  );
  const layer = new KeplerGlLayers.PointLayer({dataId: primary.id});
  layer.config.columns.lat = {value: 'lat', fieldIdx: 0};
  layer.config.columns.lng = {value: 'lng', fieldIdx: 1};
  const updateLayerConfig = jest.fn();
  renderWithTheme(
    <IntlWrapper>
      <LayerConfigurator
        layer={layer}
        datasets={{[primary.id]: primary, [alternative.id]: alternative}}
        layerTypeOptions={[]}
        openModal={jest.fn()}
        updateLayerConfig={updateLayerConfig}
        updateLayerType={jest.fn()}
        updateLayerVisConfig={jest.fn()}
        updateLayerVisualChannelConfig={jest.fn()}
        updateLayerColorUI={jest.fn()}
        updateLayerTextLabel={jest.fn()}
      />
    </IntlWrapper>
  );

  const source = screen.getByRole('button', {name: 'Primary points'});
  expect(source.closest('.layer-config-group')).toHaveClass('collapsed');
  // jsdom does not apply the styled collapse animation; verify the selector is outside it.
  expect(Boolean(source.closest('.layer-config-group__content__collapsible'))).toBe(false);
  fireEvent.keyDown(source, {key: 'Enter'});
  const alternativeOption = screen.queryByText('Alternative points');
  expect(Boolean(alternativeOption)).toBe(true);
  fireEvent.click(alternativeOption!);
  expect(updateLayerConfig).toHaveBeenCalledWith({dataId: alternative.id});
});

test.each([
  {name: 'Arc', LayerClass: KeplerGlLayers.ArcLayer},
  {name: 'Line', LayerClass: KeplerGlLayers.LineLayer}
])(
  'expands $name endpoint opacity controls, edits them independently and preserves saved values',
  async ({LayerClass}) => {
    const fields = ['lat0', 'lng0', 'lat1', 'lng1'].map((name, fieldIdx) => ({
      name,
      displayName: name,
      type: 'real',
      format: '',
      fieldIdx
    }));
    const dataset = new KeplerTable({
      info: {id: 'endpoints', label: 'Endpoints'},
      color: [0, 0, 0]
    });
    await dataset.importData({data: {fields, rows: [[40, -70, 41, -71]]}});
    const layer = new LayerClass({id: 'endpoints', dataId: dataset.id});
    fields.forEach(({name, fieldIdx}) => {
      layer.config.columns[name] = {value: name, fieldIdx};
    });
    const updateLayerVisConfig = jest.fn(config => layer.updateLayerVisConfig(config));

    function ControlledConfigurator() {
      const [, update] = React.useReducer(value => value + 1, 0);
      return (
        <IntlWrapper>
          <LayerConfigurator
            layer={layer}
            datasets={{[dataset.id]: dataset}}
            layerTypeOptions={[]}
            openModal={jest.fn()}
            updateLayerConfig={jest.fn()}
            updateLayerType={jest.fn()}
            updateLayerVisConfig={config => {
              updateLayerVisConfig(config);
              update();
            }}
            updateLayerVisualChannelConfig={jest.fn()}
            updateLayerColorUI={jest.fn()}
            updateLayerTextLabel={jest.fn()}
          />
        </IntlWrapper>
      );
    }
    renderWithTheme(<ControlledConfigurator />);

    const inputFor = (label: string) =>
      within(screen.getByText(label).closest('.side-panel-section') as HTMLElement).getByRole(
        'spinbutton'
      );
    const source = inputFor('Source Opacity');
    const target = inputFor('Target Opacity');
    const colorLabel = screen.getByText('Color');
    const colorGroup = colorLabel.closest('.layer-config-group');
    const collapsibleContent = source.closest('.layer-config-group__content__collapsible');
    expect(colorGroup).toHaveClass('collapsed');
    // jsdom does not apply the styled collapse animation; verify the controls are inside it.
    expect(collapsibleContent).not.toBeNull();
    expect(collapsibleContent?.closest('.layer-config-group')).toBe(colorGroup);
    expect(target.closest('.layer-config-group__content__collapsible')).toBe(collapsibleContent);
    const opacity = inputFor('Opacity');
    expect(opacity.closest('.layer-config-group__content__collapsible')).toBeNull();
    fireEvent.change(opacity, {target: {value: '0.00375'}});
    fireEvent.blur(opacity);
    expect(updateLayerVisConfig).toHaveBeenLastCalledWith({opacity: 0.00375});
    fireEvent.change(opacity, {target: {value: '1.005'}});
    fireEvent.blur(opacity);
    expect(updateLayerVisConfig).toHaveBeenLastCalledWith({opacity: 1});
    fireEvent.change(opacity, {target: {value: '2'}});
    fireEvent.blur(opacity);
    expect(opacity).toHaveValue(1);
    fireEvent.change(opacity, {target: {value: ''}});
    fireEvent.blur(opacity);
    expect(opacity).toHaveValue(1);
    const slider = opacity.closest('.kg-range-slider__slider')?.querySelector('.kg-slider');
    const handle = slider?.querySelectorAll('.kg-range-slider__handle')[1];
    expect(slider).not.toBeNull();
    expect(handle).toBeDefined();
    Object.defineProperty(slider, 'offsetWidth', {value: 1000});
    fireEvent.mouseDown(handle!, {clientX: 1000});
    fireEvent.mouseMove(document, {clientX: 234});
    fireEvent.mouseUp(document);
    expect(updateLayerVisConfig).toHaveBeenLastCalledWith({opacity: 0.23});
    updateLayerVisConfig.mockClear();

    fireEvent.click(colorLabel);
    expect(colorGroup).not.toHaveClass('collapsed');
    expect(source).toHaveValue(1);
    expect(target).toHaveValue(1);
    fireEvent.change(source, {target: {value: '0.20375'}});
    fireEvent.blur(source);
    fireEvent.change(target, {target: {value: '0'}});
    fireEvent.blur(target);
    expect(updateLayerVisConfig.mock.calls).toEqual([[{sourceOpacity: 0.2}], [{targetOpacity: 0}]]);

    fireEvent.click(colorLabel);
    expect(colorGroup).toHaveClass('collapsed');
    fireEvent.click(colorLabel);
    expect(colorGroup).not.toHaveClass('collapsed');
    expect(source).toHaveValue(0.2);
    expect(target).toHaveValue(0);

    const savedConfig = SchemaManager.getConfigToSave({
      visState: {layers: [layer], layerOrder: [layer.id]}
    });
    const [parsedLayer] = SchemaManager.parseSavedConfig(savedConfig)?.visState?.layers ?? [];
    const reopened = new LayerClass({id: 'endpoints', dataId: dataset.id});
    expect(reopened.copyLayerConfig(reopened.config, parsedLayer.config)).toMatchObject({
      visConfig: {sourceOpacity: 0.2, targetOpacity: 0}
    });
  }
);

test.each([
  ['polygon only', false, true, 0],
  ['line only', true, false, 0],
  ['mixed with polygon outlines off', true, true, 0],
  ['mixed with polygon elevation offset', true, true, 25]
])('groups editable dash lengths for GeoJSON lines: %s', async (_name, line, area, offset) => {
  const dataset = new KeplerTable({
    info: {id: 'geometry', label: 'Geometry'},
    color: [0, 0, 0]
  });
  await dataset.importData({
    data: {
      fields: [{name: 'geometry', type: 'geojson', analyzerType: 'GEOMETRY'}],
      rows: [
        ...(line
          ? [
              [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [0, 0],
                      [1, 1]
                    ]
                  }
                }
              ]
            ]
          : []),
        ...(area
          ? [
              [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [0, 0],
                        [0, 1],
                        [1, 1],
                        [0, 0]
                      ]
                    ]
                  }
                }
              ]
            ]
          : [])
      ]
    }
  });
  const layer = new KeplerGlLayers.GeojsonLayer({
    id: 'geometry',
    dataId: dataset.id,
    columns: {geojson: {value: 'geometry', fieldIdx: 0}}
  });
  layer.setInitialLayerConfig(dataset);
  layer.updateLayerVisConfig({stroked: Boolean(offset), elevationOffset: offset});
  const updateLayerVisConfig = jest.fn(config => layer.updateLayerVisConfig(config));
  const Configurator = () => {
    const [, refresh] = React.useReducer(count => count + 1, 0);
    return (
      <LayerConfigurator
        layer={layer}
        datasets={{[dataset.id]: dataset}}
        layerTypeOptions={[]}
        openModal={jest.fn()}
        updateLayerConfig={jest.fn()}
        updateLayerType={jest.fn()}
        updateLayerVisConfig={config => {
          updateLayerVisConfig(config);
          refresh();
        }}
        updateLayerVisualChannelConfig={jest.fn()}
        updateLayerColorUI={jest.fn()}
        updateLayerTextLabel={jest.fn()}
      />
    );
  };
  renderWithTheme(
    <IntlWrapper>
      <Configurator />
    </IntlWrapper>
  );
  const dashGroup = screen.queryByText('Dashed strokes')?.closest('.layer-config-group');
  const toggle = dashGroup
    ? within(dashGroup as HTMLElement).getByRole<HTMLInputElement>('checkbox')
    : null;
  expect(Boolean(toggle)).toBe(line);
  expect(toggle?.checked).not.toBe(true);
  if (toggle) {
    const group = toggle.closest('.layer-config-group') as HTMLElement;
    const content = group.querySelector('.layer-config-group__content');
    expect(group).toHaveClass('collapsed');
    expect(content).toHaveClass('disabled');
    // Polygon stroke settings must not disable the line group's switch.
    expect(toggle.closest('.disabled')).toBeNull();
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(group).not.toHaveClass('collapsed');
    expect(content).not.toHaveClass('disabled');
    const inputFor = (label: string) =>
      within(
        within(group).getByText(label).closest('.side-panel-section') as HTMLElement
      ).getByRole('spinbutton');
    const dash = inputFor('Dash length');
    const gap = inputFor('Gap length');
    // JSDOM does not apply the collapse animation; verify both controls are inside it.
    const collapsibleContent = dash.closest('.layer-config-group__content__collapsible');
    expect(collapsibleContent).not.toBeNull();
    expect(collapsibleContent?.closest('.layer-config-group')).toBe(group);
    expect(gap.closest('.layer-config-group__content__collapsible')).toBe(collapsibleContent);
    expect(dash).toHaveValue(3);
    expect(gap).toHaveValue(2);
    fireEvent.change(dash, {target: {value: '6'}});
    fireEvent.blur(dash);
    fireEvent.change(gap, {target: {value: '1.5'}});
    fireEvent.blur(gap);
    expect(updateLayerVisConfig.mock.calls).toEqual([
      [{dashedLines: true}],
      [{dashLength: 6}],
      [{gapLength: 1.5}]
    ]);
    const label = within(group).getByText('Dashed strokes');
    fireEvent.click(label);
    expect(group).toHaveClass('collapsed');
    expect(toggle).toBeChecked();
    fireEvent.click(label);
    expect(group).not.toHaveClass('collapsed');
    expect(dash).toHaveValue(6);
    expect(gap).toHaveValue(1.5);
    expect(updateLayerVisConfig).toHaveBeenCalledTimes(3);
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(content).toHaveClass('disabled');
    fireEvent.click(toggle);
    expect(dash).toHaveValue(6);
    expect(gap).toHaveValue(1.5);
  } else {
    expect(screen.queryByText('Dash length')).toBeNull();
    expect(screen.queryByText('Gap length')).toBeNull();
    expect(updateLayerVisConfig).not.toHaveBeenCalled();
  }
});

test('Point fill opacity expands, preserves settings on collapse and restores saved configs', async () => {
  const fields = ['lat', 'lng', 'alpha value', 'point name'].map((name, fieldIdx) => ({
    name,
    displayName: name,
    type: name === 'point name' ? 'string' : 'real',
    format: '',
    fieldIdx
  }));
  const dataset = new KeplerTable({
    info: {id: 'opacity-points', label: 'Opacity points'},
    color: [0, 0, 0]
  });
  await dataset.importData({data: {fields, rows: [[40, -70, 0.5, 'city']]}});
  const layer = new KeplerGlLayers.PointLayer({
    id: 'opacity-points-layer',
    dataId: dataset.id,
    columns: {lat: {value: 'lat', fieldIdx: 0}, lng: {value: 'lng', fieldIdx: 1}}
  });
  const updateLayerVisConfig = jest.fn(config => layer.updateLayerVisConfig(config));
  const RenderLayer = () => {
    const [, setRevision] = React.useState(0);
    return (
      <IntlWrapper>
        <LayerConfigurator
          layer={layer}
          datasets={{[dataset.id]: dataset}}
          layerTypeOptions={[]}
          openModal={jest.fn()}
          updateLayerConfig={jest.fn()}
          updateLayerType={jest.fn()}
          updateLayerVisConfig={config => {
            updateLayerVisConfig(config);
            setRevision(previous => previous + 1);
          }}
          updateLayerVisualChannelConfig={jest.fn()}
          updateLayerColorUI={jest.fn()}
          updateLayerTextLabel={jest.fn()}
        />
      </IntlWrapper>
    );
  };
  const view = render(<RenderLayer />, {
    wrapper: ({children}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
  });
  const field = screen.getByText('Fill opacity based on');
  const group = field.closest('.layer-config-group') as HTMLElement;
  const section = within(group);
  expect(group).toHaveClass('collapsed');
  const selector = section.getByText('Select a field');
  const content = selector.closest('.layer-config-group__content__collapsible');
  expect(content?.closest('.layer-config-group')).toBe(group);
  fireEvent.click(field);
  expect(group).not.toHaveClass('collapsed');
  expect(updateLayerVisConfig).not.toHaveBeenCalled();
  fireEvent.click(section.getByText('Select a field'));
  expect(screen.queryByText('point name')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('alpha value'));
  expect(updateLayerVisConfig).toHaveBeenLastCalledWith({
    fillOpacityField: 'alpha value',
    fillOpacityScale: 'linear',
    fillOpacityRange: [0, 1]
  });
  const rangeSection = within(screen.getByText('Opacity range (%)').parentElement as HTMLElement);
  const [minimum, maximum] = rangeSection.getAllByRole('spinbutton');
  fireEvent.change(minimum, {target: {value: '20'}});
  fireEvent.blur(minimum);
  fireEvent.change(maximum, {target: {value: '80'}});
  fireEvent.blur(maximum);
  expect(updateLayerVisConfig).toHaveBeenLastCalledWith({fillOpacityRange: [0.2, 0.8]});
  expect(minimum.closest('.layer-config-group__content__collapsible')).toBe(content);
  const updateCount = updateLayerVisConfig.mock.calls.length;
  fireEvent.click(field);
  expect(group).toHaveClass('collapsed');
  fireEvent.click(field);
  expect(group).not.toHaveClass('collapsed');
  expect(updateLayerVisConfig).toHaveBeenCalledTimes(updateCount);
  expect(section.getByText('alpha value')).toBeInTheDocument();
  expect(minimum).toHaveValue(20);
  expect(maximum).toHaveValue(80);
  const savedConfig = SchemaManager.getConfigToSave({
    visState: {layers: [layer], layerOrder: [layer.id]}
  });
  const [parsedLayer] = SchemaManager.parseSavedConfig(savedConfig)?.visState?.layers ?? [];
  const reopened = new KeplerGlLayers.PointLayer({dataId: dataset.id});
  expect(reopened.copyLayerConfig(reopened.config, parsedLayer.config)).toMatchObject({
    visConfig: {
      fillOpacityField: 'alpha value',
      fillOpacityScale: 'linear',
      fillOpacityRange: [0.2, 0.8]
    }
  });
  const scaleSection = within(screen.getByText('Opacity scale').parentElement as HTMLElement);
  expect(screen.getByText('Opacity scale').closest('.layer-config-group')).toBe(group);
  fireEvent.click(scaleSection.getByText('Linear'));
  fireEvent.click(screen.getByText('Raw (0–1)'));
  expect(updateLayerVisConfig).toHaveBeenLastCalledWith({fillOpacityScale: 'identity'});
  expect(screen.queryByText('Opacity range (%)')).not.toBeInTheDocument();
  fireEvent.click(scaleSection.getByText('Raw (0–1)'));
  fireEvent.click(screen.getByText('Linear'));
  expect(layer.config.visConfig.fillOpacityRange).toEqual([0.2, 0.8]);

  // A saved selection from before normalization has no scale or range keys.
  layer.updateLayerVisConfig({fillOpacityScale: undefined, fillOpacityRange: undefined});
  view.rerender(<RenderLayer />);
  expect(scaleSection.getByText('Raw (0–1)')).toBeInTheDocument();
  expect(screen.queryByText('Opacity range (%)')).not.toBeInTheDocument();
  layer.updateLayerVisConfig({filled: false});
  view.rerender(<RenderLayer />);
  expect(group).toHaveClass('disabled');
});
