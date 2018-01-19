'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ';\n\n  max-height: 150px;\n  overflow-y: overlay;\n\n  svg {\n    text {\n      font-size: 9px;\n      fill: ', ';\n    }\n  }\n'], ['\n  ', ';\n\n  max-height: 150px;\n  overflow-y: overlay;\n\n  svg {\n    text {\n      font-size: 9px;\n      fill: ', ';\n    }\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reselect = require('reselect');

var _d3Format = require('d3-format');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _defaultSettings = require('../../constants/default-settings');

var _filterUtils = require('../../utils/filter-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ROW_H = 10;
var GAP = 4;
var RECT_W = 20;

var StyledLegend = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.dropdownScrollBar;
}, function (props) {
  return props.theme.textColor;
});

var defaultFormat = function defaultFormat(d) {
  return d;
};

var propTypes = {
  width: _react.PropTypes.number.isRequired,
  scaleType: _react.PropTypes.string.isRequired,
  domain: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]).isRequired,
  fieldType: _react.PropTypes.string,
  range: _react.PropTypes.arrayOf(_react.PropTypes.string),
  abelFormat: _react.PropTypes.func
};

var getTimeLabelFormat = function getTimeLabelFormat(domain) {
  var formatter = (0, _filterUtils.getTimeWidgetHintFormatter)(domain);
  return function (val) {
    return _moment2.default.utc(val).format(formatter);
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
  var labels = scale.range().map(function (d) {
    var invert = scale.invertExtent(d);
    return labelFormat(invert[0]) + ' to ' + labelFormat(invert[1]);
  });

  return {
    data: scale.range(),
    labels: labels
  };
};

var ColorLegend = function (_Component) {
  (0, _inherits3.default)(ColorLegend, _Component);

  function ColorLegend() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorLegend);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.domainSelector = function (props) {
      return props.domain;
    }, _this.rangeSelector = function (props) {
      return props.range;
    }, _this.labelFormatSelector = function (props) {
      return props.labelFormat;
    }, _this.scaleTypeSelector = function (props) {
      return props.scaleType;
    }, _this.fieldTypeSelector = function (props) {
      return props.fieldType;
    }, _this.legendsSelector = (0, _reselect.createSelector)(_this.domainSelector, _this.rangeSelector, _this.scaleTypeSelector, _this.labelFormatSelector, _this.fieldTypeSelector, function (domain, range, scaleType, labelFormat, fieldType) {
      var scaleFunction = _defaultSettings.SCALE_FUNC[scaleType];
      // color scale can only be quantize, quantile or ordinal
      var scale = scaleFunction().domain(domain).range(range);

      if (scaleType === _defaultSettings.SCALE_TYPES.ordinal) {
        return getOrdinalLegends(scale);
      }

      var formatLabel = labelFormat || getQuantLabelFormat(scale.domain(), fieldType);

      return getQuantLegends(scale, formatLabel);
    }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  ColorLegend.prototype.render = function render() {
    var _props = this.props,
        width = _props.width,
        scaleType = _props.scaleType,
        domain = _props.domain,
        range = _props.range,
        _props$displayLabel = _props.displayLabel,
        displayLabel = _props$displayLabel === undefined ? true : _props$displayLabel;


    if (!domain || !range || !scaleType) {
      return null;
    }

    var legends = this.legendsSelector(this.props);
    var height = legends.data.length * (ROW_H + GAP);

    return _react2.default.createElement(
      StyledLegend,
      null,
      _react2.default.createElement(
        'svg',
        { width: width - 24, height: height },
        legends.data.map(function (color, idx) {
          return _react2.default.createElement(LegendRow, {
            key: idx,
            label: legends.labels[idx],
            displayLabel: displayLabel,
            color: color,
            idx: idx
          });
        })
      )
    );
  };

  return ColorLegend;
}(_react.Component);

exports.default = ColorLegend;


var LegendRow = function LegendRow(_ref) {
  var _ref$label = _ref.label,
      label = _ref$label === undefined ? '' : _ref$label,
      displayLabel = _ref.displayLabel,
      color = _ref.color,
      idx = _ref.idx;
  return _react2.default.createElement(
    'g',
    { transform: 'translate(0, ' + idx * (ROW_H + GAP) + ')' },
    _react2.default.createElement('rect', { width: RECT_W, height: ROW_H, style: { fill: color } }),
    _react2.default.createElement(
      'text',
      { x: RECT_W + 8, y: ROW_H - 1 },
      displayLabel ? label.toString() : ''
    )
  );
};

ColorLegend.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jb2xvci1sZWdlbmQuanMiXSwibmFtZXMiOlsiUk9XX0giLCJHQVAiLCJSRUNUX1ciLCJTdHlsZWRMZWdlbmQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwiZHJvcGRvd25TY3JvbGxCYXIiLCJ0ZXh0Q29sb3IiLCJkZWZhdWx0Rm9ybWF0IiwiZCIsInByb3BUeXBlcyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInNjYWxlVHlwZSIsInN0cmluZyIsImRvbWFpbiIsIm9uZU9mVHlwZSIsImFycmF5Iiwib2JqZWN0IiwiZmllbGRUeXBlIiwicmFuZ2UiLCJhcnJheU9mIiwiYWJlbEZvcm1hdCIsImZ1bmMiLCJnZXRUaW1lTGFiZWxGb3JtYXQiLCJmb3JtYXR0ZXIiLCJ1dGMiLCJ2YWwiLCJmb3JtYXQiLCJnZXROdW1lcmljTGFiZWxGb3JtYXQiLCJkaWZmIiwiZ2V0UXVhbnRMYWJlbEZvcm1hdCIsInRpbWVzdGFtcCIsImdldE9yZGluYWxMZWdlbmRzIiwic2NhbGUiLCJkYXRhIiwibWFwIiwibGFiZWxzIiwiZ2V0UXVhbnRMZWdlbmRzIiwibGFiZWxGb3JtYXQiLCJpbnZlcnQiLCJpbnZlcnRFeHRlbnQiLCJDb2xvckxlZ2VuZCIsImRvbWFpblNlbGVjdG9yIiwicmFuZ2VTZWxlY3RvciIsImxhYmVsRm9ybWF0U2VsZWN0b3IiLCJzY2FsZVR5cGVTZWxlY3RvciIsImZpZWxkVHlwZVNlbGVjdG9yIiwibGVnZW5kc1NlbGVjdG9yIiwic2NhbGVGdW5jdGlvbiIsIm9yZGluYWwiLCJmb3JtYXRMYWJlbCIsInJlbmRlciIsImRpc3BsYXlMYWJlbCIsImxlZ2VuZHMiLCJoZWlnaHQiLCJsZW5ndGgiLCJjb2xvciIsImlkeCIsIkxlZ2VuZFJvdyIsImxhYmVsIiwiZmlsbCIsInRvU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNB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dCwge0NvbXBvbmVudCwgUHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCB7Zm9ybWF0fSBmcm9tICdkMy1mb3JtYXQnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtcbiAgU0NBTEVfVFlQRVMsXG4gIFNDQUxFX0ZVTkMsXG4gIEFMTF9GSUVMRF9UWVBFU1xufSBmcm9tICcuLi8uLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge2dldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyfSBmcm9tICcuLi8uLi91dGlscy9maWx0ZXItdXRpbHMnO1xuXG5jb25zdCBST1dfSCA9IDEwO1xuY29uc3QgR0FQID0gNDtcbmNvbnN0IFJFQ1RfVyA9IDIwO1xuXG5jb25zdCBTdHlsZWRMZWdlbmQgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duU2Nyb2xsQmFyfTtcblxuICBtYXgtaGVpZ2h0OiAxNTBweDtcbiAgb3ZlcmZsb3cteTogb3ZlcmxheTtcblxuICBzdmcge1xuICAgIHRleHQge1xuICAgICAgZm9udC1zaXplOiA5cHg7XG4gICAgICBmaWxsOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBkZWZhdWx0Rm9ybWF0ID0gZCA9PiBkO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHNjYWxlVHlwZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBkb21haW46IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5hcnJheSwgUHJvcFR5cGVzLm9iamVjdF0pLmlzUmVxdWlyZWQsXG4gIGZpZWxkVHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgcmFuZ2U6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBhYmVsRm9ybWF0OiBQcm9wVHlwZXMuZnVuY1xufTtcblxuY29uc3QgZ2V0VGltZUxhYmVsRm9ybWF0ID0gZG9tYWluID0+IHtcbiAgY29uc3QgZm9ybWF0dGVyID0gZ2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXIoZG9tYWluKTtcbiAgcmV0dXJuIHZhbCA9PiBtb21lbnQudXRjKHZhbCkuZm9ybWF0KGZvcm1hdHRlcik7XG59O1xuXG5jb25zdCBnZXROdW1lcmljTGFiZWxGb3JtYXQgPSBkb21haW4gPT4ge1xuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuXG4gIGlmIChkaWZmIDwgMTApIHtcbiAgICByZXR1cm4gZm9ybWF0KCcuMmYnKTtcbiAgfVxuXG4gIHJldHVybiBmb3JtYXQoJy4xZicpO1xufTtcblxuY29uc3QgZ2V0UXVhbnRMYWJlbEZvcm1hdCA9IChkb21haW4sIGZpZWxkVHlwZSkgPT4ge1xuICAvLyBxdWFudCBzY2FsZSBjYW4gb25seSBiZSBhc3NpZ25lZCB0byBsaW5lYXIgRmllbGRzOiByZWFsLCB0aW1lc3RhbXAsIGludGVnZXJcbiAgcmV0dXJuIGZpZWxkVHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcFxuICAgID8gZ2V0VGltZUxhYmVsRm9ybWF0KGRvbWFpbilcbiAgICA6ICFmaWVsZFR5cGUgPyBkZWZhdWx0Rm9ybWF0IDogZ2V0TnVtZXJpY0xhYmVsRm9ybWF0KGRvbWFpbik7XG59O1xuXG5jb25zdCBnZXRPcmRpbmFsTGVnZW5kcyA9IHNjYWxlID0+IHtcbiAgY29uc3QgZG9tYWluID0gc2NhbGUuZG9tYWluKCk7XG4gIHJldHVybiB7XG4gICAgZGF0YTogZG9tYWluLm1hcChzY2FsZSksXG4gICAgbGFiZWxzOiBkb21haW5cbiAgfTtcbn07XG5cbmNvbnN0IGdldFF1YW50TGVnZW5kcyA9IChzY2FsZSwgbGFiZWxGb3JtYXQpID0+IHtcbiAgY29uc3QgbGFiZWxzID0gc2NhbGUucmFuZ2UoKS5tYXAoZCA9PiB7XG4gICAgY29uc3QgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGQpO1xuICAgIHJldHVybiBgJHtsYWJlbEZvcm1hdChpbnZlcnRbMF0pfSB0byAke2xhYmVsRm9ybWF0KGludmVydFsxXSl9YDtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBzY2FsZS5yYW5nZSgpLFxuICAgIGxhYmVsc1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3JMZWdlbmQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBkb21haW5TZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmRvbWFpbjtcbiAgcmFuZ2VTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnJhbmdlO1xuICBsYWJlbEZvcm1hdFNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGFiZWxGb3JtYXQ7XG4gIHNjYWxlVHlwZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuc2NhbGVUeXBlO1xuICBmaWVsZFR5cGVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpZWxkVHlwZTtcblxuICBsZWdlbmRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICB0aGlzLmRvbWFpblNlbGVjdG9yLFxuICAgIHRoaXMucmFuZ2VTZWxlY3RvcixcbiAgICB0aGlzLnNjYWxlVHlwZVNlbGVjdG9yLFxuICAgIHRoaXMubGFiZWxGb3JtYXRTZWxlY3RvcixcbiAgICB0aGlzLmZpZWxkVHlwZVNlbGVjdG9yLFxuICAgIChkb21haW4sIHJhbmdlLCBzY2FsZVR5cGUsIGxhYmVsRm9ybWF0LCBmaWVsZFR5cGUpID0+IHtcbiAgICAgIGNvbnN0IHNjYWxlRnVuY3Rpb24gPSBTQ0FMRV9GVU5DW3NjYWxlVHlwZV07XG4gICAgICAvLyBjb2xvciBzY2FsZSBjYW4gb25seSBiZSBxdWFudGl6ZSwgcXVhbnRpbGUgb3Igb3JkaW5hbFxuICAgICAgY29uc3Qgc2NhbGUgPSBzY2FsZUZ1bmN0aW9uKClcbiAgICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAgIC5yYW5nZShyYW5nZSk7XG5cbiAgICAgIGlmIChzY2FsZVR5cGUgPT09IFNDQUxFX1RZUEVTLm9yZGluYWwpIHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGluYWxMZWdlbmRzKHNjYWxlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9ybWF0TGFiZWwgPVxuICAgICAgICBsYWJlbEZvcm1hdCB8fCBnZXRRdWFudExhYmVsRm9ybWF0KHNjYWxlLmRvbWFpbigpLCBmaWVsZFR5cGUpO1xuXG4gICAgICByZXR1cm4gZ2V0UXVhbnRMZWdlbmRzKHNjYWxlLCBmb3JtYXRMYWJlbCk7XG4gICAgfVxuICApO1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7d2lkdGgsIHNjYWxlVHlwZSwgZG9tYWluLCByYW5nZSwgZGlzcGxheUxhYmVsID0gdHJ1ZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKCFkb21haW4gfHwgIXJhbmdlIHx8ICFzY2FsZVR5cGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxlZ2VuZHMgPSB0aGlzLmxlZ2VuZHNTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICBjb25zdCBoZWlnaHQgPSBsZWdlbmRzLmRhdGEubGVuZ3RoICogKFJPV19IICsgR0FQKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGVnZW5kPlxuICAgICAgICA8c3ZnIHdpZHRoPXt3aWR0aCAtIDI0fSBoZWlnaHQ9e2hlaWdodH0+XG4gICAgICAgICAge2xlZ2VuZHMuZGF0YS5tYXAoKGNvbG9yLCBpZHgpID0+IChcbiAgICAgICAgICAgIDxMZWdlbmRSb3dcbiAgICAgICAgICAgICAga2V5PXtpZHh9XG4gICAgICAgICAgICAgIGxhYmVsPXtsZWdlbmRzLmxhYmVsc1tpZHhdfVxuICAgICAgICAgICAgICBkaXNwbGF5TGFiZWw9e2Rpc3BsYXlMYWJlbH1cbiAgICAgICAgICAgICAgY29sb3I9e2NvbG9yfVxuICAgICAgICAgICAgICBpZHg9e2lkeH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9TdHlsZWRMZWdlbmQ+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBMZWdlbmRSb3cgPSAoe2xhYmVsID0gJycsIGRpc3BsYXlMYWJlbCwgY29sb3IsIGlkeH0pID0+IChcbiAgPGcgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKDAsICR7aWR4ICogKFJPV19IICsgR0FQKX0pYH0+XG4gICAgPHJlY3Qgd2lkdGg9e1JFQ1RfV30gaGVpZ2h0PXtST1dfSH0gc3R5bGU9e3tmaWxsOiBjb2xvcn19IC8+XG4gICAgPHRleHQgeD17UkVDVF9XICsgOH0geT17Uk9XX0ggLSAxfT5cbiAgICAgIHtkaXNwbGF5TGFiZWwgPyBsYWJlbC50b1N0cmluZygpIDogJyd9XG4gICAgPC90ZXh0PlxuICA8L2c+XG4pO1xuXG5Db2xvckxlZ2VuZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=