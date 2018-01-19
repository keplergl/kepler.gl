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
      _react2.default.createElement(this.props.IconComponent, {
        'data-tip': true,
        'data-for': tooltip + '_' + id,
        height: '18px',
        onClick: onClick
      }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLW1hbmFnZXIuanMiXSwibmFtZXMiOlsiRmlsdGVycyIsInByb3BUeXBlcyIsInBhbmVsV2lkdGgiLCJQcm9wVHlwZXMiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwiYWRkRmlsdGVyIiwiZnVuYyIsInJlbW92ZUZpbHRlciIsImZpbHRlcnMiLCJhcnJheSIsInNldEZpbHRlciIsInNob3dEYXRhc2V0VGFibGUiLCJmaWVsZHMiLCJGaWx0ZXJNYW5hZ2VyIiwiZGF0YXNldHNTZWxlY3RvciIsInN0YXRlIiwiZGF0YXNldHMiLCJkZWZhdWx0RGF0YXNldFNlbGVjdG9yIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsIl9hZGRGaWx0ZXIiLCJkZWZhdWx0RGF0YXNldCIsInByb3BzIiwicmVuZGVyIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJzb21lIiwiZiIsImlzQW5pbWF0aW5nIiwiaGFkRW1wdHlGaWx0ZXIiLCJuYW1lIiwiaGFkRGF0YXNldCIsIm1hcCIsImZpbHRlciIsImlkeCIsImlkIiwiZW5sYXJnZUZpbHRlciIsInRvZ2dsZUFuaW1hdGlvbiIsIkZpbHRlckhlYWRlcldyYXBwZXIiLCJkaXYiLCJjb2xvciIsImpvaW4iLCJGaWx0ZXJQYW5lbCIsImZpZWxkc1NlbGVjdG9yIiwiZGF0YUlkIiwiZmlsdGVyU2VsZWN0b3IiLCJuYW1lU2VsZWN0b3IiLCJkYXRhSWRTZWxlY3RvciIsImF2YWlsYWJsZUZpZWxkc1NlbGVjdG9yIiwidHlwZSIsImdlb2pzb24iLCJmaW5kIiwiZCIsIndpZHRoIiwiZW5sYXJnZWQiLCJGaWx0ZXJDb21wb25lbnQiLCJhbGxBdmFpbGFibGVGaWVsZHMiLCJmbGV4R3JvdyIsInZhbHVlIiwidGltZVJhbmdlIiwiZnJlZXplIiwibWFyZ2luVG9wIiwiRmlsdGVyQWN0aW9uV3JhcHBlciIsImFjdGl2ZSIsInRoZW1lIiwiYWN0aXZlQ29sb3IiLCJ0ZXh0Q29sb3IiLCJob3ZlckNvbG9yIiwidGV4dENvbG9ySGwiLCJGaWx0ZXJBY3Rpb24iLCJvbkNsaWNrIiwidG9vbHRpcCIsInRvb2x0aXBUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOztBQU1BOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWUEsTzs7QUFDWjs7QUFFQTs7Ozs7O0FBRUEsSUFBTUMsWUFBWTtBQUNoQkMsY0FBWSxnQkFBTUMsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRG5CO0FBRWhCQyxhQUFXLGdCQUFNSCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFGaEI7QUFHaEJHLGdCQUFjLGdCQUFNTCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFIbkI7QUFJaEJJLFdBQVMsZ0JBQU1OLFNBQU4sQ0FBZ0JPLEtBQWhCLENBQXNCTCxVQUpmO0FBS2hCTSxhQUFXLGdCQUFNUixTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFMaEI7QUFNaEJPLG9CQUFrQixnQkFBTVQsU0FBTixDQUFnQkksSUFObEI7O0FBUWhCO0FBQ0FNLFVBQVEsZ0JBQU1WLFNBQU4sQ0FBZ0JPO0FBVFIsQ0FBbEI7O0lBWXFCSSxhOzs7Ozs7Ozs7Ozs7MEpBRW5CQyxnQixHQUFtQjtBQUFBLGFBQVNDLE1BQU1DLFFBQWY7QUFBQSxLLFFBQ25CQyxzQixHQUF5Qiw4QkFDdkIsTUFBS0gsZ0JBRGtCLEVBRXZCO0FBQUEsYUFDR0ksT0FBT0MsSUFBUCxDQUFZSCxRQUFaLEVBQXNCSSxNQUF0QixJQUFnQ0YsT0FBT0MsSUFBUCxDQUFZSCxRQUFaLEVBQXNCLENBQXRCLENBQWpDLElBQThELElBRGhFO0FBQUEsS0FGdUIsQyxRQU96QkssVSxHQUFhLFlBQU07QUFDakIsVUFBTUMsaUJBQWlCLE1BQUtMLHNCQUFMLENBQTRCLE1BQUtNLEtBQWpDLENBQXZCO0FBQ0EsWUFBS0EsS0FBTCxDQUFXbEIsU0FBWCxDQUFxQmlCLGNBQXJCO0FBQ0QsSzs7QUFaRDs7O0FBUUE7OzswQkFNQUUsTSxxQkFBUztBQUFBOztBQUFBLGlCQUNxQixLQUFLRCxLQUQxQjtBQUFBLFFBQ0FmLE9BREEsVUFDQUEsT0FEQTtBQUFBLFFBQ1NRLFFBRFQsVUFDU0EsUUFEVDs7QUFFUCxRQUFNUyx1QkFBdUJqQixRQUFRa0IsSUFBUixDQUFhO0FBQUEsYUFBS0MsRUFBRUMsV0FBUDtBQUFBLEtBQWIsQ0FBN0I7QUFDQSxRQUFNQyxpQkFBaUJyQixRQUFRa0IsSUFBUixDQUFhO0FBQUEsYUFBSyxDQUFDQyxFQUFFRyxJQUFSO0FBQUEsS0FBYixDQUF2QjtBQUNBLFFBQU1DLGFBQWFiLE9BQU9DLElBQVAsQ0FBWUgsUUFBWixFQUFzQkksTUFBekM7O0FBRUEsV0FDRTtBQUFBO0FBQUE7QUFDRTtBQUNFLGtCQUFVSixRQURaO0FBRUUsMEJBQWtCLEtBQUtPLEtBQUwsQ0FBV1o7QUFGL0IsUUFERjtBQUtFLDhFQUxGO0FBTUU7QUFBQTtBQUFBO0FBQ0dILG1CQUNDQSxRQUFRd0IsR0FBUixDQUFZLFVBQUNDLE1BQUQsRUFBU0MsR0FBVDtBQUFBLGlCQUNWLDhCQUFDLFdBQUQ7QUFDRSxpQkFBUUQsT0FBT0UsRUFBZixTQUFxQkQsR0FEdkI7QUFFRSxpQkFBS0EsR0FGUDtBQUdFLHFCQUFTMUIsT0FIWDtBQUlFLG9CQUFReUIsTUFKVjtBQUtFLHNCQUFVakIsUUFMWjtBQU1FLGtDQUFzQlMsb0JBTnhCO0FBT0UsMEJBQWM7QUFBQSxxQkFBTSxPQUFLRixLQUFMLENBQVdoQixZQUFYLENBQXdCMkIsR0FBeEIsQ0FBTjtBQUFBLGFBUGhCO0FBUUUsMkJBQWU7QUFBQSxxQkFBTSxPQUFLWCxLQUFMLENBQVdhLGFBQVgsQ0FBeUJGLEdBQXpCLENBQU47QUFBQSxhQVJqQjtBQVNFLDZCQUFpQjtBQUFBLHFCQUFNLE9BQUtYLEtBQUwsQ0FBV2MsZUFBWCxDQUEyQkgsR0FBM0IsQ0FBTjtBQUFBLGFBVG5CO0FBVUUsdUJBQVcsT0FBS1gsS0FBTCxDQUFXYixTQVZ4QjtBQVdFLG1CQUFPLE9BQUthLEtBQUwsQ0FBV3RCLFVBQVgsR0FBd0I7QUFYakMsWUFEVTtBQUFBLFNBQVo7QUFGSixPQU5GO0FBd0JFO0FBQUE7QUFBQTtBQUNFLG9CQUFVNEIsa0JBQWtCLENBQUNFLFVBRC9CO0FBRUUsaUJBQU0sT0FGUjtBQUdFLG1CQUFTLEtBQUtWO0FBSGhCO0FBS0Usb0RBQUssUUFBTyxNQUFaLEdBTEY7QUFBQTtBQUFBO0FBeEJGLEtBREY7QUFrQ0QsRzs7Ozs7a0JBdkRrQlIsYTs7O0FBMERyQkEsY0FBY2IsU0FBZCxHQUEwQkEsU0FBMUI7O0FBRUEsSUFBTXNDLHNCQUFzQiwyQkFBT0MsR0FBN0Isa0JBR3FCO0FBQUEsU0FBU2hCLE1BQU1pQixLQUFOLENBQVlDLElBQVosQ0FBaUIsR0FBakIsQ0FBVDtBQUFBLENBSHJCLENBQU47O0lBVU1DLFc7Ozs7Ozs7Ozs7OztpS0FFSkMsYyxHQUFpQjtBQUFBLGFBQ2RwQixNQUFNVSxNQUFOLENBQWFXLE1BQWIsSUFBdUJyQixNQUFNUCxRQUFOLENBQWVPLE1BQU1VLE1BQU4sQ0FBYVcsTUFBNUIsRUFBb0NoQyxNQUE1RCxJQUF1RSxFQUR4RDtBQUFBLEssU0FFakJpQyxjLEdBQWlCO0FBQUEsYUFBU3RCLE1BQU1mLE9BQWY7QUFBQSxLLFNBQ2pCc0MsWSxHQUFlO0FBQUEsYUFBU3ZCLE1BQU1VLE1BQU4sQ0FBYUgsSUFBdEI7QUFBQSxLLFNBQ2ZpQixjLEdBQWlCO0FBQUEsYUFBU3hCLE1BQU1VLE1BQU4sQ0FBYVcsTUFBdEI7QUFBQSxLLFNBR2pCSSx1QixHQUEwQiw4QkFDeEIsT0FBS0wsY0FEbUIsRUFFeEIsT0FBS0UsY0FGbUIsRUFHeEIsT0FBS0MsWUFIbUIsRUFJeEIsT0FBS0MsY0FKbUIsRUFLeEIsVUFBQ25DLE1BQUQsRUFBU0osT0FBVCxFQUFrQnNCLElBQWxCLEVBQXdCYyxNQUF4QjtBQUFBLGFBQ0VoQyxPQUFPcUIsTUFBUCxDQUNFO0FBQUEsZUFDRU4sRUFBRXNCLElBQUYsSUFDQXRCLEVBQUVzQixJQUFGLEtBQVcsaUNBQWdCQyxPQUQzQixLQUVDdkIsRUFBRUcsSUFBRixLQUFXQSxJQUFYLElBQ0MsQ0FBQ3RCLFFBQVEyQyxJQUFSLENBQWE7QUFBQSxpQkFBS0MsRUFBRXRCLElBQUYsS0FBV0gsRUFBRUcsSUFBYixJQUFxQnNCLEVBQUVSLE1BQUYsS0FBYUEsTUFBdkM7QUFBQSxTQUFiLENBSEgsQ0FERjtBQUFBLE9BREYsQ0FERjtBQUFBLEtBTHdCLEM7O0FBUjFCOzs7QUFPQTs7O3dCQWdCQXBCLE0scUJBQVM7QUFBQSxrQkFXSCxLQUFLRCxLQVhGO0FBQUEsUUFFTFAsUUFGSyxXQUVMQSxRQUZLO0FBQUEsUUFHTG9CLGFBSEssV0FHTEEsYUFISztBQUFBLFFBSUxILE1BSkssV0FJTEEsTUFKSztBQUFBLFFBS0xDLEdBTEssV0FLTEEsR0FMSztBQUFBLFFBTUxULG9CQU5LLFdBTUxBLG9CQU5LO0FBQUEsUUFPTGxCLFlBUEssV0FPTEEsWUFQSztBQUFBLFFBUUxHLFVBUkssV0FRTEEsU0FSSztBQUFBLFFBU0wyQixlQVRLLFdBU0xBLGVBVEs7QUFBQSxRQVVMZ0IsS0FWSyxXQVVMQSxLQVZLO0FBQUEsUUFZQXZCLElBWkEsR0FZZ0NHLE1BWmhDLENBWUFILElBWkE7QUFBQSxRQVlNd0IsUUFaTixHQVlnQ3JCLE1BWmhDLENBWU1xQixRQVpOO0FBQUEsUUFZZ0JMLElBWmhCLEdBWWdDaEIsTUFaaEMsQ0FZZ0JnQixJQVpoQjtBQUFBLFFBWXNCTCxNQVp0QixHQVlnQ1gsTUFaaEMsQ0FZc0JXLE1BWnRCOztBQWFQLFFBQU1XLGtCQUFrQk4sUUFBUWxELFFBQVEsK0JBQWtCa0QsSUFBbEIsQ0FBUixDQUFoQztBQUNBLFFBQU1PLHFCQUFxQixLQUFLUix1QkFBTCxDQUE2QixLQUFLekIsS0FBbEMsQ0FBM0I7O0FBRUEsV0FDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLG9CQUFmO0FBQ0U7QUFBQywyQkFBRDtBQUFBLFVBQXFCLE9BQU9QLFNBQVM0QixNQUFULEVBQWlCSixLQUE3QztBQUNFO0FBQUE7QUFBQSxZQUFLLE9BQU8sRUFBQ2lCLFVBQVUsQ0FBWCxFQUFaO0FBQ0U7QUFDRSxvQkFBUUQsa0JBRFY7QUFFRSxtQkFBTzFCLElBRlQ7QUFHRSxzQkFBVSxLQUhaO0FBSUUsc0JBQVU7QUFBQSxxQkFBU3BCLFdBQVV3QixHQUFWLEVBQWUsTUFBZixFQUF1QndCLE1BQU01QixJQUE3QixDQUFUO0FBQUE7QUFKWjtBQURGLFNBREY7QUFTRSxzQ0FBQyxZQUFEO0FBQ0UsY0FBSUcsT0FBT0UsRUFEYjtBQUVFLG1CQUFRLFFBRlY7QUFHRSx1QkFBWSxPQUhkO0FBSUUsbUJBQVM1QixZQUpYO0FBS0Usc0JBQVksWUFMZDtBQU1FO0FBTkYsVUFURjtBQWlCRzBDLGlCQUFTLDBCQUFhVSxTQUF0QixJQUNDLDhCQUFDLFlBQUQ7QUFDRSxjQUFJMUIsT0FBT0UsRUFEYjtBQUVFLG1CQUFTQyxhQUZYO0FBR0UsbUJBQVEsZUFIVjtBQUlFLHFDQUpGO0FBS0Usa0JBQVFrQjtBQUxWO0FBbEJKLE9BREY7QUE0QkU7QUFBQTtBQUFBLFVBQUssV0FBVSwrQkFBZjtBQUNHcEMsZUFBT0MsSUFBUCxDQUFZSCxRQUFaLEVBQXNCSSxNQUF0QixHQUErQixDQUEvQixJQUNDO0FBQ0Usb0JBQVVKLFFBRFo7QUFFRSxvQkFBVWlCLE9BQU8yQixNQUZuQjtBQUdFLGtCQUFRM0IsT0FBT1csTUFIakI7QUFJRSxvQkFBVTtBQUFBLG1CQUFTbEMsV0FBVXdCLEdBQVYsRUFBZSxRQUFmLEVBQXlCd0IsS0FBekIsQ0FBVDtBQUFBO0FBSlosVUFGSjtBQVNHVCxnQkFDQyxDQUFDSyxRQURGLElBRUc7QUFBQTtBQUFBLFlBQUssT0FBTyxFQUFDTyxXQUFXLE1BQVosRUFBWjtBQUNFLHdDQUFDLGVBQUQ7QUFDRSxvQkFBUTVCLE1BRFY7QUFFRSxpQkFBS0MsR0FGUDtBQUdFLGtDQUFzQlQsb0JBSHhCO0FBSUUsNkJBQWlCWSxlQUpuQjtBQUtFLHVCQUFXO0FBQUEscUJBQVMzQixXQUFVd0IsR0FBVixFQUFlLE9BQWYsRUFBd0J3QixLQUF4QixDQUFUO0FBQUEsYUFMYjtBQU1FLG1CQUFPTDtBQU5UO0FBREY7QUFYTjtBQTVCRixLQURGO0FBc0RELEc7Ozs7O0FBR0gsSUFBTVMsc0JBQXNCLDJCQUFPdkIsR0FBN0IsbUJBR0s7QUFBQSxTQUNQaEIsTUFBTXdDLE1BQU4sR0FBZXhDLE1BQU15QyxLQUFOLENBQVlDLFdBQTNCLEdBQXlDMUMsTUFBTXlDLEtBQU4sQ0FBWUUsU0FEOUM7QUFBQSxDQUhMLEVBUU87QUFBQSxTQUNQM0MsTUFBTTRDLFVBQU4sR0FDSTVDLE1BQU15QyxLQUFOLENBQVl6QyxNQUFNNEMsVUFBbEIsQ0FESixHQUVJNUMsTUFBTXlDLEtBQU4sQ0FBWUksV0FIVDtBQUFBLENBUlAsQ0FBTjs7QUFlQTs7SUFDTUMsWTs7Ozs7Ozs7eUJBQ0o3QyxNLHFCQUFTO0FBQUEsa0JBQ3lELEtBQUtELEtBRDlEO0FBQUEsUUFDQStDLE9BREEsV0FDQUEsT0FEQTtBQUFBLFFBQ1NDLE9BRFQsV0FDU0EsT0FEVDtBQUFBLFFBQ2tCcEMsRUFEbEIsV0FDa0JBLEVBRGxCO0FBQUEsUUFDc0I0QixNQUR0QixXQUNzQkEsTUFEdEI7QUFBQSxRQUM4QkksVUFEOUIsV0FDOEJBLFVBRDlCO0FBQUEsUUFDMENLLFdBRDFDLFdBQzBDQSxXQUQxQzs7QUFFUCxXQUNFO0FBQUMseUJBQUQ7QUFBQSxRQUFxQixRQUFRVCxNQUE3QixFQUFxQyxZQUFZSSxVQUFqRDtBQUNFLHlDQUFNLEtBQU4sQ0FBWSxhQUFaO0FBQ0Usd0JBREY7QUFFRSxvQkFBYUksT0FBYixTQUF3QnBDLEVBRjFCO0FBR0UsZ0JBQU8sTUFIVDtBQUlFLGlCQUFTbUM7QUFKWCxRQURGO0FBT0U7QUFBQTtBQUFBLFVBQVMsSUFBT0MsT0FBUCxTQUFrQnBDLEVBQTNCLEVBQWlDLFFBQU8sT0FBeEMsRUFBZ0QsTUFBTXFDLFdBQXREO0FBQ0U7QUFBQTtBQUFBO0FBQU9EO0FBQVA7QUFERjtBQVBGLEtBREY7QUFhRCxHIiwiZmlsZSI6ImZpbHRlci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IEZpZWxkU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IHtcbiAgU2lkZVBhbmVsU2VjdGlvbixcbiAgU2lkZVBhbmVsRGl2aWRlcixcbiAgVG9vbHRpcCxcbiAgQnV0dG9uXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7QWRkLCBUcmFzaCwgQ2xvY2t9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBTb3VyY2VEYXRhU2VsZWN0b3IgZnJvbSAnLi9zb3VyY2UtZGF0YS1zZWxlY3Rvcic7XG5pbXBvcnQgU291cmNlRGF0YUNhdGFsb2cgZnJvbSAnLi9zb3VyY2UtZGF0YS1jYXRhbG9nJztcblxuaW1wb3J0ICogYXMgRmlsdGVycyBmcm9tICdjb21wb25lbnRzL2ZpbHRlcnMnO1xuaW1wb3J0IHtGSUxURVJfVFlQRVMsIEZJTFRFUl9DT01QT05FTlRTfSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuXG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHBhbmVsV2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgYWRkRmlsdGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZW1vdmVGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGZpbHRlcnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBzZXRGaWx0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHNob3dEYXRhc2V0VGFibGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuXG4gIC8vIGZpZWxkcyBjYW4gYmUgdW5kZWZpbmVkIHdoZW4gZGF0YXNldCBpcyBub3Qgc2VsZWN0ZWRcbiAgZmllbGRzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpbHRlck1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAvKiBzZWxlY3RvcnMgKi9cbiAgZGF0YXNldHNTZWxlY3RvciA9IHN0YXRlID0+IHN0YXRlLmRhdGFzZXRzO1xuICBkZWZhdWx0RGF0YXNldFNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5kYXRhc2V0c1NlbGVjdG9yLFxuICAgIGRhdGFzZXRzID0+XG4gICAgICAoT2JqZWN0LmtleXMoZGF0YXNldHMpLmxlbmd0aCAmJiBPYmplY3Qua2V5cyhkYXRhc2V0cylbMF0pIHx8IG51bGxcbiAgKTtcblxuICAvKiBhY3Rpb25zICovXG4gIF9hZGRGaWx0ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgZGVmYXVsdERhdGFzZXQgPSB0aGlzLmRlZmF1bHREYXRhc2V0U2VsZWN0b3IodGhpcy5wcm9wcyk7XG4gICAgdGhpcy5wcm9wcy5hZGRGaWx0ZXIoZGVmYXVsdERhdGFzZXQpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7ZmlsdGVycywgZGF0YXNldHN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBpc0FueUZpbHRlckFuaW1hdGluZyA9IGZpbHRlcnMuc29tZShmID0+IGYuaXNBbmltYXRpbmcpO1xuICAgIGNvbnN0IGhhZEVtcHR5RmlsdGVyID0gZmlsdGVycy5zb21lKGYgPT4gIWYubmFtZSk7XG4gICAgY29uc3QgaGFkRGF0YXNldCA9IE9iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGg7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPFNvdXJjZURhdGFDYXRhbG9nXG4gICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3RoaXMucHJvcHMuc2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgLz5cbiAgICAgICAgPFNpZGVQYW5lbERpdmlkZXIgLz5cbiAgICAgICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAge2ZpbHRlcnMgJiZcbiAgICAgICAgICAgIGZpbHRlcnMubWFwKChmaWx0ZXIsIGlkeCkgPT4gKFxuICAgICAgICAgICAgICA8RmlsdGVyUGFuZWxcbiAgICAgICAgICAgICAgICBrZXk9e2Ake2ZpbHRlci5pZH0tJHtpZHh9YH1cbiAgICAgICAgICAgICAgICBpZHg9e2lkeH1cbiAgICAgICAgICAgICAgICBmaWx0ZXJzPXtmaWx0ZXJzfVxuICAgICAgICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBpc0FueUZpbHRlckFuaW1hdGluZz17aXNBbnlGaWx0ZXJBbmltYXRpbmd9XG4gICAgICAgICAgICAgICAgcmVtb3ZlRmlsdGVyPXsoKSA9PiB0aGlzLnByb3BzLnJlbW92ZUZpbHRlcihpZHgpfVxuICAgICAgICAgICAgICAgIGVubGFyZ2VGaWx0ZXI9eygpID0+IHRoaXMucHJvcHMuZW5sYXJnZUZpbHRlcihpZHgpfVxuICAgICAgICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17KCkgPT4gdGhpcy5wcm9wcy50b2dnbGVBbmltYXRpb24oaWR4KX1cbiAgICAgICAgICAgICAgICBzZXRGaWx0ZXI9e3RoaXMucHJvcHMuc2V0RmlsdGVyfVxuICAgICAgICAgICAgICAgIHdpZHRoPXt0aGlzLnByb3BzLnBhbmVsV2lkdGggLSAyNH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBpbmFjdGl2ZT17aGFkRW1wdHlGaWx0ZXIgfHwgIWhhZERhdGFzZXR9XG4gICAgICAgICAgd2lkdGg9XCIxMDVweFwiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5fYWRkRmlsdGVyfVxuICAgICAgICA+XG4gICAgICAgICAgPEFkZCBoZWlnaHQ9XCIxMnB4XCIgLz5BZGQgRmlsdGVyXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5GaWx0ZXJNYW5hZ2VyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgRmlsdGVySGVhZGVyV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1sZWZ0LWNvbG9yOiByZ2IoJHtwcm9wcyA9PiBwcm9wcy5jb2xvci5qb2luKCcsJyl9KTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBib3JkZXItbGVmdC13aWR0aDogNHB4O1xuICBib3JkZXItbGVmdC1zdHlsZTogc29saWQ7XG4gIHBhZGRpbmc6IDEycHg7XG5gO1xuXG5jbGFzcyBGaWx0ZXJQYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIC8qIHNlbGVjdG9ycyAqL1xuICBmaWVsZHNTZWxlY3RvciA9IHByb3BzID0+XG4gICAgKHByb3BzLmZpbHRlci5kYXRhSWQgJiYgcHJvcHMuZGF0YXNldHNbcHJvcHMuZmlsdGVyLmRhdGFJZF0uZmllbGRzKSB8fCBbXTtcbiAgZmlsdGVyU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWx0ZXJzO1xuICBuYW1lU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWx0ZXIubmFtZTtcbiAgZGF0YUlkU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5maWx0ZXIuZGF0YUlkO1xuXG4gIC8vIG9ubHkgc2hvdyBjdXJyZW50IGZpZWxkIGFuZCBmaWVsZCB0aGF0J3Mgbm90IGFscmVhZHkgYmVlbiB1c2VkIGFzIGEgZmlsdGVyXG4gIGF2YWlsYWJsZUZpZWxkc1NlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgdGhpcy5maWVsZHNTZWxlY3RvcixcbiAgICB0aGlzLmZpbHRlclNlbGVjdG9yLFxuICAgIHRoaXMubmFtZVNlbGVjdG9yLFxuICAgIHRoaXMuZGF0YUlkU2VsZWN0b3IsXG4gICAgKGZpZWxkcywgZmlsdGVycywgbmFtZSwgZGF0YUlkKSA9PlxuICAgICAgZmllbGRzLmZpbHRlcihcbiAgICAgICAgZiA9PlxuICAgICAgICAgIGYudHlwZSAmJlxuICAgICAgICAgIGYudHlwZSAhPT0gQUxMX0ZJRUxEX1RZUEVTLmdlb2pzb24gJiZcbiAgICAgICAgICAoZi5uYW1lID09PSBuYW1lIHx8XG4gICAgICAgICAgICAhZmlsdGVycy5maW5kKGQgPT4gZC5uYW1lID09PSBmLm5hbWUgJiYgZC5kYXRhSWQgPT09IGRhdGFJZCkpXG4gICAgICApXG4gICk7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgZW5sYXJnZUZpbHRlcixcbiAgICAgIGZpbHRlcixcbiAgICAgIGlkeCxcbiAgICAgIGlzQW55RmlsdGVyQW5pbWF0aW5nLFxuICAgICAgcmVtb3ZlRmlsdGVyLFxuICAgICAgc2V0RmlsdGVyLFxuICAgICAgdG9nZ2xlQW5pbWF0aW9uLFxuICAgICAgd2lkdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7bmFtZSwgZW5sYXJnZWQsIHR5cGUsIGRhdGFJZH0gPSBmaWx0ZXI7XG4gICAgY29uc3QgRmlsdGVyQ29tcG9uZW50ID0gdHlwZSAmJiBGaWx0ZXJzW0ZJTFRFUl9DT01QT05FTlRTW3R5cGVdXTtcbiAgICBjb25zdCBhbGxBdmFpbGFibGVGaWVsZHMgPSB0aGlzLmF2YWlsYWJsZUZpZWxkc1NlbGVjdG9yKHRoaXMucHJvcHMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5ZXItcGFuZWwgYWN0aXZlXCI+XG4gICAgICAgIDxGaWx0ZXJIZWFkZXJXcmFwcGVyIGNvbG9yPXtkYXRhc2V0c1tkYXRhSWRdLmNvbG9yfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZmxleEdyb3c6IDF9fT5cbiAgICAgICAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgICAgICAgIGZpZWxkcz17YWxsQXZhaWxhYmxlRmllbGRzfVxuICAgICAgICAgICAgICB2YWx1ZT17bmFtZX1cbiAgICAgICAgICAgICAgZXJhc2FibGU9e2ZhbHNlfVxuICAgICAgICAgICAgICBvblNlbGVjdD17dmFsdWUgPT4gc2V0RmlsdGVyKGlkeCwgJ25hbWUnLCB2YWx1ZS5uYW1lKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEZpbHRlckFjdGlvblxuICAgICAgICAgICAgaWQ9e2ZpbHRlci5pZH1cbiAgICAgICAgICAgIHRvb2x0aXA9XCJkZWxldGVcIlxuICAgICAgICAgICAgdG9vbHRpcFR5cGU9XCJlcnJvclwiXG4gICAgICAgICAgICBvbkNsaWNrPXtyZW1vdmVGaWx0ZXJ9XG4gICAgICAgICAgICBob3ZlckNvbG9yPXsnZXJyb3JDb2xvcid9XG4gICAgICAgICAgICBJY29uQ29tcG9uZW50PXtUcmFzaH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHt0eXBlID09PSBGSUxURVJfVFlQRVMudGltZVJhbmdlICYmIChcbiAgICAgICAgICAgIDxGaWx0ZXJBY3Rpb25cbiAgICAgICAgICAgICAgaWQ9e2ZpbHRlci5pZH1cbiAgICAgICAgICAgICAgb25DbGljaz17ZW5sYXJnZUZpbHRlcn1cbiAgICAgICAgICAgICAgdG9vbHRpcD1cIlRpbWUgUGxheWJhY2tcIlxuICAgICAgICAgICAgICBJY29uQ29tcG9uZW50PXtDbG9ja31cbiAgICAgICAgICAgICAgYWN0aXZlPXtlbmxhcmdlZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9GaWx0ZXJIZWFkZXJXcmFwcGVyPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNvZnQtdGlueSBsYXllci1wYW5lbF9fY29uZmlnXCI+XG4gICAgICAgICAge09iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGggPiAxICYmIChcbiAgICAgICAgICAgIDxTb3VyY2VEYXRhU2VsZWN0b3JcbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17ZmlsdGVyLmZyZWV6ZX1cbiAgICAgICAgICAgICAgZGF0YUlkPXtmaWx0ZXIuZGF0YUlkfVxuICAgICAgICAgICAgICBvblNlbGVjdD17dmFsdWUgPT4gc2V0RmlsdGVyKGlkeCwgJ2RhdGFJZCcsIHZhbHVlKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7dHlwZSAmJlxuICAgICAgICAgICAgIWVubGFyZ2VkICYmIChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJzI0cHgnfX0+XG4gICAgICAgICAgICAgICAgPEZpbHRlckNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgZmlsdGVyPXtmaWx0ZXJ9XG4gICAgICAgICAgICAgICAgICBpZHg9e2lkeH1cbiAgICAgICAgICAgICAgICAgIGlzQW55RmlsdGVyQW5pbWF0aW5nPXtpc0FueUZpbHRlckFuaW1hdGluZ31cbiAgICAgICAgICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17dG9nZ2xlQW5pbWF0aW9ufVxuICAgICAgICAgICAgICAgICAgc2V0RmlsdGVyPXt2YWx1ZSA9PiBzZXRGaWx0ZXIoaWR4LCAndmFsdWUnLCB2YWx1ZSl9XG4gICAgICAgICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgRmlsdGVyQWN0aW9uV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1sZWZ0OiAxMnB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuYWN0aXZlQ29sb3IgOiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+XG4gICAgICBwcm9wcy5ob3ZlckNvbG9yXG4gICAgICAgID8gcHJvcHMudGhlbWVbcHJvcHMuaG92ZXJDb2xvcl1cbiAgICAgICAgOiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbi8vIE5lZWQgdG8gdXNlIHJlYWN0IGNsYXNzIHRvIGFjY2VzcyBwcm9wcy5jb21wb25lbnRcbmNsYXNzIEZpbHRlckFjdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7b25DbGljaywgdG9vbHRpcCwgaWQsIGFjdGl2ZSwgaG92ZXJDb2xvciwgdG9vbHRpcFR5cGV9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEZpbHRlckFjdGlvbldyYXBwZXIgYWN0aXZlPXthY3RpdmV9IGhvdmVyQ29sb3I9e2hvdmVyQ29sb3J9PlxuICAgICAgICA8dGhpcy5wcm9wcy5JY29uQ29tcG9uZW50XG4gICAgICAgICAgZGF0YS10aXBcbiAgICAgICAgICBkYXRhLWZvcj17YCR7dG9vbHRpcH1fJHtpZH1gfVxuICAgICAgICAgIGhlaWdodD1cIjE4cHhcIlxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgIC8+XG4gICAgICAgIDxUb29sdGlwIGlkPXtgJHt0b29sdGlwfV8ke2lkfWB9IGVmZmVjdD1cInNvbGlkXCIgdHlwZT17dG9vbHRpcFR5cGV9PlxuICAgICAgICAgIDxzcGFuPnt0b29sdGlwfTwvc3Bhbj5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgPC9GaWx0ZXJBY3Rpb25XcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==