// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as DeckCore from '@deck.gl/core';
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

  test.each([0, 3, 8, 10, 12, 18])(
    'keeps front labels visible and far-side labels hidden at zoom %s',
    zoom => {
      // Evaluate the scalar GLSL expression itself, using GLSL's mix intrinsic,
      // so this catches changes to the shader rather than testing a copied formula.
      const glsl = injectGlobeBackfaceCull({}).inject[HOOK];
      const expression = glsl.match(/float cosHorizon = ([^;]+);/)![1];
      const threshold = new Function('radius', 'camDist', 'mix', `return ${expression};`);
      const mix = (x: number, y: number, amount: number) => x * (1 - amount) + y * amount;
      const GlobeViewport = (DeckCore as any)._GlobeViewport;

      for (const [longitude, latitude] of [
        [0, 0],
        [179, 60],
        [-179, -60],
        [45, 85]
      ]) {
        const viewport = new GlobeViewport({width: 800, height: 600, longitude, latitude, zoom});
        const camera = viewport.cameraPosition;
        const cameraDistance = Math.hypot(...camera);
        for (const lngLat of [[longitude, latitude], viewport.unproject([440, 330])]) {
          const anchor = viewport.projectPosition(lngLat);
          const radius = Math.hypot(...anchor);
          const cutoff = threshold(radius, cameraDistance, mix);
          const cosine =
            anchor.reduce((sum, value, index) => sum + value * camera[index], 0) /
            (radius * cameraDistance);

          expect(cosine).toBeGreaterThan(cutoff);
          expect(-cosine).toBeLessThan(cutoff);
          // The small safety margin must stay between the true horizon and the
          // front of the globe, even as the visible cap shrinks with zoom.
          expect(cutoff).toBeGreaterThan(radius / cameraDistance);
          expect(cutoff).toBeLessThan(1);
        }
      }
    }
  );
});
