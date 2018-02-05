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

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ' \n  font-size: 11px;\n  font-weight: 500;\n  background-color: ', ';\n  color: ', ';\n  z-index: 1001;\n  position: absolute;\n  overflow-x: auto;\n  \n  .gutter {\n    height: 6px;\n  }\n\n  table {\n    margin: 2px 12px 12px 12px;\n    td.row__value {\n      text-align: right;\n      font-weight: 500;\n      color: ', ';\n    }\n  }\n'], ['\n  ', ' \n  font-size: 11px;\n  font-weight: 500;\n  background-color: ', ';\n  color: ', ';\n  z-index: 1001;\n  position: absolute;\n  overflow-x: auto;\n  \n  .gutter {\n    height: 6px;\n  }\n\n  table {\n    margin: 2px 12px 12px 12px;\n    td.row__value {\n      text-align: right;\n      font-weight: 500;\n      color: ', ';\n    }\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: absolute;\n  left: 50%;\n  transform: rotate(30deg);\n  top: 10px;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n'], ['\n  position: absolute;\n  left: 50%;\n  transform: rotate(30deg);\n  top: 10px;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  font-size: 12px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n  padding-left: 14px;\n  margin-top: 12px;\n  \n  svg {\n    margin-right: 4px;\n  }\n'], ['\n  color: ', ';\n  font-size: 12px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n  padding-left: 14px;\n  margin-top: 12px;\n  \n  svg {\n    margin-right: 4px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents3 = require('../common/styled-components');

var _icons = require('../common/icons');

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  onClose: _propTypes2.default.func,
  mapState: _propTypes2.default.object.isRequired
};

var StyledMapPopover = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.scrollBar;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColorHl;
});

var StyledPin = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.linkBtnColor;
});

