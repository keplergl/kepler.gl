"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.provideInitialState = provideInitialState;
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reduxActions = require("redux-actions");

var _actionWrapper = require("../actions/action-wrapper");

var _actions = require("../actions/actions");

var _core = require("./core");

var _actionTypes = _interopRequireDefault(require("../constants/action-types"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// INITIAL_STATE
var initialCoreState = {};

function provideInitialState(initialState) {
  var coreReducer = (0, _core.coreReducerFactory)(initialState);

  var handleRegisterEntry = function handleRegisterEntry(state, _ref) {
    var _ref$payload = _ref.payload,
        id = _ref$payload.id,
        mint = _ref$payload.mint,
        mapboxApiAccessToken = _ref$payload.mapboxApiAccessToken,
        mapboxApiUrl = _ref$payload.mapboxApiUrl,
        mapStylesReplaceDefault = _ref$payload.mapStylesReplaceDefault,
        initialUiState = _ref$payload.initialUiState;
    // by default, always create a mint state even if the same id already exist
    // if state.id exist and mint=false, keep the existing state
    var previousState = state[id] && mint === false ? state[id] : undefined;
    return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, id, coreReducer(previousState, (0, _actions.keplerGlInit)({
      mapboxApiAccessToken: mapboxApiAccessToken,
      mapboxApiUrl: mapboxApiUrl,
      mapStylesReplaceDefault: mapStylesReplaceDefault,
      initialUiState: initialUiState
    }))));
  };

  var handleDeleteEntry = function handleDeleteEntry(state, _ref2) {
    var id = _ref2.payload;
    return Object.keys(state).reduce(function (accu, curr) {
      return _objectSpread(_objectSpread({}, accu), curr === id ? {} : (0, _defineProperty2["default"])({}, curr, state[curr]));
    }, {});
  };

  var handleRenameEntry = function handleRenameEntry(state, _ref4) {
    var _ref4$payload = _ref4.payload,
        oldId = _ref4$payload.oldId,
        newId = _ref4$payload.newId;
    return Object.keys(state).reduce(function (accu, curr) {
      return _objectSpread(_objectSpread({}, accu), (0, _defineProperty2["default"])({}, curr === oldId ? newId : curr, state[curr]));
    }, {});
  };

  return function () {
    var _handlers;

    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialCoreState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    // update child states
    Object.keys(state).forEach(function (id) {
      var updateItemState = coreReducer(state[id], (0, _actionWrapper._actionFor)(id, action));
      state = (0, _actionWrapper._updateProperty)(state, id, updateItemState);
    }); // perform additional state reducing (e.g. switch action.type etc...)

    var handlers = (_handlers = {}, (0, _defineProperty2["default"])(_handlers, _actionTypes["default"].REGISTER_ENTRY, handleRegisterEntry), (0, _defineProperty2["default"])(_handlers, _actionTypes["default"].DELETE_ENTRY, handleDeleteEntry), (0, _defineProperty2["default"])(_handlers, _actionTypes["default"].RENAME_ENTRY, handleRenameEntry), _handlers); // @ts-ignore

    return (0, _reduxActions.handleActions)(handlers, initialCoreState)(state, action);
  };
}

var _keplerGlReducer = provideInitialState();

function mergeInitialState() {
  var saved = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var provided = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var keys = ['mapState', 'mapStyle', 'visState', 'uiState']; // shallow merge each reducer

  return keys.reduce(function (accu, key) {
    return _objectSpread(_objectSpread({}, accu), saved[key] && provided[key] ? (0, _defineProperty2["default"])({}, key, _objectSpread(_objectSpread({}, saved[key]), provided[key])) : (0, _defineProperty2["default"])({}, key, saved[key] || provided[key] || {}));
  }, {});
}

