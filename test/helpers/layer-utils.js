// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable enzyme-deprecation/no-mount */
import {LayerManager, MapView} from '@deck.gl/core';
import React from 'react';
import {gl} from '@deck.gl/test-utils';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {console as Console} from 'global/window';
import cloneDeep from 'lodash.clonedeep';

import {
  INITIAL_MAP_STATE,
  INITIAL_VIS_STATE,
  renderDeckGlLayer,
  validateLayerWithData,
  mapStateReducer as mapState,
  visStateReducer,
  keplerGlReducerCore
} from '@kepler.gl/reducers';
import {getGpuFilterProps} from '@kepler.gl/table';
import {VisStateActions, addDataToMap} from '@kepler.gl/actions';

import {colorMaker, layerColors, LayerClasses as KeplerLayerClasses} from '@kepler.gl/layers';
import {processCsvData, processGeojson} from '@kepler.gl/processors';
import {applyActions, InitialState} from '../helpers/mock-state';
// Fixtures
import csvData, {wktCsv} from '../fixtures/test-csv-data';
import testLayerData, {bounds, fieldDomain, iconGeometry} from '../fixtures/test-layer-data';
import {geojsonData} from '../fixtures/geojson';
import tripGeoJson from '../fixtures/trip-geojson';
import {IntlWrapper} from './component-utils';

import {logStep} from '../../scripts/log';

export const dataId = '0dj3h';
export const timeFilter = [{name: 'utc_timestamp', value: [1474071095000, 1474071608000]}];

export function testCreateLayer(t, LayerClass, props = {}) {
  let layer;

  t.doesNotThrow(() => {
    layer = new LayerClass(props);
    t.ok(layer instanceof LayerClass, `${layer.type} layer created`);
  }, `creating layer should not fail`);

  return layer;
}

export function testCreateLayerFromConfig(t, tc, LayerClasses = KeplerLayerClasses) {
  const {datasets, layer: layerConfig = {}} = tc;
  let layer;

  t.doesNotThrow(() => {
    layer = validateLayerWithData(datasets[layerConfig.config.dataId], layerConfig, LayerClasses);
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
        if (layer.layerInfoModal.template) {
          t.doesNotThrow(() => {
            mount(
              <IntlWrapper>
                <layer.layerInfoModal.template />
              </IntlWrapper>
            );
          }, 'layer info modal should be mountable');
        } else if (Object.keys(layer.layerInfoModal).length) {
          // layerInfoModal is based on columnMode
          Object.keys(layer.layerInfoModal).forEach(mode => {
            const Template = layer.layerInfoModal[mode].template;
            t.doesNotThrow(() => {
              mount(
                <IntlWrapper>
                  <Template />
                </IntlWrapper>
              );
            }, 'layer info modal should be mountable');
          });
        }
      }
    }
    if (layer && tc.test) {
      tc.test(layer);
    }
  });
}

export function testFormatLayerDataCases(t, LayerClass, testCases) {
  testCases.forEach(tc => {
    logStep(`---> Test Format Layer Data ${tc.name}`);

    // use provided LayerClass if present, otherwise default to KeplerLayerClasses
    const layer = LayerClass
      ? testCreateLayerFromConfig(t, tc, {[tc.layer.type]: LayerClass})
      : testCreateLayerFromConfig(t, tc);
    let updatedLayer = layer;

    // if provided updates
    if (layer && tc.updates) {
      const applyUpdates = Array.isArray(tc.updates) ? tc.updates : [tc.updates];

      // apply 1 or multiple updates
      applyUpdates.forEach(update => {
        const updated = testLayerUpdate(t, updatedLayer, update.method, update.args);
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

    // use provided LayerClass if present, otherwise default to KeplerLayerClasses
    const layer = LayerClass
      ? testCreateLayerFromConfig(t, tc, {[tc.layer.type]: LayerClass})
      : testCreateLayerFromConfig(t, tc);

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
            getGpuFilterProps(
              [],
              layer.config.dataId,
              tc.datasets[layer.config.dataId].fields,
              layer.gpuFilter
            ),
          interactionConfig: INITIAL_VIS_STATE.interactionConfig,
          visible: true,
          layerCallbacks: {},
          ...(tc.renderArgs || {})
        });

        if (tc.renderArgs && tc.renderArgs.viewport) {
          viewport = {...viewport, ...tc.renderArgs.viewport};
        }
      }, `${layer.type}.renderLayer should not fail`);
    }

    if (deckLayers) {
      const initialDeckLayers = testRenderDeckLayer(t, layer.type, deckLayers, {viewport});

      if (tc.assert) {
        tc.assert(initialDeckLayers, layer, result);
      }
    }
  });
}

