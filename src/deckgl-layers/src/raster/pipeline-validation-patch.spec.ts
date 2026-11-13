// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const MIXED_SAMPLERS = 'Samplers of different types use the same sampler location';

function pipelineState({
  linked = true,
  validated = true,
  log = ''
}: {
  linked?: boolean;
  validated?: boolean;
  log?: string | null;
} = {}) {
  const gl = {
    getProgramParameter: jest.fn((_handle: object, parameter: number) =>
      parameter === 0x8b82 ? linked : validated
    ),
    validateProgram: jest.fn(),
    getProgramInfoLog: jest.fn(() => log)
  };
  return {device: {gl}, handle: {}, linkStatus: 'pending'};
}

function loadPatch(exports: object): () => void {
  let patch!: () => void;
  jest.isolateModules(() => {
    jest.doMock('@luma.gl/core/webgl', () => exports);
    patch = require('./pipeline-validation-patch').patchPipelineValidation;
  });
  return patch;
}

afterEach(() => jest.dontMock('@luma.gl/core/webgl'));

describe('legacy raster pipeline validation', () => {
  function setup(options: Parameters<typeof pipelineState>[0] = {}) {
    class Pipeline {
      _getLinkStatus() {
        return 'original';
      }
    }
    const patch = loadPatch({WEBGLRenderPipeline: Pipeline});
    patch();
    return {pipeline: Object.assign(new Pipeline(), pipelineState(options)), Pipeline, patch};
  }

  test('accepts linked and validated programs without reading their info log', () => {
    const {pipeline} = setup();
    expect(pipeline._getLinkStatus()).toBe('success');
    expect(pipeline.linkStatus).toBe('success');
    expect(pipeline.device.gl.validateProgram).toHaveBeenCalledWith(pipeline.handle);
    expect(pipeline.device.gl.getProgramInfoLog).not.toHaveBeenCalled();
  });

  test.each([MIXED_SAMPLERS, 'Samplers of DIFFERENT TYPE use the same sampler location'])(
    'tolerates the known mixed sampler false positive: %s',
    log => {
      const {pipeline} = setup({validated: false, log});
      expect(pipeline._getLinkStatus()).toBe('success');
      expect(pipeline.linkStatus).toBe('success');
    }
  );

  test.each(['Too many active samplers', 'Vertex shader output mismatch', '', null])(
    'preserves other validation failures, including absent diagnostic text: %s',
    log => {
      const {pipeline} = setup({validated: false, log});
      expect(pipeline._getLinkStatus()).toBe('validation-error');
      expect(pipeline.linkStatus).toBe('error');
    }
  );

  test('never suppresses a link failure even with a mixed sampler diagnostic', () => {
    const {pipeline} = setup({linked: false, log: MIXED_SAMPLERS});
    const initialize = jest.fn();
    Object.assign(pipeline, {_initializeSamplerUniforms: initialize});
    expect(pipeline._getLinkStatus()).toBe('link-error');
    expect(pipeline.linkStatus).toBe('error');
    expect(initialize).not.toHaveBeenCalled();
    expect(pipeline.device.gl.validateProgram).not.toHaveBeenCalled();
  });

  test('repeated installation does not wrap the patched method again', () => {
    const {Pipeline, patch} = setup();
    const patched = Pipeline.prototype._getLinkStatus;
    patch();
    expect(Pipeline.prototype._getLinkStatus).toBe(patched);
  });
});

describe('shared raster pipeline validation (luma 9.3+)', () => {
  function setup(initialStatus = 'error', options: Parameters<typeof pipelineState>[0] = {}) {
    const events: string[] = [];
    class SharedPipeline {
      _getLinkStatus = undefined;
    }
    // A prototype method models the unexported luma shared pipeline class.
    const originalStatus = jest.fn(() => 'original');
    Object.defineProperty(SharedPipeline.prototype, '_getLinkStatus', {
      value: originalStatus,
      writable: true
    });
    const instance = Object.assign(
      Object.create(SharedPipeline.prototype),
      pipelineState(options),
      {
        linkStatus: initialStatus,
        _initializeSamplerUniforms: jest.fn(() => events.push('initialize'))
      }
    );
    instance.device.gl.validateProgram.mockImplementation(() => events.push('validate'));
    const factory = jest.fn(function (this: object) {
      expect(this).toBe(device);
      return instance;
    });
    class Device {}
    Object.assign(Device.prototype, {_createSharedRenderPipelineWebGL: factory});
    const device = new Device() as Device & {
      _createSharedRenderPipelineWebGL: (...args: unknown[]) => typeof instance;
    };
    const patch = loadPatch({WEBGLRenderPipeline: class {}, WebGLDevice: Device});
    patch();
    return {device, factory, instance, patch, events, originalStatus};
  }

  test('repairs the first failed instance and restores the factory with its receiver and arguments intact', () => {
    const {device, factory, instance, events, patch, originalStatus} = setup('error', {
      validated: false,
      log: MIXED_SAMPLERS
    });
    const args = [{id: 'raster'}, {shader: 'bands'}];
    expect(device._createSharedRenderPipelineWebGL(...args)).toBe(instance);
    expect(factory).toHaveBeenCalledWith(...args);
    expect(events).toEqual(['initialize', 'validate']);
    expect(instance.linkStatus).toBe('success');
    expect(originalStatus).not.toHaveBeenCalled();
    expect(device._createSharedRenderPipelineWebGL).toBe(factory);
    const patched = instance._getLinkStatus;
    patch();
    expect(device._createSharedRenderPipelineWebGL).toBe(factory);
    expect(instance._getLinkStatus).toBe(patched);
    // Subsequent instances inherit the patched prototype, not an own method.
    const next = Object.assign(Object.create(Object.getPrototypeOf(instance)), pipelineState());
    expect(next._getLinkStatus()).toBe('success');
  });

  test('does not revalidate an already successful first instance', () => {
    const {device, instance, events, factory} = setup('success');
    device._createSharedRenderPipelineWebGL();
    expect(events).toEqual([]);
    expect(device._createSharedRenderPipelineWebGL).toBe(factory);
    expect(instance._getLinkStatus()).toBe('success');
    expect(events).toEqual(['initialize', 'validate']);
  });

  test('keeps real validation errors after rechecking the first instance', () => {
    const {device, instance, factory} = setup('error', {
      validated: false,
      log: 'Too many samplers'
    });
    device._createSharedRenderPipelineWebGL();
    expect(instance.linkStatus).toBe('error');
    expect(instance._getLinkStatus()).toBe('validation-error');
    expect(device._createSharedRenderPipelineWebGL).toBe(factory);
  });

  test('restores a factory whose instance has no supported validation method', () => {
    class Device {
      _createSharedRenderPipelineWebGL() {
        return {};
      }
    }
    const factory = Device.prototype._createSharedRenderPipelineWebGL;
    loadPatch({WebGLDevice: Device})();
    expect(new Device()._createSharedRenderPipelineWebGL()).toEqual({});
    expect(Device.prototype._createSharedRenderPipelineWebGL).toBe(factory);
  });

  test.each([{}, {WEBGLRenderPipeline: class {}, WebGLDevice: class {}}])(
    'does not throw when neither supported pipeline API is available',
    exports => expect(loadPatch(exports)).not.toThrow()
  );
});
