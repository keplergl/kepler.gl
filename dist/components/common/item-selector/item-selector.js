"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = _interopRequireDefault(require("lodash.uniqby"));

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _accessor = _interopRequireDefault(require("./accessor"));

var _chickletedInput = _interopRequireDefault(require("./chickleted-input"));

var _typeahead = _interopRequireDefault(require("./typeahead"));

var _icons = require("../icons");

var _dropdownList = _interopRequireWildcard(require("./dropdown-list"));

var _utils = require("../../../utils/utils");

var _reactIntl = require("react-intl");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  border: 0;\n  width: 100%;\n  left: 0;\n  z-index: ", ";\n  position: absolute;\n  bottom: ", ";\n  margin-top: ", ";\n  margin-bottom: ", ";\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: 6px;\n  display: flex;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  overflow: hidden;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n\n  .list__item__anchor {\n    ", ";\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledDropdownSelect = _styledComponents["default"].div.attrs({
  className: 'item-selector__dropdown'
})(_templateObject(), function (props) {
  return props.inputTheme === 'secondary' ? props.theme.secondaryInput : props.theme.input;
}, function (props) {
  return props.theme.dropdownListAnchor;
});

var DropdownSelectValue = _styledComponents["default"].span(_templateObject2(), function (props) {
  return props.hasPlaceholder ? props.theme.selectColorPlaceHolder : props.theme.selectColor;
});

var DropdownSelectErase = _styledComponents["default"].div(_templateObject3());

var DropdownWrapper = _styledComponents["default"].div(_templateObject4(), function (props) {
  return props.theme.dropdownWrapperZ;
}, function (props) {
  return props.placement === 'top' ? props.theme.inputBoxHeight : 'auto';
}, function (props) {
  return props.placement === 'bottom' ? '4px' : 'auto';
}, function (props) {
  return props.placement === 'top' ? '4px' : 'auto';
});

var ItemSelector =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ItemSelector, _Component);

  function ItemSelector() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, ItemSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(ItemSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      showTypeahead: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function () {
      _this._hideTypeahead();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onBlur", function () {
      // note: chickleted input is not a real form element so we call onBlur()
      // when we feel the events are appropriate
      if (_this.props.onBlur) {
        _this.props.onBlur();
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_removeItem", function (item, e) {
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

      var items = [].concat((0, _toConsumableArray2["default"])(selectedItems.slice(0, index)), (0, _toConsumableArray2["default"])(selectedItems.slice(index + 1, selectedItems.length)));

      _this.props.onChange(items);

      if (_this.props.closeOnSelect) {
        _this.setState({
          showTypeahead: false
        });

        _this._onBlur();
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_selectItem", function (item) {
      var getValue = _accessor["default"].generateOptionToStringFor(_this.props.getOptionValue || _this.props.displayOption);

      var previousSelected = (0, _utils.toArray)(_this.props.selectedItems);

      if (_this.props.multiSelect) {
        var items = (0, _lodash["default"])(previousSelected.concat((0, _utils.toArray)(item)), getValue);

        _this.props.onChange(items);
      } else {
        _this.props.onChange(getValue(item));
      }

      if (_this.props.closeOnSelect) {
        _this.setState({
          showTypeahead: false
        });

        _this._onBlur();
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onErase", function (e) {
      e.stopPropagation();

      _this.props.onChange(null);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_showTypeahead", function (e) {
      e.stopPropagation();

      if (!_this.props.disabled) {
        _this.setState({
          showTypeahead: true
        });
      }
    });
    return _this;
  }

  (0, _createClass2["default"])(ItemSelector, [{
    key: "_hideTypeahead",
    value: function _hideTypeahead() {
      this.setState({
        showTypeahead: false
      });

      this._onBlur();
    }
  }, {
    key: "_renderDropdown",
    value: function _renderDropdown(intl) {
      return _react["default"].createElement(DropdownWrapper, {
        placement: this.props.placement
      }, _react["default"].createElement(_typeahead["default"], {
        customClasses: {
          results: 'list-selector',
          input: 'typeahead__input',
          listItem: 'list__item',
          listAnchor: 'list__item__anchor'
        },
        options: this.props.options,
        filterOption: this.props.filterOption,
        fixedOptions: this.props.fixedOptions,
        placeholder: intl.formatMessage({
          id: 'placeholder.search'
        }),
        onOptionSelected: this._selectItem,
        customListComponent: this.props.DropDownRenderComponent,
        customListHeaderComponent: this.props.DropdownHeaderComponent,
        customListItemComponent: this.props.DropDownLineItemRenderComponent,
        displayOption: _accessor["default"].generateOptionToStringFor(this.props.displayOption),
        searchable: this.props.searchable,
        showOptionsWhenEmpty: true,
        selectedItems: (0, _utils.toArray)(this.props.selectedItems)
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var selected = (0, _utils.toArray)(this.props.selectedItems);
      var hasValue = selected.length;

      var displayOption = _accessor["default"].generateOptionToStringFor(this.props.displayOption);

      var dropdownSelectProps = {
        className: (0, _classnames["default"])({
          active: this.state.showTypeahead
        }),
        disabled: this.props.disabled,
        onClick: this._showTypeahead,
        onFocus: this._showPopover,
        error: this.props.isError,
        inputTheme: this.props.inputTheme
      };
      var intl = this.props.intl;
      return _react["default"].createElement("div", {
        className: "item-selector"
      }, _react["default"].createElement("div", {
        style: {
          position: 'relative'
        }
      }, this.props.multiSelect ? _react["default"].createElement(_chickletedInput["default"], (0, _extends2["default"])({}, dropdownSelectProps, {
        selectedItems: (0, _utils.toArray)(this.props.selectedItems),
        placeholder: this.props.placeholder,
        displayOption: displayOption,
        removeItem: this._removeItem,
        CustomChickletComponent: this.props.CustomChickletComponent
      })) : _react["default"].createElement(StyledDropdownSelect, dropdownSelectProps, _react["default"].createElement(DropdownSelectValue, {
        hasPlaceholder: !hasValue,
        className: "item-selector__dropdown__value"
      }, hasValue ? _react["default"].createElement(this.props.DropDownLineItemRenderComponent, {
        displayOption: displayOption,
        value: selected[0]
      }) : _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: this.props.placeholder
      })), this.props.erasable && hasValue ? _react["default"].createElement(DropdownSelectErase, null, _react["default"].createElement(_icons.Delete, {
        height: "12px",
        onClick: this._onErase
      })) : null), this.state.showTypeahead && this._renderDropdown(intl)));
    }
  }]);
  return ItemSelector;
}(_react.Component);

(0, _defineProperty2["default"])(ItemSelector, "propTypes", {
  // required properties
  selectedItems: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].string, _propTypes["default"].number, _propTypes["default"].bool, _propTypes["default"].object]),
  onChange: _propTypes["default"].func.isRequired,
  options: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
  // optional properties
  fixedOptions: _propTypes["default"].arrayOf(_propTypes["default"].any),
  erasable: _propTypes["default"].bool,
  displayOption: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  getOptionValue: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  filterOption: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  placement: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  isError: _propTypes["default"].bool,
  multiSelect: _propTypes["default"].bool,
  inputTheme: _propTypes["default"].string,
  onBlur: _propTypes["default"].func,
  placeholder: _propTypes["default"].string,
  closeOnSelect: _propTypes["default"].bool,
  DropdownHeaderComponent: _propTypes["default"].func,
  DropDownRenderComponent: _propTypes["default"].func,
  DropDownLineItemRenderComponent: _propTypes["default"].func,
  CustomChickletComponent: _propTypes["default"].func
});
(0, _defineProperty2["default"])(ItemSelector, "defaultProps", {
  erasable: false,
  placement: 'bottom',
  selectedItems: [],
  displayOption: null,
  getOptionValue: null,
  filterOption: null,
  fixedOptions: null,
  inputTheme: 'primary',
  multiSelect: true,
  placeholder: 'placeholder.enterValue',
  closeOnSelect: true,
  searchable: true,
  dropdownHeader: null,
  DropdownHeaderComponent: null,
  DropDownRenderComponent: _dropdownList["default"],
  DropDownLineItemRenderComponent: _dropdownList.ListItem
});

