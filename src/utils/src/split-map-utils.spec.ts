// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  addNewLayersToSplitMap,
  removeLayerFromSplitMaps,
  getInitialMapLayersForSplitMap,
  combineSplitMapsByIndex,
  computeSplitMapLayers
} from './split-map-utils';

const layer = (id: string, isVisible = true) => ({id, config: {isVisible}});

describe('split map layer visibility', () => {
  test('adds visible layers without overwriting independent panel visibility', () => {
    const panels = Object.freeze([
      Object.freeze({layers: Object.freeze({existing: false}), isVisible: true}),
      Object.freeze({layers: Object.freeze({existing: true}), isVisible: false})
    ]);
    const result = addNewLayersToSplitMap(panels, [
      layer('existing'),
      layer('new'),
      layer('hidden', false)
    ]);

    expect(result).toEqual([
      {layers: {existing: false, new: true}, isVisible: true},
      {layers: {existing: true, new: true}, isVisible: false}
    ]);
    expect(panels[0].layers).toEqual({existing: false});
    expect(panels[1].layers).toEqual({existing: true});
  });

  test('supports adding a single layer and leaves empty inputs unchanged', () => {
    expect(addNewLayersToSplitMap([{layers: {}}], layer('new'))).toEqual([{layers: {new: true}}]);
    expect(addNewLayersToSplitMap([], layer('new'))).toEqual([]);
    expect(addNewLayersToSplitMap([{layers: {existing: false}}], [])).toEqual([
      {layers: {existing: false}}
    ]);
  });

  test('removes only the requested layer from every panel, preserving panel settings', () => {
    const panels = Object.freeze([
      Object.freeze({layers: Object.freeze({removed: false, kept: true}), isVisible: false}),
      Object.freeze({layers: Object.freeze({kept: false}), isVisible: true})
    ]);
    expect(removeLayerFromSplitMaps(panels, layer('removed'))).toEqual([
      {layers: {kept: true}, isVisible: false},
      {layers: {kept: false}, isVisible: true}
    ]);
    expect(panels[0].layers).toEqual({removed: false, kept: true});
    expect(removeLayerFromSplitMaps([], layer('removed'))).toEqual([]);
  });

  test('initializes from visible layers only, with an empty right panel by default', () => {
    const layers = [layer('visible'), layer('hidden', false)];
    expect(getInitialMapLayersForSplitMap(layers)).toEqual({visible: true});
    expect(computeSplitMapLayers(layers)).toEqual([{layers: {visible: true}}, {layers: {}}]);
    expect(computeSplitMapLayers([])).toEqual([{layers: {}}, {layers: {}}]);
  });

  test('duplicated panels can change visibility independently', () => {
    const layers = [layer('visible'), layer('hidden', false)];
    const panels = computeSplitMapLayers(layers, {duplicate: true});
    expect(panels).toEqual([{layers: {visible: true}}, {layers: {visible: true}}]);
    panels[0].layers.visible = false;
    expect(panels[1].layers).toEqual({visible: true});
    expect(layers[0].config.isVisible).toBe(true);
  });
});

describe('split map configuration merging', () => {
  test('merges layers by panel index with explicit false overrides and without mutating inputs', () => {
    const base = Object.freeze([
      Object.freeze({layers: Object.freeze({shared: true, kept: false}), isVisible: true})
    ]);
    const incoming = Object.freeze([
      Object.freeze({layers: Object.freeze({shared: false, added: true}), isVisible: false})
    ]);
    expect(combineSplitMapsByIndex(base, incoming)).toEqual([
      {layers: {shared: false, kept: false, added: true}, isVisible: false}
    ]);
    expect(base[0].layers).toEqual({shared: true, kept: false});
    expect(incoming[0].layers).toEqual({shared: false, added: true});
  });

  test.each([true, false])('retains extra panels when the base is longer: %s', baseIsLonger => {
    const longer = [{layers: {first: true}}, {layers: {second: false}}];
    const shorter = [{layers: {additional: true}}];
    const result = baseIsLonger
      ? combineSplitMapsByIndex(longer, shorter)
      : combineSplitMapsByIndex(shorter, longer);
    expect(result).toEqual([{layers: {first: true, additional: true}}, {layers: {second: false}}]);
  });

  test('fills sparse panel positions and handles empty configurations', () => {
    const base = new Array(3);
    base[2] = {layers: {last: false}};
    const incoming = [{layers: {first: true}}];
    const result = combineSplitMapsByIndex(base, incoming);
    expect(result).toEqual([{layers: {first: true}}, {layers: {}}, {layers: {last: false}}]);
    expect(Object.keys(result)).toEqual(['0', '1', '2']);
    expect(1 in base).toBe(false);
    expect(combineSplitMapsByIndex([], [])).toEqual([]);
  });
});
