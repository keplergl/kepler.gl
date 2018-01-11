// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

export default `\
#define SHADER_NAME line-layer-vertex-shader-64

attribute vec3 positions;
attribute vec3 instanceSourcePositions;
attribute vec3 instanceTargetPositions;
attribute vec4 instanceSourceTargetPositions64xyLow;
attribute vec4 instanceColors;
attribute vec4 instanceTargetColors;
attribute vec3 instancePickingColors;
attribute float instanceStrokeWidth;

uniform float strokeScale;
uniform float opacity;
uniform float renderPickingBuffer;
uniform vec4 pickedColor;

uniform float enableBrushing;
uniform float brushSource;
uniform float brushTarget;

varying vec4 vColor;

void main(void) {
  // Position
  vec4 instanceSourcePositions64 = vec4(
    instanceSourcePositions.x, instanceSourceTargetPositions64xyLow.x,
    instanceSourcePositions.y, instanceSourceTargetPositions64xyLow.y);

  vec4 instanceTargetPositions64 = vec4(
    instanceTargetPositions.x, instanceSourceTargetPositions64xyLow.z,
    instanceTargetPositions.y, instanceSourceTargetPositions64xyLow.w);

  vec2 projected_source_coord[2];
  vec2 projected_target_coord[2];

  project_position_fp64(instanceSourcePositions64, projected_source_coord);
  project_position_fp64(instanceTargetPositions64, projected_target_coord);

  vec2 source_pos_modelspace[4];
  source_pos_modelspace[0] =  projected_source_coord[0];
  source_pos_modelspace[1] =  projected_source_coord[1];
  source_pos_modelspace[2] = vec2(project_scale(instanceSourcePositions.z), 0.0);
  source_pos_modelspace[3] = vec2(1.0, 0.0);

  vec4 source_pos_clipspace = project_to_clipspace_fp64(source_pos_modelspace);

  vec2 target_pos_modelspace[4];
  target_pos_modelspace[0] =  projected_target_coord[0];
  target_pos_modelspace[1] =  projected_target_coord[1];
  target_pos_modelspace[2] = vec2(project_scale(instanceTargetPositions.z), 0.0);
  target_pos_modelspace[3] = vec2(1.0, 0.0);

  vec4 target_pos_clipspace = project_to_clipspace_fp64(target_pos_modelspace);

  // if not enabled isPointInRange will always return true
  float isSourceInBrush = isPointInRange(instanceSourcePositions.xy, brushSource);
  float isTargetInBrush = isPointInRange(instanceTargetPositions.xy, brushTarget);

  float isInBrush = float(enableBrushing <= 0. ||
  (brushSource * isSourceInBrush > 0. || brushTarget * isTargetInBrush > 0.));

  float segmentIndex = positions.x;
  vec4 p = mix(source_pos_clipspace, target_pos_clipspace, segmentIndex);

  // mix strokeWidth with brush, if not in brush, return 0
  float width = strokeScale * instanceStrokeWidth;
  float finalWidth = mix(0.0, width, isInBrush);

  vec2 offset = getExtrusionOffset(target_pos_clipspace.xy - source_pos_clipspace.xy, positions.y, finalWidth);

  gl_Position = p + vec4(offset, 0.0, 0.0);

  float picked = isPicked(instancePickingColors);

  // Color
  vec4 color = mix(instanceColors, instanceTargetColors, positions.x) / 255.;
  vec4 finalColor = mix(color, pickedColor / 255., picked);
  vec4 pickingColor = vec4(instancePickingColors / 255., 1.);

  vColor = mix(
    vec4(finalColor.rgb, finalColor.a * opacity),
    pickingColor,
    renderPickingBuffer
  );
}
`;
