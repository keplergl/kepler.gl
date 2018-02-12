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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  padding: 12px 12px 0 12px;\n'], ['\n  padding: 12px 12px 0 12px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  padding-bottom: 12px;\n'], ['\n  padding-bottom: 12px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  .color-palette__config__label {\n    flex-grow: 1;\n  }\n  .color-palette__config__select {\n    flex-grow: 1;\n  }\n  .item-selector .item-selector__dropdown {\n    ', ';\n  }\n'], ['\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  .color-palette__config__label {\n    flex-grow: 1;\n  }\n  .color-palette__config__select {\n    flex-grow: 1;\n  }\n  .item-selector .item-selector__dropdown {\n    ', ';\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  padding: 0 8px;\n  :hover {\n    background-color: ', ';\n    cursor: pointer;\n  }\n'], ['\n  padding: 0 8px;\n  :hover {\n    background-color: ', ';\n    cursor: pointer;\n  }\n']);

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
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorRangeSelect);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = ColorRangeSelect.__proto__ || Object.getPrototypeOf(ColorRangeSelect)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
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
    }, _this._updateConfig = function (_ref2) {
      var key = _ref2.key,
          value = _ref2.value;

      var currentValue = _this.state.config[key].value;
      if (value !== currentValue) {
        _this.setState({
          config: (0, _extends4.default)({}, _this.state.config, (0, _defineProperty3.default)({}, key, (0, _extends4.default)({}, _this.state.config[key], {
            value: value
          })))
        });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(ColorRangeSelect, [{
    key: 'render',
    value: function render() {
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
    }
  }]);
  return ColorRangeSelect;
}(_react.Component);

exports.default = ColorRangeSelect;


var StyledPaletteConfig = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.secondaryInput;
});

