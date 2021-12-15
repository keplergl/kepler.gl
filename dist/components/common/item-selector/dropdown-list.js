"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ListItem = exports.classList = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var classList = {
  list: 'list-selector',
  listHeader: 'list__header',
  listSection: 'list__section',
  listItem: 'list__item',
  listItemAnchor: 'list__item__anchor'
};
exports.classList = classList;

var defaultDisplay = function defaultDisplay(d) {
  return d;
};

var ListItem = function ListItem(_ref) {
  var value = _ref.value,
      _ref$displayOption = _ref.displayOption,
      displayOption = _ref$displayOption === void 0 ? defaultDisplay : _ref$displayOption;
  return /*#__PURE__*/_react["default"].createElement("span", {
    className: classList.listItemAnchor
  }, displayOption(value));
};

exports.ListItem = ListItem;

var DropdownListWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  border-top: 1px solid\n    ", ";\n  ", ";\n"])), function (props) {
  return props.light ? props.theme.dropdownListBgdLT : props.theme.dropdownListBgd;
}, function (props) {
  return props.light ? props.theme.dropdownListBorderTopLT : props.theme.dropdownListBorderTop;
}, function (props) {
  return props.light ? props.theme.dropdownListLT : props.theme.dropdownList;
});

var DropdownList = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(DropdownList, _Component);

  var _super = _createSuper(DropdownList);

  function DropdownList() {
    (0, _classCallCheck2["default"])(this, DropdownList);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(DropdownList, [{
    key: "_onClick",
    value: function _onClick(result, event) {
      event.preventDefault();
      this.props.onOptionSelected(result, event);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          fixedOptions = _this$props.fixedOptions,
          light = _this$props.light;
      var display = this.props.displayOption; // Don't render if there are no options to display

      if (!this.props.options.length && this.props.allowCustomValues <= 0) {
        return false;
      }

      var valueOffset = Array.isArray(fixedOptions) ? fixedOptions.length : 0; // For some reason onClick is not fired when clicked on an option
      // onMouseDown is used here as a workaround of #205 and other

      return /*#__PURE__*/_react["default"].createElement(DropdownListWrapper, {
        className: classList.list,
        light: light
      }, this.props.customListHeaderComponent ? /*#__PURE__*/_react["default"].createElement("div", {
        className: classList.listHeader
      }, /*#__PURE__*/_react["default"].createElement(this.props.customListHeaderComponent, null)) : null, valueOffset > 0 ? /*#__PURE__*/_react["default"].createElement("div", {
        className: classList.listSection
      }, fixedOptions.map(function (value, i) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: (0, _classnames["default"])(classList.listItem, {
            hover: _this.props.selectionIndex === i,
            fixed: true
          }),
          key: "".concat(display(value), "_").concat(i),
          onMouseDown: function onMouseDown(e) {
            return _this._onClick(value, e);
          },
          onClick: function onClick(e) {
            return _this._onClick(value, e);
          }
        }, /*#__PURE__*/_react["default"].createElement(_this.props.customListItemComponent, {
          value: value,
          displayOption: display
        }));
      })) : null, this.props.options.map(function (value, i) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: (0, _classnames["default"])(classList.listItem, {
            hover: _this.props.selectionIndex === i + valueOffset
          }),
          key: "".concat(display(value), "_").concat(i),
          onMouseDown: function onMouseDown(e) {
            return _this._onClick(value, e);
          },
          onClick: function onClick(e) {
            return _this._onClick(value, e);
          }
        }, /*#__PURE__*/_react["default"].createElement(_this.props.customListItemComponent, {
          value: value,
          displayOption: display
        }));
      }));
    }
  }]);
  return DropdownList;
}(_react.Component);

