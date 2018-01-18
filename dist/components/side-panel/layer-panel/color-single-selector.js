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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

var _uberColors = require('../../../constants/uber-colors');

var _reactAccordion = require('@uber/react-accordion');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: remove uber colors, replace with generic color schemes
var PALLETE_HEIGHT = 8;

// TODO: remove uber/react-accordion

var PADDING = 6;

var propTypes = {
  width: _propTypes2.default.number.isRequired,
  setColor: _propTypes2.default.func.isRequired,
  selectedColor: _propTypes2.default.string.isRequired
};

var ColorSingleSelect = function (_Component) {
  (0, _inherits3.default)(ColorSingleSelect, _Component);

  function ColorSingleSelect() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, ColorSingleSelect);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._onSelectColor = function (color, e) {
      e.stopPropagation();
      _this.props.setColor(color);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  ColorSingleSelect.prototype.render = function render() {
    var _props = this.props,
        width = _props.width,
        selectedColor = _props.selectedColor;


    return _react2.default.createElement(
      _reactAccordion.Accordion,
      { className: 'one-whole flush color-single-selector',
        style: { width: width, margin: 'auto' } },
      _react2.default.createElement('div', { className: 'display--inline-block color--block',
        style: { backgroundColor: selectedColor } }),
      _react2.default.createElement(
        _reactAccordion.StatefulAccordionItem,
        {
          linkText: '" "' },
        _react2.default.createElement(ColorPalette, {
          width: width,
          selectedColor: selectedColor,
          onSelectColor: this._onSelectColor })
      )
    );
  };

  return ColorSingleSelect;
}(_react.Component);

exports.default = ColorSingleSelect;


ColorSingleSelect.propTypes = propTypes;

