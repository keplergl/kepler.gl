'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reselect = require('reselect');

var _styledComponents = require('../common/styled-components');

var _icons = require('../common/icons');

var _sourceDataCatalog = require('./source-data-catalog');

var _sourceDataCatalog2 = _interopRequireDefault(_sourceDataCatalog);

var _filterPanel = require('./filter-panel/filter-panel');

var _filterPanel2 = _interopRequireDefault(_filterPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  panelWidth: _react2.default.PropTypes.number.isRequired,
  addFilter: _react2.default.PropTypes.func.isRequired,
  removeFilter: _react2.default.PropTypes.func.isRequired,
  filters: _react2.default.PropTypes.array.isRequired,
  setFilter: _react2.default.PropTypes.func.isRequired,
  showDatasetTable: _react2.default.PropTypes.func,

  // fields can be undefined when dataset is not selected
  fields: _react2.default.PropTypes.array
};

var FilterManager = function (_Component) {
  (0, _inherits3.default)(FilterManager, _Component);

  function FilterManager() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FilterManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.datasetsSelector = function (state) {
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


  FilterManager.prototype.render = function render() {
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
            setFilter: _this2.props.setFilter,
            width: _this2.props.panelWidth - 24
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
  };

  return FilterManager;
}(_react.Component);

exports.default = FilterManager;


FilterManager.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLW1hbmFnZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwicGFuZWxXaWR0aCIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJhZGRGaWx0ZXIiLCJmdW5jIiwicmVtb3ZlRmlsdGVyIiwiZmlsdGVycyIsImFycmF5Iiwic2V0RmlsdGVyIiwic2hvd0RhdGFzZXRUYWJsZSIsImZpZWxkcyIsIkZpbHRlck1hbmFnZXIiLCJkYXRhc2V0c1NlbGVjdG9yIiwic3RhdGUiLCJkYXRhc2V0cyIsImRlZmF1bHREYXRhc2V0U2VsZWN0b3IiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiX2FkZEZpbHRlciIsImRlZmF1bHREYXRhc2V0IiwicHJvcHMiLCJyZW5kZXIiLCJpc0FueUZpbHRlckFuaW1hdGluZyIsInNvbWUiLCJmIiwiaXNBbmltYXRpbmciLCJoYWRFbXB0eUZpbHRlciIsIm5hbWUiLCJoYWREYXRhc2V0IiwibWFwIiwiZmlsdGVyIiwiaWR4IiwiaWQiLCJlbmxhcmdlRmlsdGVyIiwidG9nZ2xlQW5pbWF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFLQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxjQUFZLGdCQUFNQyxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFEbkI7QUFFaEJDLGFBQVcsZ0JBQU1ILFNBQU4sQ0FBZ0JJLElBQWhCLENBQXFCRixVQUZoQjtBQUdoQkcsZ0JBQWMsZ0JBQU1MLFNBQU4sQ0FBZ0JJLElBQWhCLENBQXFCRixVQUhuQjtBQUloQkksV0FBUyxnQkFBTU4sU0FBTixDQUFnQk8sS0FBaEIsQ0FBc0JMLFVBSmY7QUFLaEJNLGFBQVcsZ0JBQU1SLFNBQU4sQ0FBZ0JJLElBQWhCLENBQXFCRixVQUxoQjtBQU1oQk8sb0JBQWtCLGdCQUFNVCxTQUFOLENBQWdCSSxJQU5sQjs7QUFRaEI7QUFDQU0sVUFBUSxnQkFBTVYsU0FBTixDQUFnQk87QUFUUixDQUFsQjs7SUFZcUJJLGE7Ozs7Ozs7Ozs7OzswSkFFbkJDLGdCLEdBQW1CO0FBQUEsYUFBU0MsTUFBTUMsUUFBZjtBQUFBLEssUUFDbkJDLHNCLEdBQXlCLDhCQUN2QixNQUFLSCxnQkFEa0IsRUFFdkI7QUFBQSxhQUNHSSxPQUFPQyxJQUFQLENBQVlILFFBQVosRUFBc0JJLE1BQXRCLElBQWdDRixPQUFPQyxJQUFQLENBQVlILFFBQVosRUFBc0IsQ0FBdEIsQ0FBakMsSUFBOEQsSUFEaEU7QUFBQSxLQUZ1QixDLFFBT3pCSyxVLEdBQWEsWUFBTTtBQUNqQixVQUFNQyxpQkFBaUIsTUFBS0wsc0JBQUwsQ0FBNEIsTUFBS00sS0FBakMsQ0FBdkI7QUFDQSxZQUFLQSxLQUFMLENBQVdsQixTQUFYLENBQXFCaUIsY0FBckI7QUFDRCxLOztBQVpEOzs7QUFRQTs7OzBCQU1BRSxNLHFCQUFTO0FBQUE7O0FBQUEsaUJBQ3FCLEtBQUtELEtBRDFCO0FBQUEsUUFDQWYsT0FEQSxVQUNBQSxPQURBO0FBQUEsUUFDU1EsUUFEVCxVQUNTQSxRQURUOztBQUVQLFFBQU1TLHVCQUF1QmpCLFFBQVFrQixJQUFSLENBQWE7QUFBQSxhQUFLQyxFQUFFQyxXQUFQO0FBQUEsS0FBYixDQUE3QjtBQUNBLFFBQU1DLGlCQUFpQnJCLFFBQVFrQixJQUFSLENBQWE7QUFBQSxhQUFLLENBQUNDLEVBQUVHLElBQVI7QUFBQSxLQUFiLENBQXZCO0FBQ0EsUUFBTUMsYUFBYWIsT0FBT0MsSUFBUCxDQUFZSCxRQUFaLEVBQXNCSSxNQUF6Qzs7QUFFQSxXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsZ0JBQWY7QUFDRTtBQUNFLGtCQUFVSixRQURaO0FBRUUsMEJBQWtCLEtBQUtPLEtBQUwsQ0FBV1o7QUFGL0IsUUFERjtBQUtFLDZFQUxGO0FBTUU7QUFBQTtBQUFBO0FBQ0dILG1CQUNDQSxRQUFRd0IsR0FBUixDQUFZLFVBQUNDLE1BQUQsRUFBU0MsR0FBVDtBQUFBLGlCQUNWO0FBQ0UsaUJBQVFELE9BQU9FLEVBQWYsU0FBcUJELEdBRHZCO0FBRUUsaUJBQUtBLEdBRlA7QUFHRSxxQkFBUzFCLE9BSFg7QUFJRSxvQkFBUXlCLE1BSlY7QUFLRSxzQkFBVWpCLFFBTFo7QUFNRSxrQ0FBc0JTLG9CQU54QjtBQU9FLDBCQUFjO0FBQUEscUJBQU0sT0FBS0YsS0FBTCxDQUFXaEIsWUFBWCxDQUF3QjJCLEdBQXhCLENBQU47QUFBQSxhQVBoQjtBQVFFLDJCQUFlO0FBQUEscUJBQU0sT0FBS1gsS0FBTCxDQUFXYSxhQUFYLENBQXlCRixHQUF6QixDQUFOO0FBQUEsYUFSakI7QUFTRSw2QkFBaUI7QUFBQSxxQkFBTSxPQUFLWCxLQUFMLENBQVdjLGVBQVgsQ0FBMkJILEdBQTNCLENBQU47QUFBQSxhQVRuQjtBQVVFLHVCQUFXLE9BQUtYLEtBQUwsQ0FBV2IsU0FWeEI7QUFXRSxtQkFBTyxPQUFLYSxLQUFMLENBQVd0QixVQUFYLEdBQXdCO0FBWGpDLFlBRFU7QUFBQSxTQUFaO0FBRkosT0FORjtBQXdCRTtBQUFBO0FBQUE7QUFDRSxvQkFBVTRCLGtCQUFrQixDQUFDRSxVQUQvQjtBQUVFLGlCQUFNLE9BRlI7QUFHRSxtQkFBUyxLQUFLVjtBQUhoQjtBQUtFLG9EQUFLLFFBQU8sTUFBWixHQUxGO0FBQUE7QUFBQTtBQXhCRixLQURGO0FBa0NELEc7Ozs7O2tCQXZEa0JSLGE7OztBQTBEckJBLGNBQWNiLFNBQWQsR0FBMEJBLFNBQTFCIiwiZmlsZSI6ImZpbHRlci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQge1xuICBTaWRlUGFuZWxTZWN0aW9uLFxuICBTaWRlUGFuZWxEaXZpZGVyLFxuICBCdXR0b25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtBZGR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBTb3VyY2VEYXRhQ2F0YWxvZyBmcm9tICcuL3NvdXJjZS1kYXRhLWNhdGFsb2cnO1xuaW1wb3J0IEZpbHRlclBhbmVsIGZyb20gJy4vZmlsdGVyLXBhbmVsL2ZpbHRlci1wYW5lbCc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgcGFuZWxXaWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBhZGRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZUZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZmlsdGVyczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIHNldEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgc2hvd0RhdGFzZXRUYWJsZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG5cbiAgLy8gZmllbGRzIGNhbiBiZSB1bmRlZmluZWQgd2hlbiBkYXRhc2V0IGlzIG5vdCBzZWxlY3RlZFxuICBmaWVsZHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsdGVyTWFuYWdlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIC8qIHNlbGVjdG9ycyAqL1xuICBkYXRhc2V0c1NlbGVjdG9yID0gc3RhdGUgPT4gc3RhdGUuZGF0YXNldHM7XG4gIGRlZmF1bHREYXRhc2V0U2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICB0aGlzLmRhdGFzZXRzU2VsZWN0b3IsXG4gICAgZGF0YXNldHMgPT5cbiAgICAgIChPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoICYmIE9iamVjdC5rZXlzKGRhdGFzZXRzKVswXSkgfHwgbnVsbFxuICApO1xuXG4gIC8qIGFjdGlvbnMgKi9cbiAgX2FkZEZpbHRlciA9ICgpID0+IHtcbiAgICBjb25zdCBkZWZhdWx0RGF0YXNldCA9IHRoaXMuZGVmYXVsdERhdGFzZXRTZWxlY3Rvcih0aGlzLnByb3BzKTtcbiAgICB0aGlzLnByb3BzLmFkZEZpbHRlcihkZWZhdWx0RGF0YXNldCk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtmaWx0ZXJzLCBkYXRhc2V0c30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGlzQW55RmlsdGVyQW5pbWF0aW5nID0gZmlsdGVycy5zb21lKGYgPT4gZi5pc0FuaW1hdGluZyk7XG4gICAgY29uc3QgaGFkRW1wdHlGaWx0ZXIgPSBmaWx0ZXJzLnNvbWUoZiA9PiAhZi5uYW1lKTtcbiAgICBjb25zdCBoYWREYXRhc2V0ID0gT2JqZWN0LmtleXMoZGF0YXNldHMpLmxlbmd0aDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1tYW5hZ2VyXCI+XG4gICAgICAgIDxTb3VyY2VEYXRhQ2F0YWxvZ1xuICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICBzaG93RGF0YXNldFRhYmxlPXt0aGlzLnByb3BzLnNob3dEYXRhc2V0VGFibGV9XG4gICAgICAgIC8+XG4gICAgICAgIDxTaWRlUGFuZWxEaXZpZGVyIC8+XG4gICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgIHtmaWx0ZXJzICYmXG4gICAgICAgICAgICBmaWx0ZXJzLm1hcCgoZmlsdGVyLCBpZHgpID0+IChcbiAgICAgICAgICAgICAgPEZpbHRlclBhbmVsXG4gICAgICAgICAgICAgICAga2V5PXtgJHtmaWx0ZXIuaWR9LSR7aWR4fWB9XG4gICAgICAgICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgICAgICAgZmlsdGVycz17ZmlsdGVyc31cbiAgICAgICAgICAgICAgICBmaWx0ZXI9e2ZpbHRlcn1cbiAgICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmc9e2lzQW55RmlsdGVyQW5pbWF0aW5nfVxuICAgICAgICAgICAgICAgIHJlbW92ZUZpbHRlcj17KCkgPT4gdGhpcy5wcm9wcy5yZW1vdmVGaWx0ZXIoaWR4KX1cbiAgICAgICAgICAgICAgICBlbmxhcmdlRmlsdGVyPXsoKSA9PiB0aGlzLnByb3BzLmVubGFyZ2VGaWx0ZXIoaWR4KX1cbiAgICAgICAgICAgICAgICB0b2dnbGVBbmltYXRpb249eygpID0+IHRoaXMucHJvcHMudG9nZ2xlQW5pbWF0aW9uKGlkeCl9XG4gICAgICAgICAgICAgICAgc2V0RmlsdGVyPXt0aGlzLnByb3BzLnNldEZpbHRlcn1cbiAgICAgICAgICAgICAgICB3aWR0aD17dGhpcy5wcm9wcy5wYW5lbFdpZHRoIC0gMjR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgaW5hY3RpdmU9e2hhZEVtcHR5RmlsdGVyIHx8ICFoYWREYXRhc2V0fVxuICAgICAgICAgIHdpZHRoPVwiMTA1cHhcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX2FkZEZpbHRlcn1cbiAgICAgICAgPlxuICAgICAgICAgIDxBZGQgaGVpZ2h0PVwiMTJweFwiIC8+QWRkIEZpbHRlclxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuRmlsdGVyTWFuYWdlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=