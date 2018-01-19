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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZGF0YXNldHMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiY29uZmlnIiwib25Db25maWdDaGFuZ2UiLCJmdW5jIiwiSW50ZXJhY3Rpb25QYW5lbCIsInN0YXRlIiwiaXNDb25maWdBY3RpdmUiLCJfdXBkYXRlQ29uZmlnIiwicHJvcHMiLCJuZXdQcm9wIiwiX2VuYWJsZUNvbmZpZyIsInNldFN0YXRlIiwicmVuZGVyIiwib25DaGFuZ2UiLCJuZXdDb25maWciLCJ0ZW1wbGF0ZSIsImlkIiwiaW5uZXJQYW5lbFdpZHRoIiwiZGlzYWJsZWQiLCJhY3RpdmUiLCJlbmFibGVkIiwiYm9yZGVyTGVmdFdpZHRoIiwiaWNvbiIsIlRvb2x0aXBDb25maWciLCJ3aWR0aCIsIk9iamVjdCIsImtleXMiLCJmaWVsZHNUb1Nob3ciLCJtYXAiLCJkYXRhSWQiLCJmaWVsZHMiLCJkIiwibmFtZSIsIkJydXNoQ29uZmlnIiwic2l6ZSIsInZhbHVlIiwiRW5hYmxlQ29uZmlnIiwib25DbGljayIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpblJpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFJQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFlBQVUsb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFg7QUFFaEJDLFVBQVEsb0JBQVVGLE1BQVYsQ0FBaUJDLFVBRlQ7QUFHaEJFLGtCQUFnQixvQkFBVUMsSUFBVixDQUFlSDtBQUhmLENBQWxCOztJQU1xQkksZ0I7Ozs7Ozs7Ozs7OzswSkFDbkJDLEssR0FBUSxFQUFDQyxnQkFBZ0IsS0FBakIsRSxRQUVSQyxhLEdBQWdCLG1CQUFXO0FBQ3pC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QWFFLHlCQUFlLEtBYmpCO0FBY0U7QUFkRjtBQUZGLE9BRG9DO0FBQUEsS0FBckM7QUFESCxHQURvQjtBQUFBLENBQXRCOztBQTBCQSxJQUFNbUIsY0FBYyxTQUFkQSxXQUFjO0FBQUEsTUFBRWhDLE1BQUYsU0FBRUEsTUFBRjtBQUFBLE1BQVVZLFNBQVYsU0FBVUEsUUFBVjtBQUFBLFNBQ2xCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UsZ0JBQVUsQ0FEWjtBQUVFLGdCQUFVLEVBRlo7QUFHRSxjQUFRLENBSFY7QUFJRSxjQUFRWixPQUFPaUMsSUFBUCxJQUFlLEtBQUssQ0FKOUI7QUFLRSxZQUFNLEdBTFI7QUFNRSxnQkFBVSxLQU5aO0FBT0UsaUJBQVcsSUFQYjtBQVFFLGdCQUFVO0FBQUEsZUFBU3JCLHFDQUFhWixNQUFiLElBQXFCaUMsTUFBTUMsTUFBTSxDQUFOLENBQTNCLElBQVQ7QUFBQTtBQVJaO0FBRkYsR0FEa0I7QUFBQSxDQUFwQjs7QUFnQk8sSUFBTUMsc0NBQWUsU0FBZkEsWUFBZTtBQUFBLE1BQUVuQyxNQUFGLFNBQUVBLE1BQUY7QUFBQSxNQUFVb0MsT0FBVixTQUFVQSxPQUFWO0FBQUEsU0FDMUI7QUFBQTtBQUFBLE1BQUssV0FBVSwwREFBZjtBQUNFO0FBQ0UsYUFBTyxFQUFDQyxjQUFjLENBQWYsRUFBa0JDLGFBQWEsT0FBL0IsRUFEVDtBQUVFLGVBQVN0QyxPQUFPbUIsT0FGbEI7QUFHRSxVQUFPbkIsT0FBT2UsRUFBZCxZQUhGO0FBSUUsYUFBT2YsT0FBT21CLE9BQVAsR0FBaUIsSUFBakIsR0FBd0IsS0FKakM7QUFLRSxnQkFBVWlCLE9BTFo7QUFNRSxZQUFLO0FBTlA7QUFERixHQUQwQjtBQUFBLENBQXJCIiwiZmlsZSI6ImludGVyYWN0aW9uLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge1N3aXRjaH0gZnJvbSAnQHViZXIvcmVhY3Qtc3dpdGNoJztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXInO1xuaW1wb3J0IEZpZWxkU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IHtcbiAgUGFuZWxMYWJlbCxcbiAgU2lkZVBhbmVsU2VjdGlvblxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0RhdGFzZXRUYWd9IGZyb20gJy4uL3NvdXJjZS1kYXRhLWNhdGFsb2cnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBvbkNvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJhY3Rpb25QYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRlID0ge2lzQ29uZmlnQWN0aXZlOiBmYWxzZX07XG5cbiAgX3VwZGF0ZUNvbmZpZyA9IG5ld1Byb3AgPT4ge1xuICAgIHRoaXMucHJvcHMub25Db25maWdDaGFuZ2Uoe1xuICAgICAgLi4udGhpcy5wcm9wcy5jb25maWcsXG4gICAgICAuLi5uZXdQcm9wXG4gICAgfSk7XG4gIH07XG5cbiAgX2VuYWJsZUNvbmZpZyA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0NvbmZpZ0FjdGl2ZTogIXRoaXMuc3RhdGUuaXNDb25maWdBY3RpdmV9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NvbmZpZywgZGF0YXNldHN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBvbkNoYW5nZSA9IG5ld0NvbmZpZyA9PiB0aGlzLl91cGRhdGVDb25maWcoe2NvbmZpZzogbmV3Q29uZmlnfSk7XG4gICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcblxuICAgIHN3aXRjaCAoY29uZmlnLmlkKSB7XG4gICAgICBjYXNlICd0b29sdGlwJzpcbiAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgPFRvb2x0aXBDb25maWdcbiAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnLmNvbmZpZ31cbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnN0YXRlLmlubmVyUGFuZWxXaWR0aH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYnJ1c2gnOlxuICAgICAgICB0ZW1wbGF0ZSA9IDxCcnVzaENvbmZpZyBjb25maWc9e2NvbmZpZy5jb25maWd9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz47XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2xheWVyLXBhbmVsJywge1xuICAgICAgICAgIGRpc2FibGVkOiBjb25maWcuaWQgPT09ICdzZWxlY3QnLFxuICAgICAgICAgIGFjdGl2ZTogY29uZmlnLmVuYWJsZWRcbiAgICAgICAgfSl9XG4gICAgICA+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJzb2Z0LXNtYWxsLS1zaWRlcyBzb2Z0LXRpbnktLWVuZHMgY3Vyc29yLS1wb2ludGVyXG4gICAgICAgICAgbGF5ZXItcGFuZWxfX2hlYWRlciBuby1oaWdobGlnaHRcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX2VuYWJsZUNvbmZpZ31cbiAgICAgICAgICBzdHlsZT17e2JvcmRlckxlZnRXaWR0aDogMH19XG4gICAgICAgID5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgaWNvbiBpY29uXyR7XG4gICAgICAgICAgICAgIGNvbmZpZy5pY29uXG4gICAgICAgICAgICB9IHRleHQtdWJlci1ibGFjay02MCBwdXNoLXRpbnktLXJpZ2h0YH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxQYW5lbExhYmVsPntjb25maWcuaWR9PC9QYW5lbExhYmVsPlxuICAgICAgICAgIDxFbmFibGVDb25maWdcbiAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5fdXBkYXRlQ29uZmlnKHtlbmFibGVkOiAhY29uZmlnLmVuYWJsZWR9KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2NvbmZpZy5lbmFibGVkICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNvZnQtdGlueSBsYXllci1wYW5lbF9fY29uZmlnXCI+e3RlbXBsYXRlfTwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5JbnRlcmFjdGlvblBhbmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgVG9vbHRpcENvbmZpZyA9ICh7Y29uZmlnLCBkYXRhc2V0cywgd2lkdGgsIG9uQ2hhbmdlfSkgPT4gKFxuICA8ZGl2PlxuICAgIHtPYmplY3Qua2V5cyhjb25maWcuZmllbGRzVG9TaG93KS5tYXAoZGF0YUlkID0+IChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGtleT17ZGF0YUlkfT5cbiAgICAgICAgPERhdGFzZXRUYWcgZGF0YXNldD17ZGF0YXNldHNbZGF0YUlkXX0gLz5cbiAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICBmaWVsZHM9e2RhdGFzZXRzW2RhdGFJZF0uZmllbGRzfVxuICAgICAgICAgIHZhbHVlPXtjb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF19XG4gICAgICAgICAgb25TZWxlY3Q9e2ZpZWxkc1RvU2hvdyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdDb25maWcgPSB7XG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAgICAgLi4uY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgICAgICBbZGF0YUlkXTogZmllbGRzVG9TaG93Lm1hcChkID0+IGQubmFtZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9uQ2hhbmdlKG5ld0NvbmZpZyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBjbG9zZU9uU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICBtdWx0aVNlbGVjdFxuICAgICAgICAvPlxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICkpfVxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IEJydXNoQ29uZmlnID0gKHtjb25maWcsIG9uQ2hhbmdlfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8UGFuZWxMYWJlbD5CcnVzaCBSYWRpdXMgKGttKTwvUGFuZWxMYWJlbD5cbiAgICA8UmFuZ2VTbGlkZXJcbiAgICAgIG1pblZhbHVlPXswfVxuICAgICAgbWF4VmFsdWU9ezEwfVxuICAgICAgdmFsdWUwPXswfVxuICAgICAgdmFsdWUxPXtjb25maWcuc2l6ZSB8fCAxMCAvIDJ9XG4gICAgICBzdGVwPXswLjF9XG4gICAgICBpc1JhbmdlZD17ZmFsc2V9XG4gICAgICBzaG93SW5wdXQ9e3RydWV9XG4gICAgICBvbkNoYW5nZT17dmFsdWUgPT4gb25DaGFuZ2Uoey4uLmNvbmZpZywgc2l6ZTogdmFsdWVbMV19KX1cbiAgICAvPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5leHBvcnQgY29uc3QgRW5hYmxlQ29uZmlnID0gKHtjb25maWcsIG9uQ2xpY2t9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiZmxvYXQtLXJpZ2h0IHB1c2gtdGlueS0tbGVmdCBkaXNwbGF5LS1pbmxpbmUtYmxvY2sgZmx1c2hcIj5cbiAgICA8U3dpdGNoXG4gICAgICBzdHlsZT17e21hcmdpbkJvdHRvbTogMCwgbWFyZ2luUmlnaHQ6ICctMTBweCd9fVxuICAgICAgY2hlY2tlZD17Y29uZmlnLmVuYWJsZWR9XG4gICAgICBpZD17YCR7Y29uZmlnLmlkfS10b2dnbGVgfVxuICAgICAgbGFiZWw9e2NvbmZpZy5lbmFibGVkID8gJ29uJyA6ICdvZmYnfVxuICAgICAgb25DaGFuZ2U9e29uQ2xpY2t9XG4gICAgICBzaXplPVwic21hbGxcIlxuICAgIC8+XG4gIDwvZGl2PlxuKTtcbiJdfQ==