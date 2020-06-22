"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContainerFactory = ContainerFactory;
exports.injectComponents = injectComponents;
exports["default"] = exports.appInjector = exports.ERROR_MSG = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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
     * You can create a free account at [www.mapbox.com](www.mapbox.com) and create a token at
    * [www.mapbox.com/account/access-tokens](www.mapbox.com/account/access-tokens)
    *
    *
    * @param {Number} props.width - _required_ Width of the KeplerGl UI.
    * @public
   */
  var Container =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(Container, _Component);

    // default id and address if not provided
    function Container(props, ctx) {
      var _this;

      (0, _classCallCheck2["default"])(this, Container);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Container).call(this, props, ctx));
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
            mapStylesReplaceDefault = _this$props.mapStylesReplaceDefault; // add a new entry to reducer

        this.props.dispatch((0, _identityActions.registerEntry)({
          id: id,
          mint: mint,
          mapboxApiAccessToken: mapboxApiAccessToken,
          mapboxApiUrl: mapboxApiUrl,
          mapStylesReplaceDefault: mapStylesReplaceDefault
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
          return _react["default"].createElement("div", null);
        }

        return _react["default"].createElement(KeplerGl, (0, _extends2["default"])({}, this.props, {
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
} // entryPoint


function flattenDeps(allDeps, factory) {
  var addToDeps = allDeps.concat([factory]);
  return Array.isArray(factory.deps) && factory.deps.length ? factory.deps.reduce(function (accu, dep) {
    return flattenDeps(accu, dep);
  }, addToDeps) : addToDeps;
}

var allDependencies = flattenDeps([], ContainerFactory); // provide all dependencies to appInjector

var appInjector = allDependencies.reduce(function (inj, factory) {
  return inj.provide(factory, factory);
}, (0, _injector.injector)()); // Helper to inject custom components and return kepler.gl container

exports.appInjector = appInjector;

function injectComponents() {
  var recipes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return recipes.reduce(function (inj, recipe) {
    var _inj;

    if (!(0, _injector.typeCheckRecipe)(recipe)) {
      return inj;
    } // collect dependencies of custom factories, if there is any.
    // Add them to the injector


    var customDependencies = flattenDeps([], recipe[1]);
    inj = customDependencies.reduce(function (ij, factory) {
      return ij.provide(factory, factory);
    }, inj);
    return (_inj = inj).provide.apply(_inj, (0, _toConsumableArray2["default"])(recipe));
  }, appInjector).get(ContainerFactory);
}

var InjectedContainer = appInjector.get(ContainerFactory);
var _default = InjectedContainer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2NvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJFUlJPUl9NU0ciLCJub1N0YXRlIiwiQ29udGFpbmVyRmFjdG9yeSIsImRlcHMiLCJLZXBsZXJHbEZhY3RvcnkiLCJLZXBsZXJHbCIsIkNvbnRhaW5lciIsInByb3BzIiwiY3R4IiwiZ2V0U2VsZWN0b3IiLCJpZCIsImdldFN0YXRlIiwic3RhdGUiLCJDb25zb2xlIiwiZXJyb3IiLCJnZXREaXNwYXRjaCIsImRpc3BhdGNoIiwibWludCIsIm1hcGJveEFwaUFjY2Vzc1Rva2VuIiwibWFwYm94QXBpVXJsIiwibWFwU3R5bGVzUmVwbGFjZURlZmF1bHQiLCJwcmV2UHJvcHMiLCJzZWxlY3RvciIsIkNvbXBvbmVudCIsImtlcGxlckdsIiwibWFwU3RhdGVUb1Byb3BzIiwiZGlzcGF0Y2hUb1Byb3BzIiwiZmxhdHRlbkRlcHMiLCJhbGxEZXBzIiwiZmFjdG9yeSIsImFkZFRvRGVwcyIsImNvbmNhdCIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsInJlZHVjZSIsImFjY3UiLCJkZXAiLCJhbGxEZXBlbmRlbmNpZXMiLCJhcHBJbmplY3RvciIsImluaiIsInByb3ZpZGUiLCJpbmplY3RDb21wb25lbnRzIiwicmVjaXBlcyIsInJlY2lwZSIsImN1c3RvbURlcGVuZGVuY2llcyIsImlqIiwiZ2V0IiwiSW5qZWN0ZWRDb250YWluZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7QUFFTyxJQUFNQSxTQUFTLEdBQUc7QUFDdkJDLEVBQUFBLE9BQU8sRUFDTDtBQUZxQixDQUFsQjs7QUFPUEMsZ0JBQWdCLENBQUNDLElBQWpCLEdBQXdCLENBQUNDLG9CQUFELENBQXhCOztBQUVPLFNBQVNGLGdCQUFULENBQTBCRyxRQUExQixFQUFvQztBQUN6Qzs7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LCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7aW5qZWN0b3IsIHR5cGVDaGVja1JlY2lwZX0gZnJvbSAnLi9pbmplY3Rvcic7XG5pbXBvcnQgS2VwbGVyR2xGYWN0b3J5IGZyb20gJy4va2VwbGVyLWdsJztcbmltcG9ydCB7Zm9yd2FyZFRvfSBmcm9tICdhY3Rpb25zL2FjdGlvbi13cmFwcGVyJztcblxuaW1wb3J0IHtyZWdpc3RlckVudHJ5LCBkZWxldGVFbnRyeSwgcmVuYW1lRW50cnl9IGZyb20gJ2FjdGlvbnMvaWRlbnRpdHktYWN0aW9ucyc7XG5pbXBvcnQge25vdE51bGxvclVuZGVmaW5lZH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmV4cG9ydCBjb25zdCBFUlJPUl9NU0cgPSB7XG4gIG5vU3RhdGU6XG4gICAgYGtlcGxlci5nbCBzdGF0ZSBkb2VzIG5vdCBleGlzdC4gYCArXG4gICAgYFlvdSBtaWdodCBmb3JnZXQgdG8gbW91bnQga2VwbGVyR2xSZWR1Y2VyIGluIHlvdXIgcm9vdCByZWR1Y2VyLmAgK1xuICAgIGBJZiBpdCBpcyBub3QgbW91bnRlZCBhcyBzdGF0ZS5rZXBsZXJHbCBieSBkZWZhdWx0LCB5b3UgbmVlZCB0byBwcm92aWRlIGdldFN0YXRlIGFzIGEgcHJvcGBcbn07XG5cbkNvbnRhaW5lckZhY3RvcnkuZGVwcyA9IFtLZXBsZXJHbEZhY3RvcnldO1xuXG5leHBvcnQgZnVuY3Rpb24gQ29udGFpbmVyRmFjdG9yeShLZXBsZXJHbCkge1xuICAvKiogQGxlbmRzIEtlcGxlckdsICovXG4gIC8qKlxuICAgICogTWFpbiBLZXBsZXIuZ2wgQ29tcG9uZW50XG4gICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcHMuaWQgLSBfcmVxdWlyZWRfXG4gICAgKlxuICAgICogLSBEZWZhdWx0OiBgbWFwYFxuICAgICogVGhlIGlkIG9mIHRoaXMgS2VwbGVyR2wgaW5zdGFuY2UuIGBpZGAgaXMgcmVxdWlyZWQgaWYgeW91IGhhdmUgbXVsdGlwbGVcbiAgICAqIEtlcGxlckdsIGluc3RhbmNlcyBpbiB5b3VyIGFwcC4gSXQgZGVmaW5lcyB0aGUgcHJvcCBuYW1lIG9mIHRoZSBLZXBsZXJHbCBzdGF0ZSB0aGF0IGlzXG4gICAgKiBzdG9yZWQgaW4gdGhlIEtlcGxlckdsIHJlZHVjZXIuIEZvciBleGFtcGxlLCB0aGUgc3RhdGUgb2YgdGhlIEtlcGxlckdsIGNvbXBvbmVudCB3aXRoIGlkIGBmb29gIGlzXG4gICAgKiBzdG9yZWQgaW4gYHN0YXRlLmtlcGxlckdsLmZvb2AuXG4gICAgKlxuICAgICogSW4gY2FzZSB5b3UgY3JlYXRlIG11bHRpcGxlIGtlcGxlci5nbCBpbnN0YW5jZXMgdXNpbmcgdGhlIHNhbWUgaWQsIHRoZSBrZXBsZXIuZ2wgc3RhdGUgZGVmaW5lZCBieSB0aGUgZW50cnkgd2lsbCBiZVxuICAgICogb3ZlcnJpZGRlbiBieSB0aGUgbGF0ZXN0IGluc3RhbmNlIGFuZCByZXNldCB0byBhIGJsYW5rIHN0YXRlLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VuIC0gX3JlcXVpcmVkX1xuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BzLm1hcGJveEFwaVVybCAtIF9vcHRpb25hbF9cbiAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcHJvcHMubWFwU3R5bGVzUmVwbGFjZURlZmF1bHQgLSBfb3B0aW9uYWxfXG5cbiAgICAqIFlvdSBjYW4gY3JlYXRlIGEgZnJlZSBhY2NvdW50IGF0IFt3d3cubWFwYm94LmNvbV0od3d3Lm1hcGJveC5jb20pIGFuZCBjcmVhdGUgYSB0b2tlbiBhdFxuICAgICogW3d3dy5tYXBib3guY29tL2FjY291bnQvYWNjZXNzLXRva2Vuc10od3d3Lm1hcGJveC5jb20vYWNjb3VudC9hY2Nlc3MtdG9rZW5zKVxuICAgICpcbiAgICAqXG4gICAgKiBAcGFyYW0ge051bWJlcn0gcHJvcHMud2lkdGggLSBfcmVxdWlyZWRfIFdpZHRoIG9mIHRoZSBLZXBsZXJHbCBVSS5cbiAgICAqIEBwdWJsaWNcbiAgICovXG4gIGNsYXNzIENvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLy8gZGVmYXVsdCBpZCBhbmQgYWRkcmVzcyBpZiBub3QgcHJvdmlkZWRcbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgaWQ6ICdtYXAnLFxuICAgICAgZ2V0U3RhdGU6IHN0YXRlID0+IHN0YXRlLmtlcGxlckdsLFxuICAgICAgbWludDogdHJ1ZVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY3R4KSB7XG4gICAgICBzdXBlcihwcm9wcywgY3R4KTtcblxuICAgICAgdGhpcy5nZXRTZWxlY3RvciA9IG1lbW9pemUoKGlkLCBnZXRTdGF0ZSkgPT4gc3RhdGUgPT4ge1xuICAgICAgICBpZiAoIWdldFN0YXRlKHN0YXRlKSkge1xuICAgICAgICAgIC8vIGxvZyBlcnJvclxuICAgICAgICAgIENvbnNvbGUuZXJyb3IoRVJST1JfTVNHLm5vU3RhdGUpO1xuXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdldFN0YXRlKHN0YXRlKVtpZF07XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2V0RGlzcGF0Y2ggPSBtZW1vaXplKChpZCwgZGlzcGF0Y2gpID0+IGZvcndhcmRUbyhpZCwgZGlzcGF0Y2gpKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIGNvbnN0IHtpZCwgbWludCwgbWFwYm94QXBpQWNjZXNzVG9rZW4sIG1hcGJveEFwaVVybCwgbWFwU3R5bGVzUmVwbGFjZURlZmF1bHR9ID0gdGhpcy5wcm9wcztcbiAgICAgIC8vIGFkZCBhIG5ldyBlbnRyeSB0byByZWR1Y2VyXG4gICAgICB0aGlzLnByb3BzLmRpc3BhdGNoKFxuICAgICAgICByZWdpc3RlckVudHJ5KHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBtaW50LFxuICAgICAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICAgICAgICAgIG1hcGJveEFwaVVybCxcbiAgICAgICAgICBtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgICAvLyBjaGVjayBpZiBpZCBoYXMgY2hhbmdlZCwgaWYgdHJ1ZSwgY29weSBzdGF0ZSBvdmVyXG4gICAgICBpZiAoXG4gICAgICAgIG5vdE51bGxvclVuZGVmaW5lZChwcmV2UHJvcHMuaWQpICYmXG4gICAgICAgIG5vdE51bGxvclVuZGVmaW5lZCh0aGlzLnByb3BzLmlkKSAmJlxuICAgICAgICBwcmV2UHJvcHMuaWQgIT09IHRoaXMucHJvcHMuaWRcbiAgICAgICkge1xuICAgICAgICB0aGlzLnByb3BzLmRpc3BhdGNoKHJlbmFtZUVudHJ5KHByZXZQcm9wcy5pZCwgdGhpcy5wcm9wcy5pZCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgaWYgKHRoaXMucHJvcHMubWludCAhPT0gZmFsc2UpIHtcbiAgICAgICAgLy8gZGVsZXRlIGVudHJ5IGluIHJlZHVjZXJcbiAgICAgICAgdGhpcy5wcm9wcy5kaXNwYXRjaChkZWxldGVFbnRyeSh0aGlzLnByb3BzLmlkKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge2lkLCBnZXRTdGF0ZSwgZGlzcGF0Y2gsIHN0YXRlfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBzZWxlY3RvciA9IHRoaXMuZ2V0U2VsZWN0b3IoaWQsIGdldFN0YXRlKTtcblxuICAgICAgaWYgKCFzZWxlY3RvciB8fCAhc2VsZWN0b3Ioc3RhdGUpKSB7XG4gICAgICAgIC8vIGluc3RhbmNlIHN0YXRlIGhhc24ndCBiZWVuIG1vdW50ZWQgeWV0XG4gICAgICAgIHJldHVybiA8ZGl2IC8+O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8S2VwbGVyR2xcbiAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgc2VsZWN0b3I9e3NlbGVjdG9yfVxuICAgICAgICAgIGRpc3BhdGNoPXt0aGlzLmdldERpc3BhdGNoKGlkLCBkaXNwYXRjaCl9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSwgcHJvcHMpID0+ICh7c3RhdGUsIC4uLnByb3BzfSk7XG4gIGNvbnN0IGRpc3BhdGNoVG9Qcm9wcyA9IGRpc3BhdGNoID0+ICh7ZGlzcGF0Y2h9KTtcbiAgcmV0dXJuIGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBkaXNwYXRjaFRvUHJvcHMpKENvbnRhaW5lcik7XG59XG5cbi8vIGVudHJ5UG9pbnRcbmZ1bmN0aW9uIGZsYXR0ZW5EZXBzKGFsbERlcHMsIGZhY3RvcnkpIHtcbiAgY29uc3QgYWRkVG9EZXBzID0gYWxsRGVwcy5jb25jYXQoW2ZhY3RvcnldKTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZmFjdG9yeS5kZXBzKSAmJiBmYWN0b3J5LmRlcHMubGVuZ3RoXG4gICAgPyBmYWN0b3J5LmRlcHMucmVkdWNlKChhY2N1LCBkZXApID0+IGZsYXR0ZW5EZXBzKGFjY3UsIGRlcCksIGFkZFRvRGVwcylcbiAgICA6IGFkZFRvRGVwcztcbn1cblxuY29uc3QgYWxsRGVwZW5kZW5jaWVzID0gZmxhdHRlbkRlcHMoW10sIENvbnRhaW5lckZhY3RvcnkpO1xuXG4vLyBwcm92aWRlIGFsbCBkZXBlbmRlbmNpZXMgdG8gYXBwSW5qZWN0b3JcbmV4cG9ydCBjb25zdCBhcHBJbmplY3RvciA9IGFsbERlcGVuZGVuY2llcy5yZWR1Y2UoXG4gIChpbmosIGZhY3RvcnkpID0+IGluai5wcm92aWRlKGZhY3RvcnksIGZhY3RvcnkpLFxuICBpbmplY3RvcigpXG4pO1xuXG4vLyBIZWxwZXIgdG8gaW5qZWN0IGN1c3RvbSBjb21wb25lbnRzIGFuZCByZXR1cm4ga2VwbGVyLmdsIGNvbnRhaW5lclxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdENvbXBvbmVudHMocmVjaXBlcyA9IFtdKSB7XG4gIHJldHVybiByZWNpcGVzXG4gICAgLnJlZHVjZSgoaW5qLCByZWNpcGUpID0+IHtcbiAgICAgIGlmICghdHlwZUNoZWNrUmVjaXBlKHJlY2lwZSkpIHtcbiAgICAgICAgcmV0dXJuIGluajtcbiAgICAgIH1cblxuICAgICAgLy8gY29sbGVjdCBkZXBlbmRlbmNpZXMgb2YgY3VzdG9tIGZhY3RvcmllcywgaWYgdGhlcmUgaXMgYW55LlxuICAgICAgLy8gQWRkIHRoZW0gdG8gdGhlIGluamVjdG9yXG4gICAgICBjb25zdCBjdXN0b21EZXBlbmRlbmNpZXMgPSBmbGF0dGVuRGVwcyhbXSwgcmVjaXBlWzFdKTtcbiAgICAgIGluaiA9IGN1c3RvbURlcGVuZGVuY2llcy5yZWR1Y2UoKGlqLCBmYWN0b3J5KSA9PiBpai5wcm92aWRlKGZhY3RvcnksIGZhY3RvcnkpLCBpbmopO1xuXG4gICAgICByZXR1cm4gaW5qLnByb3ZpZGUoLi4ucmVjaXBlKTtcbiAgICB9LCBhcHBJbmplY3RvcilcbiAgICAuZ2V0KENvbnRhaW5lckZhY3RvcnkpO1xufVxuXG5jb25zdCBJbmplY3RlZENvbnRhaW5lciA9IGFwcEluamVjdG9yLmdldChDb250YWluZXJGYWN0b3J5KTtcblxuZXhwb3J0IGRlZmF1bHQgSW5qZWN0ZWRDb250YWluZXI7XG4iXX0=