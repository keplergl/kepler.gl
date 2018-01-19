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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiX3RvQXJyYXkiLCJpdGVtIiwiQXJyYXkiLCJpc0FycmF5IiwiU3R5bGVkRHJvcGRvd25TZWxlY3QiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwiaW5wdXQiLCJkcm9wZG93bkxpc3RBbmNob3IiLCJEcm9wZG93blNlbGVjdFZhbHVlIiwic3BhbiIsInBsYWNlaG9sZGVyIiwic2VsZWN0Q29sb3JQbGFjZUhvbGRlciIsInNlbGVjdENvbG9yIiwiRHJvcGRvd25XcmFwcGVyIiwic2VsZWN0QmFja2dyb3VuZCIsInBsYWNlbWVudCIsImlucHV0Qm94SGVpZ2h0IiwicHJvcFR5cGVzIiwic2VsZWN0ZWRJdGVtcyIsIm9uZU9mVHlwZSIsImFycmF5Iiwic3RyaW5nIiwib2JqZWN0IiwiYm9vbCIsIm9uQ2hhbmdlIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJvcHRpb25zIiwiZml4ZWRPcHRpb25zIiwiZGlzcGxheU9wdGlvbiIsImdldE9wdGlvblZhbHVlIiwiZmlsdGVyT3B0aW9uIiwiZGlzYWJsZWQiLCJpc0Vycm9yIiwibXVsdGlTZWxlY3QiLCJvbkJsdXIiLCJjbG9zZU9uU2VsZWN0IiwiRHJvcGRvd25IZWFkZXJDb21wb25lbnQiLCJEcm9wRG93blJlbmRlckNvbXBvbmVudCIsIkRyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJlcmFzYWJsZSIsInNlYXJjaGFibGUiLCJkcm9wZG93bkhlYWRlciIsIkl0ZW1TZWxlY3RvciIsInN0YXRlIiwic2hvd1R5cGVhaGVhZCIsImhhbmRsZUNsaWNrT3V0c2lkZSIsIl9oaWRlVHlwZWFoZWFkIiwiX29uQmx1ciIsIl9yZW1vdmVJdGVtIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaW5kZXgiLCJmaW5kSW5kZXgiLCJ0IiwiaXRlbXMiLCJzbGljZSIsImxlbmd0aCIsInNldFN0YXRlIiwiX3NlbGVjdEl0ZW0iLCJnZXRWYWx1ZSIsImdlbmVyYXRlT3B0aW9uVG9TdHJpbmdGb3IiLCJwcmV2aW91c1NlbGVjdGVkIiwiY29uY2F0IiwibWFwIiwiX29uRXJhc2UiLCJfc2hvd1R5cGVhaGVhZCIsIl9yZW5kZXJEcm9wZG93biIsInJlc3VsdHMiLCJsaXN0SXRlbSIsImxpc3RBbmNob3IiLCJyZW5kZXIiLCJzZWxlY3RlZCIsImhhc1ZhbHVlIiwiZXZlbnRQcm9wcyIsIm9uQ2xpY2siLCJvbkZvY3VzIiwiX3Nob3dQb3BvdmVyIiwicG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBU0EsUUFBVCxDQUFrQkMsSUFBbEIsRUFBd0I7QUFDdEIsTUFBSUMsTUFBTUMsT0FBTixDQUFjRixJQUFkLENBQUosRUFBeUI7QUFDdkIsV0FBT0EsSUFBUDtBQUNEOztBQUVELE1BQUksT0FBT0EsSUFBUCxLQUFnQixXQUFoQixJQUErQkEsU0FBUyxJQUE1QyxFQUFrRDtBQUNoRCxXQUFPLEVBQVA7QUFDRDs7QUFFRCxTQUFPLENBQUNBLElBQUQsQ0FBUDtBQUNEOztBQUVELElBQU1HLHVCQUF1QiwyQkFBT0MsR0FBOUIsa0JBQ0Y7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLEtBQXJCO0FBQUEsQ0FERSxFQUlBO0FBQUEsU0FBU0YsTUFBTUMsS0FBTixDQUFZRSxrQkFBckI7QUFBQSxDQUpBLENBQU47O0FBUUEsSUFBTUMsc0JBQXNCLDJCQUFPQyxJQUE3QixtQkFDSztBQUFBLFNBQ1BMLE1BQU1NLFdBQU4sR0FDSU4sTUFBTUMsS0FBTixDQUFZTSxzQkFEaEIsR0FFSVAsTUFBTUMsS0FBTixDQUFZTyxXQUhUO0FB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O0FBbUNHLGFBQUt0QixLQUFMLENBQVdDLGFBQVgsSUFBNEIsS0FBS3VCLGVBQUw7QUFuQy9CO0FBREYsS0FERjtBQXlDRCxHOzs7OztBQUdIekIsYUFBYTNCLFNBQWIsR0FBeUJBLFNBQXpCO0FBQ0EyQixhQUFhSixZQUFiLEdBQTRCQSxZQUE1Qjs7a0JBRWUseUJBQXNCSSxZQUF0QixDIiwiZmlsZSI6Iml0ZW0tc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gudW5pcSc7XG5pbXBvcnQgbGlzdGVuc1RvQ2xpY2tPdXRzaWRlIGZyb20gJ3JlYWN0LW9uY2xpY2tvdXRzaWRlL2RlY29yYXRvcic7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IEFjY2Vzc29yIGZyb20gJy4vYWNjZXNzb3InO1xuaW1wb3J0IENoaWNrbGV0ZWRJbnB1dCBmcm9tICcuL2NoaWNrbGV0ZWQtaW5wdXQnO1xuaW1wb3J0IFR5cGVhaGVhZCBmcm9tICcuL3R5cGVhaGVhZCc7XG5pbXBvcnQge0RlbGV0ZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IERyb3Bkb3duTGlzdCwge0xpc3RJdGVtfSBmcm9tICcuL2Ryb3Bkb3duLWxpc3QnO1xuXG4vKipcbiAqIENvbnZlcnRzIG5vbi1hcnJheXMgdG8gYXJyYXlzLiAgTGVhdmVzIGFycmF5cyBhbG9uZS4gIENvbnZlcnRzXG4gKiB1bmRlZmluZWQgdmFsdWVzIHRvIGVtcHR5IGFycmF5cyAoW10gaW5zdGVhZCBvZiBbdW5kZWZpbmVkXSkuXG4gKiBPdGhlcndpc2UsIGp1c3QgcmV0dXJucyBbaXRlbV0gZm9yIG5vbi1hcnJheSBpdGVtcy5cbiAqXG4gKiBAcGFyYW0geyp9IGl0ZW1cbiAqIEByZXR1cm5zIHthcnJheX0gYm9vbSEgbXVjaCBhcnJheS4gdmVyeSBpbmRleGVkLiBzbyB1c2VmdWwuXG4gKi9cbmZ1bmN0aW9uIF90b0FycmF5KGl0ZW0pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcgfHwgaXRlbSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiBbaXRlbV07XG59XG5cbmNvbnN0IFN0eWxlZERyb3Bkb3duU2VsZWN0ID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dH07XG5cbiAgLmxpc3RfX2l0ZW1fX2FuY2hvciB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RBbmNob3J9O1xuICB9XG5gO1xuXG5jb25zdCBEcm9wZG93blNlbGVjdFZhbHVlID0gc3R5bGVkLnNwYW5gXG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMucGxhY2Vob2xkZXJcbiAgICAgID8gcHJvcHMudGhlbWUuc2VsZWN0Q29sb3JQbGFjZUhvbGRlclxuICAgICAgOiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvcn07XG5gO1xuXG5jb25zdCBEcm9wZG93bldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdEJhY2tncm91bmR9O1xuICBib3JkZXI6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBsZWZ0OiAwO1xuICB6LWluZGV4OiAxMDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAke3Byb3BzID0+XG4gICAgcHJvcHMucGxhY2VtZW50ID09PSAndG9wJyA/IHByb3BzLnRoZW1lLmlucHV0Qm94SGVpZ2h0IDogJ2F1dG8nfTtcbiAgbWFyZ2luLXRvcDogJHtwcm9wcyA9PiAocHJvcHMucGxhY2VtZW50ID09PSAnYm90dG9tJyA/ICc0cHgnIDogJ2F1dG8nKX07XG4gIG1hcmdpbi1ib3R0b206ICR7cHJvcHMgPT4gKHByb3BzLnBsYWNlbWVudCA9PT0gJ3RvcCcgPyAnNHB4JyA6ICdhdXRvJyl9O1xuYDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICAvLyByZXF1aXJlZCBwcm9wZXJ0aWVzXG4gIHNlbGVjdGVkSXRlbXM6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgIFByb3BUeXBlcy5hcnJheSxcbiAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIFByb3BUeXBlcy5vYmplY3QsXG4gICAgUHJvcFR5cGVzLmJvb2xcbiAgXSksXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvcHRpb25zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcblxuICAvLyBvcHRpb25hbCBwcm9wZXJ0aWVzXG4gIGZpeGVkT3B0aW9uczogUHJvcFR5cGVzLmFycmF5LFxuICBkaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBnZXRPcHRpb25WYWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgZmlsdGVyT3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICBwbGFjZW1lbnQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNFcnJvcjogUHJvcFR5cGVzLmJvb2wsXG4gIG11bHRpU2VsZWN0OiBQcm9wVHlwZXMuYm9vbCxcbiAgb25CbHVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgcGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsb3NlT25TZWxlY3Q6IFByb3BUeXBlcy5ib29sLFxuICBEcm9wZG93bkhlYWRlckNvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmMsXG4gIERyb3BEb3duUmVuZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgZXJhc2FibGU6IGZhbHNlLFxuICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICBzZWxlY3RlZEl0ZW1zOiBbXSxcbiAgZGlzcGxheU9wdGlvbjogbnVsbCxcbiAgZ2V0T3B0aW9uVmFsdWU6IG51bGwsXG4gIGZpbHRlck9wdGlvbjogbnVsbCxcbiAgZml4ZWRPcHRpb25zOiBudWxsLFxuICBtdWx0aVNlbGVjdDogdHJ1ZSxcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciBhIHZhbHVlJyxcbiAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcbiAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgZHJvcGRvd25IZWFkZXI6IG51bGwsXG4gIERyb3Bkb3duSGVhZGVyQ29tcG9uZW50OiBudWxsLFxuICBEcm9wRG93blJlbmRlckNvbXBvbmVudDogRHJvcGRvd25MaXN0LFxuICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50OiBMaXN0SXRlbVxufTtcblxuY2xhc3MgSXRlbVNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgc2hvd1R5cGVhaGVhZDogZmFsc2VcbiAgfTtcblxuICBoYW5kbGVDbGlja091dHNpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy5faGlkZVR5cGVhaGVhZCgpO1xuICB9O1xuXG4gIF9oaWRlVHlwZWFoZWFkKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dUeXBlYWhlYWQ6IGZhbHNlfSk7XG4gICAgdGhpcy5fb25CbHVyKCk7XG4gIH1cblxuICBfb25CbHVyID0gKCkgPT4ge1xuICAgIC8vIG5vdGU6IGNoaWNrbGV0ZWQgaW5wdXQgaXMgbm90IGEgcmVhbCBmb3JtIGVsZW1lbnQgc28gd2UgY2FsbCBvbkJsdXIoKVxuICAgIC8vIHdoZW4gd2UgZmVlbCB0aGUgZXZlbnRzIGFyZSBhcHByb3ByaWF0ZVxuICAgIGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuICAgICAgdGhpcy5wcm9wcy5vbkJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbW92ZUl0ZW0gPSAoaXRlbSwgZSkgPT4ge1xuICAgIC8vIG9ubHkgdXNlZCB3aGVuIG11bHRpU2VsZWN0ID0gdHJ1ZVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHtzZWxlY3RlZEl0ZW1zfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaW5kZXggPSBzZWxlY3RlZEl0ZW1zLmZpbmRJbmRleCh0ID0+IHQgPT09IGl0ZW0pO1xuXG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgLi4uc2VsZWN0ZWRJdGVtcy5zbGljZSgwLCBpbmRleCksXG4gICAgICAuLi5zZWxlY3RlZEl0ZW1zLnNsaWNlKGluZGV4ICsgMSwgc2VsZWN0ZWRJdGVtcy5sZW5ndGgpXG4gICAgXTtcblxuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoaXRlbXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1R5cGVhaGVhZDogZmFsc2V9KTtcbiAgICAgIHRoaXMuX29uQmx1cigpO1xuICAgIH1cbiAgfTtcblxuICBfc2VsZWN0SXRlbSA9IGl0ZW0gPT4ge1xuICAgIGNvbnN0IGdldFZhbHVlID0gQWNjZXNzb3IuZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0ZvcihcbiAgICAgIHRoaXMucHJvcHMuZ2V0T3B0aW9uVmFsdWUgfHwgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgKTtcblxuICAgIGNvbnN0IHByZXZpb3VzU2VsZWN0ZWQgPSBfdG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlTZWxlY3QpIHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gdW5pcShwcmV2aW91c1NlbGVjdGVkLmNvbmNhdChfdG9BcnJheShpdGVtKS5tYXAoZ2V0VmFsdWUpKSk7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGl0ZW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShnZXRWYWx1ZShpdGVtKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1R5cGVhaGVhZDogZmFsc2V9KTtcbiAgICAgIHRoaXMuX29uQmx1cigpO1xuICAgIH1cbiAgfTtcblxuICBfb25FcmFzZSA9IGUgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShudWxsKTtcbiAgfTtcblxuICBfc2hvd1R5cGVhaGVhZCA9ICgpID0+IHtcbiAgICBpZiAoIXRoaXMucHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzaG93VHlwZWFoZWFkOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckRyb3Bkb3duKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RHJvcGRvd25XcmFwcGVyIHBsYWNlbWVudD17dGhpcy5wcm9wcy5wbGFjZW1lbnR9PlxuICAgICAgICA8VHlwZWFoZWFkXG4gICAgICAgICAgY3VzdG9tQ2xhc3Nlcz17e1xuICAgICAgICAgICAgcmVzdWx0czogJ2xpc3Qtc2VsZWN0b3InLFxuICAgICAgICAgICAgaW5wdXQ6ICd0eXBlYWhlYWRfX2lucHV0JyxcbiAgICAgICAgICAgIGxpc3RJdGVtOiAnbGlzdF9faXRlbScsXG4gICAgICAgICAgICBsaXN0QW5jaG9yOiAnbGlzdF9faXRlbV9fYW5jaG9yJ1xuICAgICAgICAgIH19XG4gICAgICAgICAgb3B0aW9ucz17dGhpcy5wcm9wcy5vcHRpb25zfVxuICAgICAgICAgIGZpbHRlck9wdGlvbj17dGhpcy5wcm9wcy5maWx0ZXJPcHRpb259XG4gICAgICAgICAgZml4ZWRPcHRpb25zPXt0aGlzLnByb3BzLmZpeGVkT3B0aW9uc31cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaFwiXG4gICAgICAgICAgb25PcHRpb25TZWxlY3RlZD17dGhpcy5fc2VsZWN0SXRlbX1cbiAgICAgICAgICBjdXN0b21MaXN0Q29tcG9uZW50PXt0aGlzLnByb3BzLkRyb3BEb3duUmVuZGVyQ29tcG9uZW50fVxuICAgICAgICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ9e3RoaXMucHJvcHMuRHJvcGRvd25IZWFkZXJDb21wb25lbnR9XG4gICAgICAgICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ9e3RoaXMucHJvcHMuRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudH1cbiAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtBY2Nlc3Nvci5nZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yKFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgICAgICAgKX1cbiAgICAgICAgICBzZWFyY2hhYmxlPXt0aGlzLnByb3BzLnNlYXJjaGFibGV9XG4gICAgICAgICAgc2hvd09wdGlvbnNXaGVuRW1wdHlcbiAgICAgICAgLz5cbiAgICAgIDwvRHJvcGRvd25XcmFwcGVyPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBfdG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpO1xuICAgIGNvbnN0IGhhc1ZhbHVlID0gc2VsZWN0ZWQubGVuZ3RoO1xuICAgIGNvbnN0IGRpc3BsYXlPcHRpb24gPSBBY2Nlc3Nvci5nZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yKFxuICAgICAgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgKTtcbiAgICBjb25zdCBldmVudFByb3BzID0ge1xuICAgICAgb25DbGljazogdGhpcy5fc2hvd1R5cGVhaGVhZCxcbiAgICAgIG9uRm9jdXM6IHRoaXMuX3Nob3dQb3BvdmVyXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW0tc2VsZWN0b3JcIj5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgICAgey8qIHRoaXMgcGFydCBpcyB1c2VkIHRvIGRpc3BsYXkgdGhlIGxhYmVsICovfVxuICAgICAgICAgIHt0aGlzLnByb3BzLm11bHRpU2VsZWN0ID8gKFxuICAgICAgICAgICAgPENoaWNrbGV0ZWRJbnB1dFxuICAgICAgICAgICAgICB7Li4uZXZlbnRQcm9wc31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG4gICAgICAgICAgICAgIGlzRXJyb3I9e3RoaXMucHJvcHMuaXNFcnJvcn1cbiAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcz17X3RvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKX1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgIGRpc3BsYXlPcHRpb249e2Rpc3BsYXlPcHRpb259XG4gICAgICAgICAgICAgIHJlbW92ZUl0ZW09e3RoaXMuX3JlbW92ZUl0ZW19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8U3R5bGVkRHJvcGRvd25TZWxlY3RcbiAgICAgICAgICAgICAgey4uLmV2ZW50UHJvcHN9XG4gICAgICAgICAgICAgIGFjdGl2ZT17dGhpcy5zdGF0ZS5zaG93VHlwZWFoZWFkfVxuICAgICAgICAgICAgICBlcnJvcj17dGhpcy5wcm9wcy5pc0Vycm9yfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPERyb3Bkb3duU2VsZWN0VmFsdWUgcGxhY2Vob2xkZXI9eyFoYXNWYWx1ZX0+XG4gICAgICAgICAgICAgICAge2hhc1ZhbHVlID8gKFxuICAgICAgICAgICAgICAgICAgPHRoaXMucHJvcHMuRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtkaXNwbGF5T3B0aW9ufVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VsZWN0ZWRbMF19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9Ecm9wZG93blNlbGVjdFZhbHVlPlxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5lcmFzYWJsZSAmJiBoYXNWYWx1ZSA/IChcbiAgICAgICAgICAgICAgICA8RGVsZXRlIGhlaWdodD1cIjEycHhcIiBvbkNsaWNrPXt0aGlzLl9vbkVyYXNlfSAvPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDwvU3R5bGVkRHJvcGRvd25TZWxlY3Q+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7LyogdGhpcyBwYXJ0IGlzIHVzZWQgdG8gYnVpbHQgdGhlIGxpc3QgKi99XG4gICAgICAgICAge3RoaXMuc3RhdGUuc2hvd1R5cGVhaGVhZCAmJiB0aGlzLl9yZW5kZXJEcm9wZG93bigpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuSXRlbVNlbGVjdG9yLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkl0ZW1TZWxlY3Rvci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IGxpc3RlbnNUb0NsaWNrT3V0c2lkZShJdGVtU2VsZWN0b3IpO1xuIl19