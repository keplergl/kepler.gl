'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keplerGlInit = exports.resetMapConfig = exports.receiveMapConfig = exports.deleteEntry = exports.registerEntry = exports.mapBuildingChange = exports.mapStyleChange = exports.loadMapStyleErr = exports.loadMapStyles = exports.mapConfigChange = exports.toggleFullScreen = exports.toggleSplitMap = exports.updateMap = exports.fitBounds = exports.togglePerspective = exports.openDeleteModal = exports.toggleModal = exports.toggleSidePanel = exports.updateVisData = exports.updateLayerBlending = exports.toggleLayerForMap = exports.toggleAnimation = exports.showDatasetTable = exports.setVisibleLayersForMap = exports.setFilterPlot = exports.setFilter = exports.reorderLayer = exports.removeLayer = exports.removeFilter = exports.removeDataset = exports.onMapClick = exports.onLayerHover = exports.onLayerClick = exports.loadFilesErr = exports.loadFiles = exports.layerVisualChannelConfigChange = exports.layerVisConfigChange = exports.layerTypeChange = exports.layerConfigChange = exports.interactionConfigChange = exports.enlargeFilter = exports.addLayer = exports.addFilter = undefined;

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
});

var receiveMapConfig = _map[0],
    resetMapConfig = _map[1],
    keplerGlInit = _map[2];
