// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export default `\
#version 300 es
#define SHADER_NAME raster-mesh-layer-vs

// Primitive attributes
in vec3 positions;
in vec3 positions64Low;
in vec3 normals;
in vec3 colors;
in vec2 texCoords;

// Outputs to fragment shader
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

  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
  position_commonspace = geometry.position;
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  vTexCoord = texCoords;
  cameraPosition = project_uCameraPosition;
  
  vColor = vec4(colors, 1.0);
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;
