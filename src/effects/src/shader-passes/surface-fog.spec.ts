// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import {WebMercatorViewport} from '@deck.gl/core';
import {DeckSurfaceFogEffect} from './surface-fog';

jest.mock('@luma.gl/engine', () => ({
  ...jest.requireActual('@luma.gl/engine'),
  ClipSpace: jest.fn()
}));

const SIZE = 16;
const SOURCE = [180, 140, 110, 255];

describe('surface fog rendering', () => {
  let gl: WebGLRenderingContext;
  let program: WebGLProgram;
  let sourceTexture: WebGLTexture;
  let depthTexture: WebGLTexture;

  function shader(type: number, source: string): WebGLShader {
    const result = gl.createShader(type)!;
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(result) || 'Shader compilation failed');
    }
    return result;
  }

  function texture(unit: number): WebGLTexture {
    const result = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, result);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return result;
  }

  function uniform(name: string, value: number | number[]) {
    const location = gl.getUniformLocation(program, `surfaceFog.${name}`);
    if (Array.isArray(value)) {
      if (value.length === 4) gl.uniform4fv(location, value);
      else if (value.length === 2) gl.uniform2fv(location, value);
      else gl.uniform3fv(location, value);
    } else {
      gl.uniform1f(location, value);
    }
  }

  function render({
    depth = 0.6,
    source = SOURCE,
    uniforms = {},
    size = SIZE
  }: {
    depth?: number;
    source?: number[];
    uniforms?: Record<string, number | number[]>;
    size?: number;
  } = {}): number[] {
    if (gl.drawingBufferWidth !== size) {
      gl.getExtension('STACKGL_resize_drawingbuffer').resize(size, size);
      gl.viewport(0, 0, size, size);
    }
    const defaults = {
      density: 1,
      fogHeight: 50,
      fogThickness: 20,
      fogColor: [40, 120, 190],
      invCol0: [1, 0, 0, 0],
      invCol1: [0, 1, 0, 0],
      invCol2: [0, 0, -1000, 0],
      invCol3: [240, 140, 0, 1],
      viewportWidth: SIZE,
      viewportHeight: SIZE,
      unitsPerMeter: 1,
      waveUnitsPerMeter: 1,
      waveOrigin: [0, 0],
      cameraHeight: 1000,
      pattern: 1
    };
    for (const [name, value] of Object.entries({...defaults, ...uniforms})) {
      uniform(name, value);
    }
    expect({stage: 'uniforms', error: gl.getError()}).toEqual({
      stage: 'uniforms',
      error: gl.NO_ERROR
    });
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(source)
    );
    expect({stage: 'source', error: gl.getError()}).toEqual({stage: 'source', error: gl.NO_ERROR});
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      1,
      1,
      gl.RGBA,
      gl.FLOAT,
      new Float32Array([depth, depth, depth, 1])
    );
    expect({stage: 'depth', error: gl.getError()}).toEqual({stage: 'depth', error: gl.NO_ERROR});
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    expect({stage: 'draw', error: gl.getError()}).toEqual({stage: 'draw', error: gl.NO_ERROR});
    const pixels = new Uint8Array(size * size * 4);
    gl.readPixels(0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    expect(gl.getError()).toBe(gl.NO_ERROR);
    return Array.from(pixels);
  }

  function center(pixels: number[]): number[] {
    const offset = ((SIZE / 2) * SIZE + SIZE / 2) * 4;
    return pixels.slice(offset, offset + 4);
  }

  function viewportUniforms(viewport: {
    width: number;
    height: number;
    center: number[];
    cameraPosition: number[];
    latitude?: number;
    pixelUnprojectionMatrix: number[];
    distanceScales: {unitsPerMeter: number[]};
  }): Record<string, number | number[]> {
    const setProps = jest.fn();
    const device = {beginRenderPass: () => ({end: jest.fn()})};
    (ClipSpace as jest.MockedClass<typeof ClipSpace>).mockImplementationOnce(
      () => ({device, shaderInputs: {setProps}, draw: jest.fn()} as unknown as ClipSpace)
    );
    const effect = new DeckSurfaceFogEffect({pattern: true, density: 1, fogColor: [40, 120, 190]});
    effect.setup({device});
    effect.postRender({
      inputBuffer: {width: SIZE, height: SIZE, colorAttachments: [{}], depthStencilAttachment: {}},
      swapBuffer: {},
      viewports: [viewport]
    });
    const uniforms = setProps.mock.calls[0][0].surfaceFog;
    delete uniforms.texDepth;
    return uniforms;
  }

  function croppedViewport({
    zoom = 20,
    pitch = 50,
    longitude = 30.52,
    latitude = 50.45,
    bearing = 35,
    nearZMultiplier = 0.1
  } = {}) {
    const viewport = new WebMercatorViewport({
      width: 1024,
      height: 768,
      longitude,
      latitude,
      zoom,
      pitch,
      bearing,
      nearZMultiplier
    });
    // Render a small crop at native resolution, not a downscaled whole map.
    const matrix = [...viewport.pixelUnprojectionMatrix];
    for (let row = 0; row < 4; row++) {
      matrix[12 + row] += matrix[row] * (512 - SIZE / 2) + matrix[4 + row] * (384 - SIZE / 2);
    }
    return {
      width: SIZE,
      height: SIZE,
      center: [...viewport.center],
      cameraPosition: [...viewport.cameraPosition],
      latitude: viewport.latitude,
      pixelUnprojectionMatrix: matrix,
      distanceScales: viewport.distanceScales
    };
  }

  function maxPixelDifference(a: number[], b: number[]): number {
    return Math.max(...a.map((value, i) => Math.abs(value - b[i])));
  }

  function visibleSceneContrast(options: Parameters<typeof render>[0]): number {
    const dark = render({...options, source: [0, 0, 0, 255]});
    const light = render({...options, source: [255, 255, 255, 255]});
    return maxPixelDifference(dark, light);
  }

  beforeAll(() => {
    // Exercise the actual fragment shader without a browser. headless-gl exposes
    // WebGL 1: adapt only GLSL interface syntax, preserving all shading math.
    gl = require('gl')(SIZE, SIZE, {preserveDrawingBuffer: true});
    expect(gl).toBeTruthy();
    expect(gl.getExtension('OES_standard_derivatives')).toBeTruthy();
    expect(gl.getExtension('OES_texture_float')).toBeTruthy();
    const effect = new DeckSurfaceFogEffect();
    effect.setup({device: {}});
    const options = (ClipSpace as jest.MockedClass<typeof ClipSpace>).mock.calls[0][1];
    const uniformBlock = effect.module.fs
      .replace('uniform surfaceFogUniforms', 'struct surfaceFogUniforms')
      .replace('} surfaceFog;', '};\nuniform surfaceFogUniforms surfaceFog;');
    const fragment = options
      .fs!.replace('#version 300 es', '#extension GL_OES_standard_derivatives : enable')
      .replace('precision highp float;', `precision highp float;\n${uniformBlock}`)
      .replace(/in vec2 /g, 'varying vec2 ')
      .replace('out vec4 fragColor;', '')
      .replace(/\bfragColor\b/g, 'gl_FragColor')
      .replace(/\btexture\(/g, 'texture2D(');
    program = gl.createProgram()!;
    gl.attachShader(
      program,
      shader(
        gl.VERTEX_SHADER,
        `
      attribute vec2 vertex;
      varying vec2 coordinate;
      void main() {
        coordinate = vertex * 0.5 + 0.5;
        gl_Position = vec4(vertex, 0.0, 1.0);
      }
    `
      )
    );
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Shader linking failed');
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const vertex = gl.getAttribLocation(program, 'vertex');
    gl.enableVertexAttribArray(vertex);
    gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);
    sourceTexture = texture(0);
    depthTexture = texture(1);
    // headless-gl allocates immutable storage for float textures; subsequent
    // frames must update the contents rather than reallocate that storage.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
    gl.uniform1i(gl.getUniformLocation(program, 'texSrc'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'texDepth'), 1);
    gl.disable(gl.DITHER);
    expect({stage: 'setup', error: gl.getError()}).toEqual({stage: 'setup', error: gl.NO_ERROR});
  });

  afterAll(() => {
    gl?.getExtension('STACKGL_destroy_context')?.destroy();
  });

  test('preserves pixels above the water', () => {
    expect(center(render({depth: 0.4}))).toEqual(SOURCE);
  });

  test.each([0, 1])('preserves every source pixel at zero density with pattern=%s', pattern => {
    for (const source of [SOURCE, [40, 60, 80, 128], [0, 0, 0, 0]]) {
      const pixels = render({source, uniforms: {density: 0, pattern}});
      expect(pixels.every((value, index) => value === source[index % 4])).toBe(true);
    }
  });

  test('preserves the plain fog color when pattern is disabled', () => {
    expect(center(render({uniforms: {pattern: 0}}))).toEqual([40, 120, 190, 255]);
  });

  test('supports a zero-width transition at the exact water level', () => {
    const uniforms = {fogHeight: 0, fogThickness: 0, pattern: 0};
    expect(center(render({depth: 0.5, uniforms}))).toEqual([40, 120, 190, 255]);
    expect(center(render({depth: 0.49, uniforms}))).toEqual(SOURCE);
    expect(center(render({depth: 0.51, uniforms}))).toEqual([40, 120, 190, 255]);
  });

  test('regular fog transition still fades above the elevation', () => {
    // Geometry at 100m, fog level 50m: a 100m transition puts it halfway
    // through the fade, while a 25m transition leaves it completely untouched.
    const narrow = center(render({depth: 0.45, uniforms: {pattern: 0, fogThickness: 25}}));
    const wide = center(render({depth: 0.45, uniforms: {pattern: 0, fogThickness: 100}}));
    expect(narrow).toEqual(SOURCE);
    expect(wide[0]).toBeLessThan(SOURCE[0] - 40);
    expect(wide[2]).toBeGreaterThan(SOURCE[2] + 25);
    expect(center(render({depth: 0.4, uniforms: {pattern: 0, fogThickness: 100}}))).toEqual(SOURCE);
  });

  test.each([0, 100, 1000])(
    'water transition=%s never tints geometry or basemap above the surface',
    fogThickness => {
      expect(center(render({depth: 0.45, uniforms: {fogThickness}}))).toEqual(SOURCE);
      expect(center(render({depth: 1, uniforms: {fogHeight: -50, fogThickness}}))).toEqual(SOURCE);
    }
  );

  test.each([0, -10])(
    'water transition=%s is opaque at full density, including the surface',
    fogThickness => {
      for (const depth of [0.5, 0.51, 1]) {
        expect(visibleSceneContrast({depth, uniforms: {fogHeight: 0, fogThickness}})).toBe(0);
      }
    }
  );

  test.each([0, -10])(
    'water transition=%s removes all shading from submerged geometry depth',
    fogThickness => {
      const views: Record<string, number | number[]>[] = [{}, {invCol2: [1000, 0, -1000, 0]}];
      for (const view of views) {
        const uniforms = {...view, fogHeight: 0, fogThickness};
        const atSurface = render({depth: 0.5, uniforms});
        // Include the contact band, deeper geometry, and the basemap. Only the
        // bottom depth changes; the view ray hits the same point on the water.
        for (const depth of [0.50025, 0.505, 0.55, 0.9, 1]) {
          expect(render({depth, uniforms})).toEqual(atSurface);
        }
      }
    }
  );

  test.each([25, 50, 75])(
    'water color at %sm depth follows the transition range rather than a fixed darkening distance',
    meters => {
      const original = render({
        depth: 0.475 + meters / 2000,
        uniforms: {fogThickness: 100}
      });
      const scaled = render({
        depth: 0.475 + (meters * 2) / 2000,
        uniforms: {fogThickness: 200}
      });
      expect(maxPixelDifference(original, scaled)).toBeLessThanOrEqual(1);
    }
  );

  test('water color stops changing with bottom depth at the end of the transition', () => {
    const uniforms = {fogHeight: 0, fogThickness: 32, invCol2: [0, 0, -512, 0]};
    const atLimit = render({depth: 0.53125, uniforms}); // 32m below water
    expect(render({depth: 0.75, uniforms})).toEqual(atLimit); // 256m below water
  });

  test('water transition controls the depth at which submerged details disappear', () => {
    // Geometry is 10m below the water: invisible with a 5m/10m visibility depth,
    // partly visible at 20m, and clearer when visibility is increased to 50m.
    const contrast = (fogThickness: number) =>
      visibleSceneContrast({
        depth: 0.48,
        uniforms: {fogThickness}
      });
    expect(contrast(5)).toBe(0);
    expect(contrast(10)).toBe(0);
    const partial = contrast(20);
    expect(partial).toBeGreaterThan(0);
    expect(contrast(50)).toBeGreaterThan(partial);
  });

  test('water visibility fades with depth and hides the basemap beyond the transition', () => {
    const uniforms = {fogThickness: 40};
    const shallow = visibleSceneContrast({depth: 0.48, uniforms}); // 10m below water
    const deeper = visibleSceneContrast({depth: 0.49, uniforms}); // 30m below water
    expect(shallow).toBeGreaterThan(deeper);
    expect(deeper).toBeGreaterThan(0);
    expect(visibleSceneContrast({depth: 1, uniforms})).toBe(0); // basemap is 50m below water
  });

  test('water visibility depth uses meters regardless of the viewport distance scale', () => {
    const original = render({depth: 0.48, uniforms: {fogThickness: 20}});
    const scaled = render({
      depth: 0.48,
      uniforms: {
        fogHeight: 100,
        fogThickness: 40,
        unitsPerMeter: 2,
        invCol2: [0, 0, -2000, 0]
      }
    });
    expect(scaled).toEqual(original);
  });

  test('density still controls overall opacity independently of visibility depth', () => {
    expect(visibleSceneContrast({depth: 0.48, uniforms: {fogThickness: 0, density: 1}})).toBe(0);
    expect(
      visibleSceneContrast({depth: 0.48, uniforms: {fogThickness: 0, density: 0.5}})
    ).toBeGreaterThan(0);
  });

  test('keeps deep-water waves continuous over different submerged elevations', () => {
    const shallowGeometry = render({depth: 0.8});
    const deepGeometry = render({depth: 0.9});
    // At these depths absorption is saturated. Surface shading must not move
    // with the geometry below it, including when the view is tilted.
    const tilted = {invCol2: [1000, 0, -1000, 0], invCol3: [290, 140, 0, 1]};
    const tiltedShallow = render({depth: 0.8, uniforms: tilted});
    const tiltedDeep = render({depth: 0.9, uniforms: tilted});
    expect(
      Math.max(...shallowGeometry.map((value, i) => Math.abs(value - deepGeometry[i])))
    ).toBeLessThanOrEqual(1);
    expect(
      Math.max(...tiltedShallow.map((value, i) => Math.abs(value - tiltedDeep[i])))
    ).toBeLessThanOrEqual(1);
  });

  test('changes reflections with the view direction at the same water position', () => {
    const overhead = render();
    const tilted = render({
      uniforms: {
        invCol2: [1000, 0, -1000, 0],
        invCol3: [290, 140, 0, 1]
      }
    });
    expect(tilted).not.toEqual(overhead);
  });

  test('retains more of the scene in shallow water', () => {
    const dark = [0, 0, 0, 255];
    const light = [255, 255, 255, 255];
    const difference = (depth: number) => {
      const a = center(render({depth, source: dark}));
      const b = center(render({depth, source: light}));
      return b.slice(0, 3).reduce((total, value, i) => total + Math.abs(value - a[i]), 0);
    };
    expect(difference(0.48)).toBeGreaterThan(difference(0.8));
  });

  test('filters out waves smaller than a pixel at distant zoom levels', () => {
    const pixels = render({
      uniforms: {
        invCol0: [1000, 0, 0, 0],
        invCol1: [0, 1000, 0, 0]
      }
    });
    const pixel = center(pixels);
    expect(pixels.every((value, index) => value === pixel[index % 4])).toBe(true);
  });

  test.each([
    [12, 0],
    [12, 55],
    [13, 0],
    [13, 55]
  ])(
    'filters unresolved ripples at city zoom %s and pitch %s instead of showing large swells',
    (zoom, pitch) => {
      const uniforms = viewportUniforms(croppedViewport({zoom, pitch}));
      uniforms.fogHeight = 0;
      uniforms.fogThickness = 0;
      const pixels = render({depth: 1, uniforms});
      // Keep the same view and lighting, but make all wavelengths subpixel to
      // obtain the smooth-water limit. City views must not invent large waves
      // just to keep the texture visible when ordinary ripples cannot resolve.
      const smooth = render({
        depth: 1,
        uniforms: {
          ...uniforms,
          waveUnitsPerMeter: (uniforms.waveUnitsPerMeter as number) / 1024
        }
      });
      expect(maxPixelDifference(pixels, smooth)).toBeLessThanOrEqual(1);
    }
  );

  test('retains resolved ripples in a neighborhood view', () => {
    const uniforms = viewportUniforms(croppedViewport({zoom: 18, pitch: 65}));
    uniforms.fogHeight = 0;
    uniforms.fogThickness = 0;
    const pixels = render({depth: 1, uniforms});
    const smooth = render({
      depth: 1,
      uniforms: {
        ...uniforms,
        waveUnitsPerMeter: (uniforms.waveUnitsPerMeter as number) / 1024
      }
    });
    expect(pixels).not.toEqual(smooth);
  });

  test.each([14, 16, 18])(
    'keeps water sampling stable between 1x and 2x resolution at zoom %s',
    zoom => {
      const uniforms = viewportUniforms(croppedViewport({zoom, pitch: 55}));
      uniforms.fogHeight = 0;
      uniforms.fogThickness = 0;
      const native = render({depth: 1, uniforms});
      const retina = render({depth: 1, uniforms, size: SIZE * 2});
      let totalError = 0;
      let maxError = 0;
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          for (let channel = 0; channel < 3; channel++) {
            let average = 0;
            for (let dy = 0; dy < 2; dy++) {
              for (let dx = 0; dx < 2; dx++) {
                average += retina[((y * 2 + dy) * SIZE * 2 + x * 2 + dx) * 4 + channel] / 4;
              }
            }
            const error = Math.abs(native[(y * SIZE + x) * 4 + channel] - average);
            totalError += error;
            maxError = Math.max(maxError, error);
          }
        }
      }
      // A higher-resolution render may resolve more detail, but averaging it
      // back down should not produce a different sheen or isolated bright pixels.
      expect(totalError / (SIZE * SIZE * 3)).toBeLessThan(2);
      expect(maxError).toBeLessThan(8);
    }
  );

  test.each([
    [1, 0],
    [0, 1],
    [3, 7]
  ])('does not repeat ripples after a 4km tile offset (%s, %s)', (x, y) => {
    const original = render();
    const shifted = render({uniforms: {waveOrigin: [x, y]}});
    expect(shifted).not.toEqual(original);
  });

  test('keeps water shading consistent when rendering an image in tiles', () => {
    const viewport = croppedViewport({zoom: 18, pitch: 65});
    const surface = {fogHeight: 0, fogThickness: 0};
    const full = render({depth: 1, uniforms: {...viewportUniforms(viewport), ...surface}});
    const tileSize = SIZE / 2;
    let maxError = 0;
    for (const y of [0, tileSize]) {
      for (const x of [0, tileSize]) {
        const matrix = [...viewport.pixelUnprojectionMatrix];
        for (let row = 0; row < 4; row++) {
          matrix[12 + row] += matrix[row] * x + matrix[4 + row] * y;
        }
        const tile = render({
          depth: 1,
          size: tileSize,
          uniforms: {
            ...viewportUniforms({
              ...viewport,
              width: tileSize,
              height: tileSize,
              pixelUnprojectionMatrix: matrix
            }),
            ...surface
          }
        });
        // Projection Y is top-down; readPixels returns rows bottom-up.
        for (let row = 0; row < tileSize; row++) {
          for (let col = 0; col < tileSize; col++) {
            const fullOffset = ((SIZE - y - tileSize + row) * SIZE + x + col) * 4;
            const tileOffset = (row * tileSize + col) * 4;
            for (let channel = 0; channel < 4; channel++) {
              maxError = Math.max(
                maxError,
                Math.abs(full[fullOffset + channel] - tile[tileOffset + channel])
              );
            }
          }
        }
      }
    }
    expect(maxError).toBeLessThanOrEqual(1);
  });

  test('retains close-up wave detail at global Mercator coordinates', () => {
    const global = croppedViewport();
    const globalUniforms = viewportUniforms(global);
    const units = globalUniforms.waveUnitsPerMeter as number;
    const tile = 4096 * units;
    const offset = global.center.map(value => Math.floor(value / tile) * tile);
    const localMatrix = [...global.pixelUnprojectionMatrix];
    for (let column = 0; column < 4; column++) {
      localMatrix[column * 4] -= offset[0] * localMatrix[column * 4 + 3];
      localMatrix[column * 4 + 1] -= offset[1] * localMatrix[column * 4 + 3];
    }
    const local = {
      ...global,
      center: [global.center[0] - offset[0], global.center[1] - offset[1], global.center[2]],
      pixelUnprojectionMatrix: localMatrix
    };
    const globalPixels = render({depth: 1, uniforms: globalUniforms});
    const localPixels = render({
      depth: 1,
      uniforms: {
        ...viewportUniforms(local),
        waveOrigin: globalUniforms.waveOrigin
      }
    });
    // The same world position evaluated in a translated local frame must retain
    // its fine detail. Keep its world lattice origin when comparing the frames.
    expect(maxPixelDifference(globalPixels, localPixels)).toBeLessThanOrEqual(1);
    expect(center(globalPixels)).not.toEqual(SOURCE);
  });

  test.each([
    {longitude: 30.52, latitude: 50.45},
    {longitude: 179.9, latitude: 70},
    {longitude: -179.9, latitude: -70}
  ])('keeps waves continuous across a local origin at $longitude, $latitude', location => {
    const viewport = croppedViewport(location);
    const uniforms = viewportUniforms(viewport);
    const tile = 4096 * (uniforms.waveUnitsPerMeter as number);
    const originalMatrix = [...viewport.pixelUnprojectionMatrix];
    const current = render({depth: 1, uniforms: {...uniforms, fogHeight: 0, fogThickness: 0}});
    const nextOrigin = render({
      depth: 1,
      uniforms: {
        ...viewportUniforms({
          ...viewport,
          center: [viewport.center[0] + tile, viewport.center[1] + tile, viewport.center[2]]
        }),
        fogHeight: 0,
        fogThickness: 0
      }
    });
    expect(maxPixelDifference(current, nextOrigin)).toBeLessThanOrEqual(1);
    expect(viewport.pixelUnprojectionMatrix).toEqual(originalMatrix);
  });

  test('does not rescale the wave field when the viewport latitude changes', () => {
    const viewport = croppedViewport();
    const original = viewportUniforms(viewport);
    const moved = viewportUniforms({
      ...viewport,
      latitude: 60,
      distanceScales: new WebMercatorViewport({latitude: 60}).distanceScales
    });
    // Hold elevation/absorption fixed to compare only the pattern at the same
    // world position, viewed from maps with different latitude distance scales.
    const movedPixels = render({
      depth: 1,
      uniforms: {
        ...moved,
        fogHeight: original.fogHeight,
        fogThickness: original.fogThickness,
        unitsPerMeter: original.unitsPerMeter
      }
    });
    expect(
      maxPixelDifference(render({depth: 1, uniforms: original}), movedPixels)
    ).toBeLessThanOrEqual(1);
  });

  test.each([1000, 2000])(
    'keeps submerged camera height %s free of surface reflections',
    cameraHeight => {
      const uniforms = {fogHeight: 2000, cameraHeight};
      const overhead = render({uniforms});
      const shifted = render({
        uniforms: {...uniforms, invCol3: [700, 800, 0, 1], waveUnitsPerMeter: 0.001}
      });
      expect(shifted).toEqual(overhead);
      expect(center(overhead)).not.toEqual(SOURCE);
      expect(center(overhead)[3]).toBe(255);
    }
  );

  test('shows contact highlights only for resolved geometry at the water surface', () => {
    const uniforms = {fogHeight: 0, fogThickness: 20};
    const geometry = render({depth: 0.5, uniforms});
    const basemap = render({depth: 1, uniforms});
    expect(maxPixelDifference(geometry, basemap)).toBeGreaterThan(1);

    const distant = {
      ...uniforms,
      invCol0: [1000, 0, 0, 0],
      invCol1: [0, 1000, 0, 0]
    };
    expect(render({depth: 0.5, uniforms: distant})).toEqual(render({depth: 1, uniforms: distant}));
    const underwater = {...uniforms, cameraHeight: -1};
    expect(render({depth: 0.5, uniforms: underwater})).toEqual(
      render({depth: 1, uniforms: underwater})
    );
  });

  test('keeps reflections when an above-water camera has a near plane crossing the water', () => {
    const viewport = croppedViewport({zoom: 18, pitch: 65});
    const matrix = viewport.pixelUnprojectionMatrix;
    const nearElevation = (x: number, y: number) =>
      (matrix[2] * x + matrix[6] * y - matrix[10] + matrix[14]) /
      (matrix[3] * x + matrix[7] * y - matrix[11] + matrix[15]);
    const nearHeights = [nearElevation(0.5, 0.5), nearElevation(SIZE - 0.5, SIZE - 0.5)];
    const fogHeight = (nearHeights[0] + nearHeights[1]) / 2;
    expect(Math.min(...nearHeights)).toBeLessThan(fogHeight);
    expect(Math.max(...nearHeights)).toBeGreaterThan(fogHeight);
    expect(viewport.cameraPosition[2]).toBeGreaterThan(fogHeight);

    const pixels = render({
      depth: 1,
      uniforms: {...viewportUniforms(viewport), fogHeight, fogThickness: 0}
    });
    // Moving only the clipping plane closer to the camera must not change the
    // water intersection or split the image into reflective/submerged regions.
    const closerNearPlane = render({
      depth: 1,
      uniforms: {
        ...viewportUniforms(croppedViewport({zoom: 18, pitch: 65, nearZMultiplier: 0.01})),
        fogHeight,
        fogThickness: 0
      }
    });
    expect(maxPixelDifference(pixels, closerNearPlane)).toBeLessThanOrEqual(1);
    expect(center(pixels)).not.toEqual(SOURCE);
    const submerged = render({
      depth: 1,
      uniforms: {...viewportUniforms(viewport), fogHeight, fogThickness: 0, cameraHeight: 0}
    });
    expect(maxPixelDifference(pixels, submerged)).toBeGreaterThan(1);
  });

  test('composites water over transparent basemap pixels with premultiplied alpha', () => {
    const pixel = center(render({depth: 1, source: [0, 0, 0, 0], uniforms: {density: 0.5}}));
    expect(pixel[3]).toBe(128);
    expect(Math.max(...pixel.slice(0, 3))).toBeLessThanOrEqual(pixel[3]);
    expect(Math.max(...pixel.slice(0, 3))).toBeGreaterThan(0);
  });

  test('does not paint water on rays looking above or parallel to the water plane', () => {
    expect(
      center(
        render({
          depth: 1,
          uniforms: {
            invCol2: [1000, 0, 0, 0],
            invCol3: [0, 0, 100, 1]
          }
        })
      )
    ).toEqual(SOURCE);
    expect(
      center(
        render({
          depth: 1,
          uniforms: {
            invCol2: [0, 0, 1000, 0],
            invCol3: [0, 0, 2000, 1]
          }
        })
      )
    ).toEqual(SOURCE);
  });
});
