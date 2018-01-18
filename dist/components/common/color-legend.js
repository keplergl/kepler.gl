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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['  \n  ', ';\n  \n  max-height: 150px;\n  overflow-y: overlay;\n  \n  svg {\n    text {\n      font-size: 9px;\n      fill: ', ';\n    }\n  }\n'], ['  \n  ', ';\n  \n  max-height: 150px;\n  overflow-y: overlay;\n  \n  svg {\n    text {\n      font-size: 9px;\n      fill: ', ';\n    }\n  }\n']);

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
            idx: idx });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jb2xvci1sZWdlbmQuanMiXSwibmFtZXMiOlsiUk9XX0giLCJHQVAiLCJSRUNUX1ciLCJTdHlsZWRMZWdlbmQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwiZHJvcGRvd25TY3JvbGxCYXIiLCJ0ZXh0Q29sb3IiLCJkZWZhdWx0Rm9ybWF0IiwiZCIsInByb3BUeXBlcyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInNjYWxlVHlwZSIsInN0cmluZyIsImRvbWFpbiIsIm9uZU9mVHlwZSIsImFycmF5Iiwib2JqZWN0IiwiZmllbGRUeXBlIiwicmFuZ2UiLCJhcnJheU9mIiwiYWJlbEZvcm1hdCIsImZ1bmMiLCJnZXRUaW1lTGFiZWxGb3JtYXQiLCJmb3JtYXR0ZXIiLCJ1dGMiLCJ2YWwiLCJmb3JtYXQiLCJnZXROdW1lcmljTGFiZWxGb3JtYXQiLCJkaWZmIiwiZ2V0UXVhbnRMYWJlbEZvcm1hdCIsInRpbWVzdGFtcCIsImdldE9yZGluYWxMZWdlbmRzIiwic2NhbGUiLCJkYXRhIiwibWFwIiwibGFiZWxzIiwiZ2V0UXVhbnRMZWdlbmRzIiwibGFiZWxGb3JtYXQiLCJpbnZlcnQiLCJpbnZlcnRFeHRlbnQiLCJDb2xvckxlZ2VuZCIsImRvbWFpblNlbGVjdG9yIiwicmFuZ2VTZWxlY3RvciIsImxhYmVsRm9ybWF0U2VsZWN0b3IiLCJzY2FsZVR5cGVTZWxlY3RvciIsImZpZWxkVHlwZVNlbGVjdG9yIiwibGVnZW5kc1NlbGVjdG9yIiwic2NhbGVGdW5jdGlvbiIsIm9yZGluYWwiLCJmb3JtYXRMYWJlbCIsInJlbmRlciIsImRpc3BsYXlMYWJlbCIsImxlZ2VuZHMiLCJoZWlnaHQiLCJsZW5ndGgiLCJjb2xvciIsImlkeCIsIkxlZ2VuZFJvdyIsImxhYmVsIiwiZmlsbCIsInRvU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNB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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIFByb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAnZDMtZm9ybWF0JztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7U0NBTEVfVFlQRVMsIFNDQUxFX0ZVTkMsIEFMTF9GSUVMRF9UWVBFU30gZnJvbSAnLi4vLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vdXRpbHMvZmlsdGVyLXV0aWxzJztcblxuY29uc3QgUk9XX0ggPSAxMDtcbmNvbnN0IEdBUCA9IDQ7XG5jb25zdCBSRUNUX1cgPSAyMDtcblxuY29uc3QgU3R5bGVkTGVnZW5kID0gc3R5bGVkLmRpdmAgIFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duU2Nyb2xsQmFyfTtcbiAgXG4gIG1heC1oZWlnaHQ6IDE1MHB4O1xuICBvdmVyZmxvdy15OiBvdmVybGF5O1xuICBcbiAgc3ZnIHtcbiAgICB0ZXh0IHtcbiAgICAgIGZvbnQtc2l6ZTogOXB4O1xuICAgICAgZmlsbDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgZGVmYXVsdEZvcm1hdCA9IGQgPT4gZDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBzY2FsZVR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZG9tYWluOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuYXJyYXksXG4gICAgUHJvcFR5cGVzLm9iamVjdFxuICBdKS5pc1JlcXVpcmVkLFxuICBmaWVsZFR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHJhbmdlOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgYWJlbEZvcm1hdDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IGdldFRpbWVMYWJlbEZvcm1hdCA9IChkb21haW4pID0+IHtcbiAgY29uc3QgZm9ybWF0dGVyID0gZ2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXIoZG9tYWluKTtcbiAgcmV0dXJuIHZhbCA9PiBtb21lbnQudXRjKHZhbCkuZm9ybWF0KGZvcm1hdHRlcik7XG59O1xuXG5jb25zdCBnZXROdW1lcmljTGFiZWxGb3JtYXQgPSAoZG9tYWluKSA9PiB7XG4gIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG5cbiAgaWYgKGRpZmYgPCAxMCkge1xuICAgIHJldHVybiBmb3JtYXQoJy4yZicpO1xuICB9XG5cbiAgcmV0dXJuIGZvcm1hdCgnLjFmJyk7XG59O1xuXG5jb25zdCBnZXRRdWFudExhYmVsRm9ybWF0ID0gKGRvbWFpbiwgZmllbGRUeXBlKSA9PiB7XG5cbiAgLy8gcXVhbnQgc2NhbGUgY2FuIG9ubHkgYmUgYXNzaWduZWQgdG8gbGluZWFyIEZpZWxkczogcmVhbCwgdGltZXN0YW1wLCBpbnRlZ2VyXG4gIHJldHVybiBmaWVsZFR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXAgP1xuICAgIGdldFRpbWVMYWJlbEZvcm1hdChkb21haW4pIDpcbiAgICAhZmllbGRUeXBlID8gZGVmYXVsdEZvcm1hdCA6XG4gICAgZ2V0TnVtZXJpY0xhYmVsRm9ybWF0KGRvbWFpbik7XG59O1xuXG5jb25zdCBnZXRPcmRpbmFsTGVnZW5kcyA9IHNjYWxlID0+IHtcbiAgY29uc3QgZG9tYWluID0gc2NhbGUuZG9tYWluKCk7XG4gIHJldHVybiB7XG4gICAgZGF0YTogZG9tYWluLm1hcChzY2FsZSksXG4gICAgbGFiZWxzOiBkb21haW5cbiAgfTtcbn07XG5cbmNvbnN0IGdldFF1YW50TGVnZW5kcyA9IChzY2FsZSwgbGFiZWxGb3JtYXQpID0+IHtcbiAgY29uc3QgbGFiZWxzID0gc2NhbGUucmFuZ2UoKS5tYXAoZCA9PiB7XG4gICAgY29uc3QgaW52ZXJ0ID0gc2NhbGUuaW52ZXJ0RXh0ZW50KGQpO1xuICAgIHJldHVybiBgJHtsYWJlbEZvcm1hdChpbnZlcnRbMF0pfSB0byAke2xhYmVsRm9ybWF0KGludmVydFsxXSl9YDtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBzY2FsZS5yYW5nZSgpLFxuICAgIGxhYmVsc1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3JMZWdlbmQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBkb21haW5TZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmRvbWFpbjtcbiAgcmFuZ2VTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnJhbmdlO1xuICBsYWJlbEZvcm1hdFNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGFiZWxGb3JtYXQ7XG4gIHNjYWxlVHlwZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuc2NhbGVUeXBlO1xuICBmaWVsZFR5cGVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpZWxkVHlwZTtcblxuICBsZWdlbmRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICB0aGlzLmRvbWFpblNlbGVjdG9yLFxuICAgIHRoaXMucmFuZ2VTZWxlY3RvcixcbiAgICB0aGlzLnNjYWxlVHlwZVNlbGVjdG9yLFxuICAgIHRoaXMubGFiZWxGb3JtYXRTZWxlY3RvcixcbiAgICB0aGlzLmZpZWxkVHlwZVNlbGVjdG9yLFxuICAgIChkb21haW4sIHJhbmdlLCBzY2FsZVR5cGUsIGxhYmVsRm9ybWF0LCBmaWVsZFR5cGUpID0+IHtcbiAgICAgIGNvbnN0IHNjYWxlRnVuY3Rpb24gPSBTQ0FMRV9GVU5DW3NjYWxlVHlwZV07XG4gICAgICAvLyBjb2xvciBzY2FsZSBjYW4gb25seSBiZSBxdWFudGl6ZSwgcXVhbnRpbGUgb3Igb3JkaW5hbFxuICAgICAgY29uc3Qgc2NhbGUgPSBzY2FsZUZ1bmN0aW9uKClcbiAgICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAgIC5yYW5nZShyYW5nZSk7XG5cbiAgICAgIGlmIChzY2FsZVR5cGUgPT09IFNDQUxFX1RZUEVTLm9yZGluYWwpIHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGluYWxMZWdlbmRzKHNjYWxlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm9ybWF0TGFiZWwgPSBsYWJlbEZvcm1hdCB8fCBnZXRRdWFudExhYmVsRm9ybWF0KHNjYWxlLmRvbWFpbigpLCBmaWVsZFR5cGUpO1xuXG4gICAgICByZXR1cm4gZ2V0UXVhbnRMZWdlbmRzKHNjYWxlLCBmb3JtYXRMYWJlbCk7XG4gICAgfVxuICApO1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7d2lkdGgsIHNjYWxlVHlwZSwgZG9tYWluLCByYW5nZSwgZGlzcGxheUxhYmVsID0gdHJ1ZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKCFkb21haW4gfHwgIXJhbmdlIHx8ICFzY2FsZVR5cGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxlZ2VuZHMgPSB0aGlzLmxlZ2VuZHNTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICBjb25zdCBoZWlnaHQgPSBsZWdlbmRzLmRhdGEubGVuZ3RoICogKFJPV19IICsgR0FQKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGVnZW5kPlxuICAgICAgICA8c3ZnIHdpZHRoPXt3aWR0aCAtIDI0fSBoZWlnaHQ9e2hlaWdodH0+XG4gICAgICAgICAge2xlZ2VuZHMuZGF0YS5tYXAoKGNvbG9yLCBpZHgpID0+IDxMZWdlbmRSb3dcbiAgICAgICAgICAgIGtleT17aWR4fVxuICAgICAgICAgICAgbGFiZWw9e2xlZ2VuZHMubGFiZWxzW2lkeF19XG4gICAgICAgICAgICBkaXNwbGF5TGFiZWw9e2Rpc3BsYXlMYWJlbH1cbiAgICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICAgIGlkeD17aWR4fS8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L1N0eWxlZExlZ2VuZD5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IExlZ2VuZFJvdyA9ICh7bGFiZWwgPSAnJywgZGlzcGxheUxhYmVsLCBjb2xvciwgaWR4fSkgPT4gKFxuICA8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoMCwgJHtpZHggKiAoUk9XX0ggKyBHQVApfSlgfT5cbiAgICA8cmVjdCB3aWR0aD17UkVDVF9XfSBoZWlnaHQ9e1JPV19IfSBzdHlsZT17e2ZpbGw6IGNvbG9yfX0vPlxuICAgIDx0ZXh0IHg9e1JFQ1RfVyArIDh9IHk9e1JPV19IIC0gMX0+e2Rpc3BsYXlMYWJlbCA/IGxhYmVsLnRvU3RyaW5nKCkgOiAnJ308L3RleHQ+XG4gIDwvZz5cbik7XG5cbkNvbG9yTGVnZW5kLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==