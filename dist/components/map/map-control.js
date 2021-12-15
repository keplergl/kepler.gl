"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapLegendPanelFactory = MapLegendPanelFactory;
exports.SplitMapButtonFactory = SplitMapButtonFactory;
exports.Toggle3dButtonFactory = Toggle3dButtonFactory;
exports.MapDrawPanelFactory = MapDrawPanelFactory;
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reselect = require("reselect");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _localization = require("../../localization");

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

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledMapControl = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  right: 0;\n  padding: ", "px;\n  z-index: 10;\n  margin-top: ", "px;\n  position: absolute;\n"])), function (props) {
  return props.theme.mapControl.padding;
}, function (props) {
  return props.top || 0;
});

var StyledMapControlAction = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 4px 0;\n  display: flex;\n  justify-content: flex-end;\n"])));

var StyledMapControlPanel = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  flex-grow: 1;\n  z-index: 1;\n  p {\n    margin-bottom: 0;\n  }\n"])), function (props) {
  return props.theme.mapPanelBackgroundColor;
});

var StyledMapControlPanelContent = _styledComponents["default"].div.attrs({
  className: 'map-control__panel-content'
})(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n  max-height: 500px;\n  min-height: 100px;\n  min-width: ", "px;\n  overflow: auto;\n"])), function (props) {
  return props.theme.dropdownScrollBar;
}, function (props) {
  return props.theme.mapControl.width;
});

var StyledMapControlPanelHeader = _styledComponents["default"].div.attrs({
  className: 'map-control__panel-header'
})(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n  background-color: ", ";\n  height: 32px;\n  padding: 6px 12px;\n  font-size: 11px;\n  color: ", ";\n  position: relative;\n\n  button {\n    width: 18px;\n    height: 18px;\n  }\n"])), function (props) {
  return props.theme.mapPanelHeaderBackgroundColor;
}, function (props) {
  return props.theme.titleTextColor;
});

var ActionPanel = function ActionPanel(_ref) {
  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement(StyledMapControlAction, {
    className: className
  }, children);
};

ActionPanel.displayName = 'ActionPanel';
/** @type {import('./map-control').MapControlTooltipComponent} */

var MapControlTooltip = /*#__PURE__*/_react["default"].memo(function (_ref2) {
  var id = _ref2.id,
      message = _ref2.message;
  return /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
    id: id,
    place: "left",
    effect: "solid"
  }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: message
  })));
});

MapControlTooltip.displayName = 'MapControlTooltip';

var MapLegendTooltip = function MapLegendTooltip(_ref3) {
  var id = _ref3.id,
      message = _ref3.message;
  return /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
    id: id,
    place: "left",
    effect: "solid"
  }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: message
  })));
};
/** @type {import('./map-control').LayerSelectorPanelComponent} */


var LayerSelectorPanel = /*#__PURE__*/_react["default"].memo(function (_ref4) {
  var items = _ref4.items,
      onMapToggleLayer = _ref4.onMapToggleLayer,
      isActive = _ref4.isActive,
      toggleMenuPanel = _ref4.toggleMenuPanel,
      disableClose = _ref4.disableClose;
  return !isActive ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.MapControlButton, {
    key: 1,
    onClick: function onClick(e) {
      e.preventDefault();
      toggleMenuPanel();
    },
    className: "map-control-button toggle-layer",
    "data-tip": true,
    "data-for": "toggle-layer"
  }, /*#__PURE__*/_react["default"].createElement(_icons.Layers, {
    height: "22px"
  }), /*#__PURE__*/_react["default"].createElement(MapControlTooltip, {
    id: "toggle-layer",
    message: isActive ? 'tooltip.hideLayerPanel' : 'tooltip.showLayerPanel'
  })) : /*#__PURE__*/_react["default"].createElement(MapControlPanel, {
    header: "header.visibleLayers",
    onClick: toggleMenuPanel,
    disableClose: disableClose
  }, /*#__PURE__*/_react["default"].createElement(_mapLayerSelector["default"], {
    layers: items,
    onMapToggleLayer: onMapToggleLayer
  }));
});

LayerSelectorPanel.displayName = 'LayerSelectorPanel';
/** @type {import('./map-control').MapControlPanelComponent} */

var MapControlPanel = /*#__PURE__*/_react["default"].memo(function (_ref5) {
  var children = _ref5.children,
      header = _ref5.header,
      onClick = _ref5.onClick,
      _ref5$scale = _ref5.scale,
      scale = _ref5$scale === void 0 ? 1 : _ref5$scale,
      isExport = _ref5.isExport,
      _ref5$disableClose = _ref5.disableClose,
      disableClose = _ref5$disableClose === void 0 ? false : _ref5$disableClose,
      logoComponent = _ref5.logoComponent;
  return /*#__PURE__*/_react["default"].createElement(StyledMapControlPanel, {
    style: {
      transform: "scale(".concat(scale, ")"),
      marginBottom: '8px'
    }
  }, /*#__PURE__*/_react["default"].createElement(StyledMapControlPanelHeader, null, isExport && logoComponent ? logoComponent : header ? /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      verticalAlign: 'middle'
    }
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: header
  })) : null, isExport ? null : /*#__PURE__*/_react["default"].createElement(_styledComponents2.IconRoundSmall, {
    className: "close-map-control-item",
    onClick: onClick
  }, /*#__PURE__*/_react["default"].createElement(_icons.Close, {
    height: "16px"
  }))), /*#__PURE__*/_react["default"].createElement(StyledMapControlPanelContent, null, children));
});

MapControlPanel.displayName = 'MapControlPanel';
MapLegendPanelFactory.deps = [];

function MapLegendPanelFactory() {
  var defaultActionIcons = {
    legend: _icons.Legend
  };
  /** @type {import('./map-control').MapLegendPanelComponent} */

  var MapLegendPanel = function MapLegendPanel(_ref6) {
    var layers = _ref6.layers,
        isActive = _ref6.isActive,
        scale = _ref6.scale,
        onToggleMenuPanel = _ref6.onToggleMenuPanel,
        isExport = _ref6.isExport,
        disableClose = _ref6.disableClose,
        logoComponent = _ref6.logoComponent,
        _ref6$actionIcons = _ref6.actionIcons,
        actionIcons = _ref6$actionIcons === void 0 ? defaultActionIcons : _ref6$actionIcons;
    return !isActive ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.MapControlButton, {
      key: 2,
      "data-tip": true,
      "data-for": "show-legend",
      className: "map-control-button show-legend",
      onClick: function onClick(e) {
        e.preventDefault();
        onToggleMenuPanel();
      }
    }, /*#__PURE__*/_react["default"].createElement(actionIcons.legend, {
      height: "22px"
    }), /*#__PURE__*/_react["default"].createElement(MapLegendTooltip, {
      id: "show-legend",
      message: 'tooltip.showLegend'
    })) : /*#__PURE__*/_react["default"].createElement(MapControlPanel, {
      scale: scale,
      header: 'header.layerLegend',
      onClick: onToggleMenuPanel,
      isExport: isExport,
      disableClose: disableClose,
      logoComponent: logoComponent
    }, /*#__PURE__*/_react["default"].createElement(_mapLegend["default"], {
      layers: layers
    }));
  };

  MapLegendPanel.displayName = 'MapControlPanel';
  return MapLegendPanel;
}

SplitMapButtonFactory.deps = [];

function SplitMapButtonFactory() {
  var defaultActionIcons = {
    "delete": _icons.Delete,
    split: _icons.Split
  };
  /** @type {import('./map-control').SplitMapButtonComponent} */

  var SplitMapButton = /*#__PURE__*/_react["default"].memo(function (_ref7) {
    var isSplit = _ref7.isSplit,
        mapIndex = _ref7.mapIndex,
        onToggleSplitMap = _ref7.onToggleSplitMap,
        _ref7$actionIcons = _ref7.actionIcons,
        actionIcons = _ref7$actionIcons === void 0 ? defaultActionIcons : _ref7$actionIcons;
    return /*#__PURE__*/_react["default"].createElement(_styledComponents2.MapControlButton, {
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
    }, isSplit ? /*#__PURE__*/_react["default"].createElement(actionIcons["delete"], {
      height: "18px"
    }) : /*#__PURE__*/_react["default"].createElement(actionIcons.split, {
      height: "18px"
    }), /*#__PURE__*/_react["default"].createElement(MapControlTooltip, {
      id: "action-toggle",
      message: isSplit ? 'tooltip.closePanel' : 'tooltip.switchToDualView'
    }));
  });

  SplitMapButton.displayName = 'SplitMapButton';
  return SplitMapButton;
}

Toggle3dButtonFactory.deps = [];

function Toggle3dButtonFactory() {
  var defaultActionIcons = {
    cube: _icons.Cube3d
  };
  /** @type {import('./map-control').Toggle3dButtonComponent} */

  var Toggle3dButton = /*#__PURE__*/_react["default"].memo(function (_ref8) {
    var dragRotate = _ref8.dragRotate,
        onTogglePerspective = _ref8.onTogglePerspective,
        _ref8$actionIcons = _ref8.actionIcons,
        actionIcons = _ref8$actionIcons === void 0 ? defaultActionIcons : _ref8$actionIcons;
    return /*#__PURE__*/_react["default"].createElement(_styledComponents2.MapControlButton, {
      onClick: function onClick(e) {
        e.preventDefault();
        onTogglePerspective();
      },
      active: dragRotate,
      "data-tip": true,
      "data-for": "action-3d"
    }, /*#__PURE__*/_react["default"].createElement(actionIcons.cube, {
      height: "22px"
    }), /*#__PURE__*/_react["default"].createElement(MapControlTooltip, {
      id: "action-3d",
      message: dragRotate ? 'tooltip.disable3DMap' : 'tooltip.3DMap'
    }));
  });

  Toggle3dButton.displayName = 'Toggle3dButton';
  return Toggle3dButton;
}

var StyledToolbar = (0, _styledComponents["default"])(_verticalToolbar["default"])(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  right: 32px;\n"])));
MapDrawPanelFactory.deps = [];

function MapDrawPanelFactory() {
  var defaultActionIcons = {
    visible: _icons.EyeSeen,
    hidden: _icons.EyeUnseen,
    polygon: _icons.DrawPolygon,
    cursor: _icons.CursorClick,
    innerPolygon: _icons.Polygon,
    rectangle: _icons.Rectangle
  };
  /** @type {import('./map-control').MapDrawPanelComponent} */

  var MapDrawPanel = /*#__PURE__*/_react["default"].memo(function (_ref9) {
    var editor = _ref9.editor,
        isActive = _ref9.isActive,
        onToggleMenuPanel = _ref9.onToggleMenuPanel,
        onSetEditorMode = _ref9.onSetEditorMode,
        onToggleEditorVisibility = _ref9.onToggleEditorVisibility,
        _ref9$actionIcons = _ref9.actionIcons,
        actionIcons = _ref9$actionIcons === void 0 ? defaultActionIcons : _ref9$actionIcons;
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "map-draw-controls",
      style: {
        position: 'relative'
      }
    }, isActive ? /*#__PURE__*/_react["default"].createElement(StyledToolbar, {
      show: isActive
    }, /*#__PURE__*/_react["default"].createElement(_toolbarItem["default"], {
      className: "edit-feature",
      onClick: function onClick() {
        return onSetEditorMode(_defaultSettings.EDITOR_MODES.EDIT);
      },
      label: "toolbar.select",
      icon: actionIcons.cursor,
      active: editor.mode === _defaultSettings.EDITOR_MODES.EDIT
    }), /*#__PURE__*/_react["default"].createElement(_toolbarItem["default"], {
      className: "draw-feature",
      onClick: function onClick() {
        return onSetEditorMode(_defaultSettings.EDITOR_MODES.DRAW_POLYGON);
      },
      label: "toolbar.polygon",
      icon: actionIcons.innerPolygon,
      active: editor.mode === _defaultSettings.EDITOR_MODES.DRAW_POLYGON
    }), /*#__PURE__*/_react["default"].createElement(_toolbarItem["default"], {
      className: "draw-rectangle",
      onClick: function onClick() {
        return onSetEditorMode(_defaultSettings.EDITOR_MODES.DRAW_RECTANGLE);
      },
      label: "toolbar.rectangle",
      icon: actionIcons.rectangle,
      active: editor.mode === _defaultSettings.EDITOR_MODES.DRAW_RECTANGLE
    }), /*#__PURE__*/_react["default"].createElement(_toolbarItem["default"], {
      className: "toggle-features",
      onClick: onToggleEditorVisibility,
      label: editor.visible ? 'toolbar.hide' : 'toolbar.show',
      icon: editor.visible ? actionIcons.visible : actionIcons.hidden
    })) : null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.MapControlButton, {
      onClick: function onClick(e) {
        e.preventDefault();
        onToggleMenuPanel();
      },
      active: isActive,
      "data-tip": true,
      "data-for": "map-draw"
    }, /*#__PURE__*/_react["default"].createElement(actionIcons.polygon, {
      height: "22px"
    }), /*#__PURE__*/_react["default"].createElement(MapControlTooltip, {
      id: "map-draw",
      message: "tooltip.DrawOnMap"
    })));
  });

  MapDrawPanel.displayName = 'MapDrawPanel';
  return MapDrawPanel;
}
/** @type {import('./map-control').LocalePanelComponent} */


