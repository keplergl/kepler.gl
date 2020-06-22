"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _dropdownList = require("../../common/item-selector/dropdown-list");

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _defaultSettings = require("../../../constants/default-settings");

var _styledComponents2 = require("../../common/styled-components");

var _reactIntl = require("react-intl");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  // override item-selector dropdown padding\n  .item-selector .item-selector__dropdown {\n    padding: 4px 10px 4px 2px;\n  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n  background-color: ", ";\n  border-top: 1px solid ", ";\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-start;\n  padding: 12px 0 0 12px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  &.list {\n    display: flex;\n    align-items: center;\n\n    .layer-type-selector__item__icon {\n      color: ", ";\n      background-size: ", "px ", "px;\n      margin-right: 12px;\n    }\n  }\n\n  .layer-type-selector__item__icon {\n    color: ", ";\n    display: flex;\n    background-image: url(", ");\n    background-size: ", "px ", "px;\n  }\n\n  .layer-type-selector__item__label {\n    text-transform: capitalize;\n    font-size: 12px;\n    text-align: center;\n    color: ", ";\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding-bottom: 12px;\n  padding-right: 12px;\n\n  &.selected {\n    .layer-type-selector__item__icon {\n      border: 1px solid #caf2f4;\n    }\n  }\n\n  :hover,\n  &.selected {\n    cursor: pointer;\n    .layer-type-selector__item__icon {\n      color: ", ";\n    }\n\n    .layer-type-selector__item__label {\n      color: ", ";\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ITEM_SIZE = {
  large: 60,
  small: 28
};

var StyledDropdownListItem = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.activeColor;
}, function (props) {
  return props.theme.textColor;
});

var StyledListItem = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.activeColor;
}, ITEM_SIZE.small, ITEM_SIZE.small, function (props) {
  return props.theme.labelColor;
}, "".concat(_defaultSettings.CLOUDFRONT, "/kepler.gl-layer-icon-bg.png"), ITEM_SIZE.large, ITEM_SIZE.large, function (props) {
  return props.theme.labelColor;
});

var DropdownListWrapper = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.theme.dropdownList;
}, function (props) {
  return props.theme.dropdownListBgd;
}, function (props) {
  return props.theme.dropdownListBorderTop;
});

var LayerTypeListItem = function LayerTypeListItem(_ref) {
  var value = _ref.value,
      isTile = _ref.isTile;
  return _react["default"].createElement(StyledListItem, {
    className: (0, _classnames["default"])('layer-type-selector__item__inner', {
      list: !isTile
    })
  }, _react["default"].createElement("div", {
    className: "layer-type-selector__item__icon"
  }, _react["default"].createElement(value.icon, {
    height: "".concat(isTile ? ITEM_SIZE.large : ITEM_SIZE.small, "px")
  })), _react["default"].createElement("div", {
    className: "layer-type-selector__item__label"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: "layer.type.".concat(value.label.toLowerCase()),
    defaultMessage: value.label
  })));
};

var LayerTypeDropdownList = function LayerTypeDropdownList(props) {
  return _react["default"].createElement(DropdownListWrapper, {
    className: _dropdownList.classList.list
  }, props.options.map(function (value, i) {
    return _react["default"].createElement(StyledDropdownListItem, {
      className: (0, _classnames["default"])('layer-type-selector__item', {
        selected: props.selectedItems.find(function (it) {
          return it.id === value.id;
        }),
        hover: props.selectionIndex === i
      }),
      key: "".concat(value.id, "_").concat(i),
      onMouseDown: function onMouseDown(e) {
        e.preventDefault();
        props.onOptionSelected(value, e);
      },
      onClick: function onClick(e) {
        e.preventDefault();
        props.onOptionSelected(value, e);
      }
    }, _react["default"].createElement(props.customListItemComponent, {
      value: value,
      isTile: true
    }));
  }));
};

var propTypes = {
  layer: _propTypes["default"].object.isRequired,
  onSelect: _propTypes["default"].func.isRequired
};

