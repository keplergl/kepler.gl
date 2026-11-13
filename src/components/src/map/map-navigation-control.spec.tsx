// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {MapStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {MapState} from '@kepler.gl/types';
import {DEFAULT_GLOBE_CONFIG} from '@kepler.gl/constants';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {MapViewStateContext, MapViewStateContextType} from '../map-view-state-context';
import MapNavigationControlFactory from './map-navigation-control';

const MapNavigationControl = MapNavigationControlFactory();
const originalEnabled = getApplicationConfig().enableMapNavigationControl;
beforeEach(() => initApplicationConfig({enableMapNavigationControl: true}));
afterEach(() => initApplicationConfig({enableMapNavigationControl: originalEnabled}));

type LiveView = ReturnType<MapViewStateContextType['getInternalViewState']>;
function setup(mapState: Partial<MapState> = {}, liveView?: LiveView, mapIndex = 0) {
  const updateMap = jest.fn();
  const getInternalViewState = jest.fn(() => liveView as LiveView);
  const result = renderWithTheme(
    <MapViewStateContext.Provider value={{getInternalViewState, setInternalViewState: jest.fn()}}>
      <MapNavigationControl
        mapState={{...INITIAL_MAP_STATE, dragRotate: true, ...mapState}}
        mapIndex={mapIndex}
        mapStateActions={{...MapStateActions, updateMap}}
      />
    </MapViewStateContext.Provider>
  );
  return {...result, updateMap, getInternalViewState};
}

const click = (title: string) => fireEvent.click(screen.getByTitle(title));

test('hides navigation when disabled and hides only the compass when rotation is disabled', () => {
  initApplicationConfig({enableMapNavigationControl: false});
  const {unmount, updateMap} = setup();
  expect(screen.queryByTitle('Zoom in')).not.toBeInTheDocument();
  expect(screen.queryByTitle('Reset bearing/pitch')).not.toBeInTheDocument();
  expect(updateMap).not.toHaveBeenCalled();
  unmount();
  initApplicationConfig({enableMapNavigationControl: true});
  setup({dragRotate: false});
  expect(screen.getByTitle('Zoom in')).toBeInTheDocument();
  expect(screen.getByTitle('Zoom out')).toBeInTheDocument();
  expect(screen.queryByTitle('Reset bearing/pitch')).not.toBeInTheDocument();
});

test('uses the live split viewport rather than stale Redux zoom, including zoom zero', () => {
  const {updateMap, getInternalViewState} = setup(
    {zoom: 9, isSplit: true, isViewportSynced: false},
    {longitude: 20, latitude: 30, zoom: 0},
    1
  );
  click('Zoom in');
  click('Zoom out');
  expect(getInternalViewState).toHaveBeenCalledWith(1);
  expect(updateMap.mock.calls).toEqual([
    [{zoom: 1}, 1],
    [{zoom: -1}, 1]
  ]);
});

test('falls back to Redux zoom when no live viewport is available', () => {
  const {updateMap} = setup({zoom: 3.5});
  click('Zoom in');
  click('Zoom out');
  expect(updateMap.mock.calls).toEqual([
    [{zoom: 4.5}, 0],
    [{zoom: 2.5}, 0]
  ]);
});

test.each([
  ['Zoom in', 4.5, 0, 5, 5],
  ['Zoom in', -0.5, -3, 0, 0],
  ['Zoom out', 0.5, 0, 5, 0],
  ['Zoom out', -2.5, -3, 5, -3]
])('%s clamps zoom %s to configured limits', (button, zoom, minZoom, maxZoom, expected) => {
  const {updateMap} = setup({zoom, minZoom, maxZoom});
  click(button);
  expect(updateMap).toHaveBeenCalledWith({zoom: expected}, 0);
});

test.each([
  [45, 60, {bearing: 0}],
  [0, 60, {bearing: 0, pitch: 0}]
])('planar compass resets bearing %s before pitch %s', (bearing, pitch, expected) => {
  const {updateMap} = setup({bearing, pitch}, undefined, 1);
  click('Reset bearing/pitch');
  expect(updateMap).toHaveBeenCalledTimes(1);
  expect(updateMap).toHaveBeenCalledWith(expected, 1);
});

test('planar compass uses live zero bearing and pitch instead of stale rotation', () => {
  const {updateMap} = setup(
    {bearing: 45, pitch: 60},
    {longitude: 20, latitude: 30, zoom: 4, bearing: 0, pitch: 0}
  );
  click('Reset bearing/pitch');
  expect(updateMap).not.toHaveBeenCalled();
});

test('planar compass resets live pitch without resetting location or zoom', () => {
  const {updateMap} = setup(
    {bearing: 45, pitch: 0},
    {longitude: 20, latitude: 30, zoom: 4, bearing: 0, pitch: 60}
  );
  click('Reset bearing/pitch');
  expect(updateMap).toHaveBeenCalledWith({bearing: 0, pitch: 0}, 0);
});

test.each([undefined, {longitude: 20, latitude: -30, zoom: 4}])(
  'globe compass recenters the equator without changing longitude or zoom',
  liveView => {
    const {updateMap} = setup(
      {latitude: 50, globe: {config: DEFAULT_GLOBE_CONFIG, enabled: true}},
      liveView,
      1
    );
    click('Reset bearing/pitch');
    expect(updateMap).toHaveBeenCalledWith({bearing: 0, pitch: 0, latitude: 0}, 1);
  }
);

test('globe compass is a no-op when the live camera is already reset', () => {
  const {updateMap} = setup(
    {latitude: 50, bearing: 20, pitch: 30, globe: {config: DEFAULT_GLOBE_CONFIG, enabled: true}},
    {longitude: 20, latitude: 0, zoom: 4, bearing: 0, pitch: 0}
  );
  click('Reset bearing/pitch');
  expect(updateMap).not.toHaveBeenCalled();
});

test.each([{bearing: 20}, {pitch: 30}])(
  'globe compass still clears orientation when already on the equator: %j',
  orientation => {
    const {updateMap} = setup({
      latitude: 0,
      globe: {config: DEFAULT_GLOBE_CONFIG, enabled: true},
      ...orientation
    });
    click('Reset bearing/pitch');
    expect(updateMap).toHaveBeenCalledWith({bearing: 0, pitch: 0, latitude: 0}, 0);
  }
);
