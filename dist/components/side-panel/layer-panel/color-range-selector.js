'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

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

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactSwitch = require('@uber/react-switch');

var _reactAccordion = require('@uber/react-accordion');

var _styledComponents = require('../../common/styled-components');

var _rangeSlider = require('../../common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

var _colorRangePalette = require('./color-range-palette');

var _colorRangePalette2 = _interopRequireDefault(_colorRangePalette);

var _colorRanges = require('../../../constants/color-ranges');

var _utils = require('../../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PALETTE_HEIGHT = 12;

var ALL_COLORS = _colorRanges.COLOR_RANGES.filter(function (colors) {
  return colors.category === 'ColorBrewer';
});

var ALL_TYPES = (0, _lodash2.default)(ALL_COLORS.map(function (c) {
  return c.type;
}).concat(['all']));
var ALL_STEPS = (0, _lodash2.default)(ALL_COLORS.map(function (d) {
  return d.colors.length;
}));

var propTypes = {
  width: _propTypes2.default.number.isRequired,
  selectedColorRange: _propTypes2.default.object.isRequired,
  onSelectColorRange: _propTypes2.default.func.isRequired
};

var ColorRangeSelect = function (_Component) {
  (0, _inherits3.default)(ColorRangeSelect, _Component);

  function ColorRangeSelect() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorRangeSelect);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      configs: {
        Uber: {
          reversed: {
            type: 'switch',
            value: false
          }
        },
        ColorBrewer: {
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
      }
    }, _this._updateConfig = function (_ref) {
      var category = _ref.category,
          key = _ref.key,
          value = _ref.value;

      var currentValue = _this.state.configs[category][key].value;
      if (value !== currentValue) {
        var _extends2, _extends3;

        _this.setState({
          configs: (0, _extends5.default)({}, _this.state.configs, (_extends3 = {}, _extends3[category] = (0, _extends5.default)({}, _this.state.configs[category], (_extends2 = {}, _extends2[key] = (0, _extends5.default)({}, _this.state.configs[category][key], {
            value: value
          }), _extends2)), _extends3))
        });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  ColorRangeSelect.prototype._renderPaletteConfig = function _renderPaletteConfig(category) {
    var _this2 = this;

    var config = this.state.configs[category];

    return _react2.default.createElement(
      'div',
      null,
      Object.keys(config).map(function (key) {
        return _react2.default.createElement(PaletteConfig, {
          key: key,
          label: key,
          category: category,
          config: config[key],
          onChange: function onChange(value) {
            return _this2._updateConfig({ category: category, key: key, value: value });
          } });
      })
    );
  };

  ColorRangeSelect.prototype._renderEachCategory = function _renderEachCategory(category) {
    var width = this.props.width;


    return _react2.default.createElement(
      _reactAccordion.StatefulAccordionItem,
      {
        linkText: category },
      this._renderPaletteConfig(category),
      _react2.default.createElement(ColorPalette, {
        category: category,
        config: this.state.configs[category],
        width: width,
        onSelect: this.props.onSelectColorRange,
        selected: this.props.selectedColorRange })
    );
  };

  ColorRangeSelect.prototype.render = function render() {
    var _props = this.props,
        width = _props.width,
        selectedColorRange = _props.selectedColorRange;


    return _react2.default.createElement(
      'div',
      { className: 'color-palette-selector' },
      _react2.default.createElement(_colorRangePalette2.default, {
        width: width,
        height: PALETTE_HEIGHT,
        colors: selectedColorRange.colors }),
      _react2.default.createElement(
        _reactAccordion.Accordion,
        {
          className: 'one-whole flush',
          style: { width: width, margin: 'auto' } },
        this._renderEachCategory('Uber'),
        this._renderEachCategory('ColorBrewer')
      )
    );
  };

  return ColorRangeSelect;
}(_react.Component);

exports.default = ColorRangeSelect;


var PaletteConfig = function PaletteConfig(_ref2) {
  var category = _ref2.category,
      label = _ref2.label,
      _ref2$config = _ref2.config,
      type = _ref2$config.type,
      value = _ref2$config.value,
      options = _ref2$config.options,
      _onChange = _ref2.onChange;

  return _react2.default.createElement(
    'div',
    { className: 'color-palette__config',
      onClick: function onClick(e) {
        return e.stopPropagation();
      } },
    _react2.default.createElement(
      'div',
      { className: '' },
      _react2.default.createElement(
        _styledComponents.PanelLabel,
        null,
        label
      )
    ),
    type === 'select' && _react2.default.createElement(
      'div',
      { className: 'select dark select--small flush' },
      _react2.default.createElement(
        'select',
        { className: 'flush', id: label, value: value,
          onChange: function onChange(_ref3) {
            var target = _ref3.target;
            return _onChange(target.value);
          } },
        options.map(function (option) {
          return _react2.default.createElement(
            'option',
            { value: option, key: option },
            typeof option === 'string' ? (0, _utils.capitalizeFirstLetter)(option) : option
          );
        })
      )
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
          } })
      ),
      _react2.default.createElement(
        'div',
        { className: 'color-palette__config__slider__number' },
        value
      )
    ),
    type === 'switch' && _react2.default.createElement(_reactSwitch.Switch, {
      style: { marginBottom: 0, marginRight: '-10px' },
      checked: value, id: category + '-' + label + '-toggle', label: '', size: 'small',
      onChange: function onChange() {
        return _onChange(!value);
      } })
  );
};

