'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reselect = require('reselect');

var _itemSelector = require('./item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _fieldToken = require('../common/field-token');

var _fieldToken2 = _interopRequireDefault(_fieldToken);

var _dropdownList = require('./item-selector/dropdown-list');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultDisplayOption = function defaultDisplayOption(d) {
  return d.name;
};
// custom list Item
var FieldListItem = function FieldListItem(_ref) {
  var value = _ref.value,
      _ref$displayOption = _ref.displayOption,
      displayOption = _ref$displayOption === undefined ? defaultDisplayOption : _ref$displayOption;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { style: { display: 'inline-block', margin: '0 4px 0 0' } },
      _react2.default.createElement(_fieldToken2.default, { type: value.type })
    ),
    _react2.default.createElement(
      'span',
      { className: _dropdownList.classList.listItemAnchor },
      displayOption(value)
    )
  );
};

var propTypes = {
  fields: _react2.default.PropTypes.array.isRequired,
  onSelect: _react2.default.PropTypes.func.isRequired,
  placement: _react2.default.PropTypes.string,
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.string]),
  filterFieldTypes: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.string]),
  erasable: _react2.default.PropTypes.bool,
  error: _react2.default.PropTypes.bool,
  multiSelect: _react2.default.PropTypes.bool,
  closeOnSelect: _react2.default.PropTypes.bool,
  suggested: _react2.default.PropTypes.array
};

var defaultProps = {
  erasable: true,
  error: false,
  fields: [],
  onSelect: function onSelect() {},
  placement: 'bottom',
  value: null,
  multiSelect: false,
  closeOnSelect: true
};

var SuggestedFieldHeader = function SuggestedFieldHeader() {
  return _react2.default.createElement(
    'div',
    null,
    'Suggested Field'
  );
};

var FieldSelector = function (_Component) {
  (0, _inherits3.default)(FieldSelector, _Component);

  function FieldSelector() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FieldSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.fieldsSelector = function (props) {
      return props.fields;
    }, _this.valueSelector = function (props) {
      return props.value;
    }, _this.filterFieldTypesSelector = function (props) {
      return props.filterFieldTypes;
    }, _this.selectedItemsSelector = (0, _reselect.createSelector)(_this.fieldsSelector, _this.valueSelector, function (fields, value) {
      return fields.filter(function (f) {
        return (Array.isArray(value) ? value : [value]).includes(defaultDisplayOption(f));
      });
    }), _this.fieldOptionsSelector = (0, _reselect.createSelector)(_this.fieldsSelector, _this.filterFieldTypesSelector, function (fields, filterFieldTypes) {
      if (!filterFieldTypes) {
        return fields;
      }
      var filters = Array.isArray(filterFieldTypes) ? filterFieldTypes : [filterFieldTypes];
      return fields.filter(function (f) {
        return filters.includes(f.type);
      });
    }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  FieldSelector.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_itemSelector2.default, {
        getOptionValue: function getOptionValue(d) {
          return d;
        },
        closeOnSelect: this.props.closeOnSelect,
        displayOption: defaultDisplayOption,
        filterOption: 'id',
        fixedOptions: this.props.suggested,
        isError: this.props.error,
        selectedItems: this.selectedItemsSelector(this.props),
        erasable: this.props.erasable,
        options: this.fieldOptionsSelector(this.props),
        multiSelect: this.props.multiSelect,
        placeholder: 'Select a field',
        placement: this.props.placement,
        onChange: this.props.onSelect,
        DropDownLineItemRenderComponent: FieldListItem,
        DropdownHeaderComponent: this.props.suggested ? SuggestedFieldHeader : null
      })
    );
  };

  return FieldSelector;
}(_react.Component);

exports.default = FieldSelector;


