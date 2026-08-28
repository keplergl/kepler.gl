// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Repro for: after map.add-column (kepler-assistant), the geojson layers disappear.
// The add-column command round-trips the dataset through DuckDB, so the _geojson
// column comes back as an Arrow Struct (not plain JS feature objects). This test
// feeds that exact shape through updateDatasetUpdater and inspects the layers.
import {drainTasksForTesting, succeedTaskWithValues} from 'react-palm/tasks';
import {tableFromArrays} from 'apache-arrow';

import {KeplerTable} from '@kepler.gl/table';
import {VisStateActions, addDataToMap} from '@kepler.gl/actions';
import {keplerGlReducerCore} from '@kepler.gl/reducers';
import {processGeojson, arrowSchemaToFields} from '@kepler.gl/processors';

// `addDataToMap` is a combined action -> must run through the core reducer (it
// composes visState + mapState + uiState + mapStyle). visStateReducer alone only
// handles per-reducer actions like UPDATE_VIS_DATA.
const reducer = keplerGlReducerCore;

const mockCreateNewDataEntry = ({info, color, opts, data}) => {
  const table = new KeplerTable({info, color, ...opts});
  table.importData({data});
  return table;
};

const applyCreateTableTasks = (tasks, state) =>
  tasks.reduce((acc, task) => {
    if (!task.label.includes('CREATE_TABLE_TASK')) return acc;
    const tables = task.payload.map(payload => mockCreateNewDataEntry(payload));
    return reducer(acc, succeedTaskWithValues(task, tables));
  }, state);

function applyAction(state, action) {
  let newState = reducer(state, action);
  const tasks = drainTasksForTesting();
  newState = applyCreateTableTasks(tasks, newState);
  return newState;
}

const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74, 40.7],
            [-73.95, 40.7],
            [-73.95, 40.75],
            [-74, 40.75],
            [-74, 40.7]
          ]
        ]
      },
      properties: {NAME: 'NBH0', KIDS2000: 39, RENT2008: 1000}
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.95, 40.7],
            [-73.9, 40.7],
            [-73.9, 40.75],
            [-73.95, 40.75],
            [-73.95, 40.7]
          ]
        ]
      },
      properties: {NAME: 'NBH1', KIDS2000: 20, RENT2008: 950}
    }
  ]
};

