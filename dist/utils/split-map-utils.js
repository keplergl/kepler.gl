"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNewLayersToSplitMap = addNewLayersToSplitMap;
exports.removeLayerFromSplitMaps = removeLayerFromSplitMaps;
exports.getInitialMapLayersForSplitMap = getInitialMapLayersForSplitMap;
exports.computeSplitMapLayers = computeSplitMapLayers;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash.clonedeep"));

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Add new layers to both existing maps
 * @param {Object} splitMaps
 * @param {Object|Array<Object>} layers
 * @returns {Array<Object>} new splitMaps
 */
function addNewLayersToSplitMap(splitMaps, layers) {
  var newLayers = Array.isArray(layers) ? layers : [layers];

  if (!splitMaps.length || !newLayers.length) {
    return splitMaps;
  } // add new layer to both maps,
  // don't override, if layer.id is already in splitMaps


  return splitMaps.map(function (settings) {
    return _objectSpread(_objectSpread({}, settings), {}, {
      layers: _objectSpread(_objectSpread({}, settings.layers), newLayers.reduce(function (accu, newLayer) {
        return (// @ts-ignore
          newLayer.id in settings.layers || !newLayer.config.isVisible ? accu : _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, newLayer.id, newLayer.config.isVisible))
        );
      }, {}))
    });
  });
}
/**
 * Remove an existing layer from split map settings
 * @param {Object} splitMaps
 * @param {Object} layer
 * @returns {Object} Maps of custom layer objects
 */


function removeLayerFromSplitMaps(splitMaps, layer) {
  if (!splitMaps.length) {
    return splitMaps;
  }

  return splitMaps.map(function (settings) {
    // eslint-disable-next-line no-unused-vars
    var _settings$layers = settings.layers,
        _layer$id = layer.id,
        _ = _settings$layers[_layer$id],
        newLayers = (0, _objectWithoutProperties2["default"])(_settings$layers, [_layer$id].map(_toPropertyKey));
    return _objectSpread(_objectSpread({}, settings), {}, {
      layers: newLayers
    });
  });
}
/**
 * This method will compute the default maps layer settings
 * based on the current layers visibility
 * @param {Array<Object>} layers
 * @returns {Array<Object>} layer visibility for each panel
 */


function getInitialMapLayersForSplitMap(layers) {
  return layers.filter(function (layer) {
    return layer.config.isVisible;
  }).reduce(function (newLayers, currentLayer) {
    return _objectSpread(_objectSpread({}, newLayers), {}, (0, _defineProperty2["default"])({}, currentLayer.id, currentLayer.config.isVisible));
  }, {});
}
/**
 * This method will get default splitMap settings based on existing layers
 * @param {Array<Object>} layers
 * @returns {Array<Object>} split map settings
 */


