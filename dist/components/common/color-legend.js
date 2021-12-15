"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegendRow = exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reselect = require("reselect");

var _d3Format = require("d3-format");

var _moment = _interopRequireDefault(require("moment"));

var _defaultSettings = require("../../constants/default-settings");

var _filterUtils = require("../../utils/filter-utils");

var _utils = require("../../utils/utils");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ROW_H = 10;
var GAP = 4;
var RECT_W = 20;

var StyledLegend = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n\n  max-height: 150px;\n  overflow-y: auto;\n\n  svg {\n    text {\n      font-size: 9px;\n      fill: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.sidePanelScrollBar;
}, function (props) {
  return props.theme.textColor;
});

var defaultFormat = function defaultFormat(d) {
  return d;
};

var getTimeLabelFormat = function getTimeLabelFormat(domain) {
  var formatter = (0, _filterUtils.getTimeWidgetHintFormatter)(domain);
  return function (val) {
    return _moment["default"].utc(val).format(formatter);
  };
};

var getNumericLabelFormat = function getNumericLabelFormat(domain) {
  var diff = domain[1] - domain[0];

  if (diff < 10) {
    return (0, _d3Format.format)('.2f');
  }

  return (0, _d3Format.format)('.1f');
};

var getQuantLabelFormat = function getQuantLabelFormat(domain, fieldType) {
  // quant scale can only be assigned to linear Fields: real, timestamp, integer
  return fieldType === _defaultSettings.ALL_FIELD_TYPES.timestamp ? getTimeLabelFormat(domain) : !fieldType ? defaultFormat : getNumericLabelFormat(domain);
};

var getOrdinalLegends = function getOrdinalLegends(scale) {
  var domain = scale.domain();
  return {
    data: domain.map(scale),
    labels: domain
  };
};

var getQuantLegends = function getQuantLegends(scale, labelFormat) {
  if (typeof scale.invertExtent !== 'function') {
    // only quantile, quantize, threshold scale has invertExtent method
    return {
      data: [],
      labels: []
    };
  }

  var labels = scale.range().map(function (d) {
    var invert = scale.invertExtent(d);
    return "".concat(labelFormat(invert[0]), " to ").concat(labelFormat(invert[1]));
  });
  return {
    data: scale.range(),
    labels: labels
  };
};

var ColorLegend = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ColorLegend, _Component);

  var _super = _createSuper(ColorLegend);

  function ColorLegend() {
    var _this;

    (0, _classCallCheck2["default"])(this, ColorLegend);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "domainSelector", function (props) {
      return props.domain;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "rangeSelector", function (props) {
      return props.range;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "labelFormatSelector", function (props) {
      return props.labelFormat;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "scaleTypeSelector", function (props) {
      return props.scaleType;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "fieldTypeSelector", function (props) {
      return props.fieldType;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "legendsSelector", (0, _reselect.createSelector)(_this.domainSelector, _this.rangeSelector, _this.scaleTypeSelector, _this.labelFormatSelector, _this.fieldTypeSelector, function (domain, range, scaleType, labelFormat, fieldType) {
      var empty = {
        data: [],
        labels: []
      };

      if (!range) {
        return empty;
      }

      if ((0, _utils.isObject)(range.colorLegends)) {
        return {
          data: Object.keys(range.colorLegends),
          labels: Object.values(range.colorLegends)
        };
      } else if (Array.isArray(range.colorMap)) {
        return {
          data: range.colorMap.map(function (cm) {
            return cm[1];
          }),
          labels: range.colorMap.map(function (cm) {
            return cm[0];
          })
        };
      } else if (Array.isArray(range.colors)) {
        if (!domain || !scaleType) {
          return empty;
        }

        var scaleFunction = _defaultSettings.SCALE_FUNC[scaleType]; // color scale can only be quantize, quantile or ordinal

        var scale = scaleFunction().domain(domain).range(range.colors);

        if (scaleType === _defaultSettings.SCALE_TYPES.ordinal) {
          return getOrdinalLegends(scale);
        }

        var formatLabel = labelFormat || getQuantLabelFormat(scale.domain(), fieldType);
        return getQuantLegends(scale, formatLabel);
      }

      return empty;
    }));
    return _this;
  }

  (0, _createClass2["default"])(ColorLegend, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          _this$props$displayLa = _this$props.displayLabel,
          displayLabel = _this$props$displayLa === void 0 ? true : _this$props$displayLa;
      var legends = this.legendsSelector(this.props);
      var height = legends.data.length * (ROW_H + GAP);
      return /*#__PURE__*/_react["default"].createElement(StyledLegend, null, /*#__PURE__*/_react["default"].createElement("svg", {
        width: width,
        height: height
      }, legends.data.map(function (color, idx) {
        return /*#__PURE__*/_react["default"].createElement(LegendRow, {
          key: idx,
          label: legends.labels[idx],
          displayLabel: displayLabel,
          color: color,
          idx: idx
        });
      })));
    }
  }]);
  return ColorLegend;
}(_react.Component);

