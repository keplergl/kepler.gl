"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injector = injector;
exports.typeCheckRecipe = typeCheckRecipe;
exports.withState = withState;
exports.ERROR_MSG = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _window = require("global/window");

var _context = _interopRequireDefault(require("./context"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var MissingComp = function MissingComp() {
  return _react["default"].createElement("div", null);
};

var ERROR_MSG = {
  wrongRecipeType: "injectComponents takes an array of factories replacement pairs as input, " + "each pair be a array as [originalFactory, replacement].",
  noDep: function noDep(fac, parent) {
    return "".concat(fac.name, " is required as a dependency of ").concat(parent.name, ", ") + "but is not provided to injectComponents. It will not be rendered.";
  },
  notFunc: 'factory and its replacement should be a function'
};
exports.ERROR_MSG = ERROR_MSG;

function injector() {
  var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();
  var cache = new Map(); // map<factory, factory -> ?>

  var get = function get(fac, parent) {
    var factory = map.get(fac); // factory is not injected

    if (!factory) {
      _window.console.error(ERROR_MSG.noDep(fac, parent));

      return MissingComp;
    } // check if custom factory deps is declared


    var instances = cache.get(factory) || factory.apply(void 0, (0, _toConsumableArray2["default"])(factory.deps ? factory.deps.map(function (dep) {
      return get(dep, factory);
    }) : []));
    cache.set(fac, instances);
    return instances;
  }; // if you have two functions that happen to have the exactly same text
  // it will be override: 2018-02-05


  return {
    provide: function provide(factory, replacement) {
      if (!typeCheckRecipe([factory, replacement])) {
        return injector(map);
      }

      return injector(new Map(map).set(factory, replacement));
    },
    get: get
  };
}

function typeCheckRecipe(recipe) {
  if (!Array.isArray(recipe) || recipe.length < 2) {
    _window.console.error('Error injecting [factory, replacement]', recipe);

    _window.console.error(ERROR_MSG.wrongRecipeType);

    return false;
  }

  var _recipe = (0, _slicedToArray2["default"])(recipe, 2),
      factory = _recipe[0],
      replacement = _recipe[1];

  if (typeof factory !== 'function') {
    _window.console.error('Error injecting factory: ', factory);

    _window.console.error(ERROR_MSG.notFunc);

    return false;
  } else if (typeof replacement !== 'function') {
    _window.console.error('Error injecting replacement for: ', factory);

    _window.console.error(ERROR_MSG.notFunc);

    return false;
  }

  return true;
}

var identity = function identity(state) {
  return state;
}; // Helper to add reducer state to custom component


function withState() {
  var lenses = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var mapStateToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  var actions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (Component) {
    var WrappedComponent = function WrappedComponent(_ref) {
      var state = _ref.state,
          props = (0, _objectWithoutProperties2["default"])(_ref, ["state"]);
      return _react["default"].createElement(_context["default"].Consumer, null, function (context) {
        return _react["default"].createElement(Component, lenses.reduce(function (totalState, lens) {
          return _objectSpread({}, totalState, {}, lens(context.selector(state)));
        }, props));
      });
    };

    return (0, _reactRedux.connect)(function (state) {
      return _objectSpread({}, mapStateToProps(state), {
        state: state
      });
    }, function (dispatch) {
      return Object.keys(actions).reduce(function (accu, key) {
        return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, key, (0, _redux.bindActionCreators)(actions[key], dispatch)));
      }, {});
    })(WrappedComponent);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2luamVjdG9yLmpzIl0sIm5hbWVzIjpbIk1pc3NpbmdDb21wIiwiRVJST1JfTVNHIiwid3JvbmdSZWNpcGVUeXBlIiwibm9EZXAiLCJmYWMiLCJwYXJlbnQiLCJuYW1lIiwibm90RnVuYyIsImluamVjdG9yIiwibWFwIiwiTWFwIiwiY2FjaGUiLCJnZXQiLCJmYWN0b3J5IiwiQ29uc29sZSIsImVycm9yIiwiaW5zdGFuY2VzIiwiZGVwcyIsImRlcCIsInNldCIsInByb3ZpZGUiLCJyZXBsYWNlbWVudCIsInR5cGVDaGVja1JlY2lwZSIsInJlY2lwZSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImlkZW50aXR5Iiwic3RhdGUiLCJ3aXRoU3RhdGUiLCJsZW5zZXMiLCJtYXBTdGF0ZVRvUHJvcHMiLCJhY3Rpb25zIiwiQ29tcG9uZW50IiwiV3JhcHBlZENvbXBvbmVudCIsInByb3BzIiwiY29udGV4dCIsInJlZHVjZSIsInRvdGFsU3RhdGUiLCJsZW5zIiwic2VsZWN0b3IiLCJkaXNwYXRjaCIsIk9iamVjdCIsImtleXMiLCJhY2N1Iiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsV0FBVyxHQUFHLFNBQWRBLFdBQWM7QUFBQSxTQUFNLDRDQUFOO0FBQUEsQ0FBcEI7O0FBRU8sSUFBTUMsU0FBUyxHQUFHO0FBQ3ZCQyxFQUFBQSxlQUFlLEVBQ2IsdUlBRnFCO0FBS3ZCQyxFQUFBQSxLQUFLLEVBQUUsZUFBQ0MsR0FBRCxFQUFNQyxNQUFOO0FBQUEsV0FDTCxVQUFHRCxHQUFHLENBQUNFLElBQVAsNkNBQThDRCxNQUFNLENBQUNDLElBQXJELDZFQURLO0FBQUEsR0FMZ0I7QUFTdkJDLEVBQUFBLE9BQU8sRUFBRTtBQVRjLENBQWxCOzs7QUFZQSxTQUFTQyxRQUFULEdBQW1DO0FBQUEsTUFBakJDLEdBQWlCLHVF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QW5CQSxnQkFBbUI7QUFBQSxVQUFFTixLQUFGLFFBQUVBLEtBQUY7QUFBQSxVQUFZTyxLQUFaO0FBQUEsYUFDdkIsZ0NBQUMsbUJBQUQsQ0FBaUIsUUFBakIsUUFDRyxVQUFBQyxPQUFPO0FBQUEsZUFDTixnQ0FBQyxTQUFELEVBQ01OLE1BQU0sQ0FBQ08sTUFBUCxDQUNGLFVBQUNDLFVBQUQsRUFBYUMsSUFBYjtBQUFBLG1DQUNLRCxVQURMLE1BRUtDLElBQUksQ0FBQ0gsT0FBTyxDQUFDSSxRQUFSLENBQWlCWixLQUFqQixDQUFELENBRlQ7QUFBQSxTQURFLEVBS0ZPLEtBTEUsQ0FETixDQURNO0FBQUEsT0FEVixDQUR1QjtBQUFBLEtBQXpCOztBQWdCQSxXQUFPLHlCQUNMLFVBQUFQLEtBQUs7QUFBQSwrQkFBU0csZUFBZSxDQUFDSCxLQUFELENBQXhCO0FBQWlDQSxRQUFBQSxLQUFLLEVBQUxBO0FBQWpDO0FBQUEsS0FEQSxFQUVMLFVBQUFhLFFBQVE7QUFBQSxhQUNOQyxNQUFNLENBQUNDLElBQVAsQ0FBWVgsT0FBWixFQUFxQkssTUFBckIsQ0FDRSxVQUFDTyxJQUFELEVBQU9DLEdBQVA7QUFBQSxpQ0FDS0QsSUFETCx1Q0FFR0MsR0FGSCxFQUVTLCtCQUFtQmIsT0FBTyxDQUFDYSxHQUFELENBQTFCLEVBQWlDSixRQUFqQyxDQUZUO0FBQUEsT0FERixFQUtFLEVBTEYsQ0FETTtBQUFBLEtBRkgsRUFVTFAsZ0JBVkssQ0FBUDtBQVdELEdBNUJEO0FBNkJEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtiaW5kQWN0aW9uQ3JlYXRvcnN9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBLZXBsZXJHbENvbnRleHQgZnJvbSAnY29tcG9uZW50cy9jb250ZXh0JztcblxuY29uc3QgTWlzc2luZ0NvbXAgPSAoKSA9PiA8ZGl2IC8+O1xuXG5leHBvcnQgY29uc3QgRVJST1JfTVNHID0ge1xuICB3cm9uZ1JlY2lwZVR5cGU6XG4gICAgYGluamVjdENvbXBvbmVudHMgdGFrZXMgYW4gYXJyYXkgb2YgZmFjdG9yaWVzIHJlcGxhY2VtZW50IHBhaXJzIGFzIGlucHV0LCBgICtcbiAgICBgZWFjaCBwYWlyIGJlIGEgYXJyYXkgYXMgW29yaWdpbmFsRmFjdG9yeSwgcmVwbGFjZW1lbnRdLmAsXG5cbiAgbm9EZXA6IChmYWMsIHBhcmVudCkgPT5cbiAgICBgJHtmYWMubmFtZX0gaXMgcmVxdWlyZWQgYXMgYSBkZXBlbmRlbmN5IG9mICR7cGFyZW50Lm5hbWV9LCBgICtcbiAgICBgYnV0IGlzIG5vdCBwcm92aWRlZCB0byBpbmplY3RDb21wb25lbnRzLiBJdCB3aWxsIG5vdCBiZSByZW5kZXJlZC5gLFxuXG4gIG5vdEZ1bmM6ICdmYWN0b3J5IGFuZCBpdHMgcmVwbGFjZW1lbnQgc2hvdWxkIGJlIGEgZnVuY3Rpb24nXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0b3IobWFwID0gbmV3IE1hcCgpKSB7XG4gIGNvbnN0IGNhY2hlID0gbmV3IE1hcCgpOyAvLyBtYXA8ZmFjdG9yeSwgZmFjdG9yeSAtPiA/PlxuICBjb25zdCBnZXQgPSAoZmFjLCBwYXJlbnQpID0+IHtcbiAgICBjb25zdCBmYWN0b3J5ID0gbWFwLmdldChmYWMpO1xuICAgIC8vIGZhY3RvcnkgaXMgbm90IGluamVjdGVkXG4gICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICBDb25zb2xlLmVycm9yKEVSUk9SX01TRy5ub0RlcChmYWMsIHBhcmVudCkpO1xuICAgICAgcmV0dXJuIE1pc3NpbmdDb21wO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGN1c3RvbSBmYWN0b3J5IGRlcHMgaXMgZGVjbGFyZWRcbiAgICBjb25zdCBpbnN0YW5jZXMgPVxuICAgICAgY2FjaGUuZ2V0KGZhY3RvcnkpIHx8XG4gICAgICBmYWN0b3J5KC4uLihmYWN0b3J5LmRlcHMgPyBmYWN0b3J5LmRlcHMubWFwKGRlcCA9PiBnZXQoZGVwLCBmYWN0b3J5KSkgOiBbXSkpO1xuXG4gICAgY2FjaGUuc2V0KGZhYywgaW5zdGFuY2VzKTtcbiAgICByZXR1cm4gaW5zdGFuY2VzO1xuICB9O1xuXG4gIC8vIGlmIHlvdSBoYXZlIHR3byBmdW5jdGlvbnMgdGhhdCBoYXBwZW4gdG8gaGF2ZSB0aGUgZXhhY3RseSBzYW1lIHRleHRcbiAgLy8gaXQgd2lsbCBiZSBvdmVycmlkZTogMjAxOC0wMi0wNVxuICByZXR1cm4ge1xuICAgIHByb3ZpZGU6IChmYWN0b3J5LCByZXBsYWNlbWVudCkgPT4ge1xuICAgICAgaWYgKCF0eXBlQ2hlY2tSZWNpcGUoW2ZhY3RvcnksIHJlcGxhY2VtZW50XSkpIHtcbiAgICAgICAgcmV0dXJuIGluamVjdG9yKG1hcCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5qZWN0b3IobmV3IE1hcChtYXApLnNldChmYWN0b3J5LCByZXBsYWNlbWVudCkpO1xuICAgIH0sXG4gICAgZ2V0XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlQ2hlY2tSZWNpcGUocmVjaXBlKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShyZWNpcGUpIHx8IHJlY2lwZS5sZW5ndGggPCAyKSB7XG4gICAgQ29uc29sZS5lcnJvcignRXJyb3IgaW5qZWN0aW5nIFtmYWN0b3J5LCByZXBsYWNlbWVudF0nLCByZWNpcGUpO1xuICAgIENvbnNvbGUuZXJyb3IoRVJST1JfTVNHLndyb25nUmVjaXBlVHlwZSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgW2ZhY3RvcnksIHJlcGxhY2VtZW50XSA9IHJlY2lwZTtcbiAgaWYgKHR5cGVvZiBmYWN0b3J5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgQ29uc29sZS5lcnJvcignRXJyb3IgaW5qZWN0aW5nIGZhY3Rvcnk6ICcsIGZhY3RvcnkpO1xuICAgIENvbnNvbGUuZXJyb3IoRVJST1JfTVNHLm5vdEZ1bmMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcmVwbGFjZW1lbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICBDb25zb2xlLmVycm9yKCdFcnJvciBpbmplY3RpbmcgcmVwbGFjZW1lbnQgZm9yOiAnLCBmYWN0b3J5KTtcbiAgICBDb25zb2xlLmVycm9yKEVSUk9SX01TRy5ub3RGdW5jKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuY29uc3QgaWRlbnRpdHkgPSBzdGF0ZSA9PiBzdGF0ZTtcbi8vIEhlbHBlciB0byBhZGQgcmVkdWNlciBzdGF0ZSB0byBjdXN0b20gY29tcG9uZW50XG5leHBvcnQgZnVuY3Rpb24gd2l0aFN0YXRlKGxlbnNlcyA9IFtdLCBtYXBTdGF0ZVRvUHJvcHMgPSBpZGVudGl0eSwgYWN0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBDb21wb25lbnQgPT4ge1xuICAgIGNvbnN0IFdyYXBwZWRDb21wb25lbnQgPSAoe3N0YXRlLCAuLi5wcm9wc30pID0+IChcbiAgICAgIDxLZXBsZXJHbENvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgIHtjb250ZXh0ID0+IChcbiAgICAgICAgICA8Q29tcG9uZW50XG4gICAgICAgICAgICB7Li4ubGVuc2VzLnJlZHVjZShcbiAgICAgICAgICAgICAgKHRvdGFsU3RhdGUsIGxlbnMpID0+ICh7XG4gICAgICAgICAgICAgICAgLi4udG90YWxTdGF0ZSxcbiAgICAgICAgICAgICAgICAuLi5sZW5zKGNvbnRleHQuc2VsZWN0b3Ioc3RhdGUpKVxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgcHJvcHNcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvS2VwbGVyR2xDb250ZXh0LkNvbnN1bWVyPlxuICAgICk7XG5cbiAgICByZXR1cm4gY29ubmVjdChcbiAgICAgIHN0YXRlID0+ICh7Li4ubWFwU3RhdGVUb1Byb3BzKHN0YXRlKSwgc3RhdGV9KSxcbiAgICAgIGRpc3BhdGNoID0+XG4gICAgICAgIE9iamVjdC5rZXlzKGFjdGlvbnMpLnJlZHVjZShcbiAgICAgICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgICAgIFtrZXldOiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uc1trZXldLCBkaXNwYXRjaClcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB7fVxuICAgICAgICApXG4gICAgKShXcmFwcGVkQ29tcG9uZW50KTtcbiAgfTtcbn1cbiJdfQ==