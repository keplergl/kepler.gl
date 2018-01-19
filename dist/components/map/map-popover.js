'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _reactStylematic = require('react-stylematic');

var _reactStylematic2 = _interopRequireDefault(_reactStylematic);

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _icons = require('../common/icons');

var _defaultSettings = require('../../constants/default-settings');

var _styles = require('../../styles/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */
var MAX_WIDTH = 400;
var MAX_HEIGHT = 600;

var propTypes = {
  fields: _propTypes2.default.array,
  fieldsToShow: _propTypes2.default.array,
  isVisible: _propTypes2.default.bool,
  layer: _propTypes2.default.object,
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
  freezed: _propTypes2.default.bool,
  x: _propTypes2.default.number,
  y: _propTypes2.default.number,
  onClose: _propTypes2.default.func
};

var MapPopover = function (_Component) {
  (0, _inherits3.default)(MapPopover, _Component);

  function MapPopover(props) {
    (0, _classCallCheck3.default)(this, MapPopover);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

    _this.state = {
      isMouseOver: false,
      width: 380,
      height: 160
    };
    return _this;
  }

  MapPopover.prototype.componentDidMount = function componentDidMount() {
    this._setContainerSize();
  };

  MapPopover.prototype.componentDidUpdate = function componentDidUpdate() {
    this._setContainerSize();
  };

  MapPopover.prototype._setContainerSize = function _setContainerSize() {
    var node = this.refs.popover;
    if (!node) {
      return;
    }

    var width = Math.min(node.scrollWidth, MAX_WIDTH);
    var height = Math.min(node.scrollHeight, MAX_HEIGHT);

    if (width !== this.state.width || height !== this.state.height) {
      this.setState({ width: width, height: height });
    }
  };

  MapPopover.prototype._getPosition = function _getPosition(x, y) {
    var topOffset = 30;
    var leftOffset = 30;
    var _state = this.state,
        width = _state.width,
        height = _state.height;

    var pos = {
      maxWidth: width
    };

    if (x + leftOffset + width > _window2.default.innerWidth) {
      pos.right = _window2.default.innerWidth - x + leftOffset;
    } else {
      pos.left = x + leftOffset;
    }

    if (y + topOffset + height > _window2.default.innerHeight) {
      pos.bottom = 10;
    } else {
      pos.top = y + topOffset;
    }

    return pos;
  };

  MapPopover.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        x = _props.x,
        y = _props.y,
        isVisible = _props.isVisible,
        data = _props.data,
        layer = _props.layer,
        freezed = _props.freezed,
        fields = _props.fields,
        _props$fieldsToShow = _props.fieldsToShow,
        fieldsToShow = _props$fieldsToShow === undefined ? [] : _props$fieldsToShow;

    var hidden = !isVisible && !this.state.isMouseOver;

    if (!data || !layer || !fieldsToShow.length) {
      return null;
    }

    var infoProps = { data: data, layer: layer, fieldsToShow: fieldsToShow, fields: fields };

    var style = Number.isFinite(x) && Number.isFinite(y) ? this._getPosition(x, y) : {};

    return (0, _reactStylematic2.default)(
      'div',
      {
        ref: 'popover',
        className: (0, _classnames2.default)({ hidden: hidden }),
        style: (0, _extends3.default)({}, _styles.mapPopover, style),
        onMouseEnter: function onMouseEnter() {
          _this2.setState({ isMouseOver: true });
        },
        onMouseLeave: function onMouseLeave() {
          _this2.setState({ isMouseOver: false });
        }
      },
      freezed ? (0, _reactStylematic2.default)(
        'div',
        null,
        (0, _reactStylematic2.default)('div', { className: 'gutter' }),
        (0, _reactStylematic2.default)(
          'div',
          { className: 'popover-pin', onClick: this.props.onClose },
          (0, _reactStylematic2.default)(_icons.Pin, { size: 30 })
        )
      ) : null,
      (0, _reactStylematic2.default)(
        'table',
        { className: 'popover-table' },
        layer.isAggregated ? (0, _reactStylematic2.default)(CellInfo, infoProps) : (0, _reactStylematic2.default)(EntryInfo, infoProps)
      )
    );
  };

  return MapPopover;
}(_react.Component);

exports.default = MapPopover;


