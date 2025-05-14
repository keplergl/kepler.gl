// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export default `\
#define SHADER_NAME raster-mesh-layer-fs

precision highp float;

uniform bool hasTexture;

uniform bool flatShading;
uniform float opacity;

varying vec2 vTexCoord;
varying vec3 cameraPosition;
varying vec3 normals_commonspace;
varying vec4 position_commonspace;
varying vec4 vColor;

void main(void) {
  geometry.uv = vTexCoord;
  vec4 image;
  DECKGL_CREATE_COLOR(image, vTexCoord);

  DECKGL_MUTATE_COLOR(image, vTexCoord);

  vec3 normal;
  if (flatShading) {

// This is necessary because
// headless.gl reports the extension as
// available but does not support it in
// the shader.
#ifdef DERIVATIVES_AVAILABLE
    normal = normalize(cross(dFdx(position_commonspace.xyz), dFdy(position_commonspace.xyz)));
#else
    normal = vec3(0.0, 0.0, 1.0);
#endif
  } else {
    normal = normals_commonspace;
  }

  vec3 lightColor = lighting_getLightColor(image.rgb, cameraPosition, position_commonspace.xyz, normal);
  gl_FragColor = vec4(lightColor, opacity);

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;
