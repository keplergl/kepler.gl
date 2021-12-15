"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _localization = require("../../localization");

var _styledComponents = require("../common/styled-components");

var _icons = require("../common/icons");

var _sourceDataCatalog = _interopRequireDefault(require("./common/source-data-catalog"));

var _filterPanel = _interopRequireDefault(require("./filter-panel/filter-panel"));

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
FilterManagerFactory.deps = [_sourceDataCatalog["default"], _filterPanel["default"]];

function FilterManagerFactory(SourceDataCatalog, FilterPanel) {
  var FilterManager = function FilterManager(_ref) {
    var _ref$filters = _ref.filters,
        filters = _ref$filters === void 0 ? [] : _ref$filters,
        datasets = _ref.datasets,
        layers = _ref.layers,
        showDatasetTable = _ref.showDatasetTable,
        visStateActions = _ref.visStateActions;
    var addFilter = visStateActions.addFilter,
        _enlargeFilter = visStateActions.enlargeFilter,
        _removeFilter = visStateActions.removeFilter,
        setFilter = visStateActions.setFilter,
        _toggleAnimation = visStateActions.toggleAnimation,
        _toggleFilterFeature = visStateActions.toggleFilterFeature;
    var isAnyFilterAnimating = filters.some(function (f) {
      return f.isAnimating;
    });
    var hadEmptyFilter = filters.some(function (f) {
      return !f.name;
    });
    var hadDataset = Object.keys(datasets).length;
    var onClickAddFilter = (0, _react.useCallback)(function () {
      var defaultDataset = Object.keys(datasets).length && Object.keys(datasets)[0] || null;
      addFilter(defaultDataset);
    }, [datasets, addFilter]); // render last added filter first

    var reversedIndex = (0, _react.useMemo)(function () {
      return new Array(filters.length).fill(0).map(function (d, i) {
        return i;
      }).reverse();
    }, [filters.length]);
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "filter-manager"
    }, /*#__PURE__*/_react["default"].createElement(SourceDataCatalog, {
      datasets: datasets,
      showDatasetTable: showDatasetTable
    }), /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelDivider, null), /*#__PURE__*/_react["default"].createElement(_styledComponents.SidePanelSection, null, reversedIndex.map(function (idx) {
      return /*#__PURE__*/_react["default"].createElement(FilterPanel, {
        key: "".concat(filters[idx].id, "-").concat(idx),
        idx: idx,
        filters: filters,
        filter: filters[idx],
        datasets: datasets,
        layers: layers,
        isAnyFilterAnimating: isAnyFilterAnimating,
        removeFilter: function removeFilter() {
          return _removeFilter(idx);
        },
        enlargeFilter: function enlargeFilter() {
          return _enlargeFilter(idx);
        },
        toggleAnimation: function toggleAnimation() {
          return _toggleAnimation(idx);
        },
        toggleFilterFeature: function toggleFilterFeature() {
          return _toggleFilterFeature(idx);
        },
        setFilter: setFilter
      });
    })), /*#__PURE__*/_react["default"].createElement(_styledComponents.Button, {
      className: "add-filter-button",
      inactive: hadEmptyFilter || !hadDataset,
      width: "105px",
      onClick: onClickAddFilter
    }, /*#__PURE__*/_react["default"].createElement(_icons.Add, {
      height: "12px"
    }), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'filterManager.addFilter'
    })));
  };

  FilterManager.propTypes = {
    datasets: _propTypes["default"].object,
    layers: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    filters: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    showDatasetTable: _propTypes["default"].func.isRequired,
    visStateActions: _propTypes["default"].object.isRequired,
    // fields can be undefined when dataset is not selected
    fields: _propTypes["default"].arrayOf(_propTypes["default"].any)
  };
  return FilterManager;
}

