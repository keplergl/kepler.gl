"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContainerFactory = ContainerFactory;
exports.injectComponents = injectComponents;
exports["default"] = exports.appInjector = exports.ERROR_MSG = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _lodash = _interopRequireDefault(require("lodash.memoize"));

var _window = require("global/window");

var _injector = require("./injector");

var _keplerGl = _interopRequireDefault(require("./kepler-gl"));

var _actionWrapper = require("../actions/action-wrapper");

var _identityActions = require("../actions/identity-actions");

var _dataUtils = require("../utils/data-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ERROR_MSG = {
  noState: "kepler.gl state does not exist. " + "You might forget to mount keplerGlReducer in your root reducer." + "If it is not mounted as state.keplerGl by default, you need to provide getState as a prop"
};
exports.ERROR_MSG = ERROR_MSG;
ContainerFactory.deps = [_keplerGl["default"]];

function ContainerFactory(KeplerGl) {
  /** @lends KeplerGl */

  /**
    * Main Kepler.gl Component
    * @param {Object} props
    *
    * @param {string} props.id - _required_
    *
    * - Default: `map`
    * The id of this KeplerGl instance. `id` is required if you have multiple
    * KeplerGl instances in your app. It defines the prop name of the KeplerGl state that is
    * stored in the KeplerGl reducer. For example, the state of the KeplerGl component with id `foo` is
    * stored in `state.keplerGl.foo`.
    *
    * In case you create multiple kepler.gl instances using the same id, the kepler.gl state defined by the entry will be
    * overridden by the latest instance and reset to a blank state.
    * @param {string} props.mapboxApiAccessToken - _required_
    * @param {string} props.mapboxApiUrl - _optional_
    * @param {Boolean} props.mapStylesReplaceDefault - _optional_
    * @param {object} props.initialUiState - _optional_
     * You can create a free account at [www.mapbox.com](www.mapbox.com) and create a token at
    * [www.mapbox.com/account/access-tokens](www.mapbox.com/account/access-tokens)
    *
    *
    * @param {Number} props.width - _required_ Width of the KeplerGl UI.
    * @public
   */
  var Container = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(Container, _Component);

    var _super = _createSuper(Container);

    // default id and address if not provided
    function Container(props, ctx) {
      var _this;

      (0, _classCallCheck2["default"])(this, Container);
      _this = _super.call(this, props, ctx);
      _this.getSelector = (0, _lodash["default"])(function (id, getState) {
        return function (state) {
          if (!getState(state)) {
            // log error
            _window.console.error(ERROR_MSG.noState);

            return null;
          }

          return getState(state)[id];
        };
      });
      _this.getDispatch = (0, _lodash["default"])(function (id, dispatch) {
        return (0, _actionWrapper.forwardTo)(id, dispatch);
      });
      return _this;
    }

    (0, _createClass2["default"])(Container, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this$props = this.props,
            id = _this$props.id,
            mint = _this$props.mint,
            mapboxApiAccessToken = _this$props.mapboxApiAccessToken,
            mapboxApiUrl = _this$props.mapboxApiUrl,
            mapStylesReplaceDefault = _this$props.mapStylesReplaceDefault,
            initialUiState = _this$props.initialUiState; // add a new entry to reducer

        this.props.dispatch((0, _identityActions.registerEntry)({
          id: id,
          mint: mint,
          mapboxApiAccessToken: mapboxApiAccessToken,
          mapboxApiUrl: mapboxApiUrl,
          mapStylesReplaceDefault: mapStylesReplaceDefault,
          initialUiState: initialUiState
        }));
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        // check if id has changed, if true, copy state over
        if ((0, _dataUtils.notNullorUndefined)(prevProps.id) && (0, _dataUtils.notNullorUndefined)(this.props.id) && prevProps.id !== this.props.id) {
          this.props.dispatch((0, _identityActions.renameEntry)(prevProps.id, this.props.id));
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.props.mint !== false) {
          // delete entry in reducer
          this.props.dispatch((0, _identityActions.deleteEntry)(this.props.id));
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            id = _this$props2.id,
            getState = _this$props2.getState,
            dispatch = _this$props2.dispatch,
            state = _this$props2.state;
        var selector = this.getSelector(id, getState);

        if (!selector || !selector(state)) {
          // instance state hasn't been mounted yet
          return /*#__PURE__*/_react["default"].createElement("div", null);
        }

        return /*#__PURE__*/_react["default"].createElement(KeplerGl, (0, _extends2["default"])({}, this.props, {
          id: id,
          selector: selector,
          dispatch: this.getDispatch(id, dispatch)
        }));
      }
    }]);
    return Container;
  }(_react.Component);

  (0, _defineProperty2["default"])(Container, "defaultProps", {
    id: 'map',
    getState: function getState(state) {
      return state.keplerGl;
    },
    mint: true
  });

  var mapStateToProps = function mapStateToProps(state, props) {
    return _objectSpread({
      state: state
    }, props);
  };

  var dispatchToProps = function dispatchToProps(dispatch) {
    return {
      dispatch: dispatch
    };
  };

  return (0, _reactRedux.connect)(mapStateToProps, dispatchToProps)(Container);
}

