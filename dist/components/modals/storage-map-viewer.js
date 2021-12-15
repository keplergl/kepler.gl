"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _moment = _interopRequireDefault(require("moment"));

var _icons = require("../common/icons");

var _localization = require("../../localization");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var imageH = 108;
var propTypes = {
  onLoadAsset: _propTypes["default"].func.isRequired,
  back: _propTypes["default"].func.isRequired
};

var StyledAssetGallery = _styledComponents["default"].div.attrs({
  className: 'storage-asset-gallery'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: flex-start;\n  flex-wrap: wrap;\n"])));

var StyledAssetItem = _styledComponents["default"].div.attrs({
  className: 'asset__item'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  width: 23%;\n  margin-right: 2%;\n  max-width: 500px;\n  margin-bottom: 40px;\n  height: 245px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n\n  :last {\n    margin-right: 0;\n  }\n\n  .asset__title {\n    font-size: 12px;\n    font-weight: 500;\n    color: ", ";\n    line-height: 18px;\n    height: 32px;\n  }\n\n  .asset__image {\n    border-radius: 4px;\n    overflow: hidden;\n    margin-bottom: 12px;\n    opacity: 0.9;\n    transition: opacity 0.4s ease;\n    position: relative;\n    line-height: 0;\n    height: ", "px;\n    flex-shrink: 0;\n\n    img {\n      max-width: 100%;\n    }\n    :hover {\n      cursor: pointer;\n      opacity: 1;\n    }\n  }\n\n  .asset__image__caption {\n    font-size: 11px;\n    font-weight: 400;\n    line-height: 16px;\n    margin-top: 10px;\n    height: 48px;\n    overflow: hidden;\n    display: -webkit-box;\n    text-overflow: ellipsis;\n    -webkit-line-clamp: 3;\n    -webkit-box-orient: vertical;\n  }\n\n  .asset__last-updated {\n    font-size: 11px;\n    color: ", ";\n  }\n"])), function (props) {
  return props.theme.textColorLT;
}, imageH, function (props) {
  return props.theme.textColorLT;
});

var BackLink = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  font-size: 14px;\n  align-items: center;\n  color: ", ";\n  cursor: pointer;\n  margin-bottom: 40px;\n\n  :hover {\n    font-weight: 500;\n  }\n\n  span {\n    white-space: nowrap;\n  }\n  svg {\n    margin-right: 10px;\n  }\n"])), function (props) {
  return props.theme.titleColorLT;
});

var StyledError = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  color: red;\n  font-size: 14px;\n  margin-bottom: 16px;\n"])));

var getDuration = function getDuration(last) {
  return _moment["default"].duration(new Date().valueOf() - last).humanize();
};

var AssetItem = function AssetItem(_ref) {
  var asset = _ref.asset,
      onClick = _ref.onClick;
  return /*#__PURE__*/_react["default"].createElement(StyledAssetItem, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "asset__image",
    onClick: onClick
  }, asset.imageUrl && /*#__PURE__*/_react["default"].createElement("img", {
    src: asset.imageUrl
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "asset__title"
  }, asset.label || asset.title), /*#__PURE__*/_react["default"].createElement("div", {
    className: "asset__image__caption"
  }, asset.description), asset.lastUpdated ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "asset__last-updated"
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: 'modal.storageMapViewer.lastModified',
    values: {
      lastUpdated: getDuration(asset.lastUpdated)
    }
  })) : null);
};

