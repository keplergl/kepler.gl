'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  getState: function getState(state) {
    return state.keplerGl;
  }
};

var Container = function (_Component) {
  (0, _inherits3.default)(Container, _Component);

  function Container(props, ctx) {
    (0, _classCallCheck3.default)(this, Container);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props, ctx));

    _this.getSelector = (0, _lodash2.default)(function (id, getState) {
      return function (state) {
        return getState(state)[id];
      };
    });
    _this.getDispatch = (0, _lodash2.default)(function (id, dispatch) {
      return (0, _actionWrapper.forwardTo)(id, dispatch);
    });
    return _this;
  }

  (0, _createClass3.default)(Container, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // add a new entry to reducer
      this.props.dispatch((0, _identityActions.registerEntry)(this.props.id));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // TODO: need to check if id has changed
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // delete entry in reducer
      this.props.dispatch((0, _identityActions.deleteEntry)(this.props.id));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          getState = _props.getState,
          dispatch = _props.dispatch;


      return _react2.default.createElement(_keplerGl2.default, (0, _extends3.default)({}, this.props, {
        id: id,
        selector: this.getSelector(id, getState),
        dispatch: this.getDispatch(id, dispatch)
      }));
    }
  }]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2NvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJkZWZhdWx0UHJvcHMiLCJpZCIsImdldFN0YXRlIiwic3RhdGUiLCJrZXBsZXJHbCIsIkNvbnRhaW5lciIsInByb3BzIiwiY3R4IiwiZ2V0U2VsZWN0b3IiLCJnZXREaXNwYXRjaCIsImRpc3BhdGNoIiwibmV4dFByb3BzIiwibWFwU3RhdGVUb1Byb3BzIiwiZGlzcGF0Y2hUb1Byb3BzIiwiQ29ubmVjdGVkV3JhcHBlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7QUFFQTs7OztBQUVBO0FBQ0EsSUFBTUEsZUFBZTtBQUNuQkMsTUFBSSxLQURlO0FBRW5CQyxZQUFVO0FBQUEsV0FBU0MsTUFBTUMsUUFBZjtBQUFBO0FBRlMsQ0FBckI7O0lBS01DLFM7OztBQUNKLHFCQUFZQyxLQUFaLEVBQW1CQyxHQUFuQixFQUF3QjtBQUFBOztBQUFBLG9JQUNoQkQsS0FEZ0IsRUFDVEMsR0FEUzs7QUFHdEIsVUFBS0MsV0FBTCxHQUFtQixzQkFBUSxVQUFDUCxFQUFELEVBQUtDLFFBQUw7QUFBQSxhQUFrQjtBQUFBLGVBQzNDQSxTQUFTQyxLQUFULEVBQWdCRixFQUFoQixDQUQyQztBQUFBLE9BQWxCO0FBQUEsS0FBUixDQUFuQjtBQUdBLFVBQUtRLFdBQUwsR0FBbUIsc0JBQVEsVUFBQ1IsRUFBRCxFQUFLUyxRQUFMO0FBQUEsYUFBa0IsOEJBQVVULEVBQVYsRUFBY1MsUUFBZCxDQUFsQjtBQUFBLEtBQVIsQ0FBbkI7QUFOc0I7QUFPdkI7Ozs7eUNBRW9CO0FBQ25CO0FBQ0EsV0FBS0osS0FBTCxDQUFXSSxRQUFYLENBQW9CLG9DQUFjLEtBQUtKLEtBQUwsQ0FBV0wsRUFBekIsQ0FBcEI7QUFDRDs7OzhDQUV5QlUsUyxFQUFXO0FBQ25DO0FBQ0Q7OzsyQ0FFc0I7QUFDckI7QUFDQSxXQUFLTCxLQUFMLENBQVdJLFFBQVgsQ0FBb0Isa0NBQVksS0FBS0osS0FBTCxDQUFXTCxFQUF2QixDQUFwQjtBQUNEOzs7NkJBRVE7QUFBQSxtQkFDMEIsS0FBS0ssS0FEL0I7QUFBQSxVQUNBTCxFQURBLFVBQ0FBLEVBREE7QUFBQSxVQUNJQyxRQURKLFVBQ0lBLFFBREo7QUFBQSxVQUNjUSxRQURkLFVBQ2NBLFFBRGQ7OztBQUdQLGFBQ0UsNkVBQ00sS0FBS0osS0FEWDtBQUVFLFlBQUlMLEVBRk47QUFHRSxrQkFBVSxLQUFLTyxXQUFMLENBQWlCUCxFQUFqQixFQUFxQkMsUUFBckIsQ0FIWjtBQUlFLGtCQUFVLEtBQUtPLFdBQUwsQ0FBaUJSLEVBQWpCLEVBQXFCUyxRQUFyQjtBQUpaLFNBREY7QUFRRDs7Ozs7QUFHSEwsVUFBVUwsWUFBVixHQUF5QkEsWUFBekI7O0FBRUEsSUFBTVksa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDVCxLQUFELEVBQVFHLEtBQVI7QUFBQSxTQUFrQkEsS0FBbEI7QUFBQSxDQUF4QjtBQUNBLElBQU1PLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxTQUFhLEVBQUNILGtCQUFELEVBQWI7QUFBQSxDQUF4Qjs7QUFFQSxJQUFNSSxtQkFBbUIseUJBQVFGLGVBQVIsRUFBeUJDLGVBQXpCLEVBQTBDUixTQUExQyxDQUF6Qjs7a0JBRWVTLGdCIiwiZmlsZSI6ImNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5cbmltcG9ydCBLZXBsZXJHbCBmcm9tICcuL2tlcGxlci1nbCc7XG5pbXBvcnQge2ZvcndhcmRUb30gZnJvbSAnYWN0aW9ucy9hY3Rpb24td3JhcHBlcic7XG5cbmltcG9ydCB7cmVnaXN0ZXJFbnRyeSwgZGVsZXRlRW50cnl9IGZyb20gJ2FjdGlvbnMvaWRlbnRpdHktYWN0aW9ucyc7XG5cbi8vIGRlZmF1bHQgaWQgYW5kIGFkZHJlc3MgaWYgbm90IHByb3ZpZGVkXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGlkOiAnbWFwJyxcbiAgZ2V0U3RhdGU6IHN0YXRlID0+IHN0YXRlLmtlcGxlckdsXG59O1xuXG5jbGFzcyBDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcywgY3R4KSB7XG4gICAgc3VwZXIocHJvcHMsIGN0eCk7XG5cbiAgICB0aGlzLmdldFNlbGVjdG9yID0gbWVtb2l6ZSgoaWQsIGdldFN0YXRlKSA9PiBzdGF0ZSA9PlxuICAgICAgZ2V0U3RhdGUoc3RhdGUpW2lkXVxuICAgICk7XG4gICAgdGhpcy5nZXREaXNwYXRjaCA9IG1lbW9pemUoKGlkLCBkaXNwYXRjaCkgPT4gZm9yd2FyZFRvKGlkLCBkaXNwYXRjaCkpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIC8vIGFkZCBhIG5ldyBlbnRyeSB0byByZWR1Y2VyXG4gICAgdGhpcy5wcm9wcy5kaXNwYXRjaChyZWdpc3RlckVudHJ5KHRoaXMucHJvcHMuaWQpKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gVE9ETzogbmVlZCB0byBjaGVjayBpZiBpZCBoYXMgY2hhbmdlZFxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgLy8gZGVsZXRlIGVudHJ5IGluIHJlZHVjZXJcbiAgICB0aGlzLnByb3BzLmRpc3BhdGNoKGRlbGV0ZUVudHJ5KHRoaXMucHJvcHMuaWQpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7aWQsIGdldFN0YXRlLCBkaXNwYXRjaH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxLZXBsZXJHbFxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgaWQ9e2lkfVxuICAgICAgICBzZWxlY3Rvcj17dGhpcy5nZXRTZWxlY3RvcihpZCwgZ2V0U3RhdGUpfVxuICAgICAgICBkaXNwYXRjaD17dGhpcy5nZXREaXNwYXRjaChpZCwgZGlzcGF0Y2gpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG5cbkNvbnRhaW5lci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+IHByb3BzO1xuY29uc3QgZGlzcGF0Y2hUb1Byb3BzID0gZGlzcGF0Y2ggPT4gKHtkaXNwYXRjaH0pO1xuXG5jb25zdCBDb25uZWN0ZWRXcmFwcGVyID0gY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIGRpc3BhdGNoVG9Qcm9wcykoQ29udGFpbmVyKTtcblxuZXhwb3J0IGRlZmF1bHQgQ29ubmVjdGVkV3JhcHBlcjtcbiJdfQ==