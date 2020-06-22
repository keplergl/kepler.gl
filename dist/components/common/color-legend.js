"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegendRow = exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n\n  max-height: 150px;\n  overflow-y: auto;\n\n  svg {\n    text {\n      font-size: 9px;\n      fill: ", ";\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ROW_H = 10;
var GAP = 4;
var RECT_W = 20;

var StyledLegend = _styledComponents["default"].div(_templateObject(), function (props) {
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

var ColorLegend =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ColorLegend, _Component);

  function ColorLegend() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, ColorLegend);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(ColorLegend)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
      var scaleFunction = _defaultSettings.SCALE_FUNC[scaleType]; // color scale can only be quantize, quantile or ordinal

      var scale = scaleFunction().domain(domain).range(range);

      if (scaleType === _defaultSettings.SCALE_TYPES.ordinal) {
        return getOrdinalLegends(scale);
      }

      var formatLabel = labelFormat || getQuantLabelFormat(scale.domain(), fieldType);
      return getQuantLegends(scale, formatLabel);
    }));
    return _this;
  }

  (0, _createClass2["default"])(ColorLegend, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          scaleType = _this$props.scaleType,
          domain = _this$props.domain,
          range = _this$props.range,
          _this$props$displayLa = _this$props.displayLabel,
          displayLabel = _this$props$displayLa === void 0 ? true : _this$props$displayLa;

      if (!domain || !range || !scaleType) {
        return null;
      }

      var legends = this.legendsSelector(this.props);
      var height = legends.data.length * (ROW_H + GAP);
      return _react["default"].createElement(StyledLegend, null, _react["default"].createElement("svg", {
        width: width - 24,
        height: height
      }, legends.data.map(function (color, idx) {
        return _react["default"].createElement(LegendRow, {
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
  range: _propTypes["default"].arrayOf(_propTypes["default"].string),
  labelFormat: _propTypes["default"].func
});

var LegendRow = function LegendRow(_ref) {
  var _ref$label = _ref.label,
      label = _ref$label === void 0 ? '' : _ref$label,
      displayLabel = _ref.displayLabel,
      color = _ref.color,
      idx = _ref.idx;
  return _react["default"].createElement("g", {
    transform: "translate(0, ".concat(idx * (ROW_H + GAP), ")")
  }, _react["default"].createElement("rect", {
    width: RECT_W,
    height: ROW_H,
    style: {
      fill: color
    }
  }), _react["default"].createElement("text", {
    x: RECT_W + 8,
    y: ROW_H - 1
  }, displayLabel ? label.toString() : ''));
};

exports.LegendRow = LegendRow;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jb2xvci1sZWdlbmQuanMiXSwibmFtZXMiOlsiUk9XX0giLCJHQVAiLCJSRUNUX1ciLCJTdHlsZWRMZWdlbmQiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwic2lkZVBhbmVsU2Nyb2xsQmFyIiwidGV4dENvbG9yIiwiZGVmYXVsdEZvcm1hdCIsImQiLCJnZXRUaW1lTGFiZWxGb3JtYXQiLCJkb21haW4iLCJmb3JtYXR0ZXIiLCJ2YWwiLCJtb21lbnQiLCJ1dGMiLCJmb3JtYXQiLCJnZXROdW1lcmljTGFiZWxGb3JtYXQiLCJkaWZmIiwiZ2V0UXVhbnRMYWJlbEZvcm1hdCIsImZpZWxkVHlwZSIsIkFMTF9GSUVMRF9UWVBFUyIsInRpbWVzdGFtcCIsImdldE9yZGluYWxMZWdlbmRzIiwic2NhbGUiLCJkYXRhIiwibWFwIiwibGFiZWxzIiwiZ2V0UXVhbnRMZWdlbmRzIiwibGFiZWxGb3JtYXQiLCJpbnZlcnRFeHRlbnQiLCJyYW5nZSIsImludmVydCIsIkNvbG9yTGVnZW5kIiwic2NhbGVUeXBlIiwiZG9tYWluU2VsZWN0b3IiLCJyYW5nZVNlbGVjdG9yIiwic2NhbGVUeXBlU2VsZWN0b3IiLCJsYWJlbEZvcm1hdFNlbGVjdG9yIiwiZmllbGRUeXBlU2VsZWN0b3IiLCJzY2FsZUZ1bmN0aW9uIiwiU0NBTEVfRlVOQyIsIlNDQUxFX1RZUEVTIiwib3JkaW5hbCIsImZvcm1hdExhYmVsIiwid2lkdGgiLCJkaXNwbGF5TGFiZWwiLCJsZWdlbmRzIiwibGVnZW5kc1NlbGVjdG9yIiwiaGVpZ2h0IiwibGVuZ3RoIiwiY29sb3IiLCJpZHgiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwib25lT2ZUeXBlIiwiYXJyYXkiLCJvYmplY3QiLCJhcnJheU9mIiwiZnVuYyIsIkxlZ2VuZFJvdyIsImxhYmVsIiwiZmlsbCIsInRvU3RyaW5nIl0sIm1h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RUFBa0JMLHNCQUFVTSxNQUE1QixDQUFwQixDQUhTO0FBSWpCeEMsRUFBQUEsU0FBUyxFQUFFa0Msc0JBQVVHLE1BSko7QUFLakIxQixFQUFBQSxLQUFLLEVBQUV1QixzQkFBVU8sT0FBVixDQUFrQlAsc0JBQVVHLE1BQTVCLENBTFU7QUFNakI1QixFQUFBQSxXQUFXLEVBQUV5QixzQkFBVVE7QUFOTixDOztBQWtFZCxJQUFNQyxTQUFTLEdBQUcsU0FBWkEsU0FBWTtBQUFBLHdCQUFFQyxLQUFGO0FBQUEsTUFBRUEsS0FBRiwyQkFBVSxFQUFWO0FBQUEsTUFBY2xCLFlBQWQsUUFBY0EsWUFBZDtBQUFBLE1BQTRCSyxLQUE1QixRQUE0QkEsS0FBNUI7QUFBQSxNQUFtQ0MsR0FBbkMsUUFBbUNBLEdBQW5DO0FBQUEsU0FDdkI7QUFBRyxJQUFBLFNBQVMseUJBQWtCQSxHQUFHLElBQUl0RCxLQUFLLEdBQUdDLEdBQVosQ0FBckI7QUFBWixLQUNFO0FBQU0sSUFBQSxLQUFLLEVBQUVDLE1BQWI7QUFBcUIsSUFBQSxNQUFNLEVBQUVGLEtBQTdCO0FBQW9DLElBQUEsS0FBSyxFQUFFO0FBQUNtRSxNQUFBQSxJQUFJLEVBQUVkO0FBQVA7QUFBM0MsSUFERixFQUVFO0FBQU0sSUFBQSxDQUFDLEVBQUVuRCxNQUFNLEdBQUcsQ0FBbEI7QUFBcUIsSUFBQSxDQUFDLEVBQUVGLEtBQUssR0FBRztBQUFoQyxLQUNHZ0QsWUFBWSxHQUFHa0IsS0FBSyxDQUFDRSxRQUFOLEVBQUgsR0FBc0IsRUFEckMsQ0FGRixDQUR1QjtBQUFBLENBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAnZDMtZm9ybWF0JztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7U0NBTEVfVFlQRVMsIFNDQUxFX0ZVTkMsIEFMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlcn0gZnJvbSAndXRpbHMvZmlsdGVyLXV0aWxzJztcblxuY29uc3QgUk9XX0ggPSAxMDtcbmNvbnN0IEdBUCA9IDQ7XG5jb25zdCBSRUNUX1cgPSAyMDtcblxuY29uc3QgU3R5bGVkTGVnZW5kID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxTY3JvbGxCYXJ9O1xuXG4gIG1heC1oZWlnaHQ6IDE1MHB4O1xuICBvdmVyZmxvdy15OiBhdXRvO1xuXG4gIHN2ZyB7XG4gICAgdGV4dCB7XG4gICAgICBmb250LXNpemU6IDlweDtcbiAgICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IGRlZmF1bHRGb3JtYXQgPSBkID0+IGQ7XG5cbmNvbnN0IGdldFRpbWVMYWJlbEZvcm1hdCA9IGRvbWFpbiA9PiB7XG4gIGNvbnN0IGZvcm1hdHRlciA9IGdldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyKGRvbWFpbik7XG4gIHJldHVybiB2YWwgPT4gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdChmb3JtYXR0ZXIpO1xufTtcblxuY29uc3QgZ2V0TnVtZXJpY0xhYmVsRm9ybWF0ID0gZG9tYWluID0+IHtcbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcblxuICBpZiAoZGlmZiA8IDEwKSB7XG4gICAgcmV0dXJuIGZvcm1hdCgnLjJmJyk7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0KCcuMWYnKTtcbn07XG5cbmNvbnN0IGdldFF1YW50TGFiZWxGb3JtYXQgPSAoZG9tYWluLCBmaWVsZFR5cGUpID0+IHtcbiAgLy8gcXVhbnQgc2NhbGUgY2FuIG9ubHkgYmUgYXNzaWduZWQgdG8gbGluZWFyIEZpZWxkczogcmVhbCwgdGltZXN0YW1wLCBpbnRlZ2VyXG4gIHJldHVybiBmaWVsZFR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXBcbiAgICA/IGdldFRpbWVMYWJlbEZvcm1hdChkb21haW4pXG4gICAgOiAhZmllbGRUeXBlXG4gICAgPyBkZWZhdWx0Rm9ybWF0XG4gICAgOiBnZXROdW1lcmljTGFiZWxGb3JtYXQoZG9tYWluKTtcbn07XG5cbmNvbnN0IGdldE9yZGluYWxMZWdlbmRzID0gc2NhbGUgPT4ge1xuICBjb25zdCBkb21haW4gPSBzY2FsZS5kb21haW4oKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBkb21haW4ubWFwKHNjYWxlKSxcbiAgICBsYWJlbHM6IGRvbWFpblxuICB9O1xufTtcblxuY29uc3QgZ2V0UXVhbnRMZWdlbmRzID0gKHNjYWxlLCBsYWJlbEZvcm1hdCkgPT4ge1xuICBpZiAodHlwZW9mIHNjYWxlLmludmVydEV4dGVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIG9ubHkgcXVhbnRpbGUsIHF1YW50aXplLCB0aHJlc2hvbGQgc2NhbGUgaGFzIGludmVydEV4dGVudCBtZXRob2RcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogW10sXG4gICAgICBsYWJlbHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IGxhYmVscyA9IHNjYWxlLnJhbmdlKCkubWFwKGQgPT4ge1xuICAgIGNvbnN0IGludmVydCA9IHNjYWxlLmludmVydEV4dGVudChkKTtcbiAgICByZXR1cm4gYCR7bGFiZWxGb3JtYXQoaW52ZXJ0WzBdKX0gdG8gJHtsYWJlbEZvcm1hdChpbnZlcnRbMV0pfWA7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZGF0YTogc2NhbGUucmFuZ2UoKSxcbiAgICBsYWJlbHNcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbG9yTGVnZW5kIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHNjYWxlVHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkb21haW46IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5hcnJheSwgUHJvcFR5cGVzLm9iamVjdF0pLFxuICAgIGZpZWxkVHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICByYW5nZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgbGFiZWxGb3JtYXQ6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgZG9tYWluU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5kb21haW47XG4gIHJhbmdlU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5yYW5nZTtcbiAgbGFiZWxGb3JtYXRTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmxhYmVsRm9ybWF0O1xuICBzY2FsZVR5cGVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnNjYWxlVHlwZTtcbiAgZmllbGRUeXBlU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWVsZFR5cGU7XG5cbiAgbGVnZW5kc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5kb21haW5TZWxlY3RvcixcbiAgICB0aGlzLnJhbmdlU2VsZWN0b3IsXG4gICAgdGhpcy5zY2FsZVR5cGVTZWxlY3RvcixcbiAgICB0aGlzLmxhYmVsRm9ybWF0U2VsZWN0b3IsXG4gICAgdGhpcy5maWVsZFR5cGVTZWxlY3RvcixcbiAgICAoZG9tYWluLCByYW5nZSwgc2NhbGVUeXBlLCBsYWJlbEZvcm1hdCwgZmllbGRUeXBlKSA9PiB7XG4gICAgICBjb25zdCBzY2FsZUZ1bmN0aW9uID0gU0NBTEVfRlVOQ1tzY2FsZVR5cGVdO1xuICAgICAgLy8gY29sb3Igc2NhbGUgY2FuIG9ubHkgYmUgcXVhbnRpemUsIHF1YW50aWxlIG9yIG9yZGluYWxcbiAgICAgIGNvbnN0IHNjYWxlID0gc2NhbGVGdW5jdGlvbigpXG4gICAgICAgIC5kb21haW4oZG9tYWluKVxuICAgICAgICAucmFuZ2UocmFuZ2UpO1xuXG4gICAgICBpZiAoc2NhbGVUeXBlID09PSBTQ0FMRV9UWVBFUy5vcmRpbmFsKSB7XG4gICAgICAgIHJldHVybiBnZXRPcmRpbmFsTGVnZW5kcyhzY2FsZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvcm1hdExhYmVsID0gbGFiZWxGb3JtYXQgfHwgZ2V0UXVhbnRMYWJlbEZvcm1hdChzY2FsZS5kb21haW4oKSwgZmllbGRUeXBlKTtcblxuICAgICAgcmV0dXJuIGdldFF1YW50TGVnZW5kcyhzY2FsZSwgZm9ybWF0TGFiZWwpO1xuICAgIH1cbiAgKTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3dpZHRoLCBzY2FsZVR5cGUsIGRvbWFpbiwgcmFuZ2UsIGRpc3BsYXlMYWJlbCA9IHRydWV9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghZG9tYWluIHx8ICFyYW5nZSB8fCAhc2NhbGVUeXBlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBsZWdlbmRzID0gdGhpcy5sZWdlbmRzU2VsZWN0b3IodGhpcy5wcm9wcyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gbGVnZW5kcy5kYXRhLmxlbmd0aCAqIChST1dfSCArIEdBUCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExlZ2VuZD5cbiAgICAgICAgPHN2ZyB3aWR0aD17d2lkdGggLSAyNH0gaGVpZ2h0PXtoZWlnaHR9PlxuICAgICAgICAgIHtsZWdlbmRzLmRhdGEubWFwKChjb2xvciwgaWR4KSA9PiAoXG4gICAgICAgICAgICA8TGVnZW5kUm93XG4gICAgICAgICAgICAgIGtleT17aWR4fVxuICAgICAgICAgICAgICBsYWJlbD17bGVnZW5kcy5sYWJlbHNbaWR4XX1cbiAgICAgICAgICAgICAgZGlzcGxheUxhYmVsPXtkaXNwbGF5TGFiZWx9XG4gICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvU3R5bGVkTGVnZW5kPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IExlZ2VuZFJvdyA9ICh7bGFiZWwgPSAnJywgZGlzcGxheUxhYmVsLCBjb2xvciwgaWR4fSkgPT4gKFxuICA8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoMCwgJHtpZHggKiAoUk9XX0ggKyBHQVApfSlgfT5cbiAgICA8cmVjdCB3aWR0aD17UkVDVF9XfSBoZWlnaHQ9e1JPV19IfSBzdHlsZT17e2ZpbGw6IGNvbG9yfX0gLz5cbiAgICA8dGV4dCB4PXtSRUNUX1cgKyA4fSB5PXtST1dfSCAtIDF9PlxuICAgICAge2Rpc3BsYXlMYWJlbCA/IGxhYmVsLnRvU3RyaW5nKCkgOiAnJ31cbiAgICA8L3RleHQ+XG4gIDwvZz5cbik7XG4iXX0=