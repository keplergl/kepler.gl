'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  ', ';\n\n  max-height: 150px;\n  overflow-y: overlay;\n\n  svg {\n    text {\n      font-size: 9px;\n      fill: ', ';\n    }\n  }\n'], ['\n  ', ';\n\n  max-height: 150px;\n  overflow-y: overlay;\n\n  svg {\n    text {\n      font-size: 9px;\n      fill: ', ';\n    }\n  }\n']);

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
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorLegend);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ColorLegend.__proto__ || Object.getPrototypeOf(ColorLegend)).call.apply(_ref, [this].concat(args))), _this), _this.domainSelector = function (props) {
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

  (0, _createClass3.default)(ColorLegend, [{
    key: 'render',
    value: function render() {
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
    }
  }]);
  return ColorLegend;
}(_react.Component);

exports.default = ColorLegend;


var LegendRow = function LegendRow(_ref2) {
  var _ref2$label = _ref2.label,
      label = _ref2$label === undefined ? '' : _ref2$label,
      displayLabel = _ref2.displayLabel,
      color = _ref2.color,
      idx = _ref2.idx;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jb2xvci1sZWdlbmQuanMiXSwibmFtZXMiOlsiUk9XX0giLCJHQVAiLCJSRUNUX1ciLCJTdHlsZWRMZWdlbmQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwiZHJvcGRvd25TY3JvbGxCYXIiLCJ0ZXh0Q29sb3IiLCJkZWZhdWx0Rm9ybWF0IiwiZCIsInByb3BUeXBlcyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInNjYWxlVHlwZSIsInN0cmluZyIsImRvbWFpbiIsIm9uZU9mVHlwZSIsImFycmF5Iiwib2JqZWN0IiwiZmllbGRUeXBlIiwicmFuZ2UiLCJhcnJheU9mIiwiYWJlbEZvcm1hdCIsImZ1bmMiLCJnZXRUaW1lTGFiZWxGb3JtYXQiLCJmb3JtYXR0ZXIiLCJ1dGMiLCJ2YWwiLCJmb3JtYXQiLCJnZXROdW1lcmljTGFiZWxGb3JtYXQiLCJkaWZmIiwiZ2V0UXVhbnRMYWJlbEZvcm1hdCIsInRpbWVzdGFtcCIsImdldE9yZGluYWxMZWdlbmRzIiwic2NhbGUiLCJkYXRhIiwibWFwIiwibGFiZWxzIiwiZ2V0UXVhbnRMZWdlbmRzIiwibGFiZWxGb3JtYXQiLCJpbnZlcnQiLCJpbnZlcnRFeHRlbnQiLCJDb2xvckxlZ2VuZCIsImRvbWFpblNlbGVjdG9yIiwicmFuZ2VTZWxlY3RvciIsImxhYmVsRm9ybWF0U2VsZWN0b3IiLCJzY2FsZVR5cGVTZWxlY3RvciIsImZpZWxkVHlwZVNlbGVjdG9yIiwibGVnZW5kc1NlbGVjdG9yIiwic2NhbGVGdW5jdGlvbiIsIm9yZGluYWwiLCJmb3JtYXRMYWJlbCIsImRpc3BsYXlMYWJlbCIsImxlZ2VuZHMiLCJoZWlnaHQiLCJsZW5ndGgiLCJjb2xvciIsImlkeCIsIkxlZ2VuZFJvdyIsImxhYmVsIiwiZmlsbCIsInRvU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFD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IFByb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAnZDMtZm9ybWF0JztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7XG4gIFNDQUxFX1RZUEVTLFxuICBTQ0FMRV9GVU5DLFxuICBBTExfRklFTERfVFlQRVNcbn0gZnJvbSAnLi4vLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vdXRpbHMvZmlsdGVyLXV0aWxzJztcblxuY29uc3QgUk9XX0ggPSAxMDtcbmNvbnN0IEdBUCA9IDQ7XG5jb25zdCBSRUNUX1cgPSAyMDtcblxuY29uc3QgU3R5bGVkTGVnZW5kID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93blNjcm9sbEJhcn07XG5cbiAgbWF4LWhlaWdodDogMTUwcHg7XG4gIG92ZXJmbG93LXk6IG92ZXJsYXk7XG5cbiAgc3ZnIHtcbiAgICB0ZXh0IHtcbiAgICAgIGZvbnQtc2l6ZTogOXB4O1xuICAgICAgZmlsbDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgZGVmYXVsdEZvcm1hdCA9IGQgPT4gZDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBzY2FsZVR5cGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgZG9tYWluOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuYXJyYXksIFByb3BUeXBlcy5vYmplY3RdKS5pc1JlcXVpcmVkLFxuICBmaWVsZFR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHJhbmdlOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgYWJlbEZvcm1hdDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IGdldFRpbWVMYWJlbEZvcm1hdCA9IGRvbWFpbiA9PiB7XG4gIGNvbnN0IGZvcm1hdHRlciA9IGdldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyKGRvbWFpbik7XG4gIHJldHVybiB2YWwgPT4gbW9tZW50LnV0Yyh2YWwpLmZvcm1hdChmb3JtYXR0ZXIpO1xufTtcblxuY29uc3QgZ2V0TnVtZXJpY0xhYmVsRm9ybWF0ID0gZG9tYWluID0+IHtcbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcblxuICBpZiAoZGlmZiA8IDEwKSB7XG4gICAgcmV0dXJuIGZvcm1hdCgnLjJmJyk7XG4gIH1cblxuICByZXR1cm4gZm9ybWF0KCcuMWYnKTtcbn07XG5cbmNvbnN0IGdldFF1YW50TGFiZWxGb3JtYXQgPSAoZG9tYWluLCBmaWVsZFR5cGUpID0+IHtcbiAgLy8gcXVhbnQgc2NhbGUgY2FuIG9ubHkgYmUgYXNzaWduZWQgdG8gbGluZWFyIEZpZWxkczogcmVhbCwgdGltZXN0YW1wLCBpbnRlZ2VyXG4gIHJldHVybiBmaWVsZFR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXBcbiAgICA/IGdldFRpbWVMYWJlbEZvcm1hdChkb21haW4pXG4gICAgOiAhZmllbGRUeXBlID8gZGVmYXVsdEZvcm1hdCA6IGdldE51bWVyaWNMYWJlbEZvcm1hdChkb21haW4pO1xufTtcblxuY29uc3QgZ2V0T3JkaW5hbExlZ2VuZHMgPSBzY2FsZSA9PiB7XG4gIGNvbnN0IGRvbWFpbiA9IHNjYWxlLmRvbWFpbigpO1xuICByZXR1cm4ge1xuICAgIGRhdGE6IGRvbWFpbi5tYXAoc2NhbGUpLFxuICAgIGxhYmVsczogZG9tYWluXG4gIH07XG59O1xuXG5jb25zdCBnZXRRdWFudExlZ2VuZHMgPSAoc2NhbGUsIGxhYmVsRm9ybWF0KSA9PiB7XG4gIGNvbnN0IGxhYmVscyA9IHNjYWxlLnJhbmdlKCkubWFwKGQgPT4ge1xuICAgIGNvbnN0IGludmVydCA9IHNjYWxlLmludmVydEV4dGVudChkKTtcbiAgICByZXR1cm4gYCR7bGFiZWxGb3JtYXQoaW52ZXJ0WzBdKX0gdG8gJHtsYWJlbEZvcm1hdChpbnZlcnRbMV0pfWA7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZGF0YTogc2NhbGUucmFuZ2UoKSxcbiAgICBsYWJlbHNcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbG9yTGVnZW5kIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgZG9tYWluU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5kb21haW47XG4gIHJhbmdlU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5yYW5nZTtcbiAgbGFiZWxGb3JtYXRTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmxhYmVsRm9ybWF0O1xuICBzY2FsZVR5cGVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnNjYWxlVHlwZTtcbiAgZmllbGRUeXBlU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWVsZFR5cGU7XG5cbiAgbGVnZW5kc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5kb21haW5TZWxlY3RvcixcbiAgICB0aGlzLnJhbmdlU2VsZWN0b3IsXG4gICAgdGhpcy5zY2FsZVR5cGVTZWxlY3RvcixcbiAgICB0aGlzLmxhYmVsRm9ybWF0U2VsZWN0b3IsXG4gICAgdGhpcy5maWVsZFR5cGVTZWxlY3RvcixcbiAgICAoZG9tYWluLCByYW5nZSwgc2NhbGVUeXBlLCBsYWJlbEZvcm1hdCwgZmllbGRUeXBlKSA9PiB7XG4gICAgICBjb25zdCBzY2FsZUZ1bmN0aW9uID0gU0NBTEVfRlVOQ1tzY2FsZVR5cGVdO1xuICAgICAgLy8gY29sb3Igc2NhbGUgY2FuIG9ubHkgYmUgcXVhbnRpemUsIHF1YW50aWxlIG9yIG9yZGluYWxcbiAgICAgIGNvbnN0IHNjYWxlID0gc2NhbGVGdW5jdGlvbigpXG4gICAgICAgIC5kb21haW4oZG9tYWluKVxuICAgICAgICAucmFuZ2UocmFuZ2UpO1xuXG4gICAgICBpZiAoc2NhbGVUeXBlID09PSBTQ0FMRV9UWVBFUy5vcmRpbmFsKSB7XG4gICAgICAgIHJldHVybiBnZXRPcmRpbmFsTGVnZW5kcyhzY2FsZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvcm1hdExhYmVsID1cbiAgICAgICAgbGFiZWxGb3JtYXQgfHwgZ2V0UXVhbnRMYWJlbEZvcm1hdChzY2FsZS5kb21haW4oKSwgZmllbGRUeXBlKTtcblxuICAgICAgcmV0dXJuIGdldFF1YW50TGVnZW5kcyhzY2FsZSwgZm9ybWF0TGFiZWwpO1xuICAgIH1cbiAgKTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3dpZHRoLCBzY2FsZVR5cGUsIGRvbWFpbiwgcmFuZ2UsIGRpc3BsYXlMYWJlbCA9IHRydWV9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghZG9tYWluIHx8ICFyYW5nZSB8fCAhc2NhbGVUeXBlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBsZWdlbmRzID0gdGhpcy5sZWdlbmRzU2VsZWN0b3IodGhpcy5wcm9wcyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gbGVnZW5kcy5kYXRhLmxlbmd0aCAqIChST1dfSCArIEdBUCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExlZ2VuZD5cbiAgICAgICAgPHN2ZyB3aWR0aD17d2lkdGggLSAyNH0gaGVpZ2h0PXtoZWlnaHR9PlxuICAgICAgICAgIHtsZWdlbmRzLmRhdGEubWFwKChjb2xvciwgaWR4KSA9PiAoXG4gICAgICAgICAgICA8TGVnZW5kUm93XG4gICAgICAgICAgICAgIGtleT17aWR4fVxuICAgICAgICAgICAgICBsYWJlbD17bGVnZW5kcy5sYWJlbHNbaWR4XX1cbiAgICAgICAgICAgICAgZGlzcGxheUxhYmVsPXtkaXNwbGF5TGFiZWx9XG4gICAgICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvU3R5bGVkTGVnZW5kPlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgTGVnZW5kUm93ID0gKHtsYWJlbCA9ICcnLCBkaXNwbGF5TGFiZWwsIGNvbG9yLCBpZHh9KSA9PiAoXG4gIDxnIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgwLCAke2lkeCAqIChST1dfSCArIEdBUCl9KWB9PlxuICAgIDxyZWN0IHdpZHRoPXtSRUNUX1d9IGhlaWdodD17Uk9XX0h9IHN0eWxlPXt7ZmlsbDogY29sb3J9fSAvPlxuICAgIDx0ZXh0IHg9e1JFQ1RfVyArIDh9IHk9e1JPV19IIC0gMX0+XG4gICAgICB7ZGlzcGxheUxhYmVsID8gbGFiZWwudG9TdHJpbmcoKSA6ICcnfVxuICAgIDwvdGV4dD5cbiAgPC9nPlxuKTtcblxuQ29sb3JMZWdlbmQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19