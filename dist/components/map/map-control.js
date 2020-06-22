"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reselect = require("reselect");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents2 = require("../common/styled-components");

var _mapLayerSelector = _interopRequireDefault(require("../common/map-layer-selector"));

var _logo = _interopRequireDefault(require("../common/logo"));

var _mapLegend = _interopRequireDefault(require("./map-legend"));

var _icons = require("../common/icons");

var _verticalToolbar = _interopRequireDefault(require("../common/vertical-toolbar"));

var _toolbarItem = _interopRequireDefault(require("../common/toolbar-item"));

var _defaultSettings = require("../../constants/default-settings");

var _locales = require("../../localization/locales");

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  right: 32px;\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n  background-color: ", ";\n  height: 32px;\n  padding: 6px 12px;\n  font-size: 11px;\n  color: ", ";\n  position: relative;\n\n  button {\n    width: 18px;\n    height: 18px;\n  }\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n  max-height: 500px;\n  min-height: 100px;\n  overflow: auto;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  flex-grow: 1;\n  z-index: 1;\n  p {\n    margin-bottom: 0;\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 4px 0;\n  display: flex;\n  justify-content: flex-end;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  right: 0;\n  width: ", "px;\n  padding: ", "px;\n  z-index: 10;\n  top: ", "px;\n  position: absolute;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledMapControl = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.mapControl.width;
}, function (props) {
  return props.theme.mapControl.padding;
}, function (props) {
  return props.top;
});

var StyledMapControlAction = _styledComponents["default"].div(_templateObject2());

var StyledMapControlPanel = _styledComponents["default"].div(_templateObject3(), function (props) {
  return props.theme.mapPanelBackgroundColor;
});

var StyledMapControlPanelContent = _styledComponents["default"].div(_templateObject4(), function (props) {
  return props.theme.dropdownScrollBar;
});

var StyledMapControlPanelHeader = _styledComponents["default"].div(_templateObject5(), function (props) {
  return props.theme.mapPanelHeaderBackgroundColor;
}, function (props) {
  return props.theme.titleTextColor;
});

var ActionPanel = function ActionPanel(_ref) {
  var className = _ref.className,
      children = _ref.children;
  return _react["default"].createElement(StyledMapControlAction, {
    className: className
  }, children);
};

ActionPanel.displayName = 'ActionPanel';

var MapControlTooltip = _react["default"].memo(function (_ref2) {
  var id = _ref2.id,
      message = _ref2.message;
  return _react["default"].createElement(_styledComponents2.Tooltip, {
    id: id,
    place: "left",
    effect: "solid"
  }, _react["default"].createElement("span", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: message
  })));
});

MapControlTooltip.displayName = 'MapControlTooltip';

var MapLegendTooltip = function MapLegendTooltip(_ref3) {
  var id = _ref3.id,
      message = _ref3.message;
  return _react["default"].createElement(_styledComponents2.Tooltip, {
    id: id,
    place: "left",
    effect: "solid"
  }, _react["default"].createElement("span", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: message
  })));
};

var LayerSelectorPanel = _react["default"].memo(function (_ref4) {
  var items = _ref4.items,
      onMapToggleLayer = _ref4.onMapToggleLayer,
      isActive = _ref4.isActive,
      toggleMenuPanel = _ref4.toggleMenuPanel;
  return !isActive ? _react["default"].createElement(_styledComponents2.MapControlButton, {
    key: 1,
    onClick: function onClick(e) {
      e.preventDefault();
      toggleMenuPanel();
    },
    className: "map-control-button toggle-layer",
    "data-tip": true,
    "data-for": "toggle-layer"
  }, _react["default"].createElement(_icons.Layers, {
    height: "22px"
  }), _react["default"].createElement(MapControlTooltip, {
    id: "toggle-layer",
    message: isActive ? 'tooltip.hideLayerPanel' : 'tooltip.showLayerPanel'
  })) : _react["default"].createElement(MapControlPanel, {
    header: "header.visibleLayers",
    onClick: toggleMenuPanel
  }, _react["default"].createElement(_mapLayerSelector["default"], {
    layers: items,
    onMapToggleLayer: onMapToggleLayer
  }));
});

LayerSelectorPanel.displayName = 'LayerSelectorPanel';

var MapControlPanel = _react["default"].memo(function (_ref5) {
  var children = _ref5.children,
      header = _ref5.header,
      onClick = _ref5.onClick,
      _ref5$scale = _ref5.scale,
      scale = _ref5$scale === void 0 ? 1 : _ref5$scale,
      isExport = _ref5.isExport;
  return _react["default"].createElement(StyledMapControlPanel, {
    style: {
      transform: "scale(".concat(scale, ") translate(calc(-").concat(25 * (scale - 1), "% - ").concat(10 * scale, "px), calc(").concat(25 * (scale - 1), "% + ").concat(10 * scale, "px))"),
      marginBottom: '8px'
    }
  }, _react["default"].createElement(StyledMapControlPanelHeader, null, isExport ? _react["default"].createElement(_logo["default"], {
    version: false,
    appName: "kepler.gl"
  }) : _react["default"].createElement("span", {
    style: {
      verticalAlign: 'middle'
    }
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: header
  })), isExport ? null : _react["default"].createElement(_styledComponents2.IconRoundSmall, {
    className: "close-map-control-item",
    onClick: onClick
  }, _react["default"].createElement(_icons.Close, {
    height: "16px"
  }))), _react["default"].createElement(StyledMapControlPanelContent, null, children));
});

MapControlPanel.displayName = 'MapControlPanel';

var MapLegendPanel = function MapLegendPanel(_ref6) {
  var layers = _ref6.layers,
      isActive = _ref6.isActive,
      scale = _ref6.scale,
      onToggleMenuPanel = _ref6.onToggleMenuPanel,
      isExport = _ref6.isExport;
  return !isActive ? _react["default"].createElement(_styledComponents2.MapControlButton, {
    key: 2,
    "data-tip": true,
    "data-for": "show-legend",
    className: "map-control-button show-legend",
    onClick: function onClick(e) {
      e.preventDefault();
      onToggleMenuPanel();
    }
  }, _react["default"].createElement(_icons.Legend, {
    height: "22px"
  }), _react["default"].createElement(MapLegendTooltip, {
    id: "show-legend",
    message: 'tooltip.showLegend'
  })) : _react["default"].createElement(MapControlPanel, {
    scale: scale,
    header: 'header.layerLegend',
    onClick: onToggleMenuPanel,
    isExport: isExport
  }, _react["default"].createElement(_mapLegend["default"], {
    layers: layers
  }));
};

MapLegendPanel.displayName = 'MapControlPanel';

var SplitMapButton = _react["default"].memo(function (_ref7) {
  var isSplit = _ref7.isSplit,
      mapIndex = _ref7.mapIndex,
      onToggleSplitMap = _ref7.onToggleSplitMap;
  return _react["default"].createElement(_styledComponents2.MapControlButton, {
    active: isSplit,
    onClick: function onClick(e) {
      e.preventDefault();
      onToggleSplitMap(isSplit ? mapIndex : undefined);
    },
    key: "split-".concat(isSplit),
    className: (0, _classnames["default"])('map-control-button', 'split-map', {
      'close-map': isSplit
    }),
    "data-tip": true,
    "data-for": "action-toggle"
  }, isSplit ? _react["default"].createElement(_icons.Delete, {
    height: "18px"
  }) : _react["default"].createElement(_icons.Split, {
    height: "18px"
  }), _react["default"].createElement(MapControlTooltip, {
    id: "action-toggle",
    message: isSplit ? 'tooltip.closePanel' : 'tooltip.switchToDualView'
  }));
});

