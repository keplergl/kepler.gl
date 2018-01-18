'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rangeSlider = require('../../components/common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RangeFilter = function RangeFilter(_ref) {
  var filter = _ref.filter,
      setFilter = _ref.setFilter,
      width = _ref.width;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_rangeSlider2.default, {
      minValue: filter.domain[0],
      maxValue: filter.domain[1],
      value0: filter.value[0],
      value1: filter.value[1],
      step: filter.step,
      histogram: filter.histogram,
      isEnlarged: filter.isEnlarged,
      isRanged: true,
      showInput: true,
      onChange: setFilter,
      width: width
    })
  );
};

exports.default = RangeFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvcmFuZ2UtZmlsdGVyLmpzIl0sIm5hbWVzIjpbIlJhbmdlRmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwid2lkdGgiLCJkb21haW4iLCJ2YWx1ZSIsInN0ZXAiLCJoaXN0b2dyYW0iLCJpc0VubGFyZ2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxjQUFjLFNBQWRBLFdBQWM7QUFBQSxNQUFFQyxNQUFGLFFBQUVBLE1BQUY7QUFBQSxNQUFVQyxTQUFWLFFBQVVBLFNBQVY7QUFBQSxNQUFxQkMsS0FBckIsUUFBcUJBLEtBQXJCO0FBQUEsU0FDbEI7QUFBQTtBQUFBO0FBQ0U7QUFDRSxnQkFBVUYsT0FBT0csTUFBUCxDQUFjLENBQWQsQ0FEWjtBQUVFLGdCQUFVSCxPQUFPRyxNQUFQLENBQWMsQ0FBZCxDQUZaO0FBR0UsY0FBUUgsT0FBT0ksS0FBUCxDQUFhLENBQWIsQ0FIVjtBQUlFLGNBQVFKLE9BQU9JLEtBQVAsQ0FBYSxDQUFiLENBSlY7QUFLRSxZQUFNSixPQUFPSyxJQUxmO0FBTUUsaUJBQVdMLE9BQU9NLFNBTnBCO0FBT0Usa0JBQVlOLE9BQU9PLFVBUHJCO0FBUUUsZ0JBQVUsSUFSWjtBQVNFLGlCQUFXLElBVGI7QUFVRSxnQkFBVU4sU0FWWjtBQVdFLGFBQU9DO0FBWFQ7QUFERixHQURrQjtBQUFBLENBQXBCOztrQkFrQmVILFciLCJmaWxlIjoicmFuZ2UtZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29tbW9uL3JhbmdlLXNsaWRlcic7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IFJhbmdlRmlsdGVyID0gKHtmaWx0ZXIsIHNldEZpbHRlciwgd2lkdGh9KSA9PiAoXG4gIDxkaXY+XG4gICAgPFJhbmdlU2xpZGVyXG4gICAgICBtaW5WYWx1ZT17ZmlsdGVyLmRvbWFpblswXX1cbiAgICAgIG1heFZhbHVlPXtmaWx0ZXIuZG9tYWluWzFdfVxuICAgICAgdmFsdWUwPXtmaWx0ZXIudmFsdWVbMF19XG4gICAgICB2YWx1ZTE9e2ZpbHRlci52YWx1ZVsxXX1cbiAgICAgIHN0ZXA9e2ZpbHRlci5zdGVwfVxuICAgICAgaGlzdG9ncmFtPXtmaWx0ZXIuaGlzdG9ncmFtfVxuICAgICAgaXNFbmxhcmdlZD17ZmlsdGVyLmlzRW5sYXJnZWR9XG4gICAgICBpc1JhbmdlZD17dHJ1ZX1cbiAgICAgIHNob3dJbnB1dD17dHJ1ZX1cbiAgICAgIG9uQ2hhbmdlPXtzZXRGaWx0ZXJ9XG4gICAgICB3aWR0aD17d2lkdGh9XG4gICAgLz5cbiAgPC9kaXY+XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBSYW5nZUZpbHRlcjtcbiJdfQ==