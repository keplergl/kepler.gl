'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  ', ';\n\n  .list__item__anchor {\n    ', ';\n  }\n'], ['\n  ', ';\n\n  .list__item__anchor {\n    ', ';\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n'], ['\n  color: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  background: ', ';\n  border: 0;\n  width: 100%;\n  left: 0;\n  z-index: 100;\n  position: absolute;\n  bottom: ', ';\n  margin-top: ', ';\n  margin-bottom: ', ';\n'], ['\n  background: ', ';\n  border: 0;\n  width: 100%;\n  left: 0;\n  z-index: 100;\n  position: absolute;\n  bottom: ', ';\n  margin-top: ', ';\n  margin-bottom: ', ';\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

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
  return props.inputTheme === 'secondary' ? props.theme.secondaryInput : props.theme.input;
}, function (props) {
  return props.theme.dropdownListAnchor;
});

var DropdownSelectValue = _styledComponents2.default.span(_templateObject2, function (props) {
  return props.placeholder ? props.theme.selectColorPlaceHolder : props.theme.selectColor;
});

var DropdownWrapper = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.dropdownBgd;
}, function (props) {
  return props.placement === 'top' ? props.theme.inputBoxHeight : 'auto';
}, function (props) {
  return props.placement === 'bottom' ? '4px' : 'auto';
}, function (props) {
  return props.placement === 'top' ? '4px' : 'auto';
});

var propTypes = {
  // required properties
  selectedItems: _propTypes2.default.any,
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
  inputTheme: _propTypes2.default.string,
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
  inputTheme: 'primary',
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
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ItemSelector);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ItemSelector.__proto__ || Object.getPrototypeOf(ItemSelector)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
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

      var items = [].concat((0, _toConsumableArray3.default)(selectedItems.slice(0, index)), (0, _toConsumableArray3.default)(selectedItems.slice(index + 1, selectedItems.length)));

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

  (0, _createClass3.default)(ItemSelector, [{
    key: '_hideTypeahead',
    value: function _hideTypeahead() {
      this.setState({ showTypeahead: false });
      this._onBlur();
    }
  }, {
    key: '_renderDropdown',
    value: function _renderDropdown() {
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
    }
  }, {
    key: 'render',
    value: function render() {
      var selected = _toArray(this.props.selectedItems);
      var hasValue = selected.length;
      var displayOption = _accessor2.default.generateOptionToStringFor(this.props.displayOption);

      var dropdownSelectProps = {
        className: (0, _classnames2.default)('item-selector__dropdown', {
          active: this.state.showTypeahead
        }),
        disabled: this.props.disabled,
        onClick: this._showTypeahead,
        onFocus: this._showPopover,
        error: this.props.isError,
        inputTheme: this.props.inputTheme
      };

      return _react2.default.createElement(
        'div',
        { className: 'item-selector' },
        _react2.default.createElement(
          'div',
          { style: { position: 'relative' } },
          this.props.multiSelect ? _react2.default.createElement(_chickletedInput2.default, (0, _extends3.default)({}, dropdownSelectProps, {
            selectedItems: _toArray(this.props.selectedItems),
            placeholder: this.props.placeholder,
            displayOption: displayOption,
            removeItem: this._removeItem
          })) : _react2.default.createElement(
            StyledDropdownSelect,
            dropdownSelectProps,
            _react2.default.createElement(
              DropdownSelectValue,
              { placeholder: !hasValue },
              hasValue ? _react2.default.createElement(this.props.DropDownLineItemRenderComponent, {
                displayOption: displayOption,
                value: selected[0]
              }) : this.props.placeholder
            ),
            this.props.erasable && hasValue ? _react2.default.createElement(_icons.Delete, { height: '12px', onClick: this._onErase }) : null
          ),
          this.state.showTypeahead && this._renderDropdown()
        )
      );
    }
  }]);
  return ItemSelector;
}(_react.Component);

ItemSelector.propTypes = propTypes;
ItemSelector.defaultProps = defaultProps;

