// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {SolidPolygonLayer} from '@deck.gl/layers';
import {phongMaterial} from '@deck.gl/core';
import {editShader, insertBefore} from '@kepler.gl/deckgl-layers';

/** Light the draped surface without extruding its polygons into columns. */
export default class ContourSurfaceLayer extends SolidPolygonLayer {
  static layerName = 'ContourSurfaceLayer';

  getShaders(type: unknown): ReturnType<SolidPolygonLayer['getShaders']> {
    const shaders = super.getShaders(type);
    let vs = editShader(
      shaders.vs,
      'contour surface position outputs',
      'out vec4 vColor;',
      `out vec4 vColor;
out vec3 vCommonPosition;
out vec3 vCameraPosition;`
    );
    vs = insertBefore(
      vs,
      'contour surface projected position',
      'DECKGL_FILTER_GL_POSITION(gl_Position, geometry);',
      `vCommonPosition = geometry.position.xyz;
  vCameraPosition = project.cameraPosition;
  `
    );
    // Phong lighting runs in the fragment stage. Remove the stock vertex-stage
    // call as well, even though the non-extruded surface never takes that branch.
    vs = editShader(
      vs,
      'contour surface vertex color',
      'lighting_getLightColor(colors.rgb, project.cameraPosition, geometry.position.xyz, geometry.normal)',
      'colors.rgb'
    );
    const fs = insertBefore(
      editShader(
        shaders.fs,
        'contour surface position inputs',
        'in vec4 vColor;',
        `in vec4 vColor;
in vec3 vCommonPosition;
in vec3 vCameraPosition;`
      ),
      'contour surface lighting',
      'DECKGL_FILTER_COLOR(fragColor, geometry);',
      `// Common-space derivatives include projection and the elevation multiplier.
  vec3 normal = cross(dFdx(vCommonPosition), dFdy(vCommonPosition));
  float normalLength = length(normal);
  normal = normalLength > 0.0 ? normal / normalLength : vec3(0.0, 0.0, 1.0);
  normal = gl_FrontFacing ? normal : -normal;
  fragColor.rgb = lighting_getLightColor(
    fragColor.rgb, vCameraPosition, vCommonPosition, normal
  );
  `
    );
    return {
      ...shaders,
      vs,
      fs,
      modules: shaders.modules.map(module =>
        module.name === 'gouraudMaterial' ? phongMaterial : module
      )
    };
  }
}
