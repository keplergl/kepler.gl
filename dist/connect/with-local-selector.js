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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var identity = function identity(state) {
  return state;
};

var mergeSelectors = function mergeSelectors(parentSelector, childSelector) {
  return function (state) {
    return childSelector(parentSelector(state));
  };
};

var computeSelector = function computeSelector(props, ctx) {
  return mergeSelectors(ctx.selector ? ctx.selector : identity, props.selector ? props.selector : identity);
};

// store the parent selector in the parent context
// and return the parent component
// when a selector is passed to a container component,
// it will be stored in the context and passed down to child components,
// as well as prop to the given component
var withLocalSelector = function withLocalSelector(ParentComponent) {
  var WithConnectSelector = function (_Component) {
    (0, _inherits3.default)(WithConnectSelector, _Component);

    function WithConnectSelector(props, ctx) {
      (0, _classCallCheck3.default)(this, WithConnectSelector);

      var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props, ctx));

      _this.selector = computeSelector(props, ctx);
      return _this;
    }

    WithConnectSelector.prototype.getChildContext = function getChildContext() {
      return {
        selector: this.selector
      };
    };

    WithConnectSelector.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
      this.selector = computeSelector(nextProps, nextContext);
    };

    WithConnectSelector.prototype.render = function render() {
      return _react2.default.createElement(ParentComponent, (0, _extends3.default)({}, this.props, { selector: this.selector }));
    };

    return WithConnectSelector;
  }(_react.Component);

  WithConnectSelector.contextTypes = {
    selector: _react.PropTypes.func
  };

  WithConnectSelector.childContextTypes = {
    selector: _react.PropTypes.func
  };

  return WithConnectSelector;
};

