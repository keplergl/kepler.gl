// Copyright (c) 2015 Uber Technologies, Inc.
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
#define SHADER_NAME extruded-line-layer-vertex-shader


attribute vec3 positions;
attribute vec3 instanceSourcePositions;
attribute vec3 instanceTargetPositions;
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
  vec3 sourcePos = project_position(instanceSourcePositions);
  vec3 targetPos = project_position(instanceTargetPositions);
  vec4 source = project_to_clipspace(vec4(sourcePos, 1.0));
  vec4 target = project_to_clipspace(vec4(targetPos, 1.0));
  // if not enabled isPointInRange will always return true
  float isSourceInBrush = isPointInRange(instanceSourcePositions.xy, brushSource);
  float isTargetInBrush = isPointInRange(instanceTargetPositions.xy, brushTarget);

  float isInBrush = float(enableBrushing <= 0. ||
  (brushSource * isSourceInBrush > 0. || brushTarget * isTargetInBrush > 0.));

  // mix strokeScale with brush, if not in brush, return 0
  float width = strokeScale * instanceStrokeWidth;
  float finalWidth = mix(0.0, width, isInBrush);

  // linear interpolation of source & target to pick right coord
  float segmentIndex = positions.x;
  vec4 p = mix(source, target, segmentIndex);

  // extrude
  vec2 offset = getExtrusionOffset(target.xy - source.xy, positions.y, finalWidth);
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
