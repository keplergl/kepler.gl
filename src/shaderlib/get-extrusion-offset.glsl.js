export default `\
uniform vec2 viewportSize;

// offset vector by strokeWidth pixels
// offset_direction is -1 (left) or 1 (right)
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float lineWidth) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace * viewportSize);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);

  vec2 offset_screenspace = dir_screenspace * offset_direction * lineWidth / 2.0;
  vec2 offset_clipspace = offset_screenspace / viewportSize * 2.0;

  return offset_clipspace;
}
`;