var PaletteConfig = function PaletteConfig(_ref3) {
  var category = _ref3.category,
      label = _ref3.label,
      _ref3$config = _ref3.config,
      type = _ref3$config.type,
      value = _ref3$config.value,
      options = _ref3$config.options,
      _onChange = _ref3.onChange;
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
          range: options,
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

var ColorPaletteGroup = function ColorPaletteGroup(_ref4) {
  var _ref4$config = _ref4.config,
      config = _ref4$config === undefined ? {} : _ref4$config,
      onSelect = _ref4.onSelect,
      selected = _ref4.selected,
      colorRanges = _ref4.colorRanges;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2Utc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiQUxMX1RZUEVTIiwibWFwIiwiYyIsInR5cGUiLCJjb25jYXQiLCJBTExfU1RFUFMiLCJkIiwiY29sb3JzIiwibGVuZ3RoIiwicHJvcFR5cGVzIiwiY29sb3JSYW5nZXMiLCJhcnJheSIsInNlbGVjdGVkQ29sb3JSYW5nZSIsIm9iamVjdCIsIm9uU2VsZWN0Q29sb3JSYW5nZSIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiZGVmYXVsdFByb3BzIiwiU3R5bGVkQ29sb3JDb25maWciLCJkaXYiLCJDb2xvclJhbmdlU2VsZWN0b3IiLCJDb2xvclJhbmdlU2VsZWN0Iiwic3RhdGUiLCJjb25maWciLCJ2YWx1ZSIsIm9wdGlvbnMiLCJzdGVwcyIsInJldmVyc2VkIiwiX3VwZGF0ZUNvbmZpZyIsImtleSIsImN1cnJlbnRWYWx1ZSIsInNldFN0YXRlIiwiT2JqZWN0Iiwia2V5cyIsInByb3BzIiwiU3R5bGVkUGFsZXR0ZUNvbmZpZyIsInRoZW1lIiwic2Vjb25kYXJ5SW5wdXQiLCJQYWxldHRlQ29uZmlnIiwiY2F0ZWdvcnkiLCJsYWJlbCIsIm9uQ2hhbmdlIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInZhbCIsIlN0eWxlZENvbG9yUmFuZ2UiLCJwYW5lbEJhY2tncm91bmRIb3ZlciIsIkNvbG9yUGFsZXR0ZUdyb3VwIiwib25TZWxlY3QiLCJzZWxlY3RlZCIsImZpbHRlcmVkIiwiZmlsdGVyIiwiaXNUeXBlIiwiY29sb3JSYW5nZSIsImlzU3RlcCIsIk51bWJlciIsImlzUmV2ZXJzZWQiLCJCb29sZWFuIiwibmFtZSIsInNsaWNlIiwicmV2ZXJzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7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Q0UscUJBQVUsY0FEWjtBQUVFLGVBQUtvRCxXQUFXSyxJQUZsQjtBQUdFLG1CQUFTO0FBQUEsbUJBQ1BWLG9DQUVPSyxVQUZQO0FBR0kxQix3QkFBVTZCLFVBSGQ7QUFJSWpELHNCQUFRaUQsYUFDSkgsV0FBVzlDLE1BQVgsQ0FBa0JvRCxLQUFsQixHQUEwQkMsT0FBMUIsRUFESSxHQUVKUCxXQUFXOUM7QUFObkIsZ0JBUUVtQyxDQVJGLENBRE87QUFBQTtBQUhYO0FBZ0JFO0FBQ0Usa0JBQVFXLFdBQVc5QyxNQURyQjtBQUVFLHNCQUFZaUQsVUFGZDtBQUdFLHNCQUNFSCxXQUFXSyxJQUFYLEtBQW9CVCxTQUFTUyxJQUE3QixJQUNBRixlQUFlQyxRQUFRUixTQUFTdEIsUUFBakI7QUFMbkI7QUFoQkYsT0FEWTtBQUFBLEtBQWI7QUFESCxHQURGO0FBK0JELENBNUNEOztBQThDQU4saUJBQWlCWixTQUFqQixHQUE2QkEsU0FBN0I7QUFDQVksaUJBQWlCSixZQUFqQixHQUFnQ0EsWUFBaEMiLCJmaWxlIjoiY29sb3ItcmFuZ2Utc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gudW5pcSc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcbmltcG9ydCB7UGFuZWxMYWJlbH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IFJhbmdlU2xpZGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3JhbmdlLXNsaWRlcic7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQgQ29sb3JQYWxldHRlIGZyb20gJy4vY29sb3ItcGFsZXR0ZSc7XG5cbmltcG9ydCB7Q09MT1JfUkFOR0VTfSBmcm9tICdjb25zdGFudHMvY29sb3ItcmFuZ2VzJztcblxuY29uc3QgQUxMX1RZUEVTID0gdW5pcShDT0xPUl9SQU5HRVMubWFwKGMgPT4gYy50eXBlKS5jb25jYXQoWydhbGwnXSkpO1xuY29uc3QgQUxMX1NURVBTID0gdW5pcShDT0xPUl9SQU5HRVMubWFwKGQgPT4gZC5jb2xvcnMubGVuZ3RoKSk7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgY29sb3JSYW5nZXM6IFByb3BUeXBlcy5hcnJheSxcbiAgc2VsZWN0ZWRDb2xvclJhbmdlOiBQcm9wVHlwZXMub2JqZWN0LFxuICBvblNlbGVjdENvbG9yUmFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgY29sb3JSYW5nZXM6IENPTE9SX1JBTkdFUyxcbiAgb25TZWxlY3RDb2xvclJhbmdlOiAoKSA9PiB7fVxufTtcblxuY29uc3QgU3R5bGVkQ29sb3JDb25maWcgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiAxMnB4IDEycHggMCAxMnB4O1xuYDtcblxuY29uc3QgQ29sb3JSYW5nZVNlbGVjdG9yID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1ib3R0b206IDEycHg7XG5gO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3JSYW5nZVNlbGVjdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRlID0ge1xuICAgIGNvbmZpZzoge1xuICAgICAgdHlwZToge1xuICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgdmFsdWU6ICdhbGwnLFxuICAgICAgICBvcHRpb25zOiBBTExfVFlQRVNcbiAgICAgIH0sXG4gICAgICBzdGVwczoge1xuICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICAgICAgdmFsdWU6IDYsXG4gICAgICAgIG9wdGlvbnM6IEFMTF9TVEVQU1xuICAgICAgfSxcbiAgICAgIHJldmVyc2VkOiB7XG4gICAgICAgIHR5cGU6ICdzd2l0Y2gnLFxuICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgIG9wdGlvbnM6IFt0cnVlLCBmYWxzZV1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX3VwZGF0ZUNvbmZpZyA9ICh7a2V5LCB2YWx1ZX0pID0+IHtcbiAgICBjb25zdCBjdXJyZW50VmFsdWUgPSB0aGlzLnN0YXRlLmNvbmZpZ1trZXldLnZhbHVlO1xuICAgIGlmICh2YWx1ZSAhPT0gY3VycmVudFZhbHVlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgLi4udGhpcy5zdGF0ZS5jb25maWcsXG4gICAgICAgICAgW2tleV06IHtcbiAgICAgICAgICAgIC4uLnRoaXMuc3RhdGUuY29uZmlnW2tleV0sXG4gICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7Y29uZmlnfSA9IHRoaXMuc3RhdGU7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDb2xvclJhbmdlU2VsZWN0b3IgY2xhc3NOYW1lPVwiY29sb3ItcmFuZ2Utc2VsZWN0b3JcIj5cbiAgICAgICAgPFN0eWxlZENvbG9yQ29uZmlnPlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhjb25maWcpLm1hcChrZXkgPT4gKFxuICAgICAgICAgICAgPFBhbGV0dGVDb25maWdcbiAgICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICAgIGxhYmVsPXtrZXl9XG4gICAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnW2tleV19XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt2YWx1ZSA9PiB0aGlzLl91cGRhdGVDb25maWcoe2tleSwgdmFsdWV9KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvU3R5bGVkQ29sb3JDb25maWc+XG4gICAgICAgIDxDb2xvclBhbGV0dGVHcm91cFxuICAgICAgICAgIGNvbmZpZz17Y29uZmlnfVxuICAgICAgICAgIGNvbG9yUmFuZ2VzPXt0aGlzLnByb3BzLmNvbG9yUmFuZ2VzfVxuICAgICAgICAgIG9uU2VsZWN0PXt0aGlzLnByb3BzLm9uU2VsZWN0Q29sb3JSYW5nZX1cbiAgICAgICAgICBzZWxlY3RlZD17dGhpcy5wcm9wcy5zZWxlY3RlZENvbG9yUmFuZ2V9XG4gICAgICAgIC8+XG4gICAgICA8L0NvbG9yUmFuZ2VTZWxlY3Rvcj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IFN0eWxlZFBhbGV0dGVDb25maWcgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgLmNvbG9yLXBhbGV0dGVfX2NvbmZpZ19fbGFiZWwge1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgfVxuICAuY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zZWxlY3Qge1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgfVxuICAuaXRlbS1zZWxlY3RvciAuaXRlbS1zZWxlY3Rvcl9fZHJvcGRvd24ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXR9O1xuICB9XG5gO1xuXG5jb25zdCBQYWxldHRlQ29uZmlnID0gKHtcbiAgY2F0ZWdvcnksXG4gIGxhYmVsLFxuICBjb25maWc6IHt0eXBlLCB2YWx1ZSwgb3B0aW9uc30sXG4gIG9uQ2hhbmdlXG59KSA9PiAoXG4gIDxTdHlsZWRQYWxldHRlQ29uZmlnXG4gICAgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnXCJcbiAgICBvbkNsaWNrPXtlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gID5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2NvbmZpZ19fbGFiZWxcIj5cbiAgICAgIDxQYW5lbExhYmVsPntsYWJlbH08L1BhbmVsTGFiZWw+XG4gICAgPC9kaXY+XG4gICAge3R5cGUgPT09ICdzZWxlY3QnICYmIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zZWxlY3RcIj5cbiAgICAgICAgPEl0ZW1TZWxlY3RvclxuICAgICAgICAgIHNlbGVjdGVkSXRlbXM9e3ZhbHVlfVxuICAgICAgICAgIG9wdGlvbnM9e29wdGlvbnN9XG4gICAgICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgICAgIHNlYXJjaGFibGU9e2ZhbHNlfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICl9XG4gICAge3R5cGUgPT09ICdzbGlkZXInICYmIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zbGlkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlX19jb25maWdfX3NsaWRlcl9fc2xpZGVyXCI+XG4gICAgICAgICAgPFJhbmdlU2xpZGVyXG4gICAgICAgICAgICByYW5nZT17b3B0aW9uc31cbiAgICAgICAgICAgIHZhbHVlMD17b3B0aW9uc1swXX1cbiAgICAgICAgICAgIHZhbHVlMT17dmFsdWV9XG4gICAgICAgICAgICBzdGVwPXsxfVxuICAgICAgICAgICAgaXNSYW5nZWQ9e2ZhbHNlfVxuICAgICAgICAgICAgc2hvd0lucHV0PXtmYWxzZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2YWwgPT4gb25DaGFuZ2UodmFsWzFdKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlX19jb25maWdfX3NsaWRlcl9fbnVtYmVyXCI+e3ZhbHVlfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKX1cbiAgICB7dHlwZSA9PT0gJ3N3aXRjaCcgJiYgKFxuICAgICAgPFN3aXRjaFxuICAgICAgICBjaGVja2VkPXt2YWx1ZX1cbiAgICAgICAgaWQ9e2Ake2NhdGVnb3J5fS0ke2xhYmVsfS10b2dnbGVgfVxuICAgICAgICBvbkNoYW5nZT17KCkgPT4gb25DaGFuZ2UoIXZhbHVlKX1cbiAgICAgICAgc2Vjb25kYXJ5XG4gICAgICAvPlxuICAgICl9XG4gIDwvU3R5bGVkUGFsZXR0ZUNvbmZpZz5cbik7XG5cbmNvbnN0IFN0eWxlZENvbG9yUmFuZ2UgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiAwIDhweDtcbiAgOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyfTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmNvbnN0IENvbG9yUGFsZXR0ZUdyb3VwID0gKHtjb25maWcgPSB7fSwgb25TZWxlY3QsIHNlbGVjdGVkLCBjb2xvclJhbmdlc30pID0+IHtcbiAgY29uc3Qge3N0ZXBzLCByZXZlcnNlZCwgdHlwZX0gPSBjb25maWc7XG5cbiAgY29uc3QgZmlsdGVyZWQgPSBjb2xvclJhbmdlcy5maWx0ZXIoY29sb3JSYW5nZSA9PiB7XG4gICAgY29uc3QgaXNUeXBlID1cbiAgICAgICF0eXBlIHx8IHR5cGUudmFsdWUgPT09ICdhbGwnIHx8IHR5cGUudmFsdWUgPT09IGNvbG9yUmFuZ2UudHlwZTtcbiAgICBjb25zdCBpc1N0ZXAgPSAhc3RlcHMgfHwgTnVtYmVyKHN0ZXBzLnZhbHVlKSA9PT0gY29sb3JSYW5nZS5jb2xvcnMubGVuZ3RoO1xuXG4gICAgcmV0dXJuIGlzVHlwZSAmJiBpc1N0ZXA7XG4gIH0pO1xuXG4gIGNvbnN0IGlzUmV2ZXJzZWQgPSBCb29sZWFuKHJldmVyc2VkICYmIHJldmVyc2VkLnZhbHVlKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fZ3JvdXBcIj5cbiAgICAgIHtmaWx0ZXJlZC5tYXAoY29sb3JSYW5nZSA9PiAoXG4gICAgICAgIDxTdHlsZWRDb2xvclJhbmdlXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY29sb3ItcmFuZ2VzXCJcbiAgICAgICAgICBrZXk9e2NvbG9yUmFuZ2UubmFtZX1cbiAgICAgICAgICBvbkNsaWNrPXtlID0+XG4gICAgICAgICAgICBvblNlbGVjdChcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLmNvbG9yUmFuZ2UsXG4gICAgICAgICAgICAgICAgcmV2ZXJzZWQ6IGlzUmV2ZXJzZWQsXG4gICAgICAgICAgICAgICAgY29sb3JzOiBpc1JldmVyc2VkXG4gICAgICAgICAgICAgICAgICA/IGNvbG9yUmFuZ2UuY29sb3JzLnNsaWNlKCkucmV2ZXJzZSgpXG4gICAgICAgICAgICAgICAgICA6IGNvbG9yUmFuZ2UuY29sb3JzXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGVcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgID5cbiAgICAgICAgICA8Q29sb3JQYWxldHRlXG4gICAgICAgICAgICBjb2xvcnM9e2NvbG9yUmFuZ2UuY29sb3JzfVxuICAgICAgICAgICAgaXNSZXZlcnNlZD17aXNSZXZlcnNlZH1cbiAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e1xuICAgICAgICAgICAgICBjb2xvclJhbmdlLm5hbWUgPT09IHNlbGVjdGVkLm5hbWUgJiZcbiAgICAgICAgICAgICAgaXNSZXZlcnNlZCA9PT0gQm9vbGVhbihzZWxlY3RlZC5yZXZlcnNlZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1N0eWxlZENvbG9yUmFuZ2U+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNvbG9yUmFuZ2VTZWxlY3QucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuQ29sb3JSYW5nZVNlbGVjdC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=