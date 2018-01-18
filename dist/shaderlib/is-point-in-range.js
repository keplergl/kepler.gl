"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\nconst float R_EARTH = 6371000.; // earth radius in meter\n\n// uniform for brushing\nuniform vec2 mousePos;\nuniform float brushRadius;\n\n// approximate distance between lng lat in meters\nfloat distanceBetweenLatLng(vec2 source, vec2 target) {\n\n  vec2 delta = (source - target) * PI / 180.;\n\n  float a =\n    sin(delta.y / 2.) * sin(delta.y / 2.) +\n    cos(source.y * PI / 180.) * cos(target.y * PI / 180.) *\n    sin(delta.x / 2.) * sin(delta.x / 2.);\n\n  float c = 2. * atan(sqrt(a), sqrt(1. - a));\n\n  return R_EARTH * c;\n}\n\n// range is km\nfloat isPointInRange(vec2 ptLatLng, float enabled) {\n\n  return float(enabled <= 0. || distanceBetweenLatLng(ptLatLng, mousePos) <= brushRadius);\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpcy1wb2ludC1pbi1yYW5nZS5qcyIsInNvdXJjZXNDb250ZW50IjpbXX0=