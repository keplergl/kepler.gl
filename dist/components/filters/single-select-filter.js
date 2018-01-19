'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _itemSelector = require('../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _styledComponents = require('../common/styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SingleSelectFilter = function SingleSelectFilter(_ref) {
  var filter = _ref.filter,
      setFilter = _ref.setFilter;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      'Value equals'
    ),
    _react2.default.createElement(_itemSelector2.default, {
      selectedItems: filter.value,
      placeholder: 'Select a Value',
      options: filter.domain,
      multiSelect: false,
      searchable: false,
      displayOption: function displayOption(d) {
        return String(d);
      },
      getOptionValue: function getOptionValue(d) {
        return d;
      },
      onChange: setFilter
    })
  );
};

exports.default = SingleSelectFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvc2luZ2xlLXNlbGVjdC1maWx0ZXIuanMiXSwibmFtZXMiOlsiU2luZ2xlU2VsZWN0RmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwidmFsdWUiLCJkb21haW4iLCJTdHJpbmciLCJkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsU0FBckJBLGtCQUFxQjtBQUFBLE1BQUVDLE1BQUYsUUFBRUEsTUFBRjtBQUFBLE1BQVVDLFNBQVYsUUFBVUEsU0FBVjtBQUFBLFNBQ3pCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UscUJBQWVELE9BQU9FLEtBRHhCO0FBRUUsbUJBQVksZ0JBRmQ7QUFHRSxlQUFTRixPQUFPRyxNQUhsQjtBQUlFLG1CQUFhLEtBSmY7QUFLRSxrQkFBWSxLQUxkO0FBTUUscUJBQWU7QUFBQSxlQUFLQyxPQUFPQyxDQUFQLENBQUw7QUFBQSxPQU5qQjtBQU9FLHNCQUFnQjtBQUFBLGVBQUtBLENBQUw7QUFBQSxPQVBsQjtBQVFFLGdCQUFVSjtBQVJaO0FBRkYsR0FEeUI7QUFBQSxDQUEzQjs7a0JBZ0JlRixrQiIsImZpbGUiOiJzaW5nbGUtc2VsZWN0LWZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJy4uL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtQYW5lbExhYmVsLCBTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICcuLi9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBTaW5nbGVTZWxlY3RGaWx0ZXIgPSAoe2ZpbHRlciwgc2V0RmlsdGVyfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8UGFuZWxMYWJlbD5WYWx1ZSBlcXVhbHM8L1BhbmVsTGFiZWw+XG4gICAgPEl0ZW1TZWxlY3RvclxuICAgICAgc2VsZWN0ZWRJdGVtcz17ZmlsdGVyLnZhbHVlfVxuICAgICAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgYSBWYWx1ZVwiXG4gICAgICBvcHRpb25zPXtmaWx0ZXIuZG9tYWlufVxuICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgc2VhcmNoYWJsZT17ZmFsc2V9XG4gICAgICBkaXNwbGF5T3B0aW9uPXtkID0+IFN0cmluZyhkKX1cbiAgICAgIGdldE9wdGlvblZhbHVlPXtkID0+IGR9XG4gICAgICBvbkNoYW5nZT17c2V0RmlsdGVyfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFNpbmdsZVNlbGVjdEZpbHRlcjtcbiJdfQ==