describe('updateDataset with DuckDB round-tripped _geojson (Struct)', () => {
  let state;

  beforeAll(() => {
    // 0. initialize the core reducer state (@@INIT) so combined updaters see a full instance state
    let init = reducer(undefined, {type: '@@INIT'});
    // 1. load geojson + add a geojson layer (mirrors the demo-app conversation)
    const {fields, rows} = processGeojson(geojson);
    const info = {id: 'nyc', label: 'nyc.geojson'};
    state = applyAction(init, addDataToMap(
      {
        datasets: [{info, data: {fields, rows}}],
        options: {centerMap: false, readOnly: false},
        config: {
          version: 'v1',
          config: {
            visState: {
              layers: [
                {
                  type: 'geojson',
                  config: {
                    dataId: 'nyc',
                    label: 'NYC neighborhoods',
                    columns: {geojson: '_geojson'},
                    colorField: null,
                    isVisible: true
                  }
                }
              ]
            }
          }
        }
      }
    ));

    expect(Object.keys(state.visState.datasets)).toContain('nyc');
    expect(state.visState.layers.length).toBe(1);
    expect(state.visState.layers[0].isValidToSave()).toBe(true);
    expect(state.visState.layers[0].config.columns.geojson.value).toBe('_geojson');
  });

  test('arrow cols payload (current add-column) breaks geojson layer meta', () => {
    // Documents the bug the fix targets: dispatching the raw arrow columns makes
    // `_geojson` an Arrow Struct, so the layer's meta bounds go null.
    const dataset = state.visState.datasets.nyc;
    const fieldNames = dataset.fields.map(f => f.name);
    const columnData = {};
    for (const name of fieldNames) {
      columnData[name] = Array.from({length: dataset.length}, (_, i) => dataset.getValue(name, i));
    }
    columnData.kidscat = columnData.KIDS2000.map(k => (k < 30 ? 1 : 2));

    const arrowResult = tableFromArrays(columnData);
    const fields = arrowSchemaToFields(arrowResult);
    const cols = [...Array(arrowResult.numCols).keys()].map(i => arrowResult.getChildAt(i));

    const newState = reducer(state, VisStateActions.updateDataset('nyc', {cols, fields, arrowTable: arrowResult}));
    const layer = newState.visState.layers[0];
    layer.updateLayerMeta(newState.visState.datasets.nyc);
    const coords = layer.dataToFeature?.[0]?.geometry?.coordinates;

    // the layer survives (name-based reconciliation) but its geometry is an
    // Arrow Vector the geojson layer cannot consume -> meta.bounds is null
    expect(newState.visState.layers.length).toBe(1);
    expect(Array.isArray(coords)).toBe(false);
    expect(layer.meta?.bounds).toBe(null);
  });

  test('rows payload (the fix) keeps the geojson layer fully rendering', () => {
    // The fix materializes the DuckDB result to plain JS rows (as the command
    // already does for its LLM response) and preserves the original field
    // descriptors for existing columns, so `_geojson` is a plain feature object
    // again and the schema stays a strict superset.
    const dataset = state.visState.datasets.nyc;
    const fieldNames = dataset.fields.map(f => f.name);
    const columnData = {};
    for (const name of fieldNames) {
      columnData[name] = Array.from({length: dataset.length}, (_, i) => dataset.getValue(name, i));
    }
    columnData.kidscat = columnData.KIDS2000.map(k => (k < 30 ? 1 : 2));

    const arrowResult = tableFromArrays(columnData);

    // 1. fields: arrowSchemaToFields, but existing columns keep their ORIGINAL descriptors
    const originalFields = dataset.fields;
    const originalByName = new Map(originalFields.map(f => [f.name, f]));
    const fields = arrowSchemaToFields(arrowResult).map((f, i) => {
      const orig = originalByName.get(f.name);
      return orig
        ? {...f, type: orig.type, analyzerType: orig.analyzerType, format: orig.format || ''}
        : f;
    });

    // 2. rows: plain column-ordered arrays (RowDataContainer format). A bare
    // `toJSON()` leaves nested FixedSizeList coords as Vector wrappers; a deep
    // unwrap (JSON round-trip / the kepler-assistant convertArrowRowToObject)
    // produces real arrays. Column order follows the fields.
    const objects = arrowResult.toArray().map(r => JSON.parse(JSON.stringify(r)));
    const columns = fields.map(f => f.name);
    const rows = objects.map(obj => columns.map(name => obj[name]));

    const newState = reducer(state, VisStateActions.updateDataset('nyc', {rows, fields}));
    const vis = newState.visState;

    // layer survives name-based reconciliation
    expect(vis.layers.length).toBe(1);
    expect(vis.layers[0].config.columns.geojson.value).toBe('_geojson');
    expect(vis.layers[0].isValid).toBe(true);
    expect(vis.layers[0].config.isVisible).toBe(true);

    // schema is a strict superset: _geojson stays geojson-typed, kidscat added
    const geojsonField = vis.datasets.nyc.fields.find(f => f.name === '_geojson');
    expect(geojsonField.type).toBe('geojson');
    expect(vis.datasets.nyc.fields.some(f => f.name === 'kidscat')).toBe(true);

    // values are plain feature objects with real coordinate arrays
    const feature = vis.datasets.nyc.getValue('_geojson', 0);
    expect(Array.isArray(feature.geometry.coordinates)).toBe(true);

    // layer meta still computes (bounds/centroids not nulled by the round-trip)
    const layer = vis.layers[0];
    layer.updateLayerMeta(vis.datasets.nyc);
    expect(layer.meta?.bounds).toEqual([-74, 40.7, -73.9, 40.75]);
    expect(Array.isArray(layer.dataToFeature?.[0]?.geometry?.coordinates)).toBe(true);

    // formatLayerData (what calculateLayerData calls) must not throw
    let threw = false;
    try {
      layer.formatLayerData(vis.datasets, undefined);
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(false);
  });
});

describe('updateDataset with mixed Polygon/MultiPolygon _geojson (the real nyc shape)', () => {
  // nyc.geojson mixes Polygon and MultiPolygon features. Rebuilding the whole
  // table through tableFromArrays infers the shallower Arrow type and nulls the
  // MultiPolygon's deeper coordinate nesting — the v0.0.7 fix reads existing
  // columns straight from the kepler dataset instead, so the payload below is
  // exactly what buildAddColumnPayload dispatches.
  const mixedGeojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-74, 40.7],
              [-73.95, 40.7],
              [-73.95, 40.75],
              [-74, 40.7]
            ]
          ]
        },
        properties: {NAME: 'NBH0', KIDS2000: 39}
      },
      {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [-73.9, 40.7],
                [-73.8, 40.7],
                [-73.8, 40.8],
                [-73.9, 40.7]
              ]
            ]
          ]
        },
        properties: {NAME: 'Jackson Heights', KIDS2000: 20}
      }
    ]
  };

  let state;

  beforeAll(() => {
    let init = reducer(undefined, {type: '@@INIT'});
    const {fields, rows} = processGeojson(mixedGeojson);
    const info = {id: 'nyc', label: 'nyc.geojson'};
    state = applyAction(init, addDataToMap(
      {
        datasets: [{info, data: {fields, rows}}],
        options: {centerMap: false, readOnly: false},
        config: {
          version: 'v1',
          config: {
            visState: {
              layers: [
                {
                  type: 'geojson',
                  config: {
                    dataId: 'nyc',
                    label: 'NYC neighborhoods',
                    columns: {geojson: '_geojson'},
                    colorField: null,
                    isVisible: true
                  }
                }
              ]
            }
          }
        }
      }
    ));
  });

  test('rows payload keeps the MultiPolygon coordinates and the layer renders', () => {
    const dataset = state.visState.datasets.nyc;
    const originalFields = dataset.fields;

    // buildAddColumnPayload: existing columns straight from the kepler dataset,
    // new column appended, fields = original + new.
    const columns = originalFields.map(f => ({
      name: f.name,
      values: Array.from({length: dataset.length}, (_, i) => dataset.getValue(f.name, i))
    }));
    const kidscat = Array.from({length: dataset.length}, (_, i) =>
      dataset.getValue('KIDS2000', i) < 30 ? 1 : 2
    );
    const rows = Array.from({length: dataset.length}, (_, i) => [
      ...columns.map(c => c.values[i]),
      kidscat[i]
    ]);
    const fields = [...originalFields, {name: 'kidscat', type: 'integer', analyzerType: 'INT'}];

    const newState = reducer(state, VisStateActions.updateDataset('nyc', {rows, fields}));
    const vis = newState.visState;

    // the MultiPolygon feature keeps its real coordinates (NOT nulls)
    const mp = vis.datasets.nyc.getValue('_geojson', 1);
    expect(mp.geometry.type).toBe('MultiPolygon');
    expect(Array.isArray(mp.geometry.coordinates)).toBe(true);
    expect(mp.geometry.coordinates[0][0][0]).toEqual([-73.9, 40.7]);

    // the layer survives and its meta still computes
    expect(vis.layers.length).toBe(1);
    const layer = vis.layers[0];
    layer.updateLayerMeta(vis.datasets.nyc);
    expect(layer.meta?.bounds).toEqual([-74, 40.7, -73.8, 40.8]);
    expect(Array.isArray(layer.dataToFeature?.[1]?.geometry?.coordinates)).toBe(true);

    let threw = false;
    try {
      layer.formatLayerData(vis.datasets, undefined);
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(false);
  });
});
