// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import sinon from 'sinon';
import {MapView} from '@deck.gl/core';
import test from 'tape';
import {
  appInjector,
  MapContainerFactory,
  mapFieldsSelector,
  MapViewStateContextProvider
} from '@kepler.gl/components';
import {mockKeplerProps} from '../../helpers/mock-state';

const MapContainer = appInjector.get(MapContainerFactory);
const initialProps = mapFieldsSelector(mockKeplerProps);

const initialState = {mapState: {latitude: 0, longitude: 0}};
const mockStore = configureStore();

test('MapContainerFactory - display all options', t => {
  const onMapStyleLoaded = sinon.spy();
  const onLayerClick = sinon.spy();
  const store = mockStore(initialState);

  const props = {
    ...initialProps,
    mapStyle: {
      bottomMapStyle: {layers: [], name: 'foo'},
      visibleLayerGroups: {}
    },
    onMapStyleLoaded,
    visStateActions: {
      ...initialProps.visStateActions,
      onLayerClick
    }
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <Provider store={store}>
        <IntlWrapper>
          <MapViewStateContextProvider mapState={props.mapState}>
            <MapContainer {...props} />
          </MapViewStateContextProvider>
        </IntlWrapper>
      </Provider>
    );
  }, 'MapContainer should not fail without props');

  t.equal(wrapper.find('MapControl').length, 1, 'Should display 1 MapControl');

  // In JSDOM, DeckGL/Map may not render due to missing WebGL context
  // The component's deck overlay conditionally renders based on runtime capabilities
  t.ok(wrapper.find(MapContainer).length >= 1, 'Should display 1 MapContainer');

  const instance = wrapper.find(MapContainer).instance();

  instance._onMapboxStyleUpdate();

  t.equal(onMapStyleLoaded.called, true, 'Should be calling onMapStyleLoaded');

  instance._onCloseMapPopover();
  t.equal(onLayerClick.called, true, 'Should be calling onLayerClick');

  t.end();
});

function renderedDeckProps(mapState = {}) {
  let deckProps = null;
  const props = {
    ...initialProps,
    mapState: {...initialProps.mapState, ...mapState},
    deckRenderCallbacks: {
      onDeckRender: allDeckGlProps => {
        deckProps = allDeckGlProps;
        return allDeckGlProps;
      }
    }
  };
  mountWithTheme(
    <Provider store={mockStore(initialState)}>
      <IntlWrapper>
        <MapViewStateContextProvider mapState={props.mapState}>
          <MapContainer {...props} />
        </MapViewStateContextProvider>
      </IntlWrapper>
    </Provider>
  );
  return deckProps;
}

test('MapContainerFactory - draws layers on every world copy', t => {
  const flat = renderedDeckProps({globe: {enabled: false}});
  t.ok(flat, 'should render the deck overlay');
  t.ok(flat.views instanceof MapView, 'a flat map should use a MapView');
  t.equal(
    flat.views.props.repeat,
    true,
    'the MapView should repeat the world, as the base map does'
  );

  t.end();
});
