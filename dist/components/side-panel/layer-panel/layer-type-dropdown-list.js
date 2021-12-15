"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerTypeDropdownListFactory = LayerTypeDropdownListFactory;
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _classnames = _interopRequireDefault(require("classnames"));

var _dropdownList = require("../../common/item-selector/dropdown-list");

var _templateObject, _templateObject2;

var DropdownListWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n  background-color: ", ";\n  border-top: 1px solid ", ";\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-start;\n  padding: ", "px 0 0 ", "px;\n"])), function (props) {
  return props.theme.dropdownList;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.dropdownListBorderTop;
}, function (props) {
  return props.theme.layerTypeIconPdL;
}, function (props) {
  return props.theme.layerTypeIconPdL;
});

var StyledDropdownListItem = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  padding-bottom: ", "px;\n  padding-right: ", "px;\n\n  &.disabled {\n    pointer-events: none;\n    opacity: 0.3;\n  }\n\n  &.selected {\n    .layer-type-selector__item__icon {\n      border: 1px solid #caf2f4;\n    }\n  }\n\n  :hover,\n  &.selected {\n    cursor: pointer;\n    .layer-type-selector__item__icon {\n      color: ", ";\n    }\n\n    .layer-type-selector__item__label {\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.layerTypeIconPdL;
}, function (props) {
  return props.theme.layerTypeIconPdL;
}, function (props) {
  return props.theme.activeColor;
}, function (props) {
  return props.theme.textColor;
});

function LayerTypeDropdownListFactory() {
  var LayerTypeDropdownList = function LayerTypeDropdownList(_ref) {
    var onOptionSelected = _ref.onOptionSelected,
        options = _ref.options,
        selectedItems = _ref.selectedItems,
        selectionIndex = _ref.selectionIndex,
        customListItemComponent = _ref.customListItemComponent;
    var onSelectOption = (0, _react.useCallback)(function (e, value) {
      e.preventDefault();
      onOptionSelected(value, e);
    }, [onOptionSelected]);
    var Component = customListItemComponent;
    return /*#__PURE__*/_react["default"].createElement(DropdownListWrapper, {
      className: _dropdownList.classList.list
    }, options.map(function (value, i) {
      return /*#__PURE__*/_react["default"].createElement(StyledDropdownListItem, {
        className: (0, _classnames["default"])('layer-type-selector__item', {
          selected: selectedItems.find(function (it) {
            return it.id === value.id;
          }),
          hover: selectionIndex === i,
          disabled: value.disabled
        }),
        key: "".concat(value.id, "_").concat(i),
        onMouseDown: function onMouseDown(e) {
          return onSelectOption(e, value);
        },
        onClick: function onClick(e) {
          return onSelectOption(e, value);
        }
      }, /*#__PURE__*/_react["default"].createElement(Component, {
        value: value,
        isTile: true
      }));
    }));
  };

  return LayerTypeDropdownList;
}

var _default = LayerTypeDropdownListFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItdHlwZS1kcm9wZG93bi1saXN0LmpzIl0sIm5hbWVzIjpbIkRyb3Bkb3duTGlzdFdyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwiZHJvcGRvd25MaXN0IiwiZHJvcGRvd25MaXN0QmdkIiwiZHJvcGRvd25MaXN0Qm9yZGVyVG9wIiwibGF5ZXJUeXBlSWNvblBkTCIsIlN0eWxlZERyb3Bkb3duTGlzdEl0ZW0iLCJhY3RpdmVDb2xvciIsInRleHRDb2xvciIsIkxheWVyVHlwZURyb3Bkb3duTGlzdEZhY3RvcnkiLCJMYXllclR5cGVEcm9wZG93bkxpc3QiLCJvbk9wdGlvblNlbGVjdGVkIiwib3B0aW9ucyIsInNlbGVjdGVkSXRlbXMiLCJzZWxlY3Rpb25JbmRleCIsImN1c3RvbUxpc3RJdGVtQ29tcG9uZW50Iiwib25TZWxlY3RPcHRpb24iLCJlIiwidmFsdWUiLCJwcmV2ZW50RGVmYXVsdCIsIkNvbXBvbmVudCIsImNsYXNzTGlzdCIsImxpc3QiLCJtYXAiLCJpIiwic2VsZWN0ZWQiLCJmaW5kIiwiaXQiLCJpZCIsImhvdmVyIiwiZGlzYWJsZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsbUJBQW1CLEdBQUdDLDZCQUFPQyxHQUFWLDZQQUNyQixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFlBQWhCO0FBQUEsQ0FEZ0IsRUFFSCxVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlFLGVBQWhCO0FBQUEsQ0FGRixFQUdDLFVBQUFILEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUcscUJBQWhCO0FBQUEsQ0FITixFQU9aLFVBQUFKLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksZ0JBQWhCO0FBQUEsQ0FQTyxFQU9tQyxVQUFBTCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlJLGdCQUFoQjtBQUFBLENBUHhDLENBQXpCOztBQVVBLElBQU1DLHNCQUFzQixHQUFHUiw2QkFBT0MsR0FBViw4ZkFDUixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlJLGdCQUFoQjtBQUFBLENBREcsRUFFVCxVQUFBTCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlJLGdCQUFoQjtBQUFBLENBRkksRUFtQmIsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZTSxXQUFoQjtBQUFBLENBbkJRLEVBdUJiLFVBQUFQLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWU8sU0FBaEI7QUFBQSxDQXZCUSxDQUE1Qjs7QUE0Qk8sU0FBU0MsNEJBQVQsR0FBd0M7QUFDN0MsTUFBTUMscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixPQU14QjtBQUFBLFFBTEpDLGdCQUtJLFFBTEpBLGdCQUtJO0FBQUEsUUFKSkMsT0FJSSxRQUpKQSxPQUlJO0FBQUEsUUFISkMsYUFHSSxRQUhKQSxhQUdJO0FBQUEsUUFGSkMsY0FFSSxRQUZKQSxjQUVJO0FBQUEsUUFESkMsdUJBQ0ksUUFESkEsdUJBQ0k7QUFDSixRQUFNQyxjQUFjLEdBQUcsd0JBQ3JCLFVBQUNDLENBQUQsRUFBSUMsS0FBSixFQUFjO0FBQ1pELE1BQUFBLENBQUMsQ0FBQ0UsY0FBRjtBQUNBUixNQUFBQSxnQkFBZ0IsQ0FBQ08sS0FBRCxFQUFRRCxDQUFSLENBQWhCO0FBQ0QsS0FKb0IsRUFLckIsQ0FBQ04sZ0JBQUQsQ0FMcUIsQ0FBdkI7QUFRQSxRQUFNUyxTQUFTLEdBQUdMLHVCQUFsQjtBQUVBLHdCQUNFLGdDQUFDLG1CQUFEO0FBQXFCLE1BQUEsU0FBUyxFQUFFTSx3QkFBVUM7QUFBMUMsT0FDR1YsT0FBTyxDQUFDVyxHQUFSLENBQVksVUFBQ0wsS0FBRCxFQUFRTSxDQUFSO0FBQUEsMEJBQ1gsZ0NBQUMsc0JBQUQ7QUFDRSxRQUFBLFNBQVMsRUFBRSw0QkFBVywyQkFBWCxFQUF3QztBQUNqREMsVUFBQUEsUUFBUSxFQUFFWixhQUFhLENBQUNhLElBQWQsQ0FBbUIsVUFBQUMsRUFBRTtBQUFBLG1CQUFJQSxFQUFFLENBQUNDLEVBQUgsS0FBVVYsS0FBSyxDQUFDVSxFQUFwQjtBQUFBLFdBQXJCLENBRHVDO0FBRWpEQyxVQUFBQSxLQUFLLEVBQUVmLGNBQWMsS0FBS1UsQ0FGdUI7QUFHakRNLFVBQUFBLFFBQVEsRUFBRVosS0FBSyxDQUFDWTtBQUhpQyxTQUF4QyxDQURiO0FBTUUsUUFBQSxHQUFHLFlBQUtaLEtBQUssQ0FBQ1UsRUFBWCxjQUFpQkosQ0FBakIsQ0FOTDtBQU9FLFFBQUEsV0FBVyxFQUFFLHFCQUFBUCxDQUFDO0FBQUEsaUJBQUlELGNBQWMsQ0FBQ0MsQ0FBRCxFQUFJQyxLQUFKLENBQWxCO0FBQUEsU0FQaEI7QUFRRSxRQUFBLE9BQU8sRUFBRSxpQkFBQUQsQ0FBQztBQUFBLGlCQUFJRCxjQUFjLENBQUNDLENBQUQsRUFBSUMsS0FBSixDQUFsQjtBQUFBO0FBUlosc0JBVUUsZ0NBQUMsU0FBRDtBQUFXLFFBQUEsS0FBSyxFQUFFQSxLQUFsQjtBQUF5QixRQUFBLE1BQU07QUFBL0IsUUFWRixDQURXO0FBQUEsS0FBWixDQURILENBREY7QUFrQkQsR0FuQ0Q7O0FBcUNBLFNBQU9SLHFCQUFQO0FBQ0Q7O2VBRWNELDRCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7dXNlQ2FsbGJhY2t9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge2NsYXNzTGlzdH0gZnJvbSAnLi4vLi4vY29tbW9uL2l0ZW0tc2VsZWN0b3IvZHJvcGRvd24tbGlzdCc7XG5cbmNvbnN0IERyb3Bkb3duTGlzdFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdH07XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0QmdkfTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0Qm9yZGVyVG9wfTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgcGFkZGluZzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYXllclR5cGVJY29uUGRMfXB4IDAgMCAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxheWVyVHlwZUljb25QZEx9cHg7XG5gO1xuXG5jb25zdCBTdHlsZWREcm9wZG93bkxpc3RJdGVtID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1ib3R0b206ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGF5ZXJUeXBlSWNvblBkTH1weDtcbiAgcGFkZGluZy1yaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYXllclR5cGVJY29uUGRMfXB4O1xuXG4gICYuZGlzYWJsZWQge1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIG9wYWNpdHk6IDAuMztcbiAgfVxuXG4gICYuc2VsZWN0ZWQge1xuICAgIC5sYXllci10eXBlLXNlbGVjdG9yX19pdGVtX19pY29uIHtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNjYWYyZjQ7XG4gICAgfVxuICB9XG5cbiAgOmhvdmVyLFxuICAmLnNlbGVjdGVkIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLmxheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2ljb24ge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuYWN0aXZlQ29sb3J9O1xuICAgIH1cblxuICAgIC5sYXllci10eXBlLXNlbGVjdG9yX19pdGVtX19sYWJlbCB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIExheWVyVHlwZURyb3Bkb3duTGlzdEZhY3RvcnkoKSB7XG4gIGNvbnN0IExheWVyVHlwZURyb3Bkb3duTGlzdCA9ICh7XG4gICAgb25PcHRpb25TZWxlY3RlZCxcbiAgICBvcHRpb25zLFxuICAgIHNlbGVjdGVkSXRlbXMsXG4gICAgc2VsZWN0aW9uSW5kZXgsXG4gICAgY3VzdG9tTGlzdEl0ZW1Db21wb25lbnRcbiAgfSkgPT4ge1xuICAgIGNvbnN0IG9uU2VsZWN0T3B0aW9uID0gdXNlQ2FsbGJhY2soXG4gICAgICAoZSwgdmFsdWUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvbk9wdGlvblNlbGVjdGVkKHZhbHVlLCBlKTtcbiAgICAgIH0sXG4gICAgICBbb25PcHRpb25TZWxlY3RlZF1cbiAgICApO1xuXG4gICAgY29uc3QgQ29tcG9uZW50ID0gY3VzdG9tTGlzdEl0ZW1Db21wb25lbnQ7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPERyb3Bkb3duTGlzdFdyYXBwZXIgY2xhc3NOYW1lPXtjbGFzc0xpc3QubGlzdH0+XG4gICAgICAgIHtvcHRpb25zLm1hcCgodmFsdWUsIGkpID0+IChcbiAgICAgICAgICA8U3R5bGVkRHJvcGRvd25MaXN0SXRlbVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdsYXllci10eXBlLXNlbGVjdG9yX19pdGVtJywge1xuICAgICAgICAgICAgICBzZWxlY3RlZDogc2VsZWN0ZWRJdGVtcy5maW5kKGl0ID0+IGl0LmlkID09PSB2YWx1ZS5pZCksXG4gICAgICAgICAgICAgIGhvdmVyOiBzZWxlY3Rpb25JbmRleCA9PT0gaSxcbiAgICAgICAgICAgICAgZGlzYWJsZWQ6IHZhbHVlLmRpc2FibGVkXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIGtleT17YCR7dmFsdWUuaWR9XyR7aX1gfVxuICAgICAgICAgICAgb25Nb3VzZURvd249e2UgPT4gb25TZWxlY3RPcHRpb24oZSwgdmFsdWUpfVxuICAgICAgICAgICAgb25DbGljaz17ZSA9PiBvblNlbGVjdE9wdGlvbihlLCB2YWx1ZSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPENvbXBvbmVudCB2YWx1ZT17dmFsdWV9IGlzVGlsZSAvPlxuICAgICAgICAgIDwvU3R5bGVkRHJvcGRvd25MaXN0SXRlbT5cbiAgICAgICAgKSl9XG4gICAgICA8L0Ryb3Bkb3duTGlzdFdyYXBwZXI+XG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gTGF5ZXJUeXBlRHJvcGRvd25MaXN0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBMYXllclR5cGVEcm9wZG93bkxpc3RGYWN0b3J5O1xuIl19