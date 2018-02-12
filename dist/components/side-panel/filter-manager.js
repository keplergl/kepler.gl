'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reselect = require('reselect');

var _styledComponents = require('../common/styled-components');

var _icons = require('../common/icons');

var _sourceDataCatalog = require('./source-data-catalog');

var _sourceDataCatalog2 = _interopRequireDefault(_sourceDataCatalog);

var _filterPanel = require('./filter-panel/filter-panel');

var _filterPanel2 = _interopRequireDefault(_filterPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  datasets: _propTypes2.default.array,
  addFilter: _propTypes2.default.func.isRequired,
  removeFilter: _propTypes2.default.func.isRequired,
  enlargeFilter: _propTypes2.default.func.isRequired,
  toggleAnimation: _propTypes2.default.func.isRequired,
  setFilter: _propTypes2.default.func.isRequired,
  filters: _propTypes2.default.array.isRequired,
  showDatasetTable: _propTypes2.default.func,

  // fields can be undefined when dataset is not selected
  fields: _propTypes2.default.array
};

var FilterManager = function (_Component) {
  (0, _inherits3.default)(FilterManager, _Component);

  function FilterManager() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FilterManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = FilterManager.__proto__ || Object.getPrototypeOf(FilterManager)).call.apply(_ref, [this].concat(args))), _this), _this.datasetsSelector = function (state) {
      return state.datasets;
    }, _this.defaultDatasetSelector = (0, _reselect.createSelector)(_this.datasetsSelector, function (datasets) {
      return Object.keys(datasets).length && Object.keys(datasets)[0] || null;
    }), _this._addFilter = function () {
      var defaultDataset = _this.defaultDatasetSelector(_this.props);
      _this.props.addFilter(defaultDataset);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }
  /* selectors */


  /* actions */


  (0, _createClass3.default)(FilterManager, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          filters = _props.filters,
          datasets = _props.datasets;

      var isAnyFilterAnimating = filters.some(function (f) {
        return f.isAnimating;
      });
      var hadEmptyFilter = filters.some(function (f) {
        return !f.name;
      });
      var hadDataset = Object.keys(datasets).length;

      return _react2.default.createElement(
        'div',
        { className: 'filter-manager' },
        _react2.default.createElement(_sourceDataCatalog2.default, {
          datasets: datasets,
          showDatasetTable: this.props.showDatasetTable
        }),
        _react2.default.createElement(_styledComponents.SidePanelDivider, null),
        _react2.default.createElement(
          _styledComponents.SidePanelSection,
          null,
          filters && filters.map(function (filter, idx) {
            return _react2.default.createElement(_filterPanel2.default, {
              key: filter.id + '-' + idx,
              idx: idx,
              filters: filters,
              filter: filter,
              datasets: datasets,
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
              setFilter: _this2.props.setFilter
            });
          })
        ),
        _react2.default.createElement(
          _styledComponents.Button,
          {
            inactive: hadEmptyFilter || !hadDataset,
            width: '105px',
            onClick: this._addFilter
          },
          _react2.default.createElement(_icons.Add, { height: '12px' }),
          'Add Filter'
        )
      );
    }
  }]);
  return FilterManager;
}(_react.Component);

exports.default = FilterManager;


