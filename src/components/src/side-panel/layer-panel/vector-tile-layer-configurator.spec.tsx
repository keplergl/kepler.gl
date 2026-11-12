// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import {appInjector} from '@kepler.gl/components';
import {VectorTileLayer} from '@kepler.gl/layers';
import {RemoteTileFormat} from '@kepler.gl/constants';
import {messages} from '@kepler.gl/localization';
import VectorTileLayerConfiguratorFactory from './vector-tile-layer-configurator';

const Configurator = appInjector.get(VectorTileLayerConfiguratorFactory);

// jsdom otherwise treats :hover as matching every element in an unfocused document,
// making react-tooltip think the pointer remains over the tooltip after mouseleave.
beforeEach(() => jest.spyOn(document, 'hasFocus').mockReturnValue(true));
afterEach(() => jest.restoreAllMocks());

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

test('bounds switch lives directly in the final Debug group and preserves its toggle', () => {
  const {view, onChange} = renderHelper({bounds: [0, 0, 10, 10], minZoom: 9, maxZoom: 15});
  const debugLabel = screen.getByText('Debug');
  const debugGroup = debugLabel.closest('.layer-config-group');
  expect(debugGroup?.parentElement?.lastElementChild).toBe(debugGroup);
  expect(debugGroup).toHaveClass('collapsed');
  fireEvent.click(debugLabel);
  expect(debugGroup).not.toHaveClass('collapsed');
  expect(screen.queryByText(/Archive zoom levels/)).not.toBeInTheDocument();
  const toggle = view.container.querySelector('#helper-showBounds-switch') as HTMLInputElement;
  expect(toggle.closest('.layer-config-group')).toBe(debugGroup);
  expect(toggle.checked).toBe(false);
  fireEvent.click(toggle);
  expect(onChange).toHaveBeenCalledWith({showBounds: true});
});

test.each([
  [RemoteTileFormat.PMTILES, 'layer.pmtilesBoundsDescription'],
  [RemoteTileFormat.MVT, 'layer.tilesetBoundsDescription']
])('shows %s bounds help in the shared hover tooltip', async (remoteTileFormat, key) => {
  const {view, onChange} = renderHelper({remoteTileFormat, bounds: [0, 0, 10, 10]});
  fireEvent.click(screen.getByText('Debug'));
  const tooltip = screen.getByText(messages.en[key]).closest('#helper-showBounds-description');
  expect(tooltip).toBeInTheDocument();
  expect(tooltip).not.toBeVisible();
  const help = view.container.querySelector(
    '[data-for="helper-showBounds-description"]'
  ) as HTMLElement;
  fireEvent.mouseEnter(help);
  await waitFor(() => expect(tooltip).toBeVisible());
  fireEvent.mouseLeave(help);
  await waitFor(() => expect(tooltip).not.toBeVisible());
  expect(onChange).not.toHaveBeenCalled();
});

test('restores the saved helper toggle and explains missing metadata', () => {
  const {view, onChange} = renderHelper(undefined, true);
  fireEvent.click(screen.getByText('Debug'));
  expect(screen.getByText(/Bounds are unavailable/)).toBeInTheDocument();
  const toggle = view.container.querySelector('#helper-showBounds-switch') as HTMLInputElement;
  expect(toggle.checked).toBe(true);
  fireEvent.click(toggle);
  expect(onChange).toHaveBeenCalledWith({showBounds: false});
});
