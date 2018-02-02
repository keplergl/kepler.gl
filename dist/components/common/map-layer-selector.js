'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  padding: 12px;\n  \n  .map-layer-selector__item {\n    margin: 12px 0;\n  }\n'], ['\n  padding: 12px;\n  \n  .map-layer-selector__item {\n    margin: 12px 0;\n  }\n']);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tYXAtbGF5ZXItc2VsZWN0b3IuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXJzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBMYXllclNlbGVjdCIsImRpdiIsIk1hcExheWVyU2VsZWN0b3IiLCJtYXAiLCJsYXllciIsImluZGV4IiwiaWQiLCJpc1Zpc2libGUiLCJuYW1lIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCO0FBQ0FDLFVBQVEsb0JBQVVDLEtBQVYsQ0FBZ0JDLFVBRlI7QUFHaEJDLG9CQUFrQixvQkFBVUMsSUFBVixDQUFlRjtBQUhqQixDQUFsQjs7QUFNQSxJQUFNRyxpQkFBaUIsMkJBQU9DLEdBQXhCLGlCQUFOOztBQVFBLElBQU1DLG1CQUFtQixTQUFuQkEsZ0JBQW1CO0FBQUEsTUFBRVAsTUFBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUcsZ0JBQVYsUUFBVUEsZ0JBQVY7QUFBQSxTQUN2QjtBQUFDLGtCQUFEO0FBQUEsTUFBZ0IsV0FBVSxvQkFBMUI7QUFDR0gsV0FBT1EsR0FBUCxDQUFXLFVBQUNDLEtBQUQsRUFBUUMsS0FBUjtBQUFBLGFBQ1Y7QUFBQTtBQUFBLFVBQUssS0FBS0QsTUFBTUUsRUFBaEIsRUFBb0IsV0FBVSwwQkFBOUI7QUFDRTtBQUNFLG1CQUFTRixNQUFNRyxTQURqQjtBQUVFLGNBQU9ILE1BQU1FLEVBQWIsZ0JBQTBCLDJCQUFlLENBQWYsQ0FGNUI7QUFHRSxpQkFBT0YsTUFBTUksSUFIZjtBQUlFLG9CQUFVLHFCQUFLO0FBQ2JDLGNBQUVDLGNBQUY7QUFDQVosNkJBQWlCTSxNQUFNRSxFQUF2QjtBQUNEO0FBUEg7QUFERixPQURVO0FBQUEsS0FBWDtBQURILEdBRHVCO0FBQUEsQ0FBekI7O0FBa0JBSixpQkFBaUJTLFdBQWpCLEdBQStCLGVBQS9CO0FBQ0FULGlCQUFpQlIsU0FBakIsR0FBNkJBLFNBQTdCOztrQkFFZVEsZ0IiLCJmaWxlIjoibWFwLWxheWVyLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQge2dlbmVyYXRlSGFzaElkfSBmcm9tICcuLi8uLi91dGlscy91dGlscyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgLy8gUmVxdWlyZWRcbiAgbGF5ZXJzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgb25NYXBUb2dnbGVMYXllcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgTWFwTGF5ZXJTZWxlY3QgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiAxMnB4O1xuICBcbiAgLm1hcC1sYXllci1zZWxlY3Rvcl9faXRlbSB7XG4gICAgbWFyZ2luOiAxMnB4IDA7XG4gIH1cbmA7XG5cbmNvbnN0IE1hcExheWVyU2VsZWN0b3IgPSAoe2xheWVycywgb25NYXBUb2dnbGVMYXllcn0pID0+IChcbiAgPE1hcExheWVyU2VsZWN0IGNsYXNzTmFtZT1cIm1hcC1sYXllci1zZWxlY3RvclwiPlxuICAgIHtsYXllcnMubWFwKChsYXllciwgaW5kZXgpID0+IChcbiAgICAgIDxkaXYga2V5PXtsYXllci5pZH0gY2xhc3NOYW1lPVwibWFwLWxheWVyLXNlbGVjdG9yX19pdGVtXCI+XG4gICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICBjaGVja2VkPXtsYXllci5pc1Zpc2libGV9XG4gICAgICAgICAgaWQ9e2Ake2xheWVyLmlkfS10b2dnbGUtJHtnZW5lcmF0ZUhhc2hJZCg0KX1gfVxuICAgICAgICAgIGxhYmVsPXtsYXllci5uYW1lfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIG9uTWFwVG9nZ2xlTGF5ZXIobGF5ZXIuaWQpO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApKX1cbiAgPC9NYXBMYXllclNlbGVjdD5cbik7XG5cbk1hcExheWVyU2VsZWN0b3IuZGlzcGxheU5hbWUgPSAnTGF5ZXJTZWxlY3Rvcic7XG5NYXBMYXllclNlbGVjdG9yLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuZXhwb3J0IGRlZmF1bHQgTWFwTGF5ZXJTZWxlY3RvcjtcbiJdfQ==