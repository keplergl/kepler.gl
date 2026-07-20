// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'lodash/cloneDeep';
import SchemaManager from '@kepler.gl/schemas';
import {DEFAULT_GLOBE_CONFIG, MapViewMode} from '@kepler.gl/constants';
import {InitialState} from 'test/helpers/mock-state';

test('#mapStateSchema -> v1 -> save load mapState', t => {
  const initialState = cloneDeep(InitialState);
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const msToSave = savedState.config.mapState;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapState;

  t.deepEqual(
    Object.keys(msToSave),
    [
      'bearing',
      'dragRotate',
      'latitude',
      'longitude',
      'pitch',
      'zoom',
      'isSplit',
      'isViewportSynced',
      'isZoomLocked',
      'splitMapViewports',
      'maxPitch',
      'mapSplitMode',
      'swipeComparePercentage',
      'mapViewMode',
      'globe'
    ],
    'mapState should have all entries'
  );

  const expected = {
    pitch: 0,
    bearing: 0,
    latitude: 37.75043,
    longitude: -122.34679,
    zoom: 9,
    dragRotate: false,
    isSplit: false,
    isViewportSynced: true,
    isZoomLocked: false,
    splitMapViewports: [],
    maxPitch: undefined,
    mapSplitMode: 'SINGLE_MAP',
    swipeComparePercentage: 50,
    mapViewMode: MapViewMode.MODE_2D,
    globe: {
      enabled: false,
      config: DEFAULT_GLOBE_CONFIG
    }
  };

  t.deepEqual(msToSave, expected, 'save mapState should be current');
  t.deepEqual(msLoaded, expected, 'load mapState should be current');

  t.end();
});

test('#mapStateSchema -> v1 -> save load globe-enabled mapState', t => {
  const initialState = cloneDeep(InitialState);
  // Enable globe with a non-default config to verify the full round-trip.
  initialState.mapState.mapViewMode = MapViewMode.MODE_GLOBE;
  initialState.mapState.globe = {
    enabled: true,
    config: {
      ...DEFAULT_GLOBE_CONFIG,
      atmosphere: false,
      terminator: false,
      labels: true,
      basemap: false,
      waterColor: [1, 2, 3],
      backgroundColor: [10, 20, 30]
    }
  };

  const savedState = SchemaManager.getConfigToSave(initialState);
  const msToSave = savedState.config.mapState;
  const msLoaded = SchemaManager.parseSavedConfig(savedState).mapState;

  t.equal(msToSave.mapViewMode, MapViewMode.MODE_GLOBE, 'saved mapViewMode should be globe');
  t.deepEqual(
    msToSave.globe,
    initialState.mapState.globe,
    'saved globe config should match non-default config'
  );
  t.equal(msLoaded.mapViewMode, MapViewMode.MODE_GLOBE, 'loaded mapViewMode should be globe');
  t.deepEqual(
    msLoaded.globe,
    initialState.mapState.globe,
    'loaded globe config should round-trip non-default config'
  );

  t.end();
});
