// Copyright (c) 2020 Uber Technologies, Inc.
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

import {LayerManager, MapView} from '@deck.gl/core';
import React from 'react';
import {gl} from '@deck.gl/test-utils';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {console as Console} from 'global/window';
import cloneDeep from 'lodash.clonedeep';

import {INITIAL_MAP_STATE} from 'reducers/map-state-updaters';
import {INITIAL_VIS_STATE} from 'reducers/vis-state-updaters';
import * as VisStateActions from 'actions/vis-state-actions';

import {colorMaker, layerColors} from 'layers/base-layer';
import {getGpuFilterProps} from 'utils/gpu-filter-utils';
import {validateLayerWithData} from 'reducers/vis-state-merger';
import {LayerClasses} from 'layers';
import {processCsvData, processGeojson} from 'processors/data-processor';
import {applyActions} from 'test/helpers/mock-state';
import {visStateReducer} from 'reducers';
// Fixtures
import csvData, {wktCsv} from 'test/fixtures/test-csv-data';
import testLayerData, {bounds, fieldDomain, iconGeometry} from 'test/fixtures/test-layer-data';
import {geojsonData} from 'test/fixtures/geojson';
import tripGeoJson from 'test/fixtures/trip-geojson';

import {logStep} from '../../scripts/log';
import {IntlWrapper} from './component-utils';

export function testCreateLayer(t, LayerClass, props = {}) {
  let layer;

  t.doesNotThrow(() => {
    layer = new LayerClass(props);
    t.ok(layer instanceof LayerClass, `${layer.type} layer created`);
  }, `creating layer should not fail`);

  return layer;
}

export function testCreateLayerFromConfig(t, tc) {
  const {datasets, layer: layerConfig = {}} = tc;
  let layer;

  t.doesNotThrow(() => {
    const {dataId} = layerConfig.config;
    layer = validateLayerWithData(datasets[dataId], layerConfig, LayerClasses);
    t.ok(layer instanceof LayerClasses[layerConfig.type], `${layerConfig.type} layer created`);
    layer.updateLayerDomain(datasets);
    if (tc.afterLayerInitialized) {
      tc.afterLayerInitialized(layer);
    }
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
    if (layer) {
      t.ok(typeof layer.type === 'string', 'layer type should be string');
      t.ok(typeof layer.id === 'string', 'layer id should be string');
      t.doesNotThrow(() => {
        mount(<layer.layerIcon />);
      }, 'layer icon should be mountable');

      if (layer.layerInfoModal) {
        t.doesNotThrow(() => {
          mount(
            <IntlWrapper>
              <layer.layerInfoModal.template />
            </IntlWrapper>
          );
        }, 'layer info modal should be mountable');
      }
    }
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
    const layer = testCreateLayerFromConfig(t, tc);
    let updatedLayer = layer;

    // if provided updates
    if (layer && tc.updates) {
      const applyUpdates = Array.isArray(tc.updates) ? tc.updates : [tc.updates];

      // apply 1 or multiple updates
      applyUpdates.forEach(update => {
        const updated = testUpdateLayer(t, updatedLayer, update.method, update.args);
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

    const layer = testCreateLayerFromConfig(t, tc);
    let result;
    let deckLayers;
    let viewport = INITIAL_MAP_STATE;

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
          gpuFilter:
            tc.datasets[layer.config.dataId].gpuFilter ||
            getGpuFilterProps([], layer.config.dataId, tc.datasets[layer.config.dataId].fields),
          interactionConfig: INITIAL_VIS_STATE.interactionConfig,
          ...(tc.renderArgs || {})
        });

        if (tc.renderArgs && tc.renderArgs.viewport) {
          viewport = {...viewport, ...tc.renderArgs.viewport};
        }
      }, `${layer.type}.renderLayer should not fail`);
    }

    if (deckLayers) {
      const initialDeckLayers = testInitializeDeckLayer(t, layer.type, deckLayers, {viewport});

      if (tc.assert) {
        tc.assert(initialDeckLayers, layer, result);
      }
    }
  });
}

