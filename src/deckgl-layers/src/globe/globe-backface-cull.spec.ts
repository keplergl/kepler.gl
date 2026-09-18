// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {injectGlobeBackfaceCull} from './globe-backface-cull';

const HOOK = 'vs:DECKGL_FILTER_GL_POSITION';

describe('globe-backface-cull', () => {
  test('appends to the position hook without dropping existing injects', () => {
    const shaders = injectGlobeBackfaceCull({
      vs: 'void main() {}',
      inject: {[HOOK]: 'existing_inject();', 'vs:DECKGL_FILTER_SIZE': 'size_inject();'}
    });

    expect(shaders.vs).toBe('void main() {}');
    expect(shaders.inject[HOOK]).toContain('existing_inject();');
    expect(shaders.inject[HOOK]).toContain('PROJECTION_MODE_GLOBE');
    expect(shaders.inject['vs:DECKGL_FILTER_SIZE']).toBe('size_inject();');
  });

  test('handles a base layer with no injects', () => {
    const shaders = injectGlobeBackfaceCull({vs: 'void main() {}'});
    expect(shaders.inject[HOOK]).toContain('PROJECTION_MODE_GLOBE');
  });

  test('only culls under the globe projection', () => {
    const glsl = injectGlobeBackfaceCull({}).inject[HOOK];
    expect(glsl).toMatch(/if\s*\(project\.projectionMode\s*==\s*PROJECTION_MODE_GLOBE\)/);
  });

  test('appends to an object-form position hook without stringifying it', () => {
    const shaders = injectGlobeBackfaceCull({
      inject: {[HOOK]: {order: 1, injection: 'existing_inject();'}}
    });
    expect(shaders.inject[HOOK]).toContain('existing_inject();');
    expect(shaders.inject[HOOK]).toContain('PROJECTION_MODE_GLOBE');
    expect(shaders.inject[HOOK]).not.toContain('[object Object]');
  });

  test('keeps the original EnhancedMultiIconLayer horizon formula', () => {
    const glsl = injectGlobeBackfaceCull({}).inject[HOOK];
    expect(glsl).toContain('radius / camDist + 0.02');
    expect(glsl).not.toContain('mix(');
  });
});
