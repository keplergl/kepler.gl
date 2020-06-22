"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reselect = require("reselect");

var _reactIntl = require("react-intl");

var _styledComponents = require("../common/styled-components");

var _icons = require("../common/icons");

var _sourceDataCatalog = _interopRequireDefault(require("./common/source-data-catalog"));

var _filterPanel = _interopRequireDefault(require("./filter-panel/filter-panel"));

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
FilterManagerFactory.deps = [_sourceDataCatalog["default"], _filterPanel["default"]];

function FilterManagerFactory(SourceDataCatalog, FilterPanel) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(FilterManager, _Component);

    function FilterManager() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, FilterManager);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(FilterManager)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "datasetsSelector", function (state) {
        return state.datasets;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "defaultDatasetSelector", (0, _reselect.createSelector)(_this.datasetsSelector, function (datasets) {
        return Object.keys(datasets).length && Object.keys(datasets)[0] || null;
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_addFilter", function () {
        var defaultDataset = _this.defaultDatasetSelector(_this.props);

        _this.props.addFilter(defaultDataset);
      });
      return _this;
    }

    (0, _createClass2["default"])(FilterManager, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            filters = _this$props.filters,
            datasets = _this$props.datasets,
            layers = _this$props.layers;
        var isAnyFilterAnimating = filters.some(function (f) {
          return f.isAnimating;
        });
        var hadEmptyFilter = filters.some(function (f) {
          return !f.name;
        });
        var hadDataset = Object.keys(datasets).length;
        return _react["default"].createElement("div", {
          className: "filter-manager"
        }, _react["default"].createElement(SourceDataCatalog, {
          datasets: datasets,
          showDatasetTable: this.props.showDatasetTable
        }), _react["default"].createElement(_styledComponents.SidePanelDivider, null), _react["default"].createElement(_styledComponents.SidePanelSection, null, filters && filters.map(function (filter, idx) {
          return _react["default"].createElement(FilterPanel, {
            key: "".concat(filter.id, "-").concat(idx),
            idx: idx,
            filters: filters,
            filter: filter,
            datasets: datasets,
            layers: layers,
            isAnyFilterAnimating: isAnyFilterAnimating,
            removeFilter: function removeFilter() {
              return _this2.props.removeFilter(idx);
            },
            enlargeFilter: function enlargeFilter() {
              return _this2.props.enlargeFilter(idx);
            },
            toggleAnimation: function toggleAnimation() {
              return _this2.props.toggleAnimation(idx);
            },
            toggleFilterFeature: function toggleFilterFeature() {
              return _this2.props.toggleFilterFeature(idx);
            },
            setFilter: _this2.props.setFilter
          });
        })), _react["default"].createElement(_styledComponents.Button, {
          className: "add-filter-button",
          inactive: hadEmptyFilter || !hadDataset,
          width: "105px",
          onClick: this._addFilter
        }, _react["default"].createElement(_icons.Add, {
          height: "12px"
        }), _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'filterManager.addFilter'
        })));
      }
    }]);
    return FilterManager;
  }(_react.Component), (0, _defineProperty2["default"])(_class, "propTypes", {
    datasets: _propTypes["default"].object,
    layers: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    addFilter: _propTypes["default"].func.isRequired,
    removeFilter: _propTypes["default"].func.isRequired,
    enlargeFilter: _propTypes["default"].func.isRequired,
    toggleAnimation: _propTypes["default"].func.isRequired,
    toggleFilterFeature: _propTypes["default"].func.isRequired,
    setFilter: _propTypes["default"].func.isRequired,
    filters: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    showDatasetTable: _propTypes["default"].func,
    // fields can be undefined when dataset is not selected
    fields: _propTypes["default"].arrayOf(_propTypes["default"].any)
  }), _temp;
}

