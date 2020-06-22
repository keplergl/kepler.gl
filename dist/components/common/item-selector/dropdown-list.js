"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ListItem = exports.classList = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  border-top: 1px solid\n    ", ";\n  ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

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
  return _react["default"].createElement("span", {
    className: classList.listItemAnchor
  }, displayOption(value));
};

exports.ListItem = ListItem;

var DropdownListWrapper = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.light ? props.theme.dropdownListBgdLT : props.theme.dropdownListBgd;
}, function (props) {
  return props.light ? props.theme.dropdownListBorderTopLT : props.theme.dropdownListBorderTop;
}, function (props) {
  return props.light ? props.theme.dropdownListLT : props.theme.dropdownList;
});

var DropdownList =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(DropdownList, _Component);

  function DropdownList() {
    (0, _classCallCheck2["default"])(this, DropdownList);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DropdownList).apply(this, arguments));
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

      return _react["default"].createElement(DropdownListWrapper, {
        className: classList.list,
        light: light
      }, this.props.customListHeaderComponent ? _react["default"].createElement("div", {
        className: classList.listHeader
      }, _react["default"].createElement(this.props.customListHeaderComponent, null)) : null, valueOffset > 0 ? _react["default"].createElement("div", {
        className: classList.listSection
      }, fixedOptions.map(function (value, i) {
        return _react["default"].createElement("div", {
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
        }, _react["default"].createElement(_this.props.customListItemComponent, {
          value: value,
          displayOption: display
        }));
      })) : null, this.props.options.map(function (value, i) {
        return _react["default"].createElement("div", {
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
        }, _react["default"].createElement(_this.props.customListItemComponent, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2Ryb3Bkb3duLWxpc3QuanMiXSwibmFtZXMiOlsiY2xhc3NMaXN0IiwibGlzdCIsImxpc3RIZWFkZXIiLCJsaXN0U2VjdGlvbiIsImxpc3RJdGVtIiwibGlzdEl0ZW1BbmNob3IiLCJkZWZhdWx0RGlzcGxheSIsImQiLCJMaXN0SXRlbSIsInZhbHVlIiwiZGlzcGxheU9wdGlvbiIsIkRyb3Bkb3duTGlzdFdyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsImxpZ2h0IiwidGhlbWUiLCJkcm9wZG93bkxpc3RCZ2RMVCIsImRyb3Bkb3duTGlzdEJnZCIsImRyb3Bkb3duTGlzdEJvcmRlclRvcExUIiwiZHJvcGRvd25MaXN0Qm9yZGVyVG9wIiwiZHJvcGRvd25MaXN0TFQiLCJkcm9wZG93bkxpc3QiLCJEcm9wZG93bkxpc3QiLCJyZXN1bHQiLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwib25PcHRpb25TZWxlY3RlZCIsImZpeGVkT3B0aW9ucyIsImRpc3BsYXkiLCJvcHRpb25zIiwibGVuZ3RoIiwiYWxsb3dDdXN0b21WYWx1ZXMiLCJ2YWx1ZU9mZnNldCIsIkFycmF5IiwiaXNBcnJheSIsImN1c3RvbUxpc3RIZWFkZXJDb21wb25lbnQiLCJtYXAiLCJpIiwiaG92ZXIiLCJzZWxlY3Rpb25JbmRleCIsImZpeGVkIiwiZSIsIl9vbkNsaWNrIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsImFueSIsIm51bWJlciIsImN1c3RvbUNsYXNzZXMiLCJvYmplY3QiLCJjdXN0b21WYWx1ZXMiLCJjdXN0b21MaXN0SXRlbUNvbXBvbmVudCIsIm9uZU9mVHlwZSIsImVsZW1lbnQiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImRlZmF1bHRDbGFzc05hbWVzIiwiYm9vbCIsImFyZVJlc3VsdHNUcnVuY2F0ZWQiLCJyZXN1bHRzVHJ1bmNhdGVkTWVzc2FnZSIsInN0cmlu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QUFBQSx1QkFBdUIsRUFBRWYsc0JBQVVnQixNQVpsQjtBQWFqQkMsRUFBQUEsaUJBQWlCLEVBQUVqQixzQkFBVVU7QUFiWixDO2lDQURBaEMsWSxrQkFpQkc7QUFDcEIwQixFQUFBQSxhQUFhLEVBQUUsRUFESztBQUVwQkcsRUFBQUEsdUJBQXVCLEVBQUU1QyxRQUZMO0FBR3BCNEIsRUFBQUEseUJBQXlCLEVBQUUsSUFIUDtBQUlwQkosRUFBQUEsaUJBQWlCLEVBQUUsQ0FKQztBQUtwQm1CLEVBQUFBLFlBQVksRUFBRSxFQUxNO0FBTXBCekMsRUFBQUEsYUFBYSxFQUFFSixjQU5LO0FBT3BCcUIsRUFBQUEsZ0JBQWdCLEVBQUUsNEJBQU0sQ0FBRSxDQVBOO0FBUXBCOEIsRUFBQUEsaUJBQWlCLEVBQUUsSUFSQztBQVNwQmpCLEVBQUFBLGNBQWMsRUFBRTtBQVRJLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgY2xhc3NMaXN0ID0ge1xuICBsaXN0OiAnbGlzdC1zZWxlY3RvcicsXG4gIGxpc3RIZWFkZXI6ICdsaXN0X19oZWFkZXInLFxuICBsaXN0U2VjdGlvbjogJ2xpc3RfX3NlY3Rpb24nLFxuICBsaXN0SXRlbTogJ2xpc3RfX2l0ZW0nLFxuICBsaXN0SXRlbUFuY2hvcjogJ2xpc3RfX2l0ZW1fX2FuY2hvcidcbn07XG5cbmNvbnN0IGRlZmF1bHREaXNwbGF5ID0gZCA9PiBkO1xuZXhwb3J0IGNvbnN0IExpc3RJdGVtID0gKHt2YWx1ZSwgZGlzcGxheU9wdGlvbiA9IGRlZmF1bHREaXNwbGF5fSkgPT4gKFxuICA8c3BhbiBjbGFzc05hbWU9e2NsYXNzTGlzdC5saXN0SXRlbUFuY2hvcn0+e2Rpc3BsYXlPcHRpb24odmFsdWUpfTwvc3Bhbj5cbik7XG5cbmNvbnN0IERyb3Bkb3duTGlzdFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMubGlnaHQgPyBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCZ2RMVCA6IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEJnZH07XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZFxuICAgICR7cHJvcHMgPT5cbiAgICAgIHByb3BzLmxpZ2h0ID8gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0Qm9yZGVyVG9wTFQgOiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCb3JkZXJUb3B9O1xuICAke3Byb3BzID0+IChwcm9wcy5saWdodCA/IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdExUIDogcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0KX07XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcm9wZG93bkxpc3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLFxuICAgIGFsbG93Q3VzdG9tVmFsdWVzOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGN1c3RvbUNsYXNzZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgY3VzdG9tVmFsdWVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmVsZW1lbnQsIFByb3BUeXBlcy5mdW5jXSksXG4gICAgY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmVsZW1lbnQsIFByb3BUeXBlcy5mdW5jXSksXG4gICAgc2VsZWN0aW9uSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgb25PcHRpb25TZWxlY3RlZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZGlzcGxheU9wdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBkZWZhdWx0Q2xhc3NOYW1lczogUHJvcFR5cGVzLmJvb2wsXG4gICAgYXJlUmVzdWx0c1RydW5jYXRlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgcmVzdWx0c1RydW5jYXRlZE1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGlzdEl0ZW1Db21wb25lbnQ6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjdXN0b21DbGFzc2VzOiB7fSxcbiAgICBjdXN0b21MaXN0SXRlbUNvbXBvbmVudDogTGlzdEl0ZW0sXG4gICAgY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudDogbnVsbCxcbiAgICBhbGxvd0N1c3RvbVZhbHVlczogMCxcbiAgICBjdXN0b21WYWx1ZXM6IFtdLFxuICAgIGRpc3BsYXlPcHRpb246IGRlZmF1bHREaXNwbGF5LFxuICAgIG9uT3B0aW9uU2VsZWN0ZWQ6ICgpID0+IHt9LFxuICAgIGRlZmF1bHRDbGFzc05hbWVzOiB0cnVlLFxuICAgIHNlbGVjdGlvbkluZGV4OiBudWxsXG4gIH07XG5cbiAgX29uQ2xpY2socmVzdWx0LCBldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbk9wdGlvblNlbGVjdGVkKHJlc3VsdCwgZXZlbnQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtmaXhlZE9wdGlvbnMsIGxpZ2h0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZGlzcGxheSA9IHRoaXMucHJvcHMuZGlzcGxheU9wdGlvbjtcblxuICAgIC8vIERvbid0IHJlbmRlciBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucyB0byBkaXNwbGF5XG4gICAgaWYgKCF0aGlzLnByb3BzLm9wdGlvbnMubGVuZ3RoICYmIHRoaXMucHJvcHMuYWxsb3dDdXN0b21WYWx1ZXMgPD0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlT2Zmc2V0ID0gQXJyYXkuaXNBcnJheShmaXhlZE9wdGlvbnMpID8gZml4ZWRPcHRpb25zLmxlbmd0aCA6IDA7XG5cbiAgICAvLyBGb3Igc29tZSByZWFzb24gb25DbGljayBpcyBub3QgZmlyZWQgd2hlbiBjbGlja2VkIG9uIGFuIG9wdGlvblxuICAgIC8vIG9uTW91c2VEb3duIGlzIHVzZWQgaGVyZSBhcyBhIHdvcmthcm91bmQgb2YgIzIwNSBhbmQgb3RoZXJcbiAgICByZXR1cm4gKFxuICAgICAgPERyb3Bkb3duTGlzdFdyYXBwZXIgY2xhc3NOYW1lPXtjbGFzc0xpc3QubGlzdH0gbGlnaHQ9e2xpZ2h0fT5cbiAgICAgICAge3RoaXMucHJvcHMuY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NMaXN0Lmxpc3RIZWFkZXJ9PlxuICAgICAgICAgICAgPHRoaXMucHJvcHMuY3VzdG9tTGlzdEhlYWRlckNvbXBvbmVudCAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7dmFsdWVPZmZzZXQgPiAwID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc0xpc3QubGlzdFNlY3Rpb259PlxuICAgICAgICAgICAge2ZpeGVkT3B0aW9ucy5tYXAoKHZhbHVlLCBpKSA9PiAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoY2xhc3NMaXN0Lmxpc3RJdGVtLCB7XG4gICAgICAgICAgICAgICAgICBob3ZlcjogdGhpcy5wcm9wcy5zZWxlY3Rpb25JbmRleCA9PT0gaSxcbiAgICAgICAgICAgICAgICAgIGZpeGVkOiB0cnVlXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAga2V5PXtgJHtkaXNwbGF5KHZhbHVlKX1fJHtpfWB9XG4gICAgICAgICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gdGhpcy5fb25DbGljayh2YWx1ZSwgZSl9XG4gICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLl9vbkNsaWNrKHZhbHVlLCBlKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDx0aGlzLnByb3BzLmN1c3RvbUxpc3RJdGVtQ29tcG9uZW50IHZhbHVlPXt2YWx1ZX0gZGlzcGxheU9wdGlvbj17ZGlzcGxheX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3RoaXMucHJvcHMub3B0aW9ucy5tYXAoKHZhbHVlLCBpKSA9PiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTGlzdC5saXN0SXRlbSwge1xuICAgICAgICAgICAgICBob3ZlcjogdGhpcy5wcm9wcy5zZWxlY3Rpb25JbmRleCA9PT0gaSArIHZhbHVlT2Zmc2V0XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIGtleT17YCR7ZGlzcGxheSh2YWx1ZSl9XyR7aX1gfVxuICAgICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gdGhpcy5fb25DbGljayh2YWx1ZSwgZSl9XG4gICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMuX29uQ2xpY2sodmFsdWUsIGUpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDx0aGlzLnByb3BzLmN1c3RvbUxpc3RJdGVtQ29tcG9uZW50IHZhbHVlPXt2YWx1ZX0gZGlzcGxheU9wdGlvbj17ZGlzcGxheX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L0Ryb3Bkb3duTGlzdFdyYXBwZXI+XG4gICAgKTtcbiAgfVxufVxuIl19