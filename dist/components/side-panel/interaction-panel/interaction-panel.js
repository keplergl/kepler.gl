'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  border-top: 1px solid ', ';\n'], ['\n  border-top: 1px solid ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  padding-bottom: 6px;\n'], ['\n  padding-bottom: 6px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _switch = require('../../common/switch');

var _switch2 = _interopRequireDefault(_switch);

var _rangeSlider = require('../../common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

var _fieldSelector = require('../../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _styledComponents3 = require('../../common/styled-components');

var _sourceDataCatalog = require('../source-data-catalog');

var _defaultSettings = require('../../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  datasets: _propTypes2.default.object.isRequired,
  config: _propTypes2.default.object.isRequired,
  onConfigChange: _propTypes2.default.func.isRequired
};

var StyledPanelContent = _styledComponents3.PanelContent.extend(_templateObject, function (props) {
  return props.theme.panelBorderColor;
});

var StyledInteractionPanel = _styledComponents2.default.div(_templateObject2);

var InteractionPanel = function (_Component) {
  (0, _inherits3.default)(InteractionPanel, _Component);

  function InteractionPanel() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, InteractionPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = InteractionPanel.__proto__ || Object.getPrototypeOf(InteractionPanel)).call.apply(_ref, [this].concat(args))), _this), _this.state = { isConfigActive: false }, _this._updateConfig = function (newProp) {
      _this.props.onConfigChange((0, _extends4.default)({}, _this.props.config, newProp));
    }, _this._enableConfig = function () {
      _this.setState({ isConfigActive: !_this.state.isConfigActive });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(InteractionPanel, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          config = _props.config,
          datasets = _props.datasets;

      var onChange = function onChange(newConfig) {
        return _this2._updateConfig({ config: newConfig });
      };
      var template = null;

      switch (config.id) {
        case 'tooltip':
          template = _react2.default.createElement(TooltipConfig, {
            datasets: datasets,
            config: config.config,
            width: this.state.innerPanelWidth,
            onChange: onChange
          });
          break;

        case 'brush':
          template = _react2.default.createElement(BrushConfig, { config: config.config, onChange: onChange });
          break;

        default:
          break;
      }

      return _react2.default.createElement(
        StyledInteractionPanel,
        { className: 'interaction-panel' },
        _react2.default.createElement(
          _styledComponents3.StyledPanelHeader,
          {
            className: 'interaction-panel__header',
            onClick: this._enableConfig
          },
          _react2.default.createElement(
            _styledComponents3.PanelHeaderContent,
            { className: 'interaction-panel__header__content' },
            _react2.default.createElement(
              'div',
              { className: 'interaction-panel__header__icon icon' },
              _react2.default.createElement(config.iconComponent, { height: '12px' })
            ),
            _react2.default.createElement(
              'div',
              { className: 'interaction-panel__header__title' },
              _react2.default.createElement(
                _styledComponents3.PanelHeaderTitle,
                null,
                config.id
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'interaction-panel__header__actions' },
            _react2.default.createElement(_switch2.default, {
              checked: config.enabled,
              id: config.id + '-toggle',
              onChange: function onChange() {
                return _this2._updateConfig({ enabled: !config.enabled });
              },
              secondary: true
            })
          )
        ),
        config.enabled && _react2.default.createElement(
          StyledPanelContent,
          { className: 'interaction-panel__content' },
          template
        )
      );
    }
  }]);
  return InteractionPanel;
}(_react.Component);

exports.default = InteractionPanel;


InteractionPanel.propTypes = propTypes;

var TooltipConfig = function TooltipConfig(_ref2) {
  var config = _ref2.config,
      datasets = _ref2.datasets,
      width = _ref2.width,
      onChange = _ref2.onChange;
  return _react2.default.createElement(
    'div',
    null,
    Object.keys(config.fieldsToShow).map(function (dataId) {
      return _react2.default.createElement(
        _styledComponents3.SidePanelSection,
        { key: dataId },
        _react2.default.createElement(_sourceDataCatalog.DatasetTag, { dataset: datasets[dataId] }),
        _react2.default.createElement(_fieldSelector2.default, {
          fields: datasets[dataId].fields,
          value: config.fieldsToShow[dataId],
          onSelect: function onSelect(fieldsToShow) {
            var newConfig = (0, _extends4.default)({}, config, {
              fieldsToShow: (0, _extends4.default)({}, config.fieldsToShow, (0, _defineProperty3.default)({}, dataId, fieldsToShow.map(function (d) {
                return d.name;
              })))
            });
            onChange(newConfig);
          },
          closeOnSelect: false,
          multiSelect: true
        })
      );
    })
  );
};

