// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {WebMercatorViewport, _SunLight as SunLight, shadow} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {Matrix4} from '@math.gl/core';
import CustomDeckLightingEffect, {
  alignExportShadowPass,
  patchShadowPassDepth,
  shadowMapHoverFixPlugin
} from './custom-deck-lighting-effect';

// These pass classes are exported at runtime but omitted from deck.gl's declarations.
const {_LayersPass: LayersPass, _PickLayersPass: PickLayersPass} =
  jest.requireActual('@deck.gl/core');

describe('lighting effect during picking', () => {
  afterEach(() => jest.restoreAllMocks());

  test.each(
    [
      {id: 'bitmap-edit-guides-points-circle', layerProps: {}},
      {id: 'kepler_editor_layer-geojson-polygons-fill', layerProps: {}},
      {id: 'scenegraph-layer', layerProps: {_lighting: 'pbr'}}
    ].flatMap(layer =>
      [true, false].flatMap(enabled =>
        ['color', 'depth', 'debug'].map(mode => ({...layer, enabled, mode}))
      )
    )
  )(
    'disables shadows for $id during $mode picking (enabled=$enabled)',
    ({enabled, id, layerProps, mode}) => {
      const effect = new CustomDeckLightingEffect({});
      const texture = device.createTexture({width: 1, height: 1});
      const shadowTexture = device.createTexture({width: 1, height: 1});
      const getShadowMap = jest.fn(() => shadowTexture);
      const renderShadowMap = jest.fn();
      Object.assign(effect, {
        shadow: enabled,
        dummyShadowMap: texture,
        shadowMatrices: [new Matrix4()],
        shadowPasses: [{getShadowMap, render: renderShadowMap}]
      });
      const layer = {
        id,
        props: layerProps,
        context: {
          viewport: new WebMercatorViewport({width: 800, height: 600}),
          defaultShaderModules: [shadow]
        }
      };
      const pass = new PickLayersPass(device);
      const render = jest.spyOn(LayersPass.prototype as any, '_render').mockReturnValue([]);
      try {
        effect.preRender({isPicking: true, layers: [layer]});
        // Run deck's real effect filtering for picking, then resolve the bindings
        // that the GPU draw needs even when shadow calculations are disabled.
        pass.render({
          layers: [layer],
          effects: [effect],
          isPicking: true,
          ...(mode === 'debug'
            ? {}
            : {
                pickingFBO: {},
                pickZ: mode === 'depth',
                deviceRect: {x: 0, y: 0, width: 1, height: 1}
              })
        } as any);
        const options = render.mock.calls[0][0] as any;
        const props = (pass as any)._getShaderModuleProps(
          layer,
          options.effects,
          'picking',
          {cssToDeviceRatio: () => 1},
          {}
        );
        const uniforms = shadow.getUniforms(props.shadow);
        expect(uniforms.shadow_uShadowMap0).toBe(texture);
        expect(uniforms.shadow_uShadowMap1).toBe(texture);
        expect(uniforms.drawShadowMap).toBe(false);
        expect(uniforms.useShadowMap).toBe(false);
        expect(props.shadow.useSimplePhong).toBeFalsy();
        expect(props.lighting.enabled).toBe(false);
        expect(props.pbrMaterial.unlit).toBe(1);
        expect(props.picking.isActive).toBe(1);
        if (mode !== 'debug') expect(props.picking.isAttribute).toBe(mode === 'depth');
        expect(renderShadowMap).not.toHaveBeenCalled();
        expect(getShadowMap).not.toHaveBeenCalled();
      } finally {
        texture.destroy();
        shadowTexture.destroy();
      }
    }
  );

  test('does not render shadow maps during picking', () => {
    const effect = new CustomDeckLightingEffect({});
    const render = jest.fn();
    Object.assign(effect, {shadow: true, shadowPasses: [{render}]});

    effect.preRender({isPicking: true, layers: []});

    expect(render).not.toHaveBeenCalled();
  });

  test('restores shadow rendering and sampling on the next normal draw', () => {
    const effect = new CustomDeckLightingEffect({});
    const dummyTexture = device.createTexture({width: 1, height: 1});
    const shadowTexture = device.createTexture({width: 1, height: 1});
    const render = jest.fn();
    Object.assign(effect, {
      shadow: true,
      dummyShadowMap: dummyTexture,
      shadowPasses: [{getShadowMap: () => shadowTexture, render}]
    });
    const viewport = new WebMercatorViewport({width: 800, height: 600});
    const layer = {id: 'scenegraph-layer', props: {_lighting: 'pbr'}};
    let expectedShadowRenders = 0;
    try {
      for (const isPicking of [false, true, true, false]) {
        effect.preRender({
          layers: [layer],
          viewports: [viewport],
          ...(isPicking ? {isPicking} : {})
        });
        const props = effect.getShaderModuleProps(layer, {project: {viewport}}) as any;
        const uniforms = shadow.getUniforms(props.shadow);
        expect(uniforms.useShadowMap).toBe(!isPicking);
        expect(uniforms.drawShadowMap).toBe(false);
        expect(uniforms.shadow_uShadowMap0).toBe(isPicking ? dummyTexture : shadowTexture);
        expect(Boolean(props.shadow.useSimplePhong)).toBe(!isPicking);
        if (!isPicking) expectedShadowRenders++;
        expect(render).toHaveBeenCalledTimes(expectedShadowRenders);
      }
    } finally {
      dummyTexture.destroy();
      shadowTexture.destroy();
    }
  });
});

