'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ';\n  \n  .list__item__anchor {\n    ', '\n  }\n'], ['\n  ', ';\n  \n  .list__item__anchor {\n    ', '\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n'], ['\n  color: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background: ', ';\n  border: 0;\n  width: 100%;\n  left: 0;\n  z-index: 100;\n  position: absolute;\n  bottom: ', ';\n  margin-top: ', ';\n  margin-bottom: ', ';\n'], ['\n  background: ', ';\n  border: 0;\n  width: 100%;\n  left: 0;\n  z-index: 100;\n  position: absolute;\n  bottom: ', ';\n  margin-top: ', ';\n  margin-bottom: ', ';\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _decorator = require('react-onclickoutside/decorator');

var _decorator2 = _interopRequireDefault(_decorator);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _accessor = require('./accessor');

var _accessor2 = _interopRequireDefault(_accessor);

var _chickletedInput = require('./chickleted-input');

var _chickletedInput2 = _interopRequireDefault(_chickletedInput);

var _typeahead = require('./typeahead');

var _typeahead2 = _interopRequireDefault(_typeahead);

var _icons = require('../icons');

var _dropdownList = require('./dropdown-list');

var _dropdownList2 = _interopRequireDefault(_dropdownList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Converts non-arrays to arrays.  Leaves arrays alone.  Converts
 * undefined values to empty arrays ([] instead of [undefined]).
 * Otherwise, just returns [item] for non-array items.
 *
 * @param {*} item
 * @returns {array} boom! much array. very indexed. so useful.
 */
function _toArray(item) {
  if (Array.isArray(item)) {
    return item;
  }

  if (typeof item === 'undefined' || item === null) {
    return [];
  }

  return [item];
}

var StyledDropdownSelect = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.input;
}, function (props) {
  return props.theme.dropdownListAnchor;
});

var DropdownSelectValue = _styledComponents2.default.span(_templateObject2, function (props) {
  return props.placeholder ? props.theme.selectColorPlaceHolder : props.theme.selectColor;
});

var DropdownWrapper = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.selectBackground;
}, function (props) {
  return props.placement === 'top' ? props.theme.inputBoxHeight : 'auto';
}, function (props) {
  return props.placement === 'bottom' ? '4px' : 'auto';
}, function (props) {
  return props.placement === 'top' ? '4px' : 'auto';
});

var propTypes = {
  // required properties
  selectedItems: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.string, _propTypes2.default.object, _propTypes2.default.bool]),
  onChange: _propTypes2.default.func.isRequired,
  options: _propTypes2.default.array.isRequired,

  // optional properties
  fixedOptions: _propTypes2.default.array,
  displayOption: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  getOptionValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  filterOption: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  placement: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  isError: _propTypes2.default.bool,
  multiSelect: _propTypes2.default.bool,
  onBlur: _propTypes2.default.func,
  placeholder: _propTypes2.default.string,
  closeOnSelect: _propTypes2.default.bool,
  DropdownHeaderComponent: _propTypes2.default.func,
  DropDownRenderComponent: _propTypes2.default.func,
  DropDownLineItemRenderComponent: _propTypes2.default.func
};

var defaultProps = {
  erasable: false,
  placement: 'bottom',
  selectedItems: [],
  displayOption: null,
  getOptionValue: null,
  filterOption: null,
  fixedOptions: null,
  multiSelect: true,
  placeholder: 'Enter a value',
  closeOnSelect: true,
  searchable: true,
  dropdownHeader: null,
  DropdownHeaderComponent: null,
  DropDownRenderComponent: _dropdownList2.default,
  DropDownLineItemRenderComponent: _dropdownList.ListItem
};

var ItemSelector = function (_Component) {
  (0, _inherits3.default)(ItemSelector, _Component);

  function ItemSelector() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ItemSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      showTypeahead: false
    }, _this.handleClickOutside = function () {
      _this._hideTypeahead();
    }, _this._onBlur = function () {
      // note: chickleted input is not a real form element so we call onBlur()
      // when we feel the events are appropriate
      if (_this.props.onBlur) {
        _this.props.onBlur();
      }
    }, _this._removeItem = function (item, e) {
      // only used when multiSelect = true
      e.preventDefault();
      e.stopPropagation();
      var selectedItems = _this.props.selectedItems;

      var index = selectedItems.findIndex(function (t) {
        return t === item;
      });

      if (index < 0) {
        return;
      }

      var items = [].concat(selectedItems.slice(0, index), selectedItems.slice(index + 1, selectedItems.length));

      _this.props.onChange(items);

      if (_this.props.closeOnSelect) {
        _this.setState({ showTypeahead: false });
        _this._onBlur();
      }
    }, _this._selectItem = function (item) {
      var getValue = _accessor2.default.generateOptionToStringFor(_this.props.getOptionValue || _this.props.displayOption);

      var previousSelected = _toArray(_this.props.selectedItems);

      if (_this.props.multiSelect) {
        var items = (0, _lodash2.default)(previousSelected.concat(_toArray(item).map(getValue)));
        _this.props.onChange(items);
      } else {
        _this.props.onChange(getValue(item));
      }

      if (_this.props.closeOnSelect) {
        _this.setState({ showTypeahead: false });
        _this._onBlur();
      }
    }, _this._onErase = function (e) {
      e.stopPropagation();
      _this.props.onChange(null);
    }, _this._showTypeahead = function () {
      if (!_this.props.disabled) {
        _this.setState({
          showTypeahead: true
        });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  ItemSelector.prototype._hideTypeahead = function _hideTypeahead() {
    this.setState({ showTypeahead: false });
    this._onBlur();
  };

  ItemSelector.prototype._renderDropdown = function _renderDropdown() {
    return _react2.default.createElement(
      DropdownWrapper,
      { placement: this.props.placement },
      _react2.default.createElement(_typeahead2.default, {
        customClasses: {
          results: 'list-selector',
          input: 'typeahead__input',
          listItem: 'list__item',
          listAnchor: 'list__item__anchor'
        },
        options: this.props.options,
        filterOption: this.props.filterOption,
        fixedOptions: this.props.fixedOptions,
        placeholder: 'Search',
        onOptionSelected: this._selectItem,
        customListComponent: this.props.DropDownRenderComponent,
        customListHeaderComponent: this.props.DropdownHeaderComponent,
        customListItemComponent: this.props.DropDownLineItemRenderComponent,
        displayOption: _accessor2.default.generateOptionToStringFor(this.props.displayOption),
        searchable: this.props.searchable,
        showOptionsWhenEmpty: true
      })
    );
  };

  ItemSelector.prototype.render = function render() {
    var selected = _toArray(this.props.selectedItems);
    var hasValue = selected.length;
    var displayOption = _accessor2.default.generateOptionToStringFor(this.props.displayOption);
    var eventProps = {
      onClick: this._showTypeahead,
      onFocus: this._showPopover
    };

    return _react2.default.createElement(
      'div',
      { className: 'item-selector' },
      _react2.default.createElement(
        'div',
        { style: { position: 'relative' } },
        this.props.multiSelect ? _react2.default.createElement(_chickletedInput2.default, (0, _extends3.default)({}, eventProps, {
          disabled: this.props.disabled,
          isError: this.props.isError,
          selectedItems: _toArray(this.props.selectedItems),
          placeholder: this.props.placeholder,
          displayOption: displayOption,
          removeItem: this._removeItem
        })) : _react2.default.createElement(
          StyledDropdownSelect,
          (0, _extends3.default)({}, eventProps, {
            active: this.state.showTypeahead,
            error: this.props.isError,
            disabled: this.props.disabled
          }),
          _react2.default.createElement(
            DropdownSelectValue,
            { placeholder: !hasValue },
            hasValue ? _react2.default.createElement(this.props.DropDownLineItemRenderComponent, {
              displayOption: displayOption,
              value: selected[0] }) : this.props.placeholder
          ),
          this.props.erasable && hasValue ? _react2.default.createElement(_icons.Delete, { height: '12px', onClick: this._onErase }) : null
        ),
        this.state.showTypeahead && this._renderDropdown()
      )
    );
  };

  return ItemSelector;
}(_react.Component);

ItemSelector.propTypes = propTypes;
ItemSelector.defaultProps = defaultProps;

exports.default = (0, _decorator2.default)(ItemSelector);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiX3RvQXJyYXkiLCJpdGVtIiwiQXJyYXkiLCJpc0FycmF5IiwiU3R5bGVkRHJvcGRvd25TZWxlY3QiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwiaW5wdXQiLCJkcm9wZG93bkxpc3RBbmNob3IiLCJEcm9wZG93blNlbGVjdFZhbHVlIiwic3BhbiIsInBsYWNlaG9sZGVyIiwic2VsZWN0Q29sb3JQbGFjZUhvbGRlciIsInNlbGVjdENvbG9yIiwiRHJvcGRvd25XcmFwcGVyIiwic2VsZWN0QmFja2dyb3VuZCIsInBsYWNlbWVudCIsImlucHV0Qm94SGVpZ2h0IiwicHJvcFR5cGVzIiwic2VsZWN0ZWRJdGVtcyIsIm9uZU9mVHlwZSIsImFycmF5Iiwic3RyaW5nIiwib2JqZWN0IiwiYm9vbCIsIm9uQ2hhbmdlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJvcHRpb25zIiwiZml4ZWRPcHRpb25zIiwiZGlzcGxheU9wdGlvbiIsImdldE9wdGlvblZhbHVlIiwiZmlsdGVyT3B0aW9uIiwiZGlzYWJsZWQiLCJpc0Vycm9yIiwibXVsdGlTZWxlY3QiLCJvbkJsdXIiLCJjbG9zZU9uU2VsZWN0IiwiRHJvcGRvd25IZWFkZXJDb21wb25lbnQiLCJEcm9wRG93blJlbmRlckNvbXBvbmVudCIsIkRyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJlcmFzYWJsZSIsInNlYXJjaGFibGUiLCJkcm9wZG93bkhlYWRlciIsIkl0ZW1TZWxlY3RvciIsInN0YXRlIiwic2hvd1R5cGVhaGVhZCIsImhhbmRsZUNsaWNrT3V0c2lkZSIsIl9oaWRlVHlwZWFoZWFkIiwiX29uQmx1ciIsIl9yZW1vdmVJdGVtIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaW5kZXgiLCJmaW5kSW5kZXgiLCJ0IiwiaXRlbXMiLCJzbGljZSIsImxlbmd0aCIsInNldFN0YXRlIiwiX3NlbGVjdEl0ZW0iLCJnZXRWYWx1ZSIsImdlbmVyYXRlT3B0aW9uVG9TdHJpbmdGb3IiLCJwcmV2aW91c1NlbGVjdGVkIiwiY29uY2F0IiwibWFwIiwiX29uRXJhc2UiLCJfc2hvd1R5cGVhaGVhZCIsIl9yZW5kZXJEcm9wZG93biIsInJlc3VsdHMiLCJsaXN0SXRlbSIsImxpc3RBbmNob3IiLCJyZW5kZXIiLCJzZWxlY3RlZCIsImhhc1ZhbHVlIiwiZXZlbnRQcm9wcyIsIm9uQ2xpY2siLCJvbkZvY3VzIiwiX3Nob3dQb3BvdmVyIiwicG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBU0EsUUFBVCxDQUFrQkMsSUFBbEIsRUFBd0I7QUFDdEIsTUFBSUMsTUFBTUMsT0FBTixDQUFjRixJQUFkLENBQUosRUFBeUI7QUFDdkIsV0FBT0EsSUFBUDtBQUNEOztBQUVELE1BQUksT0FBT0EsSUFBUCxLQUFnQixXQUFoQixJQUErQkEsU0FBUyxJQUE1QyxFQUFrRDtBQUNoRCxXQUFPLEVBQVA7QUFDRDs7QUFFRCxTQUFPLENBQUNBLElBQUQsQ0FBUDtBQUNEOztBQUVELElBQU1HLHVCQUF1QiwyQkFBT0MsR0FBOUIsa0JBQ0Y7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLEtBQXJCO0FBQUEsQ0FERSxFQUlBO0FBQUEsU0FBU0YsTUFBTUMsS0FBTixDQUFZRSxrQkFBckI7QUFBQSxDQUpBLENBQU47O0FBUUEsSUFBTUMsc0JBQXNCLDJCQUFPQyxJQUE3QixtQkFDSztBQUFBLFNBQ1BMLE1BQU1NLFdBQU4sR0FDSU4sTUFBTUMsS0FBTixDQUFZTSxzQkFEaEIsR0FFSVAsTUFBTUMsS0FBTixDQUFZTyxXQUhUO0FBQUEsQ0FETCxDQUFOOztBQU9BLElBQU1DLGtCQUFrQiwyQkFBT1YsR0FBekIsbUJBQ1U7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlTLGdCQUFyQjtBQUFBLENBRFYsRUFPTTtBQUFBLFNBQ1JWLE1BQU1XLFNBQU4sS0FBb0IsS0FBcEIsR0FBNEJYLE1BQU1DLEtBQU4sQ0FBWVcsY0FBeEMsR0FBeUQsTUFEakQ7QUFBQSxDQVBOLEVBU1U7QUFBQSxTQUFVWixNQUFNVyxTQUFOLEtBQW9CLFFBQXBCLEdBQStCLEtBQS9CLEdBQXVDLE1BQWpEO0FBQUEsQ0FUVixFQVVhO0FBQUEsU0FBVVgsTUFBTVcsU0FBTixLQUFvQixLQUFwQixHQUE0QixLQUE1QixHQUFvQyxNQUE5QztBQUFBLENBVmIsQ0FBTjs7QUFhQSxJQUFNRSxZQUFZO0FBQ2hCO0FBQ0FDLGlCQUFlLG9CQUFVQyxTQUFWLENBQW9CLENBQ2pDLG9CQUFVQyxLQUR1QixFQUNoQixvQkFBVUMsTUFETSxFQUNFLG9CQUFVQyxNQURaLEVBQ29CLG9CQUFVQyxJQUQ5QixDQUFwQixDQUZDO0FBSWhCQyxZQUFVLG9CQUFVQyxJQUFWLENBQWVDLFVBSlQ7QUFLaEJDLFdBQVMsb0JBQVVQLEtBQVYsQ0FBZ0JNLFVBTFQ7O0FBT2hCO0FBQ0FFLGdCQUFjLG9CQUFVUixLQVJSO0FBU2hCUyxpQkFBZSxvQkFBVVYsU0FBVixDQUFvQixDQUFDLG9CQUFVRSxNQUFYLEVBQW1CLG9CQUFVSSxJQUE3QixDQUFwQixDQVRDO0FBVWhCSyxrQkFBZ0Isb0JBQVVYLFNBQVYsQ0FBb0IsQ0FBQyxvQkFBVUUsTUFBWCxFQUFtQixvQkFBVUksSUFBN0IsQ0FBcEIsQ0FWQTtBQVdoQk0sZ0JBQWMsb0JBQVVaLFNBQVYsQ0FBb0IsQ0FBQyxvQkFBVUUsTUFBWCxFQUFtQixvQkFBVUksSUFBN0IsQ0FBcEIsQ0FYRTtBQVloQlYsYUFBVyxvQkFBVU0sTUFaTDtBQWFoQlcsWUFBVSxvQkFBVVQsSUFiSjtBQWNoQlUsV0FBUyxvQkFBVVYsSUFkSDtBQWVoQlcsZUFBYSxvQkFBVVgsSUFmUDtBQWdCaEJZLFVBQVEsb0JBQVVWLElBaEJGO0FBaUJoQmYsZUFBYSxvQkFBVVcsTUFqQlA7QUFrQmhCZSxpQkFBZSxvQkFBVWIsSUFsQlQ7QUFtQmhCYywyQkFBeUIsb0JBQVVaLElBbkJuQjtBQW9CaEJhLDJCQUF5QixvQkFBVWIsSUFwQm5CO0FBcUJoQmMsbUNBQWlDLG9CQUFVZDtBQXJCM0IsQ0FBbEI7O0FBd0JBLElBQU1lLGVBQWU7QUFDbkJDLFlBQVUsS0FEUztBQUVuQjFCLGFBQVcsUUFGUTtBQUduQkcsaUJBQWUsRUFISTtBQUluQlcsaUJBQWUsSUFKSTtBQUtuQkMsa0JBQWdCLElBTEc7QUFNbkJDLGdCQUFjLElBTks7QUFPbkJILGdCQUFjLElBUEs7QUFRbkJNLGVBQWEsSUFSTTtBQVNuQnhCLGVBQWEsZUFUTTtBQVVuQjBCLGlCQUFlLElBVkk7QUFXbkJNLGNBQVksSUFYTztBQVluQkMsa0JBQWdCLElBWkc7QUFhbkJOLDJCQUF5QixJQWJOO0FBY25CQyxpREFkbUI7QUFlbkJDO0FBZm1CLENBQXJCOztJQWtCTUssWTs7Ozs7Ozs7Ozs7OzBKQUNKQyxLLEdBQVE7QUFDTkMscUJBQWU7QUFEVCxLLFFBSVJDLGtCLEdBQXFCLFlBQU07QUFDekIsWUFBS0MsY0FBTDtBQUNELEssUUFPREMsTyxHQUFVLFlBQU07QUFDZDtBQUNBO0FBQ0EsVUFBSSxNQUFLN0MsS0FBTCxDQUFXK0IsTUFBZixFQUF1QjtBQUNyQixjQUFLL0IsS0FBTCxDQUFXK0IsTUFBWDtBQUNEO0FBQ0YsSyxRQUVEZSxXLEdBQWMsVUFBQ25ELElBQUQsRUFBT29ELENBQVAsRUFBYTtBQUN6QjtBQUNBQSxRQUFFQyxjQUFGO0FBQ0FELFFBQUVFLGVBQUY7QUFIeUIsVUFJbEJuQyxhQUprQixHQUlELE1BQUtkLEtBSkosQ0FJbEJjLGFBSmtCOztBQUt6QixVQUFNb0MsUUFBUXBDLGNBQ1hxQyxTQURXLENBQ0Q7QUFBQSxlQUFLQyxNQUFNekQsSUFBWDtBQUFBLE9BREMsQ0FBZDs7QUFHQSxVQUFJdUQsUUFBUSxDQUFaLEVBQWU7QUFDYjtBQUNEOztBQUVELFVBQU1HLGtCQUNEdkMsY0FBY3dDLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBdUJKLEtBQXZCLENBREMsRUFFRHBDLGNBQWN3QyxLQUFkLENBQW9CSixRQUFRLENBQTVCLEVBQStCcEMsY0FBY3lDLE1BQTdDLENBRkMsQ0FBTjs7QUFLQSxZQUFLdkQsS0FBTCxDQUFXb0IsUUFBWCxDQUFvQmlDLEtBQXBCOztBQUVBLFVBQUksTUFBS3JELEtBQUwsQ0FBV2dDLGFBQWYsRUFBOEI7QUFDNUIsY0FBS3dCLFFBQUwsQ0FBYyxFQUFDZCxlQUFlLEtBQWhCLEVBQWQ7QUFDQSxjQUFLRyxPQUFMO0FBQ0Q7QUFDRixLLFFBRURZLFcsR0FBYyxVQUFDOUQsSUFBRCxFQUFVO0FBQ3RCLFVBQU0rRCxXQUFXLG1CQUFTQyx5QkFBVCxDQUNmLE1BQUszRCxLQUFMLENBQVcwQixjQUFYLElBQTZCLE1BQUsxQixLQUFMLENBQVd5QixhQUR6QixDQUFqQjs7QUFJQSxVQUFNbUMsbUJBQW1CbEUsU0FBUyxNQUFLTSxLQUFMLENBQVdjLGFBQXBCLENBQXpCOztBQUVBLFVBQUksTUFBS2QsS0FBTCxDQUFXOEIsV0FBZixFQUE0QjtBQUMxQixZQUFNdUIsUUFBUSxzQkFBS08saUJBQWlCQyxNQUFqQixDQUF3Qm5FLFNBQVNDLElBQVQsRUFBZW1FLEdBQWYsQ0FBbUJKLFFBQW5CLENBQXhCLENBQUwsQ0FBZDtBQUNBLGNBQUsxRCxLQUFMLENBQVdvQixRQUFYLENBQW9CaUMsS0FBcEI7QUFDRCxPQUhELE1BR087QUFDTCxjQUFLckQsS0FBTCxDQUFXb0IsUUFBWCxDQUFvQnNDLFNBQVMvRCxJQUFULENBQXBCO0FBQ0Q7O0FBRUQsVUFBSSxNQUFLSyxLQUFMLENBQVdnQyxhQUFmLEVBQThCO0FBQzVCLGNBQUt3QixRQUFMLENBQWMsRUFBQ2QsZUFBZSxLQUFoQixFQUFkO0FBQ0EsY0FBS0csT0FBTDtBQUNEO0FBQ0YsSyxRQUVEa0IsUSxHQUFXLFVBQUNoQixDQUFELEVBQU87QUFDaEJBLFFBQUVFLGVBQUY7QUFDQSxZQUFLakQsS0FBTCxDQUFXb0IsUUFBWCxDQUFvQixJQUFwQjtBQUNELEssUUFFRDRDLGMsR0FBaUIsWUFBTTtBQUNyQixVQUFJLENBQUMsTUFBS2hFLEtBQUwsQ0FBVzRCLFFBQWhCLEVBQTBCO0FBQ3hCLGNBQUs0QixRQUFMLENBQWM7QUFDVmQseUJBQWU7QUFETCxTQUFkO0FBSUQ7QUFDRixLOzs7eUJBdEVERSxjLDZCQUFpQjtBQUNmLFNBQUtZLFFBQUwsQ0FBYyxFQUFDZCxlQUFlLEtBQWhCLEVBQWQ7QUFDQSxTQUFLRyxPQUFMO0FBQ0QsRzs7eUJBcUVEb0IsZSw4QkFBa0I7QUFDaEIsV0FDRTtBQUFDLHFCQUFEO0FBQUEsUUFBaUIsV0FBVyxLQUFLakUsS0FBTCxDQUFXVyxTQUF2QztBQUNFO0FBQ0UsdUJBQWU7QUFDYnVELG1CQUFTLGVBREk7QUFFYmhFLGlCQUFPLGtCQUZNO0FBR2JpRSxvQkFBVSxZQUhHO0FBSWJDLHNCQUFZO0FBSkMsU0FEakI7QUFPRSxpQkFBUyxLQUFLcEUsS0FBTCxDQUFXdUIsT0FQdEI7QUFRRSxzQkFBYyxLQUFLdkIsS0FBTCxDQUFXMkIsWUFSM0I7QUFTRSxzQkFBYyxLQUFLM0IsS0FBTCxDQUFXd0IsWUFUM0I7QUFVRSxxQkFBWSxRQVZkO0FBV0UsMEJBQWtCLEtBQUtpQyxXQVh6QjtBQVlFLDZCQUFxQixLQUFLekQsS0FBTCxDQUFXa0MsdUJBWmxDO0FBYUUsbUNBQTJCLEtBQUtsQyxLQUFMLENBQVdpQyx1QkFieEM7QUFjRSxpQ0FBeUIsS0FBS2pDLEtBQUwsQ0FBV21DLCtCQWR0QztBQWVFLHVCQUFlLG1CQUFTd0IseUJBQVQsQ0FDYixLQUFLM0QsS0FBTCxDQUFXeUIsYUFERSxDQWZqQjtBQWtCRSxvQkFBWSxLQUFLekIsS0FBTCxDQUFXc0MsVUFsQnpCO0FBbUJFO0FBbkJGO0FBREYsS0FERjtBQXlCRCxHOzt5QkFFRCtCLE0scUJBQVM7QUFDUCxRQUFNQyxXQUFXNUUsU0FBUyxLQUFLTSxLQUFMLENBQVdjLGFBQXBCLENBQWpCO0FBQ0EsUUFBTXlELFdBQVdELFNBQVNmLE1BQTFCO0FBQ0EsUUFBTTlCLGdCQUFnQixtQkFBU2tDLHlCQUFULENBQ3BCLEtBQUszRCxLQUFMLENBQVd5QixhQURTLENBQXRCO0FBR0EsUUFBTStDLGFBQWE7QUFDakJDLGVBQVMsS0FBS1QsY0FERztBQUVqQlUsZUFBUyxLQUFLQztBQUZHLEtBQW5COztBQUtBLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxlQUFmO0FBQ0U7QUFBQTtBQUFBLFVBQUssT0FBTyxFQUFDQyxVQUFVLFVBQVgsRUFBWjtBQUVHLGFBQUs1RSxLQUFMLENBQVc4QixXQUFYLEdBQ0Msb0ZBQ00wQyxVQUROO0FBRUUsb0JBQVUsS0FBS3hFLEtBQUwsQ0FBVzRCLFFBRnZCO0FBR0UsbUJBQVMsS0FBSzVCLEtBQUwsQ0FBVzZCLE9BSHRCO0FBSUUseUJBQWVuQyxTQUFTLEtBQUtNLEtBQUwsQ0FBV2MsYUFBcEIsQ0FKakI7QUFLRSx1QkFBYSxLQUFLZCxLQUFMLENBQVdNLFdBTDFCO0FBTUUseUJBQWVtQixhQU5qQjtBQU9FLHNCQUFZLEtBQUtxQjtBQVBuQixXQURELEdBV0M7QUFBQyw4QkFBRDtBQUFBLHFDQUNNMEIsVUFETjtBQUVFLG9CQUFRLEtBQUsvQixLQUFMLENBQVdDLGFBRnJCO0FBR0UsbUJBQU8sS0FBSzFDLEtBQUwsQ0FBVzZCLE9BSHBCO0FBSUUsc0JBQVUsS0FBSzdCLEtBQUwsQ0FBVzRCO0FBSnZCO0FBTUU7QUFBQywrQkFBRDtBQUFBLGNBQXFCLGFBQWEsQ0FBQzJDLFFBQW5DO0FBQ0dBLHVCQUFXLG1DQUFNLEtBQU4sQ0FBWSwrQkFBWjtBQUNWLDZCQUFlOUMsYUFETDtBQUVWLHFCQUFPNkMsU0FBUyxDQUFULENBRkcsR0FBWCxHQUdHLEtBQUt0RSxLQUFMLENBQVdNO0FBSmpCLFdBTkY7QUFZRyxlQUFLTixLQUFMLENBQVdxQyxRQUFYLElBQXVCa0MsUUFBdkIsR0FDQywrQ0FBUSxRQUFPLE1BQWYsRUFBc0IsU0FBUyxLQUFLUixRQUFwQyxHQURELEdBRUc7QUFkTixTQWJKO0FBK0JHLGFBQUt0QixLQUFMLENBQVdDLGFBQVgsSUFBNEIsS0FBS3VCLGVBQUw7QUEvQi9CO0FBREYsS0FERjtBQXFDRCxHOzs7OztBQUdIekIsYUFBYTNCLFNBQWIsR0FBeUJBLFNBQXpCO0FBQ0EyQixhQUFhSixZQUFiLEdBQTRCQSxZQUE1Qjs7a0JBRWUseUJBQXNCSSxZQUF0QixDIiwiZmlsZSI6Iml0ZW0tc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gudW5pcSc7XG5pbXBvcnQgbGlzdGVuc1RvQ2xpY2tPdXRzaWRlIGZyb20gJ3JlYWN0LW9uY2xpY2tvdXRzaWRlL2RlY29yYXRvcic7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IEFjY2Vzc29yIGZyb20gJy4vYWNjZXNzb3InO1xuaW1wb3J0IENoaWNrbGV0ZWRJbnB1dCBmcm9tICcuL2NoaWNrbGV0ZWQtaW5wdXQnO1xuaW1wb3J0IFR5cGVhaGVhZCBmcm9tICcuL3R5cGVhaGVhZCc7XG5pbXBvcnQge0RlbGV0ZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IERyb3Bkb3duTGlzdCwge0xpc3RJdGVtfSBmcm9tICcuL2Ryb3Bkb3duLWxpc3QnO1xuXG4vKipcbiAqIENvbnZlcnRzIG5vbi1hcnJheXMgdG8gYXJyYXlzLiAgTGVhdmVzIGFycmF5cyBhbG9uZS4gIENvbnZlcnRzXG4gKiB1bmRlZmluZWQgdmFsdWVzIHRvIGVtcHR5IGFycmF5cyAoW10gaW5zdGVhZCBvZiBbdW5kZWZpbmVkXSkuXG4gKiBPdGhlcndpc2UsIGp1c3QgcmV0dXJucyBbaXRlbV0gZm9yIG5vbi1hcnJheSBpdGVtcy5cbiAqXG4gKiBAcGFyYW0geyp9IGl0ZW1cbiAqIEByZXR1cm5zIHthcnJheX0gYm9vbSEgbXVjaCBhcnJheS4gdmVyeSBpbmRleGVkLiBzbyB1c2VmdWwuXG4gKi9cbmZ1bmN0aW9uIF90b0FycmF5KGl0ZW0pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcgfHwgaXRlbSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiBbaXRlbV07XG59XG5cbmNvbnN0IFN0eWxlZERyb3Bkb3duU2VsZWN0ID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dH07XG4gIFxuICAubGlzdF9faXRlbV9fYW5jaG9yIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEFuY2hvcn1cbiAgfVxuYDtcblxuY29uc3QgRHJvcGRvd25TZWxlY3RWYWx1ZSA9IHN0eWxlZC5zcGFuYFxuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLnBsYWNlaG9sZGVyXG4gICAgICA/IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yUGxhY2VIb2xkZXJcbiAgICAgIDogcHJvcHMudGhlbWUuc2VsZWN0Q29sb3J9O1xuYDtcblxuY29uc3QgRHJvcGRvd25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RCYWNrZ3JvdW5kfTtcbiAgYm9yZGVyOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgbGVmdDogMDtcbiAgei1pbmRleDogMTAwO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogJHtwcm9wcyA9PlxuICAgIHByb3BzLnBsYWNlbWVudCA9PT0gJ3RvcCcgPyBwcm9wcy50aGVtZS5pbnB1dEJveEhlaWdodCA6ICdhdXRvJ307XG4gIG1hcmdpbi10b3A6ICR7cHJvcHMgPT4gKHByb3BzLnBsYWNlbWVudCA9PT0gJ2JvdHRvbScgPyAnNHB4JyA6ICdhdXRvJyl9O1xuICBtYXJnaW4tYm90dG9tOiAke3Byb3BzID0+IChwcm9wcy5wbGFjZW1lbnQgPT09ICd0b3AnID8gJzRweCcgOiAnYXV0bycpfTtcbmA7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgLy8gcmVxdWlyZWQgcHJvcGVydGllc1xuICBzZWxlY3RlZEl0ZW1zOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuYXJyYXksIFByb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5vYmplY3QsIFByb3BUeXBlcy5ib29sXSksXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvcHRpb25zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcblxuICAvLyBvcHRpb25hbCBwcm9wZXJ0aWVzXG4gIGZpeGVkT3B0aW9uczogUHJvcFR5cGVzLmFycmF5LFxuICBkaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBnZXRPcHRpb25WYWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgZmlsdGVyT3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBwbGFjZW1lbnQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNFcnJvcjogUHJvcFR5cGVzLmJvb2wsXG4gIG11bHRpU2VsZWN0OiBQcm9wVHlwZXMuYm9vbCxcbiAgb25CbHVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgcGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsb3NlT25TZWxlY3Q6IFByb3BUeXBlcy5ib29sLFxuICBEcm9wZG93bkhlYWRlckNvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmMsXG4gIERyb3BEb3duUmVuZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgZXJhc2FibGU6IGZhbHNlLFxuICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICBzZWxlY3RlZEl0ZW1zOiBbXSxcbiAgZGlzcGxheU9wdGlvbjogbnVsbCxcbiAgZ2V0T3B0aW9uVmFsdWU6IG51bGwsXG4gIGZpbHRlck9wdGlvbjogbnVsbCxcbiAgZml4ZWRPcHRpb25zOiBudWxsLFxuICBtdWx0aVNlbGVjdDogdHJ1ZSxcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciBhIHZhbHVlJyxcbiAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcbiAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgZHJvcGRvd25IZWFkZXI6IG51bGwsXG4gIERyb3Bkb3duSGVhZGVyQ29tcG9uZW50OiBudWxsLFxuICBEcm9wRG93blJlbmRlckNvbXBvbmVudDogRHJvcGRvd25MaXN0LFxuICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50OiBMaXN0SXRlbVxufTtcblxuY2xhc3MgSXRlbVNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgc2hvd1R5cGVhaGVhZDogZmFsc2VcbiAgfTtcblxuICBoYW5kbGVDbGlja091dHNpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy5faGlkZVR5cGVhaGVhZCgpO1xuICB9O1xuXG4gIF9oaWRlVHlwZWFoZWFkKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dUeXBlYWhlYWQ6IGZhbHNlfSk7XG4gICAgdGhpcy5fb25CbHVyKCk7XG4gIH1cblxuICBfb25CbHVyID0gKCkgPT4ge1xuICAgIC8vIG5vdGU6IGNoaWNrbGV0ZWQgaW5wdXQgaXMgbm90IGEgcmVhbCBmb3JtIGVsZW1lbnQgc28gd2UgY2FsbCBvbkJsdXIoKVxuICAgIC8vIHdoZW4gd2UgZmVlbCB0aGUgZXZlbnRzIGFyZSBhcHByb3ByaWF0ZVxuICAgIGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuICAgICAgdGhpcy5wcm9wcy5vbkJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbW92ZUl0ZW0gPSAoaXRlbSwgZSkgPT4ge1xuICAgIC8vIG9ubHkgdXNlZCB3aGVuIG11bHRpU2VsZWN0ID0gdHJ1ZVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHtzZWxlY3RlZEl0ZW1zfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaW5kZXggPSBzZWxlY3RlZEl0ZW1zXG4gICAgICAuZmluZEluZGV4KHQgPT4gdCA9PT0gaXRlbSk7XG5cbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICAuLi5zZWxlY3RlZEl0ZW1zLnNsaWNlKDAsIGluZGV4KSxcbiAgICAgIC4uLnNlbGVjdGVkSXRlbXMuc2xpY2UoaW5kZXggKyAxLCBzZWxlY3RlZEl0ZW1zLmxlbmd0aClcbiAgICBdO1xuXG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShpdGVtcyk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93VHlwZWFoZWFkOiBmYWxzZX0pO1xuICAgICAgdGhpcy5fb25CbHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIF9zZWxlY3RJdGVtID0gKGl0ZW0pID0+IHtcbiAgICBjb25zdCBnZXRWYWx1ZSA9IEFjY2Vzc29yLmdlbmVyYXRlT3B0aW9uVG9TdHJpbmdGb3IoXG4gICAgICB0aGlzLnByb3BzLmdldE9wdGlvblZhbHVlIHx8IHRoaXMucHJvcHMuZGlzcGxheU9wdGlvblxuICAgICk7XG5cbiAgICBjb25zdCBwcmV2aW91c1NlbGVjdGVkID0gX3RvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm11bHRpU2VsZWN0KSB7XG4gICAgICBjb25zdCBpdGVtcyA9IHVuaXEocHJldmlvdXNTZWxlY3RlZC5jb25jYXQoX3RvQXJyYXkoaXRlbSkubWFwKGdldFZhbHVlKSkpO1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShpdGVtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZ2V0VmFsdWUoaXRlbSkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dUeXBlYWhlYWQ6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9vbkJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX29uRXJhc2UgPSAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShudWxsKTtcbiAgfTtcblxuICBfc2hvd1R5cGVhaGVhZCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMucHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHNob3dUeXBlYWhlYWQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckRyb3Bkb3duKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RHJvcGRvd25XcmFwcGVyIHBsYWNlbWVudD17dGhpcy5wcm9wcy5wbGFjZW1lbnR9PlxuICAgICAgICA8VHlwZWFoZWFkXG4gICAgICAgICAgY3VzdG9tQ2xhc3Nlcz17e1xuICAgICAgICAgICAgcmVzdWx0czogJ2xpc3Qtc2VsZWN0b3InLFxuICAgICAgICAgICAgaW5wdXQ6ICd0eXBlYWhlYWRfX2lucHV0JyxcbiAgICAgICAgICAgIGxpc3RJdGVtOiAnbGlzdF9faXRlbScsXG4gICAgICAgICAgICBsaXN0QW5jaG9yOiAnbGlzdF9faXRlbV9fYW5jaG9yJ1xuICAgICAgICAgIH19XG4gICAgICAgICAgb3B0aW9ucz17dGhpcy5wcm9wcy5vcHRpb25zfVxuICAgICAgICAgIGZpbHRlck9wdGlvbj17dGhpcy5wcm9wcy5maWx0ZXJPcHRpb259XG4gICAgICAgICAgZml4ZWRPcHRpb25zPXt0aGlzLnByb3BzLmZpeGVkT3B0aW9uc31cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaFwiXG4gICAgICAgICAgb25PcHRpb25TZWxlY3RlZD17dGhpcy5fc2VsZWN0SXRlbX1cbiAgICAgICAgICBjdXN0b21MaXN0Q29tcG9uZW50PXt0aGlzLnByb3BzLkRyb3BEb3duUmVuZGVyQ29tcG9uZW50fVxuICAgICAgICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ9e3RoaXMucHJvcHMuRHJvcGRvd25IZWFkZXJDb21wb25lbnR9XG4gICAgICAgICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ9e3RoaXMucHJvcHMuRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudH1cbiAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtBY2Nlc3Nvci5nZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yKFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgICAgICAgKX1cbiAgICAgICAgICBzZWFyY2hhYmxlPXt0aGlzLnByb3BzLnNlYXJjaGFibGV9XG4gICAgICAgICAgc2hvd09wdGlvbnNXaGVuRW1wdHlcbiAgICAgICAgLz5cbiAgICAgIDwvRHJvcGRvd25XcmFwcGVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBfdG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gc2VsZWN0ZWQubGVuZ3RoO1xuICAgIGNvbnN0IGRpc3BsYXlPcHRpb24gPSBBY2Nlc3Nvci5nZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yKFxuICAgICAgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgKTtcbiAgICBjb25zdCBldmVudFByb3BzID0ge1xuICAgICAgb25DbGljazogdGhpcy5fc2hvd1R5cGVhaGVhZCxcbiAgICAgIG9uRm9jdXM6IHRoaXMuX3Nob3dQb3BvdmVyXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW0tc2VsZWN0b3JcIj5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgICAgey8qIHRoaXMgcGFydCBpcyB1c2VkIHRvIGRpc3BsYXkgdGhlIGxhYmVsICovfVxuICAgICAgICAgIHt0aGlzLnByb3BzLm11bHRpU2VsZWN0ID8gKFxuICAgICAgICAgICAgPENoaWNrbGV0ZWRJbnB1dFxuICAgICAgICAgICAgICB7Li4uZXZlbnRQcm9wc31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG4gICAgICAgICAgICAgIGlzRXJyb3I9e3RoaXMucHJvcHMuaXNFcnJvcn1cbiAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcz17X3RvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgIGRpc3BsYXlPcHRpb249e2Rpc3BsYXlPcHRpb259XG4gICAgICAgICAgICAgIHJlbW92ZUl0ZW09e3RoaXMuX3JlbW92ZUl0ZW19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8U3R5bGVkRHJvcGRvd25TZWxlY3RcbiAgICAgICAgICAgICAgey4uLmV2ZW50UHJvcHN9XG4gICAgICAgICAgICAgIGFjdGl2ZT17dGhpcy5zdGF0ZS5zaG93VHlwZWFoZWFkfVxuICAgICAgICAgICAgICBlcnJvcj17dGhpcy5wcm9wcy5pc0Vycm9yfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPERyb3Bkb3duU2VsZWN0VmFsdWUgcGxhY2Vob2xkZXI9eyFoYXNWYWx1ZX0+XG4gICAgICAgICAgICAgICAge2hhc1ZhbHVlID8gPHRoaXMucHJvcHMuRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgZGlzcGxheU9wdGlvbj17ZGlzcGxheU9wdGlvbn1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZFswXX0vPlxuICAgICAgICAgICAgICAgICAgOiB0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICA8L0Ryb3Bkb3duU2VsZWN0VmFsdWU+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmVyYXNhYmxlICYmIGhhc1ZhbHVlID8gKFxuICAgICAgICAgICAgICAgIDxEZWxldGUgaGVpZ2h0PVwiMTJweFwiIG9uQ2xpY2s9e3RoaXMuX29uRXJhc2V9IC8+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgPC9TdHlsZWREcm9wZG93blNlbGVjdD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHsvKiB0aGlzIHBhcnQgaXMgdXNlZCB0byBidWlsdCB0aGUgbGlzdCAqL31cbiAgICAgICAgICB7dGhpcy5zdGF0ZS5zaG93VHlwZWFoZWFkICYmIHRoaXMuX3JlbmRlckRyb3Bkb3duKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5JdGVtU2VsZWN0b3IucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuSXRlbVNlbGVjdG9yLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgbGlzdGVuc1RvQ2xpY2tPdXRzaWRlKEl0ZW1TZWxlY3Rvcik7XG4iXX0=