'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  min-height: 25px;\n  color: ', ';\n  text-align: left;\n  padding: 6px;\n'], ['\n  min-height: 25px;\n  color: ', ';\n  text-align: left;\n  padding: 6px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactSwitch = require('@uber/react-switch');

var _styledComponents3 = require('./styled-components');

var _utils = require('../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var basicSearcher = function basicSearcher(items, query) {
  try {
    var results = items.filter(function filterResults(item) {
      return new RegExp(query, 'i').test(item.name);
    });
    return results;
  } catch (e) {
    // TODO: keep track of this one
  }

  return items;
};

var StyledListItem = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.selectColorLight;
});

var propTypes = {
  // Required
  layers: _react2.default.PropTypes.array.isRequired,
  onMapToggleLayer: _react2.default.PropTypes.func.isRequired
};

var MapLayerSelector = function (_Component) {
  (0, _inherits3.default)(MapLayerSelector, _Component);

  function MapLayerSelector(props) {
    (0, _classCallCheck3.default)(this, MapLayerSelector);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

    _this.state = {
      query: props.query || ''
    };
    return _this;
  }

  MapLayerSelector.prototype.render = function render() {
    var query = this.state.query;
    var layers = this.props.layers;


    var availableItems = basicSearcher(layers, query);
    var onMapToggleLayer = this.props.onMapToggleLayer;


    return _react2.default.createElement(
      'div',
      null,
      availableItems.map(function (layer, index) {
        return _react2.default.createElement(
          StyledListItem,
          {
            key: index },
          _react2.default.createElement(CustomSwitch, {
            checked: layer.isVisible,
            id: layer.id + '-toggle-' + (0, _utils.generateHashId)(4),
            label: layer.name,
            onChange: function onChange(e) {
              e.preventDefault();onMapToggleLayer(layer.id);
            },
            size: 'small',
            style: {
              marginBottom: 0
            }
          })
        );
      })
    );
  };

  return MapLayerSelector;
}(_react.Component);

MapLayerSelector.displayName = 'LayerSelector';
MapLayerSelector.propTypes = propTypes;

exports.default = MapLayerSelector;


