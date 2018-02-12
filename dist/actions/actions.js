'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keplerGlInit = exports.resetMapConfig = exports.receiveMapConfig = exports.deleteEntry = exports.registerEntry = exports.mapBuildingChange = exports.mapStyleChange = exports.loadMapStyleErr = exports.loadMapStyles = exports.mapConfigChange = exports.toggleFullScreen = exports.toggleSplitMap = exports.updateMap = exports.fitBounds = exports.togglePerspective = exports.openDeleteModal = exports.toggleModal = exports.toggleSidePanel = exports.updateVisDataAndConfiguration = exports.updateVisData = exports.updateLayerBlending = exports.toggleLayerForMap = exports.toggleAnimation = exports.showDatasetTable = exports.setVisibleLayersForMap = exports.setFilterPlot = exports.setFilter = exports.reorderLayer = exports.removeLayer = exports.removeFilter = exports.removeDataset = exports.onMapClick = exports.onLayerHover = exports.onLayerClick = exports.loadFilesErr = exports.loadFiles = exports.layerVisualChannelConfigChange = exports.layerVisConfigChange = exports.layerTypeChange = exports.layerConfigChange = exports.interactionConfigChange = exports.enlargeFilter = exports.addLayer = exports.addFilter = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _visStateActions = require('./vis-state-actions');

Object.defineProperty(exports, 'addFilter', {
  enumerable: true,
  get: function get() {
    return _visStateActions.addFilter;
  }
});
Object.defineProperty(exports, 'addLayer', {
  enumerable: true,
  get: function get() {
    return _visStateActions.addLayer;
  }
});
Object.defineProperty(exports, 'enlargeFilter', {
  enumerable: true,
  get: function get() {
    return _visStateActions.enlargeFilter;
  }
});
Object.defineProperty(exports, 'interactionConfigChange', {
  enumerable: true,
  get: function get() {
    return _visStateActions.interactionConfigChange;
  }
});
Object.defineProperty(exports, 'layerConfigChange', {
  enumerable: true,
  get: function get() {
    return _visStateActions.layerConfigChange;
  }
});
Object.defineProperty(exports, 'layerTypeChange', {
  enumerable: true,
  get: function get() {
    return _visStateActions.layerTypeChange;
  }
});
Object.defineProperty(exports, 'layerVisConfigChange', {
  enumerable: true,
  get: function get() {
    return _visStateActions.layerVisConfigChange;
  }
});
Object.defineProperty(exports, 'layerVisualChannelConfigChange', {
  enumerable: true,
  get: function get() {
    return _visStateActions.layerVisualChannelConfigChange;
  }
});
Object.defineProperty(exports, 'loadFiles', {
  enumerable: true,
  get: function get() {
    return _visStateActions.loadFiles;
  }
});
Object.defineProperty(exports, 'loadFilesErr', {
  enumerable: true,
  get: function get() {
    return _visStateActions.loadFilesErr;
  }
});
Object.defineProperty(exports, 'onLayerClick', {
  enumerable: true,
  get: function get() {
    return _visStateActions.onLayerClick;
  }
});
Object.defineProperty(exports, 'onLayerHover', {
  enumerable: true,
  get: function get() {
    return _visStateActions.onLayerHover;
  }
});
Object.defineProperty(exports, 'onMapClick', {
  enumerable: true,
  get: function get() {
    return _visStateActions.onMapClick;
  }
});
Object.defineProperty(exports, 'removeDataset', {
  enumerable: true,
  get: function get() {
    return _visStateActions.removeDataset;
  }
});
Object.defineProperty(exports, 'removeFilter', {
  enumerable: true,
  get: function get() {
    return _visStateActions.removeFilter;
  }
});
Object.defineProperty(exports, 'removeLayer', {
  enumerable: true,
  get: function get() {
    return _visStateActions.removeLayer;
  }
});
Object.defineProperty(exports, 'reorderLayer', {
  enumerable: true,
  get: function get() {
    return _visStateActions.reorderLayer;
  }
});
Object.defineProperty(exports, 'setFilter', {
  enumerable: true,
  get: function get() {
    return _visStateActions.setFilter;
  }
});
Object.defineProperty(exports, 'setFilterPlot', {
  enumerable: true,
  get: function get() {
    return _visStateActions.setFilterPlot;
  }
});
Object.defineProperty(exports, 'setVisibleLayersForMap', {
  enumerable: true,
  get: function get() {
    return _visStateActions.setVisibleLayersForMap;
  }
});
Object.defineProperty(exports, 'showDatasetTable', {
  enumerable: true,
  get: function get() {
    return _visStateActions.showDatasetTable;
  }
});
Object.defineProperty(exports, 'toggleAnimation', {
  enumerable: true,
  get: function get() {
    return _visStateActions.toggleAnimation;
  }
});
Object.defineProperty(exports, 'toggleLayerForMap', {
  enumerable: true,
  get: function get() {
    return _visStateActions.toggleLayerForMap;
  }
});
Object.defineProperty(exports, 'updateLayerBlending', {
  enumerable: true,
  get: function get() {
    return _visStateActions.updateLayerBlending;
  }
});
Object.defineProperty(exports, 'updateVisData', {
  enumerable: true,
  get: function get() {
    return _visStateActions.updateVisData;
  }
});
Object.defineProperty(exports, 'updateVisDataAndConfiguration', {
  enumerable: true,
  get: function get() {
    return _visStateActions.updateVisDataAndConfiguration;
  }
});

