'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  align-items: center;\n  border-left-color: rgb(', ');\n  cursor: pointer;\n  border-left-width: 4px;\n  border-left-style: solid;\n  padding: 12px;\n'], ['\n  display: flex;\n  align-items: center;\n  border-left-color: rgb(', ');\n  cursor: pointer;\n  border-left-width: 4px;\n  border-left-style: solid;\n  padding: 12px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-left: 12px;\n  height: 18px;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n'], ['\n  margin-left: 12px;\n  height: 18px;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reselect = require('reselect');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _fieldSelector = require('../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _styledComponents3 = require('../common/styled-components');

var _icons = require('../common/icons');

var _sourceDataSelector = require('./source-data-selector');

var _sourceDataSelector2 = _interopRequireDefault(_sourceDataSelector);

var _sourceDataCatalog = require('./source-data-catalog');

var _sourceDataCatalog2 = _interopRequireDefault(_sourceDataCatalog);

var _filters = require('../filters');

var Filters = _interopRequireWildcard(_filters);

var _filterUtils = require('../../utils/filter-utils');

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
      null,
      _react2.default.createElement(_sourceDataCatalog2.default, {
        datasets: datasets,
        showDatasetTable: this.props.showDatasetTable
      }),
      _react2.default.createElement(_styledComponents3.SidePanelDivider, null),
      _react2.default.createElement(
        _styledComponents3.SidePanelSection,
        null,
        filters && filters.map(function (filter, idx) {
          return _react2.default.createElement(FilterPanel, {
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
        _styledComponents3.Button,
        {
          inactive: hadEmptyFilter || !hadDataset,
          width: '105px',
          onClick: this._addFilter },
        _react2.default.createElement(_icons.Add, { height: '12px' }),
        'Add Filter'
      )
    );
  };

  return FilterManager;
}(_react.Component);

exports.default = FilterManager;


FilterManager.propTypes = propTypes;

var FilterHeaderWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.color.join(',');
});

var FilterPanel = function (_Component2) {
  (0, _inherits3.default)(FilterPanel, _Component2);

  function FilterPanel() {
    var _temp2, _this3, _ret2;

    (0, _classCallCheck3.default)(this, FilterPanel);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = (0, _possibleConstructorReturn3.default)(this, _Component2.call.apply(_Component2, [this].concat(args))), _this3), _this3.fieldsSelector = function (props) {
      return props.filter.dataId && props.datasets[props.filter.dataId].fields || [];
    }, _this3.filterSelector = function (props) {
      return props.filters;
    }, _this3.nameSelector = function (props) {
      return props.filter.name;
    }, _this3.dataIdSelector = function (props) {
      return props.filter.dataId;
    }, _this3.availableFieldsSelector = (0, _reselect.createSelector)(_this3.fieldsSelector, _this3.filterSelector, _this3.nameSelector, _this3.dataIdSelector, function (fields, filters, name, dataId) {
      return fields.filter(function (f) {
        return f.type && f.type !== _defaultSettings.ALL_FIELD_TYPES.geojson && (f.name === name || !filters.find(function (d) {
          return d.name === f.name && d.dataId === dataId;
        }));
      });
    }), _temp2), (0, _possibleConstructorReturn3.default)(_this3, _ret2);
  }
  /* selectors */


  // only show current field and field that's not already been used as a filter


  FilterPanel.prototype.render = function render() {
    var _props2 = this.props,
        datasets = _props2.datasets,
        enlargeFilter = _props2.enlargeFilter,
        filter = _props2.filter,
        idx = _props2.idx,
        isAnyFilterAnimating = _props2.isAnyFilterAnimating,
        removeFilter = _props2.removeFilter,
        _setFilter = _props2.setFilter,
        toggleAnimation = _props2.toggleAnimation,
        width = _props2.width;
    var name = filter.name,
        enlarged = filter.enlarged,
        type = filter.type,
        dataId = filter.dataId;

    var FilterComponent = type && Filters[_filterUtils.FILTER_COMPONENTS[type]];
    var allAvailableFields = this.availableFieldsSelector(this.props);

    return _react2.default.createElement(
      'div',
      { className: 'layer-panel active' },
      _react2.default.createElement(
        FilterHeaderWrapper,
        { color: datasets[dataId].color },
        _react2.default.createElement(
          'div',
          { style: { flexGrow: 1 } },
          _react2.default.createElement(_fieldSelector2.default, {
            fields: allAvailableFields,
            value: name,
            erasable: false,
            onSelect: function onSelect(value) {
              return _setFilter(idx, 'name', value.name);
            }
          })
        ),
        _react2.default.createElement(FilterAction, {
          id: filter.id,
          tooltip: 'delete',
          tooltipType: 'error',
          onClick: removeFilter,
          hoverColor: 'errorColor',
          IconComponent: _icons.Trash
        }),
        type === _filterUtils.FILTER_TYPES.timeRange && _react2.default.createElement(FilterAction, {
          id: filter.id,
          onClick: enlargeFilter,
          tooltip: 'Time Playback',
          IconComponent: _icons.Clock,
          active: enlarged
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'soft-tiny layer-panel__config' },
        Object.keys(datasets).length > 1 && _react2.default.createElement(_sourceDataSelector2.default, {
          datasets: datasets,
          disabled: filter.freeze,
          dataId: filter.dataId,
          onSelect: function onSelect(value) {
            return _setFilter(idx, 'dataId', value);
          }
        }),
        type && !enlarged && _react2.default.createElement(
          'div',
          { style: { marginTop: '24px' } },
          _react2.default.createElement(FilterComponent, {
            filter: filter,
            idx: idx,
            isAnyFilterAnimating: isAnyFilterAnimating,
            toggleAnimation: toggleAnimation,
            setFilter: function setFilter(value) {
              return _setFilter(idx, 'value', value);
            },
            width: width
          })
        )
      )
    );
  };

  return FilterPanel;
}(_react.Component);

