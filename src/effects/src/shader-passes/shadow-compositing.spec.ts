// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ClipSpace} from '@luma.gl/engine';
import {DeckShadowCompositingEffect} from './shadow-compositing';

jest.mock('@luma.gl/engine', () => ({ClipSpace: jest.fn()}));

function createRenderer() {
  const pass = {end: jest.fn()};
  const device = {beginRenderPass: jest.fn(() => pass)};
  const model = {
    device,
    shaderInputs: {setProps: jest.fn()},
    draw: jest.fn(),
    destroy: jest.fn()
  };
  jest.mocked(ClipSpace).mockImplementationOnce(() => model as unknown as ClipSpace);
  return {device: device as InstanceType<typeof ClipSpace>['device'], model, pass};
}

function createBuffers(device: unknown) {
  return {
    inputBuffer: {device, width: 640, height: 480, colorAttachments: [{id: 'effect-output'}]},
    swapBuffer: {id: 'swap'}
  };
}

describe('export compositing pixels', () => {
  const basemap = [40, 80, 120, 255];
  let gl: WebGLRenderingContext;
  let program: WebGLProgram;

  function shader(type: number, source: string) {
    const result = gl.createShader(type)!;
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(result) || 'Shader compilation failed');
    }
    return result;
  }

  beforeAll(() => {
    // Compile the production fragment shader in headless-gl. Only the GLSL
    // interface syntax changes for WebGL 1; the compositing math stays intact.
    gl = require('gl')(4, 4, {preserveDrawingBuffer: true});
    expect(gl).toBeTruthy();
    const {device} = createRenderer();
    new DeckShadowCompositingEffect().setup({device});
    const options = jest.mocked(ClipSpace).mock.lastCall![1];
    const fragment = options
      .fs!.replace('#version 300 es', '')
      .replace(/in vec2 /g, 'varying vec2 ')
      .replace('out vec4 fragColor;', '')
      .replace(/\bfragColor\b/g, 'gl_FragColor')
      .replace(/\btexture\(/g, 'texture2D(');
    program = gl.createProgram()!;
    gl.attachShader(
      program,
      shader(
        gl.VERTEX_SHADER,
        `attribute vec2 vertex;
         varying vec2 coordinate;
         void main() {
           coordinate = vertex * 0.5 + 0.5;
           gl_Position = vec4(vertex, 0.0, 1.0);
         }`
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
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, 'texSrc'), 0);
    const factors: Record<string, number> = {
      one: gl.ONE,
      'one-minus-src-alpha': gl.ONE_MINUS_SRC_ALPHA
    };
    const parameters = options.parameters!;
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      factors[parameters.blendColorSrcFactor!],
      factors[parameters.blendColorDstFactor!],
      factors[parameters.blendAlphaSrcFactor!],
      factors[parameters.blendAlphaDstFactor!]
    );
    gl.disable(gl.DITHER);
    expect(gl.getError()).toBe(gl.NO_ERROR);
  });

  afterAll(() => gl?.getExtension('STACKGL_destroy_context')?.destroy());

  function render(source: number[]) {
    gl.clearColor(basemap[0] / 255, basemap[1] / 255, basemap[2] / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
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
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const pixel = new Uint8Array(4);
    gl.readPixels(1, 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    expect(gl.getError()).toBe(gl.NO_ERROR);
    return Array.from(pixel);
  }

  test.each([
    {name: 'black', source: [0, 0, 0, 0]},
    {name: 'positive brightness', source: [76, 76, 76, 0]},
    {name: 'noise color', source: [12, 50, 5, 0]}
  ])('preserves the basemap under transparent $name pixels', ({source}) => {
    expect(render(source)).toEqual(basemap);
  });

  test('preserves the transformed color of opaque polygons', () => {
    const transformed = [180, 210, 240, 255];
    expect(render(transformed)).toEqual(transformed);
  });

  test.each([
    {
      name: 'valid premultiplied color',
      source: [40, 60, 80, 128],
      expected: [60, 100, 140, 255]
    },
    {
      name: 'color exceeding coverage',
      source: [240, 180, 32, 128],
      expected: [148, 168, 92, 255]
    }
  ])('composites partial opacity without double-darkening: $name', ({source, expected}) => {
    const actual = render(source);
    expect(actual.every((value, index) => Math.abs(value - expected[index]) <= 1)).toBe(true);
  });
});

describe('export compositing lifecycle', () => {
  beforeEach(() => jest.clearAllMocks());

  test('passes through before setup and renders effect-chain output to swap or final target', () => {
    const effect = new DeckShadowCompositingEffect();
    const {device, model, pass} = createRenderer();
    const buffers = createBuffers(device);
    expect(effect.postRender(buffers)).toBe(buffers.inputBuffer);
    effect.setup({device});
    expect(effect.postRender(buffers)).toBe(buffers.swapBuffer);
    expect(model.shaderInputs.setProps).toHaveBeenLastCalledWith({
      screen: {texSrc: buffers.inputBuffer.colorAttachments[0], texSize: [640, 480]}
    });
    expect(device.beginRenderPass).toHaveBeenLastCalledWith({
      framebuffer: buffers.swapBuffer,
      parameters: {viewport: [0, 0, 640, 480]},
      clearColor: [0, 0, 0, 0],
      clearDepth: 1
    });
    const target = {id: 'export-target'};
    expect(effect.postRender({...buffers, target, clearCanvas: false})).toBe(target);
    expect(device.beginRenderPass).toHaveBeenLastCalledWith(
      expect.objectContaining({framebuffer: target, clearColor: false, clearDepth: false})
    );
    expect(effect.postRender({...buffers, target: null, clearCanvas: false})).toBe(
      buffers.inputBuffer
    );
    expect(device.beginRenderPass).toHaveBeenLastCalledWith(
      expect.objectContaining({framebuffer: null, clearColor: false, clearDepth: false})
    );
    expect(model.draw).toHaveBeenCalledWith(pass);
    expect(pass.end).toHaveBeenCalledTimes(3);
  });

  test('keeps swipe devices independent and cleans up only the requested context', () => {
    const effect = new DeckShadowCompositingEffect();
    const left = createRenderer();
    effect.setup({device: left.device});
    effect.setup({device: left.device});
    const right = createRenderer();
    effect.setup({device: right.device});
    expect(ClipSpace).toHaveBeenCalledTimes(2);
    const leftBuffers = createBuffers(left.device);
    const rightBuffers = createBuffers(right.device);
    effect.postRender(leftBuffers);
    effect.postRender(rightBuffers);
    expect(left.model.draw).toHaveBeenCalledTimes(1);
    expect(right.model.draw).toHaveBeenCalledTimes(1);
    effect.cleanup({device: left.device});
    expect(left.model.destroy).toHaveBeenCalledTimes(1);
    expect(effect.postRender(leftBuffers)).toBe(leftBuffers.inputBuffer);
    effect.postRender(rightBuffers);
    expect(right.model.draw).toHaveBeenCalledTimes(2);
    expect(right.model.destroy).not.toHaveBeenCalled();
    effect.cleanup();
    effect.cleanup();
    expect(left.model.destroy).toHaveBeenCalledTimes(1);
    expect(right.model.destroy).toHaveBeenCalledTimes(1);
    expect(effect.postRender(rightBuffers)).toBe(rightBuffers.inputBuffer);
  });
});
