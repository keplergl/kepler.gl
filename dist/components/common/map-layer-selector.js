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
          { key: index },
          _react2.default.createElement(CustomSwitch, {
            checked: layer.isVisible,
            id: layer.id + '-toggle-' + (0, _utils.generateHashId)(4),
            label: layer.name,
            onChange: function onChange(e) {
              e.preventDefault();
              onMapToggleLayer(layer.id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tYXAtbGF5ZXItc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiYmFzaWNTZWFyY2hlciIsIml0ZW1zIiwicXVlcnkiLCJyZXN1bHRzIiwiZmlsdGVyIiwiZmlsdGVyUmVzdWx0cyIsIml0ZW0iLCJSZWdFeHAiLCJ0ZXN0IiwibmFtZSIsImUiLCJTdHlsZWRMaXN0SXRlbSIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzZWxlY3RDb2xvckxpZ2h0IiwicHJvcFR5cGVzIiwibGF5ZXJzIiwiUHJvcFR5cGVzIiwiYXJyYXkiLCJpc1JlcXVpcmVkIiwib25NYXBUb2dnbGVMYXllciIsImZ1bmMiLCJNYXBMYXllclNlbGVjdG9yIiwic3RhdGUiLCJyZW5kZXIiLCJhdmFpbGFibGVJdGVtcyIsIm1hcCIsImxheWVyIiwiaW5kZXgiLCJpc1Zpc2libGUiLCJpZCIsInByZXZlbnREZWZhdWx0IiwibWFyZ2luQm90dG9tIiwiZGlzcGxheU5hbWUiLCJDdXN0b21Td2l0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ0MsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQ3RDLE1BQUk7QUFDRixRQUFNQyxVQUFVRixNQUFNRyxNQUFOLENBQWEsU0FBU0MsYUFBVCxDQUF1QkMsSUFBdkIsRUFBNkI7QUFDeEQsYUFBTyxJQUFJQyxNQUFKLENBQVdMLEtBQVgsRUFBa0IsR0FBbEIsRUFBdUJNLElBQXZCLENBQTRCRixLQUFLRyxJQUFqQyxDQUFQO0FBQ0QsS0FGZSxDQUFoQjtBQUdBLFdBQU9OLE9BQVA7QUFDRCxHQUxELENBS0UsT0FBT08sQ0FBUCxFQUFVO0FBQ1Y7QUFDRDs7QUFFRCxTQUFPVCxLQUFQO0FBQ0QsQ0FYRDs7QUFhQSxJQUFNVSxpQkFBaUIsMkJBQU9DLEdBQXhCLGtCQUVLO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZQyxnQkFBckI7QUFBQSxDQUZMLENBQU47O0FBT0EsSUFBTUMsWUFBWTtBQUNoQjtBQUNBQyxVQUFRLGdCQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsVUFGZDtBQUdoQkMsb0JBQWtCLGdCQUFNSCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkY7QUFIdkIsQ0FBbEI7O0lBTU1HLGdCOzs7QUFDSiw0QkFBWVYsS0FBWixFQUFtQjtBQUFBOztBQUFBLCtEQUNqQixzQkFBTUEsS0FBTixDQURpQjs7QUFFakIsVUFBS1csS0FBTCxHQUFhO0FBQ1h0QixhQUFPVyxNQUFNWCxLQUFOLElBQWU7QUFEWCxLQUFiO0FBRmlCO0FBS2xCOzs2QkFFRHVCLE0scUJBQVM7QUFBQSxRQUNBdkIsS0FEQSxHQUNTLEtBQUtzQixLQURkLENBQ0F0QixLQURBO0FBQUEsUUFFQWUsTUFGQSxHQUVVLEtBQUtKLEtBRmYsQ0FFQUksTUFGQTs7O0FBSVAsUUFBTVMsaUJBQWlCMUIsY0FBY2lCLE1BQWQsRUFBc0JmLEtBQXRCLENBQXZCO0FBSk8sUUFLQW1CLGdCQUxBLEdBS29CLEtBQUtSLEtBTHpCLENBS0FRLGdCQUxBOzs7QUFPUCxXQUNFO0FBQUE7QUFBQTtBQUNHSyxxQkFBZUMsR0FBZixDQUFtQixVQUFDQyxLQUFELEVBQVFDLEtBQVI7QUFBQSxlQUNsQjtBQUFDLHdCQUFEO0FBQUEsWUFBZ0IsS0FBS0EsS0FBckI7QUFDRSx3Q0FBQyxZQUFEO0FBQ0UscUJBQVNELE1BQU1FLFNBRGpCO0FBRUUsZ0JBQU9GLE1BQU1HLEVBQWIsZ0JBQTBCLDJCQUFlLENBQWYsQ0FGNUI7QUFHRSxtQkFBT0gsTUFBTW5CLElBSGY7QUFJRSxzQkFBVSxxQkFBSztBQUNiQyxnQkFBRXNCLGNBQUY7QUFDQVgsK0JBQWlCTyxNQUFNRyxFQUF2QjtBQUNELGFBUEg7QUFRRSxrQkFBSyxPQVJQO0FBU0UsbUJBQU87QUFDTEUsNEJBQWM7QUFEVDtBQVRUO0FBREYsU0FEa0I7QUFBQSxPQUFuQjtBQURILEtBREY7QUFxQkQsRzs7Ozs7QUFHSFYsaUJBQWlCVyxXQUFqQixHQUErQixlQUEvQjtBQUNBWCxpQkFBaUJQLFNBQWpCLEdBQTZCQSxTQUE3Qjs7a0JBRWVPLGdCOzs7QUFFZixJQUFNWSxlQUFlLFNBQWZBLFlBQWU7QUFBQSxTQUNuQjtBQUFBO0FBQUE7QUFDRSx1REFBWXRCLEtBQVo7QUFERixHQURtQjtBQUFBLENBQXJCIiwiZmlsZSI6Im1hcC1sYXllci1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1N3aXRjaH0gZnJvbSAnQHViZXIvcmVhY3Qtc3dpdGNoJztcbmltcG9ydCB7U3R5bGVkU3dpdGNofSBmcm9tICcuL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzJztcblxuY29uc3QgYmFzaWNTZWFyY2hlciA9IChpdGVtcywgcXVlcnkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHRzID0gaXRlbXMuZmlsdGVyKGZ1bmN0aW9uIGZpbHRlclJlc3VsdHMoaXRlbSkge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAocXVlcnksICdpJykudGVzdChpdGVtLm5hbWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gVE9ETzoga2VlcCB0cmFjayBvZiB0aGlzIG9uZVxuICB9XG5cbiAgcmV0dXJuIGl0ZW1zO1xufTtcblxuY29uc3QgU3R5bGVkTGlzdEl0ZW0gPSBzdHlsZWQuZGl2YFxuICBtaW4taGVpZ2h0OiAyNXB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWxlY3RDb2xvckxpZ2h0fTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgcGFkZGluZzogNnB4O1xuYDtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICAvLyBSZXF1aXJlZFxuICBsYXllcnM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBvbk1hcFRvZ2dsZUxheWVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jbGFzcyBNYXBMYXllclNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHF1ZXJ5OiBwcm9wcy5xdWVyeSB8fCAnJ1xuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3F1ZXJ5fSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge2xheWVyc30gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgYXZhaWxhYmxlSXRlbXMgPSBiYXNpY1NlYXJjaGVyKGxheWVycywgcXVlcnkpO1xuICAgIGNvbnN0IHtvbk1hcFRvZ2dsZUxheWVyfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2F2YWlsYWJsZUl0ZW1zLm1hcCgobGF5ZXIsIGluZGV4KSA9PiAoXG4gICAgICAgICAgPFN0eWxlZExpc3RJdGVtIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgPEN1c3RvbVN3aXRjaFxuICAgICAgICAgICAgICBjaGVja2VkPXtsYXllci5pc1Zpc2libGV9XG4gICAgICAgICAgICAgIGlkPXtgJHtsYXllci5pZH0tdG9nZ2xlLSR7Z2VuZXJhdGVIYXNoSWQoNCl9YH1cbiAgICAgICAgICAgICAgbGFiZWw9e2xheWVyLm5hbWV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgb25NYXBUb2dnbGVMYXllcihsYXllci5pZCk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAwXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvU3R5bGVkTGlzdEl0ZW0+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5NYXBMYXllclNlbGVjdG9yLmRpc3BsYXlOYW1lID0gJ0xheWVyU2VsZWN0b3InO1xuTWFwTGF5ZXJTZWxlY3Rvci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IE1hcExheWVyU2VsZWN0b3I7XG5cbmNvbnN0IEN1c3RvbVN3aXRjaCA9IHByb3BzID0+IChcbiAgPFN0eWxlZFN3aXRjaD5cbiAgICA8U3dpdGNoIHsuLi5wcm9wc30gLz5cbiAgPC9TdHlsZWRTd2l0Y2g+XG4pO1xuIl19