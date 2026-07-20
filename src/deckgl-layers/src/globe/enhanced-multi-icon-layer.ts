// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-ignore _MultiIconLayer is an experimental, underscore-prefixed deck.gl export whose named type binding isn't reliably resolvable through the package barrel under this project's module resolution. Access it off the namespace with a loose type.
import {_MultiIconLayer as MultiIconLayer} from '@deck.gl/layers';

// Back-face culling for globe-mode text labels.
//
// Ported from studio-monorepo's EnhancedMultiIconLayer. deck.gl's TextLayer uses a
// MultiIconLayer to render glyphs; on a globe, labels anchored on the far hemisphere
// would otherwise be drawn "through" the planet. This subclass injects a small GLSL
// snippet into the icon vertex shader that degenerates (collapses) glyph vertices
// whose anchor is facing away from the camera, so back-side labels disappear.
//
// The test uses the true sphere-horizon condition rather than a fixed dot-product
// cutoff. In deck.gl common space the globe is a sphere centered at the origin, so:
//   - the label anchor position doubles as its outward surface normal, and
//   - a surface point is visible from the camera exactly when the angle between its
//     normal and the camera direction is within the horizon half-angle, i.e.
//         dot(normalize(anchor), normalize(cameraPos)) > R / d
//     where R is the sphere radius (= |anchor|) and d = |cameraPos| is the camera
//     distance from the globe center.
// This is zoom-independent: the visible cap automatically shrinks as you zoom in and
// grows as you pull back, so labels don't pop in/out at the limb while zooming.
const BACKFACE_CULL_INJECT = /* glsl */ `
  // Only cull on the globe; leave web-mercator / flat views untouched.
  if (project.projectionMode == PROJECTION_MODE_GLOBE) {
    vec3 anchorCommon = geometry.position.xyz;
    float radius = length(anchorCommon);
    float camDist = length(project.cameraPosition);
    // Guard against degenerate anchors / camera at the center.
    if (radius > 0.0 && camDist > radius) {
      float cosSurface = dot(anchorCommon / radius, project.cameraPosition / camDist);
      // Cosine of the horizon half-angle. Add a tiny margin so labels are hidden just
      // before they wrap exactly onto the limb (avoids glyphs smeared along the edge).
      float cosHorizon = radius / camDist + 0.02;
      if (cosSurface < cosHorizon) {
        // Push the vertex outside clip space so this glyph is discarded. The hook
        // exposes the clip-space position as \`position\`, not \`gl_Position\`.
        position = vec4(0.0, 0.0, 2.0, 1.0);
      }
    }
  }
`;

export default class EnhancedMultiIconLayer extends (MultiIconLayer as any) {
  static layerName = 'EnhancedMultiIconLayer';

  getShaders() {
    const shaders = super.getShaders();
    const existing = shaders.inject?.['vs:DECKGL_FILTER_GL_POSITION'] || '';
    return {
      ...shaders,
      inject: {
        ...(shaders.inject || {}),
        'vs:DECKGL_FILTER_GL_POSITION': `${existing}\n${BACKFACE_CULL_INJECT}`
      }
    };
  }
}
