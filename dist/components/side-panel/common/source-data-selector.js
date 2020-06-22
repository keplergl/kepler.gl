"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SourceDataSelectorFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reselect = require("reselect");

var _styledComponents = require("../../common/styled-components");

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _datasetTag = _interopRequireDefault(require("./dataset-tag"));

var _reactIntl = require("react-intl");

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var defaultPlaceHolder = 'Select A Data Source';
SourceDataSelectorFactory.deps = [_datasetTag["default"]];

function SourceDataSelectorFactory(DatasetTag) {
  var DatasetItem = function DatasetItem(_ref) {
    var value = _ref.value;
    return _react["default"].createElement(DatasetTag, {
      dataset: value
    });
  };

  var SourceDataSelector =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(SourceDataSelector, _Component);

    function SourceDataSelector() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, SourceDataSelector);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(SourceDataSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
        return _react["default"].createElement(_styledComponents.SidePanelSection, {
          className: "data-source-selector"
        }, _react["default"].createElement(_styledComponents.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'misc.dataSource'
        })), _react["default"].createElement(_itemSelector["default"], {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvY29tbW9uL3NvdXJjZS1kYXRhLXNlbGVjdG9yLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRQbGFjZUhvbGRlciIsIlNvdXJjZURhdGFTZWxlY3RvckZhY3RvcnkiLCJkZXBzIiwiRGF0YXNldFRhZ0ZhY3RvcnkiLCJEYXRhc2V0VGFnIiwiRGF0YXNldEl0ZW0iLCJ2YWx1ZSIsIlNvdXJjZURhdGFTZWxlY3RvciIsInByb3BzIiwiZGF0YXNldHMiLCJkYXRhc2V0c1NlbGVjdG9yIiwiT2JqZWN0IiwidmFsdWVzIiwibWFwIiwiZHMiLCJsYWJlbCIsImlkIiwiY29sb3IiLCJkYXRhSWQiLCJkaXNhYmxlZCIsIm9uU2VsZWN0IiwiZGVmYXVsdFZhbHVlIiwiaW5wdXRUaGVtZSIsImRzT3B0aW9ucyIsImRzT3B0aW9uc1NlbGVjdG9yIiwiQm9vbGVhbiIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUExQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFVQSxJQUFNQSxrQkFBa0IsR0FBRyxzQkFBM0I7QUFFQUMseUJBQXlCLENBQUNDLElBQTFCLEdBQWlDLENBQUNDLHNCQUFELENBQWpDOztBQUVlLFNBQVNGLHlCQUFULENBQW1DRyxVQUFuQyxFQUErQztBQUM1RCxNQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYztBQUFBLFFBQUVDLEtBQUYsUUFBRUEsS0FBRjtBQUFBLFdBQWEsZ0NBQUMsVUFBRDtBQUFZLE1BQUEsT0FBTyxFQUFFQTtBQUFyQixNQUFiO0FBQUEsR0FBcEI7O0FBRDRELE1BR3REQyxrQkFIc0Q7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSwyR0FNdkMsVUFBQUMsS0FBSztBQUFBLGVBQUlBLEtBQUssQ0FBQ0MsUUFBVjtBQUFBLE9BTmtDO0FBQUEsNEdBT3RDLDhCQUFlLE1BQUtDLGdCQUFwQixFQUFzQyxVQUFBRCxRQUFRO0FBQUEsZUFDaEVFLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjSCxRQUFkLEVBQXdCSSxHQUF4QixDQUE0QixVQUFBQyxFQUFFO0FBQUEsaUJBQUs7QUFDakNDLFlBQUFBLEtBQUssRUFBRUQsRUFBRSxDQUFDQyxLQUR1QjtBQUVqQ1QsWUFBQUEsS0FBSyxFQUFFUSxFQUFFLENBQUNFLEVBRnVCO0FBR2pDQyxZQUFBQSxLQUFLLEVBQUVILEVBQUUsQ0FBQ0c7QUFIdUIsV0FBTDtBQUFBLFNBQTlCLENBRGdFO0FBQUEsT0FBOUMsQ0FQc0M7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFlakQ7QUFBQSwwQkFDd0QsS0FBS1QsS0FEN0Q7QUFBQSxZQUNBVSxNQURBLGVBQ0FBLE1BREE7QUFBQSxZQUNRQyxRQURSLGVBQ1FBLFFBRFI7QUFBQSxZQUNrQkMsUUFEbEIsZUFDa0JBLFFBRGxCO0FBQUEsWUFDNEJDLFlBRDVCLGVBQzRCQSxZQUQ1QjtBQUFBLFlBQzBDQyxVQUQxQyxlQUMwQ0EsVUFEMUM7QUFFUCxZQUFNQyxTQUFTLEdBQUcsS0FBS0MsaUJBQUwsQ0FBdUIsS0FBS2hCLEtBQTVCLENBQWxCO0FBRUEsZUFDRSxnQ0FBQyxrQ0FBRDtBQUFrQixVQUFBLFNBQVMsRUFBQztBQUE1QixXQUNFLGdDQUFDLDRCQUFELFFBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsVUFBQSxFQUFFLEVBQUU7QUFBdEIsVUFERixDQURGLEVBSUUsZ0NBQUMsd0JBQUQ7QUFDRSxVQUFBLFVBQVUsRUFBRWMsVUFEZDtBQUVFLFVBQUEsYUFBYSxFQUFFSixNQUFNLEdBQUcsS0FBS1YsS0FBTCxDQUFXQyxRQUFYLENBQW9CUyxNQUFwQixDQUFILEdBQWlDLElBRnhEO0FBR0UsVUFBQSxPQUFPLEVBQUVLLFNBSFg7QUFJRSxVQUFBLGNBQWMsRUFBRSxPQUpsQjtBQUtFLFVBQUEsWUFBWSxFQUFFLE9BTGhCO0FBTUUsVUFBQSxXQUFXLEVBQUUsS0FOZjtBQU9FLFVBQUEsUUFBUSxFQUFFSCxRQVBaO0FBUUUsVUFBQSxXQUFXLEVBQUVDLFlBUmY7QUFTRSxVQUFBLFFBQVEsRUFBRUksT0FBTyxDQUFDTixRQUFELENBVG5CO0FBVUUsVUFBQSxhQUFhLEVBQUUsT0FWakI7QUFXRSxVQUFBLCtCQUErQixFQUFFZDtBQVhuQyxVQUpGLENBREY7QUFvQkQ7QUF2Q3lEO0FBQUE7QUFBQSxJQUczQnFCLGdCQUgyQjs7QUEwQzVEbkIsRUFBQUEsa0JBQWtCLENBQUNvQixZQUFuQixHQUFrQztBQUNoQ04sSUFBQUEsWUFBWSxFQUFFckI7QUFEa0IsR0FBbEM7QUFHQSxTQUFPTyxrQkFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5cbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IERhdGFzZXRUYWdGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9jb21tb24vZGF0YXNldC10YWcnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgZGVmYXVsdFBsYWNlSG9sZGVyID0gJ1NlbGVjdCBBIERhdGEgU291cmNlJztcblxuU291cmNlRGF0YVNlbGVjdG9yRmFjdG9yeS5kZXBzID0gW0RhdGFzZXRUYWdGYWN0b3J5XTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU291cmNlRGF0YVNlbGVjdG9yRmFjdG9yeShEYXRhc2V0VGFnKSB7XG4gIGNvbnN0IERhdGFzZXRJdGVtID0gKHt2YWx1ZX0pID0+IDxEYXRhc2V0VGFnIGRhdGFzZXQ9e3ZhbHVlfSAvPjtcblxuICBjbGFzcyBTb3VyY2VEYXRhU2VsZWN0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8qIHNlbGVjdG9ycyAqL1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWludmFsaWQtdGhpcyAqL1xuICAgIGRhdGFzZXRzU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5kYXRhc2V0cztcbiAgICBkc09wdGlvbnNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuZGF0YXNldHNTZWxlY3RvciwgZGF0YXNldHMgPT5cbiAgICAgIE9iamVjdC52YWx1ZXMoZGF0YXNldHMpLm1hcChkcyA9PiAoe1xuICAgICAgICBsYWJlbDogZHMubGFiZWwsXG4gICAgICAgIHZhbHVlOiBkcy5pZCxcbiAgICAgICAgY29sb3I6IGRzLmNvbG9yXG4gICAgICB9KSlcbiAgICApO1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge2RhdGFJZCwgZGlzYWJsZWQsIG9uU2VsZWN0LCBkZWZhdWx0VmFsdWUsIGlucHV0VGhlbWV9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IGRzT3B0aW9ucyA9IHRoaXMuZHNPcHRpb25zU2VsZWN0b3IodGhpcy5wcm9wcyk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGNsYXNzTmFtZT1cImRhdGEtc291cmNlLXNlbGVjdG9yXCI+XG4gICAgICAgICAgPFBhbmVsTGFiZWw+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21pc2MuZGF0YVNvdXJjZSd9IC8+XG4gICAgICAgICAgPC9QYW5lbExhYmVsPlxuICAgICAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgICAgIGlucHV0VGhlbWU9e2lucHV0VGhlbWV9XG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXtkYXRhSWQgPyB0aGlzLnByb3BzLmRhdGFzZXRzW2RhdGFJZF0gOiBudWxsfVxuICAgICAgICAgICAgb3B0aW9ucz17ZHNPcHRpb25zfVxuICAgICAgICAgICAgZ2V0T3B0aW9uVmFsdWU9eyd2YWx1ZSd9XG4gICAgICAgICAgICBmaWx0ZXJPcHRpb249eydsYWJlbCd9XG4gICAgICAgICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICAgICAgICBvbkNoYW5nZT17b25TZWxlY3R9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17ZGVmYXVsdFZhbHVlfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4oZGlzYWJsZWQpfVxuICAgICAgICAgICAgZGlzcGxheU9wdGlvbj17J2xhYmVsJ31cbiAgICAgICAgICAgIERyb3BEb3duTGluZUl0ZW1SZW5kZXJDb21wb25lbnQ9e0RhdGFzZXRJdGVtfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgU291cmNlRGF0YVNlbGVjdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRQbGFjZUhvbGRlclxuICB9O1xuICByZXR1cm4gU291cmNlRGF0YVNlbGVjdG9yO1xufVxuIl19