# reducers

### Table of Contents

* [keplerGlReducer](reducers.md#keplerglreducer)
  * [keplerGlReducer.initialState](reducers.md#keplerglreducerinitialstate)
  * [keplerGlReducer.plugin](reducers.md#keplerglreducerplugin)
* [mapStateLens](reducers.md#mapstatelens)
* [mapStyleLens](reducers.md#mapstylelens)
* [providerStateLens](reducers.md#providerstatelens)
* [uiStateLens](reducers.md#uistatelens)
* [visStateLens](reducers.md#visstatelens)

## keplerGlReducer

Kepler.gl reducer to be mounted to your store. You can mount `keplerGlReducer` at property `keplerGl`, if you choose to mount it at another address e.g. `foo` you will need to specify it when you mount `KeplerGl` component in your app with `getState: state => state.foo`

**Examples**

```javascript
import keplerGlReducer from 'kepler.gl/reducers';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {taskMiddleware} from 'react-palm/tasks';

const initialState = {};
const reducers = combineReducers({
  // <-- mount kepler.gl reducer in your app
  keplerGl: keplerGlReducer,

  // Your other reducers here
  app: appReducer
});

// using createStore
export default createStore(reducer, initialState, applyMiddleware(taskMiddleware));
```

### keplerGlReducer.initialState

Return a reducer that initiated with custom initial state. The parameter should be an object mapping from `subreducer` name to custom subreducer state, which will be shallow **merged** with default initial state.

Default subreducer state:

* [`visState`](vis-state.md#INITIAL_VIS_STATE)
* [`mapState`](map-state.md#INITIAL_MAP_STATE)
* [`mapStyle`](map-style.md#INITIAL_MAP_STYLE)
* [`uiState`](ui-state.md#INITIAL_UI_STATE)

**Parameters**

* `iniSt` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) custom state to be merged with default initial state

**Examples**

```javascript
const myKeplerGlReducer = keplerGlReducer
 .initialState({
   uiState: {readOnly: true}
 });
```

### keplerGlReducer.plugin

Returns a kepler.gl reducer that will also pass each action through additional reducers spiecified. The parameter should be either a reducer map or a reducer function. The state passed into the additional action handler is the instance state. It will include all the subreducers `visState`, `uiState`, `mapState` and `mapStyle`. `.plugin` is only meant to be called once when mounting the keplerGlReducer to the store. **Note** This is an advanced option to give you more freedom to modify the internal state of the kepler.gl instance. You should only use this to adding additional actions instead of replacing default actions.

**Parameters**

* `customReducer` **\(**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) **\|** [**Function**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)**\)** A reducer map or a reducer

**Examples**

```javascript
const myKeplerGlReducer = keplerGlReducer
 .plugin({
   // 1. as reducer map
   HIDE_AND_SHOW_SIDE_PANEL: (state, action) => ({
     ...state,
     uiState: {
       ...state.uiState,
       readOnly: !state.uiState.readOnly
     }
   })
 })
.plugin(handleActions({
  // 2. as reducer
  'HIDE_MAP_CONTROLS': (state, action) => ({
    ...state,
    uiState: {
      ...state.uiState,
      mapControls: hiddenMapControl
    }
  })
}, {}));
```

## mapStateLens

Connect subreducer `mapState`, used with `injectComponents`. Learn more at [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)

**Parameters**

* `reduxState` **any** 

## mapStyleLens

Connect subreducer `mapStyle`, used with `injectComponents`. Learn more at [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)

**Parameters**

* `reduxState` **any** 

## providerStateLens

Connect subreducer `providerState`, used with `injectComponents`. Learn more at [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)

**Parameters**

* `reduxState` **any** 

## uiStateLens

Connect subreducer `uiState`, used with `injectComponents`. Learn more at [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)

**Parameters**

* `reduxState` **any** 

## visStateLens

Connect subreducer `visState`, used with `injectComponents`. Learn more at [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)

**Parameters**

* `reduxState` **any** 

