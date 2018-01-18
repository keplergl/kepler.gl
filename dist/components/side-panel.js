'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  height: 85%;\n  width: 90%;\n  top: 80px;\n  padding: 32px 0px 0px 0px;\n'], ['\n  height: 85%;\n  width: 90%;\n  top: 80px;\n  padding: 32px 0px 0px 0px;\n']); /** @jsx createElement */


// modal

// import LayerConfigModal from '../../../components/modal/layer-config-modal';

var _reactStylematic = require('react-stylematic');

var _reactStylematic2 = _interopRequireDefault(_reactStylematic);

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _reactDom = require('react-dom');

var _modal = require('./common/modal');

var _modal2 = _interopRequireDefault(_modal);

var _sideBar = require('./side-panel/side-bar');

var _sideBar2 = _interopRequireDefault(_sideBar);

var _sideNav = require('./side-panel/side-nav');

var _sideNav2 = _interopRequireDefault(_sideNav);

var _layerManager = require('./side-panel/layer-manager');

var _layerManager2 = _interopRequireDefault(_layerManager);

var _filterManager = require('./side-panel/filter-manager');

var _filterManager2 = _interopRequireDefault(_filterManager);

var _interactionManager = require('./side-panel/interaction-manager');

var _interactionManager2 = _interopRequireDefault(_interactionManager);

var _mapManager = require('./side-panel/map-manager');

var _mapManager2 = _interopRequireDefault(_mapManager);

var _deleteDataModal = require('./side-panel/modals/delete-data-modal');

var _iconInfoModal = require('./side-panel/modals/icon-info-modal');

var _iconInfoModal2 = _interopRequireDefault(_iconInfoModal);

var _dataTableModal = require('./side-panel/modals/data-table-modal');

var _dataTableModal2 = _interopRequireDefault(_dataTableModal);

var _loadDataModal = require('./side-panel/modals/load-data-modal');

var _loadDataModal2 = _interopRequireDefault(_loadDataModal);

var _defaultSettings = require('../constants/default-settings');

var _sidePanel = require('../styles/side-panel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  editingDataset: _propTypes2.default.string,
  containerW: _propTypes2.default.number.isRequired,
  filters: _propTypes2.default.array.isRequired,
  height: _propTypes2.default.number.isRequired,
  interactionConfig: _propTypes2.default.object.isRequired,
  layerBlending: _propTypes2.default.string.isRequired,
  layers: _propTypes2.default.array.isRequired,
  mapStyle: _propTypes2.default.object.isRequired,
  width: _propTypes2.default.number.isRequired,
  datasets: _propTypes2.default.object.isRequired,
  visStateActions: _propTypes2.default.object.isRequired,
  mapStyleActions: _propTypes2.default.object.isRequired
};

var DataTableModalStyle = (0, _styledComponents.css)(_templateObject);

/**
 *
 * Vertical sidebar containing input components for the rendering layers
 */

