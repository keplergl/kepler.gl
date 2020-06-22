"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ChickletTag = exports.ChickletButton = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _delete = _interopRequireDefault(require("../icons/delete"));

var _reactIntl = require("react-intl");

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", "\n\n  color: ", ";\n  overflow: hidden;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-right: 10px;\n  text-overflow: ellipsis;\n  width: 100%;\n  overflow: hidden;\n\n  :hover {\n    overflow: visible;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background: ", ";\n  border-radius: 1px;\n  color: ", ";\n  font-size: 11px;\n  line-height: 20px;\n  margin: 4px 10px 4px 3px;\n  padding: 2px 6px;\n  display: flex;\n  align-items: center;\n  max-width: calc(100% - 8px);\n\n  :hover {\n    color: ", ";\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var propTypes = {
  // required properties
  onClick: _propTypes["default"].func.isRequired,
  removeItem: _propTypes["default"].func.isRequired,
  // optional properties
  selectedItems: _propTypes["default"].arrayOf(_propTypes["default"].any),
  disabled: _propTypes["default"].bool,
  displayOption: _propTypes["default"].func,
  focus: _propTypes["default"].bool,
  error: _propTypes["default"].bool,
  placeholder: _propTypes["default"].string,
  inputTheme: _propTypes["default"].string
};

var ChickletButton = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.panelActiveBg;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColorHl;
});

exports.ChickletButton = ChickletButton;

var ChickletTag = _styledComponents["default"].span(_templateObject2());

exports.ChickletTag = ChickletTag;

var Chicklet = function Chicklet(_ref) {
  var disabled = _ref.disabled,
      name = _ref.name,
      remove = _ref.remove;
  return _react["default"].createElement(ChickletButton, null, _react["default"].createElement(ChickletTag, null, name), _react["default"].createElement(_delete["default"], {
    onClick: disabled ? null : remove
  }));
};

var ChickletedInputContainer = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.inputTheme === 'secondary' ? props.theme.secondaryChickletedInput : props.theme.chickletedInput;
}, function (props) {
  return props.hasPlaceholder ? props.theme.selectColorPlaceHolder : props.theme.selectColor;
});

var ChickletedInput = function ChickletedInput(_ref2) {
  var focus = _ref2.focus,
      disabled = _ref2.disabled,
      error = _ref2.error,
      onClick = _ref2.onClick,
      className = _ref2.className,
      _ref2$selectedItems = _ref2.selectedItems,
      selectedItems = _ref2$selectedItems === void 0 ? [] : _ref2$selectedItems,
      _ref2$placeholder = _ref2.placeholder,
      placeholder = _ref2$placeholder === void 0 ? '' : _ref2$placeholder,
      removeItem = _ref2.removeItem,
      _ref2$displayOption = _ref2.displayOption,
      displayOption = _ref2$displayOption === void 0 ? function (d) {
    return d;
  } : _ref2$displayOption,
      inputTheme = _ref2.inputTheme,
      CustomChickletComponent = _ref2.CustomChickletComponent;
  return _react["default"].createElement(ChickletedInputContainer, {
    className: "".concat(className, " chickleted-input"),
    focus: focus,
    disabled: disabled,
    error: error,
    onClick: onClick,
    inputTheme: inputTheme,
    hasPlaceholder: !selectedItems || !selectedItems.length
  }, selectedItems.length > 0 ? selectedItems.map(function (item, i) {
    return CustomChickletComponent ? _react["default"].createElement(CustomChickletComponent, {
      disabled: disabled,
      key: "".concat(displayOption(item), "_").concat(i),
      name: displayOption(item),
      remove: function remove(e) {
        return removeItem(item, e);
      }
    }) : _react["default"].createElement(Chicklet, {
      disabled: disabled,
      key: "".concat(displayOption(item), "_").concat(i),
      name: displayOption(item),
      remove: function remove(e) {
        return removeItem(item, e);
      }
    });
  }) : _react["default"].createElement("span", {
    className: "".concat(className, " chickleted-input__placeholder")
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: placeholder
  })));
};

