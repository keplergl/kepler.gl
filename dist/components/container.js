'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _keplerGl = require('./kepler-gl');

var _keplerGl2 = _interopRequireDefault(_keplerGl);

var _actionWrapper = require('../actions/action-wrapper');

var _identityActions = require('../actions/identity-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// default id and address if not provided
var defaultProps = {
  id: 'map',
  getAddress: function getAddress(state) {
    return state.keplerGl;
  }
};

var Container = function (_Component) {
  (0, _inherits3.default)(Container, _Component);

  function Container(props, ctx) {
    (0, _classCallCheck3.default)(this, Container);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, ctx));

    _this.getSelector = (0, _lodash2.default)(function (id, getAddress) {
      return function (state) {
        return getAddress(state)[id];
      };
    });
    _this.getDispatch = (0, _lodash2.default)(function (id, dispatch) {
      return (0, _actionWrapper.forwardTo)(id, dispatch);
    });
    return _this;
  }

  Container.prototype.componentWillMount = function componentWillMount() {
    // add a new entry to reducer
    this.props.dispatch((0, _identityActions.registerEntry)(this.props.id));
  };

  Container.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    // TODO: need to check if id has changed
  };

  Container.prototype.componentWillUnmount = function componentWillUnmount() {
    // delete entry in reducer
    this.props.dispatch((0, _identityActions.deleteEntry)(this.props.id));
  };

  Container.prototype.render = function render() {
    var _props = this.props,
        id = _props.id,
        getAddress = _props.getAddress,
        dispatch = _props.dispatch;


    return _react2.default.createElement(_keplerGl2.default, (0, _extends3.default)({}, this.props, {
      id: id,
      selector: this.getSelector(id, getAddress),
      dispatch: this.getDispatch(id, dispatch)
    }));
  };

  return Container;
}(_react.Component);

Container.defaultProps = defaultProps;

var mapStateToProps = function mapStateToProps(state, props) {
  return props;
};
var dispatchToProps = function dispatchToProps(dispatch) {
  return { dispatch: dispatch };
};

var ConnectedWrapper = (0, _reactRedux.connect)(mapStateToProps, dispatchToProps)(Container);