describe('lighting effect with shadows turned on after setup', () => {
  test('creates the shadow passes and the shadow module on the next draw', () => {
    const effect = new CustomDeckLightingEffect({
      sunLight: new SunLight({timestamp: Date.UTC(2026, 5, 21, 12), _shadow: true})
    });
    const deck = {_addDefaultShaderPlugin: jest.fn(), _removeDefaultShaderPlugin: jest.fn()};
    const context = {device, deck} as any;
    const state = effect as any;

    // A map loaded with Light & Shadow disabled: computeDeckEffects turns the
    // shadows off before deck.gl sets the effect up.
    state.shadow = false;
    effect.setup(context);
    expect(state.shadowPasses).toHaveLength(0);
    expect(deck._addDefaultShaderPlugin).not.toHaveBeenCalled();

    // The user enables the effect: updateEffect sets `shadow` directly.
    state.shadow = true;
    try {
      effect.preRender({
        layers: [],
        viewports: [new WebMercatorViewport({width: 800, height: 600})]
      } as any);
      expect(state.shadowPasses).toHaveLength(1);
      expect(state.dummyShadowMap).toBeTruthy();
      expect(deck._addDefaultShaderPlugin).toHaveBeenCalledWith(
        expect.objectContaining({name: shadow.name})
      );
    } finally {
      effect.cleanup(context);
    }
  });
});

describe('shadowMapHoverFixPlugin', () => {
  test('re-encodes shadow map depth after picking highlight', () => {
    const inject = shadowMapHoverFixPlugin.injections[0];

    // deck.gl picking blends highlightColor at order 99, which would overwrite
    // encoded shadow depth for the hovered object.
    expect(inject.order).toBeGreaterThan(99);
    expect(inject.glsl).toContain('shadow.drawShadowMap');
    expect(inject.glsl).toContain('shadow_filterShadowColor');
  });
});

describe('patchShadowPassDepth', () => {
  test('forces WebGL depth writes and disables polygon offset', () => {
    const pass = {
      getLayerParameters: (_layer: unknown, _layerIndex: number, _viewport: unknown) => ({
        depthCompare: 'less-equal',
        depthWriteEnabled: false,
        blend: true
      })
    };

    patchShadowPassDepth(pass);

    expect(pass.getLayerParameters({}, 0, null)).toMatchObject({
      depthCompare: 'less-equal',
      depthWriteEnabled: true,
      polygonOffsetFill: false,
      polygonOffset: [0, 0]
    });
  });
});

