"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injector = injector;
exports.flattenDeps = flattenDeps;
exports.provideRecipesToInjector = provideRecipesToInjector;
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
  return /*#__PURE__*/_react["default"].createElement("div", null);
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
} // entryPoint


function flattenDeps(allDeps, factory) {
  var addToDeps = allDeps.concat([factory]);
  return Array.isArray(factory.deps) && factory.deps.length ? factory.deps.reduce(function (accu, dep) {
    return flattenDeps(accu, dep);
  }, addToDeps) : addToDeps;
}

function provideRecipesToInjector(recipes, appInjector) {
  var provided = new Map();
  return recipes.reduce(function (inj, recipe) {
    var _inj;

    if (!typeCheckRecipe(recipe)) {
      return inj;
    } // collect dependencies of custom factories, if there is any.
    // Add them to the appInjector


    var customDependencies = flattenDeps([], recipe[1]);
    inj = customDependencies.reduce(function (ij, factory) {
      if (provided.get(factory)) {
        _window.console.warn("".concat(factory.name, " already injected from ").concat(provided.get(factory).name, ", injecting ").concat(recipe[0].name, " after ").concat(provided.get(factory).name, " will override it"));
      }

      return ij.provide(factory, factory);
    }, inj);
    provided.set(recipe[0], recipe[1]);
    return (_inj = inj).provide.apply(_inj, (0, _toConsumableArray2["default"])(recipe));
  }, appInjector);
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
      return /*#__PURE__*/_react["default"].createElement(_context["default"].Consumer, null, function (context) {
        return /*#__PURE__*/_react["default"].createElement(Component, lenses.reduce(function (totalState, lens) {
          return _objectSpread(_objectSpread({}, totalState), lens(context.selector(state)));
        }, props));
      });
    };

    return (0, _reactRedux.connect)(function (state) {
      return _objectSpread(_objectSpread({}, mapStateToProps(state)), {}, {
        state: state
      });
    }, function (dispatch) {
      return Object.keys(actions).reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, key, (0, _redux.bindActionCreators)(actions[key], dispatch)));
      }, {});
    })(WrappedComponent);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2luamVjdG9yLmpzIl0sIm5hbWVzIjpbIk1pc3NpbmdDb21wIiwiRVJST1JfTVNHIiwid3JvbmdSZWNpcGVUeXBlIiwibm9EZXAiLCJmYWMiLCJwYXJlbnQiLCJuYW1lIiwibm90RnVuYyIsImluamVjdG9yIiwibWFwIiwiTWFwIiwiY2FjaGUiLCJnZXQiLCJmYWN0b3J5IiwiQ29uc29sZSIsImVycm9yIiwiaW5zdGFuY2VzIiwiZGVwcyIsImRlcCIsInNldCIsInByb3ZpZGUiLCJyZXBsYWNlbWVudCIsInR5cGVDaGVja1JlY2lwZSIsImZsYXR0ZW5EZXBzIiwiYWxsRGVwcyIsImFkZFRvRGVwcyIsImNvbmNhdCIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsInJlZHVjZSIsImFjY3UiLCJwcm92aWRlUmVjaXBlc1RvSW5qZWN0b3IiLCJyZWNpcGVzIiwiYXBwSW5qZWN0b3IiLCJwcm92aWRlZCIsImluaiIsInJlY2lwZSIsImN1c3RvbURlcGVuZGVuY2llcyIsImlqIiwid2FybiIsImlkZW50aXR5Iiwic3RhdGUiLCJ3aXRoU3RhdGUiLCJsZW5zZXMiLCJtYXBTdGF0ZVRvUHJvcHMiLCJhY3Rpb25zIiwiQ29tcG9uZW50IiwiV3JhcHBlZENvbXBvbmVudCIsInByb3BzIiwiY29udGV4dCIsInRvdGFsU3RhdGUiLCJsZW5zIiwic2VsZWN0b3IiLCJkaXNwYXRjaCIsIk9iamVjdCIsImtleXMiLCJrZXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFdBQVcsR0FBRyxTQUFkQSxXQUFjO0FBQUEsc0JBQU0sNENBQU47QUFBQSxDQUFwQjs7QUFFTyxJQUFNQyxTQUFTLEdBQUc7QUFDdkJDLEVBQUFBLGVBQWUsRUFDYix1SUFGcUI7QUFLdkJDLEVBQUFBLEtBQUssRUFBRSxlQUFDQyxHQUFELEVBQU1DLE1BQU47QUFB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O0FBQUEsS0FEQSxFQUVMLFVBQUFZLFFBQVE7QUFBQSxhQUNOQyxNQUFNLENBQUNDLElBQVAsQ0FBWVYsT0FBWixFQUFxQmhCLE1BQXJCLENBQ0UsVUFBQ0MsSUFBRCxFQUFPMEIsR0FBUDtBQUFBLCtDQUNLMUIsSUFETCw0Q0FFRzBCLEdBRkgsRUFFUywrQkFBbUJYLE9BQU8sQ0FBQ1csR0FBRCxDQUExQixFQUFpQ0gsUUFBakMsQ0FGVDtBQUFBLE9BREYsRUFLRSxFQUxGLENBRE07QUFBQSxLQUZILEVBVUxOLGdCQVZLLENBQVA7QUFXRCxHQTVCRDtBQTZCRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7YmluZEFjdGlvbkNyZWF0b3JzfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgS2VwbGVyR2xDb250ZXh0IGZyb20gJ2NvbXBvbmVudHMvY29udGV4dCc7XG5cbmNvbnN0IE1pc3NpbmdDb21wID0gKCkgPT4gPGRpdiAvPjtcblxuZXhwb3J0IGNvbnN0IEVSUk9SX01TRyA9IHtcbiAgd3JvbmdSZWNpcGVUeXBlOlxuICAgIGBpbmplY3RDb21wb25lbnRzIHRha2VzIGFuIGFycmF5IG9mIGZhY3RvcmllcyByZXBsYWNlbWVudCBwYWlycyBhcyBpbnB1dCwgYCArXG4gICAgYGVhY2ggcGFpciBiZSBhIGFycmF5IGFzIFtvcmlnaW5hbEZhY3RvcnksIHJlcGxhY2VtZW50XS5gLFxuXG4gIG5vRGVwOiAoZmFjLCBwYXJlbnQpID0+XG4gICAgYCR7ZmFjLm5hbWV9IGlzIHJlcXVpcmVkIGFzIGEgZGVwZW5kZW5jeSBvZiAke3BhcmVudC5uYW1lfSwgYCArXG4gICAgYGJ1dCBpcyBub3QgcHJvdmlkZWQgdG8gaW5qZWN0Q29tcG9uZW50cy4gSXQgd2lsbCBub3QgYmUgcmVuZGVyZWQuYCxcblxuICBub3RGdW5jOiAnZmFjdG9yeSBhbmQgaXRzIHJlcGxhY2VtZW50IHNob3VsZCBiZSBhIGZ1bmN0aW9uJ1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdG9yKG1hcCA9IG5ldyBNYXAoKSkge1xuICBjb25zdCBjYWNoZSA9IG5ldyBNYXAoKTsgLy8gbWFwPGZhY3RvcnksIGZhY3RvcnkgLT4gPz5cbiAgY29uc3QgZ2V0ID0gKGZhYywgcGFyZW50KSA9PiB7XG4gICAgY29uc3QgZmFjdG9yeSA9IG1hcC5nZXQoZmFjKTtcbiAgICAvLyBmYWN0b3J5IGlzIG5vdCBpbmplY3RlZFxuICAgIGlmICghZmFjdG9yeSkge1xuICAgICAgQ29uc29sZS5lcnJvcihFUlJPUl9NU0cubm9EZXAoZmFjLCBwYXJlbnQpKTtcbiAgICAgIHJldHVybiBNaXNzaW5nQ29tcDtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBjdXN0b20gZmFjdG9yeSBkZXBzIGlzIGRlY2xhcmVkXG4gICAgY29uc3QgaW5zdGFuY2VzID1cbiAgICAgIGNhY2hlLmdldChmYWN0b3J5KSB8fFxuICAgICAgZmFjdG9yeSguLi4oZmFjdG9yeS5kZXBzID8gZmFjdG9yeS5kZXBzLm1hcChkZXAgPT4gZ2V0KGRlcCwgZmFjdG9yeSkpIDogW10pKTtcblxuICAgIGNhY2hlLnNldChmYWMsIGluc3RhbmNlcyk7XG4gICAgcmV0dXJuIGluc3RhbmNlcztcbiAgfTtcblxuICAvLyBpZiB5b3UgaGF2ZSB0d28gZnVuY3Rpb25zIHRoYXQgaGFwcGVuIHRvIGhhdmUgdGhlIGV4YWN0bHkgc2FtZSB0ZXh0XG4gIC8vIGl0IHdpbGwgYmUgb3ZlcnJpZGU6IDIwMTgtMDItMDVcbiAgcmV0dXJuIHtcbiAgICBwcm92aWRlOiAoZmFjdG9yeSwgcmVwbGFjZW1lbnQpID0+IHtcbiAgICAgIGlmICghdHlwZUNoZWNrUmVjaXBlKFtmYWN0b3J5LCByZXBsYWNlbWVudF0pKSB7XG4gICAgICAgIHJldHVybiBpbmplY3RvcihtYXApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGluamVjdG9yKG5ldyBNYXAobWFwKS5zZXQoZmFjdG9yeSwgcmVwbGFjZW1lbnQpKTtcbiAgICB9LFxuICAgIGdldFxuICB9O1xufVxuXG4vLyBlbnRyeVBvaW50XG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkRlcHMoYWxsRGVwcywgZmFjdG9yeSkge1xuICBjb25zdCBhZGRUb0RlcHMgPSBhbGxEZXBzLmNvbmNhdChbZmFjdG9yeV0pO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShmYWN0b3J5LmRlcHMpICYmIGZhY3RvcnkuZGVwcy5sZW5ndGhcbiAgICA/IGZhY3RvcnkuZGVwcy5yZWR1Y2UoKGFjY3UsIGRlcCkgPT4gZmxhdHRlbkRlcHMoYWNjdSwgZGVwKSwgYWRkVG9EZXBzKVxuICAgIDogYWRkVG9EZXBzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZVJlY2lwZXNUb0luamVjdG9yKHJlY2lwZXMsIGFwcEluamVjdG9yKSB7XG4gIGNvbnN0IHByb3ZpZGVkID0gbmV3IE1hcCgpO1xuXG4gIHJldHVybiByZWNpcGVzLnJlZHVjZSgoaW5qLCByZWNpcGUpID0+IHtcbiAgICBpZiAoIXR5cGVDaGVja1JlY2lwZShyZWNpcGUpKSB7XG4gICAgICByZXR1cm4gaW5qO1xuICAgIH1cblxuICAgIC8vIGNvbGxlY3QgZGVwZW5kZW5jaWVzIG9mIGN1c3RvbSBmYWN0b3JpZXMsIGlmIHRoZXJlIGlzIGFueS5cbiAgICAvLyBBZGQgdGhlbSB0byB0aGUgYXBwSW5qZWN0b3JcbiAgICBjb25zdCBjdXN0b21EZXBlbmRlbmNpZXMgPSBmbGF0dGVuRGVwcyhbXSwgcmVjaXBlWzFdKTtcbiAgICBpbmogPSBjdXN0b21EZXBlbmRlbmNpZXMucmVkdWNlKChpaiwgZmFjdG9yeSkgPT4ge1xuICAgICAgaWYgKHByb3ZpZGVkLmdldChmYWN0b3J5KSkge1xuICAgICAgICBDb25zb2xlLndhcm4oXG4gICAgICAgICAgYCR7ZmFjdG9yeS5uYW1lfSBhbHJlYWR5IGluamVjdGVkIGZyb20gJHtwcm92aWRlZC5nZXQoZmFjdG9yeSkubmFtZX0sIGluamVjdGluZyAke1xuICAgICAgICAgICAgcmVjaXBlWzBdLm5hbWVcbiAgICAgICAgICB9IGFmdGVyICR7cHJvdmlkZWQuZ2V0KGZhY3RvcnkpLm5hbWV9IHdpbGwgb3ZlcnJpZGUgaXRgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWoucHJvdmlkZShmYWN0b3J5LCBmYWN0b3J5KTtcbiAgICB9LCBpbmopO1xuXG4gICAgcHJvdmlkZWQuc2V0KHJlY2lwZVswXSwgcmVjaXBlWzFdKTtcbiAgICByZXR1cm4gaW5qLnByb3ZpZGUoLi4ucmVjaXBlKTtcbiAgfSwgYXBwSW5qZWN0b3IpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZUNoZWNrUmVjaXBlKHJlY2lwZSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkocmVjaXBlKSB8fCByZWNpcGUubGVuZ3RoIDwgMikge1xuICAgIENvbnNvbGUuZXJyb3IoJ0Vycm9yIGluamVjdGluZyBbZmFjdG9yeSwgcmVwbGFjZW1lbnRdJywgcmVjaXBlKTtcbiAgICBDb25zb2xlLmVycm9yKEVSUk9SX01TRy53cm9uZ1JlY2lwZVR5cGUpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IFtmYWN0b3J5LCByZXBsYWNlbWVudF0gPSByZWNpcGU7XG4gIGlmICh0eXBlb2YgZmFjdG9yeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIENvbnNvbGUuZXJyb3IoJ0Vycm9yIGluamVjdGluZyBmYWN0b3J5OiAnLCBmYWN0b3J5KTtcbiAgICBDb25zb2xlLmVycm9yKEVSUk9SX01TRy5ub3RGdW5jKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHJlcGxhY2VtZW50ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgQ29uc29sZS5lcnJvcignRXJyb3IgaW5qZWN0aW5nIHJlcGxhY2VtZW50IGZvcjogJywgZmFjdG9yeSk7XG4gICAgQ29uc29sZS5lcnJvcihFUlJPUl9NU0cubm90RnVuYyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmNvbnN0IGlkZW50aXR5ID0gc3RhdGUgPT4gc3RhdGU7XG4vLyBIZWxwZXIgdG8gYWRkIHJlZHVjZXIgc3RhdGUgdG8gY3VzdG9tIGNvbXBvbmVudFxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhTdGF0ZShsZW5zZXMgPSBbXSwgbWFwU3RhdGVUb1Byb3BzID0gaWRlbnRpdHksIGFjdGlvbnMgPSB7fSkge1xuICByZXR1cm4gQ29tcG9uZW50ID0+IHtcbiAgICBjb25zdCBXcmFwcGVkQ29tcG9uZW50ID0gKHtzdGF0ZSwgLi4ucHJvcHN9KSA9PiAoXG4gICAgICA8S2VwbGVyR2xDb250ZXh0LkNvbnN1bWVyPlxuICAgICAgICB7Y29udGV4dCA9PiAoXG4gICAgICAgICAgPENvbXBvbmVudFxuICAgICAgICAgICAgey4uLmxlbnNlcy5yZWR1Y2UoXG4gICAgICAgICAgICAgICh0b3RhbFN0YXRlLCBsZW5zKSA9PiAoe1xuICAgICAgICAgICAgICAgIC4uLnRvdGFsU3RhdGUsXG4gICAgICAgICAgICAgICAgLi4ubGVucyhjb250ZXh0LnNlbGVjdG9yKHN0YXRlKSlcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIHByb3BzXG4gICAgICAgICAgICApfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L0tlcGxlckdsQ29udGV4dC5Db25zdW1lcj5cbiAgICApO1xuXG4gICAgcmV0dXJuIGNvbm5lY3QoXG4gICAgICBzdGF0ZSA9PiAoey4uLm1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSksIHN0YXRlfSksXG4gICAgICBkaXNwYXRjaCA9PlxuICAgICAgICBPYmplY3Qua2V5cyhhY3Rpb25zKS5yZWR1Y2UoXG4gICAgICAgICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICBba2V5XTogYmluZEFjdGlvbkNyZWF0b3JzKGFjdGlvbnNba2V5XSwgZGlzcGF0Y2gpXG4gICAgICAgICAgfSksXG4gICAgICAgICAge31cbiAgICAgICAgKVxuICAgICkoV3JhcHBlZENvbXBvbmVudCk7XG4gIH07XG59XG4iXX0=