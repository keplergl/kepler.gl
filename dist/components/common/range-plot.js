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
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: #D3D8E0;\n  border-radius: 2px;\n  color: ', ';\n  font-size: 9px;\n  margin: 4px;\n  padding: 3px 6px;\n  pointer-events: none;\n  user-select: none;\n'], ['\n  background-color: #D3D8E0;\n  border-radius: 2px;\n  color: ', ';\n  font-size: 9px;\n  margin: 4px;\n  padding: 3px 6px;\n  pointer-events: none;\n  user-select: none;\n']);

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

var _styles = require('../../styles/styles');

var _rangeBrush = require('./range-brush');

var _rangeBrush2 = _interopRequireDefault(_rangeBrush);

var _filterUtils = require('../../utils/filter-utils');

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

var RangePlot = function (_Component) {
  (0, _inherits3.default)(RangePlot, _Component);

  function RangePlot() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, RangePlot);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.domainSelector = function (props) {
      return props.lineChart && props.lineChart.xDomain;
    }, _this.hintFormatter = (0, _reselect.createSelector)(_this.domainSelector, function (domain) {
      return (0, _filterUtils.getTimeWidgetHintFormatter)(domain);
    }), _this.state = {
      hoveredDP: null
    }, _this.onMouseMove = function (hoveredDP) {
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
      { style: {
          height: containerH + 'px',
          position: 'relative'
        } },
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
;

RangePlot.propTypes = propTypes;

var Histogram = function Histogram(_ref) {
  var width = _ref.width,
      height = _ref.height,
      margin = _ref.margin,
      histogram = _ref.histogram,
      value = _ref.value,
      brushComponent = _ref.brushComponent;

  var domain = [histogram[0].x0, histogram[histogram.length - 1].x1];

  var highlightedPadding = histogram.length / 40;
  var unHighlightedPadding = histogram.length / 20;

  var highlightedColor = _styles.COLORS['uber-blue'];
  var unHighlightedColor = _styles.COLORS['uber-black-40'];

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
        var fill = inRange ? highlightedColor : unHighlightedColor;
        var padding = inRange ? highlightedPadding : unHighlightedPadding;

        return _react2.default.createElement('rect', {
          key: bar.x0,
          fill: fill,
          height: y(bar.count),
          width: barWidth - padding,
          x: x(bar.x0),
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
      {
        width: width,
        height: height,
        margin: (0, _extends3.default)({}, margin, { bottom: 12 }) },
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
        _react2.default.createElement(HintContent, (0, _extends3.default)({}, hoveredDP, { format: function format(val) {
            return _moment2.default.utc(val).format(hintFormat);
          } }))
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1wbG90LmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsInZhbHVlIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0Iiwib2JqZWN0IiwicGxvdFR5cGUiLCJzdHJpbmciLCJpc0VubGFyZ2VkIiwiYm9vbCIsIm9uQmx1ciIsImZ1bmMiLCJ3aWR0aCIsIm51bWJlciIsImNoYXJ0TWFyZ2luIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiY2hhcnRIIiwiY29udGFpbmVySCIsIlJhbmdlUGxvdCIsImRvbWFpblNlbGVjdG9yIiwicHJvcHMiLCJ4RG9tYWluIiwiaGludEZvcm1hdHRlciIsImRvbWFpbiIsInN0YXRlIiwiaG92ZXJlZERQIiwib25Nb3VzZU1vdmUiLCJzZXRTdGF0ZSIsInJlbmRlciIsIm9uQnJ1c2giLCJyYW5nZSIsIngwIiwibGVuZ3RoIiwieDEiLCJicnVzaENvbXBvbmVudCIsImhlaWdodCIsInBvc2l0aW9uIiwieURvbWFpbiIsInNlcmllcyIsIkhpc3RvZ3JhbSIsIm1hcmdpbiIsImhpZ2hsaWdodGVkUGFkZGluZyIsInVuSGlnaGxpZ2h0ZWRQYWRkaW5nIiwiaGlnaGxpZ2h0ZWRDb2xvciIsInVuSGlnaGxpZ2h0ZWRDb2xvciIsImJhcldpZHRoIiwieCIsInkiLCJkIiwiY291bnQiLCJtYXJnaW5Ub3AiLCJtYXAiLCJpblJhbmdlIiwiYmFyIiwiZmlsbCIsInBhZGRpbmciLCJMaW5lQ2hhcnRXcmFwcGVyIiwiZGl2IiwiTGluZUNoYXJ0IiwiaGludEZvcm1hdCIsImNvbG9yIiwiZGF0YSIsImNoaWxkcmVuIiwiYnJ1c2hEYXRhIiwiY3VzdG9tQ29tcG9uZW50IiwidXRjIiwidmFsIiwiZm9ybWF0IiwiU3R5bGVkSGludCIsInRoZW1lIiwidGV4dENvbG9yTFQiLCJIaW50Q29udGVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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QiIsImZpbGUiOiJyYW5nZS1wbG90LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtzY2FsZUxpbmVhcn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHttYXh9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCB7TGluZVNlcmllcywgWFlQbG90LCBDdXN0b21TVkdTZXJpZXMsIEhpbnQsIE1hcmtTZXJpZXN9IGZyb20gJ3JlYWN0LXZpcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtDT0xPUlN9IGZyb20gJ3N0eWxlcy9zdHlsZXMnO1xuaW1wb3J0IFJhbmdlQnJ1c2ggZnJvbSAnLi9yYW5nZS1icnVzaCc7XG5pbXBvcnQge2dldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyfSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHZhbHVlOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXksXG4gIGxpbmVDaGFydDogUHJvcFR5cGVzLm9iamVjdCxcbiAgcGxvdFR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlzRW5sYXJnZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvbkJsdXI6IFByb3BUeXBlcy5mdW5jLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBjaGFydE1hcmdpbiA9IHt0b3A6IDE4LCBib3R0b206IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwfTtcbmNvbnN0IGNoYXJ0SCA9IDUyO1xuY29uc3QgY29udGFpbmVySCA9IDc4O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5nZVBsb3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBkb21haW5TZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmxpbmVDaGFydCAmJiBwcm9wcy5saW5lQ2hhcnQueERvbWFpbjtcbiAgaGludEZvcm1hdHRlciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZG9tYWluU2VsZWN0b3IsXG4gICAgZG9tYWluID0+IGdldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyKGRvbWFpbilcbiAgKTtcblxuICBzdGF0ZSA9IHtcbiAgICBob3ZlcmVkRFA6IG51bGxcbiAgfTtcblxuICBvbk1vdXNlTW92ZSA9IChob3ZlcmVkRFApID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtob3ZlcmVkRFB9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge29uQnJ1c2gsIHJhbmdlLCB2YWx1ZSwgd2lkdGgsIHBsb3RUeXBlLCBsaW5lQ2hhcnQsIGhpc3RvZ3JhbX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGRvbWFpbiA9IFtoaXN0b2dyYW1bMF0ueDAsIGhpc3RvZ3JhbVtoaXN0b2dyYW0ubGVuZ3RoIC0gMV0ueDFdO1xuXG4gICAgY29uc3QgYnJ1c2hDb21wb25lbnQgPSAoXG4gICAgICA8UmFuZ2VCcnVzaFxuICAgICAgICBkb21haW49e2RvbWFpbn1cbiAgICAgICAgb25CcnVzaD17b25CcnVzaH1cbiAgICAgICAgcmFuZ2U9e3JhbmdlfVxuICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgIC8+XG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIGhlaWdodDogYCR7Y29udGFpbmVySH1weGAsXG4gICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICB9fT5cbiAgICAgICAge3Bsb3RUeXBlID09PSAnbGluZUNoYXJ0JyA/XG4gICAgICAgICAgPExpbmVDaGFydFxuICAgICAgICAgICAgaG92ZXJlZERQPXt0aGlzLnN0YXRlLmhvdmVyZWREUH1cbiAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgIGhlaWdodD17Y29udGFpbmVySH1cbiAgICAgICAgICAgIG1hcmdpbj17Y2hhcnRNYXJnaW59XG4gICAgICAgICAgICBjaGlsZHJlbj17YnJ1c2hDb21wb25lbnR9XG4gICAgICAgICAgICBvbk1vdXNlTW92ZT17dGhpcy5vbk1vdXNlTW92ZX1cbiAgICAgICAgICAgIHlEb21haW49e2xpbmVDaGFydC55RG9tYWlufVxuICAgICAgICAgICAgaGludEZvcm1hdD17dGhpcy5oaW50Rm9ybWF0dGVyKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgZGF0YT17bGluZUNoYXJ0LnNlcmllc31cbiAgICAgICAgICAvPiA6XG4gICAgICAgICAgPEhpc3RvZ3JhbVxuICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgaGVpZ2h0PXtjaGFydEh9XG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBtYXJnaW49e2NoYXJ0TWFyZ2lufVxuICAgICAgICAgICAgaGlzdG9ncmFtPXtoaXN0b2dyYW19XG4gICAgICAgICAgICBicnVzaENvbXBvbmVudD17YnJ1c2hDb21wb25lbnR9XG4gICAgICAgICAgLz5cbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxuUmFuZ2VQbG90LnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgSGlzdG9ncmFtID0gKHt3aWR0aCwgaGVpZ2h0LCBtYXJnaW4sIGhpc3RvZ3JhbSwgdmFsdWUsIGJydXNoQ29tcG9uZW50fSkgPT4ge1xuICBjb25zdCBkb21haW4gPSBbaGlzdG9ncmFtWzBdLngwLCBoaXN0b2dyYW1baGlzdG9ncmFtLmxlbmd0aCAtIDFdLngxXTtcblxuICBjb25zdCBoaWdobGlnaHRlZFBhZGRpbmcgPSBoaXN0b2dyYW0ubGVuZ3RoIC8gNDA7XG4gIGNvbnN0IHVuSGlnaGxpZ2h0ZWRQYWRkaW5nID0gaGlzdG9ncmFtLmxlbmd0aCAvIDIwO1xuXG4gIGNvbnN0IGhpZ2hsaWdodGVkQ29sb3IgPSBDT0xPUlNbJ3ViZXItYmx1ZSddO1xuICBjb25zdCB1bkhpZ2hsaWdodGVkQ29sb3IgPSBDT0xPUlNbJ3ViZXItYmxhY2stNDAnXTtcblxuICBjb25zdCBiYXJXaWR0aCA9IHdpZHRoIC8gaGlzdG9ncmFtLmxlbmd0aDtcblxuICBjb25zdCB4ID0gc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oZG9tYWluKVxuICAgIC5yYW5nZShbMCwgd2lkdGhdKTtcblxuICBjb25zdCB5ID0gc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oWzAsIG1heChoaXN0b2dyYW0sIGQgPT4gZC5jb3VudCldKVxuICAgIC5yYW5nZShbMCwgaGVpZ2h0XSk7XG5cbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9IHN0eWxlPXt7bWFyZ2luVG9wOiBgJHttYXJnaW4udG9wfXB4YH19PlxuICAgICAgPGcgY2xhc3NOYW1lPSdoaXN0b2dyYW0tYmFycyc+XG4gICAgICAgIHtoaXN0b2dyYW0ubWFwKGJhciA9PiB7XG4gICAgICAgICAgY29uc3QgaW5SYW5nZSA9IGJhci54MCA+PSB2YWx1ZVswXSAmJiBiYXIueDEgPD0gdmFsdWVbMV07XG4gICAgICAgICAgY29uc3QgZmlsbCA9IGluUmFuZ2UgPyBoaWdobGlnaHRlZENvbG9yIDogdW5IaWdobGlnaHRlZENvbG9yO1xuICAgICAgICAgIGNvbnN0IHBhZGRpbmcgPSBpblJhbmdlID8gaGlnaGxpZ2h0ZWRQYWRkaW5nIDogdW5IaWdobGlnaHRlZFBhZGRpbmc7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgICAga2V5PXtiYXIueDB9XG4gICAgICAgICAgICAgIGZpbGw9e2ZpbGx9XG4gICAgICAgICAgICAgIGhlaWdodD17eShiYXIuY291bnQpfVxuICAgICAgICAgICAgICB3aWR0aD17YmFyV2lkdGggLSBwYWRkaW5nfVxuICAgICAgICAgICAgICB4PXt4KGJhci54MCl9XG4gICAgICAgICAgICAgIHJ4PXsxfVxuICAgICAgICAgICAgICByeT17MX1cbiAgICAgICAgICAgICAgeT17aGVpZ2h0IC0geShiYXIuY291bnQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgIDwvZz5cbiAgICAgIHticnVzaENvbXBvbmVudH1cbiAgICA8L3N2Zz5cbiAgKVxufTtcblxuY29uc3QgTGluZUNoYXJ0V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIC5ydi14eS1wbG90X19pbm5lciBwYXRoIHtcbiAgICBmaWxsOiBub25lO1xuICAgIHN0cm9rZS13aWR0aDogMS41O1xuICB9XG5gO1xuXG5jb25zdCBMaW5lQ2hhcnQgPSAoe3dpZHRoLCBoZWlnaHQsIHlEb21haW4sIGhpbnRGb3JtYXQsIGhvdmVyZWREUCwgbWFyZ2luLCBjb2xvciwgZGF0YSwgb25Nb3VzZU1vdmUsIGNoaWxkcmVufSkgPT4ge1xuICBjb25zdCBicnVzaERhdGEgPSBbXG4gICAge3g6IGRhdGFbMF0ueCwgeTogeURvbWFpblsxXSwgY3VzdG9tQ29tcG9uZW50OiAoKSA9PiBjaGlsZHJlbn1cbiAgXTtcblxuICByZXR1cm4gKFxuICAgIDxMaW5lQ2hhcnRXcmFwcGVyPlxuICAgICAgPFhZUGxvdFxuICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICBtYXJnaW49e3suLi5tYXJnaW4sIGJvdHRvbTogMTJ9fT5cbiAgICAgICAgPExpbmVTZXJpZXNcbiAgICAgICAgICBzdHJva2VXaWR0aD17Mn1cbiAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICBvbk5lYXJlc3RYPXtvbk1vdXNlTW92ZX1cbiAgICAgICAgLz5cbiAgICAgICAgPE1hcmtTZXJpZXNcbiAgICAgICAgICBkYXRhPXtob3ZlcmVkRFAgPyBbaG92ZXJlZERQXSA6IFtdfVxuICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICBzaXplPXszfVxuICAgICAgICAvPlxuICAgICAgICA8Q3VzdG9tU1ZHU2VyaWVzIGRhdGE9e2JydXNoRGF0YX0vPlxuICAgICAgICB7aG92ZXJlZERQID8gKDxIaW50IHZhbHVlPXtob3ZlcmVkRFB9PlxuICAgICAgICAgIDxIaW50Q29udGVudCB7Li4uaG92ZXJlZERQfSBmb3JtYXQ9e3ZhbCA9PiBtb21lbnQudXRjKHZhbCkuZm9ybWF0KGhpbnRGb3JtYXQpfS8+XG4gICAgICAgIDwvSGludD4pIDogbnVsbH1cbiAgICAgIDwvWFlQbG90PlxuICAgIDwvTGluZUNoYXJ0V3JhcHBlcj5cbiAgKTtcbn07XG5cbmNvbnN0IFN0eWxlZEhpbnQgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRDNEOEUwO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgZm9udC1zaXplOiA5cHg7XG4gIG1hcmdpbjogNHB4O1xuICBwYWRkaW5nOiAzcHggNnB4O1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG5gO1xuY29uc3QgSGludENvbnRlbnQgPSAoe3gsIHksIGZvcm1hdH0pID0+IChcbiAgPFN0eWxlZEhpbnQ+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJoaW50LS14XCI+e2Zvcm1hdCh4KX08L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPnt5fTwvZGl2PlxuICA8L1N0eWxlZEhpbnQ+XG4pO1xuIl19