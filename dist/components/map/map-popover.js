'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  ', ' \n  font-size: 11px;\n  font-weight: 500;\n  background-color: ', ';\n  color: ', ';\n  z-index: 1001;\n  position: absolute;\n  overflow-x: auto;\n  \n  .gutter {\n    height: 6px;\n  }\n\n  table {\n    margin: 2px 12px 12px 12px;\n    td.row__value {\n      text-align: right;\n      font-weight: 500;\n      color: ', ';\n    }\n  }\n'], ['\n  ', ' \n  font-size: 11px;\n  font-weight: 500;\n  background-color: ', ';\n  color: ', ';\n  z-index: 1001;\n  position: absolute;\n  overflow-x: auto;\n  \n  .gutter {\n    height: 6px;\n  }\n\n  table {\n    margin: 2px 12px 12px 12px;\n    td.row__value {\n      text-align: right;\n      font-weight: 500;\n      color: ', ';\n    }\n  }\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  position: absolute;\n  left: 50%;\n  transform: rotate(30deg);\n  top: 10px;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n'], ['\n  position: absolute;\n  left: 50%;\n  transform: rotate(30deg);\n  top: 10px;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  font-size: 12px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n  padding-left: 14px;\n  margin-top: 12px;\n  \n  svg {\n    margin-right: 4px;\n  }\n'], ['\n  color: ', ';\n  font-size: 12px;\n  letter-spacing: 0.43px;\n  text-transform: capitalize;\n  padding-left: 14px;\n  margin-top: 12px;\n  \n  svg {\n    margin-right: 4px;\n  }\n']);

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

    var _this = (0, _possibleConstructorReturn3.default)(this, (MapPopover.__proto__ || Object.getPrototypeOf(MapPopover)).call(this, props));

    _this.state = {
      isMouseOver: false,
      width: 380,
      height: 160
    };
    return _this;
  }

  (0, _createClass3.default)(MapPopover, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._setContainerSize();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._setContainerSize();
    }
  }, {
    key: '_setContainerSize',
    value: function _setContainerSize() {
      var node = this.popover;
      if (!node) {
        return;
      }

      var width = Math.min(node.scrollWidth, MAX_WIDTH);
      var height = Math.min(node.scrollHeight, MAX_HEIGHT);

      if (width !== this.state.width || height !== this.state.height) {
        this.setState({ width: width, height: height });
      }
    }
  }, {
    key: '_getPosition',
    value: function _getPosition(x, y) {
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
    }
  }, {
    key: 'render',
    value: function render() {
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
    }
  }]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlci5qcyJdLCJuYW1lcyI6WyJNQVhfV0lEVEgiLCJNQVhfSEVJR0hUIiwicHJvcFR5cGVzIiwiZmllbGRzIiwiYXJyYXkiLCJmaWVsZHNUb1Nob3ciLCJpc1Zpc2libGUiLCJib29sIiwibGF5ZXIiLCJvYmplY3QiLCJkYXRhIiwib25lT2ZUeXBlIiwiZnJlZXplZCIsIngiLCJudW1iZXIiLCJ5Iiwib25DbG9zZSIsImZ1bmMiLCJtYXBTdGF0ZSIsImlzUmVxdWlyZWQiLCJTdHlsZWRNYXBQb3BvdmVyIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInNjcm9sbEJhciIsInBhbmVsQmFja2dyb3VuZCIsInRleHRDb2xvciIsInRleHRDb2xvckhsIiwiU3R5bGVkUGluIiwicHJpbWFyeUJ0bkJnZCIsImxpbmtCdG5Db2xvciIsIlN0eWxlZExheWVyTmFtZSIsImV4dGVuZCIsIk1hcFBvcG92ZXIiLCJzdGF0ZSIsImlzTW91c2VPdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJfc2V0Q29udGFpbmVyU2l6ZSIsIm5vZGUiLCJwb3BvdmVyIiwiTWF0aCIsIm1pbiIsInNjcm9sbFdpZHRoIiwic2Nyb2xsSGVpZ2h0Iiwic2V0U3RhdGUiLCJ0b3BPZmZzZXQiLCJsZWZ0T2Zmc2V0IiwicG9zIiwiaW5uZXJXaWR0aCIsInJpZ2h0IiwibGVmdCIsImlubmVySGVpZ2h0IiwiYm90dG9tIiwidG9wIiwiaGlkZGVuIiwibGVuZ3RoIiwiaW5mb1Byb3BzIiwic3R5bGUiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsIl9nZXRQb3NpdGlvbiIsImNvbXAiLCJtYXhXaWR0aCIsImNvbmZpZyIsImxhYmVsIiwiaXNBZ2dyZWdhdGVkIiwiUm93IiwibmFtZSIsInZhbHVlIiwidXJsIiwibWF0Y2giLCJhc0ltZyIsInRlc3QiLCJFbnRyeUluZm8iLCJtYXAiLCJFbnRyeUluZm9Sb3ciLCJmaWVsZCIsImZpbmQiLCJmIiwidmFsdWVJZHgiLCJ0YWJsZUZpZWxkSW5kZXgiLCJmb3JtYXQiLCJfZ2V0Q2VsbEZvcm1hdCIsInR5cGUiLCJDZWxsSW5mbyIsImNvbG9yRmllbGQiLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJjb2xvckFnZ3JlZ2F0aW9uIiwic2l6ZUFnZ3JlZ2F0aW9uIiwicG9pbnRzIiwiY29sb3JWYWx1ZSIsImVsZXZhdGlvblZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQWxCO0FBQ0EsSUFBTUMsYUFBYSxHQUFuQjs7QUFFQSxJQUFNQyxZQUFZO0FBQ2hCQyxVQUFRLG9CQUFVQyxLQURGO0FBRWhCQyxnQkFBYyxvQkFBVUQsS0FGUjtBQUdoQkUsYUFBVyxvQkFBVUMsSUFITDtBQUloQkMsU0FBTyxvQkFBVUMsTUFKRDtBQUtoQkMsUUFBTSxvQkFBVUMsU0FBVixDQUFvQixDQUFDLG9CQUFVUCxLQUFYLEVBQWtCLG9CQUFVSyxNQUE1QixDQUFwQixDQUxVO0FBTWhCRyxXQUFTLG9CQUFVTCxJQU5IO0FBT2hCTSxLQUFHLG9CQUFVQyxNQVBHO0FBUWhCQyxLQUFHLG9CQUFVRCxNQVJHO0FBU2hCRSxXQUFTLG9CQUFVQyxJQVRIO0FBVWhCQyxZQUFVLG9CQUFVVCxNQUFWLENBQWlCVTtBQVZYLENBQWxCOztBQWFBLElBQU1DLG1CQUFtQiwyQkFBT0MsR0FBMUIsa0JBQ0Y7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLFNBQXJCO0FBQUEsQ0FERSxFQUlnQjtBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsZUFBckI7QUFBQSxDQUpoQixFQUtLO0FBQUEsU0FBU0gsTUFBTUMsS0FBTixDQUFZRyxTQUFyQjtBQUFBLENBTEwsRUFtQlM7QUFBQSxTQUFTSixNQUFNQyxLQUFOLENBQVlJLFdBQXJCO0FBQUEsQ0FuQlQsQ0FBTjs7QUF3QkEsSUFB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S2lGLE1BQUwsQ0FBWW5DLE1BQTFELEdBREY7QUFFRzhCLGlCQUNDLDhCQUFDLEdBQUQ7QUFDRSxZQUFTRyxnQkFBVCxTQUE2QkgsV0FBV2xCLElBRDFDO0FBRUUsV0FBSSxPQUZOO0FBR0UsYUFBTzFELEtBQUtrRixVQUFMLElBQW1CO0FBSDVCLE1BREQsR0FNRyxJQVJOO0FBU0dMLGdCQUNDLDhCQUFDLEdBQUQ7QUFDRSxZQUFTRyxlQUFULFNBQTRCSCxVQUFVbkIsSUFEeEM7QUFFRSxXQUFJLE1BRk47QUFHRSxhQUFPMUQsS0FBS21GLGNBQUwsSUFBdUI7QUFIaEMsTUFERCxHQU1HO0FBZk4sR0FERjtBQW1CRCxDQXZCRDs7QUF5QkEsU0FBU1YsY0FBVCxDQUF3QkMsSUFBeEIsRUFBOEI7QUFDNUIsU0FBTyxzQ0FBcUJBLElBQXJCLENBQVA7QUFDRDs7QUFFRG5ELFdBQVcvQixTQUFYLEdBQXVCQSxTQUF2QiIsImZpbGUiOiJtYXAtcG9wb3Zlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge0NlbnRlckZsZXhib3h9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7UGluLCBMYXllcnN9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7RklFTERfRElTUExBWV9GT1JNQVR9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgTUFYX1dJRFRIID0gNDAwO1xuY29uc3QgTUFYX0hFSUdIVCA9IDYwMDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBmaWVsZHM6IFByb3BUeXBlcy5hcnJheSxcbiAgZmllbGRzVG9TaG93OiBQcm9wVHlwZXMuYXJyYXksXG4gIGlzVmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LFxuICBkYXRhOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuYXJyYXksIFByb3BUeXBlcy5vYmplY3RdKSxcbiAgZnJlZXplZDogUHJvcFR5cGVzLmJvb2wsXG4gIHg6IFByb3BUeXBlcy5udW1iZXIsXG4gIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICBtYXBTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBTdHlsZWRNYXBQb3BvdmVyID0gc3R5bGVkLmRpdmBcbiAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zY3JvbGxCYXJ9IFxuICBmb250LXNpemU6IDExcHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgei1pbmRleDogMTAwMTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICBcbiAgLmd1dHRlciB7XG4gICAgaGVpZ2h0OiA2cHg7XG4gIH1cblxuICB0YWJsZSB7XG4gICAgbWFyZ2luOiAycHggMTJweCAxMnB4IDEycHg7XG4gICAgdGQucm93X192YWx1ZSB7XG4gICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRQaW4gPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDUwJTtcbiAgdHJhbnNmb3JtOiByb3RhdGUoMzBkZWcpO1xuICB0b3A6IDEwcHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2R9O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxpbmtCdG5Db2xvcn07XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZExheWVyTmFtZSA9IENlbnRlckZsZXhib3guZXh0ZW5kYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuNDNweDtcbiAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XG4gIHBhZGRpbmctbGVmdDogMTRweDtcbiAgbWFyZ2luLXRvcDogMTJweDtcbiAgXG4gIHN2ZyB7XG4gICAgbWFyZ2luLXJpZ2h0OiA0cHg7XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcFBvcG92ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNNb3VzZU92ZXI6IGZhbHNlLFxuICAgICAgd2lkdGg6IDM4MCxcbiAgICAgIGhlaWdodDogMTYwXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKCk7XG4gIH1cblxuICBfc2V0Q29udGFpbmVyU2l6ZSgpIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5wb3BvdmVyO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5taW4obm9kZS5zY3JvbGxXaWR0aCwgTUFYX1dJRFRIKTtcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1pbihub2RlLnNjcm9sbEhlaWdodCwgTUFYX0hFSUdIVCk7XG5cbiAgICBpZiAod2lkdGggIT09IHRoaXMuc3RhdGUud2lkdGggfHwgaGVpZ2h0ICE9PSB0aGlzLnN0YXRlLmhlaWdodCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7d2lkdGgsIGhlaWdodH0pO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRQb3NpdGlvbih4LCB5KSB7XG4gICAgY29uc3QgdG9wT2Zmc2V0ID0gMzA7XG4gICAgY29uc3QgbGVmdE9mZnNldCA9IDMwO1xuICAgIGNvbnN0IHttYXBTdGF0ZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgcG9zID0ge307XG4gICAgaWYgKHggKyBsZWZ0T2Zmc2V0ICsgd2lkdGggPiBtYXBTdGF0ZS5pbm5lcldpZHRoKSB7XG4gICAgICBwb3MucmlnaHQgPSBtYXBTdGF0ZS5pbm5lcldpZHRoIC0geCArIGxlZnRPZmZzZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcy5sZWZ0ID0geCArIGxlZnRPZmZzZXQ7XG4gICAgfVxuXG4gICAgaWYgKHkgKyB0b3BPZmZzZXQgKyBoZWlnaHQgPiBtYXBTdGF0ZS5pbm5lckhlaWdodCkge1xuICAgICAgcG9zLmJvdHRvbSA9IDEwO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3MudG9wID0geSArIHRvcE9mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9zO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgaXNWaXNpYmxlLFxuICAgICAgZGF0YSxcbiAgICAgIGxheWVyLFxuICAgICAgZnJlZXplZCxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGZpZWxkc1RvU2hvdyA9IFtdXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaGlkZGVuID0gIWlzVmlzaWJsZSAmJiAhdGhpcy5zdGF0ZS5pc01vdXNlT3ZlcjtcbiAgICBjb25zdCB7d2lkdGh9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmICghZGF0YSB8fCAhbGF5ZXIgfHwgIWZpZWxkc1RvU2hvdy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGluZm9Qcm9wcyA9IHtkYXRhLCBsYXllciwgZmllbGRzVG9TaG93LCBmaWVsZHN9O1xuXG4gICAgY29uc3Qgc3R5bGUgPVxuICAgICAgTnVtYmVyLmlzRmluaXRlKHgpICYmIE51bWJlci5pc0Zpbml0ZSh5KSA/IHRoaXMuX2dldFBvc2l0aW9uKHgsIHkpIDoge307XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZE1hcFBvcG92ZXJcbiAgICAgICAgaW5uZXJSZWY9e2NvbXAgPT4ge1xuICAgICAgICAgIHRoaXMucG9wb3ZlciA9IGNvbXA7XG4gICAgICAgIH19XG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnbWFwLXBvcG92ZXInLCB7aGlkZGVufSl9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgbWF4V2lkdGg6IHdpZHRoXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzTW91c2VPdmVyOiB0cnVlfSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzTW91c2VPdmVyOiBmYWxzZX0pO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7ZnJlZXplZCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC1wb3BvdmVyX190b3BcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3V0dGVyXCIgLz5cbiAgICAgICAgICAgIDxTdHlsZWRQaW4gY2xhc3NOYW1lPVwicG9wb3Zlci1waW5cIiBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xvc2V9PlxuICAgICAgICAgICAgICA8UGluIGhlaWdodD1cIjE2cHhcIiAvPlxuICAgICAgICAgICAgPC9TdHlsZWRQaW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICA8U3R5bGVkTGF5ZXJOYW1lIGNsYXNzTmFtZT1cIm1hcC1wb3BvdmVyX19sYXllci1uYW1lXCI+XG4gICAgICAgICAgPExheWVycyBoZWlnaHQ9XCIxMnB4XCIvPntsYXllci5jb25maWcubGFiZWx9PC9TdHlsZWRMYXllck5hbWU+XG4gICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJtYXAtcG9wb3Zlcl9fdGFibGVcIj5cbiAgICAgICAgICB7bGF5ZXIuaXNBZ2dyZWdhdGVkID8gKFxuICAgICAgICAgICAgPENlbGxJbmZvIHsuLi5pbmZvUHJvcHN9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxFbnRyeUluZm8gey4uLmluZm9Qcm9wc30gLz5cbiAgICAgICAgICApfVxuICAgICAgICA8L3RhYmxlPlxuICAgICAgPC9TdHlsZWRNYXBQb3BvdmVyPlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgUm93ID0gKHtuYW1lLCB2YWx1ZSwgdXJsfSkgPT4ge1xuICAvLyBTZXQgJ3VybCcgdG8gJ3ZhbHVlJyBpZiBpdCBsb29rcyBsaWtlIGEgdXJsXG4gIGlmICghdXJsICYmIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUubWF0Y2goL15odHRwLykpIHtcbiAgICB1cmwgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0IGFzSW1nID0gLzxpbWc+Ly50ZXN0KG5hbWUpO1xuICByZXR1cm4gKFxuICAgIDx0ciBjbGFzc05hbWU9XCJyb3dcIiBrZXk9e25hbWV9PlxuICAgICAgPHRkIGNsYXNzTmFtZT1cInJvd19fbmFtZVwiPntuYW1lfTwvdGQ+XG4gICAgICA8dGQgY2xhc3NOYW1lPVwicm93X192YWx1ZVwiPlxuICAgICAgICB7YXNJbWcgPyAoXG4gICAgICAgICAgPGltZyBzcmM9e3ZhbHVlfSAvPlxuICAgICAgICApIDogdXJsID8gKFxuICAgICAgICAgIDxhIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBocmVmPXt1cmx9PlxuICAgICAgICAgICAge3ZhbHVlfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICB2YWx1ZVxuICAgICAgICApfVxuICAgICAgPC90ZD5cbiAgICA8L3RyPlxuICApO1xufTtcblxuY29uc3QgRW50cnlJbmZvID0gKHtmaWVsZHNUb1Nob3csIGZpZWxkcywgZGF0YX0pID0+IChcbiAgPHRib2R5PlxuICAgIHtmaWVsZHNUb1Nob3cubWFwKG5hbWUgPT4gKFxuICAgICAgPEVudHJ5SW5mb1JvdyBrZXk9e25hbWV9IG5hbWU9e25hbWV9IGZpZWxkcz17ZmllbGRzfSBkYXRhPXtkYXRhfSAvPlxuICAgICkpfVxuICA8L3Rib2R5PlxuKTtcblxuY29uc3QgRW50cnlJbmZvUm93ID0gKHtuYW1lLCBmaWVsZHMsIGRhdGF9KSA9PiB7XG4gIGNvbnN0IGZpZWxkID0gZmllbGRzLmZpbmQoZiA9PiBmLm5hbWUgPT09IG5hbWUpO1xuICBpZiAoIWZpZWxkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB2YWx1ZUlkeCA9IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDE7XG4gIGNvbnN0IGZvcm1hdCA9IF9nZXRDZWxsRm9ybWF0KGZpZWxkLnR5cGUpO1xuXG4gIHJldHVybiAoXG4gICAgPFJvdyBuYW1lPXtuYW1lfSB2YWx1ZT17Zm9ybWF0ID8gZm9ybWF0KGRhdGFbdmFsdWVJZHhdKSA6IGRhdGFbdmFsdWVJZHhdfSAvPlxuICApO1xufTtcblxuY29uc3QgQ2VsbEluZm8gPSAoe2RhdGEsIGxheWVyfSkgPT4ge1xuICBjb25zdCB7Y29sb3JGaWVsZCwgc2l6ZUZpZWxkfSA9IGxheWVyLmNvbmZpZztcbiAgY29uc3Qge2NvbG9yQWdncmVnYXRpb24sIHNpemVBZ2dyZWdhdGlvbn0gPSBsYXllci5jb25maWcudmlzQ29uZmlnO1xuXG4gIHJldHVybiAoXG4gICAgPHRib2R5PlxuICAgICAgPFJvdyBuYW1lPXsndG90YWwgcG9pbnRzJ30ga2V5PVwiY291bnRcIiB2YWx1ZT17ZGF0YS5wb2ludHMubGVuZ3RofSAvPlxuICAgICAge2NvbG9yRmllbGQgPyAoXG4gICAgICAgIDxSb3dcbiAgICAgICAgICBuYW1lPXtgJHtjb2xvckFnZ3JlZ2F0aW9ufSAke2NvbG9yRmllbGQubmFtZX1gfVxuICAgICAgICAgIGtleT1cImNvbG9yXCJcbiAgICAgICAgICB2YWx1ZT17ZGF0YS5jb2xvclZhbHVlIHx8ICdOL0EnfVxuICAgICAgICAvPlxuICAgICAgKSA6IG51bGx9XG4gICAgICB7c2l6ZUZpZWxkID8gKFxuICAgICAgICA8Um93XG4gICAgICAgICAgbmFtZT17YCR7c2l6ZUFnZ3JlZ2F0aW9ufSAke3NpemVGaWVsZC5uYW1lfWB9XG4gICAgICAgICAga2V5PVwic2l6ZVwiXG4gICAgICAgICAgdmFsdWU9e2RhdGEuZWxldmF0aW9uVmFsdWUgfHwgJ04vQSd9XG4gICAgICAgIC8+XG4gICAgICApIDogbnVsbH1cbiAgICA8L3Rib2R5PlxuICApO1xufTtcblxuZnVuY3Rpb24gX2dldENlbGxGb3JtYXQodHlwZSkge1xuICByZXR1cm4gRklFTERfRElTUExBWV9GT1JNQVRbdHlwZV07XG59XG5cbk1hcFBvcG92ZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19