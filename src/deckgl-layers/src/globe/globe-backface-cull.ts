// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Back-face culling for globe-mode text labels.
//
// Extracted unchanged from EnhancedMultiIconLayer so the same inject can be reused by
// the glyph sublayer and the text-background sublayer. The GLSL is a copy of the
// original snippet; do not change the horizon formula here without treating it as a
// behavior change for every globe label that already uses EnhancedMultiIconLayer
// (including MVTLabelLayer basemap place names).
//
// deck.gl's TextLayer uses a MultiIconLayer to render glyphs; on a globe, labels
// anchored on the far hemisphere would otherwise be drawn "through" the planet.
// This injects a small GLSL snippet into the vertex shader that degenerates
// (collapses) glyph vertices whose anchor is facing away from the camera, so
// back-side labels disappear.
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

/**
 * Appends the globe back-face cull snippet to a layer's vertex position hook,
 * preserving anything the base layer already injected there.
 * Copied from EnhancedMultiIconLayer.getShaders().
 */
export function injectGlobeBackfaceCull(shaders: any): any {
  const existing = shaders.inject?.['vs:DECKGL_FILTER_GL_POSITION'] || '';
  return {
    ...shaders,
    inject: {
      ...(shaders.inject || {}),
      'vs:DECKGL_FILTER_GL_POSITION': `${existing}\n${BACKFACE_CULL_INJECT}`
    }
  };
}