SplitMapButton.displayName = 'SplitMapButton';

var Toggle3dButton = _react["default"].memo(function (_ref8) {
  var dragRotate = _ref8.dragRotate,
      onTogglePerspective = _ref8.onTogglePerspective;
  return _react["default"].createElement(_styledComponents2.MapControlButton, {
    onClick: function onClick(e) {
      e.preventDefault();
      onTogglePerspective();
    },
    active: dragRotate,
    "data-tip": true,
    "data-for": "action-3d"
  }, _react["default"].createElement(_icons.Cube3d, {
    height: "22px"
  }), _react["default"].createElement(MapControlTooltip, {
    id: "action-3d",
    message: dragRotate ? 'tooltip.disable3DMap' : 'tooltip.3DMap'
  }));
});

Toggle3dButton.displayName = 'Toggle3dButton';
var StyledToolbar = (0, _styledComponents["default"])(_verticalToolbar["default"])(_templateObject6());

var MapDrawPanel = _react["default"].memo(function (_ref9) {
  var editor = _ref9.editor,
      isActive = _ref9.isActive,
      onToggleMenuPanel = _ref9.onToggleMenuPanel,
      onSetEditorMode = _ref9.onSetEditorMode,
      onToggleEditorVisibility = _ref9.onToggleEditorVisibility;
  return _react["default"].createElement("div", {
    className: "map-draw-controls",
    style: {
      position: 'relative'
    }
  }, isActive ? _react["default"].createElement(StyledToolbar, {
    show: isActive
  }, _react["default"].createElement(_toolbarItem["default"], {
    className: "edit-feature",
    onClick: function onClick() {
      return onSetEditorMode(_defaultSettings.EDITOR_MODES.EDIT);
    },
    label: "toolbar.select",
    iconHeight: "22px",
    icon: _icons.CursorClick,
    active: editor.mode === _defaultSettings.EDITOR_MODES.EDIT
  }), _react["default"].createElement(_toolbarItem["default"], {
    className: "draw-feature",
    onClick: function onClick() {
      return onSetEditorMode(_defaultSettings.EDITOR_MODES.DRAW_POLYGON);
    },
    label: "toolbar.polygon",
    iconHeight: "22px",
    icon: _icons.Polygon,
    active: editor.mode === _defaultSettings.EDITOR_MODES.DRAW_POLYGON
  }), _react["default"].createElement(_toolbarItem["default"], {
    className: "draw-rectangle",
    onClick: function onClick() {
      return onSetEditorMode(_defaultSettings.EDITOR_MODES.DRAW_RECTANGLE);
    },
    label: "toolbar.rectangle",
    iconHeight: "22px",
    icon: _icons.Rectangle,
    active: editor.mode === _defaultSettings.EDITOR_MODES.DRAW_RECTANGLE
  }), _react["default"].createElement(_toolbarItem["default"], {
    className: "toggle-features",
    onClick: onToggleEditorVisibility,
    label: editor.visible ? 'toolbar.hide' : 'toolbar.show',
    iconHeight: "22px",
    icon: editor.visible ? _icons.EyeSeen : _icons.EyeUnseen
  })) : null, _react["default"].createElement(_styledComponents2.MapControlButton, {
    onClick: function onClick(e) {
      e.preventDefault();
      onToggleMenuPanel();
    },
    active: isActive,
    "data-tip": true,
    "data-for": "map-draw"
  }, _react["default"].createElement(_icons.DrawPolygon, {
    height: "22px"
  }), _react["default"].createElement(MapControlTooltip, {
    id: "map-draw",
    message: "tooltip.DrawOnMap"
  })));
});

MapDrawPanel.displayName = 'MapDrawPanel';

var LocalePanel = _react["default"].memo(function (_ref10) {
  var availableLocales = _ref10.availableLocales,
      isActive = _ref10.isActive,
      onToggleMenuPanel = _ref10.onToggleMenuPanel,
      onSetLocale = _ref10.onSetLocale,
      activeLocale = _ref10.activeLocale;
  var onClickItem = (0, _react.useCallback)(function (locale) {
    onSetLocale(locale);
  }, [onSetLocale]);
  var onClickButton = (0, _react.useCallback)(function (e) {
    e.preventDefault();
    onToggleMenuPanel();
  }, [onToggleMenuPanel]);
  var getLabel = (0, _react.useCallback)(function (locale) {
    return "toolbar.".concat(locale);
  }, []);
  return _react["default"].createElement("div", {
    style: {
      position: 'relative'
    }
  }, isActive ? _react["default"].createElement(StyledToolbar, {
    show: isActive
  }, availableLocales.map(function (locale) {
    return _react["default"].createElement(_toolbarItem["default"], {
      key: locale,
      onClick: function onClick() {
        return onClickItem(locale);
      },
      label: getLabel(locale),
      active: activeLocale === locale
    });
  })) : null, _react["default"].createElement(_styledComponents2.MapControlButton, {
    onClick: onClickButton,
    active: isActive,
    "data-tip": true,
    "data-for": "locale"
  }, activeLocale.toUpperCase(), _react["default"].createElement(MapControlTooltip, {
    id: "locale",
    message: "tooltip.selectLocale"
  })));
});

LocalePanel.displayName = 'LocalePanel';

