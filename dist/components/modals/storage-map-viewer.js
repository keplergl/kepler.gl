"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _moment = _interopRequireDefault(require("moment"));

var _icons = require("../common/icons");

var _reactIntl = require("react-intl");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: red;\n  font-size: 14px;\n  margin-bottom: 16px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  font-size: 14px;\n  align-items: center;\n  color: ", ";\n  cursor: pointer;\n  margin-bottom: 40px;\n\n  :hover {\n    font-weight: 500;\n  }\n\n  span {\n    white-space: nowrap;\n  }\n  svg {\n    margin-right: 10px;\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 23%;\n  margin-right: 2%;\n  max-width: 500px;\n  margin-bottom: 40px;\n  height: 245px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n\n  :last {\n    margin-right: 0;\n  }\n\n  .asset__title {\n    font-size: 12px;\n    font-weight: 500;\n    color: ", ";\n    line-height: 18px;\n    height: 32px;\n  }\n\n  .asset__image {\n    border-radius: 4px;\n    overflow: hidden;\n    margin-bottom: 12px;\n    opacity: 0.9;\n    transition: opacity 0.4s ease;\n    position: relative;\n    line-height: 0;\n    height: ", "px;\n    flex-shrink: 0;\n\n    img {\n      max-width: 100%;\n    }\n    :hover {\n      cursor: pointer;\n      opacity: 1;\n    }\n  }\n\n  .asset__image__caption {\n    font-size: 11px;\n    font-weight: 400;\n    line-height: 16px;\n    margin-top: 10px;\n    height: 48px;\n    overflow: hidden;\n    display: -webkit-box;\n    text-overflow: ellipsis;\n    -webkit-line-clamp: 3;\n    -webkit-box-orient: vertical;\n  }\n\n  .asset__last-updated {\n    font-size: 11px;\n    color: ", ";\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: flex-start;\n  flex-wrap: wrap;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var imageH = 108;
var propTypes = {
  onLoadAsset: _propTypes["default"].func.isRequired,
  back: _propTypes["default"].func.isRequired
};

var StyledAssetGallery = _styledComponents["default"].div.attrs({
  className: 'storage-asset-gallery'
})(_templateObject());

var StyledAssetItem = _styledComponents["default"].div.attrs({
  className: 'asset__item'
})(_templateObject2(), function (props) {
  return props.theme.textColorLT;
}, imageH, function (props) {
  return props.theme.textColorLT;
});

var BackLink = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.theme.titleColorLT;
});

var StyledError = _styledComponents["default"].div(_templateObject4());

var getDuration = function getDuration(last) {
  return _moment["default"].duration(new Date().valueOf() - last).humanize();
};

var AssetItem = function AssetItem(_ref) {
  var asset = _ref.asset,
      onClick = _ref.onClick;
  return _react["default"].createElement(StyledAssetItem, null, _react["default"].createElement("div", {
    className: "asset__image",
    onClick: onClick
  }, asset.imageUrl && _react["default"].createElement("img", {
    src: asset.imageUrl
  })), _react["default"].createElement("div", {
    className: "asset__title"
  }, asset.label || asset.title), _react["default"].createElement("div", {
    className: "asset__image__caption"
  }, asset.description), asset.lastUpdated ? _react["default"].createElement("div", {
    className: "asset__last-updated"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.storageMapViewer.lastModified',
    values: {
      lastUpdated: getDuration(asset.lastUpdated)
    }
  })) : null);
};

var StorageAssetsViewer =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2["default"])(StorageAssetsViewer, _React$Component);

  function StorageAssetsViewer() {
    (0, _classCallCheck2["default"])(this, StorageAssetsViewer);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(StorageAssetsViewer).apply(this, arguments));
  }

  (0, _createClass2["default"])(StorageAssetsViewer, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          assets = _this$props.assets,
          onLoadAsset = _this$props.onLoadAsset,
          back = _this$props.back,
          error = _this$props.error;
      return _react["default"].createElement("div", {
        className: "storage-asset-viewer"
      }, _react["default"].createElement(BackLink, {
        onClick: back
      }, _react["default"].createElement(_icons.LeftArrow, {
        height: "12px"
      }), _react["default"].createElement("span", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: 'modal.storageMapViewer.back'
      }))), error && _react["default"].createElement(StyledError, null, error.message), _react["default"].createElement(StyledAssetGallery, null, assets.map(function (sp) {
        return _react["default"].createElement(AssetItem, {
          asset: sp,
          key: sp.id,
          onClick: function onClick() {
            return onLoadAsset(sp);
          }
        });
      })));
    }
  }]);
  return StorageAssetsViewer;
}(_react["default"].Component);

