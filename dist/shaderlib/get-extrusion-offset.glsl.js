"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "uniform vec2 viewportSize;\n\n// offset vector by strokeWidth pixels\n// offset_direction is -1 (left) or 1 (right)\nvec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float lineWidth) {\n  // normalized direction of the line\n  vec2 dir_screenspace = normalize(line_clipspace * viewportSize);\n  // rotate by 90 degrees\n  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);\n\n  vec2 offset_screenspace = dir_screenspace * offset_direction * lineWidth / 2.0;\n  vec2 offset_clipspace = offset_screenspace / viewportSize * 2.0;\n\n  return offset_clipspace;\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJnZXQtZXh0cnVzaW9uLW9mZnNldC5nbHNsLmpzIiwic291cmNlc0NvbnRlbnQiOltdfQ==