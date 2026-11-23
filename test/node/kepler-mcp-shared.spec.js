/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {buildKeplerContext, formatResult} from '../../examples/demo-app/src/kepler-mcp-shared';

jest.mock('@kepler.gl/mcp', () => ({}));
jest.mock('@deck.gl/core', () => ({}));
jest.mock('@kepler.gl/mcp/skill/kepler/SKILL.md', () => 'Map skill', {virtual: true});
jest.mock('@kepler.gl/components', () => ({renderPreviewFrame: jest.fn()}));
jest.mock('../../examples/demo-app/src/constants/default-settings', () => ({
  CLOUD_PROVIDERS_CONFIGURATION: {MAPBOX_TOKEN: 'configured-map-token'}
}));
jest.mock('../../examples/demo-app/src/kepler-video-export', () => ({
  getVideoExportService: jest.fn().mockReturnValue({start: jest.fn()})
}));

describe('MCP native frame host', () => {
  function host() {
    let map = {
      visState: {datasets: {points: {dataContainer: {}, dataRevision: 0}}},
      mapState: {width: 1200},
      mapStyle: {}
    };
    let onChange;
    const unsubscribe = jest.fn(() => {
      onChange = undefined;
    });
    const store = {
      getState: () => ({demo: {keplerGl: {map}}}),
      dispatch: jest.fn(),
      subscribe: jest.fn(callback => {
        onChange = callback;
        return unsubscribe;
      })
    };
    return {
      store,
      unsubscribe,
      get map() {
        return map;
      },
      update(next) {
        map = next;
        onChange?.();
      }
    };
  }

  function pendingRenderer() {
    const {renderPreviewFrame} = require('@kepler.gl/components');
    let started;
    const ready = new Promise(resolve => {
      started = resolve;
    });
    renderPreviewFrame.mockImplementationOnce(
      (_map, _options, {signal}) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener(
            'abort',
            () => reject(new DOMException('Preview frame canceled', 'AbortError')),
            {once: true}
          );
          started(signal);
        })
    );
    return {ready};
  }

  it('keeps video jobs and frame previews available on the same host', () => {
    const {getVideoExportService} = require('../../examples/demo-app/src/kepler-video-export');
    const store = {getState: () => ({})};
    const service = {start: jest.fn()};
    getVideoExportService.mockReturnValueOnce(service);

    const context = buildKeplerContext(store);
    expect(context.videoExport).toBe(service);
    expect(context.renderPreviewFrame).toEqual(expect.any(Function));
    expect(getVideoExportService).toHaveBeenCalledWith(store);
  });

  it('renders the current map without dispatching live changes and releases its data guard', async () => {
    const {renderPreviewFrame} = require('@kepler.gl/components');
    const image = {mimeType: 'image/png', data: 'png', width: 1920, height: 1080};
    renderPreviewFrame.mockResolvedValue(image);
    const {store, map, unsubscribe} = host();
    const options = {width: 1920, height: 1080, dataTime: 123, cameraTimeMs: 500};
    const signal = new AbortController().signal;

    await expect(buildKeplerContext(store).renderPreviewFrame(options, signal)).resolves.toBe(
      image
    );
    expect(renderPreviewFrame).toHaveBeenCalledWith(map, options, {
      mapboxApiAccessToken: 'configured-map-token',
      containerW: 1200,
      signal: expect.any(AbortSignal)
    });
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('ignores view and wrapper changes but rejects a later mutation of the shared data', async () => {
    const current = host();
    const renderer = pendingRenderer();
    const result = buildKeplerContext(current.store).renderPreviewFrame({width: 640, height: 480});
    const signal = await renderer.ready;
    const table = {...current.map.visState.datasets.points};
    current.update({
      ...current.map,
      mapState: {width: 1200, zoom: 10},
      mapStyle: {styleType: 'light'},
      visState: {
        ...current.map.visState,
        animationConfig: {currentTime: 123},
        datasets: {points: table}
      }
    });
    expect(signal.aborted).toBe(false);

    const failure = expect(result).rejects.toThrow('Map data changed');
    table.dataRevision += 1;
    current.update(current.map);
    await failure;
    expect(signal.aborted).toBe(true);
    expect(current.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it.each(['replace', 'add', 'remove'])('cancels if datasets %s during rendering', async change => {
    const current = host();
    const renderer = pendingRenderer();
    const result = buildKeplerContext(current.store).renderPreviewFrame({width: 640, height: 480});
    await renderer.ready;
    const datasets = {...current.map.visState.datasets};
    if (change === 'replace') datasets.points = {...datasets.points, dataContainer: {}};
    if (change === 'add') datasets.extra = {dataContainer: {}, dataRevision: 0};
    if (change === 'remove') delete datasets.points;
    const failure = expect(result).rejects.toThrow('Retry with the updated data');
    current.update({...current.map, visState: {...current.map.visState, datasets}});
    await failure;
    expect(current.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('preserves external cancellation and removes both listeners', async () => {
    const current = host();
    const renderer = pendingRenderer();
    const controller = new AbortController();
    const remove = jest.spyOn(controller.signal, 'removeEventListener');
    const result = buildKeplerContext(current.store).renderPreviewFrame(
      {width: 640, height: 480},
      controller.signal
    );
    const signal = await renderer.ready;
    const failure = expect(result).rejects.toThrow('Preview frame canceled');
    controller.abort();
    await failure;
    expect(signal.aborted).toBe(true);
    expect(current.unsubscribe).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith('abort', expect.any(Function));
  });

  it('releases the data guard when rendering fails', async () => {
    const {renderPreviewFrame} = require('@kepler.gl/components');
    renderPreviewFrame.mockRejectedValueOnce(new Error('Invalid layer'));
    const current = host();
    await expect(
      buildKeplerContext(current.store).renderPreviewFrame({width: 640, height: 480})
    ).rejects.toThrow('Invalid layer');
    expect(current.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('reports an uninitialized map before mounting a renderer', async () => {
    await expect(
      buildKeplerContext({getState: () => ({})}).renderPreviewFrame({width: 640, height: 480})
    ).rejects.toThrow('map is not initialized');
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
