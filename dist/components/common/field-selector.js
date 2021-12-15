"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldListItemFactoryFactory = FieldListItemFactoryFactory;
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reselect = require("reselect");

var _itemSelector = _interopRequireDefault(require("./item-selector/item-selector"));

var _dropdownList = require("./item-selector/dropdown-list");

var _utils = require("../../utils/utils");

var _dataUtils = require("../../utils/data-utils");

var _fieldToken = _interopRequireDefault(require("../common/field-token"));

var _templateObject, _templateObject2;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var defaultDisplayOption = function defaultDisplayOption(d) {
  return d.displayName || d.name;
};

var defaultValueOption = function defaultValueOption(d) {
  return d.name;
};

var StyledToken = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  margin: 0 ", "px 0 0;\n"])), function (props) {
  return props.theme.fieldTokenRightMargin;
});

var StyledFieldListItem = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  line-height: 0;\n"])));

FieldListItemFactoryFactory.deps = [_fieldToken["default"]]; // custom list Item

function FieldListItemFactoryFactory(FieldToken) {
  var FieldListItemFactory = function FieldListItemFactory() {
    var showToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var FieldListItem = function FieldListItem(_ref) {
      var value = _ref.value,
          _ref$displayOption = _ref.displayOption,
          displayOption = _ref$displayOption === void 0 ? defaultDisplayOption : _ref$displayOption;
      return /*#__PURE__*/_react["default"].createElement(StyledFieldListItem, {
        className: "field-selector_list-item"
      }, showToken ? /*#__PURE__*/_react["default"].createElement(StyledToken, null, /*#__PURE__*/_react["default"].createElement(FieldToken, {
        type: value.type
      })) : null, /*#__PURE__*/_react["default"].createElement("span", {
        className: _dropdownList.classList.listItemAnchor
      }, displayOption(value)));
    };

    return FieldListItem;
  };

  return FieldListItemFactory;
}

var SuggestedFieldHeader = function SuggestedFieldHeader() {
  return /*#__PURE__*/_react["default"].createElement("div", null, "Suggested Field");
};

var FieldType = _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string), _propTypes["default"].arrayOf(_propTypes["default"].shape({
  name: _propTypes["default"].string,
  format: _propTypes["default"].string
})), _propTypes["default"].shape({
  format: _propTypes["default"].string,
  id: _propTypes["default"].string,
  name: _propTypes["default"].string,
  fieldIdx: _propTypes["default"].number,
  type: _propTypes["default"].number
})]);

