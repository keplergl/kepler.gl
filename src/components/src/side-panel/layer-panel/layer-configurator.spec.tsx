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

test('expands Arc endpoint opacity controls, edits them independently and preserves saved values', async () => {
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
  const layer = new KeplerGlLayers.ArcLayer({id: 'arc', dataId: dataset.id});
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
  const reopened = new KeplerGlLayers.ArcLayer({id: 'arc', dataId: dataset.id});
  expect(reopened.copyLayerConfig(reopened.config, parsedLayer.config)).toMatchObject({
    visConfig: {sourceOpacity: 0.2, targetOpacity: 0}
  });
});
