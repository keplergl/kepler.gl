'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 10px ', 'px;\n  font-size: 11px;\n  border-bottom-color: ', ';\n  border-bottom-style: solid;\n  border-bottom-width: ', ';\n\n  .legend--layer_name {\n    font-size: 12px;\n    color: ', ';\n    font-weight: 500;\n  }\n  .legend--layer_type {\n    color: ', ';\n    font-weight: 500;\n    font-size: 11px;\n  }\n\n  .legend--layer_by {\n    color: ', ';\n  }\n\n  .legend--layer_color_field {\n    color: ', ';\n    font-weight: 500;\n  }\n  \n  .legend--layer_color-legend {\n    margin-top: 6px;\n  }\n'], ['\n  padding: 10px ', 'px;\n  font-size: 11px;\n  border-bottom-color: ', ';\n  border-bottom-style: solid;\n  border-bottom-width: ', ';\n\n  .legend--layer_name {\n    font-size: 12px;\n    color: ', ';\n    font-weight: 500;\n  }\n  .legend--layer_type {\n    color: ', ';\n    font-weight: 500;\n    font-size: 11px;\n  }\n\n  .legend--layer_by {\n    color: ', ';\n  }\n\n  .legend--layer_color_field {\n    color: ', ';\n    font-weight: 500;\n  }\n  \n  .legend--layer_color-legend {\n    margin-top: 6px;\n  }\n']);

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
          key: index },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21hcC1sZWdlbmQuanMiXSwibmFtZXMiOlsiU3R5bGVkTWFwQ29udHJvbExlZ2VuZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJtYXBDb250cm9sUGFkZGluZyIsInBhbmVsQm9yZGVyQ29sb3IiLCJsYXN0IiwidGV4dENvbG9ySGwiLCJzdWJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3IiLCJWaXN1YWxDaGFubmVsTWV0cmljIiwibmFtZSIsIkxheWVyU2l6ZSIsImxhYmVsIiwicHJvcFR5cGVzIiwibGF5ZXJzIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJNYXBMZWdlbmQiLCJtYXAiLCJsYXllciIsImluZGV4IiwiZW5hYmxlQ29sb3JCeSIsImNvbmZpZyIsImNvbG9yRmllbGQiLCJ2aXN1YWxDaGFubmVscyIsImNvbG9yIiwiZGVmYXVsdE1lYXN1cmUiLCJsZW5ndGgiLCJ0eXBlIiwiY29sb3JTY2FsZSIsImNvbG9yRG9tYWluIiwidmlzQ29uZmlnIiwiY29sb3JSYW5nZSIsImNvbG9ycyIsInRvU3RyaW5nIiwibWFwQ29udHJvbFdpZHRoIiwiT2JqZWN0Iiwia2V5cyIsImZpbHRlciIsImsiLCJtYXRjaENvbmRpdGlvbiIsImtleSIsImNvbmRpdGlvbiIsImVuYWJsZWQiLCJmaWVsZCIsInZpc0NvbmZpZ1NldHRpbmdzIiwicmFuZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEseUJBQXlCLDJCQUFPQyxHQUFoQyxrQkFDWTtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsaUJBQXJCO0FBQUEsQ0FEWixFQUdtQjtBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsZ0JBQXJCO0FBQUEsQ0FIbkIsRUFLbUI7QUFBQSxTQUFTSCxNQUFNSSxJQUFOLEdBQWEsQ0FBYixHQUFpQixLQUExQjtBQUFBLENBTG5CLEVBU087QUFBQSxT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Q0FBWWxCLE1BQU1LLGNBQWxCLEVBQWtDYyxNQUFsQyxDQUF5QztBQUFBLGlCQUFLQyxNQUFNLE9BQVg7QUFBQSxTQUF6QyxFQUE2RHJCLEdBQTdELENBQWlFLGVBQU87QUFDdkUsY0FBTXNCLGlCQUFpQixDQUFDckIsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCQyxTQUEzQixJQUF3Q3ZCLE1BQU1LLGNBQU4sQ0FBcUJpQixHQUFyQixFQUEwQkMsU0FBMUIsQ0FBb0N2QixNQUFNRyxNQUExQyxDQUEvRDtBQUNBLGNBQU1xQixVQUFVeEIsTUFBTUcsTUFBTixDQUFhSCxNQUFNSyxjQUFOLENBQXFCaUIsR0FBckIsRUFBMEJHLEtBQXZDLEtBQWlEekIsTUFBTUssY0FBTixDQUFxQmlCLEdBQXJCLEVBQTBCZixjQUEzRjtBQUNBLGNBQUljLGtCQUFrQkcsT0FBdEIsRUFBK0I7QUFDN0IsbUJBQ0UsOEJBQUMsU0FBRDtBQUNFLG1CQUFLRixHQURQO0FBRUUscUJBQU90QixNQUFNMEIsaUJBQU4sQ0FBd0IxQixNQUFNSyxjQUFOLENBQXFCaUIsR0FBckIsRUFBMEJLLEtBQWxELEVBQXlEbEMsS0FGbEU7QUFHRSxvQkFBTU8sTUFBTUcsTUFBTixDQUFhSCxNQUFNSyxjQUFOLENBQXFCaUIsR0FBckIsRUFBMEJHLEtBQXZDLElBQ0p6QixNQUFNRyxNQUFOLENBQWFILE1BQU1LLGNBQU4sQ0FBcUJpQixHQUFyQixFQUEwQkcsS0FBdkMsRUFBOENsQyxJQUQxQyxHQUVKUyxNQUFNSyxjQUFOLENBQXFCaUIsR0FBckIsRUFBMEJmO0FBTDlCLGNBREY7QUFTRDtBQUNELGlCQUFPLElBQVA7QUFDRCxTQWZBO0FBdkJILE9BREY7QUEwQ0QsS0E3Q0E7QUFESCxHQURnQjtBQUFBLENBQWxCOztBQW1EQVQsVUFBVUosU0FBVixHQUFzQkEsU0FBdEI7O2tCQUVlSSxTIiwiZmlsZSI6Im1hcC1sZWdlbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge3JnYn0gZnJvbSAnZDMtY29sb3InO1xuaW1wb3J0IENvbG9yTGVnZW5kIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2NvbG9yLWxlZ2VuZCc7XG5pbXBvcnQge0RJTUVOU0lPTlN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyfSBmcm9tICd1dGlscy91dGlscyc7XG5cbmNvbnN0IFN0eWxlZE1hcENvbnRyb2xMZWdlbmQgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiAxMHB4ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubWFwQ29udHJvbFBhZGRpbmd9cHg7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckNvbG9yfTtcbiAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7XG4gIGJvcmRlci1ib3R0b20td2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMubGFzdCA/IDAgOiAnMXB4J307XG5cbiAgLmxlZ2VuZC0tbGF5ZXJfbmFtZSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG4gIC5sZWdlbmQtLWxheWVyX3R5cGUge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcn07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBmb250LXNpemU6IDExcHg7XG4gIH1cblxuICAubGVnZW5kLS1sYXllcl9ieSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgfVxuXG4gIC5sZWdlbmQtLWxheWVyX2NvbG9yX2ZpZWxkIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cbiAgXG4gIC5sZWdlbmQtLWxheWVyX2NvbG9yLWxlZ2VuZCB7XG4gICAgbWFyZ2luLXRvcDogNnB4O1xuICB9XG5gO1xuXG5jb25zdCBWaXN1YWxDaGFubmVsTWV0cmljID0gKHtuYW1lfSkgPT4gKFxuICA8ZGl2PlxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfYnlcIj5ieSA8L3NwYW4+XG4gICAgPHNwYW4gY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9jb2xvcl9maWVsZFwiPntuYW1lfTwvc3Bhbj5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBMYXllclNpemUgPSAoe2xhYmVsLCBuYW1lfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfc2l6ZS1zY2hlbWFcIj5cbiAgICA8cD5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfYnlcIj57bGFiZWx9PC9zcGFuPlxuICAgIDwvcD5cbiAgICA8VmlzdWFsQ2hhbm5lbE1ldHJpYyBuYW1lPXtuYW1lfS8+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBsYXllcnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheVxufTtcblxuY29uc3QgTWFwTGVnZW5kID0gKHtsYXllcnN9KSA9PiAoXG4gIDxkaXY+XG4gICAge2xheWVycy5tYXAoKGxheWVyLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgZW5hYmxlQ29sb3JCeSA9IGxheWVyLmNvbmZpZy5jb2xvckZpZWxkID8gbGF5ZXIuY29uZmlnLmNvbG9yRmllbGQubmFtZSA6XG4gICAgICAgIGxheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yLmRlZmF1bHRNZWFzdXJlO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZE1hcENvbnRyb2xMZWdlbmRcbiAgICAgICAgICBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyXCJcbiAgICAgICAgICBsYXN0PXtpbmRleCA9PT0gbGF5ZXJzLmxlbmd0aCAtIDF9XG4gICAgICAgICAga2V5PXtpbmRleH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyX25hbWVcIj57bGF5ZXIuY29uZmlnLmxhYmVsfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl90eXBlXCI+e2Ake2NhcGl0YWxpemVGaXJzdExldHRlcihsYXllci50eXBlKX0gY29sb3JgfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9jb2xvci1zY2hlbWFcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHtlbmFibGVDb2xvckJ5ID8gPFZpc3VhbENoYW5uZWxNZXRyaWMgbmFtZT17ZW5hYmxlQ29sb3JCeX0vPiA6IG51bGx9XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9jb2xvci1sZWdlbmRcIj5cbiAgICAgICAgICAgICAgICA8Q29sb3JMZWdlbmRcbiAgICAgICAgICAgICAgICAgIHNjYWxlVHlwZT17ZW5hYmxlQ29sb3JCeSA/IGxheWVyLmNvbmZpZy5jb2xvclNjYWxlIDogJ29yZGluYWwnfVxuICAgICAgICAgICAgICAgICAgZGlzcGxheUxhYmVsPXtlbmFibGVDb2xvckJ5fVxuICAgICAgICAgICAgICAgICAgZG9tYWluPXtlbmFibGVDb2xvckJ5ID8gbGF5ZXIuY29uZmlnLmNvbG9yRG9tYWluIDogWycnXX1cbiAgICAgICAgICAgICAgICAgIGZpZWxkVHlwZT17ZW5hYmxlQ29sb3JCeSA/IChsYXllci5jb25maWcuY29sb3JGaWVsZCAmJiBsYXllci5jb25maWcuY29sb3JGaWVsZC50eXBlKSB8fCAncmVhbCcgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgcmFuZ2U9e2VuYWJsZUNvbG9yQnkgPyBsYXllci5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UuY29sb3JzIDogW1xuICAgICAgICAgICAgICAgICAgICByZ2IoLi4ubGF5ZXIuY29uZmlnLmNvbG9yKS50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAgICAgd2lkdGg9e0RJTUVOU0lPTlMubWFwQ29udHJvbFdpZHRoIC0gMiAqIChESU1FTlNJT05TLm1hcENvbnRyb2xQYWRkaW5nKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhsYXllci52aXN1YWxDaGFubmVscykuZmlsdGVyKGsgPT4gayAhPT0gJ2NvbG9yJykubWFwKGtleSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaENvbmRpdGlvbiA9ICFsYXllci52aXN1YWxDaGFubmVsc1trZXldLmNvbmRpdGlvbiB8fCBsYXllci52aXN1YWxDaGFubmVsc1trZXldLmNvbmRpdGlvbihsYXllci5jb25maWcpO1xuICAgICAgICAgICAgY29uc3QgZW5hYmxlZCA9IGxheWVyLmNvbmZpZ1tsYXllci52aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXSB8fCBsYXllci52aXN1YWxDaGFubmVsc1trZXldLmRlZmF1bHRNZWFzdXJlO1xuICAgICAgICAgICAgaWYgKG1hdGNoQ29uZGl0aW9uICYmIGVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8TGF5ZXJTaXplXG4gICAgICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgICAgIGxhYmVsPXtsYXllci52aXNDb25maWdTZXR0aW5nc1tsYXllci52aXN1YWxDaGFubmVsc1trZXldLnJhbmdlXS5sYWJlbH1cbiAgICAgICAgICAgICAgICAgIG5hbWU9e2xheWVyLmNvbmZpZ1tsYXllci52aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXSA/XG4gICAgICAgICAgICAgICAgICAgIGxheWVyLmNvbmZpZ1tsYXllci52aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXS5uYW1lIDpcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIudmlzdWFsQ2hhbm5lbHNba2V5XS5kZWZhdWx0TWVhc3VyZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvU3R5bGVkTWFwQ29udHJvbExlZ2VuZD5cbiAgICAgIClcbiAgICB9KX1cbiAgPC9kaXY+XG4pO1xuXG5NYXBMZWdlbmQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBNYXBMZWdlbmQ7XG4iXX0=