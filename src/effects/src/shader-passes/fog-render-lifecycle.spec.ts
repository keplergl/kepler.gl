// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import {DeckSurfaceFogEffect} from './surface-fog';
import {DeckDistanceFogEffect} from './distance-fog';

// Keep the effects and viewport patch real; replace only GPU allocation/drawing.
jest.mock('@luma.gl/engine', () => ({ClipSpace: jest.fn()}));

function createRenderer() {
  const pass = {end: jest.fn()};
  const device = {
    gl: {depthRange: jest.fn()},
    beginRenderPass: jest.fn(() => pass)
  };
  const model = {
    device,
    shaderInputs: {setProps: jest.fn()},
    draw: jest.fn(),
    destroy: jest.fn()
  };
  jest.mocked(ClipSpace).mockImplementation(() => model as unknown as ClipSpace);
  return {device, model, pass};
}

function createBuffers() {
  return {
    inputBuffer: {
      width: 640,
      height: 480,
      colorAttachments: [{id: 'color'}],
      depthStencilAttachment: {id: 'depth'}
    },
    swapBuffer: {id: 'swap'}
  };
}

beforeEach(() => jest.clearAllMocks());

describe.each([
  ['surface', DeckSurfaceFogEffect],
  ['distance', DeckDistanceFogEffect]
] as const)('%s fog render lifecycle', (_name, EffectClass) => {
  test('passes input through before setup and when depth is unavailable', () => {
    const effect = new EffectClass();
    const buffers = createBuffers();
    const renderer = createRenderer();
    expect(effect.postRender(buffers)).toBe(buffers.inputBuffer);
    effect.setup({device: renderer.device});
    const noDepth = {...buffers.inputBuffer, depthStencilAttachment: null};
    expect(effect.postRender({...buffers, inputBuffer: noDepth})).toBe(noDepth);
    expect(renderer.device.beginRenderPass).not.toHaveBeenCalled();
    expect(renderer.model.draw).not.toHaveBeenCalled();
  });

  test('renders to the swap buffer with input-sized viewport and premultiplied blending', () => {
    const effect = new EffectClass();
    const {device, model, pass} = createRenderer();
    const buffers = createBuffers();
    effect.setup({device});
    expect(ClipSpace).toHaveBeenCalledWith(
      device,
      expect.objectContaining({
        parameters: expect.objectContaining({
          depthWriteEnabled: false,
          depthCompare: 'always',
          blend: true,
          blendColorSrcFactor: 'one',
          blendColorDstFactor: 'one-minus-src-alpha'
        })
      })
    );
    expect(effect.postRender(buffers)).toBe(buffers.swapBuffer);
    expect(model.shaderInputs.setProps.mock.calls[0][0].screen).toEqual({
      texSrc: buffers.inputBuffer.colorAttachments[0],
      texSize: [640, 480]
    });
    expect(device.beginRenderPass).toHaveBeenCalledWith({
      framebuffer: buffers.swapBuffer,
      parameters: {viewport: [0, 0, 640, 480]},
      clearColor: [0, 0, 0, 0],
      clearDepth: 1
    });
    expect(model.draw).toHaveBeenCalledWith(pass);
    expect(pass.end).toHaveBeenCalledTimes(1);
    expect(model.draw.mock.invocationCallOrder[0]).toBeLessThan(
      pass.end.mock.invocationCallOrder[0]
    );
  });

  test('honors explicit targets and preserves previously composited canvas content', () => {
    const effect = new EffectClass();
    const {device} = createRenderer();
    const buffers = createBuffers();
    const target = {id: 'export'};
    effect.setup({device});
    expect(effect.postRender({...buffers, target, clearCanvas: false})).toBe(target);
    expect(device.beginRenderPass).toHaveBeenLastCalledWith(
      expect.objectContaining({framebuffer: target, clearColor: false, clearDepth: false})
    );
    // null is an explicit default-framebuffer target, not a request for the swap buffer.
    expect(effect.postRender({...buffers, target: null})).toBe(buffers.inputBuffer);
    expect(device.beginRenderPass).toHaveBeenLastCalledWith(
      expect.objectContaining({framebuffer: null})
    );
  });

  test('patches export tile visibility for one frame and restores it even on early return', () => {
    const effect = new EffectClass();
    const {device} = createRenderer();
    const tile = {selected: true, viewportIds: ['MapView']};
    const opts = {viewports: [{id: 'mapbox'}], layers: [{props: {tile}}]};
    effect.setup({device});
    effect.preRender(opts);
    expect(tile.viewportIds).toEqual(['MapView']);
    expect(device.gl.depthRange).toHaveBeenCalledWith(0, 1);
    effect.isExportMode = true;
    effect.preRender(opts);
    expect(tile.viewportIds).toEqual(['MapView', 'mapbox']);
    const buffers = createBuffers();
    effect.postRender({
      ...buffers,
      inputBuffer: {...buffers.inputBuffer, depthStencilAttachment: null}
    });
    expect(tile.viewportIds).toEqual(['MapView']);
    effect.postRender(buffers);
    expect(tile.viewportIds).toEqual(['MapView']);
  });

  test('destroys GPU resources once and allows a fresh setup after cleanup', () => {
    const effect = new EffectClass();
    const first = createRenderer();
    effect.setup({device: first.device});
    effect.cleanup();
    effect.cleanup();
    expect(first.model.destroy).toHaveBeenCalledTimes(1);
    const buffers = createBuffers();
    expect(effect.postRender(buffers)).toBe(buffers.inputBuffer);
    expect(first.model.draw).not.toHaveBeenCalled();
    const second = createRenderer();
    effect.setup({device: second.device});
    expect(effect.postRender(buffers)).toBe(buffers.swapBuffer);
    expect(second.model.draw).toHaveBeenCalledTimes(1);
  });
});

describe('fog reconstruction uniforms', () => {
  const matrix = Array.from({length: 16}, (_, i) => i + 1);
  const expectedMatrix = {
    invCol0: [1, 2, 3, 4],
    invCol1: [5, 6, 7, 8],
    invCol2: [9, 10, 11, 12],
    invCol3: [13, 14, 15, 16]
  };

  test('surface fog converts meter heights using the vertical scale and keeps partial prop updates', () => {
    const effect = new DeckSurfaceFogEffect({height: 100, thickness: 20, density: 0});
    const {device, model} = createRenderer();
    effect.setup({device});
    effect.setProps({pattern: true, fogColor: [10, 20, 30]});
    effect.postRender({
      ...createBuffers(),
      viewports: [
        {
          width: 320,
          height: 240,
          cameraPosition: [10, 20, 420],
          pixelUnprojectionMatrix: matrix,
          distanceScales: {unitsPerMeter: [2, 3, 4]}
        }
      ]
    });
    expect(model.shaderInputs.setProps.mock.calls[0][0].surfaceFog).toMatchObject({
      ...expectedMatrix,
      fogHeight: 400,
      fogThickness: 80,
      unitsPerMeter: 4,
      cameraHeight: 420,
      density: 0,
      pattern: 1,
      fogColor: [10, 20, 30],
      viewportWidth: 320,
      viewportHeight: 240
    });
    effect.setProps({pattern: false});
    effect.postRender({...createBuffers(), viewports: [{distanceScales: {unitsPerMeter: 2}}]});
    expect(model.shaderInputs.setProps.mock.calls[1][0].surfaceFog).toMatchObject({
      fogHeight: 200,
      cameraHeight: 0,
      pattern: 0
    });
  });

  test.each([0, -1, Infinity, NaN])('surface fog falls back for invalid meter scale %s', scale => {
    const effect = new DeckSurfaceFogEffect({height: 100, thickness: 20});
    const {device, model} = createRenderer();
    effect.setup({device});
    effect.postRender({...createBuffers(), viewports: [{distanceScales: {unitsPerMeter: scale}}]});
    expect(model.shaderInputs.setProps.mock.calls[0][0].surfaceFog).toMatchObject({
      fogHeight: 100,
      fogThickness: 20,
      unitsPerMeter: 1
    });
  });

  test('distance fog derives near/far planes and passes current viewport and partial props', () => {
    const effect = new DeckDistanceFogEffect({fogStart: 0, fogRange: 0.8});
    const {device, model} = createRenderer();
    effect.setup({device});
    effect.setProps({density: 0, fogColor: [10, 20, 30]});
    // Perspective matrix terms for near=2 and far=100.
    const projectionMatrix = new Array(16).fill(0);
    projectionMatrix[10] = -102 / 98;
    projectionMatrix[14] = -400 / 98;
    effect.postRender({
      ...createBuffers(),
      viewports: [{width: 320, height: 240, projectionMatrix, pixelUnprojectionMatrix: matrix}]
    });
    const uniforms = model.shaderInputs.setProps.mock.calls[0][0].distanceFog;
    expect(uniforms).toMatchObject({
      ...expectedMatrix,
      density: 0,
      fogStart: 0,
      fogRange: 0.8,
      fogColor: [10, 20, 30],
      viewportWidth: 320,
      viewportHeight: 240
    });
    expect(uniforms.nearPlane).toBeCloseTo(2);
    expect(uniforms.farPlane).toBeCloseTo(100);
  });

  test.each([undefined, new Array(16).fill(0)])(
    'distance fog uses safe defaults without valid projection',
    projectionMatrix => {
      const effect = new DeckDistanceFogEffect();
      const {device, model} = createRenderer();
      effect.setup({device});
      effect.postRender({
        ...createBuffers(),
        ...(projectionMatrix ? {viewports: [{projectionMatrix}]} : {})
      });
      expect(model.shaderInputs.setProps.mock.calls[0][0].distanceFog).toMatchObject({
        nearPlane: 0.1,
        farPlane: 1000,
        invCol0: [1, 0, 0, 0],
        invCol1: [0, 1, 0, 0],
        invCol2: [0, 0, 1, 0],
        invCol3: [0, 0, 0, 1]
      });
    }
  );
});
