// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {DEFAULT_GLOBE_CONFIG} from '@kepler.gl/constants';
import {
  atmosphereZoomFade,
  getGlobeAtmosphereLayer,
  getGlobeAtmosphereSkyLayer,
  getGlobeHugeHaloLayer
} from './atmosphere-layer';
import {getGlobeDepthDiskLayer} from './globe-depth-disk-layer';

// Exercise uniform delivery without creating a WebGL device.
function draw(
  layer: any,
  cameraPosition = [512, 512, 256],
  model: any = {props: {uniforms: {existing: 7}}}
) {
  layer.state = {model};
  layer.context = {viewport: {cameraPosition}};
  layer.draw({uniforms: {projection: 1}});
  return model?.props.uniforms;
}

describe('globe atmosphere and occlusion uniforms', () => {
  beforeEach(() =>
    jest.spyOn(SimpleMeshLayer.prototype, 'draw').mockImplementation(() => undefined)
  );
  afterEach(() => jest.restoreAllMocks());

  test('fades smoothly only between continent and close-up zooms', () => {
    expect([-2, 0, 3.5].map(atmosphereZoomFade)).toEqual([1, 1, 1]);
    expect(atmosphereZoomFade(4.75)).toBeCloseTo(0.5);
    expect([6, 12].map(atmosphereZoomFade)).toEqual([0, 0]);
    const fades = [3.5, 4, 4.75, 5.5, 6].map(atmosphereZoomFade);
    expect(fades).toEqual([...fades].sort((a, b) => b - a));
  });

  test.each([getGlobeAtmosphereLayer, getGlobeAtmosphereSkyLayer])(
    'propagates zoom and manual sun direction while preserving existing uniforms',
    factory => {
      const layer = factory({
        config: {...DEFAULT_GLOBE_CONFIG, azimuth: true, azimuthAngle: 90},
        zoom: 4.75
      });
      const uniforms = draw(layer);
      expect(uniforms.existing).toBe(7);
      expect(uniforms.fAtmosphereZoomFade).toBeCloseTo(0.5);
      expect(uniforms.v3SunPos[0]).toBeCloseTo(1);
      expect(uniforms.v3SunPos[1]).toBeCloseTo(0);
      expect(SimpleMeshLayer.prototype.draw).toHaveBeenCalledWith({uniforms: {projection: 1}});
      expect(() => draw(layer, undefined, null)).not.toThrow();
    }
  );

  test('disables terminator opacity independently of its saved strength', () => {
    const config = {...DEFAULT_GLOBE_CONFIG, terminatorOpacity: 0.4};
    expect(
      draw(getGlobeAtmosphereLayer({config: {...config, terminator: false}}))
        .fTerminatorOpacityFactor
    ).toBe(0);
    expect(
      draw(getGlobeAtmosphereLayer({config: {...config, terminator: true}}))
        .fTerminatorOpacityFactor
    ).toBe(0.4);
  });

  test('does not create a disabled halo', () => {
    expect(getGlobeHugeHaloLayer({config: {...DEFAULT_GLOBE_CONFIG, hugeHalo: false}})).toBeNull();
  });

  test.each([-10, 0.05, 1, 3.5, 20, NaN])(
    'clamps halo radius %s without changing the input config',
    radius => {
      const config = Object.freeze({
        ...DEFAULT_GLOBE_CONFIG,
        hugeHalo: true,
        hugeHaloRadius: radius
      });
      const layer = getGlobeHugeHaloLayer({config})!;
      const resolved = Number.isFinite(radius) ? radius : DEFAULT_GLOBE_CONFIG.hugeHaloRadius;
      expect(layer.props.sizeScale).toBeCloseTo(
        (258 + 36 * Math.max(0.05, Math.min(3.5, resolved))) / 294
      );
    }
  );

  test.each([
    [-1, 0],
    [0, 0],
    [0.4, 0.4],
    [2, 1],
    [NaN, DEFAULT_GLOBE_CONFIG.hugeHaloOpacity]
  ])('clamps halo opacity %s to %s', (opacity, expected) => {
    const layer = getGlobeHugeHaloLayer({
      config: {...DEFAULT_GLOBE_CONFIG, hugeHalo: true, hugeHaloOpacity: opacity},
      zoom: 6
    })!;
    expect(draw(layer)).toMatchObject({
      existing: 7,
      fHaloOpacity: expected,
      fAtmosphereZoomFade: 0
    });
    expect(() => draw(layer, undefined, null)).not.toThrow();
  });

  test.each([
    [512, 0, 0],
    [512, 512, 256],
    [-512, -256, 256]
  ])('orients the depth disk toward camera (%s,%s,%s)', (x, y, z) => {
    const uniforms = draw(getGlobeDepthDiskLayer({}), [x, y, z]);
    const axes = [
      uniforms.u_depthDiskOrientCol0,
      uniforms.u_depthDiskOrientCol1,
      uniforms.u_depthDiskOrientCol2
    ];
    for (const axis of axes) expect(Math.hypot(...axis)).toBeCloseTo(1);
    const dot = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + value * b[i], 0);
    expect(dot(axes[0], axes[1])).toBeCloseTo(0);
    expect(dot(axes[0], axes[2])).toBeCloseTo(0);
    expect(dot(axes[1], axes[2])).toBeCloseTo(0);
    expect(axes[2]).toEqual(uniforms.u_directionToCamera);
    expect(dot(axes[2], [x, y, z])).toBeCloseTo(Math.hypot(x, y, z));
    expect(Number.isFinite(uniforms.u_depthDiskRadius)).toBe(true);
    expect(uniforms.u_depthDiskRadius).toBeGreaterThan(0);
    expect(Number.isFinite(uniforms.u_depthDiskShift)).toBe(true);
    expect(uniforms.existing).toBe(7);
  });

  test('keeps the depth disk drawable before its model exists and honors fill color', () => {
    const layer = getGlobeDepthDiskLayer({fillColor: [10, 20, 30]});
    expect(layer.props.getColor).toEqual([10, 20, 30]);
    expect(() => draw(layer, undefined, null)).not.toThrow();
  });
});
