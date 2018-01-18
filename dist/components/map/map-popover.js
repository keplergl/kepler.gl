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
      { ref: 'popover', className: (0, _classnames2.default)({ hidden: hidden }),
        style: (0, _extends3.default)({}, _styles.mapPopover, style),
        onMouseEnter: function onMouseEnter() {
          _this2.setState({ isMouseOver: true });
        },
        onMouseLeave: function onMouseLeave() {
          _this2.setState({ isMouseOver: false });
        } },
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
        { target: '_blank', href: url },
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
      return (0, _reactStylematic2.default)(EntryInfoRow, {
        key: name,
        name: name,
        fields: fields,
        data: data
      });
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

  return (0, _reactStylematic2.default)(Row, {
    name: name,
    value: format ? format(data[valueIdx]) : data[valueIdx]
  });
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
    (0, _reactStylematic2.default)(Row, {
      name: 'total points',
      key: 'count',
      value: data.points.length
    }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlci5qcyJdLCJuYW1lcyI6WyJNQVhfV0lEVEgiLCJNQVhfSEVJR0hUIiwicHJvcFR5cGVzIiwiZmllbGRzIiwiYXJyYXkiLCJmaWVsZHNUb1Nob3ciLCJpc1Zpc2libGUiLCJib29sIiwibGF5ZXIiLCJvYmplY3QiLCJkYXRhIiwib25lT2ZUeXBlIiwiZnJlZXplZCIsIngiLCJudW1iZXIiLCJ5Iiwib25DbG9zZSIsImZ1bmMiLCJNYXBQb3BvdmVyIiwicHJvcHMiLCJzdGF0ZSIsImlzTW91c2VPdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJjb21wb25lbnREaWRNb3VudCIsIl9zZXRDb250YWluZXJTaXplIiwiY29tcG9uZW50RGlkVXBkYXRlIiwibm9kZSIsInJlZnMiLCJwb3BvdmVyIiwiTWF0aCIsIm1pbiIsInNjcm9sbFdpZHRoIiwic2Nyb2xsSGVpZ2h0Iiwic2V0U3RhdGUiLCJfZ2V0UG9zaXRpb24iLCJ0b3BPZmZzZXQiLCJsZWZ0T2Zmc2V0IiwicG9zIiwibWF4V2lkdGgiLCJpbm5lcldpZHRoIiwicmlnaHQiLCJsZWZ0IiwiaW5uZXJIZWlnaHQiLCJib3R0b20iLCJ0b3AiLCJyZW5kZXIiLCJoaWRkZW4iLCJsZW5ndGgiLCJpbmZvUHJvcHMiLCJzdHlsZSIsIk51bWJlciIsImlzRmluaXRlIiwiaXNBZ2dyZWdhdGVkIiwiUm93IiwibmFtZSIsInZhbHVlIiwidXJsIiwibWF0Y2giLCJhc0ltZyIsInRlc3QiLCJFbnRyeUluZm8iLCJtYXAiLCJFbnRyeUluZm9Sb3ciLCJmaWVsZCIsImZpbmQiLCJmIiwidmFsdWVJZHgiLCJ0YWJsZUZpZWxkSW5kZXgiLCJmb3JtYXQiLCJfZ2V0Q2VsbEZvcm1hdCIsInR5cGUiLCJDZWxsSW5mbyIsImNvbmZpZyIsImNvbG9yRmllbGQiLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwi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T3BFLEtBQUtxRSxNQUFMLENBQVkvQjtBQUhyQixNQURGO0FBTUcwQixpQkFBYSwrQkFBQyxHQUFEO0FBQ1osWUFBU0csZ0JBQVQsU0FBNkJILFdBQVduQixJQUQ1QjtBQUVaLFdBQUksT0FGUTtBQUdaLGFBQU83QyxLQUFLc0UsVUFBTCxJQUFtQjtBQUhkLE1BQWIsR0FJSSxJQVZQO0FBV0dMLGdCQUFZLCtCQUFDLEdBQUQ7QUFDWCxZQUFTRyxlQUFULFNBQTRCSCxVQUFVcEIsSUFEM0I7QUFFWCxXQUFJLE1BRk87QUFHWCxhQUFPN0MsS0FBS3VFLGNBQUwsSUFBdUI7QUFIbkIsTUFBWixHQUlJO0FBZlAsR0FERjtBQW1CRCxDQXZCRDs7QUF5QkEsU0FBU1gsY0FBVCxDQUF3QkMsSUFBeEIsRUFBOEI7QUFDNUIsU0FBTyxzQ0FBcUJBLElBQXJCLENBQVA7QUFDRDs7QUFFRHJELFdBQVdoQixTQUFYLEdBQXVCQSxTQUF2QiIsImZpbGUiOiJtYXAtcG9wb3Zlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGNyZWF0ZUVsZW1lbnQgKi9cbmltcG9ydCBjcmVhdGVFbGVtZW50IGZyb20gJ3JlYWN0LXN0eWxlbWF0aWMnO1xuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCB7UGlufSBmcm9tICcuLi9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtGSUVMRF9ESVNQTEFZX0ZPUk1BVH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHttYXBQb3BvdmVyfSBmcm9tICcuLi8uLi9zdHlsZXMvc3R5bGVzJztcblxuY29uc3QgTUFYX1dJRFRIID0gNDAwO1xuY29uc3QgTUFYX0hFSUdIVCA9IDYwMDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheSxcbiAgZmllbGRzVG9TaG93OiBQcm9wVHlwZXMuYXJyYXksXG4gIGlzVmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LFxuICBkYXRhOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICBQcm9wVHlwZXMuYXJyYXksIFByb3BUeXBlcy5vYmplY3RcbiAgXSksXG4gIGZyZWV6ZWQ6IFByb3BUeXBlcy5ib29sLFxuICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwUG9wb3ZlciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzTW91c2VPdmVyOiBmYWxzZSxcbiAgICAgIHdpZHRoOiAzODAsXG4gICAgICBoZWlnaHQ6IDE2MFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5fc2V0Q29udGFpbmVyU2l6ZSgpO1xuICB9XG5cbiAgX3NldENvbnRhaW5lclNpemUoKSB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMucmVmcy5wb3BvdmVyO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5taW4obm9kZS5zY3JvbGxXaWR0aCwgTUFYX1dJRFRIKTtcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1pbihub2RlLnNjcm9sbEhlaWdodCwgTUFYX0hFSUdIVCk7XG5cbiAgICBpZiAod2lkdGggIT09IHRoaXMuc3RhdGUud2lkdGggfHwgaGVpZ2h0ICE9PSB0aGlzLnN0YXRlLmhlaWdodCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7d2lkdGgsIGhlaWdodH0pO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQb3NpdGlvbih4LCB5KSB7XG4gICAgY29uc3QgdG9wT2Zmc2V0ID0gMzA7XG4gICAgY29uc3QgbGVmdE9mZnNldCA9IDMwO1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgcG9zID0ge1xuICAgICAgbWF4V2lkdGg6IHdpZHRoXG4gICAgfTtcblxuICAgIGlmICh4ICsgbGVmdE9mZnNldCArIHdpZHRoID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgIHBvcy5yaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoIC0geCArIGxlZnRPZmZzZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcy5sZWZ0ID0geCArIGxlZnRPZmZzZXQ7XG4gICAgfVxuXG4gICAgaWYgKHkgKyB0b3BPZmZzZXQgKyBoZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIHBvcy5ib3R0b20gPSAxMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zLnRvcCA9IHkgKyB0b3BPZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvcztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7eCwgeSwgaXNWaXNpYmxlLCBkYXRhLCBsYXllciwgZnJlZXplZCwgZmllbGRzLCBmaWVsZHNUb1Nob3cgPSBbXX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGhpZGRlbiA9ICghaXNWaXNpYmxlICYmICF0aGlzLnN0YXRlLmlzTW91c2VPdmVyKTtcblxuICAgIGlmICghZGF0YSB8fCAhbGF5ZXIgfHwgIWZpZWxkc1RvU2hvdy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGluZm9Qcm9wcyA9IHtkYXRhLCBsYXllciwgZmllbGRzVG9TaG93LCBmaWVsZHN9O1xuXG4gICAgY29uc3Qgc3R5bGUgPSBOdW1iZXIuaXNGaW5pdGUoeCkgJiYgTnVtYmVyLmlzRmluaXRlKHkpID9cbiAgICAgIHRoaXMuX2dldFBvc2l0aW9uKHgsIHkpIDoge307XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiByZWY9XCJwb3BvdmVyXCIgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtoaWRkZW59KX1cbiAgICAgICAgc3R5bGU9e3suLi5tYXBQb3BvdmVyLCAuLi5zdHlsZX19XG4gICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzTW91c2VPdmVyOiB0cnVlfSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzTW91c2VPdmVyOiBmYWxzZX0pO1xuICAgICAgICB9fT5cbiAgICAgICAge2ZyZWV6ZWQgP1xuICAgICAgICAgICg8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJndXR0ZXJcIi8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBvcG92ZXItcGluXCIgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsb3NlfT5cbiAgICAgICAgICAgICAgPFBpbiBzaXplPXszMH0vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+KVxuICAgICAgICAgOiBudWxsfVxuICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwicG9wb3Zlci10YWJsZVwiPlxuICAgICAgICAgIHtsYXllci5pc0FnZ3JlZ2F0ZWQgP1xuICAgICAgICAgICAgPENlbGxJbmZvIHsuLi5pbmZvUHJvcHN9Lz4gOlxuICAgICAgICAgICAgPEVudHJ5SW5mbyB7Li4uaW5mb1Byb3BzfS8+fVxuICAgICAgICA8L3RhYmxlPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBSb3cgPSAoe25hbWUsIHZhbHVlLCB1cmx9KSA9PiB7XG4gIC8vIFNldCAndXJsJyB0byAndmFsdWUnIGlmIGl0IGxvb2tzIGxpa2UgYSB1cmxcbiAgaWYgKCF1cmwgJiYgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5tYXRjaCgvXmh0dHAvKSkge1xuICAgIHVybCA9IHZhbHVlO1xuICB9XG5cbiAgY29uc3QgYXNJbWcgPSAoLzxpbWc+LykudGVzdChuYW1lKTtcbiAgcmV0dXJuIChcbiAgICA8dHIga2V5PXtuYW1lfT5cbiAgICAgIDx0ZD57bmFtZX08L3RkPlxuICAgICAgPHRkPlxuICAgICAgICB7IGFzSW1nID8gPGltZyBzcmM9e3ZhbHVlfS8+IDpcbiAgICAgICAgICB1cmwgPyA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPXt1cmx9Pnt2YWx1ZX08L2E+IDpcbiAgICAgICAgICAgIHZhbHVlXG4gICAgICAgIH1cbiAgICAgIDwvdGQ+XG4gICAgPC90cj5cbiAgKTtcbn07XG5cbmNvbnN0IEVudHJ5SW5mbyA9ICh7ZmllbGRzVG9TaG93LCBmaWVsZHMsIGRhdGF9KSA9PiAoXG4gICAgPHRib2R5PlxuICAgICAge2ZpZWxkc1RvU2hvdy5tYXAobmFtZSA9PiA8RW50cnlJbmZvUm93XG4gICAgICAgIGtleT17bmFtZX1cbiAgICAgICAgbmFtZT17bmFtZX1cbiAgICAgICAgZmllbGRzPXtmaWVsZHN9XG4gICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAvPil9XG4gICAgPC90Ym9keT5cbik7XG5cbmNvbnN0IEVudHJ5SW5mb1JvdyA9ICh7bmFtZSwgZmllbGRzLCBkYXRhfSkgPT4ge1xuICBjb25zdCBmaWVsZCA9IGZpZWxkcy5maW5kKGYgPT4gZi5uYW1lID09PSBuYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgdmFsdWVJZHggPSBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxO1xuICBjb25zdCBmb3JtYXQgPSBfZ2V0Q2VsbEZvcm1hdChmaWVsZC50eXBlKTtcblxuICByZXR1cm4gKFxuICAgIDxSb3dcbiAgICAgIG5hbWU9e25hbWV9XG4gICAgICB2YWx1ZT17Zm9ybWF0ID8gZm9ybWF0KGRhdGFbdmFsdWVJZHhdKSA6IGRhdGFbdmFsdWVJZHhdfVxuICAgIC8+XG4gICk7XG59O1xuXG5jb25zdCBDZWxsSW5mbyA9ICh7ZGF0YSwgbGF5ZXJ9KSA9PiB7XG4gIGNvbnN0IHtjb2xvckZpZWxkLCBzaXplRmllbGR9ID0gbGF5ZXIuY29uZmlnO1xuICBjb25zdCB7Y29sb3JBZ2dyZWdhdGlvbiwgc2l6ZUFnZ3JlZ2F0aW9ufSA9IGxheWVyLmNvbmZpZy52aXNDb25maWc7XG5cbiAgcmV0dXJuIChcbiAgICA8dGJvZHk+XG4gICAgICA8Um93XG4gICAgICAgIG5hbWU9eyd0b3RhbCBwb2ludHMnfVxuICAgICAgICBrZXk9XCJjb3VudFwiXG4gICAgICAgIHZhbHVlPXtkYXRhLnBvaW50cy5sZW5ndGh9XG4gICAgICAvPlxuICAgICAge2NvbG9yRmllbGQgPyA8Um93XG4gICAgICAgIG5hbWU9e2Ake2NvbG9yQWdncmVnYXRpb259ICR7Y29sb3JGaWVsZC5uYW1lfWB9XG4gICAgICAgIGtleT1cImNvbG9yXCJcbiAgICAgICAgdmFsdWU9e2RhdGEuY29sb3JWYWx1ZSB8fCAnTi9BJ31cbiAgICAgIC8+IDogbnVsbH1cbiAgICAgIHtzaXplRmllbGQgPyA8Um93XG4gICAgICAgIG5hbWU9e2Ake3NpemVBZ2dyZWdhdGlvbn0gJHtzaXplRmllbGQubmFtZX1gfVxuICAgICAgICBrZXk9XCJzaXplXCJcbiAgICAgICAgdmFsdWU9e2RhdGEuZWxldmF0aW9uVmFsdWUgfHwgJ04vQSd9XG4gICAgICAvPiA6IG51bGx9XG4gICAgPC90Ym9keT5cbiAgKTtcbn07XG5cbmZ1bmN0aW9uIF9nZXRDZWxsRm9ybWF0KHR5cGUpIHtcbiAgcmV0dXJuIEZJRUxEX0RJU1BMQVlfRk9STUFUW3R5cGVdO1xufVxuXG5NYXBQb3BvdmVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==