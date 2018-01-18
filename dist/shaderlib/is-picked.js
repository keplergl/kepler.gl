"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\nuniform vec3 selectedPickingColor;\n\nfloat isPicked(vec3 pickingColors) {\n return float(pickingColors.x == selectedPickingColor.x\n && pickingColors.y == selectedPickingColor.y\n && pickingColors.z == selectedPickingColor.z);\n}\n\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpcy1waWNrZWQuanMiLCJzb3VyY2VzQ29udGVudCI6W119