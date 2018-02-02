'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-top: 1px solid ', ';\n'], ['\n  border-top: 1px solid ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding-bottom: 6px;\n'], ['\n  padding-bottom: 6px;\n']);

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
        _styledComponents3.SidePanelSection,
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
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
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
      },
      inputTheme: 'secondary'
    })
  );
};

var EnableConfig = function EnableConfig(_ref3) {
  var config = _ref3.config,
      onClick = _ref3.onClick;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_switch2.default, {
      checked: config.enabled,
      id: config.id + '-toggle',
      onChange: onClick,
      secondary: true
    })
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwiZGF0YXNldHMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiY29uZmlnIiwib25Db25maWdDaGFuZ2UiLCJmdW5jIiwiU3R5bGVkUGFuZWxDb250ZW50IiwiZXh0ZW5kIiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQm9yZGVyQ29sb3IiLCJTdHlsZWRJbnRlcmFjdGlvblBhbmVsIiwiZGl2IiwiSW50ZXJhY3Rpb25QYW5lbCIsInN0YXRlIiwiaXNDb25maWdBY3RpdmUiLCJfdXBkYXRlQ29uZmlnIiwibmV3UHJvcCIsIl9lbmFibGVDb25maWciLCJzZXRTdGF0ZSIsInJlbmRlciIsIm9uQ2hhbmdlIiwibmV3Q29uZmlnIiwidGVtcGxhdGUiLCJpZCIsImlubmVyUGFuZWxXaWR0aCIsImVuYWJsZWQiLCJUb29sdGlwQ29uZmlnIiwid2lkdGgiLCJPYmplY3QiLCJrZXlzIiwiZmllbGRzVG9TaG93IiwibWFwIiwiZGF0YUlkIiwiZmllbGRzIiwiZCIsIm5hbWUiLCJCcnVzaENvbmZpZyIsInNpemUiLCJ2YWx1ZSIsIkVuYWJsZUNvbmZpZyIsIm9uQ2xpY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQVFBOzs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsWUFBVSxvQkFBVUMsTUFBVixDQUFpQkMsVUFEWDtBQUVoQkMsVUFBUSxvQkFBVUYsTUFBVixDQUFpQkMsVUFGVDtBQUdoQkUsa0JBQWdCLG9CQUFVQyxJQUFWLENBQWVIO0FBSGYsQ0FBbEI7O0FBTUEsSUFBTUkscUJBQXFCLGdDQUFhQyxNQUFsQyxrQkFDb0I7QUFBQSxTQUFTQyxNQUFNQyxLQUFO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QURGLEdBRG1CO0FBQUEsQ0FBckIiLCJmaWxlIjoiaW50ZXJhY3Rpb24tcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBTd2l0Y2ggZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3dpdGNoJztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXInO1xuaW1wb3J0IEZpZWxkU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IHtcbiAgUGFuZWxMYWJlbCxcbiAgU2lkZVBhbmVsU2VjdGlvbixcbiAgU3R5bGVkUGFuZWxIZWFkZXIsXG4gIFBhbmVsSGVhZGVyVGl0bGUsXG4gIFBhbmVsSGVhZGVyQ29udGVudCxcbiAgUGFuZWxDb250ZW50XG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7RGF0YXNldFRhZ30gZnJvbSAnLi4vc291cmNlLWRhdGEtY2F0YWxvZyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIG9uQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBTdHlsZWRQYW5lbENvbnRlbnQgPSBQYW5lbENvbnRlbnQuZXh0ZW5kYFxuICBib3JkZXItdG9wOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckNvbG9yfTtcbmA7XG5cbmNvbnN0IFN0eWxlZEludGVyYWN0aW9uUGFuZWwgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nLWJvdHRvbTogNnB4O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZXJhY3Rpb25QYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRlID0ge2lzQ29uZmlnQWN0aXZlOiBmYWxzZX07XG5cbiAgX3VwZGF0ZUNvbmZpZyA9IG5ld1Byb3AgPT4ge1xuICAgIHRoaXMucHJvcHMub25Db25maWdDaGFuZ2Uoe1xuICAgICAgLi4udGhpcy5wcm9wcy5jb25maWcsXG4gICAgICAuLi5uZXdQcm9wXG4gICAgfSk7XG4gIH07XG5cbiAgX2VuYWJsZUNvbmZpZyA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0NvbmZpZ0FjdGl2ZTogIXRoaXMuc3RhdGUuaXNDb25maWdBY3RpdmV9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2NvbmZpZywgZGF0YXNldHN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBvbkNoYW5nZSA9IG5ld0NvbmZpZyA9PiB0aGlzLl91cGRhdGVDb25maWcoe2NvbmZpZzogbmV3Q29uZmlnfSk7XG4gICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcblxuICAgIHN3aXRjaCAoY29uZmlnLmlkKSB7XG4gICAgICBjYXNlICd0b29sdGlwJzpcbiAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgPFRvb2x0aXBDb25maWdcbiAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnLmNvbmZpZ31cbiAgICAgICAgICAgIHdpZHRoPXt0aGlzLnN0YXRlLmlubmVyUGFuZWxXaWR0aH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYnJ1c2gnOlxuICAgICAgICB0ZW1wbGF0ZSA9IDxCcnVzaENvbmZpZyBjb25maWc9e2NvbmZpZy5jb25maWd9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz47XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZEludGVyYWN0aW9uUGFuZWwgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxcIj5cbiAgICAgICAgPFN0eWxlZFBhbmVsSGVhZGVyXG4gICAgICAgICAgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxfX2hlYWRlclwiXG4gICAgICAgICAgb25DbGljaz17dGhpcy5fZW5hYmxlQ29uZmlnfVxuICAgICAgICA+XG4gICAgICAgICAgPFBhbmVsSGVhZGVyQ29udGVudCBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9faGVhZGVyX19jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImludGVyYWN0aW9uLXBhbmVsX19oZWFkZXJfX2ljb24gaWNvblwiPlxuICAgICAgICAgICAgICA8Y29uZmlnLmljb25Db21wb25lbnQgaGVpZ2h0PVwiMTJweFwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9faGVhZGVyX190aXRsZVwiPlxuICAgICAgICAgICAgICA8UGFuZWxIZWFkZXJUaXRsZT57Y29uZmlnLmlkfTwvUGFuZWxIZWFkZXJUaXRsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvUGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxfX2hlYWRlcl9fYWN0aW9uc1wiPlxuICAgICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgICBjaGVja2VkPXtjb25maWcuZW5hYmxlZH1cbiAgICAgICAgICAgICAgaWQ9e2Ake2NvbmZpZy5pZH0tdG9nZ2xlYH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHRoaXMuX3VwZGF0ZUNvbmZpZyh7ZW5hYmxlZDogIWNvbmZpZy5lbmFibGVkfSl9XG4gICAgICAgICAgICAgIHNlY29uZGFyeVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9TdHlsZWRQYW5lbEhlYWRlcj5cbiAgICAgICAge2NvbmZpZy5lbmFibGVkICYmIChcbiAgICAgICAgICA8U3R5bGVkUGFuZWxDb250ZW50IGNsYXNzTmFtZT1cImludGVyYWN0aW9uLXBhbmVsX19jb250ZW50XCI+XG4gICAgICAgICAgICB7dGVtcGxhdGV9XG4gICAgICAgICAgPC9TdHlsZWRQYW5lbENvbnRlbnQ+XG4gICAgICAgICl9XG4gICAgICA8L1N0eWxlZEludGVyYWN0aW9uUGFuZWw+XG4gICAgKTtcbiAgfVxufVxuXG5JbnRlcmFjdGlvblBhbmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgVG9vbHRpcENvbmZpZyA9ICh7Y29uZmlnLCBkYXRhc2V0cywgd2lkdGgsIG9uQ2hhbmdlfSkgPT4gKFxuICA8ZGl2PlxuICAgIHtPYmplY3Qua2V5cyhjb25maWcuZmllbGRzVG9TaG93KS5tYXAoZGF0YUlkID0+IChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGtleT17ZGF0YUlkfT5cbiAgICAgICAgPERhdGFzZXRUYWcgZGF0YXNldD17ZGF0YXNldHNbZGF0YUlkXX0gLz5cbiAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICBmaWVsZHM9e2RhdGFzZXRzW2RhdGFJZF0uZmllbGRzfVxuICAgICAgICAgIHZhbHVlPXtjb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF19XG4gICAgICAgICAgb25TZWxlY3Q9e2ZpZWxkc1RvU2hvdyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdDb25maWcgPSB7XG4gICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAgICAgLi4uY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgICAgICBbZGF0YUlkXTogZmllbGRzVG9TaG93Lm1hcChkID0+IGQubmFtZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9uQ2hhbmdlKG5ld0NvbmZpZyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBjbG9zZU9uU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICBtdWx0aVNlbGVjdFxuICAgICAgICAvPlxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICkpfVxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IEJydXNoQ29uZmlnID0gKHtjb25maWcsIG9uQ2hhbmdlfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8UGFuZWxMYWJlbD5CcnVzaCBSYWRpdXMgKGttKTwvUGFuZWxMYWJlbD5cbiAgICA8UmFuZ2VTbGlkZXJcbiAgICAgIG1pblZhbHVlPXswfVxuICAgICAgbWF4VmFsdWU9ezEwfVxuICAgICAgdmFsdWUwPXswfVxuICAgICAgdmFsdWUxPXtjb25maWcuc2l6ZSB8fCAxMCAvIDJ9XG4gICAgICBzdGVwPXswLjF9XG4gICAgICBpc1JhbmdlZD17ZmFsc2V9XG4gICAgICBzaG93SW5wdXQ9e3RydWV9XG4gICAgICBvbkNoYW5nZT17dmFsdWUgPT4gb25DaGFuZ2Uoey4uLmNvbmZpZywgc2l6ZTogdmFsdWVbMV19KX1cbiAgICAgIGlucHV0VGhlbWU9XCJzZWNvbmRhcnlcIlxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmNvbnN0IEVuYWJsZUNvbmZpZyA9ICh7Y29uZmlnLCBvbkNsaWNrfSkgPT4gKFxuICA8ZGl2PlxuICAgIDxTd2l0Y2hcbiAgICAgIGNoZWNrZWQ9e2NvbmZpZy5lbmFibGVkfVxuICAgICAgaWQ9e2Ake2NvbmZpZy5pZH0tdG9nZ2xlYH1cbiAgICAgIG9uQ2hhbmdlPXtvbkNsaWNrfVxuICAgICAgc2Vjb25kYXJ5XG4gICAgLz5cbiAgPC9kaXY+XG4pO1xuIl19