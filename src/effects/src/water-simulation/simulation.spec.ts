// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {_LayersPass, WebMercatorViewport, EffectContext, PreRenderOptions} from '@deck.gl/core';
import {ClipSpace, Model} from '@luma.gl/engine';
import {WaterSimulation} from './simulation';

jest.mock('@luma.gl/engine', () => ({
  ...jest.requireActual('@luma.gl/engine'),
  ClipSpace: jest.fn(),
  Model: jest.fn()
}));

const props = {
  resolution: 256,
  rain: 0.01,
  smoothing: 1,
  openBoundary: false,
  color: [30, 140, 210],
  opacity: 0.8
};
const viewport = new WebMercatorViewport({
  id: 'map',
  width: 600,
  height: 400,
  longitude: 30.5,
  latitude: 50.4,
  zoom: 14
});
const opts = {layers: [], viewports: [viewport], pass: 'draw'} as PreRenderOptions;

function setup({coverage = true, supported = true} = {}) {
  const models: any[] = [],
    targets: any[] = [];
  const model = () => {
    const instance = {
      shaderInputs: {setProps: jest.fn()},
      setBindings: jest.fn(),
      draw: jest.fn(),
      destroy: jest.fn()
    };
    models.push(instance);
    return instance as unknown as Model;
  };
  jest.mocked(Model).mockImplementation(model);
  jest.mocked(ClipSpace).mockImplementation(model);
  const pass = {end: jest.fn()};
  const device = {
    type: 'webgl',
    canvasContext: {},
    isTextureFormatRenderable: jest.fn(() => supported),
    gl: {DEPTH_RANGE: 1, getParameter: jest.fn(() => [0, 0.979]), depthRange: jest.fn()},
    createFramebuffer: jest.fn(options => {
      const framebuffer = {
        ...options,
        colorAttachments: [{texture: {setSampler: jest.fn(), writeData: jest.fn()}}],
        depthStencilAttachment: {texture: {}},
        destroy: jest.fn()
      };
      targets.push(framebuffer);
      return framebuffer;
    }),
    beginRenderPass: jest.fn(() => pass),
    readPixelsToArrayWebGL: jest.fn((_framebuffer, {target}) => {
      for (let i = 3; i < target.length; i += 4) target[i] = coverage ? 1 : 0;
      return target;
    })
  };
  const deck = {redraw: jest.fn()};
  const simulation = new WaterSimulation('test-water', {...props});
  simulation.setup({device, deck} as unknown as EffectContext);
  return {simulation, device, deck, models, targets};
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(_LayersPass.prototype, 'render').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test('captures once and keeps the domain fixed during playback and camera movement', () => {
  const {simulation, device, models} = setup();
  let now = 0;
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  simulation.capture();
  simulation.preRender(opts);
  expect(simulation.getSnapshot()).toMatchObject({ready: true, running: false});
  simulation.toggleRunning();
  for (let i = 0; i < 4; i++) {
    now += 20;
    simulation.preRender(opts);
  }
  expect(models[1].draw).toHaveBeenCalled();
  expect(models[2].draw).toHaveBeenCalledTimes(models[1].draw.mock.calls.length);
  expect(device.readPixelsToArrayWebGL).toHaveBeenCalledTimes(1);
  expect(_LayersPass.prototype.render).toHaveBeenCalledTimes(1);
  const smoothing = models[4];
  expect(smoothing.draw).toHaveBeenCalledTimes(1);
  expect(smoothing.shaderInputs.setProps).toHaveBeenCalledWith({
    heightFilter: {size: [256, 256], strength: 1}
  });
  const initialCapture = jest.mocked(_LayersPass.prototype.render).mock.calls[0][0];
  expect(initialCapture.viewports[0].width).toBe(256);
  expect(initialCapture.canvasContext!.cssToDeviceRatio()).toBe(1);
  simulation.setProps({smoothing: 0.5, rain: 0});
  now += 20;
  simulation.preRender({...opts, viewports: [new WebMercatorViewport({zoom: 10})]});
  expect(models[1].shaderInputs.setProps).toHaveBeenLastCalledWith({
    water: expect.objectContaining({rain: 0})
  });
  expect(simulation.getSnapshot().running).toBe(true);
  expect(_LayersPass.prototype.render).toHaveBeenCalledTimes(1);
  expect(smoothing.draw).toHaveBeenCalledTimes(1);
  simulation.toggleRunning();
  const count = models[1].draw.mock.calls.length;
  now += 10000;
  simulation.preRender(opts);
  expect(models[1].draw).toHaveBeenCalledTimes(count);
  simulation.reset();
  simulation.preRender(opts);
  expect(simulation.getSnapshot()).toMatchObject({ready: true, running: false});
  expect(_LayersPass.prototype.render).toHaveBeenCalledTimes(1);
  simulation.cleanup();
  simulation.cleanup();
  expect(models.every(model => model.destroy.mock.calls.length === 1)).toBe(true);
});

test('restores shared depth range and tile visibility after capture failure', () => {
  const {simulation, device, targets} = setup();
  const tile = {selected: true, viewportIds: ['map']};
  jest.mocked(_LayersPass.prototype.render).mockImplementation(() => {
    expect(tile.viewportIds).toContain('map-water-capture');
    throw new Error('capture failed');
  });
  simulation.capture();
  simulation.preRender({...opts, layers: [{props: {tile}} as any]});
  expect(tile.viewportIds).toEqual(['map']);
  expect(device.gl.depthRange).toHaveBeenLastCalledWith(0, 0.979);
  expect(simulation.getSnapshot()).toMatchObject({
    ready: false,
    running: false,
    message: 'capture failed'
  });
  expect(targets.every(target => target.destroy.mock.calls.length === 1)).toBe(true);
});

test.each([{coverage: false}, {supported: false}])(
  'reports unusable capture without running: %j',
  options => {
    const {simulation, targets} = setup(options);
    simulation.capture();
    simulation.preRender(opts);
    simulation.toggleRunning();
    expect(simulation.getSnapshot()).toMatchObject({ready: false, running: false});
    expect(simulation.getSnapshot().message).toMatch(/No surfaces|WebGL 2/);
    expect(targets.every(target => target.destroy.mock.calls.length === 1)).toBe(true);
  }
);

test('recapture replaces GPU state and surface participates in the regular layer pass', () => {
  const {simulation, models, targets} = setup();
  simulation.capture();
  simulation.preRender(opts);
  const oldTargets = targets.slice();
  const surface = simulation.getLayer();
  const renderPass = {} as any;
  surface.context = {viewport} as any;
  surface.draw({renderPass});
  expect(models[3].draw).toHaveBeenCalledWith(renderPass);
  simulation.setProps({smoothing: 0});
  simulation.capture();
  simulation.preRender(opts);
  expect(models[9].shaderInputs.setProps).toHaveBeenCalledWith({
    heightFilter: {size: [256, 256], strength: 0}
  });
  expect(oldTargets.every(target => target.destroy.mock.calls.length === 1)).toBe(true);
  expect(simulation.getSnapshot()).toMatchObject({ready: true, running: false});
});

test('capture while disabled reports the unavailable map instead of waiting indefinitely', () => {
  const simulation = new WaterSimulation('disabled', props);
  simulation.capture();
  expect(simulation.getSnapshot()).toMatchObject({ready: false, running: false});
  expect(simulation.getSnapshot().message).toContain('single flat map');
});

test('resolution changes resize capture and simulation only when recapturing', () => {
  const {simulation, device, models, targets} = setup();
  let now = 0;
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  simulation.setProps({resolution: 128});
  simulation.capture();
  simulation.preRender(opts);
  expect(simulation.getSnapshot().ready).toBe(true);
  expect(targets.every(target => target.width === 128 && target.height === 128)).toBe(true);
  const capture = jest.mocked(_LayersPass.prototype.render).mock.calls[0][0];
  expect(capture.viewports[0].width).toBe(128);
  expect(capture.canvasContext!.getDrawingBufferSize()).toEqual([128, 128]);
  expect(jest.mocked(Model).mock.calls[0][1]!.vertexCount).toBe(127 ** 2 * 6);
  const heights = targets[1].colorAttachments[0].texture.writeData.mock.calls[0][0];
  expect(heights).toHaveLength(128 * 128 * 4);
  expect(heights[1]).toBe(1); // The captured perimeter is an outlet.
  expect(heights[(64 * 128 + 64) * 4 + 1]).toBe(0);

  simulation.setProps({resolution: 512});
  simulation.toggleRunning();
  now += 20;
  simulation.preRender(opts);
  expect(models[1].shaderInputs.setProps).toHaveBeenLastCalledWith({
    water: expect.objectContaining({size: [128, 128]})
  });
  expect(device.beginRenderPass).toHaveBeenLastCalledWith(
    expect.objectContaining({parameters: {viewport: [0, 0, 128, 128]}})
  );
  simulation.draw({} as any, viewport);
  expect(models[3].shaderInputs.setProps).toHaveBeenLastCalledWith({
    waterSurface: expect.objectContaining({resolution: 128})
  });
  expect(_LayersPass.prototype.render).toHaveBeenCalledTimes(1);

  const oldTargets = targets.slice();
  simulation.capture();
  simulation.preRender(opts);
  expect(oldTargets.every(target => target.destroy.mock.calls.length === 1)).toBe(true);
  expect(targets.slice(5).every(target => target.width === 512 && target.height === 512)).toBe(
    true
  );
  expect(models[9].shaderInputs.setProps).toHaveBeenCalledWith({
    heightFilter: {size: [512, 512], strength: 1}
  });
  expect(jest.mocked(Model).mock.calls[1][1]!.vertexCount).toBe(511 ** 2 * 6);
  expect(simulation.getSnapshot()).toMatchObject({ready: true, running: false});
  expect(device.readPixelsToArrayWebGL).toHaveBeenCalledTimes(2);
});
