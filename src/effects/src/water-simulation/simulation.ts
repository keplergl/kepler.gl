// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Layer, _LayersPass as LayersPass} from '@deck.gl/core';
import type {EffectContext, PreRenderOptions, Viewport} from '@deck.gl/core';
import type {Device} from '@luma.gl/core/dist/adapter/device';
import type {Framebuffer} from '@luma.gl/core/dist/adapter/resources/framebuffer';
import type {RenderPass} from '@luma.gl/core/dist/adapter/resources/render-pass';
import {ClipSpace, Model} from '@luma.gl/engine';
import {Matrix4} from '@math.gl/core';
import {patchTileViewportIds} from '../tile-viewport-fix';
import {createWaterDomain, isWaterSurface, markWaterBoundary, WaterDomain} from './domain';
import {
  CAPTURE_FS,
  SMOOTH_HEIGHT_FS,
  FLUX_FS,
  UPDATE_FS,
  SURFACE_VS,
  SURFACE_FS,
  waterModule,
  heightFilterModule,
  surfaceModule
} from './shaders';

export type WaterProps = {
  resolution: number;
  rain: number;
  smoothing: number;
  openBoundary: boolean;
  color: number[];
  opacity: number;
};
export type WaterStatus = {ready: boolean; running: boolean; message: string};
const INITIAL_STATUS: WaterStatus = {
  ready: false,
  running: false,
  message: 'Capture visible surfaces to begin.'
};
const STEP = 0.05;

class CapturePass extends LayersPass {
  shouldDrawLayer(layer: Layer) {
    return isWaterSurface(layer);
  }
  getLayerParameters(layer: Layer) {
    return {
      ...layer.props.parameters,
      blend: false,
      depthTest: true,
      depthMask: true,
      depthWriteEnabled: true,
      depthCompare: 'less-equal' as const,
      polygonOffsetFill: false,
      depthBias: 0
    };
  }
}

/** Session-only GPU state. Only WaterProps are serialized by kepler's effect wrapper. */
export class WaterSimulation {
  readonly id: string;
  readonly module = {propTypes: {}};
  props: WaterProps;
  private device?: Device;
  private deck?: EffectContext['deck'];
  private status: WaterStatus = INITIAL_STATUS;
  private listeners = new Set<() => void>();
  private captureRequested = false;
  private resetRequested = false;
  private domain?: WaterDomain;
  private targets: Framebuffer[] = [];
  private terrain?: Framebuffer;
  private states: Framebuffer[] = [];
  private flux?: Framebuffer;
  private models: Model[] = [];
  private captureModel?: ClipSpace;
  private fluxModel?: ClipSpace;
  private updateModel?: ClipSpace;
  private surfaceModel?: Model;
  private current = 0;
  private lastTime = 0;
  private accumulator = 0;

