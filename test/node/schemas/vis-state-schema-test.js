import test from 'tape';

import {cmpFilters, cmpSavedLayers} from 'test/helpers/comparison-utils';
import SchemaManager from 'schemas';

import {StateWFilesFiltersLayerColor,
  expectedSavedLayer0,
  expectedLoadedLayer0,
  expectedSavedLayer1,
  expectedLoadedLayer1,
  expectedSavedLayer2,
  expectedLoadedLayer2
} from 'test/helpers/mock-state';

test('#visStateSchema -> v1 -> save layers', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();

  // save state
  const vsToSave = SchemaManager.getConfigToSave(initialState).config.visState;

  t.deepEqual(Object.keys(vsToSave),
    ['filters', 'layers', 'interactionConfig', 'layerBlending', 'splitMaps'],
    'visState should have all 5 entries');

  const exptectedSavedLayers = [
    expectedSavedLayer0,
    expectedSavedLayer1,
    expectedSavedLayer2
  ];

  const layersToSave = vsToSave.layers;

  cmpSavedLayers(t, exptectedSavedLayers, layersToSave);
  t.end();
});

test('#visStateSchema -> v1 -> load layers', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();

  // save state
  const savedState = SchemaManager.getConfigToSave(initialState);
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;

  t.deepEqual(Object.keys(vsLoaded),
    ['filters', 'layers', 'interactionConfig', 'layerBlending', 'splitMaps'],
    'visState should have all 5 entries');

  const loadedLayers = vsLoaded.layers;

  const expectedLoadedLayers = [
    expectedLoadedLayer0,
    expectedLoadedLayer1,
    expectedLoadedLayer2
  ];

  cmpSavedLayers(t, expectedLoadedLayers, loadedLayers, {id: true});
  t.end();
});

test('#visStateSchema -> v1 -> save load filters', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const vsToSave = savedState.config.visState;
  const vsLoaded = SchemaManager.parseSavedConfig(savedState).visState;
  const loadedFilters = vsLoaded.filters;

  // test saved filters
  const filtersToSave = vsToSave.filters;

  const expectedSavedFilters = [{
    dataId: '190vdll3di',
    id: 'hjpn8frza',
    name: 'time',
    type: 'timeRange',
    value: [1474606800000, 1474617600000],
    enlarged: false,
    plotType: 'histogram',
    yAxis: null
  }, {
    dataId: 'ieukmgne',
    id: 'vpk2466o',
    name: 'RATE',
    type: 'multiSelect',
    value: ['a'],
    enlarged: false,
    plotType: 'histogram',
    yAxis: null
  }];

  cmpFilters(t, expectedSavedFilters, filtersToSave);
  cmpFilters(t, expectedSavedFilters, loadedFilters);

  t.end();
});

test('#visStateSchema -> v1 -> save load interaction', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const interactionToSave = savedState.config.visState.interactionConfig;
  const interactionLoaded = SchemaManager.parseSavedConfig(savedState).visState.interactionConfig;

  const expectedSaved = {
    tooltip: {
      enabled: true,
      fieldsToShow: {
        '190vdll3di': [
          'gps_data.utc_timestamp',
          'gps_data.types',
          'epoch',
          'has_result',
          'id'
        ],
        ieukmgne: [
          'OBJECTID', 'ZIP_CODE', 'ID', 'TRIPS', 'RATE'
        ]}},
    brush: {
      enabled: false,
      size: 0.5
    }
  };

  t.deepEqual(interactionToSave, expectedSaved);
  t.deepEqual(interactionLoaded, expectedSaved);

  t.end();
});

test('#visStateSchema -> v1 -> save load layerBlending', t => {
  const initialState = StateWFilesFiltersLayerColor.toJS();
  const savedState = SchemaManager.getConfigToSave(initialState);

  // save state
  const layerBlendingToSave = savedState.config.visState.layerBlending;
  const layerBlendingLoaded = SchemaManager.parseSavedConfig(savedState).visState.layerBlending;

  const expectedSaved = 'normal';

  t.deepEqual(layerBlendingToSave, expectedSaved);
  t.deepEqual(layerBlendingLoaded, expectedSaved);

  t.end();
});
