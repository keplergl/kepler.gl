"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDefaultLayer = findDefaultLayer;
exports.calculateLayerData = calculateLayerData;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * Find default layers from fields
 * @type {typeof import('./layer-utils').findDefaultLayer}
 */
function findDefaultLayer(dataset) {
  var layerClasses = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!dataset) {
    return [];
  }

  var layerProps = Object.keys(layerClasses).reduce(function (previous, lc) {
    var result = typeof layerClasses[lc].findDefaultLayerProps === 'function' ? layerClasses[lc].findDefaultLayerProps(dataset, previous) : {
      props: []
    };
    var props = Array.isArray(result) ? result : result.props || [];
    var foundLayers = result.foundLayers || previous;
    return foundLayers.concat(props.map(function (p) {
      return _objectSpread({}, p, {
        type: lc,
        dataId: dataset.id
      });
    }));
  }, []); // go through all layerProps to create layer

  return layerProps.map(function (props) {
    var layer = new layerClasses[props.type](props);
    return typeof layer.setInitialLayerConfig === 'function' ? layer.setInitialLayerConfig(dataset.allData) : layer;
  });
}
/**
 * calculate layer data based on layer type, col Config,
 * return updated layer if colorDomain, dataMap has changed
 * @type {typeof import('./layer-utils').calculateLayerData}
 */


