"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _loadingSpinner = _interopRequireDefault(require("./loading-spinner"));

var _templateObject;

/** @typedef {import('../../reducers/ui-state-updaters').ExportImage} ExportImage */
var StyledImagePreview = _styledComponents["default"].div.attrs({
  className: 'image-preview'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  justify-content: center;\n  padding: 30px;\n\n  .dimension,\n  .instruction {\n    padding: 8px 0px;\n  }\n\n  .preview-image {\n    background: #e2e2e2;\n    border-radius: 4px;\n    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.18);\n    width: 100%;\n    position: relative;\n  }\n\n  .preview-image-placeholder {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n  }\n\n  .preview-image-spinner {\n    position: absolute;\n    left: calc(50% - 25px);\n    top: calc(50% - 25px);\n  }\n\n  .preview-image--error {\n    font-size: 12px;\n    padding: 12px;\n    color: ", ";\n    text-align: center;\n  }\n"])), function (props) {
  return props.theme.errorColor;
});
/**
 * @param {object} props
 * @param {ExportImage} [props.exportImage]
 * @param {number} [props.width]
 * @param {boolean} [props.showDimension]
 */


var ImagePreview = function ImagePreview(_ref) {
  var exportImage = _ref.exportImage,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 400 : _ref$width,
      _ref$showDimension = _ref.showDimension,
      showDimension = _ref$showDimension === void 0 ? false : _ref$showDimension;

  var _ref2 = exportImage || {},
      error = _ref2.error,
      imageDataUri = _ref2.imageDataUri,
      processing = _ref2.processing,
      _ref2$imageSize = _ref2.imageSize;

  _ref2$imageSize = _ref2$imageSize === void 0 ? {} : _ref2$imageSize;
  var _ref2$imageSize$image = _ref2$imageSize.imageW,
      imageW = _ref2$imageSize$image === void 0 ? 0 : _ref2$imageSize$image,
      _ref2$imageSize$image2 = _ref2$imageSize.imageH,
      imageH = _ref2$imageSize$image2 === void 0 ? 0 : _ref2$imageSize$image2;
  var imageStyle = {
    width: "".concat(width, "px"),
    height: "".concat(imageH / (imageW || 1) * width, "px")
  };
  return /*#__PURE__*/_react["default"].createElement(StyledImagePreview, null, showDimension ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "dimension"
  }, imageW, " pixel x ", imageH, " pixel") : null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "preview-image",
    style: imageStyle
  }, processing ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "preview-image-spinner"
  }, /*#__PURE__*/_react["default"].createElement(_loadingSpinner["default"], null)) : error ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "preview-image--error"
  }, /*#__PURE__*/_react["default"].createElement("span", null, error.message || 'Generate map image failed!')) : /*#__PURE__*/_react["default"].createElement("img", {
    className: "preview-image-placeholder",
    src: imageDataUri
  })));
};

