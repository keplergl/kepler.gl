'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  ', ';\n  flex-grow: 1;\n  padding: 16px;\n  overflow-y: overlay;\n'], ['\n  ', ';\n  flex-grow: 1;\n  padding: 16px;\n  overflow-y: overlay;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  font-size: 20px;\n  font-weight: 400;\n  letter-spacing: 1.25px;\n  margin-bottom: 14px;\n'], ['\n  color: ', ';\n  font-size: 20px;\n  font-weight: 400;\n  letter-spacing: 1.25px;\n  margin-bottom: 14px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _sideBar = require('./side-panel/side-bar');

var _sideBar2 = _interopRequireDefault(_sideBar);

var _panelHeader = require('./side-panel/panel-header');

var _panelHeader2 = _interopRequireDefault(_panelHeader);

var _layerManager = require('./side-panel/layer-manager');

var _layerManager2 = _interopRequireDefault(_layerManager);

var _filterManager = require('./side-panel/filter-manager');

var _filterManager2 = _interopRequireDefault(_filterManager);

var _interactionManager = require('./side-panel/interaction-manager');

var _interactionManager2 = _interopRequireDefault(_interactionManager);

var _mapManager = require('./side-panel/map-manager');

var _mapManager2 = _interopRequireDefault(_mapManager);

var _panelToggle = require('./side-panel/panel-toggle');

var _panelToggle2 = _interopRequireDefault(_panelToggle);

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  filters: _propTypes2.default.array.isRequired,
  interactionConfig: _propTypes2.default.object.isRequired,
  layerBlending: _propTypes2.default.string.isRequired,
  layers: _propTypes2.default.array.isRequired,
  mapStyle: _propTypes2.default.object.isRequired,
  width: _propTypes2.default.number.isRequired,
  datasets: _propTypes2.default.object.isRequired,
  visStateActions: _propTypes2.default.object.isRequired,
  mapStyleActions: _propTypes2.default.object.isRequired
};

var SidePanelContent = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.sidePanelScrollBar;
});

var PanelTitle = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.titleTextColor;
});

/**
 *
 * Vertical sidebar containing input components for the rendering layers
 */

