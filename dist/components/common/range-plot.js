'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  .rv-xy-plot__inner path {\n    fill: none;\n    stroke-width: 1.5;\n  }\n'], ['\n  .rv-xy-plot__inner path {\n    fill: none;\n    stroke-width: 1.5;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: #d3d8e0;\n  border-radius: 2px;\n  color: ', ';\n  font-size: 9px;\n  margin: 4px;\n  padding: 3px 6px;\n  pointer-events: none;\n  user-select: none;\n'], ['\n  background-color: #d3d8e0;\n  border-radius: 2px;\n  color: ', ';\n  font-size: 9px;\n  margin: 4px;\n  padding: 3px 6px;\n  pointer-events: none;\n  user-select: none;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Scale = require('d3-scale');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _d3Array = require('d3-array');

var _reselect = require('reselect');

var _reactVis = require('react-vis');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _rangeBrush = require('./range-brush');

var _rangeBrush2 = _interopRequireDefault(_rangeBrush);

var _filterUtils = require('../../utils/filter-utils');

var _base = require('../../styles/base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  value: _propTypes2.default.array.isRequired,
  histogram: _propTypes2.default.array,
  lineChart: _propTypes2.default.object,
  plotType: _propTypes2.default.string,
  isEnlarged: _propTypes2.default.bool,
  onBlur: _propTypes2.default.func,
  width: _propTypes2.default.number.isRequired
};

var chartMargin = { top: 18, bottom: 0, left: 0, right: 0 };
var chartH = 52;
var containerH = 78;
var histogramStyle = {
  highlightW: 0.7,
  unHighlightedW: 0.4,
  highlightedColor: _base.theme.activeColor,
  unHighlightedColor: _base.theme.sliderBarColor
};

var RangePlot = function (_Component) {
  (0, _inherits3.default)(RangePlot, _Component);

  function RangePlot() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, RangePlot);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      hoveredDP: null
    }, _this.domainSelector = function (props) {
      return props.lineChart && props.lineChart.xDomain;
    }, _this.hintFormatter = (0, _reselect.createSelector)(_this.domainSelector, function (domain) {
      return (0, _filterUtils.getTimeWidgetHintFormatter)(domain);
    }), _this.onMouseMove = function (hoveredDP) {
      _this.setState({ hoveredDP: hoveredDP });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  RangePlot.prototype.render = function render() {
    var _props = this.props,
        onBrush = _props.onBrush,
        range = _props.range,
        value = _props.value,
        width = _props.width,
        plotType = _props.plotType,
        lineChart = _props.lineChart,
        histogram = _props.histogram;

    var domain = [histogram[0].x0, histogram[histogram.length - 1].x1];

    var brushComponent = _react2.default.createElement(_rangeBrush2.default, {
      domain: domain,
      onBrush: onBrush,
      range: range,
      value: value,
      width: width
    });

    return _react2.default.createElement(
      'div',
      {
        style: {
          height: containerH + 'px',
          position: 'relative'
        }
      },
      plotType === 'lineChart' ? _react2.default.createElement(LineChart, {
        hoveredDP: this.state.hoveredDP,
        width: width,
        height: containerH,
        margin: chartMargin,
        children: brushComponent,
        onMouseMove: this.onMouseMove,
        yDomain: lineChart.yDomain,
        hintFormat: this.hintFormatter(this.props),
        data: lineChart.series
      }) : _react2.default.createElement(Histogram, {
        width: width,
        height: chartH,
        value: value,
        margin: chartMargin,
        histogram: histogram,
        brushComponent: brushComponent
      })
    );
  };

  return RangePlot;
}(_react.Component);

exports.default = RangePlot;


RangePlot.propTypes = propTypes;