var SidePanel = function (_Component) {
  (0, _inherits3.default)(SidePanel, _Component);

  function SidePanel() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SidePanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._onOpenOrClose = function () {
      _this.props.uiStateActions.toggleSidePanel(_this.props.uiState.activeSidePanel ? null : 'layer');
    }, _this._closeModal = function () {
      _this.props.uiStateActions.toggleModal(null);
    }, _this._showDatasetTable = function (dataId) {
      _this.props.visStateActions.showDatasetTable(dataId);
      _this.props.uiStateActions.toggleModal(_defaultSettings.DATA_TABLE_ID);
    }, _this._showAddDataModal = function () {
      _this.props.uiStateActions.toggleModal(_defaultSettings.ADD_DATA_ID);
    }, _this._removeDataset = function (key) {
      // show modal
      _this.props.uiStateActions.openDeleteModal(key);
    }, _this._onFileUpload = function (blob) {
      _this.props.visStateActions.loadFiles(blob);
      // this._closeModal();
    }, _this._deleteDataset = function (key) {
      _this.props.visStateActions.removeDataset(key);
      _this._closeModal();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  /* component private functions */


  // this will open data table modal


  // this will show the modal dialog to confirm deletion


  // this will delete the dataset


  /* render functions */
  SidePanel.prototype._renderModalContent = function _renderModalContent(type) {
    var _this2 = this;

    var template = null;
    var modalProps = {};

    switch (type) {
      case 'iconInfo':
        template = (0, _reactStylematic2.default)(_iconInfoModal2.default, null);
        break;
      // case LAYER_CONFIG_ID:
      //   template = <LayerConfigModal close={this._closeModal}/>;
      //   break;
      case _defaultSettings.DATA_TABLE_ID:
        template = (0, _reactStylematic2.default)(_dataTableModal2.default, {
          width: this.props.containerW * 0.9,
          height: (this.props.containerH + _defaultSettings.DIMENSIONS.topOffset) * 0.85,
          datasets: this.props.datasets,
          dataId: this.props.editingDataset,
          showDatasetTable: this.props.visStateActions.showDatasetTable });
        modalProps.cssStyle = DataTableModalStyle;
        break;
      case _defaultSettings.DELETE_DATA_ID:
        var datasetKeyToRemove = this.props.uiState.datasetKeyToRemove;
        var _props = this.props,
            datasets = _props.datasets,
            layers = _props.layers;
        // validate options

        if (datasetKeyToRemove && datasets && datasets[datasetKeyToRemove]) {
          template = (0, _reactStylematic2.default)(_deleteDataModal.DeleteDatasetModal, {
            dataset: datasets[datasetKeyToRemove],
            layers: layers,
            deleteAction: function deleteAction() {
              return _this2._deleteDataset(datasetKeyToRemove);
            },
            cancelAction: this._closeModal });
        }
        break; // in case we add a new case after this one
      case _defaultSettings.ADD_DATA_ID:
        template = (0, _reactStylematic2.default)(_loadDataModal2.default, {
          onClose: this._closeModal,
          onFileUpload: this._onFileUpload });
        modalProps = {
          title: 'Add Data To Map', footer: true, onConfirm: this._closeModal
        };
        break;
      default:
        break;
    }

    return this.props.rootNode ? (0, _reactStylematic2.default)(
      _modal2.default,
      (0, _extends3.default)({}, modalProps, {
        parentSelector: function parentSelector() {
          return (0, _reactDom.findDOMNode)(_this2.props.rootNode);
        },
        isOpen: Boolean(type),
        close: this._closeModal }),
      template
    ) : null;
  };

  SidePanel.prototype.render = function render() {
    var _props2 = this.props,
        datasets = _props2.datasets,
        filters = _props2.filters,
        layers = _props2.layers,
        layerBlending = _props2.layerBlending,
        uiState = _props2.uiState,
        layerOrder = _props2.layerOrder,
        interactionConfig = _props2.interactionConfig,
        visStateActions = _props2.visStateActions,
        mapStyleActions = _props2.mapStyleActions,
        uiStateActions = _props2.uiStateActions;
    var isNavCollapsed = uiState.isNavCollapsed,
        activeSidePanel = uiState.activeSidePanel,
        currentModal = uiState.currentModal;

    var isOpen = Boolean(activeSidePanel);
    var panelWidth = this.props.width - _defaultSettings.DIMENSIONS.sideBarPadding * 2;

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

    // props for enlarged filters
    var enlargedFilterIdx = filters.findIndex(function (f) {
      return f.enlarged;
    });

    return (0, _reactStylematic2.default)(
      'div',
      { className: 'side-panel--container', style: _sidePanel.sidePanel },
      (0, _reactStylematic2.default)(_sideNav2.default, {
        activeSidePanel: activeSidePanel,
        togglePanel: uiStateActions.toggleSidePanel,
        isCollapsed: isNavCollapsed || enlargedFilterIdx > -1 }),
      (0, _reactStylematic2.default)(
        _sideBar2.default,
        {
          width: this.props.width + _defaultSettings.DIMENSIONS.sideNavC,
          height: this.props.height,
          isOpen: isOpen,
          title: activeSidePanel && _defaultSettings.PANELS.find(function (_ref) {
            var id = _ref.id;
            return id === activeSidePanel;
          }).label,
          minifiedWidth: _defaultSettings.DIMENSIONS.sideNavC,
          onOpenOrClose: this._onOpenOrClose },
        (0, _reactStylematic2.default)(
          'div',
          { className: 'side-panel' },
          activeSidePanel === 'layer' && (0, _reactStylematic2.default)(_layerManager2.default, (0, _extends3.default)({}, layerManagerActions, {
            datasets: datasets,
            layers: layers,
            layerOrder: layerOrder,
            layerBlending: layerBlending,
            panelWidth: panelWidth,
            openModal: uiStateActions.toggleModal })),
          activeSidePanel === 'filter' && (0, _reactStylematic2.default)(_filterManager2.default, (0, _extends3.default)({}, filterManagerActions, {
            datasets: datasets,
            filters: filters,
            panelWidth: panelWidth,
            openModal: uiStateActions.toggleModal
          })),
          activeSidePanel === 'interaction' && (0, _reactStylematic2.default)(_interactionManager2.default, (0, _extends3.default)({}, interactionManagerActions, {
            datasets: datasets,
            interactionConfig: interactionConfig
          })),
          activeSidePanel === 'map' && (0, _reactStylematic2.default)(_mapManager2.default, (0, _extends3.default)({}, mapManagerActions, {
            mapStyle: this.props.mapStyle
          }))
        )
      ),
      this._renderModalContent(currentModal)
    );
  };

  return SidePanel;
}(_react.Component);

exports.default = SidePanel;


SidePanel.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZWRpdGluZ0RhdGFzZXQiLCJzdHJpbmciLCJjb250YWluZXJXIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImZpbHRlcnMiLCJhcnJheSIsImhlaWdodCIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsImxheWVycyIsIm1hcFN0eWxlIiwid2lkdGgiLCJkYXRhc2V0cyIsInZpc1N0YXRlQWN0aW9ucyIsIm1hcFN0eWxlQWN0aW9ucyIsIkRhdGFUYWJsZU1vZGFsU3R5bGUiLCJTaWRlUGFuZWwiLCJfb25PcGVuT3JDbG9zZSIsInByb3BzIiwidWlTdGF0ZUFjdGlvbnMiLCJ0b2dnbGVTaWRlUGFuZWwiLCJ1aVN0YXRlIiwiYWN0aXZlU2lkZVBhbmVsIiwiX2Nsb3NlTW9kYWwiLCJ0b2dnbGVNb2RhbCIsIl9zaG93RGF0YXNldFRhYmxlIiwiZGF0YUlkIiwic2hvd0RhdGFzZXRUYWJsZSIsIl9zaG93QWRkRGF0YU1vZGFsIiwiX3JlbW92ZURhdGFzZXQiLCJrZXkiLCJvcGVuRGVsZXRlTW9kYWwiLCJfb25GaWxlVXBsb2FkIiwiYmxvYiIsImxvYWRGaWxlcyIsIl9kZWxldGVEYXRhc2V0IiwicmVtb3ZlRGF0YXNldCIsIl9yZW5kZXJNb2RhbENvbnRlbnQiLCJ0eXBlIiwidGVtcGxhdGUiLCJtb2RhbFByb3BzIiwiY29udGFpbmVySCIsInRvcE9mZnNldCIsImNzc1N0eWxlIiwiZGF0YXNldEtleVRvUmVtb3ZlIiwidGl0bGUiLCJmb290ZXIiLCJvbkNvbmZpcm0iLCJyb290Tm9kZSIsIkJvb2xlYW4iLCJyZW5kZXIiLCJsYXllck9yZGVyIiwiaXNOYXZDb2xsYXBzZWQiLCJjdXJyZW50TW9kYWwiLCJpc09wZW4iLCJwYW5lbFdpZHRoIiwic2lkZUJhclBhZGRpbmciLCJsYXllck1hbmFnZXJBY3Rpb25zIiwiYWRkTGF5ZXIiLCJsYXllckNvbmZpZ0NoYW5nZSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsImxheWVyVHlwZUNoYW5nZSIsImxheWVyVmlzQ29uZmlnQ2hhbmdlIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsInVwZGF0ZUxheWVyT3JkZXIiLCJyZW9yZGVyTGF5ZXIiLCJzaG93QWRkRGF0YU1vZGFsIiwicmVtb3ZlTGF5ZXIiLCJmaWx0ZXJNYW5hZ2VyQWN0aW9ucyIsImFkZEZpbHRlciIsInJlbW92ZUZpbHRlciIsInNldEZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsImVubGFyZ2VGaWx0ZXIiLCJpbnRlcmFjdGlvbk1hbmFnZXJBY3Rpb25zIiwib25Db25maWdDaGFuZ2UiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZSIsIm1hcE1hbmFnZXJBY3Rpb25zIiwibWFwQ29uZmlnQ2hhbmdlIiwib25TdHlsZUNoYW5nZSIsIm1hcFN0eWxlQ2hhbmdlIiwib25CdWlsZGluZ0NoYW5nZSIsIm1hcEJ1aWxkaW5nQ2hhbmdlIiwiZW5sYXJnZWRGaWx0ZXJJZHgiLCJmaW5kSW5kZXgiLCJmIiwiZW5sYXJnZWQiLCJzaWRlTmF2QyIsImZpbmQiLCJpZCIsImxhYmVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dU9BQUE7OztBQWlCQTs7QUFLQTs7QUFyQkE7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxrQkFBZ0Isb0JBQVVDLE1BRFY7QUFFaEJDLGNBQVksb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRmI7QUFHaEJDLFdBQVMsb0JBQVVDLEtBQVYsQ0FBZ0JGLFVBSFQ7QUFJaEJHLFVBQVEsb0JBQVVKLE1BQVYsQ0FBaUJDLFVBSlQ7QUFLaEJJLHFCQUFt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LHNCQUFVOUQsUUFGWjtBQUdFLCtCQUFtQk47QUFIckIsYUFuQko7QUF5QkdnQiw4QkFBb0IsS0FBcEIsSUFBNkIsZ0ZBQ3hCdUQsaUJBRHdCO0FBRTVCLHNCQUFVLEtBQUszRCxLQUFMLENBQVdSO0FBRk87QUF6QmhDO0FBUEYsT0FMRjtBQTJDRyxXQUFLMkIsbUJBQUwsQ0FBeUJnQixZQUF6QjtBQTNDSCxLQURGO0FBK0NELEc7Ozs7O2tCQTNMa0JyQyxTOzs7QUE4THJCQSxVQUFVbkIsU0FBVixHQUFzQkEsU0FBdEIiLCJmaWxlIjoic2lkZS1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGNyZWF0ZUVsZW1lbnQgKi9cbmltcG9ydCBjcmVhdGVFbGVtZW50IGZyb20gJ3JlYWN0LXN0eWxlbWF0aWMnO1xuXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Y3NzfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2ZpbmRET01Ob2RlfSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCBNb2RhbERpYWxvZyBmcm9tICcuL2NvbW1vbi9tb2RhbCc7XG5cbmltcG9ydCBTaWRlYmFyIGZyb20gJy4vc2lkZS1wYW5lbC9zaWRlLWJhcic7XG5pbXBvcnQgU2lkZU5hdiBmcm9tICcuL3NpZGUtcGFuZWwvc2lkZS1uYXYnO1xuaW1wb3J0IExheWVyTWFuYWdlciBmcm9tICcuL3NpZGUtcGFuZWwvbGF5ZXItbWFuYWdlcic7XG5pbXBvcnQgRmlsdGVyTWFuYWdlciBmcm9tICcuL3NpZGUtcGFuZWwvZmlsdGVyLW1hbmFnZXInO1xuaW1wb3J0IEludGVyYWN0aW9uTWFuYWdlciBmcm9tICcuL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tbWFuYWdlcic7XG5pbXBvcnQgTWFwTWFuYWdlciBmcm9tICcuL3NpZGUtcGFuZWwvbWFwLW1hbmFnZXInO1xuXG4vLyBtb2RhbFxuaW1wb3J0IHtEZWxldGVEYXRhc2V0TW9kYWx9IGZyb20gJy4vc2lkZS1wYW5lbC9tb2RhbHMvZGVsZXRlLWRhdGEtbW9kYWwnO1xuaW1wb3J0IEljb25JbmZvTW9kYWwgZnJvbSAnLi9zaWRlLXBhbmVsL21vZGFscy9pY29uLWluZm8tbW9kYWwnO1xuaW1wb3J0IERhdGFUYWJsZU1vZGFsIGZyb20gJy4vc2lkZS1wYW5lbC9tb2RhbHMvZGF0YS10YWJsZS1tb2RhbCc7XG5pbXBvcnQgTG9hZERhdGFNb2RhbCBmcm9tICcuL3NpZGUtcGFuZWwvbW9kYWxzL2xvYWQtZGF0YS1tb2RhbCc7XG4vLyBpbXBvcnQgTGF5ZXJDb25maWdNb2RhbCBmcm9tICcuLi8uLi8uLi9jb21wb25lbnRzL21vZGFsL2xheWVyLWNvbmZpZy1tb2RhbCc7XG5cbmltcG9ydCB7RElNRU5TSU9OUywgUEFORUxTLCBEQVRBX1RBQkxFX0lELCBMQVlFUl9DT05GSUdfSUQsIERFTEVURV9EQVRBX0lELCBBRERfREFUQV9JRH0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtzaWRlUGFuZWx9IGZyb20gJ3N0eWxlcy9zaWRlLXBhbmVsJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBlZGl0aW5nRGF0YXNldDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY29udGFpbmVyVzogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBmaWx0ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGludGVyYWN0aW9uQ29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxheWVyQmxlbmRpbmc6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdmlzU3RhdGVBY3Rpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIG1hcFN0eWxlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBEYXRhVGFibGVNb2RhbFN0eWxlID0gY3NzYFxuICBoZWlnaHQ6IDg1JTtcbiAgd2lkdGg6IDkwJTtcbiAgdG9wOiA4MHB4O1xuICBwYWRkaW5nOiAzMnB4IDBweCAwcHggMHB4O1xuYDtcblxuLyoqXG4gKlxuICogVmVydGljYWwgc2lkZWJhciBjb250YWluaW5nIGlucHV0IGNvbXBvbmVudHMgZm9yIHRoZSByZW5kZXJpbmcgbGF5ZXJzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGVQYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgLyogY29tcG9uZW50IHByaXZhdGUgZnVuY3Rpb25zICovXG4gIF9vbk9wZW5PckNsb3NlID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlU2lkZVBhbmVsKFxuICAgICAgdGhpcy5wcm9wcy51aVN0YXRlLmFjdGl2ZVNpZGVQYW5lbCA/IG51bGwgOiAnbGF5ZXInXG4gICAgKTtcbiAgfTtcblxuICBfY2xvc2VNb2RhbCA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKG51bGwpO1xuICB9O1xuXG4gIC8vIHRoaXMgd2lsbCBvcGVuIGRhdGEgdGFibGUgbW9kYWxcbiAgX3Nob3dEYXRhc2V0VGFibGUgPSAoZGF0YUlkKSA9PiB7XG4gICAgdGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMuc2hvd0RhdGFzZXRUYWJsZShkYXRhSWQpO1xuICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlTW9kYWwoREFUQV9UQUJMRV9JRCk7XG4gIH07XG5cbiAgX3Nob3dBZGREYXRhTW9kYWwgPSAoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy51aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbChBRERfREFUQV9JRCk7XG4gIH07XG5cbiAgLy8gdGhpcyB3aWxsIHNob3cgdGhlIG1vZGFsIGRpYWxvZyB0byBjb25maXJtIGRlbGV0aW9uXG4gIF9yZW1vdmVEYXRhc2V0ID0gKGtleSkgPT4ge1xuICAgIC8vIHNob3cgbW9kYWxcbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLm9wZW5EZWxldGVNb2RhbChrZXkpO1xuICB9O1xuXG4gIF9vbkZpbGVVcGxvYWQgPSAoYmxvYikgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLmxvYWRGaWxlcyhibG9iKTtcbiAgICAvLyB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gIH07XG5cbiAgLy8gdGhpcyB3aWxsIGRlbGV0ZSB0aGUgZGF0YXNldFxuICBfZGVsZXRlRGF0YXNldCA9IChrZXkpID0+IHtcbiAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5yZW1vdmVEYXRhc2V0KGtleSk7XG4gICAgdGhpcy5fY2xvc2VNb2RhbCgpO1xuICB9O1xuXG4gIC8qIHJlbmRlciBmdW5jdGlvbnMgKi9cbiAgX3JlbmRlck1vZGFsQ29udGVudCh0eXBlKSB7XG4gICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcbiAgICBsZXQgbW9kYWxQcm9wcyA9IHt9O1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnaWNvbkluZm8nOlxuICAgICAgdGVtcGxhdGUgPSA8SWNvbkluZm9Nb2RhbC8+O1xuICAgICAgYnJlYWs7XG4gICAgLy8gY2FzZSBMQVlFUl9DT05GSUdfSUQ6XG4gICAgLy8gICB0ZW1wbGF0ZSA9IDxMYXllckNvbmZpZ01vZGFsIGNsb3NlPXt0aGlzLl9jbG9zZU1vZGFsfS8+O1xuICAgIC8vICAgYnJlYWs7XG4gICAgY2FzZSBEQVRBX1RBQkxFX0lEOlxuICAgICAgdGVtcGxhdGUgPSAoPERhdGFUYWJsZU1vZGFsXG4gICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLmNvbnRhaW5lclcgKiAwLjl9XG4gICAgICAgIGhlaWdodD17KHRoaXMucHJvcHMuY29udGFpbmVySCArIERJTUVOU0lPTlMudG9wT2Zmc2V0KSAqIDAuODV9XG4gICAgICAgIGRhdGFzZXRzPXt0aGlzLnByb3BzLmRhdGFzZXRzfVxuICAgICAgICBkYXRhSWQ9e3RoaXMucHJvcHMuZWRpdGluZ0RhdGFzZXR9XG4gICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3RoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLnNob3dEYXRhc2V0VGFibGV9Lz4pO1xuICAgICAgbW9kYWxQcm9wcy5jc3NTdHlsZSA9IERhdGFUYWJsZU1vZGFsU3R5bGU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIERFTEVURV9EQVRBX0lEOlxuICAgICAgY29uc3Qge2RhdGFzZXRLZXlUb1JlbW92ZX0gPSB0aGlzLnByb3BzLnVpU3RhdGU7XG4gICAgICBjb25zdCB7ZGF0YXNldHMsIGxheWVyc30gPSB0aGlzLnByb3BzO1xuICAgICAgLy8gdmFsaWRhdGUgb3B0aW9uc1xuICAgICAgaWYgKGRhdGFzZXRLZXlUb1JlbW92ZSAmJiBkYXRhc2V0cyAmJiBkYXRhc2V0c1tkYXRhc2V0S2V5VG9SZW1vdmVdKSB7XG4gICAgICAgIHRlbXBsYXRlID0gKDxEZWxldGVEYXRhc2V0TW9kYWxcbiAgICAgICAgICBkYXRhc2V0PXtkYXRhc2V0c1tkYXRhc2V0S2V5VG9SZW1vdmVdfVxuICAgICAgICAgIGxheWVycz17bGF5ZXJzfVxuICAgICAgICAgIGRlbGV0ZUFjdGlvbj17KCkgPT4gdGhpcy5fZGVsZXRlRGF0YXNldChkYXRhc2V0S2V5VG9SZW1vdmUpfVxuICAgICAgICAgIGNhbmNlbEFjdGlvbj17dGhpcy5fY2xvc2VNb2RhbH0vPik7XG4gICAgICB9XG4gICAgICBicmVhazsgLy8gaW4gY2FzZSB3ZSBhZGQgYSBuZXcgY2FzZSBhZnRlciB0aGlzIG9uZVxuICAgICAgY2FzZSBBRERfREFUQV9JRDpcbiAgICAgIHRlbXBsYXRlID0gKDxMb2FkRGF0YU1vZGFsXG4gICAgICAgIG9uQ2xvc2U9e3RoaXMuX2Nsb3NlTW9kYWx9XG4gICAgICAgIG9uRmlsZVVwbG9hZD17dGhpcy5fb25GaWxlVXBsb2FkfS8+KTtcbiAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgIHRpdGxlOiAnQWRkIERhdGEgVG8gTWFwJywgZm9vdGVyOiB0cnVlLCBvbkNvbmZpcm06IHRoaXMuX2Nsb3NlTW9kYWxcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucHJvcHMucm9vdE5vZGUgPyA8TW9kYWxEaWFsb2dcbiAgICAgICAgey4uLm1vZGFsUHJvcHN9XG4gICAgICAgIHBhcmVudFNlbGVjdG9yPXsoKSA9PiBmaW5kRE9NTm9kZSh0aGlzLnByb3BzLnJvb3ROb2RlKX1cbiAgICAgICAgaXNPcGVuPXtCb29sZWFuKHR5cGUpfVxuICAgICAgICBjbG9zZT17dGhpcy5fY2xvc2VNb2RhbH0+XG4gICAgICAgIHt0ZW1wbGF0ZX1cbiAgICAgIDwvTW9kYWxEaWFsb2c+IDogbnVsbFxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2RhdGFzZXRzLCBmaWx0ZXJzLCBsYXllcnMsIGxheWVyQmxlbmRpbmcsIHVpU3RhdGUsIGxheWVyT3JkZXIsIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLCBtYXBTdHlsZUFjdGlvbnMsIHVpU3RhdGVBY3Rpb25zfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2lzTmF2Q29sbGFwc2VkLCBhY3RpdmVTaWRlUGFuZWwsIGN1cnJlbnRNb2RhbH0gPSB1aVN0YXRlO1xuICAgIGNvbnN0IGlzT3BlbiA9IEJvb2xlYW4oYWN0aXZlU2lkZVBhbmVsKTtcbiAgICBjb25zdCBwYW5lbFdpZHRoID0gdGhpcy5wcm9wcy53aWR0aCAtIERJTUVOU0lPTlMuc2lkZUJhclBhZGRpbmcgKiAyO1xuXG4gICAgY29uc3QgbGF5ZXJNYW5hZ2VyQWN0aW9ucyA9IHtcbiAgICAgIGFkZExheWVyOiB2aXNTdGF0ZUFjdGlvbnMuYWRkTGF5ZXIsXG4gICAgICBsYXllckNvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyQ29uZmlnQ2hhbmdlLFxuICAgICAgbGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlLFxuICAgICAgbGF5ZXJUeXBlQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJUeXBlQ2hhbmdlLFxuICAgICAgbGF5ZXJWaXNDb25maWdDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5sYXllclZpc0NvbmZpZ0NoYW5nZSxcbiAgICAgIHVwZGF0ZUxheWVyQmxlbmRpbmc6IHZpc1N0YXRlQWN0aW9ucy51cGRhdGVMYXllckJsZW5kaW5nLFxuICAgICAgdXBkYXRlTGF5ZXJPcmRlcjogdmlzU3RhdGVBY3Rpb25zLnJlb3JkZXJMYXllcixcbiAgICAgIHNob3dEYXRhc2V0VGFibGU6IHRoaXMuX3Nob3dEYXRhc2V0VGFibGUsXG4gICAgICBzaG93QWRkRGF0YU1vZGFsOiB0aGlzLl9zaG93QWRkRGF0YU1vZGFsLFxuICAgICAgcmVtb3ZlTGF5ZXI6IHZpc1N0YXRlQWN0aW9ucy5yZW1vdmVMYXllcixcbiAgICAgIHJlbW92ZURhdGFzZXQ6IHRoaXMuX3JlbW92ZURhdGFzZXRcbiAgICB9O1xuXG4gICAgY29uc3QgZmlsdGVyTWFuYWdlckFjdGlvbnMgPSB7XG4gICAgICBhZGRGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5hZGRGaWx0ZXIsXG4gICAgICByZW1vdmVGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5yZW1vdmVGaWx0ZXIsXG4gICAgICBzZXRGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5zZXRGaWx0ZXIsXG4gICAgICBzaG93RGF0YXNldFRhYmxlOiB0aGlzLl9zaG93RGF0YXNldFRhYmxlLFxuICAgICAgc2hvd0FkZERhdGFNb2RhbDogdGhpcy5fc2hvd0FkZERhdGFNb2RhbCxcbiAgICAgIHRvZ2dsZUFuaW1hdGlvbjogdmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUFuaW1hdGlvbixcbiAgICAgIGVubGFyZ2VGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5lbmxhcmdlRmlsdGVyXG4gICAgfTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uTWFuYWdlckFjdGlvbnMgPSB7XG4gICAgICBvbkNvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmludGVyYWN0aW9uQ29uZmlnQ2hhbmdlXG4gICAgfTtcblxuICAgIGNvbnN0IG1hcE1hbmFnZXJBY3Rpb25zID0ge1xuICAgICAgb25Db25maWdDaGFuZ2U6IG1hcFN0eWxlQWN0aW9ucy5tYXBDb25maWdDaGFuZ2UsXG4gICAgICBvblN0eWxlQ2hhbmdlOiBtYXBTdHlsZUFjdGlvbnMubWFwU3R5bGVDaGFuZ2UsXG4gICAgICBvbkJ1aWxkaW5nQ2hhbmdlOiBtYXBTdHlsZUFjdGlvbnMubWFwQnVpbGRpbmdDaGFuZ2VcbiAgICB9O1xuXG4gICAgLy8gcHJvcHMgZm9yIGVubGFyZ2VkIGZpbHRlcnNcbiAgICBjb25zdCBlbmxhcmdlZEZpbHRlcklkeCA9IGZpbHRlcnMuZmluZEluZGV4KGYgPT4gZi5lbmxhcmdlZCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWRlLXBhbmVsLS1jb250YWluZXJcIiBzdHlsZT17c2lkZVBhbmVsfT5cbiAgICAgICAgPFNpZGVOYXZcbiAgICAgICAgICBhY3RpdmVTaWRlUGFuZWw9e2FjdGl2ZVNpZGVQYW5lbH1cbiAgICAgICAgICB0b2dnbGVQYW5lbD17dWlTdGF0ZUFjdGlvbnMudG9nZ2xlU2lkZVBhbmVsfVxuICAgICAgICAgIGlzQ29sbGFwc2VkPXtpc05hdkNvbGxhcHNlZCB8fCBlbmxhcmdlZEZpbHRlcklkeCA+IC0xfS8+XG4gICAgICAgIDxTaWRlYmFyXG4gICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGggKyBESU1FTlNJT05TLnNpZGVOYXZDfVxuICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgaXNPcGVuPXtpc09wZW59XG4gICAgICAgICAgdGl0bGU9e2FjdGl2ZVNpZGVQYW5lbCAmJiBQQU5FTFMuZmluZCgoe2lkfSkgPT4gaWQgPT09IGFjdGl2ZVNpZGVQYW5lbCkubGFiZWx9XG4gICAgICAgICAgbWluaWZpZWRXaWR0aD17RElNRU5TSU9OUy5zaWRlTmF2Q31cbiAgICAgICAgICBvbk9wZW5PckNsb3NlPXt0aGlzLl9vbk9wZW5PckNsb3NlfSA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWRlLXBhbmVsXCI+XG4gICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnbGF5ZXInICYmXG4gICAgICAgICAgICAgIDxMYXllck1hbmFnZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXJNYW5hZ2VyQWN0aW9uc31cbiAgICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgICAgbGF5ZXJzPXtsYXllcnN9XG4gICAgICAgICAgICAgICAgbGF5ZXJPcmRlcj17bGF5ZXJPcmRlcn1cbiAgICAgICAgICAgICAgICBsYXllckJsZW5kaW5nPXtsYXllckJsZW5kaW5nfVxuICAgICAgICAgICAgICAgIHBhbmVsV2lkdGg9e3BhbmVsV2lkdGh9XG4gICAgICAgICAgICAgICAgb3Blbk1vZGFsPXt1aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbH0vPn1cbiAgICAgICAgICAgIHthY3RpdmVTaWRlUGFuZWwgPT09ICdmaWx0ZXInICYmXG4gICAgICAgICAgICAgIDxGaWx0ZXJNYW5hZ2VyXG4gICAgICAgICAgICAgICAgey4uLmZpbHRlck1hbmFnZXJBY3Rpb25zfVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBmaWx0ZXJzPXtmaWx0ZXJzfVxuICAgICAgICAgICAgICAgIHBhbmVsV2lkdGg9e3BhbmVsV2lkdGh9XG4gICAgICAgICAgICAgICAgb3Blbk1vZGFsPXt1aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbH1cbiAgICAgICAgICAgICAgLz59XG4gICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnaW50ZXJhY3Rpb24nICYmXG4gICAgICAgICAgICAgIDxJbnRlcmFjdGlvbk1hbmFnZXJcbiAgICAgICAgICAgICAgICB7Li4uaW50ZXJhY3Rpb25NYW5hZ2VyQWN0aW9uc31cbiAgICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Db25maWc9e2ludGVyYWN0aW9uQ29uZmlnfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAge2FjdGl2ZVNpZGVQYW5lbCA9PT0gJ21hcCcgJiYgPE1hcE1hbmFnZXJcbiAgICAgICAgICAgICAgey4uLm1hcE1hbmFnZXJBY3Rpb25zfVxuICAgICAgICAgICAgICBtYXBTdHlsZT17dGhpcy5wcm9wcy5tYXBTdHlsZX1cbiAgICAgICAgICAgIC8+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1NpZGViYXI+XG4gICAgICAgIHt0aGlzLl9yZW5kZXJNb2RhbENvbnRlbnQoY3VycmVudE1vZGFsKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuU2lkZVBhbmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==