var BrushConfig = function BrushConfig(_ref3) {
  var config = _ref3.config,
      _onChange = _ref3.onChange;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
      null,
      'Brush Radius (km)'
    ),
    _react2.default.createElement(_rangeSlider2.default, {
      range: _defaultSettings.BRUSH_CONFIG.range,
      value0: 0,
      value1: config.size || 10 / 2,
      step: 0.1,
      isRanged: false,
      onChange: function onChange(value) {
        return _onChange((0, _extends4.default)({}, config, { size: value[1] }));
      },
      inputTheme: 'secondary'
    })
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZGF0YXNldHMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiY29uZmlnIiwib25Db25maWdDaGFuZ2UiLCJmdW5jIiwiU3R5bGVkUGFuZWxDb250ZW50IiwiZXh0ZW5kIiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQm9yZGVyQ29sb3IiLCJTdHlsZWRJbnRlcmFjdGlvblBhbmVsIiwiZGl2IiwiSW50ZXJhY3Rpb25QYW5lbCIsInN0YXRlIiwiaXNDb25maWdBY3RpdmUiLCJfdXBkYXRlQ29uZmlnIiwibmV3UHJvcCIsIl9lbmFibGVDb25maWciLCJzZXRTdGF0ZSIsIm9uQ2hhbmdlIiwibmV3Q29uZmlnIiwidGVtcGxhdGUiLCJpZCIsImlubmVyUGFuZWxXaWR0aCIsImVuYWJsZWQiLCJUb29sdGlwQ29uZmlnIiwid2lkdGgiLCJPYmplY3QiLCJrZXlzIiwiZmllbGRzVG9TaG93IiwibWFwIiwiZGF0YUlkIiwiZmllbGRzIiwiZCIsIm5hbWUiLCJCcnVzaENvbmZpZyIsInJhbmdlIiwic2l6ZSIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQVFBOztBQUNBOzs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsWUFBVSxvQkFBVUMsTUFBVixDQUFpQkMsVUFEWDtBQUVoQkMsVUFBUSxvQkFBVUYsTUFBVixDQUFpQkMsVUFGVDtBQUdoQkUsa0JBQWdCLG9CQUFVQyxJQUFWLENBQWVIO0FBSGYsQ0FBbEI7O0FBTUEsSUFBTUkscUJBQXFCLGdDQUFhQyxNQUFsQyxrQkFDb0I7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLGdCQUFyQjtBQUFBLENBRHBCLENBQU47O0FBSUEsSUFBTUMseUJBQXlCLDJCQUFPQyxHQUFoQyxrQkFBTjs7SUFJcUJDLGdCOzs7Ozs7Ozs7Ozs7Ozt3TkFDbkJDLEssR0FBUSxFQUFDQyxnQkFBZ0IsS0FBakIsRSxRQUVSQyxhLEdBQWdCLG1CQUFXO0FBQ3pCLFlBQUtSLEtBQUwsQ0FBV0osY0FBWCw0QkFDSyxNQUFLSSxLQUFMLENBQVdMLE1BRGhCLEVBRUtjLE9BRkw7QUFJRCxLLFFBRURDLGEsR0FBZ0IsWUFBTTtBQUNwQixZQUFLQyxRQUFMLENBQWMsRUFBQ0osZ0JBQWdCLENBQUMsTUFBS0QsS0FBTCxDQUFXQyxjQUE3QixFQUFkO0FBQ0QsSzs7Ozs7NkJBRVE7QUFBQTs7QUFBQSxtQkFDb0IsS0FBS1AsS0FEekI7QUFBQSxVQUNBTCxNQURBLFVBQ0FBLE1BREE7QUFBQSxVQUNRSCxRQURSLFVBQ1FBLFFBRFI7O0FBRVAsVUFBTW9CLFdBQVcsU0FBWEEsUUFBVztBQUFBLGVBQWEsT0FBS0osYUFBTCxDQUFtQixFQUFDYixRQUFRa0IsU0FBVCxFQUFuQixDQUFiO0FBQUEsT0FBakI7QUFDQSxVQUFJQyxXQUFXLElBQWY7O0FBRUEsY0FBUW5CLE9BQU9vQixFQUFmO0FBQ0UsYUFBSyxTQUFMO0FBQ0VELHFCQUNFLDhCQUFDLGFBQUQ7QUFDRSxzQkFBVXRCLFFBRFo7QUFFRSxvQkFBUUcsT0FBT0EsTUFGakI7QUFHRSxtQkFBTyxLQUFLVyxLQUFMLENBQVdVLGVBSHBCO0FBSUUsc0JBQVVKO0FBSlosWUFERjtBQVFBOztBQUVGLGFBQUssT0FBTDtBQUNFRSxxQkFBVyw4QkFBQyxXQUFELElBQWEsUUFBUW5CLE9BQU9BLE1BQTVCLEVBQW9DLFVBQVVpQixRQUE5QyxHQUFYO0FBQ0E7O0FBRUY7QUFDRTtBQWpCSjs7QUFvQkEsYUFDRTtBQUFDLDhCQUFEO0FBQUEsVUFBd0IsV0FBVSxtQkFBbEM7QUFDRTtBQUFBO0FBQUE7QUFDRSx1QkFBVSwyQkFEWjtBQUVFLHFCQUFTLEtBQUtGO0FBRmhCO0FBSUU7QUFBQTtBQUFBLGNBQW9CLFdBQVUsb0NBQTlCO0FBQ0U7QUFBQTtBQUFBLGdCQUFLLFdBQVUsc0NBQWY7QUFDRSw0Q0FBQyxNQUFELENBQVEsYUFBUixJQUFzQixRQUFPLE1BQTdCO0FBREYsYUFERjtBQUlFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLGtDQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQW1CZix1QkFBT29CO0FBQTFCO0FBREY7QUFKRixXQUpGO0FBWUU7QUFBQTtBQUFBLGNBQUssV0FBVSxvQ0FBZjtBQUNFO0FBQ0UsdUJBQVNwQixPQUFPc0IsT0FEbEI7QUFFRSxrQkFBT3RCLE9BQU9vQixFQUFkLFlBRkY7QUFHRSx3QkFBVTtBQUFBLHVCQUFNLE9BQUtQLGFBQUwsQ0FBbUIsRUFBQ1MsU0FBUyxDQUFDdEIsT0FBT3NCLE9BQWxCLEVBQW5CLENBQU47QUFBQSxlQUhaO0FBSUU7QUFKRjtBQURGO0FBWkYsU0FERjtBQXNCR3RCLGVBQU9zQixPQUFQLElBQ0M7QUFBQyw0QkFBRDtBQUFBLFlBQW9CLFdBQVUsNEJBQTlCO0FBQ0dIO0FBREg7QUF2QkosT0FERjtBQThCRDs7Ozs7a0JBckVrQlQsZ0I7OztBQXdFckJBLGlCQUFpQmQsU0FBakIsR0FBNkJBLFNBQTdCOztBQUVBLElBQU0yQixnQkFBZ0IsU0FBaEJBLGFBQWdCO0FBQUEsTUFBRXZCLE1BQUYsU0FBRUEsTUFBRjtBQUFBLE1BQVVILFFBQVYsU0FBVUEsUUFBVjtBQUFBLE1BQW9CMkIsS0FBcEIsU0FBb0JBLEtBQXBCO0FBQUEsTUFBMkJQLFFBQTNCLFNBQTJCQSxRQUEzQjtBQUFBLFNBQ3BCO0FBQUE7QUFBQTtBQUNHUSxXQUFPQyxJQUFQLENBQVkxQixPQUFPMkIsWUFBbkIsRUFBaUNDLEdBQWpDLENBQXFDO0FBQUEsYUFDcEM7QUFBQTtBQUFBLFVBQWtCLEtBQUtDLE1BQXZCO0FBQ0UsdUVBQVksU0FBU2hDLFNBQVNnQyxNQUFULENBQXJCLEdBREY7QUFFRTtBQUNFLGtCQUFRaEMsU0FBU2dDLE1BQVQsRUFBaUJDLE1BRDNCO0FBRUUsaUJBQU85QixPQUFPMkIsWUFBUCxDQUFvQkUsTUFBcEIsQ0FGVDtBQUdFLG9CQUFVLGdDQUFnQjtBQUN4QixnQkFBTVgsdUNBQ0RsQixNQURDO0FBRUoyQix1REFDSzNCLE9BQU8yQixZQURaLG9DQUVHRSxNQUZILEVBRVlGLGFBQWFDLEdBQWIsQ0FBaUI7QUFBQSx1QkFBS0csRUFBRUMsSUFBUDtBQUFBLGVBQWpCLENBRlo7QUFGSSxjQUFOO0FBT0FmLHFCQUFTQyxTQUFUO0FBQ0QsV0FaSDtBQWFFLHlCQUFlLEtBYmpCO0FBY0U7QUFkRjtBQUZGLE9BRG9DO0FBQUEsS0FBckM7QUFESCxHQURvQjtBQUFBLENBQXRCOztBQTBCQSxJQUFNZSxjQUFjLFNBQWRBLFdBQWM7QUFBQSxNQUFFakMsTUFBRixTQUFFQSxNQUFGO0FBQUEsTUFBVWlCLFNBQVYsU0FBVUEsUUFBVjtBQUFBLFNBQ2xCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UsYUFBTyw4QkFBYWlCLEtBRHRCO0FBRUUsY0FBUSxDQUZWO0FBR0UsY0FBUWxDLE9BQU9tQyxJQUFQLElBQWUsS0FBSyxDQUg5QjtBQUlFLFlBQU0sR0FKUjtBQUtFLGdCQUFVLEtBTFo7QUFNRSxnQkFBVTtBQUFBLGVBQVNsQixxQ0FBYWpCLE1BQWIsSUFBcUJtQyxNQUFNQyxNQUFNLENBQU4sQ0FBM0IsSUFBVDtBQUFBLE9BTlo7QUFPRSxrQkFBVztBQVBiO0FBRkYsR0FEa0I7QUFBQSxDQUFwQiIsImZpbGUiOiJpbnRlcmFjdGlvbi1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IFN3aXRjaCBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zd2l0Y2gnO1xuaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3JhbmdlLXNsaWRlcic7XG5pbXBvcnQgRmllbGRTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQge1xuICBQYW5lbExhYmVsLFxuICBTaWRlUGFuZWxTZWN0aW9uLFxuICBTdHlsZWRQYW5lbEhlYWRlcixcbiAgUGFuZWxIZWFkZXJUaXRsZSxcbiAgUGFuZWxIZWFkZXJDb250ZW50LFxuICBQYW5lbENvbnRlbnRcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtEYXRhc2V0VGFnfSBmcm9tICcuLi9zb3VyY2UtZGF0YS1jYXRhbG9nJztcbmltcG9ydCB7QlJVU0hfQ09ORklHfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIG9uQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBTdHlsZWRQYW5lbENvbnRlbnQgPSBQYW5lbENvbnRlbnQuZXh0ZW5kYFxuICBib3JkZXItdG9wOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckNvbG9yfTtcbmA7XG5cbmNvbnN0IFN0eWxlZEludGVyYWN0aW9uUGFuZWwgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nLWJvdHRvbTogNnB4O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJhY3Rpb25QYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRlID0ge2lzQ29uZmlnQWN0aXZlOiBmYWxzZX07XG5cbiAgX3VwZGF0ZUNvbmZpZyA9IG5ld1Byb3AgPT4ge1xuICAgIHRoaXMucHJvcHMub25Db25maWdDaGFuZ2Uoe1xuICAgICAgLi4udGhpcy5wcm9wcy5jb25maWcsXG4gICAgICAuLi5uZXdQcm9wXG4gICAgfSk7XG4gIH07XG5cbiAgX2VuYWJsZUNvbmZpZyA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0NvbmZpZ0FjdGl2ZTogIXRoaXMuc3RhdGUuaXNDb25maWdBY3RpdmV9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NvbmZpZywgZGF0YXNldHN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBvbkNoYW5nZSA9IG5ld0NvbmZpZyA9PiB0aGlzLl91cGRhdGVDb25maWcoe2NvbmZpZzogbmV3Q29uZmlnfSk7XG4gICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcblxuICAgIHN3aXRjaCAoY29uZmlnLmlkKSB7XG4gICAgICBjYXNlICd0b29sdGlwJzpcbiAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgPFRvb2x0aXBDb25maWdcbiAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnLmNvbmZpZ31cbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnN0YXRlLmlubmVyUGFuZWxXaWR0aH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYnJ1c2gnOlxuICAgICAgICB0ZW1wbGF0ZSA9IDxCcnVzaENvbmZpZyBjb25maWc9e2NvbmZpZy5jb25maWd9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz47XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZEludGVyYWN0aW9uUGFuZWwgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxcIj5cbiAgICAgICAgPFN0eWxlZFBhbmVsSGVhZGVyXG4gICAgICAgICAgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxfX2hlYWRlclwiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5fZW5hYmxlQ29uZmlnfVxuICAgICAgICA+XG4gICAgICAgICAgPFBhbmVsSGVhZGVyQ29udGVudCBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9faGVhZGVyX19jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImludGVyYWN0aW9uLXBhbmVsX19oZWFkZXJfX2ljb24gaWNvblwiPlxuICAgICAgICAgICAgICA8Y29uZmlnLmljb25Db21wb25lbnQgaGVpZ2h0PVwiMTJweFwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9faGVhZGVyX190aXRsZVwiPlxuICAgICAgICAgICAgICA8UGFuZWxIZWFkZXJUaXRsZT57Y29uZmlnLmlkfTwvUGFuZWxIZWFkZXJUaXRsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvUGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxfX2hlYWRlcl9fYWN0aW9uc1wiPlxuICAgICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgICBjaGVja2VkPXtjb25maWcuZW5hYmxlZH1cbiAgICAgICAgICAgICAgaWQ9e2Ake2NvbmZpZy5pZH0tdG9nZ2xlYH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHRoaXMuX3VwZGF0ZUNvbmZpZyh7ZW5hYmxlZDogIWNvbmZpZy5lbmFibGVkfSl9XG4gICAgICAgICAgICAgIHNlY29uZGFyeVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9TdHlsZWRQYW5lbEhlYWRlcj5cbiAgICAgICAge2NvbmZpZy5lbmFibGVkICYmIChcbiAgICAgICAgICA8U3R5bGVkUGFuZWxDb250ZW50IGNsYXNzTmFtZT1cImludGVyYWN0aW9uLXBhbmVsX19jb250ZW50XCI+XG4gICAgICAgICAgICB7dGVtcGxhdGV9XG4gICAgICAgICAgPC9TdHlsZWRQYW5lbENvbnRlbnQ+XG4gICAgICAgICl9XG4gICAgICA8L1N0eWxlZEludGVyYWN0aW9uUGFuZWw+XG4gICAgKTtcbiAgfVxufVxuXG5JbnRlcmFjdGlvblBhbmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgVG9vbHRpcENvbmZpZyA9ICh7Y29uZmlnLCBkYXRhc2V0cywgd2lkdGgsIG9uQ2hhbmdlfSkgPT4gKFxuICA8ZGl2PlxuICAgIHtPYmplY3Qua2V5cyhjb25maWcuZmllbGRzVG9TaG93KS5tYXAoZGF0YUlkID0+IChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGtleT17ZGF0YUlkfT5cbiAgICAgICAgPERhdGFzZXRUYWcgZGF0YXNldD17ZGF0YXNldHNbZGF0YUlkXX0gLz5cbiAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICBmaWVsZHM9e2RhdGFzZXRzW2RhdGFJZF0uZmllbGRzfVxuICAgICAgICAgIHZhbHVlPXtjb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF19XG4gICAgICAgICAgb25TZWxlY3Q9e2ZpZWxkc1RvU2hvdyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdDb25maWcgPSB7XG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAgICAgLi4uY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgICAgICBbZGF0YUlkXTogZmllbGRzVG9TaG93Lm1hcChkID0+IGQubmFtZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9uQ2hhbmdlKG5ld0NvbmZpZyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBjbG9zZU9uU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICBtdWx0aVNlbGVjdFxuICAgICAgICAvPlxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICkpfVxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IEJydXNoQ29uZmlnID0gKHtjb25maWcsIG9uQ2hhbmdlfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8UGFuZWxMYWJlbD5CcnVzaCBSYWRpdXMgKGttKTwvUGFuZWxMYWJlbD5cbiAgICA8UmFuZ2VTbGlkZXJcbiAgICAgIHJhbmdlPXtCUlVTSF9DT05GSUcucmFuZ2V9XG4gICAgICB2YWx1ZTA9ezB9XG4gICAgICB2YWx1ZTE9e2NvbmZpZy5zaXplIHx8IDEwIC8gMn1cbiAgICAgIHN0ZXA9ezAuMX1cbiAgICAgIGlzUmFuZ2VkPXtmYWxzZX1cbiAgICAgIG9uQ2hhbmdlPXt2YWx1ZSA9PiBvbkNoYW5nZSh7Li4uY29uZmlnLCBzaXplOiB2YWx1ZVsxXX0pfVxuICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgLz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcbiJdfQ==