# map-style

### Table of Contents

* [mapStyleUpdaters](map-style.md#mapstyleupdaters)
  * [INITIAL\_MAP\_STYLE](map-style.md#initial_map_style)
  * [initMapStyleUpdater](map-style.md#initmapstyleupdater)
  * [inputMapStyleUpdater](map-style.md#inputmapstyleupdater)
  * [loadCustomMapStyleUpdater](map-style.md#loadcustommapstyleupdater)
  * [loadMapStyleErrUpdater](map-style.md#loadmapstyleerrupdater)
  * [loadMapStylesUpdater](map-style.md#loadmapstylesupdater)
  * [mapConfigChangeUpdater](map-style.md#mapconfigchangeupdater)
  * [mapStyleChangeUpdater](map-style.md#mapstylechangeupdater)
  * [resetMapConfigMapStyleUpdater](map-style.md#resetmapconfigmapstyleupdater)

## mapStyleUpdaters

Updaters for `mapStyle`. Can be used in your root reducer to directly modify kepler.gl's state. Read more about [Using updaters](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/advanced-usage/using-updaters.md)

**Examples**

```javascript
import keplerGlReducer, {mapStyleUpdaters} from 'kepler.gl/reducers';
// Root Reducer
const reducers = combineReducers({
 keplerGl: keplerGlReducer,
 app: appReducer
});

const composedReducer = (state, action) => {
 switch (action.type) {
   // click button to hide label from background map
   case 'CLICK_BUTTON':
     return {
       ...state,
       keplerGl: {
         ...state.keplerGl,
         foo: {
            ...state.keplerGl.foo,
            mapStyle: mapStyleUpdaters.mapConfigChangeUpdater(
              mapStyle,
              {payload: {visibleLayerGroups: {label: false, road: true, background: true}}}
            )
         }
       }
     };
 }
 return reducers(state, action);
};

export default composedReducer;
```

### INITIAL\_MAP\_STYLE

Default initial `mapStyle`

#### Properties

* `styleType` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: `'dark'`
* `visibleLayerGroups` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: `{}`
* `topLayerGroups` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: `{}`
* `mapStyles` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) mapping from style key to style object
* `mapboxApiAccessToken` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: `null`
* `inputStyle` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: `{}`
* `threeDBuildingColor` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) Default: `[r, g, b]`

### initMapStyleUpdater

Propagate `mapStyle` reducer with `mapboxApiAccessToken` and `mapStylesReplaceDefault`. if mapStylesReplaceDefault is true mapStyles is emptied; loadMapStylesUpdater\(\) will populate mapStyles.

* **Action**: [`keplerGlInit`](../actions/actions.md#keplerglinit)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    * `action.payload.mapboxApiAccessToken` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### inputMapStyleUpdater

Input a custom map style object

* **Action**: [`inputMapStyle`](../actions/actions.md#inputmapstyle)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `mapStyle`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action object
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) inputStyle
    * `action.payload.url` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) style url e.g. `'mapbox://styles/heshan/xxxxxyyyyzzz'`
    * `action.payload.id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) style url e.g. `'custom_style_1'`
    * `action.payload.style` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) actual mapbox style json
    * `action.payload.name` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) style name
    * `action.payload.layerGroups` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer groups that can be used to set map layer visibility
    * `action.payload.icon` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) icon image data url
  * `action.payload.inputStyle`  
  * `action.payload.mapState`  

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### loadCustomMapStyleUpdater

Callback when a custom map style object is received

* **Action**: [`loadCustomMapStyle`](../actions/actions.md#loadcustommapstyle)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `mapStyle`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    * `action.payload.icon` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 
    * `action.payload.style` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    * `action.payload.error` **any** 
  * `action.payload.icon`  
  * `action.payload.style`  
  * `action.payload.error`  

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### loadMapStyleErrUpdater

Callback when load map style error

* **Action**: [`loadMapStyleErr`](../actions/actions.md#loadmapstyleerr)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `mapStyle`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` **any** error

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### loadMapStylesUpdater

Callback when load map style success

* **Action**: [`loadMapStyles`](../actions/actions.md#loadmapstyles)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `mapStyle`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) a `{[id]: style}` mapping

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### mapConfigChangeUpdater

Update `visibleLayerGroups`to change layer group visibility

* **Action**: [`mapConfigChange`](../actions/actions.md#mapconfigchange)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `mapStyle`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new config `{visibleLayerGroups: {label: false, road: true, background: true}}`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### mapStyleChangeUpdater

Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`

* **Action**: [`mapStyleChange`](../actions/actions.md#mapstylechange)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `mapStyle`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### resetMapConfigMapStyleUpdater

Reset map style config to initial state

* **Action**: [`resetMapConfig`](../actions/actions.md#resetmapconfig)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `mapStyle`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

