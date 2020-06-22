"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.DragHandle = exports.defaultProps = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactSortableHoc = require("react-sortable-hoc");

var _panelHeaderAction = _interopRequireDefault(require("../panel-header-action"));

var _icons = require("../../common/icons");

var _styledComponents2 = require("../../common/styled-components");

var _reactIntl = require("react-intl");

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  opacity: 0;\n  z-index: 1000;\n\n  :hover {\n    cursor: move;\n    opacity: 1;\n    color: ", ";\n  }\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: 4px;\n\n  .layer__title__type {\n    color: ", ";\n    font-size: 10px;\n    line-height: 12px;\n    letter-spacing: 0.37px;\n    text-transform: capitalize;\n  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  color: ", ";\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .layer__remove-layer {\n    opacity: 0;\n  }\n  :hover {\n    cursor: pointer;\n    background-color: ", ";\n\n    .layer__drag-handle {\n      opacity: 1;\n    }\n\n    .layer__remove-layer {\n      opacity: 1;\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var propTypes = {
  // required
  layerId: _propTypes["default"].string.isRequired,
  isVisible: _propTypes["default"].bool.isRequired,
  onToggleVisibility: _propTypes["default"].func.isRequired,
  onUpdateLayerLabel: _propTypes["default"].func.isRequired,
  onToggleEnableConfig: _propTypes["default"].func.isRequired,
  onRemoveLayer: _propTypes["default"].func.isRequired,
  isConfigActive: _propTypes["default"].bool.isRequired,
  // optional
  showRemoveLayer: _propTypes["default"].bool,
  label: _propTypes["default"].string,
  layerType: _propTypes["default"].string,
  isDragNDropEnabled: _propTypes["default"].bool,
  labelRCGColorValues: _propTypes["default"].arrayOf(_propTypes["default"].number)
};
var defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true
};
exports.defaultProps = defaultProps;
var StyledLayerPanelHeader = (0, _styledComponents["default"])(_styledComponents2.StyledPanelHeader)(_templateObject(), function (props) {
  return props.theme.panelBackgroundHover;
});

var HeaderLabelSection = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.textColor;
});

var HeaderActionSection = _styledComponents["default"].div(_templateObject3());

var LayerTitleSection = _styledComponents["default"].div(_templateObject4(), function (props) {
  return props.theme.subtextColor;
});

var StyledDragHandle = _styledComponents["default"].div(_templateObject5(), function (props) {
  return props.theme.textColorHl;
});

var DragHandle = (0, _reactSortableHoc.sortableHandle)(function (_ref) {
  var className = _ref.className,
      children = _ref.children;
  return _react["default"].createElement(StyledDragHandle, {
    className: className
  }, children);
});
exports.DragHandle = DragHandle;

var LayerLabelEditor = function LayerLabelEditor(_ref2) {
  var layerId = _ref2.layerId,
      label = _ref2.label,
      onEdit = _ref2.onEdit;
  return _react["default"].createElement(_styledComponents2.InlineInput, {
    type: "text",
    className: "layer__title__editor",
    value: label,
    onClick: function onClick(e) {
      e.stopPropagation();
    },
    onChange: onEdit,
    id: "".concat(layerId, ":input-layer-label")
  });
};

