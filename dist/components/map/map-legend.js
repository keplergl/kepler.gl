'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  padding: 10px ', 'px;\n  font-size: 11px;\n  border-bottom-color: ', ';\n  border-bottom-style: solid;\n  border-bottom-width: ', ';\n\n  .legend--layer_name {\n    font-size: 12px;\n    color: ', ';\n    font-weight: 500;\n  }\n  .legend--layer_type {\n    color: ', ';\n    font-weight: 500;\n    font-size: 11px;\n  }\n\n  .legend--layer_by {\n    color: ', ';\n  }\n\n  .legend--layer_color_field {\n    color: ', ';\n    font-weight: 500;\n  }\n\n  .legend--layer_color-legend {\n    margin-top: 6px;\n  }\n'], ['\n  padding: 10px ', 'px;\n  font-size: 11px;\n  border-bottom-color: ', ';\n  border-bottom-style: solid;\n  border-bottom-width: ', ';\n\n  .legend--layer_name {\n    font-size: 12px;\n    color: ', ';\n    font-weight: 500;\n  }\n  .legend--layer_type {\n    color: ', ';\n    font-weight: 500;\n    font-size: 11px;\n  }\n\n  .legend--layer_by {\n    color: ', ';\n  }\n\n  .legend--layer_color_field {\n    color: ', ';\n    font-weight: 500;\n  }\n\n  .legend--layer_color-legend {\n    margin-top: 6px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _d3Color = require('d3-color');

var _colorLegend = require('../common/color-legend');

var _colorLegend2 = _interopRequireDefault(_colorLegend);

var _defaultSettings = require('../../constants/default-settings');

var _utils = require('../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledMapControlLegend = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.mapControlPadding;
}, function (props) {
  return props.theme.panelBorderColor;
}, function (props) {
  return props.last ? 0 : '1px';
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.subtextColor;
}, function (props) {
  return props.theme.subtextColor;
}, function (props) {
  return props.theme.textColor;
});

var VisualChannelMetric = function VisualChannelMetric(_ref) {
  var name = _ref.name;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'span',
      { className: 'legend--layer_by' },
      'by '
    ),
    _react2.default.createElement(
      'span',
      { className: 'legend--layer_color_field' },
      name
    )
  );
};

var LayerSize = function LayerSize(_ref2) {
  var label = _ref2.label,
      name = _ref2.name;
  return _react2.default.createElement(
    'div',
    { className: 'legend--layer_size-schema' },
    _react2.default.createElement(
      'p',
      null,
      _react2.default.createElement(
        'span',
        { className: 'legend--layer_by' },
        label
      )
    ),
    _react2.default.createElement(VisualChannelMetric, { name: name })
  );
};

var propTypes = {
  layers: _react2.default.PropTypes.array
};

var MapLegend = function MapLegend(_ref3) {
  var layers = _ref3.layers;
  return _react2.default.createElement(
    'div',
    null,
    layers.map(function (layer, index) {
      var enableColorBy = layer.config.colorField ? layer.config.colorField.name : layer.visualChannels.color.defaultMeasure;
      return _react2.default.createElement(
        StyledMapControlLegend,
        {
          className: 'legend--layer',
          last: index === layers.length - 1,
          key: index
        },
        _react2.default.createElement(
          'div',
          { className: 'legend--layer_name' },
          layer.config.label
        ),
        _react2.default.createElement(
          'div',
          { className: 'legend--layer_type' },
          (0, _utils.capitalizeFirstLetter)(layer.type) + ' color'
        ),
        _react2.default.createElement(
          'div',
          { className: 'legend--layer_color-schema' },
          _react2.default.createElement(
            'div',
            null,
            enableColorBy ? _react2.default.createElement(VisualChannelMetric, { name: enableColorBy }) : null,
            _react2.default.createElement(
              'div',
              { className: 'legend--layer_color-legend' },
              _react2.default.createElement(_colorLegend2.default, {
                scaleType: enableColorBy ? layer.config.colorScale : 'ordinal',
                displayLabel: enableColorBy,
                domain: enableColorBy ? layer.config.colorDomain : [''],
                fieldType: enableColorBy ? layer.config.colorField && layer.config.colorField.type || 'real' : null,
                range: enableColorBy ? layer.config.visConfig.colorRange.colors : [_d3Color.rgb.apply(undefined, (0, _toConsumableArray3.default)(layer.config.color)).toString()],
                width: _defaultSettings.DIMENSIONS.mapControlWidth - 2 * _defaultSettings.DIMENSIONS.mapControlPadding
              })
            )
          )
        ),
        Object.keys(layer.visualChannels).filter(function (k) {
          return k !== 'color';
        }).map(function (key) {
          var matchCondition = !layer.visualChannels[key].condition || layer.visualChannels[key].condition(layer.config);
          var enabled = layer.config[layer.visualChannels[key].field] || layer.visualChannels[key].defaultMeasure;
          if (matchCondition && enabled) {
            return _react2.default.createElement(LayerSize, {
              key: key,
              label: layer.visConfigSettings[layer.visualChannels[key].range].label,
              name: layer.config[layer.visualChannels[key].field] ? layer.config[layer.visualChannels[key].field].name : layer.visualChannels[key].defaultMeasure
            });
          }
          return null;
        })
      );
    })
  );
};

