"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerTypeListItemFactory = LayerTypeListItemFactory;
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _defaultSettings = require("../../../constants/default-settings");

var _classnames = _interopRequireDefault(require("classnames"));

var _localization = require("../../../localization");

var _templateObject;

var ITEM_SIZE = {
  large: 50,
  small: 28
};

var StyledListItem = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  &.list {\n    display: flex;\n    align-items: center;\n\n    .layer-type-selector__item__icon {\n      color: ", ";\n      background-size: ", "px\n        ", "px;\n      margin-right: 12px;\n    }\n  }\n\n  .layer-type-selector__item__icon {\n    color: ", ";\n    display: flex;\n    background-image: url(", ");\n    background-size: ", "px\n      ", "px;\n  }\n\n  .layer-type-selector__item__label {\n    text-transform: capitalize;\n    font-size: 12px;\n    text-align: center;\n    color: ", ";\n  }\n"])), function (props) {
  return props.theme.activeColor;
}, function (props) {
  return props.theme.layerTypeIconSizeSM;
}, function (props) {
  return props.theme.layerTypeIconSizeSM;
}, function (props) {
  return props.theme.labelColor;
}, "".concat(_defaultSettings.CLOUDFRONT, "/kepler.gl-layer-icon-bg.png"), function (props) {
  return props.theme.layerTypeIconSizeL;
}, function (props) {
  return props.theme.layerTypeIconSizeL;
}, function (props) {
  return props.theme.selectColor;
});

function LayerTypeListItemFactory() {
  var LayerTypeListItem = function LayerTypeListItem(_ref) {
    var value = _ref.value,
        isTile = _ref.isTile;
    return /*#__PURE__*/_react["default"].createElement(StyledListItem, {
      className: (0, _classnames["default"])('layer-type-selector__item__inner', {
        list: !isTile
      })
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "layer-type-selector__item__icon"
    }, /*#__PURE__*/_react["default"].createElement(value.icon, {
      height: "".concat(isTile ? ITEM_SIZE.large : ITEM_SIZE.small, "px")
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "layer-type-selector__item__label"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: "layer.type.".concat(value.label.toLowerCase()),
      defaultMessage: value.label
    })));
  };

  return LayerTypeListItem;
}