function ColorPalette(_ref4) {
  var category = _ref4.category,
      config = _ref4.config,
      width = _ref4.width,
      onSelect = _ref4.onSelect,
      selected = _ref4.selected;
  var steps = config.steps,
      reversed = config.reversed,
      type = config.type;


  var colorRanges = _colorRanges.COLOR_RANGES.filter(function (colorRange) {
    var isCategory = colorRange.category === category;
    var isType = !type || type.value === 'all' || type.value === colorRange.type;
    var isStep = !steps || Number(steps.value) === colorRange.colors.length;

    return isCategory && isType && isStep;
  });

  var isReversed = Boolean(reversed && reversed.value);
  var padding = 14;

  return _react2.default.createElement(
    'div',
    null,
    colorRanges.map(function (colorRange) {
      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('color-ranges', {
            selected: colorRange.name === selected.name && isReversed === Boolean(selected.reversed) }),
          style: { paddingLeft: padding, paddingRight: padding },
          key: colorRange.name,
          onClick: function onClick(e) {
            return onSelect({
              colorRange: (0, _extends5.default)({}, colorRange, {
                reversed: isReversed,
                colors: isReversed ? colorRange.colors.slice().reverse() : colorRange.colors
              }) });
          } },
        _react2.default.createElement(_colorRangePalette2.default, {
          width: width - padding * 2 - 5,
          height: PALETTE_HEIGHT,
          colors: isReversed ? colorRange.colors.slice().reverse() : colorRange.colors })
      );
    })
  );
}

