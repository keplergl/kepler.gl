"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _layerTypeDropdownList = _interopRequireDefault(require("./layer-type-dropdown-list"));

var _layerTypeListItem = _interopRequireDefault(require("./layer-type-list-item"));

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _styledComponents2 = require("../../common/styled-components");

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var propTypes = {
  layer: _propTypes["default"].object.isRequired,
  onSelect: _propTypes["default"].func.isRequired
};

var StyledLayerTypeSelector = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .item-selector .item-selector__dropdown {\n    padding: 4px 10px 4px 2px;\n  }\n"])));

LayerTypeSelectorFactory.deps = [_layerTypeListItem["default"], _layerTypeDropdownList["default"]];

var getDisplayOption = function getDisplayOption(op) {
  return op.label;
};

var getOptionValue = function getOptionValue(op) {
  return op.id;
};

function LayerTypeSelectorFactory(LayerTypeListItem, LayerTypeDropdownList) {
  var LayerTypeSelector = function LayerTypeSelector(_ref) {
    var layer = _ref.layer,
        layerTypeOptions = _ref.layerTypeOptions,
        onSelect = _ref.onSelect,
        datasets = _ref.datasets;
    var hasData = (0, _react.useMemo)(function () {
      return Boolean(Object.keys(datasets).length);
    }, [datasets]);
    var typeOptions = (0, _react.useMemo)(function () {
      return layerTypeOptions.map(function (op) {
        return _objectSpread(_objectSpread({}, op), {}, {
          disabled: !hasData && op.requireData !== false
        });
      });
    }, [hasData, layerTypeOptions]);
    var selectedItems = (0, _react.useMemo)(function () {
      return typeOptions.find(function (op) {
        return op.id === layer.type;
      });
    }, [typeOptions, layer.type]);
    return /*#__PURE__*/_react["default"].createElement(_styledComponents2.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(StyledLayerTypeSelector, {
      className: "layer-config__type"
    }, /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], {
      selectedItems: selectedItems,
      options: typeOptions,
      multiSelect: false,
      placeholder: "placeholder.selectType",
      onChange: onSelect,
      getOptionValue: getOptionValue,
      filterOption: "label",
      displayOption: getDisplayOption,
      DropDownLineItemRenderComponent: LayerTypeListItem,
      DropDownRenderComponent: LayerTypeDropdownList
    })));
  };

  LayerTypeSelector.propTypes = propTypes;
  return (0, _styledComponents.withTheme)(LayerTypeSelector);
}