var _uiStateActions = require('./ui-state-actions');

Object.defineProperty(exports, 'toggleSidePanel', {
  enumerable: true,
  get: function get() {
    return _uiStateActions.toggleSidePanel;
  }
});
Object.defineProperty(exports, 'toggleModal', {
  enumerable: true,
  get: function get() {
    return _uiStateActions.toggleModal;
  }
});
Object.defineProperty(exports, 'openDeleteModal', {
  enumerable: true,
  get: function get() {
    return _uiStateActions.openDeleteModal;
  }
});

var _mapStateActions = require('./map-state-actions');

Object.defineProperty(exports, 'togglePerspective', {
  enumerable: true,
  get: function get() {
    return _mapStateActions.togglePerspective;
  }
});
Object.defineProperty(exports, 'fitBounds', {
  enumerable: true,
  get: function get() {
    return _mapStateActions.fitBounds;
  }
});
Object.defineProperty(exports, 'updateMap', {
  enumerable: true,
  get: function get() {
    return _mapStateActions.updateMap;
  }
});
Object.defineProperty(exports, 'toggleSplitMap', {
  enumerable: true,
  get: function get() {
    return _mapStateActions.toggleSplitMap;
  }
});
Object.defineProperty(exports, 'toggleFullScreen', {
  enumerable: true,
  get: function get() {
    return _mapStateActions.toggleFullScreen;
  }
});

var _mapStyleActions = require('./map-style-actions');

Object.defineProperty(exports, 'mapConfigChange', {
  enumerable: true,
  get: function get() {
    return _mapStyleActions.mapConfigChange;
  }
});
Object.defineProperty(exports, 'loadMapStyles', {
  enumerable: true,
  get: function get() {
    return _mapStyleActions.loadMapStyles;
  }
});
Object.defineProperty(exports, 'loadMapStyleErr', {
  enumerable: true,
  get: function get() {
    return _mapStyleActions.loadMapStyleErr;
  }
});
Object.defineProperty(exports, 'mapStyleChange', {
  enumerable: true,
  get: function get() {
    return _mapStyleActions.mapStyleChange;
  }
});
Object.defineProperty(exports, 'mapBuildingChange', {
  enumerable: true,
  get: function get() {
    return _mapStyleActions.mapBuildingChange;
  }
});

var _identityActions = require('./identity-actions');

Object.defineProperty(exports, 'registerEntry', {
  enumerable: true,
  get: function get() {
    return _identityActions.registerEntry;
  }
});
Object.defineProperty(exports, 'deleteEntry', {
  enumerable: true,
  get: function get() {
    return _identityActions.deleteEntry;
  }
});

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _reduxActions = require('redux-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create actions
var RECEIVE_MAP_CONFIG = _actionTypes2.default.RECEIVE_MAP_CONFIG,
    RESET_MAP_CONFIG = _actionTypes2.default.RESET_MAP_CONFIG,
    INIT = _actionTypes2.default.INIT;

// kepler.gl actions accessible outside component

var _map = [RECEIVE_MAP_CONFIG, RESET_MAP_CONFIG, INIT].map(function (a) {
  return (0, _reduxActions.createAction)(a);
}),
    _map2 = (0, _slicedToArray3.default)(_map, 3);

var receiveMapConfig = _map2[0],
    resetMapConfig = _map2[1],
    keplerGlInit = _map2[2];
exports.receiveMapConfig = receiveMapConfig;
exports.resetMapConfig = resetMapConfig;
exports.keplerGlInit = keplerGlInit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbnMuanMiXSwibmFtZXMiOlsiYWRkRmlsdGVyIiwiYWRkTGF5ZXIiLCJlbmxhcmdlRmlsdGVyIiwiaW50ZXJhY3Rpb25Db25maWdDaGFuZ2UiLCJsYXllckNvbmZpZ0NoYW5nZSIsImxheWVyVHlwZUNoYW5nZSIsImxheWVyVmlzQ29uZmlnQ2hhbmdlIiwibGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlIiwibG9hZEZpbGVzIiwibG9hZEZpbGVzRXJyIiwib25MYXllckNsaWNrIiwib25MYXllckhvdmVyIiwib25NYXBDbGljayIsInJlbW92ZURhdGFzZXQiLCJyZW1vdmVGaWx0ZXIiLCJyZW1vdmVMYXllciIsInJlb3JkZXJMYXllciIsInNldEZpbHRlciIsInNldEZpbHRlclBsb3QiLCJzZXRWaXNpYmxlTGF5ZXJzRm9yTWFwIiwic2hvd0RhdGFzZXRUYWJsZSIsInRvZ2dsZUFuaW1hdGlvbiIsInRvZ2dsZUxheWVyRm9yTWFwIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsInVwZGF0ZVZpc0RhdGEiLCJ1cGRhdGVWaXNEYXRhQW5kQ29uZmlndXJhdGlvbiIsInRvZ2dsZVNpZGVQYW5lbCIsInRvZ2dsZU1vZGFsIiwib3BlbkRlbGV0ZU1vZGFsIiwidG9nZ2xlUGVyc3BlY3RpdmUiLCJmaXRCb3VuZHMiLCJ1cGRhdGVNYXAiLCJ0b2dnbGVTcGxpdE1hcCIsInRvZ2dsZUZ1bGxTY3JlZW4iLCJtYXBDb25maWdDaGFuZ2UiLCJsb2FkTWFwU3R5bGVzIiwibG9hZE1hcFN0eWxlRXJyIiwibWFwU3R5bGVDaGFuZ2UiLCJtYXBCdWlsZGluZ0NoYW5nZSIsInJlZ2lzdGVyRW50cnkiLCJkZWxldGVFbnRyeSIsIlJFQ0VJVkVfTUFQX0NPTkZJRyIsIlJFU0VUX01BUF9DT05GSUciLCJJTklUIiwibWFwIiwiYSIsInJlY2VpdmVNYXBDb25maWciLCJyZXNldE1hcENvbmZpZyIsImtlcGxlckdsSW5pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFRRUEsUzs7Ozs7OzRCQUNBQyxROzs7Ozs7NEJBQ0FDLGE7Ozs7Ozs0QkFDQUMsdUI7Ozs7Ozs0QkFDQUMsaUI7Ozs7Ozs0QkFDQUMsZTs7Ozs7OzRCQUNBQyxvQjs7Ozs7OzRCQUNBQyw4Qjs7Ozs7OzRCQUNBQyxTOzs7Ozs7NEJBQ0FDLFk7Ozs7Ozs0QkFDQUMsWTs7Ozs7OzRCQUNBQyxZOzs7Ozs7NEJBQ0FDLFU7Ozs7Ozs0QkFDQUMsYTs7Ozs7OzRCQUNBQyxZOzs7Ozs7NEJBQ0FDLFc7Ozs7Ozs0QkFDQUMsWTs7Ozs7OzRCQUNBQyxTOzs7Ozs7NEJBQ0FDLGE7Ozs7Ozs0QkFDQUMsc0I7Ozs7Ozs0QkFDQUMsZ0I7Ozs7Ozs0QkFDQUMsZTs7Ozs7OzRCQUNBQyxpQjs7Ozs7OzRCQUNBQyxtQjs7Ozs7OzRCQUNBQyxhOzs7Ozs7NEJBQ0FDLDZCOzs7Ozs7Ozs7MkJBSUFDLGU7Ozs7OzsyQkFDQUMsVzs7Ozs7OzJCQUNBQyxlOzs7Ozs7Ozs7NEJBSUFDLGlCOzs7Ozs7NEJBQ0FDLFM7Ozs7Ozs0QkFDQUMsUzs7Ozs7OzRCQUNBQyxjOzs7Ozs7NEJBQ0FDLGdCOzs7Ozs7Ozs7NEJBSUFDLGU7Ozs7Ozs0QkFDQUMsYTs7Ozs7OzRCQUNBQyxlOzs7Ozs7NEJBQ0FDLGM7Ozs7Ozs0QkFDQUMsaUI7Ozs7Ozs7Ozs0QkFHTUMsYTs7Ozs7OzRCQUFlQyxXOzs7O0FBMUR2Qjs7OztBQUNBOzs7O0FBRUE7SUFDT0Msa0IseUJBQUFBLGtCO0lBQW9CQyxnQix5QkFBQUEsZ0I7SUFBa0JDLEkseUJBQUFBLEk7O0FBRTdDOztXQXNEZ0UsQ0FDOURGLGtCQUQ4RCxFQUU5REMsZ0JBRjhELEVBRzlEQyxJQUg4RCxFQUk5REMsR0FKOEQsQ0FJMUQ7QUFBQSxTQUFLLGdDQUFhQyxDQUFiLENBQUw7QUFBQSxDQUowRCxDOzs7SUFBbERDLGdCO0lBQWtCQyxjO0lBQWdCQyxZIiwiZmlsZSI6ImFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi4vY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZUFjdGlvbn0gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5cbi8vIGNyZWF0ZSBhY3Rpb25zXG5jb25zdCB7UkVDRUlWRV9NQVBfQ09ORklHLCBSRVNFVF9NQVBfQ09ORklHLCBJTklUfSA9IEFjdGlvblR5cGVzO1xuXG4vLyBrZXBsZXIuZ2wgYWN0aW9ucyBhY2Nlc3NpYmxlIG91dHNpZGUgY29tcG9uZW50XG5leHBvcnQge1xuICBhZGRGaWx0ZXIsXG4gIGFkZExheWVyLFxuICBlbmxhcmdlRmlsdGVyLFxuICBpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZSxcbiAgbGF5ZXJDb25maWdDaGFuZ2UsXG4gIGxheWVyVHlwZUNoYW5nZSxcbiAgbGF5ZXJWaXNDb25maWdDaGFuZ2UsXG4gIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSxcbiAgbG9hZEZpbGVzLFxuICBsb2FkRmlsZXNFcnIsXG4gIG9uTGF5ZXJDbGljayxcbiAgb25MYXllckhvdmVyLFxuICBvbk1hcENsaWNrLFxuICByZW1vdmVEYXRhc2V0LFxuICByZW1vdmVGaWx0ZXIsXG4gIHJlbW92ZUxheWVyLFxuICByZW9yZGVyTGF5ZXIsXG4gIHNldEZpbHRlcixcbiAgc2V0RmlsdGVyUGxvdCxcbiAgc2V0VmlzaWJsZUxheWVyc0Zvck1hcCxcbiAgc2hvd0RhdGFzZXRUYWJsZSxcbiAgdG9nZ2xlQW5pbWF0aW9uLFxuICB0b2dnbGVMYXllckZvck1hcCxcbiAgdXBkYXRlTGF5ZXJCbGVuZGluZyxcbiAgdXBkYXRlVmlzRGF0YSxcbiAgdXBkYXRlVmlzRGF0YUFuZENvbmZpZ3VyYXRpb25cbn0gZnJvbSAnLi92aXMtc3RhdGUtYWN0aW9ucyc7XG5cbmV4cG9ydCB7XG4gIHRvZ2dsZVNpZGVQYW5lbCxcbiAgdG9nZ2xlTW9kYWwsXG4gIG9wZW5EZWxldGVNb2RhbFxufSBmcm9tICcuL3VpLXN0YXRlLWFjdGlvbnMnO1xuXG5leHBvcnQge1xuICB0b2dnbGVQZXJzcGVjdGl2ZSxcbiAgZml0Qm91bmRzLFxuICB1cGRhdGVNYXAsXG4gIHRvZ2dsZVNwbGl0TWFwLFxuICB0b2dnbGVGdWxsU2NyZWVuXG59IGZyb20gJy4vbWFwLXN0YXRlLWFjdGlvbnMnO1xuXG5leHBvcnQge1xuICBtYXBDb25maWdDaGFuZ2UsXG4gIGxvYWRNYXBTdHlsZXMsXG4gIGxvYWRNYXBTdHlsZUVycixcbiAgbWFwU3R5bGVDaGFuZ2UsXG4gIG1hcEJ1aWxkaW5nQ2hhbmdlXG59IGZyb20gJy4vbWFwLXN0eWxlLWFjdGlvbnMnO1xuXG5leHBvcnQge3JlZ2lzdGVyRW50cnksIGRlbGV0ZUVudHJ5fSBmcm9tICcuL2lkZW50aXR5LWFjdGlvbnMnO1xuXG5leHBvcnQgY29uc3QgW3JlY2VpdmVNYXBDb25maWcsIHJlc2V0TWFwQ29uZmlnLCBrZXBsZXJHbEluaXRdID0gW1xuICBSRUNFSVZFX01BUF9DT05GSUcsXG4gIFJFU0VUX01BUF9DT05GSUcsXG4gIElOSVRcbl0ubWFwKGEgPT4gY3JlYXRlQWN0aW9uKGEpKTtcbiJdfQ==