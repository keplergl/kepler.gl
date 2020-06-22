"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _imagePreview = _interopRequireDefault(require("../common/image-preview"));

var _defaultSettings = require("../../constants/default-settings");

var _styledComponents2 = require("../common/styled-components");

var _switch = _interopRequireDefault(require("../common/switch"));

var _reactIntl = require("react-intl");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  width: 250px;\n\n  .image-option-section {\n    .image-option-section-title {\n      font-weight: 500;\n      font-size: 14px;\n    }\n  }\n\n  .button-list {\n    display: flex;\n    flex-direction: row;\n    padding: 8px 0px;\n  }\n\n  input {\n    margin-right: 8px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ImageOptionList = _styledComponents["default"].div(_templateObject());

var ExportImageModalFactory = function ExportImageModalFactory() {
  var ExportImageModal =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(ExportImageModal, _Component);

    function ExportImageModal() {
      (0, _classCallCheck2["default"])(this, ExportImageModal);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ExportImageModal).apply(this, arguments));
    }

    (0, _createClass2["default"])(ExportImageModal, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._updateMapDim();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this._updateMapDim();
      }
    }, {
      key: "_updateMapDim",
      value: function _updateMapDim() {
        var _this$props = this.props,
            exportImage = _this$props.exportImage,
            mapH = _this$props.mapH,
            mapW = _this$props.mapW;

        if (mapH !== exportImage.mapH || mapW !== exportImage.mapW) {
          this.props.onUpdateSetting({
            mapH: mapH,
            mapW: mapW,
            ratio: _defaultSettings.EXPORT_IMG_RATIOS.CUSTOM,
            legend: false
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            exportImage = _this$props2.exportImage,
            onUpdateSetting = _this$props2.onUpdateSetting,
            intl = _this$props2.intl;
        var legend = exportImage.legend,
            ratio = exportImage.ratio,
            resolution = exportImage.resolution;
        return _react["default"].createElement(_styledComponents2.StyledModalContent, {
          className: "export-image-modal"
        }, _react["default"].createElement(ImageOptionList, null, _react["default"].createElement("div", {
          className: "image-option-section"
        }, _react["default"].createElement("div", {
          className: "image-option-section-title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportImage.ratioTitle'
        })), _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportImage.ratioDescription'
        }), _react["default"].createElement("div", {
          className: "button-list"
        }, _defaultSettings.EXPORT_IMG_RATIO_OPTIONS.filter(function (op) {
          return !op.hidden;
        }).map(function (op) {
          return _react["default"].createElement(_styledComponents2.SelectionButton, {
            key: op.id,
            selected: ratio === op.id,
            onClick: function onClick() {
              return onUpdateSetting({
                ratio: op.id
              });
            }
          }, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: op.label
          }));
        }))), _react["default"].createElement("div", {
          className: "image-option-section"
        }, _react["default"].createElement("div", {
          className: "image-option-section-title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportImage.resolutionTitle'
        })), _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportImage.resolutionDescription'
        }), _react["default"].createElement("div", {
          className: "button-list"
        }, _defaultSettings.EXPORT_IMG_RESOLUTION_OPTIONS.map(function (op) {
          return _react["default"].createElement(_styledComponents2.SelectionButton, {
            key: op.id,
            selected: resolution === op.id,
            onClick: function onClick() {
              return op.available && onUpdateSetting({
                resolution: op.id
              });
            }
          }, op.label);
        }))), _react["default"].createElement("div", {
          className: "image-option-section"
        }, _react["default"].createElement("div", {
          className: "image-option-section-title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.exportImage.mapLegendTitle'
        })), _react["default"].createElement(_switch["default"], {
          type: "checkbox",
          id: "add-map-legend",
          checked: legend,
          label: intl.formatMessage({
            id: 'modal.exportImage.mapLegendAdd'
          }),
          onChange: function onChange() {
            return onUpdateSetting({
              legend: !legend
            });
          }
        }))), _react["default"].createElement(_imagePreview["default"], {
          exportImage: exportImage
        }));
      }
    }]);
    return ExportImageModal;
  }(_react.Component);

  (0, _defineProperty2["default"])(ExportImageModal, "propTypes", {
    mapW: _propTypes["default"].number.isRequired,
    mapH: _propTypes["default"].number.isRequired,
    exportImage: _propTypes["default"].object.isRequired,
    // callbacks
    onUpdateSetting: _propTypes["default"].func.isRequired
  });
  return (0, _reactIntl.injectIntl)(ExportImageModal);
};

