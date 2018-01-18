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

var MultiSelectFilter = function MultiSelectFilter(_ref) {
  var filter = _ref.filter,
      setFilter = _ref.setFilter;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      { htmlFor: 'filter-' + filter.id },
      'Values in'
    ),
    _react2.default.createElement(_itemSelector2.default, {
      options: filter.domain,
      selectedItems: filter.value,
      onChange: setFilter })
  );
};

exports.default = MultiSelectFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvbXVsdGktc2VsZWN0LWZpbHRlci5qcyJdLCJuYW1lcyI6WyJNdWx0aVNlbGVjdEZpbHRlciIsImZpbHRlciIsInNldEZpbHRlciIsImlkIiwiZG9tYWluIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLG9CQUFvQixTQUFwQkEsaUJBQW9CO0FBQUEsTUFBRUMsTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUMsU0FBVixRQUFVQSxTQUFWO0FBQUEsU0FDeEI7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFFBQVkscUJBQW1CRCxPQUFPRSxFQUF0QztBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UsZUFBU0YsT0FBT0csTUFEbEI7QUFFRSxxQkFBZUgsT0FBT0ksS0FGeEI7QUFHRSxnQkFBVUgsU0FIWjtBQUZGLEdBRHdCO0FBQUEsQ0FBMUI7O2tCQVVlRixpQiIsImZpbGUiOiJtdWx0aS1zZWxlY3QtZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnLi4vY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5pbXBvcnQge1BhbmVsTGFiZWx9IGZyb20gJy4uL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IE11bHRpU2VsZWN0RmlsdGVyID0gKHtmaWx0ZXIsIHNldEZpbHRlcn0pID0+IChcbiAgPGRpdj5cbiAgICA8UGFuZWxMYWJlbCBodG1sRm9yPXtgZmlsdGVyLSR7ZmlsdGVyLmlkfWB9PlZhbHVlcyBpbjwvUGFuZWxMYWJlbD5cbiAgICA8SXRlbVNlbGVjdG9yXG4gICAgICBvcHRpb25zPXtmaWx0ZXIuZG9tYWlufVxuICAgICAgc2VsZWN0ZWRJdGVtcz17ZmlsdGVyLnZhbHVlfVxuICAgICAgb25DaGFuZ2U9e3NldEZpbHRlcn0vPlxuICA8L2Rpdj5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IE11bHRpU2VsZWN0RmlsdGVyO1xuIl19