function FieldSelectorFactory(FieldListItemFactory) {
  var FieldSelector = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(FieldSelector, _Component);

    var _super = _createSuper(FieldSelector);

    function FieldSelector() {
      var _this;

      (0, _classCallCheck2["default"])(this, FieldSelector);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "fieldsSelector", function (props) {
        return props.fields;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filteredFieldsSelector", function (props) {
        return props.fields.filter(function (field) {
          return !(0, _utils.toArray)(props.value).find(function (d) {
            return d.name ? d.name === field.name : d === field.name;
          });
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "valueSelector", function (props) {
        return props.value;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filterFieldTypesSelector", function (props) {
        return props.filterFieldTypes;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "showTokenSelector", function (props) {
        return props.showToken;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "selectedItemsSelector", (0, _reselect.createSelector)(_this.fieldsSelector, _this.valueSelector, function (fields, value) {
        return (0, _utils.toArray)(value).map(function (d) {
          return fields.find(function (f) {
            return (0, _dataUtils.notNullorUndefined)(d) && d.name ? d.name === defaultValueOption(f) : d === defaultValueOption(f);
          });
        }).filter(function (d) {
          return d;
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "fieldOptionsSelector", (0, _reselect.createSelector)(_this.filteredFieldsSelector, _this.filterFieldTypesSelector, function (fields, filterFieldTypes) {
        if (!filterFieldTypes) {
          return fields;
        }

        var filters = Array.isArray(filterFieldTypes) ? filterFieldTypes : [filterFieldTypes];
        return fields.filter(function (f) {
          return filters.includes(f.type);
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "fieldListItemSelector", (0, _reselect.createSelector)(_this.showTokenSelector, FieldListItemFactory));
      return _this;
    }

    (0, _createClass2["default"])(FieldSelector, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "field-selector"
        }, /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], {
          getOptionValue: function getOptionValue(d) {
            return d;
          },
          closeOnSelect: this.props.closeOnSelect,
          displayOption: defaultDisplayOption,
          filterOption: "displayName",
          fixedOptions: this.props.suggested,
          inputTheme: this.props.inputTheme,
          size: this.props.size,
          isError: this.props.error,
          selectedItems: this.selectedItemsSelector(this.props),
          erasable: this.props.erasable,
          options: this.fieldOptionsSelector(this.props),
          multiSelect: this.props.multiSelect,
          placeholder: this.props.placeholder,
          placement: this.props.placement,
          onChange: this.props.onSelect,
          DropDownLineItemRenderComponent: this.fieldListItemSelector(this.props),
          DropdownHeaderComponent: this.props.suggested ? SuggestedFieldHeader : null,
          CustomChickletComponent: this.props.CustomChickletComponent
        }));
      }
    }]);
    return FieldSelector;
  }(_react.Component);

  (0, _defineProperty2["default"])(FieldSelector, "propTypes", {
    fields: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].arrayOf(FieldType)]),
    onSelect: _propTypes["default"].func.isRequired,
    placement: _propTypes["default"].string,
    value: FieldType,
    filterFieldTypes: _propTypes["default"].oneOfType([FieldType, _propTypes["default"].arrayOf(FieldType)]),
    inputTheme: _propTypes["default"].string,
    placeholder: _propTypes["default"].string,
    erasable: _propTypes["default"].bool,
    error: _propTypes["default"].bool,
    multiSelect: _propTypes["default"].bool,
    closeOnSelect: _propTypes["default"].bool,
    showToken: _propTypes["default"].bool,
    suggested: _propTypes["default"].arrayOf(_propTypes["default"].any),
    CustomChickletComponent: _propTypes["default"].func
  });
  (0, _defineProperty2["default"])(FieldSelector, "defaultProps", {
    erasable: true,
    error: false,
    fields: [],
    onSelect: function onSelect() {},
    placement: 'bottom',
    value: null,
    multiSelect: false,
    closeOnSelect: true,
    showToken: true,
    placeholder: 'placeholder.selectField'
  });
  return FieldSelector;
}

FieldSelectorFactory.deps = [FieldListItemFactoryFactory];
var _default = FieldSelectorFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0RGlzcGxheU9wdGlvbiIsImQiLCJkaXNwbGF5TmFtZSIsIm5hbWUiLCJkZWZhdWx0VmFsdWVPcHRpb24iLCJTdHlsZWRUb2tlbiIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJmaWVsZFRva2VuUmlnaHRNYXJnaW4iLCJTdHlsZWRGaWVsZExpc3RJdGVtIiwiRmllbGRMaXN0SXRlbUZhY3RvcnlGYWN0b3J5IiwiZGVwcyIsIkZpZWxkVG9rZW5GYWN0b3J5IiwiRmllbGRUb2tlbiIsIkZpZWxkTGlzdEl0ZW1GYWN0b3J5Iiwic2hvd1Rva2VuIiwiRmllbGRMaXN0SXRlbSIsInZhbHVlIiwiZGlzcGxheU9wdGlvbiIsInR5cGUiLCJjbGFzc0xpc3QiLCJsaXN0SXRlbUFuY2hvciIsIlN1Z2dlc3RlZEZpZWxkSGVhZGVyIiwiRmllbGRUeXBlIiwiUHJvcFR5cGVzIiwib25lT2ZUeXBlIiwic3RyaW5nIiwiYXJyYXlPZiIsInNoYXBlIiwiZm9ybWF0IiwiaWQiLCJmaWVsZElkeCIsIm51bWJlciIsIkZpZWxkU2VsZWN0b3JGYWN0b3J5IiwiRmllbGRTZWxlY3RvciIsImZpZWxkcyIsImZpbHRlciIsImZpZWxkIiwiZmluZCIsImZpbHRlckZpZWxkVHlwZXMiLCJmaWVsZHNTZWxlY3RvciIsInZhbHVlU2VsZWN0b3IiLCJtYXAiLCJmIiwiZmlsdGVyZWRGaWVsZHNTZWxlY3RvciIsImZpbHRlckZpZWxkVHlwZXNTZWxlY3RvciIsImZpbHRlcnMiLCJBcnJheSIsImlzQXJyYXkiLCJpbmNsdWRlcyIsInNob3dUb2tlblNlbGVjdG9yIiwiY2xvc2VPblNlbGVjdCIsInN1Z2dlc3RlZCIsImlucHV0VGhlbWUiLCJzaXplIiwiZXJyb3IiLCJzZWxlY3RlZEl0ZW1zU2VsZWN0b3IiLCJlcmFzYWJsZSIsImZpZWxkT3B0aW9uc1NlbGVjdG9yIiwibXVsdGlTZWxlY3QiLCJwbGFjZWhvbGRlciIsInBsYWNlbWVudCIsIm9uU2VsZWN0IiwiZmllbGRMaXN0SXRlbVNlbGVjdG9yIiwiQ3VzdG9tQ2hpY2tsZXRDb21wb25lbnQiLCJDb21wb25lbnQiLCJhcnJheSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiYm9vbCIsImFueSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCLENBQUFDLENBQUM7QUFBQSxTQUFJQSxDQUFDLENBQUNDLFdBQUYsSUFBaUJELENBQUMsQ0FBQ0UsSUFBdkI7QUFBQSxDQUE5Qjs7QUFDQSxJQUFNQyxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCLENBQUFILENBQUM7QUFBQSxTQUFJQSxDQUFDLENBQUNFLElBQU47QUFBQSxDQUE1Qjs7QUFFQSxJQUFNRSxXQUFXLEdBQUdDLDZCQUFPQyxHQUFWLDRJQUVILFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMscUJBQWhCO0FBQUEsQ0FGRixDQUFqQjs7QUFJQSxJQUFNQyxtQkFBbUIsR0FBR0wsNkJBQU9DLEdBQVYsNkdBQXpCOztBQUlBSywyQkFBMkIsQ0FBQ0MsSUFBNUIsR0FBbUMsQ0FBQ0Msc0JBQUQsQ0FBbkMsQyxDQUNBOztBQUNPLFNBQVNGLDJCQUFULENBQXFDRyxVQUFyQyxFQUFpRDtBQUN0RCxNQUFNQyxvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCLEdBQXNCO0FBQUEsUUFBckJDLFNBQXFCLHVFQUFULElBQVM7O0FBQ2pELFFBQU1DLGFBQWEsR0FBRyxTQUFoQkEsYUFBZ0I7QUFBQSxVQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxvQ0FBU0MsYUFBVDtBQUFBLFVBQVNBLGFBQVQsbUNBQXlCcEIsb0JBQXpCO0FBQUEsMEJBQ3BC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OlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnLi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtjbGFzc0xpc3R9IGZyb20gJy4vaXRlbS1zZWxlY3Rvci9kcm9wZG93bi1saXN0JztcbmltcG9ydCB7dG9BcnJheX0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtub3ROdWxsb3JVbmRlZmluZWR9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuaW1wb3J0IEZpZWxkVG9rZW5GYWN0b3J5IGZyb20gJy4uL2NvbW1vbi9maWVsZC10b2tlbic7XG5cbmNvbnN0IGRlZmF1bHREaXNwbGF5T3B0aW9uID0gZCA9PiBkLmRpc3BsYXlOYW1lIHx8IGQubmFtZTtcbmNvbnN0IGRlZmF1bHRWYWx1ZU9wdGlvbiA9IGQgPT4gZC5uYW1lO1xuXG5jb25zdCBTdHlsZWRUb2tlbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luOiAwICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZmllbGRUb2tlblJpZ2h0TWFyZ2lufXB4IDAgMDtcbmA7XG5jb25zdCBTdHlsZWRGaWVsZExpc3RJdGVtID0gc3R5bGVkLmRpdmBcbiAgbGluZS1oZWlnaHQ6IDA7XG5gO1xuXG5GaWVsZExpc3RJdGVtRmFjdG9yeUZhY3RvcnkuZGVwcyA9IFtGaWVsZFRva2VuRmFjdG9yeV07XG4vLyBjdXN0b20gbGlzdCBJdGVtXG5leHBvcnQgZnVuY3Rpb24gRmllbGRMaXN0SXRlbUZhY3RvcnlGYWN0b3J5KEZpZWxkVG9rZW4pIHtcbiAgY29uc3QgRmllbGRMaXN0SXRlbUZhY3RvcnkgPSAoc2hvd1Rva2VuID0gdHJ1ZSkgPT4ge1xuICAgIGNvbnN0IEZpZWxkTGlzdEl0ZW0gPSAoe3ZhbHVlLCBkaXNwbGF5T3B0aW9uID0gZGVmYXVsdERpc3BsYXlPcHRpb259KSA9PiAoXG4gICAgICA8U3R5bGVkRmllbGRMaXN0SXRlbSBjbGFzc05hbWU9XCJmaWVsZC1zZWxlY3Rvcl9saXN0LWl0ZW1cIj5cbiAgICAgICAge3Nob3dUb2tlbiA/IChcbiAgICAgICAgICA8U3R5bGVkVG9rZW4+XG4gICAgICAgICAgICA8RmllbGRUb2tlbiB0eXBlPXt2YWx1ZS50eXBlfSAvPlxuICAgICAgICAgIDwvU3R5bGVkVG9rZW4+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2NsYXNzTGlzdC5saXN0SXRlbUFuY2hvcn0+e2Rpc3BsYXlPcHRpb24odmFsdWUpfTwvc3Bhbj5cbiAgICAgIDwvU3R5bGVkRmllbGRMaXN0SXRlbT5cbiAgICApO1xuICAgIHJldHVybiBGaWVsZExpc3RJdGVtO1xuICB9O1xuICByZXR1cm4gRmllbGRMaXN0SXRlbUZhY3Rvcnk7XG59XG5cbmNvbnN0IFN1Z2dlc3RlZEZpZWxkSGVhZGVyID0gKCkgPT4gPGRpdj5TdWdnZXN0ZWQgRmllbGQ8L2Rpdj47XG5cbmNvbnN0IEZpZWxkVHlwZSA9IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICBQcm9wVHlwZXMuc3RyaW5nLFxuICBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBmb3JtYXQ6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9KVxuICApLFxuICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGZvcm1hdDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZpZWxkSWR4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHR5cGU6IFByb3BUeXBlcy5udW1iZXJcbiAgfSlcbl0pO1xuXG5mdW5jdGlvbiBGaWVsZFNlbGVjdG9yRmFjdG9yeShGaWVsZExpc3RJdGVtRmFjdG9yeSkge1xuICBjbGFzcyBGaWVsZFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgZmllbGRzOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuYXJyYXksIFByb3BUeXBlcy5hcnJheU9mKEZpZWxkVHlwZSldKSxcbiAgICAgIG9uU2VsZWN0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgcGxhY2VtZW50OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgdmFsdWU6IEZpZWxkVHlwZSxcbiAgICAgIGZpbHRlckZpZWxkVHlwZXM6IFByb3BUeXBlcy5vbmVPZlR5cGUoW0ZpZWxkVHlwZSwgUHJvcFR5cGVzLmFycmF5T2YoRmllbGRUeXBlKV0pLFxuICAgICAgaW5wdXRUaGVtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgZXJhc2FibGU6IFByb3BUeXBlcy5ib29sLFxuICAgICAgZXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICAgICAgbXVsdGlTZWxlY3Q6IFByb3BUeXBlcy5ib29sLFxuICAgICAgY2xvc2VPblNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gICAgICBzaG93VG9rZW46IFByb3BUeXBlcy5ib29sLFxuICAgICAgc3VnZ2VzdGVkOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICAgIEN1c3RvbUNoaWNrbGV0Q29tcG9uZW50OiBQcm9wVHlwZXMuZnVuY1xuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgZXJhc2FibGU6IHRydWUsXG4gICAgICBlcnJvcjogZmFsc2UsXG4gICAgICBmaWVsZHM6IFtdLFxuICAgICAgb25TZWxlY3Q6ICgpID0+IHt9LFxuICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgICAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcbiAgICAgIHNob3dUb2tlbjogdHJ1ZSxcbiAgICAgIHBsYWNlaG9sZGVyOiAncGxhY2Vob2xkZXIuc2VsZWN0RmllbGQnXG4gICAgfTtcblxuICAgIGZpZWxkc1NlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmllbGRzO1xuICAgIGZpbHRlcmVkRmllbGRzU2VsZWN0b3IgPSBwcm9wcyA9PlxuICAgICAgcHJvcHMuZmllbGRzLmZpbHRlcihcbiAgICAgICAgZmllbGQgPT5cbiAgICAgICAgICAhdG9BcnJheShwcm9wcy52YWx1ZSkuZmluZChkID0+IChkLm5hbWUgPyBkLm5hbWUgPT09IGZpZWxkLm5hbWUgOiBkID09PSBmaWVsZC5uYW1lKSlcbiAgICAgICk7XG4gICAgdmFsdWVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLnZhbHVlO1xuICAgIGZpbHRlckZpZWxkVHlwZXNTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlckZpZWxkVHlwZXM7XG4gICAgc2hvd1Rva2VuU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5zaG93VG9rZW47XG5cbiAgICBzZWxlY3RlZEl0ZW1zU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHRoaXMuZmllbGRzU2VsZWN0b3IsXG4gICAgICB0aGlzLnZhbHVlU2VsZWN0b3IsXG4gICAgICAoZmllbGRzLCB2YWx1ZSkgPT5cbiAgICAgICAgdG9BcnJheSh2YWx1ZSlcbiAgICAgICAgICAubWFwKGQgPT5cbiAgICAgICAgICAgIGZpZWxkcy5maW5kKGYgPT5cbiAgICAgICAgICAgICAgbm90TnVsbG9yVW5kZWZpbmVkKGQpICYmIGQubmFtZVxuICAgICAgICAgICAgICAgID8gZC5uYW1lID09PSBkZWZhdWx0VmFsdWVPcHRpb24oZilcbiAgICAgICAgICAgICAgICA6IGQgPT09IGRlZmF1bHRWYWx1ZU9wdGlvbihmKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgICAuZmlsdGVyKGQgPT4gZClcbiAgICApO1xuXG4gICAgZmllbGRPcHRpb25zU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHRoaXMuZmlsdGVyZWRGaWVsZHNTZWxlY3RvcixcbiAgICAgIHRoaXMuZmlsdGVyRmllbGRUeXBlc1NlbGVjdG9yLFxuICAgICAgKGZpZWxkcywgZmlsdGVyRmllbGRUeXBlcykgPT4ge1xuICAgICAgICBpZiAoIWZpbHRlckZpZWxkVHlwZXMpIHtcbiAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbHRlcnMgPSBBcnJheS5pc0FycmF5KGZpbHRlckZpZWxkVHlwZXMpID8gZmlsdGVyRmllbGRUeXBlcyA6IFtmaWx0ZXJGaWVsZFR5cGVzXTtcbiAgICAgICAgcmV0dXJuIGZpZWxkcy5maWx0ZXIoZiA9PiBmaWx0ZXJzLmluY2x1ZGVzKGYudHlwZSkpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICBmaWVsZExpc3RJdGVtU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLnNob3dUb2tlblNlbGVjdG9yLCBGaWVsZExpc3RJdGVtRmFjdG9yeSk7XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLXNlbGVjdG9yXCI+XG4gICAgICAgICAgPEl0ZW1TZWxlY3RvclxuICAgICAgICAgICAgZ2V0T3B0aW9uVmFsdWU9e2QgPT4gZH1cbiAgICAgICAgICAgIGNsb3NlT25TZWxlY3Q9e3RoaXMucHJvcHMuY2xvc2VPblNlbGVjdH1cbiAgICAgICAgICAgIGRpc3BsYXlPcHRpb249e2RlZmF1bHREaXNwbGF5T3B0aW9ufVxuICAgICAgICAgICAgZmlsdGVyT3B0aW9uPVwiZGlzcGxheU5hbWVcIlxuICAgICAgICAgICAgZml4ZWRPcHRpb25zPXt0aGlzLnByb3BzLnN1Z2dlc3RlZH1cbiAgICAgICAgICAgIGlucHV0VGhlbWU9e3RoaXMucHJvcHMuaW5wdXRUaGVtZX1cbiAgICAgICAgICAgIHNpemU9e3RoaXMucHJvcHMuc2l6ZX1cbiAgICAgICAgICAgIGlzRXJyb3I9e3RoaXMucHJvcHMuZXJyb3J9XG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt0aGlzLnNlbGVjdGVkSXRlbXNTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICAgIGVyYXNhYmxlPXt0aGlzLnByb3BzLmVyYXNhYmxlfVxuICAgICAgICAgICAgb3B0aW9ucz17dGhpcy5maWVsZE9wdGlvbnNTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICAgIG11bHRpU2VsZWN0PXt0aGlzLnByb3BzLm11bHRpU2VsZWN0fVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICBwbGFjZW1lbnQ9e3RoaXMucHJvcHMucGxhY2VtZW50fVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25TZWxlY3R9XG4gICAgICAgICAgICBEcm9wRG93bkxpbmVJdGVtUmVuZGVyQ29tcG9uZW50PXt0aGlzLmZpZWxkTGlzdEl0ZW1TZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICAgIERyb3Bkb3duSGVhZGVyQ29tcG9uZW50PXt0aGlzLnByb3BzLnN1Z2dlc3RlZCA/IFN1Z2dlc3RlZEZpZWxkSGVhZGVyIDogbnVsbH1cbiAgICAgICAgICAgIEN1c3RvbUNoaWNrbGV0Q29tcG9uZW50PXt0aGlzLnByb3BzLkN1c3RvbUNoaWNrbGV0Q29tcG9uZW50fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIEZpZWxkU2VsZWN0b3I7XG59XG5cbkZpZWxkU2VsZWN0b3JGYWN0b3J5LmRlcHMgPSBbRmllbGRMaXN0SXRlbUZhY3RvcnlGYWN0b3J5XTtcbmV4cG9ydCBkZWZhdWx0IEZpZWxkU2VsZWN0b3JGYWN0b3J5O1xuIl19