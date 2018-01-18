'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnableConfig = exports.default = undefined;

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactSwitch = require('@uber/react-switch');

var _rangeSlider = require('../../common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

var _fieldSelector = require('../../common/field-selector');

var _fieldSelector2 = _interopRequireDefault(_fieldSelector);

var _styledComponents = require('../../common/styled-components');

var _sourceDataCatalog = require('../source-data-catalog');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  datasets: _propTypes2.default.object.isRequired,
  config: _propTypes2.default.object.isRequired,
  onConfigChange: _propTypes2.default.func.isRequired
};

var InteractionPanel = function (_Component) {
  (0, _inherits3.default)(InteractionPanel, _Component);

  function InteractionPanel() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, InteractionPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = { isConfigActive: false }, _this._updateConfig = function (newProp) {
      _this.props.onConfigChange((0, _extends4.default)({}, _this.props.config, newProp));
    }, _this._enableConfig = function () {
      _this.setState({ isConfigActive: !_this.state.isConfigActive });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  InteractionPanel.prototype.render = function render() {
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
      'div',
      {
        className: (0, _classnames2.default)('layer-panel', {
          disabled: config.id === 'select',
          active: config.enabled
        })
      },
      _react2.default.createElement(
        'div',
        {
          className: 'soft-small--sides soft-tiny--ends cursor--pointer layer-panel__header no-highlight',
          onClick: this._enableConfig,
          style: { borderLeftWidth: 0 }
        },
        _react2.default.createElement('span', {
          className: 'icon icon_' + config.icon + ' text-uber-black-60 push-tiny--right'
        }),
        _react2.default.createElement(
          _styledComponents.PanelLabel,
          null,
          config.id
        ),
        _react2.default.createElement(EnableConfig, {
          config: config,
          onClick: function onClick() {
            return _this2._updateConfig({ enabled: !config.enabled });
          }
        })
      ),
      config.enabled && _react2.default.createElement(
        'div',
        { className: 'soft-tiny layer-panel__config' },
        template
      )
    );
  };

  return InteractionPanel;
}(_react.Component);

exports.default = InteractionPanel;


InteractionPanel.propTypes = propTypes;

