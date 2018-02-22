'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorMsg = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.injector = injector;
exports.withState = withState;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _window = require('global/window');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MissingComp = function MissingComp() {
  return _react2.default.createElement('div', null);
};
var errorMsg = exports.errorMsg = {
  noDep: function noDep(fac, parent) {
    return fac.name + ' is required as a dependency of ' + parent.name + ', ' + 'but is not provided to injectComponents. It will not be rendered';
  },
  notFunc: '`factory and its replacment should be a function`'
};

function injector() {
  var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var cache = {}; // map<factory, factory -> ?>
  var get = function get(fac, parent) {
    var factory = map[fac];
    // factory is not injected
    if (!factory) {
      _window.console.error(errorMsg.noDep(fac, parent));
      return MissingComp;
    }

    var instances = cache[factory] || factory.apply(undefined, (0, _toConsumableArray3.default)(factory.deps ? factory.deps.map(function (dep) {
      return get(dep, factory);
    }) : []));

    cache[fac] = instances;
    return instances;
  };

  // if you have two functions that happen to have the exactly same text
  // it will be override: 2018-02-05
  return {
    provide: function provide(factory, replacement) {
      if (typeof factory !== 'function' || typeof replacement !== 'function') {
        _window.console.error(errorMsg.notFunc);
        return injector(map);
      }
      return injector((0, _extends5.default)({}, map, (0, _defineProperty3.default)({}, factory, replacement)));
    },
    get: get
  };
}

var identity = function identity(state) {
  return state;
};
// Helper to add reducer state to custom component
function withState(lenses) {
  var mapStateToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  var actions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return function (Component) {
    var WrappedComponent = function WrappedComponent(_ref, _ref2) {
      var selector = _ref2.selector,
          id = _ref2.id;
      var state = _ref.state,
          props = (0, _objectWithoutProperties3.default)(_ref, ['state']);
      return _react2.default.createElement(Component, lenses.reduce(function (totalState, lens) {
        return (0, _extends5.default)({}, totalState, lens(selector(state)));
      }, props));
    };
    WrappedComponent.contextTypes = {
      selector: _propTypes2.default.func,
      id: _propTypes2.default.string
    };
    return (0, _reactRedux.connect)(function (state) {
      return (0, _extends5.default)({}, mapStateToProps(state), { state: state });
    }, function (dispatch) {
      return Object.keys(actions).reduce(function (accu, key) {
        return (0, _extends5.default)({}, accu, (0, _defineProperty3.default)({}, key, (0, _redux.bindActionCreators)(actions[key], dispatch)));
      }, {});
    })(WrappedComponent);
  };
}

