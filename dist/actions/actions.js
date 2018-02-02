'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keplerGlInit = exports.resetMapConfig = exports.receiveMapConfig = exports.deleteEntry = exports.registerEntry = exports.mapBuildingChange = exports.mapStyleChange = exports.loadMapStyleErr = exports.loadMapStyles = exports.mapConfigChange = exports.toggleFullScreen = exports.toggleSplitMap = exports.updateMap = exports.fitBounds = exports.togglePerspective = exports.openDeleteModal = exports.toggleModal = exports.toggleSidePanel = exports.updateVisDataAndConfiguration = exports.updateVisData = exports.updateLayerBlending = exports.toggleLayerForMap = exports.toggleAnimation = exports.showDatasetTable = exports.setVisibleLayersForMap = exports.setFilterPlot = exports.setFilter = exports.reorderLayer = exports.removeLayer = exports.removeFilter = exports.removeDataset = exports.onMapClick = exports.onLayerHover = exports.onLayerClick = exports.loadFilesErr = exports.loadFiles = exports.layerVisualChannelConfigChange = exports.layerVisConfigChange = exports.layerTypeChange = exports.layerConfigChange = exports.interactionConfigChange = exports.enlargeFilter = exports.addLayer = exports.addFilter = undefined;

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
});

var receiveMapConfig = _map[0],
    resetMapConfig = _map[1],
    keplerGlInit = _map[2];