export function testInitializeDeckLayer(t, layerType, deckLayers, {viewport}) {
  const testViewport = new MapView().makeViewport({
    width: viewport.width,
    height: viewport.height,
    viewState: viewport
  });

  const layerManager = new LayerManager(gl, {viewport: testViewport});
  const spy = sinon.spy(Console, 'error');

  t.doesNotThrow(
    () => layerManager.setLayers(Array.isArray(deckLayers) ? deckLayers : [deckLayers]),
    `initialization of ${layerType} layer render should not fail`
  );

  // listen on console.error in editShader, fail the test if any error is logged
  t.deepEqual(spy.args, [], 'should not call console.error during layer initialization');

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
    const nextIndex = next < layerColors.length ? next : next - layerColors.length;
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
export const {rows: testRows, fields: testFields} = processCsvData(testLayerData);

export const dataId = '0dj3h';
export {
  dataId as tripDataId,
  fields as tripFields,
  rows as tripRows
} from 'test/fixtures/test-trip-data';

/*
 * point, arc, hex, csv dataset from with gpu time filter
 */
const timeFilter = [{name: 'utc_timestamp', value: [1474071095000, 1474071608000]}];

const stateWithTimeFilter = addFilterToData(
  {fields: testFields, rows: testRows},
  dataId,
  timeFilter
);

export const preparedDataset = stateWithTimeFilter.datasets[dataId];
export const gpuTimeFilter = stateWithTimeFilter.filters[0];
export const preparedFilterDomain0 = gpuTimeFilter.domain[0];

export const pointLayerMeta = {
  bounds: bounds['lat-lng']
};
export const arcLayerMeta = {
  bounds: bounds.arc
};
export const hexagonIdLayerMeta = {
  bounds: bounds.h3
};
export {iconGeometry, fieldDomain};

/*
 * Geo csv dataset from wkt with gpu filter
 */
export const {rows: geoCsvRows, fields: geoCsvFields} = processCsvData(wktCsv);

const stateWithGeoFilter = addFilterToData({fields: geoCsvFields, rows: geoCsvRows}, dataId, [
  {name: 'm_rate', value: [7, 10]}
]);

export const preparedGeoDataset = stateWithGeoFilter.datasets[dataId];
export const preparedGeoDatasetFilter = stateWithGeoFilter.filters[0];

/*
 * GeoJson dataset with gpu filter
 */
export const {rows: geoJsonRows, fields: geoJsonFields} = processGeojson(cloneDeep(geojsonData));

const stateWithGeojsonFilter = addFilterToData({fields: geoJsonFields, rows: geoJsonRows}, dataId, [
  {name: 'TRIPS', value: [4, 12]}
]);

export const prepareGeojsonDataset = stateWithGeojsonFilter.datasets[dataId];
export const prepareGeojsonDatasetFilter = stateWithGeojsonFilter.filters[0];
export const geoFilterDomain0 = preparedGeoDatasetFilter.domain[0];
export const geojsonFilterDomain0 = prepareGeojsonDatasetFilter.domain[0];

/*
 * trip GeoJson dataset with gpu filter
 */
export const {rows: tripGeoRows, fields: tripGeoFields} = processGeojson(cloneDeep(tripGeoJson));

const stateWithTripGeojsonFilter = addFilterToData(
  {fields: tripGeoFields, rows: tripGeoRows},
  dataId,
  [{name: 'value', value: [4, 12]}]
);

export const prepareTripGeoDataset = stateWithTripGeojsonFilter.datasets[dataId];
export const prepareTripGeoDatasetFilter = stateWithTripGeojsonFilter.filters[0];
export const valueFilterDomain0 = prepareTripGeoDatasetFilter.domain[0];
export const {animationConfig} = stateWithTripGeojsonFilter;
