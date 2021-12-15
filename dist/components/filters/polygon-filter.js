"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _itemSelector = _interopRequireDefault(require("../common/item-selector/item-selector"));

var _components = require("./components");

var _types = require("../../layers/types");

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
var layerFilter = function layerFilter(layer) {
  return layer.type === _types.LAYER_TYPES.point;
};

var isAlreadySelected = function isAlreadySelected(selectedLayers, layerId) {
  return selectedLayers.findIndex(function (l) {
    return l.id === layerId;
  }) === -1;
};

function PolygonFilterFactory() {
  /** @type {typeof import('./polygon-filter').PolygonFilter} */
  var PolygonFilter = /*#__PURE__*/_react["default"].memo(function (_ref) {
    var filter = _ref.filter,
        layers = _ref.layers,
        setLayers = _ref.setLayers;
    var setNewLayers = (0, _react.useCallback)(function (newLayers) {
      return setLayers(newLayers.map(function (l) {
        return l.id;
      }));
    }, [setLayers]);
    var selectedLayers = (0, _react.useMemo)(function () {
      return layers.filter(function (l) {
        var _filter$layerId;

        return (_filter$layerId = filter.layerId) === null || _filter$layerId === void 0 ? void 0 : _filter$layerId.includes(l.id);
      });
    }, [filter, layers]);
    var availableLayers = (0, _react.useMemo)(function () {
      // remove already added layers and filter out non point layers
      return layers.filter(function (layer) {
        return layerFilter(layer) && isAlreadySelected(selectedLayers, layer.id);
      });
    }, [layers, selectedLayers]);
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_components.StyledFilterPanel, {
      htmlFor: "filter-".concat(filter.id)
    }, "Layers:"), /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], {
      options: availableLayers,
      selectedItems: selectedLayers,
      onChange: setNewLayers,
      searchable: false,
      multiSelect: true,
      getOptionValue: function getOptionValue(l) {
        return l.id;
      },
      displayOption: function displayOption(l) {
        return l.config.label;
      }
    }));
  });

  PolygonFilter.displayName = 'PolygonFilter';
  return PolygonFilter;
}

