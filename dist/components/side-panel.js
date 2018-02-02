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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  height: 85%;\n  width: 90%;\n  top: 80px;\n  padding: 32px 0 0 0;\n'], ['\n  height: 85%;\n  width: 90%;\n  top: 80px;\n  padding: 32px 0 0 0;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ';\n  \n  flex-grow: 1;\n  padding: 16px;\n  overflow-y: overlay;\n'], ['\n  ', ';\n  \n  flex-grow: 1;\n  padding: 16px;\n  overflow-y: overlay;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  font-size: 20px;\n  font-weight: 400;\n  letter-spacing: 1.25px;\n  margin-bottom: 14px;\n'], ['\n  color: ', ';\n  font-size: 20px;\n  font-weight: 400;\n  letter-spacing: 1.25px;\n  margin-bottom: 14px;\n']);

// modal


var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _modal = require('./common/modal');

var _modal2 = _interopRequireDefault(_modal);

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

var _deleteDataModal = require('./side-panel/modals/delete-data-modal');

var _iconInfoModal = require('./side-panel/modals/icon-info-modal');

var _iconInfoModal2 = _interopRequireDefault(_iconInfoModal);

var _dataTableModal = require('./side-panel/modals/data-table-modal');

var _dataTableModal2 = _interopRequireDefault(_dataTableModal);

var _loadDataModal = require('./side-panel/modals/load-data-modal');

var _loadDataModal2 = _interopRequireDefault(_loadDataModal);

var _defaultSettings = require('../constants/default-settings');

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

var SidePanelContent = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.sidePanelScrollBar;
});