var StyledLayerTypeSelector = _styledComponents["default"].div(_templateObject4());

var LayerTypeSelector = function LayerTypeSelector(_ref2) {
  var layer = _ref2.layer,
      layerTypeOptions = _ref2.layerTypeOptions,
      onSelect = _ref2.onSelect;
  return _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement(StyledLayerTypeSelector, {
    className: "layer-config__type"
  }, _react["default"].createElement(_itemSelector["default"], {
    selectedItems: layerTypeOptions.find(function (op) {
      return op.id === layer.type;
    }),
    options: layerTypeOptions,
    multiSelect: false,
    placeholder: "placeholder.selectType",
    onChange: onSelect,
    getOptionValue: function getOptionValue(op) {
      return op.id;
    },
    filterOption: "label",
    displayOption: function displayOption(op) {
      return op.label;
    },
    DropDownLineItemRenderComponent: LayerTypeListItem,
    DropDownRenderComponent: LayerTypeDropdownList
  })));
};

LayerTypeSelector.propTypes = propTypes;
var _default = LayerTypeSelector;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItdHlwZS1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJJVEVNX1NJWkUiLCJsYXJnZSIsInNtYWxsIiwiU3R5bGVkRHJvcGRvd25MaXN0SXRlbSIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJhY3RpdmVDb2xvciIsInRleHRDb2xvciIsIlN0eWxlZExpc3RJdGVtIiwibGFiZWxDb2xvciIsIkNMT1VERlJPTlQiLCJEcm9wZG93bkxpc3RXcmFwcGVyIiwiZHJvcGRvd25MaXN0IiwiZHJvcGRvd25MaXN0QmdkIiwiZHJvcGRvd25MaXN0Qm9yZGVyVG9wIiwiTGF5ZXJUeXBlTGlzdEl0ZW0iLCJ2YWx1ZSIsImlzVGlsZSIsImxpc3QiLCJsYWJlbCIsInRvTG93ZXJDYXNlIiwiTGF5ZXJUeXBlRHJvcGRvd25MaXN0IiwiY2xhc3NMaXN0Iiwib3B0aW9ucyIsIm1hcCIsImkiLCJzZWxlY3RlZCIsInNlbGVjdGVkSXRlbXMiLCJmaW5kIiwiaXQiLCJpZCIsImhvdmVyIiwic2VsZWN0aW9uSW5kZXgiLCJlIiwicHJldmVudERlZmF1bHQiLCJvbk9wdGlvblNlbGVjdGVkIiwicHJvcFR5cGVzIiwibGF5ZXIiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwib25TZWxlY3QiLCJmdW5jIiwiU3R5bGVkTGF5ZXJUeXBlU2VsZWN0b3IiLCJMYXllclR5cGVTZWxlY3RvciIsImxheWVyVHlwZU9wdGlvbnMiLCJvcCIsInR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLEtBQUssRUFBRSxFQURTO0FBRWhCQyxFQUFBQSxLQUFLLEVBQUU7QUFGUyxDQUFsQjs7QUFLQSxJQUFNQyxzQkFBc0IsR0FBR0MsNkJBQU9DLEdBQVYsb0JBY2IsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxXQUFoQjtBQUFBLENBZFEsRUFrQmIsVUFBQUYsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxTQUFoQjtBQUFBLENBbEJRLENBQTVCOztBQXVCQSxJQUFNQyxjQUFjLEdBQUdOLDZCQUFPQyxHQUFWLHFCQU1MLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsV0FBaEI7QUFBQSxDQU5BLEVBT0tSLFNBQVMsQ0FBQ0UsS0FQZixFQU8wQkYsU0FBUyxDQUFDRSxLQVBwQyxFQWFQLFVBQUFJLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksVUFBaEI7QUFBQSxDQWJFLFlBZVdDLDJCQWZYLG1DQWdCR1osU0FBUyxDQUFDQyxLQWhCYixFQWdCd0JELFNBQVMsQ0FBQ0MsS0FoQmxDLEVBdUJQLFVBQUFLLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksVUFBaEI7QUFBQSxDQXZCRSxDQUFwQjs7QUEyQkEsSUFBTUUsbUJBQW1CLEdBQUdULDZCQUFPQyxHQUFWLHFCQUNyQixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlPLFlBQWhCO0FBQUEsQ0FEZ0IsRUFFSCxVQUFBUixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlRLGVBQWhCO0FBQUEsQ0FGRixFQUdDLFVBQUFULEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWVMscUJBQWhCO0FBQUEsQ0FITixDQUF6Qjs7QUFVQSxJQUFNQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CO0FBQUEsTUFBRUMsS0FBRixRQUFFQSxLQUFGO0FBQUEsTUFBU0MsTUFBVCxRQUFTQSxNQUFUO0FBQUEsU0FDeEIsZ0NBQUMsY0FBRDtBQUFnQixJQUFBLFNBQVMsRUFBRSw0QkFBVyxrQ0FBWCxFQUErQztBQUFDQyxNQUFBQSxJQUFJLEVBQUUsQ0FBQ0Q7QUFBUixLQUEvQztBQUEzQixLQUNFO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNFLGdDQUFDLEtBQUQsQ0FBTyxJQUFQO0FBQVksSUFBQSxNQUFNLFlBQUtBLE1BQU0sR0FBR25CLFNBQVMsQ0FBQ0MsS0FBYixHQUFxQkQsU0FBUyxDQUFDRSxLQUExQztBQUFsQixJQURGLENBREYsRUFJRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRSxnQ0FBQywyQkFBRDtBQUNFLElBQUEsRUFBRSx1QkFBZ0JnQixLQUFLLENBQUNHLEtBQU4sQ0FBWUMsV0FBWixFQUFoQixDQURKO0FBRUUsSUFBQSxjQUFjLEVBQUVKLEtBQUssQ0FBQ0c7QUFGeEIsSUFERixDQUpGLENBRHdCO0FBQUEsQ0FBMUI7O0FBY0EsSUFBTUUscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixDQUFBakIsS0FBSztBQUFBLFNBQ2pDLGdDQUFDLG1CQUFEO0FBQXFCLElBQUEsU0FBUyxFQUFFa0Isd0JBQVVKO0FBQTFDLEtBQ0dkLEtBQUssQ0FBQ21CLE9BQU4sQ0FBY0MsR0FBZCxDQUFrQixVQUFDUixLQUFELEVBQVFTLENBQVI7QUFBQSxXQUNqQixnQ0FBQyxzQkFBRDtBQUNFLE1BQUEsU0FBUyxFQUFFLDRCQUFXLDJCQUFYLEVBQXdDO0FBQ2pEQyxRQUFBQSxRQUFRLEVBQUV0QixLQUFLLENBQUN1QixhQUFOLENBQW9CQyxJQUFwQixDQUF5QixVQUFBQyxFQUFFO0FBQUEsaUJBQUlBLEVBQUUsQ0FBQ0MsRUFBSCxLQUFVZCxLQUFLLENBQUNjLEVBQXBCO0FBQUEsU0FBM0IsQ0FEdUM7QUFFakRDLFFBQUFBLEtBQUssRUFBRTNCLEtBQUssQ0FBQzRCLGNBQU4sS0FBeUJQO0FBRmlCLE9BQXhDLENBRGI7QUFLRSxNQUFBLEdBQUcsWUFBS1QsS0FBSyxDQUFDYyxFQUFYLGNBQWlCTCxDQUFqQixDQUxMO0FBTUUsTUFBQSxXQUFXLEVBQUUscUJBQUFRLENBQUMsRUFBSTtBQUNoQkEsUUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0E5QixRQUFBQSxLQUFLLENBQUMrQixnQkFBTixDQUF1Qm5CLEtBQXZCLEVBQThCaUIsQ0FBOUI7QUFDRCxPQVRIO0FBVUUsTUFBQSxPQUFPLEVBQUUsaUJBQUFBLENBQUMsRUFBSTtBQUNaQSxRQUFBQSxDQUFDLENBQUNDLGNBQUY7QUFDQTlCLFFBQUFBLEtBQUssQ0FBQytCLGdCQUFOLENBQXVCbkIsS0FBdkIsRUFBOEJpQixDQUE5QjtBQUNEO0FBYkgsT0FlRSxnQ0FBQyxLQUFELENBQU8sdUJBQVA7QUFBK0IsTUFBQSxLQUFLLEVBQUVqQixLQUF0QztBQUE2QyxNQUFBLE1BQU07QUFBbkQsTUFmRixDQURpQjtBQUFBLEdBQWxCLENBREgsQ0FEaUM7QUFBQSxDQUFuQzs7QUF3QkEsSUFBTW9CLFNBQVMsR0FBRztBQUNoQkMsRUFBQUEsS0FBSyxFQUFFQyxzQkFBVUMsTUFBVixDQUFpQkMsVUFEUjtBQUVoQkMsRUFBQUEsUUFBUSxFQUFFSCxzQkFBVUksSUFBVixDQUFlRjtBQUZULENBQWxCOztBQUtBLElBQU1HLHVCQUF1QixHQUFHekMsNkJBQU9DLEdBQVYsb0JBQTdCOztBQU1BLElBQU15QyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CO0FBQUEsTUFBRVAsS0FBRixTQUFFQSxLQUFGO0FBQUEsTUFBU1EsZ0JBQVQsU0FBU0EsZ0JBQVQ7QUFBQSxNQUEyQkosUUFBM0IsU0FBMkJBLFFBQTNCO0FBQUEsU0FDeEIsZ0NBQUMsbUNBQUQsUUFDRSxnQ0FBQyx1QkFBRDtBQUF5QixJQUFBLFNBQVMsRUFBQztBQUFuQyxLQUNFLGdDQUFDLHdCQUFEO0FBQ0UsSUFBQSxhQUFhLEVBQUVJLGdCQUFnQixDQUFDakIsSUFBakIsQ0FBc0IsVUFBQWtCLEVBQUU7QUFBQSxhQUFJQSxFQUFFLENBQUNoQixFQUFILEtBQVVPLEtBQUssQ0FBQ1UsSUFBcEI7QUFBQSxLQUF4QixDQURqQjtBQUVFLElBQUEsT0FBTyxFQUFFRixnQkFGWDtBQUdFLElBQUEsV0FBVyxFQUFFLEtBSGY7QUFJRSxJQUFBLFdBQVcsRUFBQyx3QkFKZDtBQUtFLElBQUEsUUFBUSxFQUFFSixRQUxaO0FBTUUsSUFBQSxjQUFjLEVBQUUsd0JBQUFLLEVBQUU7QUFBQSxhQUFJQSxFQUFFLENBQUNoQixFQUFQO0FBQUEsS0FOcEI7QUFPRSxJQUFBLFlBQVksRUFBQyxPQVBmO0FBUUUsSUFBQSxhQUFhLEVBQUUsdUJBQUFnQixFQUFFO0FBQUEsYUFBSUEsRUFBRSxDQUFDM0IsS0FBUDtBQUFBLEtBUm5CO0FBU0UsSUFBQSwrQkFBK0IsRUFBRUosaUJBVG5DO0FBVUUsSUFBQSx1QkFBdUIsRUFBRU07QUFWM0IsSUFERixDQURGLENBRHdCO0FBQUEsQ0FBMUI7O0FBbUJBdUIsaUJBQWlCLENBQUNSLFNBQWxCLEdBQThCQSxTQUE5QjtlQUVlUSxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtjbGFzc0xpc3R9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvZHJvcGRvd24tbGlzdCc7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5pbXBvcnQge0NMT1VERlJPTlR9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5jb25zdCBJVEVNX1NJWkUgPSB7XG4gIGxhcmdlOiA2MCxcbiAgc21hbGw6IDI4XG59O1xuXG5jb25zdCBTdHlsZWREcm9wZG93bkxpc3RJdGVtID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1ib3R0b206IDEycHg7XG4gIHBhZGRpbmctcmlnaHQ6IDEycHg7XG5cbiAgJi5zZWxlY3RlZCB7XG4gICAgLmxheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2ljb24ge1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NhZjJmNDtcbiAgICB9XG4gIH1cblxuICA6aG92ZXIsXG4gICYuc2VsZWN0ZWQge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAubGF5ZXItdHlwZS1zZWxlY3Rvcl9faXRlbV9faWNvbiB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5hY3RpdmVDb2xvcn07XG4gICAgfVxuXG4gICAgLmxheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2xhYmVsIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRMaXN0SXRlbSA9IHN0eWxlZC5kaXZgXG4gICYubGlzdCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgLmxheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2ljb24ge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuYWN0aXZlQ29sb3J9O1xuICAgICAgYmFja2dyb3VuZC1zaXplOiAke0lURU1fU0laRS5zbWFsbH1weCAke0lURU1fU0laRS5zbWFsbH1weDtcbiAgICAgIG1hcmdpbi1yaWdodDogMTJweDtcbiAgICB9XG4gIH1cblxuICAubGF5ZXItdHlwZS1zZWxlY3Rvcl9faXRlbV9faWNvbiB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtgJHtDTE9VREZST05UfS9rZXBsZXIuZ2wtbGF5ZXItaWNvbi1iZy5wbmdgfSk7XG4gICAgYmFja2dyb3VuZC1zaXplOiAke0lURU1fU0laRS5sYXJnZX1weCAke0lURU1fU0laRS5sYXJnZX1weDtcbiAgfVxuXG4gIC5sYXllci10eXBlLXNlbGVjdG9yX19pdGVtX19sYWJlbCB7XG4gICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgfVxuYDtcblxuY29uc3QgRHJvcGRvd25MaXN0V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0fTtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCZ2R9O1xuICBib3JkZXItdG9wOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RCb3JkZXJUb3B9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBwYWRkaW5nOiAxMnB4IDAgMCAxMnB4O1xuYDtcblxuY29uc3QgTGF5ZXJUeXBlTGlzdEl0ZW0gPSAoe3ZhbHVlLCBpc1RpbGV9KSA9PiAoXG4gIDxTdHlsZWRMaXN0SXRlbSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ2xheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW1fX2lubmVyJywge2xpc3Q6ICFpc1RpbGV9KX0+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci10eXBlLXNlbGVjdG9yX19pdGVtX19pY29uXCI+XG4gICAgICA8dmFsdWUuaWNvbiBoZWlnaHQ9e2Ake2lzVGlsZSA/IElURU1fU0laRS5sYXJnZSA6IElURU1fU0laRS5zbWFsbH1weGB9IC8+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci10eXBlLXNlbGVjdG9yX19pdGVtX19sYWJlbFwiPlxuICAgICAgPEZvcm1hdHRlZE1lc3NhZ2VcbiAgICAgICAgaWQ9e2BsYXllci50eXBlLiR7dmFsdWUubGFiZWwudG9Mb3dlckNhc2UoKX1gfVxuICAgICAgICBkZWZhdWx0TWVzc2FnZT17dmFsdWUubGFiZWx9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICA8L1N0eWxlZExpc3RJdGVtPlxuKTtcblxuY29uc3QgTGF5ZXJUeXBlRHJvcGRvd25MaXN0ID0gcHJvcHMgPT4gKFxuICA8RHJvcGRvd25MaXN0V3JhcHBlciBjbGFzc05hbWU9e2NsYXNzTGlzdC5saXN0fT5cbiAgICB7cHJvcHMub3B0aW9ucy5tYXAoKHZhbHVlLCBpKSA9PiAoXG4gICAgICA8U3R5bGVkRHJvcGRvd25MaXN0SXRlbVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ2xheWVyLXR5cGUtc2VsZWN0b3JfX2l0ZW0nLCB7XG4gICAgICAgICAgc2VsZWN0ZWQ6IHByb3BzLnNlbGVjdGVkSXRlbXMuZmluZChpdCA9PiBpdC5pZCA9PT0gdmFsdWUuaWQpLFxuICAgICAgICAgIGhvdmVyOiBwcm9wcy5zZWxlY3Rpb25JbmRleCA9PT0gaVxuICAgICAgICB9KX1cbiAgICAgICAga2V5PXtgJHt2YWx1ZS5pZH1fJHtpfWB9XG4gICAgICAgIG9uTW91c2VEb3duPXtlID0+IHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgcHJvcHMub25PcHRpb25TZWxlY3RlZCh2YWx1ZSwgZSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBwcm9wcy5vbk9wdGlvblNlbGVjdGVkKHZhbHVlLCBlKTtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPHByb3BzLmN1c3RvbUxpc3RJdGVtQ29tcG9uZW50IHZhbHVlPXt2YWx1ZX0gaXNUaWxlIC8+XG4gICAgICA8L1N0eWxlZERyb3Bkb3duTGlzdEl0ZW0+XG4gICAgKSl9XG4gIDwvRHJvcGRvd25MaXN0V3JhcHBlcj5cbik7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IFN0eWxlZExheWVyVHlwZVNlbGVjdG9yID0gc3R5bGVkLmRpdmBcbiAgLy8gb3ZlcnJpZGUgaXRlbS1zZWxlY3RvciBkcm9wZG93biBwYWRkaW5nXG4gIC5pdGVtLXNlbGVjdG9yIC5pdGVtLXNlbGVjdG9yX19kcm9wZG93biB7XG4gICAgcGFkZGluZzogNHB4IDEwcHggNHB4IDJweDtcbiAgfVxuYDtcbmNvbnN0IExheWVyVHlwZVNlbGVjdG9yID0gKHtsYXllciwgbGF5ZXJUeXBlT3B0aW9ucywgb25TZWxlY3R9KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgIDxTdHlsZWRMYXllclR5cGVTZWxlY3RvciBjbGFzc05hbWU9XCJsYXllci1jb25maWdfX3R5cGVcIj5cbiAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgc2VsZWN0ZWRJdGVtcz17bGF5ZXJUeXBlT3B0aW9ucy5maW5kKG9wID0+IG9wLmlkID09PSBsYXllci50eXBlKX1cbiAgICAgICAgb3B0aW9ucz17bGF5ZXJUeXBlT3B0aW9uc31cbiAgICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgICBwbGFjZWhvbGRlcj1cInBsYWNlaG9sZGVyLnNlbGVjdFR5cGVcIlxuICAgICAgICBvbkNoYW5nZT17b25TZWxlY3R9XG4gICAgICAgIGdldE9wdGlvblZhbHVlPXtvcCA9PiBvcC5pZH1cbiAgICAgICAgZmlsdGVyT3B0aW9uPVwibGFiZWxcIlxuICAgICAgICBkaXNwbGF5T3B0aW9uPXtvcCA9PiBvcC5sYWJlbH1cbiAgICAgICAgRHJvcERvd25MaW5lSXRlbVJlbmRlckNvbXBvbmVudD17TGF5ZXJUeXBlTGlzdEl0ZW19XG4gICAgICAgIERyb3BEb3duUmVuZGVyQ29tcG9uZW50PXtMYXllclR5cGVEcm9wZG93bkxpc3R9XG4gICAgICAvPlxuICAgIDwvU3R5bGVkTGF5ZXJUeXBlU2VsZWN0b3I+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbkxheWVyVHlwZVNlbGVjdG9yLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuZXhwb3J0IGRlZmF1bHQgTGF5ZXJUeXBlU2VsZWN0b3I7XG4iXX0=