var _default = FilterManagerFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiRmlsdGVyTWFuYWdlckZhY3RvcnkiLCJkZXBzIiwiU291cmNlRGF0YUNhdGFsb2dGYWN0b3J5IiwiRmlsdGVyUGFuZWxGYWN0b3J5IiwiU291cmNlRGF0YUNhdGFsb2ciLCJGaWx0ZXJQYW5lbCIsInN0YXRlIiwiZGF0YXNldHMiLCJkYXRhc2V0c1NlbGVjdG9yIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImRlZmF1bHREYXRhc2V0IiwiZGVmYXVsdERhdGFzZXRTZWxlY3RvciIsInByb3BzIiwiYWRkRmlsdGVyIiwiZmlsdGVycyIsImxheWVycyIsImlzQW55RmlsdGVyQW5pbWF0aW5nIiwic29tZSIsImYiLCJpc0FuaW1hdGluZyIsImhhZEVtcHR5RmlsdGVyIiwibmFtZSIsImhhZERhdGFzZXQiLCJzaG93RGF0YXNldFRhYmxlIiwibWFwIiwiZmlsdGVyIiwiaWR4IiwiaWQiLCJyZW1vdmVGaWx0ZXIiLCJlbmxhcmdlRmlsdGVyIiwidG9nZ2xlQW5pbWF0aW9uIiwidG9nZ2xlRmlsdGVyRmVhdHVyZSIsInNldEZpbHRlciIsIl9hZGRGaWx0ZXIiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJhcnJheU9mIiwiYW55IiwiaXNSZXF1aXJlZCIsImZ1bmMiLCJmaWVsZHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBV0FBLG9CQUFvQixDQUFDQyxJQUFyQixHQUE0QixDQUFDQyw2QkFBRCxFQUEyQkMsdUJBQTNCLENBQTVCOztBQUVB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dGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ3JlYWN0LWludGwnO1xuaW1wb3J0IHtCdXR0b24sIFNpZGVQYW5lbERpdmlkZXIsIFNpZGVQYW5lbFNlY3Rpb259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7QWRkfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgU291cmNlRGF0YUNhdGFsb2dGYWN0b3J5IGZyb20gJy4vY29tbW9uL3NvdXJjZS1kYXRhLWNhdGFsb2cnO1xuaW1wb3J0IEZpbHRlclBhbmVsRmFjdG9yeSBmcm9tICcuL2ZpbHRlci1wYW5lbC9maWx0ZXItcGFuZWwnO1xuXG5GaWx0ZXJNYW5hZ2VyRmFjdG9yeS5kZXBzID0gW1NvdXJjZURhdGFDYXRhbG9nRmFjdG9yeSwgRmlsdGVyUGFuZWxGYWN0b3J5XTtcblxuZnVuY3Rpb24gRmlsdGVyTWFuYWdlckZhY3RvcnkoU291cmNlRGF0YUNhdGFsb2csIEZpbHRlclBhbmVsKSB7XG4gIHJldHVybiBjbGFzcyBGaWx0ZXJNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICBsYXllcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgICBhZGRGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICByZW1vdmVGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBlbmxhcmdlRmlsdGVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgdG9nZ2xlQW5pbWF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgdG9nZ2xlRmlsdGVyRmVhdHVyZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIHNldEZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGZpbHRlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgICBzaG93RGF0YXNldFRhYmxlOiBQcm9wVHlwZXMuZnVuYyxcblxuICAgICAgLy8gZmllbGRzIGNhbiBiZSB1bmRlZmluZWQgd2hlbiBkYXRhc2V0IGlzIG5vdCBzZWxlY3RlZFxuICAgICAgZmllbGRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KVxuICAgIH07XG5cbiAgICAvKiBzZWxlY3RvcnMgKi9cbiAgICBkYXRhc2V0c1NlbGVjdG9yID0gc3RhdGUgPT4gc3RhdGUuZGF0YXNldHM7XG4gICAgZGVmYXVsdERhdGFzZXRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5kYXRhc2V0c1NlbGVjdG9yLFxuICAgICAgZGF0YXNldHMgPT4gKE9iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGggJiYgT2JqZWN0LmtleXMoZGF0YXNldHMpWzBdKSB8fCBudWxsXG4gICAgKTtcblxuICAgIC8qIGFjdGlvbnMgKi9cbiAgICBfYWRkRmlsdGVyID0gKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdERhdGFzZXQgPSB0aGlzLmRlZmF1bHREYXRhc2V0U2VsZWN0b3IodGhpcy5wcm9wcyk7XG4gICAgICB0aGlzLnByb3BzLmFkZEZpbHRlcihkZWZhdWx0RGF0YXNldCk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtmaWx0ZXJzLCBkYXRhc2V0cywgbGF5ZXJzfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBpc0FueUZpbHRlckFuaW1hdGluZyA9IGZpbHRlcnMuc29tZShmID0+IGYuaXNBbmltYXRpbmcpO1xuICAgICAgY29uc3QgaGFkRW1wdHlGaWx0ZXIgPSBmaWx0ZXJzLnNvbWUoZiA9PiAhZi5uYW1lKTtcbiAgICAgIGNvbnN0IGhhZERhdGFzZXQgPSBPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1tYW5hZ2VyXCI+XG4gICAgICAgICAgPFNvdXJjZURhdGFDYXRhbG9nIGRhdGFzZXRzPXtkYXRhc2V0c30gc2hvd0RhdGFzZXRUYWJsZT17dGhpcy5wcm9wcy5zaG93RGF0YXNldFRhYmxlfSAvPlxuICAgICAgICAgIDxTaWRlUGFuZWxEaXZpZGVyIC8+XG4gICAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgICB7ZmlsdGVycyAmJlxuICAgICAgICAgICAgICBmaWx0ZXJzLm1hcCgoZmlsdGVyLCBpZHgpID0+IChcbiAgICAgICAgICAgICAgICA8RmlsdGVyUGFuZWxcbiAgICAgICAgICAgICAgICAgIGtleT17YCR7ZmlsdGVyLmlkfS0ke2lkeH1gfVxuICAgICAgICAgICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJzPXtmaWx0ZXJzfVxuICAgICAgICAgICAgICAgICAgZmlsdGVyPXtmaWx0ZXJ9XG4gICAgICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgICAgIGlzQW55RmlsdGVyQW5pbWF0aW5nPXtpc0FueUZpbHRlckFuaW1hdGluZ31cbiAgICAgICAgICAgICAgICAgIHJlbW92ZUZpbHRlcj17KCkgPT4gdGhpcy5wcm9wcy5yZW1vdmVGaWx0ZXIoaWR4KX1cbiAgICAgICAgICAgICAgICAgIGVubGFyZ2VGaWx0ZXI9eygpID0+IHRoaXMucHJvcHMuZW5sYXJnZUZpbHRlcihpZHgpfVxuICAgICAgICAgICAgICAgICAgdG9nZ2xlQW5pbWF0aW9uPXsoKSA9PiB0aGlzLnByb3BzLnRvZ2dsZUFuaW1hdGlvbihpZHgpfVxuICAgICAgICAgICAgICAgICAgdG9nZ2xlRmlsdGVyRmVhdHVyZT17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVGaWx0ZXJGZWF0dXJlKGlkeCl9XG4gICAgICAgICAgICAgICAgICBzZXRGaWx0ZXI9e3RoaXMucHJvcHMuc2V0RmlsdGVyfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJhZGQtZmlsdGVyLWJ1dHRvblwiXG4gICAgICAgICAgICBpbmFjdGl2ZT17aGFkRW1wdHlGaWx0ZXIgfHwgIWhhZERhdGFzZXR9XG4gICAgICAgICAgICB3aWR0aD1cIjEwNXB4XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX2FkZEZpbHRlcn1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QWRkIGhlaWdodD1cIjEycHhcIiAvPlxuICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydmaWx0ZXJNYW5hZ2VyLmFkZEZpbHRlcid9IC8+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbHRlck1hbmFnZXJGYWN0b3J5O1xuIl19