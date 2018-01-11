// Copyright (c) 2015-2017 Uber Technologies, Inc.
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
#define SHADER_NAME arc-brushing-layer-vertex-shader

const float N = 49.0;

attribute vec3 positions;
attribute vec4 instanceSourceColors;
attribute vec4 instanceTargetColors;
attribute vec4 instancePositions;
attribute vec3 instancePickingColors;
attribute float instanceStrokeWidth;

uniform float numSegments;
uniform float strokeScale;
uniform float opacity;
uniform float renderPickingBuffer;
uniform vec4 pickedColor;

uniform float enableBrushing;
uniform float brushSource;
uniform float brushTarget;

varying vec4 vColor;

float paraboloid(vec2 source, vec2 target, float ratio) {

  vec2 x = mix(source, target, ratio);
  vec2 center = mix(source, target, 0.5);

  float dSourceCenter = distance(source, center);
  float dXCenter = distance(x, center);
  return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter);
}

float getSegmentRatio(float index) {
  return smoothstep(0.0, 1.0, index / (numSegments - 1.0));
}

vec3 getPos(vec2 source, vec2 target, float segmentRatio) {
  float vertex_height = paraboloid(source, target, segmentRatio);

  return vec3(
    mix(source, target, segmentRatio),
    sqrt(max(0.0, vertex_height))
  );
}

void main(void) {
  vec2 source = project_position(instancePositions.xy);
  vec2 target = project_position(instancePositions.zw);

  // if not enabled isPointInRange will always return true
  float isSourceInBrush = isPointInRange(instancePositions.xy, brushSource);
  float isTargetInBrush = isPointInRange(instancePositions.zw, brushTarget);

  float isInBrush = float(enableBrushing <= 0. ||
  (brushSource * isSourceInBrush > 0. || brushTarget * isTargetInBrush > 0.));

  float segmentIndex = positions.x;
  float segmentRatio = getSegmentRatio(segmentIndex);

  // if it's the first point, use next - current as direction
  // otherwise use current - prev
  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);

  vec3 currPos = getPos(source, target, segmentRatio);
  vec3 nextPos = getPos(source, target, nextSegmentRatio);
  vec4 curr = project_to_clipspace(vec4(currPos, 1.0));
  vec4 next = project_to_clipspace(vec4(nextPos, 1.0));

  // mix strokeWidth with brush, if not in brush, return 0
  float strokeWidth = strokeScale * instanceStrokeWidth;
  float finalWidth = mix(0.0, strokeWidth, isInBrush);

  // extrude
  vec2 offset = getExtrusionOffset((next.xy - curr.xy) * indexDir, positions.y, finalWidth);
  gl_Position = curr + vec4(offset, 0.0, 0.0);

  float picked = isPicked(instancePickingColors);

  vec4 color = mix(instanceSourceColors, instanceTargetColors, segmentRatio) / 255.;
  vec4 finalColor = mix(color, pickedColor / 255., picked);

  vColor = mix(
    vec4(finalColor.rgb, finalColor.a * opacity),
    vec4(instancePickingColors / 255., 1.),
    renderPickingBuffer
  );
}
`;