export function testRenderDeckLayer(t, layerType, deckLayers, {viewport, layerManager}) {
  let deckLayerManager = layerManager;
  if (!layerManager) {
    const testViewport = new MapView().makeViewport({
      width: viewport.width,
      height: viewport.height,
      viewState: viewport
    });
    deckLayerManager = new LayerManager(gl, {viewport: testViewport});
  }

  const spy = sinon.spy(Console, 'error');

  t.doesNotThrow(
    () => deckLayerManager.setLayers(Array.isArray(deckLayers) ? deckLayers : [deckLayers]),
    `initialization of ${layerType} layer render should not fail`
  );

  // listen on console.error in editShader, fail the test if any error is logged
  t.deepEqual(spy.args, [], 'should not call console.error during layer initialization');

  spy.restore();
  return deckLayerManager.getLayers();
}

export function testLayerUpdate(t, layer, updateMethod, updateArgs) {
  let result;
  t.doesNotThrow(() => {
    result = layer[updateMethod](...updateArgs);
    t.ok(layer, `layer ${updateMethod} called`);
  }, 'update layer should not fail');

  return {result, layer};
}

function testAttributeUpdate(t, attributeValues, layer, shouldUpdate) {
  Object.keys(attributeValues).forEach(key => {
    const newValue = layer.state.attributeManager.attributes[key].value;
    if (shouldUpdate[key]) {
      t.notDeepEqual(attributeValues[key], newValue, `attribute${key} should update`);
    } else {
      t.deepEqual(attributeValues[key], newValue, `attribute${key} should not update`);
    }

    attributeValues[key] = [...newValue];
  });
}

export function renderLayerByState(t, state, layerManager) {
  const layerCallbacks = () => {};
  const layer = state.visState.layers[0];
  const data = state.visState.layerData[0];

  let layerOverlay;
  t.doesNotThrow(() => {
    layerOverlay = renderDeckGlLayer(
      {
        ...state.visState,
        layer,
        data,
        mapState: state.mapState
      },
      layerCallbacks,
      0
    );
  }, `${layer.type}.renderLayer should not fail`);
  testRenderDeckLayer(t, layer.type, layerOverlay, {layerManager});

  return {
    layerManager,
    deckGlLayers: layerManager.getLayers()
  };
}

export function testUpdateLayer(t, {layerConfig, shouldUpdate}) {
  const initialState = cloneDeep(InitialState);
  const filter0 = {
    dataId,
    id: 'me',
    type: 'timeRange',
    ...timeFilter[0]
  };
  const filter1 = {
    dataId,
    id: 'me2',
    type: 'range',
    name: 'trip_distance',
    value: [3, 8.33]
  };

  const stateWithLayer = keplerGlReducerCore(
    initialState,
    addDataToMap({
      datasets: {
        info: {id: dataId},
        data: processCsvData(testLayerData)
      },
      config: {
        version: 'v1',
        config: {
          visState: {
            layers: [layerConfig],
            filters: [filter0, filter1]
          }
        }
      }
    })
  );

  const layer = stateWithLayer.visState.layers[0];
  t.ok(layer, 'should create layer');

  const testViewport = new MapView().makeViewport({
    width: mapState.width,
    height: mapState.height,
    viewState: mapState
  });

  const layerManager = new LayerManager(gl, {viewport: testViewport});

  let rendered = renderLayerByState(t, stateWithLayer, layerManager);
  const attributeValues = Object.keys(
    rendered.deckGlLayers[0].state.attributeManager.attributes
  ).reduce(
    (accu, key) => ({
      ...accu,
      [key]: [...rendered.deckGlLayers[0].state.attributeManager.attributes[key].value]
    }),
    {}
  );

  // update Gpu Filter
  let stateWithFilterUpdate = keplerGlReducerCore(
    stateWithLayer,
    VisStateActions.setFilter(0, 'value', [filter0.value[0] + 1, filter0.value[1]], 0)
  );

  rendered = renderLayerByState(t, stateWithFilterUpdate, rendered.layerManager);
  logStep(`---> test: set GPU filter value`);
  testAttributeUpdate(t, attributeValues, rendered.deckGlLayers[0], shouldUpdate.gpuFilter);

  // update dynamic domain gpu Filter
  stateWithFilterUpdate = keplerGlReducerCore(
    stateWithFilterUpdate,
    VisStateActions.setFilter(1, 'value', [filter1.value[0] + 0.5, filter1.value[1]], 0)
  );
  rendered = renderLayerByState(t, stateWithFilterUpdate, rendered.layerManager);
  logStep(`---> test: set dynamic domain GPU filter value`);
  testAttributeUpdate(t, attributeValues, rendered.deckGlLayers[0], shouldUpdate.dynamicGpuFilter);
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

export {
  dataId as tripDataId,
  fields as tripFields,
  rows as tripRows
} from '../fixtures/test-trip-data';

/*
 * point, arc, hex, csv dataset from with gpu time filter
 */

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
