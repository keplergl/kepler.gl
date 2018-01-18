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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25uZWN0L3dpdGgtbG9jYWwtc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiaWRlbnRpdHkiLCJzdGF0ZSIsIm1lcmdlU2VsZWN0b3JzIiwicGFyZW50U2VsZWN0b3IiLCJjaGlsZFNlbGVjdG9yIiwiY29tcHV0ZVNlbGVjdG9yIiwicHJvcHMiLCJjdHgiLCJzZWxlY3RvciIsIndpdGhMb2NhbFNlbGVjdG9yIiwiV2l0aENvbm5lY3RTZWxlY3RvciIsImdldENoaWxkQ29udGV4dCIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJuZXh0Q29udGV4dCIsInJlbmRlciIsImNvbnRleHRUeXBlcyIsImZ1bmMiLCJjaGlsZENvbnRleHRUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXLFNBQVhBLFFBQVc7QUFBQSxTQUFTQyxLQUFUO0FBQUEsQ0FBakI7O0FBRUEsSUFBTUMsaUJBQ0osU0FESUEsY0FDSixDQUFDQyxjQUFELEVBQWlCQyxhQUFqQjtBQUFBLFNBQ0U7QUFBQSxXQUNFQSxjQUFjRCxlQUFlRixLQUFmLENBQWQsQ0FERjtBQUFBLEdBREY7QUFBQSxDQURGOztBQUtBLElBQU1JLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ0MsS0FBRCxFQUFRQyxHQUFSO0FBQUEsU0FDdEJMLGVBQ0VLLElBQUlDLFFBQUosR0FBZUQsSUFBSUMsUUFBbkIsR0FBOEJSLFFBRGhDLEVBRUVNLE1BQU1FLFFBQU4sR0FBaUJGLE1BQU1FLFFBQXZCLEdBQWtDUixRQUZwQyxDQURzQjtBQUFBLENBQXhCOztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNUyxvQkFBb0IsU0FBcEJBLGlCQUFvQixrQkFBbUI7QUFBQSxNQUNyQ0MsbUJBRHFDO0FBQUE7O0FBRXpDLGlDQUFZSixLQUFaLEVBQW1CQyxHQUFuQixFQUF1QjtBQUFBOztBQUFBLGlFQUNyQixzQkFBTUQsS0FBTixFQUFhQyxHQUFiLENBRHFCOztBQUdyQixZQUFLQyxRQUFMLEdBQWdCSCxnQkFBZ0JDLEtBQWhCLEVBQXVCQyxHQUF2QixDQUFoQjtBQUhxQjtBQUl0Qjs7QUFOd0Msa0NBUXpDSSxlQVJ5Qyw4QkFReEI7QUFDZixhQUFPO0FBQ0xILGtCQUFVLEtBQUtBO0FBRFYsT0FBUDtBQUdELEtBWndDOztBQUFBLGtDQWN6Q0kseUJBZHlDLHNDQWNmQyxTQWRlLEVBY0pDLFdBZEksRUFjUTtBQUMvQyxXQUFLTixRQUFMLEdBQWdCSCxnQkFBZ0JRLFNBQWhCLEVBQTJCQyxXQUEzQixDQUFoQjtBQUNELEtBaEJ3Qzs7QUFBQSxrQ0FrQnpDQyxNQWxCeUMscUJBa0JqQztBQUNOLGFBQU8sOEJBQUMsZUFBRCw2QkFBcUIsS0FBS1QsS0FBMUIsSUFBaUMsVUFBVSxLQUFLRSxRQUFoRCxJQUFQO0FBQ0QsS0FwQndDOztBQUFBO0FBQUE7O0FBdUIzQ0Usc0JBQW9CTSxZQUFwQixHQUFtQztBQUNqQ1IsY0FBVSxpQkFBVVM7QUFEYSxHQUFuQzs7QUFJQVAsc0JBQW9CUSxpQkFBcEIsR0FBd0M7QUFDdENWLGNBQVUsaUJBQVVTO0FBRGtCLEdBQXhDOztBQUlBLFNBQU9QLG1CQUFQO0FBQ0QsQ0FoQ0Q7O2tCQWtDZUQsaUIiLCJmaWxlIjoid2l0aC1sb2NhbC1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge1Byb3BUeXBlcywgQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IGlkZW50aXR5ID0gc3RhdGUgPT4gc3RhdGU7XG5cbmNvbnN0IG1lcmdlU2VsZWN0b3JzID1cbiAgKHBhcmVudFNlbGVjdG9yLCBjaGlsZFNlbGVjdG9yKSA9PlxuICAgIHN0YXRlID0+XG4gICAgICBjaGlsZFNlbGVjdG9yKHBhcmVudFNlbGVjdG9yKHN0YXRlKSk7XG5cbmNvbnN0IGNvbXB1dGVTZWxlY3RvciA9IChwcm9wcywgY3R4KSA9PiAoXG4gIG1lcmdlU2VsZWN0b3JzKFxuICAgIGN0eC5zZWxlY3RvciA/IGN0eC5zZWxlY3RvciA6IGlkZW50aXR5LFxuICAgIHByb3BzLnNlbGVjdG9yID8gcHJvcHMuc2VsZWN0b3IgOiBpZGVudGl0eVxuICApKTtcblxuLy8gc3RvcmUgdGhlIHBhcmVudCBzZWxlY3RvciBpbiB0aGUgcGFyZW50IGNvbnRleHRcbi8vIGFuZCByZXR1cm4gdGhlIHBhcmVudCBjb21wb25lbnRcbi8vIHdoZW4gYSBzZWxlY3RvciBpcyBwYXNzZWQgdG8gYSBjb250YWluZXIgY29tcG9uZW50LFxuLy8gaXQgd2lsbCBiZSBzdG9yZWQgaW4gdGhlIGNvbnRleHQgYW5kIHBhc3NlZCBkb3duIHRvIGNoaWxkIGNvbXBvbmVudHMsXG4vLyBhcyB3ZWxsIGFzIHByb3AgdG8gdGhlIGdpdmVuIGNvbXBvbmVudFxuY29uc3Qgd2l0aExvY2FsU2VsZWN0b3IgPSBQYXJlbnRDb21wb25lbnQgPT4ge1xuICBjbGFzcyBXaXRoQ29ubmVjdFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY3R4KXtcbiAgICAgIHN1cGVyKHByb3BzLCBjdHgpO1xuXG4gICAgICB0aGlzLnNlbGVjdG9yID0gY29tcHV0ZVNlbGVjdG9yKHByb3BzLCBjdHgpO1xuICAgIH1cblxuICAgIGdldENoaWxkQ29udGV4dCgpe1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2VsZWN0b3I6IHRoaXMuc2VsZWN0b3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcywgbmV4dENvbnRleHQpe1xuICAgICAgdGhpcy5zZWxlY3RvciA9IGNvbXB1dGVTZWxlY3RvcihuZXh0UHJvcHMsIG5leHRDb250ZXh0KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKXtcbiAgICAgIHJldHVybiA8UGFyZW50Q29tcG9uZW50IHsuLi50aGlzLnByb3BzfSBzZWxlY3Rvcj17dGhpcy5zZWxlY3Rvcn0vPlxuICAgIH1cbiAgfVxuXG4gIFdpdGhDb25uZWN0U2VsZWN0b3IuY29udGV4dFR5cGVzID0ge1xuICAgIHNlbGVjdG9yOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIFdpdGhDb25uZWN0U2VsZWN0b3IuY2hpbGRDb250ZXh0VHlwZXMgPSB7XG4gICAgc2VsZWN0b3I6IFByb3BUeXBlcy5mdW5jXG4gIH07XG5cbiAgcmV0dXJuIFdpdGhDb25uZWN0U2VsZWN0b3Jcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhMb2NhbFNlbGVjdG9yO1xuIl19