// Helpter to add actionCreator to custom component
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2luamVjdG9yLmpzIl0sIm5hbWVzIjpbImluamVjdG9yIiwid2l0aFN0YXRlIiwiTWlzc2luZ0NvbXAiLCJlcnJvck1zZyIsIm5vRGVwIiwiZmFjIiwicGFyZW50IiwibmFtZSIsIm5vdEZ1bmMiLCJtYXAiLCJjYWNoZSIsImdldCIsImZhY3RvcnkiLCJlcnJvciIsImluc3RhbmNlcyIsImRlcHMiLCJkZXAiLCJwcm92aWRlIiwicmVwbGFjZW1lbnQiLCJpZGVudGl0eSIsInN0YXRlIiwibGVuc2VzIiwibWFwU3RhdGVUb1Byb3BzIiwiYWN0aW9ucyIsIkNvbXBvbmVudCIsIldyYXBwZWRDb21wb25lbnQiLCJzZWxlY3RvciIsImlkIiwicHJvcHMiLCJyZWR1Y2UiLCJ0b3RhbFN0YXRlIiwibGVucyIsImNvbnRleHRUeXBlcyIsImZ1bmMiLCJzdHJpbmciLCJPYmplY3QiLCJrZXlzIiwiYWNjdSIsImtleSIsImRpc3BhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWNnQkEsUSxHQUFBQSxRO1FBb0NBQyxTLEdBQUFBLFM7O0FBbERoQjs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQyxjQUFjLFNBQWRBLFdBQWM7QUFBQSxTQUFNLDBDQUFOO0FBQUEsQ0FBcEI7QUFDTyxJQUFNQyw4QkFBVztBQUN0QkMsU0FBTyxlQUFDQyxHQUFELEVBQU1DLE1BQU47QUFBQSxXQUNGRCxJQUFJRSxJQUFQLHdDQUE4Q0QsT0FBT0MsSUFBckQsNEVBREs7QUFBQSxHQURlO0FBSXRCQyxXQUFTO0FBSmEsQ0FBakI7O0FBT0EsU0FBU1IsUUFBVCxHQUE0QjtBQUFBLE1BQVZTLEdBQVUsdUVBQUosRUFBSTs7QUFDakMsTUFBTUMsUUFBUSxFQUFkLENBRGlDLENBQ2Y7QUFDbEIsTUFBTUMsTUFBTSxTQUFOQSxHQUFNLENBQUNOLEdBQUQsRUFBTUMsTUFBTixFQUFpQjtBQUMzQixRQUFNTSxVQUFVSCxJQUFJSixHQUFKLENBQWhCO0FBQ0E7QUFDQSxRQUFJLENBQUNPLE9BQUwsRUFBYztBQUNaLHNCQUFRQyxLQUFSLENBQWNWLFNBQVNDLEtBQVQsQ0FBZUMsR0FBZixFQUFvQkMsTUFBcEIsQ0FBZDtBQUNBLGFBQU9KLFdBQVA7QUFDRDs7QUFFRCxRQUFNWSxZQUNKSixNQUFNRSxPQUFOLEtBQ0FBLDBEQUNNQSxRQUFRRyxJQUFSLEdBQWVILFFBQVFHLElBQVIsQ0FBYU4sR0FBYixDQUFpQjtBQUFBLGFBQU9FLElBQUlLLEdBQUosRUFBU0osT0FBVCxDQUFQO0FBQUEsS0FBakIsQ0FBZixHQUE0RCxFQURsRSxFQUZGOztBQU1BRixVQUFNTCxHQUFOLElBQWFTLFNBQWI7QUFDQSxXQUFPQSxTQUFQO0FBQ0QsR0FoQkQ7O0FBa0JBO0FBQ0E7QUFDQSxTQUFPO0FBQ0xHLGFBQVMsaUJBQUNMLE9BQUQsRUFBVU0sV0FBVixFQUEwQjtBQUNqQyxVQUFJLE9BQU9OLE9BQVAsS0FBbUIsVUFBbkIsSUFBaUMsT0FBT00sV0FBUCxLQUF1QixVQUE1RCxFQUF3RTtBQUN0RSx3QkFBUUwsS0FBUixDQUFjVixTQUFTSyxPQUF2QjtBQUNBLGVBQU9SLFNBQVNTLEdBQVQsQ0FBUDtBQUNEO0FBQ0QsYUFBT1Qsb0NBQWFTLEdBQWIsb0NBQW1CRyxPQUFuQixFQUE2Qk0sV0FBN0IsR0FBUDtBQUNELEtBUEk7QUFRTFA7QUFSSyxHQUFQO0FBVUQ7O0FBRUQsSUFBTVEsV0FBVyxTQUFYQSxRQUFXO0FBQUEsU0FBVUMsS0FBVjtBQUFBLENBQWpCO0FBQ0E7QUFDTyxTQUFTbkIsU0FBVCxDQUFtQm9CLE1BQW5CLEVBQXFFO0FBQUEsTUFBMUNDLGVBQTBDLHVFQUF4QkgsUUFBd0I7QUFBQSxNQUFkSSxPQUFjLHVFQUFKLEVBQUk7O0FBQzFFLFNBQU8sVUFBQ0MsU0FBRCxFQUFlO0FBQ3BCLFFBQU1DLG1CQUFtQixTQUFuQkEsZ0JBQW1CO0FBQUEsVUFBcUJDLFFBQXJCLFNBQXFCQSxRQUFyQjtBQUFBLFVBQStCQyxFQUEvQixTQUErQkEsRUFBL0I7QUFBQSxVQUFFUCxLQUFGLFFBQUVBLEtBQUY7QUFBQSxVQUFZUSxLQUFaO0FBQUEsYUFDdkIsOEJBQUMsU0FBRCxFQUNNUCxPQUFPUSxNQUFQLENBQ0YsVUFBQ0MsVUFBRCxFQUFhQyxJQUFiO0FBQUEsMENBQ0tELFVBREwsRUFFS0MsS0FBS0wsU0FBU04sS0FBVCxDQUFMLENBRkw7QUFBQSxPQURFLEVBS0ZRLEtBTEUsQ0FETixDQUR1QjtBQUFBLEtBQXpCO0FBV0FILHFCQUFpQk8sWUFBakIsR0FBZ0M7QUFDOUJOLGdCQUFVLG9CQUFVTyxJQURVO0FBRTlCTixVQUFJLG9CQUFVTztBQUZnQixLQUFoQztBQUlBLFdBQU8seUJBQ0w7QUFBQSx3Q0FBY1osZ0JBQWdCRixLQUFoQixDQUFkLElBQXNDQSxZQUF0QztBQUFBLEtBREssRUFFTDtBQUFBLGFBQVllLE9BQU9DLElBQVAsQ0FBWWIsT0FBWixFQUFxQk0sTUFBckIsQ0FBNEIsVUFBQ1EsSUFBRCxFQUFPQyxHQUFQO0FBQUEsMENBQ25DRCxJQURtQyxvQ0FFckNDLEdBRnFDLEVBRS9CLCtCQUFtQmYsUUFBUWUsR0FBUixDQUFuQixFQUFpQ0MsUUFBakMsQ0FGK0I7QUFBQSxPQUE1QixFQUdSLEVBSFEsQ0FBWjtBQUFBLEtBRkssRUFNTGQsZ0JBTkssQ0FBUDtBQU9ELEdBdkJEO0FBd0JEOztBQUVEIiwiZmlsZSI6ImluamVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmNvbnN0IE1pc3NpbmdDb21wID0gKCkgPT4gPGRpdiAvPjtcbmV4cG9ydCBjb25zdCBlcnJvck1zZyA9IHtcbiAgbm9EZXA6IChmYWMsIHBhcmVudCkgPT5cbiAgICBgJHtmYWMubmFtZX0gaXMgcmVxdWlyZWQgYXMgYSBkZXBlbmRlbmN5IG9mICR7cGFyZW50Lm5hbWV9LCBgICtcbiAgICBgYnV0IGlzIG5vdCBwcm92aWRlZCB0byBpbmplY3RDb21wb25lbnRzLiBJdCB3aWxsIG5vdCBiZSByZW5kZXJlZGAsXG4gIG5vdEZ1bmM6ICdgZmFjdG9yeSBhbmQgaXRzIHJlcGxhY21lbnQgc2hvdWxkIGJlIGEgZnVuY3Rpb25gJ1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdG9yKG1hcCA9IHt9KSB7XG4gIGNvbnN0IGNhY2hlID0ge307IC8vIG1hcDxmYWN0b3J5LCBmYWN0b3J5IC0+ID8+XG4gIGNvbnN0IGdldCA9IChmYWMsIHBhcmVudCkgPT4ge1xuICAgIGNvbnN0IGZhY3RvcnkgPSBtYXBbZmFjXTtcbiAgICAvLyBmYWN0b3J5IGlzIG5vdCBpbmplY3RlZFxuICAgIGlmICghZmFjdG9yeSkge1xuICAgICAgQ29uc29sZS5lcnJvcihlcnJvck1zZy5ub0RlcChmYWMsIHBhcmVudCkpO1xuICAgICAgcmV0dXJuIE1pc3NpbmdDb21wO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RhbmNlcyA9XG4gICAgICBjYWNoZVtmYWN0b3J5XSB8fFxuICAgICAgZmFjdG9yeShcbiAgICAgICAgLi4uKGZhY3RvcnkuZGVwcyA/IGZhY3RvcnkuZGVwcy5tYXAoZGVwID0+IGdldChkZXAsIGZhY3RvcnkpKSA6IFtdKVxuICAgICAgKTtcblxuICAgIGNhY2hlW2ZhY10gPSBpbnN0YW5jZXM7XG4gICAgcmV0dXJuIGluc3RhbmNlcztcbiAgfTtcblxuICAvLyBpZiB5b3UgaGF2ZSB0d28gZnVuY3Rpb25zIHRoYXQgaGFwcGVuIHRvIGhhdmUgdGhlIGV4YWN0bHkgc2FtZSB0ZXh0XG4gIC8vIGl0IHdpbGwgYmUgb3ZlcnJpZGU6IDIwMTgtMDItMDVcbiAgcmV0dXJuIHtcbiAgICBwcm92aWRlOiAoZmFjdG9yeSwgcmVwbGFjZW1lbnQpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZmFjdG9yeSAhPT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgcmVwbGFjZW1lbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgQ29uc29sZS5lcnJvcihlcnJvck1zZy5ub3RGdW5jKTtcbiAgICAgICAgcmV0dXJuIGluamVjdG9yKG1hcCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5qZWN0b3Ioey4uLm1hcCwgW2ZhY3RvcnldOiByZXBsYWNlbWVudH0pO1xuICAgIH0sXG4gICAgZ2V0XG4gIH07XG59XG5cbmNvbnN0IGlkZW50aXR5ID0gc3RhdGUgPT4gKHN0YXRlKTtcbi8vIEhlbHBlciB0byBhZGQgcmVkdWNlciBzdGF0ZSB0byBjdXN0b20gY29tcG9uZW50XG5leHBvcnQgZnVuY3Rpb24gd2l0aFN0YXRlKGxlbnNlcywgbWFwU3RhdGVUb1Byb3BzID0gaWRlbnRpdHksIGFjdGlvbnMgPSB7fSkge1xuICByZXR1cm4gKENvbXBvbmVudCkgPT4ge1xuICAgIGNvbnN0IFdyYXBwZWRDb21wb25lbnQgPSAoe3N0YXRlLCAuLi5wcm9wc30sIHtzZWxlY3RvciwgaWR9KSA9PiAoXG4gICAgICA8Q29tcG9uZW50XG4gICAgICAgIHsuLi5sZW5zZXMucmVkdWNlKFxuICAgICAgICAgICh0b3RhbFN0YXRlLCBsZW5zKSA9PiAoe1xuICAgICAgICAgICAgLi4udG90YWxTdGF0ZSxcbiAgICAgICAgICAgIC4uLmxlbnMoc2VsZWN0b3Ioc3RhdGUpKVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHByb3BzXG4gICAgICAgICl9XG4gICAgICAvPlxuICAgICk7XG4gICAgV3JhcHBlZENvbXBvbmVudC5jb250ZXh0VHlwZXMgPSB7XG4gICAgICBzZWxlY3RvcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH07XG4gICAgcmV0dXJuIGNvbm5lY3QoXG4gICAgICBzdGF0ZSA9PiAoey4uLm1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSksIHN0YXRlfSksXG4gICAgICBkaXNwYXRjaCA9PiBPYmplY3Qua2V5cyhhY3Rpb25zKS5yZWR1Y2UoKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgW2tleV06IGJpbmRBY3Rpb25DcmVhdG9ycyhhY3Rpb25zW2tleV0sIGRpc3BhdGNoKVxuICAgICAgfSksIHt9KVxuICAgICkoV3JhcHBlZENvbXBvbmVudCk7XG4gIH1cbn1cblxuLy8gSGVscHRlciB0byBhZGQgYWN0aW9uQ3JlYXRvciB0byBjdXN0b20gY29tcG9uZW50Il19