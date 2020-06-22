"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SidePanelFactory;
exports.PanelTitleFactory = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _reactIntl = require("react-intl");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _lodash = _interopRequireDefault(require("lodash.get"));

var _sideBar = _interopRequireDefault(require("./side-panel/side-bar"));

var _panelHeader = _interopRequireDefault(require("./side-panel/panel-header"));

var _layerManager = _interopRequireDefault(require("./side-panel/layer-manager"));

var _filterManager = _interopRequireDefault(require("./side-panel/filter-manager"));

var _interactionManager = _interopRequireDefault(require("./side-panel/interaction-manager"));

var _mapManager = _interopRequireDefault(require("./side-panel/map-manager"));

var _panelToggle = _interopRequireDefault(require("./side-panel/panel-toggle"));

var _customPanel = _interopRequireDefault(require("./side-panel/custom-panel"));

var _defaultSettings = require("../constants/default-settings");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 20px;\n  font-weight: 400;\n  letter-spacing: 1.25px;\n  margin-bottom: 14px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n  flex-grow: 1;\n  padding: ", "px;\n  overflow-y: scroll;\n  overflow-x: hidden;\n\n  .side-panel__content__inner {\n    display: flex;\n    height: 100%;\n    flex-direction: column;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var SidePanelContent = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.sidePanelScrollBar;
}, function (props) {
  return props.theme.sidePanelInnerPadding;
});

var PanelTitleFactory = function PanelTitleFactory() {
  return _styledComponents["default"].div(_templateObject2(), function (props) {
    return props.theme.titleTextColor;
  });
};

exports.PanelTitleFactory = PanelTitleFactory;
SidePanelFactory.deps = [_sideBar["default"], _panelHeader["default"], _panelToggle["default"], PanelTitleFactory, _layerManager["default"], _filterManager["default"], _interactionManager["default"], _mapManager["default"], _customPanel["default"]];
/**
 *
 * Vertical sidebar containing input components for the rendering layers
 */

