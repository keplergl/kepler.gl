"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ItemSelectorListen = exports.StyledDropdownSelect = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

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

var _localization = require("../../../localization");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledDropdownSelect = _styledComponents["default"].div.attrs({
  className: 'item-selector__dropdown'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n\n  height: ", ";\n\n  .list__item__anchor {\n    ", ";\n  }\n"])), function (props) {
  return props.inputTheme === 'secondary' ? props.theme.secondaryInput : props.inputTheme === 'light' ? props.theme.inputLT : props.theme.input;
}, function (props) {
  return props.size === 'small' ? props.theme.inputBoxHeightSmall : props.theme.inputBoxHeight;
}, function (props) {
  return props.theme.dropdownListAnchor;
});

exports.StyledDropdownSelect = StyledDropdownSelect;

var DropdownSelectValue = _styledComponents["default"].span(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n\n  .list__item {\n    ", ";\n  }\n\n  .list__item__anchor {\n    ", ";\n  }\n"])), function (props) {
  return props.hasPlaceholder && props.inputTheme === 'light' ? props.theme.selectColorPlaceHolderLT : props.hasPlaceholder ? props.theme.selectColorPlaceHolder : props.inputTheme === 'light' ? props.theme.selectColorLT : props.theme.selectColor;
}, function (props) {
  return props.inputTheme === 'light' ? props.theme.dropdownListItemLT : props.theme.dropdownListItem;
}, function (props) {
  return props.inputTheme === 'light' ? props.theme.dropdownListAnchorLT : props.theme.dropdownListAnchor;
});

var DropdownSelectActionRight = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-right: 6px;\n  display: flex;\n  color: ", ";\n\n  :hover {\n    color: ", ";\n  }\n"])), function (props) {
  return props.theme.subtextColor;
}, function (props) {
  return props.theme.textColor;
});

var DropdownWrapper = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  border: 0;\n  width: 100%;\n  left: 0;\n  z-index: ", ";\n  position: absolute;\n  bottom: ", ";\n  margin-top: ", ";\n  margin-bottom: ", ";\n"])), function (props) {
  return props.theme.dropdownWrapperZ;
}, function (props) {
  return props.placement === 'top' ? props.theme.inputBoxHeight : 'auto';
}, function (props) {
  return props.placement === 'bottom' ? "".concat(props.theme.dropdownWapperMargin, "px") : 'auto';
}, function (props) {
  return props.placement === 'top' ? "".concat(props.theme.dropdownWapperMargin, "px") : 'auto';
});

