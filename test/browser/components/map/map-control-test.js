// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable enzyme-deprecation/no-mount,enzyme-deprecation/no-shallow,max-statements */
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';

import {
  MapControlButton,
  ToolbarItem,
  mapFieldsSelector,
  appInjector,
  MapLayerSelector,
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

const {Cube3d, Split, Legend, DrawPolygon, Layers, Delete} = Icons;
const MapControl = appInjector.get(MapControlFactory);
const MapContainer = appInjector.get(MapContainerFactory);
const MapLegend = appInjector.get(MapLegendFactory);
const MapControlToolbar = appInjector.get(MapControlToolbarFactory);

const initialProps = mapFieldsSelector(mockKeplerProps);

test('MapControlFactory - display all options', t => {
  const onToggleSplitMap = sinon.spy();
  const onTogglePerspective = sinon.spy();
  const onToggleMapControl = sinon.spy();
  const onSetEditorMode = sinon.spy();
  const onToggleEditorVisibility = sinon.spy();
  const onSetLocale = sinon.spy();
  const $ = shallow(
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
  );
  t.equal($.find('.map-control-action').length, 6, 'Should show 6 action panels');
  t.end();
});

test('MapControlFactory - display options', t => {
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapViewStateContextProvider mapState={initialProps.mapState}>
          <MapContainer {...initialProps} />
        </MapViewStateContextProvider>
      </IntlWrapper>
    );
  }, 'Map Container should not fail without props');

  // wrapper
  // MapControl
  t.equal(wrapper.find(MapControl).length, 1, 'Should render MapControl');

  // layer selector is not active
  t.equal(wrapper.find(MapControlButton).length, 5, 'Should show 5 MapControlButton');

  t.equal(wrapper.find(Split).length, 1, 'Should show 1 split map button');
  t.equal(wrapper.find(Cube3d).length, 1, 'Should show 1 toggle 3d button');
  t.equal(wrapper.find(Legend).length, 1, 'Should show 1 map legend button');
  t.equal(wrapper.find(DrawPolygon).length, 1, 'Should show 1 map draw button');
  t.equal(wrapper.find('.map-control-button__locale').length, 1, 'Should show 1 locale  button');

  // with split map and active layer selector
  const propsWithSplitMap = mapFieldsSelector(mockKeplerPropsWithState({state: StateWSplitMaps}));

  wrapper.setProps({
    children: (
      <MapViewStateContextProvider mapState={propsWithSplitMap.mapState}>
        <MapContainer {...propsWithSplitMap} />
      </MapViewStateContextProvider>
    )
  });

  // 5 control buttons as legend is opened automatically in split map mode
  t.equal(wrapper.find(MapControlButton).length, 5, 'Should show 5 MapControlButton');
  t.equal(wrapper.find(Split).length, 0, 'Should show 0 split map split button');
  t.equal(wrapper.find(Delete).length, 1, 'Should show 1 split map delete button');
  t.equal(wrapper.find(Layers).length, 1, 'Should show 1 Layer button');

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
  const updateState = keplerGlReducerCore(StateWSplitMaps, toggleMapControl('mapLegend', 0));
  const mapContainerProps = mapFieldsSelector(
    mockKeplerPropsWithState({
      state: updateState,
      visStateActions,
      mapStateActions,
      uiStateActions
    })
  );

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
          <MapContainer {...mapContainerProps} />
        </MapViewStateContextProvider>
      </IntlWrapper>
    );
  }, 'MapContainer should not fail without props');

  // layer selector is not active
  t.equal(wrapper.find(MapControlButton).length, 6, 'Should show 6 MapControlButton');

  t.equal(wrapper.find(Delete).length, 1, 'Should show 1 delete split map button');
  // click split Map
  wrapper.find('.map-control-button.split-map').at(0).simulate('click');
  t.ok(onToggleSplitMap.calledOnce, 'should call onToggleSplitMap');
  t.deepEqual(onToggleSplitMap.args[0], [0], 'should call onToggleSplitMap with mapindex');

  // click toggle3d
  wrapper.find('.map-control-button.toggle-3d').at(0).simulate('click');
  t.ok(onTogglePerspective.calledOnce, 'should call onTogglePerspective');

  // click map legend
  wrapper.find('.map-control-button.show-legend').at(0).simulate('click');

  t.equal(wrapper.find(MapLegend).length, 1, 'should render MapLegend');

  // click map draw
  wrapper.find('.map-control-button.map-draw').at(0).simulate('click');

  t.equal(wrapper.find(MapLegend).length, 1, 'should render MapLegend');

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

  t.end();
});

test('MapControlFactory - show panels', t => {
  // show legend
  let updateState = keplerGlReducerCore(StateWFiles, toggleMapControl('mapLegend', 0));
  let mapContainerProps = mapFieldsSelector(mockKeplerPropsWithState({state: updateState}));

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
          <MapContainer {...mapContainerProps} />
        </MapViewStateContextProvider>
      </IntlWrapper>
    );
  }, 'MapContainer should not fail without props');

  // show legend
  t.equal(wrapper.find(MapLegend).length, 1, 'should render 1 MapLegend');

  // show layer selector
  const toggleLayerForMap = sinon.spy();
  const visStateActions = {
    toggleLayerForMap
  };
  updateState = keplerGlReducerCore(StateWSplitMaps, toggleMapControl('visibleLayers', 1));
  mapContainerProps = mapFieldsSelector(
    mockKeplerPropsWithState({state: updateState, visStateActions})
  );
  wrapper.setProps({
    children: (
      <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
        <MapContainer {...mapContainerProps} index={1} />
      </MapViewStateContextProvider>
    )
  });

  // click layer selector
  t.equal(wrapper.find(MapLayerSelector).length, 1, 'should render 1 MapLayerSelector');

  t.equal(
    wrapper.find('.map-layer-selector__item').length,
    Object.keys(updateState.visState.splitMaps[1].layers).length,
    'MapLayerSelector should render correct number of layers'
  );

  wrapper.find('input').at(0).simulate('change');
  t.ok(toggleLayerForMap.calledOnce, 'should call toggleLayerForMap');
  t.deepEqual(
    toggleLayerForMap.args[0],
    [1, 'point-0'],
    'should call toggleLayerForMap with mapIndex and layerid'
  );
  // show map draw panel
  updateState = keplerGlReducerCore(StateWSplitMaps, toggleMapControl('mapDraw', 1));
  mapContainerProps = mapFieldsSelector(mockKeplerPropsWithState({state: updateState}));
  wrapper.setProps({
    children: (
      <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
        <MapContainer {...mapContainerProps} index={1} />
      </MapViewStateContextProvider>
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
      <MapViewStateContextProvider mapState={mapContainerProps.mapState}>
        <MapContainer {...mapContainerProps} index={1} />
      </MapViewStateContextProvider>
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