function SidePanelFactory(Sidebar, PanelHeader, PanelToggle, PanelTitle, LayerManager, FilterManager, InteractionManager, MapManager, CustomPanels) {
  var customPanels = (0, _lodash["default"])(CustomPanels, ['defaultProps', 'panels']) || [];

  var getCustomPanelProps = (0, _lodash["default"])(CustomPanels, ['defaultProps', 'getProps']) || function () {
    return {};
  };

  var SidePanel =
  /*#__PURE__*/
  function (_PureComponent) {
    (0, _inherits2["default"])(SidePanel, _PureComponent);

    function SidePanel() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, SidePanel);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(SidePanel)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onOpenOrClose", function () {
        _this.props.uiStateActions.toggleSidePanel(_this.props.uiState.activeSidePanel ? null : 'layer');
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_showDatasetTable", function (dataId) {
        // this will open data table modal
        _this.props.visStateActions.showDatasetTable(dataId);

        _this.props.uiStateActions.toggleModal(_defaultSettings.DATA_TABLE_ID);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_showAddDataModal", function () {
        _this.props.uiStateActions.toggleModal(_defaultSettings.ADD_DATA_ID);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_showAddMapStyleModal", function () {
        _this.props.uiStateActions.toggleModal(_defaultSettings.ADD_MAP_STYLE_ID);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_removeDataset", function (key) {
        // this will show the modal dialog to confirm deletion
        _this.props.uiStateActions.openDeleteModal(key);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClickExportImage", function () {
        return _this.props.uiStateActions.toggleModal(_defaultSettings.EXPORT_IMAGE_ID);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClickExportData", function () {
        return _this.props.uiStateActions.toggleModal(_defaultSettings.EXPORT_DATA_ID);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClickExportMap", function () {
        return _this.props.uiStateActions.toggleModal(_defaultSettings.EXPORT_MAP_ID);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClickSaveToStorage", function () {
        _this.props.uiStateActions.toggleModal(_this.props.mapSaved ? _defaultSettings.OVERWRITE_MAP_ID : _defaultSettings.SAVE_MAP_ID);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClickSaveAsToStorage", function () {
        // add (copy) to file name
        _this.props.visStateActions.setMapInfo({
          title: "".concat(_this.props.mapInfo.title || 'Kepler.gl', " (Copy)")
        });

        _this.props.uiStateActions.toggleModal(_defaultSettings.SAVE_MAP_ID);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClickShareMap", function () {
        return _this.props.uiStateActions.toggleModal(_defaultSettings.SHARE_MAP_ID);
      });
      return _this;
    }

    (0, _createClass2["default"])(SidePanel, [{
      key: "render",
      // eslint-disable-next-line complexity
      value: function render() {
        var _this$props = this.props,
            appName = _this$props.appName,
            appWebsite = _this$props.appWebsite,
            version = _this$props.version,
            datasets = _this$props.datasets,
            filters = _this$props.filters,
            layers = _this$props.layers,
            layerBlending = _this$props.layerBlending,
            layerClasses = _this$props.layerClasses,
            uiState = _this$props.uiState,
            layerOrder = _this$props.layerOrder,
            interactionConfig = _this$props.interactionConfig,
            visStateActions = _this$props.visStateActions,
            mapStyleActions = _this$props.mapStyleActions,
            uiStateActions = _this$props.uiStateActions,
            availableProviders = _this$props.availableProviders;
        var activeSidePanel = uiState.activeSidePanel;
        var isOpen = Boolean(activeSidePanel);
        var panels = [].concat((0, _toConsumableArray2["default"])(this.props.panels), (0, _toConsumableArray2["default"])(customPanels));
        var layerManagerActions = {
          addLayer: visStateActions.addLayer,
          layerConfigChange: visStateActions.layerConfigChange,
          layerColorUIChange: visStateActions.layerColorUIChange,
          layerTextLabelChange: visStateActions.layerTextLabelChange,
          layerVisualChannelConfigChange: visStateActions.layerVisualChannelConfigChange,
          layerTypeChange: visStateActions.layerTypeChange,
          layerVisConfigChange: visStateActions.layerVisConfigChange,
          updateLayerBlending: visStateActions.updateLayerBlending,
          updateLayerOrder: visStateActions.reorderLayer,
          showDatasetTable: this._showDatasetTable,
          showAddDataModal: this._showAddDataModal,
          removeLayer: visStateActions.removeLayer,
          removeDataset: this._removeDataset,
          openModal: uiStateActions.toggleModal
        };
        var filterManagerActions = {
          addFilter: visStateActions.addFilter,
          removeFilter: visStateActions.removeFilter,
          setFilter: visStateActions.setFilter,
          showDatasetTable: this._showDatasetTable,
          showAddDataModal: this._showAddDataModal,
          toggleAnimation: visStateActions.toggleFilterAnimation,
          enlargeFilter: visStateActions.enlargeFilter,
          toggleFilterFeature: visStateActions.toggleFilterFeature
        };
        var interactionManagerActions = {
          onConfigChange: visStateActions.interactionConfigChange
        };
        var mapManagerActions = {
          addMapStyleUrl: mapStyleActions.addMapStyleUrl,
          onConfigChange: mapStyleActions.mapConfigChange,
          onStyleChange: mapStyleActions.mapStyleChange,
          onBuildingChange: mapStyleActions.mapBuildingChange,
          set3dBuildingColor: mapStyleActions.set3dBuildingColor,
          showAddMapStyleModal: this._showAddMapStyleModal
        };
        return _react["default"].createElement("div", null, _react["default"].createElement(Sidebar, {
          width: this.props.width,
          isOpen: isOpen,
          minifiedWidth: 0,
          onOpenOrClose: this._onOpenOrClose
        }, _react["default"].createElement(PanelHeader, {
          appName: appName,
          version: version,
          appWebsite: appWebsite,
          visibleDropdown: uiState.visibleDropdown,
          showExportDropdown: uiStateActions.showExportDropdown,
          hideExportDropdown: uiStateActions.hideExportDropdown,
          onExportImage: this._onClickExportImage,
          onExportData: this._onClickExportData,
          onExportMap: this._onClickExportMap,
          onSaveMap: this.props.onSaveMap,
          onSaveToStorage: availableProviders.hasStorage ? this._onClickSaveToStorage : null,
          onSaveAsToStorage: availableProviders.hasStorage && this.props.mapSaved ? this._onClickSaveAsToStorage : null,
          onShareMap: availableProviders.hasShare ? this._onClickShareMap : null
        }), _react["default"].createElement(PanelToggle, {
          panels: panels,
          activePanel: activeSidePanel,
          togglePanel: uiStateActions.toggleSidePanel
        }), _react["default"].createElement(SidePanelContent, {
          className: "side-panel__content"
        }, _react["default"].createElement("div", {
          className: "side-panel__content__inner"
        }, _react["default"].createElement(PanelTitle, {
          className: "side-panel__content__title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: (panels.find(function (_ref) {
            var id = _ref.id;
            return id === activeSidePanel;
          }) || {}).label
        })), activeSidePanel === 'layer' && _react["default"].createElement(LayerManager, (0, _extends2["default"])({}, layerManagerActions, {
          datasets: datasets,
          layers: layers,
          layerClasses: layerClasses,
          layerOrder: layerOrder,
          layerBlending: layerBlending,
          colorPalette: uiState.colorPalette
        })), activeSidePanel === 'filter' && _react["default"].createElement(FilterManager, (0, _extends2["default"])({}, filterManagerActions, {
          datasets: datasets,
          layers: layers,
          filters: filters
        })), activeSidePanel === 'interaction' && _react["default"].createElement(InteractionManager, (0, _extends2["default"])({}, interactionManagerActions, {
          datasets: datasets,
          interactionConfig: interactionConfig
        })), activeSidePanel === 'map' && _react["default"].createElement(MapManager, (0, _extends2["default"])({}, mapManagerActions, {
          mapStyle: this.props.mapStyle
        })), (customPanels || []).find(function (p) {
          return p.id === activeSidePanel;
        }) ? _react["default"].createElement(CustomPanels, (0, _extends2["default"])({}, getCustomPanelProps(this.props), {
          activeSidePanel: activeSidePanel
        })) : null))));
      }
    }]);
    return SidePanel;
  }(_react.PureComponent);

  (0, _defineProperty2["default"])(SidePanel, "propTypes", {
    filters: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    interactionConfig: _propTypes["default"].object.isRequired,
    layerBlending: _propTypes["default"].string.isRequired,
    layers: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    layerClasses: _propTypes["default"].object.isRequired,
    mapStyle: _propTypes["default"].object.isRequired,
    width: _propTypes["default"].number.isRequired,
    datasets: _propTypes["default"].object.isRequired,
    visStateActions: _propTypes["default"].object.isRequired,
    mapStyleActions: _propTypes["default"].object.isRequired,
    availableProviders: _propTypes["default"].object,
    mapSaved: _propTypes["default"].string,
    panels: _propTypes["default"].arrayOf(_propTypes["default"].object)
  });
  (0, _defineProperty2["default"])(SidePanel, "defaultProps", {
    panels: _defaultSettings.SIDEBAR_PANELS,
    uiState: {},
    visStateActions: {},
    mapStyleActions: {},
    uiStateActions: {},
    availableProviders: {}
  });
  return SidePanel;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwuanMiXSwibmFtZXMiOlsiU2lkZVBhbmVsQ29udGVudCIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzaWRlUGFuZWxTY3JvbGxCYXIiLCJzaWRlUGFuZWxJbm5lclBhZGRpbmciLCJQYW5lbFRpdGxlRmFjdG9yeSIsInRpdGxlVGV4dENvbG9yIiwiU2lkZVBhbmVsRmFjdG9yeSIsImRlcHMiLCJTaWRlYmFyRmFjdG9yeSIsIlBhbmVsSGVhZGVyRmFjdG9yeSIsIlBhbmVsVG9nZ2xlRmFjdG9yeSIsIkxheWVyTWFuYWdlckZhY3RvcnkiLCJGaWx0ZXJNYW5hZ2VyRmFjdG9yeSIsIkludGVyYWN0aW9uTWFuYWdlckZhY3RvcnkiLCJNYXBNYW5hZ2VyRmFjdG9yeSIsIkN1c3RvbVBhbmVsc0ZhY3RvcnkiLCJTaWRlYmFyIiwiUGFuZWxIZWFkZXIiLCJQYW5lbFRvZ2dsZSIsIlBhbmVsVGl0bGUiLCJMYXllck1hbmFnZXIiLCJGaWx0ZXJNYW5hZ2VyIiwiSW50ZXJhY3Rpb25NYW5hZ2VyIiwiTWFwTWFuYWdlciIsIkN1c3RvbVBhbmVscyIsImN1c3RvbVBhbmVscyIsImdldEN1c3RvbVBhbmVsUHJvcHMiLCJTaWRlUGFuZWwiLCJ1aVN0YXRlQWN0aW9ucyIsInRvZ2dsZVNpZGVQYW5lbCIsInVpU3RhdGUiLCJhY3RpdmVTaWRlUGFuZWwiLCJkYXRhSWQiLCJ2aXNTdGF0ZUFjdGlvbnMiLCJzaG93RGF0YXNldFRhYmxlIiwidG9nZ2xlTW9kYWwiLCJEQVRBX1RBQkxFX0lEIiwiQUREX0RBVEFfSUQiLCJBRERfTUFQX1NUWUxFX0lEIiwia2V5Iiwib3BlbkRlbGV0ZU1vZGFsIiwiRVhQT1JUX0lNQUdFX0lEIiwiRVhQT1JUX0RBVEFfSUQiLCJFWFBPUlRfTUFQX0lEIiwibWFwU2F2ZWQiLCJPVkVSV1JJVEVfTUFQX0lEIiwiU0FWRV9NQVBfSUQiLCJzZXRNYXBJbmZvIiwidGl0bGUiLCJtYXBJbmZvIiwiU0hBUkVfTUFQX0lEIiwiYXBwTmFtZSIsImFwcFdlYnNpdGUiLCJ2ZXJzaW9uIiwiZGF0YXNldHMiLCJmaWx0ZXJzIiwibGF5ZXJzIiwibGF5ZXJCbGVuZGluZyIsImxheWVyQ2xhc3NlcyIsImxheWVyT3JkZXIiLCJpbnRlcmFjdGlvbkNvbmZpZyIsIm1hcFN0eWxlQWN0aW9ucyIsImF2YWlsYWJsZVByb3ZpZGVycyIsImlzT3BlbiIsIkJvb2xlYW4iLCJwYW5lbHMiLCJsYXllck1hbmFnZXJBY3Rpb25zIiwiYWRkTGF5ZXIiLCJsYXllckNvbmZpZ0NoYW5nZSIsImxheWVyQ29sb3JVSUNoYW5nZSIsImxheWVyVGV4dExhYmVsQ2hhbmdlIiwibGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlIiwibGF5ZXJUeXBlQ2hhbmdlIiwibGF5ZXJWaXNDb25maWdDaGFuZ2UiLCJ1cGRhdGVMYXllckJsZW5kaW5nIiwidXBkYXRlTGF5ZXJPcmRlciIsInJlb3JkZXJMYXllciIsIl9zaG93RGF0YXNldFRhYmxlIiwic2hvd0FkZERhdGFNb2RhbCIsIl9zaG93QWRkRGF0YU1vZGFsIiwicmVtb3ZlTGF5ZXIiLCJyZW1vdmVEYXRhc2V0IiwiX3JlbW92ZURhdGFzZXQiLCJvcGVuTW9kYWwiLCJmaWx0ZXJNYW5hZ2VyQWN0aW9ucyIsImFkZEZpbHRlciIsInJlbW92ZUZpbHRlciIsInNldEZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsInRvZ2dsZUZpbHRlckFuaW1hdGlvbiIsImVubGFyZ2VGaWx0ZXIiLCJ0b2dnbGVGaWx0ZXJGZWF0dXJlIiwiaW50ZXJhY3Rpb25NYW5hZ2VyQWN0aW9ucyIsIm9uQ29uZmlnQ2hhbmdlIiwiaW50ZXJhY3Rpb25Db25maWdDaGFuZ2UiLCJtYXBNYW5hZ2VyQWN0aW9ucyIsImFkZE1hcFN0eWxlVXJsIiwibWFwQ29uZmlnQ2hhbmdlIiwib25TdHlsZUNoYW5nZSIsIm1hcFN0eWxlQ2hhbmdlIiwib25CdWlsZGluZ0NoYW5nZSIsIm1hcEJ1aWxkaW5nQ2hhbmdlIiwic2V0M2RCdWlsZGluZ0NvbG9yIiwic2hvd0FkZE1hcFN0eWxlTW9kYWwiLCJfc2hvd0FkZE1hcFN0eWxlTW9kYWwiLCJ3aWR0aCIsIl9vbk9wZW5PckNsb3NlIiwidmlzaWJsZURyb3Bkb3duIiwic2hvd0V4cG9ydERyb3Bkb3duIiwiaGlkZUV4cG9ydERyb3Bkb3duIiwiX29uQ2xpY2tFeHBvcnRJbWFnZSIsIl9vbkNsaWNrRXhwb3J0RGF0YSIsIl9vbkNsaWNrRXhwb3J0TWFwIiwib25TYXZlTWFwIiwiaGFzU3RvcmFnZSIsIl9vbkNsaWNrU2F2ZVRvU3RvcmFnZSIsIl9vbkNsaWNrU2F2ZUFzVG9TdG9yYWdlIiwiaGFzU2hhcmUiLCJfb25DbGlja1NoYXJlTWFwIiwiZmluZCIsImlkIiwibGFiZWwiLCJjb2xvclBhbGV0dGUiLCJtYXBTdHlsZSIsInAiLCJQdXJlQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiYXJyYXlPZiIsImFueSIsImlzUmVxdWlyZWQiLCJvYmplY3QiLCJzdHJpbmciLCJudW1iZXIiLCJTSURFQkFSX1BBTkVMUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFNQSxnQkFBZ0IsR0FBR0MsNkJBQU9DLEdBQVYsb0JBQ2xCLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsa0JBQWhCO0FBQUEsQ0FEYSxFQUdULFVBQUFGLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUUscUJBQWhCO0FBQUEsQ0FISSxDQUF0Qjs7QUFjTyxJQUFNQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CO0FBQUEsU0FBTU4sNkJBQU9DLEdBQWIscUJBQ3RCLFVBQUFDLEtBQUs7QUFBQSxXQUFJQSxLQUFLLENBQUNDLEtB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QVVNLE1BQVYsQ0FBaUJILFVBUFA7QUFRakIzRSxJQUFBQSxRQUFRLEVBQUV3RSxzQkFBVUksTUFBVixDQUFpQkQsVUFSVjtBQVNqQmhHLElBQUFBLGVBQWUsRUFBRTZGLHNCQUFVSSxNQUFWLENBQWlCRCxVQVRqQjtBQVVqQnBFLElBQUFBLGVBQWUsRUFBRWlFLHNCQUFVSSxNQUFWLENBQWlCRCxVQVZqQjtBQVdqQm5FLElBQUFBLGtCQUFrQixFQUFFZ0Usc0JBQVVJLE1BWGI7QUFZakJ0RixJQUFBQSxRQUFRLEVBQUVrRixzQkFBVUssTUFaSDtBQWFqQmxFLElBQUFBLE1BQU0sRUFBRTZELHNCQUFVQyxPQUFWLENBQWtCRCxzQkFBVUksTUFBNUI7QUFiUyxHQUxyQjtBQUFBLG1DQUlNdkcsU0FKTixrQkFxQndCO0FBQ3BCc0MsSUFBQUEsTUFBTSxFQUFFb0UsK0JBRFk7QUFFcEJ2RyxJQUFBQSxPQUFPLEVBQUUsRUFGVztBQUdwQkcsSUFBQUEsZUFBZSxFQUFFLEVBSEc7QUFJcEI0QixJQUFBQSxlQUFlLEVBQUUsRUFKRztBQUtwQmpDLElBQUFBLGNBQWMsRUFBRSxFQUxJO0FBTXBCa0MsSUFBQUEsa0JBQWtCLEVBQUU7QUFOQSxHQXJCeEI7QUErTkEsU0FBT25DLFNBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1B1cmVDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC5nZXQnO1xuXG5pbXBvcnQgU2lkZWJhckZhY3RvcnkgZnJvbSAnLi9zaWRlLXBhbmVsL3NpZGUtYmFyJztcbmltcG9ydCBQYW5lbEhlYWRlckZhY3RvcnkgZnJvbSAnLi9zaWRlLXBhbmVsL3BhbmVsLWhlYWRlcic7XG5pbXBvcnQgTGF5ZXJNYW5hZ2VyRmFjdG9yeSBmcm9tICcuL3NpZGUtcGFuZWwvbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQgRmlsdGVyTWFuYWdlckZhY3RvcnkgZnJvbSAnLi9zaWRlLXBhbmVsL2ZpbHRlci1tYW5hZ2VyJztcbmltcG9ydCBJbnRlcmFjdGlvbk1hbmFnZXJGYWN0b3J5IGZyb20gJy4vc2lkZS1wYW5lbC9pbnRlcmFjdGlvbi1tYW5hZ2VyJztcbmltcG9ydCBNYXBNYW5hZ2VyRmFjdG9yeSBmcm9tICcuL3NpZGUtcGFuZWwvbWFwLW1hbmFnZXInO1xuaW1wb3J0IFBhbmVsVG9nZ2xlRmFjdG9yeSBmcm9tICcuL3NpZGUtcGFuZWwvcGFuZWwtdG9nZ2xlJztcbmltcG9ydCBDdXN0b21QYW5lbHNGYWN0b3J5IGZyb20gJy4vc2lkZS1wYW5lbC9jdXN0b20tcGFuZWwnO1xuXG5pbXBvcnQge1xuICBBRERfREFUQV9JRCxcbiAgQUREX01BUF9TVFlMRV9JRCxcbiAgREFUQV9UQUJMRV9JRCxcbiAgRVhQT1JUX0lNQUdFX0lELFxuICBFWFBPUlRfREFUQV9JRCxcbiAgRVhQT1JUX01BUF9JRCxcbiAgU0FWRV9NQVBfSUQsXG4gIFNIQVJFX01BUF9JRCxcbiAgU0lERUJBUl9QQU5FTFMsXG4gIE9WRVJXUklURV9NQVBfSURcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBTaWRlUGFuZWxDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxTY3JvbGxCYXJ9O1xuICBmbGV4LWdyb3c6IDE7XG4gIHBhZGRpbmc6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsSW5uZXJQYWRkaW5nfXB4O1xuICBvdmVyZmxvdy15OiBzY3JvbGw7XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcblxuICAuc2lkZS1wYW5lbF9fY29udGVudF9faW5uZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBQYW5lbFRpdGxlRmFjdG9yeSA9ICgpID0+IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlVGV4dENvbG9yfTtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBmb250LXdlaWdodDogNDAwO1xuICBsZXR0ZXItc3BhY2luZzogMS4yNXB4O1xuICBtYXJnaW4tYm90dG9tOiAxNHB4O1xuYDtcblxuU2lkZVBhbmVsRmFjdG9yeS5kZXBzID0gW1xuICBTaWRlYmFyRmFjdG9yeSxcbiAgUGFuZWxIZWFkZXJGYWN0b3J5LFxuICBQYW5lbFRvZ2dsZUZhY3RvcnksXG4gIFBhbmVsVGl0bGVGYWN0b3J5LFxuICBMYXllck1hbmFnZXJGYWN0b3J5LFxuICBGaWx0ZXJNYW5hZ2VyRmFjdG9yeSxcbiAgSW50ZXJhY3Rpb25NYW5hZ2VyRmFjdG9yeSxcbiAgTWFwTWFuYWdlckZhY3RvcnksXG4gIEN1c3RvbVBhbmVsc0ZhY3Rvcnlcbl07XG5cbi8qKlxuICpcbiAqIFZlcnRpY2FsIHNpZGViYXIgY29udGFpbmluZyBpbnB1dCBjb21wb25lbnRzIGZvciB0aGUgcmVuZGVyaW5nIGxheWVyc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaWRlUGFuZWxGYWN0b3J5KFxuICBTaWRlYmFyLFxuICBQYW5lbEhlYWRlcixcbiAgUGFuZWxUb2dnbGUsXG4gIFBhbmVsVGl0bGUsXG4gIExheWVyTWFuYWdlcixcbiAgRmlsdGVyTWFuYWdlcixcbiAgSW50ZXJhY3Rpb25NYW5hZ2VyLFxuICBNYXBNYW5hZ2VyLFxuICBDdXN0b21QYW5lbHNcbikge1xuICBjb25zdCBjdXN0b21QYW5lbHMgPSBnZXQoQ3VzdG9tUGFuZWxzLCBbJ2RlZmF1bHRQcm9wcycsICdwYW5lbHMnXSkgfHwgW107XG4gIGNvbnN0IGdldEN1c3RvbVBhbmVsUHJvcHMgPSBnZXQoQ3VzdG9tUGFuZWxzLCBbJ2RlZmF1bHRQcm9wcycsICdnZXRQcm9wcyddKSB8fCAoKCkgPT4gKHt9KSk7XG5cbiAgY2xhc3MgU2lkZVBhbmVsIGV4dGVuZHMgUHVyZUNvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGZpbHRlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJCbGVuZGluZzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KS5pc1JlcXVpcmVkLFxuICAgICAgbGF5ZXJDbGFzc2VzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBtYXBTdHlsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICB2aXNTdGF0ZUFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG1hcFN0eWxlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgYXZhaWxhYmxlUHJvdmlkZXJzOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgbWFwU2F2ZWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBwYW5lbHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBwYW5lbHM6IFNJREVCQVJfUEFORUxTLFxuICAgICAgdWlTdGF0ZToge30sXG4gICAgICB2aXNTdGF0ZUFjdGlvbnM6IHt9LFxuICAgICAgbWFwU3R5bGVBY3Rpb25zOiB7fSxcbiAgICAgIHVpU3RhdGVBY3Rpb25zOiB7fSxcbiAgICAgIGF2YWlsYWJsZVByb3ZpZGVyczoge31cbiAgICB9O1xuXG4gICAgLyogY29tcG9uZW50IHByaXZhdGUgZnVuY3Rpb25zICovXG4gICAgX29uT3Blbk9yQ2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZVNpZGVQYW5lbChcbiAgICAgICAgdGhpcy5wcm9wcy51aVN0YXRlLmFjdGl2ZVNpZGVQYW5lbCA/IG51bGwgOiAnbGF5ZXInXG4gICAgICApO1xuICAgIH07XG5cbiAgICBfc2hvd0RhdGFzZXRUYWJsZSA9IGRhdGFJZCA9PiB7XG4gICAgICAvLyB0aGlzIHdpbGwgb3BlbiBkYXRhIHRhYmxlIG1vZGFsXG4gICAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5zaG93RGF0YXNldFRhYmxlKGRhdGFJZCk7XG4gICAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKERBVEFfVEFCTEVfSUQpO1xuICAgIH07XG5cbiAgICBfc2hvd0FkZERhdGFNb2RhbCA9ICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlTW9kYWwoQUREX0RBVEFfSUQpO1xuICAgIH07XG5cbiAgICBfc2hvd0FkZE1hcFN0eWxlTW9kYWwgPSAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKEFERF9NQVBfU1RZTEVfSUQpO1xuICAgIH07XG5cbiAgICBfcmVtb3ZlRGF0YXNldCA9IGtleSA9PiB7XG4gICAgICAvLyB0aGlzIHdpbGwgc2hvdyB0aGUgbW9kYWwgZGlhbG9nIHRvIGNvbmZpcm0gZGVsZXRpb25cbiAgICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMub3BlbkRlbGV0ZU1vZGFsKGtleSk7XG4gICAgfTtcblxuICAgIF9vbkNsaWNrRXhwb3J0SW1hZ2UgPSAoKSA9PiB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKEVYUE9SVF9JTUFHRV9JRCk7XG5cbiAgICBfb25DbGlja0V4cG9ydERhdGEgPSAoKSA9PiB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKEVYUE9SVF9EQVRBX0lEKTtcblxuICAgIF9vbkNsaWNrRXhwb3J0TWFwID0gKCkgPT4gdGhpcy5wcm9wcy51aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbChFWFBPUlRfTUFQX0lEKTtcblxuICAgIF9vbkNsaWNrU2F2ZVRvU3RvcmFnZSA9ICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlTW9kYWwodGhpcy5wcm9wcy5tYXBTYXZlZCA/IE9WRVJXUklURV9NQVBfSUQgOiBTQVZFX01BUF9JRCk7XG4gICAgfTtcblxuICAgIF9vbkNsaWNrU2F2ZUFzVG9TdG9yYWdlID0gKCkgPT4ge1xuICAgICAgLy8gYWRkIChjb3B5KSB0byBmaWxlIG5hbWVcbiAgICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLnNldE1hcEluZm8oe1xuICAgICAgICB0aXRsZTogYCR7dGhpcy5wcm9wcy5tYXBJbmZvLnRpdGxlIHx8ICdLZXBsZXIuZ2wnfSAoQ29weSlgXG4gICAgICB9KTtcbiAgICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlTW9kYWwoU0FWRV9NQVBfSUQpO1xuICAgIH07XG5cbiAgICBfb25DbGlja1NoYXJlTWFwID0gKCkgPT4gdGhpcy5wcm9wcy51aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbChTSEFSRV9NQVBfSUQpO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGFwcE5hbWUsXG4gICAgICAgIGFwcFdlYnNpdGUsXG4gICAgICAgIHZlcnNpb24sXG4gICAgICAgIGRhdGFzZXRzLFxuICAgICAgICBmaWx0ZXJzLFxuICAgICAgICBsYXllcnMsXG4gICAgICAgIGxheWVyQmxlbmRpbmcsXG4gICAgICAgIGxheWVyQ2xhc3NlcyxcbiAgICAgICAgdWlTdGF0ZSxcbiAgICAgICAgbGF5ZXJPcmRlcixcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgICAgICB1aVN0YXRlQWN0aW9ucyxcbiAgICAgICAgYXZhaWxhYmxlUHJvdmlkZXJzXG4gICAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgY29uc3Qge2FjdGl2ZVNpZGVQYW5lbH0gPSB1aVN0YXRlO1xuICAgICAgY29uc3QgaXNPcGVuID0gQm9vbGVhbihhY3RpdmVTaWRlUGFuZWwpO1xuICAgICAgY29uc3QgcGFuZWxzID0gWy4uLnRoaXMucHJvcHMucGFuZWxzLCAuLi5jdXN0b21QYW5lbHNdO1xuXG4gICAgICBjb25zdCBsYXllck1hbmFnZXJBY3Rpb25zID0ge1xuICAgICAgICBhZGRMYXllcjogdmlzU3RhdGVBY3Rpb25zLmFkZExheWVyLFxuICAgICAgICBsYXllckNvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyQ29uZmlnQ2hhbmdlLFxuICAgICAgICBsYXllckNvbG9yVUlDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5sYXllckNvbG9yVUlDaGFuZ2UsXG4gICAgICAgIGxheWVyVGV4dExhYmVsQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJUZXh0TGFiZWxDaGFuZ2UsXG4gICAgICAgIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSxcbiAgICAgICAgbGF5ZXJUeXBlQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJUeXBlQ2hhbmdlLFxuICAgICAgICBsYXllclZpc0NvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyVmlzQ29uZmlnQ2hhbmdlLFxuICAgICAgICB1cGRhdGVMYXllckJsZW5kaW5nOiB2aXNTdGF0ZUFjdGlvbnMudXBkYXRlTGF5ZXJCbGVuZGluZyxcbiAgICAgICAgdXBkYXRlTGF5ZXJPcmRlcjogdmlzU3RhdGVBY3Rpb25zLnJlb3JkZXJMYXllcixcbiAgICAgICAgc2hvd0RhdGFzZXRUYWJsZTogdGhpcy5fc2hvd0RhdGFzZXRUYWJsZSxcbiAgICAgICAgc2hvd0FkZERhdGFNb2RhbDogdGhpcy5fc2hvd0FkZERhdGFNb2RhbCxcbiAgICAgICAgcmVtb3ZlTGF5ZXI6IHZpc1N0YXRlQWN0aW9ucy5yZW1vdmVMYXllcixcbiAgICAgICAgcmVtb3ZlRGF0YXNldDogdGhpcy5fcmVtb3ZlRGF0YXNldCxcbiAgICAgICAgb3Blbk1vZGFsOiB1aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbFxuICAgICAgfTtcblxuICAgICAgY29uc3QgZmlsdGVyTWFuYWdlckFjdGlvbnMgPSB7XG4gICAgICAgIGFkZEZpbHRlcjogdmlzU3RhdGVBY3Rpb25zLmFkZEZpbHRlcixcbiAgICAgICAgcmVtb3ZlRmlsdGVyOiB2aXNTdGF0ZUFjdGlvbnMucmVtb3ZlRmlsdGVyLFxuICAgICAgICBzZXRGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5zZXRGaWx0ZXIsXG4gICAgICAgIHNob3dEYXRhc2V0VGFibGU6IHRoaXMuX3Nob3dEYXRhc2V0VGFibGUsXG4gICAgICAgIHNob3dBZGREYXRhTW9kYWw6IHRoaXMuX3Nob3dBZGREYXRhTW9kYWwsXG4gICAgICAgIHRvZ2dsZUFuaW1hdGlvbjogdmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUZpbHRlckFuaW1hdGlvbixcbiAgICAgICAgZW5sYXJnZUZpbHRlcjogdmlzU3RhdGVBY3Rpb25zLmVubGFyZ2VGaWx0ZXIsXG4gICAgICAgIHRvZ2dsZUZpbHRlckZlYXR1cmU6IHZpc1N0YXRlQWN0aW9ucy50b2dnbGVGaWx0ZXJGZWF0dXJlXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBpbnRlcmFjdGlvbk1hbmFnZXJBY3Rpb25zID0ge1xuICAgICAgICBvbkNvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmludGVyYWN0aW9uQ29uZmlnQ2hhbmdlXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBtYXBNYW5hZ2VyQWN0aW9ucyA9IHtcbiAgICAgICAgYWRkTWFwU3R5bGVVcmw6IG1hcFN0eWxlQWN0aW9ucy5hZGRNYXBTdHlsZVVybCxcbiAgICAgICAgb25Db25maWdDaGFuZ2U6IG1hcFN0eWxlQWN0aW9ucy5tYXBDb25maWdDaGFuZ2UsXG4gICAgICAgIG9uU3R5bGVDaGFuZ2U6IG1hcFN0eWxlQWN0aW9ucy5tYXBTdHlsZUNoYW5nZSxcbiAgICAgICAgb25CdWlsZGluZ0NoYW5nZTogbWFwU3R5bGVBY3Rpb25zLm1hcEJ1aWxkaW5nQ2hhbmdlLFxuICAgICAgICBzZXQzZEJ1aWxkaW5nQ29sb3I6IG1hcFN0eWxlQWN0aW9ucy5zZXQzZEJ1aWxkaW5nQ29sb3IsXG4gICAgICAgIHNob3dBZGRNYXBTdHlsZU1vZGFsOiB0aGlzLl9zaG93QWRkTWFwU3R5bGVNb2RhbFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8U2lkZWJhclxuICAgICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgICBpc09wZW49e2lzT3Blbn1cbiAgICAgICAgICAgIG1pbmlmaWVkV2lkdGg9ezB9XG4gICAgICAgICAgICBvbk9wZW5PckNsb3NlPXt0aGlzLl9vbk9wZW5PckNsb3NlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxQYW5lbEhlYWRlclxuICAgICAgICAgICAgICBhcHBOYW1lPXthcHBOYW1lfVxuICAgICAgICAgICAgICB2ZXJzaW9uPXt2ZXJzaW9ufVxuICAgICAgICAgICAgICBhcHBXZWJzaXRlPXthcHBXZWJzaXRlfVxuICAgICAgICAgICAgICB2aXNpYmxlRHJvcGRvd249e3VpU3RhdGUudmlzaWJsZURyb3Bkb3dufVxuICAgICAgICAgICAgICBzaG93RXhwb3J0RHJvcGRvd249e3VpU3RhdGVBY3Rpb25zLnNob3dFeHBvcnREcm9wZG93bn1cbiAgICAgICAgICAgICAgaGlkZUV4cG9ydERyb3Bkb3duPXt1aVN0YXRlQWN0aW9ucy5oaWRlRXhwb3J0RHJvcGRvd259XG4gICAgICAgICAgICAgIG9uRXhwb3J0SW1hZ2U9e3RoaXMuX29uQ2xpY2tFeHBvcnRJbWFnZX1cbiAgICAgICAgICAgICAgb25FeHBvcnREYXRhPXt0aGlzLl9vbkNsaWNrRXhwb3J0RGF0YX1cbiAgICAgICAgICAgICAgb25FeHBvcnRNYXA9e3RoaXMuX29uQ2xpY2tFeHBvcnRNYXB9XG4gICAgICAgICAgICAgIG9uU2F2ZU1hcD17dGhpcy5wcm9wcy5vblNhdmVNYXB9XG4gICAgICAgICAgICAgIG9uU2F2ZVRvU3RvcmFnZT17YXZhaWxhYmxlUHJvdmlkZXJzLmhhc1N0b3JhZ2UgPyB0aGlzLl9vbkNsaWNrU2F2ZVRvU3RvcmFnZSA6IG51bGx9XG4gICAgICAgICAgICAgIG9uU2F2ZUFzVG9TdG9yYWdlPXtcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVQcm92aWRlcnMuaGFzU3RvcmFnZSAmJiB0aGlzLnByb3BzLm1hcFNhdmVkXG4gICAgICAgICAgICAgICAgICA/IHRoaXMuX29uQ2xpY2tTYXZlQXNUb1N0b3JhZ2VcbiAgICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG9uU2hhcmVNYXA9e2F2YWlsYWJsZVByb3ZpZGVycy5oYXNTaGFyZSA/IHRoaXMuX29uQ2xpY2tTaGFyZU1hcCA6IG51bGx9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFBhbmVsVG9nZ2xlXG4gICAgICAgICAgICAgIHBhbmVscz17cGFuZWxzfVxuICAgICAgICAgICAgICBhY3RpdmVQYW5lbD17YWN0aXZlU2lkZVBhbmVsfVxuICAgICAgICAgICAgICB0b2dnbGVQYW5lbD17dWlTdGF0ZUFjdGlvbnMudG9nZ2xlU2lkZVBhbmVsfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTaWRlUGFuZWxDb250ZW50IGNsYXNzTmFtZT1cInNpZGUtcGFuZWxfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWRlLXBhbmVsX19jb250ZW50X19pbm5lclwiPlxuICAgICAgICAgICAgICAgIDxQYW5lbFRpdGxlIGNsYXNzTmFtZT1cInNpZGUtcGFuZWxfX2NvbnRlbnRfX3RpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICBpZD17KHBhbmVscy5maW5kKCh7aWR9KSA9PiBpZCA9PT0gYWN0aXZlU2lkZVBhbmVsKSB8fCB7fSkubGFiZWx9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvUGFuZWxUaXRsZT5cbiAgICAgICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnbGF5ZXInICYmIChcbiAgICAgICAgICAgICAgICAgIDxMYXllck1hbmFnZXJcbiAgICAgICAgICAgICAgICAgICAgey4uLmxheWVyTWFuYWdlckFjdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJzPXtsYXllcnN9XG4gICAgICAgICAgICAgICAgICAgIGxheWVyQ2xhc3Nlcz17bGF5ZXJDbGFzc2VzfVxuICAgICAgICAgICAgICAgICAgICBsYXllck9yZGVyPXtsYXllck9yZGVyfVxuICAgICAgICAgICAgICAgICAgICBsYXllckJsZW5kaW5nPXtsYXllckJsZW5kaW5nfVxuICAgICAgICAgICAgICAgICAgICBjb2xvclBhbGV0dGU9e3VpU3RhdGUuY29sb3JQYWxldHRlfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHthY3RpdmVTaWRlUGFuZWwgPT09ICdmaWx0ZXInICYmIChcbiAgICAgICAgICAgICAgICAgIDxGaWx0ZXJNYW5hZ2VyXG4gICAgICAgICAgICAgICAgICAgIHsuLi5maWx0ZXJNYW5hZ2VyQWN0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycz17ZmlsdGVyc31cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnaW50ZXJhY3Rpb24nICYmIChcbiAgICAgICAgICAgICAgICAgIDxJbnRlcmFjdGlvbk1hbmFnZXJcbiAgICAgICAgICAgICAgICAgICAgey4uLmludGVyYWN0aW9uTWFuYWdlckFjdGlvbnN9XG4gICAgICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Db25maWc9e2ludGVyYWN0aW9uQ29uZmlnfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHthY3RpdmVTaWRlUGFuZWwgPT09ICdtYXAnICYmIChcbiAgICAgICAgICAgICAgICAgIDxNYXBNYW5hZ2VyIHsuLi5tYXBNYW5hZ2VyQWN0aW9uc30gbWFwU3R5bGU9e3RoaXMucHJvcHMubWFwU3R5bGV9IC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICB7KGN1c3RvbVBhbmVscyB8fCBbXSkuZmluZChwID0+IHAuaWQgPT09IGFjdGl2ZVNpZGVQYW5lbCkgPyAoXG4gICAgICAgICAgICAgICAgICA8Q3VzdG9tUGFuZWxzXG4gICAgICAgICAgICAgICAgICAgIHsuLi5nZXRDdXN0b21QYW5lbFByb3BzKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVTaWRlUGFuZWw9e2FjdGl2ZVNpZGVQYW5lbH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9TaWRlUGFuZWxDb250ZW50PlxuICAgICAgICAgIDwvU2lkZWJhcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBTaWRlUGFuZWw7XG59XG4iXX0=