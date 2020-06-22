"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMapboxLayers = generateMapboxLayers;
exports.updateMapboxLayers = updateMapboxLayers;
exports.geoJsonFromData = geoJsonFromData;
exports.gpuFilterToMapboxFilter = gpuFilterToMapboxFilter;
exports.prefixGpuField = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _baseLayer = require("./base-layer");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * This function will convert layers to mapbox layers
 * @param {Array<Object>} layers the layers to be converted
 * @param {Array<Object>} layerData extra layer information
 * @param {Array<Number>} layerOrder the order by which we should convert layers
 * @param {Object} layersToRender {[id]: true | false} object whether each layer should be rendered
 * @returns {Object} {[id]: layer}
 */
function generateMapboxLayers() {
  var layers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var layerData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var layerOrder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var layersToRender = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (layerData.length > 0) {
    return layerOrder.slice().reverse().filter(function (idx) {
      return layers[idx].overlayType === _baseLayer.OVERLAY_TYPE.mapboxgl && layersToRender[layers[idx].id];
    }).reduce(function (accu, index) {
      var layer = layers[index];
      return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, layer.id, {
        id: layer.id,
        data: layerData[index].data,
        isVisible: layer.config.isVisible,
        config: layerData[index].config,
        hidden: layer.config.hidden,
        sourceId: layerData[index].config.source
      }));
    }, {});
  }

  return {};
}
/**
 * Update mapbox layers on the given map
 * @param {Object} map
 * @param {Object} newLayers Map of new mapbox layers to be displayed
 * @param {Object} oldLayers Map of the old layers to be compare with the current ones to detect deleted layers
 *                  {layerId: sourceId}
 */


function updateMapboxLayers(map) {
  var newLayers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var oldLayers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  // delete no longer existed old layers
  if (oldLayers) {
    checkAndRemoveOldLayers(map, oldLayers, newLayers);
  } // insert or update new layer


  Object.values(newLayers).forEach(function (overlay) {
    var layerId = overlay.id,
        config = overlay.config,
        data = overlay.data,
        sourceId = overlay.sourceId,
        isVisible = overlay.isVisible;

    if (!data && !config) {
      return;
    }

    var _ref = oldLayers && oldLayers[layerId] || {},
        oldData = _ref.data,
        oldConfig = _ref.config;

    if (data && data !== oldData) {
      updateSourceData(map, sourceId, data);
    } // compare with previous configs


    if (oldConfig !== config) {
      updateLayerConfig(map, layerId, config, isVisible);
    }
  });
}

function checkAndRemoveOldLayers(map, oldLayers, newLayers) {
  Object.keys(oldLayers).forEach(function (layerId) {
    if (!newLayers[layerId]) {
      map.removeLayer(layerId);
    }
  });
}

function updateLayerConfig(map, layerId, config, isVisible) {
  var mapboxLayer = map.getLayer(layerId);

  if (mapboxLayer) {
    // check if layer already is set
    // remove it if exists
    map.removeLayer(layerId);
  }

  map.addLayer(config);
  map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
}

function updateSourceData(map, sourceId, data) {
  var source = map.getSource(sourceId);

  if (!source) {
    map.addSource(sourceId, {
      type: 'geojson',
      data: data
    });
  } else {
    source.setData(data);
  }
}
/**
 *
 * @param points
 * @param columns {
 * lat: {fieldIdx},
 * lng: {fieldIdx},
 * alt: {fieldIdx}
 * }
 * @param properties [{label: {fieldIdx}]
 * @returns {{type: string, properties: {}, features: {type: string, properties: {}, geometry: {type: string, coordinates: *[]}}[]}}
 */


function geoJsonFromData() {
  var allData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var filteredIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var getGeometry = arguments.length > 2 ? arguments[2] : undefined;
  var getProperties = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (d, i) {};
  var geojson = {
    type: 'FeatureCollection',
    features: []
  };

  for (var i = 0; i < filteredIndex.length; i++) {
    var index = filteredIndex[i];
    var point = allData[index];
    var geometry = getGeometry(point);

    if (geometry) {
      geojson.features.push({
        type: 'Feature',
        properties: _objectSpread({
          index: index
        }, getProperties(point, index)),
        geometry: geometry
      });
    }
  }

  return geojson;
}

var prefixGpuField = function prefixGpuField(name) {
  return "gpu:".concat(name);
};

exports.prefixGpuField = prefixGpuField;

function gpuFilterToMapboxFilter(gpuFilter) {
  var filterRange = gpuFilter.filterRange,
      filterValueUpdateTriggers = gpuFilter.filterValueUpdateTriggers;
  var hasFilter = Object.values(filterValueUpdateTriggers).filter(function (d) {
    return d;
  });

  if (!hasFilter.length) {
    return null;
  }

  var condition = ['all']; // [">=", key, value]
  // ["<=", key, value]

  var expressions = Object.values(filterValueUpdateTriggers).reduce(function (accu, name, i) {
    return name ? [].concat((0, _toConsumableArray2["default"])(accu), [['>=', prefixGpuField(name), filterRange[i][0]], ['<=', prefixGpuField(name), filterRange[i][1]]]) : accu;
  }, condition);
  return expressions;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvbWFwYm94LXV0aWxzLmpzIl0sIm5hbWVzIjpbImdlbmVyYXRlTWFwYm94TGF5ZXJzIiwibGF5ZXJzIiwibGF5ZXJEYXRhIiwibGF5ZXJPcmRlciIsImxheWVyc1RvUmVuZGVyIiwibGVuZ3RoIiwic2xpY2UiLCJyZXZlcnNlIiwiZmlsdGVyIiwiaWR4Iiwib3ZlcmxheVR5cGUiLCJPVkVSTEFZX1RZUEUiLCJtYXBib3hnbCIsImlkIiwicmVkdWNlIiwiYWNjdSIsImluZGV4IiwibGF5ZXIiLCJkYXRhIiwiaXNWaXNpYmxlIiwiY29uZmlnIiwiaGlkZGVuIiwic291cmNlSWQiLCJzb3VyY2UiLCJ1cGRhdGVNYXBib3hMYXllcnMiLCJtYXAiLCJuZXdMYXllcnMiLCJvbGRMYXllcnMiLCJjaGVja0FuZFJlbW92ZU9sZExheWVycyIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJvdmVybGF5IiwibGF5ZXJJZCIsIm9sZERhdGEiLCJvbGRDb25maWciLCJ1cGRhdGVTb3VyY2VEYXRhIiwidXBkYXRlTGF5ZXJDb25maWciLCJrZXlzIiwicmVtb3ZlTGF5ZXIiLCJtYXBib3hMYXllciIsImdldExheWVyIiwiYWRkTGF5ZXIiLCJzZXRMYXlvdXRQcm9wZXJ0eSIsImdldFNvdXJjZSIsImFkZFNvdXJjZSIsInR5cGUiLCJzZXREYXRhIiwiZ2VvSnNvbkZyb21EYXRhIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJnZXRHZW9tZXRyeSIsImdldFByb3BlcnRpZXMiLCJkIiwiaSIsImdlb2pzb24iLCJmZWF0dXJlcyIsInBvaW50IiwiZ2VvbWV0cnkiLCJwdXNoIiwicHJvcGVydGllcyIsInByZWZpeEdwdUZpZWxkIiwibmFtZSIsImdwdUZpbHRlclRvTWFwYm94RmlsdGVyIiwiZ3B1RmlsdGVyIiwiZmlsdGVyUmFuZ2UiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiaGFzRmlsdGVyIiwiY29uZGl0aW9uIiwiZXhwcmVz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QUFBQSxDQUEzQjs7OztBQUVBLFNBQVNDLHVCQUFULENBQWlDQyxTQUFqQyxFQUE0QztBQUFBLE1BQzFDQyxXQUQwQyxHQUNBRCxTQURBLENBQzFDQyxXQUQwQztBQUFBLE1BQzdCQyx5QkFENkIsR0FDQUYsU0FEQSxDQUM3QkUseUJBRDZCO0FBR2pELE1BQU1DLFNBQVMsR0FBR3RDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjb0MseUJBQWQsRUFBeUMxRCxNQUF6QyxDQUFnRCxVQUFBNkMsQ0FBQztBQUFBLFdBQUlBLENBQUo7QUFBQSxHQUFqRCxDQUFsQjs7QUFFQSxNQUFJLENBQUNjLFNBQVMsQ0FBQzlELE1BQWYsRUFBdUI7QUFDckIsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBTStELFNBQVMsR0FBRyxDQUFDLEtBQUQsQ0FBbEIsQ0FUaUQsQ0FXakQ7QUFDQTs7QUFDQSxNQUFNQyxXQUFXLEdBQUd4QyxNQUFNLENBQUNDLE1BQVAsQ0FBY29DLHlCQUFkLEVBQXlDcEQsTUFBekMsQ0FDbEIsVUFBQ0MsSUFBRCxFQUFPK0MsSUFBUCxFQUFhUixDQUFiO0FBQUEsV0FDRVEsSUFBSSxpREFFSy9DLElBRkwsSUFHRSxDQUFDLElBQUQsRUFBTzhDLGNBQWMsQ0FBQ0MsSUFBRCxDQUFyQixFQUE2QkcsV0FBVyxDQUFDWCxDQUFELENBQVgsQ0FBZSxDQUFmLENBQTdCLENBSEYsRUFJRSxDQUFDLElBQUQsRUFBT08sY0FBYyxDQUFDQyxJQUFELENBQXJCLEVBQTZCRyxXQUFXLENBQUNYLENBQUQsQ0FBWCxDQUFlLENBQWYsQ0FBN0IsQ0FKRixLQU1BdkMsSUFQTjtBQUFBLEdBRGtCLEVBU2xCcUQsU0FUa0IsQ0FBcEI7QUFZQSxTQUFPQyxXQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge09WRVJMQVlfVFlQRX0gZnJvbSAnLi9iYXNlLWxheWVyJztcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCBsYXllcnMgdG8gbWFwYm94IGxheWVyc1xuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBsYXllcnMgdGhlIGxheWVycyB0byBiZSBjb252ZXJ0ZWRcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGF5ZXJEYXRhIGV4dHJhIGxheWVyIGluZm9ybWF0aW9uXG4gKiBAcGFyYW0ge0FycmF5PE51bWJlcj59IGxheWVyT3JkZXIgdGhlIG9yZGVyIGJ5IHdoaWNoIHdlIHNob3VsZCBjb252ZXJ0IGxheWVyc1xuICogQHBhcmFtIHtPYmplY3R9IGxheWVyc1RvUmVuZGVyIHtbaWRdOiB0cnVlIHwgZmFsc2V9IG9iamVjdCB3aGV0aGVyIGVhY2ggbGF5ZXIgc2hvdWxkIGJlIHJlbmRlcmVkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSB7W2lkXTogbGF5ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU1hcGJveExheWVycyhcbiAgbGF5ZXJzID0gW10sXG4gIGxheWVyRGF0YSA9IFtdLFxuICBsYXllck9yZGVyID0gW10sXG4gIGxheWVyc1RvUmVuZGVyID0ge31cbikge1xuICBpZiAobGF5ZXJEYXRhLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gbGF5ZXJPcmRlclxuICAgICAgLnNsaWNlKClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5maWx0ZXIoXG4gICAgICAgIGlkeCA9PiBsYXllcnNbaWR4XS5vdmVybGF5VHlwZSA9PT0gT1ZFUkxBWV9UWVBFLm1hcGJveGdsICYmIGxheWVyc1RvUmVuZGVyW2xheWVyc1tpZHhdLmlkXVxuICAgICAgKVxuICAgICAgLnJlZHVjZSgoYWNjdSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSBsYXllcnNbaW5kZXhdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgW2xheWVyLmlkXToge1xuICAgICAgICAgICAgaWQ6IGxheWVyLmlkLFxuICAgICAgICAgICAgZGF0YTogbGF5ZXJEYXRhW2luZGV4XS5kYXRhLFxuICAgICAgICAgICAgaXNWaXNpYmxlOiBsYXllci5jb25maWcuaXNWaXNpYmxlLFxuICAgICAgICAgICAgY29uZmlnOiBsYXllckRhdGFbaW5kZXhdLmNvbmZpZyxcbiAgICAgICAgICAgIGhpZGRlbjogbGF5ZXIuY29uZmlnLmhpZGRlbixcbiAgICAgICAgICAgIHNvdXJjZUlkOiBsYXllckRhdGFbaW5kZXhdLmNvbmZpZy5zb3VyY2VcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9LCB7fSk7XG4gIH1cblxuICByZXR1cm4ge307XG59XG5cbi8qKlxuICogVXBkYXRlIG1hcGJveCBsYXllcnMgb24gdGhlIGdpdmVuIG1hcFxuICogQHBhcmFtIHtPYmplY3R9IG1hcFxuICogQHBhcmFtIHtPYmplY3R9IG5ld0xheWVycyBNYXAgb2YgbmV3IG1hcGJveCBsYXllcnMgdG8gYmUgZGlzcGxheWVkXG4gKiBAcGFyYW0ge09iamVjdH0gb2xkTGF5ZXJzIE1hcCBvZiB0aGUgb2xkIGxheWVycyB0byBiZSBjb21wYXJlIHdpdGggdGhlIGN1cnJlbnQgb25lcyB0byBkZXRlY3QgZGVsZXRlZCBsYXllcnNcbiAqICAgICAgICAgICAgICAgICAge2xheWVySWQ6IHNvdXJjZUlkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTWFwYm94TGF5ZXJzKG1hcCwgbmV3TGF5ZXJzID0ge30sIG9sZExheWVycyA9IG51bGwpIHtcbiAgLy8gZGVsZXRlIG5vIGxvbmdlciBleGlzdGVkIG9sZCBsYXllcnNcbiAgaWYgKG9sZExheWVycykge1xuICAgIGNoZWNrQW5kUmVtb3ZlT2xkTGF5ZXJzKG1hcCwgb2xkTGF5ZXJzLCBuZXdMYXllcnMpO1xuICB9XG5cbiAgLy8gaW5zZXJ0IG9yIHVwZGF0ZSBuZXcgbGF5ZXJcbiAgT2JqZWN0LnZhbHVlcyhuZXdMYXllcnMpLmZvckVhY2gob3ZlcmxheSA9PiB7XG4gICAgY29uc3Qge2lkOiBsYXllcklkLCBjb25maWcsIGRhdGEsIHNvdXJjZUlkLCBpc1Zpc2libGV9ID0gb3ZlcmxheTtcbiAgICBpZiAoIWRhdGEgJiYgIWNvbmZpZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtkYXRhOiBvbGREYXRhLCBjb25maWc6IG9sZENvbmZpZ30gPSAob2xkTGF5ZXJzICYmIG9sZExheWVyc1tsYXllcklkXSkgfHwge307XG5cbiAgICBpZiAoZGF0YSAmJiBkYXRhICE9PSBvbGREYXRhKSB7XG4gICAgICB1cGRhdGVTb3VyY2VEYXRhKG1hcCwgc291cmNlSWQsIGRhdGEpO1xuICAgIH1cblxuICAgIC8vIGNvbXBhcmUgd2l0aCBwcmV2aW91cyBjb25maWdzXG4gICAgaWYgKG9sZENvbmZpZyAhPT0gY29uZmlnKSB7XG4gICAgICB1cGRhdGVMYXllckNvbmZpZyhtYXAsIGxheWVySWQsIGNvbmZpZywgaXNWaXNpYmxlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0FuZFJlbW92ZU9sZExheWVycyhtYXAsIG9sZExheWVycywgbmV3TGF5ZXJzKSB7XG4gIE9iamVjdC5rZXlzKG9sZExheWVycykuZm9yRWFjaChsYXllcklkID0+IHtcbiAgICBpZiAoIW5ld0xheWVyc1tsYXllcklkXSkge1xuICAgICAgbWFwLnJlbW92ZUxheWVyKGxheWVySWQpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxheWVyQ29uZmlnKG1hcCwgbGF5ZXJJZCwgY29uZmlnLCBpc1Zpc2libGUpIHtcbiAgY29uc3QgbWFwYm94TGF5ZXIgPSBtYXAuZ2V0TGF5ZXIobGF5ZXJJZCk7XG5cbiAgaWYgKG1hcGJveExheWVyKSB7XG4gICAgLy8gY2hlY2sgaWYgbGF5ZXIgYWxyZWFkeSBpcyBzZXRcbiAgICAvLyByZW1vdmUgaXQgaWYgZXhpc3RzXG4gICAgbWFwLnJlbW92ZUxheWVyKGxheWVySWQpO1xuICB9XG5cbiAgbWFwLmFkZExheWVyKGNvbmZpZyk7XG4gIG1hcC5zZXRMYXlvdXRQcm9wZXJ0eShsYXllcklkLCAndmlzaWJpbGl0eScsIGlzVmlzaWJsZSA/ICd2aXNpYmxlJyA6ICdub25lJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVNvdXJjZURhdGEobWFwLCBzb3VyY2VJZCwgZGF0YSkge1xuICBjb25zdCBzb3VyY2UgPSBtYXAuZ2V0U291cmNlKHNvdXJjZUlkKTtcblxuICBpZiAoIXNvdXJjZSkge1xuICAgIG1hcC5hZGRTb3VyY2Uoc291cmNlSWQsIHtcbiAgICAgIHR5cGU6ICdnZW9qc29uJyxcbiAgICAgIGRhdGFcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzb3VyY2Uuc2V0RGF0YShkYXRhKTtcbiAgfVxufVxuLyoqXG4gKlxuICogQHBhcmFtIHBvaW50c1xuICogQHBhcmFtIGNvbHVtbnMge1xuICogbGF0OiB7ZmllbGRJZHh9LFxuICogbG5nOiB7ZmllbGRJZHh9LFxuICogYWx0OiB7ZmllbGRJZHh9XG4gKiB9XG4gKiBAcGFyYW0gcHJvcGVydGllcyBbe2xhYmVsOiB7ZmllbGRJZHh9XVxuICogQHJldHVybnMge3t0eXBlOiBzdHJpbmcsIHByb3BlcnRpZXM6IHt9LCBmZWF0dXJlczoge3R5cGU6IHN0cmluZywgcHJvcGVydGllczoge30sIGdlb21ldHJ5OiB7dHlwZTogc3RyaW5nLCBjb29yZGluYXRlczogKltdfX1bXX19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW9Kc29uRnJvbURhdGEoXG4gIGFsbERhdGEgPSBbXSxcbiAgZmlsdGVyZWRJbmRleCA9IFtdLFxuICBnZXRHZW9tZXRyeSxcbiAgZ2V0UHJvcGVydGllcyA9IChkLCBpKSA9PiB7fVxuKSB7XG4gIGNvbnN0IGdlb2pzb24gPSB7XG4gICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICBmZWF0dXJlczogW11cbiAgfTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlcmVkSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBpbmRleCA9IGZpbHRlcmVkSW5kZXhbaV07XG4gICAgY29uc3QgcG9pbnQgPSBhbGxEYXRhW2luZGV4XTtcbiAgICBjb25zdCBnZW9tZXRyeSA9IGdldEdlb21ldHJ5KHBvaW50KTtcblxuICAgIGlmIChnZW9tZXRyeSkge1xuICAgICAgZ2VvanNvbi5mZWF0dXJlcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgLi4uZ2V0UHJvcGVydGllcyhwb2ludCwgaW5kZXgpXG4gICAgICAgIH0sXG4gICAgICAgIGdlb21ldHJ5XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZ2VvanNvbjtcbn1cblxuZXhwb3J0IGNvbnN0IHByZWZpeEdwdUZpZWxkID0gbmFtZSA9PiBgZ3B1OiR7bmFtZX1gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ3B1RmlsdGVyVG9NYXBib3hGaWx0ZXIoZ3B1RmlsdGVyKSB7XG4gIGNvbnN0IHtmaWx0ZXJSYW5nZSwgZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2Vyc30gPSBncHVGaWx0ZXI7XG5cbiAgY29uc3QgaGFzRmlsdGVyID0gT2JqZWN0LnZhbHVlcyhmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzKS5maWx0ZXIoZCA9PiBkKTtcblxuICBpZiAoIWhhc0ZpbHRlci5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbmRpdGlvbiA9IFsnYWxsJ107XG5cbiAgLy8gW1wiPj1cIiwga2V5LCB2YWx1ZV1cbiAgLy8gW1wiPD1cIiwga2V5LCB2YWx1ZV1cbiAgY29uc3QgZXhwcmVzc2lvbnMgPSBPYmplY3QudmFsdWVzKGZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMpLnJlZHVjZShcbiAgICAoYWNjdSwgbmFtZSwgaSkgPT5cbiAgICAgIG5hbWVcbiAgICAgICAgPyBbXG4gICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgWyc+PScsIHByZWZpeEdwdUZpZWxkKG5hbWUpLCBmaWx0ZXJSYW5nZVtpXVswXV0sXG4gICAgICAgICAgICBbJzw9JywgcHJlZml4R3B1RmllbGQobmFtZSksIGZpbHRlclJhbmdlW2ldWzFdXVxuICAgICAgICAgIF1cbiAgICAgICAgOiBhY2N1LFxuICAgIGNvbmRpdGlvblxuICApO1xuXG4gIHJldHVybiBleHByZXNzaW9ucztcbn1cbiJdfQ==