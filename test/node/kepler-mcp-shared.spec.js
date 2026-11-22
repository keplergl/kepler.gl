/** @jest-environment node */

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {formatResult} from '../../examples/demo-app/src/kepler-mcp-shared';

jest.mock('@kepler.gl/mcp', () => ({}));
jest.mock('@deck.gl/core', () => ({}));
jest.mock('@kepler.gl/mcp/skill/kepler/SKILL.md', () => 'Map skill', {virtual: true});

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