var MapControlFactory = function MapControlFactory() {
  var MapControl =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(MapControl, _Component);

    function MapControl() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, MapControl);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(MapControl)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layerSelector", function (props) {
        return props.layers;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layersToRenderSelector", function (props) {
        return props.layersToRender;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "layerPanelItemsSelector", (0, _reselect.createSelector)(_this.layerSelector, _this.layersToRenderSelector, function (layers, layersToRender) {
        return layers.filter(function (l) {
          return l.config.isVisible;
        }).map(function (layer) {
          return {
            id: layer.id,
            name: layer.config.label,
            // layer
            isVisible: layersToRender[layer.id]
          };
        });
      }));
      return _this;
    }

    (0, _createClass2["default"])(MapControl, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            dragRotate = _this$props.dragRotate,
            layers = _this$props.layers,
            layersToRender = _this$props.layersToRender,
            isSplit = _this$props.isSplit,
            isExport = _this$props.isExport,
            mapIndex = _this$props.mapIndex,
            mapControls = _this$props.mapControls,
            onTogglePerspective = _this$props.onTogglePerspective,
            onToggleSplitMap = _this$props.onToggleSplitMap,
            onMapToggleLayer = _this$props.onMapToggleLayer,
            onToggleMapControl = _this$props.onToggleMapControl,
            editor = _this$props.editor,
            scale = _this$props.scale,
            readOnly = _this$props.readOnly,
            locale = _this$props.locale;
        var _mapControls$visibleL = mapControls.visibleLayers,
            visibleLayers = _mapControls$visibleL === void 0 ? {} : _mapControls$visibleL,
            _mapControls$mapLegen = mapControls.mapLegend,
            mapLegend = _mapControls$mapLegen === void 0 ? {} : _mapControls$mapLegen,
            _mapControls$toggle3d = mapControls.toggle3d,
            toggle3d = _mapControls$toggle3d === void 0 ? {} : _mapControls$toggle3d,
            _mapControls$splitMap = mapControls.splitMap,
            splitMap = _mapControls$splitMap === void 0 ? {} : _mapControls$splitMap,
            _mapControls$mapDraw = mapControls.mapDraw,
            mapDraw = _mapControls$mapDraw === void 0 ? {} : _mapControls$mapDraw,
            _mapControls$mapLocal = mapControls.mapLocale,
            mapLocale = _mapControls$mapLocal === void 0 ? {} : _mapControls$mapLocal;
        return _react["default"].createElement(StyledMapControl, {
          className: "map-control"
        }, splitMap.show && readOnly !== true ? _react["default"].createElement(ActionPanel, {
          className: "split-map",
          key: 0
        }, _react["default"].createElement(SplitMapButton, {
          isSplit: isSplit,
          mapIndex: mapIndex,
          onToggleSplitMap: onToggleSplitMap
        })) : null, isSplit && visibleLayers.show && readOnly !== true ? _react["default"].createElement(ActionPanel, {
          className: "map-layers",
          key: 1
        }, _react["default"].createElement(LayerSelectorPanel, {
          items: this.layerPanelItemsSelector(this.props),
          onMapToggleLayer: onMapToggleLayer,
          isActive: visibleLayers.active,
          toggleMenuPanel: function toggleMenuPanel() {
            return onToggleMapControl('visibleLayers');
          }
        })) : null, toggle3d.show ? _react["default"].createElement(ActionPanel, {
          className: "toggle-3d",
          key: 2
        }, _react["default"].createElement(Toggle3dButton, {
          dragRotate: dragRotate,
          onTogglePerspective: onTogglePerspective
        })) : null, mapLegend.show ? _react["default"].createElement(ActionPanel, {
          className: "show-legend",
          key: 3
        }, _react["default"].createElement(MapLegendPanel, {
          layers: layers.filter(function (l) {
            return layersToRender[l.id];
          }),
          scale: scale,
          isExport: isExport,
          onMapToggleLayer: onMapToggleLayer,
          isActive: mapLegend.active,
          onToggleMenuPanel: function onToggleMenuPanel() {
            return onToggleMapControl('mapLegend');
          }
        })) : null, mapDraw.show ? _react["default"].createElement(ActionPanel, {
          key: 4
        }, _react["default"].createElement(MapDrawPanel, {
          isActive: mapDraw.active && mapDraw.activeMapIndex === mapIndex,
          editor: editor,
          onToggleMenuPanel: function onToggleMenuPanel() {
            return onToggleMapControl('mapDraw');
          },
          onSetEditorMode: this.props.onSetEditorMode,
          onToggleEditorVisibility: this.props.onToggleEditorVisibility
        })) : null, mapLocale.show ? _react["default"].createElement(ActionPanel, {
          key: 5
        }, _react["default"].createElement(LocalePanel, {
          isActive: mapLocale.active,
          activeLocale: locale,
          availableLocales: Object.keys(_locales.LOCALE_CODES),
          onSetLocale: this.props.onSetLocale,
          onToggleMenuPanel: function onToggleMenuPanel() {
            return onToggleMapControl('mapLocale');
          }
        })) : null);
      }
    }]);
    return MapControl;
  }(_react.Component);

  (0, _defineProperty2["default"])(MapControl, "propTypes", {
    datasets: _propTypes["default"].object.isRequired,
    dragRotate: _propTypes["default"].bool.isRequired,
    isSplit: _propTypes["default"].bool.isRequired,
    layers: _propTypes["default"].arrayOf(_propTypes["default"].object),
    layersToRender: _propTypes["default"].object.isRequired,
    mapIndex: _propTypes["default"].number.isRequired,
    mapControls: _propTypes["default"].object.isRequired,
    onTogglePerspective: _propTypes["default"].func.isRequired,
    onToggleSplitMap: _propTypes["default"].func.isRequired,
    onToggleMapControl: _propTypes["default"].func.isRequired,
    onSetEditorMode: _propTypes["default"].func.isRequired,
    onToggleEditorVisibility: _propTypes["default"].func.isRequired,
    top: _propTypes["default"].number.isRequired,
    onSetLocale: _propTypes["default"].func.isRequired,
    locale: _propTypes["default"].string.isRequired,
    // optional
    readOnly: _propTypes["default"].bool,
    scale: _propTypes["default"].number,
    mapLayers: _propTypes["default"].object,
    editor: _propTypes["default"].object
  });
  (0, _defineProperty2["default"])(MapControl, "defaultProps", {
    isSplit: false,
    top: 0,
    mapIndex: 0
  });
  MapControl.displayName = 'MapControl';
  return MapControl;
};

