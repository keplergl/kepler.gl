'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  padding: 12px;\n  \n  .map-layer-selector__item {\n    margin: 12px 0;\n  }\n'], ['\n  padding: 12px;\n  \n  .map-layer-selector__item {\n    margin: 12px 0;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _switch = require('./switch');

var _switch2 = _interopRequireDefault(_switch);

var _utils = require('../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  // Required
  layers: _propTypes2.default.array.isRequired,
  onMapToggleLayer: _propTypes2.default.func.isRequired
};

var MapLayerSelect = _styledComponents2.default.div(_templateObject);

var MapLayerSelector = function MapLayerSelector(_ref) {
  var layers = _ref.layers,
      onMapToggleLayer = _ref.onMapToggleLayer;
  return _react2.default.createElement(
    MapLayerSelect,
    { className: 'map-layer-selector' },
    layers.map(function (layer, index) {
      return _react2.default.createElement(
        'div',
        { key: layer.id, className: 'map-layer-selector__item' },
        _react2.default.createElement(_switch2.default, {
          checked: layer.isVisible,
          id: layer.id + '-toggle-' + (0, _utils.generateHashId)(4),
          label: layer.name,
          onChange: function onChange(e) {
            e.preventDefault();
            onMapToggleLayer(layer.id);
          }
        })
      );
    })
  );
};

MapLayerSelector.displayName = 'LayerSelector';
MapLayerSelector.propTypes = propTypes;

exports.default = MapLayerSelector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tYXAtbGF5ZXItc2VsZWN0b3IuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXJzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBMYXllclNlbGVjdCIsImRpdiIsIk1hcExheWVyU2VsZWN0b3IiLCJtYXAiLCJsYXllciIsImluZGV4IiwiaWQiLCJpc1Zpc2libGUiLCJuYW1lIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCO0FBQ0FDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JDLFVBRlI7QUFHaEJDLG9CQUFrQixvQkFBVUMsSUFBVixDQUFlRjtBQUhqQixDQUFsQjs7QUFNQSxJQUFNRyxpQkFBaUIsMkJBQU9DLEdBQXhCLGlCQUFOOztBQVFBLElBQU1DLG1CQUFtQixTQUFuQkEsZ0JBQW1CO0FBQUEsTUFBRVAsTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUcsZ0JBQVYsUUFBVUEsZ0JBQVY7QUFBQSxTQUN2QjtBQUFDLGtCQUFEO0FBQUEsTUFBZ0IsV0FBVSxvQkFBMUI7QUFDR0gsV0FBT1EsR0FBUCxDQUFXLFVBQUNDLEtBQUQsRUFBUUMsS0FBUjtBQUFBLGFBQ1Y7QUFBQTtBQUFBLFVBQUssS0FBS0QsTUFBTUUsRUFBaEIsRUFBb0IsV0FBVSwwQkFBOUI7QUFDRTtBQUNFLG1CQUFTRixNQUFNRyxTQURqQjtBQUVFLGNBQU9ILE1BQU1FLEVBQWIsZ0JBQTBCLDJCQUFlLENBQWYsQ0FGNUI7QUFHRSxpQkFBT0YsTUFBTUksSUFIZjtBQUlFLG9CQUFVLHFCQUFLO0FBQ2JDLGNBQUVDLGNBQUY7QUFDQVosNkJBQWlCTSxNQUFNRSxFQUF2QjtBQUNEO0FBUEg7QUFERixPQURVO0FBQUEsS0FBWDtBQURILEdBRHVCO0FBQUEsQ0FBekI7O0FBa0JBSixpQkFBaUJTLFdBQWpCLEdBQStCLGVBQS9CO0FBQ0FULGlCQUFpQlIsU0FBakIsR0FBNkJBLFNBQTdCOztrQkFFZVEsZ0IiLCJmaWxlIjoibWFwLWxheWVyLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBTd2l0Y2ggZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3dpdGNoJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICAvLyBSZXF1aXJlZFxuICBsYXllcnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBvbk1hcFRvZ2dsZUxheWVyOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBNYXBMYXllclNlbGVjdCA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDEycHg7XG4gIFxuICAubWFwLWxheWVyLXNlbGVjdG9yX19pdGVtIHtcbiAgICBtYXJnaW46IDEycHggMDtcbiAgfVxuYDtcblxuY29uc3QgTWFwTGF5ZXJTZWxlY3RvciA9ICh7bGF5ZXJzLCBvbk1hcFRvZ2dsZUxheWVyfSkgPT4gKFxuICA8TWFwTGF5ZXJTZWxlY3QgY2xhc3NOYW1lPVwibWFwLWxheWVyLXNlbGVjdG9yXCI+XG4gICAge2xheWVycy5tYXAoKGxheWVyLCBpbmRleCkgPT4gKFxuICAgICAgPGRpdiBrZXk9e2xheWVyLmlkfSBjbGFzc05hbWU9XCJtYXAtbGF5ZXItc2VsZWN0b3JfX2l0ZW1cIj5cbiAgICAgICAgPFN3aXRjaFxuICAgICAgICAgIGNoZWNrZWQ9e2xheWVyLmlzVmlzaWJsZX1cbiAgICAgICAgICBpZD17YCR7bGF5ZXIuaWR9LXRvZ2dsZS0ke2dlbmVyYXRlSGFzaElkKDQpfWB9XG4gICAgICAgICAgbGFiZWw9e2xheWVyLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgb25NYXBUb2dnbGVMYXllcihsYXllci5pZCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICkpfVxuICA8L01hcExheWVyU2VsZWN0PlxuKTtcblxuTWFwTGF5ZXJTZWxlY3Rvci5kaXNwbGF5TmFtZSA9ICdMYXllclNlbGVjdG9yJztcbk1hcExheWVyU2VsZWN0b3IucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG5leHBvcnQgZGVmYXVsdCBNYXBMYXllclNlbGVjdG9yO1xuIl19