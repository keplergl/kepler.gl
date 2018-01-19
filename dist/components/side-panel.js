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
          showDatasetTable: this.props.visStateActions.showDatasetTable
        });
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
            cancelAction: this._closeModal
          });
        }
        break; // in case we add a new case after this one
      case _defaultSettings.ADD_DATA_ID:
        template = (0, _reactStylematic2.default)(_loadDataModal2.default, {
          onClose: this._closeModal,
          onFileUpload: this._onFileUpload
        });
        modalProps = {
          title: 'Add Data To Map',
          footer: true,
          onConfirm: this._closeModal
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
        close: this._closeModal
      }),
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
        isCollapsed: isNavCollapsed || enlargedFilterIdx > -1
      }),
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
          onOpenOrClose: this._onOpenOrClose
        },
        (0, _reactStylematic2.default)(
          'div',
          { className: 'side-panel' },
          activeSidePanel === 'layer' && (0, _reactStylematic2.default)(_layerManager2.default, (0, _extends3.default)({}, layerManagerActions, {
            datasets: datasets,
            layers: layers,
            layerOrder: layerOrder,
            layerBlending: layerBlending,
            panelWidth: panelWidth,
            openModal: uiStateActions.toggleModal
          })),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZWRpdGluZ0RhdGFzZXQiLCJzdHJpbmciLCJjb250YWluZXJXIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImZpbHRlcnMiLCJhcnJheSIsImhlaWdodCIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsImxheWVycyIsIm1hcFN0eWxlIiwid2lkdGgiLCJkYXRhc2V0cyIsInZpc1N0YXRlQWN0aW9ucyIsIm1hcFN0eWxlQWN0aW9ucyIsIkRhdGFUYWJsZU1vZGFsU3R5bGUiLCJTaWRlUGFuZWwiLCJfb25PcGVuT3JDbG9zZSIsInByb3BzIiwidWlTdGF0ZUFjdGlvbnMiLCJ0b2dnbGVTaWRlUGFuZWwiLCJ1aVN0YXRlIiwiYWN0aXZlU2lkZVBhbmVsIiwiX2Nsb3NlTW9kYWwiLCJ0b2dnbGVNb2RhbCIsIl9zaG93RGF0YXNldFRhYmxlIiwic2hvd0RhdGFzZXRUYWJsZSIsImRhdGFJZCIsIl9zaG93QWRkRGF0YU1vZGFsIiwiX3JlbW92ZURhdGFzZXQiLCJvcGVuRGVsZXRlTW9kYWwiLCJrZXkiLCJfb25GaWxlVXBsb2FkIiwibG9hZEZpbGVzIiwiYmxvYiIsIl9kZWxldGVEYXRhc2V0IiwicmVtb3ZlRGF0YXNldCIsIl9yZW5kZXJNb2RhbENvbnRlbnQiLCJ0eXBlIiwidGVtcGxhdGUiLCJtb2RhbFByb3BzIiwiY29udGFpbmVySCIsInRvcE9mZnNldCIsImNzc1N0eWxlIiwiZGF0YXNldEtleVRvUmVtb3ZlIiwidGl0bGUiLCJmb290ZXIiLCJvbkNvbmZpcm0iLCJyb290Tm9kZSIsIkJvb2xlYW4iLCJyZW5kZXIiLCJsYXllck9yZGVyIiwiaXNOYXZDb2xsYXBzZWQiLCJjdXJyZW50TW9kYWwiLCJpc09wZW4iLCJwYW5lbFdpZHRoIiwic2lkZUJhclBhZGRpbmciLCJsYXllck1hbmFnZXJBY3Rpb25zIiwiYWRkTGF5ZXIiLCJsYXllckNvbmZpZ0NoYW5nZSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsImxheWVyVHlwZUNoYW5nZSIsImxheWVyVmlzQ29uZmlnQ2hhbmdlIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsInVwZGF0ZUxheWVyT3JkZXIiLCJyZW9yZGVyTGF5ZXIiLCJzaG93QWRkRGF0YU1vZGFsIiwicmVtb3ZlTGF5ZXIiLCJmaWx0ZXJNYW5hZ2VyQWN0aW9ucyIsImFkZEZpbHRlciIsInJlbW92ZUZpbHRlciIsInNldEZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsImVubGFyZ2VGaWx0ZXIiLCJpbnRlcmFjdGlvbk1hbmFnZXJBY3Rpb25zIiwib25Db25maWdDaGFuZ2UiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZSIsIm1hcE1hbmFnZXJBY3Rpb25zIiwibWFwQ29uZmlnQ2hhbmdlIiwib25TdHlsZUNoYW5nZSIsIm1hcFN0eWxlQ2hhbmdlIiwib25CdWlsZGluZ0NoYW5nZSIsIm1hcEJ1aWxkaW5nQ2hhbmdlIiwiZW5sYXJnZWRGaWx0ZXJJZHgiLCJmaW5kSW5kZXgiLCJmIiwiZW5sYXJnZWQiLCJzaWRlTmF2QyIsImZpbmQiLCJpZCIsImxhYmVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7dU9BQUE7OztBQWlCQTs7O0FBaEJBOzs7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQU9BOzs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsa0JBQWdCLG9CQUFVQyxNQURWO0FBRWhCQyxjQUFZLG9CQUFVQyxNQUFWLENBQWlCQyxVQUZiO0FBR2hCQyxXQUFTLG9CQUFVQyxLQUFWLENBQWdCRixVQUhUO0FBSWhCRyxVQUFRLG9CQUFVSixNQUFWLENBQWlCQyxVQUpUO0FBS2hCSSxxQkFBbUIsb0JB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RSxzQkFBVSxLQUFLM0QsS0FBTCxDQUFXUjtBQUZ2QjtBQTdCSjtBQVhGLE9BTkY7QUFxREcsV0FBSzJCLG1CQUFMLENBQXlCZ0IsWUFBekI7QUFyREgsS0FERjtBQXlERCxHOzs7OztrQkEzTmtCckMsUzs7O0FBOE5yQkEsVUFBVW5CLFNBQVYsR0FBc0JBLFNBQXRCIiwiZmlsZSI6InNpZGUtcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBjcmVhdGVFbGVtZW50ICovXG5pbXBvcnQgY3JlYXRlRWxlbWVudCBmcm9tICdyZWFjdC1zdHlsZW1hdGljJztcblxuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2Nzc30gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtmaW5kRE9NTm9kZX0gZnJvbSAncmVhY3QtZG9tJztcblxuaW1wb3J0IE1vZGFsRGlhbG9nIGZyb20gJy4vY29tbW9uL21vZGFsJztcblxuaW1wb3J0IFNpZGViYXIgZnJvbSAnLi9zaWRlLXBhbmVsL3NpZGUtYmFyJztcbmltcG9ydCBTaWRlTmF2IGZyb20gJy4vc2lkZS1wYW5lbC9zaWRlLW5hdic7XG5pbXBvcnQgTGF5ZXJNYW5hZ2VyIGZyb20gJy4vc2lkZS1wYW5lbC9sYXllci1tYW5hZ2VyJztcbmltcG9ydCBGaWx0ZXJNYW5hZ2VyIGZyb20gJy4vc2lkZS1wYW5lbC9maWx0ZXItbWFuYWdlcic7XG5pbXBvcnQgSW50ZXJhY3Rpb25NYW5hZ2VyIGZyb20gJy4vc2lkZS1wYW5lbC9pbnRlcmFjdGlvbi1tYW5hZ2VyJztcbmltcG9ydCBNYXBNYW5hZ2VyIGZyb20gJy4vc2lkZS1wYW5lbC9tYXAtbWFuYWdlcic7XG5cbi8vIG1vZGFsXG5pbXBvcnQge0RlbGV0ZURhdGFzZXRNb2RhbH0gZnJvbSAnLi9zaWRlLXBhbmVsL21vZGFscy9kZWxldGUtZGF0YS1tb2RhbCc7XG5pbXBvcnQgSWNvbkluZm9Nb2RhbCBmcm9tICcuL3NpZGUtcGFuZWwvbW9kYWxzL2ljb24taW5mby1tb2RhbCc7XG5pbXBvcnQgRGF0YVRhYmxlTW9kYWwgZnJvbSAnLi9zaWRlLXBhbmVsL21vZGFscy9kYXRhLXRhYmxlLW1vZGFsJztcbmltcG9ydCBMb2FkRGF0YU1vZGFsIGZyb20gJy4vc2lkZS1wYW5lbC9tb2RhbHMvbG9hZC1kYXRhLW1vZGFsJztcblxuaW1wb3J0IHtcbiAgRElNRU5TSU9OUyxcbiAgUEFORUxTLFxuICBEQVRBX1RBQkxFX0lELFxuICBERUxFVEVfREFUQV9JRCxcbiAgQUREX0RBVEFfSURcbn0gZnJvbSAnLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtzaWRlUGFuZWx9IGZyb20gJ3N0eWxlcy9zaWRlLXBhbmVsJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBlZGl0aW5nRGF0YXNldDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY29udGFpbmVyVzogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBmaWx0ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGludGVyYWN0aW9uQ29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxheWVyQmxlbmRpbmc6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbWFwU3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgdmlzU3RhdGVBY3Rpb25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIG1hcFN0eWxlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBEYXRhVGFibGVNb2RhbFN0eWxlID0gY3NzYFxuICBoZWlnaHQ6IDg1JTtcbiAgd2lkdGg6IDkwJTtcbiAgdG9wOiA4MHB4O1xuICBwYWRkaW5nOiAzMnB4IDBweCAwcHggMHB4O1xuYDtcblxuLyoqXG4gKlxuICogVmVydGljYWwgc2lkZWJhciBjb250YWluaW5nIGlucHV0IGNvbXBvbmVudHMgZm9yIHRoZSByZW5kZXJpbmcgbGF5ZXJzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGVQYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIC8qIGNvbXBvbmVudCBwcml2YXRlIGZ1bmN0aW9ucyAqL1xuICBfb25PcGVuT3JDbG9zZSA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZVNpZGVQYW5lbChcbiAgICAgIHRoaXMucHJvcHMudWlTdGF0ZS5hY3RpdmVTaWRlUGFuZWwgPyBudWxsIDogJ2xheWVyJ1xuICAgICk7XG4gIH07XG5cbiAgX2Nsb3NlTW9kYWwgPSAoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy51aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbChudWxsKTtcbiAgfTtcblxuICAvLyB0aGlzIHdpbGwgb3BlbiBkYXRhIHRhYmxlIG1vZGFsXG4gIF9zaG93RGF0YXNldFRhYmxlID0gZGF0YUlkID0+IHtcbiAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5zaG93RGF0YXNldFRhYmxlKGRhdGFJZCk7XG4gICAgdGhpcy5wcm9wcy51aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbChEQVRBX1RBQkxFX0lEKTtcbiAgfTtcblxuICBfc2hvd0FkZERhdGFNb2RhbCA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKEFERF9EQVRBX0lEKTtcbiAgfTtcblxuICAvLyB0aGlzIHdpbGwgc2hvdyB0aGUgbW9kYWwgZGlhbG9nIHRvIGNvbmZpcm0gZGVsZXRpb25cbiAgX3JlbW92ZURhdGFzZXQgPSBrZXkgPT4ge1xuICAgIC8vIHNob3cgbW9kYWxcbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLm9wZW5EZWxldGVNb2RhbChrZXkpO1xuICB9O1xuXG4gIF9vbkZpbGVVcGxvYWQgPSBibG9iID0+IHtcbiAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5sb2FkRmlsZXMoYmxvYik7XG4gICAgLy8gdGhpcy5fY2xvc2VNb2RhbCgpO1xuICB9O1xuXG4gIC8vIHRoaXMgd2lsbCBkZWxldGUgdGhlIGRhdGFzZXRcbiAgX2RlbGV0ZURhdGFzZXQgPSBrZXkgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLnJlbW92ZURhdGFzZXQoa2V5KTtcbiAgICB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gIH07XG5cbiAgLyogcmVuZGVyIGZ1bmN0aW9ucyAqL1xuICBfcmVuZGVyTW9kYWxDb250ZW50KHR5cGUpIHtcbiAgICBsZXQgdGVtcGxhdGUgPSBudWxsO1xuICAgIGxldCBtb2RhbFByb3BzID0ge307XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2ljb25JbmZvJzpcbiAgICAgICAgdGVtcGxhdGUgPSA8SWNvbkluZm9Nb2RhbCAvPjtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBjYXNlIExBWUVSX0NPTkZJR19JRDpcbiAgICAgIC8vICAgdGVtcGxhdGUgPSA8TGF5ZXJDb25maWdNb2RhbCBjbG9zZT17dGhpcy5fY2xvc2VNb2RhbH0vPjtcbiAgICAgIC8vICAgYnJlYWs7XG4gICAgICBjYXNlIERBVEFfVEFCTEVfSUQ6XG4gICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgIDxEYXRhVGFibGVNb2RhbFxuICAgICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMuY29udGFpbmVyVyAqIDAuOX1cbiAgICAgICAgICAgIGhlaWdodD17KHRoaXMucHJvcHMuY29udGFpbmVySCArIERJTUVOU0lPTlMudG9wT2Zmc2V0KSAqIDAuODV9XG4gICAgICAgICAgICBkYXRhc2V0cz17dGhpcy5wcm9wcy5kYXRhc2V0c31cbiAgICAgICAgICAgIGRhdGFJZD17dGhpcy5wcm9wcy5lZGl0aW5nRGF0YXNldH1cbiAgICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3RoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLnNob3dEYXRhc2V0VGFibGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgICAgbW9kYWxQcm9wcy5jc3NTdHlsZSA9IERhdGFUYWJsZU1vZGFsU3R5bGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBERUxFVEVfREFUQV9JRDpcbiAgICAgICAgY29uc3Qge2RhdGFzZXRLZXlUb1JlbW92ZX0gPSB0aGlzLnByb3BzLnVpU3RhdGU7XG4gICAgICAgIGNvbnN0IHtkYXRhc2V0cywgbGF5ZXJzfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIC8vIHZhbGlkYXRlIG9wdGlvbnNcbiAgICAgICAgaWYgKGRhdGFzZXRLZXlUb1JlbW92ZSAmJiBkYXRhc2V0cyAmJiBkYXRhc2V0c1tkYXRhc2V0S2V5VG9SZW1vdmVdKSB7XG4gICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICA8RGVsZXRlRGF0YXNldE1vZGFsXG4gICAgICAgICAgICAgIGRhdGFzZXQ9e2RhdGFzZXRzW2RhdGFzZXRLZXlUb1JlbW92ZV19XG4gICAgICAgICAgICAgIGxheWVycz17bGF5ZXJzfVxuICAgICAgICAgICAgICBkZWxldGVBY3Rpb249eygpID0+IHRoaXMuX2RlbGV0ZURhdGFzZXQoZGF0YXNldEtleVRvUmVtb3ZlKX1cbiAgICAgICAgICAgICAgY2FuY2VsQWN0aW9uPXt0aGlzLl9jbG9zZU1vZGFsfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrOyAvLyBpbiBjYXNlIHdlIGFkZCBhIG5ldyBjYXNlIGFmdGVyIHRoaXMgb25lXG4gICAgICBjYXNlIEFERF9EQVRBX0lEOlxuICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICA8TG9hZERhdGFNb2RhbFxuICAgICAgICAgICAgb25DbG9zZT17dGhpcy5fY2xvc2VNb2RhbH1cbiAgICAgICAgICAgIG9uRmlsZVVwbG9hZD17dGhpcy5fb25GaWxlVXBsb2FkfVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgdGl0bGU6ICdBZGQgRGF0YSBUbyBNYXAnLFxuICAgICAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICBvbkNvbmZpcm06IHRoaXMuX2Nsb3NlTW9kYWxcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yb290Tm9kZSA/IChcbiAgICAgIDxNb2RhbERpYWxvZ1xuICAgICAgICB7Li4ubW9kYWxQcm9wc31cbiAgICAgICAgcGFyZW50U2VsZWN0b3I9eygpID0+IGZpbmRET01Ob2RlKHRoaXMucHJvcHMucm9vdE5vZGUpfVxuICAgICAgICBpc09wZW49e0Jvb2xlYW4odHlwZSl9XG4gICAgICAgIGNsb3NlPXt0aGlzLl9jbG9zZU1vZGFsfVxuICAgICAgPlxuICAgICAgICB7dGVtcGxhdGV9XG4gICAgICA8L01vZGFsRGlhbG9nPlxuICAgICkgOiBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgZmlsdGVycyxcbiAgICAgIGxheWVycyxcbiAgICAgIGxheWVyQmxlbmRpbmcsXG4gICAgICB1aVN0YXRlLFxuICAgICAgbGF5ZXJPcmRlcixcbiAgICAgIGludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdmlzU3RhdGVBY3Rpb25zLFxuICAgICAgbWFwU3R5bGVBY3Rpb25zLFxuICAgICAgdWlTdGF0ZUFjdGlvbnNcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7aXNOYXZDb2xsYXBzZWQsIGFjdGl2ZVNpZGVQYW5lbCwgY3VycmVudE1vZGFsfSA9IHVpU3RhdGU7XG4gICAgY29uc3QgaXNPcGVuID0gQm9vbGVhbihhY3RpdmVTaWRlUGFuZWwpO1xuICAgIGNvbnN0IHBhbmVsV2lkdGggPSB0aGlzLnByb3BzLndpZHRoIC0gRElNRU5TSU9OUy5zaWRlQmFyUGFkZGluZyAqIDI7XG5cbiAgICBjb25zdCBsYXllck1hbmFnZXJBY3Rpb25zID0ge1xuICAgICAgYWRkTGF5ZXI6IHZpc1N0YXRlQWN0aW9ucy5hZGRMYXllcixcbiAgICAgIGxheWVyQ29uZmlnQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJDb25maWdDaGFuZ2UsXG4gICAgICBsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2U6XG4gICAgICAgIHZpc1N0YXRlQWN0aW9ucy5sYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UsXG4gICAgICBsYXllclR5cGVDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5sYXllclR5cGVDaGFuZ2UsXG4gICAgICBsYXllclZpc0NvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyVmlzQ29uZmlnQ2hhbmdlLFxuICAgICAgdXBkYXRlTGF5ZXJCbGVuZGluZzogdmlzU3RhdGVBY3Rpb25zLnVwZGF0ZUxheWVyQmxlbmRpbmcsXG4gICAgICB1cGRhdGVMYXllck9yZGVyOiB2aXNTdGF0ZUFjdGlvbnMucmVvcmRlckxheWVyLFxuICAgICAgc2hvd0RhdGFzZXRUYWJsZTogdGhpcy5fc2hvd0RhdGFzZXRUYWJsZSxcbiAgICAgIHNob3dBZGREYXRhTW9kYWw6IHRoaXMuX3Nob3dBZGREYXRhTW9kYWwsXG4gICAgICByZW1vdmVMYXllcjogdmlzU3RhdGVBY3Rpb25zLnJlbW92ZUxheWVyLFxuICAgICAgcmVtb3ZlRGF0YXNldDogdGhpcy5fcmVtb3ZlRGF0YXNldFxuICAgIH07XG5cbiAgICBjb25zdCBmaWx0ZXJNYW5hZ2VyQWN0aW9ucyA9IHtcbiAgICAgIGFkZEZpbHRlcjogdmlzU3RhdGVBY3Rpb25zLmFkZEZpbHRlcixcbiAgICAgIHJlbW92ZUZpbHRlcjogdmlzU3RhdGVBY3Rpb25zLnJlbW92ZUZpbHRlcixcbiAgICAgIHNldEZpbHRlcjogdmlzU3RhdGVBY3Rpb25zLnNldEZpbHRlcixcbiAgICAgIHNob3dEYXRhc2V0VGFibGU6IHRoaXMuX3Nob3dEYXRhc2V0VGFibGUsXG4gICAgICBzaG93QWRkRGF0YU1vZGFsOiB0aGlzLl9zaG93QWRkRGF0YU1vZGFsLFxuICAgICAgdG9nZ2xlQW5pbWF0aW9uOiB2aXNTdGF0ZUFjdGlvbnMudG9nZ2xlQW5pbWF0aW9uLFxuICAgICAgZW5sYXJnZUZpbHRlcjogdmlzU3RhdGVBY3Rpb25zLmVubGFyZ2VGaWx0ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25NYW5hZ2VyQWN0aW9ucyA9IHtcbiAgICAgIG9uQ29uZmlnQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMuaW50ZXJhY3Rpb25Db25maWdDaGFuZ2VcbiAgICB9O1xuXG4gICAgY29uc3QgbWFwTWFuYWdlckFjdGlvbnMgPSB7XG4gICAgICBvbkNvbmZpZ0NoYW5nZTogbWFwU3R5bGVBY3Rpb25zLm1hcENvbmZpZ0NoYW5nZSxcbiAgICAgIG9uU3R5bGVDaGFuZ2U6IG1hcFN0eWxlQWN0aW9ucy5tYXBTdHlsZUNoYW5nZSxcbiAgICAgIG9uQnVpbGRpbmdDaGFuZ2U6IG1hcFN0eWxlQWN0aW9ucy5tYXBCdWlsZGluZ0NoYW5nZVxuICAgIH07XG5cbiAgICAvLyBwcm9wcyBmb3IgZW5sYXJnZWQgZmlsdGVyc1xuICAgIGNvbnN0IGVubGFyZ2VkRmlsdGVySWR4ID0gZmlsdGVycy5maW5kSW5kZXgoZiA9PiBmLmVubGFyZ2VkKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGUtcGFuZWwtLWNvbnRhaW5lclwiIHN0eWxlPXtzaWRlUGFuZWx9PlxuICAgICAgICA8U2lkZU5hdlxuICAgICAgICAgIGFjdGl2ZVNpZGVQYW5lbD17YWN0aXZlU2lkZVBhbmVsfVxuICAgICAgICAgIHRvZ2dsZVBhbmVsPXt1aVN0YXRlQWN0aW9ucy50b2dnbGVTaWRlUGFuZWx9XG4gICAgICAgICAgaXNDb2xsYXBzZWQ9e2lzTmF2Q29sbGFwc2VkIHx8IGVubGFyZ2VkRmlsdGVySWR4ID4gLTF9XG4gICAgICAgIC8+XG4gICAgICAgIDxTaWRlYmFyXG4gICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGggKyBESU1FTlNJT05TLnNpZGVOYXZDfVxuICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgaXNPcGVuPXtpc09wZW59XG4gICAgICAgICAgdGl0bGU9e1xuICAgICAgICAgICAgYWN0aXZlU2lkZVBhbmVsICYmXG4gICAgICAgICAgICBQQU5FTFMuZmluZCgoe2lkfSkgPT4gaWQgPT09IGFjdGl2ZVNpZGVQYW5lbCkubGFiZWxcbiAgICAgICAgICB9XG4gICAgICAgICAgbWluaWZpZWRXaWR0aD17RElNRU5TSU9OUy5zaWRlTmF2Q31cbiAgICAgICAgICBvbk9wZW5PckNsb3NlPXt0aGlzLl9vbk9wZW5PckNsb3NlfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWRlLXBhbmVsXCI+XG4gICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnbGF5ZXInICYmIChcbiAgICAgICAgICAgICAgPExheWVyTWFuYWdlclxuICAgICAgICAgICAgICAgIHsuLi5sYXllck1hbmFnZXJBY3Rpb25zfVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgICBsYXllck9yZGVyPXtsYXllck9yZGVyfVxuICAgICAgICAgICAgICAgIGxheWVyQmxlbmRpbmc9e2xheWVyQmxlbmRpbmd9XG4gICAgICAgICAgICAgICAgcGFuZWxXaWR0aD17cGFuZWxXaWR0aH1cbiAgICAgICAgICAgICAgICBvcGVuTW9kYWw9e3VpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHthY3RpdmVTaWRlUGFuZWwgPT09ICdmaWx0ZXInICYmIChcbiAgICAgICAgICAgICAgPEZpbHRlck1hbmFnZXJcbiAgICAgICAgICAgICAgICB7Li4uZmlsdGVyTWFuYWdlckFjdGlvbnN9XG4gICAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICAgIGZpbHRlcnM9e2ZpbHRlcnN9XG4gICAgICAgICAgICAgICAgcGFuZWxXaWR0aD17cGFuZWxXaWR0aH1cbiAgICAgICAgICAgICAgICBvcGVuTW9kYWw9e3VpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHthY3RpdmVTaWRlUGFuZWwgPT09ICdpbnRlcmFjdGlvbicgJiYgKFxuICAgICAgICAgICAgICA8SW50ZXJhY3Rpb25NYW5hZ2VyXG4gICAgICAgICAgICAgICAgey4uLmludGVyYWN0aW9uTWFuYWdlckFjdGlvbnN9XG4gICAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uQ29uZmlnPXtpbnRlcmFjdGlvbkNvbmZpZ31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnbWFwJyAmJiAoXG4gICAgICAgICAgICAgIDxNYXBNYW5hZ2VyXG4gICAgICAgICAgICAgICAgey4uLm1hcE1hbmFnZXJBY3Rpb25zfVxuICAgICAgICAgICAgICAgIG1hcFN0eWxlPXt0aGlzLnByb3BzLm1hcFN0eWxlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9TaWRlYmFyPlxuICAgICAgICB7dGhpcy5fcmVuZGVyTW9kYWxDb250ZW50KGN1cnJlbnRNb2RhbCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblNpZGVQYW5lbC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=