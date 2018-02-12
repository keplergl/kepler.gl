'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _timeRangeSlider = require('../common/time-range-slider');

var _timeRangeSlider2 = _interopRequireDefault(_timeRangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * TimeRangeFilter -> TimeRangeSlider -> RangeSlider
 */
var TimeRangeFilter = function TimeRangeFilter(_ref) {
  var filter = _ref.filter,
      setFilter = _ref.setFilter,
      isAnyFilterAnimating = _ref.isAnyFilterAnimating,
      toggleAnimation = _ref.toggleAnimation;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_timeRangeSlider2.default, {
      domain: filter.domain,
      value: filter.value,
      plotType: filter.plotType,
      lineChart: filter.lineChart,
      step: filter.step,
      speed: filter.speed,
      histogram: filter.enlarged ? filter.enlargedHistogram : filter.histogram,
      onChange: setFilter,
      toggleAnimation: toggleAnimation,
      isAnimatable: !isAnyFilterAnimating || filter.isAnimating,
      isEnlarged: filter.enlarged
    })
  );
};

exports.default = TimeRangeFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS1yYW5nZS1maWx0ZXIuanMiXSwibmFtZXMiOlsiVGltZVJhbmdlRmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJ0b2dnbGVBbmltYXRpb24iLCJkb21haW4iLCJ2YWx1ZSIsInBsb3RUeXBlIiwibGluZUNoYXJ0Iiwic3RlcCIsInNwZWVkIiwiZW5sYXJnZWQiLCJlbmxhcmdlZEhpc3RvZ3JhbSIsImhpc3RvZ3JhbSIsImlzQW5pbWF0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTs7O0FBR0EsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLE1BQ3RCQyxNQURzQixRQUN0QkEsTUFEc0I7QUFBQSxNQUV0QkMsU0FGc0IsUUFFdEJBLFNBRnNCO0FBQUEsTUFHdEJDLG9CQUhzQixRQUd0QkEsb0JBSHNCO0FBQUEsTUFJdEJDLGVBSnNCLFFBSXRCQSxlQUpzQjtBQUFBLFNBTXRCO0FBQUE7QUFBQTtBQUNFO0FBQ0UsY0FBUUgsT0FBT0ksTUFEakI7QUFFRSxhQUFPSixPQUFPSyxLQUZoQjtBQUdFLGdCQUFVTCxPQUFPTSxRQUhuQjtBQUlFLGlCQUFXTixPQUFPTyxTQUpwQjtBQUtFLFlBQU1QLE9BQU9RLElBTGY7QUFNRSxhQUFPUixPQUFPUyxLQU5oQjtBQU9FLGlCQUFXVCxPQUFPVSxRQUFQLEdBQWtCVixPQUFPVyxpQkFBekIsR0FBNkNYLE9BQU9ZLFNBUGpFO0FBUUUsZ0JBQVVYLFNBUlo7QUFTRSx1QkFBaUJFLGVBVG5CO0FBVUUsb0JBQWMsQ0FBQ0Qsb0JBQUQsSUFBeUJGLE9BQU9hLFdBVmhEO0FBV0Usa0JBQVliLE9BQU9VO0FBWHJCO0FBREYsR0FOc0I7QUFBQSxDQUF4Qjs7a0JBdUJlWCxlIiwiZmlsZSI6InRpbWUtcmFuZ2UtZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBUaW1lUmFuZ2VTbGlkZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vdGltZS1yYW5nZS1zbGlkZXInO1xuXG4vKlxuICogVGltZVJhbmdlRmlsdGVyIC0+IFRpbWVSYW5nZVNsaWRlciAtPiBSYW5nZVNsaWRlclxuICovXG5jb25zdCBUaW1lUmFuZ2VGaWx0ZXIgPSAoe1xuICBmaWx0ZXIsXG4gIHNldEZpbHRlcixcbiAgaXNBbnlGaWx0ZXJBbmltYXRpbmcsXG4gIHRvZ2dsZUFuaW1hdGlvblxufSkgPT4gKFxuICA8ZGl2PlxuICAgIDxUaW1lUmFuZ2VTbGlkZXJcbiAgICAgIGRvbWFpbj17ZmlsdGVyLmRvbWFpbn1cbiAgICAgIHZhbHVlPXtmaWx0ZXIudmFsdWV9XG4gICAgICBwbG90VHlwZT17ZmlsdGVyLnBsb3RUeXBlfVxuICAgICAgbGluZUNoYXJ0PXtmaWx0ZXIubGluZUNoYXJ0fVxuICAgICAgc3RlcD17ZmlsdGVyLnN0ZXB9XG4gICAgICBzcGVlZD17ZmlsdGVyLnNwZWVkfVxuICAgICAgaGlzdG9ncmFtPXtmaWx0ZXIuZW5sYXJnZWQgPyBmaWx0ZXIuZW5sYXJnZWRIaXN0b2dyYW0gOiBmaWx0ZXIuaGlzdG9ncmFtfVxuICAgICAgb25DaGFuZ2U9e3NldEZpbHRlcn1cbiAgICAgIHRvZ2dsZUFuaW1hdGlvbj17dG9nZ2xlQW5pbWF0aW9ufVxuICAgICAgaXNBbmltYXRhYmxlPXshaXNBbnlGaWx0ZXJBbmltYXRpbmcgfHwgZmlsdGVyLmlzQW5pbWF0aW5nfVxuICAgICAgaXNFbmxhcmdlZD17ZmlsdGVyLmVubGFyZ2VkfVxuICAgIC8+XG4gIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgVGltZVJhbmdlRmlsdGVyO1xuIl19