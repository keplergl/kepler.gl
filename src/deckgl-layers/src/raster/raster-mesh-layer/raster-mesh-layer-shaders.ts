// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Build the vertex shader for the raster mesh layer.
 */
export function buildRasterMeshVertexShader(): string {
  return `\
#version 300 es
#define SHADER_NAME raster-mesh-layer-vs

in vec3 positions;
in vec3 positions64Low;
in vec3 normals;
in vec3 colors;
in vec2 texCoords;

out vec2 vTexCoord;
out vec3 cameraPosition;
out vec3 normals_commonspace;
out vec4 position_commonspace;
out vec4 vColor;

const vec3 pickingColor = vec3(1.0, 0.0, 0.0);
const vec3 defaultNormal = vec3(0.0, 0.0, 1.0);

void main(void) {
  geometry.worldPosition = positions;
  geometry.uv = texCoords;
  geometry.pickingColor = pickingColor;

  normals_commonspace = project_normal(normals);
  geometry.normal = normals_commonspace;

  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
  position_commonspace = geometry.position;
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  vTexCoord = texCoords;
  cameraPosition = project.cameraPosition;

  vColor = vec4(colors, 1.0);
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;
}

/**
 * Build the fragment shader for the raster mesh layer.
 * Uses DECKGL_CREATE_COLOR and DECKGL_MUTATE_COLOR hooks registered with
 * the ShaderAssembler. Module inject code is assembled by luma.gl.
 */
export function buildRasterMeshFragmentShader(): string {
  return `\
#version 300 es
#define SHADER_NAME raster-mesh-layer-fs

precision highp float;
precision mediump int;
precision mediump usampler2D;

uniform float meshOpacity;
uniform bool meshFlatShading;

in vec2 vTexCoord;
in vec3 cameraPosition;
in vec3 normals_commonspace;
in vec4 position_commonspace;
in vec4 vColor;

out vec4 fragColor;

void main(void) {
  geometry.uv = vTexCoord;
  vec2 coord = vTexCoord;
  vec4 image;

  DECKGL_CREATE_COLOR(image, coord);

  DECKGL_MUTATE_COLOR(image, coord);

  vec3 normal;
  if (meshFlatShading) {
    normal = normalize(cross(dFdx(position_commonspace.xyz), dFdy(position_commonspace.xyz)));
  } else {
    normal = normals_commonspace;
  }

  vec3 lightColor = lighting_getLightColor(image.rgb, cameraPosition, position_commonspace.xyz, normal);
  fragColor = vec4(lightColor, meshOpacity);

  DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;
}