var FilterActionWrapper = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.active ? props.theme.activeColor : props.theme.textColor;
}, function (props) {
  return props.hoverColor ? props.theme[props.hoverColor] : props.theme.textColorHl;
});

// Need to use react class to access props.component

var FilterAction = function (_Component3) {
  (0, _inherits3.default)(FilterAction, _Component3);

  function FilterAction() {
    (0, _classCallCheck3.default)(this, FilterAction);
    return (0, _possibleConstructorReturn3.default)(this, _Component3.apply(this, arguments));
  }

  FilterAction.prototype.render = function render() {
    var _props3 = this.props,
        onClick = _props3.onClick,
        tooltip = _props3.tooltip,
        id = _props3.id,
        active = _props3.active,
        hoverColor = _props3.hoverColor,
        tooltipType = _props3.tooltipType;

    return _react2.default.createElement(
      FilterActionWrapper,
      { active: active, hoverColor: hoverColor },
      _react2.default.createElement(this.props.IconComponent, { 'data-tip': true, 'data-for': tooltip + '_' + id,
        height: '18px', onClick: onClick }),
      _react2.default.createElement(
        _styledComponents3.Tooltip,
        { id: tooltip + '_' + id, effect: 'solid', type: tooltipType },
        _react2.default.createElement(
          'span',
          null,
          tooltip
        )
      )
    );
  };

  return FilterAction;
}(_react.Component);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiRmlsdGVycyIsInByb3BUeXBlcyIsInBhbmVsV2lkdGgiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwiYWRkRmlsdGVyIiwiZnVuYyIsInJlbW92ZUZpbHRlciIsImZpbHRlcnMiLCJhcnJheSIsInNldEZpbHRlciIsInNob3dEYXRhc2V0VGFibGUiLCJmaWVsZHMiLCJGaWx0ZXJNYW5hZ2VyIiwiZGF0YXNldHNTZWxlY3RvciIsInN0YXRlIiwiZGF0YXNldHMiLCJkZWZhdWx0RGF0YXNldFNlbGVjdG9yIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsIl9hZGRGaWx0ZXIiLCJkZWZhdWx0RGF0YXNldCIsInByb3BzIiwicmVuZGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJzb21lIiwiZiIsImlzQW5pbWF0aW5nIiwiaGFkRW1wdHlGaWx0ZXIiLCJuYW1lIiwiaGFkRGF0YXNldCIsIm1hcCIsImZpbHRlciIsImlkeCIsImlkIiwiZW5sYXJnZUZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsIkZpbHRlckhlYWRlcldyYXBwZXIiLCJkaXYiLCJjb2xvciIsImpvaW4iLCJGaWx0ZXJQYW5lbCIsImZpZWxkc1NlbGVjdG9yIiwiZGF0YUlkIiwiZmlsdGVyU2VsZWN0b3IiLCJuYW1lU2VsZWN0b3IiLCJkYXRhSWRTZWxlY3RvciIsImF2YWlsYWJsZUZpZWxkc1NlbGVjdG9yIiwidHlwZSIsImdlb2pzb24iLCJmaW5kIiwiZCIsIndpZHRoIiwiZW5sYXJnZWQiLCJGaWx0ZXJDb21wb25lbnQiLCJhbGxBdmFpbGFibGVGaWVsZHMiLCJmbGV4R3JvdyIsInZhbHVlIiwidGltZVJhbmdlIiwiZnJlZXplIiwibWFyZ2luVG9wIiwiRmlsdGVyQWN0aW9uV3JhcHBlciIsImFjdGl2ZSIsInRoZW1lIiwiYWN0aXZlQ29sb3IiLCJ0ZXh0Q29sb3IiLCJob3ZlckNvbG9yIiwidGV4dENvbG9ySGwiLCJGaWx0ZXJBY3Rpb24iLCJvbkNsaWNrIiwidG9vbHRpcCIsInRvb2x0aXBUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWUEsTzs7QUFDWjs7QUFLQTs7Ozs7O0FBRUEsSUFBTUMsWUFBWTtBQUNoQkMsY0FBWSxnQkFBTUMsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRG5CO0FBRWhCQyxhQUFXLGdCQUFNSCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFGaEI7QUFHaEJHLGdCQUFjLGdCQUFNTCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFIbkI7QUFJaEJJLFdBQVMsZ0JBQU1OLFNBQU4sQ0FBZ0JPLEtBQWhCLENBQXNCTCxVQUpmO0FBS2hCTSxhQUFXLGdCQUFNUixTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFMaEI7QUFNaEJPLG9CQUFrQixnQkFBTVQsU0FBTixDQUFnQkksSUFObEI7O0FBUWhCO0FBQ0FNLFVBQVEsZ0JBQU1WLFNBQU4sQ0FBZ0JPO0FBVFIsQ0FBbEI7O0lBWXFCSSxhOzs7Ozs7Ozs7Ozs7MEpBRW5CQyxnQixHQUFtQjtBQUFBLGFBQVNDLE1BQU1DLFFBQWY7QUFBQSxLLFFBQ25CQyxzQixHQUF5Qiw4QkFDdkIsTUFBS0gsZ0JBRGtCLEVBRXZCO0FBQUEsYUFDR0ksT0FBT0MsSUFBUCxDQUFZSCxRQUFaLEVBQXNCSSxNQUF0QixJQUFnQ0YsT0FBT0MsSUFBUCxDQUFZSCxRQUFaLEVBQXNCLENBQXRCLENBQWpDLElBQThELElBRGhFO0FBQUEsS0FGdUIsQyxRQU96QkssVSxHQUFhLFlBQU07QUFDakIsVUFBTUMsaUJBQWlCLE1BQUtMLHNCQUFMLENBQTRCLE1BQUtNLEtBQWpDLENBQXZCO0FBQ0EsWUFBS0EsS0FBTCxDQUFXbEIsU0FBWCxDQUFxQmlC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ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCB7U2lkZVBhbmVsU2VjdGlvbiwgU2lkZVBhbmVsRGl2aWRlciwgVG9vbHRpcCwgQnV0dG9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0FkZCwgVHJhc2gsIENsb2NrfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgU291cmNlRGF0YVNlbGVjdG9yIGZyb20gJy4vc291cmNlLWRhdGEtc2VsZWN0b3InO1xuaW1wb3J0IFNvdXJjZURhdGFDYXRhbG9nIGZyb20gJy4vc291cmNlLWRhdGEtY2F0YWxvZyc7XG5cbmltcG9ydCAqIGFzIEZpbHRlcnMgZnJvbSAnY29tcG9uZW50cy9maWx0ZXJzJztcbmltcG9ydCB7XG4gIEZJTFRFUl9UWVBFUyxcbiAgRklMVEVSX0NPTVBPTkVOVFNcbn0gZnJvbSAndXRpbHMvZmlsdGVyLXV0aWxzJztcblxuaW1wb3J0IHtBTExfRklFTERfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBwYW5lbFdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGFkZEZpbHRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlRmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBmaWx0ZXJzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgc2V0RmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBzaG93RGF0YXNldFRhYmxlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcblxuICAvLyBmaWVsZHMgY2FuIGJlIHVuZGVmaW5lZCB3aGVuIGRhdGFzZXQgaXMgbm90IHNlbGVjdGVkXG4gIGZpZWxkczogUmVhY3QuUHJvcFR5cGVzLmFycmF5XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWx0ZXJNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLyogc2VsZWN0b3JzICovXG4gIGRhdGFzZXRzU2VsZWN0b3IgPSBzdGF0ZSA9PiBzdGF0ZS5kYXRhc2V0cztcbiAgZGVmYXVsdERhdGFzZXRTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZGF0YXNldHNTZWxlY3RvcixcbiAgICBkYXRhc2V0cyA9PlxuICAgICAgKE9iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGggJiYgT2JqZWN0LmtleXMoZGF0YXNldHMpWzBdKSB8fCBudWxsXG4gICk7XG5cbiAgLyogYWN0aW9ucyAqL1xuICBfYWRkRmlsdGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGRlZmF1bHREYXRhc2V0ID0gdGhpcy5kZWZhdWx0RGF0YXNldFNlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgIHRoaXMucHJvcHMuYWRkRmlsdGVyKGRlZmF1bHREYXRhc2V0KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2ZpbHRlcnMsIGRhdGFzZXRzfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaXNBbnlGaWx0ZXJBbmltYXRpbmcgPSBmaWx0ZXJzLnNvbWUoZiA9PiBmLmlzQW5pbWF0aW5nKTtcbiAgICBjb25zdCBoYWRFbXB0eUZpbHRlciA9IGZpbHRlcnMuc29tZShmID0+ICFmLm5hbWUpO1xuICAgIGNvbnN0IGhhZERhdGFzZXQgPSBPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxTb3VyY2VEYXRhQ2F0YWxvZ1xuICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICBzaG93RGF0YXNldFRhYmxlPXt0aGlzLnByb3BzLnNob3dEYXRhc2V0VGFibGV9XG4gICAgICAgIC8+XG4gICAgICAgIDxTaWRlUGFuZWxEaXZpZGVyLz5cbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgIHtmaWx0ZXJzICYmXG4gICAgICAgICAgZmlsdGVycy5tYXAoKGZpbHRlciwgaWR4KSA9PiAoXG4gICAgICAgICAgICA8RmlsdGVyUGFuZWxcbiAgICAgICAgICAgICAga2V5PXtgJHtmaWx0ZXIuaWR9LSR7aWR4fWB9XG4gICAgICAgICAgICAgIGlkeD17aWR4fVxuICAgICAgICAgICAgICBmaWx0ZXJzPXtmaWx0ZXJzfVxuICAgICAgICAgICAgICBmaWx0ZXI9e2ZpbHRlcn1cbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBpc0FueUZpbHRlckFuaW1hdGluZz17aXNBbnlGaWx0ZXJBbmltYXRpbmd9XG4gICAgICAgICAgICAgIHJlbW92ZUZpbHRlcj17KCkgPT4gdGhpcy5wcm9wcy5yZW1vdmVGaWx0ZXIoaWR4KX1cbiAgICAgICAgICAgICAgZW5sYXJnZUZpbHRlcj17KCkgPT4gdGhpcy5wcm9wcy5lbmxhcmdlRmlsdGVyKGlkeCl9XG4gICAgICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVBbmltYXRpb24oaWR4KX1cbiAgICAgICAgICAgICAgc2V0RmlsdGVyPXt0aGlzLnByb3BzLnNldEZpbHRlcn1cbiAgICAgICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMucGFuZWxXaWR0aCAtIDI0fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgaW5hY3RpdmU9e2hhZEVtcHR5RmlsdGVyIHx8ICFoYWREYXRhc2V0fVxuICAgICAgICAgIHdpZHRoPVwiMTA1cHhcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX2FkZEZpbHRlcn0+XG4gICAgICAgICAgPEFkZCBoZWlnaHQ9XCIxMnB4XCIvPkFkZCBGaWx0ZXJcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkZpbHRlck1hbmFnZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5jb25zdCBGaWx0ZXJIZWFkZXJXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLWxlZnQtY29sb3I6IHJnYigke3Byb3BzID0+IHByb3BzLmNvbG9yLmpvaW4oJywnKX0pO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJvcmRlci1sZWZ0LXdpZHRoOiA0cHg7XG4gIGJvcmRlci1sZWZ0LXN0eWxlOiBzb2xpZDtcbiAgcGFkZGluZzogMTJweDtcbmA7XG5cbmNsYXNzIEZpbHRlclBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLyogc2VsZWN0b3JzICovXG4gIGZpZWxkc1NlbGVjdG9yID0gcHJvcHMgPT5cbiAgICAocHJvcHMuZmlsdGVyLmRhdGFJZCAmJiBwcm9wcy5kYXRhc2V0c1twcm9wcy5maWx0ZXIuZGF0YUlkXS5maWVsZHMpIHx8IFtdO1xuICBmaWx0ZXJTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlcnM7XG4gIG5hbWVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlci5uYW1lO1xuICBkYXRhSWRTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmZpbHRlci5kYXRhSWQ7XG5cbiAgLy8gb25seSBzaG93IGN1cnJlbnQgZmllbGQgYW5kIGZpZWxkIHRoYXQncyBub3QgYWxyZWFkeSBiZWVuIHVzZWQgYXMgYSBmaWx0ZXJcbiAgYXZhaWxhYmxlRmllbGRzU2VsZWN0b3IgPSBjcmVhdGVTZWxlY3RvcihcbiAgICB0aGlzLmZpZWxkc1NlbGVjdG9yLFxuICAgIHRoaXMuZmlsdGVyU2VsZWN0b3IsXG4gICAgdGhpcy5uYW1lU2VsZWN0b3IsXG4gICAgdGhpcy5kYXRhSWRTZWxlY3RvcixcbiAgICAoZmllbGRzLCBmaWx0ZXJzLCBuYW1lLCBkYXRhSWQpID0+XG4gICAgICBmaWVsZHMuZmlsdGVyKFxuICAgICAgICBmID0+XG4gICAgICAgICAgZi50eXBlICYmXG4gICAgICAgICAgZi50eXBlICE9PSBBTExfRklFTERfVFlQRVMuZ2VvanNvbiAmJlxuICAgICAgICAgIChmLm5hbWUgPT09IG5hbWUgfHxcbiAgICAgICAgICAgICFmaWx0ZXJzLmZpbmQoZCA9PiBkLm5hbWUgPT09IGYubmFtZSAmJiBkLmRhdGFJZCA9PT0gZGF0YUlkKSlcbiAgICAgIClcbiAgKTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZGF0YXNldHMsXG4gICAgICBlbmxhcmdlRmlsdGVyLFxuICAgICAgZmlsdGVyLFxuICAgICAgaWR4LFxuICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmcsXG4gICAgICByZW1vdmVGaWx0ZXIsXG4gICAgICBzZXRGaWx0ZXIsXG4gICAgICB0b2dnbGVBbmltYXRpb24sXG4gICAgICB3aWR0aFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtuYW1lLCBlbmxhcmdlZCwgdHlwZSwgZGF0YUlkfSA9IGZpbHRlcjtcbiAgICBjb25zdCBGaWx0ZXJDb21wb25lbnQgPSB0eXBlICYmIEZpbHRlcnNbRklMVEVSX0NPTVBPTkVOVFNbdHlwZV1dO1xuICAgIGNvbnN0IGFsbEF2YWlsYWJsZUZpZWxkcyA9IHRoaXMuYXZhaWxhYmxlRmllbGRzU2VsZWN0b3IodGhpcy5wcm9wcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1wYW5lbCBhY3RpdmVcIj5cbiAgICAgICAgPEZpbHRlckhlYWRlcldyYXBwZXIgY29sb3I9e2RhdGFzZXRzW2RhdGFJZF0uY29sb3J9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4R3JvdzogMX19PlxuICAgICAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICAgICAgZmllbGRzPXthbGxBdmFpbGFibGVGaWVsZHN9XG4gICAgICAgICAgICAgIHZhbHVlPXtuYW1lfVxuICAgICAgICAgICAgICBlcmFzYWJsZT17ZmFsc2V9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt2YWx1ZSA9PiBzZXRGaWx0ZXIoaWR4LCAnbmFtZScsIHZhbHVlLm5hbWUpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8RmlsdGVyQWN0aW9uXG4gICAgICAgICAgICBpZD17ZmlsdGVyLmlkfVxuICAgICAgICAgICAgdG9vbHRpcD1cImRlbGV0ZVwiXG4gICAgICAgICAgICB0b29sdGlwVHlwZT1cImVycm9yXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3JlbW92ZUZpbHRlcn1cbiAgICAgICAgICAgIGhvdmVyQ29sb3I9eydlcnJvckNvbG9yJ31cbiAgICAgICAgICAgIEljb25Db21wb25lbnQ9e1RyYXNofVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3R5cGUgPT09IEZJTFRFUl9UWVBFUy50aW1lUmFuZ2UgJiYgKFxuICAgICAgICAgICAgPEZpbHRlckFjdGlvblxuICAgICAgICAgICAgICBpZD17ZmlsdGVyLmlkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXtlbmxhcmdlRmlsdGVyfVxuICAgICAgICAgICAgICB0b29sdGlwPVwiVGltZSBQbGF5YmFja1wiXG4gICAgICAgICAgICAgIEljb25Db21wb25lbnQ9e0Nsb2NrfVxuICAgICAgICAgICAgICBhY3RpdmU9e2VubGFyZ2VkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L0ZpbHRlckhlYWRlcldyYXBwZXI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic29mdC10aW55IGxheWVyLXBhbmVsX19jb25maWdcIj5cbiAgICAgICAgICB7T2JqZWN0LmtleXMoZGF0YXNldHMpLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgICAgPFNvdXJjZURhdGFTZWxlY3RvclxuICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtmaWx0ZXIuZnJlZXplfVxuICAgICAgICAgICAgICBkYXRhSWQ9e2ZpbHRlci5kYXRhSWR9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt2YWx1ZSA9PiBzZXRGaWx0ZXIoaWR4LCAnZGF0YUlkJywgdmFsdWUpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIHt0eXBlICYmXG4gICAgICAgICAgICAhZW5sYXJnZWQgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnMjRweCd9fT5cbiAgICAgICAgICAgICAgICA8RmlsdGVyQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICBmaWx0ZXI9e2ZpbHRlcn1cbiAgICAgICAgICAgICAgICAgIGlkeD17aWR4fVxuICAgICAgICAgICAgICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmc9e2lzQW55RmlsdGVyQW5pbWF0aW5nfVxuICAgICAgICAgICAgICAgICAgdG9nZ2xlQW5pbWF0aW9uPXt0b2dnbGVBbmltYXRpb259XG4gICAgICAgICAgICAgICAgICBzZXRGaWx0ZXI9e3ZhbHVlID0+IHNldEZpbHRlcihpZHgsICd2YWx1ZScsIHZhbHVlKX1cbiAgICAgICAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBGaWx0ZXJBY3Rpb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWxlZnQ6IDEycHg7XG4gIGhlaWdodDogMThweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuYWN0aXZlQ29sb3IgOiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLmhvdmVyQ29sb3IgPyBwcm9wcy50aGVtZVtwcm9wcy5ob3ZlckNvbG9yXSA6IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuYDtcblxuLy8gTmVlZCB0byB1c2UgcmVhY3QgY2xhc3MgdG8gYWNjZXNzIHByb3BzLmNvbXBvbmVudFxuY2xhc3MgRmlsdGVyQWN0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtvbkNsaWNrLCB0b29sdGlwLCBpZCwgYWN0aXZlLCBob3ZlckNvbG9yLCB0b29sdGlwVHlwZX0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8RmlsdGVyQWN0aW9uV3JhcHBlciBhY3RpdmU9e2FjdGl2ZX0gaG92ZXJDb2xvcj17aG92ZXJDb2xvcn0+XG4gICAgICAgIDx0aGlzLnByb3BzLkljb25Db21wb25lbnQgZGF0YS10aXAgZGF0YS1mb3I9e2Ake3Rvb2x0aXB9XyR7aWR9YH1cbiAgICAgICAgICBoZWlnaHQ9XCIxOHB4XCIgb25DbGljaz17b25DbGlja30vPlxuICAgICAgICA8VG9vbHRpcCBpZD17YCR7dG9vbHRpcH1fJHtpZH1gfSBlZmZlY3Q9XCJzb2xpZFwiIHR5cGU9e3Rvb2x0aXBUeXBlfT5cbiAgICAgICAgICA8c3Bhbj57dG9vbHRpcH08L3NwYW4+XG4gICAgICAgIDwvVG9vbHRpcD5cbiAgICAgIDwvRmlsdGVyQWN0aW9uV3JhcHBlcj5cbiAgICApO1xuICB9XG59XG4iXX0=