var _default = FilterManagerFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiRmlsdGVyTWFuYWdlckZhY3RvcnkiLCJkZXBzIiwiU291cmNlRGF0YUNhdGFsb2dGYWN0b3J5IiwiRmlsdGVyUGFuZWxGYWN0b3J5IiwiU291cmNlRGF0YUNhdGFsb2ciLCJGaWx0ZXJQYW5lbCIsIkZpbHRlck1hbmFnZXIiLCJmaWx0ZXJzIiwiZGF0YXNldHMiLCJsYXllcnMiLCJzaG93RGF0YXNldFRhYmxlIiwidmlzU3RhdGVBY3Rpb25zIiwiYWRkRmlsdGVyIiwiZW5sYXJnZUZpbHRlciIsInJlbW92ZUZpbHRlciIsInNldEZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsInRvZ2dsZUZpbHRlckZlYXR1cmUiLCJpc0FueUZpbHRlckFuaW1hdGluZyIsInNvbWUiLCJmIiwiaXNBbmltYXRpbmciLCJoYWRFbXB0eUZpbHRlciIsIm5hbWUiLCJoYWREYXRhc2V0IiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsIm9uQ2xpY2tBZGRGaWx0ZXIiLCJkZWZhdWx0RGF0YXNldCIsInJldmVyc2VkSW5kZXgiLCJBcnJheSIsImZpbGwiLCJtYXAiLCJkIiwiaSIsInJldmVyc2UiLCJpZHgiLCJpZCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsImFycmF5T2YiLCJhbnkiLCJpc1JlcXVpcmVkIiwiZnVuYyIsImZpZWxkcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVUFBLG9CQUFvQixDQUFDQyxJQUFyQixHQUE0QixDQUFDQyw2QkFBRCxFQUEyQkMsdUJBQTNCLENBQTVCOztBQUVB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QkFBVUUsT0FBVixDQUFrQkYsc0JBQVVHLEdBQTVCO0FBUmdCLEdBQTFCO0FBV0EsU0FBT3JDLGFBQVA7QUFDRDs7ZUFFY04sb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHt1c2VDYWxsYmFjaywgdXNlTWVtb30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcbmltcG9ydCB7QnV0dG9uLCBTaWRlUGFuZWxEaXZpZGVyLCBTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0FkZH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IFNvdXJjZURhdGFDYXRhbG9nRmFjdG9yeSBmcm9tICcuL2NvbW1vbi9zb3VyY2UtZGF0YS1jYXRhbG9nJztcbmltcG9ydCBGaWx0ZXJQYW5lbEZhY3RvcnkgZnJvbSAnLi9maWx0ZXItcGFuZWwvZmlsdGVyLXBhbmVsJztcblxuRmlsdGVyTWFuYWdlckZhY3RvcnkuZGVwcyA9IFtTb3VyY2VEYXRhQ2F0YWxvZ0ZhY3RvcnksIEZpbHRlclBhbmVsRmFjdG9yeV07XG5cbmZ1bmN0aW9uIEZpbHRlck1hbmFnZXJGYWN0b3J5KFNvdXJjZURhdGFDYXRhbG9nLCBGaWx0ZXJQYW5lbCkge1xuICBjb25zdCBGaWx0ZXJNYW5hZ2VyID0gKHtmaWx0ZXJzID0gW10sIGRhdGFzZXRzLCBsYXllcnMsIHNob3dEYXRhc2V0VGFibGUsIHZpc1N0YXRlQWN0aW9uc30pID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBhZGRGaWx0ZXIsXG4gICAgICBlbmxhcmdlRmlsdGVyLFxuICAgICAgcmVtb3ZlRmlsdGVyLFxuICAgICAgc2V0RmlsdGVyLFxuICAgICAgdG9nZ2xlQW5pbWF0aW9uLFxuICAgICAgdG9nZ2xlRmlsdGVyRmVhdHVyZVxuICAgIH0gPSB2aXNTdGF0ZUFjdGlvbnM7XG4gICAgY29uc3QgaXNBbnlGaWx0ZXJBbmltYXRpbmcgPSBmaWx0ZXJzLnNvbWUoZiA9PiBmLmlzQW5pbWF0aW5nKTtcbiAgICBjb25zdCBoYWRFbXB0eUZpbHRlciA9IGZpbHRlcnMuc29tZShmID0+ICFmLm5hbWUpO1xuICAgIGNvbnN0IGhhZERhdGFzZXQgPSBPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoO1xuICAgIGNvbnN0IG9uQ2xpY2tBZGRGaWx0ZXIgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0RGF0YXNldCA9IChPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoICYmIE9iamVjdC5rZXlzKGRhdGFzZXRzKVswXSkgfHwgbnVsbDtcbiAgICAgIGFkZEZpbHRlcihkZWZhdWx0RGF0YXNldCk7XG4gICAgfSwgW2RhdGFzZXRzLCBhZGRGaWx0ZXJdKTtcbiAgICAvLyByZW5kZXIgbGFzdCBhZGRlZCBmaWx0ZXIgZmlyc3RcbiAgICBjb25zdCByZXZlcnNlZEluZGV4ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IEFycmF5KGZpbHRlcnMubGVuZ3RoKVxuICAgICAgICAuZmlsbCgwKVxuICAgICAgICAubWFwKChkLCBpKSA9PiBpKVxuICAgICAgICAucmV2ZXJzZSgpO1xuICAgIH0sIFtmaWx0ZXJzLmxlbmd0aF0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLW1hbmFnZXJcIj5cbiAgICAgICAgPFNvdXJjZURhdGFDYXRhbG9nIGRhdGFzZXRzPXtkYXRhc2V0c30gc2hvd0RhdGFzZXRUYWJsZT17c2hvd0RhdGFzZXRUYWJsZX0gLz5cbiAgICAgICAgPFNpZGVQYW5lbERpdmlkZXIgLz5cbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAge3JldmVyc2VkSW5kZXgubWFwKGlkeCA9PiAoXG4gICAgICAgICAgICA8RmlsdGVyUGFuZWxcbiAgICAgICAgICAgICAga2V5PXtgJHtmaWx0ZXJzW2lkeF0uaWR9LSR7aWR4fWB9XG4gICAgICAgICAgICAgIGlkeD17aWR4fVxuICAgICAgICAgICAgICBmaWx0ZXJzPXtmaWx0ZXJzfVxuICAgICAgICAgICAgICBmaWx0ZXI9e2ZpbHRlcnNbaWR4XX1cbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmc9e2lzQW55RmlsdGVyQW5pbWF0aW5nfVxuICAgICAgICAgICAgICByZW1vdmVGaWx0ZXI9eygpID0+IHJlbW92ZUZpbHRlcihpZHgpfVxuICAgICAgICAgICAgICBlbmxhcmdlRmlsdGVyPXsoKSA9PiBlbmxhcmdlRmlsdGVyKGlkeCl9XG4gICAgICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17KCkgPT4gdG9nZ2xlQW5pbWF0aW9uKGlkeCl9XG4gICAgICAgICAgICAgIHRvZ2dsZUZpbHRlckZlYXR1cmU9eygpID0+IHRvZ2dsZUZpbHRlckZlYXR1cmUoaWR4KX1cbiAgICAgICAgICAgICAgc2V0RmlsdGVyPXtzZXRGaWx0ZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJhZGQtZmlsdGVyLWJ1dHRvblwiXG4gICAgICAgICAgaW5hY3RpdmU9e2hhZEVtcHR5RmlsdGVyIHx8ICFoYWREYXRhc2V0fVxuICAgICAgICAgIHdpZHRoPVwiMTA1cHhcIlxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tBZGRGaWx0ZXJ9XG4gICAgICAgID5cbiAgICAgICAgICA8QWRkIGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZmlsdGVyTWFuYWdlci5hZGRGaWx0ZXInfSAvPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH07XG5cbiAgRmlsdGVyTWFuYWdlci5wcm9wVHlwZXMgPSB7XG4gICAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KS5pc1JlcXVpcmVkLFxuICAgIGZpbHRlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgc2hvd0RhdGFzZXRUYWJsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB2aXNTdGF0ZUFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIGZpZWxkcyBjYW4gYmUgdW5kZWZpbmVkIHdoZW4gZGF0YXNldCBpcyBub3Qgc2VsZWN0ZWRcbiAgICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpXG4gIH07XG5cbiAgcmV0dXJuIEZpbHRlck1hbmFnZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbHRlck1hbmFnZXJGYWN0b3J5O1xuIl19