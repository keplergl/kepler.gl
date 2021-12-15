"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SourceDataSelectorFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reselect = require("reselect");

var _styledComponents = require("../../common/styled-components");

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _datasetTag = _interopRequireDefault(require("./dataset-tag"));

var _localization = require("../../../localization");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var defaultPlaceHolder = 'Select A Data Source';
SourceDataSelectorFactory.deps = [_datasetTag["default"]];

function SourceDataSelectorFactory(DatasetTag) {
  var DatasetItem = function DatasetItem(_ref) {
    var value = _ref.value;
    return /*#__PURE__*/_react["default"].createElement(DatasetTag, {
      dataset: value
    });
  };

  var SourceDataSelector = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(SourceDataSelector, _Component);

    var _super = _createSuper(SourceDataSelector);

    function SourceDataSelector() {
      var _this;

      (0, _classCallCheck2["default"])(this, SourceDataSelector);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "datasetsSelector", function (props) {
        return props.datasets;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "dsOptionsSelector", (0, _reselect.createSelector)(_this.datasetsSelector, function (datasets) {
        return Object.values(datasets).map(function (ds) {
          return {
            label: ds.label,
            value: ds.id,
            color: ds.color
          };
        });
      }));
      return _this;
    }

    (0, _createClass2["default"])(SourceDataSelector, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            dataId = _this$props.dataId,
            disabled = _this$props.disabled,
            onSelect = _this$props.onSelect,
            defaultValue = _this$props.defaultValue,
            inputTheme = _this$props.inputTheme;
        var dsOptions = this.dsOptionsSelector(this.props);
        return /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, {
          className: "data-source-selector"
        }, /*#__PURE__*/_react["default"].createElement(_styledComponents.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'misc.dataSource'
        })), /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], {
          inputTheme: inputTheme,
          selectedItems: dataId ? this.props.datasets[dataId] : null,
          options: dsOptions,
          getOptionValue: 'value',
          filterOption: 'label',
          multiSelect: false,
          onChange: onSelect,
          placeholder: defaultValue,
          disabled: Boolean(disabled),
          displayOption: 'label',
          DropDownLineItemRenderComponent: DatasetItem
        }));
      }
    }]);
    return SourceDataSelector;
  }(_react.Component);

  SourceDataSelector.defaultProps = {
    defaultValue: defaultPlaceHolder
  };
  return SourceDataSelector;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvY29tbW9uL3NvdXJjZS1kYXRhLXNlbGVjdG9yLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRQbGFjZUhvbGRlciIsIlNvdXJjZURhdGFTZWxlY3RvckZhY3RvcnkiLCJkZXBzIiwiRGF0YXNldFRhZ0ZhY3RvcnkiLCJEYXRhc2V0VGFnIiwiRGF0YXNldEl0ZW0iLCJ2YWx1ZSIsIlNvdXJjZURhdGFTZWxlY3RvciIsInByb3BzIiwiZGF0YXNldHMiLCJkYXRhc2V0c1NlbGVjdG9yIiwiT2JqZWN0IiwidmFsdWVzIiwibWFwIiwiZHMiLCJsYWJlbCIsImlkIiwiY29sb3IiLCJkYXRhSWQiLCJkaXNhYmxlZCIsIm9uU2VsZWN0IiwiZGVmYXVsdFZhbHVlIiwiaW5wdXRUaGVtZSIsImRzT3B0aW9ucyIsImRzT3B0aW9uc1NlbGVjdG9yIiwiQm9vbGVhbiIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLEdBQUcsc0JBQTNCO0FBRUFDLHlCQUF5QixDQUFDQyxJQUExQixHQUFpQyxDQUFDQyxzQkFBRCxDQUFqQzs7QUFFZSxTQUFTRix5QkFBVCxDQUFtQ0csVUFBbkMsRUFBK0M7QUFDNUQsTUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWM7QUFBQSxRQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSx3QkFBYSxnQ0FBQyxVQUFEO0FBQVksTUFBQSxPQUFPLEVBQUVBO0FBQXJCLE1BQWI7QUFBQSxHQUFwQjs7QUFENEQsTUFHdERDLGtCQUhzRDtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsMkdBTXZDLFVBQUFDLEtBQUs7QUFBQSxlQUFJQSxLQUFLLENBQUNDLFFBQVY7QUFBQSxPQU5rQztBQUFBLDRHQU90Qyw4QkFBZSxNQUFLQyxnQkFBcEIsRUFBc0MsVUFBQUQsUUFBUTtBQUFBLGVBQ2hFRSxNQUFNLENBQUNDLE1BQVAsQ0FBY0gsUUFBZCxFQUF3QkksR0FBeEIsQ0FBNEIsVUFBQUMsRUFBRTtBQUFBLGlCQUFLO0FBQ2pDQyxZQUFBQSxLQUFLLEVBQUVELEVBQUUsQ0FBQ0MsS0FEdUI7QUFFakNULFlBQUFBLEtBQUssRUFBRVEsRUFBRSxDQUFDRSxFQUZ1QjtBQUdqQ0MsWUFBQUEsS0FBSyxFQUFFSCxFQUFFLENBQUNHO0FBSHVCLFdBQUw7QUFBQSxTQUE5QixDQURnRTtBQUFBLE9BQTlDLENBUHNDO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsYUFlMUQsa0JBQVM7QUFBQSwwQkFDd0QsS0FBS1QsS0FEN0Q7QUFBQSxZQUNBVSxNQURBLGVBQ0FBLE1BREE7QUFBQSxZQUNRQyxRQURSLGVBQ1FBLFFBRFI7QUFBQSxZQUNrQkMsUUFEbEIsZUFDa0JBLFFBRGxCO0FBQUEsWUFDNEJDLFlBRDVCLGVBQzRCQSxZQUQ1QjtBQUFBLFlBQzBDQyxVQUQxQyxlQUMwQ0EsVUFEMUM7QUFFUCxZQUFNQyxTQUFTLEdBQUcsS0FBS0MsaUJBQUwsQ0FBdUIsS0FBS2hCLEtBQTVCLENBQWxCO0FBRUEsNEJBQ0UsZ0NBQUMsa0NBQUQ7QUFBa0IsVUFBQSxTQUFTLEVBQUM7QUFBNUIsd0JBQ0UsZ0NBQUMsNEJBQUQscUJBQ0UsZ0NBQUMsOEJBQUQ7QUFBa0IsVUFBQSxFQUFFLEVBQUU7QUFBdEIsVUFERixDQURGLGVBSUUsZ0NBQUMsd0JBQUQ7QUFDRSxVQUFBLFVBQVUsRUFBRWMsVUFEZDtBQUVFLFVBQUEsYUFBYSxFQUFFSixNQUFNLEdBQUcsS0FBS1YsS0FBTCxDQUFXQyxRQUFYLENBQW9CUyxNQUFwQixDQUFILEdBQWlDLElBRnhEO0FBR0UsVUFBQSxPQUFPLEVBQUVLLFNBSFg7QUFJRSxVQUFBLGNBQWMsRUFBRSxPQUpsQjtBQUtFLFVBQUEsWUFBWSxFQUFFLE9BTGhCO0FBTUUsVUFBQSxXQUFXLEVBQUUsS0FOZjtBQU9FLFVBQUEsUUFBUSxFQUFFSCxRQVBaO0FBUUUsVUFBQSxXQUFXLEVBQUVDLFlBUmY7QUFTRSxVQUFBLFFBQVEsRUFBRUksT0FBTyxDQUFDTixRQUFELENBVG5CO0FBVUUsVUFBQSxhQUFhLEVBQUUsT0FWakI7QUFXRSxVQUFBLCtCQUErQixFQUFFZDtBQVhuQyxVQUpGLENBREY7QUFvQkQ7QUF2Q3lEO0FBQUE7QUFBQSxJQUczQnFCLGdCQUgyQjs7QUEwQzVEbkIsRUFBQUEsa0JBQWtCLENBQUNvQixZQUFuQixHQUFrQztBQUNoQ04sSUFBQUEsWUFBWSxFQUFFckI7QUFEa0IsR0FBbEM7QUFHQSxTQUFPTyxrQkFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IERhdGFzZXRUYWdGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9jb21tb24vZGF0YXNldC10YWcnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5jb25zdCBkZWZhdWx0UGxhY2VIb2xkZXIgPSAnU2VsZWN0IEEgRGF0YSBTb3VyY2UnO1xuXG5Tb3VyY2VEYXRhU2VsZWN0b3JGYWN0b3J5LmRlcHMgPSBbRGF0YXNldFRhZ0ZhY3RvcnldO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTb3VyY2VEYXRhU2VsZWN0b3JGYWN0b3J5KERhdGFzZXRUYWcpIHtcbiAgY29uc3QgRGF0YXNldEl0ZW0gPSAoe3ZhbHVlfSkgPT4gPERhdGFzZXRUYWcgZGF0YXNldD17dmFsdWV9IC8+O1xuXG4gIGNsYXNzIFNvdXJjZURhdGFTZWxlY3RvciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLyogc2VsZWN0b3JzICovXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8taW52YWxpZC10aGlzICovXG4gICAgZGF0YXNldHNTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmRhdGFzZXRzO1xuICAgIGRzT3B0aW9uc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IodGhpcy5kYXRhc2V0c1NlbGVjdG9yLCBkYXRhc2V0cyA9PlxuICAgICAgT2JqZWN0LnZhbHVlcyhkYXRhc2V0cykubWFwKGRzID0+ICh7XG4gICAgICAgIGxhYmVsOiBkcy5sYWJlbCxcbiAgICAgICAgdmFsdWU6IGRzLmlkLFxuICAgICAgICBjb2xvcjogZHMuY29sb3JcbiAgICAgIH0pKVxuICAgICk7XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7ZGF0YUlkLCBkaXNhYmxlZCwgb25TZWxlY3QsIGRlZmF1bHRWYWx1ZSwgaW5wdXRUaGVtZX0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgZHNPcHRpb25zID0gdGhpcy5kc09wdGlvbnNTZWxlY3Rvcih0aGlzLnByb3BzKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24gY2xhc3NOYW1lPVwiZGF0YS1zb3VyY2Utc2VsZWN0b3JcIj5cbiAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbWlzYy5kYXRhU291cmNlJ30gLz5cbiAgICAgICAgICA8L1BhbmVsTGFiZWw+XG4gICAgICAgICAgPEl0ZW1TZWxlY3RvclxuICAgICAgICAgICAgaW5wdXRUaGVtZT17aW5wdXRUaGVtZX1cbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbXM9e2RhdGFJZCA/IHRoaXMucHJvcHMuZGF0YXNldHNbZGF0YUlkXSA6IG51bGx9XG4gICAgICAgICAgICBvcHRpb25zPXtkc09wdGlvbnN9XG4gICAgICAgICAgICBnZXRPcHRpb25WYWx1ZT17J3ZhbHVlJ31cbiAgICAgICAgICAgIGZpbHRlck9wdGlvbj17J2xhYmVsJ31cbiAgICAgICAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvblNlbGVjdH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtkZWZhdWx0VmFsdWV9XG4gICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihkaXNhYmxlZCl9XG4gICAgICAgICAgICBkaXNwbGF5T3B0aW9uPXsnbGFiZWwnfVxuICAgICAgICAgICAgRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudD17RGF0YXNldEl0ZW19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBTb3VyY2VEYXRhU2VsZWN0b3IuZGVmYXVsdFByb3BzID0ge1xuICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFBsYWNlSG9sZGVyXG4gIH07XG4gIHJldHVybiBTb3VyY2VEYXRhU2VsZWN0b3I7XG59XG4iXX0=