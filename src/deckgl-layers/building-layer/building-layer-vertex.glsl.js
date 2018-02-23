// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* vertex shader for the choropleth-layer */
export default `\

#define SHADER_NAME choropleth-layer-vertex-shader

attribute vec3 positions;
attribute vec3 normals;

// projection uniforms
uniform float mercatorScale;
uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldInverseTransposeMatrix;

// Custom uniforms
uniform float pixelPerMeter;
uniform float opacity;
uniform vec3 colors;

// Lighting constants, this can also be set via uniform
const vec3 ambientColor = vec3(1., 1., 1.);
const vec3 pointLocation = vec3(-1., 3., -1.);
const vec3 pointColor = vec3(1., 1., 1.);
const vec3 pointSpecularColor = vec3(0.6, 0.6, 0.6);
const float shininess = 3.;
const float pointLightAmbientCoefficient = 0.8;

varying vec4 vColor;

vec3 getLightWeight(
  mat4 viewMatrix,
  mat4 worldMatrix,
  mat4 worldInverseTransposeMatrix,
  vec3 positions,
  vec3 normals,
  vec3 ambientColor,
  vec3 pointLocation,
  vec3 pointColor,
  vec3 pointSpecularColor,
  float shininess,
  float pointLightAmbientCoefficient
) {
  vec4 vPosition = worldMatrix * vec4(positions, 1.0);
  vec4 vTransformedNormal = worldInverseTransposeMatrix * vec4(normals, 1);
  vec3 normal = vTransformedNormal.xyz;
  vec3 eyeDirection = normalize(-vPosition.xyz);

  vec3 transformedPointLocation = (viewMatrix * vec4(pointLocation, 1.0)).xyz;
  vec3 lightDirection = normalize(transformedPointLocation - vPosition.xyz);
  vec3 reflectionDirection = reflect(-lightDirection, normal);

  float specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), clamp(shininess, 1., 32.));
  vec3 specularLight = specularLightWeighting * pointSpecularColor;

  float diffuseLightWeighting = max(dot(normal, lightDirection), 0.0);
  vec3 diffuseLight = diffuseLightWeighting * pointColor;


  return (ambientColor * pointLightAmbientCoefficient) + diffuseLight + specularLight;
}

void main(void) {
  // For some reason, need to add one to elevation to show up in untilted mode
  vec3 p = vec3(
    project_position(positions.xy),
    positions.z * pixelPerMeter + .1
  );

  gl_Position = project_to_clipspace(vec4(p, 1.));

  vec3 lightWeighting = getLightWeight(
    viewMatrix,
    worldMatrix,
    worldInverseTransposeMatrix,
    p,
    normals,
    ambientColor,
    pointLocation,
    pointColor,
    pointSpecularColor,
    shininess,
    pointLightAmbientCoefficient
  );

  vec3 lightWeightedColor = lightWeighting * colors / 255.0;

  // vec3 color = applyLighting(gl_Position.xyz, normals, colors);
  vColor = vec4(color, opacity);
}
`;
