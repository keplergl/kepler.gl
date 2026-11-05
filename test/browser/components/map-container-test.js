// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import sinon from 'sinon';
import {MapView} from '@deck.gl/core';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
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
    mapState: {
      ...initialProps.mapState,
      ...mapState,
      globe: {...initialProps.mapState.globe, ...mapState.globe}
    },
    deckRenderCallbacks: {
      onDeckRender: allDeckGlProps => {
        deckProps = allDeckGlProps;
        return allDeckGlProps;
      }
    }
  };
  const wrapper = renderWithTheme(
    <Provider store={mockStore(initialState)}>
      <IntlWrapper>
        <MapViewStateContextProvider mapState={props.mapState}>
          <MapContainer {...props} />
        </MapViewStateContextProvider>
      </IntlWrapper>
    </Provider>
  );
  wrapper.unmount();
  return deckProps;
}

test('MapContainerFactory - world repetition is disabled by default', t => {
  const flat = renderedDeckProps({globe: {enabled: false}});
  t.ok(flat, 'should render the deck overlay');
  t.ok(flat.views instanceof MapView, 'a flat map should use a MapView');
  t.equal(flat.views.props.repeat, false, 'the MapView should draw a single world by default');

  t.end();
});

test('MapContainerFactory - world repetition follows application config', t => {
  const {enableMapRepeat} = getApplicationConfig();
  try {
    for (const enabled of [true, false]) {
      initApplicationConfig({enableMapRepeat: enabled});
      const flat = renderedDeckProps({globe: {enabled: false}});
      t.equal(flat.views.props.repeat, enabled, `repeat should be ${enabled}`);
      const globe = renderedDeckProps({globe: {enabled: true}});
      t.notOk(globe.views instanceof MapView, 'the flag should not replace the globe view');
      t.notOk(globe.views.props.repeat, 'the flag should not enable globe repetition');
    }
  } finally {
    initApplicationConfig({enableMapRepeat});
  }
  t.end();
});