exports["default"] = DropdownList;
(0, _defineProperty2["default"])(DropdownList, "propTypes", {
  options: _propTypes["default"].arrayOf(_propTypes["default"].any),
  allowCustomValues: _propTypes["default"].number,
  customClasses: _propTypes["default"].object,
  customValues: _propTypes["default"].arrayOf(_propTypes["default"].any),
  customListItemComponent: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
  customListHeaderComponent: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
  selectionIndex: _propTypes["default"].number,
  onOptionSelected: _propTypes["default"].func,
  displayOption: _propTypes["default"].func.isRequired,
  defaultClassNames: _propTypes["default"].bool,
  areResultsTruncated: _propTypes["default"].bool,
  resultsTruncatedMessage: _propTypes["default"].string,
  listItemComponent: _propTypes["default"].func
});
(0, _defineProperty2["default"])(DropdownList, "defaultProps", {
  customClasses: {},
  customListItemComponent: ListItem,
  customListHeaderComponent: null,
  allowCustomValues: 0,
  customValues: [],
  displayOption: defaultDisplay,
  onOptionSelected: function onOptionSelected() {},
  defaultClassNames: true,
  selectionIndex: null
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2Ryb3Bkb3duLWxpc3QuanMiXSwibmFtZXMiOlsiY2xhc3NMaXN0IiwibGlzdCIsImxpc3RIZWFkZXIiLCJsaXN0U2VjdGlvbiIsImxpc3RJdGVtIiwibGlzdEl0ZW1BbmNob3IiLCJkZWZhdWx0RGlzcGxheSIsImQiLCJMaXN0SXRlbSIsInZhbHVlIiwiZGlzcGxheU9wdGlvbiIsIkRyb3Bkb3duTGlzdFdyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsImxpZ2h0IiwidGhlbWUiLCJkcm9wZG93bkxpc3RCZ2RMVCIsImRyb3Bkb3duTGlzdEJnZCIsImRyb3Bkb3duTGlzdEJvcmRlclRvcExUIiwiZHJvcGRvd25MaXN0Qm9yZGVyVG9wIiwiZHJvcGRvd25MaXN0TFQiLCJkcm9wZG93bkxpc3QiLCJEcm9wZG93bkxpc3QiLCJyZXN1bHQiLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwib25PcHRpb25TZWxlY3RlZCIsImZpeGVkT3B0aW9ucyIsImRpc3BsYXkiLCJvcHRpb25zIiwibGVuZ3RoIiwiYWxsb3dDdXN0b21WYWx1ZXMiLCJ2YWx1ZU9mZnNldCIsIkFycmF5IiwiaXNBcnJheSIsImN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQiLCJtYXAiLCJpIiwiaG92ZXIiLCJzZWxlY3Rpb25JbmRleCIsImZpeGVkIiwiZSIsIl9vbkNsaWNrIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsImFueSIsIm51bWJlciIsImN1c3RvbUNsYXNzZXMiLCJvYmplY3QiLCJjdXN0b21WYWx1ZXMiLCJjdXN0b21MaXN0SXRlbUNvbXBvbmVudCIsIm9uZU9mVHlwZSIsImVsZW1lbnQiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImRlZmF1bHRDbGFzc05hbWVzIiwiYm9vbCIsImFyZVJlc3VsdHNUcnVuY2F0ZWQiLCJyZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZSIsInN0cmlu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QUFFZCxzQkFBVWEsSUFYZDtBQVlqQkUsRUFBQUEsdUJBQXVCLEVBQUVmLHNCQUFVZ0IsTUFabEI7QUFhakJDLEVBQUFBLGlCQUFpQixFQUFFakIsc0JBQVVVO0FBYlosQztpQ0FEQWhDLFksa0JBaUJHO0FBQ3BCMEIsRUFBQUEsYUFBYSxFQUFFLEVBREs7QUFFcEJHLEVBQUFBLHVCQUF1QixFQUFFNUMsUUFGTDtBQUdwQjRCLEVBQUFBLHlCQUF5QixFQUFFLElBSFA7QUFJcEJKLEVBQUFBLGlCQUFpQixFQUFFLENBSkM7QUFLcEJtQixFQUFBQSxZQUFZLEVBQUUsRUFMTTtBQU1wQnpDLEVBQUFBLGFBQWEsRUFBRUosY0FOSztBQU9wQnFCLEVBQUFBLGdCQUFnQixFQUFFLDRCQUFNLENBQUUsQ0FQTjtBQVFwQjhCLEVBQUFBLGlCQUFpQixFQUFFLElBUkM7QUFTcEJqQixFQUFBQSxjQUFjLEVBQUU7QUFUSSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuZXhwb3J0IGNvbnN0IGNsYXNzTGlzdCA9IHtcbiAgbGlzdDogJ2xpc3Qtc2VsZWN0b3InLFxuICBsaXN0SGVhZGVyOiAnbGlzdF9faGVhZGVyJyxcbiAgbGlzdFNlY3Rpb246ICdsaXN0X19zZWN0aW9uJyxcbiAgbGlzdEl0ZW06ICdsaXN0X19pdGVtJyxcbiAgbGlzdEl0ZW1BbmNob3I6ICdsaXN0X19pdGVtX19hbmNob3InXG59O1xuXG5jb25zdCBkZWZhdWx0RGlzcGxheSA9IGQgPT4gZDtcbmV4cG9ydCBjb25zdCBMaXN0SXRlbSA9ICh7dmFsdWUsIGRpc3BsYXlPcHRpb24gPSBkZWZhdWx0RGlzcGxheX0pID0+IChcbiAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc0xpc3QubGlzdEl0ZW1BbmNob3J9PntkaXNwbGF5T3B0aW9uKHZhbHVlKX08L3NwYW4+XG4pO1xuXG5jb25zdCBEcm9wZG93bkxpc3RXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmxpZ2h0ID8gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkTFQgOiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCZ2R9O1xuICBib3JkZXItdG9wOiAxcHggc29saWRcbiAgICAke3Byb3BzID0+XG4gICAgICBwcm9wcy5saWdodCA/IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEJvcmRlclRvcExUIDogcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0Qm9yZGVyVG9wfTtcbiAgJHtwcm9wcyA9PiAocHJvcHMubGlnaHQgPyBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RMVCA6IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdCl9O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcGRvd25MaXN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBvcHRpb25zOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICBhbGxvd0N1c3RvbVZhbHVlczogUHJvcFR5cGVzLm51bWJlcixcbiAgICBjdXN0b21DbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGN1c3RvbVZhbHVlczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSksXG4gICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pLFxuICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5lbGVtZW50LCBQcm9wVHlwZXMuZnVuY10pLFxuICAgIHNlbGVjdGlvbkluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIG9uT3B0aW9uU2VsZWN0ZWQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRpc3BsYXlPcHRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgZGVmYXVsdENsYXNzTmFtZXM6IFByb3BUeXBlcy5ib29sLFxuICAgIGFyZVJlc3VsdHNUcnVuY2F0ZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIHJlc3VsdHNUcnVuY2F0ZWRNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGxpc3RJdGVtQ29tcG9uZW50OiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY3VzdG9tQ2xhc3Nlczoge30sXG4gICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ6IExpc3RJdGVtLFxuICAgIGN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQ6IG51bGwsXG4gICAgYWxsb3dDdXN0b21WYWx1ZXM6IDAsXG4gICAgY3VzdG9tVmFsdWVzOiBbXSxcbiAgICBkaXNwbGF5T3B0aW9uOiBkZWZhdWx0RGlzcGxheSxcbiAgICBvbk9wdGlvblNlbGVjdGVkOiAoKSA9PiB7fSxcbiAgICBkZWZhdWx0Q2xhc3NOYW1lczogdHJ1ZSxcbiAgICBzZWxlY3Rpb25JbmRleDogbnVsbFxuICB9O1xuXG4gIF9vbkNsaWNrKHJlc3VsdCwgZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMub25PcHRpb25TZWxlY3RlZChyZXN1bHQsIGV2ZW50KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Zml4ZWRPcHRpb25zLCBsaWdodH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGRpc3BsYXkgPSB0aGlzLnByb3BzLmRpc3BsYXlPcHRpb247XG5cbiAgICAvLyBEb24ndCByZW5kZXIgaWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMgdG8gZGlzcGxheVxuICAgIGlmICghdGhpcy5wcm9wcy5vcHRpb25zLmxlbmd0aCAmJiB0aGlzLnByb3BzLmFsbG93Q3VzdG9tVmFsdWVzIDw9IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZU9mZnNldCA9IEFycmF5LmlzQXJyYXkoZml4ZWRPcHRpb25zKSA/IGZpeGVkT3B0aW9ucy5sZW5ndGggOiAwO1xuXG4gICAgLy8gRm9yIHNvbWUgcmVhc29uIG9uQ2xpY2sgaXMgbm90IGZpcmVkIHdoZW4gY2xpY2tlZCBvbiBhbiBvcHRpb25cbiAgICAvLyBvbk1vdXNlRG93biBpcyB1c2VkIGhlcmUgYXMgYSB3b3JrYXJvdW5kIG9mICMyMDUgYW5kIG90aGVyXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcm9wZG93bkxpc3RXcmFwcGVyIGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3R9IGxpZ2h0PXtsaWdodH0+XG4gICAgICAgIHt0aGlzLnByb3BzLmN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTGlzdC5saXN0SGVhZGVyfT5cbiAgICAgICAgICAgIDx0aGlzLnByb3BzLmN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3ZhbHVlT2Zmc2V0ID4gMCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3RTZWN0aW9ufT5cbiAgICAgICAgICAgIHtmaXhlZE9wdGlvbnMubWFwKCh2YWx1ZSwgaSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTGlzdC5saXN0SXRlbSwge1xuICAgICAgICAgICAgICAgICAgaG92ZXI6IHRoaXMucHJvcHMuc2VsZWN0aW9uSW5kZXggPT09IGksXG4gICAgICAgICAgICAgICAgICBmaXhlZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIGtleT17YCR7ZGlzcGxheSh2YWx1ZSl9XyR7aX1gfVxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IHRoaXMuX29uQ2xpY2sodmFsdWUsIGUpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gdGhpcy5fb25DbGljayh2YWx1ZSwgZSl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8dGhpcy5wcm9wcy5jdXN0b21MaXN0SXRlbUNvbXBvbmVudCB2YWx1ZT17dmFsdWV9IGRpc3BsYXlPcHRpb249e2Rpc3BsYXl9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHt0aGlzLnByb3BzLm9wdGlvbnMubWFwKCh2YWx1ZSwgaSkgPT4gKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc0xpc3QubGlzdEl0ZW0sIHtcbiAgICAgICAgICAgICAgaG92ZXI6IHRoaXMucHJvcHMuc2VsZWN0aW9uSW5kZXggPT09IGkgKyB2YWx1ZU9mZnNldFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICBrZXk9e2Ake2Rpc3BsYXkodmFsdWUpfV8ke2l9YH1cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IHRoaXMuX29uQ2xpY2sodmFsdWUsIGUpfVxuICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLl9vbkNsaWNrKHZhbHVlLCBlKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8dGhpcy5wcm9wcy5jdXN0b21MaXN0SXRlbUNvbXBvbmVudCB2YWx1ZT17dmFsdWV9IGRpc3BsYXlPcHRpb249e2Rpc3BsYXl9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9Ecm9wZG93bkxpc3RXcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==