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
      isEnlarged: filter.enlarged })
  );
};

exports.default = TimeRangeFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS1yYW5nZS1maWx0ZXIuanMiXSwibmFtZXMiOlsiVGltZVJhbmdlRmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJ0b2dnbGVBbmltYXRpb24iLCJkb21haW4iLCJ2YWx1ZSIsInBsb3RUeXBlIiwibGluZUNoYXJ0Iiwic3RlcCIsImVubGFyZ2VkIiwiZW5sYXJnZWRIaXN0b2dyYW0iLCJoaXN0b2dyYW0iLCJpc0FuaW1hdGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLE1BQUVDLE1BQUYsUUFBRUEsTUFBRjtBQUFBLE1BQVVDLFNBQVYsUUFBVUEsU0FBVjtBQUFBLE1BQXFCQyxvQkFBckIsUUFBcUJBLG9CQUFyQjtBQUFBLE1BQTJDQyxlQUEzQyxRQUEyQ0EsZUFBM0M7QUFBQSxTQUN0QjtBQUFBO0FBQUE7QUFDRTtBQUNFLGNBQVFILE9BQU9JLE1BRGpCO0FBRUUsYUFBT0osT0FBT0ssS0FGaEI7QUFHRSxnQkFBVUwsT0FBT00sUUFIbkI7QUFJRSxpQkFBV04sT0FBT08sU0FKcEI7QUFLRSxZQUFNUCxPQUFPUSxJQUxmO0FBTUUsaUJBQVdSLE9BQU9TLFFBQVAsR0FBa0JULE9BQU9VLGlCQUF6QixHQUE2Q1YsT0FBT1csU0FOakU7QUFPRSxnQkFBVVYsU0FQWjtBQVFFLHVCQUFpQkUsZUFSbkI7QUFTRSxvQkFBYyxDQUFDRCxvQkFBRCxJQUF5QkYsT0FBT1ksV0FUaEQ7QUFVRSxrQkFBWVosT0FBT1MsUUFWckI7QUFERixHQURzQjtBQUFBLENBQXhCOztrQkFnQmVWLGUiLCJmaWxlIjoidGltZS1yYW5nZS1maWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFRpbWVSYW5nZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbW1vbi90aW1lLXJhbmdlLXNsaWRlcic7XG5cbmNvbnN0IFRpbWVSYW5nZUZpbHRlciA9ICh7ZmlsdGVyLCBzZXRGaWx0ZXIsIGlzQW55RmlsdGVyQW5pbWF0aW5nLCB0b2dnbGVBbmltYXRpb259KSA9PiAoXG4gIDxkaXY+XG4gICAgPFRpbWVSYW5nZVNsaWRlclxuICAgICAgZG9tYWluPXtmaWx0ZXIuZG9tYWlufVxuICAgICAgdmFsdWU9e2ZpbHRlci52YWx1ZX1cbiAgICAgIHBsb3RUeXBlPXtmaWx0ZXIucGxvdFR5cGV9XG4gICAgICBsaW5lQ2hhcnQ9e2ZpbHRlci5saW5lQ2hhcnR9XG4gICAgICBzdGVwPXtmaWx0ZXIuc3RlcH1cbiAgICAgIGhpc3RvZ3JhbT17ZmlsdGVyLmVubGFyZ2VkID8gZmlsdGVyLmVubGFyZ2VkSGlzdG9ncmFtIDogZmlsdGVyLmhpc3RvZ3JhbX1cbiAgICAgIG9uQ2hhbmdlPXtzZXRGaWx0ZXJ9XG4gICAgICB0b2dnbGVBbmltYXRpb249e3RvZ2dsZUFuaW1hdGlvbn1cbiAgICAgIGlzQW5pbWF0YWJsZT17IWlzQW55RmlsdGVyQW5pbWF0aW5nIHx8IGZpbHRlci5pc0FuaW1hdGluZ31cbiAgICAgIGlzRW5sYXJnZWQ9e2ZpbHRlci5lbmxhcmdlZH0vPlxuICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVSYW5nZUZpbHRlcjtcbiJdfQ==