ColorRangeSelect.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2Utc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiUEFMRVRURV9IRUlHSFQiLCJBTExfQ09MT1JTIiwiZmlsdGVyIiwiY29sb3JzIiwiY2F0ZWdvcnkiLCJBTExfVFlQRVMiLCJtYXAiLCJjIiwidHlwZSIsImNvbmNhdCIsIkFMTF9TVEVQUyIsImQiLCJsZW5ndGgiLCJwcm9wVHlwZXMiLCJ3aWR0aCIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJzZWxlY3RlZENvbG9yUmFuZ2UiLCJvYmplY3QiLCJvblNlbGVjdENvbG9yUmFuZ2UiLCJmdW5jIiwiQ29sb3JSYW5nZVNlbGVjdCIsInN0YXRlIiwiY29uZmlncyIsIlViZXIiLCJyZXZlcnNlZCIsInZhbHVlIiwiQ29sb3JCcmV3ZXIiLCJvcHRpb25zIiwic3RlcHMiLCJfdXBkYXRlQ29uZmlnIiwia2V5IiwiY3VycmVudFZhbHVlIiwic2V0U3RhdGUiLCJfcmVuZGVyUGFsZXR0ZUNvbmZpZyIsImNvbmZpZyIsIk9iamVjdCIsImtleXMiLCJfcmVuZGVyRWFjaENhdGVnb3J5IiwicHJvcHMiLCJyZW5kZXIiLCJtYXJnaW4iLCJQYWxldHRlQ29uZmlnIiwibGFiZWwiLCJvbkNoYW5nZSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJ0YXJnZXQiLCJvcHRpb24iLCJ2YWwiLCJtYXJnaW5Cb3R0b20iLCJtYXJnaW5SaWdodCIsIkNvbG9yUGFsZXR0ZSIsIm9uU2VsZWN0Iiwic2VsZWN0ZWQiLCJjb2xvclJhbmdlcyIsImlzQ2F0ZWdvcnkiLCJjb2xvclJhbmdlIiwiaXNUeXBlIiwiaXNTdGVwIiwiTnVtYmVyIiwiaXNSZXZlcnNlZCIsIkJvb2xlYW4iLCJwYWRkaW5nIiwibmFtZSIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0Iiwic2xpY2UiLCJyZXZlcnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7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QUFkLElBQXdCQyxNQUEvQjtBQUNELEdBUG1CLENBQXBCOztBQVNBLE1BQU1FLGFBQWFDLFFBQVFyQyxZQUFZQSxTQUFTQyxLQUE3QixDQUFuQjtBQUNBLE1BQU1xQyxVQUFVLEVBQWhCOztBQUVBLFNBQ0U7QUFBQTtBQUFBO0FBQ0dSLGdCQUFZakQsR0FBWixDQUFnQjtBQUFBLGFBQ2Y7QUFBQTtBQUFBLFVBQUssV0FBVywwQkFBVyxjQUFYLEVBQTJCO0FBQ3pDZ0Qsc0JBQVVHLFdBQVdPLElBQVgsS0FBb0JWLFNBQVNVLElBQTdCLElBQ1JILGVBQWVDLFFBQVFSLFNBQVM3QixRQUFqQixDQUZ3QixFQUEzQixDQUFoQjtBQUdLLGlCQUFPLEVBQUN3QyxhQUFhRixPQUFkLEVBQXVCRyxjQUFjSCxPQUFyQyxFQUhaO0FBSUssZUFBS04sV0FBV08sSUFKckI7QUFLSyxtQkFBUztBQUFBLG1CQUFLWCxTQUFTO0FBQ3JCSSxxREFDS0EsVUFETDtBQUVFaEMsMEJBQVVvQyxVQUZaO0FBR0UxRCx3QkFBUTBELGFBQWFKLFdBQVd0RCxNQUFYLENBQWtCZ0UsS0FBbEIsR0FBMEJDLE9BQTFCLEVBQWIsR0FDTlgsV0FBV3REO0FBSmYsZ0JBRHFCLEVBQVQsQ0FBTDtBQUFBLFdBTGQ7QUFZRTtBQUNFLGlCQUFPVyxRQUFRaUQsVUFBVSxDQUFsQixHQUFzQixDQUQvQjtBQUVFLGtCQUFRL0QsY0FGVjtBQUdFLGtCQUFRNkQsYUFDTkosV0FBV3RELE1BQVgsQ0FBa0JnRSxLQUFsQixHQUEwQkMsT0FBMUIsRUFETSxHQUNnQ1gsV0FBV3RELE1BSnJEO0FBWkYsT0FEZTtBQUFBLEtBQWhCO0FBREgsR0FERjtBQXVCRDs7QUFFRGtCLGlCQUFpQlIsU0FBakIsR0FBNkJBLFNBQTdCIiwiZmlsZSI6ImNvbG9yLXJhbmdlLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHVuaXEgZnJvbSAnbG9kYXNoLnVuaXEnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge1N3aXRjaH0gZnJvbSAnQHViZXIvcmVhY3Qtc3dpdGNoJztcbmltcG9ydCB7QWNjb3JkaW9uLCBTdGF0ZWZ1bEFjY29yZGlvbkl0ZW19IGZyb20gJ0B1YmVyL3JlYWN0LWFjY29yZGlvbic7XG5cbmltcG9ydCB7UGFuZWxMYWJlbH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3JhbmdlLXNsaWRlcic7XG5pbXBvcnQgQ29sb3JSYW5nZVBhbGV0dGUgZnJvbSAnLi9jb2xvci1yYW5nZS1wYWxldHRlJztcblxuaW1wb3J0IHtDT0xPUl9SQU5HRVN9IGZyb20gJ2NvbnN0YW50cy9jb2xvci1yYW5nZXMnO1xuaW1wb3J0IHtjYXBpdGFsaXplRmlyc3RMZXR0ZXJ9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuY29uc3QgUEFMRVRURV9IRUlHSFQgPSAxMjtcblxuY29uc3QgQUxMX0NPTE9SUyA9IENPTE9SX1JBTkdFU1xuICAuZmlsdGVyKGNvbG9ycyA9PiBjb2xvcnMuY2F0ZWdvcnkgPT09ICdDb2xvckJyZXdlcicpO1xuXG5jb25zdCBBTExfVFlQRVMgPSB1bmlxKEFMTF9DT0xPUlMubWFwKGMgPT4gYy50eXBlKS5jb25jYXQoWydhbGwnXSkpO1xuY29uc3QgQUxMX1NURVBTID0gdW5pcShBTExfQ09MT1JTLm1hcChkID0+IGQuY29sb3JzLmxlbmd0aCkpO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHNlbGVjdGVkQ29sb3JSYW5nZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBvblNlbGVjdENvbG9yUmFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbG9yUmFuZ2VTZWxlY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICBjb25maWdzOiB7XG4gICAgICBVYmVyOiB7XG4gICAgICAgIHJldmVyc2VkOiB7XG4gICAgICAgICAgdHlwZTogJ3N3aXRjaCcsXG4gICAgICAgICAgdmFsdWU6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBDb2xvckJyZXdlcjoge1xuICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICAgICAgdmFsdWU6ICdhbGwnLFxuICAgICAgICAgIG9wdGlvbnM6IEFMTF9UWVBFU1xuICAgICAgICB9LFxuICAgICAgICBzdGVwczoge1xuICAgICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICAgIHZhbHVlOiA2LFxuICAgICAgICAgIG9wdGlvbnM6IEFMTF9TVEVQU1xuICAgICAgICB9LFxuICAgICAgICByZXZlcnNlZDoge1xuICAgICAgICAgIHR5cGU6ICdzd2l0Y2gnLFxuICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICBvcHRpb25zOiBbdHJ1ZSwgZmFsc2VdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX3VwZGF0ZUNvbmZpZyA9ICh7Y2F0ZWdvcnksIGtleSwgdmFsdWV9KSA9PiB7XG4gICAgY29uc3QgY3VycmVudFZhbHVlID0gdGhpcy5zdGF0ZS5jb25maWdzW2NhdGVnb3J5XVtrZXldLnZhbHVlO1xuICAgIGlmICh2YWx1ZSAhPT0gY3VycmVudFZhbHVlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY29uZmlnczoge1xuICAgICAgICAgIC4uLnRoaXMuc3RhdGUuY29uZmlncyxcbiAgICAgICAgICBbY2F0ZWdvcnldOiB7XG4gICAgICAgICAgICAuLi50aGlzLnN0YXRlLmNvbmZpZ3NbY2F0ZWdvcnldLFxuICAgICAgICAgICAgW2tleV06IHtcbiAgICAgICAgICAgICAgLi4udGhpcy5zdGF0ZS5jb25maWdzW2NhdGVnb3J5XVtrZXldLFxuICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJQYWxldHRlQ29uZmlnKGNhdGVnb3J5KSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zdGF0ZS5jb25maWdzW2NhdGVnb3J5XTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7T2JqZWN0LmtleXMoY29uZmlnKS5tYXAoa2V5ID0+IDxQYWxldHRlQ29uZmlnXG4gICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgbGFiZWw9e2tleX1cbiAgICAgICAgICBjYXRlZ29yeT17Y2F0ZWdvcnl9XG4gICAgICAgICAgY29uZmlnPXtjb25maWdba2V5XX1cbiAgICAgICAgICBvbkNoYW5nZT17dmFsdWUgPT4gdGhpcy5fdXBkYXRlQ29uZmlnKHtjYXRlZ29yeSwga2V5LCB2YWx1ZX0pfS8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckVhY2hDYXRlZ29yeShjYXRlZ29yeSkge1xuICAgIGNvbnN0IHt3aWR0aH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGF0ZWZ1bEFjY29yZGlvbkl0ZW1cbiAgICAgICAgbGlua1RleHQ9e2NhdGVnb3J5fT5cbiAgICAgICAge3RoaXMuX3JlbmRlclBhbGV0dGVDb25maWcoY2F0ZWdvcnkpfVxuICAgICAgICA8Q29sb3JQYWxldHRlXG4gICAgICAgICAgY2F0ZWdvcnk9e2NhdGVnb3J5fVxuICAgICAgICAgIGNvbmZpZz17dGhpcy5zdGF0ZS5jb25maWdzW2NhdGVnb3J5XX1cbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgb25TZWxlY3Q9e3RoaXMucHJvcHMub25TZWxlY3RDb2xvclJhbmdlfVxuICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29sb3JSYW5nZX0vPlxuICAgICAgPC9TdGF0ZWZ1bEFjY29yZGlvbkl0ZW0+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7d2lkdGgsIHNlbGVjdGVkQ29sb3JSYW5nZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZS1zZWxlY3RvclwiPlxuICAgICAgICA8Q29sb3JSYW5nZVBhbGV0dGVcbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgaGVpZ2h0PXtQQUxFVFRFX0hFSUdIVH1cbiAgICAgICAgICBjb2xvcnM9e3NlbGVjdGVkQ29sb3JSYW5nZS5jb2xvcnN9Lz5cbiAgICAgICAgPEFjY29yZGlvblxuICAgICAgICAgIGNsYXNzTmFtZT1cIm9uZS13aG9sZSBmbHVzaFwiXG4gICAgICAgICAgc3R5bGU9e3t3aWR0aCwgbWFyZ2luOiAnYXV0byd9fT5cbiAgICAgICAgICB7dGhpcy5fcmVuZGVyRWFjaENhdGVnb3J5KCdVYmVyJyl9XG4gICAgICAgICAge3RoaXMuX3JlbmRlckVhY2hDYXRlZ29yeSgnQ29sb3JCcmV3ZXInKX1cbiAgICAgICAgPC9BY2NvcmRpb24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IFBhbGV0dGVDb25maWcgPSAoe2NhdGVnb3J5LCBsYWJlbCwgY29uZmlnOiB7dHlwZSwgdmFsdWUsIG9wdGlvbnN9LCBvbkNoYW5nZX0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2NvbmZpZ1wiXG4gICAgICAgICBvbkNsaWNrPXtlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJcIj5cbiAgICAgICAgPFBhbmVsTGFiZWw+e2xhYmVsfTwvUGFuZWxMYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgICB7dHlwZSA9PT0gJ3NlbGVjdCcgJiZcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdCBkYXJrIHNlbGVjdC0tc21hbGwgZmx1c2hcIj5cbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmx1c2hcIiBpZD17bGFiZWx9IHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh7dGFyZ2V0fSkgPT4gb25DaGFuZ2UodGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgIHtvcHRpb25zLm1hcChvcHRpb24gPT5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb259IGtleT17b3B0aW9ufT5cbiAgICAgICAgICAgICAgICAgIHt0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJyA/IGNhcGl0YWxpemVGaXJzdExldHRlcihvcHRpb24pIDogb3B0aW9ufTwvb3B0aW9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+fVxuICAgICAgICB7dHlwZSA9PT0gJ3NsaWRlcicgJiZcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2NvbmZpZ19fc2xpZGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2NvbmZpZ19fc2xpZGVyX19zbGlkZXJcIj5cbiAgICAgICAgICAgIDxSYW5nZVNsaWRlclxuICAgICAgICAgICAgICBtaW5WYWx1ZT17b3B0aW9uc1swXX1cbiAgICAgICAgICAgICAgbWF4VmFsdWU9e29wdGlvbnNbMV19XG4gICAgICAgICAgICAgIHZhbHVlMD17b3B0aW9uc1swXX1cbiAgICAgICAgICAgICAgdmFsdWUxPXt2YWx1ZX1cbiAgICAgICAgICAgICAgc3RlcD17MX1cbiAgICAgICAgICAgICAgaXNSYW5nZWQ9e2ZhbHNlfVxuICAgICAgICAgICAgICBzaG93SW5wdXQ9e2ZhbHNlfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17dmFsID0+IG9uQ2hhbmdlKHZhbFsxXSl9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlX19jb25maWdfX3NsaWRlcl9fbnVtYmVyXCI+e3ZhbHVlfTwvZGl2PlxuICAgICAgICAgIDwvZGl2Pn1cbiAgICAgICAge3R5cGUgPT09ICdzd2l0Y2gnICYmXG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW5Cb3R0b206IDAsIG1hcmdpblJpZ2h0OiAnLTEwcHgnfX1cbiAgICAgICAgICAgIGNoZWNrZWQ9e3ZhbHVlfSBpZD17YCR7Y2F0ZWdvcnl9LSR7bGFiZWx9LXRvZ2dsZWB9IGxhYmVsPVwiXCIgc2l6ZT1cInNtYWxsXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBvbkNoYW5nZSghdmFsdWUpfS8+XG4gICAgICAgIH1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmZ1bmN0aW9uIENvbG9yUGFsZXR0ZSh7Y2F0ZWdvcnksIGNvbmZpZywgd2lkdGgsIG9uU2VsZWN0LCBzZWxlY3RlZH0pIHtcbiAgY29uc3Qge3N0ZXBzLCByZXZlcnNlZCwgdHlwZX0gPSBjb25maWc7XG5cbiAgY29uc3QgY29sb3JSYW5nZXMgPSBDT0xPUl9SQU5HRVMuZmlsdGVyKGNvbG9yUmFuZ2UgPT4ge1xuICAgIGNvbnN0IGlzQ2F0ZWdvcnkgPSBjb2xvclJhbmdlLmNhdGVnb3J5ID09PSBjYXRlZ29yeTtcbiAgICBjb25zdCBpc1R5cGUgPSAhdHlwZSB8fCB0eXBlLnZhbHVlID09PSAnYWxsJyB8fFxuICAgICAgdHlwZS52YWx1ZSA9PT0gY29sb3JSYW5nZS50eXBlO1xuICAgIGNvbnN0IGlzU3RlcCA9ICFzdGVwcyB8fCBOdW1iZXIoc3RlcHMudmFsdWUpID09PSBjb2xvclJhbmdlLmNvbG9ycy5sZW5ndGg7XG5cbiAgICByZXR1cm4gaXNDYXRlZ29yeSAmJiBpc1R5cGUgJiYgaXNTdGVwO1xuICB9KTtcblxuICBjb25zdCBpc1JldmVyc2VkID0gQm9vbGVhbihyZXZlcnNlZCAmJiByZXZlcnNlZC52YWx1ZSk7XG4gIGNvbnN0IHBhZGRpbmcgPSAxNDtcblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICB7Y29sb3JSYW5nZXMubWFwKGNvbG9yUmFuZ2UgPT4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnY29sb3ItcmFuZ2VzJywge1xuICAgICAgICAgIHNlbGVjdGVkOiBjb2xvclJhbmdlLm5hbWUgPT09IHNlbGVjdGVkLm5hbWUgJiZcbiAgICAgICAgICAgIGlzUmV2ZXJzZWQgPT09IEJvb2xlYW4oc2VsZWN0ZWQucmV2ZXJzZWQpfSl9XG4gICAgICAgICAgICAgc3R5bGU9e3twYWRkaW5nTGVmdDogcGFkZGluZywgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nfX1cbiAgICAgICAgICAgICBrZXk9e2NvbG9yUmFuZ2UubmFtZX1cbiAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IG9uU2VsZWN0KHtcbiAgICAgICAgICAgICAgIGNvbG9yUmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgLi4uY29sb3JSYW5nZSxcbiAgICAgICAgICAgICAgICAgcmV2ZXJzZWQ6IGlzUmV2ZXJzZWQsXG4gICAgICAgICAgICAgICAgIGNvbG9yczogaXNSZXZlcnNlZCA/IGNvbG9yUmFuZ2UuY29sb3JzLnNsaWNlKCkucmV2ZXJzZSgpIDpcbiAgICAgICAgICAgICAgICAgICBjb2xvclJhbmdlLmNvbG9yc1xuICAgICAgICAgICAgICAgfX0pfT5cbiAgICAgICAgICA8Q29sb3JSYW5nZVBhbGV0dGVcbiAgICAgICAgICAgIHdpZHRoPXt3aWR0aCAtIHBhZGRpbmcgKiAyIC0gNX1cbiAgICAgICAgICAgIGhlaWdodD17UEFMRVRURV9IRUlHSFR9XG4gICAgICAgICAgICBjb2xvcnM9e2lzUmV2ZXJzZWQgP1xuICAgICAgICAgICAgICBjb2xvclJhbmdlLmNvbG9ycy5zbGljZSgpLnJldmVyc2UoKSA6IGNvbG9yUmFuZ2UuY29sb3JzfS8+XG4gICAgICAgIDwvZGl2PikpfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5Db2xvclJhbmdlU2VsZWN0LnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==