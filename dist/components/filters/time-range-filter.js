'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _timeRangeSlider = require('../common/time-range-slider');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS1yYW5nZS1maWx0ZXIuanMiXSwibmFtZXMiOlsiVGltZVJhbmdlRmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJ0b2dnbGVBbmltYXRpb24iLCJkb21haW4iLCJ2YWx1ZSIsInBsb3RUeXBlIiwibGluZUNoYXJ0Iiwic3RlcCIsInNwZWVkIiwiZW5sYXJnZWQiLCJlbmxhcmdlZEhpc3RvZ3JhbSIsImhpc3RvZ3JhbSIsImlzQW5pbWF0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsTUFDdEJDLE1BRHNCLFFBQ3RCQSxNQURzQjtBQUFBLE1BRXRCQyxTQUZzQixRQUV0QkEsU0FGc0I7QUFBQSxNQUd0QkMsb0JBSHNCLFFBR3RCQSxvQkFIc0I7QUFBQSxNQUl0QkMsZUFKc0IsUUFJdEJBLGVBSnNCO0FBQUEsU0FNdEI7QUFBQTtBQUFBO0FBQ0U7QUFDRSxjQUFRSCxPQUFPSSxNQURqQjtBQUVFLGFBQU9KLE9BQU9LLEtBRmhCO0FBR0UsZ0JBQVVMLE9BQU9NLFFBSG5CO0FBSUUsaUJBQVdOLE9BQU9PLFNBSnBCO0FBS0UsWUFBTVAsT0FBT1EsSUFMZjtBQU1FLGFBQU9SLE9BQU9TLEtBTmhCO0FBT0UsaUJBQVdULE9BQU9VLFFBQVAsR0FBa0JWLE9BQU9XLGlCQUF6QixHQUE2Q1gsT0FBT1ksU0FQakU7QUFRRSxnQkFBVVgsU0FSWjtBQVNFLHVCQUFpQkUsZUFUbkI7QUFVRSxvQkFBYyxDQUFDRCxvQkFBRCxJQUF5QkYsT0FBT2EsV0FWaEQ7QUFXRSxrQkFBWWIsT0FBT1U7QUFYckI7QUFERixHQU5zQjtBQUFBLENBQXhCOztrQkF1QmVYLGUiLCJmaWxlIjoidGltZS1yYW5nZS1maWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFRpbWVSYW5nZVNsaWRlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi90aW1lLXJhbmdlLXNsaWRlcic7XG5cbmNvbnN0IFRpbWVSYW5nZUZpbHRlciA9ICh7XG4gIGZpbHRlcixcbiAgc2V0RmlsdGVyLFxuICBpc0FueUZpbHRlckFuaW1hdGluZyxcbiAgdG9nZ2xlQW5pbWF0aW9uXG59KSA9PiAoXG4gIDxkaXY+XG4gICAgPFRpbWVSYW5nZVNsaWRlclxuICAgICAgZG9tYWluPXtmaWx0ZXIuZG9tYWlufVxuICAgICAgdmFsdWU9e2ZpbHRlci52YWx1ZX1cbiAgICAgIHBsb3RUeXBlPXtmaWx0ZXIucGxvdFR5cGV9XG4gICAgICBsaW5lQ2hhcnQ9e2ZpbHRlci5saW5lQ2hhcnR9XG4gICAgICBzdGVwPXtmaWx0ZXIuc3RlcH1cbiAgICAgIHNwZWVkPXtmaWx0ZXIuc3BlZWR9XG4gICAgICBoaXN0b2dyYW09e2ZpbHRlci5lbmxhcmdlZCA/IGZpbHRlci5lbmxhcmdlZEhpc3RvZ3JhbSA6IGZpbHRlci5oaXN0b2dyYW19XG4gICAgICBvbkNoYW5nZT17c2V0RmlsdGVyfVxuICAgICAgdG9nZ2xlQW5pbWF0aW9uPXt0b2dnbGVBbmltYXRpb259XG4gICAgICBpc0FuaW1hdGFibGU9eyFpc0FueUZpbHRlckFuaW1hdGluZyB8fCBmaWx0ZXIuaXNBbmltYXRpbmd9XG4gICAgICBpc0VubGFyZ2VkPXtmaWx0ZXIuZW5sYXJnZWR9XG4gICAgLz5cbiAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBUaW1lUmFuZ2VGaWx0ZXI7XG4iXX0=