function LayerPanelHeaderFactory() {
  var LayerPanelHeader = function LayerPanelHeader(_ref3) {
    var isConfigActive = _ref3.isConfigActive,
        isDragNDropEnabled = _ref3.isDragNDropEnabled,
        isVisible = _ref3.isVisible,
        label = _ref3.label,
        layerId = _ref3.layerId,
        layerType = _ref3.layerType,
        labelRCGColorValues = _ref3.labelRCGColorValues,
        onToggleVisibility = _ref3.onToggleVisibility,
        onUpdateLayerLabel = _ref3.onUpdateLayerLabel,
        onToggleEnableConfig = _ref3.onToggleEnableConfig,
        onRemoveLayer = _ref3.onRemoveLayer,
        showRemoveLayer = _ref3.showRemoveLayer;
    return _react["default"].createElement(StyledLayerPanelHeader, {
      className: (0, _classnames["default"])('layer-panel__header', {
        'sort--handle': !isConfigActive
      }),
      active: isConfigActive,
      labelRCGColorValues: labelRCGColorValues,
      onClick: onToggleEnableConfig
    }, _react["default"].createElement(HeaderLabelSection, {
      className: "layer-panel__header__content"
    }, isDragNDropEnabled && _react["default"].createElement(DragHandle, {
      className: "layer__drag-handle"
    }, _react["default"].createElement(_icons.VertDots, {
      height: "20px"
    })), _react["default"].createElement(LayerTitleSection, {
      className: "layer__title"
    }, _react["default"].createElement("div", null, _react["default"].createElement(LayerLabelEditor, {
      layerId: layerId,
      label: label,
      onEdit: onUpdateLayerLabel
    }), _react["default"].createElement("div", {
      className: "layer__title__type"
    }, layerType && _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: "layer.type.".concat(layerType.toLowerCase())
    }))))), _react["default"].createElement(HeaderActionSection, {
      className: "layer-panel__header__actions"
    }, showRemoveLayer ? _react["default"].createElement(_panelHeaderAction["default"], {
      className: "layer__remove-layer",
      id: layerId,
      tooltip: 'tooltip.removeLayer',
      onClick: onRemoveLayer,
      tooltipType: "error",
      IconComponent: _icons.Trash
    }) : null, _react["default"].createElement(_panelHeaderAction["default"], {
      className: "layer__visibility-toggle",
      id: layerId,
      tooltip: isVisible ? 'tooltip.hideLayer' : 'tooltip.showLayer',
      onClick: onToggleVisibility,
      IconComponent: isVisible ? _icons.EyeSeen : _icons.EyeUnseen
    }), _react["default"].createElement(_panelHeaderAction["default"], {
      className: "layer__enable-config",
      id: layerId,
      tooltip: 'tooltip.layerSettings',
      onClick: onToggleEnableConfig,
      IconComponent: _icons.ArrowDown
    })));
  };

  LayerPanelHeader.propTypes = propTypes;
  LayerPanelHeader.defaultProps = defaultProps;
  return LayerPanelHeader;
}

