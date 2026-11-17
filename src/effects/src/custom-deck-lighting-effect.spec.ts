// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {WebMercatorViewport, shadow} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {Matrix4} from '@math.gl/core';
import CustomDeckLightingEffect, {
  alignExportShadowPass,
  patchShadowPassDepth,
  shadowMapHoverFixModule
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

describe('shadowMapHoverFixModule', () => {
  test('re-encodes shadow map depth after picking highlight', () => {
    const inject = (
      shadowMapHoverFixModule as {
        inject: Record<string, {order: number; injection: string}>;
      }
    ).inject['fs:DECKGL_FILTER_COLOR'];

    // deck.gl picking blends highlightColor at order 99, which would overwrite
    // encoded shadow depth for the hovered object.
    expect(inject.order).toBeGreaterThan(99);
    expect(inject.injection).toContain('shadow.drawShadowMap');
    expect(inject.injection).toContain('shadow_filterShadowColor');
  });
});

describe('patchShadowPassDepth', () => {
  test('forces WebGL depth writes and disables polygon offset', () => {
    const pass = {
      getLayerParameters: (_layer: unknown, _layerIndex: number, _viewport: unknown) => ({
        depthTest: true,
        depthMask: false,
        blend: true
      })
    };

    patchShadowPassDepth(pass);

    expect(pass.getLayerParameters({}, 0, null)).toMatchObject({
      depthTest: true,
      depthMask: true,
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
      device: {gl, canvasContext},
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

  test('does not override luma sizes outside export mode', () => {
    const {shadowPass} = createShadowPass();
    alignExportShadowPass(shadowPass, () => false);

    expect(shadowPass.render({viewports: [{width: 540}]})).toEqual({
      size: [1080, 608],
      ratio: 2
    });
  });
});