var CustomSwitch = function CustomSwitch(props) {
  return _react2.default.createElement(
    _styledComponents3.StyledSwitch,
    null,
    _react2.default.createElement(_reactSwitch.Switch, props)
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tYXAtbGF5ZXItc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiYmFzaWNTZWFyY2hlciIsIml0ZW1zIiwicXVlcnkiLCJyZXN1bHRzIiwiZmlsdGVyIiwiZmlsdGVyUmVzdWx0cyIsIml0ZW0iLCJSZWdFeHAiLCJ0ZXN0IiwibmFtZSIsImUiLCJTdHlsZWRMaXN0SXRlbSIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzZWxlY3RDb2xvckxpZ2h0IiwicHJvcFR5cGVzIiwibGF5ZXJzIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBMYXllclNlbGVjdG9yIiwic3RhdGUiLCJyZW5kZXIiLCJhdmFpbGFibGVJdGVtcyIsIm1hcCIsImxheWVyIiwiaW5kZXgiLCJpc1Zpc2libGUiLCJpZCIsInByZXZlbnREZWZhdWx0IiwibWFyZ2luQm90dG9tIiwiZGlzcGxheU5hbWUiLCJDdXN0b21Td2l0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ0MsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQ3RDLE1BQUk7QUFDRixRQUFNQyxVQUFVRixNQUFNRyxNQUFOLENBQWEsU0FBU0MsYUFBVCxDQUF1QkMsSUFBdkIsRUFBNkI7QUFDeEQsYUFBTyxJQUFJQyxNQUFKLENBQVdMLEtBQVgsRUFBa0IsR0FBbEIsRUFBdUJNLElBQXZCLENBQTRCRixLQUFLRyxJQUFqQyxDQUFQO0FBQ0QsS0FGZSxDQUFoQjtBQUdBLFdBQU9OLE9BQVA7QUFDRCxHQUxELENBS0UsT0FBT08sQ0FBUCxFQUFVO0FBQ1Y7QUFDRDs7QUFFRCxTQUFPVCxLQUFQO0FBQ0QsQ0FYRDs7QUFhQSxJQUFNVSxpQkFBaUIsMkJBQU9DLEdBQXhCLGtCQUVLO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxnQkFBckI7QUFBQSxDQUZMLENBQU47O0FBT0EsSUFBTUMsWUFBWTtBQUNoQjtBQUNBQyxVQUFRLGdCQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsVUFGZDtBQUdoQkMsb0JBQWtCLGdCQUFNSCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkY7QUFIdkIsQ0FBbEI7O0lBTU1HLGdCOzs7QUFFSiw0QkFBWVYsS0FBWixFQUFtQjtBQUFBOztBQUFBLCtEQUNqQixzQkFBTUEsS0FBTixDQURpQjs7QUFFakIsVUFBS1csS0FBTCxHQUFhO0FBQ1h0QixhQUFPVyxNQUFNWCxLQUFOLElBQWU7QUFEWCxLQUFiO0FBRmlCO0FBS2xCOzs2QkFFRHVCLE0scUJBQVM7QUFBQSxRQUNBdkIsS0FEQSxHQUNTLEtBQUtzQixLQURkLENBQ0F0QixLQURBO0FBQUEsUUFFQWUsTUFGQSxHQUVVLEtBQUtKLEtBRmYsQ0FFQUksTUFGQTs7O0FBSVAsUUFBTVMsaUJBQWlCMUIsY0FBY2lCLE1BQWQsRUFBc0JmLEtBQXRCLENBQXZCO0FBSk8sUUFLQW1CLGdCQUxBLEdBS29CLEtBQUtSLEtBTHpCLENBS0FRLGdCQUxBOzs7QUFPUCxXQUNFO0FBQUE7QUFBQTtBQUNHSyxxQkFBZUMsR0FBZixDQUFtQixVQUFDQyxLQUFELEVBQVFDLEtBQVI7QUFBQSxlQUNsQjtBQUFDLHdCQUFEO0FBQUE7QUFDRSxpQkFBS0EsS0FEUDtBQUVFLHdDQUFDLFlBQUQ7QUFDRSxxQkFBU0QsTUFBTUUsU0FEakI7QUFFRSxnQkFBT0YsTUFBTUcsRUFBYixnQkFBMEIsMkJBQWUsQ0FBZixDQUY1QjtBQUdFLG1CQUFPSCxNQUFNbkIsSUFIZjtBQUlFLHNCQUFVLHFCQUFLO0FBQUNDLGdCQUFFc0IsY0FBRixHQUFvQlgsaUJBQWlCTyxNQUFNRyxFQUF2QjtBQUE0QixhQUpsRTtBQUtFLGtCQUFLLE9BTFA7QUFNRSxtQkFBTztBQUNMRSw0QkFBYztBQURUO0FBTlQ7QUFGRixTQURrQjtBQUFBLE9BQW5CO0FBREgsS0FERjtBQW1CRCxHOzs7OztBQUdIVixpQkFBaUJXLFdBQWpCLEdBQStCLGVBQS9CO0FBQ0FYLGlCQUFpQlAsU0FBakIsR0FBNkJBLFNBQTdCOztrQkFFZU8sZ0I7OztBQUVmLElBQU1ZLGVBQWUsU0FBZkEsWUFBZSxDQUFDdEIsS0FBRDtBQUFBLFNBQ25CO0FBQUE7QUFBQTtBQUNFLHVEQUFZQSxLQUFaO0FBREYsR0FEbUI7QUFBQSxDQUFyQiIsImZpbGUiOiJtYXAtbGF5ZXItc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtTd2l0Y2h9IGZyb20gJ0B1YmVyL3JlYWN0LXN3aXRjaCc7XG5pbXBvcnQge1N0eWxlZFN3aXRjaH0gZnJvbSAnLi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2dlbmVyYXRlSGFzaElkfSBmcm9tICcuLi8uLi91dGlscy91dGlscyc7XG5cbmNvbnN0IGJhc2ljU2VhcmNoZXIgPSAoaXRlbXMsIHF1ZXJ5KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IGl0ZW1zLmZpbHRlcihmdW5jdGlvbiBmaWx0ZXJSZXN1bHRzKGl0ZW0pIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKHF1ZXJ5LCAnaScpLnRlc3QoaXRlbS5uYW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFRPRE86IGtlZXAgdHJhY2sgb2YgdGhpcyBvbmVcbiAgfVxuXG4gIHJldHVybiBpdGVtc1xufTtcblxuY29uc3QgU3R5bGVkTGlzdEl0ZW0gPSBzdHlsZWQuZGl2YFxuICBtaW4taGVpZ2h0OiAyNXB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvckxpZ2h0fTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgcGFkZGluZzogNnB4O1xuYDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICAvLyBSZXF1aXJlZFxuICBsYXllcnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBvbk1hcFRvZ2dsZUxheWVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jbGFzcyBNYXBMYXllclNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcXVlcnk6IHByb3BzLnF1ZXJ5IHx8ICcnXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7cXVlcnl9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7bGF5ZXJzfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBhdmFpbGFibGVJdGVtcyA9IGJhc2ljU2VhcmNoZXIobGF5ZXJzLCBxdWVyeSk7XG4gICAgY29uc3Qge29uTWFwVG9nZ2xlTGF5ZXJ9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7YXZhaWxhYmxlSXRlbXMubWFwKChsYXllciwgaW5kZXgpID0+IChcbiAgICAgICAgICA8U3R5bGVkTGlzdEl0ZW1cbiAgICAgICAgICAgIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgPEN1c3RvbVN3aXRjaFxuICAgICAgICAgICAgICBjaGVja2VkPXtsYXllci5pc1Zpc2libGV9XG4gICAgICAgICAgICAgIGlkPXtgJHtsYXllci5pZH0tdG9nZ2xlLSR7Z2VuZXJhdGVIYXNoSWQoNCl9YH1cbiAgICAgICAgICAgICAgbGFiZWw9e2xheWVyLm5hbWV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtlLnByZXZlbnREZWZhdWx0KCk7IG9uTWFwVG9nZ2xlTGF5ZXIobGF5ZXIuaWQpO319XG4gICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAwXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU3R5bGVkTGlzdEl0ZW0+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5NYXBMYXllclNlbGVjdG9yLmRpc3BsYXlOYW1lID0gJ0xheWVyU2VsZWN0b3InO1xuTWFwTGF5ZXJTZWxlY3Rvci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcExheWVyU2VsZWN0b3I7XG5cbmNvbnN0IEN1c3RvbVN3aXRjaCA9IChwcm9wcykgPT4gKFxuICA8U3R5bGVkU3dpdGNoPlxuICAgIDxTd2l0Y2ggey4uLnByb3BzfS8+XG4gIDwvU3R5bGVkU3dpdGNoPlxuKTtcbiJdfQ==