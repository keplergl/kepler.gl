// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import test from 'tape';
import {appInjector, PlotContainerFactory, plotContainerSelector} from '@kepler.gl/components';
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
  t.equal(map.props.mapState.zoom, 1, 'should set zoom when center: true');
  t.end();
});
