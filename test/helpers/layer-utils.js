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

import {LayerManager} from 'deck.gl';
import {gl} from '@deck.gl/test-utils';
import {INITIAL_MAP_STATE} from 'reducers/map-state-updaters';
import {INITIAL_VIS_STATE} from 'reducers/vis-state-updaters';
import {console as Console} from 'global/window';
import {onWebGLInitialized} from 'utils/gl-utils';
import {colorMaker, layerColors} from 'layers/base-layer';

// Destroy if there is any GL context
// gl.getExtension('STACKGL_destroy_context').destroy();
// Init GL
// onWebGLInitialized(gl);

export function testCreateLayer(LayerClass, props = {}) {
  let layer;

  expect(() => {
    layer = new LayerClass(props);
    expect(layer instanceof LayerClass).not.tobeNull();
  }).not.toThrow()

  return layer;
}

export function testFormatLayerData(layer, dataArgs) {
  let result;

  expect(() => {
    result = layer.formatLayerData(...dataArgs);
    expect(result).not.tobeNull();
    expect(layer).not.tobeNull();
  }).not.toThrow();

  return result;
}

export function testCreateCases(LayerClass, testCases) {
  testCases.forEach(tc => {
    const layer = testCreateLayer(LayerClass, tc.props);
    if (layer && tc.test) {
      tc.test(layer);
    }
  });
}

export function testUpdateLayer(layer, updateMethod, updateArgs) {
  let result;

  expect(() => {
    result = layer[updateMethod](...updateArgs);
    expect(layer).not.tobeNull();
  }).not.toThrow();

  return {result, layer};
}

export function testFormatLayerDataCases(t, LayerClass, testCases) {
  testCases.forEach(tc => {
    const layer = testCreateLayer(LayerClass, tc.props);
    let updatedLayer = layer;

    // if provided updates
    if (layer && tc.updates) {
      const applyUpdates = Array.isArray(tc.updates)
        ? tc.updates
        : [tc.updates];

      // apply 1 or multiple updates
      applyUpdates.forEach(update => {
        const updated = testUpdateLayer(
          updatedLayer,
          update.method,
          update.args
        );
        updatedLayer = updated.layer;
      });
    }

    if (updatedLayer) {
      const result = testFormatLayerData(updatedLayer, tc.data);
      if (result && tc.test) {
        tc.test({layerData: result, layer: updatedLayer});
      }
    }
  });
}

export function testRenderLayerCases(LayerClass, testCases) {
  testCases.forEach(tc => {
    const layer = testCreateLayer(LayerClass, tc.props);

    if (layer) {
      const result = testFormatLayerData(layer, tc.data);

      if (result) {
        let deckLayers;

        expect(() => {
          deckLayers = layer.renderLayer({
            data: result,
            idx: 0,
            layerInteraction: {},
            mapState: INITIAL_MAP_STATE,
            interactionConfig: INITIAL_VIS_STATE.interactionConfig,
            ...(tc.renderArgs || {})
          });
        }).not.toThrow();

        if (deckLayers) {
          testInitializeDeckLayer(layer.type, deckLayers);
        }
      }
    }
  });
}

export function testInitializeDeckLayer(t, layerType, layers) {
  const layerManager = new LayerManager(gl);

  const spy = jest.spyOn(Console, 'error').mockImplementation();

  expect(() => 
    layerManager.setLayers(Array.isArray(layers) ? layers : [layers])
  ).not.toThrow();

  // listen on console.error in editShader, fail the test if any error is logged
  expect(spy).toHaveBeenCalledTimes(2);

  spy.mockRestore();
  return null;
}

/**
 * Predict which color maker value would be next, allow skip couple
 * Should be used right before calling function to be tested
 * @param {Number} skip
 */
export function getNextColorMakerValue(num = 1) {
  const results = [];
  const colorNow = colorMaker.next().value;
  const index = layerColors.findIndex(c => c === colorNow);

  for (let n = 0; n < num; n++) {
    const next = index + n  + 1;
    const nextIndex =
      next < layerColors.length ? next : next - layerColors.length;
    results.push(layerColors[nextIndex]);
  }

  return results;
}