FieldSelector.propTypes = propTypes;
FieldSelector.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0RGlzcGxheU9wdGlvbiIsImQiLCJuYW1lIiwiRmllbGRMaXN0SXRlbSIsInZhbHVlIiwiZGlzcGxheU9wdGlvbiIsImRpc3BsYXkiLCJtYXJnaW4iLCJ0eXBlIiwibGlzdEl0ZW1BbmNob3IiLCJwcm9wVHlwZXMiLCJmaWVsZHMiLCJQcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJvblNlbGVjdCIsImZ1bmMiLCJwbGFjZW1lbnQiLCJzdHJpbmciLCJvbmVPZlR5cGUiLCJmaWx0ZXJGaWVsZFR5cGVzIiwiZXJhc2FibGUiLCJib29sIiwiZXJyb3IiLCJtdWx0aVNlbGVjdCIsImNsb3NlT25TZWxlY3QiLCJzdWdnZXN0ZWQiLCJkZWZhdWx0UHJvcHMiLCJTdWdnZXN0ZWRGaWVsZEhlYWRlciIsIkZpZWxkU2VsZWN0b3IiLCJmaWVsZHNTZWxlY3RvciIsInByb3BzIiwidmFsdWVTZWxlY3RvciIsImZpbHRlckZpZWxkVHlwZXNTZWxlY3RvciIsInNlbGVjdGVkSXRlbXNTZWxlY3RvciIsImZpbHRlciIsIkFycmF5IiwiaXNBcnJheSIsImluY2x1ZGVzIiwiZiIsImZpZWxkT3B0aW9uc1NlbGVjdG9yIiwiZmlsdGVycyIsInJlbmRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsdUJBQXVCLFNBQXZCQSxvQkFBdUI7QUFBQSxTQUFLQyxFQUFFQyxJQUFQO0FBQUEsQ0FBN0I7QUFDQTtBQUNBLElBQU1DLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxnQ0FBU0MsYUFBVDtBQUFBLE1BQVNBLGFBQVQsc0NBQXlCTCxvQkFBekI7QUFBQSxTQUNwQjtBQUFBO0FBQUE7QUFDRTtBQUFB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QWdCO0FBQUEsaUJBQUt6QyxDQUFMO0FBQUEsU0FEbEI7QUFFRSx1QkFBZSxLQUFLOEIsS0FBTCxDQUFXTixhQUY1QjtBQUdFLHVCQUFlekIsb0JBSGpCO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxzQkFBYyxLQUFLK0IsS0FBTCxDQUFXTCxTQUwzQjtBQU1FLGlCQUFTLEtBQUtLLEtBQUwsQ0FBV1IsS0FOdEI7QUFPRSx1QkFBZSxLQUFLVyxxQkFBTCxDQUEyQixLQUFLSCxLQUFoQyxDQVBqQjtBQVFFLGtCQUFVLEtBQUtBLEtBQUwsQ0FBV1YsUUFSdkI7QUFTRSxpQkFBUyxLQUFLbUIsb0JBQUwsQ0FBMEIsS0FBS1QsS0FBL0IsQ0FUWDtBQVVFLHFCQUFhLEtBQUtBLEtBQUwsQ0FBV1AsV0FWMUI7QUFXRSxxQkFBYSxnQkFYZjtBQVlFLG1CQUFXLEtBQUtPLEtBQUwsQ0FBV2QsU0FaeEI7QUFhRSxrQkFBVSxLQUFLYyxLQUFMLENBQVdoQixRQWJ2QjtBQWNFLHlDQUFpQ1osYUFkbkM7QUFlRSxpQ0FBeUIsS0FBSzRCLEtBQUwsQ0FBV0wsU0FBWCxHQUF1QkUsb0JBQXZCLEdBQThDO0FBZnpFO0FBREYsS0FERjtBQXFCRCxHOzs7OztrQkEvQ2tCQyxhOzs7QUFrRHJCQSxjQUFjbkIsU0FBZCxHQUEwQkEsU0FBMUI7QUFDQW1CLGNBQWNGLFlBQWQsR0FBNkJBLFlBQTdCIiwiZmlsZSI6ImZpZWxkLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnLi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IEZpZWxkVG9rZW4gZnJvbSAnLi4vY29tbW9uL2ZpZWxkLXRva2VuJztcbmltcG9ydCB7Y2xhc3NMaXN0fSBmcm9tICcuL2l0ZW0tc2VsZWN0b3IvZHJvcGRvd24tbGlzdCc7XG5cbmNvbnN0IGRlZmF1bHREaXNwbGF5T3B0aW9uID0gZCA9PiBkLm5hbWU7XG4vLyBjdXN0b20gbGlzdCBJdGVtXG5jb25zdCBGaWVsZExpc3RJdGVtID0gKHt2YWx1ZSwgZGlzcGxheU9wdGlvbiA9IGRlZmF1bHREaXNwbGF5T3B0aW9ufSkgPT4gKFxuICA8ZGl2PlxuICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgbWFyZ2luOiAnMCA0cHggMCAwJ319PlxuICAgICAgPEZpZWxkVG9rZW4gdHlwZT17dmFsdWUudHlwZX0vPlxuICAgIDwvZGl2PlxuICAgIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3RJdGVtQW5jaG9yfT57ZGlzcGxheU9wdGlvbih2YWx1ZSl9PC9zcGFuPlxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZmllbGRzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgb25TZWxlY3Q6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHBsYWNlbWVudDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIF0pLFxuICBmaWx0ZXJGaWVsZFR5cGVzOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICBdKSxcbiAgZXJhc2FibGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBlcnJvcjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIG11bHRpU2VsZWN0OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgY2xvc2VPblNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIHN1Z2dlc3RlZDogUmVhY3QuUHJvcFR5cGVzLmFycmF5XG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGVyYXNhYmxlOiB0cnVlLFxuICBlcnJvcjogZmFsc2UsXG4gIGZpZWxkczogW10sXG4gIG9uU2VsZWN0OiAoKSA9PiB7fSxcbiAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgdmFsdWU6IG51bGwsXG4gIG11bHRpU2VsZWN0OiBmYWxzZSxcbiAgY2xvc2VPblNlbGVjdDogdHJ1ZVxufTtcblxuY29uc3QgU3VnZ2VzdGVkRmllbGRIZWFkZXIgPSAoKSA9PiA8ZGl2PlN1Z2dlc3RlZCBGaWVsZDwvZGl2PjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmllbGRTZWxlY3RvciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGZpZWxkc1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmllbGRzO1xuICB2YWx1ZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMudmFsdWU7XG4gIGZpbHRlckZpZWxkVHlwZXNTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlckZpZWxkVHlwZXM7XG5cbiAgc2VsZWN0ZWRJdGVtc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5maWVsZHNTZWxlY3RvcixcbiAgICB0aGlzLnZhbHVlU2VsZWN0b3IsXG4gICAgKGZpZWxkcywgdmFsdWUpID0+IGZpZWxkcy5maWx0ZXIoZiA9PlxuICAgICAgKEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdKVxuICAgICAgLmluY2x1ZGVzKGRlZmF1bHREaXNwbGF5T3B0aW9uKGYpKSlcbiAgKTtcblxuICBmaWVsZE9wdGlvbnNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZmllbGRzU2VsZWN0b3IsXG4gICAgdGhpcy5maWx0ZXJGaWVsZFR5cGVzU2VsZWN0b3IsXG4gICAgKGZpZWxkcywgZmlsdGVyRmllbGRUeXBlcykgPT4ge1xuICAgICAgaWYgKCFmaWx0ZXJGaWVsZFR5cGVzKSB7XG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXJzID0gQXJyYXkuaXNBcnJheShmaWx0ZXJGaWVsZFR5cGVzKSA/IGZpbHRlckZpZWxkVHlwZXMgOiBbZmlsdGVyRmllbGRUeXBlc107XG4gICAgICByZXR1cm4gZmllbGRzLmZpbHRlcihmID0+IGZpbHRlcnMuaW5jbHVkZXMoZi50eXBlKSk7XG4gICAgfVxuICApO1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEl0ZW1TZWxlY3RvclxuICAgICAgICAgIGdldE9wdGlvblZhbHVlPXtkID0+IGR9XG4gICAgICAgICAgY2xvc2VPblNlbGVjdD17dGhpcy5wcm9wcy5jbG9zZU9uU2VsZWN0fVxuICAgICAgICAgIGRpc3BsYXlPcHRpb249e2RlZmF1bHREaXNwbGF5T3B0aW9ufVxuICAgICAgICAgIGZpbHRlck9wdGlvbj17J2lkJ31cbiAgICAgICAgICBmaXhlZE9wdGlvbnM9e3RoaXMucHJvcHMuc3VnZ2VzdGVkfVxuICAgICAgICAgIGlzRXJyb3I9e3RoaXMucHJvcHMuZXJyb3J9XG4gICAgICAgICAgc2VsZWN0ZWRJdGVtcz17dGhpcy5zZWxlY3RlZEl0ZW1zU2VsZWN0b3IodGhpcy5wcm9wcyl9XG4gICAgICAgICAgZXJhc2FibGU9e3RoaXMucHJvcHMuZXJhc2FibGV9XG4gICAgICAgICAgb3B0aW9ucz17dGhpcy5maWVsZE9wdGlvbnNTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICBtdWx0aVNlbGVjdD17dGhpcy5wcm9wcy5tdWx0aVNlbGVjdH1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17J1NlbGVjdCBhIGZpZWxkJ31cbiAgICAgICAgICBwbGFjZW1lbnQ9e3RoaXMucHJvcHMucGxhY2VtZW50fVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnByb3BzLm9uU2VsZWN0fVxuICAgICAgICAgIERyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQ9e0ZpZWxkTGlzdEl0ZW19XG4gICAgICAgICAgRHJvcGRvd25IZWFkZXJDb21wb25lbnQ9e3RoaXMucHJvcHMuc3VnZ2VzdGVkID8gU3VnZ2VzdGVkRmllbGRIZWFkZXIgOiBudWxsfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5GaWVsZFNlbGVjdG9yLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkZpZWxkU2VsZWN0b3IuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19