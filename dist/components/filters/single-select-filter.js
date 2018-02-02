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
      onChange: setFilter,
      inputTheme: 'secondary'
    })
  );
};

exports.default = SingleSelectFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvc2luZ2xlLXNlbGVjdC1maWx0ZXIuanMiXSwibmFtZXMiOlsiU2luZ2xlU2VsZWN0RmlsdGVyIiwiZmlsdGVyIiwic2V0RmlsdGVyIiwidmFsdWUiLCJkb21haW4iLCJTdHJpbmciLCJkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsU0FBckJBLGtCQUFxQjtBQUFBLE1BQUVDLE1BQUYsUUFBRUEsTUFBRjtBQUFBLE1BQVVDLFNBQVYsUUFBVUEsU0FBVjtBQUFBLFNBQ3pCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UscUJBQWVELE9BQU9FLEtBRHhCO0FBRUUsbUJBQVksZ0JBRmQ7QUFHRSxlQUFTRixPQUFPRyxNQUhsQjtBQUlFLG1CQUFhLEtBSmY7QUFLRSxrQkFBWSxLQUxkO0FBTUUscUJBQWU7QUFBQSxlQUFLQyxPQUFPQyxDQUFQLENBQUw7QUFBQSxPQU5qQjtBQU9FLHNCQUFnQjtBQUFBLGVBQUtBLENBQUw7QUFBQSxPQVBsQjtBQVFFLGdCQUFVSixTQVJaO0FBU0Usa0JBQVc7QUFUYjtBQUZGLEdBRHlCO0FBQUEsQ0FBM0I7O2tCQWlCZUYsa0IiLCJmaWxlIjoic2luZ2xlLXNlbGVjdC1maWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICcuLi9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnLi4vY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgU2luZ2xlU2VsZWN0RmlsdGVyID0gKHtmaWx0ZXIsIHNldEZpbHRlcn0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPFBhbmVsTGFiZWw+VmFsdWUgZXF1YWxzPC9QYW5lbExhYmVsPlxuICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgIHNlbGVjdGVkSXRlbXM9e2ZpbHRlci52YWx1ZX1cbiAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IGEgVmFsdWVcIlxuICAgICAgb3B0aW9ucz17ZmlsdGVyLmRvbWFpbn1cbiAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgIHNlYXJjaGFibGU9e2ZhbHNlfVxuICAgICAgZGlzcGxheU9wdGlvbj17ZCA9PiBTdHJpbmcoZCl9XG4gICAgICBnZXRPcHRpb25WYWx1ZT17ZCA9PiBkfVxuICAgICAgb25DaGFuZ2U9e3NldEZpbHRlcn1cbiAgICAgIGlucHV0VGhlbWU9XCJzZWNvbmRhcnlcIlxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFNpbmdsZVNlbGVjdEZpbHRlcjtcbiJdfQ==