describe('alignExportShadowPass', () => {
  function createShadowPass() {
    const canvasContext = {
      getDrawingBufferSize: jest.fn((): [number, number] => [1080, 608]),
      cssToDeviceRatio: jest.fn(() => 2)
    };
    const gl = {
      drawingBufferWidth: 1920,
      drawingBufferHeight: 1080,
      DEPTH_RANGE: 0x0b70,
      depthRange: jest.fn(),
      getParameter: jest.fn(() => [0, 0.979])
    };
    const shadowPass = {
      device: {type: 'webgl', gl, canvasContext, limits: {maxTextureDimension2D: 4096}},
      render: jest.fn((_params?: unknown) => ({
        size: canvasContext.getDrawingBufferSize(),
        ratio: canvasContext.cssToDeviceRatio()
      }))
    };
    return {shadowPass, canvasContext, gl};
  }

  test('sizes the shadow pass to the live GL buffer during export, then restores', () => {
    const {shadowPass, canvasContext, gl} = createShadowPass();
    const originalSize = canvasContext.getDrawingBufferSize;
    const originalRatio = canvasContext.cssToDeviceRatio;
    alignExportShadowPass(shadowPass, () => true);

    expect(shadowPass.render({viewports: [{width: 540}]})).toEqual({
      size: [1920, 1080],
      ratio: 1920 / 540
    });
    expect(canvasContext.getDrawingBufferSize).toBe(originalSize);
    expect(canvasContext.cssToDeviceRatio).toBe(originalRatio);
    expect(canvasContext.getDrawingBufferSize()).toEqual([1080, 608]);
    expect(canvasContext.cssToDeviceRatio()).toBe(2);
    expect(gl.depthRange.mock.calls).toEqual([
      [0, 1],
      [0, 0.979]
    ]);
  });

  test.each([
    [0.5, 1, [540, 304]],
    [1.5, 3, [1620, 912]]
  ])('uses shadow resolution %s for the pass only', (scale, ratio, size) => {
    const {shadowPass, canvasContext, gl} = createShadowPass();
    alignExportShadowPass(
      shadowPass,
      () => false,
      () => scale
    );
    expect(shadowPass.render({viewports: [{width: 540, height: 304}]})).toEqual({ratio, size});
    expect(canvasContext.cssToDeviceRatio()).toBe(2);
    expect(canvasContext.getDrawingBufferSize()).toEqual([1080, 608]);
    expect(gl.depthRange).not.toHaveBeenCalled();
  });

  test('bounds High by hardware texture size and total pixels without reducing Auto', () => {
    const {shadowPass, canvasContext} = createShadowPass();
    alignExportShadowPass(
      shadowPass,
      () => false,
      () => 1.5
    );
    const viewport = {width: 1200, height: 1200};
    const result = shadowPass.render({viewports: [viewport]});
    expect(result.ratio).toBeGreaterThan(2);
    expect(result.size[0] * result.size[1]).toBeLessThanOrEqual(8e6);
    shadowPass.device.limits.maxTextureDimension2D = 2500;
    expect(shadowPass.render({viewports: [viewport]}).size).toEqual([2500, 2500]);
    shadowPass.device.limits.maxTextureDimension2D = 2000;
    expect(shadowPass.render({viewports: [viewport]})).toEqual({
      ratio: 2,
      size: canvasContext.getDrawingBufferSize()
    });
  });

  test('ignores experimental resolution in export, multi-viewport and non-WebGL passes', () => {
    const {shadowPass} = createShadowPass();
    let exporting = true;
    alignExportShadowPass(
      shadowPass,
      () => exporting,
      () => 0.5
    );
    const viewport = {width: 540, height: 304};
    expect(shadowPass.render({viewports: [viewport]}).size).toEqual([1920, 1080]);
    exporting = false;
    expect(shadowPass.render({viewports: [viewport, viewport]}).ratio).toBe(2);
    shadowPass.device.type = 'webgpu';
    expect(shadowPass.render({viewports: [viewport]}).ratio).toBe(2);
  });

  test('releases replaced and final attachments when opting into a different resolution', () => {
    const {shadowPass} = createShadowPass();
    const makeTexture = () => ({destroy: jest.fn()});
    const originalColor = makeTexture();
    const originalDepth = makeTexture();
    const owned = new Set<ReturnType<typeof makeTexture>>();
    const fbo = {
      colorAttachments: [{texture: originalColor}],
      depthStencilAttachment: {texture: originalDepth},
      attachResource: texture => owned.add(texture),
      destroyAttachedResource: texture => {
        if (owned.delete(texture)) texture.destroy();
      },
      resize() {
        this.colorAttachments[0].texture = makeTexture();
        this.depthStencilAttachment.texture = makeTexture();
      }
    };
    const pass = {
      ...shadowPass,
      fbo,
      render: (_params: unknown) => fbo.resize()
    };
    let scale = 0.5;
    alignExportShadowPass(
      pass,
      () => false,
      () => scale
    );
    const params = {viewports: [{width: 540, height: 304}]};
    pass.render(params);
    expect(originalColor.destroy).toHaveBeenCalledTimes(1);
    expect(originalDepth.destroy).toHaveBeenCalledTimes(1);
    const lowColor = fbo.colorAttachments[0].texture;

    scale = 1;
    pass.render(params);
    expect(lowColor.destroy).toHaveBeenCalledTimes(1);
    expect([...owned]).toEqual([
      fbo.colorAttachments[0].texture,
      fbo.depthStencilAttachment.texture
    ]);
  });

  test('restores the shadow-only canvas overrides after a render failure', () => {
    const {shadowPass, canvasContext} = createShadowPass();
    const {cssToDeviceRatio, getDrawingBufferSize} = canvasContext;
    shadowPass.render.mockImplementationOnce(() => {
      expect(canvasContext.cssToDeviceRatio()).toBe(1);
      throw new Error('render error');
    });
    alignExportShadowPass(
      shadowPass,
      () => false,
      () => 0.5
    );
    expect(() => shadowPass.render({viewports: [{width: 540, height: 304}]})).toThrow(
      'render error'
    );
    expect(canvasContext.cssToDeviceRatio).toBe(cssToDeviceRatio);
    expect(canvasContext.getDrawingBufferSize).toBe(getDrawingBufferSize);
  });

  test('does not override luma sizes outside export mode', () => {
    const {shadowPass} = createShadowPass();
    alignExportShadowPass(shadowPass, () => false);

    expect(shadowPass.render({viewports: [{width: 540}]})).toEqual({
      size: [1080, 608],
      ratio: 2
    });
  });
});
