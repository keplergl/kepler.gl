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

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-bottom: 12px;\n  border-radius: 1px;\n\n  .filter-panel__filter {\n    margin-top: 24px;\n  }\n'], ['\n  margin-bottom: 12px;\n  border-radius: 1px;\n\n  .filter-panel__filter {\n    margin-top: 24px;\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  cursor: pointer;\n  padding: 10px 12px;\n'], ['\n  cursor: pointer;\n  padding: 10px 12px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  padding: 12px;\n'], ['\n  background-color: ', ';\n  padding: 12px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

var StyledFilterPanel = _styledComponents2.default.div(_templateObject);

var StyledFilterHeader = _styledComponents3.StyledPanelHeader.extend(_templateObject2);

var StyledFilterContent = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.panelBackground;
});

var FilterPanel = function (_Component) {
  (0, _inherits3.default)(FilterPanel, _Component);

  function FilterPanel() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FilterPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.fieldsSelector = function (props) {
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


  FilterPanel.prototype.render = function render() {
    var _props = this.props,
        datasets = _props.datasets,
        enlargeFilter = _props.enlargeFilter,
        filter = _props.filter,
        idx = _props.idx,
        isAnyFilterAnimating = _props.isAnyFilterAnimating,
        removeFilter = _props.removeFilter,
        _setFilter = _props.setFilter,
        toggleAnimation = _props.toggleAnimation,
        width = _props.width;
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
            },
            width: width
          })
        )
      )
    );
  };

  return FilterPanel;
}(_react.Component);

