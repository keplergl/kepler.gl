# vis-state

### Table of Contents

* [visStateUpdaters](vis-state.md#visstateupdaters)
  * [addFilterUpdater](vis-state.md#addfilterupdater)
  * [addLayerUpdater](vis-state.md#addlayerupdater)
  * [applyCPUFilterUpdater](vis-state.md#applycpufilterupdater)
  * [enlargeFilterUpdater](vis-state.md#enlargefilterupdater)
  * [INITIAL\_VIS\_STATE](vis-state.md#initial_vis_state)
  * [interactionConfigChangeUpdater](vis-state.md#interactionconfigchangeupdater)
  * [layerClickUpdater](vis-state.md#layerclickupdater)
  * [layerHoverUpdater](vis-state.md#layerhoverupdater)
  * [layerTypeChangeUpdater](vis-state.md#layertypechangeupdater)
  * [layerVisConfigChangeUpdater](vis-state.md#layervisconfigchangeupdater)
  * [layerVisualChannelChangeUpdater](vis-state.md#layervisualchannelchangeupdater)
  * [loadFilesErrUpdater](vis-state.md#loadfileserrupdater)
  * [loadFilesUpdater](vis-state.md#loadfilesupdater)
  * [mapClickUpdater](vis-state.md#mapclickupdater)
  * [receiveMapConfigUpdater](vis-state.md#receivemapconfigupdater)
  * [removeDatasetUpdater](vis-state.md#removedatasetupdater)
  * [removeFilterUpdater](vis-state.md#removefilterupdater)
  * [removeLayerUpdater](vis-state.md#removelayerupdater)
  * [reorderLayerUpdater](vis-state.md#reorderlayerupdater)
  * [resetMapConfigUpdater](vis-state.md#resetmapconfigupdater)
  * [setFilterPlotUpdater](vis-state.md#setfilterplotupdater)
  * [setFilterUpdater](vis-state.md#setfilterupdater)
  * [setMapInfoUpdater](vis-state.md#setmapinfoupdater)
  * [showDatasetTableUpdater](vis-state.md#showdatasettableupdater)
  * [toggleFilterAnimationUpdater](vis-state.md#togglefilteranimationupdater)
  * [toggleLayerForMapUpdater](vis-state.md#togglelayerformapupdater)
  * [toggleSplitMapUpdater](vis-state.md#togglesplitmapupdater)
  * [updateAnimationTimeUpdater](vis-state.md#updateanimationtimeupdater)
  * [updateFilterAnimationSpeedUpdater](vis-state.md#updatefilteranimationspeedupdater)
  * [updateLayerAnimationSpeedUpdater](vis-state.md#updatelayeranimationspeedupdater)
  * [updateLayerBlendingUpdater](vis-state.md#updatelayerblendingupdater)
  * [updateVisDataUpdater](vis-state.md#updatevisdataupdater)

## visStateUpdaters

Updaters for `visState` reducer. Can be used in your root reducer to directly modify kepler.gl's state. Read more about [Using updaters](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/advanced-usage/using-updaters.md)

**Examples**

```javascript
import keplerGlReducer, {visStateUpdaters} from 'kepler.gl/reducers';
// Root Reducer
const reducers = combineReducers({
 keplerGl: keplerGlReducer,
 app: appReducer
});

const composedReducer = (state, action) => {
 switch (action.type) {
   case 'CLICK_BUTTON':
     return {
       ...state,
       keplerGl: {
         ...state.keplerGl,
         foo: {
            ...state.keplerGl.foo,
            visState: visStateUpdaters.enlargeFilterUpdater(
              state.keplerGl.foo.visState,
              {idx: 0}
            )
         }
       }
     };
 }
 return reducers(state, action);
};

export default composedReducer;
```

### addFilterUpdater

Add a new filter

* **Action**: [`addFilter`](../actions/actions.md#addfilter)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.dataId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset `id` this new filter is associated with

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### addLayerUpdater

Add a new layer

* **Action**: [`addLayer`](../actions/actions.md#addlayer)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.props` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new layer props

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### applyCPUFilterUpdater

When select dataset for export, apply cpu filter to selected dataset

* **Action**: [`applyCPUFilter`](../actions/actions.md#applycpufilter)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.dataId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset id

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### enlargeFilterUpdater

Show larger time filter at bottom for time playback \(apply to time filter only\)

* **Action**: [`enlargeFilter`](../actions/actions.md#enlargefilter)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) index of filter to enlarge

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### INITIAL\_VIS\_STATE

Default initial `visState`

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

* `layers` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) 
* `layerData` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) 
* `layerToBeMerged` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) 
* `layerOrder` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) 
* `filters` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) 
* `filterToBeMerged` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) 
* `datasets` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) 
* `editingDataset` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 
* `interactionConfig` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `interactionToBeMerged` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `layerBlending` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 
* `hoverInfo` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `clicked` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `mousePos` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `splitMaps` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) a list of objects of layer availabilities and visibilities for each map
* `layerClasses` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `animationConfig` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `editor` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 

### interactionConfigChangeUpdater

Update `interactionConfig`

* **Action**: [`interactionConfigChange`](../actions/actions.md#interactionconfigchange)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new config as key value map: `{tooltip: {enabled: true}}`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### layerClickUpdater

Trigger layer click event with clicked object

* **Action**: [`onLayerClick`](../actions/actions.md#onlayerclick)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Object clicked, returned by deck.gl

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### layerHoverUpdater

Trigger layer hover event with hovered object

* **Action**: [`onLayerHover`](../actions/actions.md#onlayerhover)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Object hovered, returned by deck.gl

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### layerTypeChangeUpdater

Update layer type. Previews layer config will be copied if applicable.

* **Action**: [`layerTypeChange`](../actions/actions.md#layertypechange)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
  * `action.newType` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) new type

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### layerVisConfigChangeUpdater

Update layer `visConfig`

* **Action**: [`layerVisConfigChange`](../actions/actions.md#layervisconfigchange)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
  * `action.newVisConfig` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new visConfig as a key value map: e.g. `{opacity: 0.8}`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### layerVisualChannelChangeUpdater

Update layer visual channel

* **Action**: [`layerVisualChannelConfigChange`](../actions/actions.md#layervisualchannelconfigchange)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
  * `action.newConfig` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new visual channel config
  * `action.channel` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) channel to be updated

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### loadFilesErrUpdater

Trigger loading file error

* **Action**: [`loadFilesErr`](../actions/actions.md#loadfileserr)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.error` **any** 

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### loadFilesUpdater

Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed

* **Action**: [`loadFiles`](../actions/actions.md#loadfiles)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.files` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt;** array of fileblob

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### mapClickUpdater

Trigger map click event, unselect clicked object

* **Action**: [`onMapClick`](../actions/actions.md#onmapclick)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### receiveMapConfigUpdater

Propagate `visState` reducer with a new configuration. Current config will be override.

* **Action**: [`receiveMapConfig`](../actions/actions.md#receivemapconfig)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) map config to be propagated
    * `action.payload.config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) map config to be propagated
    * `action.payload.option` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) {keepExistingConfig: true \| false}
  * `action.payload.config`   \(optional, default `{}`\)
  * `action.payload.options`   \(optional, default `{}`\)

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### removeDatasetUpdater

Remove a dataset and all layers, filters, tooltip configs that based on it

* **Action**: [`removeDataset`](../actions/actions.md#removedataset)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.key` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset id

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### removeFilterUpdater

Remove a filter

* **Action**: [`removeFilter`](../actions/actions.md#removefilter)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) index of filter to b e removed

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### removeLayerUpdater

remove layer

* **Action**: [`removeLayer`](../actions/actions.md#removelayer)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) index of layer to b e removed

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### reorderLayerUpdater

Reorder layer

* **Action**: [`reorderLayer`](../actions/actions.md#reorderlayer)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.order` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**&gt;** an array of layer indexes

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### resetMapConfigUpdater

reset visState to initial State

* **Action**: [`resetMapConfig`](../actions/actions.md#resetmapconfig)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setFilterPlotUpdater

Set the property of a filter plot

* **Action**: [`setFilterPlot`](../actions/actions.md#setfilterplot)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) 
  * `action.newProp` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) key value mapping of new prop `{yAxis: 'histogram'}`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setFilterUpdater

Update filter property

* **Action**: [`setFilter`](../actions/actions.md#setfilter)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) `idx` of filter to be updated
  * `action.prop` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) `prop` of filter, e,g, `dataId`, `name`, `value`
  * `action.value` **any** new value
* `datasetId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) used when updating a prop \(dataId, name\) that can be linked to multiple datasets

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setMapInfoUpdater

User input to update the info of the map

* **Action**: [`setMapInfo`](../actions/actions.md#setmapinfo)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) {title: 'hello'}

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### showDatasetTableUpdater

Display dataset table in a modal

* **Action**: [`showDatasetTable`](../actions/actions.md#showdatasettable)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.dataId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset id to show in table

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### toggleFilterAnimationUpdater

Start and end filter animation

* **Action**: [`toggleFilterAnimation`](../actions/actions.md#togglefilteranimation)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) idx of filter

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### toggleLayerForMapUpdater

Toggle visibility of a layer in a split map

* **Action**: [`toggleLayerForMap`](../actions/actions.md#togglelayerformap)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.mapIndex` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) index of the split map
  * `action.layerId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of the layer

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### toggleSplitMapUpdater

Toggle visibility of a layer for a split map

* **Action**: [`toggleSplitMap`](../actions/actions.md#togglesplitmap)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.payload` **\(**[**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) **\|** [**undefined**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)**\)** index of the split map

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### updateAnimationTimeUpdater

Reset animation config current time to a specified value

* **Action**: [`updateAnimationTime`](../actions/actions.md#updateanimationtime)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.value` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) the value current time will be set to

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### updateFilterAnimationSpeedUpdater

Change filter animation speed

* **Action**: [`updateFilterAnimationSpeed`](../actions/actions.md#updatefilteranimationspeed)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) `idx` of filter
  * `action.speed` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) `speed` to change it to. `speed` is a multiplier

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### updateLayerAnimationSpeedUpdater

Update animation speed with the vertical speed slider

* **Action**: [`updateLayerAnimationSpeed`](../actions/actions.md#updatelayeranimationspeed)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.speed` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) the updated speed of the animation

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### updateLayerBlendingUpdater

update layer blending mode

* **Action**: [`updateLayerBlending`](../actions/actions.md#updatelayerblending)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.mode` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) one of `additive`, `normal` and `subtractive`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### updateVisDataUpdater

Add new dataset to `visState`, with option to load a map config along with the datasets

* **Action**: [`updateVisData`](../actions/actions.md#updatevisdata)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `visState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.datasets` **\(**[**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt; \|** [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**\)** **\*required** datasets can be a dataset or an array of datasets

    Each dataset object needs to have `info` and `data` property.

    * `action.datasets.info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) -info of a dataset
      * `action.datasets.info.id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of this dataset. If config is defined, `id` should matches the `dataId` in config.
      * `action.datasets.info.label` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) A display name of this dataset
    * `action.datasets.data` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) **\*required** The data object, in a tabular format with 2 properties `fields` and `rows`
      * `action.datasets.data.fields` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt;** **\*required** Array of fields,
        * `action.datasets.data.fields.name` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\*required** Name of the field,
      * `action.datasets.data.rows` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&gt;** **\*required** Array of rows, in a tabular format with `fields` and `rows`

  * `action.options` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) option object `{centerMap: true, keepExistingConfig: false}`
  * `action.config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) map config

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