var StorageAssetsViewer = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(StorageAssetsViewer, _React$Component);

  var _super = _createSuper(StorageAssetsViewer);

  function StorageAssetsViewer() {
    (0, _classCallCheck2["default"])(this, StorageAssetsViewer);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(StorageAssetsViewer, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          assets = _this$props.assets,
          onLoadAsset = _this$props.onLoadAsset,
          back = _this$props.back,
          error = _this$props.error;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "storage-asset-viewer"
      }, /*#__PURE__*/_react["default"].createElement(BackLink, {
        onClick: back
      }, /*#__PURE__*/_react["default"].createElement(_icons.LeftArrow, {
        height: "12px"
      }), /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
        id: 'modal.storageMapViewer.back'
      }))), error && /*#__PURE__*/_react["default"].createElement(StyledError, null, error.message), /*#__PURE__*/_react["default"].createElement(StyledAssetGallery, null, assets.map(function (sp) {
        return /*#__PURE__*/_react["default"].createElement(AssetItem, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9zdG9yYWdlLW1hcC12aWV3ZXIuanMiXSwibmFtZXMiOlsiaW1hZ2VIIiwicHJvcFR5cGVzIiwib25Mb2FkQXNzZXQiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImJhY2siLCJTdHlsZWRBc3NldEdhbGxlcnkiLCJzdHlsZWQiLCJkaXYiLCJhdHRycyIsImNsYXNzTmFtZSIsIlN0eWxlZEFzc2V0SXRlbSIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3JMVCIsIkJhY2tMaW5rIiwidGl0bGVDb2xvckxUIiwiU3R5bGVkRXJyb3IiLCJnZXREdXJhdGlvbiIsImxhc3QiLCJtb21lbnQiLCJkdXJhdGlvbiIsIkRhdGUiLCJ2YWx1ZU9mIiwiaHVtYW5pemUiLCJBc3NldEl0ZW0iLCJhc3NldCIsIm9uQ2xpY2siLCJpbWFnZVVybCIsImxhYmVsIiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsImxhc3RVcGRhdGVkIiwiU3RvcmFnZUFzc2V0c1ZpZXdlciIsImFzc2V0cyIsImVycm9yIiwibWVzc2FnZSIsIm1hcCIsInNwIiwiaWQiLCJSZWFjdCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHLEdBQWY7QUFFQSxJQUFNQyxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLFdBQVcsRUFBRUMsc0JBQVVDLElBQVYsQ0FBZUMsVUFEWjtBQUVoQkMsRUFBQUEsSUFBSSxFQUFFSCxzQkFBVUMsSUFBVixDQUFlQztBQUZMLENBQWxCOztBQUtBLElBQU1FLGtCQUFrQixHQUFHQyw2QkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQzFDQyxFQUFBQSxTQUFTLEVBQUU7QUFEK0IsQ0FBakIsQ0FBSCw4SkFBeEI7O0FBUUEsSUFBTUMsZUFBZSxHQUFHSiw2QkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQ3ZDQyxFQUFBQSxTQUFTLEVBQUU7QUFENEIsQ0FBakIsQ0FBSCxtb0NBbUJSLFVBQUFFLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsV0FBaEI7QUFBQSxDQW5CRyxFQWdDUGYsTUFoQ08sRUEyRFIsVUFBQWEsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxXQUFoQjtBQUFBLENBM0RHLENBQXJCOztBQStEQSxJQUFNQyxRQUFRLEdBQUdSLDZCQUFPQyxHQUFWLGlWQUlILFVBQUFJLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUcsWUFBaEI7QUFBQSxDQUpGLENBQWQ7O0FBb0JBLElBQU1DLFdBQVcsR0FBR1YsNkJBQU9DLEdBQVYscUpBQWpCOztBQU1BLElBQU1VLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUFDLElBQUk7QUFBQSxTQUFJQyxtQkFBT0MsUUFBUCxDQUFnQixJQUFJQyxJQUFKLEdBQVdDLE9BQVgsS0FBdUJKLElBQXZDLEVBQTZDSyxRQUE3QyxFQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTUMsU0FBUyxHQUFHLFNBQVpBLFNBQVk7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxNQUFTQyxPQUFULFFBQVNBLE9BQVQ7QUFBQSxzQkFDaEIsZ0NBQUMsZUFBRCxxQkFDRTtBQUFLLElBQUEsU0FBUyxFQUFDLGNBQWY7QUFBOEIsSUFBQSxPQUFPLEVBQUVBO0FBQXZDLEtBQ0dELEtBQUssQ0FBQ0UsUUFBTixpQkFBa0I7QUFBSyxJQUFBLEdBQUcsRUFBRUYsS0FBSyxDQUFDRTtBQUFoQixJQURyQixDQURGLGVBSUU7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQStCRixLQUFLLENBQUNHLEtBQU4sSUFBZUgsS0FBSyxDQUFDSSxLQUFwRCxDQUpGLGVBS0U7QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQXdDSixLQUFLLENBQUNLLFdBQTlDLENBTEYsRUFNR0wsS0FBSyxDQUFDTSxXQUFOLGdCQUNDO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixrQkFDRSxnQ0FBQyw4QkFBRDtBQUNFLElBQUEsRUFBRSxFQUFFLHFDQUROO0FBRUUsSUFBQSxNQUFNLEVBQUU7QUFBQ0EsTUFBQUEsV0FBVyxFQUFFZCxXQUFXLENBQUNRLEtBQUssQ0FBQ00sV0FBUDtBQUF6QjtBQUZWLElBREYsQ0FERCxHQU9HLElBYk4sQ0FEZ0I7QUFBQSxDQUFsQjs7SUFrQk1DLG1COzs7Ozs7Ozs7Ozs7V0FHSixrQkFBUztBQUFBLHdCQUNvQyxLQUFLckIsS0FEekM7QUFBQSxVQUNBc0IsTUFEQSxlQUNBQSxNQURBO0FBQUEsVUFDUWpDLFdBRFIsZUFDUUEsV0FEUjtBQUFBLFVBQ3FCSSxJQURyQixlQUNxQkEsSUFEckI7QUFBQSxVQUMyQjhCLEtBRDNCLGVBQzJCQSxLQUQzQjtBQUdQLDBCQUNFO0FBQUssUUFBQSxTQUFTLEVBQUM7QUFBZixzQkFDRSxnQ0FBQyxRQUFEO0FBQVUsUUFBQSxPQUFPLEVBQUU5QjtBQUFuQixzQkFDRSxnQ0FBQyxnQkFBRDtBQUFXLFFBQUEsTUFBTSxFQUFDO0FBQWxCLFFBREYsZUFFRSwyREFDRSxnQ0FBQyw4QkFBRDtBQUFrQixRQUFBLEVBQUUsRUFBRTtBQUF0QixRQURGLENBRkYsQ0FERixFQU9HOEIsS0FBSyxpQkFBSSxnQ0FBQyxXQUFELFFBQWNBLEtBQUssQ0FBQ0MsT0FBcEIsQ0FQWixlQVFFLGdDQUFDLGtCQUFELFFBQ0dGLE1BQU0sQ0FBQ0csR0FBUCxDQUFXLFVBQUFDLEVBQUU7QUFBQSw0QkFDWixnQ0FBQyxTQUFEO0FBQVcsVUFBQSxLQUFLLEVBQUVBLEVBQWxCO0FBQXNCLFVBQUEsR0FBRyxFQUFFQSxFQUFFLENBQUNDLEVBQTlCO0FBQWtDLFVBQUEsT0FBTyxFQUFFO0FBQUEsbUJBQU10QyxXQUFXLENBQUNxQyxFQUFELENBQWpCO0FBQUE7QUFBM0MsVUFEWTtBQUFBLE9BQWIsQ0FESCxDQVJGLENBREY7QUFnQkQ7OztFQXRCK0JFLGtCQUFNQyxTOztpQ0FBbENSLG1CLGVBQ2VqQyxTO2VBd0JOaUMsbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtMZWZ0QXJyb3d9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcblxuY29uc3QgaW1hZ2VIID0gMTA4O1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIG9uTG9hZEFzc2V0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBiYWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBTdHlsZWRBc3NldEdhbGxlcnkgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc3RvcmFnZS1hc3NldC1nYWxsZXJ5J1xufSlgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgZmxleC13cmFwOiB3cmFwO1xuYDtcblxuY29uc3QgU3R5bGVkQXNzZXRJdGVtID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2Fzc2V0X19pdGVtJ1xufSlgXG4gIHdpZHRoOiAyMyU7XG4gIG1hcmdpbi1yaWdodDogMiU7XG4gIG1heC13aWR0aDogNTAwcHg7XG4gIG1hcmdpbi1ib3R0b206IDQwcHg7XG4gIGhlaWdodDogMjQ1cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICA6bGFzdCB7XG4gICAgbWFyZ2luLXJpZ2h0OiAwO1xuICB9XG5cbiAgLmFzc2V0X190aXRsZSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICAgIGxpbmUtaGVpZ2h0OiAxOHB4O1xuICAgIGhlaWdodDogMzJweDtcbiAgfVxuXG4gIC5hc3NldF9faW1hZ2Uge1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIG1hcmdpbi1ib3R0b206IDEycHg7XG4gICAgb3BhY2l0eTogMC45O1xuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC40cyBlYXNlO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBsaW5lLWhlaWdodDogMDtcbiAgICBoZWlnaHQ6ICR7aW1hZ2VIfXB4O1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuXG4gICAgaW1nIHtcbiAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICB9XG4gICAgOmhvdmVyIHtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICB9XG5cbiAgLmFzc2V0X19pbWFnZV9fY2FwdGlvbiB7XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICBoZWlnaHQ6IDQ4cHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAtd2Via2l0LWxpbmUtY2xhbXA6IDM7XG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcbiAgfVxuXG4gIC5hc3NldF9fbGFzdC11cGRhdGVkIHtcbiAgICBmb250LXNpemU6IDExcHg7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICB9XG5gO1xuXG5jb25zdCBCYWNrTGluayA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVDb2xvckxUfTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBtYXJnaW4tYm90dG9tOiA0MHB4O1xuXG4gIDpob3ZlciB7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuXG4gIHNwYW4ge1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIH1cbiAgc3ZnIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZEVycm9yID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6IHJlZDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuYDtcblxuY29uc3QgZ2V0RHVyYXRpb24gPSBsYXN0ID0+IG1vbWVudC5kdXJhdGlvbihuZXcgRGF0ZSgpLnZhbHVlT2YoKSAtIGxhc3QpLmh1bWFuaXplKCk7XG5cbmNvbnN0IEFzc2V0SXRlbSA9ICh7YXNzZXQsIG9uQ2xpY2t9KSA9PiAoXG4gIDxTdHlsZWRBc3NldEl0ZW0+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJhc3NldF9faW1hZ2VcIiBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgIHthc3NldC5pbWFnZVVybCAmJiA8aW1nIHNyYz17YXNzZXQuaW1hZ2VVcmx9IC8+fVxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXNzZXRfX3RpdGxlXCI+e2Fzc2V0LmxhYmVsIHx8IGFzc2V0LnRpdGxlfTwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXNzZXRfX2ltYWdlX19jYXB0aW9uXCI+e2Fzc2V0LmRlc2NyaXB0aW9ufTwvZGl2PlxuICAgIHthc3NldC5sYXN0VXBkYXRlZCA/IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXNzZXRfX2xhc3QtdXBkYXRlZFwiPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZVxuICAgICAgICAgIGlkPXsnbW9kYWwuc3RvcmFnZU1hcFZpZXdlci5sYXN0TW9kaWZpZWQnfVxuICAgICAgICAgIHZhbHVlcz17e2xhc3RVcGRhdGVkOiBnZXREdXJhdGlvbihhc3NldC5sYXN0VXBkYXRlZCl9fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKSA6IG51bGx9XG4gIDwvU3R5bGVkQXNzZXRJdGVtPlxuKTtcblxuY2xhc3MgU3RvcmFnZUFzc2V0c1ZpZXdlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHthc3NldHMsIG9uTG9hZEFzc2V0LCBiYWNrLCBlcnJvcn0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RvcmFnZS1hc3NldC12aWV3ZXJcIj5cbiAgICAgICAgPEJhY2tMaW5rIG9uQ2xpY2s9e2JhY2t9PlxuICAgICAgICAgIDxMZWZ0QXJyb3cgaGVpZ2h0PVwiMTJweFwiIC8+XG4gICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnN0b3JhZ2VNYXBWaWV3ZXIuYmFjayd9IC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L0JhY2tMaW5rPlxuICAgICAgICB7ZXJyb3IgJiYgPFN0eWxlZEVycm9yPntlcnJvci5tZXNzYWdlfTwvU3R5bGVkRXJyb3I+fVxuICAgICAgICA8U3R5bGVkQXNzZXRHYWxsZXJ5PlxuICAgICAgICAgIHthc3NldHMubWFwKHNwID0+IChcbiAgICAgICAgICAgIDxBc3NldEl0ZW0gYXNzZXQ9e3NwfSBrZXk9e3NwLmlkfSBvbkNsaWNrPXsoKSA9PiBvbkxvYWRBc3NldChzcCl9IC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvU3R5bGVkQXNzZXRHYWxsZXJ5PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdG9yYWdlQXNzZXRzVmlld2VyO1xuIl19