exports.default = FilterPanel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvZmlsdGVyLXBhbmVsL2ZpbHRlci1wYW5lbC5qcyJdLCJuYW1lcyI6WyJGaWx0ZXJzIiwiU3R5bGVkRmlsdGVyUGFuZWwiLCJkaXYiLCJTdHlsZWRGaWx0ZXJIZWFkZXIiLCJleHRlbmQiLCJTdHlsZWRGaWx0ZXJDb250ZW50IiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQmFja2dyb3VuZCIsIkZpbHRlclBhbmVsIiwiZmllbGRzU2VsZWN0b3IiLCJmaWx0ZXIiLCJkYXRhSWQiLCJkYXRhc2V0cyIsImZpZWxkcyIsImZpbHRlclNlbGVjdG9yIiwiZmlsdGVycyIsIm5hbWVTZWxlY3RvciIsIm5hbWUiLCJkYXRhSWRTZWxlY3RvciIsImF2YWlsYWJsZUZpZWxkc1NlbGVjdG9yIiwiZiIsInR5cGUiLCJnZW9qc29uIiwiZmluZCIsImQiLCJyZW5kZXIiLCJlbmxhcmdlRmlsdGVyIiwiaWR4IiwiaXNBbnlGaWx0ZXJBbmltYXRpbmciLCJyZW1vdmVGaWx0ZXIiLCJzZXRGaWx0ZXIiLCJ0b2dnbGVBbmltYXRpb24iLCJ3aWR0aCIsImVubGFyZ2VkIiwiRmlsdGVyQ29tcG9uZW50IiwiYWxsQXZhaWxhYmxlRmllbGRzIiwiY29sb3IiLCJmbGV4R3JvdyIsInZhbHVlIiwiaWQiLCJ0aW1lUmFuZ2UiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZnJlZXplIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0lBQVlBLE87O0FBRVo7O0FBQ0E7Ozs7OztBQUVBLElBQU1DLG9CQUFvQiwyQkFBT0MsR0FBM0IsaUJBQU47O0FBU0EsSUFBTUMscUJBQXFCLHFDQUFrQkMsTUFBdkMsa0JBQU47O0FBS0EsSUFBTUMsc0JBQXNCLDJCQUFPSCxHQUE3QixtQkFDZ0I7QUFB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QixJQUNDO0FBQ0UsY0FBSTlCLE9BQU82QixFQURiO0FBRUUsbUJBQVNiLGFBRlg7QUFHRSxtQkFBUSxlQUhWO0FBSUUscUNBSkY7QUFLRSxrQkFBUU87QUFMVjtBQXBCSixPQURGO0FBOEJFO0FBQUMsMkJBQUQ7QUFBQSxVQUFxQixXQUFVLHVCQUEvQjtBQUNHUSxlQUFPQyxJQUFQLENBQVk5QixRQUFaLEVBQXNCK0IsTUFBdEIsR0FBK0IsQ0FBL0IsSUFDQztBQUNFLHNCQUFXLFdBRGI7QUFFRSxvQkFBVS9CLFFBRlo7QUFHRSxvQkFBVUYsT0FBT2tDLE1BSG5CO0FBSUUsa0JBQVFsQyxPQUFPQyxNQUpqQjtBQUtFLG9CQUFVO0FBQUEsbUJBQVNtQixXQUFVSCxHQUFWLEVBQWUsUUFBZixFQUF5QlcsS0FBekIsQ0FBVDtBQUFBO0FBTFosVUFGSjtBQVVHakIsZ0JBQ0QsQ0FBQ1ksUUFEQSxJQUVDO0FBQUE7QUFBQSxZQUFLLFdBQVUsc0JBQWY7QUFDRSx3Q0FBQyxlQUFEO0FBQ0Usb0JBQVF2QixNQURWO0FBRUUsaUJBQUtpQixHQUZQO0FBR0Usa0NBQXNCQyxvQkFIeEI7QUFJRSw2QkFBaUJHLGVBSm5CO0FBS0UsdUJBQVc7QUFBQSxxQkFBU0QsV0FBVUgsR0FBVixFQUFlLE9BQWYsRUFBd0JXLEtBQXhCLENBQVQ7QUFBQSxhQUxiO0FBTUUsbUJBQU9OO0FBTlQ7QUFERjtBQVpKO0FBOUJGLEtBREY7QUF5REQsRzs7Ozs7a0JBakdrQnhCLFciLCJmaWxlIjoiZmlsdGVyLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQYW5lbEhlYWRlckFjdGlvbiBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbic7XG5pbXBvcnQgRmllbGRTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQge1RyYXNoLCBDbG9ja30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IFNvdXJjZURhdGFTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvc291cmNlLWRhdGEtc2VsZWN0b3InO1xuaW1wb3J0IHtTdHlsZWRQYW5lbEhlYWRlcn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0ICogYXMgRmlsdGVycyBmcm9tICdjb21wb25lbnRzL2ZpbHRlcnMnO1xuXG5pbXBvcnQge0ZJTFRFUl9UWVBFUywgRklMVEVSX0NPTVBPTkVOVFN9IGZyb20gJ3V0aWxzL2ZpbHRlci11dGlscyc7XG5pbXBvcnQge0FMTF9GSUVMRF9UWVBFU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBTdHlsZWRGaWx0ZXJQYW5lbCA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcblxuICAuZmlsdGVyLXBhbmVsX19maWx0ZXIge1xuICAgIG1hcmdpbi10b3A6IDI0cHg7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZEZpbHRlckhlYWRlciA9IFN0eWxlZFBhbmVsSGVhZGVyLmV4dGVuZGBcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAxMHB4IDEycHg7XG5gO1xuXG5jb25zdCBTdHlsZWRGaWx0ZXJDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICBwYWRkaW5nOiAxMnB4O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsdGVyUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAvKiBzZWxlY3RvcnMgKi9cbiAgZmllbGRzU2VsZWN0b3IgPSBwcm9wcyA9PlxuICAgIChwcm9wcy5maWx0ZXIuZGF0YUlkICYmIHByb3BzLmRhdGFzZXRzW3Byb3BzLmZpbHRlci5kYXRhSWRdLmZpZWxkcykgfHwgW107XG4gIGZpbHRlclNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmlsdGVycztcbiAgbmFtZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmlsdGVyLm5hbWU7XG4gIGRhdGFJZFNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuZmlsdGVyLmRhdGFJZDtcblxuICAvLyBvbmx5IHNob3cgY3VycmVudCBmaWVsZCBhbmQgZmllbGQgdGhhdCdzIG5vdCBhbHJlYWR5IGJlZW4gdXNlZCBhcyBhIGZpbHRlclxuICBhdmFpbGFibGVGaWVsZHNTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuZmllbGRzU2VsZWN0b3IsXG4gICAgdGhpcy5maWx0ZXJTZWxlY3RvcixcbiAgICB0aGlzLm5hbWVTZWxlY3RvcixcbiAgICB0aGlzLmRhdGFJZFNlbGVjdG9yLFxuICAgIChmaWVsZHMsIGZpbHRlcnMsIG5hbWUsIGRhdGFJZCkgPT5cbiAgICAgIGZpZWxkcy5maWx0ZXIoXG4gICAgICAgIGYgPT5cbiAgICAgICAgICBmLnR5cGUgJiZcbiAgICAgICAgICBmLnR5cGUgIT09IEFMTF9GSUVMRF9UWVBFUy5nZW9qc29uICYmXG4gICAgICAgICAgKGYubmFtZSA9PT0gbmFtZSB8fFxuICAgICAgICAgICAgIWZpbHRlcnMuZmluZChkID0+IGQubmFtZSA9PT0gZi5uYW1lICYmIGQuZGF0YUlkID09PSBkYXRhSWQpKVxuICAgICAgKVxuICApO1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBkYXRhc2V0cyxcbiAgICAgIGVubGFyZ2VGaWx0ZXIsXG4gICAgICBmaWx0ZXIsXG4gICAgICBpZHgsXG4gICAgICBpc0FueUZpbHRlckFuaW1hdGluZyxcbiAgICAgIHJlbW92ZUZpbHRlcixcbiAgICAgIHNldEZpbHRlcixcbiAgICAgIHRvZ2dsZUFuaW1hdGlvbixcbiAgICAgIHdpZHRoXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge25hbWUsIGVubGFyZ2VkLCB0eXBlLCBkYXRhSWR9ID0gZmlsdGVyO1xuICAgIGNvbnN0IEZpbHRlckNvbXBvbmVudCA9IHR5cGUgJiYgRmlsdGVyc1tGSUxURVJfQ09NUE9ORU5UU1t0eXBlXV07XG4gICAgY29uc3QgYWxsQXZhaWxhYmxlRmllbGRzID0gdGhpcy5hdmFpbGFibGVGaWVsZHNTZWxlY3Rvcih0aGlzLnByb3BzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkRmlsdGVyUGFuZWwgY2xhc3NOYW1lPVwiZmlsdGVyLXBhbmVsXCI+XG4gICAgICAgIDxTdHlsZWRGaWx0ZXJIZWFkZXIgY2xhc3NOYW1lPVwiZmlsdGVyLXBhbmVsX19oZWFkZXJcIlxuICAgICAgICAgIGxhYmVsUkNHQ29sb3JWYWx1ZXM9e2RhdGFzZXRzW2RhdGFJZF0uY29sb3J9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tmbGV4R3JvdzogMX19PlxuICAgICAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgIGZpZWxkcz17YWxsQXZhaWxhYmxlRmllbGRzfVxuICAgICAgICAgICAgICB2YWx1ZT17bmFtZX1cbiAgICAgICAgICAgICAgZXJhc2FibGU9e2ZhbHNlfVxuICAgICAgICAgICAgICBvblNlbGVjdD17dmFsdWUgPT4gc2V0RmlsdGVyKGlkeCwgJ25hbWUnLCB2YWx1ZS5uYW1lKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFBhbmVsSGVhZGVyQWN0aW9uXG4gICAgICAgICAgICBpZD17ZmlsdGVyLmlkfVxuICAgICAgICAgICAgdG9vbHRpcD1cImRlbGV0ZVwiXG4gICAgICAgICAgICB0b29sdGlwVHlwZT1cImVycm9yXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3JlbW92ZUZpbHRlcn1cbiAgICAgICAgICAgIGhvdmVyQ29sb3I9eydlcnJvckNvbG9yJ31cbiAgICAgICAgICAgIEljb25Db21wb25lbnQ9e1RyYXNofVxuICAgICAgICAgIC8+XG4gICAgICAgICAge3R5cGUgPT09IEZJTFRFUl9UWVBFUy50aW1lUmFuZ2UgJiYgKFxuICAgICAgICAgICAgPFBhbmVsSGVhZGVyQWN0aW9uXG4gICAgICAgICAgICAgIGlkPXtmaWx0ZXIuaWR9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2VubGFyZ2VGaWx0ZXJ9XG4gICAgICAgICAgICAgIHRvb2x0aXA9XCJUaW1lIFBsYXliYWNrXCJcbiAgICAgICAgICAgICAgSWNvbkNvbXBvbmVudD17Q2xvY2t9XG4gICAgICAgICAgICAgIGFjdGl2ZT17ZW5sYXJnZWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU3R5bGVkRmlsdGVySGVhZGVyPlxuICAgICAgICA8U3R5bGVkRmlsdGVyQ29udGVudCBjbGFzc05hbWU9XCJmaWx0ZXItcGFuZWxfX2NvbnRlbnRcIj5cbiAgICAgICAgICB7T2JqZWN0LmtleXMoZGF0YXNldHMpLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgICAgPFNvdXJjZURhdGFTZWxlY3RvclxuICAgICAgICAgICAgICBpbnB1dFRoZW1lPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17ZmlsdGVyLmZyZWV6ZX1cbiAgICAgICAgICAgICAgZGF0YUlkPXtmaWx0ZXIuZGF0YUlkfVxuICAgICAgICAgICAgICBvblNlbGVjdD17dmFsdWUgPT4gc2V0RmlsdGVyKGlkeCwgJ2RhdGFJZCcsIHZhbHVlKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7dHlwZSAmJlxuICAgICAgICAgICFlbmxhcmdlZCAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1wYW5lbF9fZmlsdGVyXCI+XG4gICAgICAgICAgICAgIDxGaWx0ZXJDb21wb25lbnRcbiAgICAgICAgICAgICAgICBmaWx0ZXI9e2ZpbHRlcn1cbiAgICAgICAgICAgICAgICBpZHg9e2lkeH1cbiAgICAgICAgICAgICAgICBpc0FueUZpbHRlckFuaW1hdGluZz17aXNBbnlGaWx0ZXJBbmltYXRpbmd9XG4gICAgICAgICAgICAgICAgdG9nZ2xlQW5pbWF0aW9uPXt0b2dnbGVBbmltYXRpb259XG4gICAgICAgICAgICAgICAgc2V0RmlsdGVyPXt2YWx1ZSA9PiBzZXRGaWx0ZXIoaWR4LCAndmFsdWUnLCB2YWx1ZSl9XG4gICAgICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdHlsZWRGaWx0ZXJDb250ZW50PlxuICAgICAgPC9TdHlsZWRGaWx0ZXJQYW5lbD5cbiAgICApO1xuICB9XG59XG4iXX0=