var Row = function Row(_ref) {
  var name = _ref.name,
      value = _ref.value,
      url = _ref.url;

  // Set 'url' to 'value' if it looks like a url
  if (!url && value && typeof value === 'string' && value.match(/^http/)) {
    url = value;
  }

  var asImg = /<img>/.test(name);
  return (0, _reactStylematic2.default)(
    'tr',
    { key: name },
    (0, _reactStylematic2.default)(
      'td',
      null,
      name
    ),
    (0, _reactStylematic2.default)(
      'td',
      null,
      asImg ? (0, _reactStylematic2.default)('img', { src: value }) : url ? (0, _reactStylematic2.default)(
        'a',
        { target: '_blank', rel: 'noopener noreferrer', href: url },
        value
      ) : value
    )
  );
};

var EntryInfo = function EntryInfo(_ref2) {
  var fieldsToShow = _ref2.fieldsToShow,
      fields = _ref2.fields,
      data = _ref2.data;
  return (0, _reactStylematic2.default)(
    'tbody',
    null,
    fieldsToShow.map(function (name) {
      return (0, _reactStylematic2.default)(EntryInfoRow, { key: name, name: name, fields: fields, data: data });
    })
  );
};

var EntryInfoRow = function EntryInfoRow(_ref3) {
  var name = _ref3.name,
      fields = _ref3.fields,
      data = _ref3.data;

  var field = fields.find(function (f) {
    return f.name === name;
  });
  if (!field) {
    return null;
  }

  var valueIdx = field.tableFieldIndex - 1;
  var format = _getCellFormat(field.type);

  return (0, _reactStylematic2.default)(Row, { name: name, value: format ? format(data[valueIdx]) : data[valueIdx] });
};

var CellInfo = function CellInfo(_ref4) {
  var data = _ref4.data,
      layer = _ref4.layer;
  var _layer$config = layer.config,
      colorField = _layer$config.colorField,
      sizeField = _layer$config.sizeField;
  var _layer$config$visConf = layer.config.visConfig,
      colorAggregation = _layer$config$visConf.colorAggregation,
      sizeAggregation = _layer$config$visConf.sizeAggregation;


  return (0, _reactStylematic2.default)(
    'tbody',
    null,
    (0, _reactStylematic2.default)(Row, { name: 'total points', key: 'count', value: data.points.length }),
    colorField ? (0, _reactStylematic2.default)(Row, {
      name: colorAggregation + ' ' + colorField.name,
      key: 'color',
      value: data.colorValue || 'N/A'
    }) : null,
    sizeField ? (0, _reactStylematic2.default)(Row, {
      name: sizeAggregation + ' ' + sizeField.name,
      key: 'size',
      value: data.elevationValue || 'N/A'
    }) : null
  );
};

function _getCellFormat(type) {
  return _defaultSettings.FIELD_DISPLAY_FORMAT[type];
}

