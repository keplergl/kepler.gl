// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable max-statements */

import React from 'react';
import sinon from 'sinon';
import test from 'tape';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

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
  Cube3d,
  Split,
  Legend,
  DrawPolygon,
  Layers,
  Delete
} from 'components';

import {
  mockKeplerProps,
  mockKeplerPropsWithState,
  StateWSplitMaps,
  StateWFiles
} from '../../../helpers/mock-state';

import {LOCALE_CODES, LOCALES} from 'localization';
import {toggleMapControl} from 'actions';
import {keplerGlReducerCore} from 'reducers';

const MapControl = appInjector.get(MapControlFactory);
const MapContainer = appInjector.get(MapContainerFactory);
const MapLegend = appInjector.get(MapLegendFactory);
const MapControlToolbar = appInjector.get(MapControlToolbarFactory);

const initialProps = mapFieldsSelector(mockKeplerProps);

test('MapControlFactory - display options', t => {
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapContainer {...initialProps} />
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
    children: <MapContainer {...propsWithSplitMap} />
  });

  t.equal(wrapper.find(MapControlButton).length, 6, 'Should show 6 MapControlButton');
  t.equal(wrapper.find(Split).length, 0, 'Should show 0 split map split button');
  t.equal(wrapper.find(Delete).length, 1, 'Should show 1 split map delete button');
  t.equal(wrapper.find(Layers).length, 1, 'Should show 1 Layer button');

  // with 0 mapcontrols
  wrapper.setProps({
    children: <MapContainer {...propsWithSplitMap} mapControls={{}} />
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
  const mapContainerProps = mapFieldsSelector(
    mockKeplerPropsWithState({
      state: StateWSplitMaps,
      visStateActions,
      mapStateActions,
      uiStateActions
    })
  );

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapContainer {...mapContainerProps} />
      </IntlWrapper>
    );
  }, 'MapCnotainer should not fail without props');

  // layer selector is not active
  t.equal(wrapper.find(MapControlButton).length, 6, 'Should show 5 MapControlButton');

  t.equal(wrapper.find(Delete).length, 1, 'Should show 1 delete split map button');
  // click split Map
  wrapper
    .find('.map-control-button.split-map')
    .at(0)
    .simulate('click');
  t.ok(onToggleSplitMap.calledOnce, 'should call onToggleSplitMap');
  t.deepEqual(onToggleSplitMap.args[0], [0], 'should call onToggleSplitMap with mapindex');

  // click toggle3d
  wrapper
    .find('.map-control-button.toggle-3d')
    .at(0)
    .simulate('click');
  t.ok(onTogglePerspective.calledOnce, 'should call onTogglePerspective');

  // click map legend
  wrapper
    .find('.map-control-button.show-legend')
    .at(0)
    .simulate('click');

  t.equal(wrapper.find(MapLegend).length, 1, 'should render MapLegend');

  // click map draw
  wrapper
    .find('.map-control-button.map-draw')
    .at(0)
    .simulate('click');

  t.equal(wrapper.find(MapLegend).length, 1, 'should render MapLegend');

  t.ok(onToggleMapControl.calledOnce, 'should call onToggleMapControl');
  t.deepEqual(
    onToggleMapControl.args[0],
    ['mapDraw', 0],
    'should call onToggleMapControl with mapDraw'
  );

  // click locale
  wrapper
    .find('.map-control-button.map-locale')
    .at(0)
    .simulate('click');
  t.ok(onToggleMapControl.calledTwice, 'should call onToggleMapControl');
  t.deepEqual(
    onToggleMapControl.args[1],
    ['mapLocale', 0],
    'should call onToggleMapControl with mapLocale'
  );

  // click layer selector
  wrapper
    .find('.map-control-button.toggle-layer')
    .at(0)
    .simulate('click');
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
        <MapContainer {...mapContainerProps} />
      </IntlWrapper>
    );
  }, 'MapCnotainer should not fail without props');

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
    children: <MapContainer {...mapContainerProps} index={1} />
  });

  // click layer selector
  t.equal(wrapper.find(MapLayerSelector).length, 1, 'should render 1 MapLayerSelector');

  t.equal(
    wrapper.find('.map-layer-selector__item').length,
    Object.keys(updateState.visState.splitMaps[1].layers).length,
    'MapLayerSelector should render correct number of layers'
  );

  wrapper
    .find('input')
    .at(0)
    .simulate('change');
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
    children: <MapContainer {...mapContainerProps} index={1} />
  });

  t.equal(wrapper.find(MapControlToolbar).length, 1, 'should render 1 MapControlToolbar');
  t.equal(
    wrapper
      .find(MapControlToolbar)
      .at(0)
      .find(ToolbarItem).length,
    4,
    'should render 4 ToolbarItem'
  );

  // show locale
  updateState = keplerGlReducerCore(StateWSplitMaps, toggleMapControl('mapLocale', 1));
  mapContainerProps = mapFieldsSelector(mockKeplerPropsWithState({state: updateState}));
  wrapper.setProps({
    children: <MapContainer {...mapContainerProps} index={1} />
  });

  t.equal(wrapper.find(MapControlToolbar).length, 1, 'should render 1 MapControlToolbar');
  t.equal(
    wrapper
      .find(MapControlToolbar)
      .at(0)
      .find(ToolbarItem).length,
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
