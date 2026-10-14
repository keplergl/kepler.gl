// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import test from 'tape';
import {appInjector, PlotContainerFactory, plotContainerSelector} from '@kepler.gl/components';
import {EMPTY_MAPBOX_STYLE, NO_MAP_ID} from '@kepler.gl/constants';
import {mockKeplerProps} from '../../helpers/mock-state';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

const PlotContainer = appInjector.get(PlotContainerFactory);
const initialProps = plotContainerSelector(mockKeplerProps);
const initialState = {mapState: {latitude: 0, longitude: 0}, uiState: mockKeplerProps.uiState};
const mockStore = configureStore();

test('PlotContainer -> mount', t => {
  const store = mockStore(initialState);
  t.doesNotThrow(() => {
    mountWithTheme(
      <Provider store={store}>
        <IntlWrapper>
          <PlotContainer {...initialProps} />
        </IntlWrapper>
      </Provider>
    );
  }, 'PlotContainer should not fail without props');

  t.end();
});

test('PlotContainer -> mount -> imageSize', t => {
  let wrapper;
  const imageSize = {
    scale: 1,
    imageW: 800,
    imageH: 600
  };

  const store = mockStore(initialState);
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <Provider store={store}>
        <IntlWrapper>
          <PlotContainer
            {...initialProps}
            imageSize={imageSize}
            mapFields={initialProps.mapFields}
            setExportImageSetting={() => {}}
            setExportImageDataUri={() => {}}
            setExportImageError={() => {}}
            addNotification={() => {}}
          />
        </IntlWrapper>
      </Provider>
    );
  }, 'PlotContainer should not fail without props');

  let map = wrapper.find('MapContainer').instance();

  t.equal(map.props.mapState.width, 800, 'should send imageW to mapState');
  t.equal(map.props.mapState.height, 600, 'should send imageH to mapState');

  // set center to be true
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <Provider store={store}>
        <IntlWrapper>
          <PlotContainer
            {...initialProps}
            imageSize={imageSize}
            center={true}
            mapFields={initialProps.mapFields}
            setExportImageSetting={() => {}}
            setExportImageDataUri={() => {}}
            setExportImageError={() => {}}
            addNotification={() => {}}
          />
        </IntlWrapper>
      </Provider>
    );
  }, 'PlotContainer should not fail without props');

  map = wrapper.find('MapContainer').instance();

  t.equal(map.props.mapState.latitude, 33.89064297228446, 'should set latitude when center: true');
  t.equal(
    map.props.mapState.longitude,
    -45.57105275929253,
    'should set longitude when center: true'
  );
  t.equal(map.props.mapState.zoom, 1.8721094288367688, 'should set zoom when center: true');
  t.end();
});

test('PlotContainer -> transparent background', t => {
  const imageSize = {
    scale: 1,
    imageW: 800,
    imageH: 600
  };
  const bottomMapStyle = {
    version: 8,
    sources: {},
    layers: [{id: 'background', type: 'background', paint: {'background-color': '#ffffff'}}]
  };
  const topMapStyle = {version: 8, sources: {}, layers: []};
  const mapFields = {
    ...initialProps.mapFields,
    mapStyle: {
      ...initialProps.mapFields.mapStyle,
      styleType: NO_MAP_ID,
      backgroundColor: [12, 34, 56],
      bottomMapStyle,
      topMapStyle
    }
  };
  const store = mockStore(initialState);

  const selectorProps = plotContainerSelector({
    ...mockKeplerProps,
    uiState: {
      ...mockKeplerProps.uiState,
      exportImage: {
        ...mockKeplerProps.uiState.exportImage,
        transparentBackground: true
      }
    }
  });
  t.equal(
    selectorProps.transparentBackground,
    true,
    'selector should forward transparentBackground'
  );

  const normalWrapper = mountWithTheme(
    <Provider store={store}>
      <IntlWrapper>
        <PlotContainer
          {...initialProps}
          imageSize={imageSize}
          mapFields={mapFields}
          transparentBackground={false}
          setExportImageSetting={() => {}}
          setExportImageDataUri={() => {}}
          setExportImageError={() => {}}
          addNotification={() => {}}
        />
      </IntlWrapper>
    </Provider>
  );
  const normalMap = normalWrapper.find('MapContainer').instance();

  t.equal(normalMap.props.mapStyle.bottomMapStyle, bottomMapStyle, 'should keep the bottom style');
  t.equal(normalMap.props.mapStyle.topMapStyle, topMapStyle, 'should keep the top style');
  t.equal(
    normalMap.styleSelector(normalMap.props).backgroundColor,
    '#0C2238',
    'should keep the no-basemap background color'
  );

  const transparentWrapper = mountWithTheme(
    <Provider store={store}>
      <IntlWrapper>
        <PlotContainer
          {...initialProps}
          imageSize={imageSize}
          mapFields={mapFields}
          transparentBackground={true}
          setExportImageSetting={() => {}}
          setExportImageDataUri={() => {}}
          setExportImageError={() => {}}
          addNotification={() => {}}
        />
      </IntlWrapper>
    </Provider>
  );
  const transparentMap = transparentWrapper.find('MapContainer').instance();
  const transparentStyle = transparentMap.styleSelector(transparentMap.props);

  t.equal(
    transparentMap.props.transparentBackground,
    true,
    'should pass transparentBackground to MapContainer'
  );
  t.deepEqual(
    transparentMap.props.mapStyle.bottomMapStyle,
    EMPTY_MAPBOX_STYLE,
    'should replace the bottom basemap with an empty style'
  );
  t.equal(
    transparentMap.props.mapStyle.topMapStyle,
    undefined,
    'should omit the top basemap style'
  );
  t.notOk(
    Object.prototype.hasOwnProperty.call(transparentStyle, 'backgroundColor'),
    'should omit the map container background color'
  );
  t.notOk(
    Object.prototype.hasOwnProperty.call(transparentStyle, 'backgroundImage'),
    'should omit the map container background image'
  );

  normalWrapper.unmount();
  transparentWrapper.unmount();
  t.end();
});

test('PlotContainer -> transparent globe keeps only the depth occluder', t => {
  const imageSize = {
    scale: 1,
    imageW: 800,
    imageH: 600
  };
  const mapFields = {
    ...initialProps.mapFields,
    mapState: {
      ...initialProps.mapFields.mapState,
      globe: {
        ...initialProps.mapFields.mapState.globe,
        enabled: true
      }
    }
  };
  const store = mockStore(initialState);
  const wrapper = mountWithTheme(
    <Provider store={store}>
      <IntlWrapper>
        <PlotContainer
          {...initialProps}
          imageSize={imageSize}
          mapFields={mapFields}
          transparentBackground={true}
          setExportImageSetting={() => {}}
          setExportImageDataUri={() => {}}
          setExportImageError={() => {}}
          addNotification={() => {}}
        />
      </IntlWrapper>
    </Provider>
  );
  const map = wrapper.find('MapContainer').instance();
  const layersForDeck = map.layersForDeckSelector(map.props);
  const deckWrapper = map._renderDeckOverlay(layersForDeck, {primaryMap: true});
  const globeSystemLayerIds = deckWrapper.props.children.props.layers
    .map(layer => layer.id)
    .filter(id => id.startsWith('globe-'));

  t.deepEqual(
    globeSystemLayerIds,
    ['globe-depth-disk-layer'],
    'should omit visible globe basemap layers but retain the depth occluder'
  );

  wrapper.unmount();
  t.end();
});