(0, _defineProperty2["default"])(StorageAssetsViewer, "propTypes", propTypes);
var _default = StorageAssetsViewer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9zdG9yYWdlLW1hcC12aWV3ZXIuanMiXSwibmFtZXMiOlsiaW1hZ2VIIiwicHJvcFR5cGVzIiwib25Mb2FkQXNzZXQiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImJhY2siLCJTdHlsZWRBc3NldEdhbGxlcnkiLCJzdHlsZWQiLCJkaXYiLCJhdHRycyIsImNsYXNzTmFtZSIsIlN0eWxlZEFzc2V0SXRlbSIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3JMVCIsIkJhY2tMaW5rIiwidGl0bGVDb2xvckxUIiwiU3R5bGVkRXJyb3IiLCJnZXREdXJhdGlvbiIsImxhc3QiLCJtb21lbnQiLCJkdXJhdGlvbiIsIkRhdGUiLCJ2YWx1ZU9mIiwiaHVtYW5pemUiLCJBc3NldEl0ZW0iLCJhc3NldCIsIm9uQ2xpY2siLCJpbWFnZVVybCIsImxhYmVsIiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsImxhc3RVcGRhdGVkIiwiU3RvcmFnZUFzc2V0c1ZpZXdlciIsImFzc2V0cyIsImVycm9yIiwibWVzc2FnZSIsIm1hcCIsInNwIiwiaWQiLCJSZWFjdCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLE1BQU0sR0FBRyxHQUFmO0FBRUEsSUFBTUMsU0FBUyxHQUFHO0FBQ2hCQyxFQUFBQSxXQUFXLEVBQUVDLHNCQUFVQyxJQUFWLENBQWVDLFVBRFo7QUFFaEJDLEVBQUFBLElBQUksRUFBRUgsc0JBQVVDLElBQVYsQ0FBZUM7QUFGTCxDQUFsQjs7QUFLQSxJQUFNRSxrQkFBa0IsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUMxQ0MsRUFBQUEsU0FBUyxFQUFFO0FBRCtCLENBQWpCLENBQUgs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QkQ7OztFQXRCK0JFLGtCQUFNQyxTOztpQ0FBbENSLG1CLGVBQ2VqQyxTO2VBd0JOaUMsbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtMZWZ0QXJyb3d9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmNvbnN0IGltYWdlSCA9IDEwODtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvbkxvYWRBc3NldDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgYmFjazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgU3R5bGVkQXNzZXRHYWxsZXJ5ID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3N0b3JhZ2UtYXNzZXQtZ2FsbGVyeSdcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGZsZXgtd3JhcDogd3JhcDtcbmA7XG5cbmNvbnN0IFN0eWxlZEFzc2V0SXRlbSA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdhc3NldF9faXRlbSdcbn0pYFxuICB3aWR0aDogMjMlO1xuICBtYXJnaW4tcmlnaHQ6IDIlO1xuICBtYXgtd2lkdGg6IDUwMHB4O1xuICBtYXJnaW4tYm90dG9tOiA0MHB4O1xuICBoZWlnaHQ6IDI0NXB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cbiAgOmxhc3Qge1xuICAgIG1hcmdpbi1yaWdodDogMDtcbiAgfVxuXG4gIC5hc3NldF9fdGl0bGUge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgICBsaW5lLWhlaWdodDogMThweDtcbiAgICBoZWlnaHQ6IDMycHg7XG4gIH1cblxuICAuYXNzZXRfX2ltYWdlIHtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICAgIG9wYWNpdHk6IDAuOTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNHMgZWFzZTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgbGluZS1oZWlnaHQ6IDA7XG4gICAgaGVpZ2h0OiAke2ltYWdlSH1weDtcbiAgICBmbGV4LXNocmluazogMDtcblxuICAgIGltZyB7XG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgfVxuICAgIDpob3ZlciB7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgIH1cbiAgfVxuXG4gIC5hc3NldF9faW1hZ2VfX2NhcHRpb24ge1xuICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxNnB4O1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gICAgaGVpZ2h0OiA0OHB4O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgZGlzcGxheTogLXdlYmtpdC1ib3g7XG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgLXdlYmtpdC1saW5lLWNsYW1wOiAzO1xuICAgIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XG4gIH1cblxuICAuYXNzZXRfX2xhc3QtdXBkYXRlZCB7XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgfVxuYDtcblxuY29uc3QgQmFja0xpbmsgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogNDBweDtcblxuICA6aG92ZXIge1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cblxuICBzcGFuIHtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB9XG4gIHN2ZyB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRFcnJvciA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiByZWQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgbWFyZ2luLWJvdHRvbTogMTZweDtcbmA7XG5cbmNvbnN0IGdldER1cmF0aW9uID0gbGFzdCA9PiBtb21lbnQuZHVyYXRpb24obmV3IERhdGUoKS52YWx1ZU9mKCkgLSBsYXN0KS5odW1hbml6ZSgpO1xuXG5jb25zdCBBc3NldEl0ZW0gPSAoe2Fzc2V0LCBvbkNsaWNrfSkgPT4gKFxuICA8U3R5bGVkQXNzZXRJdGVtPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXNzZXRfX2ltYWdlXCIgb25DbGljaz17b25DbGlja30+XG4gICAgICB7YXNzZXQuaW1hZ2VVcmwgJiYgPGltZyBzcmM9e2Fzc2V0LmltYWdlVXJsfSAvPn1cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImFzc2V0X190aXRsZVwiPnthc3NldC5sYWJlbCB8fCBhc3NldC50aXRsZX08L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImFzc2V0X19pbWFnZV9fY2FwdGlvblwiPnthc3NldC5kZXNjcmlwdGlvbn08L2Rpdj5cbiAgICB7YXNzZXQubGFzdFVwZGF0ZWQgPyAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFzc2V0X19sYXN0LXVwZGF0ZWRcIj5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2VcbiAgICAgICAgICBpZD17J21vZGFsLnN0b3JhZ2VNYXBWaWV3ZXIubGFzdE1vZGlmaWVkJ31cbiAgICAgICAgICB2YWx1ZXM9e3tsYXN0VXBkYXRlZDogZ2V0RHVyYXRpb24oYXNzZXQubGFzdFVwZGF0ZWQpfX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICkgOiBudWxsfVxuICA8L1N0eWxlZEFzc2V0SXRlbT5cbik7XG5cbmNsYXNzIFN0b3JhZ2VBc3NldHNWaWV3ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7YXNzZXRzLCBvbkxvYWRBc3NldCwgYmFjaywgZXJyb3J9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0b3JhZ2UtYXNzZXQtdmlld2VyXCI+XG4gICAgICAgIDxCYWNrTGluayBvbkNsaWNrPXtiYWNrfT5cbiAgICAgICAgICA8TGVmdEFycm93IGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zdG9yYWdlTWFwVmlld2VyLmJhY2snfSAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9CYWNrTGluaz5cbiAgICAgICAge2Vycm9yICYmIDxTdHlsZWRFcnJvcj57ZXJyb3IubWVzc2FnZX08L1N0eWxlZEVycm9yPn1cbiAgICAgICAgPFN0eWxlZEFzc2V0R2FsbGVyeT5cbiAgICAgICAgICB7YXNzZXRzLm1hcChzcCA9PiAoXG4gICAgICAgICAgICA8QXNzZXRJdGVtIGFzc2V0PXtzcH0ga2V5PXtzcC5pZH0gb25DbGljaz17KCkgPT4gb25Mb2FkQXNzZXQoc3ApfSAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L1N0eWxlZEFzc2V0R2FsbGVyeT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RvcmFnZUFzc2V0c1ZpZXdlcjtcbiJdfQ==