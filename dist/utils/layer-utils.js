"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDefaultLayer = findDefaultLayer;
exports.calculateLayerData = calculateLayerData;
exports.getLayerHoverProp = getLayerHoverProp;
exports.renderDeckGlLayer = renderDeckGlLayer;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright (c) 2021 Uber Technologies, Inc.
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
function findDefaultLayer(dataset, layerClasses) {
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
      return _objectSpread(_objectSpread({}, p), {}, {
        type: lc,
        dataId: dataset.id
      });
    }));
  }, []); // go through all layerProps to create layer

  return layerProps.map(function (props) {
    var layer = new layerClasses[props.type](props);
    return typeof layer.setInitialLayerConfig === 'function' && Array.isArray(dataset.allData) ? layer.setInitialLayerConfig(dataset) : layer;
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
/**
 * Calculate props passed to LayerHoverInfo
 * @type {typeof import('./layer-utils').getLayerHoverProp}
 */


function getLayerHoverProp(_ref) {
  var interactionConfig = _ref.interactionConfig,
      hoverInfo = _ref.hoverInfo,
      layers = _ref.layers,
      layersToRender = _ref.layersToRender,
      datasets = _ref.datasets;

  if (interactionConfig.tooltip.enabled && hoverInfo && hoverInfo.picked) {
    // if anything hovered
    var object = hoverInfo.object,
        overlay = hoverInfo.layer; // deckgl layer to kepler-gl layer

    var layer = layers[overlay.props.idx];

    if (object && layer && layer.getHoverData && layersToRender[layer.id]) {
      // if layer is visible and have hovered data
      var dataId = layer.config.dataId;

      if (!dataId) {
        return null;
      }

      var _datasets$dataId = datasets[dataId],
          allData = _datasets$dataId.allData,
          fields = _datasets$dataId.fields;
      var data = layer.getHoverData(object, allData, fields);
      var fieldsToShow = interactionConfig.tooltip.config.fieldsToShow[dataId];
      return {
        data: data,
        fields: fields,
        fieldsToShow: fieldsToShow,
        layer: layer
      };
    }
  }

  return null;
}

function renderDeckGlLayer(props, layerCallbacks, idx) {
  var datasets = props.datasets,
      layers = props.layers,
      layerData = props.layerData,
      hoverInfo = props.hoverInfo,
      clicked = props.clicked,
      mapState = props.mapState,
      interactionConfig = props.interactionConfig,
      animationConfig = props.animationConfig;
  var layer = layers[idx];
  var data = layerData[idx];

  var _ref2 = datasets[layer.config.dataId] || {},
      gpuFilter = _ref2.gpuFilter;

  var objectHovered = clicked || hoverInfo; // Layer is Layer class

  return layer.renderLayer({
    data: data,
    gpuFilter: gpuFilter,
    idx: idx,
    interactionConfig: interactionConfig,
    layerCallbacks: layerCallbacks,
    mapState: mapState,
    animationConfig: animationConfig,
    objectHovered: objectHovered
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9sYXllci11dGlscy5qcyJdLCJuYW1lcyI6WyJmaW5kRGVmYXVsdExheWVyIiwiZGF0YXNldCIsImxheWVyQ2xhc3NlcyIsImxheWVyUHJvcHMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwicHJldmlvdXMiLCJsYyIsInJlc3VsdCIsImZpbmREZWZhdWx0TGF5ZXJQcm9wcyIsInByb3BzIiwiQXJyYXkiLCJpc0FycmF5IiwiZm91bmRMYXllcnMiLCJjb25jYXQiLCJtYXAiLCJwIiwidHlwZSIsImRhdGFJZCIsImlkIiwibGF5ZXIiLCJzZXRJbml0aWFsTGF5ZXJDb25maWciLCJhbGxEYXRhIiwiY2FsY3VsYXRlTGF5ZXJEYXRhIiwic3RhdGUiLCJvbGRMYXllckRhdGEiLCJoYXNBbGxDb2x1bW5zIiwiY29uZmlnIiwibGF5ZXJEYXRhIiwiZm9ybWF0TGF5ZXJEYXRhIiwiZGF0YXNldHMiLCJnZXRMYXllckhvdmVyUHJvcCIsImludGVyYWN0aW9uQ29uZmlnIiwiaG92ZXJJbmZvIiwibGF5ZXJzIiwibGF5ZXJzVG9SZW5kZXIiLCJ0b29sdGlwIiwiZW5hYmxlZCIsInBpY2tlZCIsIm9iamVjdCIsIm92ZXJsYXkiLCJpZHgiLCJnZXRIb3ZlckRhdGEiLCJmaWVsZHMiLCJkYXRhIiwiZmllbGRzVG9TaG93IiwicmVuZGVyRGVja0dsTGF5ZXIiLCJsYXllckNhbGxiYWNrcyIsImNsaWNrZWQiLCJtYXBTdGF0ZSIsImFuaW1hdGlvbkNvbmZpZyIsImdwdUZpbHRlciIsIm9iamVjdEhvdmVyZWQiLCJyZW5kZXJMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQSxnQkFBVCxDQUEwQkMsT0FB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aG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLyoqXG4gKiBGaW5kIGRlZmF1bHQgbGF5ZXJzIGZyb20gZmllbGRzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9sYXllci11dGlscycpLmZpbmREZWZhdWx0TGF5ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRGVmYXVsdExheWVyKGRhdGFzZXQsIGxheWVyQ2xhc3Nlcykge1xuICBpZiAoIWRhdGFzZXQpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY29uc3QgbGF5ZXJQcm9wcyA9IE9iamVjdC5rZXlzKGxheWVyQ2xhc3NlcykucmVkdWNlKChwcmV2aW91cywgbGMpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPVxuICAgICAgdHlwZW9mIGxheWVyQ2xhc3Nlc1tsY10uZmluZERlZmF1bHRMYXllclByb3BzID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gbGF5ZXJDbGFzc2VzW2xjXS5maW5kRGVmYXVsdExheWVyUHJvcHMoZGF0YXNldCwgcHJldmlvdXMpXG4gICAgICAgIDoge3Byb3BzOiBbXX07XG5cbiAgICBjb25zdCBwcm9wcyA9IEFycmF5LmlzQXJyYXkocmVzdWx0KSA/IHJlc3VsdCA6IHJlc3VsdC5wcm9wcyB8fCBbXTtcbiAgICBjb25zdCBmb3VuZExheWVycyA9IHJlc3VsdC5mb3VuZExheWVycyB8fCBwcmV2aW91cztcblxuICAgIHJldHVybiBmb3VuZExheWVycy5jb25jYXQoXG4gICAgICBwcm9wcy5tYXAocCA9PiAoe1xuICAgICAgICAuLi5wLFxuICAgICAgICB0eXBlOiBsYyxcbiAgICAgICAgZGF0YUlkOiBkYXRhc2V0LmlkXG4gICAgICB9KSlcbiAgICApO1xuICB9LCBbXSk7XG5cbiAgLy8gZ28gdGhyb3VnaCBhbGwgbGF5ZXJQcm9wcyB0byBjcmVhdGUgbGF5ZXJcbiAgcmV0dXJuIGxheWVyUHJvcHMubWFwKHByb3BzID0+IHtcbiAgICBjb25zdCBsYXllciA9IG5ldyBsYXllckNsYXNzZXNbcHJvcHMudHlwZV0ocHJvcHMpO1xuICAgIHJldHVybiB0eXBlb2YgbGF5ZXIuc2V0SW5pdGlhbExheWVyQ29uZmlnID09PSAnZnVuY3Rpb24nICYmIEFycmF5LmlzQXJyYXkoZGF0YXNldC5hbGxEYXRhKVxuICAgICAgPyBsYXllci5zZXRJbml0aWFsTGF5ZXJDb25maWcoZGF0YXNldClcbiAgICAgIDogbGF5ZXI7XG4gIH0pO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSBsYXllciBkYXRhIGJhc2VkIG9uIGxheWVyIHR5cGUsIGNvbCBDb25maWcsXG4gKiByZXR1cm4gdXBkYXRlZCBsYXllciBpZiBjb2xvckRvbWFpbiwgZGF0YU1hcCBoYXMgY2hhbmdlZFxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbGF5ZXItdXRpbHMnKS5jYWxjdWxhdGVMYXllckRhdGF9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVMYXllckRhdGEobGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEpIHtcbiAgY29uc3Qge3R5cGV9ID0gbGF5ZXI7XG5cbiAgaWYgKCF0eXBlIHx8ICFsYXllci5oYXNBbGxDb2x1bW5zKCkgfHwgIWxheWVyLmNvbmZpZy5kYXRhSWQpIHtcbiAgICByZXR1cm4ge2xheWVyLCBsYXllckRhdGE6IHt9fTtcbiAgfVxuXG4gIGNvbnN0IGxheWVyRGF0YSA9IGxheWVyLmZvcm1hdExheWVyRGF0YShzdGF0ZS5kYXRhc2V0cywgb2xkTGF5ZXJEYXRhKTtcbiAgcmV0dXJuIHtsYXllckRhdGEsIGxheWVyfTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgcHJvcHMgcGFzc2VkIHRvIExheWVySG92ZXJJbmZvXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9sYXllci11dGlscycpLmdldExheWVySG92ZXJQcm9wfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGF5ZXJIb3ZlclByb3Aoe1xuICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgaG92ZXJJbmZvLFxuICBsYXllcnMsXG4gIGxheWVyc1RvUmVuZGVyLFxuICBkYXRhc2V0c1xufSkge1xuICBpZiAoaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5lbmFibGVkICYmIGhvdmVySW5mbyAmJiBob3ZlckluZm8ucGlja2VkKSB7XG4gICAgLy8gaWYgYW55dGhpbmcgaG92ZXJlZFxuICAgIGNvbnN0IHtvYmplY3QsIGxheWVyOiBvdmVybGF5fSA9IGhvdmVySW5mbztcblxuICAgIC8vIGRlY2tnbCBsYXllciB0byBrZXBsZXItZ2wgbGF5ZXJcbiAgICBjb25zdCBsYXllciA9IGxheWVyc1tvdmVybGF5LnByb3BzLmlkeF07XG5cbiAgICBpZiAob2JqZWN0ICYmIGxheWVyICYmIGxheWVyLmdldEhvdmVyRGF0YSAmJiBsYXllcnNUb1JlbmRlcltsYXllci5pZF0pIHtcbiAgICAgIC8vIGlmIGxheWVyIGlzIHZpc2libGUgYW5kIGhhdmUgaG92ZXJlZCBkYXRhXG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvbmZpZzoge2RhdGFJZH1cbiAgICAgIH0gPSBsYXllcjtcbiAgICAgIGlmICghZGF0YUlkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3Qge2FsbERhdGEsIGZpZWxkc30gPSBkYXRhc2V0c1tkYXRhSWRdO1xuICAgICAgY29uc3QgZGF0YSA9IGxheWVyLmdldEhvdmVyRGF0YShvYmplY3QsIGFsbERhdGEsIGZpZWxkcyk7XG4gICAgICBjb25zdCBmaWVsZHNUb1Nob3cgPSBpbnRlcmFjdGlvbkNvbmZpZy50b29sdGlwLmNvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgZmllbGRzLFxuICAgICAgICBmaWVsZHNUb1Nob3csXG4gICAgICAgIGxheWVyXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRGVja0dsTGF5ZXIocHJvcHMsIGxheWVyQ2FsbGJhY2tzLCBpZHgpIHtcbiAgY29uc3Qge1xuICAgIGRhdGFzZXRzLFxuICAgIGxheWVycyxcbiAgICBsYXllckRhdGEsXG4gICAgaG92ZXJJbmZvLFxuICAgIGNsaWNrZWQsXG4gICAgbWFwU3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWcsXG4gICAgYW5pbWF0aW9uQ29uZmlnXG4gIH0gPSBwcm9wcztcbiAgY29uc3QgbGF5ZXIgPSBsYXllcnNbaWR4XTtcbiAgY29uc3QgZGF0YSA9IGxheWVyRGF0YVtpZHhdO1xuICBjb25zdCB7Z3B1RmlsdGVyfSA9IGRhdGFzZXRzW2xheWVyLmNvbmZpZy5kYXRhSWRdIHx8IHt9O1xuXG4gIGNvbnN0IG9iamVjdEhvdmVyZWQgPSBjbGlja2VkIHx8IGhvdmVySW5mbztcblxuICAvLyBMYXllciBpcyBMYXllciBjbGFzc1xuICByZXR1cm4gbGF5ZXIucmVuZGVyTGF5ZXIoe1xuICAgIGRhdGEsXG4gICAgZ3B1RmlsdGVyLFxuICAgIGlkeCxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICBsYXllckNhbGxiYWNrcyxcbiAgICBtYXBTdGF0ZSxcbiAgICBhbmltYXRpb25Db25maWcsXG4gICAgb2JqZWN0SG92ZXJlZFxuICB9KTtcbn1cbiJdfQ==