var _default = LayerTypeSelectorFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItdHlwZS1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJsYXllciIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJvblNlbGVjdCIsImZ1bmMiLCJTdHlsZWRMYXllclR5cGVTZWxlY3RvciIsInN0eWxlZCIsImRpdiIsIkxheWVyVHlwZVNlbGVjdG9yRmFjdG9yeSIsImRlcHMiLCJMYXllclR5cGVMaXN0SXRlbUZhY3RvcnkiLCJMYXllclR5cGVEcm9wZG93bkxpc3RGYWN0b3J5IiwiZ2V0RGlzcGxheU9wdGlvbiIsIm9wIiwibGFiZWwiLCJnZXRPcHRpb25WYWx1ZSIsImlkIiwiTGF5ZXJUeXBlTGlzdEl0ZW0iLCJMYXllclR5cGVEcm9wZG93bkxpc3QiLCJMYXllclR5cGVTZWxlY3RvciIsImxheWVyVHlwZU9wdGlvbnMiLCJkYXRhc2V0cyIsImhhc0RhdGEiLCJCb29sZWFuIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsInR5cGVPcHRpb25zIiwibWFwIiwiZGlzYWJsZWQiLCJyZXF1aXJlRGF0YSIsInNlbGVjdGVkSXRlbXMiLCJmaW5kIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7OztBQUVBLElBQU1BLFNBQVMsR0FBRztBQUNoQkMsRUFBQUEsS0FBSyxFQUFFQyxzQkFBVUMsTUFBVixDQUFpQkMsVUFEUjtBQUVoQkMsRUFBQUEsUUFBUSxFQUFFSCxzQkFBVUksSUFBVixDQUFlRjtBQUZULENBQWxCOztBQUtBLElBQU1HLHVCQUF1QixHQUFHQyw2QkFBT0MsR0FBViwwS0FBN0I7O0FBTUFDLHdCQUF3QixDQUFDQyxJQUF6QixHQUFnQyxDQUFDQyw2QkFBRCxFQUEyQkMsaUNBQTNCLENBQWhDOztBQUVBLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBQUMsRUFBRTtBQUFBLFNBQUlBLEVBQUUsQ0FBQ0MsS0FBUDtBQUFBLENBQTNCOztBQUNBLElBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQUYsRUFBRTtBQUFBLFNBQUlBLEVBQUUsQ0FBQ0csRUFBUDtBQUFBLENBQXpCOztBQUVBLFNBQVNSLHdCQUFULENBQWtDUyxpQkFBbEMsRUFBcURDLHFCQUFyRCxFQUE0RTtBQUMxRSxNQUFNQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLE9BQW1EO0FBQUEsUUFBakRwQixLQUFpRCxRQUFqREEsS0FBaUQ7QUFBQSxRQUExQ3FCLGdCQUEwQyxRQUExQ0EsZ0JBQTBDO0FBQUEsUUFBeEJqQixRQUF3QixRQUF4QkEsUUFBd0I7QUFBQSxRQUFka0IsUUFBYyxRQUFkQSxRQUFjO0FBQzNFLFFBQU1DLE9BQU8sR0FBRyxvQkFBUTtBQUFBLGFBQU1DLE9BQU8sQ0FBQ0MsTUFBTSxDQUFDQyxJQUFQLENBQVlKLFFBQVosRUFBc0JLLE1BQXZCLENBQWI7QUFBQSxLQUFSLEVBQXFELENBQUNMLFFBQUQsQ0FBckQsQ0FBaEI7QUFDQSxRQUFNTSxXQUFXLEdBQUcsb0JBQ2xCO0FBQUEsYUFDRVAsZ0JBQWdCLENBQUNRLEdBQWpCLENBQXFCLFVBQUFmLEVBQUU7QUFBQSwrQ0FDbEJBLEVBRGtCO0FBRXJCZ0IsVUFBQUEsUUFBUSxFQUFFLENBQUNQLE9BQUQsSUFBWVQsRUFBRSxDQUFDaUIsV0FBSCxLQUFtQjtBQUZwQjtBQUFBLE9BQXZCLENBREY7QUFBQSxLQURrQixFQU1sQixDQUFDUixPQUFELEVBQVVGLGdCQUFWLENBTmtCLENBQXBCO0FBU0EsUUFBTVcsYUFBYSxHQUFHLG9CQUFRO0FBQUEsYUFBTUosV0FBVyxDQUFDSyxJQUFaLENBQWlCLFVBQUFuQixFQUFFO0FBQUEsZUFBSUEsRUFBRSxDQUFDRyxFQUFILEtBQVVqQixLQUFLLENBQUNrQyxJQUFwQjtBQUFBLE9BQW5CLENBQU47QUFBQSxLQUFSLEVBQTRELENBQ2hGTixXQURnRixFQUVoRjVCLEtBQUssQ0FBQ2tDLElBRjBFLENBQTVELENBQXRCO0FBS0Esd0JBQ0UsZ0NBQUMsbUNBQUQscUJBQ0UsZ0NBQUMsdUJBQUQ7QUFBeUIsTUFBQSxTQUFTLEVBQUM7QUFBbkMsb0JBQ0UsZ0NBQUMsd0JBQUQ7QUFDRSxNQUFBLGFBQWEsRUFBRUYsYUFEakI7QUFFRSxNQUFBLE9BQU8sRUFBRUosV0FGWDtBQUdFLE1BQUEsV0FBVyxFQUFFLEtBSGY7QUFJRSxNQUFBLFdBQVcsRUFBQyx3QkFKZDtBQUtFLE1BQUEsUUFBUSxFQUFFeEIsUUFMWjtBQU1FLE1BQUEsY0FBYyxFQUFFWSxjQU5sQjtBQU9FLE1BQUEsWUFBWSxFQUFDLE9BUGY7QUFRRSxNQUFBLGFBQWEsRUFBRUgsZ0JBUmpCO0FBU0UsTUFBQSwrQkFBK0IsRUFBRUssaUJBVG5DO0FBVUUsTUFBQSx1QkFBdUIsRUFBRUM7QUFWM0IsTUFERixDQURGLENBREY7QUFrQkQsR0FsQ0Q7O0FBb0NBQyxFQUFBQSxpQkFBaUIsQ0FBQ3JCLFNBQWxCLEdBQThCQSxTQUE5QjtBQUVBLFNBQU8saUNBQVVxQixpQkFBVixDQUFQO0FBQ0Q7O2VBRWNYLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7dXNlTWVtb30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQsIHt3aXRoVGhlbWV9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IExheWVyVHlwZURyb3Bkb3duTGlzdEZhY3RvcnkgZnJvbSAnLi9sYXllci10eXBlLWRyb3Bkb3duLWxpc3QnO1xuaW1wb3J0IExheWVyVHlwZUxpc3RJdGVtRmFjdG9yeSBmcm9tICcuL2xheWVyLXR5cGUtbGlzdC1pdGVtJztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcblxuaW1wb3J0IHtTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IFN0eWxlZExheWVyVHlwZVNlbGVjdG9yID0gc3R5bGVkLmRpdmBcbiAgLml0ZW0tc2VsZWN0b3IgLml0ZW0tc2VsZWN0b3JfX2Ryb3Bkb3duIHtcbiAgICBwYWRkaW5nOiA0cHggMTBweCA0cHggMnB4O1xuICB9XG5gO1xuXG5MYXllclR5cGVTZWxlY3RvckZhY3RvcnkuZGVwcyA9IFtMYXllclR5cGVMaXN0SXRlbUZhY3RvcnksIExheWVyVHlwZURyb3Bkb3duTGlzdEZhY3RvcnldO1xuXG5jb25zdCBnZXREaXNwbGF5T3B0aW9uID0gb3AgPT4gb3AubGFiZWw7XG5jb25zdCBnZXRPcHRpb25WYWx1ZSA9IG9wID0+IG9wLmlkO1xuXG5mdW5jdGlvbiBMYXllclR5cGVTZWxlY3RvckZhY3RvcnkoTGF5ZXJUeXBlTGlzdEl0ZW0sIExheWVyVHlwZURyb3Bkb3duTGlzdCkge1xuICBjb25zdCBMYXllclR5cGVTZWxlY3RvciA9ICh7bGF5ZXIsIGxheWVyVHlwZU9wdGlvbnMsIG9uU2VsZWN0LCBkYXRhc2V0c30pID0+IHtcbiAgICBjb25zdCBoYXNEYXRhID0gdXNlTWVtbygoKSA9PiBCb29sZWFuKE9iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGgpLCBbZGF0YXNldHNdKTtcbiAgICBjb25zdCB0eXBlT3B0aW9ucyA9IHVzZU1lbW8oXG4gICAgICAoKSA9PlxuICAgICAgICBsYXllclR5cGVPcHRpb25zLm1hcChvcCA9PiAoe1xuICAgICAgICAgIC4uLm9wLFxuICAgICAgICAgIGRpc2FibGVkOiAhaGFzRGF0YSAmJiBvcC5yZXF1aXJlRGF0YSAhPT0gZmFsc2VcbiAgICAgICAgfSkpLFxuICAgICAgW2hhc0RhdGEsIGxheWVyVHlwZU9wdGlvbnNdXG4gICAgKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB1c2VNZW1vKCgpID0+IHR5cGVPcHRpb25zLmZpbmQob3AgPT4gb3AuaWQgPT09IGxheWVyLnR5cGUpLCBbXG4gICAgICB0eXBlT3B0aW9ucyxcbiAgICAgIGxheWVyLnR5cGVcbiAgICBdKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgPFN0eWxlZExheWVyVHlwZVNlbGVjdG9yIGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZ19fdHlwZVwiPlxuICAgICAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbXM9e3NlbGVjdGVkSXRlbXN9XG4gICAgICAgICAgICBvcHRpb25zPXt0eXBlT3B0aW9uc31cbiAgICAgICAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwicGxhY2Vob2xkZXIuc2VsZWN0VHlwZVwiXG4gICAgICAgICAgICBvbkNoYW5nZT17b25TZWxlY3R9XG4gICAgICAgICAgICBnZXRPcHRpb25WYWx1ZT17Z2V0T3B0aW9uVmFsdWV9XG4gICAgICAgICAgICBmaWx0ZXJPcHRpb249XCJsYWJlbFwiXG4gICAgICAgICAgICBkaXNwbGF5T3B0aW9uPXtnZXREaXNwbGF5T3B0aW9ufVxuICAgICAgICAgICAgRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudD17TGF5ZXJUeXBlTGlzdEl0ZW19XG4gICAgICAgICAgICBEcm9wRG93blJlbmRlckNvbXBvbmVudD17TGF5ZXJUeXBlRHJvcGRvd25MaXN0fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3R5bGVkTGF5ZXJUeXBlU2VsZWN0b3I+XG4gICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgKTtcbiAgfTtcblxuICBMYXllclR5cGVTZWxlY3Rvci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbiAgcmV0dXJuIHdpdGhUaGVtZShMYXllclR5cGVTZWxlY3Rvcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheWVyVHlwZVNlbGVjdG9yRmFjdG9yeTtcbiJdfQ==