var ColorPalette = function ColorPalette(_ref) {
  var width = _ref.width,
      selectedColor = _ref.selectedColor,
      onSelectColor = _ref.onSelectColor;


  // max row length
  var rows = 16;
  var columns = _uberColors.Themes;
  var height = PALLETE_HEIGHT * rows + 2 * PADDING;

  var scale = (0, _d3Scale.scaleBand)().domain((0, _d3Array.range)(0, columns.length, 1)).range([0, width - 2 * PADDING]).round(true);

  var bandWidth = scale.bandwidth();

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'svg',
      { style: { width: width, height: height } },
      columns.map(function (theme, col) {
        return _react2.default.createElement(
          'g',
          { transform: 'translate(' + (scale(col) - bandWidth / 2 + 4 + PADDING) + ', 0)',
            key: theme },
          (0, _d3Array.range)(1, rows + 1, 1).map(function (key, i) {
            return _react2.default.createElement('rect', { className: 'cursor--pointer',
              width: bandWidth - 2,
              height: PALLETE_HEIGHT - 2,
              key: theme + '_' + key,
              x: '2',
              y: PALLETE_HEIGHT * i + 2 + PADDING,
              style: {
                fill: _uberColors.ColorsByTheme[theme][String(key)],
                stroke: selectedColor === _uberColors.ColorsByTheme[theme][String(key)] ? '#ff0000' : _uberColors.ColorsByTheme[theme][String(key)],
                strokeWidth: 2
              },
              onClick: function onClick(e) {
                return onSelectColor(_uberColors.ColorsByTheme[theme][String(key)], e);
              } });
          })
        );
      })
    )
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3Itc2luZ2xlLXNlbGVjdG9yLmpzIl0sIm5hbWVzIjpbIlBBTExFVEVfSEVJR0hUIiwiUEFERElORyIsInByb3BUeXBlcyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInNldENvbG9yIiwiZnVuYyIsInNlbGVjdGVkQ29sb3IiLCJzdHJpbmciLCJDb2xvclNpbmdsZVNlbGVjdCIsIl9vblNlbGVjdENvbG9yIiwiY29sb3IiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJvcHMiLCJyZW5kZXIiLCJtYXJnaW4iLCJiYWNrZ3JvdW5kQ29sb3IiLCJDb2xvclBhbGV0dGUiLCJvblNlbGVjdENvbG9yIiwicm93cyIsImNvbHVtbnMiLCJoZWlnaHQiLCJzY2FsZSIsImRvbWFpbiIsImxlbmd0aCIsInJhbmdlIiwicm91bmQiLCJiYW5kV2lkdGgiLCJiYW5kd2lkdGgiLCJtYXAiLCJ0aGVtZSIsImNvbCIsImtleSIsImkiLCJmaWxsIiwiU3RyaW5nIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBR0E7Ozs7QUFKQTtBQU1BLElBQU1BLGlCQUFpQixDQUF2Qjs7QUFIQTs7QUFJQSxJQUFNQyxVQUFVLENBQWhCOztBQUVBLElBQU1DLFlBQVk7QUFDaEJDLFNBQU8sb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFI7QUFFaEJDLFlBQVUsb0JBQVVDLElBQVYsQ0FBZUYsVUFGVDtBQUdoQkcsaUJBQWUsb0JBQVVDLE1BQVYsQ0FBaUJKO0FBSGhCLENBQWxCOztJQU1xQkssaUI7Ozs7Ozs7Ozs7OzswSkFFbkJDLGMsR0FBaUIsVUFBQ0MsS0FBRCxFQUFRQyxDQUFSLEVBQWM7QUFDN0JBLFFBQUVDLGVBQUY7QUFDQSxZQUFLQyxLQUFMLENBQVdULFFBQVgs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cG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtzY2FsZUJhbmR9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7cmFuZ2V9IGZyb20gJ2QzLWFycmF5JztcblxuLy8gVE9ETzogcmVtb3ZlIHViZXIgY29sb3JzLCByZXBsYWNlIHdpdGggZ2VuZXJpYyBjb2xvciBzY2hlbWVzXG5pbXBvcnQge0NvbG9yc0J5VGhlbWUsIFRoZW1lc30gZnJvbSAnY29uc3RhbnRzL3ViZXItY29sb3JzJztcblxuLy8gVE9ETzogcmVtb3ZlIHViZXIvcmVhY3QtYWNjb3JkaW9uXG5pbXBvcnQge0FjY29yZGlvbiwgU3RhdGVmdWxBY2NvcmRpb25JdGVtfSBmcm9tICdAdWJlci9yZWFjdC1hY2NvcmRpb24nO1xuXG5jb25zdCBQQUxMRVRFX0hFSUdIVCA9IDg7XG5jb25zdCBQQURESU5HID0gNjtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBzZXRDb2xvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgc2VsZWN0ZWRDb2xvcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvclNpbmdsZVNlbGVjdCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgX29uU2VsZWN0Q29sb3IgPSAoY29sb3IsIGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMucHJvcHMuc2V0Q29sb3IoY29sb3IpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7d2lkdGgsIHNlbGVjdGVkQ29sb3J9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8QWNjb3JkaW9uIGNsYXNzTmFtZT1cIm9uZS13aG9sZSBmbHVzaCBjb2xvci1zaW5nbGUtc2VsZWN0b3JcIlxuICAgICAgICBzdHlsZT17e3dpZHRoLCBtYXJnaW46ICdhdXRvJ319PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpc3BsYXktLWlubGluZS1ibG9jayBjb2xvci0tYmxvY2tcIlxuICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZENvbG9yOiBzZWxlY3RlZENvbG9yfX0vPlxuICAgICAgICA8U3RhdGVmdWxBY2NvcmRpb25JdGVtXG4gICAgICAgICAgbGlua1RleHQ9e2BcIiBcImB9PlxuICAgICAgICAgIDxDb2xvclBhbGV0dGVcbiAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgIHNlbGVjdGVkQ29sb3I9e3NlbGVjdGVkQ29sb3J9XG4gICAgICAgICAgICBvblNlbGVjdENvbG9yPXt0aGlzLl9vblNlbGVjdENvbG9yfS8+XG4gICAgICAgIDwvU3RhdGVmdWxBY2NvcmRpb25JdGVtPlxuICAgICAgPC9BY2NvcmRpb24+XG4gICAgKTtcblxuICB9XG59XG5cbkNvbG9yU2luZ2xlU2VsZWN0LnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgQ29sb3JQYWxldHRlID0gKHt3aWR0aCwgc2VsZWN0ZWRDb2xvciwgb25TZWxlY3RDb2xvcn0pID0+IHtcblxuICAgIC8vIG1heCByb3cgbGVuZ3RoXG4gIGNvbnN0IHJvd3MgPSAxNjtcbiAgY29uc3QgY29sdW1ucyA9IFRoZW1lcztcbiAgY29uc3QgaGVpZ2h0ID0gUEFMTEVURV9IRUlHSFQgKiByb3dzICsgMiAqIFBBRERJTkc7XG5cbiAgY29uc3Qgc2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgIC5kb21haW4ocmFuZ2UoMCwgY29sdW1ucy5sZW5ndGgsIDEpKVxuICAgIC5yYW5nZShbMCwgd2lkdGggLSAyICogUEFERElOR10pXG4gICAgLnJvdW5kKHRydWUpO1xuXG4gIGNvbnN0IGJhbmRXaWR0aCA9IHNjYWxlLmJhbmR3aWR0aCgpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxzdmcgc3R5bGU9eyB7d2lkdGgsIGhlaWdodH0gfT5cbiAgICAgIHtjb2x1bW5zLm1hcCgodGhlbWUsIGNvbCkgPT4gKFxuICAgICAgICA8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtzY2FsZShjb2wpIC0gYmFuZFdpZHRoIC8gMiArIDQgKyBQQURESU5HfSwgMClgfVxuICAgICAgICAgICBrZXk9e3RoZW1lfT5cbiAgICAgICAgICB7cmFuZ2UoMSwgcm93cyArIDEsIDEpLm1hcCgoa2V5LCBpKSA9PlxuICAgICAgICAgICAgPHJlY3QgY2xhc3NOYW1lPVwiY3Vyc29yLS1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgIHdpZHRoPXsgYmFuZFdpZHRoIC0gMiB9XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ9eyBQQUxMRVRFX0hFSUdIVCAtIDIgfVxuICAgICAgICAgICAgICAgICAga2V5PXsgYCR7dGhlbWV9XyR7a2V5fWAgfVxuICAgICAgICAgICAgICAgICAgeD1cIjJcIlxuICAgICAgICAgICAgICAgICAgeT17IFBBTExFVEVfSEVJR0hUICogaSArIDIgKyBQQURESU5HIH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZpbGw6IENvbG9yc0J5VGhlbWVbdGhlbWVdW1N0cmluZyhrZXkpXSxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBzZWxlY3RlZENvbG9yID09PSBDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV0gPyAnI2ZmMDAwMCcgOiBDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV0sXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAyXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiBvblNlbGVjdENvbG9yKENvbG9yc0J5VGhlbWVbdGhlbWVdW1N0cmluZyhrZXkpXSwgZSl9PlxuICAgICAgICAgICAgPC9yZWN0PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZz5cbiAgICAgICkpfVxuICAgICAgPC9zdmc+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuIl19