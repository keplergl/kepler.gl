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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1wbG90LmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsInZhbHVlIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0Iiwib2JqZWN0IiwicGxvdFR5cGUiLCJzdHJpbmciLCJpc0VubGFyZ2VkIiwiYm9vbCIsIm9uQmx1ciIsImZ1bmMiLCJ3aWR0aCIsIm51bWJlciIsImNoYXJ0TWFyZ2luIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiY2hhcnRIIiwiY29udGFpbmVySCIsIlJhbmdlUGxvdCIsInN0YXRlIiwiaG92ZXJlZERQIiwiZG9tYWluU2VsZWN0b3IiLCJwcm9wcyIsInhEb21haW4iLCJoaW50Rm9ybWF0dGVyIiwiZG9tYWluIiwib25Nb3VzZU1vdmUiLCJzZXRTdGF0ZSIsInJlbmRlciIsIm9uQnJ1c2giLCJyYW5nZSIsIngwIiwibGVuZ3RoIiwieDEiLCJicnVzaENvbXBvbmVudCIsImhlaWdodCIsInBvc2l0aW9uIiwieURvbWFpbiIsInNlcmllcyIsIkhpc3RvZ3JhbSIsIm1hcmdpbiIsImhpZ2hsaWdodGVkUGFkZGluZyIsInVuSGlnaGxpZ2h0ZWRQYWRkaW5nIiwiaGlnaGxpZ2h0ZWRDb2xvciIsInVuSGlnaGxpZ2h0ZWRDb2xvciIsImJhcldpZHRoIiwieCIsInkiLCJkIiwiY291bnQiLCJtYXJnaW5Ub3AiLCJtYXAiLCJpblJhbmdlIiwiYmFyIiwiZmlsbCIsInBhZGRpbmciLCJMaW5lQ2hhcnRXcmFwcGVyIiwiZGl2IiwiTGluZUNoYXJ0IiwiaGludEZvcm1hdCIsImNvbG9yIiwiZGF0YSIsImNoaWxkcmVuIiwiYnJ1c2hEYXRhIiwiY3VzdG9tQ29tcG9uZW50IiwidXRjIiwidmFsIiwiZm9ybWF0IiwiU3R5bGVkSGludCIsInRoZW1lIiwidGV4dENvbG9yTFQiLCJIaW50Q29udGVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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LEtBQWYsRUFBc0IsUUFBUTBCLE1BQTlCLEVBQXNDLG1DQUFZSyxNQUFaLElBQW9CM0IsUUFBUSxFQUE1QixHQUF0QztBQUNFO0FBQ0UscUJBQWEsQ0FEZjtBQUVFLGVBQU8rQyxLQUZUO0FBR0UsY0FBTUMsSUFIUjtBQUlFLG9CQUFZbkM7QUFKZCxRQURGO0FBT0U7QUFDRSxjQUFNTixZQUFZLENBQUNBLFNBQUQsQ0FBWixHQUEwQixFQURsQztBQUVFLGVBQU93QyxLQUZUO0FBR0UsY0FBTTtBQUhSLFFBUEY7QUFZRSxpRUFBaUIsTUFBTUcsU0FBdkIsR0FaRjtBQWFHM0Msa0JBQ0M7QUFBQTtBQUFBLFVBQU0sT0FBT0EsU0FBYjtBQUNFLHNDQUFDLFdBQUQsNkJBQ01BLFNBRE47QUFFRSxrQkFBUTtBQUFBLG1CQUFPLGlCQUFPNkMsR0FBUCxDQUFXQyxHQUFYLEVBQWdCQyxNQUFoQixDQUF1QlIsVUFBdkIsQ0FBUDtBQUFBO0FBRlY7QUFERixPQURELEdBT0c7QUFwQk47QUFERixHQURGO0FBMEJELENBMUNEOztBQTRDQSxJQUFNUyxhQUFhLDJCQUFPWCxHQUFwQixtQkFHSztBQUFBLFNBQVNuQyxNQUFNK0MsS0FBTixDQUFZQyxXQUFyQjtBQUFBLENBSEwsQ0FBTjtBQVVBLElBQU1DLGNBQWMsU0FBZEEsV0FBYztBQUFBLE1BQUV6QixDQUFGLFNBQUVBLENBQUY7QUFBQSxNQUFLQyxDQUFMLFNBQUtBLENBQUw7QUFBQSxNQUFRb0IsTUFBUixTQUFRQSxNQUFSO0FBQUEsU0FDbEI7QUFBQyxjQUFEO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFNBQWY7QUFBMEJBLGFBQU9yQixDQUFQO0FBQTFCLEtBREY7QUFFRTtBQUFBO0FBQUEsUUFBSyxXQUFVLEtBQWY7QUFBc0JDO0FBQXRCO0FBRkYsR0FEa0I7QUFBQSxDQUFwQiIsImZpbGUiOiJyYW5nZS1wbG90LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtzY2FsZUxpbmVhcn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHttYXh9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCB7TGluZVNlcmllcywgWFlQbG90LCBDdXN0b21TVkdTZXJpZXMsIEhpbnQsIE1hcmtTZXJpZXN9IGZyb20gJ3JlYWN0LXZpcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtDT0xPUlN9IGZyb20gJ3N0eWxlcy9zdHlsZXMnO1xuaW1wb3J0IFJhbmdlQnJ1c2ggZnJvbSAnLi9yYW5nZS1icnVzaCc7XG5pbXBvcnQge2dldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyfSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHZhbHVlOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXksXG4gIGxpbmVDaGFydDogUHJvcFR5cGVzLm9iamVjdCxcbiAgcGxvdFR5cGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlzRW5sYXJnZWQ6IFByb3BUeXBlcy5ib29sLFxuICBvbkJsdXI6IFByb3BUeXBlcy5mdW5jLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBjaGFydE1hcmdpbiA9IHt0b3A6IDE4LCBib3R0b206IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwfTtcbmNvbnN0IGNoYXJ0SCA9IDUyO1xuY29uc3QgY29udGFpbmVySCA9IDc4O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5nZVBsb3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICBob3ZlcmVkRFA6IG51bGxcbiAgfTtcblxuICBkb21haW5TZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmxpbmVDaGFydCAmJiBwcm9wcy5saW5lQ2hhcnQueERvbWFpbjtcbiAgaGludEZvcm1hdHRlciA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuZG9tYWluU2VsZWN0b3IsIGRvbWFpbiA9PlxuICAgIGdldFRpbWVXaWRnZXRIaW50Rm9ybWF0dGVyKGRvbWFpbilcbiAgKTtcblxuICBvbk1vdXNlTW92ZSA9IGhvdmVyZWREUCA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aG92ZXJlZERQfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIG9uQnJ1c2gsXG4gICAgICByYW5nZSxcbiAgICAgIHZhbHVlLFxuICAgICAgd2lkdGgsXG4gICAgICBwbG90VHlwZSxcbiAgICAgIGxpbmVDaGFydCxcbiAgICAgIGhpc3RvZ3JhbVxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGRvbWFpbiA9IFtoaXN0b2dyYW1bMF0ueDAsIGhpc3RvZ3JhbVtoaXN0b2dyYW0ubGVuZ3RoIC0gMV0ueDFdO1xuXG4gICAgY29uc3QgYnJ1c2hDb21wb25lbnQgPSAoXG4gICAgICA8UmFuZ2VCcnVzaFxuICAgICAgICBkb21haW49e2RvbWFpbn1cbiAgICAgICAgb25CcnVzaD17b25CcnVzaH1cbiAgICAgICAgcmFuZ2U9e3JhbmdlfVxuICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgIC8+XG4gICAgKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiBgJHtjb250YWluZXJIfXB4YCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7cGxvdFR5cGUgPT09ICdsaW5lQ2hhcnQnID8gKFxuICAgICAgICAgIDxMaW5lQ2hhcnRcbiAgICAgICAgICAgIGhvdmVyZWREUD17dGhpcy5zdGF0ZS5ob3ZlcmVkRFB9XG4gICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICBoZWlnaHQ9e2NvbnRhaW5lckh9XG4gICAgICAgICAgICBtYXJnaW49e2NoYXJ0TWFyZ2lufVxuICAgICAgICAgICAgY2hpbGRyZW49e2JydXNoQ29tcG9uZW50fVxuICAgICAgICAgICAgb25Nb3VzZU1vdmU9e3RoaXMub25Nb3VzZU1vdmV9XG4gICAgICAgICAgICB5RG9tYWluPXtsaW5lQ2hhcnQueURvbWFpbn1cbiAgICAgICAgICAgIGhpbnRGb3JtYXQ9e3RoaXMuaGludEZvcm1hdHRlcih0aGlzLnByb3BzKX1cbiAgICAgICAgICAgIGRhdGE9e2xpbmVDaGFydC5zZXJpZXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8SGlzdG9ncmFtXG4gICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICBoZWlnaHQ9e2NoYXJ0SH1cbiAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgIG1hcmdpbj17Y2hhcnRNYXJnaW59XG4gICAgICAgICAgICBoaXN0b2dyYW09e2hpc3RvZ3JhbX1cbiAgICAgICAgICAgIGJydXNoQ29tcG9uZW50PXticnVzaENvbXBvbmVudH1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5SYW5nZVBsb3QucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5jb25zdCBIaXN0b2dyYW0gPSAoe1xuICB3aWR0aCxcbiAgaGVpZ2h0LFxuICBtYXJnaW4sXG4gIGhpc3RvZ3JhbSxcbiAgdmFsdWUsXG4gIGJydXNoQ29tcG9uZW50XG59KSA9PiB7XG4gIGNvbnN0IGRvbWFpbiA9IFtoaXN0b2dyYW1bMF0ueDAsIGhpc3RvZ3JhbVtoaXN0b2dyYW0ubGVuZ3RoIC0gMV0ueDFdO1xuXG4gIGNvbnN0IGhpZ2hsaWdodGVkUGFkZGluZyA9IGhpc3RvZ3JhbS5sZW5ndGggLyA0MDtcbiAgY29uc3QgdW5IaWdobGlnaHRlZFBhZGRpbmcgPSBoaXN0b2dyYW0ubGVuZ3RoIC8gMjA7XG5cbiAgY29uc3QgaGlnaGxpZ2h0ZWRDb2xvciA9IENPTE9SU1sndWJlci1ibHVlJ107XG4gIGNvbnN0IHVuSGlnaGxpZ2h0ZWRDb2xvciA9IENPTE9SU1sndWJlci1ibGFjay00MCddO1xuXG4gIGNvbnN0IGJhcldpZHRoID0gd2lkdGggLyBoaXN0b2dyYW0ubGVuZ3RoO1xuXG4gIGNvbnN0IHggPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihkb21haW4pXG4gICAgLnJhbmdlKFswLCB3aWR0aF0pO1xuXG4gIGNvbnN0IHkgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihbMCwgbWF4KGhpc3RvZ3JhbSwgZCA9PiBkLmNvdW50KV0pXG4gICAgLnJhbmdlKFswLCBoZWlnaHRdKTtcblxuICByZXR1cm4gKFxuICAgIDxzdmcgd2lkdGg9e3dpZHRofSBoZWlnaHQ9e2hlaWdodH0gc3R5bGU9e3ttYXJnaW5Ub3A6IGAke21hcmdpbi50b3B9cHhgfX0+XG4gICAgICA8ZyBjbGFzc05hbWU9XCJoaXN0b2dyYW0tYmFyc1wiPlxuICAgICAgICB7aGlzdG9ncmFtLm1hcChiYXIgPT4ge1xuICAgICAgICAgIGNvbnN0IGluUmFuZ2UgPSBiYXIueDAgPj0gdmFsdWVbMF0gJiYgYmFyLngxIDw9IHZhbHVlWzFdO1xuICAgICAgICAgIGNvbnN0IGZpbGwgPSBpblJhbmdlID8gaGlnaGxpZ2h0ZWRDb2xvciA6IHVuSGlnaGxpZ2h0ZWRDb2xvcjtcbiAgICAgICAgICBjb25zdCBwYWRkaW5nID0gaW5SYW5nZSA/IGhpZ2hsaWdodGVkUGFkZGluZyA6IHVuSGlnaGxpZ2h0ZWRQYWRkaW5nO1xuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICAgIGtleT17YmFyLngwfVxuICAgICAgICAgICAgICBmaWxsPXtmaWxsfVxuICAgICAgICAgICAgICBoZWlnaHQ9e3koYmFyLmNvdW50KX1cbiAgICAgICAgICAgICAgd2lkdGg9e2JhcldpZHRoIC0gcGFkZGluZ31cbiAgICAgICAgICAgICAgeD17eChiYXIueDApfVxuICAgICAgICAgICAgICByeD17MX1cbiAgICAgICAgICAgICAgcnk9ezF9XG4gICAgICAgICAgICAgIHk9e2hlaWdodCAtIHkoYmFyLmNvdW50KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L2c+XG4gICAgICB7YnJ1c2hDb21wb25lbnR9XG4gICAgPC9zdmc+XG4gICk7XG59O1xuXG5jb25zdCBMaW5lQ2hhcnRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgLnJ2LXh5LXBsb3RfX2lubmVyIHBhdGgge1xuICAgIGZpbGw6IG5vbmU7XG4gICAgc3Ryb2tlLXdpZHRoOiAxLjU7XG4gIH1cbmA7XG5cbmNvbnN0IExpbmVDaGFydCA9ICh7XG4gIHdpZHRoLFxuICBoZWlnaHQsXG4gIHlEb21haW4sXG4gIGhpbnRGb3JtYXQsXG4gIGhvdmVyZWREUCxcbiAgbWFyZ2luLFxuICBjb2xvcixcbiAgZGF0YSxcbiAgb25Nb3VzZU1vdmUsXG4gIGNoaWxkcmVuXG59KSA9PiB7XG4gIGNvbnN0IGJydXNoRGF0YSA9IFtcbiAgICB7eDogZGF0YVswXS54LCB5OiB5RG9tYWluWzFdLCBjdXN0b21Db21wb25lbnQ6ICgpID0+IGNoaWxkcmVufVxuICBdO1xuXG4gIHJldHVybiAoXG4gICAgPExpbmVDaGFydFdyYXBwZXI+XG4gICAgICA8WFlQbG90IHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9IG1hcmdpbj17ey4uLm1hcmdpbiwgYm90dG9tOiAxMn19PlxuICAgICAgICA8TGluZVNlcmllc1xuICAgICAgICAgIHN0cm9rZVdpZHRoPXsyfVxuICAgICAgICAgIGNvbG9yPXtjb2xvcn1cbiAgICAgICAgICBkYXRhPXtkYXRhfVxuICAgICAgICAgIG9uTmVhcmVzdFg9e29uTW91c2VNb3ZlfVxuICAgICAgICAvPlxuICAgICAgICA8TWFya1Nlcmllc1xuICAgICAgICAgIGRhdGE9e2hvdmVyZWREUCA/IFtob3ZlcmVkRFBdIDogW119XG4gICAgICAgICAgY29sb3I9e2NvbG9yfVxuICAgICAgICAgIHNpemU9ezN9XG4gICAgICAgIC8+XG4gICAgICAgIDxDdXN0b21TVkdTZXJpZXMgZGF0YT17YnJ1c2hEYXRhfSAvPlxuICAgICAgICB7aG92ZXJlZERQID8gKFxuICAgICAgICAgIDxIaW50IHZhbHVlPXtob3ZlcmVkRFB9PlxuICAgICAgICAgICAgPEhpbnRDb250ZW50XG4gICAgICAgICAgICAgIHsuLi5ob3ZlcmVkRFB9XG4gICAgICAgICAgICAgIGZvcm1hdD17dmFsID0+IG1vbWVudC51dGModmFsKS5mb3JtYXQoaGludEZvcm1hdCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvSGludD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L1hZUGxvdD5cbiAgICA8L0xpbmVDaGFydFdyYXBwZXI+XG4gICk7XG59O1xuXG5jb25zdCBTdHlsZWRIaW50ID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogI2QzZDhlMDtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gIGZvbnQtc2l6ZTogOXB4O1xuICBtYXJnaW46IDRweDtcbiAgcGFkZGluZzogM3B4IDZweDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuYDtcbmNvbnN0IEhpbnRDb250ZW50ID0gKHt4LCB5LCBmb3JtYXR9KSA9PiAoXG4gIDxTdHlsZWRIaW50PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaGludC0teFwiPntmb3JtYXQoeCl9PC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj57eX08L2Rpdj5cbiAgPC9TdHlsZWRIaW50PlxuKTtcbiJdfQ==