// Copyright (c) 2019 Uber Technologies, Inc.
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

import {LayerManager} from 'deck.gl';
import {gl} from '@deck.gl/test-utils';
import sinon from 'sinon';
import {console as Console} from 'global/window';
import cloneDeep from 'lodash.clonedeep';

import {INITIAL_MAP_STATE} from 'reducers/map-state-updaters';
import {INITIAL_VIS_STATE} from 'reducers/vis-state-updaters';
import * as VisStateActions from 'actions/vis-state-actions';

import {onWebGLInitialized} from 'utils/gl-utils';
import {colorMaker, layerColors} from 'layers/base-layer';
import {getGpuFilterProps} from 'utils/gpu-filter-utils';
import {validateLayerWithData} from 'reducers/vis-state-merger';
import {LayerClasses} from 'layers';
import {processCsvData, processGeojson} from 'processors/data-processor';
import {applyActions} from 'test/helpers/mock-state';
import {visStateReducer} from 'reducers';
import csvData, {
  dataWithNulls as csvDataWithNulls,
  wktCsv
} from 'test/fixtures/test-csv-data';
import {geojsonData} from 'test/fixtures/geojson';
import {logStep} from '../../scripts/log';

// Initialize gl once
onWebGLInitialized(gl);

export function testCreateLayer(t, LayerClass, props = {}) {
  let layer;

  t.doesNotThrow(() => {
    layer = new LayerClass(props);
    t.ok(layer instanceof LayerClass, `${layer.type} layer created`);
  }, `creating layer should not fail`);

  return layer;
}

export function testCreateLayerFromConfig(t, datasets, layerConfig = {}) {
  let layer;

  t.doesNotThrow(() => {
    const {dataId} = layerConfig.config;
    layer = validateLayerWithData(datasets[dataId], layerConfig, LayerClasses);
    t.ok(
      layer instanceof LayerClasses[layerConfig.type],
      `${layerConfig.type} layer created`
    );
    layer.updateLayerDomain(datasets);
  }, `create a ${layerConfig.type} layer from config should not fail`);

  return layer;
}

export function testFormatLayerData(t, layer, datasets) {
  let result;

  t.doesNotThrow(() => {
    result = layer.formatLayerData(datasets);
    t.ok(result, 'has layer data');
    t.ok(layer, 'has updated layer');
  }, `format ${layer.type} layerData should not fail`);

  return result;
}

export function testCreateCases(t, LayerClass, testCases) {
  testCases.forEach(tc => {
    const layer = testCreateLayer(t, LayerClass, tc.props);
    if (layer && tc.test) {
      tc.test(layer);
    }
  });
}

export function testUpdateLayer(t, layer, updateMethod, updateArgs) {
  let result;

  t.doesNotThrow(() => {
    result = layer[updateMethod](...updateArgs);
    t.ok(layer, `layer ${updateMethod} called`);
  }, 'update layer should not fail');

  return {result, layer};
}

export function testFormatLayerDataCases(t, LayerClass, testCases) {
  testCases.forEach(tc => {
    logStep(`---> Test Format Layer Data ${tc.name}`);
    const layer = testCreateLayerFromConfig(t, tc.datasets, tc.layer);
    let updatedLayer = layer;

    // if provided updates
    if (layer && tc.updates) {
      const applyUpdates = Array.isArray(tc.updates)
        ? tc.updates
        : [tc.updates];

      // apply 1 or multiple updates
      applyUpdates.forEach(update => {
        const updated = testUpdateLayer(
          t,
          updatedLayer,
          update.method,
          update.args
        );
        updatedLayer = updated.layer;
      });
    }

    if (updatedLayer) {
      const result = testFormatLayerData(t, updatedLayer, tc.datasets);
      t.ok(result, `${tc.name} Should have format layer data result`);
      if (result && tc.assert) {
        tc.assert({layerData: result, layer: updatedLayer});
      }
    }
  });
}

