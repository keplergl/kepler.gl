// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import SchemaManager from '@kepler.gl/schemas';
import {InitialState} from 'test/helpers/mock-state';

test('#uiStateSchema -> v1 -> save load uiState', t => {
  const initialState = cloneDeep(InitialState);
  const savedState = SchemaManager.getConfigToSave(initialState);

  const uiToSave = savedState.config.uiState;
  const uiLoaded = SchemaManager.parseSavedConfig(savedState).uiState;

  t.deepEqual(
    Object.keys(uiToSave).sort(),
    ['locale', 'mapControls', 'theme'].sort(),
    'saved uiState should have mapControls, locale and theme'
  );

  t.equal(uiToSave.locale, 'en', 'default locale should be en');
  t.equal(uiToSave.theme, 'dark', 'default theme should be dark');
  t.deepEqual(
    uiToSave.mapControls,
    {
      mapLegend: {active: false},
      chart: {active: false},
      mapInfo: {active: true, show: true},
      cameraBookmarks: {
        show: false,
        settings: initialState.uiState.mapControls.cameraBookmarks.settings
      }
    },
    'default mapLegend and chart should be inactive and map info open'
  );

  t.deepEqual(uiLoaded, uiToSave, 'loaded uiState should match saved uiState');

  t.end();
});

test('#uiStateSchema -> v1 -> save load uiState with mapLegend active and locale', t => {
  const initialState = cloneDeep(InitialState);

  initialState.uiState = {
    ...initialState.uiState,
    locale: 'es',
    mapControls: {
      ...initialState.uiState.mapControls,
      mapLegend: {
        ...initialState.uiState.mapControls.mapLegend,
        active: true,
        settings: {
          position: {x: 10, y: 30, anchorX: 'right', anchorY: 'bottom'},
          contentHeight: 200
        }
      }
    }
  };

  const savedState = SchemaManager.getConfigToSave(initialState);
  const uiToSave = savedState.config.uiState;

  t.equal(uiToSave.locale, 'es', 'locale should be saved as es');
  t.equal(uiToSave.mapControls.mapLegend.active, true, 'mapLegend active should be saved as true');
  t.deepEqual(
    uiToSave.mapControls.mapLegend.settings,
    {position: {x: 10, y: 30, anchorX: 'right', anchorY: 'bottom'}, contentHeight: 200},
    'mapLegend settings should be saved'
  );

  const uiLoaded = SchemaManager.parseSavedConfig(savedState).uiState;
  t.deepEqual(uiLoaded, uiToSave, 'loaded uiState should match saved uiState');

  t.end();
});

test('#uiStateSchema -> bookmark preferences persist without transient control state', t => {
  const settings = {
    position: {x: 42, y: 64, anchorX: 'left', anchorY: 'bottom'},
    contentHeight: 80
  };
  for (const show of [true, false]) {
    const state = cloneDeep(InitialState);
    state.uiState.mapControls.cameraBookmarks = {
      ...state.uiState.mapControls.cameraBookmarks,
      show,
      activeMapIndex: 1,
      disableClose: true,
      settings: {...settings, temporary: 'not saved'}
    };
    const saved = SchemaManager.getConfigToSave(state);
    t.deepEqual(
      saved.config.uiState.mapControls.cameraBookmarks,
      {show, settings},
      `${show}: saves only visibility and layout`
    );
    for (const version of ['v0', 'v1']) {
      const parsed = SchemaManager.parseSavedConfig({
        version,
        config: {uiState: saved.config.uiState}
      });
      t.deepEqual(
        parsed.uiState.mapControls.cameraBookmarks,
        {show, settings},
        `${version}: reads preferences`
      );
    }
  }
  for (const version of ['v0', 'v1']) {
    const parsed = SchemaManager.parseSavedConfig({version, config: {uiState: {mapControls: {}}}});
    t.notOk(
      'cameraBookmarks' in parsed.uiState.mapControls,
      `${version}: missing legacy preference stays absent`
    );
  }
  t.end();
});
