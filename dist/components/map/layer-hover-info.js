"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.StyledLayerName = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styledComponents2 = require("../common/styled-components");

var _icons = require("../common/icons");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dataUtils = require("../../utils/data-utils");

var _interactionUtils = require("../../utils/interaction-utils");

var _templateObject, _templateObject2;

var StyledLayerName = (0, _styledComponents["default"])(_styledComponents2.CenterFlexbox)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 12px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n\n  svg {\n    margin-right: 4px;\n  }\n"])), function (props) {
  return props.theme.textColorHl;
});
exports.StyledLayerName = StyledLayerName;

var StyledTable = _styledComponents["default"].table(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  & .row__delta-value {\n    text-align: right;\n\n    &.positive {\n      color: ", ";\n    }\n\n    &.negative {\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.negativeBtnActBgd;
});
/** @type {import('./layer-hover-info').RowComponent} */


var Row = function Row(_ref) {
  var name = _ref.name,
      value = _ref.value,
      deltaValue = _ref.deltaValue,
      url = _ref.url;

  // Set 'url' to 'value' if it looks like a url
  if (!url && value && typeof value === 'string' && value.match(/^http/)) {
    url = value;
  }

  var asImg = /<img>/.test(name);
  return /*#__PURE__*/_react["default"].createElement("tr", {
    className: "row",
    key: name
  }, /*#__PURE__*/_react["default"].createElement("td", {
    className: "row__name"
  }, name), /*#__PURE__*/_react["default"].createElement("td", {
    className: "row__value"
  }, asImg ? /*#__PURE__*/_react["default"].createElement("img", {
    src: value
  }) : url ? /*#__PURE__*/_react["default"].createElement("a", {
    target: "_blank",
    rel: "noopener noreferrer",
    href: url
  }, value) : value), (0, _dataUtils.notNullorUndefined)(deltaValue) && /*#__PURE__*/_react["default"].createElement("td", {
    className: "row__delta-value ".concat(deltaValue.toString().charAt(0) === '+' ? 'positive' : 'negative')
  }, deltaValue));
};

var EntryInfo = function EntryInfo(_ref2) {
  var fieldsToShow = _ref2.fieldsToShow,
      fields = _ref2.fields,
      data = _ref2.data,
      primaryData = _ref2.primaryData,
      compareType = _ref2.compareType;
  return /*#__PURE__*/_react["default"].createElement("tbody", null, fieldsToShow.map(function (item) {
    return /*#__PURE__*/_react["default"].createElement(EntryInfoRow, {
      key: item.name,
      item: item,
      fields: fields,
      data: data,
      primaryData: primaryData,
      compareType: compareType
    });
  }));
};

var EntryInfoRow = function EntryInfoRow(_ref3) {
  var item = _ref3.item,
      fields = _ref3.fields,
      data = _ref3.data,
      primaryData = _ref3.primaryData,
      compareType = _ref3.compareType;
  var fieldIdx = fields.findIndex(function (f) {
    return f.name === item.name;
  });

  if (fieldIdx < 0) {
    return null;
  }

  var field = fields[fieldIdx];
  var displayValue = (0, _interactionUtils.getTooltipDisplayValue)({
    item: item,
    field: field,
    data: data,
    fieldIdx: fieldIdx
  });
  var displayDeltaValue = (0, _interactionUtils.getTooltipDisplayDeltaValue)({
    item: item,
    field: field,
    data: data,
    fieldIdx: fieldIdx,
    primaryData: primaryData,
    compareType: compareType
  });
  return /*#__PURE__*/_react["default"].createElement(Row, {
    name: field.displayName || field.name,
    value: displayValue,
    deltaValue: displayDeltaValue
  });
}; // TODO: supporting comparative value for aggregated cells as well


var CellInfo = function CellInfo(_ref4) {
  var data = _ref4.data,
      layer = _ref4.layer;
  var _layer$config = layer.config,
      colorField = _layer$config.colorField,
      sizeField = _layer$config.sizeField;
  return /*#__PURE__*/_react["default"].createElement("tbody", null, /*#__PURE__*/_react["default"].createElement(Row, {
    name: 'total points',
    key: "count",
    value: data.points && data.points.length
  }), colorField && layer.visualChannels.color ? /*#__PURE__*/_react["default"].createElement(Row, {
    name: layer.getVisualChannelDescription('color').measure,
    key: "color",
    value: data.colorValue || 'N/A'
  }) : null, sizeField && layer.visualChannels.size ? /*#__PURE__*/_react["default"].createElement(Row, {
    name: layer.getVisualChannelDescription('size').measure,
    key: "size",
    value: data.elevationValue || 'N/A'
  }) : null);
};

var LayerHoverInfoFactory = function LayerHoverInfoFactory() {
  var LayerHoverInfo = function LayerHoverInfo(props) {
    var data = props.data,
        layer = props.layer;

    if (!data || !layer) {
      return null;
    }

    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "map-popover__layer-info"
    }, /*#__PURE__*/_react["default"].createElement(StyledLayerName, {
      className: "map-popover__layer-name"
    }, /*#__PURE__*/_react["default"].createElement(_icons.Layers, {
      height: "12px"
    }), props.layer.config.label), /*#__PURE__*/_react["default"].createElement(StyledTable, null, props.layer.isAggregated ? /*#__PURE__*/_react["default"].createElement(CellInfo, props) : /*#__PURE__*/_react["default"].createElement(EntryInfo, props)));
  };

  LayerHoverInfo.propTypes = {
    fields: _propTypes["default"].arrayOf(_propTypes["default"].any),
    fieldsToShow: _propTypes["default"].arrayOf(_propTypes["default"].any),
    layer: _propTypes["default"].object,
    data: _propTypes["default"].oneOfType([_propTypes["default"].arrayOf(_propTypes["default"].any), _propTypes["default"].object])
  };
  return LayerHoverInfo;
};