exports.default = ConnectedWrapper;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2NvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJpZCIsImdldEFkZHJlc3MiLCJzdGF0ZSIsImtlcGxlckdsIiwiQ29udGFpbmVyIiwicHJvcHMiLCJjdHgiLCJnZXRTZWxlY3RvciIsImdldERpc3BhdGNoIiwiZGlzcGF0Y2giLCJjb21wb25lbnRXaWxsTW91bnQiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwibmV4dFByb3BzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW5kZXIiLCJtYXBTdGF0ZVRvUHJvcHMiLCJkaXNwYXRjaFRvUHJvcHMiLCJDb25uZWN0ZWRXcmFwcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFFQTtBQUNBLElBQU1BLGVBQWU7QUFDbkJDLE1BQUksS0FEZTtBQUVuQkMsY0FBWTtBQUFBLFdBQVNDLE1BQU1DLFFBQWY7QUFBQTtBQUZPLENBQXJCOztJQUtNQyxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQkMsR0FBbkIsRUFBd0I7QUFBQTs7QUFBQSwrREFDdEIsc0JBQU1ELEtBQU4sRUFBYUMsR0FBYixDQURzQjs7QUFHdEIsVUFBS0MsV0FBTCxHQUFtQixzQkFBUSxVQUFDUCxFQUFELEVBQUtDLFVBQUw7QUFBQSxhQUFvQjtBQUFBLGVBQzdDQSxXQUFXQyxLQUFYLEVBQWtCRixFQUFsQixDQUQ2QztBQUFBLE9BQXBCO0FBQUEsS0FBUixDQUFuQjtBQUdBLFVBQUtRLFdBQUwsR0FBbUIsc0JBQVEsVUFBQ1IsRUFBRCxFQUFLUyxRQUFMO0FBQUEsYUFBa0IsOEJBQVVULEVBQVYsRUFBY1MsUUFBZCxDQUFsQjtBQUFBLEtBQVIsQ0FBbkI7QUFOc0I7QUFPdkI7O3NCQUVEQyxrQixpQ0FBcUI7QUFDbkI7QUFDQSxTQUFLTCxLQUFMLENBQVdJLFFBQVgsQ0FBb0Isb0NBQWMsS0FBS0osS0FBTCxDQUFXTCxFQUF6QixDQUFwQjtBQUNELEc7O3NCQUVEVyx5QixzQ0FBMEJDLFMsRUFBVztBQUNuQztBQUNELEc7O3NCQUVEQyxvQixtQ0FBdUI7QUFDckI7QUFDQSxTQUFLUixLQUFMLENBQVdJLFFBQVgsQ0FBb0Isa0NBQVksS0FBS0osS0FBTCxDQUFXTCxFQUF2QixDQUFwQjtBQUNELEc7O3NCQUVEYyxNLHFCQUFTO0FBQUEsaUJBQzRCLEtBQUtULEtBRGpDO0FBQUEsUUFDQUwsRUFEQSxVQUNBQSxFQURBO0FBQUEsUUFDSUMsVUFESixVQUNJQSxVQURKO0FBQUEsUUFDZ0JRLFFBRGhCLFVBQ2dCQSxRQURoQjs7O0FBR1AsV0FDRSw2RUFDTSxLQUFLSixLQURYO0FBRUUsVUFBSUwsRUFGTjtBQUdFLGdCQUFVLEtBQUtPLFdBQUwsQ0FBaUJQLEVBQWpCLEVBQXFCQyxVQUFyQixDQUhaO0FBSUUsZ0JBQVUsS0FBS08sV0FBTCxDQUFpQlIsRUFBakIsRUFBcUJTLFFBQXJCO0FBSlosT0FERjtBQVFELEc7Ozs7O0FBR0hMLFVBQVVMLFlBQVYsR0FBeUJBLFlBQXpCOztBQUVBLElBQU1nQixrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNiLEtBQUQsRUFBUUcsS0FBUjtBQUFBLFNBQWtCQSxLQUFsQjtBQUFBLENBQXhCO0FBQ0EsSUFBTVcsa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLFNBQWEsRUFBQ1Asa0JBQUQsRUFBYjtBQUFBLENBQXhCOztBQUVBLElBQU1RLG1CQUFtQix5QkFBUUYsZUFBUixFQUF5QkMsZUFBekIsRUFBMENaLFNBQTFDLENBQXpCOztrQkFFZWEsZ0IiLCJmaWxlIjoiY29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcblxuaW1wb3J0IEtlcGxlckdsIGZyb20gJy4va2VwbGVyLWdsJztcbmltcG9ydCB7Zm9yd2FyZFRvfSBmcm9tICdhY3Rpb25zL2FjdGlvbi13cmFwcGVyJztcblxuaW1wb3J0IHtyZWdpc3RlckVudHJ5LCBkZWxldGVFbnRyeX0gZnJvbSAnYWN0aW9ucy9pZGVudGl0eS1hY3Rpb25zJztcblxuLy8gZGVmYXVsdCBpZCBhbmQgYWRkcmVzcyBpZiBub3QgcHJvdmlkZWRcbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgaWQ6ICdtYXAnLFxuICBnZXRBZGRyZXNzOiBzdGF0ZSA9PiBzdGF0ZS5rZXBsZXJHbFxufTtcblxuY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMsIGN0eCkge1xuICAgIHN1cGVyKHByb3BzLCBjdHgpO1xuXG4gICAgdGhpcy5nZXRTZWxlY3RvciA9IG1lbW9pemUoKGlkLCBnZXRBZGRyZXNzKSA9PiBzdGF0ZSA9PlxuICAgICAgZ2V0QWRkcmVzcyhzdGF0ZSlbaWRdXG4gICAgKTtcbiAgICB0aGlzLmdldERpc3BhdGNoID0gbWVtb2l6ZSgoaWQsIGRpc3BhdGNoKSA9PiBmb3J3YXJkVG8oaWQsIGRpc3BhdGNoKSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgLy8gYWRkIGEgbmV3IGVudHJ5IHRvIHJlZHVjZXJcbiAgICB0aGlzLnByb3BzLmRpc3BhdGNoKHJlZ2lzdGVyRW50cnkodGhpcy5wcm9wcy5pZCkpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvLyBUT0RPOiBuZWVkIHRvIGNoZWNrIGlmIGlkIGhhcyBjaGFuZ2VkXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAvLyBkZWxldGUgZW50cnkgaW4gcmVkdWNlclxuICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goZGVsZXRlRW50cnkodGhpcy5wcm9wcy5pZCkpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtpZCwgZ2V0QWRkcmVzcywgZGlzcGF0Y2h9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8S2VwbGVyR2xcbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgIGlkPXtpZH1cbiAgICAgICAgc2VsZWN0b3I9e3RoaXMuZ2V0U2VsZWN0b3IoaWQsIGdldEFkZHJlc3MpfVxuICAgICAgICBkaXNwYXRjaD17dGhpcy5nZXREaXNwYXRjaChpZCwgZGlzcGF0Y2gpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG5cbkNvbnRhaW5lci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzO1xuY29uc3QgZGlzcGF0Y2hUb1Byb3BzID0gZGlzcGF0Y2ggPT4gKHtkaXNwYXRjaH0pO1xuXG5jb25zdCBDb25uZWN0ZWRXcmFwcGVyID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIGRpc3BhdGNoVG9Qcm9wcykoQ29udGFpbmVyKTtcblxuZXhwb3J0IGRlZmF1bHQgQ29ubmVjdGVkV3JhcHBlcjtcbiJdfQ==