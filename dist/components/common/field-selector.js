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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0RGlzcGxheU9wdGlvbiIsImQiLCJuYW1lIiwiRmllbGRMaXN0SXRlbSIsInZhbHVlIiwiZGlzcGxheU9wdGlvbiIsImRpc3BsYXkiLCJtYXJnaW4iLCJ0eXBlIiwibGlzdEl0ZW1BbmNob3IiLCJwcm9wVHlwZXMiLCJmaWVsZHMiLCJQcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJvblNlbGVjdCIsImZ1bmMiLCJwbGFjZW1lbnQiLCJzdHJpbmciLCJvbmVPZlR5cGUiLCJmaWx0ZXJGaWVsZFR5cGVzIiwiZXJhc2FibGUiLCJib29sIiwiZXJyb3IiLCJtdWx0aVNlbGVjdCIsImNsb3NlT25TZWxlY3QiLCJzdWdnZXN0ZWQiLCJkZWZhdWx0UHJvcHMiLCJTdWdnZXN0ZWRGaWVsZEhlYWRlciIsIkZpZWxkU2VsZWN0b3IiLCJmaWVsZHNTZWxlY3RvciIsInByb3BzIiwidmFsdWVTZWxlY3RvciIsImZpbHRlckZpZWxkVHlwZXNTZWxlY3RvciIsInNlbGVjdGVkSXRlbXNTZWxlY3RvciIsImZpbHRlciIsIkFycmF5IiwiaXNBcnJheSIsImluY2x1ZGVzIiwiZiIsImZpZWxkT3B0aW9uc1NlbGVjdG9yIiwiZmlsdGVycyIsInJlbmRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsdUJBQXVCLFNBQXZCQSxvQkFBdUI7QUFBQSxTQUFLQyxFQUFFQyxJQUFQO0FBQUEsQ0FBN0I7QUFDQTtBQUNBLElBQU1DLGdCQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxnQ0FBU0MsYUFBVDtBQUFBLE1BQVNBLGFBQVQsc0NBQXlCTCxvQkFBekI7QUFBQSxTQUNwQjtBQUFBO0FBQUE7QUFDRTtBQUFB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QUEsaUJBQUt6QyxDQUFMO0FBQUEsU0FEbEI7QUFFRSx1QkFBZSxLQUFLOEIsS0FBTCxDQUFXTixhQUY1QjtBQUdFLHVCQUFlekIsb0JBSGpCO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxzQkFBYyxLQUFLK0IsS0FBTCxDQUFXTCxTQUwzQjtBQU1FLGlCQUFTLEtBQUtLLEtBQUwsQ0FBV1IsS0FOdEI7QUFPRSx1QkFBZSxLQUFLVyxxQkFBTCxDQUEyQixLQUFLSCxLQUFoQyxDQVBqQjtBQVFFLGtCQUFVLEtBQUtBLEtBQUwsQ0FBV1YsUUFSdkI7QUFTRSxpQkFBUyxLQUFLbUIsb0JBQUwsQ0FBMEIsS0FBS1QsS0FBL0IsQ0FUWDtBQVVFLHFCQUFhLEtBQUtBLEtBQUwsQ0FBV1AsV0FWMUI7QUFXRSxxQkFBYSxnQkFYZjtBQVlFLG1CQUFXLEtBQUtPLEtBQUwsQ0FBV2QsU0FaeEI7QUFhRSxrQkFBVSxLQUFLYyxLQUFMLENBQVdoQixRQWJ2QjtBQWNFLHlDQUFpQ1osYUFkbkM7QUFlRSxpQ0FDRSxLQUFLNEIsS0FBTCxDQUFXTCxTQUFYLEdBQXVCRSxvQkFBdkIsR0FBOEM7QUFoQmxEO0FBREYsS0FERjtBQXVCRCxHOzs7OztrQkF0RGtCQyxhOzs7QUF5RHJCQSxjQUFjbkIsU0FBZCxHQUEwQkEsU0FBMUI7QUFDQW1CLGNBQWNGLFlBQWQsR0FBNkJBLFlBQTdCIiwiZmlsZSI6ImZpZWxkLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnLi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IEZpZWxkVG9rZW4gZnJvbSAnLi4vY29tbW9uL2ZpZWxkLXRva2VuJztcbmltcG9ydCB7Y2xhc3NMaXN0fSBmcm9tICcuL2l0ZW0tc2VsZWN0b3IvZHJvcGRvd24tbGlzdCc7XG5cbmNvbnN0IGRlZmF1bHREaXNwbGF5T3B0aW9uID0gZCA9PiBkLm5hbWU7XG4vLyBjdXN0b20gbGlzdCBJdGVtXG5jb25zdCBGaWVsZExpc3RJdGVtID0gKHt2YWx1ZSwgZGlzcGxheU9wdGlvbiA9IGRlZmF1bHREaXNwbGF5T3B0aW9ufSkgPT4gKFxuICA8ZGl2PlxuICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgbWFyZ2luOiAnMCA0cHggMCAwJ319PlxuICAgICAgPEZpZWxkVG9rZW4gdHlwZT17dmFsdWUudHlwZX0gLz5cbiAgICA8L2Rpdj5cbiAgICA8c3BhbiBjbGFzc05hbWU9e2NsYXNzTGlzdC5saXN0SXRlbUFuY2hvcn0+e2Rpc3BsYXlPcHRpb24odmFsdWUpfTwvc3Bhbj5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGZpZWxkczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIG9uU2VsZWN0OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBwbGFjZW1lbnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICBdKSxcbiAgZmlsdGVyRmllbGRUeXBlczogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgXSksXG4gIGVyYXNhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3I6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBtdWx0aVNlbGVjdDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGNsb3NlT25TZWxlY3Q6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBzdWdnZXN0ZWQ6IFJlYWN0LlByb3BUeXBlcy5hcnJheVxufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBlcmFzYWJsZTogdHJ1ZSxcbiAgZXJyb3I6IGZhbHNlLFxuICBmaWVsZHM6IFtdLFxuICBvblNlbGVjdDogKCkgPT4ge30sXG4gIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gIHZhbHVlOiBudWxsLFxuICBtdWx0aVNlbGVjdDogZmFsc2UsXG4gIGNsb3NlT25TZWxlY3Q6IHRydWVcbn07XG5cbmNvbnN0IFN1Z2dlc3RlZEZpZWxkSGVhZGVyID0gKCkgPT4gPGRpdj5TdWdnZXN0ZWQgRmllbGQ8L2Rpdj47XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpZWxkU2VsZWN0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBmaWVsZHNTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpZWxkcztcbiAgdmFsdWVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnZhbHVlO1xuICBmaWx0ZXJGaWVsZFR5cGVzU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWx0ZXJGaWVsZFR5cGVzO1xuXG4gIHNlbGVjdGVkSXRlbXNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZmllbGRzU2VsZWN0b3IsXG4gICAgdGhpcy52YWx1ZVNlbGVjdG9yLFxuICAgIChmaWVsZHMsIHZhbHVlKSA9PlxuICAgICAgZmllbGRzLmZpbHRlcihmID0+XG4gICAgICAgIChBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXSkuaW5jbHVkZXMoXG4gICAgICAgICAgZGVmYXVsdERpc3BsYXlPcHRpb24oZilcbiAgICAgICAgKVxuICAgICAgKVxuICApO1xuXG4gIGZpZWxkT3B0aW9uc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5maWVsZHNTZWxlY3RvcixcbiAgICB0aGlzLmZpbHRlckZpZWxkVHlwZXNTZWxlY3RvcixcbiAgICAoZmllbGRzLCBmaWx0ZXJGaWVsZFR5cGVzKSA9PiB7XG4gICAgICBpZiAoIWZpbHRlckZpZWxkVHlwZXMpIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpbHRlcnMgPSBBcnJheS5pc0FycmF5KGZpbHRlckZpZWxkVHlwZXMpXG4gICAgICAgID8gZmlsdGVyRmllbGRUeXBlc1xuICAgICAgICA6IFtmaWx0ZXJGaWVsZFR5cGVzXTtcbiAgICAgIHJldHVybiBmaWVsZHMuZmlsdGVyKGYgPT4gZmlsdGVycy5pbmNsdWRlcyhmLnR5cGUpKTtcbiAgICB9XG4gICk7XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgZ2V0T3B0aW9uVmFsdWU9e2QgPT4gZH1cbiAgICAgICAgICBjbG9zZU9uU2VsZWN0PXt0aGlzLnByb3BzLmNsb3NlT25TZWxlY3R9XG4gICAgICAgICAgZGlzcGxheU9wdGlvbj17ZGVmYXVsdERpc3BsYXlPcHRpb259XG4gICAgICAgICAgZmlsdGVyT3B0aW9uPXsnaWQnfVxuICAgICAgICAgIGZpeGVkT3B0aW9ucz17dGhpcy5wcm9wcy5zdWdnZXN0ZWR9XG4gICAgICAgICAgaXNFcnJvcj17dGhpcy5wcm9wcy5lcnJvcn1cbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt0aGlzLnNlbGVjdGVkSXRlbXNTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICBlcmFzYWJsZT17dGhpcy5wcm9wcy5lcmFzYWJsZX1cbiAgICAgICAgICBvcHRpb25zPXt0aGlzLmZpZWxkT3B0aW9uc1NlbGVjdG9yKHRoaXMucHJvcHMpfVxuICAgICAgICAgIG11bHRpU2VsZWN0PXt0aGlzLnByb3BzLm11bHRpU2VsZWN0fVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXsnU2VsZWN0IGEgZmllbGQnfVxuICAgICAgICAgIHBsYWNlbWVudD17dGhpcy5wcm9wcy5wbGFjZW1lbnR9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25TZWxlY3R9XG4gICAgICAgICAgRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudD17RmllbGRMaXN0SXRlbX1cbiAgICAgICAgICBEcm9wZG93bkhlYWRlckNvbXBvbmVudD17XG4gICAgICAgICAgICB0aGlzLnByb3BzLnN1Z2dlc3RlZCA/IFN1Z2dlc3RlZEZpZWxkSGVhZGVyIDogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuRmllbGRTZWxlY3Rvci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5GaWVsZFNlbGVjdG9yLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==