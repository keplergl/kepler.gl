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
      {
        className: 'one-whole flush color-single-selector',
        style: { width: width, margin: 'auto' }
      },
      _react2.default.createElement('div', {
        className: 'display--inline-block color--block',
        style: { backgroundColor: selectedColor }
      }),
      _react2.default.createElement(
        _reactAccordion.StatefulAccordionItem,
        { linkText: '" "' },
        _react2.default.createElement(ColorPalette, {
          width: width,
          selectedColor: selectedColor,
          onSelectColor: this._onSelectColor
        })
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
          {
            transform: 'translate(' + (scale(col) - bandWidth / 2 + 4 + PADDING) + ', 0)',
            key: theme
          },
          (0, _d3Array.range)(1, rows + 1, 1).map(function (key, i) {
            return _react2.default.createElement('rect', {
              className: 'cursor--pointer',
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
              }
            });
          })
        );
      })
    )
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3Itc2luZ2xlLXNlbGVjdG9yLmpzIl0sIm5hbWVzIjpbIlBBTExFVEVfSEVJR0hUIiwiUEFERElORyIsInByb3BUeXBlcyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInNldENvbG9yIiwiZnVuYyIsInNlbGVjdGVkQ29sb3IiLCJzdHJpbmciLCJDb2xvclNpbmdsZVNlbGVjdCIsIl9vblNlbGVjdENvbG9yIiwiY29sb3IiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJvcHMiLCJyZW5kZXIiLCJtYXJnaW4iLCJiYWNrZ3JvdW5kQ29sb3IiLCJDb2xvclBhbGV0dGUiLCJvblNlbGVjdENvbG9yIiwicm93cyIsImNvbHVtbnMiLCJoZWlnaHQiLCJzY2FsZSIsImRvbWFpbiIsImxlbmd0aCIsInJhbmdlIiwicm91bmQiLCJiYW5kV2lkdGgiLCJiYW5kd2lkdGgiLCJtYXAiLCJ0aGVtZSIsImNvbCIsImtleSIsImkiLCJmaWxsIiwiU3RyaW5nIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBR0E7Ozs7QUFKQTtBQU1BLElBQU1BLGlCQUFpQixDQUF2Qjs7QUFIQTs7QUFJQSxJQUFNQyxVQUFVLENBQWhCOztBQUVBLElBQU1DLFlBQVk7QUFDaEJDLFNBQU8sb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFI7QUFFaEJDLFlBQVUsb0JBQVVDLElBQVYsQ0FBZUYsVUFGVDtBQUdoQkcsaUJBQWUsb0JBQVVDLE1BQVYsQ0FBaUJKO0FBSGhCLENBQWxCOztJQU1xQkssaUI7Ozs7Ozs7Ozs7OzswSkFDbkJDLGMsR0FBaUIsVUFBQ0MsS0FBRCxFQUFRQyxDQUFSLEVBQWM7QUFDN0JBLFFBQUVDLGVBQUY7QUFDQSxZQUFLQyxLQUFMLENBQVdULFFBQVgsQ0FBb0JNLEtBQXBCO0FBQ0QsSzs7OzhCQUVESSxNLHFCQUFTO0FBQUEsaUJBQ3dCLEtBQUtELEtBRDdCO0FBQUEsUUFDQVosS0FEQSxVQUNBQSxLQURBO0FBQUEsUUFDT0ssYUFEUCxVQUNPQSxhQURQOzs7QUFHUCxXQUNFO0FBQUE7QUFBQTtBQUNFLG1CQUFVLHVDQURaO0FBRUUsZUFBTyxFQUFDTCxZQUFELEVBQVFjLFFBQVEsTUFBaEI7QUFGVDtBQUlFO0FBQ0UsbUJBQVUsb0NBRFo7QUFFRSxlQUFPLEVBQUNDLGlCQUFpQlYsYUFBbEI7QUFGVCxRQUpGO0FBUUU7QUFBQTtBQUFBLFVBQXVCLGVBQXZCO0FBQ0Usc0NBQUMsWUFBRDtBQUNFLGlCQUFPTCxLQURUO0FBRUUseUJBQWVLLGFBRmpCO0FBR0UseUJBQWUsS0FBS0c7QUFIdEI7QUFERjtBQVJGLEtBREY7QUFrQkQsRzs7Ozs7a0JBM0JrQkQsaUI7OztBQThCckJBLGtCQUFrQlIsU0FBbEIsR0FBOEJBLFNBQTlCOztBQUVBLElBQU1pQixlQUFlLFNBQWZBLFlBQWUsT0FBMkM7QUFBQSxNQUF6Q2hCLEtBQXlDLFFBQXpDQSxLQUF5QztBQUFBLE1BQWxDSyxhQUFrQyxRQUFsQ0EsYUFBa0M7QUFBQSxNQUFuQlksYUFBbUIsUUFBbkJBLGFBQW1COztBQUM5RDtBQUNBLE1BQU1DLE9BQU8sRUFBYjtBQUNBLE1BQU1DLDRCQUFOO0FBQ0EsTUFBTUMsU0FBU3ZCLGlCQUFpQnFCLElBQWpCLEdBQXdCLElBQUlwQixPQUEzQzs7QUFFQSxNQUFNdUIsUUFBUSwwQkFDWEMsTUFEVyxDQUNKLG9CQUFNLENBQU4sRUFBU0gsUUFBUUksTUFBakIsRUFBeUIsQ0FBekIsQ0FESSxFQUVYQyxLQUZXLENBRUwsQ0FBQyxDQUFELEVBQUl4QixRQUFRLElBQUlGLE9BQWhCLENBRkssRUFHWDJCLEtBSFcsQ0FHTCxJQUhLLENBQWQ7O0FBS0EsTUFBTUMsWUFBWUwsTUFBTU0sU0FBTixFQUFsQjs7QUFFQSxTQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLE9BQU8sRUFBQzNCLFlBQUQsRUFBUW9CLGNBQVIsRUFBWjtBQUNHRCxjQUFRUyxHQUFSLENBQVksVUFBQ0MsS0FBRCxFQUFRQyxHQUFSO0FBQUEsZUFDWDtBQUFBO0FBQUE7QUFDRSx1Q0FBd0JULE1BQU1TLEdBQU4sSUFDdEJKLFlBQVksQ0FEVSxHQUV0QixDQUZzQixHQUd0QjVCLE9BSEYsVUFERjtBQUtFLGlCQUFLK0I7QUFMUDtBQU9HLDhCQUFNLENBQU4sRUFBU1gsT0FBTyxDQUFoQixFQUFtQixDQUFuQixFQUFzQlUsR0FBdEIsQ0FBMEIsVUFBQ0csR0FBRCxFQUFNQyxDQUFOO0FBQUEsbUJBQ3pCO0FBQ0UseUJBQVUsaUJBRFo7QUFFRSxxQkFBT04sWUFBWSxDQUZyQjtBQUdFLHNCQUFRN0IsaUJBQWlCLENBSDNCO0FBSUUsbUJBQVFnQyxLQUFSLFNBQWlCRSxHQUpuQjtBQUtFLGlCQUFFLEdBTEo7QUFNRSxpQkFBR2xDLGlCQUFpQm1DLENBQWpCLEdBQXFCLENBQXJCLEdBQXlCbEMsT0FOOUI7QUFPRSxxQkFBTztBQUNMbUMsc0JBQU0sMEJBQWNKLEtBQWQsRUFBcUJLLE9BQU9ILEdBQVAsQ0FBckIsQ0FERDtBQUVMSSx3QkFDRTlCLGtCQUFrQiwwQkFBY3dCLEtBQWQsRUFBcUJLLE9BQU9ILEdBQVAsQ0FBckIsQ0FBbEIsR0FDSSxTQURKLEdBRUksMEJBQWNGLEtBQWQsRUFBcUJLLE9BQU9ILEdBQVAsQ0FBckIsQ0FMRDtBQU1MSyw2QkFBYTtBQU5SLGVBUFQ7QUFlRSx1QkFBUztBQUFBLHVCQUNQbkIsY0FBYywwQkFBY1ksS0FBZCxFQUFxQkssT0FBT0gsR0FBUCxDQUFyQixDQUFkLEVBQWlEckIsQ0FBakQsQ0FETztBQUFBO0FBZlgsY0FEeUI7QUFBQSxXQUExQjtBQVBILFNBRFc7QUFBQSxPQUFaO0FBREg7QUFERixHQURGO0FBcUNELENBbEREIiwiZmlsZSI6ImNvbG9yLXNpbmdsZS1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7c2NhbGVCYW5kfSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5cbi8vIFRPRE86IHJlbW92ZSB1YmVyIGNvbG9ycywgcmVwbGFjZSB3aXRoIGdlbmVyaWMgY29sb3Igc2NoZW1lc1xuaW1wb3J0IHtDb2xvcnNCeVRoZW1lLCBUaGVtZXN9IGZyb20gJ2NvbnN0YW50cy91YmVyLWNvbG9ycyc7XG5cbi8vIFRPRE86IHJlbW92ZSB1YmVyL3JlYWN0LWFjY29yZGlvblxuaW1wb3J0IHtBY2NvcmRpb24sIFN0YXRlZnVsQWNjb3JkaW9uSXRlbX0gZnJvbSAnQHViZXIvcmVhY3QtYWNjb3JkaW9uJztcblxuY29uc3QgUEFMTEVURV9IRUlHSFQgPSA4O1xuY29uc3QgUEFERElORyA9IDY7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgc2V0Q29sb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHNlbGVjdGVkQ29sb3I6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3JTaW5nbGVTZWxlY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfb25TZWxlY3RDb2xvciA9IChjb2xvciwgZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5wcm9wcy5zZXRDb2xvcihjb2xvcik7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHt3aWR0aCwgc2VsZWN0ZWRDb2xvcn0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxBY2NvcmRpb25cbiAgICAgICAgY2xhc3NOYW1lPVwib25lLXdob2xlIGZsdXNoIGNvbG9yLXNpbmdsZS1zZWxlY3RvclwiXG4gICAgICAgIHN0eWxlPXt7d2lkdGgsIG1hcmdpbjogJ2F1dG8nfX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cImRpc3BsYXktLWlubGluZS1ibG9jayBjb2xvci0tYmxvY2tcIlxuICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZENvbG9yOiBzZWxlY3RlZENvbG9yfX1cbiAgICAgICAgLz5cbiAgICAgICAgPFN0YXRlZnVsQWNjb3JkaW9uSXRlbSBsaW5rVGV4dD17YFwiIFwiYH0+XG4gICAgICAgICAgPENvbG9yUGFsZXR0ZVxuICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcj17c2VsZWN0ZWRDb2xvcn1cbiAgICAgICAgICAgIG9uU2VsZWN0Q29sb3I9e3RoaXMuX29uU2VsZWN0Q29sb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdGF0ZWZ1bEFjY29yZGlvbkl0ZW0+XG4gICAgICA8L0FjY29yZGlvbj5cbiAgICApO1xuICB9XG59XG5cbkNvbG9yU2luZ2xlU2VsZWN0LnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuY29uc3QgQ29sb3JQYWxldHRlID0gKHt3aWR0aCwgc2VsZWN0ZWRDb2xvciwgb25TZWxlY3RDb2xvcn0pID0+IHtcbiAgLy8gbWF4IHJvdyBsZW5ndGhcbiAgY29uc3Qgcm93cyA9IDE2O1xuICBjb25zdCBjb2x1bW5zID0gVGhlbWVzO1xuICBjb25zdCBoZWlnaHQgPSBQQUxMRVRFX0hFSUdIVCAqIHJvd3MgKyAyICogUEFERElORztcblxuICBjb25zdCBzY2FsZSA9IHNjYWxlQmFuZCgpXG4gICAgLmRvbWFpbihyYW5nZSgwLCBjb2x1bW5zLmxlbmd0aCwgMSkpXG4gICAgLnJhbmdlKFswLCB3aWR0aCAtIDIgKiBQQURESU5HXSlcbiAgICAucm91bmQodHJ1ZSk7XG5cbiAgY29uc3QgYmFuZFdpZHRoID0gc2NhbGUuYmFuZHdpZHRoKCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPHN2ZyBzdHlsZT17e3dpZHRoLCBoZWlnaHR9fT5cbiAgICAgICAge2NvbHVtbnMubWFwKCh0aGVtZSwgY29sKSA9PiAoXG4gICAgICAgICAgPGdcbiAgICAgICAgICAgIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3NjYWxlKGNvbCkgLVxuICAgICAgICAgICAgICBiYW5kV2lkdGggLyAyICtcbiAgICAgICAgICAgICAgNCArXG4gICAgICAgICAgICAgIFBBRERJTkd9LCAwKWB9XG4gICAgICAgICAgICBrZXk9e3RoZW1lfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtyYW5nZSgxLCByb3dzICsgMSwgMSkubWFwKChrZXksIGkpID0+IChcbiAgICAgICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjdXJzb3ItLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgIHdpZHRoPXtiYW5kV2lkdGggLSAyfVxuICAgICAgICAgICAgICAgIGhlaWdodD17UEFMTEVURV9IRUlHSFQgLSAyfVxuICAgICAgICAgICAgICAgIGtleT17YCR7dGhlbWV9XyR7a2V5fWB9XG4gICAgICAgICAgICAgICAgeD1cIjJcIlxuICAgICAgICAgICAgICAgIHk9e1BBTExFVEVfSEVJR0hUICogaSArIDIgKyBQQURESU5HfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmaWxsOiBDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV0sXG4gICAgICAgICAgICAgICAgICBzdHJva2U6XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3IgPT09IENvbG9yc0J5VGhlbWVbdGhlbWVdW1N0cmluZyhrZXkpXVxuICAgICAgICAgICAgICAgICAgICAgID8gJyNmZjAwMDAnXG4gICAgICAgICAgICAgICAgICAgICAgOiBDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV0sXG4gICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMlxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PlxuICAgICAgICAgICAgICAgICAgb25TZWxlY3RDb2xvcihDb2xvcnNCeVRoZW1lW3RoZW1lXVtTdHJpbmcoa2V5KV0sIGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9nPlxuICAgICAgICApKX1cbiAgICAgIDwvc3ZnPlxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdfQ==