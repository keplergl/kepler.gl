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

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  margin-bottom: 12px;\n  border-radius: 1px;\n\n  .filter-panel__filter {\n    margin-top: 24px;\n  }\n'], ['\n  margin-bottom: 12px;\n  border-radius: 1px;\n\n  .filter-panel__filter {\n    margin-top: 24px;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  cursor: pointer;\n  padding: 10px 12px;\n'], ['\n  cursor: pointer;\n  padding: 10px 12px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  padding: 12px;\n'], ['\n  background-color: ', ';\n  padding: 12px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reselect = require('reselect');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _panelHeaderAction = require('../panel-header-action');

var _panelHeaderAction2 = _interopRequireDefault(_panelHeaderAction);

var _fieldSelector = require('../../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _icons = require('../../common/icons');

var _sourceDataSelector = require('../source-data-selector');

var _sourceDataSelector2 = _interopRequireDefault(_sourceDataSelector);

var _styledComponents3 = require('../../common/styled-components');

var _filters = require('../../filters');

var Filters = _interopRequireWildcard(_filters);

var _filterUtils = require('../../../utils/filter-utils');

var _defaultSettings = require('../../../constants/default-settings');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  idx: _propTypes2.default.number,
  filters: _propTypes2.default.array.isRequired,
  filter: _propTypes2.default.object.isRequired,
  setFilter: _propTypes2.default.func.isRequired,
  removeFilter: _propTypes2.default.func.isRequired,
  enlargeFilter: _propTypes2.default.func.isRequired,
  toggleAnimation: _propTypes2.default.func.isRequired,
  datasets: _propTypes2.default.array,
  showDatasetTable: _propTypes2.default.func,
  isAnyFilterAnimating: _propTypes2.default.bool
};

var StyledFilterPanel = _styledComponents2.default.div(_templateObject);

var StyledFilterHeader = _styledComponents3.StyledPanelHeader.extend(_templateObject2);

var StyledFilterContent = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.panelBackground;
});

var FilterPanel = function (_Component) {
  (0, _inherits3.default)(FilterPanel, _Component);

  function FilterPanel() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FilterPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = FilterPanel.__proto__ || Object.getPrototypeOf(FilterPanel)).call.apply(_ref, [this].concat(args))), _this), _this.fieldsSelector = function (props) {
      return props.filter.dataId && props.datasets[props.filter.dataId].fields || [];
    }, _this.filterSelector = function (props) {
      return props.filters;
    }, _this.nameSelector = function (props) {
      return props.filter.name;
    }, _this.dataIdSelector = function (props) {
      return props.filter.dataId;
    }, _this.availableFieldsSelector = (0, _reselect.createSelector)(_this.fieldsSelector, _this.filterSelector, _this.nameSelector, _this.dataIdSelector, function (fields, filters, name, dataId) {
      return fields.filter(function (f) {
        return f.type && f.type !== _defaultSettings.ALL_FIELD_TYPES.geojson && (f.name === name || !filters.find(function (d) {
          return d.name === f.name && d.dataId === dataId;
        }));
      });
    }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }
  /* selectors */


  // only show current field and field that's not already been used as a filter


  (0, _createClass3.default)(FilterPanel, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          datasets = _props.datasets,
          enlargeFilter = _props.enlargeFilter,
          filter = _props.filter,
          idx = _props.idx,
          isAnyFilterAnimating = _props.isAnyFilterAnimating,
          removeFilter = _props.removeFilter,
          _setFilter = _props.setFilter,
          toggleAnimation = _props.toggleAnimation;
      var name = filter.name,
          enlarged = filter.enlarged,
          type = filter.type,
          dataId = filter.dataId;

      var FilterComponent = type && Filters[_filterUtils.FILTER_COMPONENTS[type]];
      var allAvailableFields = this.availableFieldsSelector(this.props);

      return _react2.default.createElement(
        StyledFilterPanel,
        { className: 'filter-panel' },
        _react2.default.createElement(
          StyledFilterHeader,
          { className: 'filter-panel__header',
            labelRCGColorValues: datasets[dataId].color },
          _react2.default.createElement(
            'div',
            { style: { flexGrow: 1 } },
            _react2.default.createElement(_fieldSelector2.default, {
              inputTheme: 'secondary',
              fields: allAvailableFields,
              value: name,
              erasable: false,
              onSelect: function onSelect(value) {
                return _setFilter(idx, 'name', value.name);
              }
            })
          ),
          _react2.default.createElement(_panelHeaderAction2.default, {
            id: filter.id,
            tooltip: 'delete',
            tooltipType: 'error',
            onClick: removeFilter,
            hoverColor: 'errorColor',
            IconComponent: _icons.Trash
          }),
          type === _filterUtils.FILTER_TYPES.timeRange && _react2.default.createElement(_panelHeaderAction2.default, {
            id: filter.id,
            onClick: enlargeFilter,
            tooltip: 'Time Playback',
            IconComponent: _icons.Clock,
            active: enlarged
          })
        ),
        _react2.default.createElement(
          StyledFilterContent,
          { className: 'filter-panel__content' },
          Object.keys(datasets).length > 1 && _react2.default.createElement(_sourceDataSelector2.default, {
            inputTheme: 'secondary',
            datasets: datasets,
            disabled: filter.freeze,
            dataId: filter.dataId,
            onSelect: function onSelect(value) {
              return _setFilter(idx, 'dataId', value);
            }
          }),
          type && !enlarged && _react2.default.createElement(
            'div',
            { className: 'filter-panel__filter' },
            _react2.default.createElement(FilterComponent, {
              filter: filter,
              idx: idx,
              isAnyFilterAnimating: isAnyFilterAnimating,
              toggleAnimation: toggleAnimation,
              setFilter: function setFilter(value) {
                return _setFilter(idx, 'value', value);
              }
            })
          )
        )
      );
    }
  }]);
  return FilterPanel;
}(_react.Component);

exports.default = FilterPanel;


FilterPanel.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLXBhbmVsL2ZpbHRlci1wYW5lbC5qcyJdLCJuYW1lcyI6WyJGaWx0ZXJzIiwicHJvcFR5cGVzIiwiaWR4IiwibnVtYmVyIiwiZmlsdGVycyIsImFycmF5IiwiaXNSZXF1aXJlZCIsImZpbHRlciIsIm9iamVjdCIsInNldEZpbHRlciIsImZ1bmMiLCJyZW1vdmVGaWx0ZXIiLCJlbmxhcmdlRmlsdGVyIiwidG9nZ2xlQW5pbWF0aW9uIiwiZGF0YXNldHMiLCJzaG93RGF0YXNldFRhYmxlIiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJib29sIiwiU3R5bGVkRmlsdGVyUGFuZWwiLCJkaXYiLCJTdHlsZWRGaWx0ZXJIZWFkZXIiLCJleHRlbmQiLCJTdHlsZWRGaWx0ZXJDb250ZW50IiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQmFja2dyb3VuZCIsIkZpbHRlclBhbmVsIiwiZmllbGRzU2VsZWN0b3IiLCJkYXRhSWQiLCJmaWVsZHMiLCJmaWx0ZXJTZWxlY3RvciIsIm5hbWVTZWxlY3RvciIsIm5hbWUiLCJkYXRhSWRTZWxlY3RvciIsImF2YWlsYWJsZUZpZWxkc1NlbGVjdG9yIiwiZiIsInR5cGUiLCJnZW9qc29uIiwiZmluZCIsImQiLCJlbmxhcmdlZCIsIkZpbHRlckNvbXBvbmVudCIsImFsbEF2YWlsYWJsZUZpZWxkcyIsImNvbG9yIiwiZmxleEdyb3ciLCJ2YWx1ZSIsImlkIiwidGltZVJhbmdlIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImZyZWV6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOztJQUFZQSxPOztBQUVaOztBQUNBOzs7Ozs7QUFFQSxJQUFNQyxZQUFZO0FBQ2hCQyxPQUFLLG9CQUFVQyxNQURD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eEI7QUFJRSwrQkFBaUJILGVBSm5CO0FBS0UseUJBQVc7QUFBQSx1QkFBU0osV0FBVVAsR0FBVixFQUFlLE9BQWYsRUFBd0IyQyxLQUF4QixDQUFUO0FBQUE7QUFMYjtBQURGO0FBWko7QUE5QkYsT0FERjtBQXdERDs7Ozs7a0JBL0ZrQm5CLFc7OztBQWtHckJBLFlBQVl6QixTQUFaLEdBQXdCQSxTQUF4QiIsImZpbGUiOiJmaWx0ZXItcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQYW5lbEhlYWRlckFjdGlvbiBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbic7XG5pbXBvcnQgRmllbGRTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQge1RyYXNoLCBDbG9ja30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IFNvdXJjZURhdGFTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtc2VsZWN0b3InO1xuaW1wb3J0IHtTdHlsZWRQYW5lbEhlYWRlcn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0ICogYXMgRmlsdGVycyBmcm9tICdjb21wb25lbnRzL2ZpbHRlcnMnO1xuXG5pbXBvcnQge0ZJTFRFUl9UWVBFUywgRklMVEVSX0NPTVBPTkVOVFN9IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGlkeDogUHJvcFR5cGVzLm51bWJlcixcbiAgZmlsdGVyczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGZpbHRlcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBzZXRGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZUZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZW5sYXJnZUZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdG9nZ2xlQW5pbWF0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBkYXRhc2V0czogUHJvcFR5cGVzLmFycmF5LFxuICBzaG93RGF0YXNldFRhYmxlOiBQcm9wVHlwZXMuZnVuYyxcbiAgaXNBbnlGaWx0ZXJBbmltYXRpbmc6IFByb3BUeXBlcy5ib29sXG59O1xuXG5jb25zdCBTdHlsZWRGaWx0ZXJQYW5lbCA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcblxuICAuZmlsdGVyLXBhbmVsX19maWx0ZXIge1xuICAgIG1hcmdpbi10b3A6IDI0cHg7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZEZpbHRlckhlYWRlciA9IFN0eWxlZFBhbmVsSGVhZGVyLmV4dGVuZGBcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAxMHB4IDEycHg7XG5gO1xuXG5jb25zdCBTdHlsZWRGaWx0ZXJDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICBwYWRkaW5nOiAxMnB4O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsdGVyUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAvKiBzZWxlY3RvcnMgKi9cbiAgZmllbGRzU2VsZWN0b3IgPSBwcm9wcyA9PlxuICAgIChwcm9wcy5maWx0ZXIuZGF0YUlkICYmIHByb3BzLmRhdGFzZXRzW3Byb3BzLmZpbHRlci5kYXRhSWRdLmZpZWxkcykgfHwgW107XG4gIGZpbHRlclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmlsdGVycztcbiAgbmFtZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmlsdGVyLm5hbWU7XG4gIGRhdGFJZFNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmlsdGVyLmRhdGFJZDtcblxuICAvLyBvbmx5IHNob3cgY3VycmVudCBmaWVsZCBhbmQgZmllbGQgdGhhdCdzIG5vdCBhbHJlYWR5IGJlZW4gdXNlZCBhcyBhIGZpbHRlclxuICBhdmFpbGFibGVGaWVsZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZmllbGRzU2VsZWN0b3IsXG4gICAgdGhpcy5maWx0ZXJTZWxlY3RvcixcbiAgICB0aGlzLm5hbWVTZWxlY3RvcixcbiAgICB0aGlzLmRhdGFJZFNlbGVjdG9yLFxuICAgIChmaWVsZHMsIGZpbHRlcnMsIG5hbWUsIGRhdGFJZCkgPT5cbiAgICAgIGZpZWxkcy5maWx0ZXIoXG4gICAgICAgIGYgPT5cbiAgICAgICAgICBmLnR5cGUgJiZcbiAgICAgICAgICBmLnR5cGUgIT09IEFMTF9GSUVMRF9UWVBFUy5nZW9qc29uICYmXG4gICAgICAgICAgKGYubmFtZSA9PT0gbmFtZSB8fFxuICAgICAgICAgICAgIWZpbHRlcnMuZmluZChkID0+IGQubmFtZSA9PT0gZi5uYW1lICYmIGQuZGF0YUlkID09PSBkYXRhSWQpKVxuICAgICAgKVxuICApO1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBkYXRhc2V0cyxcbiAgICAgIGVubGFyZ2VGaWx0ZXIsXG4gICAgICBmaWx0ZXIsXG4gICAgICBpZHgsXG4gICAgICBpc0FueUZpbHRlckFuaW1hdGluZyxcbiAgICAgIHJlbW92ZUZpbHRlcixcbiAgICAgIHNldEZpbHRlcixcbiAgICAgIHRvZ2dsZUFuaW1hdGlvblxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtuYW1lLCBlbmxhcmdlZCwgdHlwZSwgZGF0YUlkfSA9IGZpbHRlcjtcbiAgICBjb25zdCBGaWx0ZXJDb21wb25lbnQgPSB0eXBlICYmIEZpbHRlcnNbRklMVEVSX0NPTVBPTkVOVFNbdHlwZV1dO1xuICAgIGNvbnN0IGFsbEF2YWlsYWJsZUZpZWxkcyA9IHRoaXMuYXZhaWxhYmxlRmllbGRzU2VsZWN0b3IodGhpcy5wcm9wcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZEZpbHRlclBhbmVsIGNsYXNzTmFtZT1cImZpbHRlci1wYW5lbFwiPlxuICAgICAgICA8U3R5bGVkRmlsdGVySGVhZGVyIGNsYXNzTmFtZT1cImZpbHRlci1wYW5lbF9faGVhZGVyXCJcbiAgICAgICAgICBsYWJlbFJDR0NvbG9yVmFsdWVzPXtkYXRhc2V0c1tkYXRhSWRdLmNvbG9yfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZmxleEdyb3c6IDF9fT5cbiAgICAgICAgICAgIDxGaWVsZFNlbGVjdG9yXG4gICAgICAgICAgICAgIGlucHV0VGhlbWU9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICBmaWVsZHM9e2FsbEF2YWlsYWJsZUZpZWxkc31cbiAgICAgICAgICAgICAgdmFsdWU9e25hbWV9XG4gICAgICAgICAgICAgIGVyYXNhYmxlPXtmYWxzZX1cbiAgICAgICAgICAgICAgb25TZWxlY3Q9e3ZhbHVlID0+IHNldEZpbHRlcihpZHgsICduYW1lJywgdmFsdWUubmFtZSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICAgICAgaWQ9e2ZpbHRlci5pZH1cbiAgICAgICAgICAgIHRvb2x0aXA9XCJkZWxldGVcIlxuICAgICAgICAgICAgdG9vbHRpcFR5cGU9XCJlcnJvclwiXG4gICAgICAgICAgICBvbkNsaWNrPXtyZW1vdmVGaWx0ZXJ9XG4gICAgICAgICAgICBob3ZlckNvbG9yPXsnZXJyb3JDb2xvcid9XG4gICAgICAgICAgICBJY29uQ29tcG9uZW50PXtUcmFzaH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHt0eXBlID09PSBGSUxURVJfVFlQRVMudGltZVJhbmdlICYmIChcbiAgICAgICAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICAgICAgICBpZD17ZmlsdGVyLmlkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXtlbmxhcmdlRmlsdGVyfVxuICAgICAgICAgICAgICB0b29sdGlwPVwiVGltZSBQbGF5YmFja1wiXG4gICAgICAgICAgICAgIEljb25Db21wb25lbnQ9e0Nsb2NrfVxuICAgICAgICAgICAgICBhY3RpdmU9e2VubGFyZ2VkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L1N0eWxlZEZpbHRlckhlYWRlcj5cbiAgICAgICAgPFN0eWxlZEZpbHRlckNvbnRlbnQgY2xhc3NOYW1lPVwiZmlsdGVyLXBhbmVsX19jb250ZW50XCI+XG4gICAgICAgICAge09iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGggPiAxICYmIChcbiAgICAgICAgICAgIDxTb3VyY2VEYXRhU2VsZWN0b3JcbiAgICAgICAgICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2ZpbHRlci5mcmVlemV9XG4gICAgICAgICAgICAgIGRhdGFJZD17ZmlsdGVyLmRhdGFJZH1cbiAgICAgICAgICAgICAgb25TZWxlY3Q9e3ZhbHVlID0+IHNldEZpbHRlcihpZHgsICdkYXRhSWQnLCB2YWx1ZSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAge3R5cGUgJiZcbiAgICAgICAgICAhZW5sYXJnZWQgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWx0ZXItcGFuZWxfX2ZpbHRlclwiPlxuICAgICAgICAgICAgICA8RmlsdGVyQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgZmlsdGVyPXtmaWx0ZXJ9XG4gICAgICAgICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgICAgICAgaXNBbnlGaWx0ZXJBbmltYXRpbmc9e2lzQW55RmlsdGVyQW5pbWF0aW5nfVxuICAgICAgICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17dG9nZ2xlQW5pbWF0aW9ufVxuICAgICAgICAgICAgICAgIHNldEZpbHRlcj17dmFsdWUgPT4gc2V0RmlsdGVyKGlkeCwgJ3ZhbHVlJywgdmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdHlsZWRGaWx0ZXJDb250ZW50PlxuICAgICAgPC9TdHlsZWRGaWx0ZXJQYW5lbD5cbiAgICApO1xuICB9XG59XG5cbkZpbHRlclBhbmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==