var _default = MapControlFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtY29udHJvbC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRNYXBDb250cm9sIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsIm1hcENvbnRyb2wiLCJ3aWR0aCIsInBhZGRpbmciLCJ0b3AiLCJTdHlsZWRNYXBDb250cm9sQWN0aW9uIiwiU3R5bGVkTWFwQ29udHJvbFBhbmVsIiwibWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3IiLCJTdHlsZWRNYXBDb250cm9sUGFuZWxDb250ZW50IiwiZHJvcGRvd25TY3JvbGxCYXIiLCJTdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXIiLCJtYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvciIsInRpdGxlVGV4dENvbG9yIiwiQWN0aW9uUGFuZWwiLCJjbGFzc05hbWUiLCJjaGlsZHJlbiIsImRpc3BsYXlOYW1lIiwiTWFwQ29udHJvbFRvb2x0aXAiLCJSZWFjdCIsIm1lbW8iLCJpZCIsIm1lc3NhZ2UiLCJNYXBMZWdlbmRUb29sdGlwIiwiTGF5ZXJTZWxlY3RvclBhbmVsIiwiaXRlbXMiLCJvbk1hcFRvZ2dsZUxheWVyIiwiaXNBY3RpdmUiLCJ0b2dnbGVNZW51UGFuZWwiLCJlIiwicHJldmVudERlZmF1bHQiLCJNYXBDb250cm9sUGFuZWwiLCJoZWFkZXIiLCJvbkNsaWNrIiwic2NhbGUiLCJpc0V4cG9ydCIsInRyYW5zZm9ybSIsIm1hcmdpbkJvdHRvbSIsInZlcnRpY2FsQWxpZ24iLCJNYXBMZWdlbmRQYW5lbCIsImxheWVycyIsIm9uVG9nZ2xlTWVudVBhbmVsIiwiU3BsaXRNYXBCdXR0b24iLCJpc1NwbGl0IiwibWFwSW5kZXgiLCJvblRvZ2dsZVNwbGl0TWFwIiwidW5kZWZpbmVkIiwiVG9nZ2xlM2RCdXR0b24iLCJkcmFnUm90YXRlIiwib25Ub2dnbGVQZXJzcGVjdGl2ZSIsIlN0eWxlZFRvb2xiYXIiLCJWZXJ0aWNhbFRvb2xiYXIiLCJNYXBEcmF3UGFuZWwiLCJlZGl0b3IiLCJvblNldEVkaXRvck1vZGUiLCJvblRvZ2dsZUVkaXRvclZpc2liaWxpdHkiLCJwb3NpdGlvbiIsIkVESVRPUl9NT0RFUyIsIkVESVQiLCJDdXJzb3JDbGljayIsIm1vZGUiLCJEUkFXX1BPTFlHT04iLCJQb2x5Z29uIiwiRFJBV19SRUNUQU5HTEUiLCJSZWN0YW5nbGUiLCJ2aXNpYmxlIiwiRXllU2VlbiIsIkV5ZVVuc2VlbiIsIkxvY2FsZVBhbmVsIiwiYXZhaWxhYmxlTG9jYWxlcyIsIm9uU2V0TG9jYWxlIiwiYWN0aXZlTG9jYWxlIiwib25DbGlja0l0ZW0iLCJsb2NhbGUiLCJvbkNsaWNrQnV0dG9uIiwiZ2V0TGFiZWwiLCJtYXAiLCJ0b1VwcGVyQ2FzZSIsIk1hcENvbnRyb2xGYWN0b3J5IiwiTWFwQ29udHJvbCIsImxheWVyc1RvUmVuZGVyIiwibGF5ZXJTZWxlY3RvciIsImxheWVyc1RvUmVuZGVyU2VsZWN0b3IiLCJmaWx0ZXIiLCJsIiwiY29uZmlnIiwiaXNWaXNpYmxlIiwibGF5ZXIiLCJuYW1lIiwibGFiZWwiLCJtYXBDb250cm9scyIsIm9uVG9nZ2xlTWFwQ29udHJvbCIsInJlYWRPbmx5IiwidmlzaWJsZUxheWVycyIsIm1hcExlZ2VuZCIsInRvZ2dsZTNkIiwic3BsaXRNYXAiLCJtYXBEcmF3IiwibWFwTG9jYWxlIiwic2hvdyIsImxheWVyUGFuZWxJdGVtc1NlbGVjdG9yIiwiYWN0aXZlIiwiYWN0aXZlTWFwSW5kZXgiLCJPYmplY3QiLCJrZXlzIiwiTE9DQUxFX0NPREVTIiwiQ29tcG9uZW50IiwiZGF0YXNldHMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsImFycmF5T2YiLCJudW1iZXIiLCJmdW5jIiwic3RyaW5nIiwibWFwTGF5ZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FB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Q0FDeEI5QixVQUR3QixrQkEwQk47QUFDcEJwQyxJQUFBQSxPQUFPLEVBQUUsS0FEVztBQUVwQnRDLElBQUFBLEdBQUcsRUFBRSxDQUZlO0FBR3BCdUMsSUFBQUEsUUFBUSxFQUFFO0FBSFUsR0ExQk07QUFzSjlCbUMsRUFBQUEsVUFBVSxDQUFDOUQsV0FBWCxHQUF5QixZQUF6QjtBQUVBLFNBQU84RCxVQUFQO0FBQ0QsQ0F6SkQ7O2VBMkplRCxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgdXNlQ2FsbGJhY2t9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHtJY29uUm91bmRTbWFsbCwgTWFwQ29udHJvbEJ1dHRvbiwgVG9vbHRpcH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IE1hcExheWVyU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vbWFwLWxheWVyLXNlbGVjdG9yJztcbmltcG9ydCBLZXBsZXJHbExvZ28gZnJvbSAnY29tcG9uZW50cy9jb21tb24vbG9nbyc7XG5pbXBvcnQgTWFwTGVnZW5kIGZyb20gJy4vbWFwLWxlZ2VuZCc7XG5pbXBvcnQge1xuICBDbG9zZSxcbiAgQ3ViZTNkLFxuICBDdXJzb3JDbGljayxcbiAgRGVsZXRlLFxuICBEcmF3UG9seWdvbixcbiAgRXllU2VlbixcbiAgRXllVW5zZWVuLFxuICBMYXllcnMsXG4gIExlZ2VuZCxcbiAgUG9seWdvbixcbiAgUmVjdGFuZ2xlLFxuICBTcGxpdFxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgVmVydGljYWxUb29sYmFyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3ZlcnRpY2FsLXRvb2xiYXInO1xuaW1wb3J0IFRvb2xiYXJJdGVtIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3Rvb2xiYXItaXRlbSc7XG5pbXBvcnQge0VESVRPUl9NT0RFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtMT0NBTEVfQ09ERVN9IGZyb20gJ2xvY2FsaXphdGlvbi9sb2NhbGVzJztcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbCA9IHN0eWxlZC5kaXZgXG4gIHJpZ2h0OiAwO1xuICB3aWR0aDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBDb250cm9sLndpZHRofXB4O1xuICBwYWRkaW5nOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcENvbnRyb2wucGFkZGluZ31weDtcbiAgei1pbmRleDogMTA7XG4gIHRvcDogJHtwcm9wcyA9PiBwcm9wcy50b3B9cHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xBY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiA0cHggMDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbCA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3J9O1xuICBmbGV4LWdyb3c6IDE7XG4gIHotaW5kZXg6IDE7XG4gIHAge1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duU2Nyb2xsQmFyfTtcbiAgbWF4LWhlaWdodDogNTAwcHg7XG4gIG1pbi1oZWlnaHQ6IDEwMHB4O1xuICBvdmVyZmxvdzogYXV0bztcbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbEhlYWRlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBQYW5lbEhlYWRlckJhY2tncm91bmRDb2xvcn07XG4gIGhlaWdodDogMzJweDtcbiAgcGFkZGluZzogNnB4IDEycHg7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVUZXh0Q29sb3J9O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgYnV0dG9uIHtcbiAgICB3aWR0aDogMThweDtcbiAgICBoZWlnaHQ6IDE4cHg7XG4gIH1cbmA7XG5cbmNvbnN0IEFjdGlvblBhbmVsID0gKHtjbGFzc05hbWUsIGNoaWxkcmVufSkgPT4gKFxuICA8U3R5bGVkTWFwQ29udHJvbEFjdGlvbiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e2NoaWxkcmVufTwvU3R5bGVkTWFwQ29udHJvbEFjdGlvbj5cbik7XG5cbkFjdGlvblBhbmVsLmRpc3BsYXlOYW1lID0gJ0FjdGlvblBhbmVsJztcblxuY29uc3QgTWFwQ29udHJvbFRvb2x0aXAgPSBSZWFjdC5tZW1vKCh7aWQsIG1lc3NhZ2V9KSA9PiAoXG4gIDxUb29sdGlwIGlkPXtpZH0gcGxhY2U9XCJsZWZ0XCIgZWZmZWN0PVwic29saWRcIj5cbiAgICA8c3Bhbj5cbiAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXttZXNzYWdlfSAvPlxuICAgIDwvc3Bhbj5cbiAgPC9Ub29sdGlwPlxuKSk7XG5cbk1hcENvbnRyb2xUb29sdGlwLmRpc3BsYXlOYW1lID0gJ01hcENvbnRyb2xUb29sdGlwJztcblxuY29uc3QgTWFwTGVnZW5kVG9vbHRpcCA9ICh7aWQsIG1lc3NhZ2V9KSA9PiAoXG4gIDxUb29sdGlwIGlkPXtpZH0gcGxhY2U9XCJsZWZ0XCIgZWZmZWN0PVwic29saWRcIj5cbiAgICA8c3Bhbj5cbiAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXttZXNzYWdlfSAvPlxuICAgIDwvc3Bhbj5cbiAgPC9Ub29sdGlwPlxuKTtcblxuY29uc3QgTGF5ZXJTZWxlY3RvclBhbmVsID0gUmVhY3QubWVtbygoe2l0ZW1zLCBvbk1hcFRvZ2dsZUxheWVyLCBpc0FjdGl2ZSwgdG9nZ2xlTWVudVBhbmVsfSkgPT5cbiAgIWlzQWN0aXZlID8gKFxuICAgIDxNYXBDb250cm9sQnV0dG9uXG4gICAgICBrZXk9ezF9XG4gICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0b2dnbGVNZW51UGFuZWwoKTtcbiAgICAgIH19XG4gICAgICBjbGFzc05hbWU9XCJtYXAtY29udHJvbC1idXR0b24gdG9nZ2xlLWxheWVyXCJcbiAgICAgIGRhdGEtdGlwXG4gICAgICBkYXRhLWZvcj1cInRvZ2dsZS1sYXllclwiXG4gICAgPlxuICAgICAgPExheWVycyBoZWlnaHQ9XCIyMnB4XCIgLz5cbiAgICAgIDxNYXBDb250cm9sVG9vbHRpcFxuICAgICAgICBpZD1cInRvZ2dsZS1sYXllclwiXG4gICAgICAgIG1lc3NhZ2U9e2lzQWN0aXZlID8gJ3Rvb2x0aXAuaGlkZUxheWVyUGFuZWwnIDogJ3Rvb2x0aXAuc2hvd0xheWVyUGFuZWwnfVxuICAgICAgLz5cbiAgICA8L01hcENvbnRyb2xCdXR0b24+XG4gICkgOiAoXG4gICAgPE1hcENvbnRyb2xQYW5lbCBoZWFkZXI9XCJoZWFkZXIudmlzaWJsZUxheWVyc1wiIG9uQ2xpY2s9e3RvZ2dsZU1lbnVQYW5lbH0+XG4gICAgICA8TWFwTGF5ZXJTZWxlY3RvciBsYXllcnM9e2l0ZW1zfSBvbk1hcFRvZ2dsZUxheWVyPXtvbk1hcFRvZ2dsZUxheWVyfSAvPlxuICAgIDwvTWFwQ29udHJvbFBhbmVsPlxuICApXG4pO1xuXG5MYXllclNlbGVjdG9yUGFuZWwuZGlzcGxheU5hbWUgPSAnTGF5ZXJTZWxlY3RvclBhbmVsJztcblxuY29uc3QgTWFwQ29udHJvbFBhbmVsID0gUmVhY3QubWVtbygoe2NoaWxkcmVuLCBoZWFkZXIsIG9uQ2xpY2ssIHNjYWxlID0gMSwgaXNFeHBvcnR9KSA9PiAoXG4gIDxTdHlsZWRNYXBDb250cm9sUGFuZWxcbiAgICBzdHlsZT17e1xuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoJHtzY2FsZX0pIHRyYW5zbGF0ZShjYWxjKC0kezI1ICogKHNjYWxlIC0gMSl9JSAtICR7MTAgKlxuICAgICAgICBzY2FsZX1weCksIGNhbGMoJHsyNSAqIChzY2FsZSAtIDEpfSUgKyAkezEwICogc2NhbGV9cHgpKWAsXG4gICAgICBtYXJnaW5Cb3R0b206ICc4cHgnXG4gICAgfX1cbiAgPlxuICAgIDxTdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXI+XG4gICAgICB7aXNFeHBvcnQgPyAoXG4gICAgICAgIDxLZXBsZXJHbExvZ28gdmVyc2lvbj17ZmFsc2V9IGFwcE5hbWU9XCJrZXBsZXIuZ2xcIiAvPlxuICAgICAgKSA6IChcbiAgICAgICAgPHNwYW4gc3R5bGU9e3t2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJ319PlxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtoZWFkZXJ9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICl9XG4gICAgICB7aXNFeHBvcnQgPyBudWxsIDogKFxuICAgICAgICA8SWNvblJvdW5kU21hbGwgY2xhc3NOYW1lPVwiY2xvc2UtbWFwLWNvbnRyb2wtaXRlbVwiIG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICAgIDxDbG9zZSBoZWlnaHQ9XCIxNnB4XCIgLz5cbiAgICAgICAgPC9JY29uUm91bmRTbWFsbD5cbiAgICAgICl9XG4gICAgPC9TdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXI+XG4gICAgPFN0eWxlZE1hcENvbnRyb2xQYW5lbENvbnRlbnQ+e2NoaWxkcmVufTwvU3R5bGVkTWFwQ29udHJvbFBhbmVsQ29udGVudD5cbiAgPC9TdHlsZWRNYXBDb250cm9sUGFuZWw+XG4pKTtcblxuTWFwQ29udHJvbFBhbmVsLmRpc3BsYXlOYW1lID0gJ01hcENvbnRyb2xQYW5lbCc7XG5cbmNvbnN0IE1hcExlZ2VuZFBhbmVsID0gKHtsYXllcnMsIGlzQWN0aXZlLCBzY2FsZSwgb25Ub2dnbGVNZW51UGFuZWwsIGlzRXhwb3J0fSkgPT5cbiAgIWlzQWN0aXZlID8gKFxuICAgIDxNYXBDb250cm9sQnV0dG9uXG4gICAgICBrZXk9ezJ9XG4gICAgICBkYXRhLXRpcFxuICAgICAgZGF0YS1mb3I9XCJzaG93LWxlZ2VuZFwiXG4gICAgICBjbGFzc05hbWU9XCJtYXAtY29udHJvbC1idXR0b24gc2hvdy1sZWdlbmRcIlxuICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb25Ub2dnbGVNZW51UGFuZWwoKTtcbiAgICAgIH19XG4gICAgPlxuICAgICAgPExlZ2VuZCBoZWlnaHQ9XCIyMnB4XCIgLz5cbiAgICAgIDxNYXBMZWdlbmRUb29sdGlwIGlkPVwic2hvdy1sZWdlbmRcIiBtZXNzYWdlPXsndG9vbHRpcC5zaG93TGVnZW5kJ30gLz5cbiAgICA8L01hcENvbnRyb2xCdXR0b24+XG4gICkgOiAoXG4gICAgPE1hcENvbnRyb2xQYW5lbFxuICAgICAgc2NhbGU9e3NjYWxlfVxuICAgICAgaGVhZGVyPXsnaGVhZGVyLmxheWVyTGVnZW5kJ31cbiAgICAgIG9uQ2xpY2s9e29uVG9nZ2xlTWVudVBhbmVsfVxuICAgICAgaXNFeHBvcnQ9e2lzRXhwb3J0fVxuICAgID5cbiAgICAgIDxNYXBMZWdlbmQgbGF5ZXJzPXtsYXllcnN9IC8+XG4gICAgPC9NYXBDb250cm9sUGFuZWw+XG4gICk7XG5cbk1hcExlZ2VuZFBhbmVsLmRpc3BsYXlOYW1lID0gJ01hcENvbnRyb2xQYW5lbCc7XG5cbmNvbnN0IFNwbGl0TWFwQnV0dG9uID0gUmVhY3QubWVtbygoe2lzU3BsaXQsIG1hcEluZGV4LCBvblRvZ2dsZVNwbGl0TWFwfSkgPT4gKFxuICA8TWFwQ29udHJvbEJ1dHRvblxuICAgIGFjdGl2ZT17aXNTcGxpdH1cbiAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9uVG9nZ2xlU3BsaXRNYXAoaXNTcGxpdCA/IG1hcEluZGV4IDogdW5kZWZpbmVkKTtcbiAgICB9fVxuICAgIGtleT17YHNwbGl0LSR7aXNTcGxpdH1gfVxuICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnbWFwLWNvbnRyb2wtYnV0dG9uJywgJ3NwbGl0LW1hcCcsIHsnY2xvc2UtbWFwJzogaXNTcGxpdH0pfVxuICAgIGRhdGEtdGlwXG4gICAgZGF0YS1mb3I9XCJhY3Rpb24tdG9nZ2xlXCJcbiAgPlxuICAgIHtpc1NwbGl0ID8gPERlbGV0ZSBoZWlnaHQ9XCIxOHB4XCIgLz4gOiA8U3BsaXQgaGVpZ2h0PVwiMThweFwiIC8+fVxuICAgIDxNYXBDb250cm9sVG9vbHRpcFxuICAgICAgaWQ9XCJhY3Rpb24tdG9nZ2xlXCJcbiAgICAgIG1lc3NhZ2U9e2lzU3BsaXQgPyAndG9vbHRpcC5jbG9zZVBhbmVsJyA6ICd0b29sdGlwLnN3aXRjaFRvRHVhbFZpZXcnfVxuICAgIC8+XG4gIDwvTWFwQ29udHJvbEJ1dHRvbj5cbikpO1xuXG5TcGxpdE1hcEJ1dHRvbi5kaXNwbGF5TmFtZSA9ICdTcGxpdE1hcEJ1dHRvbic7XG5cbmNvbnN0IFRvZ2dsZTNkQnV0dG9uID0gUmVhY3QubWVtbygoe2RyYWdSb3RhdGUsIG9uVG9nZ2xlUGVyc3BlY3RpdmV9KSA9PiAoXG4gIDxNYXBDb250cm9sQnV0dG9uXG4gICAgb25DbGljaz17ZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBvblRvZ2dsZVBlcnNwZWN0aXZlKCk7XG4gICAgfX1cbiAgICBhY3RpdmU9e2RyYWdSb3RhdGV9XG4gICAgZGF0YS10aXBcbiAgICBkYXRhLWZvcj1cImFjdGlvbi0zZFwiXG4gID5cbiAgICA8Q3ViZTNkIGhlaWdodD1cIjIycHhcIiAvPlxuICAgIDxNYXBDb250cm9sVG9vbHRpcFxuICAgICAgaWQ9XCJhY3Rpb24tM2RcIlxuICAgICAgbWVzc2FnZT17ZHJhZ1JvdGF0ZSA/ICd0b29sdGlwLmRpc2FibGUzRE1hcCcgOiAndG9vbHRpcC4zRE1hcCd9XG4gICAgLz5cbiAgPC9NYXBDb250cm9sQnV0dG9uPlxuKSk7XG5cblRvZ2dsZTNkQnV0dG9uLmRpc3BsYXlOYW1lID0gJ1RvZ2dsZTNkQnV0dG9uJztcblxuY29uc3QgU3R5bGVkVG9vbGJhciA9IHN0eWxlZChWZXJ0aWNhbFRvb2xiYXIpYFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAzMnB4O1xuYDtcblxuY29uc3QgTWFwRHJhd1BhbmVsID0gUmVhY3QubWVtbyhcbiAgKHtlZGl0b3IsIGlzQWN0aXZlLCBvblRvZ2dsZU1lbnVQYW5lbCwgb25TZXRFZGl0b3JNb2RlLCBvblRvZ2dsZUVkaXRvclZpc2liaWxpdHl9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwLWRyYXctY29udHJvbHNcIiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgIHtpc0FjdGl2ZSA/IChcbiAgICAgICAgICA8U3R5bGVkVG9vbGJhciBzaG93PXtpc0FjdGl2ZX0+XG4gICAgICAgICAgICA8VG9vbGJhckl0ZW1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZWRpdC1mZWF0dXJlXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZXRFZGl0b3JNb2RlKEVESVRPUl9NT0RFUy5FRElUKX1cbiAgICAgICAgICAgICAgbGFiZWw9XCJ0b29sYmFyLnNlbGVjdFwiXG4gICAgICAgICAgICAgIGljb25IZWlnaHQ9XCIyMnB4XCJcbiAgICAgICAgICAgICAgaWNvbj17Q3Vyc29yQ2xpY2t9XG4gICAgICAgICAgICAgIGFjdGl2ZT17ZWRpdG9yLm1vZGUgPT09IEVESVRPUl9NT0RFUy5FRElUfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxUb29sYmFySXRlbVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJkcmF3LWZlYXR1cmVcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNldEVkaXRvck1vZGUoRURJVE9SX01PREVTLkRSQVdfUE9MWUdPTil9XG4gICAgICAgICAgICAgIGxhYmVsPVwidG9vbGJhci5wb2x5Z29uXCJcbiAgICAgICAgICAgICAgaWNvbkhlaWdodD1cIjIycHhcIlxuICAgICAgICAgICAgICBpY29uPXtQb2x5Z29ufVxuICAgICAgICAgICAgICBhY3RpdmU9e2VkaXRvci5tb2RlID09PSBFRElUT1JfTU9ERVMuRFJBV19QT0xZR09OfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxUb29sYmFySXRlbVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJkcmF3LXJlY3RhbmdsZVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2V0RWRpdG9yTW9kZShFRElUT1JfTU9ERVMuRFJBV19SRUNUQU5HTEUpfVxuICAgICAgICAgICAgICBsYWJlbD1cInRvb2xiYXIucmVjdGFuZ2xlXCJcbiAgICAgICAgICAgICAgaWNvbkhlaWdodD1cIjIycHhcIlxuICAgICAgICAgICAgICBpY29uPXtSZWN0YW5nbGV9XG4gICAgICAgICAgICAgIGFjdGl2ZT17ZWRpdG9yLm1vZGUgPT09IEVESVRPUl9NT0RFUy5EUkFXX1JFQ1RBTkdMRX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VG9vbGJhckl0ZW1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9nZ2xlLWZlYXR1cmVzXCJcbiAgICAgICAgICAgICAgb25DbGljaz17b25Ub2dnbGVFZGl0b3JWaXNpYmlsaXR5fVxuICAgICAgICAgICAgICBsYWJlbD17ZWRpdG9yLnZpc2libGUgPyAndG9vbGJhci5oaWRlJyA6ICd0b29sYmFyLnNob3cnfVxuICAgICAgICAgICAgICBpY29uSGVpZ2h0PVwiMjJweFwiXG4gICAgICAgICAgICAgIGljb249e2VkaXRvci52aXNpYmxlID8gRXllU2VlbiA6IEV5ZVVuc2Vlbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9TdHlsZWRUb29sYmFyPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPE1hcENvbnRyb2xCdXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIG9uVG9nZ2xlTWVudVBhbmVsKCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBhY3RpdmU9e2lzQWN0aXZlfVxuICAgICAgICAgIGRhdGEtdGlwXG4gICAgICAgICAgZGF0YS1mb3I9XCJtYXAtZHJhd1wiXG4gICAgICAgID5cbiAgICAgICAgICA8RHJhd1BvbHlnb24gaGVpZ2h0PVwiMjJweFwiIC8+XG4gICAgICAgICAgPE1hcENvbnRyb2xUb29sdGlwIGlkPVwibWFwLWRyYXdcIiBtZXNzYWdlPVwidG9vbHRpcC5EcmF3T25NYXBcIiAvPlxuICAgICAgICA8L01hcENvbnRyb2xCdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4pO1xuXG5NYXBEcmF3UGFuZWwuZGlzcGxheU5hbWUgPSAnTWFwRHJhd1BhbmVsJztcblxuY29uc3QgTG9jYWxlUGFuZWwgPSBSZWFjdC5tZW1vKFxuICAoe2F2YWlsYWJsZUxvY2FsZXMsIGlzQWN0aXZlLCBvblRvZ2dsZU1lbnVQYW5lbCwgb25TZXRMb2NhbGUsIGFjdGl2ZUxvY2FsZX0pID0+IHtcbiAgICBjb25zdCBvbkNsaWNrSXRlbSA9IHVzZUNhbGxiYWNrKFxuICAgICAgbG9jYWxlID0+IHtcbiAgICAgICAgb25TZXRMb2NhbGUobG9jYWxlKTtcbiAgICAgIH0sXG4gICAgICBbb25TZXRMb2NhbGVdXG4gICAgKTtcblxuICAgIGNvbnN0IG9uQ2xpY2tCdXR0b24gPSB1c2VDYWxsYmFjayhcbiAgICAgIGUgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9uVG9nZ2xlTWVudVBhbmVsKCk7XG4gICAgICB9LFxuICAgICAgW29uVG9nZ2xlTWVudVBhbmVsXVxuICAgICk7XG4gICAgY29uc3QgZ2V0TGFiZWwgPSB1c2VDYWxsYmFjayhsb2NhbGUgPT4gYHRvb2xiYXIuJHtsb2NhbGV9YCwgW10pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319PlxuICAgICAgICB7aXNBY3RpdmUgPyAoXG4gICAgICAgICAgPFN0eWxlZFRvb2xiYXIgc2hvdz17aXNBY3RpdmV9PlxuICAgICAgICAgICAge2F2YWlsYWJsZUxvY2FsZXMubWFwKGxvY2FsZSA9PiAoXG4gICAgICAgICAgICAgIDxUb29sYmFySXRlbVxuICAgICAgICAgICAgICAgIGtleT17bG9jYWxlfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2xpY2tJdGVtKGxvY2FsZSl9XG4gICAgICAgICAgICAgICAgbGFiZWw9e2dldExhYmVsKGxvY2FsZSl9XG4gICAgICAgICAgICAgICAgYWN0aXZlPXthY3RpdmVMb2NhbGUgPT09IGxvY2FsZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvU3R5bGVkVG9vbGJhcj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxNYXBDb250cm9sQnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2tCdXR0b259IGFjdGl2ZT17aXNBY3RpdmV9IGRhdGEtdGlwIGRhdGEtZm9yPVwibG9jYWxlXCI+XG4gICAgICAgICAge2FjdGl2ZUxvY2FsZS50b1VwcGVyQ2FzZSgpfVxuICAgICAgICAgIDxNYXBDb250cm9sVG9vbHRpcCBpZD1cImxvY2FsZVwiIG1lc3NhZ2U9XCJ0b29sdGlwLnNlbGVjdExvY2FsZVwiIC8+XG4gICAgICAgIDwvTWFwQ29udHJvbEJ1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbik7XG5cbkxvY2FsZVBhbmVsLmRpc3BsYXlOYW1lID0gJ0xvY2FsZVBhbmVsJztcblxuY29uc3QgTWFwQ29udHJvbEZhY3RvcnkgPSAoKSA9PiB7XG4gIGNsYXNzIE1hcENvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgZHJhZ1JvdGF0ZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgIGlzU3BsaXQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICBsYXllcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgICAgbGF5ZXJzVG9SZW5kZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG1hcEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBtYXBDb250cm9sczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgb25Ub2dnbGVQZXJzcGVjdGl2ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG9uVG9nZ2xlU3BsaXRNYXA6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvblRvZ2dsZU1hcENvbnRyb2w6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvblNldEVkaXRvck1vZGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvblRvZ2dsZUVkaXRvclZpc2liaWxpdHk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB0b3A6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIG9uU2V0TG9jYWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9jYWxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAgIC8vIG9wdGlvbmFsXG4gICAgICByZWFkT25seTogUHJvcFR5cGVzLmJvb2wsXG4gICAgICBzY2FsZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIG1hcExheWVyczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdFxuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgaXNTcGxpdDogZmFsc2UsXG4gICAgICB0b3A6IDAsXG4gICAgICBtYXBJbmRleDogMFxuICAgIH07XG5cbiAgICBsYXllclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGF5ZXJzO1xuICAgIGxheWVyc1RvUmVuZGVyU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5sYXllcnNUb1JlbmRlcjtcbiAgICBsYXllclBhbmVsSXRlbXNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5sYXllclNlbGVjdG9yLFxuICAgICAgdGhpcy5sYXllcnNUb1JlbmRlclNlbGVjdG9yLFxuICAgICAgKGxheWVycywgbGF5ZXJzVG9SZW5kZXIpID0+XG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5maWx0ZXIobCA9PiBsLmNvbmZpZy5pc1Zpc2libGUpXG4gICAgICAgICAgLm1hcChsYXllciA9PiAoe1xuICAgICAgICAgICAgaWQ6IGxheWVyLmlkLFxuICAgICAgICAgICAgbmFtZTogbGF5ZXIuY29uZmlnLmxhYmVsLFxuICAgICAgICAgICAgLy8gbGF5ZXJcbiAgICAgICAgICAgIGlzVmlzaWJsZTogbGF5ZXJzVG9SZW5kZXJbbGF5ZXIuaWRdXG4gICAgICAgICAgfSkpXG4gICAgKTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZHJhZ1JvdGF0ZSxcbiAgICAgICAgbGF5ZXJzLFxuICAgICAgICBsYXllcnNUb1JlbmRlcixcbiAgICAgICAgaXNTcGxpdCxcbiAgICAgICAgaXNFeHBvcnQsXG4gICAgICAgIG1hcEluZGV4LFxuICAgICAgICBtYXBDb250cm9scyxcbiAgICAgICAgb25Ub2dnbGVQZXJzcGVjdGl2ZSxcbiAgICAgICAgb25Ub2dnbGVTcGxpdE1hcCxcbiAgICAgICAgb25NYXBUb2dnbGVMYXllcixcbiAgICAgICAgb25Ub2dnbGVNYXBDb250cm9sLFxuICAgICAgICBlZGl0b3IsXG4gICAgICAgIHNjYWxlLFxuICAgICAgICByZWFkT25seSxcbiAgICAgICAgbG9jYWxlXG4gICAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgY29uc3Qge1xuICAgICAgICB2aXNpYmxlTGF5ZXJzID0ge30sXG4gICAgICAgIG1hcExlZ2VuZCA9IHt9LFxuICAgICAgICB0b2dnbGUzZCA9IHt9LFxuICAgICAgICBzcGxpdE1hcCA9IHt9LFxuICAgICAgICBtYXBEcmF3ID0ge30sXG4gICAgICAgIG1hcExvY2FsZSA9IHt9XG4gICAgICB9ID0gbWFwQ29udHJvbHM7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRNYXBDb250cm9sIGNsYXNzTmFtZT1cIm1hcC1jb250cm9sXCI+XG4gICAgICAgICAgey8qIFNwbGl0IE1hcCAqL31cbiAgICAgICAgICB7c3BsaXRNYXAuc2hvdyAmJiByZWFkT25seSAhPT0gdHJ1ZSA/IChcbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJzcGxpdC1tYXBcIiBrZXk9ezB9PlxuICAgICAgICAgICAgICA8U3BsaXRNYXBCdXR0b25cbiAgICAgICAgICAgICAgICBpc1NwbGl0PXtpc1NwbGl0fVxuICAgICAgICAgICAgICAgIG1hcEluZGV4PXttYXBJbmRleH1cbiAgICAgICAgICAgICAgICBvblRvZ2dsZVNwbGl0TWFwPXtvblRvZ2dsZVNwbGl0TWFwfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHsvKiBNYXAgTGF5ZXJzICovfVxuICAgICAgICAgIHtpc1NwbGl0ICYmIHZpc2libGVMYXllcnMuc2hvdyAmJiByZWFkT25seSAhPT0gdHJ1ZSA/IChcbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJtYXAtbGF5ZXJzXCIga2V5PXsxfT5cbiAgICAgICAgICAgICAgPExheWVyU2VsZWN0b3JQYW5lbFxuICAgICAgICAgICAgICAgIGl0ZW1zPXt0aGlzLmxheWVyUGFuZWxJdGVtc1NlbGVjdG9yKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgIG9uTWFwVG9nZ2xlTGF5ZXI9e29uTWFwVG9nZ2xlTGF5ZXJ9XG4gICAgICAgICAgICAgICAgaXNBY3RpdmU9e3Zpc2libGVMYXllcnMuYWN0aXZlfVxuICAgICAgICAgICAgICAgIHRvZ2dsZU1lbnVQYW5lbD17KCkgPT4gb25Ub2dnbGVNYXBDb250cm9sKCd2aXNpYmxlTGF5ZXJzJyl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgey8qIDNEIE1hcCAqL31cbiAgICAgICAgICB7dG9nZ2xlM2Quc2hvdyA/IChcbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJ0b2dnbGUtM2RcIiBrZXk9ezJ9PlxuICAgICAgICAgICAgICA8VG9nZ2xlM2RCdXR0b24gZHJhZ1JvdGF0ZT17ZHJhZ1JvdGF0ZX0gb25Ub2dnbGVQZXJzcGVjdGl2ZT17b25Ub2dnbGVQZXJzcGVjdGl2ZX0gLz5cbiAgICAgICAgICAgIDwvQWN0aW9uUGFuZWw+XG4gICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICB7LyogTWFwIExlZ2VuZCAqL31cbiAgICAgICAgICB7bWFwTGVnZW5kLnNob3cgPyAoXG4gICAgICAgICAgICA8QWN0aW9uUGFuZWwgY2xhc3NOYW1lPVwic2hvdy1sZWdlbmRcIiBrZXk9ezN9PlxuICAgICAgICAgICAgICA8TWFwTGVnZW5kUGFuZWxcbiAgICAgICAgICAgICAgICBsYXllcnM9e2xheWVycy5maWx0ZXIobCA9PiBsYXllcnNUb1JlbmRlcltsLmlkXSl9XG4gICAgICAgICAgICAgICAgc2NhbGU9e3NjYWxlfVxuICAgICAgICAgICAgICAgIGlzRXhwb3J0PXtpc0V4cG9ydH1cbiAgICAgICAgICAgICAgICBvbk1hcFRvZ2dsZUxheWVyPXtvbk1hcFRvZ2dsZUxheWVyfVxuICAgICAgICAgICAgICAgIGlzQWN0aXZlPXttYXBMZWdlbmQuYWN0aXZlfVxuICAgICAgICAgICAgICAgIG9uVG9nZ2xlTWVudVBhbmVsPXsoKSA9PiBvblRvZ2dsZU1hcENvbnRyb2woJ21hcExlZ2VuZCcpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHttYXBEcmF3LnNob3cgPyAoXG4gICAgICAgICAgICA8QWN0aW9uUGFuZWwga2V5PXs0fT5cbiAgICAgICAgICAgICAgPE1hcERyYXdQYW5lbFxuICAgICAgICAgICAgICAgIGlzQWN0aXZlPXttYXBEcmF3LmFjdGl2ZSAmJiBtYXBEcmF3LmFjdGl2ZU1hcEluZGV4ID09PSBtYXBJbmRleH1cbiAgICAgICAgICAgICAgICBlZGl0b3I9e2VkaXRvcn1cbiAgICAgICAgICAgICAgICBvblRvZ2dsZU1lbnVQYW5lbD17KCkgPT4gb25Ub2dnbGVNYXBDb250cm9sKCdtYXBEcmF3Jyl9XG4gICAgICAgICAgICAgICAgb25TZXRFZGl0b3JNb2RlPXt0aGlzLnByb3BzLm9uU2V0RWRpdG9yTW9kZX1cbiAgICAgICAgICAgICAgICBvblRvZ2dsZUVkaXRvclZpc2liaWxpdHk9e3RoaXMucHJvcHMub25Ub2dnbGVFZGl0b3JWaXNpYmlsaXR5fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHttYXBMb2NhbGUuc2hvdyA/IChcbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbCBrZXk9ezV9PlxuICAgICAgICAgICAgICA8TG9jYWxlUGFuZWxcbiAgICAgICAgICAgICAgICBpc0FjdGl2ZT17bWFwTG9jYWxlLmFjdGl2ZX1cbiAgICAgICAgICAgICAgICBhY3RpdmVMb2NhbGU9e2xvY2FsZX1cbiAgICAgICAgICAgICAgICBhdmFpbGFibGVMb2NhbGVzPXtPYmplY3Qua2V5cyhMT0NBTEVfQ09ERVMpfVxuICAgICAgICAgICAgICAgIG9uU2V0TG9jYWxlPXt0aGlzLnByb3BzLm9uU2V0TG9jYWxlfVxuICAgICAgICAgICAgICAgIG9uVG9nZ2xlTWVudVBhbmVsPXsoKSA9PiBvblRvZ2dsZU1hcENvbnRyb2woJ21hcExvY2FsZScpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBNYXBDb250cm9sLmRpc3BsYXlOYW1lID0gJ01hcENvbnRyb2wnO1xuXG4gIHJldHVybiBNYXBDb250cm9sO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTWFwQ29udHJvbEZhY3Rvcnk7XG4iXX0=