var _default = (0, _reactIntl.injectIntl)((0, _reactOnclickoutside["default"])(ItemSelector));

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiU3R5bGVkRHJvcGRvd25TZWxlY3QiLCJzdHlsZWQiLCJkaXYiLCJhdHRycyIsImNsYXNzTmFtZSIsInByb3BzIiwiaW5wdXRUaGVtZSIsInRoZW1lIiwic2Vjb25kYXJ5SW5wdXQiLCJpbnB1dCIsImRyb3Bkb3duTGlzdEFuY2hvciIsIkRyb3Bkb3duU2VsZWN0VmFsdWUiLCJzcGFuIiwiaGFzUGxhY2Vob2xkZXIiLCJzZWxlY3RDb2xvclBsYWNlSG9sZGVyIiwic2VsZWN0Q29sb3IiLCJEcm9wZG93blNlbGVjdEVyYXNlIiwiRHJvcGRvd25XcmFwcGVyIiwiZHJvcGRvd25XcmFwcGVyWiIsInBsYWNlbWVudCIsImlucHV0Qm94SGVpZ2h0IiwiSXRlbVNlbGVjdG9yIiwic2hvd1R5cGVhaGVhZCIsIl9oaWRlVHlwZWFoZWFkIiwib25CbHVyIiwiaXRlbSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInNlbGVjdGVkSXRlbXMiLCJpbmRleCIsImZpbmRJbmRleCIsInQiLCJpdGVtcyIsInNsaWNlIiwibGVuZ3RoIiwib25DaGFuZ2UiLCJjbG9zZU9uU2VsZWN0Iiwic2V0U3RhdGUiLCJfb25CbHVyIiwiZ2V0VmFsdWUiLCJBY2Nlc3NvciIsImdlbmVyYXRlT3B0aW9uVG9TdHJpbmdGb3IiLCJnZXRPcHRpb25WYWx1ZSIsImRpc3BsYXlPcHRpb24iLCJwcmV2aW91c1NlbGVjdGVkIiwibXVsdGlTZWxlY3QiLCJjb25jYXQiLCJkaXNhYmxlZCIsImludGwiLCJyZXN1bHRzIiwibGlzdEl0ZW0iLCJsaXN0QW5jaG9yIiwib3B0aW9ucyIsImZpbHRlck9wdGlvbiIsImZpeGVkT3B0aW9ucyIsImZvcm1hdE1lc3NhZ2UiLCJpZCIsIl9zZWxlY3RJdGVtIiwiRHJvcERvd25SZW5kZXJDb21wb25lbnQiLCJEcm9wZG93bkhlYWRlckNvbXBvbmVudCIsIkRyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQiLCJzZWFyY2hhYmxlIiwic2VsZWN0ZWQiLCJoYXNWYWx1ZSIsImRyb3Bkb3duU2VsZWN0UHJvcHMiLCJhY3RpdmUiLCJzdGF0ZSIsIm9uQ2xpY2siLCJfc2hvd1R5cGVhaGVhZCIsIm9uRm9jdXMiLCJfc2hvd1BvcG92ZXIiLCJlcnJvciIsImlzRXJyb3IiLCJwb3NpdGlvbiIsInBsYWNlaG9sZGVyIiwiX3JlbW92ZUl0ZW0iLCJDdXN0b21DaGlja2xldENvbXBvbmVudCIsImVyYXNhYmxlIiwiX29uRXJhc2UiLCJfcmVuZGVyRHJvcGRvd24iLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvbmVPZlR5cGUiLCJhcnJheSIsInN0cmluZyIsIm51bWJlciIsImJvb2wiLCJvYmplY3QiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImFycmF5T2YiLCJhbnkiLCJkcm9wZG93bkhlYWRlciIsIkRyb3Bkb3duTGlzdCIsIkxpc3RJdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxvQkFBb0IsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUM1Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRGlDLENBQWpCLENBQUgsb0JBR3RCLFVBQUFDLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNDLFVBQU4sS0FBcUIsV0FBckIsR0FBbUNELEtBQUssQ0FBQ0UsS0FBTixDQUFZQyxjQUEvQyxHQUFnRUgsS0FBSyxDQUFDRSxLQUFOLENBQVlFLEtBQWpGO0FBQUEsQ0FIaUIsRUFNcEIsVUFBQUosS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0Us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RCxFQUFBQSx1QkFBdUIsRUFBRW1DLHdCQWZMO0FBZ0JwQmpDLEVBQUFBLCtCQUErQixFQUFFa0M7QUFoQmIsQzs7ZUEwTFQsMkJBQVcscUNBQXNCMUUsWUFBdEIsQ0FBWCxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgdW5pcUJ5IGZyb20gJ2xvZGFzaC51bmlxYnknO1xuaW1wb3J0IGxpc3RlbnNUb0NsaWNrT3V0c2lkZSBmcm9tICdyZWFjdC1vbmNsaWNrb3V0c2lkZSc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IEFjY2Vzc29yIGZyb20gJy4vYWNjZXNzb3InO1xuaW1wb3J0IENoaWNrbGV0ZWRJbnB1dCBmcm9tICcuL2NoaWNrbGV0ZWQtaW5wdXQnO1xuaW1wb3J0IFR5cGVhaGVhZCBmcm9tICcuL3R5cGVhaGVhZCc7XG5pbXBvcnQge0RlbGV0ZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IERyb3Bkb3duTGlzdCwge0xpc3RJdGVtfSBmcm9tICcuL2Ryb3Bkb3duLWxpc3QnO1xuXG5pbXBvcnQge3RvQXJyYXl9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZSwgaW5qZWN0SW50bH0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmNvbnN0IFN0eWxlZERyb3Bkb3duU2VsZWN0ID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2l0ZW0tc2VsZWN0b3JfX2Ryb3Bkb3duJ1xufSlgXG4gICR7cHJvcHMgPT4gKHByb3BzLmlucHV0VGhlbWUgPT09ICdzZWNvbmRhcnknID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXQgOiBwcm9wcy50aGVtZS5pbnB1dCl9O1xuXG4gIC5saXN0X19pdGVtX19hbmNob3Ige1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QW5jaG9yfTtcbiAgfVxuYDtcblxuY29uc3QgRHJvcGRvd25TZWxlY3RWYWx1ZSA9IHN0eWxlZC5zcGFuYFxuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmhhc1BsYWNlaG9sZGVyID8gcHJvcHMudGhlbWUuc2VsZWN0Q29sb3JQbGFjZUhvbGRlciA6IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yfTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbmA7XG5cbmNvbnN0IERyb3Bkb3duU2VsZWN0RXJhc2UgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tbGVmdDogNnB4O1xuICBkaXNwbGF5OiBmbGV4O1xuYDtcblxuY29uc3QgRHJvcGRvd25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgYm9yZGVyOiAwO1xuICB3aWR0aDogMTAwJTtcbiAgbGVmdDogMDtcbiAgei1pbmRleDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bldyYXBwZXJafTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206ICR7cHJvcHMgPT4gKHByb3BzLnBsYWNlbWVudCA9PT0gJ3RvcCcgPyBwcm9wcy50aGVtZS5pbnB1dEJveEhlaWdodCA6ICdhdXRvJyl9O1xuICBtYXJnaW4tdG9wOiAke3Byb3BzID0+IChwcm9wcy5wbGFjZW1lbnQgPT09ICdib3R0b20nID8gJzRweCcgOiAnYXV0bycpfTtcbiAgbWFyZ2luLWJvdHRvbTogJHtwcm9wcyA9PiAocHJvcHMucGxhY2VtZW50ID09PSAndG9wJyA/ICc0cHgnIDogJ2F1dG8nKX07XG5gO1xuXG5jbGFzcyBJdGVtU2VsZWN0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIHJlcXVpcmVkIHByb3BlcnRpZXNcbiAgICBzZWxlY3RlZEl0ZW1zOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgIFByb3BUeXBlcy5hcnJheSxcbiAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgUHJvcFR5cGVzLmJvb2wsXG4gICAgICBQcm9wVHlwZXMub2JqZWN0XG4gICAgXSksXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3B0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIG9wdGlvbmFsIHByb3BlcnRpZXNcbiAgICBmaXhlZE9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLFxuICAgIGVyYXNhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBkaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICAgIGdldE9wdGlvblZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICAgIGZpbHRlck9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgICBwbGFjZW1lbnQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIGlzRXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICAgIG11bHRpU2VsZWN0OiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpbnB1dFRoZW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgcGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY2xvc2VPblNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gICAgRHJvcGRvd25IZWFkZXJDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIERyb3BEb3duUmVuZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBDdXN0b21DaGlja2xldENvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGVyYXNhYmxlOiBmYWxzZSxcbiAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgIHNlbGVjdGVkSXRlbXM6IFtdLFxuICAgIGRpc3BsYXlPcHRpb246IG51bGwsXG4gICAgZ2V0T3B0aW9uVmFsdWU6IG51bGwsXG4gICAgZmlsdGVyT3B0aW9uOiBudWxsLFxuICAgIGZpeGVkT3B0aW9uczogbnVsbCxcbiAgICBpbnB1dFRoZW1lOiAncHJpbWFyeScsXG4gICAgbXVsdGlTZWxlY3Q6IHRydWUsXG4gICAgcGxhY2Vob2xkZXI6ICdwbGFjZWhvbGRlci5lbnRlclZhbHVlJyxcbiAgICBjbG9zZU9uU2VsZWN0OiB0cnVlLFxuICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgZHJvcGRvd25IZWFkZXI6IG51bGwsXG4gICAgRHJvcGRvd25IZWFkZXJDb21wb25lbnQ6IG51bGwsXG4gICAgRHJvcERvd25SZW5kZXJDb21wb25lbnQ6IERyb3Bkb3duTGlzdCxcbiAgICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50OiBMaXN0SXRlbVxuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIHNob3dUeXBlYWhlYWQ6IGZhbHNlXG4gIH07XG5cbiAgaGFuZGxlQ2xpY2tPdXRzaWRlID0gKCkgPT4ge1xuICAgIHRoaXMuX2hpZGVUeXBlYWhlYWQoKTtcbiAgfTtcblxuICBfaGlkZVR5cGVhaGVhZCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzaG93VHlwZWFoZWFkOiBmYWxzZX0pO1xuICAgIHRoaXMuX29uQmx1cigpO1xuICB9XG5cbiAgX29uQmx1ciA9ICgpID0+IHtcbiAgICAvLyBub3RlOiBjaGlja2xldGVkIGlucHV0IGlzIG5vdCBhIHJlYWwgZm9ybSBlbGVtZW50IHNvIHdlIGNhbGwgb25CbHVyKClcbiAgICAvLyB3aGVuIHdlIGZlZWwgdGhlIGV2ZW50cyBhcmUgYXBwcm9wcmlhdGVcbiAgICBpZiAodGhpcy5wcm9wcy5vbkJsdXIpIHtcbiAgICAgIHRoaXMucHJvcHMub25CbHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIF9yZW1vdmVJdGVtID0gKGl0ZW0sIGUpID0+IHtcbiAgICAvLyBvbmx5IHVzZWQgd2hlbiBtdWx0aVNlbGVjdCA9IHRydWVcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB7c2VsZWN0ZWRJdGVtc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGluZGV4ID0gc2VsZWN0ZWRJdGVtcy5maW5kSW5kZXgodCA9PiB0ID09PSBpdGVtKTtcblxuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIC4uLnNlbGVjdGVkSXRlbXMuc2xpY2UoMCwgaW5kZXgpLFxuICAgICAgLi4uc2VsZWN0ZWRJdGVtcy5zbGljZShpbmRleCArIDEsIHNlbGVjdGVkSXRlbXMubGVuZ3RoKVxuICAgIF07XG5cbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGl0ZW1zKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmNsb3NlT25TZWxlY3QpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dUeXBlYWhlYWQ6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9vbkJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX3NlbGVjdEl0ZW0gPSBpdGVtID0+IHtcbiAgICBjb25zdCBnZXRWYWx1ZSA9IEFjY2Vzc29yLmdlbmVyYXRlT3B0aW9uVG9TdHJpbmdGb3IoXG4gICAgICB0aGlzLnByb3BzLmdldE9wdGlvblZhbHVlIHx8IHRoaXMucHJvcHMuZGlzcGxheU9wdGlvblxuICAgICk7XG5cbiAgICBjb25zdCBwcmV2aW91c1NlbGVjdGVkID0gdG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMubXVsdGlTZWxlY3QpIHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gdW5pcUJ5KHByZXZpb3VzU2VsZWN0ZWQuY29uY2F0KHRvQXJyYXkoaXRlbSkpLCBnZXRWYWx1ZSk7XG5cbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoaXRlbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGdldFZhbHVlKGl0ZW0pKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93VHlwZWFoZWFkOiBmYWxzZX0pO1xuICAgICAgdGhpcy5fb25CbHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkVyYXNlID0gZSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKG51bGwpO1xuICB9O1xuXG4gIF9zaG93VHlwZWFoZWFkID0gZSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIXRoaXMucHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzaG93VHlwZWFoZWFkOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckRyb3Bkb3duKGludGwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERyb3Bkb3duV3JhcHBlciBwbGFjZW1lbnQ9e3RoaXMucHJvcHMucGxhY2VtZW50fT5cbiAgICAgICAgPFR5cGVhaGVhZFxuICAgICAgICAgIGN1c3RvbUNsYXNzZXM9e3tcbiAgICAgICAgICAgIHJlc3VsdHM6ICdsaXN0LXNlbGVjdG9yJyxcbiAgICAgICAgICAgIGlucHV0OiAndHlwZWFoZWFkX19pbnB1dCcsXG4gICAgICAgICAgICBsaXN0SXRlbTogJ2xpc3RfX2l0ZW0nLFxuICAgICAgICAgICAgbGlzdEFuY2hvcjogJ2xpc3RfX2l0ZW1fX2FuY2hvcidcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9wdGlvbnM9e3RoaXMucHJvcHMub3B0aW9uc31cbiAgICAgICAgICBmaWx0ZXJPcHRpb249e3RoaXMucHJvcHMuZmlsdGVyT3B0aW9ufVxuICAgICAgICAgIGZpeGVkT3B0aW9ucz17dGhpcy5wcm9wcy5maXhlZE9wdGlvbnN9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e2ludGwuZm9ybWF0TWVzc2FnZSh7aWQ6ICdwbGFjZWhvbGRlci5zZWFyY2gnfSl9XG4gICAgICAgICAgb25PcHRpb25TZWxlY3RlZD17dGhpcy5fc2VsZWN0SXRlbX1cbiAgICAgICAgICBjdXN0b21MaXN0Q29tcG9uZW50PXt0aGlzLnByb3BzLkRyb3BEb3duUmVuZGVyQ29tcG9uZW50fVxuICAgICAgICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ9e3RoaXMucHJvcHMuRHJvcGRvd25IZWFkZXJDb21wb25lbnR9XG4gICAgICAgICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ9e3RoaXMucHJvcHMuRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudH1cbiAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtBY2Nlc3Nvci5nZW5lcmF0ZU9wdGlvblRvU3RyaW5nRm9yKHRoaXMucHJvcHMuZGlzcGxheU9wdGlvbil9XG4gICAgICAgICAgc2VhcmNoYWJsZT17dGhpcy5wcm9wcy5zZWFyY2hhYmxlfVxuICAgICAgICAgIHNob3dPcHRpb25zV2hlbkVtcHR5XG4gICAgICAgICAgc2VsZWN0ZWRJdGVtcz17dG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpfVxuICAgICAgICAvPlxuICAgICAgPC9Ecm9wZG93bldyYXBwZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IHNlbGVjdGVkLmxlbmd0aDtcbiAgICBjb25zdCBkaXNwbGF5T3B0aW9uID0gQWNjZXNzb3IuZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0Zvcih0aGlzLnByb3BzLmRpc3BsYXlPcHRpb24pO1xuXG4gICAgY29uc3QgZHJvcGRvd25TZWxlY3RQcm9wcyA9IHtcbiAgICAgIGNsYXNzTmFtZTogY2xhc3NuYW1lcyh7XG4gICAgICAgIGFjdGl2ZTogdGhpcy5zdGF0ZS5zaG93VHlwZWFoZWFkXG4gICAgICB9KSxcbiAgICAgIGRpc2FibGVkOiB0aGlzLnByb3BzLmRpc2FibGVkLFxuICAgICAgb25DbGljazogdGhpcy5fc2hvd1R5cGVhaGVhZCxcbiAgICAgIG9uRm9jdXM6IHRoaXMuX3Nob3dQb3BvdmVyLFxuICAgICAgZXJyb3I6IHRoaXMucHJvcHMuaXNFcnJvcixcbiAgICAgIGlucHV0VGhlbWU6IHRoaXMucHJvcHMuaW5wdXRUaGVtZVxuICAgIH07XG4gICAgY29uc3QgaW50bCA9IHRoaXMucHJvcHMuaW50bDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIml0ZW0tc2VsZWN0b3JcIj5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgICAgey8qIHRoaXMgcGFydCBpcyB1c2VkIHRvIGRpc3BsYXkgdGhlIGxhYmVsICovfVxuICAgICAgICAgIHt0aGlzLnByb3BzLm11bHRpU2VsZWN0ID8gKFxuICAgICAgICAgICAgPENoaWNrbGV0ZWRJbnB1dFxuICAgICAgICAgICAgICB7Li4uZHJvcGRvd25TZWxlY3RQcm9wc31cbiAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcz17dG9BcnJheSh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbXMpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn1cbiAgICAgICAgICAgICAgZGlzcGxheU9wdGlvbj17ZGlzcGxheU9wdGlvbn1cbiAgICAgICAgICAgICAgcmVtb3ZlSXRlbT17dGhpcy5fcmVtb3ZlSXRlbX1cbiAgICAgICAgICAgICAgQ3VzdG9tQ2hpY2tsZXRDb21wb25lbnQ9e3RoaXMucHJvcHMuQ3VzdG9tQ2hpY2tsZXRDb21wb25lbnR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8U3R5bGVkRHJvcGRvd25TZWxlY3Qgey4uLmRyb3Bkb3duU2VsZWN0UHJvcHN9PlxuICAgICAgICAgICAgICA8RHJvcGRvd25TZWxlY3RWYWx1ZVxuICAgICAgICAgICAgICAgIGhhc1BsYWNlaG9sZGVyPXshaGFzVmFsdWV9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaXRlbS1zZWxlY3Rvcl9fZHJvcGRvd25fX3ZhbHVlXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtoYXNWYWx1ZSA/IChcbiAgICAgICAgICAgICAgICAgIDx0aGlzLnByb3BzLkRyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU9wdGlvbj17ZGlzcGxheU9wdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlbGVjdGVkWzBdfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9IC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9Ecm9wZG93blNlbGVjdFZhbHVlPlxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5lcmFzYWJsZSAmJiBoYXNWYWx1ZSA/IChcbiAgICAgICAgICAgICAgICA8RHJvcGRvd25TZWxlY3RFcmFzZT5cbiAgICAgICAgICAgICAgICAgIDxEZWxldGUgaGVpZ2h0PVwiMTJweFwiIG9uQ2xpY2s9e3RoaXMuX29uRXJhc2V9IC8+XG4gICAgICAgICAgICAgICAgPC9Ecm9wZG93blNlbGVjdEVyYXNlPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDwvU3R5bGVkRHJvcGRvd25TZWxlY3Q+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7LyogdGhpcyBwYXJ0IGlzIHVzZWQgdG8gYnVpbHQgdGhlIGxpc3QgKi99XG4gICAgICAgICAge3RoaXMuc3RhdGUuc2hvd1R5cGVhaGVhZCAmJiB0aGlzLl9yZW5kZXJEcm9wZG93bihpbnRsKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluamVjdEludGwobGlzdGVuc1RvQ2xpY2tPdXRzaWRlKEl0ZW1TZWxlY3RvcikpO1xuIl19