var SidePanel = function (_Component) {
  (0, _inherits3.default)(SidePanel, _Component);

  function SidePanel() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SidePanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SidePanel.__proto__ || Object.getPrototypeOf(SidePanel)).call.apply(_ref, [this].concat(args))), _this), _this._onOpenOrClose = function () {
      _this.props.uiStateActions.toggleSidePanel(_this.props.uiState.activeSidePanel ? null : 'layer');
    }, _this._showDatasetTable = function (dataId) {
      // this will open data table modal
      _this.props.visStateActions.showDatasetTable(dataId);
      _this.props.uiStateActions.toggleModal(_defaultSettings.DATA_TABLE_ID);
    }, _this._showAddDataModal = function () {
      _this.props.uiStateActions.toggleModal(_defaultSettings.ADD_DATA_ID);
    }, _this._removeDataset = function (key) {
      // this will show the modal dialog to confirm deletion
      _this.props.uiStateActions.openDeleteModal(key);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }
  /* component private functions */


  (0, _createClass3.default)(SidePanel, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          datasets = _props.datasets,
          filters = _props.filters,
          layers = _props.layers,
          layerBlending = _props.layerBlending,
          uiState = _props.uiState,
          layerOrder = _props.layerOrder,
          interactionConfig = _props.interactionConfig,
          visStateActions = _props.visStateActions,
          mapStyleActions = _props.mapStyleActions,
          uiStateActions = _props.uiStateActions;
      var activeSidePanel = uiState.activeSidePanel;

      var isOpen = Boolean(activeSidePanel);

      var layerManagerActions = {
        addLayer: visStateActions.addLayer,
        layerConfigChange: visStateActions.layerConfigChange,
        layerVisualChannelConfigChange: visStateActions.layerVisualChannelConfigChange,
        layerTypeChange: visStateActions.layerTypeChange,
        layerVisConfigChange: visStateActions.layerVisConfigChange,
        updateLayerBlending: visStateActions.updateLayerBlending,
        updateLayerOrder: visStateActions.reorderLayer,
        showDatasetTable: this._showDatasetTable,
        showAddDataModal: this._showAddDataModal,
        removeLayer: visStateActions.removeLayer,
        removeDataset: this._removeDataset
      };

      var filterManagerActions = {
        addFilter: visStateActions.addFilter,
        removeFilter: visStateActions.removeFilter,
        setFilter: visStateActions.setFilter,
        showDatasetTable: this._showDatasetTable,
        showAddDataModal: this._showAddDataModal,
        toggleAnimation: visStateActions.toggleAnimation,
        enlargeFilter: visStateActions.enlargeFilter
      };

      var interactionManagerActions = {
        onConfigChange: visStateActions.interactionConfigChange
      };

      var mapManagerActions = {
        onConfigChange: mapStyleActions.mapConfigChange,
        onStyleChange: mapStyleActions.mapStyleChange,
        onBuildingChange: mapStyleActions.mapBuildingChange
      };

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _sideBar2.default,
          {
            width: this.props.width,
            isOpen: isOpen,
            minifiedWidth: 0,
            onOpenOrClose: this._onOpenOrClose
          },
          _react2.default.createElement(_panelHeader2.default, null),
          _react2.default.createElement(_panelToggle2.default, {
            panels: _defaultSettings.PANELS,
            activePanel: activeSidePanel,
            togglePanel: uiStateActions.toggleSidePanel
          }),
          _react2.default.createElement(
            SidePanelContent,
            { className: 'side-panel__content' },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                PanelTitle,
                { className: 'side-panel__content__title' },
                (_defaultSettings.PANELS.find(function (_ref2) {
                  var id = _ref2.id;
                  return id === activeSidePanel;
                }) || {}).label
              ),
              activeSidePanel === 'layer' && _react2.default.createElement(_layerManager2.default, (0, _extends3.default)({}, layerManagerActions, {
                datasets: datasets,
                layers: layers,
                layerOrder: layerOrder,
                layerBlending: layerBlending,
                openModal: uiStateActions.toggleModal
              })),
              activeSidePanel === 'filter' && _react2.default.createElement(_filterManager2.default, (0, _extends3.default)({}, filterManagerActions, {
                datasets: datasets,
                filters: filters
              })),
              activeSidePanel === 'interaction' && _react2.default.createElement(_interactionManager2.default, (0, _extends3.default)({}, interactionManagerActions, {
                datasets: datasets,
                interactionConfig: interactionConfig
              })),
              activeSidePanel === 'map' && _react2.default.createElement(_mapManager2.default, (0, _extends3.default)({}, mapManagerActions, {
                mapStyle: this.props.mapStyle
              }))
            )
          )
        )
      );
    }
  }]);
  return SidePanel;
}(_react.Component);

exports.default = SidePanel;


