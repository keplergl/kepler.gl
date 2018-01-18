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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2NvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJpZCIsImdldEFkZHJlc3MiLCJzdGF0ZSIsImtlcGxlckdsIiwiQ29udGFpbmVyIiwicHJvcHMiLCJjdHgiLCJnZXRTZWxlY3RvciIsImdldERpc3BhdGNoIiwiZGlzcGF0Y2giLCJjb21wb25lbnRXaWxsTW91bnQiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwibmV4dFByb3BzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW5kZXIiLCJtYXBTdGF0ZVRvUHJvcHMiLCJkaXNwYXRjaFRvUHJvcHMiLCJDb25uZWN0ZWRXcmFwcGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFLQTtBQUNBLElBQU1BLGVBQWU7QUFDbkJDLE1BQUksS0FEZTtBQUVuQkMsY0FBWTtBQUFBLFdBQVNDLE1BQU1DLFFBQWY7QUFBQTtBQUZPLENBQXJCOztJQUtNQyxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQkMsR0FBbkIsRUFBd0I7QUFBQTs7QUFBQSwrREFDdEIsc0JBQU1ELEtBQU4sRUFBYUMsR0FBYixDQURzQjs7QUFHdEIsVUFBS0MsV0FBTCxHQUFtQixzQkFBUSxVQUFDUCxFQUFELEVBQUtDLFVBQUw7QUFBQSxhQUFvQjtBQUFBLGVBQVNBLFdBQVdDLEtBQVgsRUFBa0JGLEVBQWxCLENBQVQ7QUFBQSxPQUFwQjtBQUFBLEtBQVIsQ0FBbkI7QUFDQSxVQUFLUSxXQUFMLEdBQW1CLHNCQUFRLFVBQUNSLEVBQUQsRUFBS1MsUUFBTDtBQUFBLGFBQWtCLDhCQUFVVCxFQUFWLEVBQWNTLFFBQWQsQ0FBbEI7QUFBQSxLQUFSLENBQW5CO0FBSnNCO0FBS3ZCOztzQkFFREMsa0IsaUNBQXFCO0FBQ25CO0FBQ0EsU0FBS0wsS0FBTCxDQUFXSSxRQUFYLENBQW9CLG9DQUFjLEtBQUtKLEtBQUwsQ0FBV0wsRUFBekIsQ0FBcEI7QUFDRCxHOztzQkFFRFcseUIsc0NBQTBCQyxTLEVBQVc7QUFDbkM7QUFDRCxHOztzQkFFREMsb0IsbUNBQXVCO0FBQ3JCO0FBQ0EsU0FBS1IsS0FBTCxDQUFXSSxRQUFYLENBQW9CLGtDQUFZLEtBQUtKLEtBQUwsQ0FBV0wsRUFBdkIsQ0FBcEI7QUFDRCxHOztzQkFFRGMsTSxxQkFBUztBQUFBLGlCQUM0QixLQUFLVCxLQURqQztBQUFBLFFBQ0FMLEVBREEsVUFDQUEsRUFEQTtBQUFBLFFBQ0lDLFVBREosVUFDSUEsVUFESjtBQUFBLFFBQ2dCUSxRQURoQixVQUNnQkEsUUFEaEI7OztBQUdQLFdBQ0UsNkVBQ00sS0FBS0osS0FEWDtBQUVFLFVBQUlMLEVBRk47QUFHRSxnQkFBVSxLQUFLTyxXQUFMLENBQWlCUCxFQUFqQixFQUFxQkMsVUFBckIsQ0FIWjtBQUlFLGdCQUFVLEtBQUtPLFdBQUwsQ0FBaUJSLEVBQWpCLEVBQXFCUyxRQUFyQjtBQUpaLE9BREY7QUFRRCxHOzs7OztBQUdITCxVQUFVTCxZQUFWLEdBQXlCQSxZQUF6Qjs7QUFFQSxJQUFNZ0Isa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDYixLQUFELEVBQVFHLEtBQVI7QUFBQSxTQUFrQkEsS0FBbEI7QUFBQSxDQUF4QjtBQUNBLElBQU1XLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ1AsUUFBRDtBQUFBLFNBQWUsRUFBQ0Esa0JBQUQsRUFBZjtBQUFBLENBQXhCOztBQUVBLElBQU1RLG1CQUFtQix5QkFDdkJGLGVBRHVCLEVBRXZCQyxlQUZ1QixFQUd2QlosU0FIdUIsQ0FBekI7O2tCQUtlYSxnQiIsImZpbGUiOiJjb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5cbmltcG9ydCBLZXBsZXJHbCBmcm9tICcuL2tlcGxlci1nbCc7XG5pbXBvcnQge2ZvcndhcmRUb30gZnJvbSAnYWN0aW9ucy9hY3Rpb24td3JhcHBlcic7XG5cbmltcG9ydCB7XG4gIHJlZ2lzdGVyRW50cnksXG4gIGRlbGV0ZUVudHJ5XG59IGZyb20gJ2FjdGlvbnMvaWRlbnRpdHktYWN0aW9ucyc7XG5cbi8vIGRlZmF1bHQgaWQgYW5kIGFkZHJlc3MgaWYgbm90IHByb3ZpZGVkXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGlkOiAnbWFwJyxcbiAgZ2V0QWRkcmVzczogc3RhdGUgPT4gc3RhdGUua2VwbGVyR2xcbn07XG5cbmNsYXNzIENvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjdHgpIHtcbiAgICBzdXBlcihwcm9wcywgY3R4KTtcblxuICAgIHRoaXMuZ2V0U2VsZWN0b3IgPSBtZW1vaXplKChpZCwgZ2V0QWRkcmVzcykgPT4gc3RhdGUgPT4gZ2V0QWRkcmVzcyhzdGF0ZSlbaWRdKTtcbiAgICB0aGlzLmdldERpc3BhdGNoID0gbWVtb2l6ZSgoaWQsIGRpc3BhdGNoKSA9PiBmb3J3YXJkVG8oaWQsIGRpc3BhdGNoKSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgLy8gYWRkIGEgbmV3IGVudHJ5IHRvIHJlZHVjZXJcbiAgICB0aGlzLnByb3BzLmRpc3BhdGNoKHJlZ2lzdGVyRW50cnkodGhpcy5wcm9wcy5pZCkpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvLyBUT0RPOiBuZWVkIHRvIGNoZWNrIGlmIGlkIGhhcyBjaGFuZ2VkXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAvLyBkZWxldGUgZW50cnkgaW4gcmVkdWNlclxuICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goZGVsZXRlRW50cnkodGhpcy5wcm9wcy5pZCkpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtpZCwgZ2V0QWRkcmVzcywgZGlzcGF0Y2h9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8S2VwbGVyR2xcbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgIGlkPXtpZH1cbiAgICAgICAgc2VsZWN0b3I9e3RoaXMuZ2V0U2VsZWN0b3IoaWQsIGdldEFkZHJlc3MpfVxuICAgICAgICBkaXNwYXRjaD17dGhpcy5nZXREaXNwYXRjaChpZCwgZGlzcGF0Y2gpfVxuICAgICAgLz5cbiAgICApXG4gIH1cbn1cblxuQ29udGFpbmVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlLCBwcm9wcykgPT4gcHJvcHM7XG5jb25zdCBkaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+ICh7ZGlzcGF0Y2h9KTtcblxuY29uc3QgQ29ubmVjdGVkV3JhcHBlciA9IGNvbm5lY3QoXG4gIG1hcFN0YXRlVG9Qcm9wcyxcbiAgZGlzcGF0Y2hUb1Byb3BzXG4pKENvbnRhaW5lcik7XG5cbmV4cG9ydCBkZWZhdWx0IENvbm5lY3RlZFdyYXBwZXI7XG4iXX0=