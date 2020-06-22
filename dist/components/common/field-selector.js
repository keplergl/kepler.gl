"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.FieldListItemFactory = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reselect = require("reselect");

var _itemSelector = _interopRequireDefault(require("./item-selector/item-selector"));

var _fieldToken = _interopRequireDefault(require("../common/field-token"));

var _dropdownList = require("./item-selector/dropdown-list");

var _utils = require("../../utils/utils");

var _dataUtils = require("../../utils/data-utils");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  margin: 0 4px 0 0;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var defaultDisplayOption = function defaultDisplayOption(d) {
  return d.name;
};

var StyledToken = _styledComponents["default"].div(_templateObject()); // custom list Item


var FieldListItemFactory = function FieldListItemFactory() {
  var showToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  var FieldListItem = function FieldListItem(_ref) {
    var value = _ref.value,
        _ref$displayOption = _ref.displayOption,
        displayOption = _ref$displayOption === void 0 ? defaultDisplayOption : _ref$displayOption;
    return _react["default"].createElement("div", null, showToken ? _react["default"].createElement(StyledToken, null, _react["default"].createElement(_fieldToken["default"], {
      type: value.type
    })) : null, _react["default"].createElement("span", {
      className: _dropdownList.classList.listItemAnchor
    }, displayOption(value)));
  };

  return FieldListItem;
};

exports.FieldListItemFactory = FieldListItemFactory;

var SuggestedFieldHeader = function SuggestedFieldHeader() {
  return _react["default"].createElement("div", null, "Suggested Field");
};

var FieldType = _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string), _propTypes["default"].arrayOf(_propTypes["default"].shape({
  name: _propTypes["default"].string,
  format: _propTypes["default"].string
})), _propTypes["default"].shape({
  format: _propTypes["default"].string,
  id: _propTypes["default"].string,
  name: _propTypes["default"].string,
  tableFieldIndex: _propTypes["default"].number,
  type: _propTypes["default"].number
})]);

