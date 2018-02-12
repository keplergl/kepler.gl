'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rangeSlider = require('../common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RangeFilter = function RangeFilter(_ref) {
  var filter = _ref.filter,
      setFilter = _ref.setFilter;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_rangeSlider2.default, {
      range: filter.domain,
      value0: filter.value[0],
      value1: filter.value[1],
      step: filter.step,
      histogram: filter.histogram,
      isEnlarged: filter.isEnlarged,
      onChange: setFilter,
      inputTheme: 'secondary'
    })
  );
};

exports.default = RangeFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvcmFuZ2UtZmlsdGVyLmpzIl0sIm5hbWVzIjpbIlJhbmdlRmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwiZG9tYWluIiwidmFsdWUiLCJzdGVwIiwiaGlzdG9ncmFtIiwiaXNFbmxhcmdlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsY0FBYyxTQUFkQSxXQUFjO0FBQUEsTUFBRUMsTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUMsU0FBVixRQUFVQSxTQUFWO0FBQUEsU0FDbEI7QUFBQTtBQUFBO0FBQ0U7QUFDRSxhQUFPRCxPQUFPRSxNQURoQjtBQUVFLGNBQVFGLE9BQU9HLEtBQVAsQ0FBYSxDQUFiLENBRlY7QUFHRSxjQUFRSCxPQUFPRyxLQUFQLENBQWEsQ0FBYixDQUhWO0FBSUUsWUFBTUgsT0FBT0ksSUFKZjtBQUtFLGlCQUFXSixPQUFPSyxTQUxwQjtBQU1FLGtCQUFZTCxPQUFPTSxVQU5yQjtBQU9FLGdCQUFVTCxTQVBaO0FBUUUsa0JBQVc7QUFSYjtBQURGLEdBRGtCO0FBQUEsQ0FBcEI7O2tCQWVlRixXIiwiZmlsZSI6InJhbmdlLWZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmFuZ2VTbGlkZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vcmFuZ2Utc2xpZGVyJztcblxuY29uc3QgUmFuZ2VGaWx0ZXIgPSAoe2ZpbHRlciwgc2V0RmlsdGVyfSkgPT4gKFxuICA8ZGl2PlxuICAgIDxSYW5nZVNsaWRlclxuICAgICAgcmFuZ2U9e2ZpbHRlci5kb21haW59XG4gICAgICB2YWx1ZTA9e2ZpbHRlci52YWx1ZVswXX1cbiAgICAgIHZhbHVlMT17ZmlsdGVyLnZhbHVlWzFdfVxuICAgICAgc3RlcD17ZmlsdGVyLnN0ZXB9XG4gICAgICBoaXN0b2dyYW09e2ZpbHRlci5oaXN0b2dyYW19XG4gICAgICBpc0VubGFyZ2VkPXtmaWx0ZXIuaXNFbmxhcmdlZH1cbiAgICAgIG9uQ2hhbmdlPXtzZXRGaWx0ZXJ9XG4gICAgICBpbnB1dFRoZW1lPVwic2Vjb25kYXJ5XCJcbiAgICAvPlxuICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFJhbmdlRmlsdGVyO1xuIl19