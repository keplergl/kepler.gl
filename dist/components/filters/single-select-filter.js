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
      onChange: setFilter })
  );
};

exports.default = SingleSelectFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvc2luZ2xlLXNlbGVjdC1maWx0ZXIuanMiXSwibmFtZXMiOlsiU2luZ2xlU2VsZWN0RmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwidmFsdWUiLCJkb21haW4iLCJTdHJpbmciLCJkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsU0FBckJBLGtCQUFxQjtBQUFBLE1BQUVDLE1BQUYsUUFBRUEsTUFBRjtBQUFBLE1BQVVDLFNBQVYsUUFBVUEsU0FBVjtBQUFBLFNBQ3pCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UscUJBQWVELE9BQU9FLEtBRHhCO0FBRUUsbUJBQVksZ0JBRmQ7QUFHRSxlQUFTRixPQUFPRyxNQUhsQjtBQUlFLG1CQUFhLEtBSmY7QUFLRSxrQkFBWSxLQUxkO0FBTUUscUJBQWU7QUFBQSxlQUFLQyxPQUFPQyxDQUFQLENBQUw7QUFBQSxPQU5qQjtBQU9FLHNCQUFnQjtBQUFBLGVBQUtBLENBQUw7QUFBQSxPQVBsQjtBQVFFLGdCQUFVSixTQVJaO0FBRkYsR0FEeUI7QUFBQSxDQUEzQjs7a0JBZWVGLGtCIiwiZmlsZSI6InNpbmdsZS1zZWxlY3QtZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnLi4vY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5pbXBvcnQge1BhbmVsTGFiZWwsIFNpZGVQYW5lbFNlY3Rpb259IGZyb20gJy4uL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IFNpbmdsZVNlbGVjdEZpbHRlciA9ICh7ZmlsdGVyLCBzZXRGaWx0ZXJ9KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgIDxQYW5lbExhYmVsPlZhbHVlIGVxdWFsczwvUGFuZWxMYWJlbD5cbiAgICA8SXRlbVNlbGVjdG9yXG4gICAgICBzZWxlY3RlZEl0ZW1zPXtmaWx0ZXIudmFsdWV9XG4gICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBhIFZhbHVlXCJcbiAgICAgIG9wdGlvbnM9e2ZpbHRlci5kb21haW59XG4gICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICBzZWFyY2hhYmxlPXtmYWxzZX1cbiAgICAgIGRpc3BsYXlPcHRpb249e2QgPT4gU3RyaW5nKGQpfVxuICAgICAgZ2V0T3B0aW9uVmFsdWU9e2QgPT4gZH1cbiAgICAgIG9uQ2hhbmdlPXtzZXRGaWx0ZXJ9Lz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgU2luZ2xlU2VsZWN0RmlsdGVyO1xuIl19