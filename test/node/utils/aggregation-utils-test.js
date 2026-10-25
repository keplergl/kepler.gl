// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {enrichedRenderLayers} from '../../../src/deckgl-layers/src/layer-utils/aggregation-utils';

function ParentClass() {}
ParentClass.prototype.renderLayers = function renderLayers() {
  return 'layers';
};

function createJenksLayer(binValues, colorCount) {
  const rawColorBinValues = Float32Array.from(binValues);
  const props = {
    jenksScale: true,
    colorRange: Array.from({length: colorCount}, () => [0, 0, 0])
  };
  return {
    state: {
      colors: {},
      rawColorBinValues,
      aggregator: {binCount: rawColorBinValues.length}
    },
    getCurrentLayer: () => ({props})
  };
}

test('AggregationUtils -> enrichedRenderLayers caches Jenks breaks', t => {
  const binValues = [1, 1, 1, 50, 51, 52, 1000, 1001, 1002];
  const layer = createJenksLayer(binValues, 3);

  t.equal(enrichedRenderLayers(layer, ParentClass), 'layers', 'should call parent renderLayers');
  const firstCache = layer.state.jenksColorMapCache;
  t.ok(firstCache, 'should store a Jenks color map cache');
  t.equal(firstCache.k, 3, 'cache should record the palette size');
  t.equal(firstCache.source, layer.state.rawColorBinValues, 'cache should key off the bin array');
  t.ok(layer.state.colors.attribute, 'should classify bins on the first render');

  const classifiedAfterFirst = layer.state.colors.attribute.value;
  enrichedRenderLayers(layer, ParentClass);
  t.equal(
    layer.state.jenksColorMapCache,
    firstCache,
    'should reuse the cached Jenks map when bins and k are unchanged'
  );
  t.notEqual(
    layer.state.colors.attribute.value,
    classifiedAfterFirst,
    'should still reclassify bins on later renders'
  );

  layer.getCurrentLayer().props.colorRange = Array.from({length: 4}, () => [0, 0, 0]);
  enrichedRenderLayers(layer, ParentClass);
  t.notEqual(
    layer.state.jenksColorMapCache,
    firstCache,
    'should recompute Jenks when the palette size changes'
  );
  t.equal(layer.state.jenksColorMapCache.k, 4, 'recomputed cache should use the new palette size');

  t.end();
});