var PanelTitle = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.titleTextColor;
});

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
        template = _react2.default.createElement(_iconInfoModal2.default, null);
        break;
      // case LAYER_CONFIG_ID:
      //   template = <LayerConfigModal close={this._closeModal}/>;
      //   break;
      case _defaultSettings.DATA_TABLE_ID:
        template = _react2.default.createElement(_dataTableModal2.default, {
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
          template = _react2.default.createElement(_deleteDataModal.DeleteDatasetModal, {
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
        template = _react2.default.createElement(_loadDataModal2.default, {
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

    return this.props.rootNode ? _react2.default.createElement(
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
    var activeSidePanel = uiState.activeSidePanel,
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
        _react2.default.createElement(_panelHeader2.default, {
          currentPanel: activeSidePanel,
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
              (_defaultSettings.PANELS.find(function (_ref) {
                var id = _ref.id;
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
              filters: filters,
              panelWidth: panelWidth,
              openModal: uiStateActions.toggleModal
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
      ),
      this._renderModalContent(currentModal)
    );
  };

  return SidePanel;
}(_react.Component);

exports.default = SidePanel;


SidePanel.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZWRpdGluZ0RhdGFzZXQiLCJzdHJpbmciLCJjb250YWluZXJXIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImZpbHRlcnMiLCJhcnJheSIsImhlaWdodCIsImludGVyYWN0aW9uQ29uZmlnIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsImxheWVycyIsIm1hcFN0eWxlIiwid2lkdGgiLCJkYXRhc2V0cyIsInZpc1N0YXRlQWN0aW9ucyIsIm1hcFN0eWxlQWN0aW9ucyIsIkRhdGFUYWJsZU1vZGFsU3R5bGUiLCJTaWRlUGFuZWxDb250ZW50IiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInNpZGVQYW5lbFNjcm9sbEJhciIsIlBhbmVsVGl0bGUiLCJ0aXRsZVRleHRDb2xvciIsIlNpZGVQYW5lbCIsIl9vbk9wZW5PckNsb3NlIiwidWlTdGF0ZUFjdGlvbnMiLCJ0b2dnbGVTaWRlUGFuZWwiLCJ1aVN0YXRlIiwiYWN0aXZlU2lkZVBhbmVsIiwiX2Nsb3NlTW9kYWwiLCJ0b2dnbGVNb2RhbCIsIl9zaG93RGF0YXNldFRhYmxlIiwic2hvd0RhdGFzZXRUYWJsZSIsImRhdGFJZCIsIl9zaG93QWRkRGF0YU1vZGFsIiwiX3JlbW92ZURhdGFzZXQiLCJvcGVuRGVsZXRlTW9kYWwiLCJrZXkiLCJfb25GaWxlVXBsb2FkIiwibG9hZEZpbGVzIiwiYmxvYiIsIl9kZWxldGVEYXRhc2V0IiwicmVtb3ZlRGF0YXNldCIsIl9yZW5kZXJNb2RhbENvbnRlbnQiLCJ0eXBlIiwidGVtcGxhdGUiLCJtb2RhbFByb3BzIiwiY29udGFpbmVySCIsInRvcE9mZnNldCIsImNzc1N0eWxlIiwiZGF0YXNldEtleVRvUmVtb3ZlIiwidGl0bGUiLCJmb290ZXIiLCJvbkNvbmZpcm0iLCJyb290Tm9kZSIsIkJvb2xlYW4iLCJyZW5kZXIiLCJsYXllck9yZGVyIiwiY3VycmVudE1vZGFsIiwiaXNPcGVuIiwicGFuZWxXaWR0aCIsInNpZGVCYXJQYWRkaW5nIiwibGF5ZXJNYW5hZ2VyQWN0aW9ucyIsImFkZExheWVyIiwibGF5ZXJDb25maWdDaGFuZ2UiLCJsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UiLCJsYXllclR5cGVDaGFuZ2UiLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsInVwZGF0ZUxheWVyQmxlbmRpbmciLCJ1cGRhdGVMYXllck9yZGVyIiwicmVvcmRlckxheWVyIiwic2hvd0FkZERhdGFNb2RhbCIsInJlbW92ZUxheWVyIiwiZmlsdGVyTWFuYWdlckFjdGlvbnMiLCJhZGRGaWx0ZXIiLCJyZW1vdmVGaWx0ZXIiLCJzZXRGaWx0ZXIiLCJ0b2dnbGVBbmltYXRpb24iLCJlbmxhcmdlRmlsdGVyIiwiaW50ZXJhY3Rpb25NYW5hZ2VyQWN0aW9ucyIsIm9uQ29uZmlnQ2hhbmdlIiwiaW50ZXJhY3Rpb25Db25maWdDaGFuZ2UiLCJtYXBNYW5hZ2VyQWN0aW9ucyIsIm1hcENvbmZpZ0NoYW5nZSIsIm9uU3R5bGVDaGFuZ2UiLCJtYXBTdHlsZUNoYW5nZSIsIm9uQnVpbGRpbmdDaGFuZ2UiLCJtYXBCdWlsZGluZ0NoYW5nZSIsImVubGFyZ2VkRmlsdGVySWR4IiwiZmluZEluZGV4IiwiZiIsImVubGFyZ2VkIiwiZmluZCIsImlkIiwibGFiZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlQTs7O0FBZkE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQVFBLElBQU1BLFlBQVk7QUFDaEJDLGtCQUFnQixvQkFBVUMsTUFEVjtBQUVoQkMsY0FBWSxvQkFBVUMsTUFBVixDQUFpQkMsVUFGYjtBQUdoQkMsV0FBUyxvQkFBVUMsS0FBVixDQUFnQkYsVUFIVDtBQUloQkcsVUFBUSxv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QUROO0FBRUUsd0JBQVVuRSxRQUZaO0FBR0UsaUNBQW1CTjtBQUhyQixlQXhCRjtBQThCQ3NCLGdDQUFvQixLQUFwQixJQUNDLCtFQUNNc0QsaUJBRE47QUFFRSx3QkFBVSxLQUFLaEUsS0FBTCxDQUFXUjtBQUZ2QjtBQS9CRjtBQURGO0FBVkYsT0FERjtBQW1ERyxXQUFLaUMsbUJBQUwsQ0FBeUJlLFlBQXpCO0FBbkRILEtBREY7QUF1REQsRzs7Ozs7a0JBNU5rQm5DLFM7OztBQStOckJBLFVBQVUxQixTQUFWLEdBQXNCQSxTQUF0QiIsImZpbGUiOiJzaWRlLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2Nzc30gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtmaW5kRE9NTm9kZX0gZnJvbSAncmVhY3QtZG9tJztcblxuaW1wb3J0IE1vZGFsRGlhbG9nIGZyb20gJy4vY29tbW9uL21vZGFsJztcblxuaW1wb3J0IFNpZGViYXIgZnJvbSAnLi9zaWRlLXBhbmVsL3NpZGUtYmFyJztcbmltcG9ydCBQYW5lbEhlYWRlciBmcm9tICcuL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyJztcbmltcG9ydCBMYXllck1hbmFnZXIgZnJvbSAnLi9zaWRlLXBhbmVsL2xheWVyLW1hbmFnZXInO1xuaW1wb3J0IEZpbHRlck1hbmFnZXIgZnJvbSAnLi9zaWRlLXBhbmVsL2ZpbHRlci1tYW5hZ2VyJztcbmltcG9ydCBJbnRlcmFjdGlvbk1hbmFnZXIgZnJvbSAnLi9zaWRlLXBhbmVsL2ludGVyYWN0aW9uLW1hbmFnZXInO1xuaW1wb3J0IE1hcE1hbmFnZXIgZnJvbSAnLi9zaWRlLXBhbmVsL21hcC1tYW5hZ2VyJztcblxuLy8gbW9kYWxcbmltcG9ydCB7RGVsZXRlRGF0YXNldE1vZGFsfSBmcm9tICcuL3NpZGUtcGFuZWwvbW9kYWxzL2RlbGV0ZS1kYXRhLW1vZGFsJztcbmltcG9ydCBJY29uSW5mb01vZGFsIGZyb20gJy4vc2lkZS1wYW5lbC9tb2RhbHMvaWNvbi1pbmZvLW1vZGFsJztcbmltcG9ydCBEYXRhVGFibGVNb2RhbCBmcm9tICcuL3NpZGUtcGFuZWwvbW9kYWxzL2RhdGEtdGFibGUtbW9kYWwnO1xuaW1wb3J0IExvYWREYXRhTW9kYWwgZnJvbSAnLi9zaWRlLXBhbmVsL21vZGFscy9sb2FkLWRhdGEtbW9kYWwnO1xuXG5pbXBvcnQge1xuICBESU1FTlNJT05TLFxuICBQQU5FTFMsXG4gIERBVEFfVEFCTEVfSUQsXG4gIERFTEVURV9EQVRBX0lELFxuICBBRERfREFUQV9JRFxufSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZWRpdGluZ0RhdGFzZXQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNvbnRhaW5lclc6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgZmlsdGVyczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBpbnRlcmFjdGlvbkNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBsYXllckJsZW5kaW5nOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxheWVyczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIG1hcFN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHZpc1N0YXRlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBtYXBTdHlsZUFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgRGF0YVRhYmxlTW9kYWxTdHlsZSA9IGNzc2BcbiAgaGVpZ2h0OiA4NSU7XG4gIHdpZHRoOiA5MCU7XG4gIHRvcDogODBweDtcbiAgcGFkZGluZzogMzJweCAwIDAgMDtcbmA7XG5cbmNvbnN0IFNpZGVQYW5lbENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbFNjcm9sbEJhcn07XG4gIFxuICBmbGV4LWdyb3c6IDE7XG4gIHBhZGRpbmc6IDE2cHg7XG4gIG92ZXJmbG93LXk6IG92ZXJsYXk7XG5gO1xuXG5jb25zdCBQYW5lbFRpdGxlID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVUZXh0Q29sb3J9O1xuICBmb250LXNpemU6IDIwcHg7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGxldHRlci1zcGFjaW5nOiAxLjI1cHg7XG4gIG1hcmdpbi1ib3R0b206IDE0cHg7XG5gO1xuXG4vKipcbiAqXG4gKiBWZXJ0aWNhbCBzaWRlYmFyIGNvbnRhaW5pbmcgaW5wdXQgY29tcG9uZW50cyBmb3IgdGhlIHJlbmRlcmluZyBsYXllcnNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lkZVBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLyogY29tcG9uZW50IHByaXZhdGUgZnVuY3Rpb25zICovXG4gIF9vbk9wZW5PckNsb3NlID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlU2lkZVBhbmVsKFxuICAgICAgdGhpcy5wcm9wcy51aVN0YXRlLmFjdGl2ZVNpZGVQYW5lbCA/IG51bGwgOiAnbGF5ZXInXG4gICAgKTtcbiAgfTtcblxuICBfY2xvc2VNb2RhbCA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKG51bGwpO1xuICB9O1xuXG4gIC8vIHRoaXMgd2lsbCBvcGVuIGRhdGEgdGFibGUgbW9kYWxcbiAgX3Nob3dEYXRhc2V0VGFibGUgPSBkYXRhSWQgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLnNob3dEYXRhc2V0VGFibGUoZGF0YUlkKTtcbiAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKERBVEFfVEFCTEVfSUQpO1xuICB9O1xuXG4gIF9zaG93QWRkRGF0YU1vZGFsID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlTW9kYWwoQUREX0RBVEFfSUQpO1xuICB9O1xuXG4gIC8vIHRoaXMgd2lsbCBzaG93IHRoZSBtb2RhbCBkaWFsb2cgdG8gY29uZmlybSBkZWxldGlvblxuICBfcmVtb3ZlRGF0YXNldCA9IGtleSA9PiB7XG4gICAgLy8gc2hvdyBtb2RhbFxuICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMub3BlbkRlbGV0ZU1vZGFsKGtleSk7XG4gIH07XG5cbiAgX29uRmlsZVVwbG9hZCA9IGJsb2IgPT4ge1xuICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLmxvYWRGaWxlcyhibG9iKTtcbiAgICAvLyB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gIH07XG5cbiAgLy8gdGhpcyB3aWxsIGRlbGV0ZSB0aGUgZGF0YXNldFxuICBfZGVsZXRlRGF0YXNldCA9IGtleSA9PiB7XG4gICAgdGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMucmVtb3ZlRGF0YXNldChrZXkpO1xuICAgIHRoaXMuX2Nsb3NlTW9kYWwoKTtcbiAgfTtcblxuICAvKiByZW5kZXIgZnVuY3Rpb25zICovXG4gIF9yZW5kZXJNb2RhbENvbnRlbnQodHlwZSkge1xuICAgIGxldCB0ZW1wbGF0ZSA9IG51bGw7XG4gICAgbGV0IG1vZGFsUHJvcHMgPSB7fTtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnaWNvbkluZm8nOlxuICAgICAgICB0ZW1wbGF0ZSA9IDxJY29uSW5mb01vZGFsIC8+O1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNhc2UgTEFZRVJfQ09ORklHX0lEOlxuICAgICAgLy8gICB0ZW1wbGF0ZSA9IDxMYXllckNvbmZpZ01vZGFsIGNsb3NlPXt0aGlzLl9jbG9zZU1vZGFsfS8+O1xuICAgICAgLy8gICBicmVhaztcbiAgICAgIGNhc2UgREFUQV9UQUJMRV9JRDpcbiAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgPERhdGFUYWJsZU1vZGFsXG4gICAgICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy5jb250YWluZXJXICogMC45fVxuICAgICAgICAgICAgaGVpZ2h0PXsodGhpcy5wcm9wcy5jb250YWluZXJIICsgRElNRU5TSU9OUy50b3BPZmZzZXQpICogMC44NX1cbiAgICAgICAgICAgIGRhdGFzZXRzPXt0aGlzLnByb3BzLmRhdGFzZXRzfVxuICAgICAgICAgICAgZGF0YUlkPXt0aGlzLnByb3BzLmVkaXRpbmdEYXRhc2V0fVxuICAgICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17dGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMuc2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICBtb2RhbFByb3BzLmNzc1N0eWxlID0gRGF0YVRhYmxlTW9kYWxTdHlsZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERFTEVURV9EQVRBX0lEOlxuICAgICAgICBjb25zdCB7ZGF0YXNldEtleVRvUmVtb3ZlfSA9IHRoaXMucHJvcHMudWlTdGF0ZTtcbiAgICAgICAgY29uc3Qge2RhdGFzZXRzLCBsYXllcnN9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgLy8gdmFsaWRhdGUgb3B0aW9uc1xuICAgICAgICBpZiAoZGF0YXNldEtleVRvUmVtb3ZlICYmIGRhdGFzZXRzICYmIGRhdGFzZXRzW2RhdGFzZXRLZXlUb1JlbW92ZV0pIHtcbiAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgIDxEZWxldGVEYXRhc2V0TW9kYWxcbiAgICAgICAgICAgICAgZGF0YXNldD17ZGF0YXNldHNbZGF0YXNldEtleVRvUmVtb3ZlXX1cbiAgICAgICAgICAgICAgbGF5ZXJzPXtsYXllcnN9XG4gICAgICAgICAgICAgIGRlbGV0ZUFjdGlvbj17KCkgPT4gdGhpcy5fZGVsZXRlRGF0YXNldChkYXRhc2V0S2V5VG9SZW1vdmUpfVxuICAgICAgICAgICAgICBjYW5jZWxBY3Rpb249e3RoaXMuX2Nsb3NlTW9kYWx9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7IC8vIGluIGNhc2Ugd2UgYWRkIGEgbmV3IGNhc2UgYWZ0ZXIgdGhpcyBvbmVcbiAgICAgIGNhc2UgQUREX0RBVEFfSUQ6XG4gICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgIDxMb2FkRGF0YU1vZGFsXG4gICAgICAgICAgICBvbkNsb3NlPXt0aGlzLl9jbG9zZU1vZGFsfVxuICAgICAgICAgICAgb25GaWxlVXBsb2FkPXt0aGlzLl9vbkZpbGVVcGxvYWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgICAgbW9kYWxQcm9wcyA9IHtcbiAgICAgICAgICB0aXRsZTogJ0FkZCBEYXRhIFRvIE1hcCcsXG4gICAgICAgICAgZm9vdGVyOiB0cnVlLFxuICAgICAgICAgIG9uQ29uZmlybTogdGhpcy5fY2xvc2VNb2RhbFxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJvb3ROb2RlID8gKFxuICAgICAgPE1vZGFsRGlhbG9nXG4gICAgICAgIHsuLi5tb2RhbFByb3BzfVxuICAgICAgICBwYXJlbnRTZWxlY3Rvcj17KCkgPT4gZmluZERPTU5vZGUodGhpcy5wcm9wcy5yb290Tm9kZSl9XG4gICAgICAgIGlzT3Blbj17Qm9vbGVhbih0eXBlKX1cbiAgICAgICAgY2xvc2U9e3RoaXMuX2Nsb3NlTW9kYWx9XG4gICAgICA+XG4gICAgICAgIHt0ZW1wbGF0ZX1cbiAgICAgIDwvTW9kYWxEaWFsb2c+XG4gICAgKSA6IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZGF0YXNldHMsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgbGF5ZXJzLFxuICAgICAgbGF5ZXJCbGVuZGluZyxcbiAgICAgIHVpU3RhdGUsXG4gICAgICBsYXllck9yZGVyLFxuICAgICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgICB2aXNTdGF0ZUFjdGlvbnMsXG4gICAgICBtYXBTdHlsZUFjdGlvbnMsXG4gICAgICB1aVN0YXRlQWN0aW9uc1xuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtcbiAgICAgIGFjdGl2ZVNpZGVQYW5lbCxcbiAgICAgIGN1cnJlbnRNb2RhbFxuICAgIH0gPSB1aVN0YXRlO1xuICAgIGNvbnN0IGlzT3BlbiA9IEJvb2xlYW4oYWN0aXZlU2lkZVBhbmVsKTtcbiAgICBjb25zdCBwYW5lbFdpZHRoID0gdGhpcy5wcm9wcy53aWR0aCAtIERJTUVOU0lPTlMuc2lkZUJhclBhZGRpbmcgKiAyO1xuXG4gICAgY29uc3QgbGF5ZXJNYW5hZ2VyQWN0aW9ucyA9IHtcbiAgICAgIGFkZExheWVyOiB2aXNTdGF0ZUFjdGlvbnMuYWRkTGF5ZXIsXG4gICAgICBsYXllckNvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmxheWVyQ29uZmlnQ2hhbmdlLFxuICAgICAgbGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlOlxuICAgICAgICB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlLFxuICAgICAgbGF5ZXJUeXBlQ2hhbmdlOiB2aXNTdGF0ZUFjdGlvbnMubGF5ZXJUeXBlQ2hhbmdlLFxuICAgICAgbGF5ZXJWaXNDb25maWdDaGFuZ2U6IHZpc1N0YXRlQWN0aW9ucy5sYXllclZpc0NvbmZpZ0NoYW5nZSxcbiAgICAgIHVwZGF0ZUxheWVyQmxlbmRpbmc6IHZpc1N0YXRlQWN0aW9ucy51cGRhdGVMYXllckJsZW5kaW5nLFxuICAgICAgdXBkYXRlTGF5ZXJPcmRlcjogdmlzU3RhdGVBY3Rpb25zLnJlb3JkZXJMYXllcixcbiAgICAgIHNob3dEYXRhc2V0VGFibGU6IHRoaXMuX3Nob3dEYXRhc2V0VGFibGUsXG4gICAgICBzaG93QWRkRGF0YU1vZGFsOiB0aGlzLl9zaG93QWRkRGF0YU1vZGFsLFxuICAgICAgcmVtb3ZlTGF5ZXI6IHZpc1N0YXRlQWN0aW9ucy5yZW1vdmVMYXllcixcbiAgICAgIHJlbW92ZURhdGFzZXQ6IHRoaXMuX3JlbW92ZURhdGFzZXRcbiAgICB9O1xuXG4gICAgY29uc3QgZmlsdGVyTWFuYWdlckFjdGlvbnMgPSB7XG4gICAgICBhZGRGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5hZGRGaWx0ZXIsXG4gICAgICByZW1vdmVGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5yZW1vdmVGaWx0ZXIsXG4gICAgICBzZXRGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5zZXRGaWx0ZXIsXG4gICAgICBzaG93RGF0YXNldFRhYmxlOiB0aGlzLl9zaG93RGF0YXNldFRhYmxlLFxuICAgICAgc2hvd0FkZERhdGFNb2RhbDogdGhpcy5fc2hvd0FkZERhdGFNb2RhbCxcbiAgICAgIHRvZ2dsZUFuaW1hdGlvbjogdmlzU3RhdGVBY3Rpb25zLnRvZ2dsZUFuaW1hdGlvbixcbiAgICAgIGVubGFyZ2VGaWx0ZXI6IHZpc1N0YXRlQWN0aW9ucy5lbmxhcmdlRmlsdGVyXG4gICAgfTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uTWFuYWdlckFjdGlvbnMgPSB7XG4gICAgICBvbkNvbmZpZ0NoYW5nZTogdmlzU3RhdGVBY3Rpb25zLmludGVyYWN0aW9uQ29uZmlnQ2hhbmdlXG4gICAgfTtcblxuICAgIGNvbnN0IG1hcE1hbmFnZXJBY3Rpb25zID0ge1xuICAgICAgb25Db25maWdDaGFuZ2U6IG1hcFN0eWxlQWN0aW9ucy5tYXBDb25maWdDaGFuZ2UsXG4gICAgICBvblN0eWxlQ2hhbmdlOiBtYXBTdHlsZUFjdGlvbnMubWFwU3R5bGVDaGFuZ2UsXG4gICAgICBvbkJ1aWxkaW5nQ2hhbmdlOiBtYXBTdHlsZUFjdGlvbnMubWFwQnVpbGRpbmdDaGFuZ2VcbiAgICB9O1xuXG4gICAgLy8gcHJvcHMgZm9yIGVubGFyZ2VkIGZpbHRlcnNcbiAgICBjb25zdCBlbmxhcmdlZEZpbHRlcklkeCA9IGZpbHRlcnMuZmluZEluZGV4KGYgPT4gZi5lbmxhcmdlZCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPFNpZGViYXJcbiAgICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH1cbiAgICAgICAgICBpc09wZW49e2lzT3Blbn1cbiAgICAgICAgICBtaW5pZmllZFdpZHRoPXswfVxuICAgICAgICAgIG9uT3Blbk9yQ2xvc2U9e3RoaXMuX29uT3Blbk9yQ2xvc2V9XG4gICAgICAgID5cbiAgICAgICAgICA8UGFuZWxIZWFkZXJcbiAgICAgICAgICAgIGN1cnJlbnRQYW5lbD17YWN0aXZlU2lkZVBhbmVsfVxuICAgICAgICAgICAgdG9nZ2xlUGFuZWw9e3VpU3RhdGVBY3Rpb25zLnRvZ2dsZVNpZGVQYW5lbH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxTaWRlUGFuZWxDb250ZW50IGNsYXNzTmFtZT1cInNpZGUtcGFuZWxfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8UGFuZWxUaXRsZSBjbGFzc05hbWU9XCJzaWRlLXBhbmVsX19jb250ZW50X190aXRsZVwiPlxuICAgICAgICAgICAgICB7KFBBTkVMUy5maW5kKCh7aWR9KSA9PiBpZCA9PT0gYWN0aXZlU2lkZVBhbmVsKSB8fCB7fSkubGFiZWx9XG4gICAgICAgICAgICA8L1BhbmVsVGl0bGU+XG4gICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnbGF5ZXInICYmIChcbiAgICAgICAgICAgICAgPExheWVyTWFuYWdlclxuICAgICAgICAgICAgICAgIHsuLi5sYXllck1hbmFnZXJBY3Rpb25zfVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgICBsYXllck9yZGVyPXtsYXllck9yZGVyfVxuICAgICAgICAgICAgICAgIGxheWVyQmxlbmRpbmc9e2xheWVyQmxlbmRpbmd9XG4gICAgICAgICAgICAgICAgb3Blbk1vZGFsPXt1aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnZmlsdGVyJyAmJiAoXG4gICAgICAgICAgICAgIDxGaWx0ZXJNYW5hZ2VyXG4gICAgICAgICAgICAgICAgey4uLmZpbHRlck1hbmFnZXJBY3Rpb25zfVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBmaWx0ZXJzPXtmaWx0ZXJzfVxuICAgICAgICAgICAgICAgIHBhbmVsV2lkdGg9e3BhbmVsV2lkdGh9XG4gICAgICAgICAgICAgICAgb3Blbk1vZGFsPXt1aVN0YXRlQWN0aW9ucy50b2dnbGVNb2RhbH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7YWN0aXZlU2lkZVBhbmVsID09PSAnaW50ZXJhY3Rpb24nICYmIChcbiAgICAgICAgICAgICAgPEludGVyYWN0aW9uTWFuYWdlclxuICAgICAgICAgICAgICAgIHsuLi5pbnRlcmFjdGlvbk1hbmFnZXJBY3Rpb25zfVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBpbnRlcmFjdGlvbkNvbmZpZz17aW50ZXJhY3Rpb25Db25maWd9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge2FjdGl2ZVNpZGVQYW5lbCA9PT0gJ21hcCcgJiYgKFxuICAgICAgICAgICAgICA8TWFwTWFuYWdlclxuICAgICAgICAgICAgICAgIHsuLi5tYXBNYW5hZ2VyQWN0aW9uc31cbiAgICAgICAgICAgICAgICBtYXBTdHlsZT17dGhpcy5wcm9wcy5tYXBTdHlsZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1NpZGVQYW5lbENvbnRlbnQ+XG4gICAgICAgIDwvU2lkZWJhcj5cbiAgICAgICAge3RoaXMuX3JlbmRlck1vZGFsQ29udGVudChjdXJyZW50TW9kYWwpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5TaWRlUGFuZWwucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19