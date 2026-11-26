// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen, within} from '@testing-library/react';
import {appInjector} from '@kepler.gl/components';
import {KeplerGlLayers} from '@kepler.gl/layers';
import SchemaManager from '@kepler.gl/schemas';
import {KeplerTable} from '@kepler.gl/table';
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

    renderWithTheme(
      <IntlWrapper>
        <LayerConfigurator
          layer={layer}
          datasets={{[dataset.id]: dataset}}
          layerTypeOptions={[]}
          openModal={jest.fn()}
          updateLayerConfig={jest.fn()}
          updateLayerType={jest.fn()}
          updateLayerVisConfig={updateLayerVisConfig}
          updateLayerVisualChannelConfig={jest.fn()}
          updateLayerColorUI={jest.fn()}
          updateLayerTextLabel={jest.fn()}
        />
      </IntlWrapper>
    );

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
    expect(inputFor('Opacity').closest('.layer-config-group__content__collapsible')).toBeNull();

    fireEvent.click(colorLabel);
    expect(colorGroup).not.toHaveClass('collapsed');
    expect(source).toHaveValue(1);
    expect(target).toHaveValue(1);
    fireEvent.change(source, {target: {value: '0.2'}});
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
  const toggle = screen.queryByLabelText<HTMLInputElement>('Dashed lines');
  expect(Boolean(toggle)).toBe(line);
  expect(toggle?.checked).not.toBe(true);
  if (toggle) {
    const group = toggle.closest('.layer-config-group') as HTMLElement;
    const content = group.querySelector('.layer-config-group__content');
    expect(content).toHaveClass('disabled');
    // Polygon stroke settings must not disable the line group's switch.
    expect(toggle.closest('.disabled')).toBeNull();
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(content).not.toHaveClass('disabled');
    const inputFor = (label: string) =>
      within(
        within(group).getByText(label).closest('.side-panel-section') as HTMLElement
      ).getByRole('spinbutton');
    const dash = inputFor('Dash length');
    const gap = inputFor('Gap length');
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
