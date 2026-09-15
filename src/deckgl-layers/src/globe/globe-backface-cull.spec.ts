// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as DeckCore from '@deck.gl/core';

import {injectGlobeBackfaceCull} from './globe-backface-cull';

// _GlobeViewport is an experimental, underscore-prefixed deck.gl export without a
// resolvable type binding through the package barrel, same as in globe-view.ts.
const GlobeViewport = (DeckCore as any)._GlobeViewport;

const HOOK = 'vs:DECKGL_FILTER_GL_POSITION';

/**
 * JS mirror of the horizon cutoff in the injected GLSL. Kept in sync by the assertion
 * below that the shader uses the same relative-margin form.
 */
const HORIZON_MARGIN = 0.02;
const cosHorizon = (radius: number, camDist: number) =>
  radius / camDist + HORIZON_MARGIN * (1 - radius / camDist);

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

  test('scales the horizon margin relative to the visible cap', () => {
    // A fixed additive margin (`radius / camDist + 0.02`) pushes the cutoff above 1.0 once
    // the camera gets close to the surface, culling every label including the one directly
    // under the camera. The margin has to shrink with the cap instead.
    const glsl = injectGlobeBackfaceCull({}).inject[HOOK];
    expect(glsl).toContain('mix(cosHorizon, 1.0, 0.02)');
    expect(glsl).not.toMatch(/radius\s*\/\s*camDist\s*\+/);
  });

  test('keeps the cutoff below 1 across the whole globe zoom range', () => {
    // GLOBE_MIN_ZOOM .. GLOBE_MAX_ZOOM
    for (let zoom = 2; zoom <= 16; zoom++) {
      const viewport = new GlobeViewport({
        width: 1200,
        height: 800,
        longitude: 0,
        latitude: 0,
        zoom,
        resolution: 5
      });
      const [cx, cy, cz] = viewport.cameraPosition;
      const camDist = Math.sqrt(cx * cx + cy * cy + cz * cz);
      const [ax, ay, az] = viewport.projectPosition([0, 0, 0]);
      const radius = Math.sqrt(ax * ax + ay * ay + az * az);

      // cosSurface of the anchor directly under the camera is 1, so a cutoff of 1 or more
      // would hide even that label.
      expect(cosHorizon(radius, camDist)).toBeLessThan(1);
    }
  });
});