  constructor(id: string, props: WaterProps) {
    this.id = id;
    this.props = props;
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getSnapshot = () => this.status;
  private setStatus(status: WaterStatus) {
    this.status = status;
    this.listeners.forEach(listener => listener());
  }
  setProps(props: Partial<WaterProps>) {
    Object.assign(this.props, props);
  }
  setup({device, deck}: EffectContext) {
    this.device = device;
    this.deck = deck;
  }

  capture = () => {
    if (!this.deck) {
      this.setStatus({
        ready: false,
        running: false,
        message: 'Enable this effect in a single flat map to capture surfaces.'
      });
      return;
    }
    this.captureRequested = true;
    this.setStatus({ready: false, running: false, message: 'Capturing visible surfaces…'});
    this.deck?.redraw('water capture');
  };
  toggleRunning = () => {
    if (!this.status.ready) return;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.setStatus({...this.status, running: !this.status.running});
    this.deck?.redraw('water playback');
  };
  reset = () => {
    if (!this.status.ready) return;
    this.resetRequested = true;
    this.setStatus({...this.status, running: false});
    this.deck?.redraw('water reset');
  };

  private target(id: string, depth = false) {
    const {resolution} = this.domain!;
    const target = this.device!.createFramebuffer({
      id: `${this.id}-${id}`,
      width: resolution,
      height: resolution,
      colorAttachments: [depth ? 'rgba8unorm' : 'rgba32float'],
      ...(depth ? {depthStencilAttachment: 'depth32float' as const} : {})
    });
    this.targets.push(target);
    target.colorAttachments[0].texture.setSampler({
      minFilter: 'nearest',
      magFilter: 'nearest',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge'
    });
    return target;
  }

  private clear(target: Framebuffer) {
    this.device!.beginRenderPass({framebuffer: target, clearColor: [0, 0, 0, 0]}).end();
  }

  private run(model: Model, target: Framebuffer) {
    const pass = this.device!.beginRenderPass({
      framebuffer: target,
      parameters: {viewport: [0, 0, target.width, target.height]},
      clearColor: false
    });
    try {
      model.draw(pass);
    } finally {
      pass.end();
    }
  }

  private captureScene(opts: PreRenderOptions) {
    this.release();
    const device = this.device!;
    if (device.type !== 'webgl' || !device.isTextureFormatRenderable('rgba32float')) {
      throw new Error('Water simulation requires WebGL 2 with floating-point render targets.');
    }
    if (opts.viewports.length !== 1) throw new Error('Use one flat map for water simulation.');
    this.domain = createWaterDomain(opts.viewports[0], this.props.resolution);
    const {resolution} = this.domain;
    const captured = this.target('capture', true);
    this.terrain = this.target('terrain');
    this.states = [this.target('water-0'), this.target('water-1')];
    this.flux = this.target('flux');
    const parameters = {depthWriteEnabled: false, depthCompare: 'always' as const, blend: false};
    const createPass = (id: string, fs: string, modules: any[] = []) => {
      const model = new ClipSpace(device, {id: `${this.id}-${id}`, fs, modules, parameters});
      this.models.push(model);
      return model;
    };
    this.captureModel = createPass('decode', CAPTURE_FS);
    this.fluxModel = createPass('flow', FLUX_FS, [waterModule]);
    this.updateModel = createPass('update', UPDATE_FS, [waterModule]);
    this.surfaceModel = new Model(device, {
      id: `${this.id}-surface`,
      vs: SURFACE_VS,
      fs: SURFACE_FS,
      modules: [surfaceModule],
      topology: 'triangle-list',
      vertexCount: (resolution - 1) ** 2 * 6,
      parameters: {
        depthWriteEnabled: true,
        depthCompare: 'less-equal',
        blend: true,
        blendColorSrcFactor: 'one',
        blendColorDstFactor: 'one-minus-src-alpha',
        blendAlphaSrcFactor: 'one',
        blendAlphaDstFactor: 'one-minus-src-alpha',
        cullMode: 'none'
      }
    });
    this.models.push(this.surfaceModel);

    const viewports = [this.domain.viewport];
    const unpatch = patchTileViewportIds({layers: opts.layers, viewports});
    // A private canvas descriptor avoids device-pixel-ratio and framebuffer-size
    // assumptions without changing the main canvas or shared map context.
    const canvasContext = Object.create(device.canvasContext);
    canvasContext.getDrawingBufferSize = () => [resolution, resolution];
    canvasContext.cssToDeviceRatio = () => 1;
    const gl = (device as Device & {gl: WebGL2RenderingContext}).gl;
    const previousDepthRange = gl.getParameter(gl.DEPTH_RANGE);
    try {
      gl.depthRange(0, 1);
      new CapturePass(device).render({
        layers: opts.layers,
        layerFilter: opts.layerFilter,
        viewports,
        target: captured,
        canvasContext,
        pass: 'water-capture',
        clearCanvas: true,
        effects: []
      });
    } finally {
      gl.depthRange(previousDepthRange[0], previousDepthRange[1]);
      unpatch();
    }
    this.captureModel.setBindings({capturedDepth: captured.depthStencilAttachment!.texture});
    // Reuse the idle flux target as capture scratch; only the filtered terrain
    // is retained. Smoothing changes take effect on the next capture, not mid-flow.
    this.run(this.captureModel, this.flux);
    const smoothModel = createPass('smooth', SMOOTH_HEIGHT_FS, [heightFilterModule]);
    smoothModel.setBindings({terrain: this.flux.colorAttachments[0].texture});
    smoothModel.shaderInputs.setProps({
      heightFilter: {size: [resolution, resolution], strength: this.props.smoothing}
    });
    this.run(smoothModel, this.terrain);
    // One deliberate readback checks coverage and locates the captured area's
    // exterior, which may end before the texture border. Steps never read back.
    const heights = new Float32Array(resolution * resolution * 4);
    device.readPixelsToArrayWebGL(this.terrain, {target: heights});
    const valid = markWaterBoundary(heights, resolution);
    if (!valid) throw new Error('No surfaces captured. Load elevation geometry or 3D tiles first.');
    this.terrain.colorAttachments[0].texture.writeData(heights);
    this.states.forEach(target => this.clear(target));
    this.current = 0;
    this.setStatus({
      ready: true,
      running: false,
      message: `${Math.round(
        (valid / (resolution * resolution)) * 100
      )}% surface coverage · ${resolution} × ${resolution} · ${this.domain.cellSize.toFixed(
        1
      )} m cells`
    });
  }

  preRender(opts: PreRenderOptions) {
    if (!this.device || opts.isPicking) return;
    if (this.captureRequested) {
      this.captureRequested = false;
      try {
        this.captureScene(opts);
      } catch (error) {
        this.release();
        this.setStatus({
          ready: false,
          running: false,
          message: error instanceof Error ? error.message : 'Unable to capture surfaces.'
        });
      }
    }
    if (!this.status.ready) return;
    if (this.resetRequested) {
      this.resetRequested = false;
      this.states.forEach(target => this.clear(target));
      this.accumulator = 0;
    }
    if (!this.status.running) return;
    const now = performance.now();
    this.accumulator += Math.min(0.1, Math.max(0, (now - this.lastTime) / 1000)) * 10;
    this.lastTime = now;
    // Fixed simulation steps, at 10 simulated seconds per wall-clock second.
    // Cap catch-up after a suspended tab to keep work per frame bounded.
    this.accumulator = Math.min(this.accumulator, 8 * STEP);
    while (this.accumulator + 1e-9 >= STEP) {
      const water = {
        size: [this.domain!.resolution, this.domain!.resolution],
        dt: STEP,
        rain: this.props.rain,
        cellSize: this.domain!.cellSize,
        openBoundary: Number(this.props.openBoundary)
      };
      const bindings = {
        terrain: this.terrain!.colorAttachments[0].texture,
        state: this.states[this.current].colorAttachments[0].texture
      };
      this.fluxModel!.shaderInputs.setProps({water});
      this.fluxModel!.setBindings(bindings);
      this.run(this.fluxModel!, this.flux!);
      this.updateModel!.shaderInputs.setProps({water});
      this.updateModel!.setBindings({...bindings, flux: this.flux!.colorAttachments[0].texture});
      this.run(this.updateModel!, this.states[1 - this.current]);
      this.current = 1 - this.current;
      this.accumulator -= STEP;
    }
  }

  draw(renderPass: RenderPass, viewport: Viewport) {
    if (!this.status.ready || !this.domain || !this.surfaceModel) return;
    // Use local coordinates for the mesh to preserve precision at high zoom.
    const matrix = new Matrix4(viewport.viewProjectionMatrix).translate(this.domain.center);
    this.surfaceModel.shaderInputs.setProps({
      waterSurface: {
        matrix,
        span: this.domain.span,
        units: this.domain.units,
        resolution: this.domain.resolution,
        color: this.props.color.map(channel => channel / 255),
        opacity: this.props.opacity
      }
    });
    this.surfaceModel.setBindings({
      terrain: this.terrain!.colorAttachments[0].texture,
      state: this.states[this.current].colorAttachments[0].texture
    });
    this.surfaceModel.draw(renderPass);
  }

  getLayer() {
    return new WaterSurfaceLayer({
      id: `${this.id}-layer`,
      simulation: this,
      shadowEnabled: false,
      pickable: false
    });
  }

  private release() {
    this.models.forEach(model => model.destroy());
    this.targets.forEach(target => target.destroy());
    this.models = [];
    this.targets = [];
    this.states = [];
    this.terrain = this.flux = undefined;
    this.captureModel = this.fluxModel = this.updateModel = this.surfaceModel = undefined;
    this.domain = undefined;
    this.accumulator = 0;
    this.resetRequested = false;
  }
  cleanup() {
    this.release();
    this.captureRequested = false;
    this.device = undefined;
    this.deck = undefined;
    this.setStatus(INITIAL_STATUS);
  }
}

class WaterSurfaceLayer extends Layer<{simulation: WaterSimulation; shadowEnabled?: boolean}> {
  static layerName = 'WaterSimulationSurface';
  initializeState() {
    /* resources belong to the simulation effect */
  }
  draw({renderPass}: {renderPass: RenderPass}) {
    this.props.simulation.draw(renderPass, this.context.viewport);
    if (this.props.simulation.getSnapshot().running) this.setNeedsRedraw();
  }
}