FilterManager.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLW1hbmFnZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZGF0YXNldHMiLCJhcnJheSIsImFkZEZpbHRlciIsImZ1bmMiLCJpc1JlcXVpcmVkIiwicmVtb3ZlRmlsdGVyIiwiZW5sYXJnZUZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsInNldEZpbHRlciIsImZpbHRlcnMiLCJzaG93RGF0YXNldFRhYmxlIiwiZmllbGRzIiwiRmlsdGVyTWFuYWdlciIsImRhdGFzZXRzU2VsZWN0b3IiLCJzdGF0ZSIsImRlZmF1bHREYXRhc2V0U2VsZWN0b3IiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiX2FkZEZpbHRlciIsImRlZmF1bHREYXRhc2V0IiwicHJvcHMiLCJpc0FueUZpbHRlckFuaW1hdGluZyIsInNvbWUiLCJmIiwiaXNBbmltYXRpbmciLCJoYWRFbXB0eUZpbHRlciIsIm5hbWUiLCJoYWREYXRhc2V0IiwibWFwIiwiZmlsdGVyIiwiaWR4IiwiaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUtBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFlBQVUsb0JBQVVDLEtBREo7QUFFaEJDLGFBQVcsb0JBQVVDLElBQVYsQ0FBZUMsVUFGVjtBQUdoQkMsZ0JBQWMsb0JBQVVGLElBQVYsQ0FBZUMsVUFIYjtBQUloQkUsaUJBQWUsb0JBQVVILElBQVYsQ0FBZUMsVUFKZDtBQUtoQkcsbUJBQWlCLG9CQUFVSixJQUFWLENBQWVDLFVBTGhCO0FBTWhCSSxhQUFXLG9CQUFVTCxJQUFWLENBQWVDLFVBTlY7QUFPaEJLLFdBQVMsb0JBQVVSLEtBQVYsQ0FBZ0JHLFVBUFQ7QUFRaEJNLG9CQUFrQixvQkFBVVAsSUFSWjs7QUFVaEI7QUFDQVEsVUFBUSxvQkFBVVY7QUFYRixDQUFsQjs7SUFjcUJXLGE7Ozs7Ozs7Ozs7Ozs7O2tOQUVuQkMsZ0IsR0FBbUI7QUFBQSxhQUFTQyxNQUFNZCxRQUFmO0FBQUEsSyxRQUNuQmUsc0IsR0FBeUIsOEJBQ3ZCLE1BQUtGLGdCQURrQixFQUV2QjtBQUFBLGFBQ0dHLE9BQU9DLElBQVAsQ0FBWWpCLFFBQVosRUFBc0JrQixNQUF0QixJQUFnQ0YsT0FBT0MsSUFBUCxDQUFZakIsUUFBWixFQUFzQixDQUF0QixDQUFqQyxJQUE4RCxJQURoRTtBQUFBLEtBRnVCLEMsUUFPekJtQixVLEdBQWEsWUFBTTtBQUNqQixVQUFNQyxpQkFBaUIsTUFBS0wsc0JBQUwsQ0FBNEIsTUFBS00sS0FBakMsQ0FBdkI7QUFDQSxZQUFLQSxLQUFMLENBQVduQixTQUFYLENBQXFCa0IsY0FBckI7QUFDRCxLOztBQVpEOzs7QUFRQTs7Ozs7NkJBTVM7QUFBQTs7QUFBQSxtQkFDcUIsS0FBS0MsS0FEMUI7QUFBQSxVQUNBWixPQURBLFVBQ0FBLE9BREE7QUFBQSxVQUNTVCxRQURULFVBQ1NBLFFBRFQ7O0FBRVAsVUFBTXNCLHVCQUF1QmIsUUFBUWMsSUFBUixDQUFhO0FBQUEsZUFBS0MsRUFBRUMsV0FBUDtBQUFBLE9BQWIsQ0FBN0I7QUFDQSxVQUFNQyxpQkFBaUJqQixRQUFRYyxJQUFSLENBQWE7QUFBQSxlQUFLLENBQUNDLEVBQUVHLElBQVI7QUFBQSxPQUFiLENBQXZCO0FBQ0EsVUFBTUMsYUFBYVosT0FBT0MsSUFBUCxDQUFZakIsUUFBWixFQUFzQmtCLE1BQXpDOztBQUVBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxnQkFBZjtBQUNFO0FBQ0Usb0JBQVVsQixRQURaO0FBRUUsNEJBQWtCLEtBQUtxQixLQUFMLENBQVdYO0FBRi9CLFVBREY7QUFLRSwrRUFMRjtBQU1FO0FBQUE7QUFBQTtBQUNHRCxxQkFDQ0EsUUFBUW9CLEdBQVIsQ0FBWSxVQUFDQyxNQUFELEVBQVNDLEdBQVQ7QUFBQSxtQkFDVjtBQUNFLG1CQUFRRCxPQUFPRSxFQUFmLFNBQXFCRCxHQUR2QjtBQUVFLG1CQUFLQSxHQUZQO0FBR0UsdUJBQVN0QixPQUhYO0FBSUUsc0JBQVFxQixNQUpWO0FBS0Usd0JBQVU5QixRQUxaO0FBTUUsb0NBQXNCc0Isb0JBTnhCO0FBT0UsNEJBQWM7QUFBQSx1QkFBTSxPQUFLRCxLQUFMLENBQVdoQixZQUFYLENBQXdCMEIsR0FBeEIsQ0FBTjtBQUFBLGVBUGhCO0FBUUUsNkJBQWU7QUFBQSx1QkFBTSxPQUFLVixLQUFMLENBQVdmLGFBQVgsQ0FBeUJ5QixHQUF6QixDQUFOO0FBQUEsZUFSakI7QUFTRSwrQkFBaUI7QUFBQSx1QkFBTSxPQUFLVixLQUFMLENBQVdkLGVBQVgsQ0FBMkJ3QixHQUEzQixDQUFOO0FBQUEsZUFUbkI7QUFVRSx5QkFBVyxPQUFLVixLQUFMLENBQVdiO0FBVnhCLGNBRFU7QUFBQSxXQUFaO0FBRkosU0FORjtBQXVCRTtBQUFBO0FBQUE7QUFDRSxzQkFBVWtCLGtCQUFrQixDQUFDRSxVQUQvQjtBQUVFLG1CQUFNLE9BRlI7QUFHRSxxQkFBUyxLQUFLVDtBQUhoQjtBQUtFLHNEQUFLLFFBQU8sTUFBWixHQUxGO0FBQUE7QUFBQTtBQXZCRixPQURGO0FBaUNEOzs7OztrQkF0RGtCUCxhOzs7QUF5RHJCQSxjQUFjYixTQUFkLEdBQTBCQSxTQUExQiIsImZpbGUiOiJmaWx0ZXItbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCB7XG4gIFNpZGVQYW5lbFNlY3Rpb24sXG4gIFNpZGVQYW5lbERpdmlkZXIsXG4gIEJ1dHRvblxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0FkZH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IFNvdXJjZURhdGFDYXRhbG9nIGZyb20gJy4vc291cmNlLWRhdGEtY2F0YWxvZyc7XG5pbXBvcnQgRmlsdGVyUGFuZWwgZnJvbSAnLi9maWx0ZXItcGFuZWwvZmlsdGVyLXBhbmVsJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBkYXRhc2V0czogUHJvcFR5cGVzLmFycmF5LFxuICBhZGRGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZUZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZW5sYXJnZUZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdG9nZ2xlQW5pbWF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBzZXRGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGZpbHRlcnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBzaG93RGF0YXNldFRhYmxlOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvLyBmaWVsZHMgY2FuIGJlIHVuZGVmaW5lZCB3aGVuIGRhdGFzZXQgaXMgbm90IHNlbGVjdGVkXG4gIGZpZWxkczogUHJvcFR5cGVzLmFycmF5XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWx0ZXJNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLyogc2VsZWN0b3JzICovXG4gIGRhdGFzZXRzU2VsZWN0b3IgPSBzdGF0ZSA9PiBzdGF0ZS5kYXRhc2V0cztcbiAgZGVmYXVsdERhdGFzZXRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZGF0YXNldHNTZWxlY3RvcixcbiAgICBkYXRhc2V0cyA9PlxuICAgICAgKE9iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGggJiYgT2JqZWN0LmtleXMoZGF0YXNldHMpWzBdKSB8fCBudWxsXG4gICk7XG5cbiAgLyogYWN0aW9ucyAqL1xuICBfYWRkRmlsdGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGRlZmF1bHREYXRhc2V0ID0gdGhpcy5kZWZhdWx0RGF0YXNldFNlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgIHRoaXMucHJvcHMuYWRkRmlsdGVyKGRlZmF1bHREYXRhc2V0KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2ZpbHRlcnMsIGRhdGFzZXRzfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaXNBbnlGaWx0ZXJBbmltYXRpbmcgPSBmaWx0ZXJzLnNvbWUoZiA9PiBmLmlzQW5pbWF0aW5nKTtcbiAgICBjb25zdCBoYWRFbXB0eUZpbHRlciA9IGZpbHRlcnMuc29tZShmID0+ICFmLm5hbWUpO1xuICAgIGNvbnN0IGhhZERhdGFzZXQgPSBPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLW1hbmFnZXJcIj5cbiAgICAgICAgPFNvdXJjZURhdGFDYXRhbG9nXG4gICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3RoaXMucHJvcHMuc2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgLz5cbiAgICAgICAgPFNpZGVQYW5lbERpdmlkZXIgLz5cbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAge2ZpbHRlcnMgJiZcbiAgICAgICAgICAgIGZpbHRlcnMubWFwKChmaWx0ZXIsIGlkeCkgPT4gKFxuICAgICAgICAgICAgICA8RmlsdGVyUGFuZWxcbiAgICAgICAgICAgICAgICBrZXk9e2Ake2ZpbHRlci5pZH0tJHtpZHh9YH1cbiAgICAgICAgICAgICAgICBpZHg9e2lkeH1cbiAgICAgICAgICAgICAgICBmaWx0ZXJzPXtmaWx0ZXJzfVxuICAgICAgICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBpc0FueUZpbHRlckFuaW1hdGluZz17aXNBbnlGaWx0ZXJBbmltYXRpbmd9XG4gICAgICAgICAgICAgICAgcmVtb3ZlRmlsdGVyPXsoKSA9PiB0aGlzLnByb3BzLnJlbW92ZUZpbHRlcihpZHgpfVxuICAgICAgICAgICAgICAgIGVubGFyZ2VGaWx0ZXI9eygpID0+IHRoaXMucHJvcHMuZW5sYXJnZUZpbHRlcihpZHgpfVxuICAgICAgICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVBbmltYXRpb24oaWR4KX1cbiAgICAgICAgICAgICAgICBzZXRGaWx0ZXI9e3RoaXMucHJvcHMuc2V0RmlsdGVyfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGluYWN0aXZlPXtoYWRFbXB0eUZpbHRlciB8fCAhaGFkRGF0YXNldH1cbiAgICAgICAgICB3aWR0aD1cIjEwNXB4XCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLl9hZGRGaWx0ZXJ9XG4gICAgICAgID5cbiAgICAgICAgICA8QWRkIGhlaWdodD1cIjEycHhcIiAvPkFkZCBGaWx0ZXJcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkZpbHRlck1hbmFnZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19