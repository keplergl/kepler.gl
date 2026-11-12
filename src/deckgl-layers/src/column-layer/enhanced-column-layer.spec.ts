// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import EnhancedColumnLayer from './enhanced-column-layer';

function createLayer(props = {}) {
  const layer = new EnhancedColumnLayer({
    id: 'columns',
    data: [],
    extruded: false,
    filled: true,
    stroked: true,
    opacity: 0.8,
    strokeOpacity: 0.3,
    ...props
  });
  const drawOrder: string[] = [];
  const createModel = (name: string) => ({
    shaderInputs: {setProps: jest.fn()},
    draw: jest.fn(() => drawOrder.push(name))
  });
  const fillModel = createModel('fill');
  const strokeModel = createModel('stroke');
  const wireframeModel = createModel('wireframe');
  layer.state = {fillModel, strokeModel, wireframeModel, edgeDistance: 1} as any;
  layer.context = {viewport: {resolution: 1}, renderPass: {}, defaultShaderModules: []} as any;
  return {layer, fillModel, strokeModel, wireframeModel, drawOrder};
}

describe('enhanced column rendering', () => {
  test('declares per-cell coverage before applying it to the installed deck shader', () => {
    const {layer} = createLayer();
    const {vs} = layer.getShaders();
    const declaration = vs.indexOf('in float instanceCoverage;');
    const use = vs.indexOf('column.coverage * instanceCoverage');

    expect(declaration).toBeGreaterThan(-1);
    expect(use).toBeGreaterThan(declaration);
  });

  test('draws the outline separately without applying its opacity to the fill', () => {
    const {layer, fillModel, strokeModel, drawOrder} = createLayer();
    layer.draw({uniforms: {}});

    expect(drawOrder).toEqual(['fill', 'stroke']);
    expect(fillModel.shaderInputs.setProps).toHaveBeenCalledWith(
      expect.objectContaining({column: expect.objectContaining({isStroke: false})})
    );
    expect(fillModel.shaderInputs.setProps).not.toHaveBeenCalledWith(
      expect.objectContaining({layer: {opacity: 0.3}})
    );
    expect(strokeModel.shaderInputs.setProps).toHaveBeenCalledWith(
      expect.objectContaining({
        column: expect.objectContaining({isStroke: true}),
        layer: {opacity: 0.3},
        globeMode: {globeMode: 1}
      })
    );
  });

  test('draws an outline when the fill is disabled', () => {
    const {layer, drawOrder} = createLayer({filled: false});
    layer.draw({uniforms: {}});

    expect(drawOrder).toEqual(['stroke']);
  });

  test('draws an extruded wireframe before its fill without a flat outline', () => {
    const {layer, drawOrder} = createLayer({extruded: true, wireframe: true});
    layer.draw({uniforms: {}});

    expect(drawOrder).toEqual(['wireframe', 'fill']);
  });
});