var LocalePanel = /*#__PURE__*/_react["default"].memo(function (_ref10) {
  var availableLocales = _ref10.availableLocales,
      isActive = _ref10.isActive,
      onToggleMenuPanel = _ref10.onToggleMenuPanel,
      onSetLocale = _ref10.onSetLocale,
      activeLocale = _ref10.activeLocale,
      disableClose = _ref10.disableClose;
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
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      position: 'relative'
    }
  }, isActive ? /*#__PURE__*/_react["default"].createElement(StyledToolbar, {
    show: isActive
  }, availableLocales.map(function (locale) {
    return /*#__PURE__*/_react["default"].createElement(_toolbarItem["default"], {
      key: locale,
      onClick: function onClick() {
        return onClickItem(locale);
      },
      label: getLabel(locale),
      active: activeLocale === locale
    });
  })) : null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.MapControlButton, {
    onClick: onClickButton,
    active: isActive,
    "data-tip": true,
    "data-for": "locale",
    disableClose: disableClose
  }, activeLocale.toUpperCase(), /*#__PURE__*/_react["default"].createElement(MapControlTooltip, {
    id: "locale",
    message: "tooltip.selectLocale"
  })));
});

LocalePanel.displayName = 'LocalePanel';

var LegendLogo = /*#__PURE__*/_react["default"].createElement(_logo["default"], {
  version: false,
  appName: "kepler.gl"
});

MapControlFactory.deps = [MapDrawPanelFactory, Toggle3dButtonFactory, SplitMapButtonFactory, MapLegendPanelFactory];