var _default = ExportImageModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtaW1hZ2UtbW9kYWwuanMiXSwibmFtZXMiOlsiSW1hZ2VPcHRpb25MaXN0Iiwic3R5bGVkIiwiZGl2IiwiRXhwb3J0SW1hZ2VNb2RhbEZhY3RvcnkiLCJFeHBvcnRJbWFnZU1vZGFsIiwiX3VwZGF0ZU1hcERpbSIsInByb3BzIiwiZXhwb3J0SW1hZ2UiLCJtYXBIIiwibWFwVyIsIm9uVXBkYXRlU2V0dGluZyIsInJhdGlvIiwiRVhQT1JUX0lNR19SQVRJT1MiLCJDVVNUT00iLCJsZWdlbmQiLCJpbnRsIiwicmVzb2x1dGlvbiIsIkVYUE9SVF9JTUdfUkFUSU9fT1BUSU9OUyIsImZpbHRlciIsIm9wIiwiaGlkZGVuIiwibWFwIiwiaWQiLCJsYWJlbCIsIkVYUE9SVF9JTUdfUkVTT0xVVElPTl9PUFRJT05TIiwiYXZhaWxhYmxlIiwiZm9ybWF0TWVzc2FnZSIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJvYmplY3QiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQU1BOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxlQUFlLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUFyQjs7QUF3QkEsSUFBTUMsdUJBQXVCLEdBQUcsU0FBMUJBLHVCQUEwQixHQUFNO0FBQUEsTUFDOUJDLGdCQUQ4QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsMENBVWQ7QUFDbEIsYUFBS0MsYUFBTDtBQUNEO0FBWmlDO0FBQUE7QUFBQSwyQ0FjYjtBQUNuQixhQUFLQSxhQUFMO0FBQ0Q7QUFoQmlDO0FBQUE7QUFBQSxzQ0FrQmxCO0FBQUEsMEJBQ29CLEtBQUtDLEtBRHpCO0FBQUEsWUFDUEMsV0FETyxlQUNQQSxXQURPO0FBQUEs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SyxVQUFBLFNBQVMsRUFBQztBQUFmLFdBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsVUFBQSxFQUFFLEVBQUU7QUFBdEIsVUFERixDQURGLEVBSUUsZ0NBQUMsa0JBQUQ7QUFDRSxVQUFBLElBQUksRUFBQyxVQURQO0FBRUUsVUFBQSxFQUFFLEVBQUMsZ0JBRkw7QUFHRSxVQUFBLE9BQU8sRUFBRVQsTUFIWDtBQUlFLFVBQUEsS0FBSyxFQUFFQyxJQUFJLENBQUNXLGFBQUwsQ0FBbUI7QUFBQ0osWUFBQUEsRUFBRSxFQUFFO0FBQUwsV0FBbkIsQ0FKVDtBQUtFLFVBQUEsUUFBUSxFQUFFO0FBQUEsbUJBQU1aLGVBQWUsQ0FBQztBQUFDSSxjQUFBQSxNQUFNLEVBQUUsQ0FBQ0E7QUFBVixhQUFELENBQXJCO0FBQUE7QUFMWixVQUpGLENBbkNGLENBREYsRUFpREUsZ0NBQUMsd0JBQUQ7QUFBYyxVQUFBLFdBQVcsRUFBRVA7QUFBM0IsVUFqREYsQ0FERjtBQXFERDtBQXZGaUM7QUFBQTtBQUFBLElBQ0xvQixnQkFESzs7QUFBQSxtQ0FDOUJ2QixnQkFEOEIsZUFFZjtBQUNqQkssSUFBQUEsSUFBSSxFQUFFbUIsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBRE47QUFFakJ0QixJQUFBQSxJQUFJLEVBQUVvQixzQkFBVUMsTUFBVixDQUFpQkMsVUFGTjtBQUdqQnZCLElBQUFBLFdBQVcsRUFBRXFCLHNCQUFVRyxNQUFWLENBQWlCRCxVQUhiO0FBSWpCO0FBQ0FwQixJQUFBQSxlQUFlLEVBQUVrQixzQkFBVUksSUFBVixDQUFlRjtBQUxmLEdBRmU7QUEwRnBDLFNBQU8sMkJBQVcxQixnQkFBWCxDQUFQO0FBQ0QsQ0EzRkQ7O2VBNkZlRCx1QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEltYWdlUHJldmlldyBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pbWFnZS1wcmV2aWV3JztcblxuaW1wb3J0IHtcbiAgRVhQT1JUX0lNR19SQVRJT19PUFRJT05TLFxuICBFWFBPUlRfSU1HX1JFU09MVVRJT05fT1BUSU9OUyxcbiAgRVhQT1JUX0lNR19SQVRJT1Ncbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5pbXBvcnQge1N0eWxlZE1vZGFsQ29udGVudCwgU2VsZWN0aW9uQnV0dG9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2UsIGluamVjdEludGx9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5jb25zdCBJbWFnZU9wdGlvbkxpc3QgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgd2lkdGg6IDI1MHB4O1xuXG4gIC5pbWFnZS1vcHRpb24tc2VjdGlvbiB7XG4gICAgLmltYWdlLW9wdGlvbi1zZWN0aW9uLXRpdGxlIHtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgfVxuICB9XG5cbiAgLmJ1dHRvbi1saXN0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgcGFkZGluZzogOHB4IDBweDtcbiAgfVxuXG4gIGlucHV0IHtcbiAgICBtYXJnaW4tcmlnaHQ6IDhweDtcbiAgfVxuYDtcblxuY29uc3QgRXhwb3J0SW1hZ2VNb2RhbEZhY3RvcnkgPSAoKSA9PiB7XG4gIGNsYXNzIEV4cG9ydEltYWdlTW9kYWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBtYXBXOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBtYXBIOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBleHBvcnRJbWFnZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgLy8gY2FsbGJhY2tzXG4gICAgICBvblVwZGF0ZVNldHRpbmc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgICB9O1xuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICB0aGlzLl91cGRhdGVNYXBEaW0oKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICB0aGlzLl91cGRhdGVNYXBEaW0oKTtcbiAgICB9XG5cbiAgICBfdXBkYXRlTWFwRGltKCkge1xuICAgICAgY29uc3Qge2V4cG9ydEltYWdlLCBtYXBILCBtYXBXfSA9IHRoaXMucHJvcHM7XG4gICAgICBpZiAobWFwSCAhPT0gZXhwb3J0SW1hZ2UubWFwSCB8fCBtYXBXICE9PSBleHBvcnRJbWFnZS5tYXBXKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25VcGRhdGVTZXR0aW5nKHtcbiAgICAgICAgICBtYXBILFxuICAgICAgICAgIG1hcFcsXG4gICAgICAgICAgcmF0aW86IEVYUE9SVF9JTUdfUkFUSU9TLkNVU1RPTSxcbiAgICAgICAgICBsZWdlbmQ6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtleHBvcnRJbWFnZSwgb25VcGRhdGVTZXR0aW5nLCBpbnRsfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCB7bGVnZW5kLCByYXRpbywgcmVzb2x1dGlvbn0gPSBleHBvcnRJbWFnZTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZE1vZGFsQ29udGVudCBjbGFzc05hbWU9XCJleHBvcnQtaW1hZ2UtbW9kYWxcIj5cbiAgICAgICAgICA8SW1hZ2VPcHRpb25MaXN0PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZS1vcHRpb24tc2VjdGlvblwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlLW9wdGlvbi1zZWN0aW9uLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRJbWFnZS5yYXRpb1RpdGxlJ30gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0SW1hZ2UucmF0aW9EZXNjcmlwdGlvbid9IC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uLWxpc3RcIj5cbiAgICAgICAgICAgICAgICB7RVhQT1JUX0lNR19SQVRJT19PUFRJT05TLmZpbHRlcihvcCA9PiAhb3AuaGlkZGVuKS5tYXAob3AgPT4gKFxuICAgICAgICAgICAgICAgICAgPFNlbGVjdGlvbkJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBrZXk9e29wLmlkfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17cmF0aW8gPT09IG9wLmlkfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblVwZGF0ZVNldHRpbmcoe3JhdGlvOiBvcC5pZH0pfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17b3AubGFiZWx9IC8+XG4gICAgICAgICAgICAgICAgICA8L1NlbGVjdGlvbkJ1dHRvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW1hZ2Utb3B0aW9uLXNlY3Rpb25cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZS1vcHRpb24tc2VjdGlvbi10aXRsZVwiPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0SW1hZ2UucmVzb2x1dGlvblRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0SW1hZ2UucmVzb2x1dGlvbkRlc2NyaXB0aW9uJ30gLz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidXR0b24tbGlzdFwiPlxuICAgICAgICAgICAgICAgIHtFWFBPUlRfSU1HX1JFU09MVVRJT05fT1BUSU9OUy5tYXAob3AgPT4gKFxuICAgICAgICAgICAgICAgICAgPFNlbGVjdGlvbkJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBrZXk9e29wLmlkfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17cmVzb2x1dGlvbiA9PT0gb3AuaWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9wLmF2YWlsYWJsZSAmJiBvblVwZGF0ZVNldHRpbmcoe3Jlc29sdXRpb246IG9wLmlkfSl9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtvcC5sYWJlbH1cbiAgICAgICAgICAgICAgICAgIDwvU2VsZWN0aW9uQnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZS1vcHRpb24tc2VjdGlvblwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlLW9wdGlvbi1zZWN0aW9uLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRJbWFnZS5tYXBMZWdlbmRUaXRsZSd9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICBpZD1cImFkZC1tYXAtbGVnZW5kXCJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtsZWdlbmR9XG4gICAgICAgICAgICAgICAgbGFiZWw9e2ludGwuZm9ybWF0TWVzc2FnZSh7aWQ6ICdtb2RhbC5leHBvcnRJbWFnZS5tYXBMZWdlbmRBZGQnfSl9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IG9uVXBkYXRlU2V0dGluZyh7bGVnZW5kOiAhbGVnZW5kfSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L0ltYWdlT3B0aW9uTGlzdD5cbiAgICAgICAgICA8SW1hZ2VQcmV2aWV3IGV4cG9ydEltYWdlPXtleHBvcnRJbWFnZX0gLz5cbiAgICAgICAgPC9TdHlsZWRNb2RhbENvbnRlbnQ+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmplY3RJbnRsKEV4cG9ydEltYWdlTW9kYWwpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRXhwb3J0SW1hZ2VNb2RhbEZhY3Rvcnk7XG4iXX0=