var TooltipConfig = function TooltipConfig(_ref) {
  var config = _ref.config,
      datasets = _ref.datasets,
      width = _ref.width,
      onChange = _ref.onChange;
  return _react2.default.createElement(
    'div',
    null,
    Object.keys(config.fieldsToShow).map(function (dataId) {
      return _react2.default.createElement(
        _styledComponents.SidePanelSection,
        { key: dataId },
        _react2.default.createElement(_sourceDataCatalog.DatasetTag, { dataset: datasets[dataId] }),
        _react2.default.createElement(_fieldSelector2.default, {
          fields: datasets[dataId].fields,
          value: config.fieldsToShow[dataId],
          onSelect: function onSelect(fieldsToShow) {
            var _extends2;

            var newConfig = (0, _extends4.default)({}, config, {
              fieldsToShow: (0, _extends4.default)({}, config.fieldsToShow, (_extends2 = {}, _extends2[dataId] = fieldsToShow.map(function (d) {
                return d.name;
              }), _extends2))
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

var BrushConfig = function BrushConfig(_ref2) {
  var config = _ref2.config,
      _onChange = _ref2.onChange;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      'Brush Radius (km)'
    ),
    _react2.default.createElement(_rangeSlider2.default, {
      minValue: 0,
      maxValue: 10,
      value0: 0,
      value1: config.size || 10 / 2,
      step: 0.1,
      isRanged: false,
      showInput: true,
      onChange: function onChange(value) {
        return _onChange((0, _extends4.default)({}, config, { size: value[1] }));
      }
    })
  );
};

var EnableConfig = exports.EnableConfig = function EnableConfig(_ref3) {
  var config = _ref3.config,
      onClick = _ref3.onClick;
  return _react2.default.createElement(
    'div',
    { className: 'float--right push-tiny--left display--inline-block flush' },
    _react2.default.createElement(_reactSwitch.Switch, {
      style: { marginBottom: 0, marginRight: '-10px' },
      checked: config.enabled,
      id: config.id + '-toggle',
      label: config.enabled ? 'on' : 'off',
      onChange: onClick,
      size: 'small'
    })
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZGF0YXNldHMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiY29uZmlnIiwib25Db25maWdDaGFuZ2UiLCJmdW5jIiwiSW50ZXJhY3Rpb25QYW5lbCIsInN0YXRlIiwiaXNDb25maWdBY3RpdmUiLCJfdXBkYXRlQ29uZmlnIiwibmV3UHJvcCIsInByb3BzIiwiX2VuYWJsZUNvbmZpZyIsInNldFN0YXRlIiwicmVuZGVyIiwib25DaGFuZ2UiLCJuZXdDb25maWciLCJ0ZW1wbGF0ZSIsImlkIiwiaW5uZXJQYW5lbFdpZHRoIiwiZGlzYWJsZWQiLCJhY3RpdmUiLCJlbmFibGVkIiwiYm9yZGVyTGVmdFdpZHRoIiwiaWNvbiIsIlRvb2x0aXBDb25maWciLCJ3aWR0aCIsIk9iamVjdCIsImtleXMiLCJmaWVsZHNUb1Nob3ciLCJtYXAiLCJkYXRhSWQiLCJmaWVsZHMiLCJkIiwibmFtZSIsIkJydXNoQ29uZmlnIiwic2l6ZSIsInZhbHVlIiwiRW5hYmxlQ29uZmlnIiwib25DbGljayIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpblJpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFlBQVUsb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFg7QUFFaEJDLFVBQVEsb0JBQVVGLE1BQVYsQ0FBaUJDLFVBRlQ7QUFHaEJFLGtCQUFnQixvQkFBVUMsSUFBVixDQUFlSDtBQUhmLENBQWxCOztJQU1xQkksZ0I7Ozs7Ozs7Ozs7OzswSkFDbkJDLEssR0FBUSxFQUFDQyxnQkFBZ0IsS0FBakIsRSxRQUVSQyxhLEdBQWdCLFVBQUNDLE9BQUQsRUFBYTtBQUMzQixZQUFLQyxLQUFMLENBQVdQLGNBQVgsNEJBQ0ssTUFBS08sS0FBTCxDQUFXUixNQURoQixFQUVLTyxPQUZMO0FBSUQsSyxRQUVERSxhLEdBQWdCLFlBQU07QUFDcEIsWUFBS0MsUUFBTCxDQUFjLEVBQUNMLGdCQUFnQixDQUFDLE1BQUtELEtBQUwsQ0FBV0MsY0FBN0IsRUFBZDtBQUNELEs7Ozs2QkFFRE0sTSxxQkFBUztBQUFBOztBQUFBLGlCQUNvQixLQUFLSCxLQUR6QjtBQUFBLFFBQ0FSLE1BREEsVUFDQUEsTUFEQTtBQUFBLFFBQ1FILFFBRFIsVUFDUUEsUUFEUjs7QUFFUCxRQUFNZSxXQUFXLFNBQVhBLFFBQVc7QUFBQSxhQUFhLE9BQUtOLGFBQUwsQ0FBbUIsRUFBQ04sUUFBUWEsU0FBVCxFQUFuQixDQUFiO0FBQUEsS0FBakI7QUFDQSxRQUFJQyxXQUFXLElBQWY7O0FBRUEsWUFBUWQsT0FBT2UsRUFBZjtBQUNFLFdBQUssU0FBTDtBQUNFRCxtQkFDRSw4QkFBQyxhQUFEO0FBQ0Usb0JBQVVqQixRQURaO0FBRUUsa0JBQVFHLE9BQU9BLE1BRmpCO0FBR0UsaUJBQU8sS0FBS0ksS0FBTCxDQUFXWSxlQUhwQjtBQUlFLG9CQUFVSjtBQUpaLFVBREY7QUFRQTs7QUFFRixXQUFLLE9BQUw7QUFDRUUsbUJBQVcsOEJBQUMsV0FBRCxJQUFhLFFBQVFkLE9BQU9BLE1BQTVCLEVBQW9DLFVBQVVZLFFBQTlDLEdBQVg7QUFDQTs7QUFFRjtBQUNFO0FBakJKOztBQW9CQSxXQUNFO0FBQUE7QUFBQTtBQUNFLG1CQUFXLDBCQUFXLGFBQVgsRUFBMEI7QUFDbkNLLG9CQUFVakIsT0FBT2UsRUFBUCxLQUFjLFFBRFc7QUFFbkNHLGtCQUFRbEIsT0FBT21CO0FBRm9CLFNBQTFCO0FBRGI7QUFNRTtBQUFBO0FBQUE7QUFDRSxxQkFBVSxvRkFEWjtBQUdFLG1CQUFTLEtBQUtWLGFBSGhCO0FBSUUsaUJBQU8sRUFBQ1csaUJBQWlCLENBQWxCO0FBSlQ7QUFNRTtBQUNFLG9DQUNFcEIsT0FBT3FCLElBRFQ7QUFERixVQU5GO0FBV0U7QUFBQTtBQUFBO0FBQWFyQixpQkFBT2U7QUFBcEIsU0FYRjtBQVlFLHNDQUFDLFlBQUQ7QUFDRSxrQkFBUWYsTUFEVjtBQUVFLG1CQUFTO0FBQUEsbUJBQU0sT0FBS00sYUFBTCxDQUFtQixFQUFDYSxTQUFTLENBQUNuQixPQUFPbUIsT0FBbEIsRUFBbkIsQ0FBTjtBQUFBO0FBRlg7QUFaRixPQU5GO0FBdUJHbkIsYUFBT21CLE9BQVAsSUFDQztBQUFBO0FBQUEsVUFBSyxXQUFVLCtCQUFmO0FBQWdETDtBQUFoRDtBQXhCSixLQURGO0FBNkJELEc7Ozs7O2tCQXBFa0JYLGdCOzs7QUF1RXJCQSxpQkFBaUJQLFNBQWpCLEdBQTZCQSxTQUE3Qjs7QUFFQSxJQUFNMEIsZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLE1BQUV0QixNQUFGLFFBQUVBLE1BQUY7QUFBQSxNQUFVSCxRQUFWLFFBQVVBLFFBQVY7QUFBQSxNQUFvQjBCLEtBQXBCLFFBQW9CQSxLQUFwQjtBQUFBLE1BQTJCWCxRQUEzQixRQUEyQkEsUUFBM0I7QUFBQSxTQUNwQjtBQUFBO0FBQUE7QUFDR1ksV0FBT0MsSUFBUCxDQUFZekIsT0FBTzBCLFlBQW5CLEVBQWlDQyxHQUFqQyxDQUFxQztBQUFBLGFBQ3BDO0FBQUE7QUFBQSxVQUFrQixLQUFLQyxNQUF2QjtBQUNFLHVFQUFZLFNBQVMvQixTQUFTK0IsTUFBVCxDQUFyQixHQURGO0FBRUU7QUFDRSxrQkFBUS9CLFNBQVMrQixNQUFULEVBQWlCQyxNQUQzQjtBQUVFLGlCQUFPN0IsT0FBTzBCLFlBQVAsQ0FBb0JFLE1BQXBCLENBRlQ7QUFHRSxvQkFBVSxnQ0FBZ0I7QUFBQTs7QUFDeEIsZ0JBQU1mLHVDQUNEYixNQURDO0FBRUowQix1REFDSzFCLE9BQU8wQixZQURaLDZCQUVHRSxNQUZILElBRVlGLGFBQWFDLEdBQWIsQ0FBaUI7QUFBQSx1QkFBS0csRUFBRUMsSUFBUDtBQUFBLGVBQWpCLENBRlo7QUFGSSxjQUFOO0FBT0FuQixxQkFBU0MsU0FBVDtBQUNELFdBWkg7QUFhRSx5QkFBZSxLQWJqQjtBQWNFO0FBZEY7QUFGRixPQURvQztBQUFBLEtBQXJDO0FBREgsR0FEb0I7QUFBQSxDQUF0Qjs7QUEwQkEsSUFBTW1CLGNBQWMsU0FBZEEsV0FBYztBQUFBLE1BQUVoQyxNQUFGLFNBQUVBLE1BQUY7QUFBQSxNQUFVWSxTQUFWLFNBQVVBLFFBQVY7QUFBQSxTQUNsQjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBREY7QUFFRTtBQUNFLGdCQUFVLENBRFo7QUFFRSxnQkFBVSxFQUZaO0FBR0UsY0FBUSxDQUhWO0FBSUUsY0FBUVosT0FBT2lDLElBQVAsSUFBZSxLQUFLLENBSjlCO0FBS0UsWUFBTSxHQUxSO0FBTUUsZ0JBQVUsS0FOWjtBQU9FLGlCQUFXLElBUGI7QUFRRSxnQkFBVTtBQUFBLGVBQVNyQixxQ0FBYVosTUFBYixJQUFxQmlDLE1BQU1DLE1BQU0sQ0FBTixDQUEzQixJQUFUO0FBQUE7QUFSWjtBQUZGLEdBRGtCO0FBQUEsQ0FBcEI7O0FBZ0JPLElBQU1DLHNDQUFlLFNBQWZBLFlBQWU7QUFBQSxNQUFFbkMsTUFBRixTQUFFQSxNQUFGO0FBQUEsTUFBVW9DLE9BQVYsU0FBVUEsT0FBVjtBQUFBLFNBQzFCO0FBQUE7QUFBQSxNQUFLLFdBQVUsMERBQWY7QUFDRTtBQUNFLGFBQU8sRUFBQ0MsY0FBYyxDQUFmLEVBQWtCQyxhQUFhLE9BQS9CLEVBRFQ7QUFFRSxlQUFTdEMsT0FBT21CLE9BRmxCO0FBR0UsVUFBT25CLE9BQU9lLEVBQWQsWUFIRjtBQUlFLGFBQU9mLE9BQU9tQixPQUFQLEdBQWlCLElBQWpCLEdBQXdCLEtBSmpDO0FBS0UsZ0JBQVVpQixPQUxaO0FBTUUsWUFBSztBQU5QO0FBREYsR0FEMEI7QUFBQSxDQUFyQiIsImZpbGUiOiJpbnRlcmFjdGlvbi1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtTd2l0Y2h9IGZyb20gJ0B1YmVyL3JlYWN0LXN3aXRjaCc7XG5pbXBvcnQgUmFuZ2VTbGlkZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vcmFuZ2Utc2xpZGVyJztcbmltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtEYXRhc2V0VGFnfSBmcm9tICcuLi9zb3VyY2UtZGF0YS1jYXRhbG9nJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgb25Db25maWdDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVyYWN0aW9uUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0ZSA9IHtpc0NvbmZpZ0FjdGl2ZTogZmFsc2V9O1xuXG4gIF91cGRhdGVDb25maWcgPSAobmV3UHJvcCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25Db25maWdDaGFuZ2Uoe1xuICAgICAgLi4udGhpcy5wcm9wcy5jb25maWcsXG4gICAgICAuLi5uZXdQcm9wXG4gICAgfSk7XG4gIH07XG5cbiAgX2VuYWJsZUNvbmZpZyA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0NvbmZpZ0FjdGl2ZTogIXRoaXMuc3RhdGUuaXNDb25maWdBY3RpdmV9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NvbmZpZywgZGF0YXNldHN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBvbkNoYW5nZSA9IG5ld0NvbmZpZyA9PiB0aGlzLl91cGRhdGVDb25maWcoe2NvbmZpZzogbmV3Q29uZmlnfSk7XG4gICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcblxuICAgIHN3aXRjaCAoY29uZmlnLmlkKSB7XG4gICAgICBjYXNlICd0b29sdGlwJzpcbiAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgPFRvb2x0aXBDb25maWdcbiAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnLmNvbmZpZ31cbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnN0YXRlLmlubmVyUGFuZWxXaWR0aH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYnJ1c2gnOlxuICAgICAgICB0ZW1wbGF0ZSA9IDxCcnVzaENvbmZpZyBjb25maWc9e2NvbmZpZy5jb25maWd9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz47XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2xheWVyLXBhbmVsJywge1xuICAgICAgICAgIGRpc2FibGVkOiBjb25maWcuaWQgPT09ICdzZWxlY3QnLFxuICAgICAgICAgIGFjdGl2ZTogY29uZmlnLmVuYWJsZWRcbiAgICAgICAgfSl9XG4gICAgICA+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJzb2Z0LXNtYWxsLS1zaWRlcyBzb2Z0LXRpbnktLWVuZHMgY3Vyc29yLS1wb2ludGVyXG4gICAgICAgICAgbGF5ZXItcGFuZWxfX2hlYWRlciBuby1oaWdobGlnaHRcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX2VuYWJsZUNvbmZpZ31cbiAgICAgICAgICBzdHlsZT17e2JvcmRlckxlZnRXaWR0aDogMH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgaWNvbiBpY29uXyR7XG4gICAgICAgICAgICAgIGNvbmZpZy5pY29uXG4gICAgICAgICAgICB9IHRleHQtdWJlci1ibGFjay02MCBwdXNoLXRpbnktLXJpZ2h0YH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxQYW5lbExhYmVsPntjb25maWcuaWR9PC9QYW5lbExhYmVsPlxuICAgICAgICAgIDxFbmFibGVDb25maWdcbiAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5fdXBkYXRlQ29uZmlnKHtlbmFibGVkOiAhY29uZmlnLmVuYWJsZWR9KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2NvbmZpZy5lbmFibGVkICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNvZnQtdGlueSBsYXllci1wYW5lbF9fY29uZmlnXCI+e3RlbXBsYXRlfTwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5JbnRlcmFjdGlvblBhbmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgVG9vbHRpcENvbmZpZyA9ICh7Y29uZmlnLCBkYXRhc2V0cywgd2lkdGgsIG9uQ2hhbmdlfSkgPT4gKFxuICA8ZGl2PlxuICAgIHtPYmplY3Qua2V5cyhjb25maWcuZmllbGRzVG9TaG93KS5tYXAoZGF0YUlkID0+IChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGtleT17ZGF0YUlkfT5cbiAgICAgICAgPERhdGFzZXRUYWcgZGF0YXNldD17ZGF0YXNldHNbZGF0YUlkXX0gLz5cbiAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICBmaWVsZHM9e2RhdGFzZXRzW2RhdGFJZF0uZmllbGRzfVxuICAgICAgICAgIHZhbHVlPXtjb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF19XG4gICAgICAgICAgb25TZWxlY3Q9e2ZpZWxkc1RvU2hvdyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdDb25maWcgPSB7XG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAgICAgLi4uY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgICAgICBbZGF0YUlkXTogZmllbGRzVG9TaG93Lm1hcChkID0+IGQubmFtZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9uQ2hhbmdlKG5ld0NvbmZpZyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBjbG9zZU9uU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICBtdWx0aVNlbGVjdFxuICAgICAgICAvPlxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICkpfVxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IEJydXNoQ29uZmlnID0gKHtjb25maWcsIG9uQ2hhbmdlfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8UGFuZWxMYWJlbD5CcnVzaCBSYWRpdXMgKGttKTwvUGFuZWxMYWJlbD5cbiAgICA8UmFuZ2VTbGlkZXJcbiAgICAgIG1pblZhbHVlPXswfVxuICAgICAgbWF4VmFsdWU9ezEwfVxuICAgICAgdmFsdWUwPXswfVxuICAgICAgdmFsdWUxPXtjb25maWcuc2l6ZSB8fCAxMCAvIDJ9XG4gICAgICBzdGVwPXswLjF9XG4gICAgICBpc1JhbmdlZD17ZmFsc2V9XG4gICAgICBzaG93SW5wdXQ9e3RydWV9XG4gICAgICBvbkNoYW5nZT17dmFsdWUgPT4gb25DaGFuZ2Uoey4uLmNvbmZpZywgc2l6ZTogdmFsdWVbMV19KX1cbiAgICAvPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5leHBvcnQgY29uc3QgRW5hYmxlQ29uZmlnID0gKHtjb25maWcsIG9uQ2xpY2t9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiZmxvYXQtLXJpZ2h0IHB1c2gtdGlueS0tbGVmdCBkaXNwbGF5LS1pbmxpbmUtYmxvY2sgZmx1c2hcIj5cbiAgICA8U3dpdGNoXG4gICAgICBzdHlsZT17e21hcmdpbkJvdHRvbTogMCwgbWFyZ2luUmlnaHQ6ICctMTBweCd9fVxuICAgICAgY2hlY2tlZD17Y29uZmlnLmVuYWJsZWR9XG4gICAgICBpZD17YCR7Y29uZmlnLmlkfS10b2dnbGVgfVxuICAgICAgbGFiZWw9e2NvbmZpZy5lbmFibGVkID8gJ29uJyA6ICdvZmYnfVxuICAgICAgb25DaGFuZ2U9e29uQ2xpY2t9XG4gICAgICBzaXplPVwic21hbGxcIlxuICAgIC8+XG4gIDwvZGl2PlxuKTtcbiJdfQ==