var FieldSelector =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(FieldSelector, _Component);

  function FieldSelector() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, FieldSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(FieldSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
      return fields.filter(function (f) {
        return Boolean((0, _utils.toArray)(value).find(function (d) {
          if (!(0, _dataUtils.notNullorUndefined)(d)) {
            return false;
          }

          return d.name ? d.name === defaultDisplayOption(f) : d === defaultDisplayOption(f);
        }));
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
      return _react["default"].createElement("div", {
        className: "field-selector"
      }, _react["default"].createElement(_itemSelector["default"], {
        getOptionValue: function getOptionValue(d) {
          return d;
        },
        closeOnSelect: this.props.closeOnSelect,
        displayOption: defaultDisplayOption,
        filterOption: 'id',
        fixedOptions: this.props.suggested,
        inputTheme: this.props.inputTheme,
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
var _default = FieldSelector;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0RGlzcGxheU9wdGlvbiIsImQiLCJuYW1lIiwiU3R5bGVkVG9rZW4iLCJzdHlsZWQiLCJkaXYiLCJGaWVsZExpc3RJdGVtRmFjdG9yeSIsInNob3dUb2tlbiIsIkZpZWxkTGlzdEl0ZW0iLCJ2YWx1ZSIsImRpc3BsYXlPcHRpb24iLCJ0eXBlIiwiY2xhc3NMaXN0IiwibGlzdEl0ZW1BbmNob3IiLCJTdWdnZXN0ZWRGaWVsZEhlYWRlciIsIkZpZWxkVHlwZSIsIlByb3BUeXBlcyIsIm9uZU9mVHlwZSIsInN0cmluZyIsImFycmF5T2YiLCJzaGFwZSIsImZvcm1hdCIsImlkIiwidGFibGVGaWVsZEluZGV4IiwibnVtYmVyIiwiRmllbGRTZWxlY3RvciIsInByb3BzIiwiZmllbGRzIiwiZmlsdGVyIiwiZmllbGQiLCJmaW5kIiwiZmlsdGVyRmllbGRUeXBlcyIsImZpZWxkc1NlbGVjdG9yIiwidmFsdWVTZWxlY3RvciIsImYiLCJCb29sZWFuIiwiZmlsdGVyZWRGaWVsZHNTZWxlY3RvciIsImZpbHRlckZpZWxkVHlwZXNTZWxlY3RvciIsImZpbHRlcnMiLCJBcnJheSIsImlzQXJyYXkiLCJpbmNsdWRlcyIsInNob3dUb2tlblNlbGVjdG9yIiwiY2xvc2VPblNlbGVjdCIsInN1Z2dlc3RlZCIsImlucHV0VGhlbWUiLCJlcnJvciIsInNlbGVjdGVkSXRlbXNTZWxlY3RvciIsImVyYXNhYmxlIiwiZmllbGRPcHRpb25zU2VsZWN0b3IiLCJtdWx0aVNlbGVjdCIsInBsYWNlaG9sZGVyIiwicGxhY2VtZW50Iiwib25TZWxlY3QiLCJmaWVsZExpc3RJdGVtU2VsZWN0b3IiLCJDdXN0b21DaGlja2xldENvbXBvbmVudCIsIkNvbXBvbmVudCIsImFycmF5IiwiZnVuYyIsImlzUmVxdWlyZWQiLCJib29sIiwiYW55Il0sIm1hcHBpbmdzIjoiOzs7Ozs7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KSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnLi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IEZpZWxkVG9rZW4gZnJvbSAnLi4vY29tbW9uL2ZpZWxkLXRva2VuJztcbmltcG9ydCB7Y2xhc3NMaXN0fSBmcm9tICcuL2l0ZW0tc2VsZWN0b3IvZHJvcGRvd24tbGlzdCc7XG5pbXBvcnQge3RvQXJyYXl9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7bm90TnVsbG9yVW5kZWZpbmVkfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcblxuY29uc3QgZGVmYXVsdERpc3BsYXlPcHRpb24gPSBkID0+IGQubmFtZTtcblxuY29uc3QgU3R5bGVkVG9rZW4gPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIG1hcmdpbjogMCA0cHggMCAwO1xuYDtcblxuLy8gY3VzdG9tIGxpc3QgSXRlbVxuZXhwb3J0IGNvbnN0IEZpZWxkTGlzdEl0ZW1GYWN0b3J5ID0gKHNob3dUb2tlbiA9IHRydWUpID0+IHtcbiAgY29uc3QgRmllbGRMaXN0SXRlbSA9ICh7dmFsdWUsIGRpc3BsYXlPcHRpb24gPSBkZWZhdWx0RGlzcGxheU9wdGlvbn0pID0+IChcbiAgICA8ZGl2PlxuICAgICAge3Nob3dUb2tlbiA/IChcbiAgICAgICAgPFN0eWxlZFRva2VuPlxuICAgICAgICAgIDxGaWVsZFRva2VuIHR5cGU9e3ZhbHVlLnR5cGV9IC8+XG4gICAgICAgIDwvU3R5bGVkVG9rZW4+XG4gICAgICApIDogbnVsbH1cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3RJdGVtQW5jaG9yfT57ZGlzcGxheU9wdGlvbih2YWx1ZSl9PC9zcGFuPlxuICAgIDwvZGl2PlxuICApO1xuXG4gIHJldHVybiBGaWVsZExpc3RJdGVtO1xufTtcblxuY29uc3QgU3VnZ2VzdGVkRmllbGRIZWFkZXIgPSAoKSA9PiA8ZGl2PlN1Z2dlc3RlZCBGaWVsZDwvZGl2PjtcblxuY29uc3QgRmllbGRUeXBlID0gUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gIFByb3BUeXBlcy5zdHJpbmcsXG4gIFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBQcm9wVHlwZXMuYXJyYXlPZihcbiAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGZvcm1hdDogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0pXG4gICksXG4gIFByb3BUeXBlcy5zaGFwZSh7XG4gICAgZm9ybWF0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGFibGVGaWVsZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIHR5cGU6IFByb3BUeXBlcy5udW1iZXJcbiAgfSlcbl0pO1xuXG5jbGFzcyBGaWVsZFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBmaWVsZHM6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5hcnJheSwgUHJvcFR5cGVzLmFycmF5T2YoRmllbGRUeXBlKV0pLFxuICAgIG9uU2VsZWN0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHBsYWNlbWVudDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB2YWx1ZTogRmllbGRUeXBlLFxuICAgIGZpbHRlckZpZWxkVHlwZXM6IFByb3BUeXBlcy5vbmVPZlR5cGUoW0ZpZWxkVHlwZSwgUHJvcFR5cGVzLmFycmF5T2YoRmllbGRUeXBlKV0pLFxuICAgIGlucHV0VGhlbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZXJhc2FibGU6IFByb3BUeXBlcy5ib29sLFxuICAgIGVycm9yOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBtdWx0aVNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gICAgY2xvc2VPblNlbGVjdDogUHJvcFR5cGVzLmJvb2wsXG4gICAgc2hvd1Rva2VuOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzdWdnZXN0ZWQ6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLFxuICAgIEN1c3RvbUNoaWNrbGV0Q29tcG9uZW50OiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZXJhc2FibGU6IHRydWUsXG4gICAgZXJyb3I6IGZhbHNlLFxuICAgIGZpZWxkczogW10sXG4gICAgb25TZWxlY3Q6ICgpID0+IHt9LFxuICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgdmFsdWU6IG51bGwsXG4gICAgbXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIGNsb3NlT25TZWxlY3Q6IHRydWUsXG4gICAgc2hvd1Rva2VuOiB0cnVlLFxuICAgIHBsYWNlaG9sZGVyOiAncGxhY2Vob2xkZXIuc2VsZWN0RmllbGQnXG4gIH07XG5cbiAgZmllbGRzU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWVsZHM7XG4gIGZpbHRlcmVkRmllbGRzU2VsZWN0b3IgPSBwcm9wcyA9PlxuICAgIHByb3BzLmZpZWxkcy5maWx0ZXIoXG4gICAgICBmaWVsZCA9PiAhdG9BcnJheShwcm9wcy52YWx1ZSkuZmluZChkID0+IChkLm5hbWUgPyBkLm5hbWUgPT09IGZpZWxkLm5hbWUgOiBkID09PSBmaWVsZC5uYW1lKSlcbiAgICApO1xuICB2YWx1ZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMudmFsdWU7XG4gIGZpbHRlckZpZWxkVHlwZXNTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlckZpZWxkVHlwZXM7XG4gIHNob3dUb2tlblNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuc2hvd1Rva2VuO1xuXG4gIHNlbGVjdGVkSXRlbXNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuZmllbGRzU2VsZWN0b3IsIHRoaXMudmFsdWVTZWxlY3RvciwgKGZpZWxkcywgdmFsdWUpID0+XG4gICAgZmllbGRzLmZpbHRlcihmID0+XG4gICAgICBCb29sZWFuKFxuICAgICAgICB0b0FycmF5KHZhbHVlKS5maW5kKGQgPT4ge1xuICAgICAgICAgIGlmICghbm90TnVsbG9yVW5kZWZpbmVkKGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBkLm5hbWUgPyBkLm5hbWUgPT09IGRlZmF1bHREaXNwbGF5T3B0aW9uKGYpIDogZCA9PT0gZGVmYXVsdERpc3BsYXlPcHRpb24oZik7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgKVxuICApO1xuXG4gIGZpZWxkT3B0aW9uc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5maWx0ZXJlZEZpZWxkc1NlbGVjdG9yLFxuICAgIHRoaXMuZmlsdGVyRmllbGRUeXBlc1NlbGVjdG9yLFxuICAgIChmaWVsZHMsIGZpbHRlckZpZWxkVHlwZXMpID0+IHtcbiAgICAgIGlmICghZmlsdGVyRmllbGRUeXBlcykge1xuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVycyA9IEFycmF5LmlzQXJyYXkoZmlsdGVyRmllbGRUeXBlcykgPyBmaWx0ZXJGaWVsZFR5cGVzIDogW2ZpbHRlckZpZWxkVHlwZXNdO1xuICAgICAgcmV0dXJuIGZpZWxkcy5maWx0ZXIoZiA9PiBmaWx0ZXJzLmluY2x1ZGVzKGYudHlwZSkpO1xuICAgIH1cbiAgKTtcblxuICBmaWVsZExpc3RJdGVtU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3Rvcih0aGlzLnNob3dUb2tlblNlbGVjdG9yLCBGaWVsZExpc3RJdGVtRmFjdG9yeSk7XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLXNlbGVjdG9yXCI+XG4gICAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgICBnZXRPcHRpb25WYWx1ZT17ZCA9PiBkfVxuICAgICAgICAgIGNsb3NlT25TZWxlY3Q9e3RoaXMucHJvcHMuY2xvc2VPblNlbGVjdH1cbiAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtkZWZhdWx0RGlzcGxheU9wdGlvbn1cbiAgICAgICAgICBmaWx0ZXJPcHRpb249eydpZCd9XG4gICAgICAgICAgZml4ZWRPcHRpb25zPXt0aGlzLnByb3BzLnN1Z2dlc3RlZH1cbiAgICAgICAgICBpbnB1dFRoZW1lPXt0aGlzLnByb3BzLmlucHV0VGhlbWV9XG4gICAgICAgICAgaXNFcnJvcj17dGhpcy5wcm9wcy5lcnJvcn1cbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt0aGlzLnNlbGVjdGVkSXRlbXNTZWxlY3Rvcih0aGlzLnByb3BzKX1cbiAgICAgICAgICBlcmFzYWJsZT17dGhpcy5wcm9wcy5lcmFzYWJsZX1cbiAgICAgICAgICBvcHRpb25zPXt0aGlzLmZpZWxkT3B0aW9uc1NlbGVjdG9yKHRoaXMucHJvcHMpfVxuICAgICAgICAgIG11bHRpU2VsZWN0PXt0aGlzLnByb3BzLm11bHRpU2VsZWN0fVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgIHBsYWNlbWVudD17dGhpcy5wcm9wcy5wbGFjZW1lbnR9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25TZWxlY3R9XG4gICAgICAgICAgRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudD17dGhpcy5maWVsZExpc3RJdGVtU2VsZWN0b3IodGhpcy5wcm9wcyl9XG4gICAgICAgICAgRHJvcGRvd25IZWFkZXJDb21wb25lbnQ9e3RoaXMucHJvcHMuc3VnZ2VzdGVkID8gU3VnZ2VzdGVkRmllbGRIZWFkZXIgOiBudWxsfVxuICAgICAgICAgIEN1c3RvbUNoaWNrbGV0Q29tcG9uZW50PXt0aGlzLnByb3BzLkN1c3RvbUNoaWNrbGV0Q29tcG9uZW50fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGaWVsZFNlbGVjdG9yO1xuIl19