var _default = LayerPanelHeaderFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwtaGVhZGVyLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsImxheWVySWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiaXNWaXNpYmxlIiwiYm9vbCIsIm9uVG9nZ2xlVmlzaWJpbGl0eSIsImZ1bmMiLCJvblVwZGF0ZUxheWVyTGFiZWwiLCJvblRvZ2dsZUVuYWJsZUNvbmZpZyIsIm9uUmVtb3ZlTGF5ZXIiLCJpc0NvbmZpZ0FjdGl2ZSIsInNob3dSZW1vdmVMYXllciIsImxhYmVsIiwibGF5ZXJUeXBlIiwiaXNEcmFnTkRyb3BFbmFibGVkIiwibGFiZWxSQ0dDb2xvclZhbHVlcyIsImFycmF5T2YiLCJudW1iZXIiLCJkZWZhdWx0UHJvcHMiLCJTdHlsZWRMYXllclBhbmVsSGVhZGVyIiwiU3R5bGVkUGFuZWxIZWFkZXIiLCJwcm9wcyIsInRoZW1lIiwicGFuZWxCYWNrZ3JvdW5kSG92ZXIiLCJIZWFkZXJMYWJlbFNlY3Rpb24iLCJzdHlsZWQiLCJkaXYiLCJ0ZXh0Q29sb3IiLCJIZWFkZXJBY3Rpb25TZWN0aW9uIiwiTGF5ZXJUaXRsZVNlY3Rpb24iLCJzdWJ0ZXh0Q29sb3IiLCJTdHlsZWREcmFnSGFuZGxlIiwidGV4dENvbG9ySGwiLCJEcmFnSGFuZGxlIiwiY2xhc3NOYW1lIiwiY2hpbGRyZW4iLCJMYXllckxhYmVsRWRpdG9yIiwib25FZGl0IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIkxheWVyUGFuZWxIZWFkZXJGYWN0b3J5IiwiTGF5ZXJQYW5lbEhlYWRlciIsInRvTG93ZXJDYXNlIiwiVHJhc2giLCJFeWVTZWVuIiwiRXllVW5zZWVuIiwiQXJyb3dEb3duIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVMsR0FBRztBQUNoQjtBQUNBQyxFQUFBQSxPQUFPLEVBQUVDLHNCQUFVQyxNQUFWLENBQWlCQyxVQUZWO0FBR2hCQyxFQUFBQSxTQUFTLEVBQUVILHNCQUFVSSxJQUFWLENBQWVGLFVBSFY7QUFJaEJHLEVBQUFBLGtCQUFrQixFQUFFTCxzQkFBVU0sSUFBVixDQUFlSixVQUpuQjtBQUtoQkssRUFBQUEsa0JBQWtCLEVBQUVQLHNCQUFVTSxJQUFWLENBQWVKLFVBTG5CO0FBTWhCTSxFQUFBQSxvQkFBb0IsRUFBRVIsc0JBQVVNLElBQVYsQ0FBZUosVUFOckI7QUFPaEJPLEVBQUFBLGFBQWEsRUFBRVQsc0JBQVVNLElBQVYsQ0FBZUosVUFQZDtBQVFoQlEsRUFBQUEsY0FBYyxFQUFFVixzQkFBVUksSUFBVixDQUFlRixVQVJmO0FBVWhCO0FBQ0FTLEVBQUFBLGVBQWUsRUFBRVgsc0JBQVVJLElBWFg7QUFZaEJRLEVBQUFBLEtBQUssRUFBRVosc0JBQVVDLE1BWkQ7QUFhaEJZLEVBQUFBLFNBQVMsRUFBRWIsc0JBQVVDLE1BYkw7QUFjaEJhLEVBQUFBLGtCQUFrQixFQUFFZCxzQkFBVUksSUFkZDtBQWVoQlcsRUFBQUEsbUJBQW1CLEVBQUVmLHNCQUFVZ0IsT0FBVixDQUFrQmhCLHNCQUFVaUIsTUFBNUI7QUFmTCxDQUFsQjtBQWtCTyxJQUFNQyxZQUFZLEdBQUc7QUFDMUJKLEVBQUFBLGtCQUFrQixFQUFFLElBRE07QUFFMUJILEVBQUFBLGVBQWUsRUFBRTtBQUZTLENBQXJCOztBQUtQLElBQU1RLHNCQUFzQixHQUFHLGtDQUFPQyxvQ0FBUCxDQUFILG9CQU1KLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsb0JBQWhCO0FBQUEsQ0FORCxDQUE1Qjs7QUFrQkEsSUFBTUMsa0JBQWtCLEdBQUdDLDZCQUFPQyxHQUFWLHFCQUViLFVBQUFMLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUssU0FBaEI7QUFBQSxDQUZRLENBQXhCOztBQUtBLElBQU1DLG1CQUFtQixHQUFHSCw2QkFBT0MsR0FBVixvQkFBekI7O0FBSUEsSUFBTUcsaUJBQWlCLEdBQUdKLDZCQUFPQyxHQUFWLHFCQUlWLFVBQUFMLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWVEsWUFBaEI7QUFBQSxDQUpLLENBQXZCOztBQVlBLElBQU1DLGdCQUFnQixHQUFHTiw2QkFBT0MsR0FBVixxQkFTVCxVQUFBTCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlVLFdBQWhCO0FBQUEsQ0FUSSxDQUF0Qjs7QUFhTyxJQUFNQyxVQUFVLEdBQUcsc0NBQWU7QUFBQSxNQUFFQyxTQUFGLFFBQUVBLFNBQUY7QUFBQSxNQUFhQyxRQUFiLFFBQWFBLFFBQWI7QUFBQSxTQUN2QyxnQ0FBQyxnQkFBRDtBQUFrQixJQUFBLFNBQVMsRUFBRUQ7QUFBN0IsS0FBeUNDLFFBQXpDLENBRHVDO0FBQUEsQ0FBZixDQUFuQjs7O0FBSVAsSUFBTUMsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQUVyQyxPQUFGLFNBQUVBLE9BQUY7QUFBQSxNQUFXYSxLQUFYLFNBQVdBLEtBQVg7QUFBQSxNQUFrQnlCLE1BQWxCLFNBQWtCQSxNQUFsQjtBQUFBLFNBQ3ZCLGdDQUFDLDhCQUFEO0FBQ0UsSUFBQSxJQUFJLEVBQUMsTUFEUDtBQUVFLElBQUEsU0FBUyxFQUFDLHNCQUZaO0FBR0UsSUFBQSxLQUFLLEVBQUV6QixLQUhUO0FBSUUsSUFBQSxPQUFPLEVBQUUsaUJBQUEwQixDQUFDLEVBQUk7QUFDWkEsTUFBQUEsQ0FBQyxDQUFDQyxlQUFGO0FBQ0QsS0FOSDtBQU9FLElBQUEsUUFBUSxFQUFFRixNQVBaO0FBUUUsSUFBQSxFQUFFLFlBQUt0QyxPQUFMO0FBUkosSUFEdUI7QUFBQSxDQUF6Qjs7QUFhQSxTQUFTeUMsdUJBQVQsR0FBbUM7QUFDakMsTUFBTUMsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQjtBQUFBLFFBQ3ZCL0IsY0FEdUIsU0FDdkJBLGNBRHVCO0FBQUEsUUFFdkJJLGtCQUZ1QixTQUV2QkEsa0JBRnVCO0FBQUEsUUFHdkJYLFNBSHVCLFNBR3ZCQSxTQUh1QjtBQUFBLFFBSXZCUyxLQUp1QixTQUl2QkEsS0FKdUI7QUFBQSxRQUt2QmIsT0FMdUIsU0FLdkJBLE9BTHVCO0FBQUEsUUFNdkJjLFNBTnVCLFNBTXZCQSxTQU51QjtBQUFBLFFBT3ZCRSxtQkFQdUIsU0FPdkJBLG1CQVB1QjtBQUFBLFFBUXZCVixrQkFSdUIsU0FRdkJBLGtCQVJ1QjtBQUFBLFFBU3ZCRSxrQkFUdUIsU0FTdkJBLGtCQVR1QjtBQUFBLFFBVXZCQyxvQkFWdUIsU0FVdkJBLG9CQVZ1QjtBQUFBLFFBV3ZCQyxhQVh1QixTQVd2QkEsYUFYdUI7QUFBQSxRQVl2QkUsZUFadUIsU0FZdkJBLGVBWnVCO0FBQUEsV0FjdkIsZ0NBQUMsc0JBQUQ7QUFDRSxNQUFBLFNBQVMsRUFBRSw0QkFBVyxxQkFBWCxFQUFrQztBQUMzQyx3QkFBZ0IsQ0FBQ0Q7QUFEMEIsT0FBbEMsQ0FEYjtBQUlFLE1BQUEsTUFBTSxFQUFFQSxjQUpWO0FBS0UsTUFBQSxtQkFBbUIsRUFBRUssbUJBTHZCO0FBTUUsTUFBQSxPQUFPLEVBQUVQO0FBTlgsT0FRRSxnQ0FBQyxrQkFBRDtBQUFvQixNQUFBLFNBQVMsRUFBQztBQUE5QixPQUNHTSxrQkFBa0IsSUFDakIsZ0NBQUMsVUFBRDtBQUFZLE1BQUEsU0FBUyxFQUFDO0FBQXRCLE9BQ0UsZ0NBQUMsZUFBRDtBQUFVLE1BQUEsTUFBTSxFQUFDO0FBQWpCLE1BREYsQ0FGSixFQU1FLGdDQUFDLGlCQUFEO0FBQW1CLE1BQUEsU0FBUyxFQUFDO0FBQTdCLE9BQ0UsNkNBQ0UsZ0NBQUMsZ0JBQUQ7QUFBa0IsTUFBQSxPQUFPLEVBQUVmLE9BQTNCO0FBQW9DLE1BQUEsS0FBSyxFQUFFYSxLQUEzQztBQUFrRCxNQUFBLE1BQU0sRUFBRUw7QUFBMUQsTUFERixFQUVFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHTSxTQUFTLElBQUksZ0NBQUMsMkJBQUQ7QUFBa0IsTUFBQSxFQUFFLHVCQUFnQkEsU0FBUyxDQUFDNkIsV0FBVixFQUFoQjtBQUFwQixNQURoQixDQUZGLENBREYsQ0FORixDQVJGLEVBdUJFLGdDQUFDLG1CQUFEO0FBQXFCLE1BQUEsU0FBUyxFQUFDO0FBQS9CLE9BQ0cvQixlQUFlLEdBQ2QsZ0NBQUMsNkJBQUQ7QUFDRSxNQUFBLFNBQVMsRUFBQyxxQkFEWjtBQUVFLE1BQUEsRUFBRSxFQUFFWixPQUZOO0FBR0UsTUFBQSxPQUFPLEVBQUUscUJBSFg7QUFJRSxNQUFBLE9BQU8sRUFBRVUsYUFKWDtBQUtFLE1BQUEsV0FBVyxFQUFDLE9BTGQ7QUFNRSxNQUFBLGFBQWEsRUFBRWtDO0FBTmpCLE1BRGMsR0FTWixJQVZOLEVBV0UsZ0NBQUMsNkJBQUQ7QUFDRSxNQUFBLFNBQVMsRUFBQywwQkFEWjtBQUVFLE1BQUEsRUFBRSxFQUFFNUMsT0FGTjtBQUdFLE1BQUEsT0FBTyxFQUFFSSxTQUFTLEdBQUcsbUJBQUgsR0FBeUIsbUJBSDdDO0FBSUUsTUFBQSxPQUFPLEVBQUVFLGtCQUpYO0FBS0UsTUFBQSxhQUFhLEVBQUVGLFNBQVMsR0FBR3lDLGNBQUgsR0FBYUM7QUFMdkMsTUFYRixFQWtCRSxnQ0FBQyw2QkFBRDtBQUNFLE1BQUEsU0FBUyxFQUFDLHNCQURaO0FBRUUsTUFBQSxFQUFFLEVBQUU5QyxPQUZOO0FBR0UsTUFBQSxPQUFPLEVBQUUsdUJBSFg7QUFJRSxNQUFBLE9BQU8sRUFBRVMsb0JBSlg7QUFLRSxNQUFBLGFBQWEsRUFBRXNDO0FBTGpCLE1BbEJGLENBdkJGLENBZHVCO0FBQUEsR0FBekI7O0FBa0VBTCxFQUFBQSxnQkFBZ0IsQ0FBQzNDLFNBQWpCLEdBQTZCQSxTQUE3QjtBQUNBMkMsRUFBQUEsZ0JBQWdCLENBQUN2QixZQUFqQixHQUFnQ0EsWUFBaEM7QUFFQSxTQUFPdUIsZ0JBQVA7QUFDRDs7ZUFFY0QsdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge3NvcnRhYmxlSGFuZGxlfSBmcm9tICdyZWFjdC1zb3J0YWJsZS1ob2MnO1xuaW1wb3J0IFBhbmVsSGVhZGVyQWN0aW9uIGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9wYW5lbC1oZWFkZXItYWN0aW9uJztcbmltcG9ydCB7QXJyb3dEb3duLCBFeWVTZWVuLCBFeWVVbnNlZW4sIFRyYXNoLCBWZXJ0RG90c30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5pbXBvcnQge0lubGluZUlucHV0LCBTdHlsZWRQYW5lbEhlYWRlcn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICAvLyByZXF1aXJlZFxuICBsYXllcklkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGlzVmlzaWJsZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgb25Ub2dnbGVWaXNpYmlsaXR5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvblVwZGF0ZUxheWVyTGFiZWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uVG9nZ2xlRW5hYmxlQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvblJlbW92ZUxheWVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBpc0NvbmZpZ0FjdGl2ZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcblxuICAvLyBvcHRpb25hbFxuICBzaG93UmVtb3ZlTGF5ZXI6IFByb3BUeXBlcy5ib29sLFxuICBsYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbGF5ZXJUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpc0RyYWdORHJvcEVuYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBsYWJlbFJDR0NvbG9yVmFsdWVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKVxufTtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgaXNEcmFnTkRyb3BFbmFibGVkOiB0cnVlLFxuICBzaG93UmVtb3ZlTGF5ZXI6IHRydWVcbn07XG5cbmNvbnN0IFN0eWxlZExheWVyUGFuZWxIZWFkZXIgPSBzdHlsZWQoU3R5bGVkUGFuZWxIZWFkZXIpYFxuICAubGF5ZXJfX3JlbW92ZS1sYXllciB7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyfTtcblxuICAgIC5sYXllcl9fZHJhZy1oYW5kbGUge1xuICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG5cbiAgICAubGF5ZXJfX3JlbW92ZS1sYXllciB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgSGVhZGVyTGFiZWxTZWN0aW9uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbmA7XG5cbmNvbnN0IEhlYWRlckFjdGlvblNlY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuYDtcblxuY29uc3QgTGF5ZXJUaXRsZVNlY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tbGVmdDogNHB4O1xuXG4gIC5sYXllcl9fdGl0bGVfX3R5cGUge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcn07XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxMnB4O1xuICAgIGxldHRlci1zcGFjaW5nOiAwLjM3cHg7XG4gICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZERyYWdIYW5kbGUgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBvcGFjaXR5OiAwO1xuICB6LWluZGV4OiAxMDAwO1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBtb3ZlO1xuICAgIG9wYWNpdHk6IDE7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgRHJhZ0hhbmRsZSA9IHNvcnRhYmxlSGFuZGxlKCh7Y2xhc3NOYW1lLCBjaGlsZHJlbn0pID0+IChcbiAgPFN0eWxlZERyYWdIYW5kbGUgY2xhc3NOYW1lPXtjbGFzc05hbWV9PntjaGlsZHJlbn08L1N0eWxlZERyYWdIYW5kbGU+XG4pKTtcblxuY29uc3QgTGF5ZXJMYWJlbEVkaXRvciA9ICh7bGF5ZXJJZCwgbGFiZWwsIG9uRWRpdH0pID0+IChcbiAgPElubGluZUlucHV0XG4gICAgdHlwZT1cInRleHRcIlxuICAgIGNsYXNzTmFtZT1cImxheWVyX190aXRsZV9fZWRpdG9yXCJcbiAgICB2YWx1ZT17bGFiZWx9XG4gICAgb25DbGljaz17ZSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH19XG4gICAgb25DaGFuZ2U9e29uRWRpdH1cbiAgICBpZD17YCR7bGF5ZXJJZH06aW5wdXQtbGF5ZXItbGFiZWxgfVxuICAvPlxuKTtcblxuZnVuY3Rpb24gTGF5ZXJQYW5lbEhlYWRlckZhY3RvcnkoKSB7XG4gIGNvbnN0IExheWVyUGFuZWxIZWFkZXIgPSAoe1xuICAgIGlzQ29uZmlnQWN0aXZlLFxuICAgIGlzRHJhZ05Ecm9wRW5hYmxlZCxcbiAgICBpc1Zpc2libGUsXG4gICAgbGFiZWwsXG4gICAgbGF5ZXJJZCxcbiAgICBsYXllclR5cGUsXG4gICAgbGFiZWxSQ0dDb2xvclZhbHVlcyxcbiAgICBvblRvZ2dsZVZpc2liaWxpdHksXG4gICAgb25VcGRhdGVMYXllckxhYmVsLFxuICAgIG9uVG9nZ2xlRW5hYmxlQ29uZmlnLFxuICAgIG9uUmVtb3ZlTGF5ZXIsXG4gICAgc2hvd1JlbW92ZUxheWVyXG4gIH0pID0+IChcbiAgICA8U3R5bGVkTGF5ZXJQYW5lbEhlYWRlclxuICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdsYXllci1wYW5lbF9faGVhZGVyJywge1xuICAgICAgICAnc29ydC0taGFuZGxlJzogIWlzQ29uZmlnQWN0aXZlXG4gICAgICB9KX1cbiAgICAgIGFjdGl2ZT17aXNDb25maWdBY3RpdmV9XG4gICAgICBsYWJlbFJDR0NvbG9yVmFsdWVzPXtsYWJlbFJDR0NvbG9yVmFsdWVzfVxuICAgICAgb25DbGljaz17b25Ub2dnbGVFbmFibGVDb25maWd9XG4gICAgPlxuICAgICAgPEhlYWRlckxhYmVsU2VjdGlvbiBjbGFzc05hbWU9XCJsYXllci1wYW5lbF9faGVhZGVyX19jb250ZW50XCI+XG4gICAgICAgIHtpc0RyYWdORHJvcEVuYWJsZWQgJiYgKFxuICAgICAgICAgIDxEcmFnSGFuZGxlIGNsYXNzTmFtZT1cImxheWVyX19kcmFnLWhhbmRsZVwiPlxuICAgICAgICAgICAgPFZlcnREb3RzIGhlaWdodD1cIjIwcHhcIiAvPlxuICAgICAgICAgIDwvRHJhZ0hhbmRsZT5cbiAgICAgICAgKX1cbiAgICAgICAgPExheWVyVGl0bGVTZWN0aW9uIGNsYXNzTmFtZT1cImxheWVyX190aXRsZVwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TGF5ZXJMYWJlbEVkaXRvciBsYXllcklkPXtsYXllcklkfSBsYWJlbD17bGFiZWx9IG9uRWRpdD17b25VcGRhdGVMYXllckxhYmVsfSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXllcl9fdGl0bGVfX3R5cGVcIj5cbiAgICAgICAgICAgICAge2xheWVyVHlwZSAmJiA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17YGxheWVyLnR5cGUuJHtsYXllclR5cGUudG9Mb3dlckNhc2UoKX1gfSAvPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0xheWVyVGl0bGVTZWN0aW9uPlxuICAgICAgPC9IZWFkZXJMYWJlbFNlY3Rpb24+XG4gICAgICA8SGVhZGVyQWN0aW9uU2VjdGlvbiBjbGFzc05hbWU9XCJsYXllci1wYW5lbF9faGVhZGVyX19hY3Rpb25zXCI+XG4gICAgICAgIHtzaG93UmVtb3ZlTGF5ZXIgPyAoXG4gICAgICAgICAgPFBhbmVsSGVhZGVyQWN0aW9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJsYXllcl9fcmVtb3ZlLWxheWVyXCJcbiAgICAgICAgICAgIGlkPXtsYXllcklkfVxuICAgICAgICAgICAgdG9vbHRpcD17J3Rvb2x0aXAucmVtb3ZlTGF5ZXInfVxuICAgICAgICAgICAgb25DbGljaz17b25SZW1vdmVMYXllcn1cbiAgICAgICAgICAgIHRvb2x0aXBUeXBlPVwiZXJyb3JcIlxuICAgICAgICAgICAgSWNvbkNvbXBvbmVudD17VHJhc2h9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImxheWVyX192aXNpYmlsaXR5LXRvZ2dsZVwiXG4gICAgICAgICAgaWQ9e2xheWVySWR9XG4gICAgICAgICAgdG9vbHRpcD17aXNWaXNpYmxlID8gJ3Rvb2x0aXAuaGlkZUxheWVyJyA6ICd0b29sdGlwLnNob3dMYXllcid9XG4gICAgICAgICAgb25DbGljaz17b25Ub2dnbGVWaXNpYmlsaXR5fVxuICAgICAgICAgIEljb25Db21wb25lbnQ9e2lzVmlzaWJsZSA/IEV5ZVNlZW4gOiBFeWVVbnNlZW59XG4gICAgICAgIC8+XG4gICAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImxheWVyX19lbmFibGUtY29uZmlnXCJcbiAgICAgICAgICBpZD17bGF5ZXJJZH1cbiAgICAgICAgICB0b29sdGlwPXsndG9vbHRpcC5sYXllclNldHRpbmdzJ31cbiAgICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZUVuYWJsZUNvbmZpZ31cbiAgICAgICAgICBJY29uQ29tcG9uZW50PXtBcnJvd0Rvd259XG4gICAgICAgIC8+XG4gICAgICA8L0hlYWRlckFjdGlvblNlY3Rpb24+XG4gICAgPC9TdHlsZWRMYXllclBhbmVsSGVhZGVyPlxuICApO1xuXG4gIExheWVyUGFuZWxIZWFkZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuICBMYXllclBhbmVsSGVhZGVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuICByZXR1cm4gTGF5ZXJQYW5lbEhlYWRlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGF5ZXJQYW5lbEhlYWRlckZhY3Rvcnk7XG4iXX0=