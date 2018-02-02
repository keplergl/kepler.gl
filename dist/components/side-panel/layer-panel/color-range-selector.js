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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 12px 12px 0 12px;\n'], ['\n  padding: 12px 12px 0 12px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding-bottom: 12px;\n'], ['\n  padding-bottom: 12px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  .color-palette__config__label {\n    flex-grow: 1;\n  }\n  .color-palette__config__select {\n    flex-grow: 1;\n  }\n  .item-selector .item-selector__dropdown {\n    ', ';\n  }\n'], ['\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  .color-palette__config__label {\n    flex-grow: 1;\n  }\n  .color-palette__config__select {\n    flex-grow: 1;\n  }\n  .item-selector .item-selector__dropdown {\n    ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 0 8px;\n  :hover {\n    background-color: ', ';\n    cursor: pointer;\n  }\n'], ['\n  padding: 0 8px;\n  :hover {\n    background-color: ', ';\n    cursor: pointer;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _itemSelector = require('../../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _styledComponents3 = require('../../common/styled-components');

var _rangeSlider = require('../../common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

var _switch = require('../../common/switch');

var _switch2 = _interopRequireDefault(_switch);

var _colorPalette = require('./color-palette');

var _colorPalette2 = _interopRequireDefault(_colorPalette);

var _colorRanges = require('../../../constants/color-ranges');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALL_TYPES = (0, _lodash2.default)(_colorRanges.COLOR_RANGES.map(function (c) {
  return c.type;
}).concat(['all']));
var ALL_STEPS = (0, _lodash2.default)(_colorRanges.COLOR_RANGES.map(function (d) {
  return d.colors.length;
}));

var propTypes = {
  colorRanges: _propTypes2.default.array,
  selectedColorRange: _propTypes2.default.object,
  onSelectColorRange: _propTypes2.default.func.isRequired
};

var defaultProps = {
  colorRanges: _colorRanges.COLOR_RANGES,
  onSelectColorRange: function onSelectColorRange() {}
};

var StyledColorConfig = _styledComponents2.default.div(_templateObject);

var ColorRangeSelector = _styledComponents2.default.div(_templateObject2);

var ColorRangeSelect = function (_Component) {
  (0, _inherits3.default)(ColorRangeSelect, _Component);

  function ColorRangeSelect() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorRangeSelect);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      config: {
        type: {
          type: 'select',
          value: 'all',
          options: ALL_TYPES
        },
        steps: {
          type: 'select',
          value: 6,
          options: ALL_STEPS
        },
        reversed: {
          type: 'switch',
          value: false,
          options: [true, false]
        }
      }
    }, _this._updateConfig = function (_ref) {
      var key = _ref.key,
          value = _ref.value;

      var currentValue = _this.state.config[key].value;
      if (value !== currentValue) {
        var _extends2;

        _this.setState({
          config: (0, _extends4.default)({}, _this.state.config, (_extends2 = {}, _extends2[key] = (0, _extends4.default)({}, _this.state.config[key], {
            value: value
          }), _extends2))
        });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  ColorRangeSelect.prototype.render = function render() {
    var _this2 = this;

    var config = this.state.config;

    return _react2.default.createElement(
      ColorRangeSelector,
      { className: 'color-range-selector' },
      _react2.default.createElement(
        StyledColorConfig,
        null,
        Object.keys(config).map(function (key) {
          return _react2.default.createElement(PaletteConfig, {
            key: key,
            label: key,
            config: config[key],
            onChange: function onChange(value) {
              return _this2._updateConfig({ key: key, value: value });
            }
          });
        })
      ),
      _react2.default.createElement(ColorPaletteGroup, {
        config: config,
        colorRanges: this.props.colorRanges,
        onSelect: this.props.onSelectColorRange,
        selected: this.props.selectedColorRange
      })
    );
  };

  return ColorRangeSelect;
}(_react.Component);

exports.default = ColorRangeSelect;


var StyledPaletteConfig = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.secondaryInput;
});

var PaletteConfig = function PaletteConfig(_ref2) {
  var category = _ref2.category,
      label = _ref2.label,
      _ref2$config = _ref2.config,
      type = _ref2$config.type,
      value = _ref2$config.value,
      options = _ref2$config.options,
      _onChange = _ref2.onChange;
  return _react2.default.createElement(
    StyledPaletteConfig,
    {
      className: 'color-palette__config',
      onClick: function onClick(e) {
        return e.stopPropagation();
      }
    },
    _react2.default.createElement(
      'div',
      { className: 'color-palette__config__label' },
      _react2.default.createElement(
        _styledComponents3.PanelLabel,
        null,
        label
      )
    ),
    type === 'select' && _react2.default.createElement(
      'div',
      { className: 'color-palette__config__select' },
      _react2.default.createElement(_itemSelector2.default, {
        selectedItems: value,
        options: options,
        multiSelect: false,
        searchable: false,
        onChange: _onChange
      })
    ),
    type === 'slider' && _react2.default.createElement(
      'div',
      { className: 'color-palette__config__slider' },
      _react2.default.createElement(
        'div',
        { className: 'color-palette__config__slider__slider' },
        _react2.default.createElement(_rangeSlider2.default, {
          minValue: options[0],
          maxValue: options[1],
          value0: options[0],
          value1: value,
          step: 1,
          isRanged: false,
          showInput: false,
          onChange: function onChange(val) {
            return _onChange(val[1]);
          }
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'color-palette__config__slider__number' },
        value
      )
    ),
    type === 'switch' && _react2.default.createElement(_switch2.default, {
      checked: value,
      id: category + '-' + label + '-toggle',
      onChange: function onChange() {
        return _onChange(!value);
      },
      secondary: true
    })
  );
};

var StyledColorRange = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.panelBackgroundHover;
});

var ColorPaletteGroup = function ColorPaletteGroup(_ref3) {
  var _ref3$config = _ref3.config,
      config = _ref3$config === undefined ? {} : _ref3$config,
      onSelect = _ref3.onSelect,
      selected = _ref3.selected,
      colorRanges = _ref3.colorRanges;
  var steps = config.steps,
      reversed = config.reversed,
      type = config.type;


  var filtered = colorRanges.filter(function (colorRange) {
    var isType = !type || type.value === 'all' || type.value === colorRange.type;
    var isStep = !steps || Number(steps.value) === colorRange.colors.length;

    return isType && isStep;
  });

  var isReversed = Boolean(reversed && reversed.value);

  return _react2.default.createElement(
    'div',
    { className: 'color-palette__group' },
    filtered.map(function (colorRange) {
      return _react2.default.createElement(
        StyledColorRange,
        {
          className: 'color-ranges',
          key: colorRange.name,
          onClick: function onClick(e) {
            return onSelect((0, _extends4.default)({}, colorRange, {
              reversed: isReversed,
              colors: isReversed ? colorRange.colors.slice().reverse() : colorRange.colors
            }), e);
          }
        },
        _react2.default.createElement(_colorPalette2.default, {
          colors: colorRange.colors,
          isReversed: isReversed,
          isSelected: colorRange.name === selected.name && isReversed === Boolean(selected.reversed)
        })
      );
    })
  );
};

ColorRangeSelect.propTypes = propTypes;
ColorRangeSelect.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2Utc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiQUxMX1RZUEVTIiwibWFwIiwiYyIsInR5cGUiLCJjb25jYXQiLCJBTExfU1RFUFMiLCJkIiwiY29sb3JzIiwibGVuZ3RoIiwicHJvcFR5cGVzIiwiY29sb3JSYW5nZXMiLCJhcnJheSIsInNlbGVjdGVkQ29sb3JSYW5nZSIsIm9iamVjdCIsIm9uU2VsZWN0Q29sb3JSYW5nZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiZGVmYXVsdFByb3BzIiwiU3R5bGVkQ29sb3JDb25maWciLCJkaXYiLCJDb2xvclJhbmdlU2VsZWN0b3IiLCJDb2xvclJhbmdlU2VsZWN0Iiwic3RhdGUiLCJjb25maWciLCJ2YWx1ZSIsIm9wdGlvbnMiLCJzdGVwcyIsInJldmVyc2VkIiwiX3VwZGF0ZUNvbmZpZyIsImtleSIsImN1cnJlbnRWYWx1ZSIsInNldFN0YXRlIiwicmVuZGVyIiwiT2JqZWN0Iiwia2V5cyIsInByb3BzIiwiU3R5bGVkUGFsZXR0ZUNvbmZpZyIsInRoZW1lIiwic2Vjb25kYXJ5SW5wdXQiLCJQYWxldHRlQ29uZmlnIiwiY2F0ZWdvcnkiLCJsYWJlbCIsIm9uQ2hhbmdlIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInZhbCIsIlN0eWxlZENvbG9yUmFuZ2UiLCJwYW5lbEJhY2tncm91bmRIb3ZlciIsIkNvbG9yUGFsZXR0ZUdyb3VwIiwib25TZWxlY3QiLCJzZWxlY3RlZCIsImZpbHRlcmVkIiwiZmlsdGVyIiwiaXNUeXBlIiwiY29sb3JSYW5nZSIsImlzU3RlcCIsIk51bWJlciIsImlzUmV2ZXJzZWQiLCJCb29sZWFuIiwibmFtZSIsInNsaWNlIiwicmV2ZXJzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7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O0FBQ0cyQixhQUFTbEQsR0FBVCxDQUFhO0FBQUEsYUFDWjtBQUFDLHdCQUFEO0FBQUE7QUFDRSxxQkFBVSxjQURaO0FBRUUsZUFBS3FELFdBQVdLLElBRmxCO0FBR0UsbUJBQVM7QUFBQSxtQkFDUFYsb0NBRU9LLFVBRlA7QUFHSTNCLHdCQUFVOEIsVUFIZDtBQUlJbEQsc0JBQVFrRCxhQUNKSCxXQUFXL0MsTUFBWCxDQUFrQnFELEtBQWxCLEdBQTBCQyxPQUExQixFQURJLEdBRUpQLFdBQVcvQztBQU5uQixnQkFRRW9DLENBUkYsQ0FETztBQUFBO0FBSFg7QUFnQkU7QUFDRSxrQkFBUVcsV0FBVy9DLE1BRHJCO0FBRUUsc0JBQVlrRCxVQUZkO0FBR0Usc0JBQ0VILFdBQVdLLElBQVgsS0FBb0JULFNBQVNTLElBQTdCLElBQ0FGLGVBQWVDLFFBQVFSLFNBQVN2QixRQUFqQjtBQUxuQjtBQWhCRixPQURZO0FBQUEsS0FBYjtBQURILEdBREY7QUErQkQsQ0E1Q0Q7O0FBOENBTixpQkFBaUJaLFNBQWpCLEdBQTZCQSxTQUE3QjtBQUNBWSxpQkFBaUJKLFlBQWpCLEdBQWdDQSxZQUFoQyIsImZpbGUiOiJjb2xvci1yYW5nZS1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtQYW5lbExhYmVsfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmFuZ2VTbGlkZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vcmFuZ2Utc2xpZGVyJztcbmltcG9ydCBTd2l0Y2ggZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3dpdGNoJztcbmltcG9ydCBDb2xvclBhbGV0dGUgZnJvbSAnLi9jb2xvci1wYWxldHRlJztcblxuaW1wb3J0IHtDT0xPUl9SQU5HRVN9IGZyb20gJ2NvbnN0YW50cy9jb2xvci1yYW5nZXMnO1xuXG5jb25zdCBBTExfVFlQRVMgPSB1bmlxKENPTE9SX1JBTkdFUy5tYXAoYyA9PiBjLnR5cGUpLmNvbmNhdChbJ2FsbCddKSk7XG5jb25zdCBBTExfU1RFUFMgPSB1bmlxKENPTE9SX1JBTkdFUy5tYXAoZCA9PiBkLmNvbG9ycy5sZW5ndGgpKTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBjb2xvclJhbmdlczogUHJvcFR5cGVzLmFycmF5LFxuICBzZWxlY3RlZENvbG9yUmFuZ2U6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uU2VsZWN0Q29sb3JSYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBjb2xvclJhbmdlczogQ09MT1JfUkFOR0VTLFxuICBvblNlbGVjdENvbG9yUmFuZ2U6ICgpID0+IHt9XG59O1xuXG5jb25zdCBTdHlsZWRDb2xvckNvbmZpZyA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDEycHggMTJweCAwIDEycHg7XG5gO1xuXG5jb25zdCBDb2xvclJhbmdlU2VsZWN0b3IgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nLWJvdHRvbTogMTJweDtcbmA7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvclJhbmdlU2VsZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgY29uZmlnOiB7XG4gICAgICB0eXBlOiB7XG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICB2YWx1ZTogJ2FsbCcsXG4gICAgICAgIG9wdGlvbnM6IEFMTF9UWVBFU1xuICAgICAgfSxcbiAgICAgIHN0ZXBzOiB7XG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICB2YWx1ZTogNixcbiAgICAgICAgb3B0aW9uczogQUxMX1NURVBTXG4gICAgICB9LFxuICAgICAgcmV2ZXJzZWQ6IHtcbiAgICAgICAgdHlwZTogJ3N3aXRjaCcsXG4gICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgb3B0aW9uczogW3RydWUsIGZhbHNlXVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfdXBkYXRlQ29uZmlnID0gKHtrZXksIHZhbHVlfSkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMuc3RhdGUuY29uZmlnW2tleV0udmFsdWU7XG4gICAgaWYgKHZhbHVlICE9PSBjdXJyZW50VmFsdWUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAuLi50aGlzLnN0YXRlLmNvbmZpZyxcbiAgICAgICAgICBba2V5XToge1xuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZS5jb25maWdba2V5XSxcbiAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjb25maWd9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbG9yUmFuZ2VTZWxlY3RvciBjbGFzc05hbWU9XCJjb2xvci1yYW5nZS1zZWxlY3RvclwiPlxuICAgICAgICA8U3R5bGVkQ29sb3JDb25maWc+XG4gICAgICAgICAge09iamVjdC5rZXlzKGNvbmZpZykubWFwKGtleSA9PiAoXG4gICAgICAgICAgICA8UGFsZXR0ZUNvbmZpZ1xuICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgbGFiZWw9e2tleX1cbiAgICAgICAgICAgICAgY29uZmlnPXtjb25maWdba2V5XX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+IHRoaXMuX3VwZGF0ZUNvbmZpZyh7a2V5LCB2YWx1ZX0pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9TdHlsZWRDb2xvckNvbmZpZz5cbiAgICAgICAgPENvbG9yUGFsZXR0ZUdyb3VwXG4gICAgICAgICAgY29uZmlnPXtjb25maWd9XG4gICAgICAgICAgY29sb3JSYW5nZXM9e3RoaXMucHJvcHMuY29sb3JSYW5nZXN9XG4gICAgICAgICAgb25TZWxlY3Q9e3RoaXMucHJvcHMub25TZWxlY3RDb2xvclJhbmdlfVxuICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29sb3JSYW5nZX1cbiAgICAgICAgLz5cbiAgICAgIDwvQ29sb3JSYW5nZVNlbGVjdG9yPlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgU3R5bGVkUGFsZXR0ZUNvbmZpZyA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1ib3R0b206IDhweDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAuY29sb3ItcGFsZXR0ZV9fY29uZmlnX19sYWJlbCB7XG4gICAgZmxleC1ncm93OiAxO1xuICB9XG4gIC5jb2xvci1wYWxldHRlX19jb25maWdfX3NlbGVjdCB7XG4gICAgZmxleC1ncm93OiAxO1xuICB9XG4gIC5pdGVtLXNlbGVjdG9yIC5pdGVtLXNlbGVjdG9yX19kcm9wZG93biB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dH07XG4gIH1cbmA7XG5cbmNvbnN0IFBhbGV0dGVDb25maWcgPSAoe1xuICBjYXRlZ29yeSxcbiAgbGFiZWwsXG4gIGNvbmZpZzoge3R5cGUsIHZhbHVlLCBvcHRpb25zfSxcbiAgb25DaGFuZ2Vcbn0pID0+IChcbiAgPFN0eWxlZFBhbGV0dGVDb25maWdcbiAgICBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlX19jb25maWdcIlxuICAgIG9uQ2xpY2s9e2UgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnX19sYWJlbFwiPlxuICAgICAgPFBhbmVsTGFiZWw+e2xhYmVsfTwvUGFuZWxMYWJlbD5cbiAgICA8L2Rpdj5cbiAgICB7dHlwZSA9PT0gJ3NlbGVjdCcgJiYgKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlX19jb25maWdfX3NlbGVjdFwiPlxuICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgc2VsZWN0ZWRJdGVtcz17dmFsdWV9XG4gICAgICAgICAgb3B0aW9ucz17b3B0aW9uc31cbiAgICAgICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICAgICAgc2VhcmNoYWJsZT17ZmFsc2V9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKX1cbiAgICB7dHlwZSA9PT0gJ3NsaWRlcicgJiYgKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlX19jb25maWdfX3NsaWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2NvbmZpZ19fc2xpZGVyX19zbGlkZXJcIj5cbiAgICAgICAgICA8UmFuZ2VTbGlkZXJcbiAgICAgICAgICAgIG1pblZhbHVlPXtvcHRpb25zWzBdfVxuICAgICAgICAgICAgbWF4VmFsdWU9e29wdGlvbnNbMV19XG4gICAgICAgICAgICB2YWx1ZTA9e29wdGlvbnNbMF19XG4gICAgICAgICAgICB2YWx1ZTE9e3ZhbHVlfVxuICAgICAgICAgICAgc3RlcD17MX1cbiAgICAgICAgICAgIGlzUmFuZ2VkPXtmYWxzZX1cbiAgICAgICAgICAgIHNob3dJbnB1dD17ZmFsc2V9XG4gICAgICAgICAgICBvbkNoYW5nZT17dmFsID0+IG9uQ2hhbmdlKHZhbFsxXSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zbGlkZXJfX251bWJlclwiPnt2YWx1ZX08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICl9XG4gICAge3R5cGUgPT09ICdzd2l0Y2gnICYmIChcbiAgICAgIDxTd2l0Y2hcbiAgICAgICAgY2hlY2tlZD17dmFsdWV9XG4gICAgICAgIGlkPXtgJHtjYXRlZ29yeX0tJHtsYWJlbH0tdG9nZ2xlYH1cbiAgICAgICAgb25DaGFuZ2U9eygpID0+IG9uQ2hhbmdlKCF2YWx1ZSl9XG4gICAgICAgIHNlY29uZGFyeVxuICAgICAgLz5cbiAgICApfVxuICA8L1N0eWxlZFBhbGV0dGVDb25maWc+XG4pO1xuXG5jb25zdCBTdHlsZWRDb2xvclJhbmdlID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZzogMCA4cHg7XG4gIDpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRIb3Zlcn07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5gO1xuXG5jb25zdCBDb2xvclBhbGV0dGVHcm91cCA9ICh7Y29uZmlnID0ge30sIG9uU2VsZWN0LCBzZWxlY3RlZCwgY29sb3JSYW5nZXN9KSA9PiB7XG4gIGNvbnN0IHtzdGVwcywgcmV2ZXJzZWQsIHR5cGV9ID0gY29uZmlnO1xuXG4gIGNvbnN0IGZpbHRlcmVkID0gY29sb3JSYW5nZXMuZmlsdGVyKGNvbG9yUmFuZ2UgPT4ge1xuICAgIGNvbnN0IGlzVHlwZSA9XG4gICAgICAhdHlwZSB8fCB0eXBlLnZhbHVlID09PSAnYWxsJyB8fCB0eXBlLnZhbHVlID09PSBjb2xvclJhbmdlLnR5cGU7XG4gICAgY29uc3QgaXNTdGVwID0gIXN0ZXBzIHx8IE51bWJlcihzdGVwcy52YWx1ZSkgPT09IGNvbG9yUmFuZ2UuY29sb3JzLmxlbmd0aDtcblxuICAgIHJldHVybiBpc1R5cGUgJiYgaXNTdGVwO1xuICB9KTtcblxuICBjb25zdCBpc1JldmVyc2VkID0gQm9vbGVhbihyZXZlcnNlZCAmJiByZXZlcnNlZC52YWx1ZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2dyb3VwXCI+XG4gICAgICB7ZmlsdGVyZWQubWFwKGNvbG9yUmFuZ2UgPT4gKFxuICAgICAgICA8U3R5bGVkQ29sb3JSYW5nZVxuICAgICAgICAgIGNsYXNzTmFtZT1cImNvbG9yLXJhbmdlc1wiXG4gICAgICAgICAga2V5PXtjb2xvclJhbmdlLm5hbWV9XG4gICAgICAgICAgb25DbGljaz17ZSA9PlxuICAgICAgICAgICAgb25TZWxlY3QoXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAuLi5jb2xvclJhbmdlLFxuICAgICAgICAgICAgICAgIHJldmVyc2VkOiBpc1JldmVyc2VkLFxuICAgICAgICAgICAgICAgIGNvbG9yczogaXNSZXZlcnNlZFxuICAgICAgICAgICAgICAgICAgPyBjb2xvclJhbmdlLmNvbG9ycy5zbGljZSgpLnJldmVyc2UoKVxuICAgICAgICAgICAgICAgICAgOiBjb2xvclJhbmdlLmNvbG9yc1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBlXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICA+XG4gICAgICAgICAgPENvbG9yUGFsZXR0ZVxuICAgICAgICAgICAgY29sb3JzPXtjb2xvclJhbmdlLmNvbG9yc31cbiAgICAgICAgICAgIGlzUmV2ZXJzZWQ9e2lzUmV2ZXJzZWR9XG4gICAgICAgICAgICBpc1NlbGVjdGVkPXtcbiAgICAgICAgICAgICAgY29sb3JSYW5nZS5uYW1lID09PSBzZWxlY3RlZC5uYW1lICYmXG4gICAgICAgICAgICAgIGlzUmV2ZXJzZWQgPT09IEJvb2xlYW4oc2VsZWN0ZWQucmV2ZXJzZWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdHlsZWRDb2xvclJhbmdlPlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5Db2xvclJhbmdlU2VsZWN0LnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkNvbG9yUmFuZ2VTZWxlY3QuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19