exports.default = (0, _decorator2.default)(ItemSelector);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiX3RvQXJyYXkiLCJpdGVtIiwiQXJyYXkiLCJpc0FycmF5IiwiU3R5bGVkRHJvcGRvd25TZWxlY3QiLCJkaXYiLCJwcm9wcyIsImlucHV0VGhlbWUiLCJ0aGVtZSIsInNlY29uZGFyeUlucHV0IiwiaW5wdXQiLCJkcm9wZG93bkxpc3RBbmNob3IiLCJEcm9wZG93blNlbGVjdFZhbHVlIiwic3BhbiIsInBsYWNlaG9sZGVyIiwic2VsZWN0Q29sb3JQbGFjZUhvbGRlciIsInNlbGVjdENvbG9yIiwiRHJvcGRvd25XcmFwcGVyIiwiZHJvcGRvd25CZ2QiLCJwbGFjZW1lbnQiLCJpbnB1dEJveEhlaWdodCIsInByb3BUeXBlcyIsInNlbGVjdGVkSXRlbXMiLCJhbnkiLCJvbkNoYW5nZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwib3B0aW9ucyIsImFycmF5IiwiZml4ZWRPcHRpb25zIiwiZGlzcGxheU9wdGlvbiIsIm9uZU9mVHlwZSIsInN0cmluZyIsImdldE9wdGlvblZhbHVlIiwiZmlsdGVyT3B0aW9uIiwiZGlzYWJsZWQiLCJib29sIiwiaXNFcnJvciIsIm11bHRpU2VsZWN0Iiwib25CbHVyIiwiY2xvc2VPblNlbGVjdCIsIkRyb3Bkb3duSGVhZGVyQ29tcG9uZW50IiwiRHJvcERvd25SZW5kZXJDb21wb25lbnQiLCJEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwiZXJhc2FibGUiLCJzZWFyY2hhYmxlIiwiZHJvcGRvd25IZWFkZXIiLCJJdGVtU2VsZWN0b3IiLCJzdGF0ZSIsInNob3dUeXBlYWhlYWQiLCJoYW5kbGVDbGlja091dHNpZGUiLCJfaGlkZVR5cGVhaGVhZCIsIl9vbkJsdXIiLCJfcmVtb3ZlSXRlbSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImluZGV4IiwiZmluZEluZGV4IiwidCIsIml0ZW1zIiwic2xpY2UiLCJsZW5ndGgiLCJzZXRTdGF0ZSIsIl9zZWxlY3RJdGVtIiwiZ2V0VmFsdWUiLCJnZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yIiwicHJldmlvdXNTZWxlY3RlZCIsImNvbmNhdCIsIm1hcCIsIl9vbkVyYXNlIiwiX3Nob3dUeXBlYWhlYWQiLCJyZXN1bHRzIiwibGlzdEl0ZW0iLCJsaXN0QW5jaG9yIiwic2VsZWN0ZWQiLCJoYXNWYWx1ZSIsImRyb3Bkb3duU2VsZWN0UHJvcHMiLCJjbGFzc05hbWUiLCJhY3RpdmUiLCJvbkNsaWNrIiwib25Gb2N1cyIsIl9zaG93UG9wb3ZlciIsImVycm9yIiwicG9zaXRpb24iLCJfcmVuZGVyRHJvcGRvd24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7OztBQVFBLFNBQVNBLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCO0FBQ3RCLE1BQUlDLE1BQU1DLE9BQU4sQ0FBY0YsSUFBZCxDQUFKLEVBQXlCO0FBQ3ZCLFdBQU9BLElBQVA7QUFDRDs7QUFFRCxNQUFJLE9BQU9BLElBQVAsS0FBZ0IsV0FBaEIsSUFBK0JBLFNBQVMsSUFBNUMsRUFBa0Q7QUFDaEQsV0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBTyxDQUFDQSxJQUFELENBQVA7QUFDRDs7QUFFRCxJQUFNRyx1QkFBdUIsMkJBQU9DLEdBQTlCLGtCQUNGO0FBQUEsU0FDQUMsTUFBTUMsVUFBTixLQUFxQixXQUFyQixHQUNJRCxNQUFNRSxLQUFOLENBQVlDLGNBRGhCLEdBRUlILE1BQU1FLEtBQU4sQ0FBWUUsS0FIaEI7QUFBQSxDQURFLEVBT0E7QUFBQSxTQUFTSixNQUFNRSxLQUFOLENBQVlHLGtCQUFyQjtBQUFBLENBUEEs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QUNDLCtDQUFRLFFBQU8sTUFBZixFQUFzQixTQUFTLEtBQUtOLFFBQXBDLEdBREQsR0FFRztBQWJOLFdBWEo7QUE0QkcsZUFBS3RCLEtBQUwsQ0FBV0MsYUFBWCxJQUE0QixLQUFLb0MsZUFBTDtBQTVCL0I7QUFERixPQURGO0FBa0NEOzs7OztBQUdIdEMsYUFBYTNCLFNBQWIsR0FBeUJBLFNBQXpCO0FBQ0EyQixhQUFhSixZQUFiLEdBQTRCQSxZQUE1Qjs7a0JBRWUseUJBQXNCSSxZQUF0QixDIiwiZmlsZSI6Iml0ZW0tc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcbmltcG9ydCBsaXN0ZW5zVG9DbGlja091dHNpZGUgZnJvbSAncmVhY3Qtb25jbGlja291dHNpZGUvZGVjb3JhdG9yJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgQWNjZXNzb3IgZnJvbSAnLi9hY2Nlc3Nvcic7XG5pbXBvcnQgQ2hpY2tsZXRlZElucHV0IGZyb20gJy4vY2hpY2tsZXRlZC1pbnB1dCc7XG5pbXBvcnQgVHlwZWFoZWFkIGZyb20gJy4vdHlwZWFoZWFkJztcbmltcG9ydCB7RGVsZXRlfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgRHJvcGRvd25MaXN0LCB7TGlzdEl0ZW19IGZyb20gJy4vZHJvcGRvd24tbGlzdCc7XG5cbi8qKlxuICogQ29udmVydHMgbm9uLWFycmF5cyB0byBhcnJheXMuICBMZWF2ZXMgYXJyYXlzIGFsb25lLiAgQ29udmVydHNcbiAqIHVuZGVmaW5lZCB2YWx1ZXMgdG8gZW1wdHkgYXJyYXlzIChbXSBpbnN0ZWFkIG9mIFt1bmRlZmluZWRdKS5cbiAqIE90aGVyd2lzZSwganVzdCByZXR1cm5zIFtpdGVtXSBmb3Igbm9uLWFycmF5IGl0ZW1zLlxuICpcbiAqIEBwYXJhbSB7Kn0gaXRlbVxuICogQHJldHVybnMge2FycmF5fSBib29tISBtdWNoIGFycmF5LiB2ZXJ5IGluZGV4ZWQuIHNvIHVzZWZ1bC5cbiAqL1xuZnVuY3Rpb24gX3RvQXJyYXkoaXRlbSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBpdGVtID09PSAndW5kZWZpbmVkJyB8fCBpdGVtID09PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcmV0dXJuIFtpdGVtXTtcbn1cblxuY29uc3QgU3R5bGVkRHJvcGRvd25TZWxlY3QgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+XG4gICAgcHJvcHMuaW5wdXRUaGVtZSA9PT0gJ3NlY29uZGFyeSdcbiAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRcbiAgICAgIDogcHJvcHMudGhlbWUuaW5wdXR9O1xuXG4gIC5saXN0X19pdGVtX19hbmNob3Ige1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QW5jaG9yfTtcbiAgfVxuYDtcblxuY29uc3QgRHJvcGRvd25TZWxlY3RWYWx1ZSA9IHN0eWxlZC5zcGFuYFxuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLnBsYWNlaG9sZGVyXG4gICAgICA/IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yUGxhY2VIb2xkZXJcbiAgICAgIDogcHJvcHMudGhlbWUuc2VsZWN0Q29sb3J9O1xuYDtcblxuY29uc3QgRHJvcGRvd25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkJnZH07XG4gIGJvcmRlcjogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGxlZnQ6IDA7XG4gIHotaW5kZXg6IDEwMDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5wbGFjZW1lbnQgPT09ICd0b3AnID8gcHJvcHMudGhlbWUuaW5wdXRCb3hIZWlnaHQgOiAnYXV0byd9O1xuICBtYXJnaW4tdG9wOiAke3Byb3BzID0+IChwcm9wcy5wbGFjZW1lbnQgPT09ICdib3R0b20nID8gJzRweCcgOiAnYXV0bycpfTtcbiAgbWFyZ2luLWJvdHRvbTogJHtwcm9wcyA9PiAocHJvcHMucGxhY2VtZW50ID09PSAndG9wJyA/ICc0cHgnIDogJ2F1dG8nKX07XG5gO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIC8vIHJlcXVpcmVkIHByb3BlcnRpZXNcbiAgc2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFueSxcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wdGlvbnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsIHByb3BlcnRpZXNcbiAgZml4ZWRPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXksXG4gIGRpc3BsYXlPcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gIGdldE9wdGlvblZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBmaWx0ZXJPcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gIHBsYWNlbWVudDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBpc0Vycm9yOiBQcm9wVHlwZXMuYm9vbCxcbiAgbXVsdGlTZWxlY3Q6IFByb3BUeXBlcy5ib29sLFxuICBpbnB1dFRoZW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvbkJsdXI6IFByb3BUeXBlcy5mdW5jLFxuICBwbGFjZWhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xvc2VPblNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gIERyb3Bkb3duSGVhZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgRHJvcERvd25SZW5kZXJDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuY1xufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBlcmFzYWJsZTogZmFsc2UsXG4gIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gIHNlbGVjdGVkSXRlbXM6IFtdLFxuICBkaXNwbGF5T3B0aW9uOiBudWxsLFxuICBnZXRPcHRpb25WYWx1ZTogbnVsbCxcbiAgZmlsdGVyT3B0aW9uOiBudWxsLFxuICBmaXhlZE9wdGlvbnM6IG51bGwsXG4gIGlucHV0VGhlbWU6ICdwcmltYXJ5JyxcbiAgbXVsdGlTZWxlY3Q6IHRydWUsXG4gIHBsYWNlaG9sZGVyOiAnRW50ZXIgYSB2YWx1ZScsXG4gIGNsb3NlT25TZWxlY3Q6IHRydWUsXG4gIHNlYXJjaGFibGU6IHRydWUsXG4gIGRyb3Bkb3duSGVhZGVyOiBudWxsLFxuICBEcm9wZG93bkhlYWRlckNvbXBvbmVudDogbnVsbCxcbiAgRHJvcERvd25SZW5kZXJDb21wb25lbnQ6IERyb3Bkb3duTGlzdCxcbiAgRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudDogTGlzdEl0ZW1cbn07XG5cbmNsYXNzIEl0ZW1TZWxlY3RvciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRlID0ge1xuICAgIHNob3dUeXBlYWhlYWQ6IGZhbHNlXG4gIH07XG5cbiAgaGFuZGxlQ2xpY2tPdXRzaWRlID0gKCkgPT4ge1xuICAgIHRoaXMuX2hpZGVUeXBlYWhlYWQoKTtcbiAgfTtcblxuICBfaGlkZVR5cGVhaGVhZCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzaG93VHlwZWFoZWFkOiBmYWxzZX0pO1xuICAgIHRoaXMuX29uQmx1cigpO1xuICB9XG5cbiAgX29uQmx1ciA9ICgpID0+IHtcbiAgICAvLyBub3RlOiBjaGlja2xldGVkIGlucHV0IGlzIG5vdCBhIHJlYWwgZm9ybSBlbGVtZW50IHNvIHdlIGNhbGwgb25CbHVyKClcbiAgICAvLyB3aGVuIHdlIGZlZWwgdGhlIGV2ZW50cyBhcmUgYXBwcm9wcmlhdGVcbiAgICBpZiAodGhpcy5wcm9wcy5vbkJsdXIpIHtcbiAgICAgIHRoaXMucHJvcHMub25CbHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIF9yZW1vdmVJdGVtID0gKGl0ZW0sIGUpID0+IHtcbiAgICAvLyBvbmx5IHVzZWQgd2hlbiBtdWx0aVNlbGVjdCA9IHRydWVcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB7c2VsZWN0ZWRJdGVtc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGluZGV4ID0gc2VsZWN0ZWRJdGVtcy5maW5kSW5kZXgodCA9PiB0ID09PSBpdGVtKTtcblxuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIC4uLnNlbGVjdGVkSXRlbXMuc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgLi4uc2VsZWN0ZWRJdGVtcy5zbGljZShpbmRleCArIDEsIHNlbGVjdGVkSXRlbXMubGVuZ3RoKVxuICAgIF07XG5cbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGl0ZW1zKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dUeXBlYWhlYWQ6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9vbkJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX3NlbGVjdEl0ZW0gPSBpdGVtID0+IHtcbiAgICBjb25zdCBnZXRWYWx1ZSA9IEFjY2Vzc29yLmdlbmVyYXRlT3B0aW9uVG9TdHJpbmdGb3IoXG4gICAgICB0aGlzLnByb3BzLmdldE9wdGlvblZhbHVlIHx8IHRoaXMucHJvcHMuZGlzcGxheU9wdGlvblxuICAgICk7XG5cbiAgICBjb25zdCBwcmV2aW91c1NlbGVjdGVkID0gX3RvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm11bHRpU2VsZWN0KSB7XG4gICAgICBjb25zdCBpdGVtcyA9IHVuaXEocHJldmlvdXNTZWxlY3RlZC5jb25jYXQoX3RvQXJyYXkoaXRlbSkubWFwKGdldFZhbHVlKSkpO1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShpdGVtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZ2V0VmFsdWUoaXRlbSkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dUeXBlYWhlYWQ6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9vbkJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX29uRXJhc2UgPSBlID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UobnVsbCk7XG4gIH07XG5cbiAgX3Nob3dUeXBlYWhlYWQgPSAoKSA9PiB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2hvd1R5cGVhaGVhZDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJEcm9wZG93bigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERyb3Bkb3duV3JhcHBlciBwbGFjZW1lbnQ9e3RoaXMucHJvcHMucGxhY2VtZW50fT5cbiAgICAgICAgPFR5cGVhaGVhZFxuICAgICAgICAgIGN1c3RvbUNsYXNzZXM9e3tcbiAgICAgICAgICAgIHJlc3VsdHM6ICdsaXN0LXNlbGVjdG9yJyxcbiAgICAgICAgICAgIGlucHV0OiAndHlwZWFoZWFkX19pbnB1dCcsXG4gICAgICAgICAgICBsaXN0SXRlbTogJ2xpc3RfX2l0ZW0nLFxuICAgICAgICAgICAgbGlzdEFuY2hvcjogJ2xpc3RfX2l0ZW1fX2FuY2hvcidcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9wdGlvbnM9e3RoaXMucHJvcHMub3B0aW9uc31cbiAgICAgICAgICBmaWx0ZXJPcHRpb249e3RoaXMucHJvcHMuZmlsdGVyT3B0aW9ufVxuICAgICAgICAgIGZpeGVkT3B0aW9ucz17dGhpcy5wcm9wcy5maXhlZE9wdGlvbnN9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIlxuICAgICAgICAgIG9uT3B0aW9uU2VsZWN0ZWQ9e3RoaXMuX3NlbGVjdEl0ZW19XG4gICAgICAgICAgY3VzdG9tTGlzdENvbXBvbmVudD17dGhpcy5wcm9wcy5Ecm9wRG93blJlbmRlckNvbXBvbmVudH1cbiAgICAgICAgICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50PXt0aGlzLnByb3BzLkRyb3Bkb3duSGVhZGVyQ29tcG9uZW50fVxuICAgICAgICAgIGN1c3RvbUxpc3RJdGVtQ29tcG9uZW50PXt0aGlzLnByb3BzLkRyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnR9XG4gICAgICAgICAgZGlzcGxheU9wdGlvbj17QWNjZXNzb3IuZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0ZvcihcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZGlzcGxheU9wdGlvblxuICAgICAgICAgICl9XG4gICAgICAgICAgc2VhcmNoYWJsZT17dGhpcy5wcm9wcy5zZWFyY2hhYmxlfVxuICAgICAgICAgIHNob3dPcHRpb25zV2hlbkVtcHR5XG4gICAgICAgIC8+XG4gICAgICA8L0Ryb3Bkb3duV3JhcHBlcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gX3RvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IHNlbGVjdGVkLmxlbmd0aDtcbiAgICBjb25zdCBkaXNwbGF5T3B0aW9uID0gQWNjZXNzb3IuZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0ZvcihcbiAgICAgIHRoaXMucHJvcHMuZGlzcGxheU9wdGlvblxuICAgICk7XG5cbiAgICBjb25zdCBkcm9wZG93blNlbGVjdFByb3BzID0ge1xuICAgICAgY2xhc3NOYW1lOiBjbGFzc25hbWVzKGBpdGVtLXNlbGVjdG9yX19kcm9wZG93bmAsIHtcbiAgICAgICAgYWN0aXZlOiB0aGlzLnN0YXRlLnNob3dUeXBlYWhlYWRcbiAgICAgIH0pLFxuICAgICAgZGlzYWJsZWQ6IHRoaXMucHJvcHMuZGlzYWJsZWQsXG4gICAgICBvbkNsaWNrOiB0aGlzLl9zaG93VHlwZWFoZWFkLFxuICAgICAgb25Gb2N1czogdGhpcy5fc2hvd1BvcG92ZXIsXG4gICAgICBlcnJvcjogdGhpcy5wcm9wcy5pc0Vycm9yLFxuICAgICAgaW5wdXRUaGVtZTogdGhpcy5wcm9wcy5pbnB1dFRoZW1lXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW0tc2VsZWN0b3JcIj5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgICAgey8qIHRoaXMgcGFydCBpcyB1c2VkIHRvIGRpc3BsYXkgdGhlIGxhYmVsICovfVxuICAgICAgICAgIHt0aGlzLnByb3BzLm11bHRpU2VsZWN0ID8gKFxuICAgICAgICAgICAgPENoaWNrbGV0ZWRJbnB1dFxuICAgICAgICAgICAgICB7Li4uZHJvcGRvd25TZWxlY3RQcm9wc31cbiAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcz17X3RvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgIGRpc3BsYXlPcHRpb249e2Rpc3BsYXlPcHRpb259XG4gICAgICAgICAgICAgIHJlbW92ZUl0ZW09e3RoaXMuX3JlbW92ZUl0ZW19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8U3R5bGVkRHJvcGRvd25TZWxlY3Qgey4uLmRyb3Bkb3duU2VsZWN0UHJvcHN9PlxuICAgICAgICAgICAgICA8RHJvcGRvd25TZWxlY3RWYWx1ZSBwbGFjZWhvbGRlcj17IWhhc1ZhbHVlfT5cbiAgICAgICAgICAgICAgICB7aGFzVmFsdWUgPyAoXG4gICAgICAgICAgICAgICAgICA8dGhpcy5wcm9wcy5Ecm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlPcHRpb249e2Rpc3BsYXlPcHRpb259XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZFswXX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMucGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L0Ryb3Bkb3duU2VsZWN0VmFsdWU+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmVyYXNhYmxlICYmIGhhc1ZhbHVlID8gKFxuICAgICAgICAgICAgICAgIDxEZWxldGUgaGVpZ2h0PVwiMTJweFwiIG9uQ2xpY2s9e3RoaXMuX29uRXJhc2V9IC8+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgPC9TdHlsZWREcm9wZG93blNlbGVjdD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHsvKiB0aGlzIHBhcnQgaXMgdXNlZCB0byBidWlsdCB0aGUgbGlzdCAqL31cbiAgICAgICAgICB7dGhpcy5zdGF0ZS5zaG93VHlwZWFoZWFkICYmIHRoaXMuX3JlbmRlckRyb3Bkb3duKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5JdGVtU2VsZWN0b3IucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuSXRlbVNlbGVjdG9yLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgbGlzdGVuc1RvQ2xpY2tPdXRzaWRlKEl0ZW1TZWxlY3Rvcik7XG4iXX0=