var _default = PolygonFilterFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvcG9seWdvbi1maWx0ZXIuanMiXSwibmFtZXMiOlsibGF5ZXJGaWx0ZXIiLCJsYXllciIsInR5cGUiLCJMQVlFUl9UWVBFUyIsInBvaW50IiwiaXNBbHJlYWR5U2VsZWN0ZWQiLCJzZWxlY3RlZExheWVycyIsImxheWVySWQiLCJmaW5kSW5kZXgiLCJsIiwiaWQiLCJQb2x5Z29uRmlsdGVyRmFjdG9yeSIsIlBvbHlnb25GaWx0ZXIiLCJSZWFjdCIsIm1lbW8iLCJmaWx0ZXIiLCJsYXllcnMiLCJzZXRMYXllcnMiLCJzZXROZXdMYXllcnMiLCJuZXdMYXllcnMiLCJtYXAiLCJpbmNsdWRlcyIsImF2YWlsYWJsZUxheWVycyIsImNvbmZpZyIsImxhYmVsIiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQXZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BLElBQU1BLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLElBQU4sS0FBZUMsbUJBQVlDLEtBQS9CO0FBQUEsQ0FBekI7O0FBQ0EsSUFBTUMsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQixDQUFDQyxjQUFELEVBQWlCQyxPQUFqQjtBQUFBLFNBQ3hCRCxjQUFjLENBQUNFLFNBQWYsQ0FBeUIsVUFBQUMsQ0FBQztBQUFBLFdBQUlBLENBQUMsQ0FBQ0MsRUFBRixLQUFTSCxPQUFiO0FBQUEsR0FBMUIsTUFBb0QsQ0FBQyxDQUQ3QjtBQUFBLENBQTFCOztBQUdBLFNBQVNJLG9CQUFULEdBQWdDO0FBQzlCO0FBQ0EsTUFBTUMsYUFBYSxnQkFBR0Msa0JBQU1DLElBQU4sQ0FBVyxnQkFBaUM7QUFBQSxRQUEvQkMsTUFBK0IsUUFBL0JBLE1BQStCO0FBQUEsUUFBdkJDLE1BQXVCLFFBQXZCQSxNQUF1QjtBQUFBLFFBQWZDLFNBQWUsUUFBZkEsU0FBZTtBQUNoRSxRQUFNQyxZQUFZLEdBQUcsd0JBQ25CLFVBQUFDLFNBQVMsRUFBSTtBQUNYLGFBQU9GLFNBQVMsQ0FBQ0UsU0FBUyxDQUFDQyxHQUFWLENBQWMsVUFBQVgsQ0FBQztBQUFBLGVBQUlBLENBQUMsQ0FBQ0MsRUFBTjtBQUFBLE9BQWYsQ0FBRCxDQUFoQjtBQUNELEtBSGtCLEVBSW5CLENBQUNPLFNBQUQsQ0FKbUIsQ0FBckI7QUFPQSxRQUFNWCxjQUFjLEdBQUcsb0JBQVE7QUFBQSxhQUFNVSxNQUFNLENBQUNELE1BQVAsQ0FBYyxVQUFBTixDQUFDO0FBQUE7O0FBQUEsa0NBQUlNLE1BQU0sQ0FBQ1IsT0FBWCxvREFBSSxnQkFBZ0JjLFFBQWhCLENBQXlCWixDQUFDLENBQUNDLEVBQTNCLENBQUo7QUFBQSxPQUFmLENBQU47QUFBQSxLQUFSLEVBQWtFLENBQ3ZGSyxNQUR1RixFQUV2RkMsTUFGdUYsQ0FBbEUsQ0FBdkI7QUFLQSxRQUFNTSxlQUFlLEdBQUcsb0JBQVEsWUFBTTtBQUNwQztBQUNBLGFBQU9OLE1BQU0sQ0FBQ0QsTUFBUCxDQUNMLFVBQUFkLEtBQUs7QUFBQSxlQUFJRCxXQUFXLENBQUNDLEtBQUQsQ0FBWCxJQUFzQkksaUJBQWlCLENBQUNDLGNBQUQsRUFBaUJMLEtBQUssQ0FBQ1MsRUFBdkIsQ0FBM0M7QUFBQSxPQURBLENBQVA7QUFHRCxLQUx1QixFQUtyQixDQUFDTSxNQUFELEVBQVNWLGNBQVQsQ0FMcUIsQ0FBeEI7QUFPQSx3QkFDRSwwREFDRSxnQ0FBQyw2QkFBRDtBQUFtQixNQUFBLE9BQU8sbUJBQVlTLE1BQU0sQ0FBQ0wsRUFBbkI7QUFBMUIsaUJBREYsZUFFRSxnQ0FBQyx3QkFBRDtBQUNFLE1BQUEsT0FBTyxFQUFFWSxlQURYO0FBRUUsTUFBQSxhQUFhLEVBQUVoQixjQUZqQjtBQUdFLE1BQUEsUUFBUSxFQUFFWSxZQUhaO0FBSUUsTUFBQSxVQUFVLEVBQUUsS0FKZDtBQUtFLE1BQUEsV0FBVyxFQUFFLElBTGY7QUFNRSxNQUFBLGNBQWMsRUFBRSx3QkFBQVQsQ0FBQztBQUFBLGVBQUlBLENBQUMsQ0FBQ0MsRUFBTjtBQUFBLE9BTm5CO0FBT0UsTUFBQSxhQUFhLEVBQUUsdUJBQUFELENBQUM7QUFBQSxlQUFJQSxDQUFDLENBQUNjLE1BQUYsQ0FBU0MsS0FBYjtBQUFBO0FBUGxCLE1BRkYsQ0FERjtBQWNELEdBbENxQixDQUF0Qjs7QUFvQ0FaLEVBQUFBLGFBQWEsQ0FBQ2EsV0FBZCxHQUE0QixlQUE1QjtBQUVBLFNBQU9iLGFBQVA7QUFDRDs7ZUFFY0Qsb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHt1c2VNZW1vLCB1c2VDYWxsYmFja30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtTdHlsZWRGaWx0ZXJQYW5lbH0gZnJvbSAnLi9jb21wb25lbnRzJztcbmltcG9ydCB7TEFZRVJfVFlQRVN9IGZyb20gJ2xheWVycy90eXBlcyc7XG5cbmNvbnN0IGxheWVyRmlsdGVyID0gbGF5ZXIgPT4gbGF5ZXIudHlwZSA9PT0gTEFZRVJfVFlQRVMucG9pbnQ7XG5jb25zdCBpc0FscmVhZHlTZWxlY3RlZCA9IChzZWxlY3RlZExheWVycywgbGF5ZXJJZCkgPT5cbiAgc2VsZWN0ZWRMYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gbGF5ZXJJZCkgPT09IC0xO1xuXG5mdW5jdGlvbiBQb2x5Z29uRmlsdGVyRmFjdG9yeSgpIHtcbiAgLyoqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3BvbHlnb24tZmlsdGVyJykuUG9seWdvbkZpbHRlcn0gKi9cbiAgY29uc3QgUG9seWdvbkZpbHRlciA9IFJlYWN0Lm1lbW8oKHtmaWx0ZXIsIGxheWVycywgc2V0TGF5ZXJzfSkgPT4ge1xuICAgIGNvbnN0IHNldE5ld0xheWVycyA9IHVzZUNhbGxiYWNrKFxuICAgICAgbmV3TGF5ZXJzID0+IHtcbiAgICAgICAgcmV0dXJuIHNldExheWVycyhuZXdMYXllcnMubWFwKGwgPT4gbC5pZCkpO1xuICAgICAgfSxcbiAgICAgIFtzZXRMYXllcnNdXG4gICAgKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkTGF5ZXJzID0gdXNlTWVtbygoKSA9PiBsYXllcnMuZmlsdGVyKGwgPT4gZmlsdGVyLmxheWVySWQ/LmluY2x1ZGVzKGwuaWQpKSwgW1xuICAgICAgZmlsdGVyLFxuICAgICAgbGF5ZXJzXG4gICAgXSk7XG5cbiAgICBjb25zdCBhdmFpbGFibGVMYXllcnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgIC8vIHJlbW92ZSBhbHJlYWR5IGFkZGVkIGxheWVycyBhbmQgZmlsdGVyIG91dCBub24gcG9pbnQgbGF5ZXJzXG4gICAgICByZXR1cm4gbGF5ZXJzLmZpbHRlcihcbiAgICAgICAgbGF5ZXIgPT4gbGF5ZXJGaWx0ZXIobGF5ZXIpICYmIGlzQWxyZWFkeVNlbGVjdGVkKHNlbGVjdGVkTGF5ZXJzLCBsYXllci5pZClcbiAgICAgICk7XG4gICAgfSwgW2xheWVycywgc2VsZWN0ZWRMYXllcnNdKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8U3R5bGVkRmlsdGVyUGFuZWwgaHRtbEZvcj17YGZpbHRlci0ke2ZpbHRlci5pZH1gfT5MYXllcnM6PC9TdHlsZWRGaWx0ZXJQYW5lbD5cbiAgICAgICAgPEl0ZW1TZWxlY3RvclxuICAgICAgICAgIG9wdGlvbnM9e2F2YWlsYWJsZUxheWVyc31cbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXtzZWxlY3RlZExheWVyc31cbiAgICAgICAgICBvbkNoYW5nZT17c2V0TmV3TGF5ZXJzfVxuICAgICAgICAgIHNlYXJjaGFibGU9e2ZhbHNlfVxuICAgICAgICAgIG11bHRpU2VsZWN0PXt0cnVlfVxuICAgICAgICAgIGdldE9wdGlvblZhbHVlPXtsID0+IGwuaWR9XG4gICAgICAgICAgZGlzcGxheU9wdGlvbj17bCA9PiBsLmNvbmZpZy5sYWJlbH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0pO1xuXG4gIFBvbHlnb25GaWx0ZXIuZGlzcGxheU5hbWUgPSAnUG9seWdvbkZpbHRlcic7XG5cbiAgcmV0dXJuIFBvbHlnb25GaWx0ZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvbHlnb25GaWx0ZXJGYWN0b3J5O1xuIl19