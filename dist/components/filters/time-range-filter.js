'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _timeRangeSlider = require('../../components/common/time-range-slider');

var _timeRangeSlider2 = _interopRequireDefault(_timeRangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      histogram: filter.enlarged ? filter.enlargedHistogram : filter.histogram,
      onChange: setFilter,
      toggleAnimation: toggleAnimation,
      isAnimatable: !isAnyFilterAnimating || filter.isAnimating,
      isEnlarged: filter.enlarged
    })
  );
};

exports.default = TimeRangeFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS1yYW5nZS1maWx0ZXIuanMiXSwibmFtZXMiOlsiVGltZVJhbmdlRmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJ0b2dnbGVBbmltYXRpb24iLCJkb21haW4iLCJ2YWx1ZSIsInBsb3RUeXBlIiwibGluZUNoYXJ0Iiwic3RlcCIsImVubGFyZ2VkIiwiZW5sYXJnZWRIaXN0b2dyYW0iLCJoaXN0b2dyYW0iLCJpc0FuaW1hdGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLE1BQ3RCQyxNQURzQixRQUN0QkEsTUFEc0I7QUFBQSxNQUV0QkMsU0FGc0IsUUFFdEJBLFNBRnNCO0FBQUEsTUFHdEJDLG9CQUhzQixRQUd0QkEsb0JBSHNCO0FBQUEsTUFJdEJDLGVBSnNCLFFBSXRCQSxlQUpzQjtBQUFBLFNBTXRCO0FBQUE7QUFBQTtBQUNFO0FBQ0UsY0FBUUgsT0FBT0ksTUFEakI7QUFFRSxhQUFPSixPQUFPSyxLQUZoQjtBQUdFLGdCQUFVTCxPQUFPTSxRQUhuQjtBQUlFLGlCQUFXTixPQUFPTyxTQUpwQjtBQUtFLFlBQU1QLE9BQU9RLElBTGY7QUFNRSxpQkFBV1IsT0FBT1MsUUFBUCxHQUFrQlQsT0FBT1UsaUJBQXpCLEdBQTZDVixPQUFPVyxTQU5qRTtBQU9FLGdCQUFVVixTQVBaO0FBUUUsdUJBQWlCRSxlQVJuQjtBQVNFLG9CQUFjLENBQUNELG9CQUFELElBQXlCRixPQUFPWSxXQVRoRDtBQVVFLGtCQUFZWixPQUFPUztBQVZyQjtBQURGLEdBTnNCO0FBQUEsQ0FBeEI7O2tCQXNCZVYsZSIsImZpbGUiOiJ0aW1lLXJhbmdlLWZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVGltZVJhbmdlU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29tbW9uL3RpbWUtcmFuZ2Utc2xpZGVyJztcblxuY29uc3QgVGltZVJhbmdlRmlsdGVyID0gKHtcbiAgZmlsdGVyLFxuICBzZXRGaWx0ZXIsXG4gIGlzQW55RmlsdGVyQW5pbWF0aW5nLFxuICB0b2dnbGVBbmltYXRpb25cbn0pID0+IChcbiAgPGRpdj5cbiAgICA8VGltZVJhbmdlU2xpZGVyXG4gICAgICBkb21haW49e2ZpbHRlci5kb21haW59XG4gICAgICB2YWx1ZT17ZmlsdGVyLnZhbHVlfVxuICAgICAgcGxvdFR5cGU9e2ZpbHRlci5wbG90VHlwZX1cbiAgICAgIGxpbmVDaGFydD17ZmlsdGVyLmxpbmVDaGFydH1cbiAgICAgIHN0ZXA9e2ZpbHRlci5zdGVwfVxuICAgICAgaGlzdG9ncmFtPXtmaWx0ZXIuZW5sYXJnZWQgPyBmaWx0ZXIuZW5sYXJnZWRIaXN0b2dyYW0gOiBmaWx0ZXIuaGlzdG9ncmFtfVxuICAgICAgb25DaGFuZ2U9e3NldEZpbHRlcn1cbiAgICAgIHRvZ2dsZUFuaW1hdGlvbj17dG9nZ2xlQW5pbWF0aW9ufVxuICAgICAgaXNBbmltYXRhYmxlPXshaXNBbnlGaWx0ZXJBbmltYXRpbmcgfHwgZmlsdGVyLmlzQW5pbWF0aW5nfVxuICAgICAgaXNFbmxhcmdlZD17ZmlsdGVyLmVubGFyZ2VkfVxuICAgIC8+XG4gIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgVGltZVJhbmdlRmlsdGVyO1xuIl19