var Histogram = function Histogram(_ref) {
  var width = _ref.width,
      height = _ref.height,
      margin = _ref.margin,
      histogram = _ref.histogram,
      value = _ref.value,
      brushComponent = _ref.brushComponent;

  var domain = [histogram[0].x0, histogram[histogram.length - 1].x1];
  var barWidth = width / histogram.length;

  var x = (0, _d3Scale.scaleLinear)().domain(domain).range([0, width]);

  var y = (0, _d3Scale.scaleLinear)().domain([0, (0, _d3Array.max)(histogram, function (d) {
    return d.count;
  })]).range([0, height]);

  return _react2.default.createElement(
    'svg',
    { width: width, height: height, style: { marginTop: margin.top + 'px' } },
    _react2.default.createElement(
      'g',
      { className: 'histogram-bars' },
      histogram.map(function (bar) {
        var inRange = bar.x0 >= value[0] && bar.x1 <= value[1];
        var fill = inRange ? histogramStyle.highlightedColor : histogramStyle.unHighlightedColor;
        var wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;

        return _react2.default.createElement('rect', {
          key: bar.x0,
          fill: fill,
          height: y(bar.count),
          width: barWidth * wRatio,
          x: x(bar.x0) + barWidth * (1 - wRatio) / 2,
          rx: 1,
          ry: 1,
          y: height - y(bar.count)
        });
      })
    ),
    brushComponent
  );
};

var LineChartWrapper = _styledComponents2.default.div(_templateObject);

var LineChart = function LineChart(_ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      yDomain = _ref2.yDomain,
      hintFormat = _ref2.hintFormat,
      hoveredDP = _ref2.hoveredDP,
      margin = _ref2.margin,
      color = _ref2.color,
      data = _ref2.data,
      onMouseMove = _ref2.onMouseMove,
      children = _ref2.children;

  var brushData = [{ x: data[0].x, y: yDomain[1], customComponent: function customComponent() {
      return children;
    } }];

  return _react2.default.createElement(
    LineChartWrapper,
    null,
    _react2.default.createElement(
      _reactVis.XYPlot,
      { width: width, height: height, margin: (0, _extends3.default)({}, margin, { bottom: 12 }) },
      _react2.default.createElement(_reactVis.LineSeries, {
        strokeWidth: 2,
        color: color,
        data: data,
        onNearestX: onMouseMove
      }),
      _react2.default.createElement(_reactVis.MarkSeries, {
        data: hoveredDP ? [hoveredDP] : [],
        color: color,
        size: 3
      }),
      _react2.default.createElement(_reactVis.CustomSVGSeries, { data: brushData }),
      hoveredDP ? _react2.default.createElement(
        _reactVis.Hint,
        { value: hoveredDP },
        _react2.default.createElement(HintContent, (0, _extends3.default)({}, hoveredDP, {
          format: function format(val) {
            return _moment2.default.utc(val).format(hintFormat);
          }
        }))
      ) : null
    )
  );
};