var _default = LayerHoverInfoFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9sYXllci1ob3Zlci1pbmZvLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyTmFtZSIsIkNlbnRlckZsZXhib3giLCJwcm9wcyIsInRoZW1lIiwidGV4dENvbG9ySGwiLCJTdHlsZWRUYWJsZSIsInN0eWxlZCIsInRhYmxlIiwicHJpbWFyeUJ0bkJnZCIsIm5lZ2F0aXZlQnRuQWN0QmdkIiwiUm93IiwibmFtZSIsInZhbHVlIiwiZGVsdGFWYWx1ZSIsInVybCIsIm1hdGNoIiwiYXNJbWciLCJ0ZXN0IiwidG9TdHJpbmciLCJjaGFyQXQiLCJFbnRyeUluZm8iLCJmaWVsZHNUb1Nob3ciLCJmaWVsZHMiLCJkYXRhIiwicHJpbWFyeURhdGEiLCJjb21wYXJlVHlwZSIsIm1hcCIsIml0ZW0iLCJFbnRyeUluZm9Sb3ciLCJmaWVsZElkeCIsImZpbmRJbmRleCIsImYiLCJmaWVsZCIsImRpc3BsYXlWYWx1ZSIsImRpc3BsYXlEZWx0YVZhbHVlIiwiZGlzcGxheU5hbWUiLCJDZWxsSW5mbyIsImxheWVyIiwiY29uZmlnIiwiY29sb3JGaWVsZCIsInNpemVGaWVsZCIsInBvaW50cyIsImxlbmd0aCIsInZpc3VhbENoYW5uZWxzIiwiY29sb3IiLCJnZXRWaXN1YWxDaGFubmVsRGVzY3JpcHRpb24iLCJtZWFzdXJlIiwiY29sb3JWYWx1ZSIsInNpemUiLCJlbGV2YXRpb25WYWx1ZSIsIkxheWVySG92ZXJJbmZvRmFjdG9yeSIsIkxheWVySG92ZXJJbmZvIiwibGFiZWwiLCJpc0FnZ3JlZ2F0ZWQiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwiYW55Iiwib2JqZWN0Iiwib25lT2ZUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVPLElBQU1BLGVBQWUsR0FBRyxrQ0FBT0MsZ0NBQVAsQ0FBSCwrTkFDakIsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxXQUFoQjtBQUFBLENBRFksQ0FBckI7OztBQVdQLElBQU1DLFdBQVcsR0FBR0MsNkJBQU9DLEtBQVYsK09BS0YsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZSyxhQUFoQjtBQUFBLENBTEgsRUFTRixVQUFBTixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlNLGlCQUFoQjtBQUFBLENBVEgsQ0FBakI7QUFjQTs7O0FBQ0EsSUFBTUMsR0FBRyxHQUFHLFNBQU5BLEdBQU0sT0FBb0M7QUFBQSxNQUFsQ0MsSUFBa0MsUUFBbENBLElBQWtDO0FBQUEsTUFBNUJDLEtBQTRCLFFBQTVCQSxLQUE0QjtBQUFBLE1BQXJCQyxVQUFxQixRQUFyQkEsVUFBcUI7QUFBQSxNQUFUQyxHQUFTLFFBQVRBLEdBQVM7O0FBQzlDO0FBQ0EsTUFBSSxDQUFDQSxHQUFELElBQVFGLEtBQVIsSUFBaUIsT0FBT0EsS0FBUCxLQUFpQixRQUFsQyxJQUE4Q0EsS0FBSyxDQUFDRyxLQUFOLENBQVksT0FBWixDQUFsRCxFQUF3RTtBQUN0RUQsSUFBQUEsR0FBRyxHQUFHRixLQUFOO0FBQ0Q7O0FBRUQsTUFBTUksS0FBSyxHQUFHLFFBQVFDLElBQVIsQ0FBYU4sSUFBYixDQUFkO0FBQ0Esc0JBQ0U7QUFBSSxJQUFBLFNBQVMsRUFBQyxLQUFkO0FBQW9CLElBQUEsR0FBRyxFQUFFQTtBQUF6QixrQkFDRTtBQUFJLElBQUEsU0FBUyxFQUFDO0FBQWQsS0FBMkJBLElBQTNCLENBREYsZUFFRTtBQUFJLElBQUEsU0FBUyxFQUFDO0FBQWQsS0FDR0ssS0FBSyxnQkFDSjtBQUFLLElBQUEsR0FBRyxFQUFFSjtBQUFWLElBREksR0FFRkUsR0FBRyxnQkFDTDtBQUFHLElBQUEsTUFBTSxFQUFDLFFBQVY7QUFBbUIsSUFBQSxHQUFHLEVBQUMscUJBQXZCO0FBQTZDLElBQUEsSUFBSSxFQUFFQTtBQUFuRCxLQUNHRixLQURILENBREssR0FLTEEsS0FSSixDQUZGLEVBYUcsbUNBQW1CQyxVQUFuQixrQkFDQztBQUNFLElBQUEsU0FBUyw2QkFDUEEsVUFBVSxDQUFDSyxRQUFYLEdBQXNCQyxNQUF0QixDQUE2QixDQUE3QixNQUFvQyxHQUFwQyxHQUEwQyxVQUExQyxHQUF1RCxVQURoRDtBQURYLEtBS0dOLFVBTEgsQ0FkSixDQURGO0FBeUJELENBaENEOztBQWtDQSxJQUFNTyxTQUFTLEdBQUcsU0FBWkEsU0FBWTtBQUFBLE1BQUVDLFlBQUYsU0FBRUEsWUFBRjtBQUFBLE1BQWdCQyxNQUFoQixTQUFnQkEsTUFBaEI7QUFBQSxNQUF3QkMsSUFBeEIsU0FBd0JBLElBQXhCO0FBQUEsTUFBOEJDLFdBQTlCLFNBQThCQSxXQUE5QjtBQUFBLE1BQTJDQyxXQUEzQyxTQUEyQ0EsV0FBM0M7QUFBQSxzQkFDaEIsK0NBQ0dKLFlBQVksQ0FBQ0ssR0FBYixDQUFpQixVQUFBQyxJQUFJO0FBQUEsd0JBQ3BCLGdDQUFDLFlBQUQ7QUFDRSxNQUFBLEdBQUcsRUFBRUEsSUFBSSxDQUFDaEIsSUFEWjtBQUVFLE1BQUEsSUFBSSxFQUFFZ0IsSUFGUjtBQUdFLE1BQUEsTUFBTSxFQUFFTCxNQUhWO0FBSUUsTUFBQSxJQUFJLEVBQUVDLElBSlI7QUFLRSxNQUFBLFdBQVcsRUFBRUMsV0FMZjtBQU1FLE1BQUEsV0FBVyxFQUFFQztBQU5mLE1BRG9CO0FBQUEsR0FBckIsQ0FESCxDQURnQjtBQUFBLENBQWxCOztBQWVBLElBQU1HLFlBQVksR0FBRyxTQUFmQSxZQUFlLFFBQW9EO0FBQUEsTUFBbERELElBQWtELFNBQWxEQSxJQUFrRDtBQUFBLE1BQTVDTCxNQUE0QyxTQUE1Q0EsTUFBNEM7QUFBQSxNQUFwQ0MsSUFBb0MsU0FBcENBLElBQW9DO0FBQUEsTUFBOUJDLFdBQThCLFNBQTlCQSxXQUE4QjtBQUFBLE1BQWpCQyxXQUFpQixTQUFqQkEsV0FBaUI7QUFDdkUsTUFBTUksUUFBUSxHQUFHUCxNQUFNLENBQUNRLFNBQVAsQ0FBaUIsVUFBQUMsQ0FBQztBQUFBLFdBQUlBLENBQUMsQ0FBQ3BCLElBQUYsS0FBV2dCLElBQUksQ0FBQ2hCLElBQXBCO0FBQUEsR0FBbEIsQ0FBakI7O0FBQ0EsTUFBSWtCLFFBQVEsR0FBRyxDQUFmLEVBQWtCO0FBQ2hCLFdBQU8sSUFBUDtBQUNEOztBQUNELE1BQU1HLEtBQUssR0FBR1YsTUFBTSxDQUFDTyxRQUFELENBQXBCO0FBQ0EsTUFBTUksWUFBWSxHQUFHLDhDQUF1QjtBQUFDTixJQUFBQSxJQUFJLEVBQUpBLElBQUQ7QUFBT0ssSUFBQUEsS0FBSyxFQUFMQSxLQUFQO0FBQWNULElBQUFBLElBQUksRUFBSkEsSUFBZDtBQUFvQk0sSUFBQUEsUUFBUSxFQUFSQTtBQUFwQixHQUF2QixDQUFyQjtBQUVBLE1BQU1LLGlCQUFpQixHQUFHLG1EQUE0QjtBQUNwRFAsSUFBQUEsSUFBSSxFQUFKQSxJQURvRDtBQUVwREssSUFBQUEsS0FBSyxFQUFMQSxLQUZvRDtBQUdwRFQsSUFBQUEsSUFBSSxFQUFKQSxJQUhvRDtBQUlwRE0sSUFBQUEsUUFBUSxFQUFSQSxRQUpvRDtBQUtwREwsSUFBQUEsV0FBVyxFQUFYQSxXQUxvRDtBQU1wREMsSUFBQUEsV0FBVyxFQUFYQTtBQU5vRCxHQUE1QixDQUExQjtBQVNBLHNCQUNFLGdDQUFDLEdBQUQ7QUFDRSxJQUFBLElBQUksRUFBRU8sS0FBSyxDQUFDRyxXQUFOLElBQXFCSCxLQUFLLENBQUNyQixJQURuQztBQUVFLElBQUEsS0FBSyxFQUFFc0IsWUFGVDtBQUdFLElBQUEsVUFBVSxFQUFFQztBQUhkLElBREY7QUFPRCxDQXhCRCxDLENBMEJBOzs7QUFDQSxJQUFNRSxRQUFRLEdBQUcsU0FBWEEsUUFBVyxRQUFtQjtBQUFBLE1BQWpCYixJQUFpQixTQUFqQkEsSUFBaUI7QUFBQSxNQUFYYyxLQUFXLFNBQVhBLEtBQVc7QUFBQSxzQkFDRkEsS0FBSyxDQUFDQyxNQURKO0FBQUEsTUFDM0JDLFVBRDJCLGlCQUMzQkEsVUFEMkI7QUFBQSxNQUNmQyxTQURlLGlCQUNmQSxTQURlO0FBR2xDLHNCQUNFLDREQUNFLGdDQUFDLEdBQUQ7QUFBSyxJQUFBLElBQUksRUFBRSxjQUFYO0FBQTJCLElBQUEsR0FBRyxFQUFDLE9BQS9CO0FBQXVDLElBQUEsS0FBSyxFQUFFakIsSUFBSSxDQUFDa0IsTUFBTCxJQUFlbEIsSUFBSSxDQUFDa0IsTUFBTCxDQUFZQztBQUF6RSxJQURGLEVBRUdILFVBQVUsSUFBSUYsS0FBSyxDQUFDTSxjQUFOLENBQXFCQyxLQUFuQyxnQkFDQyxnQ0FBQyxHQUFEO0FBQ0UsSUFBQSxJQUFJLEVBQUVQLEtBQUssQ0FBQ1EsMkJBQU4sQ0FBa0MsT0FBbEMsRUFBMkNDLE9BRG5EO0FBRUUsSUFBQSxHQUFHLEVBQUMsT0FGTjtBQUdFLElBQUEsS0FBSyxFQUFFdkIsSUFBSSxDQUFDd0IsVUFBTCxJQUFtQjtBQUg1QixJQURELEdBTUcsSUFSTixFQVNHUCxTQUFTLElBQUlILEtBQUssQ0FBQ00sY0FBTixDQUFxQkssSUFBbEMsZ0JBQ0MsZ0NBQUMsR0FBRDtBQUNFLElBQUEsSUFBSSxFQUFFWCxLQUFLLENBQUNRLDJCQUFOLENBQWtDLE1BQWxDLEVBQTBDQyxPQURsRDtBQUVFLElBQUEsR0FBRyxFQUFDLE1BRk47QUFHRSxJQUFBLEtBQUssRUFBRXZCLElBQUksQ0FBQzBCLGNBQUwsSUFBdUI7QUFIaEMsSUFERCxHQU1HLElBZk4sQ0FERjtBQW1CRCxDQXRCRDs7QUF3QkEsSUFBTUMscUJBQXFCLEdBQUcsU0FBeEJBLHFCQUF3QixHQUFNO0FBQ2xDLE1BQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQWpELEtBQUssRUFBSTtBQUFBLFFBQ3ZCcUIsSUFEdUIsR0FDUnJCLEtBRFEsQ0FDdkJxQixJQUR1QjtBQUFBLFFBQ2pCYyxLQURpQixHQUNSbkMsS0FEUSxDQUNqQm1DLEtBRGlCOztBQUc5QixRQUFJLENBQUNkLElBQUQsSUFBUyxDQUFDYyxLQUFkLEVBQXFCO0FBQ25CLGFBQU8sSUFBUDtBQUNEOztBQUVELHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRSxnQ0FBQyxlQUFEO0FBQWlCLE1BQUEsU0FBUyxFQUFDO0FBQTNCLG9CQUNFLGdDQUFDLGFBQUQ7QUFBUSxNQUFBLE1BQU0sRUFBQztBQUFmLE1BREYsRUFFR25DLEtBQUssQ0FBQ21DLEtBQU4sQ0FBWUMsTUFBWixDQUFtQmMsS0FGdEIsQ0FERixlQUtFLGdDQUFDLFdBQUQsUUFDR2xELEtBQUssQ0FBQ21DLEtBQU4sQ0FBWWdCLFlBQVosZ0JBQTJCLGdDQUFDLFFBQUQsRUFBY25ELEtBQWQsQ0FBM0IsZ0JBQXFELGdDQUFDLFNBQUQsRUFBZUEsS0FBZixDQUR4RCxDQUxGLENBREY7QUFXRCxHQWxCRDs7QUFvQkFpRCxFQUFBQSxjQUFjLENBQUNHLFNBQWYsR0FBMkI7QUFDekJoQyxJQUFBQSxNQUFNLEVBQUVpQyxzQkFBVUMsT0FBVixDQUFrQkQsc0JBQVVFLEdBQTVCLENBRGlCO0FBRXpCcEMsSUFBQUEsWUFBWSxFQUFFa0Msc0JBQVVDLE9BQVYsQ0FBa0JELHNCQUFVRSxHQUE1QixDQUZXO0FBR3pCcEIsSUFBQUEsS0FBSyxFQUFFa0Isc0JBQVVHLE1BSFE7QUFJekJuQyxJQUFBQSxJQUFJLEVBQUVnQyxzQkFBVUksU0FBVixDQUFvQixDQUFDSixzQkFBVUMsT0FBVixDQUFrQkQsc0JBQVVFLEdBQTVCLENBQUQsRUFBbUNGLHNCQUFVRyxNQUE3QyxDQUFwQjtBQUptQixHQUEzQjtBQU1BLFNBQU9QLGNBQVA7QUFDRCxDQTVCRDs7ZUE4QmVELHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtDZW50ZXJGbGV4Ym94fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0xheWVyc30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7bm90TnVsbG9yVW5kZWZpbmVkfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcbmltcG9ydCB7Z2V0VG9vbHRpcERpc3BsYXlWYWx1ZSwgZ2V0VG9vbHRpcERpc3BsYXlEZWx0YVZhbHVlfSBmcm9tICd1dGlscy9pbnRlcmFjdGlvbi11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRMYXllck5hbWUgPSBzdHlsZWQoQ2VudGVyRmxleGJveClgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBsZXR0ZXItc3BhY2luZzogMC40M3B4O1xuICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcblxuICBzdmcge1xuICAgIG1hcmdpbi1yaWdodDogNHB4O1xuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRUYWJsZSA9IHN0eWxlZC50YWJsZWBcbiAgJiAucm93X19kZWx0YS12YWx1ZSB7XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG5cbiAgICAmLnBvc2l0aXZlIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2R9O1xuICAgIH1cblxuICAgICYubmVnYXRpdmUge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubmVnYXRpdmVCdG5BY3RCZ2R9O1xuICAgIH1cbiAgfVxuYDtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vbGF5ZXItaG92ZXItaW5mbycpLlJvd0NvbXBvbmVudH0gKi9cbmNvbnN0IFJvdyA9ICh7bmFtZSwgdmFsdWUsIGRlbHRhVmFsdWUsIHVybH0pID0+IHtcbiAgLy8gU2V0ICd1cmwnIHRvICd2YWx1ZScgaWYgaXQgbG9va3MgbGlrZSBhIHVybFxuICBpZiAoIXVybCAmJiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLm1hdGNoKC9eaHR0cC8pKSB7XG4gICAgdXJsID0gdmFsdWU7XG4gIH1cblxuICBjb25zdCBhc0ltZyA9IC88aW1nPi8udGVzdChuYW1lKTtcbiAgcmV0dXJuIChcbiAgICA8dHIgY2xhc3NOYW1lPVwicm93XCIga2V5PXtuYW1lfT5cbiAgICAgIDx0ZCBjbGFzc05hbWU9XCJyb3dfX25hbWVcIj57bmFtZX08L3RkPlxuICAgICAgPHRkIGNsYXNzTmFtZT1cInJvd19fdmFsdWVcIj5cbiAgICAgICAge2FzSW1nID8gKFxuICAgICAgICAgIDxpbWcgc3JjPXt2YWx1ZX0gLz5cbiAgICAgICAgKSA6IHVybCA/IChcbiAgICAgICAgICA8YSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCIgaHJlZj17dXJsfT5cbiAgICAgICAgICAgIHt2YWx1ZX1cbiAgICAgICAgICA8L2E+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgKX1cbiAgICAgIDwvdGQ+XG4gICAgICB7bm90TnVsbG9yVW5kZWZpbmVkKGRlbHRhVmFsdWUpICYmIChcbiAgICAgICAgPHRkXG4gICAgICAgICAgY2xhc3NOYW1lPXtgcm93X19kZWx0YS12YWx1ZSAke1xuICAgICAgICAgICAgZGVsdGFWYWx1ZS50b1N0cmluZygpLmNoYXJBdCgwKSA9PT0gJysnID8gJ3Bvc2l0aXZlJyA6ICduZWdhdGl2ZSdcbiAgICAgICAgICB9YH1cbiAgICAgICAgPlxuICAgICAgICAgIHtkZWx0YVZhbHVlfVxuICAgICAgICA8L3RkPlxuICAgICAgKX1cbiAgICA8L3RyPlxuICApO1xufTtcblxuY29uc3QgRW50cnlJbmZvID0gKHtmaWVsZHNUb1Nob3csIGZpZWxkcywgZGF0YSwgcHJpbWFyeURhdGEsIGNvbXBhcmVUeXBlfSkgPT4gKFxuICA8dGJvZHk+XG4gICAge2ZpZWxkc1RvU2hvdy5tYXAoaXRlbSA9PiAoXG4gICAgICA8RW50cnlJbmZvUm93XG4gICAgICAgIGtleT17aXRlbS5uYW1lfVxuICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgcHJpbWFyeURhdGE9e3ByaW1hcnlEYXRhfVxuICAgICAgICBjb21wYXJlVHlwZT17Y29tcGFyZVR5cGV9XG4gICAgICAvPlxuICAgICkpfVxuICA8L3Rib2R5PlxuKTtcblxuY29uc3QgRW50cnlJbmZvUm93ID0gKHtpdGVtLCBmaWVsZHMsIGRhdGEsIHByaW1hcnlEYXRhLCBjb21wYXJlVHlwZX0pID0+IHtcbiAgY29uc3QgZmllbGRJZHggPSBmaWVsZHMuZmluZEluZGV4KGYgPT4gZi5uYW1lID09PSBpdGVtLm5hbWUpO1xuICBpZiAoZmllbGRJZHggPCAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZmllbGQgPSBmaWVsZHNbZmllbGRJZHhdO1xuICBjb25zdCBkaXNwbGF5VmFsdWUgPSBnZXRUb29sdGlwRGlzcGxheVZhbHVlKHtpdGVtLCBmaWVsZCwgZGF0YSwgZmllbGRJZHh9KTtcblxuICBjb25zdCBkaXNwbGF5RGVsdGFWYWx1ZSA9IGdldFRvb2x0aXBEaXNwbGF5RGVsdGFWYWx1ZSh7XG4gICAgaXRlbSxcbiAgICBmaWVsZCxcbiAgICBkYXRhLFxuICAgIGZpZWxkSWR4LFxuICAgIHByaW1hcnlEYXRhLFxuICAgIGNvbXBhcmVUeXBlXG4gIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPFJvd1xuICAgICAgbmFtZT17ZmllbGQuZGlzcGxheU5hbWUgfHwgZmllbGQubmFtZX1cbiAgICAgIHZhbHVlPXtkaXNwbGF5VmFsdWV9XG4gICAgICBkZWx0YVZhbHVlPXtkaXNwbGF5RGVsdGFWYWx1ZX1cbiAgICAvPlxuICApO1xufTtcblxuLy8gVE9ETzogc3VwcG9ydGluZyBjb21wYXJhdGl2ZSB2YWx1ZSBmb3IgYWdncmVnYXRlZCBjZWxscyBhcyB3ZWxsXG5jb25zdCBDZWxsSW5mbyA9ICh7ZGF0YSwgbGF5ZXJ9KSA9PiB7XG4gIGNvbnN0IHtjb2xvckZpZWxkLCBzaXplRmllbGR9ID0gbGF5ZXIuY29uZmlnO1xuXG4gIHJldHVybiAoXG4gICAgPHRib2R5PlxuICAgICAgPFJvdyBuYW1lPXsndG90YWwgcG9pbnRzJ30ga2V5PVwiY291bnRcIiB2YWx1ZT17ZGF0YS5wb2ludHMgJiYgZGF0YS5wb2ludHMubGVuZ3RofSAvPlxuICAgICAge2NvbG9yRmllbGQgJiYgbGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3IgPyAoXG4gICAgICAgIDxSb3dcbiAgICAgICAgICBuYW1lPXtsYXllci5nZXRWaXN1YWxDaGFubmVsRGVzY3JpcHRpb24oJ2NvbG9yJykubWVhc3VyZX1cbiAgICAgICAgICBrZXk9XCJjb2xvclwiXG4gICAgICAgICAgdmFsdWU9e2RhdGEuY29sb3JWYWx1ZSB8fCAnTi9BJ31cbiAgICAgICAgLz5cbiAgICAgICkgOiBudWxsfVxuICAgICAge3NpemVGaWVsZCAmJiBsYXllci52aXN1YWxDaGFubmVscy5zaXplID8gKFxuICAgICAgICA8Um93XG4gICAgICAgICAgbmFtZT17bGF5ZXIuZ2V0VmlzdWFsQ2hhbm5lbERlc2NyaXB0aW9uKCdzaXplJykubWVhc3VyZX1cbiAgICAgICAgICBrZXk9XCJzaXplXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5lbGV2YXRpb25WYWx1ZSB8fCAnTi9BJ31cbiAgICAgICAgLz5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvdGJvZHk+XG4gICk7XG59O1xuXG5jb25zdCBMYXllckhvdmVySW5mb0ZhY3RvcnkgPSAoKSA9PiB7XG4gIGNvbnN0IExheWVySG92ZXJJbmZvID0gcHJvcHMgPT4ge1xuICAgIGNvbnN0IHtkYXRhLCBsYXllcn0gPSBwcm9wcztcblxuICAgIGlmICghZGF0YSB8fCAhbGF5ZXIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC1wb3BvdmVyX19sYXllci1pbmZvXCI+XG4gICAgICAgIDxTdHlsZWRMYXllck5hbWUgY2xhc3NOYW1lPVwibWFwLXBvcG92ZXJfX2xheWVyLW5hbWVcIj5cbiAgICAgICAgICA8TGF5ZXJzIGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICAgIHtwcm9wcy5sYXllci5jb25maWcubGFiZWx9XG4gICAgICAgIDwvU3R5bGVkTGF5ZXJOYW1lPlxuICAgICAgICA8U3R5bGVkVGFibGU+XG4gICAgICAgICAge3Byb3BzLmxheWVyLmlzQWdncmVnYXRlZCA/IDxDZWxsSW5mbyB7Li4ucHJvcHN9IC8+IDogPEVudHJ5SW5mbyB7Li4ucHJvcHN9IC8+fVxuICAgICAgICA8L1N0eWxlZFRhYmxlPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICBMYXllckhvdmVySW5mby5wcm9wVHlwZXMgPSB7XG4gICAgZmllbGRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KSxcbiAgICBmaWVsZHNUb1Nob3c6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLFxuICAgIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGRhdGE6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLCBQcm9wVHlwZXMub2JqZWN0XSlcbiAgfTtcbiAgcmV0dXJuIExheWVySG92ZXJJbmZvO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTGF5ZXJIb3ZlckluZm9GYWN0b3J5O1xuIl19