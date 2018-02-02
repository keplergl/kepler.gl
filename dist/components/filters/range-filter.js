'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rangeSlider = require('../../components/common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

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
      onChange: setFilter,
      width: width,
      isRanged: true,
      showInput: true,
      inputTheme: 'secondary'
    })
  );
};

exports.default = RangeFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvcmFuZ2UtZmlsdGVyLmpzIl0sIm5hbWVzIjpbIlJhbmdlRmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwid2lkdGgiLCJkb21haW4iLCJ2YWx1ZSIsInN0ZXAiLCJoaXN0b2dyYW0iLCJpc0VubGFyZ2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxjQUFjLFNBQWRBLFdBQWM7QUFBQSxNQUFFQyxNQUFGLFFBQUVBLE1BQUY7QUFBQSxNQUFVQyxTQUFWLFFBQVVBLFNBQVY7QUFBQSxNQUFxQkMsS0FBckIsUUFBcUJBLEtBQXJCO0FBQUEsU0FDbEI7QUFBQTtBQUFBO0FBQ0U7QUFDRSxnQkFBVUYsT0FBT0csTUFBUCxDQUFjLENBQWQsQ0FEWjtBQUVFLGdCQUFVSCxPQUFPRyxNQUFQLENBQWMsQ0FBZCxDQUZaO0FBR0UsY0FBUUgsT0FBT0ksS0FBUCxDQUFhLENBQWIsQ0FIVjtBQUlFLGNBQVFKLE9BQU9JLEtBQVAsQ0FBYSxDQUFiLENBSlY7QUFLRSxZQUFNSixPQUFPSyxJQUxmO0FBTUUsaUJBQVdMLE9BQU9NLFNBTnBCO0FBT0Usa0JBQVlOLE9BQU9PLFVBUHJCO0FBUUUsZ0JBQVVOLFNBUlo7QUFTRSxhQUFPQyxLQVRUO0FBVUUsb0JBVkY7QUFXRSxxQkFYRjtBQVlFLGtCQUFXO0FBWmI7QUFERixHQURrQjtBQUFBLENBQXBCOztrQkFtQmVILFciLCJmaWxlIjoicmFuZ2UtZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuLi8uLi9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXInO1xuXG5jb25zdCBSYW5nZUZpbHRlciA9ICh7ZmlsdGVyLCBzZXRGaWx0ZXIsIHdpZHRofSkgPT4gKFxuICA8ZGl2PlxuICAgIDxSYW5nZVNsaWRlclxuICAgICAgbWluVmFsdWU9e2ZpbHRlci5kb21haW5bMF19XG4gICAgICBtYXhWYWx1ZT17ZmlsdGVyLmRvbWFpblsxXX1cbiAgICAgIHZhbHVlMD17ZmlsdGVyLnZhbHVlWzBdfVxuICAgICAgdmFsdWUxPXtmaWx0ZXIudmFsdWVbMV19XG4gICAgICBzdGVwPXtmaWx0ZXIuc3RlcH1cbiAgICAgIGhpc3RvZ3JhbT17ZmlsdGVyLmhpc3RvZ3JhbX1cbiAgICAgIGlzRW5sYXJnZWQ9e2ZpbHRlci5pc0VubGFyZ2VkfVxuICAgICAgb25DaGFuZ2U9e3NldEZpbHRlcn1cbiAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgIGlzUmFuZ2VkXG4gICAgICBzaG93SW5wdXRcbiAgICAgIGlucHV0VGhlbWU9XCJzZWNvbmRhcnlcIlxuICAgIC8+XG4gIDwvZGl2PlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgUmFuZ2VGaWx0ZXI7XG4iXX0=