exports.default = withLocalSelector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25uZWN0L3dpdGgtbG9jYWwtc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiaWRlbnRpdHkiLCJzdGF0ZSIsIm1lcmdlU2VsZWN0b3JzIiwicGFyZW50U2VsZWN0b3IiLCJjaGlsZFNlbGVjdG9yIiwiY29tcHV0ZVNlbGVjdG9yIiwicHJvcHMiLCJjdHgiLCJzZWxlY3RvciIsIndpdGhMb2NhbFNlbGVjdG9yIiwiV2l0aENvbm5lY3RTZWxlY3RvciIsImdldENoaWxkQ29udGV4dCIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJuZXh0Q29udGV4dCIsInJlbmRlciIsImNvbnRleHRUeXBlcyIsImZ1bmMiLCJjaGlsZENvbnRleHRUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXLFNBQVhBLFFBQVc7QUFBQSxTQUFTQyxLQUFUO0FBQUEsQ0FBakI7O0FBRUEsSUFBTUMsaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFDQyxjQUFELEVBQWlCQyxhQUFqQjtBQUFBLFNBQW1DO0FBQUEsV0FDeERBLGNBQWNELGVBQWVGLEtBQWYsQ0FBZCxDQUR3RDtBQUFBLEdBQW5DO0FBQUEsQ0FBdkI7O0FBR0EsSUFBTUksa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxLQUFELEVBQVFDLEdBQVI7QUFBQSxTQUN0QkwsZUFDRUssSUFBSUMsUUFBSixHQUFlRCxJQUFJQyxRQUFuQixHQUE4QlIsUUFEaEMsRUFFRU0sTUFBTUUsUUFBTixHQUFpQkYsTUFBTUUsUUFBdkIsR0FBa0NSLFFBRnBDLENBRHNCO0FBQUEsQ0FBeEI7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1TLG9CQUFvQixTQUFwQkEsaUJBQW9CLGtCQUFtQjtBQUFBLE1BQ3JDQyxtQkFEcUM7QUFBQTs7QUFFekMsaUNBQVlKLEtBQVosRUFBbUJDLEdBQW5CLEVBQXdCO0FBQUE7O0FBQUEsaUVBQ3RCLHNCQUFNRCxLQUFOLEVBQWFDLEdBQWIsQ0FEc0I7O0FBR3RCLFlBQUtDLFFBQUwsR0FBZ0JILGdCQUFnQkMsS0FBaEIsRUFBdUJDLEdBQXZCLENBQWhCO0FBSHNCO0FBSXZCOztBQU53QyxrQ0FRekNJLGVBUnlDLDhCQVF2QjtBQUNoQixhQUFPO0FBQ0xILGtCQUFVLEtBQUtBO0FBRFYsT0FBUDtBQUdELEtBWndDOztBQUFBLGtDQWN6Q0kseUJBZHlDLHNDQWNmQyxTQWRlLEVBY0pDLFdBZEksRUFjUztBQUNoRCxXQUFLTixRQUFMLEdBQWdCSCxnQkFBZ0JRLFNBQWhCLEVBQTJCQyxXQUEzQixDQUFoQjtBQUNELEtBaEJ3Qzs7QUFBQSxrQ0FrQnpDQyxNQWxCeUMscUJBa0JoQztBQUNQLGFBQU8sOEJBQUMsZUFBRCw2QkFBcUIsS0FBS1QsS0FBMUIsSUFBaUMsVUFBVSxLQUFLRSxRQUFoRCxJQUFQO0FBQ0QsS0FwQndDOztBQUFBO0FBQUE7O0FBdUIzQ0Usc0JBQW9CTSxZQUFwQixHQUFtQztBQUNqQ1IsY0FBVSxpQkFBVVM7QUFEYSxHQUFuQzs7QUFJQVAsc0JBQW9CUSxpQkFBcEIsR0FBd0M7QUFDdENWLGNBQVUsaUJBQVVTO0FBRGtCLEdBQXhDOztBQUlBLFNBQU9QLG1CQUFQO0FBQ0QsQ0FoQ0Q7O2tCQWtDZUQsaUIiLCJmaWxlIjoid2l0aC1sb2NhbC1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IGlkZW50aXR5ID0gc3RhdGUgPT4gc3RhdGU7XG5cbmNvbnN0IG1lcmdlU2VsZWN0b3JzID0gKHBhcmVudFNlbGVjdG9yLCBjaGlsZFNlbGVjdG9yKSA9PiBzdGF0ZSA9PlxuICBjaGlsZFNlbGVjdG9yKHBhcmVudFNlbGVjdG9yKHN0YXRlKSk7XG5cbmNvbnN0IGNvbXB1dGVTZWxlY3RvciA9IChwcm9wcywgY3R4KSA9PlxuICBtZXJnZVNlbGVjdG9ycyhcbiAgICBjdHguc2VsZWN0b3IgPyBjdHguc2VsZWN0b3IgOiBpZGVudGl0eSxcbiAgICBwcm9wcy5zZWxlY3RvciA/IHByb3BzLnNlbGVjdG9yIDogaWRlbnRpdHlcbiAgKTtcblxuLy8gc3RvcmUgdGhlIHBhcmVudCBzZWxlY3RvciBpbiB0aGUgcGFyZW50IGNvbnRleHRcbi8vIGFuZCByZXR1cm4gdGhlIHBhcmVudCBjb21wb25lbnRcbi8vIHdoZW4gYSBzZWxlY3RvciBpcyBwYXNzZWQgdG8gYSBjb250YWluZXIgY29tcG9uZW50LFxuLy8gaXQgd2lsbCBiZSBzdG9yZWQgaW4gdGhlIGNvbnRleHQgYW5kIHBhc3NlZCBkb3duIHRvIGNoaWxkIGNvbXBvbmVudHMsXG4vLyBhcyB3ZWxsIGFzIHByb3AgdG8gdGhlIGdpdmVuIGNvbXBvbmVudFxuY29uc3Qgd2l0aExvY2FsU2VsZWN0b3IgPSBQYXJlbnRDb21wb25lbnQgPT4ge1xuICBjbGFzcyBXaXRoQ29ubmVjdFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY3R4KSB7XG4gICAgICBzdXBlcihwcm9wcywgY3R4KTtcblxuICAgICAgdGhpcy5zZWxlY3RvciA9IGNvbXB1dGVTZWxlY3Rvcihwcm9wcywgY3R4KTtcbiAgICB9XG5cbiAgICBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzZWxlY3RvcjogdGhpcy5zZWxlY3RvclxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcywgbmV4dENvbnRleHQpIHtcbiAgICAgIHRoaXMuc2VsZWN0b3IgPSBjb21wdXRlU2VsZWN0b3IobmV4dFByb3BzLCBuZXh0Q29udGV4dCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIDxQYXJlbnRDb21wb25lbnQgey4uLnRoaXMucHJvcHN9IHNlbGVjdG9yPXt0aGlzLnNlbGVjdG9yfSAvPjtcbiAgICB9XG4gIH1cblxuICBXaXRoQ29ubmVjdFNlbGVjdG9yLmNvbnRleHRUeXBlcyA9IHtcbiAgICBzZWxlY3RvcjogUHJvcFR5cGVzLmZ1bmNcbiAgfTtcblxuICBXaXRoQ29ubmVjdFNlbGVjdG9yLmNoaWxkQ29udGV4dFR5cGVzID0ge1xuICAgIHNlbGVjdG9yOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIHJldHVybiBXaXRoQ29ubmVjdFNlbGVjdG9yO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgd2l0aExvY2FsU2VsZWN0b3I7XG4iXX0=