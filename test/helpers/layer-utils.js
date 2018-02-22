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
      const applyUpdates = Array.isArray(tc.updates) ? tc.updates : [tc.updates];

      // apply 1 or multiple updates
      applyUpdates.forEach(update => {
        const updated = testUpdateLayer(t, updatedLayer, update.method, update.args);
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
