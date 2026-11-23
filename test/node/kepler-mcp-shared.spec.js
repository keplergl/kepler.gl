/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createStore, combineReducers, applyMiddleware} from 'redux';
import {keplerGlReducer} from '@kepler.gl/reducers';
import {taskMiddleware} from '@kepler.gl/tasks';
import {addDataToMap, registerEntry, wrapTo} from '@kepler.gl/actions';
import {KeplerTable} from '@kepler.gl/table';
import {getOpenProjectCommand} from '../../src/mcp/src/commands/project-commands';
import {buildKeplerContext, formatResult} from '../../examples/demo-app/src/kepler-mcp-shared';

jest.mock('@kepler.gl/mcp', () => ({}));
jest.mock('@kepler.gl/mcp/skill/kepler/SKILL.md', () => 'Map skill', {virtual: true});

describe('demo map context', () => {
  it('shares one live context across surfaces for the same Redux store', () => {
    let state = {demo: {keplerGl: {map: {visState: {datasets: {}}}}}};
    const store = {getState: () => state};
    const bridgeContext = buildKeplerContext(store);
    expect(buildKeplerContext(store)).toBe(bridgeContext);
    state = {demo: {keplerGl: {map: {visState: {datasets: {newData: {id: 'newData'}}}}}}};
    expect(bridgeContext.getVisState()).toBe(state.demo.keplerGl.map.visState);
    expect(buildKeplerContext({getState: () => state})).not.toBe(bridgeContext);
  });

  it('opens a project only in the map instance and waits for its dataset tasks', async () => {
    const store = createStore(
      combineReducers({
        demo: combineReducers({
          keplerGl: keplerGlReducer.initialState({mapStyle: {styleType: 'no_map'}})
        })
      }),
      applyMiddleware(taskMiddleware)
    );
    const table = id => ({
      info: {id},
      data: {fields: [{name: 'value', type: 'integer'}], rows: [[1]]}
    });
    for (const id of ['map', 'other-map']) {
      await store.dispatch(registerEntry({id}));
      await store.dispatch(
        wrapTo(id, addDataToMap({datasets: [table(id)], options: {autoCreateLayers: false}}))
      );
    }
    const otherMap = store.getState().demo.keplerGl['other-map'];
    const context = buildKeplerContext(store);
    const saved = {
      datasets: [
        {
          version: 'v1',
          data: {id: 'project-data', fields: [{name: 'value', type: 'integer'}], allData: [[42]]}
        }
      ],
      config: {version: 'v1', config: {visState: {}, mapStyle: {styleType: 'no_map'}}}
    };
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => saved});
    const originalImport = KeplerTable.prototype.importData;
    let release;
    let started;
    const gate = new Promise(resolve => {
      release = resolve;
    });
    const importing = new Promise(resolve => {
      started = resolve;
    });
    const importData = jest
      .spyOn(KeplerTable.prototype, 'importData')
      .mockImplementation(function (data) {
        started();
        return gate.then(() => originalImport.call(this, data));
      });
    try {
      let completed = false;
      const pending = getOpenProjectCommand(context)
        .execute({}, {url: 'https://example.com/project.json'})
        .then(result => {
          completed = true;
          return result;
        });
      await importing;
      await new Promise(resolve => setImmediate(resolve));
      expect(completed).toBe(false);
      expect(store.getState().demo.keplerGl['other-map']).toBe(otherMap);
      release();
      expect(await pending).toMatchObject({success: true, data: {status: 'loaded'}});
      expect(Object.keys(context.getVisState().datasets)).toEqual(['project-data']);
      expect(context.getVisState().datasets['project-data'].dataContainer.valueAt(0, 0)).toBe(42);
      expect(store.getState().demo.keplerGl['other-map']).toBe(otherMap);
      expect(Object.keys(otherMap.visState.datasets)).toEqual(['other-map']);
    } finally {
      release();
      importData.mockRestore();
      global.fetch = originalFetch;
    }
  });
});

describe('WebMCP result formatting', () => {
  it('preserves dataset IDs, field types and layer bindings alongside the summary', () => {
    const data = {
      details: '1 dataset(s) loaded.',
      datasets: [
        {
          datasetName: 'Trips',
          datasetId: 'trips',
          fields: {longitude: 'real', latitude: 'real', timestamp: 'timestamp'},
          layers: [{id: 'trips-points', label: 'Trip points', type: 'point'}]
        }
      ]
    };

    const reply = formatResult({success: true, commandId: 'map.get-dataset-context', data});

    expect(JSON.parse(reply)).toEqual(data);
  });

  it('preserves layer settings when the successful payload has no details', () => {
    const data = {
      layerId: 'trips-points',
      layerType: 'point',
      settings: {radius: {type: 'number', value: 10, range: [0, 100]}}
    };

    const reply = formatResult({success: true, commandId: 'map.get-layer-options', data});

    expect(JSON.parse(reply)).toEqual(data);
  });

  it.each([{}, [], false, 0, ''])('preserves an empty or falsey payload: %j', data => {
    expect(JSON.parse(formatResult({success: true, commandId: 'map.test', data}))).toEqual(data);
  });

  it('keeps details-only replies readable', () => {
    expect(
      formatResult({
        success: true,
        commandId: 'kepler.get-map-skill',
        data: {details: '# Map skill\nUse the dataset ID.'}
      })
    ).toBe('✓ # Map skill\nUse the dataset ID.');
  });

  it('reports success without a payload', () => {
    expect(formatResult({success: true, commandId: 'map.test'})).toBe('✓ map.test ok');
  });

  it.each([
    [{success: false, error: 'Dataset missing'}, 'Dataset missing'],
    [{success: false, message: 'Invalid input'}, 'Invalid input'],
    [{success: false}, 'failed'],
    [{success: true, error: 'Unexpected error'}, 'Unexpected error']
  ])('retains error reporting for %j', (result, reason) => {
    expect(
      formatResult({commandId: 'map.test', data: {details: 'Ignore this payload'}, ...result})
    ).toBe(`✗ map.test: ${reason}`);
  });

  it.each([
    [undefined, '✓ ok'],
    [null, '✓ ok'],
    ['complete', '✓ complete'],
    [{layerId: 'trips-points'}, '✓ {"layerId":"trips-points"}']
  ])('retains bare payload handling for %j', (result, expected) => {
    expect(formatResult(result)).toBe(expected);
  });
});
