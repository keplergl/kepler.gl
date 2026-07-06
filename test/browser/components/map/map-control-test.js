// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements */
import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

import {
  MapControlButton,
  ToolbarItem,
  mapFieldsSelector,
  appInjector,
  MapContainerFactory,
  MapLegendFactory,
  MapControlFactory,
  MapControlToolbarFactory,
  Icons,
  MapViewStateContextProvider
} from '@kepler.gl/components';
import {LOCALE_CODES, LOCALES} from '@kepler.gl/localization';
import {toggleMapControl} from '@kepler.gl/actions';
import {keplerGlReducerCore} from '@kepler.gl/reducers';

import {IntlWrapper, mountWithTheme} from '../../../helpers/component-utils';
import {
  mockKeplerProps,
  mockKeplerPropsWithState,
  StateWSplitMaps,
  StateWFiles
} from '../../../helpers/mock-state';

const {Cube3d, Split, Legend, DrawPolygon, Delete} = Icons;
const MapControl = appInjector.get(MapControlFactory);
const MapContainer = appInjector.get(MapContainerFactory);
const MapLegend = appInjector.get(MapLegendFactory);
const MapControlToolbar = appInjector.get(MapControlToolbarFactory);

const initialProps = mapFieldsSelector(mockKeplerProps);

const mockStore = configureStore();

test('MapControlFactory - display all options', t => {
  const onToggleSplitMap = sinon.spy();
  const onTogglePerspective = sinon.spy();
  const onToggleMapControl = sinon.spy();
  const onSetEditorMode = sinon.spy();
  const onToggleEditorVisibility = sinon.spy();
  const onSetLocale = sinon.spy();
  const $ = mountWithTheme(
    <IntlWrapper>
      <MapViewStateContextProvider mapState={{latitude: 0, longitude: 0, zoom: 1}}>
        <MapControl
          mapControls={{
            splitMap: {show: true},
            visibleLayers: {show: true},
            toggle3d: {show: true},
            mapLegend: {show: true},
            mapDraw: {show: true},
            mapLocale: {show: true},
            effect: {show: true}
          }}
          datasets={{}}
          layers={[]}
          locale={'en'}
          layersToRender={{}}
          dragRotate={true}
          mapIndex={0}
          onToggleSplitMap={onToggleSplitMap}
          onTogglePerspective={onTogglePerspective}
          onToggleMapControl={onToggleMapControl}
          onSetEditorMode={onSetEditorMode}
          onToggleEditorVisibility={onToggleEditorVisibility}
          onSetLocale={onSetLocale}
        />
      </MapViewStateContextProvider>
    </IntlWrapper>
  );
  t.equal($.find('.map-control-action').length, 7, 'Should show 7 action panels');
  t.end();
});

test('MapControlFactory - display options', t => {
  const store = mockStore({
    uiState: StateWSplitMaps.uiState
  });

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <Provider store={store}>
        <IntlWrapper>
          <MapViewStateContextProvider mapState={initialProps.mapState}>
            <MapContainer {...initialProps} />
          </MapViewStateContextProvider>
        </IntlWrapper>
      </Provider>
    );
  }, 'Map Container should not fail without props');

  // wrapper
  // MapControl
  t.equal(wrapper.find(MapControl).length, 1, 'Should render MapControl');

  // layer selector is not active
  t.equal(wrapper.find(MapControlButton).length, 6, 'Should show 6 MapControlButton');

  t.equal(wrapper.find(Split).length, 1, 'Should show 1 split map button');
  t.equal(wrapper.find(Cube3d).length, 1, 'Should show 1 toggle 3d button');
  t.equal(wrapper.find(Legend).length, 1, 'Should show 1 map legend button');
  t.equal(wrapper.find(DrawPolygon).length, 1, 'Should show 1 map draw button');
  t.equal(wrapper.find('.map-control-button__locale').length, 1, 'Should show 1 locale  button');

  // with split map and active layer selector
  const propsWithSplitMap = mapFieldsSelector(mockKeplerPropsWithState({state: StateWSplitMaps}));

  wrapper.setProps({
    children: (
      <Provider store={store}>
        <IntlWrapper>
          <MapViewStateContextProvider mapState={propsWithSplitMap.mapState}>
            <MapContainer {...propsWithSplitMap} />
          </MapViewStateContextProvider>
        </IntlWrapper>
      </Provider>
    )
  });

  // 6 control buttons as legend is opened automatically in split map mode
  t.equal(wrapper.find(MapControlButton).length, 6, 'Should show 6 MapControlButton');
  t.equal(wrapper.find(Split).length, 0, 'Should show 0 split map split button');
  t.equal(wrapper.find(Delete).length, 1, 'Should show 1 split map delete button');

  // with 0 mapcontrols
  wrapper.setProps({
    children: (
      <MapViewStateContextProvider mapState={propsWithSplitMap.mapState}>
        <MapContainer {...propsWithSplitMap} mapControls={{}} />
      </MapViewStateContextProvider>
    )
  });

  t.equal(wrapper.find(MapControlButton).length, 0, 'Should show 0 MapControlButton');

  t.end();
});