var StyledHint = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.textColorLT;
});
var HintContent = function HintContent(_ref3) {
  var x = _ref3.x,
      y = _ref3.y,
      format = _ref3.format;
  return _react2.default.createElement(
    StyledHint,
    null,
    _react2.default.createElement(
      'div',
      { className: 'hint--x' },
      format(x)
    ),
    _react2.default.createElement(
      'div',
      { className: 'row' },
      y
    )
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1wbG90LmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsInZhbHVlIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0Iiwib2JqZWN0IiwicGxvdFR5cGUiLCJzdHJpbmciLCJpc0VubGFyZ2VkIiwiYm9vbCIsIm9uQmx1ciIsImZ1bmMiLCJ3aWR0aCIsIm51bWJlciIsImNoYXJ0TWFyZ2luIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiY2hhcnRIIiwiY29udGFpbmVySCIsImhpc3RvZ3JhbVN0eWxlIiwiaGlnaGxpZ2h0VyIsInVuSGlnaGxpZ2h0ZWRXIiwiaGlnaGxpZ2h0ZWRDb2xvciIsImFjdGl2ZUNvbG9yIiwidW5IaWdobGlnaHRlZENvbG9yIiwic2xpZGVyQmFyQ29sb3IiLCJSYW5nZVBsb3QiLCJzdGF0ZSIsImhvdmVyZWREUCIsImRvbWFpblNlbGVjdG9yIiwicHJvcHMiLCJ4RG9tYWluIiwiaGludEZvcm1hdHRlciIsImRvbWFpbiIsIm9uTW91c2VNb3ZlIiwic2V0U3RhdGUiLCJyZW5kZXIiLCJvbkJydXNoIiwicmFuZ2UiLCJ4MCIsImxlbmd0aCIsIngxIiwiYnJ1c2hDb21wb25lbnQiLCJoZWlnaHQiLCJwb3NpdGlvbiIsInlEb21haW4iLCJzZXJpZXMiLCJIaXN0b2dyYW0iLCJtYXJnaW4iLCJiYXJXaWR0aCIsIngiLCJ5IiwiZCIsImNvdW50IiwibWFyZ2luVG9wIiwibWFwIiwiaW5SYW5nZSIsImJhciIsImZpbGwiLCJ3UmF0aW8iLCJMaW5lQ2hhcnRXcmFwcGVyIiwiZGl2IiwiTGluZUNoYXJ0IiwiaGludEZvcm1hdCIsImNvbG9yIiwiZGF0YSIsImNoaWxkcmVuIiwiYnJ1c2hEYXRhIiwiY3VzdG9tQ29tcG9uZW50IiwidXRjIiwidmFsIiwiZm9ybWF0IiwiU3R5bGVkSGludCIsInRoZW1lIiwidGV4dENvbG9yTFQiLCJIaW50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ZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7c2NhbGVMaW5lYXJ9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7bWF4fSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge0xpbmVTZXJpZXMsIFhZUGxvdCwgQ3VzdG9tU1ZHU2VyaWVzLCBIaW50LCBNYXJrU2VyaWVzfSBmcm9tICdyZWFjdC12aXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmFuZ2VCcnVzaCBmcm9tICcuL3JhbmdlLWJydXNoJztcbmltcG9ydCB7Z2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXJ9IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge3RoZW1lfSBmcm9tICdzdHlsZXMvYmFzZSc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgdmFsdWU6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBoaXN0b2dyYW06IFByb3BUeXBlcy5hcnJheSxcbiAgbGluZUNoYXJ0OiBQcm9wVHlwZXMub2JqZWN0LFxuICBwbG90VHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaXNFbmxhcmdlZDogUHJvcFR5cGVzLmJvb2wsXG4gIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IGNoYXJ0TWFyZ2luID0ge3RvcDogMTgsIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDB9O1xuY29uc3QgY2hhcnRIID0gNTI7XG5jb25zdCBjb250YWluZXJIID0gNzg7XG5jb25zdCBoaXN0b2dyYW1TdHlsZSA9IHtcbiAgaGlnaGxpZ2h0VzogMC43LFxuICB1bkhpZ2hsaWdodGVkVzogMC40LFxuICBoaWdobGlnaHRlZENvbG9yOiB0aGVtZS5hY3RpdmVDb2xvcixcbiAgdW5IaWdobGlnaHRlZENvbG9yOiB0aGVtZS5zbGlkZXJCYXJDb2xvclxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmFuZ2VQbG90IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgaG92ZXJlZERQOiBudWxsXG4gIH07XG5cbiAgZG9tYWluU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5saW5lQ2hhcnQgJiYgcHJvcHMubGluZUNoYXJ0LnhEb21haW47XG4gIGhpbnRGb3JtYXR0ZXIgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLmRvbWFpblNlbGVjdG9yLCBkb21haW4gPT5cbiAgICBnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlcihkb21haW4pXG4gICk7XG5cbiAgb25Nb3VzZU1vdmUgPSBob3ZlcmVkRFAgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2hvdmVyZWREUH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBvbkJydXNoLFxuICAgICAgcmFuZ2UsXG4gICAgICB2YWx1ZSxcbiAgICAgIHdpZHRoLFxuICAgICAgcGxvdFR5cGUsXG4gICAgICBsaW5lQ2hhcnQsXG4gICAgICBoaXN0b2dyYW1cbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBkb21haW4gPSBbaGlzdG9ncmFtWzBdLngwLCBoaXN0b2dyYW1baGlzdG9ncmFtLmxlbmd0aCAtIDFdLngxXTtcblxuICAgIGNvbnN0IGJydXNoQ29tcG9uZW50ID0gKFxuICAgICAgPFJhbmdlQnJ1c2hcbiAgICAgICAgZG9tYWluPXtkb21haW59XG4gICAgICAgIG9uQnJ1c2g9e29uQnJ1c2h9XG4gICAgICAgIHJhbmdlPXtyYW5nZX1cbiAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAvPlxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodDogYCR7Y29udGFpbmVySH1weGAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge3Bsb3RUeXBlID09PSAnbGluZUNoYXJ0JyA/IChcbiAgICAgICAgICA8TGluZUNoYXJ0XG4gICAgICAgICAgICBob3ZlcmVkRFA9e3RoaXMuc3RhdGUuaG92ZXJlZERQfVxuICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgaGVpZ2h0PXtjb250YWluZXJIfVxuICAgICAgICAgICAgbWFyZ2luPXtjaGFydE1hcmdpbn1cbiAgICAgICAgICAgIGNoaWxkcmVuPXticnVzaENvbXBvbmVudH1cbiAgICAgICAgICAgIG9uTW91c2VNb3ZlPXt0aGlzLm9uTW91c2VNb3ZlfVxuICAgICAgICAgICAgeURvbWFpbj17bGluZUNoYXJ0LnlEb21haW59XG4gICAgICAgICAgICBoaW50Rm9ybWF0PXt0aGlzLmhpbnRGb3JtYXR0ZXIodGhpcy5wcm9wcyl9XG4gICAgICAgICAgICBkYXRhPXtsaW5lQ2hhcnQuc2VyaWVzfVxuICAgICAgICAgIC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEhpc3RvZ3JhbVxuICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgaGVpZ2h0PXtjaGFydEh9XG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBtYXJnaW49e2NoYXJ0TWFyZ2lufVxuICAgICAgICAgICAgaGlzdG9ncmFtPXtoaXN0b2dyYW19XG4gICAgICAgICAgICBicnVzaENvbXBvbmVudD17YnJ1c2hDb21wb25lbnR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuUmFuZ2VQbG90LnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgSGlzdG9ncmFtID0gKHtcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgbWFyZ2luLFxuICBoaXN0b2dyYW0sXG4gIHZhbHVlLFxuICBicnVzaENvbXBvbmVudFxufSkgPT4ge1xuICBjb25zdCBkb21haW4gPSBbaGlzdG9ncmFtWzBdLngwLCBoaXN0b2dyYW1baGlzdG9ncmFtLmxlbmd0aCAtIDFdLngxXTtcbiAgY29uc3QgYmFyV2lkdGggPSB3aWR0aCAvIGhpc3RvZ3JhbS5sZW5ndGg7XG5cbiAgY29uc3QgeCA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKGRvbWFpbilcbiAgICAucmFuZ2UoWzAsIHdpZHRoXSk7XG5cbiAgY29uc3QgeSA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKFswLCBtYXgoaGlzdG9ncmFtLCBkID0+IGQuY291bnQpXSlcbiAgICAucmFuZ2UoWzAsIGhlaWdodF0pO1xuXG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17d2lkdGh9IGhlaWdodD17aGVpZ2h0fSBzdHlsZT17e21hcmdpblRvcDogYCR7bWFyZ2luLnRvcH1weGB9fT5cbiAgICAgIDxnIGNsYXNzTmFtZT1cImhpc3RvZ3JhbS1iYXJzXCI+XG4gICAgICAgIHtoaXN0b2dyYW0ubWFwKGJhciA9PiB7XG4gICAgICAgICAgY29uc3QgaW5SYW5nZSA9IGJhci54MCA+PSB2YWx1ZVswXSAmJiBiYXIueDEgPD0gdmFsdWVbMV07XG4gICAgICAgICAgY29uc3QgZmlsbCA9IGluUmFuZ2UgPyBoaXN0b2dyYW1TdHlsZS5oaWdobGlnaHRlZENvbG9yIDogaGlzdG9ncmFtU3R5bGUudW5IaWdobGlnaHRlZENvbG9yO1xuICAgICAgICAgIGNvbnN0IHdSYXRpbyA9IGluUmFuZ2UgPyBoaXN0b2dyYW1TdHlsZS5oaWdobGlnaHRXIDogaGlzdG9ncmFtU3R5bGUudW5IaWdobGlnaHRlZFc7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgICAga2V5PXtiYXIueDB9XG4gICAgICAgICAgICAgIGZpbGw9e2ZpbGx9XG4gICAgICAgICAgICAgIGhlaWdodD17eShiYXIuY291bnQpfVxuICAgICAgICAgICAgICB3aWR0aD17YmFyV2lkdGggKiB3UmF0aW99XG4gICAgICAgICAgICAgIHg9e3goYmFyLngwKSArIGJhcldpZHRoICogKDEgLSB3UmF0aW8pIC8gMn1cbiAgICAgICAgICAgICAgcng9ezF9XG4gICAgICAgICAgICAgIHJ5PXsxfVxuICAgICAgICAgICAgICB5PXtoZWlnaHQgLSB5KGJhci5jb3VudCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9nPlxuICAgICAge2JydXNoQ29tcG9uZW50fVxuICAgIDwvc3ZnPlxuICApO1xufTtcblxuY29uc3QgTGluZUNoYXJ0V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIC5ydi14eS1wbG90X19pbm5lciBwYXRoIHtcbiAgICBmaWxsOiBub25lO1xuICAgIHN0cm9rZS13aWR0aDogMS41O1xuICB9XG5gO1xuXG5jb25zdCBMaW5lQ2hhcnQgPSAoe1xuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICB5RG9tYWluLFxuICBoaW50Rm9ybWF0LFxuICBob3ZlcmVkRFAsXG4gIG1hcmdpbixcbiAgY29sb3IsXG4gIGRhdGEsXG4gIG9uTW91c2VNb3ZlLFxuICBjaGlsZHJlblxufSkgPT4ge1xuICBjb25zdCBicnVzaERhdGEgPSBbXG4gICAge3g6IGRhdGFbMF0ueCwgeTogeURvbWFpblsxXSwgY3VzdG9tQ29tcG9uZW50OiAoKSA9PiBjaGlsZHJlbn1cbiAgXTtcblxuICByZXR1cm4gKFxuICAgIDxMaW5lQ2hhcnRXcmFwcGVyPlxuICAgICAgPFhZUGxvdCB3aWR0aD17d2lkdGh9IGhlaWdodD17aGVpZ2h0fSBtYXJnaW49e3suLi5tYXJnaW4sIGJvdHRvbTogMTJ9fT5cbiAgICAgICAgPExpbmVTZXJpZXNcbiAgICAgICAgICBzdHJva2VXaWR0aD17Mn1cbiAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICBvbk5lYXJlc3RYPXtvbk1vdXNlTW92ZX1cbiAgICAgICAgLz5cbiAgICAgICAgPE1hcmtTZXJpZXNcbiAgICAgICAgICBkYXRhPXtob3ZlcmVkRFAgPyBbaG92ZXJlZERQXSA6IFtdfVxuICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICBzaXplPXszfVxuICAgICAgICAvPlxuICAgICAgICA8Q3VzdG9tU1ZHU2VyaWVzIGRhdGE9e2JydXNoRGF0YX0gLz5cbiAgICAgICAge2hvdmVyZWREUCA/IChcbiAgICAgICAgICA8SGludCB2YWx1ZT17aG92ZXJlZERQfT5cbiAgICAgICAgICAgIDxIaW50Q29udGVudFxuICAgICAgICAgICAgICB7Li4uaG92ZXJlZERQfVxuICAgICAgICAgICAgICBmb3JtYXQ9e3ZhbCA9PiBtb21lbnQudXRjKHZhbCkuZm9ybWF0KGhpbnRGb3JtYXQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0hpbnQ+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9YWVBsb3Q+XG4gICAgPC9MaW5lQ2hhcnRXcmFwcGVyPlxuICApO1xufTtcblxuY29uc3QgU3R5bGVkSGludCA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICNkM2Q4ZTA7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICBmb250LXNpemU6IDlweDtcbiAgbWFyZ2luOiA0cHg7XG4gIHBhZGRpbmc6IDNweCA2cHg7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbmA7XG5jb25zdCBIaW50Q29udGVudCA9ICh7eCwgeSwgZm9ybWF0fSkgPT4gKFxuICA8U3R5bGVkSGludD5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhpbnQtLXhcIj57Zm9ybWF0KHgpfTwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+e3l9PC9kaXY+XG4gIDwvU3R5bGVkSGludD5cbik7XG4iXX0=