exports.receiveMapConfig = receiveMapConfig;
exports.resetMapConfig = resetMapConfig;
exports.keplerGlInit = keplerGlInit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbnMuanMiXSwibmFtZXMiOlsiYWRkRmlsdGVyIiwiYWRkTGF5ZXIiLCJlbmxhcmdlRmlsdGVyIiwiaW50ZXJhY3Rpb25Db25maWdDaGFuZ2UiLCJsYXllckNvbmZpZ0NoYW5nZSIsImxheWVyVHlwZUNoYW5nZSIsImxheWVyVmlzQ29uZmlnQ2hhbmdlIiwibGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlIiwibG9hZEZpbGVzIiwibG9hZEZpbGVzRXJyIiwib25MYXllckNsaWNrIiwib25MYXllckhvdmVyIiwib25NYXBDbGljayIsInJlbW92ZURhdGFzZXQiLCJyZW1vdmVGaWx0ZXIiLCJyZW1vdmVMYXllciIsInJlb3JkZXJMYXllciIsInNldEZpbHRlciIsInNldEZpbHRlclBsb3QiLCJzZXRWaXNpYmxlTGF5ZXJzRm9yTWFwIiwic2hvd0RhdGFzZXRUYWJsZSIsInRvZ2dsZUFuaW1hdGlvbiIsInRvZ2dsZUxheWVyRm9yTWFwIiwidXBkYXRlTGF5ZXJCbGVuZGluZyIsInVwZGF0ZVZpc0RhdGEiLCJ1cGRhdGVWaXNEYXRhQW5kQ29uZmlndXJhdGlvbiIsInRvZ2dsZVNpZGVQYW5lbCIsInRvZ2dsZU1vZGFsIiwib3BlbkRlbGV0ZU1vZGFsIiwidG9nZ2xlUGVyc3BlY3RpdmUiLCJmaXRCb3VuZHMiLCJ1cGRhdGVNYXAiLCJ0b2dnbGVTcGxpdE1hcCIsInRvZ2dsZUZ1bGxTY3JlZW4iLCJtYXBDb25maWdDaGFuZ2UiLCJsb2FkTWFwU3R5bGVzIiwibG9hZE1hcFN0eWxlRXJyIiwibWFwU3R5bGVDaGFuZ2UiLCJtYXBCdWlsZGluZ0NoYW5nZSIsInJlZ2lzdGVyRW50cnkiLCJkZWxldGVFbnRyeSIsIlJFQ0VJVkVfTUFQX0NPTkZJRyIsIlJFU0VUX01BUF9DT05GSUciLCJJTklUIiwibWFwIiwiYSIsInJlY2VpdmVNYXBDb25maWciLCJyZXNldE1hcENvbmZpZyIsImtlcGxlckdsSW5pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzRCQVFFQSxTOzs7Ozs7NEJBQ0FDLFE7Ozs7Ozs0QkFDQUMsYTs7Ozs7OzRCQUNBQyx1Qjs7Ozs7OzRCQUNBQyxpQjs7Ozs7OzRCQUNBQyxlOzs7Ozs7NEJBQ0FDLG9COzs7Ozs7NEJBQ0FDLDhCOzs7Ozs7NEJBQ0FDLFM7Ozs7Ozs0QkFDQUMsWTs7Ozs7OzRCQUNBQyxZOzs7Ozs7NEJBQ0FDLFk7Ozs7Ozs0QkFDQUMsVTs7Ozs7OzRCQUNBQyxhOzs7Ozs7NEJBQ0FDLFk7Ozs7Ozs0QkFDQUMsVzs7Ozs7OzRCQUNBQyxZOzs7Ozs7NEJBQ0FDLFM7Ozs7Ozs0QkFDQUMsYTs7Ozs7OzRCQUNBQyxzQjs7Ozs7OzRCQUNBQyxnQjs7Ozs7OzRCQUNBQyxlOzs7Ozs7NEJBQ0FDLGlCOzs7Ozs7NEJBQ0FDLG1COzs7Ozs7NEJBQ0FDLGE7Ozs7Ozs0QkFDQUMsNkI7Ozs7Ozs7OzsyQkFJQUMsZTs7Ozs7OzJCQUNBQyxXOzs7Ozs7MkJBQ0FDLGU7Ozs7Ozs7Ozs0QkFJQUMsaUI7Ozs7Ozs0QkFDQUMsUzs7Ozs7OzRCQUNBQyxTOzs7Ozs7NEJBQ0FDLGM7Ozs7Ozs0QkFDQUMsZ0I7Ozs7Ozs7Ozs0QkFJQUMsZTs7Ozs7OzRCQUNBQyxhOzs7Ozs7NEJBQ0FDLGU7Ozs7Ozs0QkFDQUMsYzs7Ozs7OzRCQUNBQyxpQjs7Ozs7Ozs7OzRCQUdNQyxhOzs7Ozs7NEJBQWVDLFc7Ozs7QUExRHZCOzs7O0FBQ0E7Ozs7QUFFQTtJQUNPQyxrQix5QkFBQUEsa0I7SUFBb0JDLGdCLHlCQUFBQSxnQjtJQUFrQkMsSSx5QkFBQUEsSTs7QUFFN0M7O1dBc0RnRSxDQUM5REYsa0JBRDhELEVBRTlEQyxnQkFGOEQsRUFHOURDLElBSDhELEVBSTlEQyxHQUo4RCxDQUkxRDtBQUFBLFNBQUssZ0NBQWFDLENBQWIsQ0FBTDtBQUFBLENBSjBELEM7O0lBQWxEQyxnQjtJQUFrQkMsYztJQUFnQkMsWSIsImZpbGUiOiJhY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJy4uL2NvbnN0YW50cy9hY3Rpb24tdHlwZXMnO1xuaW1wb3J0IHtjcmVhdGVBY3Rpb259IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuXG4vLyBjcmVhdGUgYWN0aW9uc1xuY29uc3Qge1JFQ0VJVkVfTUFQX0NPTkZJRywgUkVTRVRfTUFQX0NPTkZJRywgSU5JVH0gPSBBY3Rpb25UeXBlcztcblxuLy8ga2VwbGVyLmdsIGFjdGlvbnMgYWNjZXNzaWJsZSBvdXRzaWRlIGNvbXBvbmVudFxuZXhwb3J0IHtcbiAgYWRkRmlsdGVyLFxuICBhZGRMYXllcixcbiAgZW5sYXJnZUZpbHRlcixcbiAgaW50ZXJhY3Rpb25Db25maWdDaGFuZ2UsXG4gIGxheWVyQ29uZmlnQ2hhbmdlLFxuICBsYXllclR5cGVDaGFuZ2UsXG4gIGxheWVyVmlzQ29uZmlnQ2hhbmdlLFxuICBsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UsXG4gIGxvYWRGaWxlcyxcbiAgbG9hZEZpbGVzRXJyLFxuICBvbkxheWVyQ2xpY2ssXG4gIG9uTGF5ZXJIb3ZlcixcbiAgb25NYXBDbGljayxcbiAgcmVtb3ZlRGF0YXNldCxcbiAgcmVtb3ZlRmlsdGVyLFxuICByZW1vdmVMYXllcixcbiAgcmVvcmRlckxheWVyLFxuICBzZXRGaWx0ZXIsXG4gIHNldEZpbHRlclBsb3QsXG4gIHNldFZpc2libGVMYXllcnNGb3JNYXAsXG4gIHNob3dEYXRhc2V0VGFibGUsXG4gIHRvZ2dsZUFuaW1hdGlvbixcbiAgdG9nZ2xlTGF5ZXJGb3JNYXAsXG4gIHVwZGF0ZUxheWVyQmxlbmRpbmcsXG4gIHVwZGF0ZVZpc0RhdGEsXG4gIHVwZGF0ZVZpc0RhdGFBbmRDb25maWd1cmF0aW9uXG59IGZyb20gJy4vdmlzLXN0YXRlLWFjdGlvbnMnO1xuXG5leHBvcnQge1xuICB0b2dnbGVTaWRlUGFuZWwsXG4gIHRvZ2dsZU1vZGFsLFxuICBvcGVuRGVsZXRlTW9kYWxcbn0gZnJvbSAnLi91aS1zdGF0ZS1hY3Rpb25zJztcblxuZXhwb3J0IHtcbiAgdG9nZ2xlUGVyc3BlY3RpdmUsXG4gIGZpdEJvdW5kcyxcbiAgdXBkYXRlTWFwLFxuICB0b2dnbGVTcGxpdE1hcCxcbiAgdG9nZ2xlRnVsbFNjcmVlblxufSBmcm9tICcuL21hcC1zdGF0ZS1hY3Rpb25zJztcblxuZXhwb3J0IHtcbiAgbWFwQ29uZmlnQ2hhbmdlLFxuICBsb2FkTWFwU3R5bGVzLFxuICBsb2FkTWFwU3R5bGVFcnIsXG4gIG1hcFN0eWxlQ2hhbmdlLFxuICBtYXBCdWlsZGluZ0NoYW5nZVxufSBmcm9tICcuL21hcC1zdHlsZS1hY3Rpb25zJztcblxuZXhwb3J0IHtyZWdpc3RlckVudHJ5LCBkZWxldGVFbnRyeX0gZnJvbSAnLi9pZGVudGl0eS1hY3Rpb25zJztcblxuZXhwb3J0IGNvbnN0IFtyZWNlaXZlTWFwQ29uZmlnLCByZXNldE1hcENvbmZpZywga2VwbGVyR2xJbml0XSA9IFtcbiAgUkVDRUlWRV9NQVBfQ09ORklHLFxuICBSRVNFVF9NQVBfQ09ORklHLFxuICBJTklUXG5dLm1hcChhID0+IGNyZWF0ZUFjdGlvbihhKSk7XG4iXX0=