MapPopover.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlci5qcyJdLCJuYW1lcyI6WyJNQVhfV0lEVEgiLCJNQVhfSEVJR0hUIiwicHJvcFR5cGVzIiwiZmllbGRzIiwiYXJyYXkiLCJmaWVsZHNUb1Nob3ciLCJpc1Zpc2libGUiLCJib29sIiwibGF5ZXIiLCJvYmplY3QiLCJkYXRhIiwib25lT2ZUeXBlIiwiZnJlZXplZCIsIngiLCJudW1iZXIiLCJ5Iiwib25DbG9zZSIsImZ1bmMiLCJNYXBQb3BvdmVyIiwicHJvcHMiLCJzdGF0ZSIsImlzTW91c2VPdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJjb21wb25lbnREaWRNb3VudCIsIl9zZXRDb250YWluZXJTaXplIiwiY29tcG9uZW50RGlkVXBkYXRlIiwibm9kZSIsInJlZnMiLCJwb3BvdmVyIiwiTWF0aCIsIm1pbiIsInNjcm9sbFdpZHRoIiwic2Nyb2xsSGVpZ2h0Iiwic2V0U3RhdGUiLCJfZ2V0UG9zaXRpb24iLCJ0b3BPZmZzZXQiLCJsZWZ0T2Zmc2V0IiwicG9zIiwibWF4V2lkdGgiLCJpbm5lcldpZHRoIiwicmlnaHQiLCJsZWZ0IiwiaW5uZXJIZWlnaHQiLCJib3R0b20iLCJ0b3AiLCJyZW5kZXIiLCJoaWRkZW4iLCJsZW5ndGgiLCJpbmZvUHJvcHMiLCJzdHlsZSIsIk51bWJlciIsImlzRmluaXRlIiwiaXNBZ2dyZWdhdGVkIiwiUm93IiwibmFtZSIsInZhbHVlIiwidXJsIiwibWF0Y2giLCJhc0ltZyIsInRlc3QiLCJFbnRyeUluZm8iLCJtYXAiLCJFbnRyeUluZm9Sb3ciLCJmaWVsZCIsImZpbmQiLCJmIiwidmFsdWVJZHgiLCJ0YWJsZUZpZWxkSW5kZXgiLCJmb3JtYXQiLCJfZ2V0Q2VsbEZvcm1hdCIsInR5cGUiLCJDZWxsSW5mbyIsImNvbmZpZyIsImNvbG9yRmllbGQiLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwi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LEtBQUtxRSxNQUFMLENBQVkvQixNQUExRCxHQURGO0FBRUcwQixpQkFDQywrQkFBQyxHQUFEO0FBQ0UsWUFBU0csZ0JBQVQsU0FBNkJILFdBQVduQixJQUQxQztBQUVFLFdBQUksT0FGTjtBQUdFLGFBQU83QyxLQUFLc0UsVUFBTCxJQUFtQjtBQUg1QixNQURELEdBTUcsSUFSTjtBQVNHTCxnQkFDQywrQkFBQyxHQUFEO0FBQ0UsWUFBU0csZUFBVCxTQUE0QkgsVUFBVXBCLElBRHhDO0FBRUUsV0FBSSxNQUZOO0FBR0UsYUFBTzdDLEtBQUt1RSxjQUFMLElBQXVCO0FBSGhDLE1BREQsR0FNRztBQWZOLEdBREY7QUFtQkQsQ0F2QkQ7O0FBeUJBLFNBQVNYLGNBQVQsQ0FBd0JDLElBQXhCLEVBQThCO0FBQzVCLFNBQU8sc0NBQXFCQSxJQUFyQixDQUFQO0FBQ0Q7O0FBRURyRCxXQUFXaEIsU0FBWCxHQUF1QkEsU0FBdkIiLCJmaWxlIjoibWFwLXBvcG92ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBjcmVhdGVFbGVtZW50ICovXG5pbXBvcnQgY3JlYXRlRWxlbWVudCBmcm9tICdyZWFjdC1zdHlsZW1hdGljJztcbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQge1Bpbn0gZnJvbSAnLi4vY29tbW9uL2ljb25zJztcbmltcG9ydCB7RklFTERfRElTUExBWV9GT1JNQVR9IGZyb20gJy4uLy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7bWFwUG9wb3Zlcn0gZnJvbSAnLi4vLi4vc3R5bGVzL3N0eWxlcyc7XG5cbmNvbnN0IE1BWF9XSURUSCA9IDQwMDtcbmNvbnN0IE1BWF9IRUlHSFQgPSA2MDA7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZmllbGRzOiBQcm9wVHlwZXMuYXJyYXksXG4gIGZpZWxkc1RvU2hvdzogUHJvcFR5cGVzLmFycmF5LFxuICBpc1Zpc2libGU6IFByb3BUeXBlcy5ib29sLFxuICBsYXllcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgZGF0YTogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmFycmF5LCBQcm9wVHlwZXMub2JqZWN0XSksXG4gIGZyZWV6ZWQ6IFByb3BUeXBlcy5ib29sLFxuICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwUG9wb3ZlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc01vdXNlT3ZlcjogZmFsc2UsXG4gICAgICB3aWR0aDogMzgwLFxuICAgICAgaGVpZ2h0OiAxNjBcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fc2V0Q29udGFpbmVyU2l6ZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKTtcbiAgfVxuXG4gIF9zZXRDb250YWluZXJTaXplKCkge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnJlZnMucG9wb3ZlcjtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3aWR0aCA9IE1hdGgubWluKG5vZGUuc2Nyb2xsV2lkdGgsIE1BWF9XSURUSCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5taW4obm9kZS5zY3JvbGxIZWlnaHQsIE1BWF9IRUlHSFQpO1xuXG4gICAgaWYgKHdpZHRoICE9PSB0aGlzLnN0YXRlLndpZHRoIHx8IGhlaWdodCAhPT0gdGhpcy5zdGF0ZS5oZWlnaHQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3dpZHRoLCBoZWlnaHR9KTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UG9zaXRpb24oeCwgeSkge1xuICAgIGNvbnN0IHRvcE9mZnNldCA9IDMwO1xuICAgIGNvbnN0IGxlZnRPZmZzZXQgPSAzMDtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHBvcyA9IHtcbiAgICAgIG1heFdpZHRoOiB3aWR0aFxuICAgIH07XG5cbiAgICBpZiAoeCArIGxlZnRPZmZzZXQgKyB3aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgICBwb3MucmlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHggKyBsZWZ0T2Zmc2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3MubGVmdCA9IHggKyBsZWZ0T2Zmc2V0O1xuICAgIH1cblxuICAgIGlmICh5ICsgdG9wT2Zmc2V0ICsgaGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICBwb3MuYm90dG9tID0gMTA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcy50b3AgPSB5ICsgdG9wT2Zmc2V0O1xuICAgIH1cblxuICAgIHJldHVybiBwb3M7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBpc1Zpc2libGUsXG4gICAgICBkYXRhLFxuICAgICAgbGF5ZXIsXG4gICAgICBmcmVlemVkLFxuICAgICAgZmllbGRzLFxuICAgICAgZmllbGRzVG9TaG93ID0gW11cbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBoaWRkZW4gPSAhaXNWaXNpYmxlICYmICF0aGlzLnN0YXRlLmlzTW91c2VPdmVyO1xuXG4gICAgaWYgKCFkYXRhIHx8ICFsYXllciB8fCAhZmllbGRzVG9TaG93Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaW5mb1Byb3BzID0ge2RhdGEsIGxheWVyLCBmaWVsZHNUb1Nob3csIGZpZWxkc307XG5cbiAgICBjb25zdCBzdHlsZSA9XG4gICAgICBOdW1iZXIuaXNGaW5pdGUoeCkgJiYgTnVtYmVyLmlzRmluaXRlKHkpID8gdGhpcy5fZ2V0UG9zaXRpb24oeCwgeSkgOiB7fTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj1cInBvcG92ZXJcIlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoe2hpZGRlbn0pfVxuICAgICAgICBzdHlsZT17ey4uLm1hcFBvcG92ZXIsIC4uLnN0eWxlfX1cbiAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNNb3VzZU92ZXI6IHRydWV9KTtcbiAgICAgICAgfX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNNb3VzZU92ZXI6IGZhbHNlfSk7XG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtmcmVlemVkID8gKFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImd1dHRlclwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBvcG92ZXItcGluXCIgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsb3NlfT5cbiAgICAgICAgICAgICAgPFBpbiBzaXplPXszMH0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInBvcG92ZXItdGFibGVcIj5cbiAgICAgICAgICB7bGF5ZXIuaXNBZ2dyZWdhdGVkID8gKFxuICAgICAgICAgICAgPENlbGxJbmZvIHsuLi5pbmZvUHJvcHN9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxFbnRyeUluZm8gey4uLmluZm9Qcm9wc30gLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L3RhYmxlPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBSb3cgPSAoe25hbWUsIHZhbHVlLCB1cmx9KSA9PiB7XG4gIC8vIFNldCAndXJsJyB0byAndmFsdWUnIGlmIGl0IGxvb2tzIGxpa2UgYSB1cmxcbiAgaWYgKCF1cmwgJiYgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5tYXRjaCgvXmh0dHAvKSkge1xuICAgIHVybCA9IHZhbHVlO1xuICB9XG5cbiAgY29uc3QgYXNJbWcgPSAvPGltZz4vLnRlc3QobmFtZSk7XG4gIHJldHVybiAoXG4gICAgPHRyIGtleT17bmFtZX0+XG4gICAgICA8dGQ+e25hbWV9PC90ZD5cbiAgICAgIDx0ZD5cbiAgICAgICAge2FzSW1nID8gKFxuICAgICAgICAgIDxpbWcgc3JjPXt2YWx1ZX0gLz5cbiAgICAgICAgKSA6IHVybCA/IChcbiAgICAgICAgICA8YSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCIgaHJlZj17dXJsfT5cbiAgICAgICAgICAgIHt2YWx1ZX1cbiAgICAgICAgICA8L2E+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgKX1cbiAgICAgIDwvdGQ+XG4gICAgPC90cj5cbiAgKTtcbn07XG5cbmNvbnN0IEVudHJ5SW5mbyA9ICh7ZmllbGRzVG9TaG93LCBmaWVsZHMsIGRhdGF9KSA9PiAoXG4gIDx0Ym9keT5cbiAgICB7ZmllbGRzVG9TaG93Lm1hcChuYW1lID0+IChcbiAgICAgIDxFbnRyeUluZm9Sb3cga2V5PXtuYW1lfSBuYW1lPXtuYW1lfSBmaWVsZHM9e2ZpZWxkc30gZGF0YT17ZGF0YX0gLz5cbiAgICApKX1cbiAgPC90Ym9keT5cbik7XG5cbmNvbnN0IEVudHJ5SW5mb1JvdyA9ICh7bmFtZSwgZmllbGRzLCBkYXRhfSkgPT4ge1xuICBjb25zdCBmaWVsZCA9IGZpZWxkcy5maW5kKGYgPT4gZi5uYW1lID09PSBuYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgdmFsdWVJZHggPSBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxO1xuICBjb25zdCBmb3JtYXQgPSBfZ2V0Q2VsbEZvcm1hdChmaWVsZC50eXBlKTtcblxuICByZXR1cm4gKFxuICAgIDxSb3cgbmFtZT17bmFtZX0gdmFsdWU9e2Zvcm1hdCA/IGZvcm1hdChkYXRhW3ZhbHVlSWR4XSkgOiBkYXRhW3ZhbHVlSWR4XX0gLz5cbiAgKTtcbn07XG5cbmNvbnN0IENlbGxJbmZvID0gKHtkYXRhLCBsYXllcn0pID0+IHtcbiAgY29uc3Qge2NvbG9yRmllbGQsIHNpemVGaWVsZH0gPSBsYXllci5jb25maWc7XG4gIGNvbnN0IHtjb2xvckFnZ3JlZ2F0aW9uLCBzaXplQWdncmVnYXRpb259ID0gbGF5ZXIuY29uZmlnLnZpc0NvbmZpZztcblxuICByZXR1cm4gKFxuICAgIDx0Ym9keT5cbiAgICAgIDxSb3cgbmFtZT17J3RvdGFsIHBvaW50cyd9IGtleT1cImNvdW50XCIgdmFsdWU9e2RhdGEucG9pbnRzLmxlbmd0aH0gLz5cbiAgICAgIHtjb2xvckZpZWxkID8gKFxuICAgICAgICA8Um93XG4gICAgICAgICAgbmFtZT17YCR7Y29sb3JBZ2dyZWdhdGlvbn0gJHtjb2xvckZpZWxkLm5hbWV9YH1cbiAgICAgICAgICBrZXk9XCJjb2xvclwiXG4gICAgICAgICAgdmFsdWU9e2RhdGEuY29sb3JWYWx1ZSB8fCAnTi9BJ31cbiAgICAgICAgLz5cbiAgICAgICkgOiBudWxsfVxuICAgICAge3NpemVGaWVsZCA/IChcbiAgICAgICAgPFJvd1xuICAgICAgICAgIG5hbWU9e2Ake3NpemVBZ2dyZWdhdGlvbn0gJHtzaXplRmllbGQubmFtZX1gfVxuICAgICAgICAgIGtleT1cInNpemVcIlxuICAgICAgICAgIHZhbHVlPXtkYXRhLmVsZXZhdGlvblZhbHVlIHx8ICdOL0EnfVxuICAgICAgICAvPlxuICAgICAgKSA6IG51bGx9XG4gICAgPC90Ym9keT5cbiAgKTtcbn07XG5cbmZ1bmN0aW9uIF9nZXRDZWxsRm9ybWF0KHR5cGUpIHtcbiAgcmV0dXJuIEZJRUxEX0RJU1BMQVlfRk9STUFUW3R5cGVdO1xufVxuXG5NYXBQb3BvdmVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==