exports.receiveMapConfig = receiveMapConfig;
exports.resetMapConfig = resetMapConfig;
exports.keplerGlInit = keplerGlInit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbnMuanMiXSwibmFtZXMiOlsiYWRkRmlsdGVyIiwiYWRkTGF5ZXIiLCJlbmxhcmdlRmlsdGVyIiwiaW50ZXJhY3Rpb25Db25maWdDaGFuZ2UiLCJsYXllckNvbmZpZ0NoYW5nZSIsImxheWVyVHlwZUNoYW5nZSIsImxheWVyVmlzQ29uZmlnQ2hhbmdlIiwibGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlIiwibG9hZEZpbGVzIiwibG9hZEZpbGVzRXJyIiwib25MYXllckNsaWNrIiwib25MYXllckhvdmVyIiwib25NYXBDbGljayIsInJlbW92ZURhdGFzZXQiLCJyZW1vdmVGaWx0ZXIiLCJyZW1vdmVMYXllciIsInJlb3JkZXJMYXllciIsInNldEZpbHRlciIsInNldEZpbHRlclBsb3QiLCJzZXRWaXNpYmxlTGF5ZXJzRm9yTWFwIiwic2hvd0RhdGFzZXRUYWJsZSIsInRvZ2dsZUFuaW1hdGlvbiIsInRvZ2dsZUxheWVyRm9yTWFwIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsInVwZGF0ZVZpc0RhdGEiLCJ0b2dnbGVTaWRlUGFuZWwiLCJ0b2dnbGVNb2RhbCIsIm9wZW5EZWxldGVNb2RhbCIsInRvZ2dsZVBlcnNwZWN0aXZlIiwiZml0Qm91bmRzIiwidXBkYXRlTWFwIiwidG9nZ2xlU3BsaXRNYXAiLCJ0b2dnbGVGdWxsU2NyZWVuIiwibWFwQ29uZmlnQ2hhbmdlIiwibG9hZE1hcFN0eWxlcyIsImxvYWRNYXBTdHlsZUVyciIsIm1hcFN0eWxlQ2hhbmdlIiwibWFwQnVpbGRpbmdDaGFuZ2UiLCJyZWdpc3RlckVudHJ5IiwiZGVsZXRlRW50cnkiLCJSRUNFSVZFX01BUF9DT05GSUciLCJSRVNFVF9NQVBfQ09ORklHIiwiSU5JVCIsIm1hcCIsImEiLCJyZWNlaXZlTWFwQ29uZmlnIiwicmVzZXRNYXBDb25maWciLCJrZXBsZXJHbEluaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs0QkFZRUEsUzs7Ozs7OzRCQUNBQyxROzs7Ozs7NEJBQ0FDLGE7Ozs7Ozs0QkFDQUMsdUI7Ozs7Ozs0QkFDQUMsaUI7Ozs7Ozs0QkFDQUMsZTs7Ozs7OzRCQUNBQyxvQjs7Ozs7OzRCQUNBQyw4Qjs7Ozs7OzRCQUNBQyxTOzs7Ozs7NEJBQ0FDLFk7Ozs7Ozs0QkFDQUMsWTs7Ozs7OzRCQUNBQyxZOzs7Ozs7NEJBQ0FDLFU7Ozs7Ozs0QkFDQUMsYTs7Ozs7OzRCQUNBQyxZOzs7Ozs7NEJBQ0FDLFc7Ozs7Ozs0QkFDQUMsWTs7Ozs7OzRCQUNBQyxTOzs7Ozs7NEJBQ0FDLGE7Ozs7Ozs0QkFDQUMsc0I7Ozs7Ozs0QkFDQUMsZ0I7Ozs7Ozs0QkFDQUMsZTs7Ozs7OzRCQUNBQyxpQjs7Ozs7OzRCQUNBQyxtQjs7Ozs7OzRCQUNBQyxhOzs7Ozs7Ozs7MkJBSUFDLGU7Ozs7OzsyQkFDQUMsVzs7Ozs7OzJCQUNBQyxlOzs7Ozs7Ozs7NEJBSUFDLGlCOzs7Ozs7NEJBQ0FDLFM7Ozs7Ozs0QkFDQUMsUzs7Ozs7OzRCQUNBQyxjOzs7Ozs7NEJBQ0FDLGdCOzs7Ozs7Ozs7NEJBSUFDLGU7Ozs7Ozs0QkFDQUMsYTs7Ozs7OzRCQUNBQyxlOzs7Ozs7NEJBQ0FDLGM7Ozs7Ozs0QkFDQUMsaUI7Ozs7Ozs7Ozs0QkFJQUMsYTs7Ozs7OzRCQUNBQyxXOzs7O0FBL0RGOzs7O0FBQ0E7Ozs7QUFFQTtJQUVFQyxrQix5QkFBQUEsa0I7SUFDQUMsZ0IseUJBQUFBLGdCO0lBQ0FDLEkseUJBQUFBLEk7O0FBR0Y7O1dBNERJLENBQ0ZGLGtCQURFLEVBRUZDLGdCQUZFLEVBR0ZDLElBSEUsRUFJRkMsR0FKRSxDQUlFO0FBQUEsU0FBSyxnQ0FBYUMsQ0FBYixDQUFMO0FBQUEsQ0FKRixDOztJQUhGQyxnQjtJQUNBQyxjO0lBQ0FDLFkiLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuLi9jb25zdGFudHMvYWN0aW9uLXR5cGVzJztcbmltcG9ydCB7Y3JlYXRlQWN0aW9ufSBmcm9tICdyZWR1eC1hY3Rpb25zJztcblxuLy8gY3JlYXRlIGFjdGlvbnNcbmNvbnN0IHtcbiAgUkVDRUlWRV9NQVBfQ09ORklHLFxuICBSRVNFVF9NQVBfQ09ORklHLFxuICBJTklUXG59ID0gQWN0aW9uVHlwZXM7XG5cbi8vIGtlcGxlci5nbCBhY3Rpb25zIGFjY2Vzc2libGUgb3V0c2lkZSBjb21wb25lbnRcbmV4cG9ydCB7XG4gIGFkZEZpbHRlcixcbiAgYWRkTGF5ZXIsXG4gIGVubGFyZ2VGaWx0ZXIsXG4gIGludGVyYWN0aW9uQ29uZmlnQ2hhbmdlLFxuICBsYXllckNvbmZpZ0NoYW5nZSxcbiAgbGF5ZXJUeXBlQ2hhbmdlLFxuICBsYXllclZpc0NvbmZpZ0NoYW5nZSxcbiAgbGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlLFxuICBsb2FkRmlsZXMsXG4gIGxvYWRGaWxlc0VycixcbiAgb25MYXllckNsaWNrLFxuICBvbkxheWVySG92ZXIsXG4gIG9uTWFwQ2xpY2ssXG4gIHJlbW92ZURhdGFzZXQsXG4gIHJlbW92ZUZpbHRlcixcbiAgcmVtb3ZlTGF5ZXIsXG4gIHJlb3JkZXJMYXllcixcbiAgc2V0RmlsdGVyLFxuICBzZXRGaWx0ZXJQbG90LFxuICBzZXRWaXNpYmxlTGF5ZXJzRm9yTWFwLFxuICBzaG93RGF0YXNldFRhYmxlLFxuICB0b2dnbGVBbmltYXRpb24sXG4gIHRvZ2dsZUxheWVyRm9yTWFwLFxuICB1cGRhdGVMYXllckJsZW5kaW5nLFxuICB1cGRhdGVWaXNEYXRhXG59IGZyb20gJy4vdmlzLXN0YXRlLWFjdGlvbnMnO1xuXG5leHBvcnQge1xuICB0b2dnbGVTaWRlUGFuZWwsXG4gIHRvZ2dsZU1vZGFsLFxuICBvcGVuRGVsZXRlTW9kYWxcbn0gZnJvbSAnLi91aS1zdGF0ZS1hY3Rpb25zJztcblxuZXhwb3J0IHtcbiAgdG9nZ2xlUGVyc3BlY3RpdmUsXG4gIGZpdEJvdW5kcyxcbiAgdXBkYXRlTWFwLFxuICB0b2dnbGVTcGxpdE1hcCxcbiAgdG9nZ2xlRnVsbFNjcmVlblxufSBmcm9tICcuL21hcC1zdGF0ZS1hY3Rpb25zJztcblxuZXhwb3J0IHtcbiAgbWFwQ29uZmlnQ2hhbmdlLFxuICBsb2FkTWFwU3R5bGVzLFxuICBsb2FkTWFwU3R5bGVFcnIsXG4gIG1hcFN0eWxlQ2hhbmdlLFxuICBtYXBCdWlsZGluZ0NoYW5nZVxufSBmcm9tICcuL21hcC1zdHlsZS1hY3Rpb25zJztcblxuZXhwb3J0IHtcbiAgcmVnaXN0ZXJFbnRyeSxcbiAgZGVsZXRlRW50cnlcbn0gZnJvbSAnLi9pZGVudGl0eS1hY3Rpb25zJztcblxuZXhwb3J0IGNvbnN0IFtcbiAgcmVjZWl2ZU1hcENvbmZpZyxcbiAgcmVzZXRNYXBDb25maWcsXG4gIGtlcGxlckdsSW5pdFxuXSA9IFtcbiAgUkVDRUlWRV9NQVBfQ09ORklHLFxuICBSRVNFVF9NQVBfQ09ORklHLFxuICBJTklUXG5dLm1hcChhID0+IGNyZWF0ZUFjdGlvbihhKSk7XG4iXX0=