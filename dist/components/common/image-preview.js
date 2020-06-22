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

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  justify-content: center;\n  padding: 30px;\n\n  .dimension,\n  .instruction {\n    padding: 8px 0px;\n  }\n\n  .preview-image {\n    background: #e2e2e2;\n    border-radius: 4px;\n    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.18);\n    width: 100%;\n    position: relative;\n  }\n\n  .preview-image-placeholder {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n  }\n\n  .preview-image-spinner {\n    position: absolute;\n    left: calc(50% - 25px);\n    top: calc(50% - 25px);\n  }\n\n  .preview-image--error {\n    font-size: 12px;\n    padding: 12px;\n    color: ", ";\n    text-align: center;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledImagePreview = _styledComponents["default"].div.attrs({
  className: 'image-preview'
})(_templateObject(), function (props) {
  return props.theme.errorColor;
});

var ImagePreview = function ImagePreview(_ref) {
  var _ref$exportImage = _ref.exportImage,
      exportImage = _ref$exportImage === void 0 ? {} : _ref$exportImage,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 400 : _ref$width,
      showDimension = _ref.showDimension;
  var error = exportImage.error,
      imageDataUri = exportImage.imageDataUri,
      exporting = exportImage.exporting,
      _exportImage$imageSiz = exportImage.imageSize;
  _exportImage$imageSiz = _exportImage$imageSiz === void 0 ? {} : _exportImage$imageSiz;
  var imageW = _exportImage$imageSiz.imageW,
      imageH = _exportImage$imageSiz.imageH;
  var imageStyle = {
    width: "".concat(width, "px"),
    height: "".concat(imageH / (imageW || 1) * width, "px")
  };
  return _react["default"].createElement(StyledImagePreview, null, showDimension ? _react["default"].createElement("div", {
    className: "dimension"
  }, imageW, " pixel x ", imageH, " pixel") : null, _react["default"].createElement("div", {
    className: "preview-image",
    style: imageStyle
  }, exporting ? _react["default"].createElement("div", {
    className: "preview-image-spinner"
  }, _react["default"].createElement(_loadingSpinner["default"], null)) : error ? _react["default"].createElement("div", {
    className: "preview-image--error"
  }, _react["default"].createElement("span", null, " ", error.message || 'Generate map image failed!')) : _react["default"].createElement("img", {
    className: "preview-image-placeholder",
    src: imageDataUri
  })));
};