function computeSplitMapLayers(layers) {
  var mapLayers = getInitialMapLayersForSplitMap(layers);
  return [{
    layers: mapLayers
  }, {
    layers: (0, _lodash["default"])(mapLayers)
  }];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zcGxpdC1tYXAtdXRpbHMuanMiXSwibmFtZXMiOlsiYWRkTmV3TGF5ZXJzVG9TcGxpdE1hcCIsInNwbGl0TWFwcyIsImxheWVycyIsIm5ld0xheWVycyIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsIm1hcCIsInNldHRpbmdzIiwicmVkdWNlIiwiYWNjdSIsIm5ld0xheWVyIiwiaWQiLCJjb25maWciLCJpc1Zpc2libGUiLCJyZW1vdmVMYXllckZyb21TcGxpdE1hcHMiLCJsYXllciIsIl8iLCJnZXRJbml0aWFsTWFwTGF5ZXJzRm9yU3BsaXRNYXAiLCJmaWx0ZXIiLCJjdXJyZW50TGF5ZXIiLCJjb21wdXRlU3BsaXRNYXBMYXllcnMiLCJtYXBMYXllcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVNBLHNCQUFULENBQWdDQyxTQUFoQyxFQUEyQ0MsTUFBM0MsRUFBbUQ7QUFDeEQsTUFBTUMsU0FBUyxHQUFHQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0gsTUFBZCxJQUF3QkEsTUFBeEIsR0FBaUMsQ0FBQ0EsTUFBRCxDQUFuRDs7QUFFQSxNQUFJLENBQUNELFNBQVMsQ0FBQ0ssTUFBWCxJQUFxQixDQUFDSCxTQUFTLENBQUNHLE1BQXBDLEVBQTRDO0FBQzFDLFdBQU9MLFNBQVA7QUFDRCxHQUx1RCxDQU94RDtBQUNBOzs7QUFDQSxTQUFPQSxTQUFTLENBQUNNLEdBQVYsQ0FBYyxVQUFBQyxRQUFRO0FBQUEsMkNBQ3hCQSxRQUR3QjtBQUUzQk4sTUFBQUEsTUFBTSxrQ0FDRE0sUUFBUSxDQUFDTixNQURSLEdBRURDLFNBQVMsQ0FBQ00sTUFBVixDQUNELFVBQUNDLElBQUQsRUFBT0MsUUFBUDtBQUFBLGVBQ0U7QUFDQUEsVUFBQUEsUUFBUSxDQUFDQyxFQUFULElBQWVKLFFBQVEsQ0FBQ04sTUFBeEIsSUFBa0MsQ0FBQ1MsUUFBUSxDQUFDRSxNQUFULENBQWdCQyxTQUFuRCxHQUNJSixJQURKLG1DQUdTQSxJQUhULDRDQUlPQyxRQUFRLENBQUNDLEVBSmhCLEVBSXFCRCxRQUFRLENBQUNFLE1BQVQsQ0FBZ0JDLFNBSnJDO0FBRkY7QUFBQSxPQURDLEVBU0QsRUFUQyxDQUZDO0FBRnFCO0FBQUEsR0FBdEIsQ0FBUDtBQWlCRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0Msd0JBQVQsQ0FBa0NkLFNBQWxDLEVBQTZDZSxLQUE3QyxFQUFvRDtBQUN6RCxNQUFJLENBQUNmLFNBQVMsQ0FBQ0ssTUFBZixFQUF1QjtBQUNyQixXQUFPTCxTQUFQO0FBQ0Q7O0FBQ0QsU0FBT0EsU0FBUyxDQUFDTSxHQUFWLENBQWMsVUFBQUMsUUFBUSxFQUFJO0FBQy9CO0FBRCtCLDJCQUVPQSxRQUFRLENBQUNOLE1BRmhCO0FBQUEsb0JBRXZCYyxLQUFLLENBQUNKLEVBRmlCO0FBQUEsUUFFWkssQ0FGWTtBQUFBLFFBRU5kLFNBRk07QUFHL0IsMkNBQ0tLLFFBREw7QUFFRU4sTUFBQUEsTUFBTSxFQUFFQztBQUZWO0FBSUQsR0FQTSxDQUFQO0FBUUQ7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNlLDhCQUFULENBQXdDaEIsTUFBeEMsRUFBZ0Q7QUFDckQsU0FBT0EsTUFBTSxDQUNWaUIsTUFESSxDQUNHLFVBQUFILEtBQUs7QUFBQSxXQUFJQSxLQUFLLENBQUNILE1BQU4sQ0FBYUMsU0FBakI7QUFBQSxHQURSLEVBRUpMLE1BRkksQ0FHSCxVQUFDTixTQUFELEVBQVlpQixZQUFaO0FBQUEsMkNBQ0tqQixTQURMLDRDQUVHaUIsWUFBWSxDQUFDUixFQUZoQixFQUVxQlEsWUFBWSxDQUFDUCxNQUFiLENBQW9CQyxTQUZ6QztBQUFBLEdBSEcsRUFPSCxFQVBHLENBQVA7QUFTRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNPLHFCQUFULENBQStCbkIsTUFBL0IsRUFBdUM7QUFDNUMsTUFBTW9CLFNBQVMsR0FBR0osOEJBQThCLENBQUNoQixNQUFELENBQWhEO0FBRUEsU0FBTyxDQUFDO0FBQUNBLElBQUFBLE1BQU0sRUFBRW9CO0FBQVQsR0FBRCxFQUFzQjtBQUFDcEIsSUFBQUEsTUFBTSxFQUFFLHdCQUFVb0IsU0FBVjtBQUFULEdBQXRCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5cbi8qKlxuICogQWRkIG5ldyBsYXllcnMgdG8gYm90aCBleGlzdGluZyBtYXBzXG4gKiBAcGFyYW0ge09iamVjdH0gc3BsaXRNYXBzXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheTxPYmplY3Q+fSBsYXllcnNcbiAqIEByZXR1cm5zIHtBcnJheTxPYmplY3Q+fSBuZXcgc3BsaXRNYXBzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHNwbGl0TWFwcywgbGF5ZXJzKSB7XG4gIGNvbnN0IG5ld0xheWVycyA9IEFycmF5LmlzQXJyYXkobGF5ZXJzKSA/IGxheWVycyA6IFtsYXllcnNdO1xuXG4gIGlmICghc3BsaXRNYXBzLmxlbmd0aCB8fCAhbmV3TGF5ZXJzLmxlbmd0aCkge1xuICAgIHJldHVybiBzcGxpdE1hcHM7XG4gIH1cblxuICAvLyBhZGQgbmV3IGxheWVyIHRvIGJvdGggbWFwcyxcbiAgLy8gZG9uJ3Qgb3ZlcnJpZGUsIGlmIGxheWVyLmlkIGlzIGFscmVhZHkgaW4gc3BsaXRNYXBzXG4gIHJldHVybiBzcGxpdE1hcHMubWFwKHNldHRpbmdzID0+ICh7XG4gICAgLi4uc2V0dGluZ3MsXG4gICAgbGF5ZXJzOiB7XG4gICAgICAuLi5zZXR0aW5ncy5sYXllcnMsXG4gICAgICAuLi5uZXdMYXllcnMucmVkdWNlKFxuICAgICAgICAoYWNjdSwgbmV3TGF5ZXIpID0+XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIG5ld0xheWVyLmlkIGluIHNldHRpbmdzLmxheWVycyB8fCAhbmV3TGF5ZXIuY29uZmlnLmlzVmlzaWJsZVxuICAgICAgICAgICAgPyBhY2N1XG4gICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAgIFtuZXdMYXllci5pZF06IG5ld0xheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICB9XG4gIH0pKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gZXhpc3RpbmcgbGF5ZXIgZnJvbSBzcGxpdCBtYXAgc2V0dGluZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcGxpdE1hcHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBsYXllclxuICogQHJldHVybnMge09iamVjdH0gTWFwcyBvZiBjdXN0b20gbGF5ZXIgb2JqZWN0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzKHNwbGl0TWFwcywgbGF5ZXIpIHtcbiAgaWYgKCFzcGxpdE1hcHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHNwbGl0TWFwcztcbiAgfVxuICByZXR1cm4gc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgY29uc3Qge1tsYXllci5pZF06IF8sIC4uLm5ld0xheWVyc30gPSBzZXR0aW5ncy5sYXllcnM7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgICB9O1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCB3aWxsIGNvbXB1dGUgdGhlIGRlZmF1bHQgbWFwcyBsYXllciBzZXR0aW5nc1xuICogYmFzZWQgb24gdGhlIGN1cnJlbnQgbGF5ZXJzIHZpc2liaWxpdHlcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGF5ZXJzXG4gKiBAcmV0dXJucyB7QXJyYXk8T2JqZWN0Pn0gbGF5ZXIgdmlzaWJpbGl0eSBmb3IgZWFjaCBwYW5lbFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5pdGlhbE1hcExheWVyc0ZvclNwbGl0TWFwKGxheWVycykge1xuICByZXR1cm4gbGF5ZXJzXG4gICAgLmZpbHRlcihsYXllciA9PiBsYXllci5jb25maWcuaXNWaXNpYmxlKVxuICAgIC5yZWR1Y2UoXG4gICAgICAobmV3TGF5ZXJzLCBjdXJyZW50TGF5ZXIpID0+ICh7XG4gICAgICAgIC4uLm5ld0xheWVycyxcbiAgICAgICAgW2N1cnJlbnRMYXllci5pZF06IGN1cnJlbnRMYXllci5jb25maWcuaXNWaXNpYmxlXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCB3aWxsIGdldCBkZWZhdWx0IHNwbGl0TWFwIHNldHRpbmdzIGJhc2VkIG9uIGV4aXN0aW5nIGxheWVyc1xuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBsYXllcnNcbiAqIEByZXR1cm5zIHtBcnJheTxPYmplY3Q+fSBzcGxpdCBtYXAgc2V0dGluZ3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVTcGxpdE1hcExheWVycyhsYXllcnMpIHtcbiAgY29uc3QgbWFwTGF5ZXJzID0gZ2V0SW5pdGlhbE1hcExheWVyc0ZvclNwbGl0TWFwKGxheWVycyk7XG5cbiAgcmV0dXJuIFt7bGF5ZXJzOiBtYXBMYXllcnN9LCB7bGF5ZXJzOiBjbG9uZURlZXAobWFwTGF5ZXJzKX1dO1xufVxuIl19