test('MapControlFactory - click options', t => {
  const onToggleSplitMap = sinon.spy();
  const onTogglePerspective = sinon.spy();
  const onToggleMapControl = sinon.spy();
  const onSetEditorMode = sinon.spy();
  const onToggleEditorVisibility = sinon.spy();
  const onSetLocale = sinon.spy();

  const visStateActions = {
    setEditorMode: onSetEditorMode,
    toggleEditorVisibility: onToggleEditorVisibility
  };
  const mapStateActions = {
    toggleSplitMap: onToggleSplitMap,
    togglePerspective: onTogglePerspective
  };
  const uiStateActions = {
    toggleMapControl: onToggleMapControl,
    setLocale: onSetLocale
  };
  // const updateState = keplerGlReducerCore(StateWSplitMaps, toggleMapControl('mapLegend', 0));
  const mapContainerProps = mapFieldsSelector(
    mockKeplerPropsWithState({
      state: StateWSplitMaps,
      visStateActions,
      mapStateActions,
      uiStateActions
    })
  );

  const store = mockStore({
    uiState: StateWSplitMaps.uiState
  });

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
            <MapContainer {...mapContainerProps} />
          </MapViewStateContextProvider>
        </Provider>
      </IntlWrapper>
    );
  }, 'MapContainer should not fail without props');

  // layer selector is not active
  t.equal(wrapper.find(MapControlButton).length, 6, 'Should show 6 MapControlButton');

  t.equal(wrapper.find(Delete).length, 1, 'Should show 1 delete split map button');
  // click split Map - now opens mode menu since enableSwipeMode is true
  wrapper.find('.map-control-button.split-map').at(0).simulate('click');
  // onToggleSplitMap is not called directly when mode menu is available
  t.notOk(onToggleSplitMap.calledOnce, 'should not call onToggleSplitMap when mode menu is enabled');

  // click toggle3d
  wrapper.find('.map-control-button.toggle-3d').at(0).simulate('click');
  t.ok(onTogglePerspective.calledOnce, 'should call onTogglePerspective');

  // click map legend
  wrapper.find('.map-control-button.show-legend').at(0).simulate('click');

  t.equal(wrapper.find(MapLegend).length, 1, 'should render MapLegend');

  // click map draw
  wrapper.find('.map-control-button.map-draw').at(0).simulate('click');

  t.equal(wrapper.find(MapLegend).length, 1, 'should render MapLegend');

  /*
  t.ok(onToggleMapControl.calledOnce, 'should call onToggleMapControl');
  t.deepEqual(
    onToggleMapControl.args[0],
    ['mapDraw', 0],
    'should call onToggleMapControl with mapDraw'
  );

  // click locale
  wrapper.find('.map-control-button.locale-panel').at(0).simulate('click');
  t.ok(onToggleMapControl.calledTwice, 'should call onToggleMapControl');
  t.deepEqual(
    onToggleMapControl.args[1],
    ['mapLocale', 0],
    'should call onToggleMapControl with mapLocale'
  );

  // click layer selector
  wrapper.find('.map-control-button.toggle-layer').at(0).simulate('click');
  t.ok(onToggleMapControl.calledThrice, 'should call onToggleMapControl');
  t.deepEqual(
    onToggleMapControl.args[2],
    ['visibleLayers', 0],
    'should call onToggleMapControl with visibleLayers'
  );
  */

  t.end();
});

test('MapControlFactory - show panels', t => {
  // show legend
  let updateState = keplerGlReducerCore(StateWFiles, toggleMapControl('mapLegend', 0));
  let mapContainerProps = mapFieldsSelector(mockKeplerPropsWithState({state: updateState}));

  const store = mockStore({
    uiState: updateState.uiState
  });

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
            <MapContainer {...mapContainerProps} />
          </MapViewStateContextProvider>
        </Provider>
      </IntlWrapper>
    );
  }, 'MapContainer should not fail without props');

  // show legend
  t.equal(wrapper.find(MapLegend).length, 1, 'should render 1 MapLegend');

  // show map draw panel
  updateState = keplerGlReducerCore(StateWSplitMaps, toggleMapControl('mapDraw', 1));
  mapContainerProps = mapFieldsSelector(mockKeplerPropsWithState({state: updateState}));
  wrapper.setProps({
    children: (
      <Provider store={store}>
        <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
          <MapContainer {...mapContainerProps} index={1} />
        </MapViewStateContextProvider>
      </Provider>
    )
  });

  t.equal(wrapper.find(MapControlToolbar).length, 1, 'should render 1 MapControlToolbar');
  t.equal(
    wrapper.find(MapControlToolbar).at(0).find(ToolbarItem).length,
    3,
    'should render 3 ToolbarItem'
  );

  // show locale
  updateState = keplerGlReducerCore(StateWSplitMaps, toggleMapControl('mapLocale', 1));
  mapContainerProps = mapFieldsSelector(mockKeplerPropsWithState({state: updateState}));
  wrapper.setProps({
    children: (
      <Provider store={store}>
        <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
          <MapContainer {...mapContainerProps} index={1} />
        </MapViewStateContextProvider>
      </Provider>
    )
  });

  t.equal(wrapper.find(MapControlToolbar).length, 1, 'should render 1 MapControlToolbar');
  t.equal(
    wrapper.find(MapControlToolbar).at(0).find(ToolbarItem).length,
    Object.keys(LOCALE_CODES).length,
    `should render ${Object.keys(LOCALE_CODES).length} LOCALE_CODES`
  );

  Object.keys(LOCALE_CODES).forEach((locale, index) => {
    t.equal(
      wrapper
        .find(MapControlToolbar)
        .at(0)
        .find(ToolbarItem)
        .at(index)
        .find('.toolbar-item__title')
        .text(),
      LOCALES[locale],
      'should render correct locale'
    );
  });

  t.end();
});