ChickletedInput.propTypes = propTypes;
var _default = ChickletedInput;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2NoaWNrbGV0ZWQtaW5wdXQuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib25DbGljayIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwicmVtb3ZlSXRlbSIsInNlbGVjdGVkSXRlbXMiLCJhcnJheU9mIiwiYW55IiwiZGlzYWJsZWQiLCJib29sIiwiZGlzcGxheU9wdGlvbiIsImZvY3VzIiwiZXJyb3IiLCJwbGFjZWhvbGRlciIsInN0cmluZyIsImlucHV0VGhlbWUiLCJDaGlja2xldEJ1dHRvbiIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJwYW5lbEFjdGl2ZUJnIiwidGV4dENvbG9yIiwidGV4dENvbG9ySGwiLCJDaGlja2xldFRhZyIsInNwYW4iLCJDaGlja2xldCIsIm5hbWUiLCJyZW1vdmUiLCJDaGlja2xldGVkSW5wdXRDb250YWluZXIiLCJzZWNvbmRhcnlDaGlja2xldGVkSW5wdXQiLCJjaGlja2xldGVkSW5wdXQiLCJoYXNQbGFjZWhvbGRlciIsInNlbGVjdENvbG9yUGxhY2VIb2xkZXIiLCJzZWxlY3RDb2xvciIsIkNoaWNrbGV0ZWRJbnB1dCIsImNsYXNzTmFtZSIsImQiLCJDdXN0b21DaGlja2xldENvbXBvbmVudCIsImxlbmd0aCIsIm1hcCIsIml0ZW0iLCJpIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxHQUFHO0FBQ2hCO0FBQ0FDLEVBQUFBLE9BQU8sRUFBRUMsc0JBQVVDLElBQVYsQ0FBZUMsVUFGUjtBQUdoQkMsRUFBQUEsVUFBVSxFQUFFSCxzQkFBVUMsSUFBVixDQUFlQyxVQUhYO0FBS2hCO0FBQ0FFLEVBQUFBLGFBQWEsRUFBRUosc0JBQVVLLE9BQVYsQ0FBa0JMLHNC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RCxLQVNHbEMsYUFBYSxDQUFDa0MsTUFBZCxHQUF1QixDQUF2QixHQUNDbEMsYUFBYSxDQUFDbUMsR0FBZCxDQUFrQixVQUFDQyxJQUFELEVBQU9DLENBQVA7QUFBQSxXQUNoQkosdUJBQXVCLEdBQ3JCLGdDQUFDLHVCQUFEO0FBQ0UsTUFBQSxRQUFRLEVBQUU5QixRQURaO0FBRUUsTUFBQSxHQUFHLFlBQUtFLGFBQWEsQ0FBQytCLElBQUQsQ0FBbEIsY0FBNEJDLENBQTVCLENBRkw7QUFHRSxNQUFBLElBQUksRUFBRWhDLGFBQWEsQ0FBQytCLElBQUQsQ0FIckI7QUFJRSxNQUFBLE1BQU0sRUFBRSxnQkFBQUUsQ0FBQztBQUFBLGVBQUl2QyxVQUFVLENBQUNxQyxJQUFELEVBQU9FLENBQVAsQ0FBZDtBQUFBO0FBSlgsTUFEcUIsR0FRckIsZ0NBQUMsUUFBRDtBQUNFLE1BQUEsUUFBUSxFQUFFbkMsUUFEWjtBQUVFLE1BQUEsR0FBRyxZQUFLRSxhQUFhLENBQUMrQixJQUFELENBQWxCLGNBQTRCQyxDQUE1QixDQUZMO0FBR0UsTUFBQSxJQUFJLEVBQUVoQyxhQUFhLENBQUMrQixJQUFELENBSHJCO0FBSUUsTUFBQSxNQUFNLEVBQUUsZ0JBQUFFLENBQUM7QUFBQSxlQUFJdkMsVUFBVSxDQUFDcUMsSUFBRCxFQUFPRSxDQUFQLENBQWQ7QUFBQTtBQUpYLE1BVGM7QUFBQSxHQUFsQixDQURELEdBbUJDO0FBQU0sSUFBQSxTQUFTLFlBQUtQLFNBQUw7QUFBZixLQUNFLGdDQUFDLDJCQUFEO0FBQWtCLElBQUEsRUFBRSxFQUFFdkI7QUFBdEIsSUFERixDQTVCSixDQWJzQjtBQUFBLENBQXhCOztBQWdEQXNCLGVBQWUsQ0FBQ3BDLFNBQWhCLEdBQTRCQSxTQUE1QjtlQUVlb0MsZSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBEZWxldGUgZnJvbSAnLi4vaWNvbnMvZGVsZXRlJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgLy8gcmVxdWlyZWQgcHJvcGVydGllc1xuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZW1vdmVJdGVtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsIHByb3BlcnRpZXNcbiAgc2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSksXG4gIGRpc2FibGVkOiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzcGxheU9wdGlvbjogUHJvcFR5cGVzLmZ1bmMsXG4gIGZvY3VzOiBQcm9wVHlwZXMuYm9vbCxcbiAgZXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICBwbGFjZWhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5wdXRUaGVtZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGNvbnN0IENoaWNrbGV0QnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEFjdGl2ZUJnfTtcbiAgYm9yZGVyLXJhZGl1czogMXB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDExcHg7XG4gIGxpbmUtaGVpZ2h0OiAyMHB4O1xuICBtYXJnaW46IDRweCAxMHB4IDRweCAzcHg7XG4gIHBhZGRpbmc6IDJweCA2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG1heC13aWR0aDogY2FsYygxMDAlIC0gOHB4KTtcblxuICA6aG92ZXIge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IENoaWNrbGV0VGFnID0gc3R5bGVkLnNwYW5gXG4gIG1hcmdpbi1yaWdodDogMTBweDtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gIHdpZHRoOiAxMDAlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gIDpob3ZlciB7XG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIH1cbmA7XG5cbmNvbnN0IENoaWNrbGV0ID0gKHtkaXNhYmxlZCwgbmFtZSwgcmVtb3ZlfSkgPT4gKFxuICA8Q2hpY2tsZXRCdXR0b24+XG4gICAgPENoaWNrbGV0VGFnPntuYW1lfTwvQ2hpY2tsZXRUYWc+XG4gICAgPERlbGV0ZSBvbkNsaWNrPXtkaXNhYmxlZCA/IG51bGwgOiByZW1vdmV9IC8+XG4gIDwvQ2hpY2tsZXRCdXR0b24+XG4pO1xuXG5jb25zdCBDaGlja2xldGVkSW5wdXRDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+XG4gICAgcHJvcHMuaW5wdXRUaGVtZSA9PT0gJ3NlY29uZGFyeSdcbiAgICAgID8gcHJvcHMudGhlbWUuc2Vjb25kYXJ5Q2hpY2tsZXRlZElucHV0XG4gICAgICA6IHByb3BzLnRoZW1lLmNoaWNrbGV0ZWRJbnB1dH1cblxuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmhhc1BsYWNlaG9sZGVyID8gcHJvcHMudGhlbWUuc2VsZWN0Q29sb3JQbGFjZUhvbGRlciA6IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yfTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbmA7XG5cbmNvbnN0IENoaWNrbGV0ZWRJbnB1dCA9ICh7XG4gIGZvY3VzLFxuICBkaXNhYmxlZCxcbiAgZXJyb3IsXG4gIG9uQ2xpY2ssXG4gIGNsYXNzTmFtZSxcbiAgc2VsZWN0ZWRJdGVtcyA9IFtdLFxuICBwbGFjZWhvbGRlciA9ICcnLFxuICByZW1vdmVJdGVtLFxuICBkaXNwbGF5T3B0aW9uID0gZCA9PiBkLFxuICBpbnB1dFRoZW1lLFxuICBDdXN0b21DaGlja2xldENvbXBvbmVudFxufSkgPT4gKFxuICA8Q2hpY2tsZXRlZElucHV0Q29udGFpbmVyXG4gICAgY2xhc3NOYW1lPXtgJHtjbGFzc05hbWV9IGNoaWNrbGV0ZWQtaW5wdXRgfVxuICAgIGZvY3VzPXtmb2N1c31cbiAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgZXJyb3I9e2Vycm9yfVxuICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgaW5wdXRUaGVtZT17aW5wdXRUaGVtZX1cbiAgICBoYXNQbGFjZWhvbGRlcj17IXNlbGVjdGVkSXRlbXMgfHwgIXNlbGVjdGVkSXRlbXMubGVuZ3RofVxuICA+XG4gICAge3NlbGVjdGVkSXRlbXMubGVuZ3RoID4gMCA/IChcbiAgICAgIHNlbGVjdGVkSXRlbXMubWFwKChpdGVtLCBpKSA9PlxuICAgICAgICBDdXN0b21DaGlja2xldENvbXBvbmVudCA/IChcbiAgICAgICAgICA8Q3VzdG9tQ2hpY2tsZXRDb21wb25lbnRcbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIGtleT17YCR7ZGlzcGxheU9wdGlvbihpdGVtKX1fJHtpfWB9XG4gICAgICAgICAgICBuYW1lPXtkaXNwbGF5T3B0aW9uKGl0ZW0pfVxuICAgICAgICAgICAgcmVtb3ZlPXtlID0+IHJlbW92ZUl0ZW0oaXRlbSwgZSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8Q2hpY2tsZXRcbiAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgIGtleT17YCR7ZGlzcGxheU9wdGlvbihpdGVtKX1fJHtpfWB9XG4gICAgICAgICAgICBuYW1lPXtkaXNwbGF5T3B0aW9uKGl0ZW0pfVxuICAgICAgICAgICAgcmVtb3ZlPXtlID0+IHJlbW92ZUl0ZW0oaXRlbSwgZSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgKVxuICAgICkgOiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9e2Ake2NsYXNzTmFtZX0gY2hpY2tsZXRlZC1pbnB1dF9fcGxhY2Vob2xkZXJgfT5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e3BsYWNlaG9sZGVyfSAvPlxuICAgICAgPC9zcGFuPlxuICAgICl9XG4gIDwvQ2hpY2tsZXRlZElucHV0Q29udGFpbmVyPlxuKTtcblxuQ2hpY2tsZXRlZElucHV0LnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuZXhwb3J0IGRlZmF1bHQgQ2hpY2tsZXRlZElucHV0O1xuIl19