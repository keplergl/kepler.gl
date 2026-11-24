// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {appInjector} from '@kepler.gl/components';
import {KeplerGlLayers} from '@kepler.gl/layers';
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
