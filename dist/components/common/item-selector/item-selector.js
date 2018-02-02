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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ';\n\n  .list__item__anchor {\n    ', ';\n  }\n'], ['\n  ', ';\n\n  .list__item__anchor {\n    ', ';\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n'], ['\n  color: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background: ', ';\n  border: 0;\n  width: 100%;\n  left: 0;\n  z-index: 100;\n  position: absolute;\n  bottom: ', ';\n  margin-top: ', ';\n  margin-bottom: ', ';\n'], ['\n  background: ', ';\n  border: 0;\n  width: 100%;\n  left: 0;\n  z-index: 100;\n  position: absolute;\n  bottom: ', ';\n  margin-top: ', ';\n  margin-bottom: ', ';\n']);

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
  };

  return ItemSelector;
}(_react.Component);

ItemSelector.propTypes = propTypes;
ItemSelector.defaultProps = defaultProps;

exports.default = (0, _decorator2.default)(ItemSelector);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiX3RvQXJyYXkiLCJpdGVtIiwiQXJyYXkiLCJpc0FycmF5IiwiU3R5bGVkRHJvcGRvd25TZWxlY3QiLCJkaXYiLCJwcm9wcyIsImlucHV0VGhlbWUiLCJ0aGVtZSIsInNlY29uZGFyeUlucHV0IiwiaW5wdXQiLCJkcm9wZG93bkxpc3RBbmNob3IiLCJEcm9wZG93blNlbGVjdFZhbHVlIiwic3BhbiIsInBsYWNlaG9sZGVyIiwic2VsZWN0Q29sb3JQbGFjZUhvbGRlciIsInNlbGVjdENvbG9yIiwiRHJvcGRvd25XcmFwcGVyIiwiZHJvcGRvd25CZ2QiLCJwbGFjZW1lbnQiLCJpbnB1dEJveEhlaWdodCIsInByb3BUeXBlcyIsInNlbGVjdGVkSXRlbXMiLCJhbnkiLCJvbkNoYW5nZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwib3B0aW9ucyIsImFycmF5IiwiZml4ZWRPcHRpb25zIiwiZGlzcGxheU9wdGlvbiIsIm9uZU9mVHlwZSIsInN0cmluZyIsImdldE9wdGlvblZhbHVlIiwiZmlsdGVyT3B0aW9uIiwiZGlzYWJsZWQiLCJib29sIiwiaXNFcnJvciIsIm11bHRpU2VsZWN0Iiwib25CbHVyIiwiY2xvc2VPblNlbGVjdCIsIkRyb3Bkb3duSGVhZGVyQ29tcG9uZW50IiwiRHJvcERvd25SZW5kZXJDb21wb25lbnQiLCJEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwiZXJhc2FibGUiLCJzZWFyY2hhYmxlIiwiZHJvcGRvd25IZWFkZXIiLCJJdGVtU2VsZWN0b3IiLCJzdGF0ZSIsInNob3dUeXBlYWhlYWQiLCJoYW5kbGVDbGlja091dHNpZGUiLCJfaGlkZVR5cGVhaGVhZCIsIl9vbkJsdXIiLCJfcmVtb3ZlSXRlbSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImluZGV4IiwiZmluZEluZGV4IiwidCIsIml0ZW1zIiwic2xpY2UiLCJsZW5ndGgiLCJzZXRTdGF0ZSIsIl9zZWxlY3RJdGVtIiwiZ2V0VmFsdWUiLCJnZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yIiwicHJldmlvdXNTZWxlY3RlZCIsImNvbmNhdCIsIm1hcCIsIl9vbkVyYXNlIiwiX3Nob3dUeXBlYWhlYWQiLCJfcmVuZGVyRHJvcGRvd24iLCJyZXN1bHRzIiwibGlzdEl0ZW0iLCJsaXN0QW5jaG9yIiwicmVuZGVyIiwic2VsZWN0ZWQiLCJoYXNWYWx1ZSIsImRyb3Bkb3duU2VsZWN0UHJvcHMiLCJjbGFzc05hbWUiLCJhY3RpdmUiLCJvbkNsaWNrIiwib25Gb2N1cyIsIl9zaG93UG9wb3ZlciIsImVycm9yIiwicG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFTQSxRQUFULENBQWtCQyxJQUFsQixFQUF3QjtBQUN0QixNQUFJQyxNQUFNQyxPQUFOLENBQWNGLElBQWQsQ0FBSixFQUF5QjtBQUN2QixXQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsTUFBSSxPQUFPQSxJQUFQLEtBQWdCLFdBQWhCLElBQStCQSxTQUFTLElBQTVDLEVBQWtEO0FBQ2hELFdBQU8sRUFBUDtBQUNEOztBQUVELFNBQU8sQ0FBQ0EsSUFBRCxDQUFQO0FBQ0Q7O0FBRUQsSUFBTUcsdUJBQXVCLDJCQUFPQyxHQUE5QixrQkFDRjtBQUFBLFNBQ0FDLE1BQU1DLFVBQU4sS0FBcUIsV0FBckIsR0FDSUQsTUFBTUUsS0FBTixDQUFZQyxjQURoQixHQUVJSCxNQUFNRSxLQUFOLENBQVlFLEtBSGhCO0FBQUEsQ0FERSxFQU9BO0FBQUEsU0FBU0osTUFBTUUsS0FBTixDQUFZRyxrQkFBckI7QUFBQSxDQVBB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LFFBQVgsSUFBdUJrQyxRQUF2QixHQUNDLCtDQUFRLFFBQU8sTUFBZixFQUFzQixTQUFTLEtBQUtSLFFBQXBDLEdBREQsR0FFRztBQWJOLFNBWEo7QUE0QkcsYUFBS3RCLEtBQUwsQ0FBV0MsYUFBWCxJQUE0QixLQUFLdUIsZUFBTDtBQTVCL0I7QUFERixLQURGO0FBa0NELEc7Ozs7O0FBR0h6QixhQUFhM0IsU0FBYixHQUF5QkEsU0FBekI7QUFDQTJCLGFBQWFKLFlBQWIsR0FBNEJBLFlBQTVCOztrQkFFZSx5QkFBc0JJLFlBQXRCLEMiLCJmaWxlIjoiaXRlbS1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IGxpc3RlbnNUb0NsaWNrT3V0c2lkZSBmcm9tICdyZWFjdC1vbmNsaWNrb3V0c2lkZS9kZWNvcmF0b3InO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBBY2Nlc3NvciBmcm9tICcuL2FjY2Vzc29yJztcbmltcG9ydCBDaGlja2xldGVkSW5wdXQgZnJvbSAnLi9jaGlja2xldGVkLWlucHV0JztcbmltcG9ydCBUeXBlYWhlYWQgZnJvbSAnLi90eXBlYWhlYWQnO1xuaW1wb3J0IHtEZWxldGV9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBEcm9wZG93bkxpc3QsIHtMaXN0SXRlbX0gZnJvbSAnLi9kcm9wZG93bi1saXN0JztcblxuLyoqXG4gKiBDb252ZXJ0cyBub24tYXJyYXlzIHRvIGFycmF5cy4gIExlYXZlcyBhcnJheXMgYWxvbmUuICBDb252ZXJ0c1xuICogdW5kZWZpbmVkIHZhbHVlcyB0byBlbXB0eSBhcnJheXMgKFtdIGluc3RlYWQgb2YgW3VuZGVmaW5lZF0pLlxuICogT3RoZXJ3aXNlLCBqdXN0IHJldHVybnMgW2l0ZW1dIGZvciBub24tYXJyYXkgaXRlbXMuXG4gKlxuICogQHBhcmFtIHsqfSBpdGVtXG4gKiBAcmV0dXJucyB7YXJyYXl9IGJvb20hIG11Y2ggYXJyYXkuIHZlcnkgaW5kZXhlZC4gc28gdXNlZnVsLlxuICovXG5mdW5jdGlvbiBfdG9BcnJheShpdGVtKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBpZiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnIHx8IGl0ZW0gPT09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICByZXR1cm4gW2l0ZW1dO1xufVxuXG5jb25zdCBTdHlsZWREcm9wZG93blNlbGVjdCA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT5cbiAgICBwcm9wcy5pbnB1dFRoZW1lID09PSAnc2Vjb25kYXJ5J1xuICAgICAgPyBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dFxuICAgICAgOiBwcm9wcy50aGVtZS5pbnB1dH07XG5cbiAgLmxpc3RfX2l0ZW1fX2FuY2hvciB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RBbmNob3J9O1xuICB9XG5gO1xuXG5jb25zdCBEcm9wZG93blNlbGVjdFZhbHVlID0gc3R5bGVkLnNwYW5gXG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMucGxhY2Vob2xkZXJcbiAgICAgID8gcHJvcHMudGhlbWUuc2VsZWN0Q29sb3JQbGFjZUhvbGRlclxuICAgICAgOiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvcn07XG5gO1xuXG5jb25zdCBEcm9wZG93bldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duQmdkfTtcbiAgYm9yZGVyOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgbGVmdDogMDtcbiAgei1pbmRleDogMTAwO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogJHtwcm9wcyA9PlxuICAgIHByb3BzLnBsYWNlbWVudCA9PT0gJ3RvcCcgPyBwcm9wcy50aGVtZS5pbnB1dEJveEhlaWdodCA6ICdhdXRvJ307XG4gIG1hcmdpbi10b3A6ICR7cHJvcHMgPT4gKHByb3BzLnBsYWNlbWVudCA9PT0gJ2JvdHRvbScgPyAnNHB4JyA6ICdhdXRvJyl9O1xuICBtYXJnaW4tYm90dG9tOiAke3Byb3BzID0+IChwcm9wcy5wbGFjZW1lbnQgPT09ICd0b3AnID8gJzRweCcgOiAnYXV0bycpfTtcbmA7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgLy8gcmVxdWlyZWQgcHJvcGVydGllc1xuICBzZWxlY3RlZEl0ZW1zOiBQcm9wVHlwZXMuYW55LFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb3B0aW9uczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG5cbiAgLy8gb3B0aW9uYWwgcHJvcGVydGllc1xuICBmaXhlZE9wdGlvbnM6IFByb3BUeXBlcy5hcnJheSxcbiAgZGlzcGxheU9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgZ2V0T3B0aW9uVmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5mdW5jXSksXG4gIGZpbHRlck9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgcGxhY2VtZW50OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICBtdWx0aVNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gIGlucHV0VGhlbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbG9zZU9uU2VsZWN0OiBQcm9wVHlwZXMuYm9vbCxcbiAgRHJvcGRvd25IZWFkZXJDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICBEcm9wRG93blJlbmRlckNvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmMsXG4gIERyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGVyYXNhYmxlOiBmYWxzZSxcbiAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgc2VsZWN0ZWRJdGVtczogW10sXG4gIGRpc3BsYXlPcHRpb246IG51bGwsXG4gIGdldE9wdGlvblZhbHVlOiBudWxsLFxuICBmaWx0ZXJPcHRpb246IG51bGwsXG4gIGZpeGVkT3B0aW9uczogbnVsbCxcbiAgaW5wdXRUaGVtZTogJ3ByaW1hcnknLFxuICBtdWx0aVNlbGVjdDogdHJ1ZSxcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciBhIHZhbHVlJyxcbiAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcbiAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgZHJvcGRvd25IZWFkZXI6IG51bGwsXG4gIERyb3Bkb3duSGVhZGVyQ29tcG9uZW50OiBudWxsLFxuICBEcm9wRG93blJlbmRlckNvbXBvbmVudDogRHJvcGRvd25MaXN0LFxuICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50OiBMaXN0SXRlbVxufTtcblxuY2xhc3MgSXRlbVNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgc2hvd1R5cGVhaGVhZDogZmFsc2VcbiAgfTtcblxuICBoYW5kbGVDbGlja091dHNpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy5faGlkZVR5cGVhaGVhZCgpO1xuICB9O1xuXG4gIF9oaWRlVHlwZWFoZWFkKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dUeXBlYWhlYWQ6IGZhbHNlfSk7XG4gICAgdGhpcy5fb25CbHVyKCk7XG4gIH1cblxuICBfb25CbHVyID0gKCkgPT4ge1xuICAgIC8vIG5vdGU6IGNoaWNrbGV0ZWQgaW5wdXQgaXMgbm90IGEgcmVhbCBmb3JtIGVsZW1lbnQgc28gd2UgY2FsbCBvbkJsdXIoKVxuICAgIC8vIHdoZW4gd2UgZmVlbCB0aGUgZXZlbnRzIGFyZSBhcHByb3ByaWF0ZVxuICAgIGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuICAgICAgdGhpcy5wcm9wcy5vbkJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbW92ZUl0ZW0gPSAoaXRlbSwgZSkgPT4ge1xuICAgIC8vIG9ubHkgdXNlZCB3aGVuIG11bHRpU2VsZWN0ID0gdHJ1ZVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHtzZWxlY3RlZEl0ZW1zfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaW5kZXggPSBzZWxlY3RlZEl0ZW1zLmZpbmRJbmRleCh0ID0+IHQgPT09IGl0ZW0pO1xuXG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgLi4uc2VsZWN0ZWRJdGVtcy5zbGljZSgwLCBpbmRleCksXG4gICAgICAuLi5zZWxlY3RlZEl0ZW1zLnNsaWNlKGluZGV4ICsgMSwgc2VsZWN0ZWRJdGVtcy5sZW5ndGgpXG4gICAgXTtcblxuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoaXRlbXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1R5cGVhaGVhZDogZmFsc2V9KTtcbiAgICAgIHRoaXMuX29uQmx1cigpO1xuICAgIH1cbiAgfTtcblxuICBfc2VsZWN0SXRlbSA9IGl0ZW0gPT4ge1xuICAgIGNvbnN0IGdldFZhbHVlID0gQWNjZXNzb3IuZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0ZvcihcbiAgICAgIHRoaXMucHJvcHMuZ2V0T3B0aW9uVmFsdWUgfHwgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgKTtcblxuICAgIGNvbnN0IHByZXZpb3VzU2VsZWN0ZWQgPSBfdG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlTZWxlY3QpIHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gdW5pcShwcmV2aW91c1NlbGVjdGVkLmNvbmNhdChfdG9BcnJheShpdGVtKS5tYXAoZ2V0VmFsdWUpKSk7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGl0ZW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShnZXRWYWx1ZShpdGVtKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1R5cGVhaGVhZDogZmFsc2V9KTtcbiAgICAgIHRoaXMuX29uQmx1cigpO1xuICAgIH1cbiAgfTtcblxuICBfb25FcmFzZSA9IGUgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShudWxsKTtcbiAgfTtcblxuICBfc2hvd1R5cGVhaGVhZCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMucHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzaG93VHlwZWFoZWFkOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckRyb3Bkb3duKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RHJvcGRvd25XcmFwcGVyIHBsYWNlbWVudD17dGhpcy5wcm9wcy5wbGFjZW1lbnR9PlxuICAgICAgICA8VHlwZWFoZWFkXG4gICAgICAgICAgY3VzdG9tQ2xhc3Nlcz17e1xuICAgICAgICAgICAgcmVzdWx0czogJ2xpc3Qtc2VsZWN0b3InLFxuICAgICAgICAgICAgaW5wdXQ6ICd0eXBlYWhlYWRfX2lucHV0JyxcbiAgICAgICAgICAgIGxpc3RJdGVtOiAnbGlzdF9faXRlbScsXG4gICAgICAgICAgICBsaXN0QW5jaG9yOiAnbGlzdF9faXRlbV9fYW5jaG9yJ1xuICAgICAgICAgIH19XG4gICAgICAgICAgb3B0aW9ucz17dGhpcy5wcm9wcy5vcHRpb25zfVxuICAgICAgICAgIGZpbHRlck9wdGlvbj17dGhpcy5wcm9wcy5maWx0ZXJPcHRpb259XG4gICAgICAgICAgZml4ZWRPcHRpb25zPXt0aGlzLnByb3BzLmZpeGVkT3B0aW9uc31cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaFwiXG4gICAgICAgICAgb25PcHRpb25TZWxlY3RlZD17dGhpcy5fc2VsZWN0SXRlbX1cbiAgICAgICAgICBjdXN0b21MaXN0Q29tcG9uZW50PXt0aGlzLnByb3BzLkRyb3BEb3duUmVuZGVyQ29tcG9uZW50fVxuICAgICAgICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ9e3RoaXMucHJvcHMuRHJvcGRvd25IZWFkZXJDb21wb25lbnR9XG4gICAgICAgICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ9e3RoaXMucHJvcHMuRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudH1cbiAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtBY2Nlc3Nvci5nZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yKFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgICAgICAgKX1cbiAgICAgICAgICBzZWFyY2hhYmxlPXt0aGlzLnByb3BzLnNlYXJjaGFibGV9XG4gICAgICAgICAgc2hvd09wdGlvbnNXaGVuRW1wdHlcbiAgICAgICAgLz5cbiAgICAgIDwvRHJvcGRvd25XcmFwcGVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBfdG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gc2VsZWN0ZWQubGVuZ3RoO1xuICAgIGNvbnN0IGRpc3BsYXlPcHRpb24gPSBBY2Nlc3Nvci5nZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yKFxuICAgICAgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgKTtcblxuICAgIGNvbnN0IGRyb3Bkb3duU2VsZWN0UHJvcHMgPSB7XG4gICAgICBjbGFzc05hbWU6IGNsYXNzbmFtZXMoYGl0ZW0tc2VsZWN0b3JfX2Ryb3Bkb3duYCwge1xuICAgICAgICBhY3RpdmU6IHRoaXMuc3RhdGUuc2hvd1R5cGVhaGVhZFxuICAgICAgfSksXG4gICAgICBkaXNhYmxlZDogdGhpcy5wcm9wcy5kaXNhYmxlZCxcbiAgICAgIG9uQ2xpY2s6IHRoaXMuX3Nob3dUeXBlYWhlYWQsXG4gICAgICBvbkZvY3VzOiB0aGlzLl9zaG93UG9wb3ZlcixcbiAgICAgIGVycm9yOiB0aGlzLnByb3BzLmlzRXJyb3IsXG4gICAgICBpbnB1dFRoZW1lOiB0aGlzLnByb3BzLmlucHV0VGhlbWVcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1zZWxlY3RvclwiPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgICAgICB7LyogdGhpcyBwYXJ0IGlzIHVzZWQgdG8gZGlzcGxheSB0aGUgbGFiZWwgKi99XG4gICAgICAgICAge3RoaXMucHJvcHMubXVsdGlTZWxlY3QgPyAoXG4gICAgICAgICAgICA8Q2hpY2tsZXRlZElucHV0XG4gICAgICAgICAgICAgIHsuLi5kcm9wZG93blNlbGVjdFByb3BzfVxuICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXtfdG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgZGlzcGxheU9wdGlvbj17ZGlzcGxheU9wdGlvbn1cbiAgICAgICAgICAgICAgcmVtb3ZlSXRlbT17dGhpcy5fcmVtb3ZlSXRlbX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxTdHlsZWREcm9wZG93blNlbGVjdCB7Li4uZHJvcGRvd25TZWxlY3RQcm9wc30+XG4gICAgICAgICAgICAgIDxEcm9wZG93blNlbGVjdFZhbHVlIHBsYWNlaG9sZGVyPXshaGFzVmFsdWV9PlxuICAgICAgICAgICAgICAgIHtoYXNWYWx1ZSA/IChcbiAgICAgICAgICAgICAgICAgIDx0aGlzLnByb3BzLkRyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU9wdGlvbj17ZGlzcGxheU9wdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlbGVjdGVkWzBdfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvRHJvcGRvd25TZWxlY3RWYWx1ZT5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuZXJhc2FibGUgJiYgaGFzVmFsdWUgPyAoXG4gICAgICAgICAgICAgICAgPERlbGV0ZSBoZWlnaHQ9XCIxMnB4XCIgb25DbGljaz17dGhpcy5fb25FcmFzZX0gLz5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICA8L1N0eWxlZERyb3Bkb3duU2VsZWN0PlxuICAgICAgICAgICl9XG4gICAgICAgICAgey8qIHRoaXMgcGFydCBpcyB1c2VkIHRvIGJ1aWx0IHRoZSBsaXN0ICovfVxuICAgICAgICAgIHt0aGlzLnN0YXRlLnNob3dUeXBlYWhlYWQgJiYgdGhpcy5fcmVuZGVyRHJvcGRvd24oKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkl0ZW1TZWxlY3Rvci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5JdGVtU2VsZWN0b3IuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5leHBvcnQgZGVmYXVsdCBsaXN0ZW5zVG9DbGlja091dHNpZGUoSXRlbVNlbGVjdG9yKTtcbiJdfQ==