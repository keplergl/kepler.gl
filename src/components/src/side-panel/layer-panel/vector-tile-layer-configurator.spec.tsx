// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {fireEvent, screen} from '@testing-library/react';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import {appInjector} from '@kepler.gl/components';
import {VectorTileLayer} from '@kepler.gl/layers';
import VectorTileLayerConfiguratorFactory from './vector-tile-layer-configurator';

const Configurator = appInjector.get(VectorTileLayerConfiguratorFactory);

function renderHelper(metadata?: any, showBounds = false) {
  const layer = new VectorTileLayer({id: 'helper', dataId: 'tiles'});
  layer.updateLayerVisConfig({showBounds});
  const onChange = jest.fn();
  const view = renderWithTheme(
    <Provider store={createStore(() => ({}))}>
      <IntlWrapper>
        <Configurator
          layer={layer}
          dataset={{metadata} as any}
          visConfiguratorProps={{layer, onChange, fields: []}}
          layerChannelConfigProps={{layer, fields: []} as any}
          layerConfiguratorProps={{layer, onChange}}
        />
      </IntlWrapper>
    </Provider>
  );
  return {view, onChange};
}

test('metadata helper shows zoom zero and changes only the opt-in setting', () => {
  const {view, onChange} = renderHelper({bounds: [0, 0, 10, 10], minZoom: 0, maxZoom: 12});
  expect(screen.getByText('Archive zoom levels: 0–12')).toBeInTheDocument();
  expect(screen.getByText(/Metadata extent only/)).toBeInTheDocument();
  const toggle = view.container.querySelector('#helper-showBounds-switch') as HTMLInputElement;
  expect(toggle.checked).toBe(false);
  fireEvent.click(toggle);
  expect(onChange).toHaveBeenCalledWith({showBounds: true});
});

test('restores the saved helper toggle and explains missing metadata', () => {
  const {view, onChange} = renderHelper(undefined, true);
  expect(screen.getByText(/Bounds are unavailable/)).toBeInTheDocument();
  expect(screen.queryByText(/Archive zoom levels/)).toBeNull();
  const toggle = view.container.querySelector('#helper-showBounds-switch') as HTMLInputElement;
  expect(toggle.checked).toBe(true);
  fireEvent.click(toggle);
  expect(onChange).toHaveBeenCalledWith({showBounds: false});
});

test('does not claim an invalid zoom interval', () => {
  renderHelper({minZoom: 10, maxZoom: 2});
  expect(screen.queryByText(/Archive zoom levels/)).toBeNull();
});