function decorate(target) {
  var savedInitialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var targetInitialState = savedInitialState;
  /**
   * Returns a kepler.gl reducer that will also pass each action through additional reducers spiecified.
   * The parameter should be either a reducer map or a reducer function.
   * The state passed into the additional action handler is the instance state.
   * It will include all the subreducers `visState`, `uiState`, `mapState` and `mapStyle`.
   * `.plugin` is only meant to be called once when mounting the keplerGlReducer to the store.
   * **Note** This is an advanced option to give you more freedom to modify the internal state of the kepler.gl instance.
   * You should only use this to adding additional actions instead of replacing default actions.
   *
   * @mixin keplerGlReducer.plugin
   * @memberof keplerGlReducer
   * @param {Object|Function} customReducer - A reducer map or a reducer
   * @public
   * @example
   * const myKeplerGlReducer = keplerGlReducer
   *  .plugin({
   *    // 1. as reducer map
   *    HIDE_AND_SHOW_SIDE_PANEL: (state, action) => ({
   *      ...state,
   *      uiState: {
   *        ...state.uiState,
   *        readOnly: !state.uiState.readOnly
   *      }
   *    })
   *  })
   * .plugin(handleActions({
   *   // 2. as reducer
   *   'HIDE_MAP_CONTROLS': (state, action) => ({
   *     ...state,
   *     uiState: {
   *       ...state.uiState,
   *       mapControls: hiddenMapControl
   *     }
   *   })
   * }, {}));
   */

  target.plugin = function plugin(customReducer) {
    var _this = this;

    if ((0, _typeof2["default"])(customReducer) === 'object') {
      // if only provided a reducerMap, wrap it in a reducer
      customReducer = (0, _reduxActions.handleActions)(customReducer, {});
    } // use 'function' keyword to enable 'this'


    return decorate(function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var nextState = _this(state, action); // for each entry in the staten


      Object.keys(nextState).forEach(function (id) {
        // update child states
        nextState = (0, _actionWrapper._updateProperty)(nextState, id, customReducer(nextState[id], (0, _actionWrapper._actionFor)(id, action)));
      });
      return nextState;
    });
  };
  /**
   * Return a reducer that initiated with custom initial state.
   * The parameter should be an object mapping from `subreducer` name to custom subreducer state,
   * which will be shallow **merged** with default initial state.
   *
   * Default subreducer state:
   *  - [`visState`](./vis-state.md#INITIAL_VIS_STATE)
   *  - [`mapState`](./map-state.md#INITIAL_MAP_STATE)
   *  - [`mapStyle`](./map-style.md#INITIAL_MAP_STYLE)
   *  - [`uiState`](./ui-state.md#INITIAL_UI_STATE)
   * @mixin keplerGlReducer.initialState
   * @memberof keplerGlReducer
   * @param {Object} iniSt - custom state to be merged with default initial state
   * @public
   * @example
   * const myKeplerGlReducer = keplerGlReducer
   *  .initialState({
   *    uiState: {readOnly: true}
   *  });
   */


  target.initialState = function initialState(iniSt) {
    var merged = mergeInitialState(targetInitialState, iniSt);
    var targetReducer = provideInitialState(merged);
    return decorate(targetReducer, merged);
  };

  return target;
}
/**
 * Kepler.gl reducer to be mounted to your store. You can mount `keplerGlReducer` at property `keplerGl`, if you choose
 * to mount it at another address e.g. `foo` you will need to specify it when you mount `KeplerGl` component in your app with `getState: state => state.foo`
 * @public
 * @example
 * import keplerGlReducer from 'kepler.gl/reducers';
 * import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
 * import {taskMiddleware} from 'react-palm/tasks';
 *
 * const initialState = {};
 * const reducers = combineReducers({
 *   // <-- mount kepler.gl reducer in your app
 *   keplerGl: keplerGlReducer,
 *
 *   // Your other reducers here
 *   app: appReducer
 * });
 *
 * // using createStore
 * export default createStore(reducer, initialState, applyMiddleware(taskMiddleware));
 */