MapLegend.propTypes = propTypes;

exports.default = MapLegend;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtbGVnZW5kLmpzIl0sIm5hbWVzIjpbIlN0eWxlZE1hcENvbnRyb2xMZWdlbmQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwibWFwQ29udHJvbFBhZGRpbmciLCJwYW5lbEJvcmRlckNvbG9yIiwibGFzdCIsInRleHRDb2xvckhsIiwic3VidGV4dENvbG9yIiwidGV4dENvbG9yIiwiVmlzdWFsQ2hhbm5lbE1ldHJpYyIsIm5hbWUiLCJMYXllclNpemUiLCJsYWJlbCIsInByb3BUeXBlcyIsImxheWVycyIsIlByb3BUeXBlcyIsImFycmF5IiwiTWFwTGVnZW5kIiwibWFwIiwibGF5ZXIiLCJpbmRleCIsImVuYWJsZUNvbG9yQnkiLCJjb25maWciLCJjb2xvckZpZWxkIiwidmlzdWFsQ2hhbm5lbHMiLCJjb2xvciIsImRlZmF1bHRNZWFzdXJlIiwibGVuZ3RoIiwidHlwZSIsImNvbG9yU2NhbGUiLCJjb2xvckRvbWFpbiIsInZpc0NvbmZpZyIsImNvbG9yUmFuZ2UiLCJjb2xvcnMiLCJ0b1N0cmluZyIsIm1hcENvbnRyb2xXaWR0aCIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJrIiwibWF0Y2hDb25kaXRpb24iLCJrZXkiLCJjb25kaXRpb24iLCJlbmFibGVkIiwiZmllbGQiLCJ2aXNDb25maWdTZXR0aW5ncyIsInJhbmdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSx5QkFBeUIsMkJBQU9DLEdBQWhDLGtCQUNZO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxpQkFBckI7QUFBQSxDQURaLEVBR21CO0FBQUEsU0FBU0YsTUFBTUMsS0FBTixDQUFZRSxnQkFBckI7QUFBQSxDQUhuQixFQUttQjtBQUFBLFNBQVVILE1BQU1JLElBQU4sR0FBYSxDQUFiLEdBQWlCLEtBQTNCO0FBQUEsQ0FMbkIs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WWxCLE1BQU1LLGNBQWxCLEVBQ0VjLE1BREYsQ0FDUztBQUFBLGlCQUFLQyxNQUFNLE9BQVg7QUFBQSxTQURULEVBRUVyQixHQUZGLENBRU0sZUFBTztBQUNWLGNBQU1zQixpQkFDSixDQUFDckIsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCQyxTQUEzQixJQUNBdkIsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCQyxTQUExQixDQUFvQ3ZCLE1BQU1HLE1BQTFDLENBRkY7QUFHQSxjQUFNcUIsVUFDSnhCLE1BQU1HLE1BQU4sQ0FBYUgsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCRyxLQUF2QyxLQUNBekIsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCZixjQUY1QjtBQUdBLGNBQUljLGtCQUFrQkcsT0FBdEIsRUFBK0I7QUFDN0IsbUJBQ0UsOEJBQUMsU0FBRDtBQUNFLG1CQUFLRixHQURQO0FBRUUscUJBQ0V0QixNQUFNMEIsaUJBQU4sQ0FBd0IxQixNQUFNSyxjQUFOLENBQXFCaUIsR0FBckIsRUFBMEJLLEtBQWxELEVBQ0dsQyxLQUpQO0FBTUUsb0JBQ0VPLE1BQU1HLE1BQU4sQ0FBYUgsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCRyxLQUF2QyxJQUNJekIsTUFBTUcsTUFBTixDQUFhSCxNQUFNSyxjQUFOLENBQXFCaUIsR0FBckIsRUFBMEJHLEtBQXZDLEVBQThDbEMsSUFEbEQsR0FFSVMsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCZjtBQVRsQyxjQURGO0FBY0Q7QUFDRCxpQkFBTyxJQUFQO0FBQ0QsU0ExQkY7QUF6Q0gsT0FERjtBQXVFRCxLQTNFQTtBQURILEdBRGdCO0FBQUEsQ0FBbEI7O0FBaUZBVCxVQUFVSixTQUFWLEdBQXNCQSxTQUF0Qjs7a0JBRWVJLFMiLCJmaWxlIjoibWFwLWxlZ2VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7cmdifSBmcm9tICdkMy1jb2xvcic7XG5pbXBvcnQgQ29sb3JMZWdlbmQgZnJvbSAnY29tcG9uZW50cy9jb21tb24vY29sb3ItbGVnZW5kJztcbmltcG9ydCB7RElNRU5TSU9OU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtjYXBpdGFsaXplRmlyc3RMZXR0ZXJ9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuY29uc3QgU3R5bGVkTWFwQ29udHJvbExlZ2VuZCA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDEwcHggJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBDb250cm9sUGFkZGluZ31weDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBib3JkZXItYm90dG9tLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQm9yZGVyQ29sb3J9O1xuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWJvdHRvbS13aWR0aDogJHtwcm9wcyA9PiAocHJvcHMubGFzdCA/IDAgOiAnMXB4Jyl9O1xuXG4gIC5sZWdlbmQtLWxheWVyX25hbWUge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuICAubGVnZW5kLS1sYXllcl90eXBlIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3J9O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICB9XG5cbiAgLmxlZ2VuZC0tbGF5ZXJfYnkge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcn07XG4gIH1cblxuICAubGVnZW5kLS1sYXllcl9jb2xvcl9maWVsZCB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG5cbiAgLmxlZ2VuZC0tbGF5ZXJfY29sb3ItbGVnZW5kIHtcbiAgICBtYXJnaW4tdG9wOiA2cHg7XG4gIH1cbmA7XG5cbmNvbnN0IFZpc3VhbENoYW5uZWxNZXRyaWMgPSAoe25hbWV9KSA9PiAoXG4gIDxkaXY+XG4gICAgPHNwYW4gY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9ieVwiPmJ5IDwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyX2NvbG9yX2ZpZWxkXCI+e25hbWV9PC9zcGFuPlxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IExheWVyU2l6ZSA9ICh7bGFiZWwsIG5hbWV9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9zaXplLXNjaGVtYVwiPlxuICAgIDxwPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9ieVwiPntsYWJlbH08L3NwYW4+XG4gICAgPC9wPlxuICAgIDxWaXN1YWxDaGFubmVsTWV0cmljIG5hbWU9e25hbWV9IC8+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBsYXllcnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheVxufTtcblxuY29uc3QgTWFwTGVnZW5kID0gKHtsYXllcnN9KSA9PiAoXG4gIDxkaXY+XG4gICAge2xheWVycy5tYXAoKGxheWVyLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgZW5hYmxlQ29sb3JCeSA9IGxheWVyLmNvbmZpZy5jb2xvckZpZWxkXG4gICAgICAgID8gbGF5ZXIuY29uZmlnLmNvbG9yRmllbGQubmFtZVxuICAgICAgICA6IGxheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yLmRlZmF1bHRNZWFzdXJlO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZE1hcENvbnRyb2xMZWdlbmRcbiAgICAgICAgICBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyXCJcbiAgICAgICAgICBsYXN0PXtpbmRleCA9PT0gbGF5ZXJzLmxlbmd0aCAtIDF9XG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9uYW1lXCI+e2xheWVyLmNvbmZpZy5sYWJlbH08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfdHlwZVwiPntgJHtjYXBpdGFsaXplRmlyc3RMZXR0ZXIoXG4gICAgICAgICAgICBsYXllci50eXBlXG4gICAgICAgICAgKX0gY29sb3JgfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9jb2xvci1zY2hlbWFcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHtlbmFibGVDb2xvckJ5ID8gKFxuICAgICAgICAgICAgICAgIDxWaXN1YWxDaGFubmVsTWV0cmljIG5hbWU9e2VuYWJsZUNvbG9yQnl9IC8+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfY29sb3ItbGVnZW5kXCI+XG4gICAgICAgICAgICAgICAgPENvbG9yTGVnZW5kXG4gICAgICAgICAgICAgICAgICBzY2FsZVR5cGU9e1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVDb2xvckJ5ID8gbGF5ZXIuY29uZmlnLmNvbG9yU2NhbGUgOiAnb3JkaW5hbCdcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlMYWJlbD17ZW5hYmxlQ29sb3JCeX1cbiAgICAgICAgICAgICAgICAgIGRvbWFpbj17ZW5hYmxlQ29sb3JCeSA/IGxheWVyLmNvbmZpZy5jb2xvckRvbWFpbiA6IFsnJ119XG4gICAgICAgICAgICAgICAgICBmaWVsZFR5cGU9e1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVDb2xvckJ5XG4gICAgICAgICAgICAgICAgICAgICAgPyAobGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIuY29uZmlnLmNvbG9yRmllbGQudHlwZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICdyZWFsJ1xuICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmFuZ2U9e1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVDb2xvckJ5XG4gICAgICAgICAgICAgICAgICAgICAgPyBsYXllci5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UuY29sb3JzXG4gICAgICAgICAgICAgICAgICAgICAgOiBbcmdiKC4uLmxheWVyLmNvbmZpZy5jb2xvcikudG9TdHJpbmcoKV1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHdpZHRoPXtcbiAgICAgICAgICAgICAgICAgICAgRElNRU5TSU9OUy5tYXBDb250cm9sV2lkdGggLVxuICAgICAgICAgICAgICAgICAgICAyICogRElNRU5TSU9OUy5tYXBDb250cm9sUGFkZGluZ1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge09iamVjdC5rZXlzKGxheWVyLnZpc3VhbENoYW5uZWxzKVxuICAgICAgICAgICAgLmZpbHRlcihrID0+IGsgIT09ICdjb2xvcicpXG4gICAgICAgICAgICAubWFwKGtleSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoQ29uZGl0aW9uID1cbiAgICAgICAgICAgICAgICAhbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5jb25kaXRpb24gfHxcbiAgICAgICAgICAgICAgICBsYXllci52aXN1YWxDaGFubmVsc1trZXldLmNvbmRpdGlvbihsYXllci5jb25maWcpO1xuICAgICAgICAgICAgICBjb25zdCBlbmFibGVkID1cbiAgICAgICAgICAgICAgICBsYXllci5jb25maWdbbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5maWVsZF0gfHxcbiAgICAgICAgICAgICAgICBsYXllci52aXN1YWxDaGFubmVsc1trZXldLmRlZmF1bHRNZWFzdXJlO1xuICAgICAgICAgICAgICBpZiAobWF0Y2hDb25kaXRpb24gJiYgZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8TGF5ZXJTaXplXG4gICAgICAgICAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgICAgICAgICBsYWJlbD17XG4gICAgICAgICAgICAgICAgICAgICAgbGF5ZXIudmlzQ29uZmlnU2V0dGluZ3NbbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5yYW5nZV1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5sYWJlbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5hbWU9e1xuICAgICAgICAgICAgICAgICAgICAgIGxheWVyLmNvbmZpZ1tsYXllci52aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBsYXllci5jb25maWdbbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5maWVsZF0ubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBsYXllci52aXN1YWxDaGFubmVsc1trZXldLmRlZmF1bHRNZWFzdXJlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICA8L1N0eWxlZE1hcENvbnRyb2xMZWdlbmQ+XG4gICAgICApO1xuICAgIH0pfVxuICA8L2Rpdj5cbik7XG5cbk1hcExlZ2VuZC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcExlZ2VuZDtcbiJdfQ==