SidePanel.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZmlsdGVycyIsImFycmF5IiwiaXNSZXF1aXJlZCIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsInN0cmluZyIsImxheWVycyIsIm1hcFN0eWxlIiwid2lkdGgiLCJudW1iZXIiLCJkYXRhc2V0cyIsInZpc1N0YXRlQWN0aW9ucyIsIm1hcFN0eWxlQWN0aW9ucyIsIlNpZGVQYW5lbENvbnRlbnQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwic2lkZVBhbmVsU2Nyb2xsQmFyIiwiUGFuZWxUaXRsZSIsInRpdGxlVGV4dENvbG9yIiwiU2lkZVBhbmVsIiwiX29uT3Blbk9yQ2xvc2UiLCJ1aVN0YXRlQWN0aW9ucyIsInRvZ2dsZVNpZGVQYW5lbCIsInVpU3RhdGUiLCJhY3RpdmVTaWRlUGFuZWwiLCJfc2hvd0RhdGFzZXRUYWJsZSIsInNob3dEYXRhc2V0VGFibGUiLCJkYXRhSWQiLCJ0b2dnbGVNb2RhbCIsIl9zaG93QWRkRGF0YU1vZGFsIiwiX3JlbW92ZURhdGFzZXQiLCJvcGVuRGVsZXRlTW9kYWwiLCJrZXkiLCJsYXllck9yZGVyIiwiaXNPcGVuIiwiQm9vbGVhbiIsImxheWVyTWFuYWdlckFjdGlvbnMiLCJhZGRMYXllciIsImxheWVyQ29uZmlnQ2hhbmdlIiwibGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlIiwibGF5ZXJUeXBlQ2hhbmdlIiwibGF5ZXJWaXNDb25maWdDaGFuZ2UiLCJ1cGRhdGVMYXllckJsZW5kaW5nIiwidXBkYXRlTGF5ZXJPcmRlciIsInJlb3JkZXJMYXllciIsInNob3dBZGREYXRhTW9kYWwiLCJyZW1vdmVMYXllciIsInJlbW92ZURhdGFzZXQiLCJmaWx0ZXJNYW5hZ2VyQWN0aW9ucyIsImFkZEZpbHRlciIsInJlbW92ZUZpbHRlciIsInNldEZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsImVubGFyZ2VGaWx0ZXIiLCJpbnRlcmFjdGlvbk1hbmFnZXJBY3Rpb25zIiwib25Db25maWdDaGFuZ2UiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZSIsIm1hcE1hbmFnZXJBY3Rpb25zIiwibWFwQ29uZmlnQ2hhbmdlIiwib25TdHlsZUNoYW5nZSIsIm1hcFN0eWxlQ2hhbmdlIiwib25CdWlsZGluZ0NoYW5nZSIsIm1hcEJ1aWxkaW5nQ2hhbmdlIiwiZmluZCIsImlkIiwibGFiZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBTUEsSUFBTUEsWUFBWTtBQUNoQkMsV0FBUyxvQkFBVUMsS0FBVixDQUFnQkMsVUFEVDtBQUVoQkMscUJBQW1CLG9CQUFVQyxNQUFWLENBQWlCRixVQUZwQjtBQUdoQkcsaUJBQWUsb0JBQVVDLE1BQVYsQ0FBaUJKLFVBSGhCO0FBSWhCSyxVQUFRLG9CQUFVTixLQUFWLENBQWdCQyxVQUpSO0FBS2hCTSxZQUFVLG9CQUFVSixNQUFWLENBQWlCRixVQUxYO0FBTWhCTyxTQUFPLG9CQUFVQyxNQUFWLENBQWlCUixVQU5SO0FBT2hCUyxZQUFVLG9CQUFVUCxNQUFWLENBQWlCRixVQVBYO0FBUWhCVSxtQkFBaUIsb0JBQVVSLE1BQVYsQ0FBaUJGLFVBUmxCO0FBU2hCVyxtQkFBaUIsb0JBQVVULE1BQVYsQ0FBaUJGO0FBVGxCLENBQWxCOztBQVlBLElBQU1ZLG1CQUFtQiwyQkFBT0MsR0FBMUIsa0JBQ0Y7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLGtCQUFyQjtBQUFBLENBREUsQ0FBTjs7QUFPQSxJQUFNQyxhQUFhLDJCQUFPSixHQUFwQixtQkFDSztBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUcsY0FBckI7QUFBQSxDQURMLENBQU47O0FBUUE7Ozs7O0lBSXFC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cUJBQTVCO0FBQ0U7QUFBQTtBQUFBO0FBQ0E7QUFBQywwQkFBRDtBQUFBLGtCQUFZLFdBQVUsNEJBQXRCO0FBQ0csaUJBQUMsd0JBQU95QyxJQUFQLENBQVk7QUFBQSxzQkFBRUMsRUFBRixTQUFFQSxFQUFGO0FBQUEseUJBQVVBLE9BQU94QyxlQUFqQjtBQUFBLGlCQUFaLEtBQWlELEVBQWxELEVBQXNEeUM7QUFEekQsZUFEQTtBQUlDekMsa0NBQW9CLE9BQXBCLElBQ0MsaUZBQ01ZLG1CQUROO0FBRUUsMEJBQVUzQixRQUZaO0FBR0Usd0JBQVFKLE1BSFY7QUFJRSw0QkFBWTRCLFVBSmQ7QUFLRSwrQkFBZTlCLGFBTGpCO0FBTUUsMkJBQVdrQixlQUFlTztBQU41QixpQkFMRjtBQWNDSixrQ0FBb0IsUUFBcEIsSUFDQyxrRkFDTXdCLG9CQUROO0FBRUUsMEJBQVV2QyxRQUZaO0FBR0UseUJBQVNYO0FBSFgsaUJBZkY7QUFxQkMwQixrQ0FBb0IsYUFBcEIsSUFDQyx1RkFDTThCLHlCQUROO0FBRUUsMEJBQVU3QyxRQUZaO0FBR0UsbUNBQW1CUjtBQUhyQixpQkF0QkY7QUE0QkN1QixrQ0FBb0IsS0FBcEIsSUFDQywrRUFDTWlDLGlCQUROO0FBRUUsMEJBQVUsS0FBSzNDLEtBQUwsQ0FBV1I7QUFGdkI7QUE3QkY7QUFERjtBQVpGO0FBREYsT0FERjtBQXNERDs7Ozs7a0JBaElrQmEsUzs7O0FBbUlyQkEsVUFBVXRCLFNBQVYsR0FBc0JBLFNBQXRCIiwiZmlsZSI6InNpZGUtcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IFNpZGViYXIgZnJvbSAnLi9zaWRlLXBhbmVsL3NpZGUtYmFyJztcbmltcG9ydCBQYW5lbEhlYWRlciBmcm9tICcuL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyJztcbmltcG9ydCBMYXllck1hbmFnZXIgZnJvbSAnLi9zaWRlLXBhbmVsL2xheWVyLW1hbmFnZXInO1xuaW1wb3J0IEZpbHRlck1hbmFnZXIgZnJvbSAnLi9zaWRlLXBhbmVsL2ZpbHRlci1tYW5hZ2VyJztcbmltcG9ydCBJbnRlcmFjdGlvbk1hbmFnZXIgZnJvbSAnLi9zaWRlLXBhbmVsL2ludGVyYWN0aW9uLW1hbmFnZXInO1xuaW1wb3J0IE1hcE1hbmFnZXIgZnJvbSAnLi9zaWRlLXBhbmVsL21hcC1tYW5hZ2VyJztcbmltcG9ydCBQYW5lbFRvZ2dsZSBmcm9tICcuL3NpZGUtcGFuZWwvcGFuZWwtdG9nZ2xlJztcblxuaW1wb3J0IHtcbiAgUEFORUxTLFxuICBEQVRBX1RBQkxFX0lELFxuICBBRERfREFUQV9JRFxufSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZmlsdGVyczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGludGVyYWN0aW9uQ29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxheWVyQmxlbmRpbmc6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdmlzU3RhdGVBY3Rpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIG1hcFN0eWxlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBTaWRlUGFuZWxDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxTY3JvbGxCYXJ9O1xuICBmbGV4LWdyb3c6IDE7XG4gIHBhZGRpbmc6IDE2cHg7XG4gIG92ZXJmbG93LXk6IG92ZXJsYXk7XG5gO1xuXG5jb25zdCBQYW5lbFRpdGxlID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVUZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDIwcHg7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAxLjI1cHg7XG4gIG1hcmdpbi1ib3R0b206IDE0cHg7XG5gO1xuXG4vKipcbiAqXG4gKiBWZXJ0aWNhbCBzaWRlYmFyIGNvbnRhaW5pbmcgaW5wdXQgY29tcG9uZW50cyBmb3IgdGhlIHJlbmRlcmluZyBsYXllcnNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lkZVBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLyogY29tcG9uZW50IHByaXZhdGUgZnVuY3Rpb25zICovXG4gIF9vbk9wZW5PckNsb3NlID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlU2lkZVBhbmVsKFxuICAgICAgdGhpcy5wcm9wcy51aVN0YXRlLmFjdGl2ZVNpZGVQYW5lbCA/IG51bGwgOiAnbGF5ZXInXG4gICAgKTtcbiAgfTtcblxuICBfc2hvd0RhdGFzZXRUYWJsZSA9IGRhdGFJZCA9PiB7XG4gICAgLy8gdGhpcyB3aWxsIG9wZW4gZGF0YSB0YWJsZSBtb2RhbFxuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLnNob3dEYXRhc2V0VGFibGUoZGF0YUlkKTtcbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKERBVEFfVEFCTEVfSUQpO1xuICB9O1xuXG4gIF9zaG93QWRkRGF0YU1vZGFsID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlTW9kYWwoQUREX0RBVEFfSUQpO1xuICB9O1xuXG4gIF9yZW1vdmVEYXRhc2V0ID0ga2V5ID0+IHtcbiAgICAvLyB0aGlzIHdpbGwgc2hvdyB0aGUgbW9kYWwgZGlhbG9nIHRvIGNvbmZpcm0gZGVsZXRpb25cbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLm9wZW5EZWxldGVNb2RhbChrZXkpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBkYXRhc2V0cyxcbiAgICAgIGZpbHRlcnMsXG4gICAgICBsYXllcnMsXG4gICAgICBsYXllckJsZW5kaW5nLFxuICAgICAgdWlTdGF0ZSxcbiAgICAgIGxheWVyT3JkZXIsXG4gICAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgIG1hcFN0eWxlQWN0aW9ucyxcbiAgICAgIHVpU3RhdGVBY3Rpb25zXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2FjdGl2ZVNpZGVQYW5lbH0gPSB1aVN0YXRlO1xuICAgIGNvbnN0IGlzT3BlbiA9IEJvb2xlYW4oYWN0aXZlU2lkZVBhbmVsKTtcblxuICAgIGNvbnN0IGxheWVyTWFuYWdlckFjdGlvbnMgPSB7XG4gICAgICBhZGRMYXllcjogdmlzU3RhdGVBY3Rpb25zLmFkZExheWVyLFxuICAgICAgbGF5ZXJDb25maWdDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5sYXllckNvbmZpZ0NoYW5nZSxcbiAgICAgIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZTpcbiAgICAgICAgdmlzU3RhdGVBY3Rpb25zLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSxcbiAgICAgIGxheWVyVHlwZUNoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyVHlwZUNoYW5nZSxcbiAgICAgIGxheWVyVmlzQ29uZmlnQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJWaXNDb25maWdDaGFuZ2UsXG4gICAgICB1cGRhdGVMYXllckJsZW5kaW5nOiB2aXNTdGF0ZUFjdGlvbnMudXBkYXRlTGF5ZXJCbGVuZGluZyxcbiAgICAgIHVwZGF0ZUxheWVyT3JkZXI6IHZpc1N0YXRlQWN0aW9ucy5yZW9yZGVyTGF5ZXIsXG4gICAgICBzaG93RGF0YXNldFRhYmxlOiB0aGlzLl9zaG93RGF0YXNldFRhYmxlLFxuICAgICAgc2hvd0FkZERhdGFNb2RhbDogdGhpcy5fc2hvd0FkZERhdGFNb2RhbCxcbiAgICAgIHJlbW92ZUxheWVyOiB2aXNTdGF0ZUFjdGlvbnMucmVtb3ZlTGF5ZXIsXG4gICAgICByZW1vdmVEYXRhc2V0OiB0aGlzLl9yZW1vdmVEYXRhc2V0XG4gICAgfTtcblxuICAgIGNvbnN0IGZpbHRlck1hbmFnZXJBY3Rpb25zID0ge1xuICAgICAgYWRkRmlsdGVyOiB2aXNTdGF0ZUFjdGlvbnMuYWRkRmlsdGVyLFxuICAgICAgcmVtb3ZlRmlsdGVyOiB2aXNTdGF0ZUFjdGlvbnMucmVtb3ZlRmlsdGVyLFxuICAgICAgc2V0RmlsdGVyOiB2aXNTdGF0ZUFjdGlvbnMuc2V0RmlsdGVyLFxuICAgICAgc2hvd0RhdGFzZXRUYWJsZTogdGhpcy5fc2hvd0RhdGFzZXRUYWJsZSxcbiAgICAgIHNob3dBZGREYXRhTW9kYWw6IHRoaXMuX3Nob3dBZGREYXRhTW9kYWwsXG4gICAgICB0b2dnbGVBbmltYXRpb246IHZpc1N0YXRlQWN0aW9ucy50b2dnbGVBbmltYXRpb24sXG4gICAgICBlbmxhcmdlRmlsdGVyOiB2aXNTdGF0ZUFjdGlvbnMuZW5sYXJnZUZpbHRlclxuICAgIH07XG5cbiAgICBjb25zdCBpbnRlcmFjdGlvbk1hbmFnZXJBY3Rpb25zID0ge1xuICAgICAgb25Db25maWdDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5pbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVxuICAgIH07XG5cbiAgICBjb25zdCBtYXBNYW5hZ2VyQWN0aW9ucyA9IHtcbiAgICAgIG9uQ29uZmlnQ2hhbmdlOiBtYXBTdHlsZUFjdGlvbnMubWFwQ29uZmlnQ2hhbmdlLFxuICAgICAgb25TdHlsZUNoYW5nZTogbWFwU3R5bGVBY3Rpb25zLm1hcFN0eWxlQ2hhbmdlLFxuICAgICAgb25CdWlsZGluZ0NoYW5nZTogbWFwU3R5bGVBY3Rpb25zLm1hcEJ1aWxkaW5nQ2hhbmdlXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8U2lkZWJhclxuICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofVxuICAgICAgICAgIGlzT3Blbj17aXNPcGVufVxuICAgICAgICAgIG1pbmlmaWVkV2lkdGg9ezB9XG4gICAgICAgICAgb25PcGVuT3JDbG9zZT17dGhpcy5fb25PcGVuT3JDbG9zZX1cbiAgICAgICAgPlxuICAgICAgICAgIDxQYW5lbEhlYWRlci8+XG4gICAgICAgICAgPFBhbmVsVG9nZ2xlXG4gICAgICAgICAgICBwYW5lbHM9e1BBTkVMU31cbiAgICAgICAgICAgIGFjdGl2ZVBhbmVsPXthY3RpdmVTaWRlUGFuZWx9XG4gICAgICAgICAgICB0b2dnbGVQYW5lbD17dWlTdGF0ZUFjdGlvbnMudG9nZ2xlU2lkZVBhbmVsfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFNpZGVQYW5lbENvbnRlbnQgY2xhc3NOYW1lPVwic2lkZS1wYW5lbF9fY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxQYW5lbFRpdGxlIGNsYXNzTmFtZT1cInNpZGUtcGFuZWxfX2NvbnRlbnRfX3RpdGxlXCI+XG4gICAgICAgICAgICAgIHsoUEFORUxTLmZpbmQoKHtpZH0pID0+IGlkID09PSBhY3RpdmVTaWRlUGFuZWwpIHx8IHt9KS5sYWJlbH1cbiAgICAgICAgICAgIDwvUGFuZWxUaXRsZT5cbiAgICAgICAgICAgIHthY3RpdmVTaWRlUGFuZWwgPT09ICdsYXllcicgJiYgKFxuICAgICAgICAgICAgICA8TGF5ZXJNYW5hZ2VyXG4gICAgICAgICAgICAgICAgey4uLmxheWVyTWFuYWdlckFjdGlvbnN9XG4gICAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICAgIGxheWVycz17bGF5ZXJzfVxuICAgICAgICAgICAgICAgIGxheWVyT3JkZXI9e2xheWVyT3JkZXJ9XG4gICAgICAgICAgICAgICAgbGF5ZXJCbGVuZGluZz17bGF5ZXJCbGVuZGluZ31cbiAgICAgICAgICAgICAgICBvcGVuTW9kYWw9e3VpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHthY3RpdmVTaWRlUGFuZWwgPT09ICdmaWx0ZXInICYmIChcbiAgICAgICAgICAgICAgPEZpbHRlck1hbmFnZXJcbiAgICAgICAgICAgICAgICB7Li4uZmlsdGVyTWFuYWdlckFjdGlvbnN9XG4gICAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICAgIGZpbHRlcnM9e2ZpbHRlcnN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2FjdGl2ZVNpZGVQYW5lbCA9PT0gJ2ludGVyYWN0aW9uJyAmJiAoXG4gICAgICAgICAgICAgIDxJbnRlcmFjdGlvbk1hbmFnZXJcbiAgICAgICAgICAgICAgICB7Li4uaW50ZXJhY3Rpb25NYW5hZ2VyQWN0aW9uc31cbiAgICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Db25maWc9e2ludGVyYWN0aW9uQ29uZmlnfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHthY3RpdmVTaWRlUGFuZWwgPT09ICdtYXAnICYmIChcbiAgICAgICAgICAgICAgPE1hcE1hbmFnZXJcbiAgICAgICAgICAgICAgICB7Li4ubWFwTWFuYWdlckFjdGlvbnN9XG4gICAgICAgICAgICAgICAgbWFwU3R5bGU9e3RoaXMucHJvcHMubWFwU3R5bGV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9TaWRlUGFuZWxDb250ZW50PlxuICAgICAgICA8L1NpZGViYXI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblNpZGVQYW5lbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=