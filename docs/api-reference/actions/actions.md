# Actions

### Table of Contents

* [forwardActions](actions.md#forwardactions)
  * [forwardTo](actions.md#forwardto)
  * [isForwardAction](actions.md#isforwardaction)
  * [unwrap](actions.md#unwrap)
  * [wrapTo](actions.md#wrapto)
* [ActionTypes](actions.md#actiontypes)
* [mapStyleActions](actions.md#mapstyleactions)
  * [addCustomMapStyle](actions.md#addcustommapstyle)
  * [inputMapStyle](actions.md#inputmapstyle)
  * [loadCustomMapStyle](actions.md#loadcustommapstyle)
  * [loadMapStyleErr](actions.md#loadmapstyleerr)
  * [loadMapStyles](actions.md#loadmapstyles)
  * [mapConfigChange](actions.md#mapconfigchange)
  * [mapStyleChange](actions.md#mapstylechange)
  * [requestMapStyles](actions.md#requestmapstyles)
  * [set3dBuildingColor](actions.md#set3dbuildingcolor)
* [main](actions.md#main)
  * [addDataToMap](actions.md#adddatatomap)
  * [keplerGlInit](actions.md#keplerglinit)
  * [receiveMapConfig](actions.md#receivemapconfig)
  * [resetMapConfig](actions.md#resetmapconfig)
* [visStateActions](actions.md#visstateactions)
  * [addFilter](actions.md#addfilter)
  * [addLayer](actions.md#addlayer)
  * [applyCPUFilter](actions.md#applycpufilter)
  * [enlargeFilter](actions.md#enlargefilter)
  * [interactionConfigChange](actions.md#interactionconfigchange)
  * [layerConfigChange](actions.md#layerconfigchange)
  * [layerTextLabelChange](actions.md#layertextlabelchange)
  * [layerTypeChange](actions.md#layertypechange)
  * [layerVisConfigChange](actions.md#layervisconfigchange)
  * [layerVisualChannelConfigChange](actions.md#layervisualchannelconfigchange)
  * [loadFiles](actions.md#loadfiles)
  * [loadFilesErr](actions.md#loadfileserr)
  * [onLayerClick](actions.md#onlayerclick)
  * [onLayerHover](actions.md#onlayerhover)
  * [onMapClick](actions.md#onmapclick)
  * [onMouseMove](actions.md#onmousemove)
  * [removeDataset](actions.md#removedataset)
  * [removeFilter](actions.md#removefilter)
  * [removeLayer](actions.md#removelayer)
  * [reorderLayer](actions.md#reorderlayer)
  * [setEditorMode](actions.md#seteditormode)
  * [setFilter](actions.md#setfilter)
  * [setFilterPlot](actions.md#setfilterplot)
  * [setMapInfo](actions.md#setmapinfo)
  * [showDatasetTable](actions.md#showdatasettable)
  * [toggleFilterAnimation](actions.md#togglefilteranimation)
  * [toggleLayerForMap](actions.md#togglelayerformap)
  * [updateAnimationTime](actions.md#updateanimationtime)
  * [updateFilterAnimationSpeed](actions.md#updatefilteranimationspeed)
  * [updateLayerAnimationSpeed](actions.md#updatelayeranimationspeed)
  * [updateLayerBlending](actions.md#updatelayerblending)
  * [updateVisData](actions.md#updatevisdata)
* [uiStateActions](actions.md#uistateactions)
  * [addNotification](actions.md#addnotification)
  * [cleanupExportImage](actions.md#cleanupexportimage)
  * [hideExportDropdown](actions.md#hideexportdropdown)
  * [openDeleteModal](actions.md#opendeletemodal)
  * [removeNotification](actions.md#removenotification)
  * [setExportData](actions.md#setexportdata)
  * [setExportDataType](actions.md#setexportdatatype)
  * [setExportFiltered](actions.md#setexportfiltered)
  * [setExportImageDataUri](actions.md#setexportimagedatauri)
  * [setExportImageSetting](actions.md#setexportimagesetting)
  * [setExportSelectedDataset](actions.md#setexportselecteddataset)
  * [setUserMapboxAccessToken](actions.md#setusermapboxaccesstoken)
  * [showExportDropdown](actions.md#showexportdropdown)
  * [startExportingImage](actions.md#startexportingimage)
  * [toggleMapControl](actions.md#togglemapcontrol)
  * [toggleModal](actions.md#togglemodal)
  * [toggleSidePanel](actions.md#togglesidepanel)
* [rootActions](actions.md#rootactions)
  * [deleteEntry](actions.md#deleteentry)
  * [registerEntry](actions.md#registerentry)
  * [renameEntry](actions.md#renameentry)
* [mapStateActions](actions.md#mapstateactions)
  * [fitBounds](actions.md#fitbounds)
  * [togglePerspective](actions.md#toggleperspective)
  * [toggleSplitMap](actions.md#togglesplitmap)
  * [updateMap](actions.md#updatemap)
* [layerColorUIChange](actions.md#layercoloruichange)
* [setExportMapFormat](actions.md#setexportmapformat)

## forwardActions

A set of helpers to forward dispatch actions to a specific instance reducer

### forwardTo

Returns an action dispatcher that wraps and forwards the actions to a specific instance

**Parameters**

* `id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) instance id
* `dispatch` [**Function**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function) action dispatcher

**Examples**

```javascript
// action and forward dispatcher
import {toggleSplitMap, forwardTo} from 'kepler.gl/actions';
import {connect} from 'react-redux';

const MapContainer = props => (
 <div>
  <button onClick={() => props.keplerGlDispatch(toggleSplitMap())}/>
 </div>
)

const mapDispatchToProps = (dispatch, props) => ({
 dispatch,
 keplerGlDispatch: forwardTo(‘foo’, dispatch)
});

export default connect(
 state => state,
 mapDispatchToProps
)(MapContainer);
```

### isForwardAction

Whether an action is a forward action

**Parameters**

* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) the action object

Returns [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) boolean - whether the action is a forward action

### unwrap

Unwrap an action

**Parameters**

* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) the action object

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) unwrapped action

### wrapTo

Wrap an action into a forward action that only modify the state of a specific kepler.gl instance. kepler.gl reducer will look for signatures in the action to determine whether it needs to be forwarded to a specific instance reducer.

wrapTo can be curried. You can create a curried action wrapper by only supply the `id` argument

A forward action looks like this

```javascript
 {
   type: "@@kepler.gl/LAYER_CONFIG_CHANGE",
   payload: {
     type: '@@kepler.gl/LAYER_CONFIG_CHANGE',
     payload: {},
     meta: {
      // id of instance
       _id_: id
      // other meta
     }
   },
   meta: {
     _forward_: '@redux-forward/FORWARD',
     _addr_: '@@KG_id'
   }
 };
```

**Parameters**

* `id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) The id to forward to
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) the action object {type: string, payload: \*}

**Examples**

```javascript
import {wrapTo, togglePerspective} from 'kepler.gl/actions';

// This action will only dispatch to the KeplerGl instance with `id: map_1`
this.props.dispatch(wrapTo('map_1', togglePerspective()));

// You can also create a curried action for each instance
const wrapToMap1 = wrapTo('map_1');
this.props.dispatch(wrapToMap1(togglePerspective()));
```

## ActionTypes

Kepler.gl action types, can be listened by reducers to perform additional tasks whenever an action is called in kepler.gl

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

**Examples**

```javascript
// store.js
import {handleActions} from 'redux-actions';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {taskMiddleware} from 'react-palm/tasks';

import keplerGlReducer from 'kepler.gl/reducers';
import {ActionTypes} from 'kepler.gl/actions';

const appReducer = handleActions({
  // listen on kepler.gl map update action to store a copy of viewport in app state
  [ActionTypes.UPDATE_MAP]: (state, action) => ({
    ...state,
    viewport: action.payload
  }),
}, {});

const reducers = combineReducers({
  app: appReducer,
  keplerGl: keplerGlReducer
});

export default createStore(reducers, {}, applyMiddleware(taskMiddleware))
```

## mapStyleActions

Actions handled mostly by `mapStyle` reducer. They manage the display of base map, such as loading and receiving base map styles, hiding and showing map layers, user input of custom map style url.

### addCustomMapStyle

Add map style from user input to reducer and set it to current style This action is called when user click confirm after putting in a valid style url in the custom map style dialog. It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer. param {void}

* **ActionTypes**: [`ActionTypes.ADD_CUSTOM_MAP_STYLE`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.addCustomMapStyleUpdater`](../reducers/map-style.md#mapstyleupdatersaddcustommapstyleupdater)

### inputMapStyle

Input a custom map style object

* **ActionTypes**: [`ActionTypes.INPUT_MAP_STYLE`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.inputMapStyleUpdater`](../reducers/map-style.md#mapstyleupdatersinputmapstyleupdater)

**Parameters**

* `inputStyle` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `inputStyle.url` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) style url e.g. `'mapbox://styles/heshan/xxxxxyyyyzzz'`
  * `inputStyle.id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) style url e.g. `'custom_style_1'`
  * `inputStyle.style` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) actual mapbox style json
  * `inputStyle.name` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) style name
  * `inputStyle.layerGroups` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer groups that can be used to set map layer visibility
  * `inputStyle.icon` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) icon image data url
* `mapState` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) mapState is optional

### loadCustomMapStyle

Callback when a custom map style object is received

* **ActionTypes**: [`ActionTypes.LOAD_CUSTOM_MAP_STYLE`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.loadCustomMapStyleUpdater`](../reducers/map-style.md#mapstyleupdatersloadcustommapstyleupdater)

**Parameters**

* `customMapStyle` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `customMapStyle.icon` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 
  * `customMapStyle.style` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `customMapStyle.error` **any** 

### loadMapStyleErr

Callback when load map style error

* **ActionTypes**: [`ActionTypes.LOAD_MAP_STYLE_ERR`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.loadMapStyleErrUpdater`](../reducers/map-style.md#mapstyleupdatersloadmapstyleerrupdater)

**Parameters**

* `error` **any** 

### loadMapStyles

Callback when load map style success

* **ActionTypes**: [`ActionTypes.LOAD_MAP_STYLES`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.loadMapStylesUpdater`](../reducers/map-style.md#mapstyleupdatersloadmapstylesupdater)

**Parameters**

* `newStyles` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) a `{[id]: style}` mapping

### mapConfigChange

Update `visibleLayerGroups`to change layer group visibility

* **ActionTypes**: [`ActionTypes.MAP_CONFIG_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.mapConfigChangeUpdater`](../reducers/map-style.md#mapstyleupdatersmapconfigchangeupdater)

**Parameters**

* `mapStyle` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new config `{visibleLayerGroups: {label: false, road: true, background: true}}`

### mapStyleChange

Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`

* **ActionTypes**: [`ActionTypes.MAP_STYLE_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.mapStyleChangeUpdater`](../reducers/map-style.md#mapstyleupdatersmapstylechangeupdater)

**Parameters**

* `styleType` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) the style to change to

### requestMapStyles

Request map style style object based on style.url.

* **ActionTypes**: [`ActionTypes.REQUEST_MAP_STYLES`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.requestMapStylesUpdater`](../reducers/map-style.md#mapstyleupdatersrequestmapstylesupdater)

**Parameters**

* `mapStyles` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt;** 

### set3dBuildingColor

Set 3d building layer group color

* **ActionTypes**: [`ActionTypes.SET_3D_BUILDING_COLOR`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.set3dBuildingColorUpdater`](../reducers/map-style.md#mapstyleupdatersset3dbuildingcolorupdater)

**Parameters**

* `color` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) \[r, g, b\]

## main

Main kepler.gl actions, these actions handles loading data and config into kepler.gl reducer. These actions is listened by all subreducers,

### addDataToMap

Add data to kepler.gl reducer, prepare map with preset configuration if config is passed. Kepler.gl provides a handy set of utils to parse data from different formats to the `data` object required in dataset. You rarely need to manually format the data obejct.

Use `KeplerGlSchema.getConfigToSave` to generate a json blob of the currents instance config. The config object value will always have higher precedence than the options properties.

Kepler.gl uses `dataId` in the config to match with loaded dataset. If you pass a config object, you need to match the `info.id` of your dataset to the `dataId` in each `layer`, `filter` and `interactionConfig.tooltips.fieldsToShow`

* **ActionTypes**: [`ActionTypes.ADD_DATA_TO_MAP`](actions.md#actiontypes)
* **Updaters**: [`combinedUpdaters.addDataToMapUpdater`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/reducers/composers.md#combinedupdatersadddatatomapupdater)

**Parameters**

* `data` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `data.datasets` **\(**[**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt; \|** [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**\)** **\*required** datasets can be a dataset or an array of datasets

    Each dataset object needs to have `info` and `data` property.

    * `data.datasets.info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) -info of a dataset
      * `data.datasets.info.id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of this dataset. If config is defined, `id` should matches the `dataId` in config.
      * `data.datasets.info.label` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) A display name of this dataset
    * `data.datasets.data` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) **\*required** The data object, in a tabular format with 2 properties `fields` and `rows`
      * `data.datasets.data.fields` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt;** **\*required** Array of fields,
        * `data.datasets.data.fields.name` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\*required** Name of the field,
      * `data.datasets.data.rows` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&gt;** **\*required** Array of rows, in a tabular format with `fields` and `rows`

  * `data.options` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    * `data.options.centerMap` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) `default: true` if `centerMap` is set to `true` kepler.gl will

      place the map view within the data points boundaries.  `options.centerMap` will override `config.mapState` if passed in.

    * `data.options.readOnly` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) `default: false` if `readOnly` is set to `true`

      the left setting panel will be hidden

    * `data.options.keepExistingConfig` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) whether to keep exiting map data and associated layer filter  interaction config `default: false`.
  * `data.config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}

**Examples**

```javascript
// app.js
import {addDataToMap} from 'kepler.gl/actions';

const sampleTripData = {
 fields: [
   {name: 'tpep_pickup_datetime', format: 'YYYY-M-D H:m:s', type: 'timestamp'},
   {name: 'pickup_longitude', format: '', type: 'real'},
   {name: 'pickup_latitude', format: '', type: 'real'}
 ],
 rows: [
   ['2015-01-15 19:05:39 +00:00', -73.99389648, 40.75011063],
   ['2015-01-15 19:05:39 +00:00', -73.97642517, 40.73981094],
   ['2015-01-15 19:05:40 +00:00', -73.96870422, 40.75424576],
 ]
};

const sampleConfig = {
  visState: {
    filters: [
      {
        id: 'me',
        dataId: 'test_trip_data',
        name: 'tpep_pickup_datetime',
        type: 'timeRange',
        enlarged: true
      }
    ]
  }
}

this.props.dispatch(
  addDataToMap({
    datasets: {
      info: {
        label: 'Sample Taxi Trips in New York City',
        id: 'test_trip_data'
      },
      data: sampleTripData
    },
    option: {
      centerMap: true,
      readOnly: false,
      keepExistingConfig: false
    },
    info: {
      title: 'Taro and Blue',
      description: 'This is my map'
    }
    config: sampleConfig
  })
);
```

### keplerGlInit

Initialize kepler.gl reducer. It is used to pass in `mapboxApiAccessToken` to `mapStyle` reducer.

* **ActionTypes**: [`ActionTypes.INIT`](actions.md#actiontypes)
* **Updaters**: [`mapStyleUpdaters.initMapStyleUpdater`](../reducers/map-style.md#mapstyleupdatersinitmapstyleupdater)

**Parameters**

* `payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `payload.mapboxApiAccessToken` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) mapboxApiAccessToken to be saved to mapStyle reducer
  * `payload.mapboxApiUrl` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) mapboxApiUrl to be saved to mapStyle reducer.
  * `payload.mapStylesReplaceDefault` [**Boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) mapStylesReplaceDefault to be saved to mapStyle reducer

### receiveMapConfig

Pass config to kepler.gl instance, prepare the state with preset configs. Calling `KeplerGlSchema.parseSavedConfig` to convert saved config before passing it in is required.

You can call `receiveMapConfig` before passing in any data. The reducer will store layer and filter config, waiting for data to come in. When data arrives, you can call `addDataToMap` without passing any config, and the reducer will try to match preloaded configs. This behavior is designed to allow asynchronous data loading.

It is also useful when you want to prepare the kepler.gl instance with some preset layer and filter settings. **Note** Sequence is important, `receiveMapConfig` needs to be called **before** data is loaded. Currently kepler.gl doesn't allow calling `receiveMapConfig` after data is loaded. It will reset current configuration first then apply config to it.

* **ActionTypes**: [`ActionTypes.RECEIVE_MAP_CONFIG`](actions.md#actiontypes)
* **Updaters**: [`mapStateUpdaters.receiveMapConfigUpdater`](../reducers/map-state.md#mapstateupdatersreceivemapconfigupdater), [`mapStyleUpdaters.receiveMapConfigUpdater`](../reducers/map-style.md#mapstyleupdatersreceivemapconfigupdater), [`visStateUpdaters.receiveMapConfigUpdater`](../reducers/vis-state.md#visstateupdatersreceivemapconfigupdater)

**Parameters**

* `config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) **\*required** The Config Object
* `options` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) **\*optional** The Option object
  * `options.centerMap` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) `default: true` if `centerMap` is set to `true` kepler.gl will

    place the map view within the data points boundaries

  * `options.readOnly` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) `default: false` if `readOnly` is set to `true`

    the left setting panel will be hidden

  * `options.keepExistingConfig` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) whether to keep exiting layer filter and interaction config `default: false`.

**Examples**

```javascript
import {receiveMapConfig} from 'kepler.gl/actions';
import KeplerGlSchema from 'kepler.gl/schemas';

const parsedConfig = KeplerGlSchema.parseSavedConfig(config);
this.props.dispatch(receiveMapConfig(parsedConfig));
```

### resetMapConfig

Reset all sub-reducers to its initial state. This can be used to clear out all configuration in the reducer.

* **ActionTypes**: [`ActionTypes.RESET_MAP_CONFIG`](actions.md#actiontypes)
* **Updaters**: [`mapStateUpdaters.resetMapConfigUpdater`](../reducers/map-state.md#mapstateupdatersresetmapconfigupdater), [`mapStyleUpdaters.resetMapConfigMapStyleUpdater`](../reducers/map-style.md#mapstyleupdatersresetmapconfigmapstyleupdater), [`mapStyleUpdaters.resetMapConfigMapStyleUpdater`](../reducers/map-style.md#mapstyleupdatersresetmapconfigmapstyleupdater), [`visStateUpdaters.resetMapConfigUpdater`](../reducers/vis-state.md#visstateupdatersresetmapconfigupdater)

## visStateActions

Actions handled mostly by `visState` reducer. They manage how data is processed, filtered and displayed on the map by operates on layers, filters and interaction settings.

### addFilter

Add a new filter

* **ActionTypes**: [`ActionTypes.ADD_FILTER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.addFilterUpdater`](../reducers/vis-state.md#visstateupdatersaddfilterupdater)

**Parameters**

* `dataId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset `id` this new filter is associated with

Returns **{type: ActionTypes.ADD\_FILTER, dataId: dataId}**

### addLayer

Add a new layer

* **ActionTypes**: [`ActionTypes.ADD_LAYER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.addLayerUpdater`](../reducers/vis-state.md#visstateupdatersaddlayerupdater)

**Parameters**

* `props` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new layer props

Returns **{type: ActionTypes.ADD\_LAYER, props: props}**

### applyCPUFilter

Trigger CPU filter of selected dataset

* **ActionTypes**: [`ActionTypes.APPLY_CPU_FILTER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.applyCPUFilterUpdater`](../reducers/vis-state.md#visstateupdatersapplycpufilterupdater)

**Parameters**

* `dataId` **\(**[**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\| Arrary&lt;**[**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&gt;\)** single dataId or an array of dataIds

Returns **{type: ActionTypes.APPLY\_CPU\_FILTER, dataId:** [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**}**

### enlargeFilter

Show larger time filter at bottom for time playback \(apply to time filter only\)

* **ActionTypes**: [`ActionTypes.ENLARGE_FILTER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.enlargeFilterUpdater`](../reducers/vis-state.md#visstateupdatersenlargefilterupdater)

**Parameters**

* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) index of filter to enlarge

Returns **{type: ActionTypes.ENLARGE\_FILTER, idx: idx}**

### interactionConfigChange

Update `interactionConfig`

* **ActionTypes**: [`ActionTypes.INTERACTION_CONFIG_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.interactionConfigChangeUpdater`](../reducers/vis-state.md#visstateupdatersinteractionconfigchangeupdater)

**Parameters**

* `config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new config as key value map: `{tooltip: {enabled: true}}`

Returns **{type: ActionTypes.INTERACTION\_CONFIG\_CHANGE, config: config}**

### layerConfigChange

Update layer base config: dataId, label, column, isVisible

* **ActionTypes**: [`ActionTypes.LAYER_CONFIG_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.layerConfigChangeUpdater`](../reducers/vis-state.md#visstateupdaterslayerconfigchangeupdater)

**Parameters**

* `oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
* `newConfig` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new config

Returns **{type: ActionTypes.LAYER\_CONFIG\_CHANGE, oldLayer: oldLayer, newConfig: newConfig}**

### layerTextLabelChange

Update layer text label

* **ActionTypes**: [`ActionTypes.LAYER_TEXT_LABEL_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.layerTextLabelChangeUpdater`](../reducers/vis-state.md#visstateupdaterslayertextlabelchangeupdater)

**Parameters**

* `oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) -`idx` of text label to be updated
* `prop` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) `prop` of text label, e,g, `anchor`, `alignment`, `color`, `size`, `field`
* `value` **any** new value

### layerTypeChange

Update layer type. Previews layer config will be copied if applicable.

* **ActionTypes**: [`ActionTypes.LAYER_TYPE_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.layerTypeChangeUpdater`](../reducers/vis-state.md#visstateupdaterslayertypechangeupdater)

**Parameters**

* `oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
* `newType` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) new type

Returns **{type: ActionTypes.LAYER\_TYPE\_CHANGE, oldLayer: oldLayer, newType: newType}**

### layerVisConfigChange

Update layer `visConfig`

* **ActionTypes**: [`ActionTypes.LAYER_VIS_CONFIG_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.layerVisConfigChangeUpdater`](../reducers/vis-state.md#visstateupdaterslayervisconfigchangeupdater)

**Parameters**

* `oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
* `newVisConfig` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new visConfig as a key value map: e.g. `{opacity: 0.8}`

Returns **{type: ActionTypes.LAYER\_VIS\_CONFIG\_CHANGE, oldLayer: oldLayer, newVisConfig: newVisConfig}**

### layerVisualChannelConfigChange

Update layer visual channel

* **ActionTypes**: [`ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.layerVisualChannelChangeUpdater`](../reducers/vis-state.md#visstateupdaterslayervisualchannelchangeupdater)

**Parameters**

* `oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
* `newConfig` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) new visual channel config
* `channel` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) channel to be updated

Returns **{type: ActionTypes.LAYER\_VISUAL\_CHANNEL\_CHANGE, oldLayer: oldLayer, newConfig: newConfig, channel: channel}**

### loadFiles

Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed

* **ActionTypes**: [`ActionTypes.LOAD_FILES`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.loadFilesUpdater`](../reducers/ui-state.md#uistateupdatersloadfilesupdater), [`visStateUpdaters.loadFilesUpdater`](../reducers/vis-state.md#visstateupdatersloadfilesupdater)

**Parameters**

* `files` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt;** array of fileblob

Returns **{type: ActionTypes.LOAD\_FILES, files: any}**

### loadFilesErr

Trigger loading file error

* **ActionTypes**: [`ActionTypes.LOAD_FILES_ERR`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.loadFilesErrUpdater`](../reducers/ui-state.md#uistateupdatersloadfileserrupdater), [`visStateUpdaters.loadFilesErrUpdater`](../reducers/vis-state.md#visstateupdatersloadfileserrupdater)

**Parameters**

* `error` **any** 

Returns **{type: ActionTypes.LOAD\_FILES\_ERR, error:** [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**}**

### onLayerClick

Trigger layer click event with clicked object

* **ActionTypes**: [`ActionTypes.LAYER_CLICK`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.layerClickUpdater`](../reducers/vis-state.md#visstateupdaterslayerclickupdater)

**Parameters**

* `info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Object clicked, returned by deck.gl

Returns **{type: ActionTypes.LAYER\_CLICK, info: info}**

### onLayerHover

Trigger layer hover event with hovered object

* **ActionTypes**: [`ActionTypes.LAYER_HOVER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.layerHoverUpdater`](../reducers/vis-state.md#visstateupdaterslayerhoverupdater)

**Parameters**

* `info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Object hovered, returned by deck.gl

Returns **{type: ActionTypes.LAYER\_HOVER, info: info}**

### onMapClick

Trigger map click event, unselect clicked object

* **ActionTypes**: [`ActionTypes.MAP_CLICK`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.mapClickUpdater`](../reducers/vis-state.md#visstateupdatersmapclickupdater)

Returns **{type: ActionTypes.MAP\_CLICK}**

### onMouseMove

Trigger map mouse moveevent, payload would be React-map-gl PointerEvent [https://uber.github.io/react-map-gl/\#/documentation/api-reference/pointer-event](https://uber.github.io/react-map-gl/#/documentation/api-reference/pointer-event)

* **ActionTypes**: [`ActionTypes.MOUSE_MOVE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.mouseMoveUpdater`](../reducers/vis-state.md#visstateupdatersmousemoveupdater)

**Parameters**

* `evt` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) PointerEvent

Returns **{type: ActionTypes.MAP\_CLICK}**

### removeDataset

Remove a dataset and all layers, filters, tooltip configs that based on it

* **ActionTypes**: [`ActionTypes.REMOVE_DATASET`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.removeDatasetUpdater`](../reducers/vis-state.md#visstateupdatersremovedatasetupdater)

**Parameters**

* `key` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset id

Returns **{type: ActionTypes.REMOVE\_DATASET, key: key}**

### removeFilter

Remove a filter from `visState.filters`, once a filter is removed, data will be re-filtered and layer will be updated

* **ActionTypes**: [`ActionTypes.REMOVE_FILTER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.removeFilterUpdater`](../reducers/vis-state.md#visstateupdatersremovefilterupdater)

**Parameters**

* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) idx of filter to be removed

Returns **{type: ActionTypes.REMOVE\_FILTER, idx: idx}**

### removeLayer

Remove a layer

* **ActionTypes**: [`ActionTypes.REMOVE_LAYER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.removeLayerUpdater`](../reducers/vis-state.md#visstateupdatersremovelayerupdater)

**Parameters**

* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) idx of layer to be removed

Returns **{type: ActionTypes.REMOVE\_LAYER, idx: idx}**

### reorderLayer

Reorder layer, order is an array of layer indexes, index 0 will be the one at the bottom

* **ActionTypes**: [`ActionTypes.REORDER_LAYER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.reorderLayerUpdater`](../reducers/vis-state.md#visstateupdatersreorderlayerupdater)

**Parameters**

* `order` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**&gt;** an array of layer indexes

**Examples**

```javascript
// bring `layers[1]` below `layers[0]`, the sequence layers will be rendered is `1`, `0`, `2`, `3`.
// `1` will be at the bottom, `3` will be at the top.
this.props.dispatch(reorderLayer([1, 0, 2, 3]));
```

Returns **{type: ActionTypes.REORDER\_LAYER, order: order}**

### setEditorMode

Set the map mode

* **ActionTypes**: [`ActionTypes.SET_EDITOR_MODE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.setEditorModeUpdater`](../reducers/vis-state.md#visstateupdatersseteditormodeupdater)

**Parameters**

* `mode` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) one of EDITOR\_MODES

**Examples**

```javascript
import {setMapMode} from 'kepler.gl/actions';
import {EDITOR_MODES} from 'kepler.gl/constants';

this.props.dispatch(setMapMode(EDITOR_MODES.DRAW_POLYGON));
```

### setFilter

Update filter property

* **ActionTypes**: [`ActionTypes.SET_FILTER`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.setFilterUpdater`](../reducers/vis-state.md#visstateupdaterssetfilterupdater)

**Parameters**

* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) -`idx` of filter to be updated
* `prop` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) `prop` of filter, e,g, `dataId`, `name`, `value`
* `value` **any** new value
* `valueIndex` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) array properties like dataset require index in order to improve performance

Returns **{type: ActionTypes.SET\_FILTER, idx: idx, prop: prop, value: value}**

### setFilterPlot

Set the property of a filter plot

* **ActionTypes**: [`ActionTypes.SET_FILTER_PLOT`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.setFilterPlotUpdater`](../reducers/vis-state.md#visstateupdaterssetfilterplotupdater)

**Parameters**

* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) 
* `newProp` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) key value mapping of new prop `{yAxis: 'histogram'}`

Returns **{type: ActionTypes.SET\_FILTER\_PLOT, idx: any, newProp: any}**

### setMapInfo

Set the property of a filter plot

* **ActionTypes**: [`ActionTypes.SET_MAP_INFO`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.setMapInfoUpdater`](../reducers/vis-state.md#visstateupdaterssetmapinfoupdater)

**Parameters**

* `info`  
* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) 
* `newProp` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) key value mapping of new prop `{yAxis: 'histogram'}`

Returns **{type: ActionTypes.SET\_FILTER\_PLOT, idx: any, newProp: any}**

### showDatasetTable

Display dataset table in a modal

* **ActionTypes**: [`ActionTypes.SHOW_DATASET_TABLE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.showDatasetTableUpdater`](../reducers/vis-state.md#visstateupdatersshowdatasettableupdater)

**Parameters**

* `dataId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset id to show in table

Returns **{type: ActionTypes.SHOW\_DATASET\_TABLE, dataId: dataId}**

### toggleFilterAnimation

Start and end filter animation

* **ActionTypes**: [`ActionTypes.TOGGLE_FILTER_ANIMATION`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.toggleFilterAnimationUpdater`](../reducers/vis-state.md#visstateupdaterstogglefilteranimationupdater)

**Parameters**

* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) idx of filter

Returns **{type: ActionTypes.TOGGLE\_FILTER\_ANIMATION, idx: idx}**

### toggleLayerForMap

Toggle visibility of a layer in a split map

* **ActionTypes**: [`ActionTypes.TOGGLE_LAYER_FOR_MAP`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.toggleLayerForMapUpdater`](../reducers/vis-state.md#visstateupdaterstogglelayerformapupdater)

**Parameters**

* `mapIndex` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) index of the split map
* `layerId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of the layer

Returns **{type: ActionTypes.TOGGLE\_LAYER\_FOR\_MAP, mapIndex: any, layerId: any}**

### updateAnimationTime

Reset animation

* **ActionTypes**: [`ActionTypes.UPDATE_ANIMATION_TIME`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.updateAnimationTimeUpdater`](../reducers/vis-state.md#visstateupdatersupdateanimationtimeupdater)

**Parameters**

* `value` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)  Current value of the slider

Returns **{type: ActionTypes.UPDATE\_ANIMATION\_TIME, value: value}**

### updateFilterAnimationSpeed

Change filter animation speed

* **ActionTypes**: [`ActionTypes.UPDATE_FILTER_ANIMATION_SPEED`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.updateFilterAnimationSpeedUpdater`](../reducers/vis-state.md#visstateupdatersupdatefilteranimationspeedupdater)

**Parameters**

* `idx` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)  `idx` of filter
* `speed` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) `speed` to change it to. `speed` is a multiplier

Returns **{type: ActionTypes.UPDATE\_FILTER\_ANIMATION\_SPEED, idx: idx, speed: speed}**

### updateLayerAnimationSpeed

update trip layer animation speed

* **ActionTypes**: [`ActionTypes.UPDATE_LAYER_ANIMATION_SPEED`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.updateLayerAnimationSpeedUpdater`](../reducers/vis-state.md#visstateupdatersupdatelayeranimationspeedupdater)

**Parameters**

* `speed` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) `speed` to change it to. `speed` is a multiplier

Returns **{type: ActionTypes.UPDATE\_LAYER\_ANIMATION\_SPEED, speed: speed}**

### updateLayerBlending

Update layer blending mode

* **ActionTypes**: [`ActionTypes.UPDATE_LAYER_BLENDING`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.updateLayerBlendingUpdater`](../reducers/vis-state.md#visstateupdatersupdatelayerblendingupdater)

**Parameters**

* `mode` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) one of `additive`, `normal` and `subtractive`

Returns **{type: ActionTypes.UPDATE\_LAYER\_BLENDING, mode: mode}**

### updateVisData

Add new dataset to `visState`, with option to load a map config along with the datasets

* **ActionTypes**: [`ActionTypes.UPDATE_VIS_DATA`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.updateVisDataUpdater`](../reducers/vis-state.md#visstateupdatersupdatevisdataupdater)

**Parameters**

* `datasets` **\(**[**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt; \|** [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**\)** **\*required** datasets can be a dataset or an array of datasets

  Each dataset object needs to have `info` and `data` property.

  * `datasets.info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) -info of a dataset
    * `datasets.info.id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of this dataset. If config is defined, `id` should matches the `dataId` in config.
    * `datasets.info.label` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) A display name of this dataset
  * `datasets.data` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) **\*required** The data object, in a tabular format with 2 properties `fields` and `rows`
    * `datasets.data.fields` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt;** **\*required** Array of fields,
      * `datasets.data.fields.name` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\*required** Name of the field,
    * `datasets.data.rows` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&gt;** **\*required** Array of rows, in a tabular format with `fields` and `rows`

* `options` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `options.centerMap` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) `default: true` if `centerMap` is set to `true` kepler.gl will

    place the map view within the data points boundaries

  * `options.readOnly` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) `default: false` if `readOnly` is set to `true`

    the left setting panel will be hidden
* `config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}

Returns **{type: ActionTypes.UPDATE\_VIS\_DATA, datasets: datasets, options: options, config: config}**

## uiStateActions

Actions handled mostly by `uiState` reducer. They manage UI changes in tha app, such as open and close side panel, switch between tabs in the side panel, open and close modal dialog for exporting data / images etc. It also manges which settings are selected during image and map export

### addNotification

Add a notification to be displayed

* **ActionTypes**: [`ActionTypes.ADD_NOTIFICATION`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.addNotificationUpdater`](../reducers/ui-state.md#uistateupdatersaddnotificationupdater)

**Parameters**

* `notification` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) The `notification` object to be added

### cleanupExportImage

Delete cached export image

* **ActionTypes**: [`ActionTypes.CLEANUP_EXPORT_IMAGE`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.cleanupExportImage`](../reducers/ui-state.md#uistateupdaterscleanupexportimage)

### hideExportDropdown

Hide side panel header dropdown, activated by clicking the share link on top of the side panel

* **ActionTypes**: [`ActionTypes.HIDE_EXPORT_DROPDOWN`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.hideExportDropdownUpdater`](../reducers/ui-state.md#uistateupdatershideexportdropdownupdater)

### openDeleteModal

Toggle active map control panel

* **ActionTypes**: [`ActionTypes.OPEN_DELETE_MODAL`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.openDeleteModalUpdater`](../reducers/ui-state.md#uistateupdatersopendeletemodalupdater)

**Parameters**

* `datasetId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) `id` of the dataset to be deleted

### removeNotification

Remove a notification

* **ActionTypes**: [`ActionTypes.REMOVE_NOTIFICATION`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.removeNotificationUpdater`](../reducers/ui-state.md#uistateupdatersremovenotificationupdater)

**Parameters**

* `id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) `id` of the notification to be removed

### setExportData

Whether to including data in map config, toggle between `true` or `false`

* **ActionTypes**: [`ActionTypes.SET_EXPORT_DATA`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.setExportDataUpdater`](../reducers/ui-state.md#uistateupdaterssetexportdataupdater)

### setExportDataType

Set data format for exporting data

* **ActionTypes**: [`ActionTypes.SET_EXPORT_DATA_TYPE`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.setExportDataTypeUpdater`](../reducers/ui-state.md#uistateupdaterssetexportdatatypeupdater)

**Parameters**

* `dataType` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) one of `'text/csv'`

### setExportFiltered

Whether to export filtered data, `true` or `false`

* **ActionTypes**: [`ActionTypes.SET_EXPORT_FILTERED`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.setExportFilteredUpdater`](../reducers/ui-state.md#uistateupdaterssetexportfilteredupdater)

**Parameters**

* `payload` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) set `true` to ony export filtered data

### setExportImageDataUri

Set `exportImage.setExportImageDataUri` to a dataUri

* **ActionTypes**: [`ActionTypes.SET_EXPORT_IMAGE_DATA_URI`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.setExportImageDataUri`](../reducers/ui-state.md#uistateupdaterssetexportimagedatauri)

**Parameters**

* `dataUri` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) export image data uri

### setExportImageSetting

Set `exportImage` settings: ratio, resolution, legend

* **ActionTypes**: [`ActionTypes.SET_EXPORT_IMAGE_SETTING`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.setExportImageSetting`](../reducers/ui-state.md#uistateupdaterssetexportimagesetting)

**Parameters**

* `newSetting` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) {ratio: '1x'}

### setExportSelectedDataset

Set selected dataset for export

* **ActionTypes**: [`ActionTypes.SET_EXPORT_SELECTED_DATASET`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.setExportSelectedDatasetUpdater`](../reducers/ui-state.md#uistateupdaterssetexportselecteddatasetupdater)

**Parameters**

* `datasetId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset id

### setUserMapboxAccessToken

Whether we export a mapbox access token used to create a single map html file

* **ActionTypes**: [`ActionTypes.SET_USER_MAPBOX_ACCESS_TOKEN`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.setUserMapboxAccessTokenUpdater`](../reducers/ui-state.md#uistateupdaterssetusermapboxaccesstokenupdater)

**Parameters**

* `payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) mapbox access token

### showExportDropdown

Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel

* **ActionTypes**: [`ActionTypes.SHOW_EXPORT_DROPDOWN`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.showExportDropdownUpdater`](../reducers/ui-state.md#uistateupdatersshowexportdropdownupdater)

**Parameters**

* `id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of the dropdown

### startExportingImage

Set `exportImage.exporting` to true

* **ActionTypes**: [`ActionTypes.START_EXPORTING_IMAGE`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.startExportingImage`](../reducers/ui-state.md#uistateupdatersstartexportingimage)

### toggleMapControl

Toggle active map control panel

* **ActionTypes**: [`ActionTypes.TOGGLE_MAP_CONTROL`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.toggleMapControlUpdater`](../reducers/ui-state.md#uistateupdaterstogglemapcontrolupdater)

**Parameters**

* `panelId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](actions.md#default_map_controls)

### toggleModal

Show and hide modal dialog

* **ActionTypes**: [`ActionTypes.TOGGLE_MODAL`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.toggleModalUpdater`](../reducers/ui-state.md#uistateupdaterstogglemodalupdater)

**Parameters**

* `id` **\(**[**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\| null\)** id of modal to be shown, null to hide modals. One of:-   [`DATA_TABLE_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#data_table_id)
  * [`DELETE_DATA_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#delete_data_id)
  * [`ADD_DATA_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#add_data_id)
  * [`EXPORT_IMAGE_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#export_image_id)
  * [`EXPORT_DATA_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#export_data_id)
  * [`ADD_MAP_STYLE_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#add_map_style_id)

### toggleSidePanel

Toggle active side panel

* **ActionTypes**: [`ActionTypes.TOGGLE_SIDE_PANEL`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.toggleSidePanelUpdater`](../reducers/ui-state.md#uistateupdaterstogglesidepanelupdater)

**Parameters**

* `id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`

## rootActions

Root actions managers adding and removing instances in root reducer. Under-the-hood, when a `KeplerGl` component is mounted or unmounted, it will automatically calls these actions to add itself to the root reducer. However, sometimes the data is ready before the component is registered in the reducer, in this case, you can manually call these actions or the corresponding updater to add it to the reducer.

### deleteEntry

Delete an instance from `keplerGlReducer`. This action is called under-the-hood when a `KeplerGl` component is **un-mounted** to the dom. If `mint` is set to be `true` in the component prop, the instance state will be deleted from the root reducer. Otherwise, the root reducer will keep the instance state and later transfer it to a newly mounted component with the same `id`

* **ActionTypes**: [`ActionTypes.DELETE_ENTRY`](actions.md#actiontypes)
* **Updaters**: 

**Parameters**

* `id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) the id of the instance to be deleted

### registerEntry

Add a new kepler.gl instance in `keplerGlReducer`. This action is called under-the-hood when a `KeplerGl` component is **mounted** to the dom. Note that if you dispatch actions such as adding data to a kepler.gl instance before the React component is mounted, the action will not be performed. Instance reducer can only handle actions when it is instantiated.

* **ActionTypes**: [`ActionTypes.REGISTER_ENTRY`](actions.md#actiontypes)
* **Updaters**: 

**Parameters**

* `payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `payload.id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\*required** The id of the instance
  * `payload.mint` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Whether to use a fresh empty state, when `mint: true` it will _always_ load a fresh state when the component is re-mounted.

    When `mint: false` it will register with existing instance state under the same `id`, when the component is unmounted then mounted again. Default: `true`

  * `payload.mapboxApiAccessToken` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) mapboxApiAccessToken to be saved in `map-style` reducer.
  * `payload.mapboxApiUrl` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) mapboxApiUrl to be saved in `map-style` reducer.
  * `payload.mapStylesReplaceDefault` [**Boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) mapStylesReplaceDefault to be saved in `map-style` reducer.

### renameEntry

Rename an instance in the root reducer, keep its entire state

* **ActionTypes**: [`ActionTypes.RENAME_ENTRY`](actions.md#actiontypes)
* **Updaters**: 

**Parameters**

* `oldId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\*required** old id
* `newId` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\*required** new id

## mapStateActions

Actions handled mostly by `mapState` reducer. They manage map viewport update, toggle between 2d and 3d map, toggle between single and split maps.

### fitBounds

Fit map viewport to bounds

* **ActionTypes**: [`ActionTypes.FIT_BOUNDS`](actions.md#actiontypes)
* **Updaters**: [`mapStateUpdaters.fitBoundsUpdater`](../reducers/map-state.md#mapstateupdatersfitboundsupdater)

**Parameters**

* `bounds` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**&gt;** as `[lngMin, latMin, lngMax, latMax]`

**Examples**

```javascript
import {fitBounds} from 'kepler.gl/actions';
this.props.dispatch(fitBounds([-122.23, 37.127, -122.11, 37.456]));
```

### togglePerspective

Toggle between 3d and 2d map.

* **ActionTypes**: [`ActionTypes.TOGGLE_PERSPECTIVE`](actions.md#actiontypes)
* **Updaters**: [`mapStateUpdaters.togglePerspectiveUpdater`](../reducers/map-state.md#mapstateupdaterstoggleperspectiveupdater)

**Examples**

```javascript
import {togglePerspective} from 'kepler.gl/actions';
this.props.dispatch(togglePerspective());
```

### toggleSplitMap

Toggle between single map or split maps

* **ActionTypes**: [`ActionTypes.TOGGLE_SPLIT_MAP`](actions.md#actiontypes)
* **Updaters**: [`mapStateUpdaters.toggleSplitMapUpdater`](../reducers/map-state.md#mapstateupdaterstogglesplitmapupdater), [`uiStateUpdaters.toggleSplitMapUpdater`](../reducers/ui-state.md#uistateupdaterstogglesplitmapupdater), [`visStateUpdaters.toggleSplitMapUpdater`](../reducers/vis-state.md#visstateupdaterstogglesplitmapupdater)

**Parameters**

* `index` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**?** index is provided, close split map at index

**Examples**

```javascript
import {toggleSplitMap} from 'kepler.gl/actions';
this.props.dispatch(toggleSplitMap());
```

### updateMap

Update map viewport

* **ActionTypes**: [`ActionTypes.UPDATE_MAP`](actions.md#actiontypes)
* **Updaters**: [`mapStateUpdaters.updateMapUpdater`](../reducers/map-state.md#mapstateupdatersupdatemapupdater)

**Parameters**

* `viewport` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) viewport object container one or any of these properties `width`, `height`, `latitude` `longitude`, `zoom`, `pitch`, `bearing`, `dragRotate`
  * `viewport.width` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**?** Width of viewport
  * `viewport.height` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**?** Height of viewport
  * `viewport.zoom` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**?** Zoom of viewport
  * `viewport.pitch` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**?** Camera angle in degrees \(0 is straight down\)
  * `viewport.bearing` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**?** Map rotation in degrees \(0 means north is up\)
  * `viewport.latitude` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**?** Latitude center of viewport on map in mercator projection
  * `viewport.longitude` [**Number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**?** Longitude Center of viewport on map in mercator projection
  * `viewport.dragRotate` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**?** Whether to enable drag and rotate map into perspective viewport

**Examples**

```javascript
import {updateMap} from 'kepler.gl/actions';
this.props.dispatch(updateMap({latitude: 37.75043, longitude: -122.34679, width: 800, height: 1200}));
```

## layerColorUIChange

Set the color palette ui for layer color

* **ActionTypes**: [`ActionTypes.LAYER_COLOR_UI_CHANGE`](actions.md#actiontypes)
* **Updaters**: [`visStateUpdaters.layerColorUIChangeUpdater`](../reducers/vis-state.md#visstateupdaterslayercoloruichangeupdater)

**Parameters**

* `oldLayer` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) layer to be updated
* `prop` [**String**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) which color prop
* `newConfig` [**object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) to be merged

## setExportMapFormat

Set the export map format \(html, json\)

* **ActionTypes**: [`ActionTypes.SET_EXPORT_MAP_FORMAT`](actions.md#actiontypes)
* **Updaters**: [`uiStateUpdaters.setExportMapFormatUpdater`](../reducers/ui-state.md#uistateupdaterssetexportmapformatupdater)

**Parameters**

* `payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) map format

