// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CAPTURE_FS, FLUX_FS, UPDATE_FS, SMOOTH_HEIGHT_FS} from './shaders';
import {markWaterBoundary} from './domain';

// Execute the production shader arithmetic in headless-gl. Only GLSL syntax is
// adapted to WebGL 1; this suite does not substitute a CPU implementation.
const SIZE = 5;
const COUNT = SIZE * SIZE;
const CENTER = 12;
const uniforms = `uniform vec2 water_size; uniform float water_dt;
uniform float water_rain; uniform float water_cellSize; uniform float water_openBoundary;
uniform vec2 heightFilter_size; uniform float heightFilter_strength;`;
const vs = `attribute vec2 position; varying vec2 coordinate;
void main() { coordinate = position * 0.5 + 0.5; gl_Position = vec4(position, 0, 1); }`;

describe('water simulation GPU routing', () => {
  let gl: WebGLRenderingContext;
  let flow: WebGLProgram;
  let update: WebGLProgram;
  let capture: WebGLProgram;
  let smooth: WebGLProgram;
  let textures: WebGLTexture[];
  let framebuffer: WebGLFramebuffer;

  function program(source: string) {
    const result = gl.createProgram()!;
    const fs = source
      .replace('#version 300 es', '')
      .replace('in vec2 coordinate;', 'varying vec2 coordinate;')
      .replace('out vec4 fragColor;', uniforms)
      .replace(/\bfragColor\b/g, 'gl_FragColor')
      .replace(/\btexture\(/g, 'texture2D(')
      .replace(/water\./g, 'water_')
      .replace(/heightFilter\./g, 'heightFilter_');
    for (const [type, text] of [
      [gl.VERTEX_SHADER, vs],
      [gl.FRAGMENT_SHADER, fs]
    ] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, text);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader)!);
      gl.attachShader(result, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(result);
    if (!gl.getProgramParameter(result, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(result)!);
    return result;
  }
  function upload(index: number, values: number[], valid = Array(COUNT).fill(1)) {
    const data = new Float32Array(COUNT * 4);
    values.forEach((value, i) => {
      data[i * 4] = value;
      data[i * 4 + 3] = valid[i];
    });
    if (index === 0) markWaterBoundary(data, SIZE);
    gl.bindTexture(gl.TEXTURE_2D, textures[index]);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, SIZE, SIZE, gl.RGBA, gl.FLOAT, data);
  }
  function draw(
    shader: WebGLProgram,
    output: number,
    state: number,
    rain = 0,
    open = false,
    strength = 1,
    cellSize = 1,
    dt = 1
  ) {
    gl.useProgram(shader);
    const location = gl.getAttribLocation(shader, 'position');
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    const names = ['terrain', 'state', 'flux'];
    [0, state, 3].forEach((textureIndex, unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, textures[textureIndex]);
      gl.uniform1i(gl.getUniformLocation(shader, names[unit]), unit);
    });
    gl.uniform1i(gl.getUniformLocation(shader, 'capturedDepth'), 0);
    gl.uniform2f(gl.getUniformLocation(shader, 'water_size'), SIZE, SIZE);
    gl.uniform1f(gl.getUniformLocation(shader, 'water_dt'), dt);
    gl.uniform1f(gl.getUniformLocation(shader, 'water_rain'), rain);
    gl.uniform1f(gl.getUniformLocation(shader, 'water_cellSize'), cellSize);
    gl.uniform1f(gl.getUniformLocation(shader, 'water_openBoundary'), Number(open));
    gl.uniform2f(gl.getUniformLocation(shader, 'heightFilter_size'), SIZE, SIZE);
    gl.uniform1f(gl.getUniformLocation(shader, 'heightFilter_strength'), strength);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      textures[output],
      0
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    expect(gl.getError()).toBe(gl.NO_ERROR);
  }
  function read() {
    const data = new Float32Array(COUNT * 4);
    gl.readPixels(0, 0, SIZE, SIZE, gl.RGBA, gl.FLOAT, data);
    return Array.from(data).filter((_, i) => i % 4 === 0);
  }
  function simulate(
    ground: number[],
    water: number[],
    steps = 1,
    {rain = 0, open = false, valid = Array(COUNT).fill(1), cellSize = 1, dt = 1} = {}
  ) {
    upload(0, ground, valid);
    upload(1, water);
    upload(2, Array(COUNT).fill(0));
    let current = 1;
    for (let i = 0; i < steps; i++) {
      draw(flow, 3, current, rain, open, 1, cellSize, dt);
      draw(update, 3 - current, current, rain, open, 1, cellSize, dt);
      current = 3 - current;
    }
    return read();
  }
  const total = (values: number[]) => values.reduce((a, b) => a + b, 0);
  function smoothHeights(ground: number[], strength = 1, valid = Array(COUNT).fill(1)) {
    upload(0, ground, valid);
    draw(smooth, 1, 2, 0, false, strength);
    return read();
  }

  beforeAll(() => {
    gl = require('gl')(SIZE, SIZE);
    expect(gl.getExtension('OES_texture_float')).toBeTruthy();
    flow = program(FLUX_FS);
    update = program(UPDATE_FS);
    capture = program(CAPTURE_FS);
    smooth = program(SMOOTH_HEIGHT_FS);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    textures = Array.from({length: 4}, () => {
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIZE, SIZE, 0, gl.RGBA, gl.FLOAT, null);
      return texture;
    });
    framebuffer = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, SIZE, SIZE);
  });
  afterAll(() => gl?.getExtension('STACKGL_destroy_context')?.destroy());

  test('moves downhill and conserves water without negative depths', () => {
    const ground = Array.from({length: COUNT}, (_, i) => SIZE - (i % SIZE));
    const water = Array(COUNT).fill(0);
    water[CENTER] = 2;
    const result = simulate(ground, water, 50);
    expect(result[14]).toBeGreaterThan(0);
    expect(result[10]).toBe(0);
    expect(Math.min(...result)).toBeGreaterThanOrEqual(0);
    expect(total(result)).toBeCloseTo(2, 5);
  });
  test('a flat, level pool stays at rest', () => {
    expect(simulate(Array(COUNT).fill(10), Array(COUNT).fill(2), 20)).toEqual(Array(COUNT).fill(2));
  });
  test('higher water promptly transfers into lower water at the runtime timestep', () => {
    const ground = Array(COUNT).fill(10000);
    const valid = Array(COUNT).fill(0);
    valid[CENTER] = valid[CENTER + 1] = 1;
    const water = Array(COUNT).fill(0);
    water[CENTER] = 2;
    water[CENTER + 1] = 1;
    const result = simulate(ground, water, 1, {valid, cellSize: 10, dt: 0.05});
    expect(result[CENTER + 1]).toBeGreaterThan(1.1);
    expect(result[CENTER]).toBeLessThan(1.9);
    expect(result[CENTER]).toBeGreaterThanOrEqual(result[CENTER + 1]);
    expect(total(result)).toBeCloseTo(3, 6);
  });
  test('wet downhill cells can pass on their water while receiving more in the same step', () => {
    const ground = Array(COUNT).fill(0);
    const water = Array(COUNT).fill(0);
    const valid = Array(COUNT).fill(0);
    for (let i = 11; i <= 14; i++) {
      ground[i] = (14 - i) * 10;
      water[i] = valid[i] = 1;
    }
    const result = simulate(ground, water, 1, {valid, dt: 0.05});
    expect(result.slice(11, 15)).toEqual([0, 1, 1, 2]);
    expect(total(result)).toBe(4);
  });
  test('several downhill outlets share available water without creating negative depths', () => {
    const ground = Array(COUNT).fill(0);
    ground[CENTER] = 100;
    const water = Array(COUNT).fill(0);
    water[CENTER] = 1;
    const result = simulate(ground, water, 1, {dt: 0.05});
    expect(result[CENTER]).toBe(0);
    for (const i of [7, 11, 13, 17]) expect(result[i]).toBeCloseTo(0.25, 6);
    expect(Math.min(...result)).toBeGreaterThanOrEqual(0);
    expect(total(result)).toBeCloseTo(1, 6);
  });
  test('equal water surfaces stay level even when terrain and water depths differ', () => {
    const ground = Array.from({length: COUNT}, (_, i) => i % SIZE);
    const water = ground.map(height => 10 - height);
    expect(simulate(ground, water, 20, {dt: 0.05})).toEqual(water);
  });
  test('faster routing settles uneven pools without overshoot or volume loss', () => {
    const ground = Array(COUNT).fill(10000);
    const water = Array.from({length: COUNT}, (_, i) => (i % 2 ? 1 : 3));
    const result = simulate(ground, water, 200, {dt: 0.05});
    expect(total(result)).toBeCloseTo(total(water), 4);
    result.forEach(depth => expect(depth).toBeCloseTo(total(water) / COUNT, 4));
  });
  test('sub-precision overflow cannot repeatedly create water in a shallow receiver', () => {
    const ground = Array(COUNT).fill(0);
    ground[12] = 1;
    const valid = Array(COUNT).fill(0);
    valid[11] = valid[12] = valid[13] = 1;
    const water = Array(COUNT).fill(0);
    water[11] = 1 + 2 ** -22;
    const result = simulate(ground, water, 300, {valid});
    expect(total(result)).toBeCloseTo(total(water), 6);
    expect(result[13]).toBeLessThan(1e-6);
  });
  test('a basin holds water until its surface rises over the rim', () => {
    const ground = Array(COUNT).fill(100);
    ground[11] = 0;
    ground[12] = 1;
    ground[13] = 0;
    const water = Array(COUNT).fill(0);
    water[11] = 0.5;
    expect(simulate(ground, water, 30)).toEqual(water);
    water[11] = 3;
    const result = simulate(ground, water, 100);
    expect(result[13]).toBeGreaterThan(0.5);
    expect(total(result)).toBeCloseTo(3, 5);
    expect(result[11]).toBeCloseTo(result[12] + 1, 3);
  });
  test('new inflow accumulates below an obstacle, then overtops it into lower ground', () => {
    const ground = Array(COUNT).fill(0);
    ground[12] = 1;
    const valid = Array(COUNT).fill(0);
    valid[11] = valid[12] = valid[13] = 1;
    let water = Array(COUNT).fill(0);
    for (let i = 0; i < 5; i++) {
      water[11] += 0.1;
      water = simulate(ground, water, 10, {valid});
    }
    expect(water[12]).toBe(0);
    expect(water[13]).toBe(0);
    water[11] += 0.6;
    water = simulate(ground, water, 100, {valid});
    expect(water[13]).toBeGreaterThan(0.05);
    expect(total(water)).toBeCloseTo(1.1, 5);
    // A previously resting pool must resume spilling when more water arrives.
    water[11] += 0.5;
    water = simulate(ground, water, 100, {valid});
    expect(water[13]).toBeGreaterThan(0.5);
    expect(total(water)).toBeCloseTo(1.6, 5);
    expect(Math.min(...water)).toBeGreaterThanOrEqual(0);
  });
  test('small surface differences still drive flow at high absolute elevations', () => {
    const water = Array(COUNT).fill(0);
    water[CENTER] = 0.0001;
    const low = simulate(Array(COUNT).fill(0), water);
    const high = simulate(Array(COUNT).fill(10000), water);
    expect(high[13]).toBeGreaterThan(0);
    high.forEach((depth, i) => expect(depth).toBeCloseTo(low[i], 8));
    expect(total(high)).toBeCloseTo(0.0001, 8);
  });
  test('rain adds exactly its volume only to valid cells', () => {
    const valid = Array(COUNT).fill(1);
    valid[CENTER] = 0;
    const result = simulate(Array(COUNT).fill(0), Array(COUNT).fill(0), 10, {rain: 0.1, valid});
    expect(result[CENTER]).toBe(0);
    expect(total(result)).toBeCloseTo(24, 4);
  });
  test('missing terrain is impermeable, including at a deep hole', () => {
    const ground = Array(COUNT).fill(-100);
    ground[CENTER] = 10;
    const water = Array(COUNT).fill(0);
    water[CENTER] = 1;
    const valid = Array(COUNT).fill(0);
    valid[CENTER] = 1;
    expect(simulate(ground, water, 30, {valid})).toEqual(water);
  });
  test('open edges drain while closed edges conserve volume', () => {
    const ground = Array(COUNT).fill(0),
      water = Array(COUNT).fill(1);
    expect(total(simulate(ground, water, 50))).toBeCloseTo(COUNT, 5);
    const result = simulate(ground, water, 50, {open: true});
    expect(total(result)).toBeLessThan(1);
    expect(Math.min(...result)).toBeGreaterThanOrEqual(0);
  });
  test.each([1, 1000])('open edges do not accumulate rain or inflow with %s m cells', cellSize => {
    const ground = Array.from({length: COUNT}, (_, i) => SIZE - (i % SIZE));
    const result = simulate(ground, Array(COUNT).fill(1), 30, {open: true, rain: 0.01, cellSize});
    result.forEach((depth, i) => {
      if (i < SIZE || i >= COUNT - SIZE || i % SIZE === 0 || i % SIZE === SIZE - 1) {
        expect(depth).toBe(0);
      }
    });
    expect(Math.min(...result)).toBeGreaterThanOrEqual(0);
  });
  test('open edges drain a captured patch surrounded by missing pixels', () => {
    const ground = Array.from({length: COUNT}, (_, i) => SIZE - (i % SIZE));
    const valid = Array.from({length: COUNT}, (_, i) =>
      i >= SIZE && i < COUNT - SIZE && i % SIZE > 0 && i % SIZE < SIZE - 1 ? 1 : 0
    );
    const water = [...valid];
    const closed = simulate(ground, water, 30, {valid});
    expect(total(closed)).toBeCloseTo(9, 5);
    const open = simulate(ground, water, 30, {valid, open: true});
    expect(total(open)).toBeLessThan(0.001);
    expect(open[13]).toBe(0); // Downhill coverage edge, before the texture border.
    expect(Math.min(...open)).toBeGreaterThanOrEqual(0);
  });
  test('enabling drainage removes existing edge water without sending it back inland', () => {
    const ground = Array(COUNT).fill(0);
    const water = Array.from({length: COUNT}, (_, i) => (i % SIZE === SIZE - 1 ? 10 : 0));
    const closed = simulate(ground, water, 1);
    expect(total(closed)).toBeCloseTo(50, 5);
    expect(simulate(ground, water, 1, {open: true})).toEqual(Array(COUNT).fill(0));
  });
  test('open outlets keep enclosed missing terrain blocked and preserve terrain barriers', () => {
    const ground = Array(COUNT).fill(100);
    ground[11] = 0;
    const valid = Array(COUNT).fill(1);
    valid[CENTER] = 0;
    const water = Array(COUNT).fill(0);
    water[11] = 1;
    expect(simulate(ground, water, 30, {valid, open: true})).toEqual(water);
    water[11] = 200;
    expect(total(simulate(ground, water, 100, {valid, open: true}))).toBeLessThan(200);
  });
  test('depth capture decodes elevation in meters and marks empty pixels', () => {
    upload(0, Array(COUNT).fill(0.25));
    draw(capture, 1, 2);
    expect(read()[CENTER]).toBe(12000);
    upload(0, Array(COUNT).fill(1));
    draw(capture, 1, 2);
    const pixel = new Float32Array(4);
    gl.readPixels(2, 2, 1, 1, gl.RGBA, gl.FLOAT, pixel);
    expect(pixel[3]).toBe(0);
  });
  test('smoothing lowers isolated peaks without filling lows or changing flat ground', () => {
    const flat = Array(COUNT).fill(10);
    expect(smoothHeights(flat)).toEqual(flat);
    const peak = [...flat];
    peak[CENTER] = 30;
    const blurred = smoothHeights(peak);
    expect(blurred[CENTER]).toBeGreaterThan(10);
    expect(blurred[CENTER]).toBeLessThan(20);
    blurred.forEach((value, i) => expect(value).toBeLessThanOrEqual(peak[i]));
    const valley = [...flat];
    valley[CENTER] = -10;
    expect(smoothHeights(valley)[CENTER]).toBe(-10);
  });
  test('smoothing strength can be reduced or disabled', () => {
    const peak = Array(COUNT).fill(0);
    peak[CENTER] = 20;
    expect(smoothHeights(peak, 0)).toEqual(peak);
    const full = smoothHeights(peak, 1);
    const partial = smoothHeights(peak, 0.5);
    expect(partial[CENTER]).toBeGreaterThan(full[CENTER]);
    expect(partial[CENTER]).toBeLessThan(peak[CENTER]);
  });
  test('smoothing ignores missing heights and preserves the coverage mask', () => {
    const ground = Array(COUNT).fill(-12000);
    ground[CENTER] = 10;
    const valid = Array(COUNT).fill(0);
    valid[CENTER] = 1;
    expect(smoothHeights(ground, 1, valid)[CENTER]).toBe(10);
    const pixel = new Float32Array(4);
    gl.readPixels(1, 2, 1, 1, gl.RGBA, gl.FLOAT, pixel);
    expect(pixel[3]).toBe(0);
    gl.readPixels(2, 2, 1, 1, gl.RGBA, gl.FLOAT, pixel);
    expect(pixel[3]).toBe(1);
  });
  test('water overtops a smoothed narrow obstacle that blocked the raw capture', () => {
    const ground = Array(COUNT).fill(0);
    ground[CENTER] = 5;
    const valid = Array(COUNT).fill(0);
    valid[11] = valid[12] = valid[13] = 1;
    const water = Array(COUNT).fill(0);
    water[11] = 4;
    expect(simulate(ground, water, 100, {valid})[13]).toBe(0);
    const filtered = smoothHeights(ground, 1, valid);
    const result = simulate(filtered, water, 100, {valid});
    expect(result[13]).toBeGreaterThan(1);
    expect(total(result)).toBeCloseTo(4, 5);
    expect(Math.min(...result)).toBeGreaterThanOrEqual(0);
  });
});