function MapControlFactory(MapDrawPanel, Toggle3dButton, SplitMapButton, MapLegendPanel) {
  var MapControl = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(MapControl, _Component);

    var _super = _createSuper(MapControl);

    function MapControl() {
      var _this;

      (0, _classCallCheck2["default"])(this, MapControl);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
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
            locale = _this$props.locale,
            top = _this$props.top,
            logoComponent = _this$props.logoComponent;
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
        return /*#__PURE__*/_react["default"].createElement(StyledMapControl, {
          className: "map-control",
          top: top
        }, splitMap.show && readOnly !== true ? /*#__PURE__*/_react["default"].createElement(ActionPanel, {
          className: "split-map",
          key: 0
        }, /*#__PURE__*/_react["default"].createElement(SplitMapButton, {
          isSplit: isSplit,
          mapIndex: mapIndex,
          onToggleSplitMap: onToggleSplitMap
        })) : null, isSplit && visibleLayers.show && readOnly !== true ? /*#__PURE__*/_react["default"].createElement(ActionPanel, {
          className: "map-layers",
          key: 1
        }, /*#__PURE__*/_react["default"].createElement(LayerSelectorPanel, {
          items: this.layerPanelItemsSelector(this.props),
          onMapToggleLayer: onMapToggleLayer,
          isActive: visibleLayers.active,
          toggleMenuPanel: function toggleMenuPanel() {
            return onToggleMapControl('visibleLayers');
          },
          disableClose: visibleLayers.disableClose
        })) : null, toggle3d.show ? /*#__PURE__*/_react["default"].createElement(ActionPanel, {
          className: "toggle-3d",
          key: 2
        }, /*#__PURE__*/_react["default"].createElement(Toggle3dButton, {
          dragRotate: dragRotate,
          onTogglePerspective: onTogglePerspective
        })) : null, mapLegend.show ? /*#__PURE__*/_react["default"].createElement(ActionPanel, {
          className: "show-legend",
          key: 3
        }, /*#__PURE__*/_react["default"].createElement(MapLegendPanel, {
          layers: layers.filter(function (l) {
            return layersToRender[l.id];
          }),
          scale: scale,
          isExport: isExport,
          onMapToggleLayer: onMapToggleLayer,
          isActive: mapLegend.active,
          onToggleMenuPanel: function onToggleMenuPanel() {
            return onToggleMapControl('mapLegend');
          },
          disableClose: mapLegend.disableClose,
          logoComponent: logoComponent
        })) : null, mapDraw.show ? /*#__PURE__*/_react["default"].createElement(ActionPanel, {
          key: 4
        }, /*#__PURE__*/_react["default"].createElement(MapDrawPanel, {
          isActive: mapDraw.active && mapDraw.activeMapIndex === mapIndex,
          editor: editor,
          onToggleMenuPanel: function onToggleMenuPanel() {
            return onToggleMapControl('mapDraw');
          },
          onSetEditorMode: this.props.onSetEditorMode,
          onToggleEditorVisibility: this.props.onToggleEditorVisibility
        })) : null, mapLocale.show ? /*#__PURE__*/_react["default"].createElement(ActionPanel, {
          key: 5
        }, /*#__PURE__*/_react["default"].createElement(LocalePanel, {
          isActive: mapLocale.active,
          activeLocale: locale,
          availableLocales: Object.keys(_locales.LOCALE_CODES),
          onSetLocale: this.props.onSetLocale,
          onToggleMenuPanel: function onToggleMenuPanel() {
            return onToggleMapControl('mapLocale');
          },
          disableClose: mapLocale.disableClose
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
    logoComponent: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
    // optional
    readOnly: _propTypes["default"].bool,
    scale: _propTypes["default"].number,
    mapLayers: _propTypes["default"].object,
    editor: _propTypes["default"].object
  });
  (0, _defineProperty2["default"])(MapControl, "defaultProps", {
    isSplit: false,
    top: 0,
    mapIndex: 0,
    logoComponent: LegendLogo
  });
  MapControl.displayName = 'MapControl';
  return MapControl;
}

var _default = MapControlFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtY29udHJvbC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRNYXBDb250cm9sIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsIm1hcENvbnRyb2wiLCJwYWRkaW5nIiwidG9wIiwiU3R5bGVkTWFwQ29udHJvbEFjdGlvbiIsIlN0eWxlZE1hcENvbnRyb2xQYW5lbCIsIm1hcFBhbmVsQmFja2dyb3VuZENvbG9yIiwiU3R5bGVkTWFwQ29udHJvbFBhbmVsQ29udGVudCIsImF0dHJzIiwiY2xhc3NOYW1lIiwiZHJvcGRvd25TY3JvbGxCYXIiLCJ3aWR0aCIsIlN0eWxlZE1hcENvbnRyb2xQYW5lbEhlYWRlciIsIm1hcFBhbmVsSGVhZGVyQmFja2dyb3VuZENvbG9yIiwidGl0bGVUZXh0Q29sb3IiLCJBY3Rpb25QYW5lbCIsImNoaWxkcmVuIiwiZGlzcGxheU5hbWUiLCJNYXBDb250cm9sVG9vbHRpcCIsIlJlYWN0IiwibWVtbyIsImlkIiwibWVzc2FnZSIsIk1hcExlZ2VuZFRvb2x0aXAiLCJMYXllclNlbGVjdG9yUGFuZWwiLCJpdGVtcyIsIm9uTWFwVG9nZ2xlTGF5ZXIiLCJpc0FjdGl2ZSIsInRvZ2dsZU1lbnVQYW5lbCIsImRpc2FibGVDbG9zZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIk1hcENvbnRyb2xQYW5lbCIsImhlYWRlciIsIm9uQ2xpY2siLCJzY2FsZSIsImlzRXhwb3J0IiwibG9nb0NvbXBvbmVudCIsInRyYW5zZm9ybSIsIm1hcmdpbkJvdHRvbSIsInZlcnRpY2FsQWxpZ24iLCJNYXBMZWdlbmRQYW5lbEZhY3RvcnkiLCJkZXBzIiwiZGVmYXVsdEFjdGlvbkljb25zIiwibGVnZW5kIiwiTGVnZW5kIiwiTWFwTGVnZW5kUGFuZWwiLCJsYXllcnMiLCJvblRvZ2dsZU1lbnVQYW5lbCIsImFjdGlvbkljb25zIiwiU3BsaXRNYXBCdXR0b25GYWN0b3J5IiwiRGVsZXRlIiwic3BsaXQiLCJTcGxpdCIsIlNwbGl0TWFwQnV0dG9uIiwiaXNTcGxpdCIsIm1hcEluZGV4Iiwib25Ub2dnbGVTcGxpdE1hcCIsInVuZGVmaW5lZCIsIlRvZ2dsZTNkQnV0dG9uRmFjdG9yeSIsImN1YmUiLCJDdWJlM2QiLCJUb2dnbGUzZEJ1dHRvbiIsImRyYWdSb3RhdGUiLCJvblRvZ2dsZVBlcnNwZWN0aXZlIiwiU3R5bGVkVG9vbGJhciIsIlZlcnRpY2FsVG9vbGJhciIsIk1hcERyYXdQYW5lbEZhY3RvcnkiLCJ2aXNpYmxlIiwiRXllU2VlbiIsImhpZGRlbiIsIkV5ZVVuc2VlbiIsInBvbHlnb24iLCJEcmF3UG9seWdvbiIsImN1cnNvciIsIkN1cnNvckNsaWNrIiwiaW5uZXJQb2x5Z29uIiwiUG9seWdvbiIsInJlY3RhbmdsZSIsIlJlY3RhbmdsZSIsIk1hcERyYXdQYW5lbCIsImVkaXRvciIsIm9uU2V0RWRpdG9yTW9kZSIsIm9uVG9nZ2xlRWRpdG9yVmlzaWJpbGl0eSIsInBvc2l0aW9uIiwiRURJVE9SX01PREVTIiwiRURJVCIsIm1vZGUiLCJEUkFXX1BPTFlHT04iLCJEUkFXX1JFQ1RBTkdMRSIsIkxvY2FsZVBhbmVsIiwiYXZhaWxhYmxlTG9jYWxlcyIsIm9uU2V0TG9jYWxlIiwiYWN0aXZlTG9jYWxlIiwib25DbGlja0l0ZW0iLCJsb2NhbGUiLCJvbkNsaWNrQnV0dG9uIiwiZ2V0TGFiZWwiLCJtYXAiLCJ0b1VwcGVyQ2FzZSIsIkxlZ2VuZExvZ28iLCJNYXBDb250cm9sRmFjdG9yeSIsIk1hcENvbnRyb2wiLCJsYXllcnNUb1JlbmRlciIsImxheWVyU2VsZWN0b3IiLCJsYXllcnNUb1JlbmRlclNlbGVjdG9yIiwiZmlsdGVyIiwibCIsImNvbmZpZyIsImlzVmlzaWJsZSIsImxheWVyIiwibmFtZSIsImxhYmVsIiwibWFwQ29udHJvbHMiLCJvblRvZ2dsZU1hcENvbnRyb2wiLCJyZWFkT25seSIsInZpc2libGVMYXllcnMiLCJtYXBMZWdlbmQiLCJ0b2dnbGUzZCIsInNwbGl0TWFwIiwibWFwRHJhdyIsIm1hcExvY2FsZSIsInNob3ciLCJsYXllclBhbmVsSXRlbXNTZWxlY3RvciIsImFjdGl2ZSIsImFjdGl2ZU1hcEluZGV4IiwiT2JqZWN0Iiwia2V5cyIsIkxPQ0FMRV9DT0RFUyIsIkNvbXBvbmVudCIsImRhdGFzZXRzIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImJvb2wiLCJhcnJheU9mIiwibnVtYmVyIiwiZnVuYyIsInN0cmluZyIsIm9uZU9mVHlwZSIsImVsZW1lbnQiLCJtYXBMYXllcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBY0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsZ0JBQWdCLEdBQUdDLDZCQUFPQyxHQUFWLHdMQUVULFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsVUFBWixDQUF1QkMsT0FBM0I7QUFBQSxDQUZJLEVBSU4sVUFBQUgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0ksR0FBTixJQUFhLENBQWpCO0FBQUEsQ0FKQyxDQUF0Qjs7QUFRQSxJQUFNQyxzQkFBc0IsR0FBR1AsNkJBQU9DLEdBQVYsNkpBQTVCOztBQU1BLElBQU1PLHFCQUFxQixHQUFHUiw2QkFBT0MsR0FBVix5TEFDTCxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlNLHVCQUFoQjtBQUFBLENBREEsQ0FBM0I7O0FBU0EsSUFBTUMsNEJBQTRCLEdBQUdWLDZCQUFPQyxHQUFQLENBQVdVLEtBQVgsQ0FBaUI7QUFDcERDLEVBQUFBLFNBQVMsRUFBRTtBQUR5QyxDQUFqQixDQUFILHlMQUc5QixVQUFBVixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlVLGlCQUFoQjtBQUFBLENBSHlCLEVBTW5CLFVBQUFYLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsVUFBWixDQUF1QlUsS0FBM0I7QUFBQSxDQU5jLENBQWxDOztBQVVBLElBQU1DLDJCQUEyQixHQUFHZiw2QkFBT0MsR0FBUCxDQUFXVSxLQUFYLENBQWlCO0FBQ25EQyxFQUFBQSxTQUFTLEVBQUU7QUFEd0MsQ0FBakIsQ0FBSCxxVUFLWCxVQUFBVixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlhLDZCQUFoQjtBQUFBLENBTE0sRUFTdEIsVUFBQWQsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZYyxjQUFoQjtBQUFBLENBVGlCLENBQWpDOztBQWtCQSxJQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYztBQUFBLDRCQUFFTixTQUFGO0FBQUEsTUFBRUEsU0FBRiwrQkFBYyxFQUFkO0FBQUEsTUFBa0JPLFFBQWxCLFFBQWtCQSxRQUFsQjtBQUFBLHNCQUNsQixnQ0FBQyxzQkFBRDtBQUF3QixJQUFBLFNBQVMsRUFBRVA7QUFBbkMsS0FBK0NPLFFBQS9DLENBRGtCO0FBQUEsQ0FBcEI7O0FBSUFELFdBQVcsQ0FBQ0UsV0FBWixHQUEwQixhQUExQjtBQUVBOztBQUNBLElBQU1DLGlCQUFpQixnQkFBR0Msa0JBQU1DLElBQU4sQ0FBVztBQUFBLE1BQUVDLEVBQUYsU0FBRUEsRUFBRjtBQUFBLE1BQU1DLE9BQU4sU0FBTUEsT0FBTjtBQUFBLHNCQUNuQyxnQ0FBQywwQkFBRDtBQUFTLElBQUEsRUFBRSxFQUFFRCxFQUFiO0FBQWlCLElBQUEsS0FBSyxFQUFDLE1BQXZCO0FBQThCLElBQUEsTUFBTSxFQUFDO0FBQXJDLGtCQUNFLDJEQUNFLGdDQUFDLDhCQUFEO0FBQWtCLElBQUEsRUFBRSxFQUFFQztBQUF0QixJQURGLENBREYsQ0FEbUM7QUFBQSxDQUFYLENBQTFCOztBQVFBSixpQkFBaUIsQ0FBQ0QsV0FBbEIsR0FBZ0MsbUJBQWhDOztBQUVBLElBQU1NLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFRixFQUFGLFNBQUVBLEVBQUY7QUFBQSxNQUFNQyxPQUFOLFNBQU1BLE9BQU47QUFBQSxzQkFDdkIsZ0NBQUMsMEJBQUQ7QUFBUyxJQUFBLEVBQUUsRUFBRUQsRUFBYjtBQUFpQixJQUFBLEtBQUssRUFBQyxNQUF2QjtBQUE4QixJQUFBLE1BQU0sRUFBQztBQUFyQyxrQkFDRSwyREFDRSxnQ0FBQyw4QkFBRDtBQUFrQixJQUFBLEVBQUUsRUFBRUM7QUFBdEIsSUFERixDQURGLENBRHVCO0FBQUEsQ0FBekI7QUFRQTs7O0FBQ0EsSUFBTUUsa0JBQWtCLGdCQUFHTCxrQkFBTUMsSUFBTixDQUN6QjtBQUFBLE1BQUVLLEtBQUYsU0FBRUEsS0FBRjtBQUFBLE1BQVNDLGdCQUFULFNBQVNBLGdCQUFUO0FBQUEsTUFBMkJDLFFBQTNCLFNBQTJCQSxRQUEzQjtBQUFBLE1BQXFDQyxlQUFyQyxTQUFxQ0EsZUFBckM7QUFBQSxNQUFzREMsWUFBdEQsU0FBc0RBLFlBQXREO0FBQUEsU0FDRSxDQUFDRixRQUFELGdCQUNHLGdDQUFDLG1DQUFEO0FBQ0MsSUFBQSxHQUFHLEVBQUUsQ0FETjtBQUVDLElBQUEsT0FBTyxFQUFFLGlCQUFBRyxDQUFDLEVBQUk7QUFDWkEsTUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0FILE1BQUFBLGVBQWU7QUFDaEIsS0FMRjtBQU1DLElBQUEsU0FBUyxFQUFDLGlDQU5YO0FBT0Msb0JBUEQ7QUFRQyxnQkFBUztBQVJWLGtCQVVDLGdDQUFDLGFBQUQ7QUFBUSxJQUFBLE1BQU0sRUFBQztBQUFmLElBVkQsZUFXQyxnQ0FBQyxpQkFBRDtBQUNFLElBQUEsRUFBRSxFQUFDLGNBREw7QUFFRSxJQUFBLE9BQU8sRUFBRUQsUUFBUSxHQUFHLHdCQUFILEdBQThCO0FBRmpELElBWEQsQ0FESCxnQkFrQkcsZ0NBQUMsZUFBRDtBQUNDLElBQUEsTUFBTSxFQUFDLHNCQURSO0FBRUMsSUFBQSxPQUFPLEVBQUVDLGVBRlY7QUFHQyxJQUFBLFlBQVksRUFBRUM7QUFIZixrQkFLQyxnQ0FBQyw0QkFBRDtBQUFrQixJQUFBLE1BQU0sRUFBRUosS0FBMUI7QUFBaUMsSUFBQSxnQkFBZ0IsRUFBRUM7QUFBbkQsSUFMRCxDQW5CTDtBQUFBLENBRHlCLENBQTNCOztBQThCQUYsa0JBQWtCLENBQUNQLFdBQW5CLEdBQWlDLG9CQUFqQztBQUVBOztBQUNBLElBQU1lLGVBQWUsZ0JBQUdiLGtCQUFNQyxJQUFOLENBQ3RCO0FBQUEsTUFBRUosUUFBRixTQUFFQSxRQUFGO0FBQUEsTUFBWWlCLE1BQVosU0FBWUEsTUFBWjtBQUFBLE1BQW9CQyxPQUFwQixTQUFvQkEsT0FBcEI7QUFBQSwwQkFBNkJDLEtBQTdCO0FBQUEsTUFBNkJBLEtBQTdCLDRCQUFxQyxDQUFyQztBQUFBLE1BQXdDQyxRQUF4QyxTQUF3Q0EsUUFBeEM7QUFBQSxpQ0FBa0RQLFlBQWxEO0FBQUEsTUFBa0RBLFlBQWxELG1DQUFpRSxLQUFqRTtBQUFBLE1BQXdFUSxhQUF4RSxTQUF3RUEsYUFBeEU7QUFBQSxzQkFDRSxnQ0FBQyxxQkFBRDtBQUNFLElBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLFNBQVMsa0JBQVdILEtBQVgsTUFESjtBQUVMSSxNQUFBQSxZQUFZLEVBQUU7QUFGVDtBQURULGtCQU1FLGdDQUFDLDJCQUFELFFBQ0dILFFBQVEsSUFBSUMsYUFBWixHQUNDQSxhQURELEdBRUdKLE1BQU0sZ0JBQ1I7QUFBTSxJQUFBLEtBQUssRUFBRTtBQUFDTyxNQUFBQSxhQUFhLEVBQUU7QUFBaEI7QUFBYixrQkFDRSxnQ0FBQyw4QkFBRDtBQUFrQixJQUFBLEVBQUUsRUFBRVA7QUFBdEIsSUFERixDQURRLEdBSU4sSUFQTixFQVFHRyxRQUFRLEdBQUcsSUFBSCxnQkFDUCxnQ0FBQyxpQ0FBRDtBQUFnQixJQUFBLFNBQVMsRUFBQyx3QkFBMUI7QUFBbUQsSUFBQSxPQUFPLEVBQUVGO0FBQTVELGtCQUNFLGdDQUFDLFlBQUQ7QUFBTyxJQUFBLE1BQU0sRUFBQztBQUFkLElBREYsQ0FUSixDQU5GLGVBb0JFLGdDQUFDLDRCQUFELFFBQStCbEIsUUFBL0IsQ0FwQkYsQ0FERjtBQUFBLENBRHNCLENBQXhCOztBQTJCQWdCLGVBQWUsQ0FBQ2YsV0FBaEIsR0FBOEIsaUJBQTlCO0FBRUF3QixxQkFBcUIsQ0FBQ0MsSUFBdEIsR0FBNkIsRUFBN0I7O0FBQ08sU0FBU0QscUJBQVQsR0FBaUM7QUFDdEMsTUFBTUUsa0JBQWtCLEdBQUc7QUFDekJDLElBQUFBLE1BQU0sRUFBRUM7QUFEaUIsR0FBM0I7QUFHQTs7QUFDQSxNQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCO0FBQUEsUUFDckJDLE1BRHFCLFNBQ3JCQSxNQURxQjtBQUFBLFFBRXJCcEIsUUFGcUIsU0FFckJBLFFBRnFCO0FBQUEsUUFHckJRLEtBSHFCLFNBR3JCQSxLQUhxQjtBQUFBLFFBSXJCYSxpQkFKcUIsU0FJckJBLGlCQUpxQjtBQUFBLFFBS3JCWixRQUxxQixTQUtyQkEsUUFMcUI7QUFBQSxRQU1yQlAsWUFOcUIsU0FNckJBLFlBTnFCO0FBQUEsUUFPckJRLGFBUHFCLFNBT3JCQSxhQVBxQjtBQUFBLGtDQVFyQlksV0FScUI7QUFBQSxRQVFyQkEsV0FScUIsa0NBUVBOLGtCQVJPO0FBQUEsV0FVckIsQ0FBQ2hCLFFBQUQsZ0JBQ0csZ0NBQUMsbUNBQUQ7QUFDQyxNQUFBLEdBQUcsRUFBRSxDQUROO0FBRUMsc0JBRkQ7QUFHQyxrQkFBUyxhQUhWO0FBSUMsTUFBQSxTQUFTLEVBQUMsZ0NBSlg7QUFLQyxNQUFBLE9BQU8sRUFBRSxpQkFBQUcsQ0FBQyxFQUFJO0FBQ1pBLFFBQUFBLENBQUMsQ0FBQ0MsY0FBRjtBQUNBaUIsUUFBQUEsaUJBQWlCO0FBQ2xCO0FBUkYsb0JBVUMsZ0NBQUMsV0FBRCxDQUFhLE1BQWI7QUFBb0IsTUFBQSxNQUFNLEVBQUM7QUFBM0IsTUFWRCxlQVdDLGdDQUFDLGdCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFDLGFBQXJCO0FBQW1DLE1BQUEsT0FBTyxFQUFFO0FBQTVDLE1BWEQsQ0FESCxnQkFlRyxnQ0FBQyxlQUFEO0FBQ0MsTUFBQSxLQUFLLEVBQUViLEtBRFI7QUFFQyxNQUFBLE1BQU0sRUFBRSxvQkFGVDtBQUdDLE1BQUEsT0FBTyxFQUFFYSxpQkFIVjtBQUlDLE1BQUEsUUFBUSxFQUFFWixRQUpYO0FBS0MsTUFBQSxZQUFZLEVBQUVQLFlBTGY7QUFNQyxNQUFBLGFBQWEsRUFBRVE7QUFOaEIsb0JBUUMsZ0NBQUMscUJBQUQ7QUFBVyxNQUFBLE1BQU0sRUFBRVU7QUFBbkIsTUFSRCxDQXpCa0I7QUFBQSxHQUF2Qjs7QUFxQ0FELEVBQUFBLGNBQWMsQ0FBQzdCLFdBQWYsR0FBNkIsaUJBQTdCO0FBQ0EsU0FBTzZCLGNBQVA7QUFDRDs7QUFFREkscUJBQXFCLENBQUNSLElBQXRCLEdBQTZCLEVBQTdCOztBQUNPLFNBQVNRLHFCQUFULEdBQWlDO0FBQ3RDLE1BQU1QLGtCQUFrQixHQUFHO0FBQ3pCLGNBQVFRLGFBRGlCO0FBRXpCQyxJQUFBQSxLQUFLLEVBQUVDO0FBRmtCLEdBQTNCO0FBSUE7O0FBQ0EsTUFBTUMsY0FBYyxnQkFBR25DLGtCQUFNQyxJQUFOLENBQ3JCO0FBQUEsUUFBRW1DLE9BQUYsU0FBRUEsT0FBRjtBQUFBLFFBQVdDLFFBQVgsU0FBV0EsUUFBWDtBQUFBLFFBQXFCQyxnQkFBckIsU0FBcUJBLGdCQUFyQjtBQUFBLGtDQUF1Q1IsV0FBdkM7QUFBQSxRQUF1Q0EsV0FBdkMsa0NBQXFETixrQkFBckQ7QUFBQSx3QkFDRSxnQ0FBQyxtQ0FBRDtBQUNFLE1BQUEsTUFBTSxFQUFFWSxPQURWO0FBRUUsTUFBQSxPQUFPLEVBQUUsaUJBQUF6QixDQUFDLEVBQUk7QUFDWkEsUUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0EwQixRQUFBQSxnQkFBZ0IsQ0FBQ0YsT0FBTyxHQUFHQyxRQUFILEdBQWNFLFNBQXRCLENBQWhCO0FBQ0QsT0FMSDtBQU1FLE1BQUEsR0FBRyxrQkFBV0gsT0FBWCxDQU5MO0FBT0UsTUFBQSxTQUFTLEVBQUUsNEJBQVcsb0JBQVgsRUFBaUMsV0FBakMsRUFBOEM7QUFBQyxxQkFBYUE7QUFBZCxPQUE5QyxDQVBiO0FBUUUsc0JBUkY7QUFTRSxrQkFBUztBQVRYLE9BV0dBLE9BQU8sZ0JBQUcsZ0NBQUMsV0FBRDtBQUFvQixNQUFBLE1BQU0sRUFBQztBQUEzQixNQUFILGdCQUEwQyxnQ0FBQyxXQUFELENBQWEsS0FBYjtBQUFtQixNQUFBLE1BQU0sRUFBQztBQUExQixNQVhwRCxlQVlFLGdDQUFDLGlCQUFEO0FBQ0UsTUFBQSxFQUFFLEVBQUMsZUFETDtBQUVFLE1BQUEsT0FBTyxFQUFFQSxPQUFPLEdBQUcsb0JBQUgsR0FBMEI7QUFGNUMsTUFaRixDQURGO0FBQUEsR0FEcUIsQ0FBdkI7O0FBc0JBRCxFQUFBQSxjQUFjLENBQUNyQyxXQUFmLEdBQTZCLGdCQUE3QjtBQUNBLFNBQU9xQyxjQUFQO0FBQ0Q7O0FBRURLLHFCQUFxQixDQUFDakIsSUFBdEIsR0FBNkIsRUFBN0I7O0FBQ08sU0FBU2lCLHFCQUFULEdBQWlDO0FBQ3RDLE1BQU1oQixrQkFBa0IsR0FBRztBQUN6QmlCLElBQUFBLElBQUksRUFBRUM7QUFEbUIsR0FBM0I7QUFHQTs7QUFDQSxNQUFNQyxjQUFjLGdCQUFHM0Msa0JBQU1DLElBQU4sQ0FDckI7QUFBQSxRQUFFMkMsVUFBRixTQUFFQSxVQUFGO0FBQUEsUUFBY0MsbUJBQWQsU0FBY0EsbUJBQWQ7QUFBQSxrQ0FBbUNmLFdBQW5DO0FBQUEsUUFBbUNBLFdBQW5DLGtDQUFpRE4sa0JBQWpEO0FBQUEsd0JBQ0UsZ0NBQUMsbUNBQUQ7QUFDRSxNQUFBLE9BQU8sRUFBRSxpQkFBQWIsQ0FBQyxFQUFJO0FBQ1pBLFFBQUFBLENBQUMsQ0FBQ0MsY0FBRjtBQUNBaUMsUUFBQUEsbUJBQW1CO0FBQ3BCLE9BSkg7QUFLRSxNQUFBLE1BQU0sRUFBRUQsVUFMVjtBQU1FLHNCQU5GO0FBT0Usa0JBQVM7QUFQWCxvQkFTRSxnQ0FBQyxXQUFELENBQWEsSUFBYjtBQUFrQixNQUFBLE1BQU0sRUFBQztBQUF6QixNQVRGLGVBVUUsZ0NBQUMsaUJBQUQ7QUFDRSxNQUFBLEVBQUUsRUFBQyxXQURMO0FBRUUsTUFBQSxPQUFPLEVBQUVBLFVBQVUsR0FBRyxzQkFBSCxHQUE0QjtBQUZqRCxNQVZGLENBREY7QUFBQSxHQURxQixDQUF2Qjs7QUFvQkFELEVBQUFBLGNBQWMsQ0FBQzdDLFdBQWYsR0FBNkIsZ0JBQTdCO0FBQ0EsU0FBTzZDLGNBQVA7QUFDRDs7QUFDRCxJQUFNRyxhQUFhLEdBQUcsa0NBQU9DLDJCQUFQLENBQUgsaUlBQW5CO0FBS0FDLG1CQUFtQixDQUFDekIsSUFBcEIsR0FBMkIsRUFBM0I7O0FBQ08sU0FBU3lCLG1CQUFULEdBQStCO0FBQ3BDLE1BQU14QixrQkFBa0IsR0FBRztBQUN6QnlCLElBQUFBLE9BQU8sRUFBRUMsY0FEZ0I7QUFFekJDLElBQUFBLE1BQU0sRUFBRUMsZ0JBRmlCO0FBR3pCQyxJQUFBQSxPQUFPLEVBQUVDLGtCQUhnQjtBQUl6QkMsSUFBQUEsTUFBTSxFQUFFQyxrQkFKaUI7QUFLekJDLElBQUFBLFlBQVksRUFBRUMsY0FMVztBQU16QkMsSUFBQUEsU0FBUyxFQUFFQztBQU5jLEdBQTNCO0FBUUE7O0FBQ0EsTUFBTUMsWUFBWSxnQkFBRzdELGtCQUFNQyxJQUFOLENBQ25CLGlCQU9NO0FBQUEsUUFOSjZELE1BTUksU0FOSkEsTUFNSTtBQUFBLFFBTEp0RCxRQUtJLFNBTEpBLFFBS0k7QUFBQSxRQUpKcUIsaUJBSUksU0FKSkEsaUJBSUk7QUFBQSxRQUhKa0MsZUFHSSxTQUhKQSxlQUdJO0FBQUEsUUFGSkMsd0JBRUksU0FGSkEsd0JBRUk7QUFBQSxrQ0FESmxDLFdBQ0k7QUFBQSxRQURKQSxXQUNJLGtDQURVTixrQkFDVjtBQUNKLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUMsbUJBQWY7QUFBbUMsTUFBQSxLQUFLLEVBQUU7QUFBQ3lDLFFBQUFBLFFBQVEsRUFBRTtBQUFYO0FBQTFDLE9BQ0d6RCxRQUFRLGdCQUNQLGdDQUFDLGFBQUQ7QUFBZSxNQUFBLElBQUksRUFBRUE7QUFBckIsb0JBQ0UsZ0NBQUMsdUJBQUQ7QUFDRSxNQUFBLFNBQVMsRUFBQyxjQURaO0FBRUUsTUFBQSxPQUFPLEVBQUU7QUFBQSxlQUFNdUQsZUFBZSxDQUFDRyw4QkFBYUMsSUFBZCxDQUFyQjtBQUFBLE9BRlg7QUFHRSxNQUFBLEtBQUssRUFBQyxnQkFIUjtBQUlFLE1BQUEsSUFBSSxFQUFFckMsV0FBVyxDQUFDeUIsTUFKcEI7QUFLRSxNQUFBLE1BQU0sRUFBRU8sTUFBTSxDQUFDTSxJQUFQLEtBQWdCRiw4QkFBYUM7QUFMdkMsTUFERixlQVFFLGdDQUFDLHVCQUFEO0FBQ0UsTUFBQSxTQUFTLEVBQUMsY0FEWjtBQUVFLE1BQUEsT0FBTyxFQUFFO0FBQUEsZUFBTUosZUFBZSxDQUFDRyw4QkFBYUcsWUFBZCxDQUFyQjtBQUFBLE9BRlg7QUFHRSxNQUFBLEtBQUssRUFBQyxpQkFIUjtBQUlFLE1BQUEsSUFBSSxFQUFFdkMsV0FBVyxDQUFDMkIsWUFKcEI7QUFLRSxNQUFBLE1BQU0sRUFBRUssTUFBTSxDQUFDTSxJQUFQLEtBQWdCRiw4QkFBYUc7QUFMdkMsTUFSRixlQWVFLGdDQUFDLHVCQUFEO0FBQ0UsTUFBQSxTQUFTLEVBQUMsZ0JBRFo7QUFFRSxNQUFBLE9BQU8sRUFBRTtBQUFBLGVBQU1OLGVBQWUsQ0FBQ0csOEJBQWFJLGNBQWQsQ0FBckI7QUFBQSxPQUZYO0FBR0UsTUFBQSxLQUFLLEVBQUMsbUJBSFI7QUFJRSxNQUFBLElBQUksRUFBRXhDLFdBQVcsQ0FBQzZCLFNBSnBCO0FBS0UsTUFBQSxNQUFNLEVBQUVHLE1BQU0sQ0FBQ00sSUFBUCxLQUFnQkYsOEJBQWFJO0FBTHZDLE1BZkYsZUFzQkUsZ0NBQUMsdUJBQUQ7QUFDRSxNQUFBLFNBQVMsRUFBQyxpQkFEWjtBQUVFLE1BQUEsT0FBTyxFQUFFTix3QkFGWDtBQUdFLE1BQUEsS0FBSyxFQUFFRixNQUFNLENBQUNiLE9BQVAsR0FBaUIsY0FBakIsR0FBa0MsY0FIM0M7QUFJRSxNQUFBLElBQUksRUFBRWEsTUFBTSxDQUFDYixPQUFQLEdBQWlCbkIsV0FBVyxDQUFDbUIsT0FBN0IsR0FBdUNuQixXQUFXLENBQUNxQjtBQUozRCxNQXRCRixDQURPLEdBOEJMLElBL0JOLGVBZ0NFLGdDQUFDLG1DQUFEO0FBQ0UsTUFBQSxPQUFPLEVBQUUsaUJBQUF4QyxDQUFDLEVBQUk7QUFDWkEsUUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0FpQixRQUFBQSxpQkFBaUI7QUFDbEIsT0FKSDtBQUtFLE1BQUEsTUFBTSxFQUFFckIsUUFMVjtBQU1FLHNCQU5GO0FBT0Usa0JBQVM7QUFQWCxvQkFTRSxnQ0FBQyxXQUFELENBQWEsT0FBYjtBQUFxQixNQUFBLE1BQU0sRUFBQztBQUE1QixNQVRGLGVBVUUsZ0NBQUMsaUJBQUQ7QUFBbUIsTUFBQSxFQUFFLEVBQUMsVUFBdEI7QUFBaUMsTUFBQSxPQUFPLEVBQUM7QUFBekMsTUFWRixDQWhDRixDQURGO0FBK0NELEdBeERrQixDQUFyQjs7QUEyREFxRCxFQUFBQSxZQUFZLENBQUMvRCxXQUFiLEdBQTJCLGNBQTNCO0FBQ0EsU0FBTytELFlBQVA7QUFDRDtBQUVEOzs7QUFDQSxJQUFNVSxXQUFXLGdCQUFHdkUsa0JBQU1DLElBQU4sQ0FDbEIsa0JBQThGO0FBQUEsTUFBNUZ1RSxnQkFBNEYsVUFBNUZBLGdCQUE0RjtBQUFBLE1BQTFFaEUsUUFBMEUsVUFBMUVBLFFBQTBFO0FBQUEsTUFBaEVxQixpQkFBZ0UsVUFBaEVBLGlCQUFnRTtBQUFBLE1BQTdDNEMsV0FBNkMsVUFBN0NBLFdBQTZDO0FBQUEsTUFBaENDLFlBQWdDLFVBQWhDQSxZQUFnQztBQUFBLE1BQWxCaEUsWUFBa0IsVUFBbEJBLFlBQWtCO0FBQzVGLE1BQU1pRSxXQUFXLEdBQUcsd0JBQ2xCLFVBQUFDLE1BQU0sRUFBSTtBQUNSSCxJQUFBQSxXQUFXLENBQUNHLE1BQUQsQ0FBWDtBQUNELEdBSGlCLEVBSWxCLENBQUNILFdBQUQsQ0FKa0IsQ0FBcEI7QUFPQSxNQUFNSSxhQUFhLEdBQUcsd0JBQ3BCLFVBQUFsRSxDQUFDLEVBQUk7QUFDSEEsSUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0FpQixJQUFBQSxpQkFBaUI7QUFDbEIsR0FKbUIsRUFLcEIsQ0FBQ0EsaUJBQUQsQ0FMb0IsQ0FBdEI7QUFPQSxNQUFNaUQsUUFBUSxHQUFHLHdCQUFZLFVBQUFGLE1BQU07QUFBQSw2QkFBZUEsTUFBZjtBQUFBLEdBQWxCLEVBQTJDLEVBQTNDLENBQWpCO0FBRUEsc0JBQ0U7QUFBSyxJQUFBLEtBQUssRUFBRTtBQUFDWCxNQUFBQSxRQUFRLEVBQUU7QUFBWDtBQUFaLEtBQ0d6RCxRQUFRLGdCQUNQLGdDQUFDLGFBQUQ7QUFBZSxJQUFBLElBQUksRUFBRUE7QUFBckIsS0FDR2dFLGdCQUFnQixDQUFDTyxHQUFqQixDQUFxQixVQUFBSCxNQUFNO0FBQUEsd0JBQzFCLGdDQUFDLHVCQUFEO0FBQ0UsTUFBQSxHQUFHLEVBQUVBLE1BRFA7QUFFRSxNQUFBLE9BQU8sRUFBRTtBQUFBLGVBQU1ELFdBQVcsQ0FBQ0MsTUFBRCxDQUFqQjtBQUFBLE9BRlg7QUFHRSxNQUFBLEtBQUssRUFBRUUsUUFBUSxDQUFDRixNQUFELENBSGpCO0FBSUUsTUFBQSxNQUFNLEVBQUVGLFlBQVksS0FBS0U7QUFKM0IsTUFEMEI7QUFBQSxHQUEzQixDQURILENBRE8sR0FXTCxJQVpOLGVBYUUsZ0NBQUMsbUNBQUQ7QUFDRSxJQUFBLE9BQU8sRUFBRUMsYUFEWDtBQUVFLElBQUEsTUFBTSxFQUFFckUsUUFGVjtBQUdFLG9CQUhGO0FBSUUsZ0JBQVMsUUFKWDtBQUtFLElBQUEsWUFBWSxFQUFFRTtBQUxoQixLQU9HZ0UsWUFBWSxDQUFDTSxXQUFiLEVBUEgsZUFRRSxnQ0FBQyxpQkFBRDtBQUFtQixJQUFBLEVBQUUsRUFBQyxRQUF0QjtBQUErQixJQUFBLE9BQU8sRUFBQztBQUF2QyxJQVJGLENBYkYsQ0FERjtBQTBCRCxDQTVDaUIsQ0FBcEI7O0FBK0NBVCxXQUFXLENBQUN6RSxXQUFaLEdBQTBCLGFBQTFCOztBQUVBLElBQU1tRixVQUFVLGdCQUFHLGdDQUFDLGdCQUFEO0FBQWMsRUFBQSxPQUFPLEVBQUUsS0FBdkI7QUFBOEIsRUFBQSxPQUFPLEVBQUM7QUFBdEMsRUFBbkI7O0FBQ0FDLGlCQUFpQixDQUFDM0QsSUFBbEIsR0FBeUIsQ0FDdkJ5QixtQkFEdUIsRUFFdkJSLHFCQUZ1QixFQUd2QlQscUJBSHVCLEVBSXZCVCxxQkFKdUIsQ0FBekI7O0FBTUEsU0FBUzRELGlCQUFULENBQTJCckIsWUFBM0IsRUFBeUNsQixjQUF6QyxFQUF5RFIsY0FBekQsRUFBeUVSLGNBQXpFLEVBQXlGO0FBQUEsTUFDakZ3RCxVQURpRjtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsd0dBa0NyRSxVQUFBdkcsS0FBSztBQUFBLGVBQUlBLEtBQUssQ0FBQ2dELE1BQVY7QUFBQSxPQWxDZ0U7QUFBQSxpSEFtQzVELFVBQUFoRCxLQUFLO0FBQUEsZUFBSUEsS0FBSyxDQUFDd0csY0FBVjtBQUFBLE9BbkN1RDtBQUFBLGtIQW9DM0QsOEJBQ3hCLE1BQUtDLGFBRG1CLEVBRXhCLE1BQUtDLHNCQUZtQixFQUd4QixVQUFDMUQsTUFBRCxFQUFTd0QsY0FBVDtBQUFBLGVBQ0V4RCxNQUFNLENBQ0gyRCxNQURILENBQ1UsVUFBQUMsQ0FBQztBQUFBLGlCQUFJQSxDQUFDLENBQUNDLE1BQUYsQ0FBU0MsU0FBYjtBQUFBLFNBRFgsRUFFR1gsR0FGSCxDQUVPLFVBQUFZLEtBQUs7QUFBQSxpQkFBSztBQUNiekYsWUFBQUEsRUFBRSxFQUFFeUYsS0FBSyxDQUFDekYsRUFERztBQUViMEYsWUFBQUEsSUFBSSxFQUFFRCxLQUFLLENBQUNGLE1BQU4sQ0FBYUksS0FGTjtBQUdiO0FBQ0FILFlBQUFBLFNBQVMsRUFBRU4sY0FBYyxDQUFDTyxLQUFLLENBQUN6RixFQUFQO0FBSlosV0FBTDtBQUFBLFNBRlosQ0FERjtBQUFBLE9BSHdCLENBcEMyRDtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGFBa0RyRixrQkFBUztBQUFBLDBCQW1CSCxLQUFLdEIsS0FuQkY7QUFBQSxZQUVMZ0UsVUFGSyxlQUVMQSxVQUZLO0FBQUEsWUFHTGhCLE1BSEssZUFHTEEsTUFISztBQUFBLFlBSUx3RCxjQUpLLGVBSUxBLGNBSks7QUFBQSxZQUtMaEQsT0FMSyxlQUtMQSxPQUxLO0FBQUEsWUFNTG5CLFFBTkssZUFNTEEsUUFOSztBQUFBLFlBT0xvQixRQVBLLGVBT0xBLFFBUEs7QUFBQSxZQVFMeUQsV0FSSyxlQVFMQSxXQVJLO0FBQUEsWUFTTGpELG1CQVRLLGVBU0xBLG1CQVRLO0FBQUEsWUFVTFAsZ0JBVkssZUFVTEEsZ0JBVks7QUFBQSxZQVdML0IsZ0JBWEssZUFXTEEsZ0JBWEs7QUFBQSxZQVlMd0Ysa0JBWkssZUFZTEEsa0JBWks7QUFBQSxZQWFMakMsTUFiSyxlQWFMQSxNQWJLO0FBQUEsWUFjTDlDLEtBZEssZUFjTEEsS0FkSztBQUFBLFlBZUxnRixRQWZLLGVBZUxBLFFBZks7QUFBQSxZQWdCTHBCLE1BaEJLLGVBZ0JMQSxNQWhCSztBQUFBLFlBaUJMNUYsR0FqQkssZUFpQkxBLEdBakJLO0FBQUEsWUFrQkxrQyxhQWxCSyxlQWtCTEEsYUFsQks7QUFBQSxvQ0E0Qkg0RSxXQTVCRyxDQXNCTEcsYUF0Qks7QUFBQSxZQXNCTEEsYUF0Qkssc0NBc0JXLEVBdEJYO0FBQUEsb0NBNEJISCxXQTVCRyxDQXVCTEksU0F2Qks7QUFBQSxZQXVCTEEsU0F2Qkssc0NBdUJPLEVBdkJQO0FBQUEsb0NBNEJISixXQTVCRyxDQXdCTEssUUF4Qks7QUFBQSxZQXdCTEEsUUF4Qkssc0NBd0JNLEVBeEJOO0FBQUEsb0NBNEJITCxXQTVCRyxDQXlCTE0sUUF6Qks7QUFBQSxZQXlCTEEsUUF6Qkssc0NBeUJNLEVBekJOO0FBQUEsbUNBNEJITixXQTVCRyxDQTBCTE8sT0ExQks7QUFBQSxZQTBCTEEsT0ExQksscUNBMEJLLEVBMUJMO0FBQUEsb0NBNEJIUCxXQTVCRyxDQTJCTFEsU0EzQks7QUFBQSxZQTJCTEEsU0EzQkssc0NBMkJPLEVBM0JQO0FBOEJQLDRCQUNFLGdDQUFDLGdCQUFEO0FBQWtCLFVBQUEsU0FBUyxFQUFDLGFBQTVCO0FBQTBDLFVBQUEsR0FBRyxFQUFFdEg7QUFBL0MsV0FFR29ILFFBQVEsQ0FBQ0csSUFBVCxJQUFpQlAsUUFBUSxLQUFLLElBQTlCLGdCQUNDLGdDQUFDLFdBQUQ7QUFBYSxVQUFBLFNBQVMsRUFBQyxXQUF2QjtBQUFtQyxVQUFBLEdBQUcsRUFBRTtBQUF4Qyx3QkFDRSxnQ0FBQyxjQUFEO0FBQ0UsVUFBQSxPQUFPLEVBQUU1RCxPQURYO0FBRUUsVUFBQSxRQUFRLEVBQUVDLFFBRlo7QUFHRSxVQUFBLGdCQUFnQixFQUFFQztBQUhwQixVQURGLENBREQsR0FRRyxJQVZOLEVBYUdGLE9BQU8sSUFBSTZELGFBQWEsQ0FBQ00sSUFBekIsSUFBaUNQLFFBQVEsS0FBSyxJQUE5QyxnQkFDQyxnQ0FBQyxXQUFEO0FBQWEsVUFBQSxTQUFTLEVBQUMsWUFBdkI7QUFBb0MsVUFBQSxHQUFHLEVBQUU7QUFBekMsd0JBQ0UsZ0NBQUMsa0JBQUQ7QUFDRSxVQUFBLEtBQUssRUFBRSxLQUFLUSx1QkFBTCxDQUE2QixLQUFLNUgsS0FBbEMsQ0FEVDtBQUVFLFVBQUEsZ0JBQWdCLEVBQUUyQixnQkFGcEI7QUFHRSxVQUFBLFFBQVEsRUFBRTBGLGFBQWEsQ0FBQ1EsTUFIMUI7QUFJRSxVQUFBLGVBQWUsRUFBRTtBQUFBLG1CQUFNVixrQkFBa0IsQ0FBQyxlQUFELENBQXhCO0FBQUEsV0FKbkI7QUFLRSxVQUFBLFlBQVksRUFBRUUsYUFBYSxDQUFDdkY7QUFMOUIsVUFERixDQURELEdBVUcsSUF2Qk4sRUEwQkd5RixRQUFRLENBQUNJLElBQVQsZ0JBQ0MsZ0NBQUMsV0FBRDtBQUFhLFVBQUEsU0FBUyxFQUFDLFdBQXZCO0FBQW1DLFVBQUEsR0FBRyxFQUFFO0FBQXhDLHdCQUNFLGdDQUFDLGNBQUQ7QUFBZ0IsVUFBQSxVQUFVLEVBQUUzRCxVQUE1QjtBQUF3QyxVQUFBLG1CQUFtQixFQUFFQztBQUE3RCxVQURGLENBREQsR0FJRyxJQTlCTixFQWlDR3FELFNBQVMsQ0FBQ0ssSUFBVixnQkFDQyxnQ0FBQyxXQUFEO0FBQWEsVUFBQSxTQUFTLEVBQUMsYUFBdkI7QUFBcUMsVUFBQSxHQUFHLEVBQUU7QUFBMUMsd0JBQ0UsZ0NBQUMsY0FBRDtBQUNFLFVBQUEsTUFBTSxFQUFFM0UsTUFBTSxDQUFDMkQsTUFBUCxDQUFjLFVBQUFDLENBQUM7QUFBQSxtQkFBSUosY0FBYyxDQUFDSSxDQUFDLENBQUN0RixFQUFILENBQWxCO0FBQUEsV0FBZixDQURWO0FBRUUsVUFBQSxLQUFLLEVBQUVjLEtBRlQ7QUFHRSxVQUFBLFFBQVEsRUFBRUMsUUFIWjtBQUlFLFVBQUEsZ0JBQWdCLEVBQUVWLGdCQUpwQjtBQUtFLFVBQUEsUUFBUSxFQUFFMkYsU0FBUyxDQUFDTyxNQUx0QjtBQU1FLFVBQUEsaUJBQWlCLEVBQUU7QUFBQSxtQkFBTVYsa0JBQWtCLENBQUMsV0FBRCxDQUF4QjtBQUFBLFdBTnJCO0FBT0UsVUFBQSxZQUFZLEVBQUVHLFNBQVMsQ0FBQ3hGLFlBUDFCO0FBUUUsVUFBQSxhQUFhLEVBQUVRO0FBUmpCLFVBREYsQ0FERCxHQWFHLElBOUNOLEVBZ0RHbUYsT0FBTyxDQUFDRSxJQUFSLGdCQUNDLGdDQUFDLFdBQUQ7QUFBYSxVQUFBLEdBQUcsRUFBRTtBQUFsQix3QkFDRSxnQ0FBQyxZQUFEO0FBQ0UsVUFBQSxRQUFRLEVBQUVGLE9BQU8sQ0FBQ0ksTUFBUixJQUFrQkosT0FBTyxDQUFDSyxjQUFSLEtBQTJCckUsUUFEekQ7QUFFRSxVQUFBLE1BQU0sRUFBRXlCLE1BRlY7QUFHRSxVQUFBLGlCQUFpQixFQUFFO0FBQUEsbUJBQU1pQyxrQkFBa0IsQ0FBQyxTQUFELENBQXhCO0FBQUEsV0FIckI7QUFJRSxVQUFBLGVBQWUsRUFBRSxLQUFLbkgsS0FBTCxDQUFXbUYsZUFKOUI7QUFLRSxVQUFBLHdCQUF3QixFQUFFLEtBQUtuRixLQUFMLENBQVdvRjtBQUx2QyxVQURGLENBREQsR0FVRyxJQTFETixFQTRER3NDLFNBQVMsQ0FBQ0MsSUFBVixnQkFDQyxnQ0FBQyxXQUFEO0FBQWEsVUFBQSxHQUFHLEVBQUU7QUFBbEIsd0JBQ0UsZ0NBQUMsV0FBRDtBQUNFLFVBQUEsUUFBUSxFQUFFRCxTQUFTLENBQUNHLE1BRHRCO0FBRUUsVUFBQSxZQUFZLEVBQUU3QixNQUZoQjtBQUdFLFVBQUEsZ0JBQWdCLEVBQUUrQixNQUFNLENBQUNDLElBQVAsQ0FBWUMscUJBQVosQ0FIcEI7QUFJRSxVQUFBLFdBQVcsRUFBRSxLQUFLakksS0FBTCxDQUFXNkYsV0FKMUI7QUFLRSxVQUFBLGlCQUFpQixFQUFFO0FBQUEsbUJBQU1zQixrQkFBa0IsQ0FBQyxXQUFELENBQXhCO0FBQUEsV0FMckI7QUFNRSxVQUFBLFlBQVksRUFBRU8sU0FBUyxDQUFDNUY7QUFOMUIsVUFERixDQURELEdBV0csSUF2RU4sQ0FERjtBQTJFRDtBQTNKb0Y7QUFBQTtBQUFBLElBQzlEb0csZ0JBRDhEOztBQUFBLG1DQUNqRjNCLFVBRGlGLGVBRWxFO0FBQ2pCNEIsSUFBQUEsUUFBUSxFQUFFQyxzQkFBVUMsTUFBVixDQUFpQkMsVUFEVjtBQUVqQnRFLElBQUFBLFVBQVUsRUFBRW9FLHNCQUFVRyxJQUFWLENBQWVELFVBRlY7QUFHakI5RSxJQUFBQSxPQUFPLEVBQUU0RSxzQkFBVUcsSUFBVixDQUFlRCxVQUhQO0FBSWpCdEYsSUFBQUEsTUFBTSxFQUFFb0Ysc0JBQVVJLE9BQVYsQ0FBa0JKLHNCQUFVQyxNQUE1QixDQUpTO0FBS2pCN0IsSUFBQUEsY0FBYyxFQUFFNEIsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBTGhCO0FBTWpCN0UsSUFBQUEsUUFBUSxFQUFFMkUsc0JBQVVLLE1BQVYsQ0FBaUJILFVBTlY7QUFPakJwQixJQUFBQSxXQUFXLEVBQUVrQixzQkFBVUMsTUFBVixDQUFpQkMsVUFQYjtBQVFqQnJFLElBQUFBLG1CQUFtQixFQUFFbUUsc0JBQVVNLElBQVYsQ0FBZUosVUFSbkI7QUFTakI1RSxJQUFBQSxnQkFBZ0IsRUFBRTBFLHNCQUFVTSxJQUFWLENBQWVKLFVBVGhCO0FBVWpCbkIsSUFBQUEsa0JBQWtCLEVBQUVpQixzQkFBVU0sSUFBVixDQUFlSixVQVZsQjtBQVdqQm5ELElBQUFBLGVBQWUsRUFBRWlELHNCQUFVTSxJQUFWLENBQWVKLFVBWGY7QUFZakJsRCxJQUFBQSx3QkFBd0IsRUFBRWdELHNCQUFVTSxJQUFWLENBQWVKLFVBWnhCO0FBYWpCbEksSUFBQUEsR0FBRyxFQUFFZ0ksc0JBQVVLLE1BQVYsQ0FBaUJILFVBYkw7QUFjakJ6QyxJQUFBQSxXQUFXLEVBQUV1QyxzQkFBVU0sSUFBVixDQUFlSixVQWRYO0FBZWpCdEMsSUFBQUEsTUFBTSxFQUFFb0Msc0JBQVVPLE1BQVYsQ0FBaUJMLFVBZlI7QUFnQmpCaEcsSUFBQUEsYUFBYSxFQUFFOEYsc0JBQVVRLFNBQVYsQ0FBb0IsQ0FBQ1Isc0JBQVVTLE9BQVgsRUFBb0JULHNCQUFVTSxJQUE5QixDQUFwQixDQWhCRTtBQWtCakI7QUFDQXRCLElBQUFBLFFBQVEsRUFBRWdCLHNCQUFVRyxJQW5CSDtBQW9CakJuRyxJQUFBQSxLQUFLLEVBQUVnRyxzQkFBVUssTUFwQkE7QUFxQmpCSyxJQUFBQSxTQUFTLEVBQUVWLHNCQUFVQyxNQXJCSjtBQXNCakJuRCxJQUFBQSxNQUFNLEVBQUVrRCxzQkFBVUM7QUF0QkQsR0FGa0U7QUFBQSxtQ0FDakY5QixVQURpRixrQkEyQi9EO0FBQ3BCL0MsSUFBQUEsT0FBTyxFQUFFLEtBRFc7QUFFcEJwRCxJQUFBQSxHQUFHLEVBQUUsQ0FGZTtBQUdwQnFELElBQUFBLFFBQVEsRUFBRSxDQUhVO0FBSXBCbkIsSUFBQUEsYUFBYSxFQUFFK0Q7QUFKSyxHQTNCK0Q7QUE4SnZGRSxFQUFBQSxVQUFVLENBQUNyRixXQUFYLEdBQXlCLFlBQXpCO0FBRUEsU0FBT3FGLFVBQVA7QUFDRDs7ZUFFY0QsaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIHVzZUNhbGxiYWNrfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHtJY29uUm91bmRTbWFsbCwgTWFwQ29udHJvbEJ1dHRvbiwgVG9vbHRpcH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IE1hcExheWVyU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vbWFwLWxheWVyLXNlbGVjdG9yJztcbmltcG9ydCBLZXBsZXJHbExvZ28gZnJvbSAnY29tcG9uZW50cy9jb21tb24vbG9nbyc7XG5pbXBvcnQgTWFwTGVnZW5kIGZyb20gJy4vbWFwLWxlZ2VuZCc7XG5pbXBvcnQge1xuICBDbG9zZSxcbiAgQ3ViZTNkLFxuICBDdXJzb3JDbGljayxcbiAgRGVsZXRlLFxuICBEcmF3UG9seWdvbixcbiAgRXllU2VlbixcbiAgRXllVW5zZWVuLFxuICBMYXllcnMsXG4gIExlZ2VuZCxcbiAgUG9seWdvbixcbiAgUmVjdGFuZ2xlLFxuICBTcGxpdFxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgVmVydGljYWxUb29sYmFyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3ZlcnRpY2FsLXRvb2xiYXInO1xuaW1wb3J0IFRvb2xiYXJJdGVtIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3Rvb2xiYXItaXRlbSc7XG5pbXBvcnQge0VESVRPUl9NT0RFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtMT0NBTEVfQ09ERVN9IGZyb20gJ2xvY2FsaXphdGlvbi9sb2NhbGVzJztcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbCA9IHN0eWxlZC5kaXZgXG4gIHJpZ2h0OiAwO1xuICBwYWRkaW5nOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcENvbnRyb2wucGFkZGluZ31weDtcbiAgei1pbmRleDogMTA7XG4gIG1hcmdpbi10b3A6ICR7cHJvcHMgPT4gcHJvcHMudG9wIHx8IDB9cHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xBY3Rpb24gPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiA0cHggMDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbCA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubWFwUGFuZWxCYWNrZ3JvdW5kQ29sb3J9O1xuICBmbGV4LWdyb3c6IDE7XG4gIHotaW5kZXg6IDE7XG4gIHAge1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xQYW5lbENvbnRlbnQgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbWFwLWNvbnRyb2xfX3BhbmVsLWNvbnRlbnQnXG59KWBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93blNjcm9sbEJhcn07XG4gIG1heC1oZWlnaHQ6IDUwMHB4O1xuICBtaW4taGVpZ2h0OiAxMDBweDtcbiAgbWluLXdpZHRoOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcENvbnRyb2wud2lkdGh9cHg7XG4gIG92ZXJmbG93OiBhdXRvO1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbFBhbmVsSGVhZGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ21hcC1jb250cm9sX19wYW5lbC1oZWFkZXInXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcFBhbmVsSGVhZGVyQmFja2dyb3VuZENvbG9yfTtcbiAgaGVpZ2h0OiAzMnB4O1xuICBwYWRkaW5nOiA2cHggMTJweDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZVRleHRDb2xvcn07XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICBidXR0b24ge1xuICAgIHdpZHRoOiAxOHB4O1xuICAgIGhlaWdodDogMThweDtcbiAgfVxuYDtcblxuY29uc3QgQWN0aW9uUGFuZWwgPSAoe2NsYXNzTmFtZSA9ICcnLCBjaGlsZHJlbn0pID0+IChcbiAgPFN0eWxlZE1hcENvbnRyb2xBY3Rpb24gY2xhc3NOYW1lPXtjbGFzc05hbWV9PntjaGlsZHJlbn08L1N0eWxlZE1hcENvbnRyb2xBY3Rpb24+XG4pO1xuXG5BY3Rpb25QYW5lbC5kaXNwbGF5TmFtZSA9ICdBY3Rpb25QYW5lbCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL21hcC1jb250cm9sJykuTWFwQ29udHJvbFRvb2x0aXBDb21wb25lbnR9ICovXG5jb25zdCBNYXBDb250cm9sVG9vbHRpcCA9IFJlYWN0Lm1lbW8oKHtpZCwgbWVzc2FnZX0pID0+IChcbiAgPFRvb2x0aXAgaWQ9e2lkfSBwbGFjZT1cImxlZnRcIiBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgIDxzcGFuPlxuICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e21lc3NhZ2V9IC8+XG4gICAgPC9zcGFuPlxuICA8L1Rvb2x0aXA+XG4pKTtcblxuTWFwQ29udHJvbFRvb2x0aXAuZGlzcGxheU5hbWUgPSAnTWFwQ29udHJvbFRvb2x0aXAnO1xuXG5jb25zdCBNYXBMZWdlbmRUb29sdGlwID0gKHtpZCwgbWVzc2FnZX0pID0+IChcbiAgPFRvb2x0aXAgaWQ9e2lkfSBwbGFjZT1cImxlZnRcIiBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgIDxzcGFuPlxuICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e21lc3NhZ2V9IC8+XG4gICAgPC9zcGFuPlxuICA8L1Rvb2x0aXA+XG4pO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9tYXAtY29udHJvbCcpLkxheWVyU2VsZWN0b3JQYW5lbENvbXBvbmVudH0gKi9cbmNvbnN0IExheWVyU2VsZWN0b3JQYW5lbCA9IFJlYWN0Lm1lbW8oXG4gICh7aXRlbXMsIG9uTWFwVG9nZ2xlTGF5ZXIsIGlzQWN0aXZlLCB0b2dnbGVNZW51UGFuZWwsIGRpc2FibGVDbG9zZX0pID0+XG4gICAgIWlzQWN0aXZlID8gKFxuICAgICAgKDxNYXBDb250cm9sQnV0dG9uXG4gICAgICAgIGtleT17MX1cbiAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRvZ2dsZU1lbnVQYW5lbCgpO1xuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9XCJtYXAtY29udHJvbC1idXR0b24gdG9nZ2xlLWxheWVyXCJcbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9XCJ0b2dnbGUtbGF5ZXJcIlxuICAgICAgPlxuICAgICAgICA8TGF5ZXJzIGhlaWdodD1cIjIycHhcIiAvPlxuICAgICAgICA8TWFwQ29udHJvbFRvb2x0aXBcbiAgICAgICAgICBpZD1cInRvZ2dsZS1sYXllclwiXG4gICAgICAgICAgbWVzc2FnZT17aXNBY3RpdmUgPyAndG9vbHRpcC5oaWRlTGF5ZXJQYW5lbCcgOiAndG9vbHRpcC5zaG93TGF5ZXJQYW5lbCd9XG4gICAgICAgIC8+XG4gICAgICA8L01hcENvbnRyb2xCdXR0b24+KVxuICAgICkgOiAoXG4gICAgICAoPE1hcENvbnRyb2xQYW5lbFxuICAgICAgICBoZWFkZXI9XCJoZWFkZXIudmlzaWJsZUxheWVyc1wiXG4gICAgICAgIG9uQ2xpY2s9e3RvZ2dsZU1lbnVQYW5lbH1cbiAgICAgICAgZGlzYWJsZUNsb3NlPXtkaXNhYmxlQ2xvc2V9XG4gICAgICA+XG4gICAgICAgIDxNYXBMYXllclNlbGVjdG9yIGxheWVycz17aXRlbXN9IG9uTWFwVG9nZ2xlTGF5ZXI9e29uTWFwVG9nZ2xlTGF5ZXJ9IC8+XG4gICAgICA8L01hcENvbnRyb2xQYW5lbD4pXG4gICAgKVxuKTtcblxuTGF5ZXJTZWxlY3RvclBhbmVsLmRpc3BsYXlOYW1lID0gJ0xheWVyU2VsZWN0b3JQYW5lbCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL21hcC1jb250cm9sJykuTWFwQ29udHJvbFBhbmVsQ29tcG9uZW50fSAqL1xuY29uc3QgTWFwQ29udHJvbFBhbmVsID0gUmVhY3QubWVtbyhcbiAgKHtjaGlsZHJlbiwgaGVhZGVyLCBvbkNsaWNrLCBzY2FsZSA9IDEsIGlzRXhwb3J0LCBkaXNhYmxlQ2xvc2UgPSBmYWxzZSwgbG9nb0NvbXBvbmVudH0pID0+IChcbiAgICA8U3R5bGVkTWFwQ29udHJvbFBhbmVsXG4gICAgICBzdHlsZT17e1xuICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlfSlgLFxuICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXI+XG4gICAgICAgIHtpc0V4cG9ydCAmJiBsb2dvQ29tcG9uZW50ID8gKFxuICAgICAgICAgIGxvZ29Db21wb25lbnRcbiAgICAgICAgKSA6IGhlYWRlciA/IChcbiAgICAgICAgICA8c3BhbiBzdHlsZT17e3ZlcnRpY2FsQWxpZ246ICdtaWRkbGUnfX0+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17aGVhZGVyfSAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIHtpc0V4cG9ydCA/IG51bGwgOiAoXG4gICAgICAgICAgPEljb25Sb3VuZFNtYWxsIGNsYXNzTmFtZT1cImNsb3NlLW1hcC1jb250cm9sLWl0ZW1cIiBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgICAgICAgIDxDbG9zZSBoZWlnaHQ9XCIxNnB4XCIgLz5cbiAgICAgICAgICA8L0ljb25Sb3VuZFNtYWxsPlxuICAgICAgICApfVxuICAgICAgPC9TdHlsZWRNYXBDb250cm9sUGFuZWxIZWFkZXI+XG4gICAgICA8U3R5bGVkTWFwQ29udHJvbFBhbmVsQ29udGVudD57Y2hpbGRyZW59PC9TdHlsZWRNYXBDb250cm9sUGFuZWxDb250ZW50PlxuICAgIDwvU3R5bGVkTWFwQ29udHJvbFBhbmVsPlxuICApXG4pO1xuXG5NYXBDb250cm9sUGFuZWwuZGlzcGxheU5hbWUgPSAnTWFwQ29udHJvbFBhbmVsJztcblxuTWFwTGVnZW5kUGFuZWxGYWN0b3J5LmRlcHMgPSBbXTtcbmV4cG9ydCBmdW5jdGlvbiBNYXBMZWdlbmRQYW5lbEZhY3RvcnkoKSB7XG4gIGNvbnN0IGRlZmF1bHRBY3Rpb25JY29ucyA9IHtcbiAgICBsZWdlbmQ6IExlZ2VuZFxuICB9O1xuICAvKiogQHR5cGUge2ltcG9ydCgnLi9tYXAtY29udHJvbCcpLk1hcExlZ2VuZFBhbmVsQ29tcG9uZW50fSAqL1xuICBjb25zdCBNYXBMZWdlbmRQYW5lbCA9ICh7XG4gICAgbGF5ZXJzLFxuICAgIGlzQWN0aXZlLFxuICAgIHNjYWxlLFxuICAgIG9uVG9nZ2xlTWVudVBhbmVsLFxuICAgIGlzRXhwb3J0LFxuICAgIGRpc2FibGVDbG9zZSxcbiAgICBsb2dvQ29tcG9uZW50LFxuICAgIGFjdGlvbkljb25zID0gZGVmYXVsdEFjdGlvbkljb25zXG4gIH0pID0+XG4gICAgIWlzQWN0aXZlID8gKFxuICAgICAgKDxNYXBDb250cm9sQnV0dG9uXG4gICAgICAgIGtleT17Mn1cbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9XCJzaG93LWxlZ2VuZFwiXG4gICAgICAgIGNsYXNzTmFtZT1cIm1hcC1jb250cm9sLWJ1dHRvbiBzaG93LWxlZ2VuZFwiXG4gICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBvblRvZ2dsZU1lbnVQYW5lbCgpO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8YWN0aW9uSWNvbnMubGVnZW5kIGhlaWdodD1cIjIycHhcIiAvPlxuICAgICAgICA8TWFwTGVnZW5kVG9vbHRpcCBpZD1cInNob3ctbGVnZW5kXCIgbWVzc2FnZT17J3Rvb2x0aXAuc2hvd0xlZ2VuZCd9IC8+XG4gICAgICA8L01hcENvbnRyb2xCdXR0b24+KVxuICAgICkgOiAoXG4gICAgICAoPE1hcENvbnRyb2xQYW5lbFxuICAgICAgICBzY2FsZT17c2NhbGV9XG4gICAgICAgIGhlYWRlcj17J2hlYWRlci5sYXllckxlZ2VuZCd9XG4gICAgICAgIG9uQ2xpY2s9e29uVG9nZ2xlTWVudVBhbmVsfVxuICAgICAgICBpc0V4cG9ydD17aXNFeHBvcnR9XG4gICAgICAgIGRpc2FibGVDbG9zZT17ZGlzYWJsZUNsb3NlfVxuICAgICAgICBsb2dvQ29tcG9uZW50PXtsb2dvQ29tcG9uZW50fVxuICAgICAgPlxuICAgICAgICA8TWFwTGVnZW5kIGxheWVycz17bGF5ZXJzfSAvPlxuICAgICAgPC9NYXBDb250cm9sUGFuZWw+KVxuICAgICk7XG5cbiAgTWFwTGVnZW5kUGFuZWwuZGlzcGxheU5hbWUgPSAnTWFwQ29udHJvbFBhbmVsJztcbiAgcmV0dXJuIE1hcExlZ2VuZFBhbmVsO1xufVxuXG5TcGxpdE1hcEJ1dHRvbkZhY3RvcnkuZGVwcyA9IFtdO1xuZXhwb3J0IGZ1bmN0aW9uIFNwbGl0TWFwQnV0dG9uRmFjdG9yeSgpIHtcbiAgY29uc3QgZGVmYXVsdEFjdGlvbkljb25zID0ge1xuICAgIGRlbGV0ZTogRGVsZXRlLFxuICAgIHNwbGl0OiBTcGxpdFxuICB9O1xuICAvKiogQHR5cGUge2ltcG9ydCgnLi9tYXAtY29udHJvbCcpLlNwbGl0TWFwQnV0dG9uQ29tcG9uZW50fSAqL1xuICBjb25zdCBTcGxpdE1hcEJ1dHRvbiA9IFJlYWN0Lm1lbW8oXG4gICAgKHtpc1NwbGl0LCBtYXBJbmRleCwgb25Ub2dnbGVTcGxpdE1hcCwgYWN0aW9uSWNvbnMgPSBkZWZhdWx0QWN0aW9uSWNvbnN9KSA9PiAoXG4gICAgICA8TWFwQ29udHJvbEJ1dHRvblxuICAgICAgICBhY3RpdmU9e2lzU3BsaXR9XG4gICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBvblRvZ2dsZVNwbGl0TWFwKGlzU3BsaXQgPyBtYXBJbmRleCA6IHVuZGVmaW5lZCk7XG4gICAgICAgIH19XG4gICAgICAgIGtleT17YHNwbGl0LSR7aXNTcGxpdH1gfVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ21hcC1jb250cm9sLWJ1dHRvbicsICdzcGxpdC1tYXAnLCB7J2Nsb3NlLW1hcCc6IGlzU3BsaXR9KX1cbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9XCJhY3Rpb24tdG9nZ2xlXCJcbiAgICAgID5cbiAgICAgICAge2lzU3BsaXQgPyA8YWN0aW9uSWNvbnMuZGVsZXRlIGhlaWdodD1cIjE4cHhcIiAvPiA6IDxhY3Rpb25JY29ucy5zcGxpdCBoZWlnaHQ9XCIxOHB4XCIgLz59XG4gICAgICAgIDxNYXBDb250cm9sVG9vbHRpcFxuICAgICAgICAgIGlkPVwiYWN0aW9uLXRvZ2dsZVwiXG4gICAgICAgICAgbWVzc2FnZT17aXNTcGxpdCA/ICd0b29sdGlwLmNsb3NlUGFuZWwnIDogJ3Rvb2x0aXAuc3dpdGNoVG9EdWFsVmlldyd9XG4gICAgICAgIC8+XG4gICAgICA8L01hcENvbnRyb2xCdXR0b24+XG4gICAgKVxuICApO1xuXG4gIFNwbGl0TWFwQnV0dG9uLmRpc3BsYXlOYW1lID0gJ1NwbGl0TWFwQnV0dG9uJztcbiAgcmV0dXJuIFNwbGl0TWFwQnV0dG9uO1xufVxuXG5Ub2dnbGUzZEJ1dHRvbkZhY3RvcnkuZGVwcyA9IFtdO1xuZXhwb3J0IGZ1bmN0aW9uIFRvZ2dsZTNkQnV0dG9uRmFjdG9yeSgpIHtcbiAgY29uc3QgZGVmYXVsdEFjdGlvbkljb25zID0ge1xuICAgIGN1YmU6IEN1YmUzZFxuICB9O1xuICAvKiogQHR5cGUge2ltcG9ydCgnLi9tYXAtY29udHJvbCcpLlRvZ2dsZTNkQnV0dG9uQ29tcG9uZW50fSAqL1xuICBjb25zdCBUb2dnbGUzZEJ1dHRvbiA9IFJlYWN0Lm1lbW8oXG4gICAgKHtkcmFnUm90YXRlLCBvblRvZ2dsZVBlcnNwZWN0aXZlLCBhY3Rpb25JY29ucyA9IGRlZmF1bHRBY3Rpb25JY29uc30pID0+IChcbiAgICAgIDxNYXBDb250cm9sQnV0dG9uXG4gICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBvblRvZ2dsZVBlcnNwZWN0aXZlKCk7XG4gICAgICAgIH19XG4gICAgICAgIGFjdGl2ZT17ZHJhZ1JvdGF0ZX1cbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9XCJhY3Rpb24tM2RcIlxuICAgICAgPlxuICAgICAgICA8YWN0aW9uSWNvbnMuY3ViZSBoZWlnaHQ9XCIyMnB4XCIgLz5cbiAgICAgICAgPE1hcENvbnRyb2xUb29sdGlwXG4gICAgICAgICAgaWQ9XCJhY3Rpb24tM2RcIlxuICAgICAgICAgIG1lc3NhZ2U9e2RyYWdSb3RhdGUgPyAndG9vbHRpcC5kaXNhYmxlM0RNYXAnIDogJ3Rvb2x0aXAuM0RNYXAnfVxuICAgICAgICAvPlxuICAgICAgPC9NYXBDb250cm9sQnV0dG9uPlxuICAgIClcbiAgKTtcblxuICBUb2dnbGUzZEJ1dHRvbi5kaXNwbGF5TmFtZSA9ICdUb2dnbGUzZEJ1dHRvbic7XG4gIHJldHVybiBUb2dnbGUzZEJ1dHRvbjtcbn1cbmNvbnN0IFN0eWxlZFRvb2xiYXIgPSBzdHlsZWQoVmVydGljYWxUb29sYmFyKWBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMzJweDtcbmA7XG5cbk1hcERyYXdQYW5lbEZhY3RvcnkuZGVwcyA9IFtdO1xuZXhwb3J0IGZ1bmN0aW9uIE1hcERyYXdQYW5lbEZhY3RvcnkoKSB7XG4gIGNvbnN0IGRlZmF1bHRBY3Rpb25JY29ucyA9IHtcbiAgICB2aXNpYmxlOiBFeWVTZWVuLFxuICAgIGhpZGRlbjogRXllVW5zZWVuLFxuICAgIHBvbHlnb246IERyYXdQb2x5Z29uLFxuICAgIGN1cnNvcjogQ3Vyc29yQ2xpY2ssXG4gICAgaW5uZXJQb2x5Z29uOiBQb2x5Z29uLFxuICAgIHJlY3RhbmdsZTogUmVjdGFuZ2xlXG4gIH07XG4gIC8qKiBAdHlwZSB7aW1wb3J0KCcuL21hcC1jb250cm9sJykuTWFwRHJhd1BhbmVsQ29tcG9uZW50fSAqL1xuICBjb25zdCBNYXBEcmF3UGFuZWwgPSBSZWFjdC5tZW1vKFxuICAgICh7XG4gICAgICBlZGl0b3IsXG4gICAgICBpc0FjdGl2ZSxcbiAgICAgIG9uVG9nZ2xlTWVudVBhbmVsLFxuICAgICAgb25TZXRFZGl0b3JNb2RlLFxuICAgICAgb25Ub2dnbGVFZGl0b3JWaXNpYmlsaXR5LFxuICAgICAgYWN0aW9uSWNvbnMgPSBkZWZhdWx0QWN0aW9uSWNvbnNcbiAgICB9KSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC1kcmF3LWNvbnRyb2xzXCIgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319PlxuICAgICAgICAgIHtpc0FjdGl2ZSA/IChcbiAgICAgICAgICAgIDxTdHlsZWRUb29sYmFyIHNob3c9e2lzQWN0aXZlfT5cbiAgICAgICAgICAgICAgPFRvb2xiYXJJdGVtXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZWRpdC1mZWF0dXJlXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNldEVkaXRvck1vZGUoRURJVE9SX01PREVTLkVESVQpfVxuICAgICAgICAgICAgICAgIGxhYmVsPVwidG9vbGJhci5zZWxlY3RcIlxuICAgICAgICAgICAgICAgIGljb249e2FjdGlvbkljb25zLmN1cnNvcn1cbiAgICAgICAgICAgICAgICBhY3RpdmU9e2VkaXRvci5tb2RlID09PSBFRElUT1JfTU9ERVMuRURJVH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFRvb2xiYXJJdGVtXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZHJhdy1mZWF0dXJlXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNldEVkaXRvck1vZGUoRURJVE9SX01PREVTLkRSQVdfUE9MWUdPTil9XG4gICAgICAgICAgICAgICAgbGFiZWw9XCJ0b29sYmFyLnBvbHlnb25cIlxuICAgICAgICAgICAgICAgIGljb249e2FjdGlvbkljb25zLmlubmVyUG9seWdvbn1cbiAgICAgICAgICAgICAgICBhY3RpdmU9e2VkaXRvci5tb2RlID09PSBFRElUT1JfTU9ERVMuRFJBV19QT0xZR09OfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8VG9vbGJhckl0ZW1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJkcmF3LXJlY3RhbmdsZVwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZXRFZGl0b3JNb2RlKEVESVRPUl9NT0RFUy5EUkFXX1JFQ1RBTkdMRSl9XG4gICAgICAgICAgICAgICAgbGFiZWw9XCJ0b29sYmFyLnJlY3RhbmdsZVwiXG4gICAgICAgICAgICAgICAgaWNvbj17YWN0aW9uSWNvbnMucmVjdGFuZ2xlfVxuICAgICAgICAgICAgICAgIGFjdGl2ZT17ZWRpdG9yLm1vZGUgPT09IEVESVRPUl9NT0RFUy5EUkFXX1JFQ1RBTkdMRX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFRvb2xiYXJJdGVtXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidG9nZ2xlLWZlYXR1cmVzXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZUVkaXRvclZpc2liaWxpdHl9XG4gICAgICAgICAgICAgICAgbGFiZWw9e2VkaXRvci52aXNpYmxlID8gJ3Rvb2xiYXIuaGlkZScgOiAndG9vbGJhci5zaG93J31cbiAgICAgICAgICAgICAgICBpY29uPXtlZGl0b3IudmlzaWJsZSA/IGFjdGlvbkljb25zLnZpc2libGUgOiBhY3Rpb25JY29ucy5oaWRkZW59XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1N0eWxlZFRvb2xiYXI+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPE1hcENvbnRyb2xCdXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIG9uVG9nZ2xlTWVudVBhbmVsKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZX1cbiAgICAgICAgICAgIGRhdGEtdGlwXG4gICAgICAgICAgICBkYXRhLWZvcj1cIm1hcC1kcmF3XCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8YWN0aW9uSWNvbnMucG9seWdvbiBoZWlnaHQ9XCIyMnB4XCIgLz5cbiAgICAgICAgICAgIDxNYXBDb250cm9sVG9vbHRpcCBpZD1cIm1hcC1kcmF3XCIgbWVzc2FnZT1cInRvb2x0aXAuRHJhd09uTWFwXCIgLz5cbiAgICAgICAgICA8L01hcENvbnRyb2xCdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICk7XG5cbiAgTWFwRHJhd1BhbmVsLmRpc3BsYXlOYW1lID0gJ01hcERyYXdQYW5lbCc7XG4gIHJldHVybiBNYXBEcmF3UGFuZWw7XG59XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL21hcC1jb250cm9sJykuTG9jYWxlUGFuZWxDb21wb25lbnR9ICovXG5jb25zdCBMb2NhbGVQYW5lbCA9IFJlYWN0Lm1lbW8oXG4gICh7YXZhaWxhYmxlTG9jYWxlcywgaXNBY3RpdmUsIG9uVG9nZ2xlTWVudVBhbmVsLCBvblNldExvY2FsZSwgYWN0aXZlTG9jYWxlLCBkaXNhYmxlQ2xvc2V9KSA9PiB7XG4gICAgY29uc3Qgb25DbGlja0l0ZW0gPSB1c2VDYWxsYmFjayhcbiAgICAgIGxvY2FsZSA9PiB7XG4gICAgICAgIG9uU2V0TG9jYWxlKGxvY2FsZSk7XG4gICAgICB9LFxuICAgICAgW29uU2V0TG9jYWxlXVxuICAgICk7XG5cbiAgICBjb25zdCBvbkNsaWNrQnV0dG9uID0gdXNlQ2FsbGJhY2soXG4gICAgICBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvblRvZ2dsZU1lbnVQYW5lbCgpO1xuICAgICAgfSxcbiAgICAgIFtvblRvZ2dsZU1lbnVQYW5lbF1cbiAgICApO1xuICAgIGNvbnN0IGdldExhYmVsID0gdXNlQ2FsbGJhY2sobG9jYWxlID0+IGB0b29sYmFyLiR7bG9jYWxlfWAsIFtdKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgICAge2lzQWN0aXZlID8gKFxuICAgICAgICAgIDxTdHlsZWRUb29sYmFyIHNob3c9e2lzQWN0aXZlfT5cbiAgICAgICAgICAgIHthdmFpbGFibGVMb2NhbGVzLm1hcChsb2NhbGUgPT4gKFxuICAgICAgICAgICAgICA8VG9vbGJhckl0ZW1cbiAgICAgICAgICAgICAgICBrZXk9e2xvY2FsZX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrSXRlbShsb2NhbGUpfVxuICAgICAgICAgICAgICAgIGxhYmVsPXtnZXRMYWJlbChsb2NhbGUpfVxuICAgICAgICAgICAgICAgIGFjdGl2ZT17YWN0aXZlTG9jYWxlID09PSBsb2NhbGV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L1N0eWxlZFRvb2xiYXI+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICA8TWFwQ29udHJvbEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tCdXR0b259XG4gICAgICAgICAgYWN0aXZlPXtpc0FjdGl2ZX1cbiAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgIGRhdGEtZm9yPVwibG9jYWxlXCJcbiAgICAgICAgICBkaXNhYmxlQ2xvc2U9e2Rpc2FibGVDbG9zZX1cbiAgICAgICAgPlxuICAgICAgICAgIHthY3RpdmVMb2NhbGUudG9VcHBlckNhc2UoKX1cbiAgICAgICAgICA8TWFwQ29udHJvbFRvb2x0aXAgaWQ9XCJsb2NhbGVcIiBtZXNzYWdlPVwidG9vbHRpcC5zZWxlY3RMb2NhbGVcIiAvPlxuICAgICAgICA8L01hcENvbnRyb2xCdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG4pO1xuXG5Mb2NhbGVQYW5lbC5kaXNwbGF5TmFtZSA9ICdMb2NhbGVQYW5lbCc7XG5cbmNvbnN0IExlZ2VuZExvZ28gPSA8S2VwbGVyR2xMb2dvIHZlcnNpb249e2ZhbHNlfSBhcHBOYW1lPVwia2VwbGVyLmdsXCIgLz47XG5NYXBDb250cm9sRmFjdG9yeS5kZXBzID0gW1xuICBNYXBEcmF3UGFuZWxGYWN0b3J5LFxuICBUb2dnbGUzZEJ1dHRvbkZhY3RvcnksXG4gIFNwbGl0TWFwQnV0dG9uRmFjdG9yeSxcbiAgTWFwTGVnZW5kUGFuZWxGYWN0b3J5XG5dO1xuZnVuY3Rpb24gTWFwQ29udHJvbEZhY3RvcnkoTWFwRHJhd1BhbmVsLCBUb2dnbGUzZEJ1dHRvbiwgU3BsaXRNYXBCdXR0b24sIE1hcExlZ2VuZFBhbmVsKSB7XG4gIGNsYXNzIE1hcENvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgZHJhZ1JvdGF0ZTogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgIGlzU3BsaXQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgICBsYXllcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLFxuICAgICAgbGF5ZXJzVG9SZW5kZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG1hcEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBtYXBDb250cm9sczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgb25Ub2dnbGVQZXJzcGVjdGl2ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG9uVG9nZ2xlU3BsaXRNYXA6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvblRvZ2dsZU1hcENvbnRyb2w6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvblNldEVkaXRvck1vZGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvblRvZ2dsZUVkaXRvclZpc2liaWxpdHk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB0b3A6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIG9uU2V0TG9jYWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgbG9jYWxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBsb2dvQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSxcblxuICAgICAgLy8gb3B0aW9uYWxcbiAgICAgIHJlYWRPbmx5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgIHNjYWxlOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgbWFwTGF5ZXJzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgZWRpdG9yOiBQcm9wVHlwZXMub2JqZWN0XG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBpc1NwbGl0OiBmYWxzZSxcbiAgICAgIHRvcDogMCxcbiAgICAgIG1hcEluZGV4OiAwLFxuICAgICAgbG9nb0NvbXBvbmVudDogTGVnZW5kTG9nb1xuICAgIH07XG5cbiAgICBsYXllclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMubGF5ZXJzO1xuICAgIGxheWVyc1RvUmVuZGVyU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5sYXllcnNUb1JlbmRlcjtcbiAgICBsYXllclBhbmVsSXRlbXNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5sYXllclNlbGVjdG9yLFxuICAgICAgdGhpcy5sYXllcnNUb1JlbmRlclNlbGVjdG9yLFxuICAgICAgKGxheWVycywgbGF5ZXJzVG9SZW5kZXIpID0+XG4gICAgICAgIGxheWVyc1xuICAgICAgICAgIC5maWx0ZXIobCA9PiBsLmNvbmZpZy5pc1Zpc2libGUpXG4gICAgICAgICAgLm1hcChsYXllciA9PiAoe1xuICAgICAgICAgICAgaWQ6IGxheWVyLmlkLFxuICAgICAgICAgICAgbmFtZTogbGF5ZXIuY29uZmlnLmxhYmVsLFxuICAgICAgICAgICAgLy8gbGF5ZXJcbiAgICAgICAgICAgIGlzVmlzaWJsZTogbGF5ZXJzVG9SZW5kZXJbbGF5ZXIuaWRdXG4gICAgICAgICAgfSkpXG4gICAgKTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZHJhZ1JvdGF0ZSxcbiAgICAgICAgbGF5ZXJzLFxuICAgICAgICBsYXllcnNUb1JlbmRlcixcbiAgICAgICAgaXNTcGxpdCxcbiAgICAgICAgaXNFeHBvcnQsXG4gICAgICAgIG1hcEluZGV4LFxuICAgICAgICBtYXBDb250cm9scyxcbiAgICAgICAgb25Ub2dnbGVQZXJzcGVjdGl2ZSxcbiAgICAgICAgb25Ub2dnbGVTcGxpdE1hcCxcbiAgICAgICAgb25NYXBUb2dnbGVMYXllcixcbiAgICAgICAgb25Ub2dnbGVNYXBDb250cm9sLFxuICAgICAgICBlZGl0b3IsXG4gICAgICAgIHNjYWxlLFxuICAgICAgICByZWFkT25seSxcbiAgICAgICAgbG9jYWxlLFxuICAgICAgICB0b3AsXG4gICAgICAgIGxvZ29Db21wb25lbnRcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCB7XG4gICAgICAgIHZpc2libGVMYXllcnMgPSB7fSxcbiAgICAgICAgbWFwTGVnZW5kID0ge30sXG4gICAgICAgIHRvZ2dsZTNkID0ge30sXG4gICAgICAgIHNwbGl0TWFwID0ge30sXG4gICAgICAgIG1hcERyYXcgPSB7fSxcbiAgICAgICAgbWFwTG9jYWxlID0ge31cbiAgICAgIH0gPSBtYXBDb250cm9scztcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZE1hcENvbnRyb2wgY2xhc3NOYW1lPVwibWFwLWNvbnRyb2xcIiB0b3A9e3RvcH0+XG4gICAgICAgICAgey8qIFNwbGl0IE1hcCAqL31cbiAgICAgICAgICB7c3BsaXRNYXAuc2hvdyAmJiByZWFkT25seSAhPT0gdHJ1ZSA/IChcbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJzcGxpdC1tYXBcIiBrZXk9ezB9PlxuICAgICAgICAgICAgICA8U3BsaXRNYXBCdXR0b25cbiAgICAgICAgICAgICAgICBpc1NwbGl0PXtpc1NwbGl0fVxuICAgICAgICAgICAgICAgIG1hcEluZGV4PXttYXBJbmRleH1cbiAgICAgICAgICAgICAgICBvblRvZ2dsZVNwbGl0TWFwPXtvblRvZ2dsZVNwbGl0TWFwfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHsvKiBNYXAgTGF5ZXJzICovfVxuICAgICAgICAgIHtpc1NwbGl0ICYmIHZpc2libGVMYXllcnMuc2hvdyAmJiByZWFkT25seSAhPT0gdHJ1ZSA/IChcbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJtYXAtbGF5ZXJzXCIga2V5PXsxfT5cbiAgICAgICAgICAgICAgPExheWVyU2VsZWN0b3JQYW5lbFxuICAgICAgICAgICAgICAgIGl0ZW1zPXt0aGlzLmxheWVyUGFuZWxJdGVtc1NlbGVjdG9yKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgIG9uTWFwVG9nZ2xlTGF5ZXI9e29uTWFwVG9nZ2xlTGF5ZXJ9XG4gICAgICAgICAgICAgICAgaXNBY3RpdmU9e3Zpc2libGVMYXllcnMuYWN0aXZlfVxuICAgICAgICAgICAgICAgIHRvZ2dsZU1lbnVQYW5lbD17KCkgPT4gb25Ub2dnbGVNYXBDb250cm9sKCd2aXNpYmxlTGF5ZXJzJyl9XG4gICAgICAgICAgICAgICAgZGlzYWJsZUNsb3NlPXt2aXNpYmxlTGF5ZXJzLmRpc2FibGVDbG9zZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvQWN0aW9uUGFuZWw+XG4gICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICB7LyogM0QgTWFwICovfVxuICAgICAgICAgIHt0b2dnbGUzZC5zaG93ID8gKFxuICAgICAgICAgICAgPEFjdGlvblBhbmVsIGNsYXNzTmFtZT1cInRvZ2dsZS0zZFwiIGtleT17Mn0+XG4gICAgICAgICAgICAgIDxUb2dnbGUzZEJ1dHRvbiBkcmFnUm90YXRlPXtkcmFnUm90YXRlfSBvblRvZ2dsZVBlcnNwZWN0aXZlPXtvblRvZ2dsZVBlcnNwZWN0aXZlfSAvPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHsvKiBNYXAgTGVnZW5kICovfVxuICAgICAgICAgIHttYXBMZWdlbmQuc2hvdyA/IChcbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJzaG93LWxlZ2VuZFwiIGtleT17M30+XG4gICAgICAgICAgICAgIDxNYXBMZWdlbmRQYW5lbFxuICAgICAgICAgICAgICAgIGxheWVycz17bGF5ZXJzLmZpbHRlcihsID0+IGxheWVyc1RvUmVuZGVyW2wuaWRdKX1cbiAgICAgICAgICAgICAgICBzY2FsZT17c2NhbGV9XG4gICAgICAgICAgICAgICAgaXNFeHBvcnQ9e2lzRXhwb3J0fVxuICAgICAgICAgICAgICAgIG9uTWFwVG9nZ2xlTGF5ZXI9e29uTWFwVG9nZ2xlTGF5ZXJ9XG4gICAgICAgICAgICAgICAgaXNBY3RpdmU9e21hcExlZ2VuZC5hY3RpdmV9XG4gICAgICAgICAgICAgICAgb25Ub2dnbGVNZW51UGFuZWw9eygpID0+IG9uVG9nZ2xlTWFwQ29udHJvbCgnbWFwTGVnZW5kJyl9XG4gICAgICAgICAgICAgICAgZGlzYWJsZUNsb3NlPXttYXBMZWdlbmQuZGlzYWJsZUNsb3NlfVxuICAgICAgICAgICAgICAgIGxvZ29Db21wb25lbnQ9e2xvZ29Db21wb25lbnR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAge21hcERyYXcuc2hvdyA/IChcbiAgICAgICAgICAgIDxBY3Rpb25QYW5lbCBrZXk9ezR9PlxuICAgICAgICAgICAgICA8TWFwRHJhd1BhbmVsXG4gICAgICAgICAgICAgICAgaXNBY3RpdmU9e21hcERyYXcuYWN0aXZlICYmIG1hcERyYXcuYWN0aXZlTWFwSW5kZXggPT09IG1hcEluZGV4fVxuICAgICAgICAgICAgICAgIGVkaXRvcj17ZWRpdG9yfVxuICAgICAgICAgICAgICAgIG9uVG9nZ2xlTWVudVBhbmVsPXsoKSA9PiBvblRvZ2dsZU1hcENvbnRyb2woJ21hcERyYXcnKX1cbiAgICAgICAgICAgICAgICBvblNldEVkaXRvck1vZGU9e3RoaXMucHJvcHMub25TZXRFZGl0b3JNb2RlfVxuICAgICAgICAgICAgICAgIG9uVG9nZ2xlRWRpdG9yVmlzaWJpbGl0eT17dGhpcy5wcm9wcy5vblRvZ2dsZUVkaXRvclZpc2liaWxpdHl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAge21hcExvY2FsZS5zaG93ID8gKFxuICAgICAgICAgICAgPEFjdGlvblBhbmVsIGtleT17NX0+XG4gICAgICAgICAgICAgIDxMb2NhbGVQYW5lbFxuICAgICAgICAgICAgICAgIGlzQWN0aXZlPXttYXBMb2NhbGUuYWN0aXZlfVxuICAgICAgICAgICAgICAgIGFjdGl2ZUxvY2FsZT17bG9jYWxlfVxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZUxvY2FsZXM9e09iamVjdC5rZXlzKExPQ0FMRV9DT0RFUyl9XG4gICAgICAgICAgICAgICAgb25TZXRMb2NhbGU9e3RoaXMucHJvcHMub25TZXRMb2NhbGV9XG4gICAgICAgICAgICAgICAgb25Ub2dnbGVNZW51UGFuZWw9eygpID0+IG9uVG9nZ2xlTWFwQ29udHJvbCgnbWFwTG9jYWxlJyl9XG4gICAgICAgICAgICAgICAgZGlzYWJsZUNsb3NlPXttYXBMb2NhbGUuZGlzYWJsZUNsb3NlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBNYXBDb250cm9sLmRpc3BsYXlOYW1lID0gJ01hcENvbnRyb2wnO1xuXG4gIHJldHVybiBNYXBDb250cm9sO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNYXBDb250cm9sRmFjdG9yeTtcbiJdfQ==