var _default = LayerTypeListItemFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItdHlwZS1saXN0LWl0ZW0uanMiXSwibmFtZXMiOlsiSVRFTV9TSVpFIiwibGFyZ2UiLCJzbWFsbCIsIlN0eWxlZExpc3RJdGVtIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsImFjdGl2ZUNvbG9yIiwibGF5ZXJUeXBlSWNvblNpemVTTSIsImxhYmVsQ29sb3IiLCJDTE9VREZST05UIiwibGF5ZXJUeXBlSWNvblNpemVMIiwic2VsZWN0Q29sb3IiLCJMYXllclR5cGVMaXN0SXRlbUZhY3RvcnkiLCJMYXllclR5cGVMaXN0SXRlbSIsInZhbHVlIiwiaXNUaWxlIiwibGlzdCIsImxhYmVsIiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLFNBQVMsR0FBRztBQUNoQkMsRUFBQUEsS0FBSyxFQUFFLEVBRFM7QUFFaEJDLEVBQUFBLEtBQUssRUFBRTtBQUZTLENBQWxCOztBQUtBLElBQU1DLGNBQWMsR0FBR0MsNkJBQU9DLEdBQVYseWxCQU1MLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsV0FBaEI7QUFBQSxDQU5BLEVBT0ssVUFBQUYsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxtQkFBaEI7QUFBQSxDQVBWLEVBUVYsVUFBQUgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxtQkFBaEI7QUFBQSxDQVJLLEVBY1AsVUFBQUgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRyxVQUFoQjtBQUFBLENBZEUsWUFnQldDLDJCQWhCWCxtQ0FpQkcsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSyxrQkFBaEI7QUFBQSxDQWpCUixFQWtCWixVQUFBTixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlLLGtCQUFoQjtBQUFBLENBbEJPLEVBeUJQLFVBQUFOLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWU0sV0FBaEI7QUFBQSxDQXpCRSxDQUFwQjs7QUE2Qk8sU0FBU0Msd0JBQVQsR0FBb0M7QUFDekMsTUFBTUMsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQjtBQUFBLFFBQUVDLEtBQUYsUUFBRUEsS0FBRjtBQUFBLFFBQVNDLE1BQVQsUUFBU0EsTUFBVDtBQUFBLHdCQUN4QixnQ0FBQyxjQUFEO0FBQ0UsTUFBQSxTQUFTLEVBQUUsNEJBQVcsa0NBQVgsRUFBK0M7QUFDeERDLFFBQUFBLElBQUksRUFBRSxDQUFDRDtBQURpRCxPQUEvQztBQURiLG9CQUtFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRSxnQ0FBQyxLQUFELENBQU8sSUFBUDtBQUFZLE1BQUEsTUFBTSxZQUFLQSxNQUFNLEdBQUdqQixTQUFTLENBQUNDLEtBQWIsR0FBcUJELFNBQVMsQ0FBQ0UsS0FBMUM7QUFBbEIsTUFERixDQUxGLGVBUUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFLGdDQUFDLDhCQUFEO0FBQ0UsTUFBQSxFQUFFLHVCQUFnQmMsS0FBSyxDQUFDRyxLQUFOLENBQVlDLFdBQVosRUFBaEIsQ0FESjtBQUVFLE1BQUEsY0FBYyxFQUFFSixLQUFLLENBQUNHO0FBRnhCLE1BREYsQ0FSRixDQUR3QjtBQUFBLEdBQTFCOztBQWtCQSxTQUFPSixpQkFBUDtBQUNEOztlQUVjRCx3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Q0xPVURGUk9OVH0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5cbmNvbnN0IElURU1fU0laRSA9IHtcbiAgbGFyZ2U6IDUwLFxuICBzbWFsbDogMjhcbn07XG5cbmNvbnN0IFN0eWxlZExpc3RJdGVtID0gc3R5bGVkLmRpdmBcbiAgJi5saXN0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAubGF5ZXItdHlwZS1zZWxlY3Rvcl9faXRlbV9faWNvbiB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5hY3RpdmVDb2xvcn07XG4gICAgICBiYWNrZ3JvdW5kLXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGF5ZXJUeXBlSWNvblNpemVTTX1weFxuICAgICAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxheWVyVHlwZUljb25TaXplU019cHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDEycHg7XG4gICAgfVxuICB9XG5cbiAgLmxheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2ljb24ge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7YCR7Q0xPVURGUk9OVH0va2VwbGVyLmdsLWxheWVyLWljb24tYmcucG5nYH0pO1xuICAgIGJhY2tncm91bmQtc2l6ZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYXllclR5cGVJY29uU2l6ZUx9cHhcbiAgICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGF5ZXJUeXBlSWNvblNpemVMfXB4O1xuICB9XG5cbiAgLmxheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2xhYmVsIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNlbGVjdENvbG9yfTtcbiAgfVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIExheWVyVHlwZUxpc3RJdGVtRmFjdG9yeSgpIHtcbiAgY29uc3QgTGF5ZXJUeXBlTGlzdEl0ZW0gPSAoe3ZhbHVlLCBpc1RpbGV9KSA9PiAoXG4gICAgPFN0eWxlZExpc3RJdGVtXG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ2xheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2lubmVyJywge1xuICAgICAgICBsaXN0OiAhaXNUaWxlXG4gICAgICB9KX1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2ljb25cIj5cbiAgICAgICAgPHZhbHVlLmljb24gaGVpZ2h0PXtgJHtpc1RpbGUgPyBJVEVNX1NJWkUubGFyZ2UgOiBJVEVNX1NJWkUuc21hbGx9cHhgfSAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2xhYmVsXCI+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlXG4gICAgICAgICAgaWQ9e2BsYXllci50eXBlLiR7dmFsdWUubGFiZWwudG9Mb3dlckNhc2UoKX1gfVxuICAgICAgICAgIGRlZmF1bHRNZXNzYWdlPXt2YWx1ZS5sYWJlbH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvU3R5bGVkTGlzdEl0ZW0+XG4gICk7XG5cbiAgcmV0dXJuIExheWVyVHlwZUxpc3RJdGVtO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMYXllclR5cGVMaXN0SXRlbUZhY3Rvcnk7XG4iXX0=