exports["default"] = ColorLegend;
(0, _defineProperty2["default"])(ColorLegend, "propTypes", {
  width: _propTypes["default"].number.isRequired,
  scaleType: _propTypes["default"].string,
  domain: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].object]),
  fieldType: _propTypes["default"].string,
  range: _propTypes["default"].object,
  labelFormat: _propTypes["default"].func
});

var LegendRow = function LegendRow(_ref) {
  var _ref$label = _ref.label,
      label = _ref$label === void 0 ? '' : _ref$label,
      displayLabel = _ref.displayLabel,
      color = _ref.color,
      idx = _ref.idx;
  return /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(0, ".concat(idx * (ROW_H + GAP), ")")
  }, /*#__PURE__*/_react["default"].createElement("rect", {
    width: RECT_W,
    height: ROW_H,
    style: {
      fill: color
    }
  }), /*#__PURE__*/_react["default"].createElement("text", {
    x: RECT_W + 8,
    y: ROW_H - 1
  }, displayLabel ? label.toString() : ''));
};

exports.LegendRow = LegendRow;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jb2xvci1sZWdlbmQuanMiXSwibmFtZXMiOlsiUk9XX0giLCJHQVAiLCJSRUNUX1ciLCJTdHlsZWRMZWdlbmQiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwic2lkZVBhbmVsU2Nyb2xsQmFyIiwidGV4dENvbG9yIiwiZGVmYXVsdEZvcm1hdCIsImQiLCJnZXRUaW1lTGFiZWxGb3JtYXQiLCJkb21haW4iLCJmb3JtYXR0ZXIiLCJ2YWwiLCJtb21lbnQiLCJ1dGMiLCJmb3JtYXQiLCJnZXROdW1lcmljTGFiZWxGb3JtYXQiLCJkaWZmIiwiZ2V0UXVhbnRMYWJlbEZvcm1hdCIsImZpZWxkVHlwZSIsIkFMTF9GSUVMRF9UWVBFUyIsInRpbWVzdGFtcCIsImdldE9yZGluYWxMZWdlbmRzIiwic2NhbGUiLCJkYXRhIiwibWFwIiwibGFiZWxzIiwiZ2V0UXVhbnRMZWdlbmRzIiwibGFiZWxGb3JtYXQiLCJpbnZlcnRFeHRlbnQiLCJyYW5nZSIsImludmVydCIsIkNvbG9yTGVnZW5kIiwic2NhbGVUeXBlIiwiZG9tYWluU2VsZWN0b3IiLCJyYW5nZVNlbGVjdG9yIiwic2NhbGVUeXBlU2VsZWN0b3IiLCJsYWJlbEZvcm1hdFNlbGVjdG9yIiwiZmllbGRUeXBlU2VsZWN0b3IiLCJlbXB0eSIsImNvbG9yTGVnZW5kcyIsIk9iamVjdCIsImtleXMiLCJ2YWx1ZXMiLCJBcnJheSIsImlzQXJyYXkiLCJjb2xvck1hcCIsImNtIiwiY29sb3JzIiwic2NhbGVGdW5jdGlvbiIsIlNDQUxFX0ZVTkMiLCJTQ0FMRV9UWVBFUyIsIm9yZGluYWwiLCJmb3JtYXRMYWJlbCIsIndpZHRoIiwiZGlzcGxheUxhYmVsIiwibGVnZW5kcyIsImxlZ2VuZHNTZWxlY3RvciIsImhlaWdodCIsImxlbmd0aCIsImNvbG9yIiwiaWR4IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsIm9uZU9mVHlwZSIsImFycmF5Iiwib2JqZWN0IiwiZnVuYyIsIkxlZ2VuZFJvdyIsImxhYmVsIiwiZmlsbCIsInRvU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLEVBQWQ7QUFDQSxJQUFNQyxHQUFHLEdBQUcsQ0FBWjtBQUNBLElBQU1DLE1BQU0sR0FBRyxFQUFmOztBQUVBLElBQU1DLFlBQVksR0FBR0MsNkJBQU9DLEdBQVYsNE5BQ2QsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxrQkFBaEI7QUFBQSxDQURTLEVBU0osVUFBQUYsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxTQUFoQjtBQUFBLENBVEQsQ0FBbEI7O0FBY0EsSUFBTUMsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFBQyxDQUFDO0FBQUEsU0FBSUEsQ0FBSjtBQUFBLENBQXZCOztBQUVBLElBQU1DLGtCQUFrQixHQUFHLFNBQXJCQSxrQkFBcUIsQ0FBQUMsTUFBTSxFQUFJO0FBQ25DLE1BQU1DLFNBQVMsR0FBRyw2Q0FBMkJELE1BQTNCLENBQWxCO0FBQ0EsU0FBTyxVQUFBRSxHQUFHO0FBQUEsV0FBSUMsbUJBQU9DLEdBQVAsQ0FBV0YsR0FBWCxFQUFnQkcsTUFBaEIsQ0FBdUJKLFNBQXZCLENBQUo7QUFBQSxHQUFWO0FBQ0QsQ0FIRDs7QUFLQSxJQUFNSyxxQkFBcUIsR0FBRyxTQUF4QkEscUJBQXdCLENBQUFOLE1BQU0sRUFBSTtBQUN0QyxNQUFNTyxJQUFJLEdBQUdQLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWUEsTUFBTSxDQUFDLENBQUQsQ0FBL0I7O0FBRUEsTUFBSU8sSUFBSSxHQUFHLEVBQVgsRUFBZTtBQUNiLFdBQU8sc0JBQU8sS0FBUCxDQUFQO0FBQ0Q7O0FBRUQsU0FB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LFNBQVpBLFNBQVk7QUFBQSx3QkFBRUMsS0FBRjtBQUFBLE1BQUVBLEtBQUYsMkJBQVUsRUFBVjtBQUFBLE1BQWNqQixZQUFkLFFBQWNBLFlBQWQ7QUFBQSxNQUE0QkssS0FBNUIsUUFBNEJBLEtBQTVCO0FBQUEsTUFBbUNDLEdBQW5DLFFBQW1DQSxHQUFuQztBQUFBLHNCQUN2QjtBQUFHLElBQUEsU0FBUyx5QkFBa0JBLEdBQUcsSUFBSWhFLEtBQUssR0FBR0MsR0FBWixDQUFyQjtBQUFaLGtCQUNFO0FBQU0sSUFBQSxLQUFLLEVBQUVDLE1BQWI7QUFBcUIsSUFBQSxNQUFNLEVBQUVGLEtBQTdCO0FBQW9DLElBQUEsS0FBSyxFQUFFO0FBQUM0RSxNQUFBQSxJQUFJLEVBQUViO0FBQVA7QUFBM0MsSUFERixlQUVFO0FBQU0sSUFBQSxDQUFDLEVBQUU3RCxNQUFNLEdBQUcsQ0FBbEI7QUFBcUIsSUFBQSxDQUFDLEVBQUVGLEtBQUssR0FBRztBQUFoQyxLQUNHMEQsWUFBWSxHQUFHaUIsS0FBSyxDQUFDRSxRQUFOLEVBQUgsR0FBc0IsRUFEckMsQ0FGRixDQUR1QjtBQUFBLENBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAnZDMtZm9ybWF0JztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7U0NBTEVfVFlQRVMsIFNDQUxFX0ZVTkMsIEFMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlcn0gZnJvbSAndXRpbHMvZmlsdGVyLXV0aWxzJztcbmltcG9ydCB7aXNPYmplY3R9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuY29uc3QgUk9XX0ggPSAxMDtcbmNvbnN0IEdBUCA9IDQ7XG5jb25zdCBSRUNUX1cgPSAyMDtcblxuY29uc3QgU3R5bGVkTGVnZW5kID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxTY3JvbGxCYXJ9O1xuXG4gIG1heC1oZWlnaHQ6IDE1MHB4O1xuICBvdmVyZmxvdy15OiBhdXRvO1xuXG4gIHN2ZyB7XG4gICAgdGV4dCB7XG4gICAgICBmb250LXNpemU6IDlweDtcbiAgICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IGRlZmF1bHRGb3JtYXQgPSBkID0+IGQ7XG5cbmNvbnN0IGdldFRpbWVMYWJlbEZvcm1hdCA9IGRvbWFpbiA9PiB7XG4gIGNvbnN0IGZvcm1hdHRlciA9IGdldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyKGRvbWFpbik7XG4gIHJldHVybiB2YWwgPT4gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdChmb3JtYXR0ZXIpO1xufTtcblxuY29uc3QgZ2V0TnVtZXJpY0xhYmVsRm9ybWF0ID0gZG9tYWluID0+IHtcbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcblxuICBpZiAoZGlmZiA8IDEwKSB7XG4gICAgcmV0dXJuIGZvcm1hdCgnLjJmJyk7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0KCcuMWYnKTtcbn07XG5cbmNvbnN0IGdldFF1YW50TGFiZWxGb3JtYXQgPSAoZG9tYWluLCBmaWVsZFR5cGUpID0+IHtcbiAgLy8gcXVhbnQgc2NhbGUgY2FuIG9ubHkgYmUgYXNzaWduZWQgdG8gbGluZWFyIEZpZWxkczogcmVhbCwgdGltZXN0YW1wLCBpbnRlZ2VyXG4gIHJldHVybiBmaWVsZFR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXBcbiAgICA/IGdldFRpbWVMYWJlbEZvcm1hdChkb21haW4pXG4gICAgOiAhZmllbGRUeXBlXG4gICAgPyBkZWZhdWx0Rm9ybWF0XG4gICAgOiBnZXROdW1lcmljTGFiZWxGb3JtYXQoZG9tYWluKTtcbn07XG5cbmNvbnN0IGdldE9yZGluYWxMZWdlbmRzID0gc2NhbGUgPT4ge1xuICBjb25zdCBkb21haW4gPSBzY2FsZS5kb21haW4oKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBkb21haW4ubWFwKHNjYWxlKSxcbiAgICBsYWJlbHM6IGRvbWFpblxuICB9O1xufTtcblxuY29uc3QgZ2V0UXVhbnRMZWdlbmRzID0gKHNjYWxlLCBsYWJlbEZvcm1hdCkgPT4ge1xuICBpZiAodHlwZW9mIHNjYWxlLmludmVydEV4dGVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIG9ubHkgcXVhbnRpbGUsIHF1YW50aXplLCB0aHJlc2hvbGQgc2NhbGUgaGFzIGludmVydEV4dGVudCBtZXRob2RcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogW10sXG4gICAgICBsYWJlbHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGxhYmVscyA9IHNjYWxlLnJhbmdlKCkubWFwKGQgPT4ge1xuICAgIGNvbnN0IGludmVydCA9IHNjYWxlLmludmVydEV4dGVudChkKTtcbiAgICByZXR1cm4gYCR7bGFiZWxGb3JtYXQoaW52ZXJ0WzBdKX0gdG8gJHtsYWJlbEZvcm1hdChpbnZlcnRbMV0pfWA7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZGF0YTogc2NhbGUucmFuZ2UoKSxcbiAgICBsYWJlbHNcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbG9yTGVnZW5kIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHNjYWxlVHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkb21haW46IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5hcnJheSwgUHJvcFR5cGVzLm9iamVjdF0pLFxuICAgIGZpZWxkVHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByYW5nZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBsYWJlbEZvcm1hdDogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBkb21haW5TZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmRvbWFpbjtcbiAgcmFuZ2VTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnJhbmdlO1xuICBsYWJlbEZvcm1hdFNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGFiZWxGb3JtYXQ7XG4gIHNjYWxlVHlwZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuc2NhbGVUeXBlO1xuICBmaWVsZFR5cGVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpZWxkVHlwZTtcblxuICBsZWdlbmRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICB0aGlzLmRvbWFpblNlbGVjdG9yLFxuICAgIHRoaXMucmFuZ2VTZWxlY3RvcixcbiAgICB0aGlzLnNjYWxlVHlwZVNlbGVjdG9yLFxuICAgIHRoaXMubGFiZWxGb3JtYXRTZWxlY3RvcixcbiAgICB0aGlzLmZpZWxkVHlwZVNlbGVjdG9yLFxuICAgIChkb21haW4sIHJhbmdlLCBzY2FsZVR5cGUsIGxhYmVsRm9ybWF0LCBmaWVsZFR5cGUpID0+IHtcbiAgICAgIGNvbnN0IGVtcHR5ID0ge1xuICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgbGFiZWxzOiBbXVxuICAgICAgfTtcbiAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgfVxuICAgICAgaWYgKGlzT2JqZWN0KHJhbmdlLmNvbG9yTGVnZW5kcykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkYXRhOiBPYmplY3Qua2V5cyhyYW5nZS5jb2xvckxlZ2VuZHMpLFxuICAgICAgICAgIGxhYmVsczogT2JqZWN0LnZhbHVlcyhyYW5nZS5jb2xvckxlZ2VuZHMpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmFuZ2UuY29sb3JNYXApKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGF0YTogcmFuZ2UuY29sb3JNYXAubWFwKGNtID0+IGNtWzFdKSxcbiAgICAgICAgICBsYWJlbHM6IHJhbmdlLmNvbG9yTWFwLm1hcChjbSA9PiBjbVswXSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyYW5nZS5jb2xvcnMpKSB7XG4gICAgICAgIGlmICghZG9tYWluIHx8ICFzY2FsZVR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzY2FsZUZ1bmN0aW9uID0gU0NBTEVfRlVOQ1tzY2FsZVR5cGVdO1xuICAgICAgICAvLyBjb2xvciBzY2FsZSBjYW4gb25seSBiZSBxdWFudGl6ZSwgcXVhbnRpbGUgb3Igb3JkaW5hbFxuICAgICAgICBjb25zdCBzY2FsZSA9IHNjYWxlRnVuY3Rpb24oKVxuICAgICAgICAgIC5kb21haW4oZG9tYWluKVxuICAgICAgICAgIC5yYW5nZShyYW5nZS5jb2xvcnMpO1xuXG4gICAgICAgIGlmIChzY2FsZVR5cGUgPT09IFNDQUxFX1RZUEVTLm9yZGluYWwpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0T3JkaW5hbExlZ2VuZHMoc2NhbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9ybWF0TGFiZWwgPSBsYWJlbEZvcm1hdCB8fCBnZXRRdWFudExhYmVsRm9ybWF0KHNjYWxlLmRvbWFpbigpLCBmaWVsZFR5cGUpO1xuXG4gICAgICAgIHJldHVybiBnZXRRdWFudExlZ2VuZHMoc2NhbGUsIGZvcm1hdExhYmVsKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbXB0eTtcbiAgICB9XG4gICk7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHt3aWR0aCwgZGlzcGxheUxhYmVsID0gdHJ1ZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbGVnZW5kcyA9IHRoaXMubGVnZW5kc1NlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgIGNvbnN0IGhlaWdodCA9IGxlZ2VuZHMuZGF0YS5sZW5ndGggKiAoUk9XX0ggKyBHQVApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMZWdlbmQ+XG4gICAgICAgIDxzdmcgd2lkdGg9e3dpZHRofSBoZWlnaHQ9e2hlaWdodH0+XG4gICAgICAgICAge2xlZ2VuZHMuZGF0YS5tYXAoKGNvbG9yLCBpZHgpID0+IChcbiAgICAgICAgICAgIDxMZWdlbmRSb3dcbiAgICAgICAgICAgICAga2V5PXtpZHh9XG4gICAgICAgICAgICAgIGxhYmVsPXtsZWdlbmRzLmxhYmVsc1tpZHhdfVxuICAgICAgICAgICAgICBkaXNwbGF5TGFiZWw9e2Rpc3BsYXlMYWJlbH1cbiAgICAgICAgICAgICAgY29sb3I9e2NvbG9yfVxuICAgICAgICAgICAgICBpZHg9e2lkeH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9TdHlsZWRMZWdlbmQ+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgTGVnZW5kUm93ID0gKHtsYWJlbCA9ICcnLCBkaXNwbGF5TGFiZWwsIGNvbG9yLCBpZHh9KSA9PiAoXG4gIDxnIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgwLCAke2lkeCAqIChST1dfSCArIEdBUCl9KWB9PlxuICAgIDxyZWN0IHdpZHRoPXtSRUNUX1d9IGhlaWdodD17Uk9XX0h9IHN0eWxlPXt7ZmlsbDogY29sb3J9fSAvPlxuICAgIDx0ZXh0IHg9e1JFQ1RfVyArIDh9IHk9e1JPV19IIC0gMX0+XG4gICAgICB7ZGlzcGxheUxhYmVsID8gbGFiZWwudG9TdHJpbmcoKSA6ICcnfVxuICAgIDwvdGV4dD5cbiAgPC9nPlxuKTtcbiJdfQ==