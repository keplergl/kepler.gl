// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {patchTileViewportIds, resetDepthRange} from './tile-viewport-fix';

describe('patchTileViewportIds', () => {
  test('makes selected tiles visible to the pass and restores their original viewports', () => {
    const tile = {selected: true, viewportIds: ['MapView']};
    const emptyTile = {selected: true, viewportIds: [] as string[]};
    const cleanup = patchTileViewportIds({
      viewports: [{id: 'mapbox'}],
      layers: [{props: {tile}}, {props: {tile: emptyTile}}]
    });

    expect(tile.viewportIds).toEqual(['MapView', 'mapbox']);
    expect(emptyTile.viewportIds).toEqual(['mapbox']);
    cleanup();
    expect(tile.viewportIds).toEqual(['MapView']);
    expect(emptyTile.viewportIds).toEqual([]);
  });

  test('leaves existing visibility, unselected tiles and unrelated layers unchanged', () => {
    const alreadyVisible = {selected: true, viewportIds: ['MapView', 'mapbox']};
    const unselected = {selected: false, viewportIds: ['MapView']};
    const withoutViewports = {selected: true};
    const layers = [
      {props: {tile: alreadyVisible}},
      {props: {tile: unselected}},
      {props: {tile: withoutViewports}},
      {props: {}},
      {}
    ];
    const before = JSON.parse(JSON.stringify(layers));
    const cleanup = patchTileViewportIds({viewports: [{id: 'mapbox'}], layers});

    expect(layers).toEqual(before);
    cleanup();
    expect(layers).toEqual(before);
  });

  test('patches a tile shared by multiple sublayers only once', () => {
    const tile = {selected: true, viewportIds: ['MapView']};
    const cleanup = patchTileViewportIds({
      viewports: [{id: 'mapbox'}],
      layers: [{props: {tile}}, {props: {tile}}]
    });

    expect(tile.viewportIds).toEqual(['MapView', 'mapbox']);
    cleanup();
    cleanup();
    expect(tile.viewportIds).toEqual(['MapView']);
  });

  test('cleanup removes only its added ID even if visibility changes during rendering', () => {
    const retained = {selected: true, viewportIds: ['MapView']};
    const removed = {selected: true, viewportIds: ['MapView']};
    const cleanup = patchTileViewportIds({
      viewports: [{id: 'mapbox'}],
      layers: [{props: {tile: retained}}, {props: {tile: removed}}]
    });
    retained.viewportIds.push('another-view');
    removed.viewportIds = ['another-view'];

    cleanup();
    expect(retained.viewportIds).toEqual(['MapView', 'another-view']);
    expect(removed.viewportIds).toEqual(['another-view']);
  });

  test('does not accumulate pass viewport IDs across frames', () => {
    const tile = {selected: true, viewportIds: ['MapView']};
    for (const id of ['mapbox', 'export', 'mapbox']) {
      const cleanup = patchTileViewportIds({viewports: [{id}], layers: [{props: {tile}}]});
      expect(tile.viewportIds).toEqual(['MapView', id]);
      cleanup();
      expect(tile.viewportIds).toEqual(['MapView']);
    }
  });

  test('returns safe cleanup without a usable viewport or layers', () => {
    const tile = {selected: true, viewportIds: ['MapView']};
    const layers = [{props: {tile}}];
    for (const options of [
      {},
      {layers},
      {viewports: [], layers},
      {viewports: [{id: ''}], layers},
      {viewports: [{id: 'mapbox'}]},
      {viewports: [{id: 'mapbox'}], layers: []}
    ]) {
      const cleanup = patchTileViewportIds(options);
      expect(() => cleanup()).not.toThrow();
    }
    expect(tile.viewportIds).toEqual(['MapView']);
  });
});

describe('resetDepthRange', () => {
  test('restores the full depth range on the model WebGL context', () => {
    const gl = {depthRange: jest.fn()};
    resetDepthRange({device: {gl}});
    expect(gl.depthRange).toHaveBeenCalledTimes(1);
    expect(gl.depthRange).toHaveBeenCalledWith(0, 1);
  });

  test('accepts an absent model or a device without WebGL', () => {
    expect(() => resetDepthRange(null)).not.toThrow();
    expect(() => resetDepthRange({device: {}})).not.toThrow();
  });
});
