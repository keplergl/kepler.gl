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
          }
        });
      })
    );
  };

  ColorRangeSelect.prototype._renderEachCategory = function _renderEachCategory(category) {
    var width = this.props.width;


    return _react2.default.createElement(
      _reactAccordion.StatefulAccordionItem,
      { linkText: category },
      this._renderPaletteConfig(category),
      _react2.default.createElement(ColorPalette, {
        category: category,
        config: this.state.configs[category],
        width: width,
        onSelect: this.props.onSelectColorRange,
        selected: this.props.selectedColorRange
      })
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
        colors: selectedColorRange.colors
      }),
      _react2.default.createElement(
        _reactAccordion.Accordion,
        { className: 'one-whole flush', style: { width: width, margin: 'auto' } },
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
    { className: 'color-palette__config', onClick: function onClick(e) {
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
        {
          className: 'flush',
          id: label,
          value: value,
          onChange: function onChange(_ref3) {
            var target = _ref3.target;
            return _onChange(target.value);
          }
        },
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
          }
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'color-palette__config__slider__number' },
        value
      )
    ),
    type === 'switch' && _react2.default.createElement(_reactSwitch.Switch, {
      style: { marginBottom: 0, marginRight: '-10px' },
      checked: value,
      id: category + '-' + label + '-toggle',
      label: '',
      size: 'small',
      onChange: function onChange() {
        return _onChange(!value);
      }
    })
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
        {
          className: (0, _classnames2.default)('color-ranges', {
            selected: colorRange.name === selected.name && isReversed === Boolean(selected.reversed)
          }),
          style: { paddingLeft: padding, paddingRight: padding },
          key: colorRange.name,
          onClick: function onClick(e) {
            return onSelect({
              colorRange: (0, _extends5.default)({}, colorRange, {
                reversed: isReversed,
                colors: isReversed ? colorRange.colors.slice().reverse() : colorRange.colors
              })
            });
          }
        },
        _react2.default.createElement(_colorRangePalette2.default, {
          width: width - padding * 2 - 5,
          height: PALETTE_HEIGHT,
          colors: isReversed ? colorRange.colors.slice().reverse() : colorRange.colors
        })
      );
    })
  );
}

