'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 10px ', 'px;\n  font-size: 11px;\n  border-bottom-color: ', ';\n  border-bottom-style: solid;\n  border-bottom-width: ', ';\n\n  .legend--layer_name {\n    font-size: 12px;\n    color: ', ';\n    font-weight: 500;\n  }\n  .legend--layer_type {\n    color: ', ';\n    font-weight: 500;\n    font-size: 11px;\n  }\n\n  .legend--layer_by {\n    color: ', ';\n  }\n\n  .legend--layer_color_field {\n    color: ', ';\n    font-weight: 500;\n  }\n\n  .legend--layer_color-legend {\n    margin-top: 6px;\n  }\n'], ['\n  padding: 10px ', 'px;\n  font-size: 11px;\n  border-bottom-color: ', ';\n  border-bottom-style: solid;\n  border-bottom-width: ', ';\n\n  .legend--layer_name {\n    font-size: 12px;\n    color: ', ';\n    font-weight: 500;\n  }\n  .legend--layer_type {\n    color: ', ';\n    font-weight: 500;\n    font-size: 11px;\n  }\n\n  .legend--layer_by {\n    color: ', ';\n  }\n\n  .legend--layer_color_field {\n    color: ', ';\n    font-weight: 500;\n  }\n\n  .legend--layer_color-legend {\n    margin-top: 6px;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _d3Color = require('d3-color');

var _colorLegend = require('./common/color-legend');

var _colorLegend2 = _interopRequireDefault(_colorLegend);

var _defaultSettings = require('../constants/default-settings');

var _utils = require('../utils/utils');

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
                range: enableColorBy ? layer.config.visConfig.colorRange.colors : [_d3Color.rgb.apply(undefined, layer.config.color).toString()],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1sZWdlbmQuanMiXSwibmFtZXMiOlsiU3R5bGVkTWFwQ29udHJvbExlZ2VuZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJtYXBDb250cm9sUGFkZGluZyIsInBhbmVsQm9yZGVyQ29sb3IiLCJsYXN0IiwidGV4dENvbG9ySGwiLCJzdWJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3IiLCJWaXN1YWxDaGFubmVsTWV0cmljIiwibmFtZSIsIkxheWVyU2l6ZSIsImxhYmVsIiwicHJvcFR5cGVzIiwibGF5ZXJzIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJNYXBMZWdlbmQiLCJtYXAiLCJsYXllciIsImluZGV4IiwiZW5hYmxlQ29sb3JCeSIsImNvbmZpZyIsImNvbG9yRmllbGQiLCJ2aXN1YWxDaGFubmVscyIsImNvbG9yIiwiZGVmYXVsdE1lYXN1cmUiLCJsZW5ndGgiLCJ0eXBlIiwiY29sb3JTY2FsZSIsImNvbG9yRG9tYWluIiwidmlzQ29uZmlnIiwiY29sb3JSYW5nZSIsImNvbG9ycyIsInRvU3RyaW5nIiwibWFwQ29udHJvbFdpZHRoIiwiT2JqZWN0Iiwia2V5cyIsImZpbHRlciIsImsiLCJtYXRjaENvbmRpdGlvbiIsImtleSIsImNvbmRpdGlvbiIsImVuYWJsZWQiLCJmaWVsZCIsInZpc0NvbmZpZ1NldHRpbmdzIiwicmFuZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEseUJBQXlCLDJCQUFPQyxHQUFoQyxrQkFDWTtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsaUJBQXJCO0FBQUEsQ0FEWixFQUdtQjtBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsZ0JBQXJCO0FBQUEsQ0FIbkIsRUFLbUI7QUFBQSxTQUFVSCxNQUFNSSxJQUFOLEdBQWEsQ0FBYixHQUFpQixLQUEzQjtBQUFBLENBTG5CLEVBU087QUFBQSxT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QUFsQixFQUNFYyxNQURGLENBQ1M7QUFBQSxpQkFBS0MsTUFBTSxPQUFYO0FBQUEsU0FEVCxFQUVFckIsR0FGRixDQUVNLGVBQU87QUFDVixjQUFNc0IsaUJBQ0osQ0FBQ3JCLE1BQU1LLGNBQU4sQ0FBcUJpQixHQUFyQixFQUEwQkMsU0FBM0IsSUFDQXZCLE1BQU1LLGNBQU4sQ0FBcUJpQixHQUFyQixFQUEwQkMsU0FBMUIsQ0FBb0N2QixNQUFNRyxNQUExQyxDQUZGO0FBR0EsY0FBTXFCLFVBQ0p4QixNQUFNRyxNQUFOLENBQWFILE1BQU1LLGNBQU4sQ0FBcUJpQixHQUFyQixFQUEwQkcsS0FBdkMsS0FDQXpCLE1BQU1LLGNBQU4sQ0FBcUJpQixHQUFyQixFQUEwQmYsY0FGNUI7QUFHQSxjQUFJYyxrQkFBa0JHLE9BQXRCLEVBQStCO0FBQzdCLG1CQUNFLDhCQUFDLFNBQUQ7QUFDRSxtQkFBS0YsR0FEUDtBQUVFLHFCQUNFdEIsTUFBTTBCLGlCQUFOLENBQXdCMUIsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCSyxLQUFsRCxFQUNHbEMsS0FKUDtBQU1FLG9CQUNFTyxNQUFNRyxNQUFOLENBQWFILE1BQU1LLGNBQU4sQ0FBcUJpQixHQUFyQixFQUEwQkcsS0FBdkMsSUFDSXpCLE1BQU1HLE1BQU4sQ0FBYUgsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCRyxLQUF2QyxFQUE4Q2xDLElBRGxELEdBRUlTLE1BQU1LLGNBQU4sQ0FBcUJpQixHQUFyQixFQUEwQmY7QUFUbEMsY0FERjtBQWNEO0FBQ0QsaUJBQU8sSUFBUDtBQUNELFNBMUJGO0FBekNILE9BREY7QUF1RUQsS0EzRUE7QUFESCxHQURnQjtBQUFBLENBQWxCOztBQWlGQVQsVUFBVUosU0FBVixHQUFzQkEsU0FBdEI7O2tCQUVlSSxTIiwiZmlsZSI6Im1hcC1sZWdlbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge3JnYn0gZnJvbSAnZDMtY29sb3InO1xuaW1wb3J0IENvbG9yTGVnZW5kIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2NvbG9yLWxlZ2VuZCc7XG5pbXBvcnQge0RJTUVOU0lPTlN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyfSBmcm9tICd1dGlscy91dGlscyc7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xMZWdlbmQgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiAxMHB4ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubWFwQ29udHJvbFBhZGRpbmd9cHg7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckNvbG9yfTtcbiAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7XG4gIGJvcmRlci1ib3R0b20td2lkdGg6ICR7cHJvcHMgPT4gKHByb3BzLmxhc3QgPyAwIDogJzFweCcpfTtcblxuICAubGVnZW5kLS1sYXllcl9uYW1lIHtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cbiAgLmxlZ2VuZC0tbGF5ZXJfdHlwZSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgfVxuXG4gIC5sZWdlbmQtLWxheWVyX2J5IHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3J9O1xuICB9XG5cbiAgLmxlZ2VuZC0tbGF5ZXJfY29sb3JfZmllbGQge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuXG4gIC5sZWdlbmQtLWxheWVyX2NvbG9yLWxlZ2VuZCB7XG4gICAgbWFyZ2luLXRvcDogNnB4O1xuICB9XG5gO1xuXG5jb25zdCBWaXN1YWxDaGFubmVsTWV0cmljID0gKHtuYW1lfSkgPT4gKFxuICA8ZGl2PlxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfYnlcIj5ieSA8L3NwYW4+XG4gICAgPHNwYW4gY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9jb2xvcl9maWVsZFwiPntuYW1lfTwvc3Bhbj5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBMYXllclNpemUgPSAoe2xhYmVsLCBuYW1lfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfc2l6ZS1zY2hlbWFcIj5cbiAgICA8cD5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfYnlcIj57bGFiZWx9PC9zcGFuPlxuICAgIDwvcD5cbiAgICA8VmlzdWFsQ2hhbm5lbE1ldHJpYyBuYW1lPXtuYW1lfSAvPlxuICA8L2Rpdj5cbik7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXJzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlcbn07XG5cbmNvbnN0IE1hcExlZ2VuZCA9ICh7bGF5ZXJzfSkgPT4gKFxuICA8ZGl2PlxuICAgIHtsYXllcnMubWFwKChsYXllciwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGVuYWJsZUNvbG9yQnkgPSBsYXllci5jb25maWcuY29sb3JGaWVsZFxuICAgICAgICA/IGxheWVyLmNvbmZpZy5jb2xvckZpZWxkLm5hbWVcbiAgICAgICAgOiBsYXllci52aXN1YWxDaGFubmVscy5jb2xvci5kZWZhdWx0TWVhc3VyZTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRNYXBDb250cm9sTGVnZW5kXG4gICAgICAgICAgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllclwiXG4gICAgICAgICAgbGFzdD17aW5kZXggPT09IGxheWVycy5sZW5ndGggLSAxfVxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfbmFtZVwiPntsYXllci5jb25maWcubGFiZWx9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyX3R5cGVcIj57YCR7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyKFxuICAgICAgICAgICAgbGF5ZXIudHlwZVxuICAgICAgICAgICl9IGNvbG9yYH08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfY29sb3Itc2NoZW1hXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7ZW5hYmxlQ29sb3JCeSA/IChcbiAgICAgICAgICAgICAgICA8VmlzdWFsQ2hhbm5lbE1ldHJpYyBuYW1lPXtlbmFibGVDb2xvckJ5fSAvPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyX2NvbG9yLWxlZ2VuZFwiPlxuICAgICAgICAgICAgICAgIDxDb2xvckxlZ2VuZFxuICAgICAgICAgICAgICAgICAgc2NhbGVUeXBlPXtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlQ29sb3JCeSA/IGxheWVyLmNvbmZpZy5jb2xvclNjYWxlIDogJ29yZGluYWwnXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBkaXNwbGF5TGFiZWw9e2VuYWJsZUNvbG9yQnl9XG4gICAgICAgICAgICAgICAgICBkb21haW49e2VuYWJsZUNvbG9yQnkgPyBsYXllci5jb25maWcuY29sb3JEb21haW4gOiBbJyddfVxuICAgICAgICAgICAgICAgICAgZmllbGRUeXBlPXtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlQ29sb3JCeVxuICAgICAgICAgICAgICAgICAgICAgID8gKGxheWVyLmNvbmZpZy5jb2xvckZpZWxkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLmNvbmZpZy5jb2xvckZpZWxkLnR5cGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAncmVhbCdcbiAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJhbmdlPXtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlQ29sb3JCeVxuICAgICAgICAgICAgICAgICAgICAgID8gbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLmNvbG9yc1xuICAgICAgICAgICAgICAgICAgICAgIDogW3JnYiguLi5sYXllci5jb25maWcuY29sb3IpLnRvU3RyaW5nKCldXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB3aWR0aD17XG4gICAgICAgICAgICAgICAgICAgIERJTUVOU0lPTlMubWFwQ29udHJvbFdpZHRoIC1cbiAgICAgICAgICAgICAgICAgICAgMiAqIERJTUVOU0lPTlMubWFwQ29udHJvbFBhZGRpbmdcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhsYXllci52aXN1YWxDaGFubmVscylcbiAgICAgICAgICAgIC5maWx0ZXIoayA9PiBrICE9PSAnY29sb3InKVxuICAgICAgICAgICAgLm1hcChrZXkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBtYXRjaENvbmRpdGlvbiA9XG4gICAgICAgICAgICAgICAgIWxheWVyLnZpc3VhbENoYW5uZWxzW2tleV0uY29uZGl0aW9uIHx8XG4gICAgICAgICAgICAgICAgbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5jb25kaXRpb24obGF5ZXIuY29uZmlnKTtcbiAgICAgICAgICAgICAgY29uc3QgZW5hYmxlZCA9XG4gICAgICAgICAgICAgICAgbGF5ZXIuY29uZmlnW2xheWVyLnZpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdIHx8XG4gICAgICAgICAgICAgICAgbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5kZWZhdWx0TWVhc3VyZTtcbiAgICAgICAgICAgICAgaWYgKG1hdGNoQ29uZGl0aW9uICYmIGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPExheWVyU2l6ZVxuICAgICAgICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgICAgICAgbGFiZWw9e1xuICAgICAgICAgICAgICAgICAgICAgIGxheWVyLnZpc0NvbmZpZ1NldHRpbmdzW2xheWVyLnZpc3VhbENoYW5uZWxzW2tleV0ucmFuZ2VdXG4gICAgICAgICAgICAgICAgICAgICAgICAubGFiZWxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuYW1lPXtcbiAgICAgICAgICAgICAgICAgICAgICBsYXllci5jb25maWdbbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5maWVsZF1cbiAgICAgICAgICAgICAgICAgICAgICAgID8gbGF5ZXIuY29uZmlnW2xheWVyLnZpc3VhbENoYW5uZWxzW2tleV0uZmllbGRdLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5kZWZhdWx0TWVhc3VyZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sTGVnZW5kPlxuICAgICAgKTtcbiAgICB9KX1cbiAgPC9kaXY+XG4pO1xuXG5NYXBMZWdlbmQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBNYXBMZWdlbmQ7XG4iXX0=