var _default = ImagePreview;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pbWFnZS1wcmV2aWV3LmpzIl0sIm5hbWVzIjpbIlN0eWxlZEltYWdlUHJldmlldyIsInN0eWxlZCIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJ0aGVtZSIsImVycm9yQ29sb3IiLCJJbWFnZVByZXZpZXciLCJleHBvcnRJbWFnZSIsIndpZHRoIiwic2hvd0RpbWVuc2lvbiIsImVycm9yIiwiaW1hZ2VEYXRhVXJpIiwiZXhwb3J0aW5nIiwiaW1hZ2VTaXplIiwiaW1hZ2VXIiwiaW1hZ2VIIiwiaW1hZ2VTdHlsZSIsImhlaWdodCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUMxQ0MsRUFBQUEsU0FBUyxFQUFFO0FBRCtCLENBQWpCLENBQUgsb0JBd0NYLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsVUFBaEI7QUFBQSxDQXhDTSxDQUF4Qjs7QUE2Q0EsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsT0FBb0Q7QUFBQSw4QkFBbERDLFdBQWtEO0FBQUEsTUFBbERBLFdBQWtELGlDQUFwQyxFQUFvQztBQUFBLHdCQUFoQ0MsS0FBZ0M7QUFBQSxNQUFoQ0EsS0FBZ0MsMkJBQXhCLEdBQXdCO0FBQUEsTUFBbkJDLGFBQW1CLFFBQW5CQSxhQUFtQjtBQUFBLE1BQ2hFQyxLQURnRSxHQUNJSCxXQURKLENBQ2hFRyxLQURnRTtBQUFBLE1BQ3pEQyxZQUR5RCxHQUNJSixXQURKLENBQ3pESSxZQUR5RDtBQUFBLE1BQzNDQyxTQUQyQyxHQUNJTCxXQURKLENBQzNDSyxTQUQyQztBQUFBLDhCQUNJTCxXQURKLENBQ2hDTSxTQURnQztBQUFBLDZEQUNGLEVBREU7QUFBQSxNQUNwQkMsTUFEb0IseUJBQ3BCQSxNQURvQjtBQUFBLE1BQ1pDLE1BRFkseUJBQ1pBLE1BRFk7QUFHdkUsTUFBTUMsVUFBVSxHQUFHO0FBQ2pCUixJQUFBQSxLQUFLLFlBQUtBLEtBQUwsT0FEWTtBQUVqQlMsSUFBQUEsTUFBTSxZQUFNRixNQUFNLElBQUlELE1BQU0sSUFBSSxDQUFkLENBQVAsR0FBMkJOLEtBQWhDO0FBRlcsR0FBbkI7QUFLQSxTQUNFLGdDQUFDLGtCQUFELFFBQ0dDLGFBQWEsR0FDWjtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDR0ssTUFESCxlQUNvQkMsTUFEcEIsV0FEWSxHQUlWLElBTE4sRUFNRTtBQUFLLElBQUEsU0FBUyxFQUFDLGVBQWY7QUFBK0IsSUFBQSxLQUFLLEVBQUVDO0FBQXRDLEtBQ0dKLFNBQVMsR0FDUjtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRSxnQ0FBQywwQkFBRCxPQURGLENBRFEsR0FJTkYsS0FBSyxHQUNQO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFLG1EQUFRQSxLQUFLLENBQUNRLE9BQU4sSUFBaUIsNEJBQXpCLENBREYsQ0FETyxHQUtQO0FBQUssSUFBQSxTQUFTLEVBQUMsMkJBQWY7QUFBMkMsSUFBQSxHQUFHLEVBQUVQO0FBQWhELElBVkosQ0FORixDQURGO0FBc0JELENBOUJEOztlQWdDZUwsWSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBMb2FkaW5nU3Bpbm5lciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9sb2FkaW5nLXNwaW5uZXInO1xuXG5jb25zdCBTdHlsZWRJbWFnZVByZXZpZXcgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnaW1hZ2UtcHJldmlldydcbn0pYFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBmbGV4OiAxO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcGFkZGluZzogMzBweDtcblxuICAuZGltZW5zaW9uLFxuICAuaW5zdHJ1Y3Rpb24ge1xuICAgIHBhZGRpbmc6IDhweCAwcHg7XG4gIH1cblxuICAucHJldmlldy1pbWFnZSB7XG4gICAgYmFja2dyb3VuZDogI2UyZTJlMjtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgYm94LXNoYWRvdzogMCA4cHggMTZweCAwIHJnYmEoMCwgMCwgMCwgMC4xOCk7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG5cbiAgLnByZXZpZXctaW1hZ2UtcGxhY2Vob2xkZXIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gIH1cblxuICAucHJldmlldy1pbWFnZS1zcGlubmVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogY2FsYyg1MCUgLSAyNXB4KTtcbiAgICB0b3A6IGNhbGMoNTAlIC0gMjVweCk7XG4gIH1cblxuICAucHJldmlldy1pbWFnZS0tZXJyb3Ige1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBwYWRkaW5nOiAxMnB4O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmVycm9yQ29sb3J9O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxuYDtcblxuY29uc3QgSW1hZ2VQcmV2aWV3ID0gKHtleHBvcnRJbWFnZSA9IHt9LCB3aWR0aCA9IDQwMCwgc2hvd0RpbWVuc2lvbn0pID0+IHtcbiAgY29uc3Qge2Vycm9yLCBpbWFnZURhdGFVcmksIGV4cG9ydGluZywgaW1hZ2VTaXplOiB7aW1hZ2VXLCBpbWFnZUh9ID0ge319ID0gZXhwb3J0SW1hZ2U7XG5cbiAgY29uc3QgaW1hZ2VTdHlsZSA9IHtcbiAgICB3aWR0aDogYCR7d2lkdGh9cHhgLFxuICAgIGhlaWdodDogYCR7KGltYWdlSCAvIChpbWFnZVcgfHwgMSkpICogd2lkdGh9cHhgXG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8U3R5bGVkSW1hZ2VQcmV2aWV3PlxuICAgICAge3Nob3dEaW1lbnNpb24gPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGltZW5zaW9uXCI+XG4gICAgICAgICAge2ltYWdlV30gcGl4ZWwgeCB7aW1hZ2VIfSBwaXhlbFxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiBudWxsfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcmV2aWV3LWltYWdlXCIgc3R5bGU9e2ltYWdlU3R5bGV9PlxuICAgICAgICB7ZXhwb3J0aW5nID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJldmlldy1pbWFnZS1zcGlubmVyXCI+XG4gICAgICAgICAgICA8TG9hZGluZ1NwaW5uZXIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IGVycm9yID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJldmlldy1pbWFnZS0tZXJyb3JcIj5cbiAgICAgICAgICAgIDxzcGFuPiB7ZXJyb3IubWVzc2FnZSB8fCAnR2VuZXJhdGUgbWFwIGltYWdlIGZhaWxlZCEnfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cInByZXZpZXctaW1hZ2UtcGxhY2Vob2xkZXJcIiBzcmM9e2ltYWdlRGF0YVVyaX0gLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvU3R5bGVkSW1hZ2VQcmV2aWV3PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSW1hZ2VQcmV2aWV3O1xuIl19