ColorRangeSelect.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2Utc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiUEFMRVRURV9IRUlHSFQiLCJBTExfQ09MT1JTIiwiZmlsdGVyIiwiY29sb3JzIiwiY2F0ZWdvcnkiLCJBTExfVFlQRVMiLCJtYXAiLCJjIiwidHlwZSIsImNvbmNhdCIsIkFMTF9TVEVQUyIsImQiLCJsZW5ndGgiLCJwcm9wVHlwZXMiLCJ3aWR0aCIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJzZWxlY3RlZENvbG9yUmFuZ2UiLCJvYmplY3QiLCJvblNlbGVjdENvbG9yUmFuZ2UiLCJmdW5jIiwiQ29sb3JSYW5nZVNlbGVjdCIsInN0YXRlIiwiY29uZmlncyIsIlViZXIiLCJyZXZlcnNlZCIsInZhbHVlIiwiQ29sb3JCcmV3ZXIiLCJvcHRpb25zIiwic3RlcHMiLCJfdXBkYXRlQ29uZmlnIiwia2V5IiwiY3VycmVudFZhbHVlIiwic2V0U3RhdGUiLCJfcmVuZGVyUGFsZXR0ZUNvbmZpZyIsImNvbmZpZyIsIk9iamVjdCIsImtleXMiLCJfcmVuZGVyRWFjaENhdGVnb3J5IiwicHJvcHMiLCJyZW5kZXIiLCJtYXJnaW4iLCJQYWxldHRlQ29uZmlnIiwibGFiZWwiLCJvbkNoYW5nZSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJ0YXJnZXQiLCJvcHRpb24iLCJ2YWwiLCJtYXJnaW5Cb3R0b20iLCJtYXJnaW5SaWdodCIsIkNvbG9yUGFsZXR0ZSIsIm9uU2VsZWN0Iiwic2VsZWN0ZWQiLCJjb2xvclJhbmdlcyIsImlzQ2F0ZWdvcnkiLCJjb2xvclJhbmdlIiwiaXNUeXBlIiwiaXNTdGVwIiwiTnVtYmVyIiwiaXNSZXZlcnNlZCIsIkJvb2xlYW4iLCJwYWRkaW5nIiwibmFtZSIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1JpZ2h0Iiwic2xpY2UiLCJyZXZlcnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7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QVNBLE1BQU1FLGFBQWFDLFFBQVFyQyxZQUFZQSxTQUFTQyxLQUE3QixDQUFuQjtBQUNBLE1BQU1xQyxVQUFVLEVBQWhCOztBQUVBLFNBQ0U7QUFBQTtBQUFBO0FBQ0dSLGdCQUFZakQsR0FBWixDQUFnQjtBQUFBLGFBQ2Y7QUFBQTtBQUFBO0FBQ0UscUJBQVcsMEJBQVcsY0FBWCxFQUEyQjtBQUNwQ2dELHNCQUNFRyxXQUFXTyxJQUFYLEtBQW9CVixTQUFTVSxJQUE3QixJQUNBSCxlQUFlQyxRQUFRUixTQUFTN0IsUUFBakI7QUFIbUIsV0FBM0IsQ0FEYjtBQU1FLGlCQUFPLEVBQUN3QyxhQUFhRixPQUFkLEVBQXVCRyxjQUFjSCxPQUFyQyxFQU5UO0FBT0UsZUFBS04sV0FBV08sSUFQbEI7QUFRRSxtQkFBUztBQUFBLG1CQUNQWCxTQUFTO0FBQ1BJLHFEQUNLQSxVQURMO0FBRUVoQywwQkFBVW9DLFVBRlo7QUFHRTFELHdCQUFRMEQsYUFDSkosV0FBV3RELE1BQVgsQ0FBa0JnRSxLQUFsQixHQUEwQkMsT0FBMUIsRUFESSxHQUVKWCxXQUFXdEQ7QUFMakI7QUFETyxhQUFULENBRE87QUFBQTtBQVJYO0FBb0JFO0FBQ0UsaUJBQU9XLFFBQVFpRCxVQUFVLENBQWxCLEdBQXNCLENBRC9CO0FBRUUsa0JBQVEvRCxjQUZWO0FBR0Usa0JBQ0U2RCxhQUNJSixXQUFXdEQsTUFBWCxDQUFrQmdFLEtBQWxCLEdBQTBCQyxPQUExQixFQURKLEdBRUlYLFdBQVd0RDtBQU5uQjtBQXBCRixPQURlO0FBQUEsS0FBaEI7QUFESCxHQURGO0FBb0NEOztBQUVEa0IsaUJBQWlCUixTQUFqQixHQUE2QkEsU0FBN0IiLCJmaWxlIjoiY29sb3ItcmFuZ2Utc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gudW5pcSc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7U3dpdGNofSBmcm9tICdAdWJlci9yZWFjdC1zd2l0Y2gnO1xuaW1wb3J0IHtBY2NvcmRpb24sIFN0YXRlZnVsQWNjb3JkaW9uSXRlbX0gZnJvbSAnQHViZXIvcmVhY3QtYWNjb3JkaW9uJztcblxuaW1wb3J0IHtQYW5lbExhYmVsfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUmFuZ2VTbGlkZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vcmFuZ2Utc2xpZGVyJztcbmltcG9ydCBDb2xvclJhbmdlUGFsZXR0ZSBmcm9tICcuL2NvbG9yLXJhbmdlLXBhbGV0dGUnO1xuXG5pbXBvcnQge0NPTE9SX1JBTkdFU30gZnJvbSAnY29uc3RhbnRzL2NvbG9yLXJhbmdlcyc7XG5pbXBvcnQge2NhcGl0YWxpemVGaXJzdExldHRlcn0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5jb25zdCBQQUxFVFRFX0hFSUdIVCA9IDEyO1xuXG5jb25zdCBBTExfQ09MT1JTID0gQ09MT1JfUkFOR0VTLmZpbHRlcihcbiAgY29sb3JzID0+IGNvbG9ycy5jYXRlZ29yeSA9PT0gJ0NvbG9yQnJld2VyJ1xuKTtcblxuY29uc3QgQUxMX1RZUEVTID0gdW5pcShBTExfQ09MT1JTLm1hcChjID0+IGMudHlwZSkuY29uY2F0KFsnYWxsJ10pKTtcbmNvbnN0IEFMTF9TVEVQUyA9IHVuaXEoQUxMX0NPTE9SUy5tYXAoZCA9PiBkLmNvbG9ycy5sZW5ndGgpKTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBzZWxlY3RlZENvbG9yUmFuZ2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgb25TZWxlY3RDb2xvclJhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvclJhbmdlU2VsZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgY29uZmlnczoge1xuICAgICAgVWJlcjoge1xuICAgICAgICByZXZlcnNlZDoge1xuICAgICAgICAgIHR5cGU6ICdzd2l0Y2gnLFxuICAgICAgICAgIHZhbHVlOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQ29sb3JCcmV3ZXI6IHtcbiAgICAgICAgdHlwZToge1xuICAgICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICAgIHZhbHVlOiAnYWxsJyxcbiAgICAgICAgICBvcHRpb25zOiBBTExfVFlQRVNcbiAgICAgICAgfSxcbiAgICAgICAgc3RlcHM6IHtcbiAgICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgICB2YWx1ZTogNixcbiAgICAgICAgICBvcHRpb25zOiBBTExfU1RFUFNcbiAgICAgICAgfSxcbiAgICAgICAgcmV2ZXJzZWQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3dpdGNoJyxcbiAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgb3B0aW9uczogW3RydWUsIGZhbHNlXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF91cGRhdGVDb25maWcgPSAoe2NhdGVnb3J5LCBrZXksIHZhbHVlfSkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMuc3RhdGUuY29uZmlnc1tjYXRlZ29yeV1ba2V5XS52YWx1ZTtcbiAgICBpZiAodmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGNvbmZpZ3M6IHtcbiAgICAgICAgICAuLi50aGlzLnN0YXRlLmNvbmZpZ3MsXG4gICAgICAgICAgW2NhdGVnb3J5XToge1xuICAgICAgICAgICAgLi4udGhpcy5zdGF0ZS5jb25maWdzW2NhdGVnb3J5XSxcbiAgICAgICAgICAgIFtrZXldOiB7XG4gICAgICAgICAgICAgIC4uLnRoaXMuc3RhdGUuY29uZmlnc1tjYXRlZ29yeV1ba2V5XSxcbiAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfcmVuZGVyUGFsZXR0ZUNvbmZpZyhjYXRlZ29yeSkge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuc3RhdGUuY29uZmlnc1tjYXRlZ29yeV07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge09iamVjdC5rZXlzKGNvbmZpZykubWFwKGtleSA9PiAoXG4gICAgICAgICAgPFBhbGV0dGVDb25maWdcbiAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgbGFiZWw9e2tleX1cbiAgICAgICAgICAgIGNhdGVnb3J5PXtjYXRlZ29yeX1cbiAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnW2tleV19XG4gICAgICAgICAgICBvbkNoYW5nZT17dmFsdWUgPT4gdGhpcy5fdXBkYXRlQ29uZmlnKHtjYXRlZ29yeSwga2V5LCB2YWx1ZX0pfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJFYWNoQ2F0ZWdvcnkoY2F0ZWdvcnkpIHtcbiAgICBjb25zdCB7d2lkdGh9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8U3RhdGVmdWxBY2NvcmRpb25JdGVtIGxpbmtUZXh0PXtjYXRlZ29yeX0+XG4gICAgICAgIHt0aGlzLl9yZW5kZXJQYWxldHRlQ29uZmlnKGNhdGVnb3J5KX1cbiAgICAgICAgPENvbG9yUGFsZXR0ZVxuICAgICAgICAgIGNhdGVnb3J5PXtjYXRlZ29yeX1cbiAgICAgICAgICBjb25maWc9e3RoaXMuc3RhdGUuY29uZmlnc1tjYXRlZ29yeV19XG4gICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgIG9uU2VsZWN0PXt0aGlzLnByb3BzLm9uU2VsZWN0Q29sb3JSYW5nZX1cbiAgICAgICAgICBzZWxlY3RlZD17dGhpcy5wcm9wcy5zZWxlY3RlZENvbG9yUmFuZ2V9XG4gICAgICAgIC8+XG4gICAgICA8L1N0YXRlZnVsQWNjb3JkaW9uSXRlbT5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHt3aWR0aCwgc2VsZWN0ZWRDb2xvclJhbmdlfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlLXNlbGVjdG9yXCI+XG4gICAgICAgIDxDb2xvclJhbmdlUGFsZXR0ZVxuICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICBoZWlnaHQ9e1BBTEVUVEVfSEVJR0hUfVxuICAgICAgICAgIGNvbG9ycz17c2VsZWN0ZWRDb2xvclJhbmdlLmNvbG9yc31cbiAgICAgICAgLz5cbiAgICAgICAgPEFjY29yZGlvbiBjbGFzc05hbWU9XCJvbmUtd2hvbGUgZmx1c2hcIiBzdHlsZT17e3dpZHRoLCBtYXJnaW46ICdhdXRvJ319PlxuICAgICAgICAgIHt0aGlzLl9yZW5kZXJFYWNoQ2F0ZWdvcnkoJ1ViZXInKX1cbiAgICAgICAgICB7dGhpcy5fcmVuZGVyRWFjaENhdGVnb3J5KCdDb2xvckJyZXdlcicpfVxuICAgICAgICA8L0FjY29yZGlvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgUGFsZXR0ZUNvbmZpZyA9ICh7XG4gIGNhdGVnb3J5LFxuICBsYWJlbCxcbiAgY29uZmlnOiB7dHlwZSwgdmFsdWUsIG9wdGlvbnN9LFxuICBvbkNoYW5nZVxufSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnXCIgb25DbGljaz17ZSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiXCI+XG4gICAgICAgIDxQYW5lbExhYmVsPntsYWJlbH08L1BhbmVsTGFiZWw+XG4gICAgICA8L2Rpdj5cbiAgICAgIHt0eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0IGRhcmsgc2VsZWN0LS1zbWFsbCBmbHVzaFwiPlxuICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsdXNoXCJcbiAgICAgICAgICAgIGlkPXtsYWJlbH1cbiAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoe3RhcmdldH0pID0+IG9uQ2hhbmdlKHRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge29wdGlvbnMubWFwKG9wdGlvbiA9PiAoXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbn0ga2V5PXtvcHRpb259PlxuICAgICAgICAgICAgICAgIHt0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgICAgPyBjYXBpdGFsaXplRmlyc3RMZXR0ZXIob3B0aW9uKVxuICAgICAgICAgICAgICAgICAgOiBvcHRpb259XG4gICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHt0eXBlID09PSAnc2xpZGVyJyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zbGlkZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2NvbmZpZ19fc2xpZGVyX19zbGlkZXJcIj5cbiAgICAgICAgICAgIDxSYW5nZVNsaWRlclxuICAgICAgICAgICAgICBtaW5WYWx1ZT17b3B0aW9uc1swXX1cbiAgICAgICAgICAgICAgbWF4VmFsdWU9e29wdGlvbnNbMV19XG4gICAgICAgICAgICAgIHZhbHVlMD17b3B0aW9uc1swXX1cbiAgICAgICAgICAgICAgdmFsdWUxPXt2YWx1ZX1cbiAgICAgICAgICAgICAgc3RlcD17MX1cbiAgICAgICAgICAgICAgaXNSYW5nZWQ9e2ZhbHNlfVxuICAgICAgICAgICAgICBzaG93SW5wdXQ9e2ZhbHNlfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17dmFsID0+IG9uQ2hhbmdlKHZhbFsxXSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zbGlkZXJfX251bWJlclwiPnt2YWx1ZX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge3R5cGUgPT09ICdzd2l0Y2gnICYmIChcbiAgICAgICAgPFN3aXRjaFxuICAgICAgICAgIHN0eWxlPXt7bWFyZ2luQm90dG9tOiAwLCBtYXJnaW5SaWdodDogJy0xMHB4J319XG4gICAgICAgICAgY2hlY2tlZD17dmFsdWV9XG4gICAgICAgICAgaWQ9e2Ake2NhdGVnb3J5fS0ke2xhYmVsfS10b2dnbGVgfVxuICAgICAgICAgIGxhYmVsPVwiXCJcbiAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBvbkNoYW5nZSghdmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmZ1bmN0aW9uIENvbG9yUGFsZXR0ZSh7Y2F0ZWdvcnksIGNvbmZpZywgd2lkdGgsIG9uU2VsZWN0LCBzZWxlY3RlZH0pIHtcbiAgY29uc3Qge3N0ZXBzLCByZXZlcnNlZCwgdHlwZX0gPSBjb25maWc7XG5cbiAgY29uc3QgY29sb3JSYW5nZXMgPSBDT0xPUl9SQU5HRVMuZmlsdGVyKGNvbG9yUmFuZ2UgPT4ge1xuICAgIGNvbnN0IGlzQ2F0ZWdvcnkgPSBjb2xvclJhbmdlLmNhdGVnb3J5ID09PSBjYXRlZ29yeTtcbiAgICBjb25zdCBpc1R5cGUgPVxuICAgICAgIXR5cGUgfHwgdHlwZS52YWx1ZSA9PT0gJ2FsbCcgfHwgdHlwZS52YWx1ZSA9PT0gY29sb3JSYW5nZS50eXBlO1xuICAgIGNvbnN0IGlzU3RlcCA9ICFzdGVwcyB8fCBOdW1iZXIoc3RlcHMudmFsdWUpID09PSBjb2xvclJhbmdlLmNvbG9ycy5sZW5ndGg7XG5cbiAgICByZXR1cm4gaXNDYXRlZ29yeSAmJiBpc1R5cGUgJiYgaXNTdGVwO1xuICB9KTtcblxuICBjb25zdCBpc1JldmVyc2VkID0gQm9vbGVhbihyZXZlcnNlZCAmJiByZXZlcnNlZC52YWx1ZSk7XG4gIGNvbnN0IHBhZGRpbmcgPSAxNDtcblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICB7Y29sb3JSYW5nZXMubWFwKGNvbG9yUmFuZ2UgPT4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdjb2xvci1yYW5nZXMnLCB7XG4gICAgICAgICAgICBzZWxlY3RlZDpcbiAgICAgICAgICAgICAgY29sb3JSYW5nZS5uYW1lID09PSBzZWxlY3RlZC5uYW1lICYmXG4gICAgICAgICAgICAgIGlzUmV2ZXJzZWQgPT09IEJvb2xlYW4oc2VsZWN0ZWQucmV2ZXJzZWQpXG4gICAgICAgICAgfSl9XG4gICAgICAgICAgc3R5bGU9e3twYWRkaW5nTGVmdDogcGFkZGluZywgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nfX1cbiAgICAgICAgICBrZXk9e2NvbG9yUmFuZ2UubmFtZX1cbiAgICAgICAgICBvbkNsaWNrPXtlID0+XG4gICAgICAgICAgICBvblNlbGVjdCh7XG4gICAgICAgICAgICAgIGNvbG9yUmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAuLi5jb2xvclJhbmdlLFxuICAgICAgICAgICAgICAgIHJldmVyc2VkOiBpc1JldmVyc2VkLFxuICAgICAgICAgICAgICAgIGNvbG9yczogaXNSZXZlcnNlZFxuICAgICAgICAgICAgICAgICAgPyBjb2xvclJhbmdlLmNvbG9ycy5zbGljZSgpLnJldmVyc2UoKVxuICAgICAgICAgICAgICAgICAgOiBjb2xvclJhbmdlLmNvbG9yc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgPlxuICAgICAgICAgIDxDb2xvclJhbmdlUGFsZXR0ZVxuICAgICAgICAgICAgd2lkdGg9e3dpZHRoIC0gcGFkZGluZyAqIDIgLSA1fVxuICAgICAgICAgICAgaGVpZ2h0PXtQQUxFVFRFX0hFSUdIVH1cbiAgICAgICAgICAgIGNvbG9ycz17XG4gICAgICAgICAgICAgIGlzUmV2ZXJzZWRcbiAgICAgICAgICAgICAgICA/IGNvbG9yUmFuZ2UuY29sb3JzLnNsaWNlKCkucmV2ZXJzZSgpXG4gICAgICAgICAgICAgICAgOiBjb2xvclJhbmdlLmNvbG9yc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbkNvbG9yUmFuZ2VTZWxlY3QucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19