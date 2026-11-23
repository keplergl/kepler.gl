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

  it('renders a snapshot of the current map without dispatching live changes', async () => {
    const {renderPreviewFrame} = require('@kepler.gl/components');
    const image = {mimeType: 'image/png', data: 'png', width: 1920, height: 1080};
    renderPreviewFrame.mockResolvedValue(image);
    const map = {visState: {}, mapState: {width: 1200}, mapStyle: {}};
    const store = {getState: () => ({demo: {keplerGl: {map}}}), dispatch: jest.fn()};
    const options = {width: 1920, height: 1080, dataTime: 123, cameraTimeMs: 500};
    const signal = new AbortController().signal;

    await expect(buildKeplerContext(store).renderPreviewFrame(options, signal)).resolves.toBe(
      image
    );
    expect(renderPreviewFrame).toHaveBeenCalledWith(map, options, {
      mapboxApiAccessToken: 'configured-map-token',
      containerW: 1200,
      signal
    });
    expect(store.dispatch).not.toHaveBeenCalled();
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
