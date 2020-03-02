# map-state

### Table of Contents

* [mapStateUpdaters](map-state.md#mapstateupdaters)
  * [fitBoundsUpdater](map-state.md#fitboundsupdater)
  * [INITIAL\_MAP\_STATE](map-state.md#initial_map_state)
  * [receiveMapConfigUpdater](map-state.md#receivemapconfigupdater)
  * [resetMapConfigUpdater](map-state.md#resetmapconfigupdater)
  * [togglePerspectiveUpdater](map-state.md#toggleperspectiveupdater)
  * [toggleSplitMapUpdater](map-state.md#togglesplitmapupdater)
  * [updateMapUpdater](map-state.md#updatemapupdater)

## mapStateUpdaters

Updaters for `mapState` reducer. Can be used in your root reducer to directly modify kepler.gl's state. Read more about [Using updaters](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/advanced-usage/using-updaters.md)

**Examples**

```javascript
import keplerGlReducer, {mapStateUpdaters} from 'kepler.gl/reducers';
// Root Reducer
const reducers = combineReducers({
 keplerGl: keplerGlReducer,
 app: appReducer
});

const composedReducer = (state, action) => {
 switch (action.type) {
   // click button to close side panel
   case 'CLICK_BUTTON':
     return {
       ...state,
       keplerGl: {
         ...state.keplerGl,
         foo: {
            ...state.keplerGl.foo,
            mapState: mapStateUpdaters.fitBoundsUpdater(
              mapState, {payload: [127.34, 31.09, 127.56, 31.59]]}
            )
         }
       }
     };
 }
 return reducers(state, action);
};

export default composedReducer;
```

### fitBoundsUpdater

Fit map viewport to bounds

* **Action**: [`fitBounds`](../actions/actions.md#fitbounds)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**&gt;** bounds as `[lngMin, latMin, lngMax, latMax]`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### INITIAL\_MAP\_STATE

Default initial `mapState`

#### Properties

* `pitch` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) Default: `0`
* `bearing` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) Default: `0`
* `latitude` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) Default: `37.75043`
* `longitude` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) Default: `-122.34679`
* `zoom` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) Default: `9`
* `dragRotate` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Default: `false`
* `width` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) Default: `800`
* `height` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) Default: `800`
* `isSplit` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Default: `false`

### receiveMapConfigUpdater

Update `mapState` to propagate a new config

* **Action**: [`receiveMapConfig`](../actions/actions.md#receivemapconfig)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) saved map config
  * `action.payload.config`   \(optional, default `{}`\)
  * `action.payload.options`   \(optional, default `{}`\)
  * `action.payload.bounds`   \(optional, default `null`\)

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### resetMapConfigUpdater

reset mapState to initial State

* **Action**: [`resetMapConfig`](../actions/actions.md#resetmapconfig)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `mapState`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### togglePerspectiveUpdater

Toggle between 3d and 2d map.

* **Action**: [`togglePerspective`](../actions/actions.md#toggleperspective)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### toggleSplitMapUpdater

Toggle between one or split maps

* **Action**: [`toggleSplitMap`](../actions/actions.md#togglesplitmap)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### updateMapUpdater

Update map viewport

* **Action**: [`updateMap`](../actions/actions.md#updatemap)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) viewport

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