var StyledLayerName = _styledComponents3.CenterFlexbox.extend(_templateObject3, function (props) {
  return props.theme.textColorHl;
});

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
    var node = this.popover;
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
    var mapState = this.props.mapState;
    var _state = this.state,
        width = _state.width,
        height = _state.height;

    var pos = {};
    if (x + leftOffset + width > mapState.innerWidth) {
      pos.right = mapState.innerWidth - x + leftOffset;
    } else {
      pos.left = x + leftOffset;
    }

    if (y + topOffset + height > mapState.innerHeight) {
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
    var width = this.state.width;


    if (!data || !layer || !fieldsToShow.length) {
      return null;
    }

    var infoProps = { data: data, layer: layer, fieldsToShow: fieldsToShow, fields: fields };

    var style = Number.isFinite(x) && Number.isFinite(y) ? this._getPosition(x, y) : {};

    return _react2.default.createElement(
      StyledMapPopover,
      {
        innerRef: function innerRef(comp) {
          _this2.popover = comp;
        },
        className: (0, _classnames2.default)('map-popover', { hidden: hidden }),
        style: (0, _extends3.default)({}, style, {
          maxWidth: width
        }),
        onMouseEnter: function onMouseEnter() {
          _this2.setState({ isMouseOver: true });
        },
        onMouseLeave: function onMouseLeave() {
          _this2.setState({ isMouseOver: false });
        }
      },
      freezed ? _react2.default.createElement(
        'div',
        { className: 'map-popover__top' },
        _react2.default.createElement('div', { className: 'gutter' }),
        _react2.default.createElement(
          StyledPin,
          { className: 'popover-pin', onClick: this.props.onClose },
          _react2.default.createElement(_icons.Pin, { height: '16px' })
        )
      ) : null,
      _react2.default.createElement(
        StyledLayerName,
        { className: 'map-popover__layer-name' },
        _react2.default.createElement(_icons.Layers, { height: '12px' }),
        layer.config.label
      ),
      _react2.default.createElement(
        'table',
        { className: 'map-popover__table' },
        layer.isAggregated ? _react2.default.createElement(CellInfo, infoProps) : _react2.default.createElement(EntryInfo, infoProps)
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
  return _react2.default.createElement(
    'tr',
    { className: 'row', key: name },
    _react2.default.createElement(
      'td',
      { className: 'row__name' },
      name
    ),
    _react2.default.createElement(
      'td',
      { className: 'row__value' },
      asImg ? _react2.default.createElement('img', { src: value }) : url ? _react2.default.createElement(
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
  return _react2.default.createElement(
    'tbody',
    null,
    fieldsToShow.map(function (name) {
      return _react2.default.createElement(EntryInfoRow, { key: name, name: name, fields: fields, data: data });
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

  return _react2.default.createElement(Row, { name: name, value: format ? format(data[valueIdx]) : data[valueIdx] });
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


  return _react2.default.createElement(
    'tbody',
    null,
    _react2.default.createElement(Row, { name: 'total points', key: 'count', value: data.points.length }),
    colorField ? _react2.default.createElement(Row, {
      name: colorAggregation + ' ' + colorField.name,
      key: 'color',
      value: data.colorValue || 'N/A'
    }) : null,
    sizeField ? _react2.default.createElement(Row, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlci5qcyJdLCJuYW1lcyI6WyJNQVhfV0lEVEgiLCJNQVhfSEVJR0hUIiwicHJvcFR5cGVzIiwiZmllbGRzIiwiYXJyYXkiLCJmaWVsZHNUb1Nob3ciLCJpc1Zpc2libGUiLCJib29sIiwibGF5ZXIiLCJvYmplY3QiLCJkYXRhIiwib25lT2ZUeXBlIiwiZnJlZXplZCIsIngiLCJudW1iZXIiLCJ5Iiwib25DbG9zZSIsImZ1bmMiLCJtYXBTdGF0ZSIsImlzUmVxdWlyZWQiLCJTdHlsZWRNYXBQb3BvdmVyIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInNjcm9sbEJhciIsInBhbmVsQmFja2dyb3VuZCIsInRleHRDb2xvciIsInRleHRDb2xvckhsIiwiU3R5bGVkUGluIiwicHJpbWFyeUJ0bkJnZCIsImxpbmtCdG5Db2xvciIsIlN0eWxlZExheWVyTmFtZSIsImV4dGVuZCIsIk1hcFBvcG92ZXIiLCJzdGF0ZSIsImlzTW91c2VPdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJjb21wb25lbnREaWRNb3VudCIsIl9zZXRDb250YWluZXJTaXplIiwiY29tcG9uZW50RGlkVXBkYXRlIiwibm9kZSIsInBvcG92ZXIiLCJNYXRoIiwibWluIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxIZWlnaHQiLCJzZXRTdGF0ZSIsIl9nZXRQb3NpdGlvbiIsInRvcE9mZnNldCIsImxlZnRPZmZzZXQiLCJwb3MiLCJpbm5lcldpZHRoIiwicmlnaHQiLCJsZWZ0IiwiaW5uZXJIZWlnaHQiLCJib3R0b20iLCJ0b3AiLCJyZW5kZXIiLCJoaWRkZW4iLCJsZW5ndGgiLCJpbmZvUHJvcHMiLCJzdHlsZSIsIk51bWJlciIsImlzRmluaXRlIiwiY29tcCIsIm1heFdpZHRoIiwiY29uZmlnIiwibGFiZWwiLCJpc0FnZ3JlZ2F0ZWQiLCJSb3ciLCJuYW1lIiwidmFsdWUiLCJ1cmwiLCJtYXRjaCIsImFzSW1nIiwidGVzdCIsIkVudHJ5SW5mbyIsIm1hcCIsIkVudHJ5SW5mb1JvdyIsImZpZWxkIiwiZmluZCIsImYiLCJ2YWx1ZUlkeCIsInRhYmxlRmllbGRJbmRleCIsImZvcm1hdCIsIl9nZXRDZWxsRm9ybWF0IiwidHlwZSIsIkNlbGxJbmZvIiwiY29sb3JGaWVsZCIsInNpemVGaWVsZCIsInZpc0NvbmZpZyIsImNvbG9yQWdncmVnYXRpb24iLCJzaXplQWdncmVnYXRpb24iLCJwb2ludHMiLCJjb2xvclZhbHVlIiwiZWxldmF0aW9uVmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsWUFBWSxHQUFsQjtBQUNBLElBQU1DLGFBQWEsR0FBbkI7O0FBRUEsSUFBTUMsWUFBWTtBQUNoQkMsVUFBUSxvQkFBVUMsS0FERjtBQUVoQkMsZ0JBQWMsb0JBQVVELEtBRlI7QUFHaEJFLGFBQVcsb0JBQVVDLElBSEw7QUFJaEJDLFNBQU8sb0JBQVVDLE1BSkQ7QUFLaEJDLFFBQU0sb0JBQVVDLFNBQVYsQ0FBb0IsQ0FBQyxvQkFBVVAsS0FBWCxFQUFrQixvQkFBVUssTUFBNUIsQ0FBcEIsQ0FMVTtBQU1oQkcsV0FBUyxvQkFBVUwsSUFOSDtBQU9oQk0sS0FBRyxvQkFBVUMsTUFQRztBQVFoQkMsS0FBRyxvQkFBVUQsTUFSRztBQVNoQkUsV0FBUyxvQkFBVUMsSUFUSDtBQVVoQkMsWUFBVSxvQkFBVVQsTUFBVixDQUFpQlU7QUFWWCxDQUFsQjs7QUFhQSxJQUFNQyxtQkFBbUIsMkJBQU9DLEdBQTFCLGtCQUNGO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxTQUFyQjtBQUFBLENBREUsRUFJZ0I7QUFBQSxTQUFTRixNQUFNQyxLQUFOLENBQVlFLGVBQXJCO0FBQUEsQ0FKaEIsRUFLSztBQUFBLFNBQVNILE1BQU1DLEtBQU4sQ0FBWUcsU0FBckI7QUFBQSxDQUxMLEVBbUJTO0FBQUEsU0FBU0osTUFB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QUVUQyxlQUZTLHlCQUVUQSxlQUZTOzs7QUFJbEMsU0FDRTtBQUFBO0FBQUE7QUFDRSxrQ0FBQyxHQUFELElBQUssTUFBTSxjQUFYLEVBQTJCLEtBQUksT0FBL0IsRUFBdUMsT0FBT25GLEtBQUtvRixNQUFMLENBQVlsQyxNQUExRCxHQURGO0FBRUc2QixpQkFDQyw4QkFBQyxHQUFEO0FBQ0UsWUFBU0csZ0JBQVQsU0FBNkJILFdBQVdsQixJQUQxQztBQUVFLFdBQUksT0FGTjtBQUdFLGFBQU83RCxLQUFLcUYsVUFBTCxJQUFtQjtBQUg1QixNQURELEdBTUcsSUFSTjtBQVNHTCxnQkFDQyw4QkFBQyxHQUFEO0FBQ0UsWUFBU0csZUFBVCxTQUE0QkgsVUFBVW5CLElBRHhDO0FBRUUsV0FBSSxNQUZOO0FBR0UsYUFBTzdELEtBQUtzRixjQUFMLElBQXVCO0FBSGhDLE1BREQsR0FNRztBQWZOLEdBREY7QUFtQkQsQ0F2QkQ7O0FBeUJBLFNBQVNWLGNBQVQsQ0FBd0JDLElBQXhCLEVBQThCO0FBQzVCLFNBQU8sc0NBQXFCQSxJQUFyQixDQUFQO0FBQ0Q7O0FBRUR0RCxXQUFXL0IsU0FBWCxHQUF1QkEsU0FBdkIiLCJmaWxlIjoibWFwLXBvcG92ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtDZW50ZXJGbGV4Ym94fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1BpbiwgTGF5ZXJzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge0ZJRUxEX0RJU1BMQVlfRk9STUFUfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IE1BWF9XSURUSCA9IDQwMDtcbmNvbnN0IE1BWF9IRUlHSFQgPSA2MDA7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZmllbGRzOiBQcm9wVHlwZXMuYXJyYXksXG4gIGZpZWxkc1RvU2hvdzogUHJvcFR5cGVzLmFycmF5LFxuICBpc1Zpc2libGU6IFByb3BUeXBlcy5ib29sLFxuICBsYXllcjogUHJvcFR5cGVzLm9iamVjdCxcbiAgZGF0YTogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmFycmF5LCBQcm9wVHlwZXMub2JqZWN0XSksXG4gIGZyZWV6ZWQ6IFByb3BUeXBlcy5ib29sLFxuICB4OiBQcm9wVHlwZXMubnVtYmVyLFxuICB5OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgbWFwU3RhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgU3R5bGVkTWFwUG9wb3ZlciA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Nyb2xsQmFyfSBcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIHotaW5kZXg6IDEwMDE7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgXG4gIC5ndXR0ZXIge1xuICAgIGhlaWdodDogNnB4O1xuICB9XG5cbiAgdGFibGUge1xuICAgIG1hcmdpbjogMnB4IDEycHggMTJweCAxMnB4O1xuICAgIHRkLnJvd19fdmFsdWUge1xuICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkUGluID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogcm90YXRlKDMwZGVnKTtcbiAgdG9wOiAxMHB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQmdkfTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saW5rQnRuQ29sb3J9O1xuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRMYXllck5hbWUgPSBDZW50ZXJGbGV4Ym94LmV4dGVuZGBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICBmb250LXNpemU6IDEycHg7XG4gIGxldHRlci1zcGFjaW5nOiAwLjQzcHg7XG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuICBwYWRkaW5nLWxlZnQ6IDE0cHg7XG4gIG1hcmdpbi10b3A6IDEycHg7XG4gIFxuICBzdmcge1xuICAgIG1hcmdpbi1yaWdodDogNHB4O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBQb3BvdmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzTW91c2VPdmVyOiBmYWxzZSxcbiAgICAgIHdpZHRoOiAzODAsXG4gICAgICBoZWlnaHQ6IDE2MFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5fc2V0Q29udGFpbmVyU2l6ZSgpO1xuICB9XG5cbiAgX3NldENvbnRhaW5lclNpemUoKSB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMucG9wb3ZlcjtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3aWR0aCA9IE1hdGgubWluKG5vZGUuc2Nyb2xsV2lkdGgsIE1BWF9XSURUSCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5taW4obm9kZS5zY3JvbGxIZWlnaHQsIE1BWF9IRUlHSFQpO1xuXG4gICAgaWYgKHdpZHRoICE9PSB0aGlzLnN0YXRlLndpZHRoIHx8IGhlaWdodCAhPT0gdGhpcy5zdGF0ZS5oZWlnaHQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3dpZHRoLCBoZWlnaHR9KTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UG9zaXRpb24oeCwgeSkge1xuICAgIGNvbnN0IHRvcE9mZnNldCA9IDMwO1xuICAgIGNvbnN0IGxlZnRPZmZzZXQgPSAzMDtcbiAgICBjb25zdCB7bWFwU3RhdGV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHBvcyA9IHt9O1xuICAgIGlmICh4ICsgbGVmdE9mZnNldCArIHdpZHRoID4gbWFwU3RhdGUuaW5uZXJXaWR0aCkge1xuICAgICAgcG9zLnJpZ2h0ID0gbWFwU3RhdGUuaW5uZXJXaWR0aCAtIHggKyBsZWZ0T2Zmc2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3MubGVmdCA9IHggKyBsZWZ0T2Zmc2V0O1xuICAgIH1cblxuICAgIGlmICh5ICsgdG9wT2Zmc2V0ICsgaGVpZ2h0ID4gbWFwU3RhdGUuaW5uZXJIZWlnaHQpIHtcbiAgICAgIHBvcy5ib3R0b20gPSAxMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zLnRvcCA9IHkgKyB0b3BPZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvcztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIGlzVmlzaWJsZSxcbiAgICAgIGRhdGEsXG4gICAgICBsYXllcixcbiAgICAgIGZyZWV6ZWQsXG4gICAgICBmaWVsZHMsXG4gICAgICBmaWVsZHNUb1Nob3cgPSBbXVxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGhpZGRlbiA9ICFpc1Zpc2libGUgJiYgIXRoaXMuc3RhdGUuaXNNb3VzZU92ZXI7XG4gICAgY29uc3Qge3dpZHRofSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoIWRhdGEgfHwgIWxheWVyIHx8ICFmaWVsZHNUb1Nob3cubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBpbmZvUHJvcHMgPSB7ZGF0YSwgbGF5ZXIsIGZpZWxkc1RvU2hvdywgZmllbGRzfTtcblxuICAgIGNvbnN0IHN0eWxlID1cbiAgICAgIE51bWJlci5pc0Zpbml0ZSh4KSAmJiBOdW1iZXIuaXNGaW5pdGUoeSkgPyB0aGlzLl9nZXRQb3NpdGlvbih4LCB5KSA6IHt9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRNYXBQb3BvdmVyXG4gICAgICAgIGlubmVyUmVmPXtjb21wID0+IHtcbiAgICAgICAgICB0aGlzLnBvcG92ZXIgPSBjb21wO1xuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ21hcC1wb3BvdmVyJywge2hpZGRlbn0pfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgIG1heFdpZHRoOiB3aWR0aFxuICAgICAgICB9fVxuICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtpc01vdXNlT3ZlcjogdHJ1ZX0pO1xuICAgICAgICB9fVxuICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtpc01vdXNlT3ZlcjogZmFsc2V9KTtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge2ZyZWV6ZWQgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXAtcG9wb3Zlcl9fdG9wXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImd1dHRlclwiIC8+XG4gICAgICAgICAgICA8U3R5bGVkUGluIGNsYXNzTmFtZT1cInBvcG92ZXItcGluXCIgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsb3NlfT5cbiAgICAgICAgICAgICAgPFBpbiBoZWlnaHQ9XCIxNnB4XCIgLz5cbiAgICAgICAgICAgIDwvU3R5bGVkUGluPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPFN0eWxlZExheWVyTmFtZSBjbGFzc05hbWU9XCJtYXAtcG9wb3Zlcl9fbGF5ZXItbmFtZVwiPlxuICAgICAgICAgIDxMYXllcnMgaGVpZ2h0PVwiMTJweFwiLz57bGF5ZXIuY29uZmlnLmxhYmVsfTwvU3R5bGVkTGF5ZXJOYW1lPlxuICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwibWFwLXBvcG92ZXJfX3RhYmxlXCI+XG4gICAgICAgICAge2xheWVyLmlzQWdncmVnYXRlZCA/IChcbiAgICAgICAgICAgIDxDZWxsSW5mbyB7Li4uaW5mb1Byb3BzfSAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8RW50cnlJbmZvIHsuLi5pbmZvUHJvcHN9IC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC90YWJsZT5cbiAgICAgIDwvU3R5bGVkTWFwUG9wb3Zlcj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IFJvdyA9ICh7bmFtZSwgdmFsdWUsIHVybH0pID0+IHtcbiAgLy8gU2V0ICd1cmwnIHRvICd2YWx1ZScgaWYgaXQgbG9va3MgbGlrZSBhIHVybFxuICBpZiAoIXVybCAmJiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLm1hdGNoKC9eaHR0cC8pKSB7XG4gICAgdXJsID0gdmFsdWU7XG4gIH1cblxuICBjb25zdCBhc0ltZyA9IC88aW1nPi8udGVzdChuYW1lKTtcbiAgcmV0dXJuIChcbiAgICA8dHIgY2xhc3NOYW1lPVwicm93XCIga2V5PXtuYW1lfT5cbiAgICAgIDx0ZCBjbGFzc05hbWU9XCJyb3dfX25hbWVcIj57bmFtZX08L3RkPlxuICAgICAgPHRkIGNsYXNzTmFtZT1cInJvd19fdmFsdWVcIj5cbiAgICAgICAge2FzSW1nID8gKFxuICAgICAgICAgIDxpbWcgc3JjPXt2YWx1ZX0gLz5cbiAgICAgICAgKSA6IHVybCA/IChcbiAgICAgICAgICA8YSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCIgaHJlZj17dXJsfT5cbiAgICAgICAgICAgIHt2YWx1ZX1cbiAgICAgICAgICA8L2E+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgKX1cbiAgICAgIDwvdGQ+XG4gICAgPC90cj5cbiAgKTtcbn07XG5cbmNvbnN0IEVudHJ5SW5mbyA9ICh7ZmllbGRzVG9TaG93LCBmaWVsZHMsIGRhdGF9KSA9PiAoXG4gIDx0Ym9keT5cbiAgICB7ZmllbGRzVG9TaG93Lm1hcChuYW1lID0+IChcbiAgICAgIDxFbnRyeUluZm9Sb3cga2V5PXtuYW1lfSBuYW1lPXtuYW1lfSBmaWVsZHM9e2ZpZWxkc30gZGF0YT17ZGF0YX0gLz5cbiAgICApKX1cbiAgPC90Ym9keT5cbik7XG5cbmNvbnN0IEVudHJ5SW5mb1JvdyA9ICh7bmFtZSwgZmllbGRzLCBkYXRhfSkgPT4ge1xuICBjb25zdCBmaWVsZCA9IGZpZWxkcy5maW5kKGYgPT4gZi5uYW1lID09PSBuYW1lKTtcbiAgaWYgKCFmaWVsZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgdmFsdWVJZHggPSBmaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxO1xuICBjb25zdCBmb3JtYXQgPSBfZ2V0Q2VsbEZvcm1hdChmaWVsZC50eXBlKTtcblxuICByZXR1cm4gKFxuICAgIDxSb3cgbmFtZT17bmFtZX0gdmFsdWU9e2Zvcm1hdCA/IGZvcm1hdChkYXRhW3ZhbHVlSWR4XSkgOiBkYXRhW3ZhbHVlSWR4XX0gLz5cbiAgKTtcbn07XG5cbmNvbnN0IENlbGxJbmZvID0gKHtkYXRhLCBsYXllcn0pID0+IHtcbiAgY29uc3Qge2NvbG9yRmllbGQsIHNpemVGaWVsZH0gPSBsYXllci5jb25maWc7XG4gIGNvbnN0IHtjb2xvckFnZ3JlZ2F0aW9uLCBzaXplQWdncmVnYXRpb259ID0gbGF5ZXIuY29uZmlnLnZpc0NvbmZpZztcblxuICByZXR1cm4gKFxuICAgIDx0Ym9keT5cbiAgICAgIDxSb3cgbmFtZT17J3RvdGFsIHBvaW50cyd9IGtleT1cImNvdW50XCIgdmFsdWU9e2RhdGEucG9pbnRzLmxlbmd0aH0gLz5cbiAgICAgIHtjb2xvckZpZWxkID8gKFxuICAgICAgICA8Um93XG4gICAgICAgICAgbmFtZT17YCR7Y29sb3JBZ2dyZWdhdGlvbn0gJHtjb2xvckZpZWxkLm5hbWV9YH1cbiAgICAgICAgICBrZXk9XCJjb2xvclwiXG4gICAgICAgICAgdmFsdWU9e2RhdGEuY29sb3JWYWx1ZSB8fCAnTi9BJ31cbiAgICAgICAgLz5cbiAgICAgICkgOiBudWxsfVxuICAgICAge3NpemVGaWVsZCA/IChcbiAgICAgICAgPFJvd1xuICAgICAgICAgIG5hbWU9e2Ake3NpemVBZ2dyZWdhdGlvbn0gJHtzaXplRmllbGQubmFtZX1gfVxuICAgICAgICAgIGtleT1cInNpemVcIlxuICAgICAgICAgIHZhbHVlPXtkYXRhLmVsZXZhdGlvblZhbHVlIHx8ICdOL0EnfVxuICAgICAgICAvPlxuICAgICAgKSA6IG51bGx9XG4gICAgPC90Ym9keT5cbiAgKTtcbn07XG5cbmZ1bmN0aW9uIF9nZXRDZWxsRm9ybWF0KHR5cGUpIHtcbiAgcmV0dXJuIEZJRUxEX0RJU1BMQVlfRk9STUFUW3R5cGVdO1xufVxuXG5NYXBQb3BvdmVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==