function calculateLayerData(layer, state, oldLayerData) {
  var type = layer.type;

  if (!type || !layer.hasAllColumns() || !layer.config.dataId) {
    return {
      layer: layer,
      layerData: {}
    };
  }

  var layerData = layer.formatLayerData(state.datasets, oldLayerData);
  return {
    layerData: layerData,
    layer: layer
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9sYXllci11dGlscy9sYXllci11dGlscy5qcyJdLCJuYW1lcyI6WyJmaW5kRGVmYXVsdExheWVyIiwiZGF0YXNldCIsImxheWVyQ2xhc3NlcyIsImxheWVyUHJvcHMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwicHJldmlvdXMiLCJsYyIsInJlc3VsdCIsImZpbmREZWZhdWx0TGF5ZXJQcm9wcyIsInByb3BzIiwiQXJyYXkiLCJpc0FycmF5IiwiZm91bmRMYXllcnMiLCJjb25jYXQiLCJtYXAiLCJwIiwidHlwZSIsImRhdGFJZCIsImlkIiwibGF5ZXIiLCJzZXRJbml0aWFsTGF5ZXJDb25maWciLCJhbGxEYXRhIiwiY2FsY3VsYXRlTGF5ZXJEYXRhIiwic3RhdGUiLCJvbGRMYXllckRhdGEiLCJoYXNBbGxDb2x1bW5zIiwiY29uZmlnIiwibGF5ZXJEYXRhIiwiZm9ybWF0TGF5ZXJEYXRhIiwiZGF0YXNldHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUlPLFNBQVNBLGdCQUFULENBQTBCQyxPQUExQixFQUFzRDtBQUFBLE1BQW5CQyxZQUFtQix1RUFBSixFQUFJOztBQUMzRCxNQUFJLENBQUNELE9BQUwsRUFBYztBQUNaLFdBQU8sRUFBUDtBQUNEOztBQUNELE1BQU1FLFVBQVUsR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVlILFlBQVosRUFBMEJJLE1BQTFCLENBQWlDLFVBQUNDLFFBQUQsRUFBV0MsRUFBWCxFQUFrQjtBQUNwRSxRQUFNQyxNQUFNLEdBQ1YsT0FBT1AsWUFBWSxDQUFDTSxFQUFELENBQVosQ0FBaUJFLHFCQUF4QixLQUFrRCxVQUFsRCxHQUNJUixZQUFZLENBQUNNLEVBQUQsQ0FBWixDQUFpQkUscUJBQWpCLENBQXVDVCxPQUF2QyxFQUFnRE0sUUFBaEQsQ0FESixHQUVJO0FBQUNJLE1BQUFBLEtBQUssRUFBRTtBQUFSLEtBSE47QUFLQSxRQUFNQSxLQUFLLEdBQUdDLEtBQUssQ0FBQ0MsT0FBTixDQUFjSixNQUFkLElBQXdCQSxNQUF4QixHQUFpQ0EsTUFBTSxDQUFDRSxLQUFQLElBQWdCLEVBQS9EO0FBQ0EsUUFBTUcsV0FBVyxHQUFHTCxNQUFNLENBQUNLLFdBQVAsSUFBc0JQLFFBQTFDO0FBRUEsV0FBT08sV0FBVyxDQUFDQyxNQUFaLENBQ0xKLEtBQUssQ0FBQ0ssR0FBTixDQUFVLFVBQUFDLENBQUM7QUFBQSwrQkFDTkEsQ0FETTtBQUVUQyxRQUFBQSxJQUFJLEVBQUVWLEVBRkc7QUFHVFcsUUFBQUEsTUFBTSxFQUFFbEIsT0FBTyxDQUFDbUI7QUFIUDtBQUFBLEtBQVgsQ0FESyxDQUFQO0FBT0QsR0FoQmtCLEVBZ0JoQixFQWhCZ0IsQ0FBbkIsQ0FKMkQsQ0FzQjNEOztBQUNBLFNBQU9qQixVQUFVLENBQUNhLEdBQVgsQ0FBZSxVQUFBTCxLQUFLLEVBQUk7QUFDN0IsUUFBTVUsS0FBSyxHQUFHLElBQUluQixZQUFZLENBQUNTLEtBQUssQ0FBQ08sSUFBUCxDQUFoQixDQUE2QlAsS0FBN0IsQ0FBZDtBQUNBLFdBQU8sT0FBT1UsS0FBSyxDQUFDQyxxQkFBYixLQUF1QyxVQUF2QyxHQUNIRCxLQUFLLENBQUNDLHFCQUFOLENBQTRCckIsT0FBTyxDQUFDc0IsT0FBcEMsQ0FERyxHQUVIRixLQUZKO0FBR0QsR0FMTSxDQUFQO0FBTUQ7QUFFRDs7Ozs7OztBQUtPLFNBQVNHLGtCQUFULENBQTRCSCxLQUE1QixFQUFtQ0ksS0FBbkMsRUFBMENDLFlBQTFDLEVBQXdEO0FBQUEsTUFDdERSLElBRHNELEdBQzlDRyxLQUQ4QyxDQUN0REgsSUFEc0Q7O0FBRzdELE1BQUksQ0FBQ0EsSUFBRCxJQUFTLENBQUNHLEtBQUssQ0FBQ00sYUFBTixFQUFWLElBQW1DLENBQUNOLEtBQUssQ0FBQ08sTUFBTixDQUFhVCxNQUFyRCxFQUE2RDtBQUMzRCxXQUFPO0FBQUNFLE1BQUFBLEtBQUssRUFBTEEsS0FBRDtBQUFRUSxNQUFBQSxTQUFTLEVBQUU7QUFBbkIsS0FBUDtBQUNEOztBQUVELE1BQU1BLFNBQVMsR0FBR1IsS0FBSyxDQUFDUyxlQUFOLENBQXNCTCxLQUFLLENBQUNNLFFBQTVCLEVBQXNDTCxZQUF0QyxDQUFsQjtBQUNBLFNBQU87QUFBQ0csSUFBQUEsU0FBUyxFQUFUQSxTQUFEO0FBQVlSLElBQUFBLEtBQUssRUFBTEE7QUFBWixHQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vKipcbiAqIEZpbmQgZGVmYXVsdCBsYXllcnMgZnJvbSBmaWVsZHNcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2xheWVyLXV0aWxzJykuZmluZERlZmF1bHRMYXllcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmREZWZhdWx0TGF5ZXIoZGF0YXNldCwgbGF5ZXJDbGFzc2VzID0ge30pIHtcbiAgaWYgKCFkYXRhc2V0KSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGNvbnN0IGxheWVyUHJvcHMgPSBPYmplY3Qua2V5cyhsYXllckNsYXNzZXMpLnJlZHVjZSgocHJldmlvdXMsIGxjKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID1cbiAgICAgIHR5cGVvZiBsYXllckNsYXNzZXNbbGNdLmZpbmREZWZhdWx0TGF5ZXJQcm9wcyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IGxheWVyQ2xhc3Nlc1tsY10uZmluZERlZmF1bHRMYXllclByb3BzKGRhdGFzZXQsIHByZXZpb3VzKVxuICAgICAgICA6IHtwcm9wczogW119O1xuXG4gICAgY29uc3QgcHJvcHMgPSBBcnJheS5pc0FycmF5KHJlc3VsdCkgPyByZXN1bHQgOiByZXN1bHQucHJvcHMgfHwgW107XG4gICAgY29uc3QgZm91bmRMYXllcnMgPSByZXN1bHQuZm91bmRMYXllcnMgfHwgcHJldmlvdXM7XG5cbiAgICByZXR1cm4gZm91bmRMYXllcnMuY29uY2F0KFxuICAgICAgcHJvcHMubWFwKHAgPT4gKHtcbiAgICAgICAgLi4ucCxcbiAgICAgICAgdHlwZTogbGMsXG4gICAgICAgIGRhdGFJZDogZGF0YXNldC5pZFxuICAgICAgfSkpXG4gICAgKTtcbiAgfSwgW10pO1xuXG4gIC8vIGdvIHRocm91Z2ggYWxsIGxheWVyUHJvcHMgdG8gY3JlYXRlIGxheWVyXG4gIHJldHVybiBsYXllclByb3BzLm1hcChwcm9wcyA9PiB7XG4gICAgY29uc3QgbGF5ZXIgPSBuZXcgbGF5ZXJDbGFzc2VzW3Byb3BzLnR5cGVdKHByb3BzKTtcbiAgICByZXR1cm4gdHlwZW9mIGxheWVyLnNldEluaXRpYWxMYXllckNvbmZpZyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBsYXllci5zZXRJbml0aWFsTGF5ZXJDb25maWcoZGF0YXNldC5hbGxEYXRhKVxuICAgICAgOiBsYXllcjtcbiAgfSk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIGxheWVyIGRhdGEgYmFzZWQgb24gbGF5ZXIgdHlwZSwgY29sIENvbmZpZyxcbiAqIHJldHVybiB1cGRhdGVkIGxheWVyIGlmIGNvbG9yRG9tYWluLCBkYXRhTWFwIGhhcyBjaGFuZ2VkXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9sYXllci11dGlscycpLmNhbGN1bGF0ZUxheWVyRGF0YX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZUxheWVyRGF0YShsYXllciwgc3RhdGUsIG9sZExheWVyRGF0YSkge1xuICBjb25zdCB7dHlwZX0gPSBsYXllcjtcblxuICBpZiAoIXR5cGUgfHwgIWxheWVyLmhhc0FsbENvbHVtbnMoKSB8fCAhbGF5ZXIuY29uZmlnLmRhdGFJZCkge1xuICAgIHJldHVybiB7bGF5ZXIsIGxheWVyRGF0YToge319O1xuICB9XG5cbiAgY29uc3QgbGF5ZXJEYXRhID0gbGF5ZXIuZm9ybWF0TGF5ZXJEYXRhKHN0YXRlLmRhdGFzZXRzLCBvbGRMYXllckRhdGEpO1xuICByZXR1cm4ge2xheWVyRGF0YSwgbGF5ZXJ9O1xufVxuIl19