var ItemSelector = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ItemSelector, _Component);

  var _super = _createSuper(ItemSelector);

  function ItemSelector() {
    var _this;

    (0, _classCallCheck2["default"])(this, ItemSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
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
      return /*#__PURE__*/_react["default"].createElement(DropdownWrapper, {
        placement: this.props.placement
      }, /*#__PURE__*/_react["default"].createElement(_typeahead["default"], {
        customClasses: {
          results: 'list-selector',
          input: 'typeahead__input',
          listItem: 'list__item',
          listAnchor: 'list__item__anchor'
        },
        options: this.props.options,
        filterOption: this.props.filterOption,
        fixedOptions: this.props.fixedOptions,
        placeholder: this.props.typeaheadPlaceholder || intl ? intl.formatMessage({
          id: 'placeholder.search'
        }) : 'Search',
        onOptionSelected: this._selectItem,
        customListComponent: this.props.DropDownRenderComponent,
        customListHeaderComponent: this.props.DropdownHeaderComponent,
        customListItemComponent: this.props.DropDownLineItemRenderComponent,
        displayOption: _accessor["default"].generateOptionToStringFor(this.props.displayOption),
        searchable: this.props.searchable,
        showOptionsWhenEmpty: true,
        selectedItems: (0, _utils.toArray)(this.props.selectedItems),
        light: this.props.inputTheme === 'light'
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
        displayOption: displayOption,
        disabled: this.props.disabled,
        onClick: this._showTypeahead,
        error: this.props.isError,
        inputTheme: this.props.inputTheme,
        size: this.props.size
      };
      var intl = this.props.intl;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "item-selector"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: 'relative'
        }
      }, this.props.multiSelect ? /*#__PURE__*/_react["default"].createElement(_chickletedInput["default"], (0, _extends2["default"])({}, dropdownSelectProps, {
        selectedItems: (0, _utils.toArray)(this.props.selectedItems),
        placeholder: this.props.placeholder,
        removeItem: this._removeItem,
        CustomChickletComponent: this.props.CustomChickletComponent,
        inputTheme: this.props.inputTheme
      })) : /*#__PURE__*/_react["default"].createElement(StyledDropdownSelect, dropdownSelectProps, /*#__PURE__*/_react["default"].createElement(DropdownSelectValue, {
        hasPlaceholder: !hasValue,
        inputTheme: this.props.inputTheme,
        className: "item-selector__dropdown__value"
      }, hasValue ? /*#__PURE__*/_react["default"].createElement(this.props.DropDownLineItemRenderComponent, {
        displayOption: displayOption,
        value: selected[0],
        light: this.props.inputTheme === 'light'
      }) : /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
        id: this.props.placeholder || 'placeholder.selectValue'
      })), this.props.erasable && hasValue ? /*#__PURE__*/_react["default"].createElement(DropdownSelectActionRight, null, /*#__PURE__*/_react["default"].createElement(_icons.Delete, {
        height: "12px",
        onClick: this._onErase
      })) : this.props.showArrow ? /*#__PURE__*/_react["default"].createElement(DropdownSelectActionRight, null, /*#__PURE__*/_react["default"].createElement(_icons.ArrowDown, {
        height: "14px",
        onClick: this._showTypeahead
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
  showArrow: _propTypes["default"].bool,
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
  typeaheadPlaceholder: _propTypes["default"].string,
  DropdownHeaderComponent: _propTypes["default"].func,
  DropDownRenderComponent: _propTypes["default"].func,
  DropDownLineItemRenderComponent: _propTypes["default"].func,
  CustomChickletComponent: _propTypes["default"].func
});
(0, _defineProperty2["default"])(ItemSelector, "defaultProps", {
  erasable: false,
  showArrow: false,
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
var ItemSelectorListen = (0, _reactOnclickoutside["default"])(ItemSelector);
exports.ItemSelectorListen = ItemSelectorListen;

var _default = (0, _reactIntl.injectIntl)((0, _reactOnclickoutside["default"])(ItemSelector));

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiU3R5bGVkRHJvcGRvd25TZWxlY3QiLCJzdHlsZWQiLCJkaXYiLCJhdHRycyIsImNsYXNzTmFtZSIsInByb3BzIiwiaW5wdXRUaGVtZSIsInRoZW1lIiwic2Vjb25kYXJ5SW5wdXQiLCJpbnB1dExUIiwiaW5wdXQiLCJzaXplIiwiaW5wdXRCb3hIZWlnaHRTbWFsbCIsImlucHV0Qm94SGVpZ2h0IiwiZHJvcGRvd25MaXN0QW5jaG9yIiwiRHJvcGRvd25TZWxlY3RWYWx1ZSIsInNwYW4iLCJoYXNQbGFjZWhvbGRlciIsInNlbGVjdENvbG9yUGxhY2VIb2xkZXJMVCIsInNlbGVjdENvbG9yUGxhY2VIb2xkZXIiLCJzZWxlY3RDb2xvckxUIiwic2VsZWN0Q29sb3IiLCJkcm9wZG93bkxpc3RJdGVtTFQiLCJkcm9wZG93bkxpc3RJdGVtIiwiZHJvcGRvd25MaXN0QW5jaG9yTFQiLCJEcm9wZG93blNlbGVjdEFjdGlvblJpZ2h0Iiwic3VidGV4dENvbG9yIiwidGV4dENvbG9yIiwiRHJvcGRvd25XcmFwcGVyIiwiZHJvcGRvd25XcmFwcGVyWiIsInBsYWNlbWVudCIsImRyb3Bkb3duV2FwcGVyTWFyZ2luIiwiSXRlbVNlbGVjdG9yIiwic2hvd1R5cGVhaGVhZCIsIl9oaWRlVHlwZWFoZWFkIiwib25CbHVyIiwiaXRlbSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInNlbGVjdGVkSXRlbXMiLCJpbmRleCIsImZpbmRJbmRleCIsInQiLCJpdGVtcyIsInNsaWNlIiwibGVuZ3RoIiwib25DaGFuZ2UiLCJjbG9zZU9uU2VsZWN0Iiwic2V0U3RhdGUiLCJfb25CbHVyIiwiZ2V0VmFsdWUiLCJBY2Nlc3NvciIsImdlbmVyYXRlT3B0aW9uVG9TdHJpbmdGb3IiLCJnZXRPcHRpb25WYWx1ZSIsImRpc3BsYXlPcHRpb24iLCJwcmV2aW91c1NlbGVjdGVkIiwibXVsdGlTZWxlY3QiLCJjb25jYXQiLCJkaXNhYmxlZCIsImludGwiLCJyZXN1bHRzIiwibGlzdEl0ZW0iLCJsaXN0QW5jaG9yIiwib3B0aW9ucyIsImZpbHRlck9wdGlvbiIsImZpeGVkT3B0aW9ucyIsInR5cGVhaGVhZFBsYWNlaG9sZGVyIiwiZm9ybWF0TWVzc2FnZSIsImlkIiwiX3NlbGVjdEl0ZW0iLCJEcm9wRG93blJlbmRlckNvbXBvbmVudCIsIkRyb3Bkb3duSGVhZGVyQ29tcG9uZW50IiwiRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudCIsInNlYXJjaGFibGUiLCJzZWxlY3RlZCIsImhhc1ZhbHVlIiwiZHJvcGRvd25TZWxlY3RQcm9wcyIsImFjdGl2ZSIsInN0YXRlIiwib25DbGljayIsIl9zaG93VHlwZWFoZWFkIiwiZXJyb3IiLCJpc0Vycm9yIiwicG9zaXRpb24iLCJwbGFjZWhvbGRlciIsIl9yZW1vdmVJdGVtIiwiQ3VzdG9tQ2hpY2tsZXRDb21wb25lbnQiLCJlcmFzYWJsZSIsIl9vbkVyYXNlIiwic2hvd0Fycm93IiwiX3JlbmRlckRyb3Bkb3duIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwib25lT2ZUeXBlIiwiYXJyYXkiLCJzdHJpbmciLCJudW1iZXIiLCJib29sIiwib2JqZWN0IiwiZnVuYyIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwiYW55IiwiZHJvcGRvd25IZWFkZXIiLCJEcm9wZG93bkxpc3QiLCJMaXN0SXRlbSIsIkl0ZW1TZWxlY3Rvckxpc3RlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFTyxJQUFNQSxvQkFBb0IsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUNuREMsRUFBQUEs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b2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHVuaXFCeSBmcm9tICdsb2Rhc2gudW5pcWJ5JztcbmltcG9ydCBsaXN0ZW5zVG9DbGlja091dHNpZGUgZnJvbSAncmVhY3Qtb25jbGlja291dHNpZGUnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBBY2Nlc3NvciBmcm9tICcuL2FjY2Vzc29yJztcbmltcG9ydCBDaGlja2xldGVkSW5wdXQgZnJvbSAnLi9jaGlja2xldGVkLWlucHV0JztcbmltcG9ydCBUeXBlYWhlYWQgZnJvbSAnLi90eXBlYWhlYWQnO1xuaW1wb3J0IHtEZWxldGUsIEFycm93RG93bn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IERyb3Bkb3duTGlzdCwge0xpc3RJdGVtfSBmcm9tICcuL2Ryb3Bkb3duLWxpc3QnO1xuXG5pbXBvcnQge3RvQXJyYXl9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7aW5qZWN0SW50bH0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWREcm9wZG93blNlbGVjdCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdpdGVtLXNlbGVjdG9yX19kcm9wZG93bidcbn0pYFxuICAke3Byb3BzID0+XG4gICAgcHJvcHMuaW5wdXRUaGVtZSA9PT0gJ3NlY29uZGFyeSdcbiAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXRcbiAgICAgIDogcHJvcHMuaW5wdXRUaGVtZSA9PT0gJ2xpZ2h0J1xuICAgICAgPyBwcm9wcy50aGVtZS5pbnB1dExUXG4gICAgICA6IHByb3BzLnRoZW1lLmlucHV0fTtcblxuICBoZWlnaHQ6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5zaXplID09PSAnc21hbGwnID8gcHJvcHMudGhlbWUuaW5wdXRCb3hIZWlnaHRTbWFsbCA6IHByb3BzLnRoZW1lLmlucHV0Qm94SGVpZ2h0fTtcblxuICAubGlzdF9faXRlbV9fYW5jaG9yIHtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEFuY2hvcn07XG4gIH1cbmA7XG5cbmNvbnN0IERyb3Bkb3duU2VsZWN0VmFsdWUgPSBzdHlsZWQuc3BhbmBcbiAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5oYXNQbGFjZWhvbGRlciAmJiBwcm9wcy5pbnB1dFRoZW1lID09PSAnbGlnaHQnXG4gICAgICA/IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yUGxhY2VIb2xkZXJMVFxuICAgICAgOiBwcm9wcy5oYXNQbGFjZWhvbGRlclxuICAgICAgPyBwcm9wcy50aGVtZS5zZWxlY3RDb2xvclBsYWNlSG9sZGVyXG4gICAgICA6IHByb3BzLmlucHV0VGhlbWUgPT09ICdsaWdodCdcbiAgICAgID8gcHJvcHMudGhlbWUuc2VsZWN0Q29sb3JMVFxuICAgICAgOiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvcn07XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuXG4gIC5saXN0X19pdGVtIHtcbiAgICAke3Byb3BzID0+XG4gICAgICBwcm9wcy5pbnB1dFRoZW1lID09PSAnbGlnaHQnID8gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0SXRlbUxUIDogcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0SXRlbX07XG4gIH1cblxuICAubGlzdF9faXRlbV9fYW5jaG9yIHtcbiAgICAke3Byb3BzID0+XG4gICAgICBwcm9wcy5pbnB1dFRoZW1lID09PSAnbGlnaHQnXG4gICAgICAgID8gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QW5jaG9yTFRcbiAgICAgICAgOiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RBbmNob3J9O1xuICB9XG5gO1xuXG5jb25zdCBEcm9wZG93blNlbGVjdEFjdGlvblJpZ2h0ID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLXJpZ2h0OiA2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcn07XG5cbiAgOmhvdmVyIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICB9XG5gO1xuXG5jb25zdCBEcm9wZG93bldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBib3JkZXI6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBsZWZ0OiAwO1xuICB6LWluZGV4OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duV3JhcHBlclp9O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogJHtwcm9wcyA9PiAocHJvcHMucGxhY2VtZW50ID09PSAndG9wJyA/IHByb3BzLnRoZW1lLmlucHV0Qm94SGVpZ2h0IDogJ2F1dG8nKX07XG4gIG1hcmdpbi10b3A6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5wbGFjZW1lbnQgPT09ICdib3R0b20nID8gYCR7cHJvcHMudGhlbWUuZHJvcGRvd25XYXBwZXJNYXJnaW59cHhgIDogJ2F1dG8nfTtcbiAgbWFyZ2luLWJvdHRvbTogJHtwcm9wcyA9PlxuICAgIHByb3BzLnBsYWNlbWVudCA9PT0gJ3RvcCcgPyBgJHtwcm9wcy50aGVtZS5kcm9wZG93bldhcHBlck1hcmdpbn1weGAgOiAnYXV0byd9O1xuYDtcblxuY2xhc3MgSXRlbVNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyByZXF1aXJlZCBwcm9wZXJ0aWVzXG4gICAgc2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICBQcm9wVHlwZXMuYXJyYXksXG4gICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIFByb3BUeXBlcy5ib29sLFxuICAgICAgUHJvcFR5cGVzLm9iamVjdFxuICAgIF0pLFxuICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBvcHRpb25hbCBwcm9wZXJ0aWVzXG4gICAgZml4ZWRPcHRpb25zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICBlcmFzYWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gICAgc2hvd0Fycm93OiBQcm9wVHlwZXMuYm9vbCxcbiAgICBkaXNwbGF5T3B0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICAgIGdldE9wdGlvblZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZnVuY10pLFxuICAgIGZpbHRlck9wdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgICBwbGFjZW1lbnQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIGlzRXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICAgIG11bHRpU2VsZWN0OiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpbnB1dFRoZW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgcGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY2xvc2VPblNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gICAgdHlwZWFoZWFkUGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgRHJvcGRvd25IZWFkZXJDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIERyb3BEb3duUmVuZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBDdXN0b21DaGlja2xldENvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGVyYXNhYmxlOiBmYWxzZSxcbiAgICBzaG93QXJyb3c6IGZhbHNlLFxuICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgc2VsZWN0ZWRJdGVtczogW10sXG4gICAgZGlzcGxheU9wdGlvbjogbnVsbCxcbiAgICBnZXRPcHRpb25WYWx1ZTogbnVsbCxcbiAgICBmaWx0ZXJPcHRpb246IG51bGwsXG4gICAgZml4ZWRPcHRpb25zOiBudWxsLFxuICAgIGlucHV0VGhlbWU6ICdwcmltYXJ5JyxcbiAgICBtdWx0aVNlbGVjdDogdHJ1ZSxcbiAgICBwbGFjZWhvbGRlcjogJ3BsYWNlaG9sZGVyLmVudGVyVmFsdWUnLFxuICAgIGNsb3NlT25TZWxlY3Q6IHRydWUsXG4gICAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgICBkcm9wZG93bkhlYWRlcjogbnVsbCxcbiAgICBEcm9wZG93bkhlYWRlckNvbXBvbmVudDogbnVsbCxcbiAgICBEcm9wRG93blJlbmRlckNvbXBvbmVudDogRHJvcGRvd25MaXN0LFxuICAgIERyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQ6IExpc3RJdGVtXG4gIH07XG5cbiAgc3RhdGUgPSB7XG4gICAgc2hvd1R5cGVhaGVhZDogZmFsc2VcbiAgfTtcblxuICBoYW5kbGVDbGlja091dHNpZGUgPSAoKSA9PiB7XG4gICAgdGhpcy5faGlkZVR5cGVhaGVhZCgpO1xuICB9O1xuXG4gIF9oaWRlVHlwZWFoZWFkKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dUeXBlYWhlYWQ6IGZhbHNlfSk7XG4gICAgdGhpcy5fb25CbHVyKCk7XG4gIH1cblxuICBfb25CbHVyID0gKCkgPT4ge1xuICAgIC8vIG5vdGU6IGNoaWNrbGV0ZWQgaW5wdXQgaXMgbm90IGEgcmVhbCBmb3JtIGVsZW1lbnQgc28gd2UgY2FsbCBvbkJsdXIoKVxuICAgIC8vIHdoZW4gd2UgZmVlbCB0aGUgZXZlbnRzIGFyZSBhcHByb3ByaWF0ZVxuICAgIGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuICAgICAgdGhpcy5wcm9wcy5vbkJsdXIoKTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbW92ZUl0ZW0gPSAoaXRlbSwgZSkgPT4ge1xuICAgIC8vIG9ubHkgdXNlZCB3aGVuIG11bHRpU2VsZWN0ID0gdHJ1ZVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHtzZWxlY3RlZEl0ZW1zfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaW5kZXggPSBzZWxlY3RlZEl0ZW1zLmZpbmRJbmRleCh0ID0+IHQgPT09IGl0ZW0pO1xuXG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGl0ZW1zID0gW1xuICAgICAgLi4uc2VsZWN0ZWRJdGVtcy5zbGljZSgwLCBpbmRleCksXG4gICAgICAuLi5zZWxlY3RlZEl0ZW1zLnNsaWNlKGluZGV4ICsgMSwgc2VsZWN0ZWRJdGVtcy5sZW5ndGgpXG4gICAgXTtcblxuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoaXRlbXMpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1R5cGVhaGVhZDogZmFsc2V9KTtcbiAgICAgIHRoaXMuX29uQmx1cigpO1xuICAgIH1cbiAgfTtcblxuICBfc2VsZWN0SXRlbSA9IGl0ZW0gPT4ge1xuICAgIGNvbnN0IGdldFZhbHVlID0gQWNjZXNzb3IuZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0ZvcihcbiAgICAgIHRoaXMucHJvcHMuZ2V0T3B0aW9uVmFsdWUgfHwgdGhpcy5wcm9wcy5kaXNwbGF5T3B0aW9uXG4gICAgKTtcblxuICAgIGNvbnN0IHByZXZpb3VzU2VsZWN0ZWQgPSB0b0FycmF5KHRoaXMucHJvcHMuc2VsZWN0ZWRJdGVtcyk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tdWx0aVNlbGVjdCkge1xuICAgICAgY29uc3QgaXRlbXMgPSB1bmlxQnkocHJldmlvdXNTZWxlY3RlZC5jb25jYXQodG9BcnJheShpdGVtKSksIGdldFZhbHVlKTtcbiAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoaXRlbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGdldFZhbHVlKGl0ZW0pKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93VHlwZWFoZWFkOiBmYWxzZX0pO1xuICAgICAgdGhpcy5fb25CbHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkVyYXNlID0gZSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKG51bGwpO1xuICB9O1xuXG4gIF9zaG93VHlwZWFoZWFkID0gZSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIXRoaXMucHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzaG93VHlwZWFoZWFkOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckRyb3Bkb3duKGludGwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERyb3Bkb3duV3JhcHBlciBwbGFjZW1lbnQ9e3RoaXMucHJvcHMucGxhY2VtZW50fT5cbiAgICAgICAgPFR5cGVhaGVhZFxuICAgICAgICAgIGN1c3RvbUNsYXNzZXM9e3tcbiAgICAgICAgICAgIHJlc3VsdHM6ICdsaXN0LXNlbGVjdG9yJyxcbiAgICAgICAgICAgIGlucHV0OiAndHlwZWFoZWFkX19pbnB1dCcsXG4gICAgICAgICAgICBsaXN0SXRlbTogJ2xpc3RfX2l0ZW0nLFxuICAgICAgICAgICAgbGlzdEFuY2hvcjogJ2xpc3RfX2l0ZW1fX2FuY2hvcidcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9wdGlvbnM9e3RoaXMucHJvcHMub3B0aW9uc31cbiAgICAgICAgICBmaWx0ZXJPcHRpb249e3RoaXMucHJvcHMuZmlsdGVyT3B0aW9ufVxuICAgICAgICAgIGZpeGVkT3B0aW9ucz17dGhpcy5wcm9wcy5maXhlZE9wdGlvbnN9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9e1xuICAgICAgICAgICAgdGhpcy5wcm9wcy50eXBlYWhlYWRQbGFjZWhvbGRlciB8fCBpbnRsXG4gICAgICAgICAgICAgID8gaW50bC5mb3JtYXRNZXNzYWdlKHtpZDogJ3BsYWNlaG9sZGVyLnNlYXJjaCd9KVxuICAgICAgICAgICAgICA6ICdTZWFyY2gnXG4gICAgICAgICAgfVxuICAgICAgICAgIG9uT3B0aW9uU2VsZWN0ZWQ9e3RoaXMuX3NlbGVjdEl0ZW19XG4gICAgICAgICAgY3VzdG9tTGlzdENvbXBvbmVudD17dGhpcy5wcm9wcy5Ecm9wRG93blJlbmRlckNvbXBvbmVudH1cbiAgICAgICAgICBjdXN0b21MaXN0SGVhZGVyQ29tcG9uZW50PXt0aGlzLnByb3BzLkRyb3Bkb3duSGVhZGVyQ29tcG9uZW50fVxuICAgICAgICAgIGN1c3RvbUxpc3RJdGVtQ29tcG9uZW50PXt0aGlzLnByb3BzLkRyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnR9XG4gICAgICAgICAgZGlzcGxheU9wdGlvbj17QWNjZXNzb3IuZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0Zvcih0aGlzLnByb3BzLmRpc3BsYXlPcHRpb24pfVxuICAgICAgICAgIHNlYXJjaGFibGU9e3RoaXMucHJvcHMuc2VhcmNoYWJsZX1cbiAgICAgICAgICBzaG93T3B0aW9uc1doZW5FbXB0eVxuICAgICAgICAgIHNlbGVjdGVkSXRlbXM9e3RvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKX1cbiAgICAgICAgICBsaWdodD17dGhpcy5wcm9wcy5pbnB1dFRoZW1lID09PSAnbGlnaHQnfVxuICAgICAgICAvPlxuICAgICAgPC9Ecm9wZG93bldyYXBwZXI+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRvQXJyYXkodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1zKTtcbiAgICBjb25zdCBoYXNWYWx1ZSA9IHNlbGVjdGVkLmxlbmd0aDtcbiAgICBjb25zdCBkaXNwbGF5T3B0aW9uID0gQWNjZXNzb3IuZ2VuZXJhdGVPcHRpb25Ub1N0cmluZ0Zvcih0aGlzLnByb3BzLmRpc3BsYXlPcHRpb24pO1xuXG4gICAgY29uc3QgZHJvcGRvd25TZWxlY3RQcm9wcyA9IHtcbiAgICAgIGNsYXNzTmFtZTogY2xhc3NuYW1lcyh7XG4gICAgICAgIGFjdGl2ZTogdGhpcy5zdGF0ZS5zaG93VHlwZWFoZWFkXG4gICAgICB9KSxcbiAgICAgIGRpc3BsYXlPcHRpb24sXG4gICAgICBkaXNhYmxlZDogdGhpcy5wcm9wcy5kaXNhYmxlZCxcbiAgICAgIG9uQ2xpY2s6IHRoaXMuX3Nob3dUeXBlYWhlYWQsXG4gICAgICBlcnJvcjogdGhpcy5wcm9wcy5pc0Vycm9yLFxuICAgICAgaW5wdXRUaGVtZTogdGhpcy5wcm9wcy5pbnB1dFRoZW1lLFxuICAgICAgc2l6ZTogdGhpcy5wcm9wcy5zaXplXG4gICAgfTtcbiAgICBjb25zdCBpbnRsID0gdGhpcy5wcm9wcy5pbnRsO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaXRlbS1zZWxlY3RvclwiPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgICAgICB7LyogdGhpcyBwYXJ0IGlzIHVzZWQgdG8gZGlzcGxheSB0aGUgbGFiZWwgKi99XG4gICAgICAgICAge3RoaXMucHJvcHMubXVsdGlTZWxlY3QgPyAoXG4gICAgICAgICAgICA8Q2hpY2tsZXRlZElucHV0XG4gICAgICAgICAgICAgIHsuLi5kcm9wZG93blNlbGVjdFByb3BzfVxuICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt0b0FycmF5KHRoaXMucHJvcHMuc2VsZWN0ZWRJdGVtcyl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICByZW1vdmVJdGVtPXt0aGlzLl9yZW1vdmVJdGVtfVxuICAgICAgICAgICAgICBDdXN0b21DaGlja2xldENvbXBvbmVudD17dGhpcy5wcm9wcy5DdXN0b21DaGlja2xldENvbXBvbmVudH1cbiAgICAgICAgICAgICAgaW5wdXRUaGVtZT17dGhpcy5wcm9wcy5pbnB1dFRoZW1lfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFN0eWxlZERyb3Bkb3duU2VsZWN0IHsuLi5kcm9wZG93blNlbGVjdFByb3BzfT5cbiAgICAgICAgICAgICAgPERyb3Bkb3duU2VsZWN0VmFsdWVcbiAgICAgICAgICAgICAgICBoYXNQbGFjZWhvbGRlcj17IWhhc1ZhbHVlfVxuICAgICAgICAgICAgICAgIGlucHV0VGhlbWU9e3RoaXMucHJvcHMuaW5wdXRUaGVtZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpdGVtLXNlbGVjdG9yX19kcm9wZG93bl9fdmFsdWVcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2hhc1ZhbHVlID8gKFxuICAgICAgICAgICAgICAgICAgPHRoaXMucHJvcHMuRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtkaXNwbGF5T3B0aW9ufVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VsZWN0ZWRbMF19XG4gICAgICAgICAgICAgICAgICAgIGxpZ2h0PXt0aGlzLnByb3BzLmlucHV0VGhlbWUgPT09ICdsaWdodCd9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17dGhpcy5wcm9wcy5wbGFjZWhvbGRlciB8fCAncGxhY2Vob2xkZXIuc2VsZWN0VmFsdWUnfSAvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvRHJvcGRvd25TZWxlY3RWYWx1ZT5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuZXJhc2FibGUgJiYgaGFzVmFsdWUgPyAoXG4gICAgICAgICAgICAgICAgPERyb3Bkb3duU2VsZWN0QWN0aW9uUmlnaHQ+XG4gICAgICAgICAgICAgICAgICA8RGVsZXRlIGhlaWdodD1cIjEycHhcIiBvbkNsaWNrPXt0aGlzLl9vbkVyYXNlfSAvPlxuICAgICAgICAgICAgICAgIDwvRHJvcGRvd25TZWxlY3RBY3Rpb25SaWdodD5cbiAgICAgICAgICAgICAgKSA6IHRoaXMucHJvcHMuc2hvd0Fycm93ID8gKFxuICAgICAgICAgICAgICAgIDxEcm9wZG93blNlbGVjdEFjdGlvblJpZ2h0PlxuICAgICAgICAgICAgICAgICAgPEFycm93RG93biBoZWlnaHQ9XCIxNHB4XCIgb25DbGljaz17dGhpcy5fc2hvd1R5cGVhaGVhZH0gLz5cbiAgICAgICAgICAgICAgICA8L0Ryb3Bkb3duU2VsZWN0QWN0aW9uUmlnaHQ+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgPC9TdHlsZWREcm9wZG93blNlbGVjdD5cbiAgICAgICAgICApfVxuICAgICAgICAgIHsvKiB0aGlzIHBhcnQgaXMgdXNlZCB0byBidWlsdCB0aGUgbGlzdCAqL31cbiAgICAgICAgICB7dGhpcy5zdGF0ZS5zaG93VHlwZWFoZWFkICYmIHRoaXMuX3JlbmRlckRyb3Bkb3duKGludGwpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IEl0ZW1TZWxlY3Rvckxpc3RlbiA9IGxpc3RlbnNUb0NsaWNrT3V0c2lkZShJdGVtU2VsZWN0b3IpO1xuZXhwb3J0IGRlZmF1bHQgaW5qZWN0SW50bChsaXN0ZW5zVG9DbGlja091dHNpZGUoSXRlbVNlbGVjdG9yKSk7XG4iXX0=