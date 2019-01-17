// Copyright (c) 2019 Uber Technologies, Inc.
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

export function testCreateLayer(t, LayerClass, props = {}) {
  let layer;

  t.doesNotThrow(() => {
    layer = new LayerClass(props);
    t.ok(layer instanceof LayerClass, `${layer.type} layer created`);
  }, `creating layer should not fail`);

  return layer;
}

export function testFormatLayerData(t, layer, dataArgs) {
  let result;

  t.doesNotThrow(() => {
    result = layer.formatLayerData(...dataArgs);
    t.ok(result, 'has layer data');
    t.ok(layer, 'has updated layer');
  }, `format ${layer.type} layerData should not fail`);

  return result;
}

export function testCreateCases(t, LayerClass, testCases) {
  testCases.forEach(tc => {
    const layer = testCreateLayer(t, LayerClass, tc.props);
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
    const layer = testCreateLayer(t, LayerClass, tc.props);
    let updatedLayer = layer;

    // if provided updates
    if (layer && tc.updates) {
      const applyUpdates = Array.isArray(tc.updates)
        ? tc.updates
        : [tc.updates];

      // apply 1 or multiple updates
      applyUpdates.forEach(update => {
        const updated = testUpdateLayer(
          t,
          updatedLayer,
          update.method,
          update.args
        );
        updatedLayer = updated.layer;
      });
    }

    if (updatedLayer) {
      const result = testFormatLayerData(t, updatedLayer, tc.data);
      if (result && tc.test) {
        tc.test({layerData: result, layer: updatedLayer});
      }
    }
  });
}