var _default = ImagePreview;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pbWFnZS1wcmV2aWV3LmpzIl0sIm5hbWVzIjpbIlN0eWxlZEltYWdlUHJldmlldyIsInN0eWxlZCIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJ0aGVtZSIsImVycm9yQ29sb3IiLCJJbWFnZVByZXZpZXciLCJleHBvcnRJbWFnZSIsIndpZHRoIiwic2hvd0RpbWVuc2lvbiIsImVycm9yIiwiaW1hZ2VEYXRhVXJpIiwicHJvY2Vzc2luZyIsImltYWdlU2l6ZSIsImltYWdlVyIsImltYWdlSCIsImltYWdlU3R5bGUiLCJoZWlnaHQiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7OztBQUVBO0FBRUEsSUFBTUEsa0JBQWtCLEdBQUdDLDZCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDMUNDLEVBQUFBLFNBQVMsRUFBRTtBQUQrQixDQUFqQixDQUFILCt5QkF3Q1gsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxVQUFoQjtBQUFBLENBeENNLENBQXhCO0FBNkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsT0FBdUQ7QUFBQSxNQUFyREMsV0FBcUQsUUFBckRBLFdBQXFEO0FBQUEsd0JBQXhDQyxLQUF3QztBQUFBLE1BQXhDQSxLQUF3QywyQkFBaEMsR0FBZ0M7QUFBQSxnQ0FBM0JDLGFBQTJCO0FBQUEsTUFBM0JBLGFBQTJCLG1DQUFYLEtBQVc7O0FBQUEsY0FFeEVGLFdBQVcsSUFBSSxFQUZ5RDtBQUFBLE1BQ25FRyxLQURtRSxTQUNuRUEsS0FEbUU7QUFBQSxNQUM1REMsWUFENEQsU0FDNURBLFlBRDREO0FBQUEsTUFDOUNDLFVBRDhDLFNBQzlDQSxVQUQ4QztBQUFBLDhCQUNsQ0MsU0FEa0M7O0FBQUEsaURBQ0ksRUFESjtBQUFBLDhDQUN0QkMsTUFEc0I7QUFBQSxNQUN0QkEsTUFEc0Isc0NBQ2IsQ0FEYTtBQUFBLCtDQUNWQyxNQURVO0FBQUEsTUFDVkEsTUFEVSx1Q0FDRCxDQURDO0FBSTFFLE1BQU1DLFVBQVUsR0FBRztBQUNqQlIsSUFBQUEsS0FBSyxZQUFLQSxLQUFMLE9BRFk7QUFFakJTLElBQUFBLE1BQU0sWUFBTUYsTUFBTSxJQUFJRCxNQUFNLElBQUksQ0FBZCxDQUFQLEdBQTJCTixLQUFoQztBQUZXLEdBQW5CO0FBS0Esc0JBQ0UsZ0NBQUMsa0JBQUQsUUFDR0MsYUFBYSxnQkFDWjtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDR0ssTUFESCxlQUNvQkMsTUFEcEIsV0FEWSxHQUlWLElBTE4sZUFNRTtBQUFLLElBQUEsU0FBUyxFQUFDLGVBQWY7QUFBK0IsSUFBQSxLQUFLLEVBQUVDO0FBQXRDLEtBQ0dKLFVBQVUsZ0JBQ1Q7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLGtCQUNFLGdDQUFDLDBCQUFELE9BREYsQ0FEUyxHQUlQRixLQUFLLGdCQUNQO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixrQkFDRSw4Q0FBT0EsS0FBSyxDQUFDUSxPQUFOLElBQWlCLDRCQUF4QixDQURGLENBRE8sZ0JBS1A7QUFBSyxJQUFBLFNBQVMsRUFBQywyQkFBZjtBQUEyQyxJQUFBLEdBQUcsRUFBRVA7QUFBaEQsSUFWSixDQU5GLENBREY7QUFzQkQsQ0EvQkQ7O2VBaUNlTCxZIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IExvYWRpbmdTcGlubmVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2xvYWRpbmctc3Bpbm5lcic7XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi8uLi9yZWR1Y2Vycy91aS1zdGF0ZS11cGRhdGVycycpLkV4cG9ydEltYWdlfSBFeHBvcnRJbWFnZSAqL1xuXG5jb25zdCBTdHlsZWRJbWFnZVByZXZpZXcgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnaW1hZ2UtcHJldmlldydcbn0pYFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBmbGV4OiAxO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcGFkZGluZzogMzBweDtcblxuICAuZGltZW5zaW9uLFxuICAuaW5zdHJ1Y3Rpb24ge1xuICAgIHBhZGRpbmc6IDhweCAwcHg7XG4gIH1cblxuICAucHJldmlldy1pbWFnZSB7XG4gICAgYmFja2dyb3VuZDogI2UyZTJlMjtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgYm94LXNoYWRvdzogMCA4cHggMTZweCAwIHJnYmEoMCwgMCwgMCwgMC4xOCk7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG5cbiAgLnByZXZpZXctaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gIH1cblxuICAucHJldmlldy1pbWFnZS1zcGlubmVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogY2FsYyg1MCUgLSAyNXB4KTtcbiAgICB0b3A6IGNhbGMoNTAlIC0gMjVweCk7XG4gIH1cblxuICAucHJldmlldy1pbWFnZS0tZXJyb3Ige1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBwYWRkaW5nOiAxMnB4O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmVycm9yQ29sb3J9O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxuYDtcblxuLyoqXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7RXhwb3J0SW1hZ2V9IFtwcm9wcy5leHBvcnRJbWFnZV1cbiAqIEBwYXJhbSB7bnVtYmVyfSBbcHJvcHMud2lkdGhdXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wcy5zaG93RGltZW5zaW9uXVxuICovXG5jb25zdCBJbWFnZVByZXZpZXcgPSAoe2V4cG9ydEltYWdlLCB3aWR0aCA9IDQwMCwgc2hvd0RpbWVuc2lvbiA9IGZhbHNlfSkgPT4ge1xuICBjb25zdCB7ZXJyb3IsIGltYWdlRGF0YVVyaSwgcHJvY2Vzc2luZywgaW1hZ2VTaXplOiB7aW1hZ2VXID0gMCwgaW1hZ2VIID0gMH0gPSB7fX0gPVxuICAgIGV4cG9ydEltYWdlIHx8IHt9O1xuXG4gIGNvbnN0IGltYWdlU3R5bGUgPSB7XG4gICAgd2lkdGg6IGAke3dpZHRofXB4YCxcbiAgICBoZWlnaHQ6IGAkeyhpbWFnZUggLyAoaW1hZ2VXIHx8IDEpKSAqIHdpZHRofXB4YFxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPFN0eWxlZEltYWdlUHJldmlldz5cbiAgICAgIHtzaG93RGltZW5zaW9uID8gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpbWVuc2lvblwiPlxuICAgICAgICAgIHtpbWFnZVd9IHBpeGVsIHgge2ltYWdlSH0gcGl4ZWxcbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogbnVsbH1cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJldmlldy1pbWFnZVwiIHN0eWxlPXtpbWFnZVN0eWxlfT5cbiAgICAgICAge3Byb2Nlc3NpbmcgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcmV2aWV3LWltYWdlLXNwaW5uZXJcIj5cbiAgICAgICAgICAgIDxMb2FkaW5nU3Bpbm5lciAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogZXJyb3IgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcmV2aWV3LWltYWdlLS1lcnJvclwiPlxuICAgICAgICAgICAgPHNwYW4+e2Vycm9yLm1lc3NhZ2UgfHwgJ0dlbmVyYXRlIG1hcCBpbWFnZSBmYWlsZWQhJ308L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJwcmV2aWV3LWltYWdlLXBsYWNlaG9sZGVyXCIgc3JjPXtpbWFnZURhdGFVcml9IC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L1N0eWxlZEltYWdlUHJldmlldz5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEltYWdlUHJldmlldztcbiJdfQ==