var allDependencies = (0, _injector.flattenDeps)([], ContainerFactory); // provide all dependencies to appInjector

var appInjector = allDependencies.reduce(function (inj, factory) {
  return inj.provide(factory, factory);
}, (0, _injector.injector)()); // Helper to inject custom components and return kepler.gl container

exports.appInjector = appInjector;

function injectComponents() {
  var recipes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (0, _injector.provideRecipesToInjector)(recipes, appInjector).get(ContainerFactory);
}

var InjectedContainer = appInjector.get(ContainerFactory);
var _default = InjectedContainer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2NvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJFUlJPUl9NU0ciLCJub1N0YXRlIiwiQ29udGFpbmVyRmFjdG9yeSIsImRlcHMiLCJLZXBsZXJHbEZhY3RvcnkiLCJLZXBsZXJHbCIsIkNvbnRhaW5lciIsInByb3BzIiwiY3R4IiwiZ2V0U2VsZWN0b3IiLCJpZCIsImdldFN0YXRlIiwic3RhdGUiLCJDb25zb2xlIiwiZXJyb3IiLCJnZXREaXNwYXRjaCIsImRpc3BhdGNoIiwibWludCIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwibWFwYm94QXBpVXJsIiwibWFwU3R5bGVzUmVwbGFjZURlZmF1bHQiLCJpbml0aWFsVWlTdGF0ZSIsInByZXZQcm9wcyIsInNlbGVjdG9yIiwiQ29tcG9uZW50Iiwia2VwbGVyR2wiLCJtYXBTdGF0ZVRvUHJvcHMiLCJkaXNwYXRjaFRvUHJvcHMiLCJhbGxEZXBlbmRlbmNpZXMiLCJhcHBJbmplY3RvciIsInJlZHVjZSIsImluaiIsImZhY3RvcnkiLCJwcm92aWRlIiwiaW5qZWN0Q29tcG9uZW50cyIsInJlY2lwZXMiLCJnZXQiLCJJbmplY3RlZENvbnRhaW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sSUFBTUEsU0FBUyxHQUFHO0FBQ3ZCQyxFQUFBQSxPQUFPLEVBQ0w7QUFGcUIsQ0FBbEI7O0FBT1BDLGdCQUFnQixDQUFDQyxJQUFqQixHQUF3QixDQUFDQyxvQkFBRCxDQUF4Qjs7QUFFTyxTQUFTRixnQkFBVCxDQUEwQkcsUUFBMUIsRUFBb0M7QUFDekM7O0FBQ0E7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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STtBQUM3QyxTQUFPLHdDQUF5QkEsT0FBekIsRUFBa0NOLFdBQWxDLEVBQStDTyxHQUEvQyxDQUFtRGxDLGdCQUFuRCxDQUFQO0FBQ0Q7O0FBRUQsSUFBTW1DLGlCQUFpQixHQUFHUixXQUFXLENBQUNPLEdBQVosQ0FBZ0JsQyxnQkFBaEIsQ0FBMUI7ZUFFZW1DLGlCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7aW5qZWN0b3IsIHByb3ZpZGVSZWNpcGVzVG9JbmplY3RvciwgZmxhdHRlbkRlcHN9IGZyb20gJy4vaW5qZWN0b3InO1xuaW1wb3J0IEtlcGxlckdsRmFjdG9yeSBmcm9tICcuL2tlcGxlci1nbCc7XG5pbXBvcnQge2ZvcndhcmRUb30gZnJvbSAnYWN0aW9ucy9hY3Rpb24td3JhcHBlcic7XG5cbmltcG9ydCB7cmVnaXN0ZXJFbnRyeSwgZGVsZXRlRW50cnksIHJlbmFtZUVudHJ5fSBmcm9tICdhY3Rpb25zL2lkZW50aXR5LWFjdGlvbnMnO1xuaW1wb3J0IHtub3ROdWxsb3JVbmRlZmluZWR9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgRVJST1JfTVNHID0ge1xuICBub1N0YXRlOlxuICAgIGBrZXBsZXIuZ2wgc3RhdGUgZG9lcyBub3QgZXhpc3QuIGAgK1xuICAgIGBZb3UgbWlnaHQgZm9yZ2V0IHRvIG1vdW50IGtlcGxlckdsUmVkdWNlciBpbiB5b3VyIHJvb3QgcmVkdWNlci5gICtcbiAgICBgSWYgaXQgaXMgbm90IG1vdW50ZWQgYXMgc3RhdGUua2VwbGVyR2wgYnkgZGVmYXVsdCwgeW91IG5lZWQgdG8gcHJvdmlkZSBnZXRTdGF0ZSBhcyBhIHByb3BgXG59O1xuXG5Db250YWluZXJGYWN0b3J5LmRlcHMgPSBbS2VwbGVyR2xGYWN0b3J5XTtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbnRhaW5lckZhY3RvcnkoS2VwbGVyR2wpIHtcbiAgLyoqIEBsZW5kcyBLZXBsZXJHbCAqL1xuICAvKipcbiAgICAqIE1haW4gS2VwbGVyLmdsIENvbXBvbmVudFxuICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzXG4gICAgKlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BzLmlkIC0gX3JlcXVpcmVkX1xuICAgICpcbiAgICAqIC0gRGVmYXVsdDogYG1hcGBcbiAgICAqIFRoZSBpZCBvZiB0aGlzIEtlcGxlckdsIGluc3RhbmNlLiBgaWRgIGlzIHJlcXVpcmVkIGlmIHlvdSBoYXZlIG11bHRpcGxlXG4gICAgKiBLZXBsZXJHbCBpbnN0YW5jZXMgaW4geW91ciBhcHAuIEl0IGRlZmluZXMgdGhlIHByb3AgbmFtZSBvZiB0aGUgS2VwbGVyR2wgc3RhdGUgdGhhdCBpc1xuICAgICogc3RvcmVkIGluIHRoZSBLZXBsZXJHbCByZWR1Y2VyLiBGb3IgZXhhbXBsZSwgdGhlIHN0YXRlIG9mIHRoZSBLZXBsZXJHbCBjb21wb25lbnQgd2l0aCBpZCBgZm9vYCBpc1xuICAgICogc3RvcmVkIGluIGBzdGF0ZS5rZXBsZXJHbC5mb29gLlxuICAgICpcbiAgICAqIEluIGNhc2UgeW91IGNyZWF0ZSBtdWx0aXBsZSBrZXBsZXIuZ2wgaW5zdGFuY2VzIHVzaW5nIHRoZSBzYW1lIGlkLCB0aGUga2VwbGVyLmdsIHN0YXRlIGRlZmluZWQgYnkgdGhlIGVudHJ5IHdpbGwgYmVcbiAgICAqIG92ZXJyaWRkZW4gYnkgdGhlIGxhdGVzdCBpbnN0YW5jZSBhbmQgcmVzZXQgdG8gYSBibGFuayBzdGF0ZS5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wcy5tYXBib3hBcGlBY2Nlc3NUb2tlbiAtIF9yZXF1aXJlZF9cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wcy5tYXBib3hBcGlVcmwgLSBfb3B0aW9uYWxfXG4gICAgKiBAcGFyYW0ge0Jvb2xlYW59IHByb3BzLm1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0IC0gX29wdGlvbmFsX1xuICAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzLmluaXRpYWxVaVN0YXRlIC0gX29wdGlvbmFsX1xuXG4gICAgKiBZb3UgY2FuIGNyZWF0ZSBhIGZyZWUgYWNjb3VudCBhdCBbd3d3Lm1hcGJveC5jb21dKHd3dy5tYXBib3guY29tKSBhbmQgY3JlYXRlIGEgdG9rZW4gYXRcbiAgICAqIFt3d3cubWFwYm94LmNvbS9hY2NvdW50L2FjY2Vzcy10b2tlbnNdKHd3dy5tYXBib3guY29tL2FjY291bnQvYWNjZXNzLXRva2VucylcbiAgICAqXG4gICAgKlxuICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb3BzLndpZHRoIC0gX3JlcXVpcmVkXyBXaWR0aCBvZiB0aGUgS2VwbGVyR2wgVUkuXG4gICAgKiBAcHVibGljXG4gICAqL1xuICBjbGFzcyBDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vIGRlZmF1bHQgaWQgYW5kIGFkZHJlc3MgaWYgbm90IHByb3ZpZGVkXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIGlkOiAnbWFwJyxcbiAgICAgIGdldFN0YXRlOiBzdGF0ZSA9PiBzdGF0ZS5rZXBsZXJHbCxcbiAgICAgIG1pbnQ6IHRydWVcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGN0eCkge1xuICAgICAgc3VwZXIocHJvcHMsIGN0eCk7XG5cbiAgICAgIHRoaXMuZ2V0U2VsZWN0b3IgPSBtZW1vaXplKChpZCwgZ2V0U3RhdGUpID0+IHN0YXRlID0+IHtcbiAgICAgICAgaWYgKCFnZXRTdGF0ZShzdGF0ZSkpIHtcbiAgICAgICAgICAvLyBsb2cgZXJyb3JcbiAgICAgICAgICBDb25zb2xlLmVycm9yKEVSUk9SX01TRy5ub1N0YXRlKTtcblxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRTdGF0ZShzdGF0ZSlbaWRdO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldERpc3BhdGNoID0gbWVtb2l6ZSgoaWQsIGRpc3BhdGNoKSA9PiBmb3J3YXJkVG8oaWQsIGRpc3BhdGNoKSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGlkLFxuICAgICAgICBtaW50LFxuICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgICAgbWFwYm94QXBpVXJsLFxuICAgICAgICBtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdCxcbiAgICAgICAgaW5pdGlhbFVpU3RhdGVcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAvLyBhZGQgYSBuZXcgZW50cnkgdG8gcmVkdWNlclxuICAgICAgdGhpcy5wcm9wcy5kaXNwYXRjaChcbiAgICAgICAgcmVnaXN0ZXJFbnRyeSh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgbWludCxcbiAgICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgICAgICBtYXBib3hBcGlVcmwsXG4gICAgICAgICAgbWFwU3R5bGVzUmVwbGFjZURlZmF1bHQsXG4gICAgICAgICAgaW5pdGlhbFVpU3RhdGVcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgICAgLy8gY2hlY2sgaWYgaWQgaGFzIGNoYW5nZWQsIGlmIHRydWUsIGNvcHkgc3RhdGUgb3ZlclxuICAgICAgaWYgKFxuICAgICAgICBub3ROdWxsb3JVbmRlZmluZWQocHJldlByb3BzLmlkKSAmJlxuICAgICAgICBub3ROdWxsb3JVbmRlZmluZWQodGhpcy5wcm9wcy5pZCkgJiZcbiAgICAgICAgcHJldlByb3BzLmlkICE9PSB0aGlzLnByb3BzLmlkXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5wcm9wcy5kaXNwYXRjaChyZW5hbWVFbnRyeShwcmV2UHJvcHMuaWQsIHRoaXMucHJvcHMuaWQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLm1pbnQgIT09IGZhbHNlKSB7XG4gICAgICAgIC8vIGRlbGV0ZSBlbnRyeSBpbiByZWR1Y2VyXG4gICAgICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goZGVsZXRlRW50cnkodGhpcy5wcm9wcy5pZCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtpZCwgZ2V0U3RhdGUsIGRpc3BhdGNoLCBzdGF0ZX0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSB0aGlzLmdldFNlbGVjdG9yKGlkLCBnZXRTdGF0ZSk7XG5cbiAgICAgIGlmICghc2VsZWN0b3IgfHwgIXNlbGVjdG9yKHN0YXRlKSkge1xuICAgICAgICAvLyBpbnN0YW5jZSBzdGF0ZSBoYXNuJ3QgYmVlbiBtb3VudGVkIHlldFxuICAgICAgICByZXR1cm4gPGRpdiAvPjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEtlcGxlckdsXG4gICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgaWQ9e2lkfVxuICAgICAgICAgIHNlbGVjdG9yPXtzZWxlY3Rvcn1cbiAgICAgICAgICBkaXNwYXRjaD17dGhpcy5nZXREaXNwYXRjaChpZCwgZGlzcGF0Y2gpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoc3RhdGUsIHByb3BzKSA9PiAoe3N0YXRlLCAuLi5wcm9wc30pO1xuICBjb25zdCBkaXNwYXRjaFRvUHJvcHMgPSBkaXNwYXRjaCA9PiAoe2Rpc3BhdGNofSk7XG4gIHJldHVybiBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgZGlzcGF0Y2hUb1Byb3BzKShDb250YWluZXIpO1xufVxuXG5jb25zdCBhbGxEZXBlbmRlbmNpZXMgPSBmbGF0dGVuRGVwcyhbXSwgQ29udGFpbmVyRmFjdG9yeSk7XG5cbi8vIHByb3ZpZGUgYWxsIGRlcGVuZGVuY2llcyB0byBhcHBJbmplY3RvclxuZXhwb3J0IGNvbnN0IGFwcEluamVjdG9yID0gYWxsRGVwZW5kZW5jaWVzLnJlZHVjZShcbiAgKGluaiwgZmFjdG9yeSkgPT4gaW5qLnByb3ZpZGUoZmFjdG9yeSwgZmFjdG9yeSksXG4gIGluamVjdG9yKClcbik7XG5cbi8vIEhlbHBlciB0byBpbmplY3QgY3VzdG9tIGNvbXBvbmVudHMgYW5kIHJldHVybiBrZXBsZXIuZ2wgY29udGFpbmVyXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0Q29tcG9uZW50cyhyZWNpcGVzID0gW10pIHtcbiAgcmV0dXJuIHByb3ZpZGVSZWNpcGVzVG9JbmplY3RvcihyZWNpcGVzLCBhcHBJbmplY3RvcikuZ2V0KENvbnRhaW5lckZhY3RvcnkpO1xufVxuXG5jb25zdCBJbmplY3RlZENvbnRhaW5lciA9IGFwcEluamVjdG9yLmdldChDb250YWluZXJGYWN0b3J5KTtcblxuZXhwb3J0IGRlZmF1bHQgSW5qZWN0ZWRDb250YWluZXI7XG4iXX0=