export function testRenderLayerCases(t, LayerClass, testCases) {
  testCases.forEach(tc => {
    logStep(`---> Test Render Layer ${tc.name}`);

    const layer = testCreateLayerFromConfig(t, tc.datasets, tc.layer);
    let result;
    let deckLayers;

    if (layer) {
      result = testFormatLayerData(t, layer, tc.datasets);
    }
    if (result) {
      t.doesNotThrow(() => {
        deckLayers = layer.renderLayer({
          data: result,
          idx: 0,
          layerInteraction: {},
          mapState: INITIAL_MAP_STATE,
          gpuFilter: getGpuFilterProps([], 'test_data_idtest'),
          interactionConfig: INITIAL_VIS_STATE.interactionConfig,
          ...(tc.renderArgs || {})
        });
      }, `${layer.type}.renderLayer should not fail`);
    }

    if (deckLayers) {
      const initialDeckLayers = testInitializeDeckLayer(
        t,
        layer.type,
        deckLayers
      );

      if (tc.assert) {
        tc.assert(initialDeckLayers, layer);
      }
    }
  });
}

export function testInitializeDeckLayer(t, layerType, deckLayers) {
  const layerManager = new LayerManager(gl);
  const spy = sinon.spy(Console, 'error');

  t.doesNotThrow(
    () =>
      layerManager.setLayers(
        Array.isArray(deckLayers) ? deckLayers : [deckLayers]
      ),
    `initialization of ${layerType} layer render should not fail`
  );

  // listen on console.error in editShader, fail the test if any error is logged
  t.deepEqual(
    spy.args,
    [],
    'should not call console.error during layer initialization'
  );

  spy.restore();
  return layerManager.layers;
}

/**
 * Predict which color maker value would be next, allow skip couple
 * Should be used right before calling function to be tested
 * @param {Number} skip
 */
export function getNextColorMakerValue(num = 1) {
  const results = [];
  const colorNow = colorMaker.next().value;
  const index = layerColors.findIndex(c => c === colorNow);

  for (let n = 0; n < num; n++) {
    const next = index + n + 1;
    const nextIndex =
      next < layerColors.length ? next : next - layerColors.length;
    results.push(layerColors[nextIndex]);
  }

  return results;
}

function addFilterToData(data, id, filters) {
  const filterActions = filters.reduce(
    (accu, f, i) => [
      ...accu,
      // add filter
      {action: VisStateActions.addFilter, payload: [id]},
      // set filter name
      {action: VisStateActions.setFilter, payload: [i, 'name', f.name]},
      // set filter value
      {
        action: VisStateActions.setFilter,
        payload: [i, 'value', f.value]
      }
    ],
    []
  );

  return applyActions(visStateReducer, INITIAL_VIS_STATE, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        {
          info: {id},
          data
        }
      ]
    },
    ...filterActions
  ]);
}

export const {rows, fields} = processCsvData(csvData);
export const {rows: rowsWithNull, fields: fieldsWithNull} = processCsvData(
  csvDataWithNulls
);
export const dataId = '0dj3h';
const gpuTimeFilter = [
  {name: 'gps_data.utc_timestamp', value: [1474071095000, 1474071608000]}
];

export const preparedDataset = addFilterToData(
  {fields, rows},
  dataId,
  gpuTimeFilter
).datasets[dataId];
export const preparedDatasetWithNull = addFilterToData(
  {rows: rowsWithNull, fields: fieldsWithNull},
  dataId,
  gpuTimeFilter
).datasets[dataId];

export const {rows: geoCsvRows, fields: geoCsvFields} = processCsvData(wktCsv);
export const {rows: geoJsonRows, fields: geoJsonFields} = processGeojson(cloneDeep(geojsonData));

export const preparedGeoDataset = addFilterToData(
  {fields: geoCsvFields, rows: geoCsvRows},
  dataId,
  [
    {name: 'm_rate', value: [7, 10]}
  ]
).datasets[dataId];

export const prepareGeojsonDataset = addFilterToData(
  {fields: geoJsonFields, rows: geoJsonRows},
  dataId,
  [
    {name: 'TRIPS', value: [4, 12]}
  ]
).datasets[dataId];
