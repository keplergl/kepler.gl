"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reselect = require("reselect");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _lodash = _interopRequireDefault(require("lodash.get"));

var _defaultSettings = require("../../../constants/default-settings");

var _filterPanelHeader = _interopRequireDefault(require("./filter-panel-header"));

var _newFilterPanel = _interopRequireDefault(require("../../filters/filter-panels/new-filter-panel"));

var _timeRangeFilterPanel = _interopRequireDefault(require("../../filters/filter-panels/time-range-filter-panel"));

var _singleSelectFilterPanel = _interopRequireDefault(require("../../filters/filter-panels/single-select-filter-panel"));

var _multiSelectFilterPanel = _interopRequireDefault(require("../../filters/filter-panels/multi-select-filter-panel"));

var _rangeFilterPanel = _interopRequireDefault(require("../../filters/filter-panels/range-filter-panel"));

var _polygonFilterPanel = _interopRequireDefault(require("../../filters/filter-panels/polygon-filter-panel"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 12px;\n  border-radius: 1px;\n\n  .filter-panel__filter {\n    margin-top: 24px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledFilterPanel = _styledComponents["default"].div(_templateObject());

FilterPanelFactory.deps = [_filterPanelHeader["default"], _newFilterPanel["default"], _timeRangeFilterPanel["default"], _singleSelectFilterPanel["default"], _multiSelectFilterPanel["default"], _rangeFilterPanel["default"], _polygonFilterPanel["default"]];

function FilterPanelFactory(FilterPanelHeader, NewFilterPanel, TimeRangeFilterPanel, SingleSelectFilterPanel, MultiSelectFilterPanel, RangeFilterPanel, PolygonFilterPanel) {
  var _FilterPanelComponent, _class, _temp;

  var FilterPanelComponents = (_FilterPanelComponent = {
    "default": NewFilterPanel
  }, (0, _defineProperty2["default"])(_FilterPanelComponent, _defaultSettings.FILTER_TYPES.timeRange, TimeRangeFilterPanel), (0, _defineProperty2["default"])(_FilterPanelComponent, _defaultSettings.FILTER_TYPES.select, SingleSelectFilterPanel), (0, _defineProperty2["default"])(_FilterPanelComponent, _defaultSettings.FILTER_TYPES.multiSelect, MultiSelectFilterPanel), (0, _defineProperty2["default"])(_FilterPanelComponent, _defaultSettings.FILTER_TYPES.range, RangeFilterPanel), (0, _defineProperty2["default"])(_FilterPanelComponent, _defaultSettings.FILTER_TYPES.polygon, PolygonFilterPanel), _FilterPanelComponent);
  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(FilterPanel, _Component);

    function FilterPanel() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, FilterPanel);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(FilterPanel)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "fieldsSelector", function (props) {
        var datasetId = props.filter.dataId[0];

        if (!datasetId) {
          return [];
        }

        return (0, _lodash["default"])(props, ['datasets', datasetId, 'fields'], []);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filterSelector", function (props) {
        return props.filters;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "nameSelector", function (props) {
        return props.filter.name;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "dataIdSelector", function (props) {
        return props.filter.dataId[0];
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "availableFieldsSelector", (0, _reselect.createSelector)(_this.fieldsSelector, _this.filterSelector, _this.nameSelector, _this.dataIdSelector, function (fields, filters, name, dataId) {
        return fields.filter(function (f) {
          return f.type && f.type !== _defaultSettings.ALL_FIELD_TYPES.geojson && (f.name === name || !filters.find(function (d) {
            return d.name === f.name && d.dataId === dataId;
          }));
        });
      }));
      return _this;
    }

    (0, _createClass2["default"])(FilterPanel, [{
      key: "render",
      value: function render() {
        var filter = this.props.filter;
        var type = filter.type;
        var FilterFilterComponent = type && FilterPanelComponents[type] || FilterPanelComponents["default"];
        var allAvailableFields = this.availableFieldsSelector(this.props);
        return _react["default"].createElement(StyledFilterPanel, {
          className: "filter-panel"
        }, _react["default"].createElement(FilterFilterComponent, (0, _extends2["default"])({
          allAvailableFields: allAvailableFields
        }, this.props)));
      }
    }]);
    return FilterPanel;
  }(_react.Component), (0, _defineProperty2["default"])(_class, "propTypes", {
    idx: _propTypes["default"].number,
    filters: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    filter: _propTypes["default"].object.isRequired,
    setFilter: _propTypes["default"].func.isRequired,
    removeFilter: _propTypes["default"].func.isRequired,
    enlargeFilter: _propTypes["default"].func.isRequired,
    toggleAnimation: _propTypes["default"].func.isRequired,
    toggleFilterFeature: _propTypes["default"].func.isRequired,
    datasets: _propTypes["default"].object,
    showDatasetTable: _propTypes["default"].func,
    isAnyFilterAnimating: _propTypes["default"].bool
  }), _temp;
}

var _default = FilterPanelFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLXBhbmVsL2ZpbHRlci1wYW5lbC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRGaWx0ZXJQYW5lbCIsInN0eWxlZCIsImRpdiIsIkZpbHRlclBhbmVsRmFjdG9yeSIsImRlcHMiLCJGaWx0ZXJQYW5lbEhlYWRlckZhY3RvcnkiLCJOZXdGaWx0ZXJQYW5lbEZhY3RvcnkiLCJUaW1lUmFuZ2VGaWx0ZXJQYW5lbEZhY3RvcnkiLCJTaW5nbGVTZWxlY3RGaWx0ZXJQYW5lbEZhY3RvcnkiLCJNdWx0aVNlbGVjdEZpbHRlclBhbmVsRmFjdG9yeSIsIlJhbmdlRmlsdGVyUGFuZWxGYWN0b3J5IiwiUG9seWdvbkZpbHRlclBhbmVsRmFjdG9yeSIsIkZpbHRlclBhbmVsSGVhZGVyIiwiTmV3RmlsdGVyUGFuZWwiLCJUaW1lUmFuZ2VGaWx0ZXJQYW5lbCIsIlNpbmdsZVNlbGVjdEZpbHRlclBhbmVsIiwiTXVsdGlTZWxlY3RGaWx0ZXJQYW5lbCIsIlJhbmdlRmlsdGVyUGFuZWwiLCJQb2x5Z29uRmlsdGVyUGFuZWwiLCJGaWx0ZXJQYW5lbENvbXBvbmVudHMiLCJGSUxURVJfVFlQRVMiLCJ0aW1lUmFuZ2UiLCJzZWxlY3QiLCJtdWx0aVNlbGVjdCIsInJhbmdlIiwicG9seWdvbiIsInByb3BzIiwiZGF0YXNldElkIiwiZmlsdGVyIiwiZGF0YUlkIiwiZmlsdGVycyIsIm5hbWUiLCJmaWVsZHNTZWxlY3RvciIsImZpbHRlclNlbGVjdG9yIiwibmFtZVNlbGVjdG9yIiwiZGF0YUlkU2VsZWN0b3IiLCJmaWVsZHMiLCJmIiwidHlwZSIsIkFMTF9GSUVMRF9UWVBFUyIsImdlb2pzb24iLCJmaW5kIiwiZCIsIkZpbHRlckZpbHRlckNvbXBvbmVudCIsImFsbEF2YWlsYWJsZUZpZWxkcyIsImF2YWlsYWJsZUZpZWxkc1NlbGVjdG9yIiwiQ29tcG9uZW50IiwiaWR4IiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiYXJyYXlPZiIsImFueSIsImlzUmVxdWlyZWQiLCJvYmplY3QiLCJzZXRGaWx0ZXIiLCJmdW5jIiwicmVtb3ZlRmlsdGVyIiwiZW5sYXJnZUZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsInRvZ2dsZUZpbHRlckZlYXR1cmUiLCJkYXRhc2V0cyIsInNob3dEYXRhc2V0VGFibGUiLCJpc0FueUZpbHRlckFuaW1hdGluZyIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxpQkFBaUIsR0FBR0MsNkJBQU9DLEdBQVYsbUJBQXZCOztBQVNBQyxrQkFBa0IsQ0FBQ0MsSUFBbkIsR0FBMEIsQ0FDeEJDLDZCQUR3QixFQUV4QkMsMEJBRndCLEVBR3hCQyxnQ0FId0IsRUFJeEJDLG1DQUp3QixFQUt4QkMsa0NBTHdCLEVBTXhCQyw0QkFOd0IsRUFPeEJDLDhCQVB3QixDQUExQjs7QUFVQSxTQUFTUixrQkFBVCxDQUNFUyxpQkFERixFQUVFQyxjQUZGLEVBR0VDLG9CQUhGLEVBSUVDLHVCQUpGLEVBS0VDLHNCQUxGLEVBTUVDLGdCQU5GLEVBT0VDLGtCQVBGLEVBUUU7QUFBQTs7QUFDQSxNQUFNQyxxQkFBcUI7QUFDekIsZUFBU047QUFEZ0IsNkRBRXhCTyw4QkFBYUMsU0FGVyxFQUVDUCxvQkFGRCwyREFHeEJNLDhCQUFhRSxNQUhXLEVBR0ZQLHVCQUhFLDJEQUl4QkssOEJBQWFHLFdBSlcsRUFJR1Asc0JBSkgsMkRBS3hCSSw4QkFBYUksS0FMVyxFQUtIUCxnQkFMRywyREFNeEJHLDhCQUFhSyxPQU5XLEVBTURQLGtCQU5DLHlCQUEzQjtBQVNBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEseUdBZ0JtQixVQUFBUSxLQUFL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QkFBVU8sSUFWWDtBQVdqQk8sSUFBQUEsb0JBQW9CLEVBQUVkLHNCQUFVZTtBQVhmLEdBRHJCO0FBMEREOztlQUVjNUQsa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCc7XG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFUywgRklMVEVSX1RZUEVTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmltcG9ydCBGaWx0ZXJQYW5lbEhlYWRlckZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2ZpbHRlci1wYW5lbC9maWx0ZXItcGFuZWwtaGVhZGVyJztcbmltcG9ydCBOZXdGaWx0ZXJQYW5lbEZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9maWx0ZXJzL2ZpbHRlci1wYW5lbHMvbmV3LWZpbHRlci1wYW5lbCc7XG5pbXBvcnQgVGltZVJhbmdlRmlsdGVyUGFuZWxGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvZmlsdGVycy9maWx0ZXItcGFuZWxzL3RpbWUtcmFuZ2UtZmlsdGVyLXBhbmVsJztcbmltcG9ydCBTaW5nbGVTZWxlY3RGaWx0ZXJQYW5lbEZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9maWx0ZXJzL2ZpbHRlci1wYW5lbHMvc2luZ2xlLXNlbGVjdC1maWx0ZXItcGFuZWwnO1xuaW1wb3J0IE11bHRpU2VsZWN0RmlsdGVyUGFuZWxGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvZmlsdGVycy9maWx0ZXItcGFuZWxzL211bHRpLXNlbGVjdC1maWx0ZXItcGFuZWwnO1xuaW1wb3J0IFJhbmdlRmlsdGVyUGFuZWxGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvZmlsdGVycy9maWx0ZXItcGFuZWxzL3JhbmdlLWZpbHRlci1wYW5lbCc7XG5pbXBvcnQgUG9seWdvbkZpbHRlclBhbmVsRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL2ZpbHRlcnMvZmlsdGVyLXBhbmVscy9wb2x5Z29uLWZpbHRlci1wYW5lbCc7XG5cbmNvbnN0IFN0eWxlZEZpbHRlclBhbmVsID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgYm9yZGVyLXJhZGl1czogMXB4O1xuXG4gIC5maWx0ZXItcGFuZWxfX2ZpbHRlciB7XG4gICAgbWFyZ2luLXRvcDogMjRweDtcbiAgfVxuYDtcblxuRmlsdGVyUGFuZWxGYWN0b3J5LmRlcHMgPSBbXG4gIEZpbHRlclBhbmVsSGVhZGVyRmFjdG9yeSxcbiAgTmV3RmlsdGVyUGFuZWxGYWN0b3J5LFxuICBUaW1lUmFuZ2VGaWx0ZXJQYW5lbEZhY3RvcnksXG4gIFNpbmdsZVNlbGVjdEZpbHRlclBhbmVsRmFjdG9yeSxcbiAgTXVsdGlTZWxlY3RGaWx0ZXJQYW5lbEZhY3RvcnksXG4gIFJhbmdlRmlsdGVyUGFuZWxGYWN0b3J5LFxuICBQb2x5Z29uRmlsdGVyUGFuZWxGYWN0b3J5XG5dO1xuXG5mdW5jdGlvbiBGaWx0ZXJQYW5lbEZhY3RvcnkoXG4gIEZpbHRlclBhbmVsSGVhZGVyLFxuICBOZXdGaWx0ZXJQYW5lbCxcbiAgVGltZVJhbmdlRmlsdGVyUGFuZWwsXG4gIFNpbmdsZVNlbGVjdEZpbHRlclBhbmVsLFxuICBNdWx0aVNlbGVjdEZpbHRlclBhbmVsLFxuICBSYW5nZUZpbHRlclBhbmVsLFxuICBQb2x5Z29uRmlsdGVyUGFuZWxcbikge1xuICBjb25zdCBGaWx0ZXJQYW5lbENvbXBvbmVudHMgPSB7XG4gICAgZGVmYXVsdDogTmV3RmlsdGVyUGFuZWwsXG4gICAgW0ZJTFRFUl9UWVBFUy50aW1lUmFuZ2VdOiBUaW1lUmFuZ2VGaWx0ZXJQYW5lbCxcbiAgICBbRklMVEVSX1RZUEVTLnNlbGVjdF06IFNpbmdsZVNlbGVjdEZpbHRlclBhbmVsLFxuICAgIFtGSUxURVJfVFlQRVMubXVsdGlTZWxlY3RdOiBNdWx0aVNlbGVjdEZpbHRlclBhbmVsLFxuICAgIFtGSUxURVJfVFlQRVMucmFuZ2VdOiBSYW5nZUZpbHRlclBhbmVsLFxuICAgIFtGSUxURVJfVFlQRVMucG9seWdvbl06IFBvbHlnb25GaWx0ZXJQYW5lbFxuICB9O1xuXG4gIHJldHVybiBjbGFzcyBGaWx0ZXJQYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGlkeDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIGZpbHRlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgICBmaWx0ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIHNldEZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIHJlbW92ZUZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGVubGFyZ2VGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB0b2dnbGVBbmltYXRpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB0b2dnbGVGaWx0ZXJGZWF0dXJlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICBzaG93RGF0YXNldFRhYmxlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIGlzQW55RmlsdGVyQW5pbWF0aW5nOiBQcm9wVHlwZXMuYm9vbFxuICAgIH07XG5cbiAgICAvKiBzZWxlY3RvcnMgKi9cbiAgICBmaWVsZHNTZWxlY3RvciA9IHByb3BzID0+IHtcbiAgICAgIGNvbnN0IGRhdGFzZXRJZCA9IHByb3BzLmZpbHRlci5kYXRhSWRbMF07XG4gICAgICBpZiAoIWRhdGFzZXRJZCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0KHByb3BzLCBbJ2RhdGFzZXRzJywgZGF0YXNldElkLCAnZmllbGRzJ10sIFtdKTtcbiAgICB9O1xuXG4gICAgZmlsdGVyU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWx0ZXJzO1xuICAgIG5hbWVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlci5uYW1lO1xuICAgIGRhdGFJZFNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmlsdGVyLmRhdGFJZFswXTtcblxuICAgIC8vIG9ubHkgc2hvdyBjdXJyZW50IGZpZWxkIGFuZCBmaWVsZCB0aGF0J3Mgbm90IGFscmVhZHkgYmVlbiB1c2VkIGFzIGEgZmlsdGVyXG4gICAgYXZhaWxhYmxlRmllbGRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICAgIHRoaXMuZmllbGRzU2VsZWN0b3IsXG4gICAgICB0aGlzLmZpbHRlclNlbGVjdG9yLFxuICAgICAgdGhpcy5uYW1lU2VsZWN0b3IsXG4gICAgICB0aGlzLmRhdGFJZFNlbGVjdG9yLFxuICAgICAgKGZpZWxkcywgZmlsdGVycywgbmFtZSwgZGF0YUlkKSA9PlxuICAgICAgICBmaWVsZHMuZmlsdGVyKFxuICAgICAgICAgIGYgPT5cbiAgICAgICAgICAgIGYudHlwZSAmJlxuICAgICAgICAgICAgZi50eXBlICE9PSBBTExfRklFTERfVFlQRVMuZ2VvanNvbiAmJlxuICAgICAgICAgICAgKGYubmFtZSA9PT0gbmFtZSB8fCAhZmlsdGVycy5maW5kKGQgPT4gZC5uYW1lID09PSBmLm5hbWUgJiYgZC5kYXRhSWQgPT09IGRhdGFJZCkpXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge2ZpbHRlcn0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCB7dHlwZX0gPSBmaWx0ZXI7XG4gICAgICBjb25zdCBGaWx0ZXJGaWx0ZXJDb21wb25lbnQgPVxuICAgICAgICAodHlwZSAmJiBGaWx0ZXJQYW5lbENvbXBvbmVudHNbdHlwZV0pIHx8IEZpbHRlclBhbmVsQ29tcG9uZW50cy5kZWZhdWx0O1xuICAgICAgY29uc3QgYWxsQXZhaWxhYmxlRmllbGRzID0gdGhpcy5hdmFpbGFibGVGaWVsZHNTZWxlY3Rvcih0aGlzLnByb3BzKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZEZpbHRlclBhbmVsIGNsYXNzTmFtZT1cImZpbHRlci1wYW5lbFwiPlxuICAgICAgICAgIDxGaWx0ZXJGaWx0ZXJDb21wb25lbnQgYWxsQXZhaWxhYmxlRmllbGRzPXthbGxBdmFpbGFibGVGaWVsZHN9IHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICA8L1N0eWxlZEZpbHRlclBhbmVsPlxuICAgICAgKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbHRlclBhbmVsRmFjdG9yeTtcbiJdfQ==