var keplerGlReducer = decorate(_keplerGlReducer);
var _default = keplerGlReducer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9yb290LmpzIl0sIm5hbWVzIjpbImluaXRpYWxDb3JlU3RhdGUiLCJwcm92aWRlSW5pdGlhbFN0YXRlIiwiaW5pdGlhbFN0YXRlIiwiY29yZVJlZHVjZXIiLCJoYW5kbGVSZWdpc3RlckVudHJ5Iiwic3RhdGUiLCJwYXlsb2FkIiwiaWQiLCJtaW50IiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJtYXBib3hBcGlVcmwiLCJtYXBTdHlsZXNSZXBsYWNlRGVmYXVsdCIsImluaXRpYWxVaVN0YXRlIiwicHJldmlvdXNTdGF0ZSIsInVuZGVmaW5lZCIsImhhbmRsZURlbGV0ZUVudHJ5IiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImFjY3UiLCJjdXJyIiwiaGFuZGxlUmVuYW1lRW50cnkiLCJvbGRJZCIsIm5ld0lkIiwiYWN0aW9uIiwiZm9yRWFjaCIsInVwZGF0ZUl0ZW1TdGF0ZSIsImhhbmRsZXJzIiwiQWN0aW9uVHlwZXMiLCJSRUdJU1RFUl9FTlRSWSIsIkRFTEVURV9FTlRSWSIsIlJFTkFNRV9FTlRSWSIsIl9rZXBsZXJHbFJlZHVjZXIiLCJtZXJnZUluaXRpYWxTdGF0ZSIsInNhdmVkIiwicHJvdmlkZWQiLCJrZXkiLCJkZWNvcmF0ZSIsInRhcmdldCIsInNhdmVkSW5pdGlhbFN0YXRlIiwidGFyZ2V0SW5pdGlhbFN0YXRlIiwicGx1Z2luIiwiY3VzdG9tUmVkdWNlciIsIm5leHRTdGF0ZSIsImluaVN0IiwibWVyZ2VkIiwidGFyZ2V0UmVkdWNlciIsImtlcGxlckdsUmVkdWNlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsZ0JBQWdCLEdBQUcsRUFBekI7O0FBRU8sU0FBU0MsbUJBQVQsQ0FBNkJDLFlBQTdCLEVBQTJDO0FBQ2hELE1BQU1DLFdBQVcsR0FBRyw4QkFBbUJELFlBQW5CLENBQXBCOztBQUVBLE1BQU1FLG1C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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTVMsZUFBZSxHQUFHVixRQUFRLENBQUNMLGdCQUFELENBQWhDO2VBQ2VlLGUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2hhbmRsZUFjdGlvbnN9IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuXG5pbXBvcnQge19hY3Rpb25Gb3IsIF91cGRhdGVQcm9wZXJ0eX0gZnJvbSAnLi4vYWN0aW9ucy9hY3Rpb24td3JhcHBlcic7XG5pbXBvcnQge2tlcGxlckdsSW5pdH0gZnJvbSAnLi4vYWN0aW9ucy9hY3Rpb25zJztcbmltcG9ydCB7Y29yZVJlZHVjZXJGYWN0b3J5fSBmcm9tICcuL2NvcmUnO1xuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJ2NvbnN0YW50cy9hY3Rpb24tdHlwZXMnO1xuXG4vLyBJTklUSUFMX1NUQVRFXG5jb25zdCBpbml0aWFsQ29yZVN0YXRlID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlSW5pdGlhbFN0YXRlKGluaXRpYWxTdGF0ZSkge1xuICBjb25zdCBjb3JlUmVkdWNlciA9IGNvcmVSZWR1Y2VyRmFjdG9yeShpbml0aWFsU3RhdGUpO1xuXG4gIGNvbnN0IGhhbmRsZVJlZ2lzdGVyRW50cnkgPSAoXG4gICAgc3RhdGUsXG4gICAge1xuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBpZCxcbiAgICAgICAgbWludCxcbiAgICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW4sXG4gICAgICAgIG1hcGJveEFwaVVybCxcbiAgICAgICAgbWFwU3R5bGVzUmVwbGFjZURlZmF1bHQsXG4gICAgICAgIGluaXRpYWxVaVN0YXRlXG4gICAgICB9XG4gICAgfVxuICApID0+IHtcbiAgICAvLyBieSBkZWZhdWx0LCBhbHdheXMgY3JlYXRlIGEgbWludCBzdGF0ZSBldmVuIGlmIHRoZSBzYW1lIGlkIGFscmVhZHkgZXhpc3RcbiAgICAvLyBpZiBzdGF0ZS5pZCBleGlzdCBhbmQgbWludD1mYWxzZSwga2VlcCB0aGUgZXhpc3Rpbmcgc3RhdGVcbiAgICBjb25zdCBwcmV2aW91c1N0YXRlID0gc3RhdGVbaWRdICYmIG1pbnQgPT09IGZhbHNlID8gc3RhdGVbaWRdIDogdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHJlZ2lzdGVyIGVudHJ5IHRvIGtlcGxlci5nbCBwYXNzaW5nIGluIG1hcGJveCBjb25maWcgdG8gbWFwU3R5bGVcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgW2lkXTogY29yZVJlZHVjZXIoXG4gICAgICAgIHByZXZpb3VzU3RhdGUsXG4gICAgICAgIGtlcGxlckdsSW5pdCh7bWFwYm94QXBpQWNjZXNzVG9rZW4sIG1hcGJveEFwaVVybCwgbWFwU3R5bGVzUmVwbGFjZURlZmF1bHQsIGluaXRpYWxVaVN0YXRlfSlcbiAgICAgIClcbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZURlbGV0ZUVudHJ5ID0gKHN0YXRlLCB7cGF5bG9hZDogaWR9KSA9PlxuICAgIE9iamVjdC5rZXlzKHN0YXRlKS5yZWR1Y2UoXG4gICAgICAoYWNjdSwgY3VycikgPT4gKHtcbiAgICAgICAgLi4uYWNjdSxcbiAgICAgICAgLi4uKGN1cnIgPT09IGlkID8ge30gOiB7W2N1cnJdOiBzdGF0ZVtjdXJyXX0pXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcblxuICBjb25zdCBoYW5kbGVSZW5hbWVFbnRyeSA9IChzdGF0ZSwge3BheWxvYWQ6IHtvbGRJZCwgbmV3SWR9fSkgPT5cbiAgICBPYmplY3Qua2V5cyhzdGF0ZSkucmVkdWNlKFxuICAgICAgKGFjY3UsIGN1cnIpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIC4uLntbY3VyciA9PT0gb2xkSWQgPyBuZXdJZCA6IGN1cnJdOiBzdGF0ZVtjdXJyXX1cbiAgICAgIH0pLFxuICAgICAge31cbiAgICApO1xuXG4gIHJldHVybiAoc3RhdGUgPSBpbml0aWFsQ29yZVN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAvLyB1cGRhdGUgY2hpbGQgc3RhdGVzXG4gICAgT2JqZWN0LmtleXMoc3RhdGUpLmZvckVhY2goaWQgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlSXRlbVN0YXRlID0gY29yZVJlZHVjZXIoc3RhdGVbaWRdLCBfYWN0aW9uRm9yKGlkLCBhY3Rpb24pKTtcbiAgICAgIHN0YXRlID0gX3VwZGF0ZVByb3BlcnR5KHN0YXRlLCBpZCwgdXBkYXRlSXRlbVN0YXRlKTtcbiAgICB9KTtcblxuICAgIC8vIHBlcmZvcm0gYWRkaXRpb25hbCBzdGF0ZSByZWR1Y2luZyAoZS5nLiBzd2l0Y2ggYWN0aW9uLnR5cGUgZXRjLi4uKVxuICAgIGNvbnN0IGhhbmRsZXJzID0ge1xuICAgICAgW0FjdGlvblR5cGVzLlJFR0lTVEVSX0VOVFJZXTogaGFuZGxlUmVnaXN0ZXJFbnRyeSxcbiAgICAgIFtBY3Rpb25UeXBlcy5ERUxFVEVfRU5UUlldOiBoYW5kbGVEZWxldGVFbnRyeSxcbiAgICAgIFtBY3Rpb25UeXBlcy5SRU5BTUVfRU5UUlldOiBoYW5kbGVSZW5hbWVFbnRyeVxuICAgIH07XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGhhbmRsZUFjdGlvbnMoaGFuZGxlcnMsIGluaXRpYWxDb3JlU3RhdGUpKHN0YXRlLCBhY3Rpb24pO1xuICB9O1xufVxuXG5jb25zdCBfa2VwbGVyR2xSZWR1Y2VyID0gcHJvdmlkZUluaXRpYWxTdGF0ZSgpO1xuXG5mdW5jdGlvbiBtZXJnZUluaXRpYWxTdGF0ZShzYXZlZCA9IHt9LCBwcm92aWRlZCA9IHt9KSB7XG4gIGNvbnN0IGtleXMgPSBbJ21hcFN0YXRlJywgJ21hcFN0eWxlJywgJ3Zpc1N0YXRlJywgJ3VpU3RhdGUnXTtcblxuICAvLyBzaGFsbG93IG1lcmdlIGVhY2ggcmVkdWNlclxuICByZXR1cm4ga2V5cy5yZWR1Y2UoXG4gICAgKGFjY3UsIGtleSkgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICAuLi4oc2F2ZWRba2V5XSAmJiBwcm92aWRlZFtrZXldXG4gICAgICAgID8ge1trZXldOiB7Li4uc2F2ZWRba2V5XSwgLi4ucHJvdmlkZWRba2V5XX19XG4gICAgICAgIDoge1trZXldOiBzYXZlZFtrZXldIHx8IHByb3ZpZGVkW2tleV0gfHwge319KVxuICAgIH0pLFxuICAgIHt9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGRlY29yYXRlKHRhcmdldCwgc2F2ZWRJbml0aWFsU3RhdGUgPSB7fSkge1xuICBjb25zdCB0YXJnZXRJbml0aWFsU3RhdGUgPSBzYXZlZEluaXRpYWxTdGF0ZTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIGtlcGxlci5nbCByZWR1Y2VyIHRoYXQgd2lsbCBhbHNvIHBhc3MgZWFjaCBhY3Rpb24gdGhyb3VnaCBhZGRpdGlvbmFsIHJlZHVjZXJzIHNwaWVjaWZpZWQuXG4gICAqIFRoZSBwYXJhbWV0ZXIgc2hvdWxkIGJlIGVpdGhlciBhIHJlZHVjZXIgbWFwIG9yIGEgcmVkdWNlciBmdW5jdGlvbi5cbiAgICogVGhlIHN0YXRlIHBhc3NlZCBpbnRvIHRoZSBhZGRpdGlvbmFsIGFjdGlvbiBoYW5kbGVyIGlzIHRoZSBpbnN0YW5jZSBzdGF0ZS5cbiAgICogSXQgd2lsbCBpbmNsdWRlIGFsbCB0aGUgc3VicmVkdWNlcnMgYHZpc1N0YXRlYCwgYHVpU3RhdGVgLCBgbWFwU3RhdGVgIGFuZCBgbWFwU3R5bGVgLlxuICAgKiBgLnBsdWdpbmAgaXMgb25seSBtZWFudCB0byBiZSBjYWxsZWQgb25jZSB3aGVuIG1vdW50aW5nIHRoZSBrZXBsZXJHbFJlZHVjZXIgdG8gdGhlIHN0b3JlLlxuICAgKiAqKk5vdGUqKiBUaGlzIGlzIGFuIGFkdmFuY2VkIG9wdGlvbiB0byBnaXZlIHlvdSBtb3JlIGZyZWVkb20gdG8gbW9kaWZ5IHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUga2VwbGVyLmdsIGluc3RhbmNlLlxuICAgKiBZb3Ugc2hvdWxkIG9ubHkgdXNlIHRoaXMgdG8gYWRkaW5nIGFkZGl0aW9uYWwgYWN0aW9ucyBpbnN0ZWFkIG9mIHJlcGxhY2luZyBkZWZhdWx0IGFjdGlvbnMuXG4gICAqXG4gICAqIEBtaXhpbiBrZXBsZXJHbFJlZHVjZXIucGx1Z2luXG4gICAqIEBtZW1iZXJvZiBrZXBsZXJHbFJlZHVjZXJcbiAgICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IGN1c3RvbVJlZHVjZXIgLSBBIHJlZHVjZXIgbWFwIG9yIGEgcmVkdWNlclxuICAgKiBAcHVibGljXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IG15S2VwbGVyR2xSZWR1Y2VyID0ga2VwbGVyR2xSZWR1Y2VyXG4gICAqICAucGx1Z2luKHtcbiAgICogICAgLy8gMS4gYXMgcmVkdWNlciBtYXBcbiAgICogICAgSElERV9BTkRfU0hPV19TSURFX1BBTkVMOiAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgICogICAgICAuLi5zdGF0ZSxcbiAgICogICAgICB1aVN0YXRlOiB7XG4gICAqICAgICAgICAuLi5zdGF0ZS51aVN0YXRlLFxuICAgKiAgICAgICAgcmVhZE9ubHk6ICFzdGF0ZS51aVN0YXRlLnJlYWRPbmx5XG4gICAqICAgICAgfVxuICAgKiAgICB9KVxuICAgKiAgfSlcbiAgICogLnBsdWdpbihoYW5kbGVBY3Rpb25zKHtcbiAgICogICAvLyAyLiBhcyByZWR1Y2VyXG4gICAqICAgJ0hJREVfTUFQX0NPTlRST0xTJzogKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gICAqICAgICAuLi5zdGF0ZSxcbiAgICogICAgIHVpU3RhdGU6IHtcbiAgICogICAgICAgLi4uc3RhdGUudWlTdGF0ZSxcbiAgICogICAgICAgbWFwQ29udHJvbHM6IGhpZGRlbk1hcENvbnRyb2xcbiAgICogICAgIH1cbiAgICogICB9KVxuICAgKiB9LCB7fSkpO1xuICAgKi9cbiAgdGFyZ2V0LnBsdWdpbiA9IGZ1bmN0aW9uIHBsdWdpbihjdXN0b21SZWR1Y2VyKSB7XG4gICAgaWYgKHR5cGVvZiBjdXN0b21SZWR1Y2VyID09PSAnb2JqZWN0Jykge1xuICAgICAgLy8gaWYgb25seSBwcm92aWRlZCBhIHJlZHVjZXJNYXAsIHdyYXAgaXQgaW4gYSByZWR1Y2VyXG4gICAgICBjdXN0b21SZWR1Y2VyID0gaGFuZGxlQWN0aW9ucyhjdXN0b21SZWR1Y2VyLCB7fSk7XG4gICAgfVxuXG4gICAgLy8gdXNlICdmdW5jdGlvbicga2V5d29yZCB0byBlbmFibGUgJ3RoaXMnXG4gICAgcmV0dXJuIGRlY29yYXRlKChzdGF0ZSA9IHt9LCBhY3Rpb24gPSB7fSkgPT4ge1xuICAgICAgbGV0IG5leHRTdGF0ZSA9IHRoaXMoc3RhdGUsIGFjdGlvbik7XG5cbiAgICAgIC8vIGZvciBlYWNoIGVudHJ5IGluIHRoZSBzdGF0ZW5cbiAgICAgIE9iamVjdC5rZXlzKG5leHRTdGF0ZSkuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgIC8vIHVwZGF0ZSBjaGlsZCBzdGF0ZXNcbiAgICAgICAgbmV4dFN0YXRlID0gX3VwZGF0ZVByb3BlcnR5KFxuICAgICAgICAgIG5leHRTdGF0ZSxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjdXN0b21SZWR1Y2VyKG5leHRTdGF0ZVtpZF0sIF9hY3Rpb25Gb3IoaWQsIGFjdGlvbikpXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGEgcmVkdWNlciB0aGF0IGluaXRpYXRlZCB3aXRoIGN1c3RvbSBpbml0aWFsIHN0YXRlLlxuICAgKiBUaGUgcGFyYW1ldGVyIHNob3VsZCBiZSBhbiBvYmplY3QgbWFwcGluZyBmcm9tIGBzdWJyZWR1Y2VyYCBuYW1lIHRvIGN1c3RvbSBzdWJyZWR1Y2VyIHN0YXRlLFxuICAgKiB3aGljaCB3aWxsIGJlIHNoYWxsb3cgKiptZXJnZWQqKiB3aXRoIGRlZmF1bHQgaW5pdGlhbCBzdGF0ZS5cbiAgICpcbiAgICogRGVmYXVsdCBzdWJyZWR1Y2VyIHN0YXRlOlxuICAgKiAgLSBbYHZpc1N0YXRlYF0oLi92aXMtc3RhdGUubWQjSU5JVElBTF9WSVNfU1RBVEUpXG4gICAqICAtIFtgbWFwU3RhdGVgXSguL21hcC1zdGF0ZS5tZCNJTklUSUFMX01BUF9TVEFURSlcbiAgICogIC0gW2BtYXBTdHlsZWBdKC4vbWFwLXN0eWxlLm1kI0lOSVRJQUxfTUFQX1NUWUxFKVxuICAgKiAgLSBbYHVpU3RhdGVgXSguL3VpLXN0YXRlLm1kI0lOSVRJQUxfVUlfU1RBVEUpXG4gICAqIEBtaXhpbiBrZXBsZXJHbFJlZHVjZXIuaW5pdGlhbFN0YXRlXG4gICAqIEBtZW1iZXJvZiBrZXBsZXJHbFJlZHVjZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IGluaVN0IC0gY3VzdG9tIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIGRlZmF1bHQgaW5pdGlhbCBzdGF0ZVxuICAgKiBAcHVibGljXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IG15S2VwbGVyR2xSZWR1Y2VyID0ga2VwbGVyR2xSZWR1Y2VyXG4gICAqICAuaW5pdGlhbFN0YXRlKHtcbiAgICogICAgdWlTdGF0ZToge3JlYWRPbmx5OiB0cnVlfVxuICAgKiAgfSk7XG4gICAqL1xuICB0YXJnZXQuaW5pdGlhbFN0YXRlID0gZnVuY3Rpb24gaW5pdGlhbFN0YXRlKGluaVN0KSB7XG4gICAgY29uc3QgbWVyZ2VkID0gbWVyZ2VJbml0aWFsU3RhdGUodGFyZ2V0SW5pdGlhbFN0YXRlLCBpbmlTdCk7XG4gICAgY29uc3QgdGFyZ2V0UmVkdWNlciA9IHByb3ZpZGVJbml0aWFsU3RhdGUobWVyZ2VkKTtcblxuICAgIHJldHVybiBkZWNvcmF0ZSh0YXJnZXRSZWR1Y2VyLCBtZXJnZWQpO1xuICB9O1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogS2VwbGVyLmdsIHJlZHVjZXIgdG8gYmUgbW91bnRlZCB0byB5b3VyIHN0b3JlLiBZb3UgY2FuIG1vdW50IGBrZXBsZXJHbFJlZHVjZXJgIGF0IHByb3BlcnR5IGBrZXBsZXJHbGAsIGlmIHlvdSBjaG9vc2VcbiAqIHRvIG1vdW50IGl0IGF0IGFub3RoZXIgYWRkcmVzcyBlLmcuIGBmb29gIHlvdSB3aWxsIG5lZWQgdG8gc3BlY2lmeSBpdCB3aGVuIHlvdSBtb3VudCBgS2VwbGVyR2xgIGNvbXBvbmVudCBpbiB5b3VyIGFwcCB3aXRoIGBnZXRTdGF0ZTogc3RhdGUgPT4gc3RhdGUuZm9vYFxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGltcG9ydCBrZXBsZXJHbFJlZHVjZXIgZnJvbSAna2VwbGVyLmdsL3JlZHVjZXJzJztcbiAqIGltcG9ydCB7Y3JlYXRlU3RvcmUsIGNvbWJpbmVSZWR1Y2VycywgYXBwbHlNaWRkbGV3YXJlLCBjb21wb3NlfSBmcm9tICdyZWR1eCc7XG4gKiBpbXBvcnQge3Rhc2tNaWRkbGV3YXJlfSBmcm9tICdyZWFjdC1wYWxtL3Rhc2tzJztcbiAqXG4gKiBjb25zdCBpbml0aWFsU3RhdGUgPSB7fTtcbiAqIGNvbnN0IHJlZHVjZXJzID0gY29tYmluZVJlZHVjZXJzKHtcbiAqICAgLy8gPC0tIG1vdW50IGtlcGxlci5nbCByZWR1Y2VyIGluIHlvdXIgYXBwXG4gKiAgIGtlcGxlckdsOiBrZXBsZXJHbFJlZHVjZXIsXG4gKlxuICogICAvLyBZb3VyIG90aGVyIHJlZHVjZXJzIGhlcmVcbiAqICAgYXBwOiBhcHBSZWR1Y2VyXG4gKiB9KTtcbiAqXG4gKiAvLyB1c2luZyBjcmVhdGVTdG9yZVxuICogZXhwb3J0IGRlZmF1bHQgY3JlYXRlU3RvcmUocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBhcHBseU1pZGRsZXdhcmUodGFza01pZGRsZXdhcmUpKTtcbiAqL1xuY29uc3Qga2VwbGVyR2xSZWR1Y2VyID0gZGVjb3JhdGUoX2tlcGxlckdsUmVkdWNlcik7XG5leHBvcnQgZGVmYXVsdCBrZXBsZXJHbFJlZHVjZXI7XG4iXX0=