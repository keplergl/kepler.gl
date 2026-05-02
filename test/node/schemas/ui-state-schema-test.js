// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import cloneDeep from 'lodash/cloneDeep';
import SchemaManager from '@kepler.gl/schemas';
import {InitialState} from 'test/helpers/mock-state';

test('#uiStateSchema -> v1 -> save load uiState', t => {
  const initialState = cloneDeep(InitialState);
  const savedState = SchemaManager.getConfigToSave(initialState);

  const uiToSave = savedState.config.uiState;
  const uiLoaded = SchemaManager.parseSavedConfig(savedState).uiState;

  t.deepEqual(
    Object.keys(uiToSave).sort(),
    ['locale', 'mapControls'].sort(),
    'saved uiState should have mapControls and locale'
  );

  t.equal(uiToSave.locale, 'en', 'default locale should be en');
  t.deepEqual(
    uiToSave.mapControls,
    {mapLegend: {active: false, settings: {}}},
    'default mapLegend should be inactive with empty settings'
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
        settings: {position: 'top-left', contentHeight: 200}
      }
    }
  };

  const savedState = SchemaManager.getConfigToSave(initialState);
  const uiToSave = savedState.config.uiState;

  t.equal(uiToSave.locale, 'es', 'locale should be saved as es');
  t.equal(uiToSave.mapControls.mapLegend.active, true, 'mapLegend active should be saved as true');
  t.deepEqual(
    uiToSave.mapControls.mapLegend.settings,
    {position: 'top-left', contentHeight: 200},
    'mapLegend settings should be saved'
  );

  const uiLoaded = SchemaManager.parseSavedConfig(savedState).uiState;
  t.deepEqual(uiLoaded, uiToSave, 'loaded uiState should match saved uiState');

  t.end();
});
