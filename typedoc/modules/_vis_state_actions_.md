[kepler.gl](../README.md) › [Globals](../globals.md) › ["vis-state-actions"](_vis_state_actions_.md)

# Module: "vis-state-actions"

## Index

### Variables

* [visStateActions](_vis_state_actions_.md#const-visstateactions)

### Functions

* [addFilter](_vis_state_actions_.md#addfilter)
* [addLayer](_vis_state_actions_.md#addlayer)
* [applyCPUFilter](_vis_state_actions_.md#applycpufilter)
* [copyTableColumn](_vis_state_actions_.md#copytablecolumn)
* [deleteFeature](_vis_state_actions_.md#deletefeature)
* [enlargeFilter](_vis_state_actions_.md#enlargefilter)
* [interactionConfigChange](_vis_state_actions_.md#interactionconfigchange)
* [layerColorUIChange](_vis_state_actions_.md#layercoloruichange)
* [layerConfigChange](_vis_state_actions_.md#layerconfigchange)
* [layerTextLabelChange](_vis_state_actions_.md#layertextlabelchange)
* [layerTypeChange](_vis_state_actions_.md#layertypechange)
* [layerVisConfigChange](_vis_state_actions_.md#layervisconfigchange)
* [layerVisualChannelConfigChange](_vis_state_actions_.md#layervisualchannelconfigchange)
* [loadFileSuccess](_vis_state_actions_.md#loadfilesuccess)
* [loadFiles](_vis_state_actions_.md#loadfiles)
* [loadFilesErr](_vis_state_actions_.md#loadfileserr)
* [loadNextFile](_vis_state_actions_.md#loadnextfile)
* [onLayerClick](_vis_state_actions_.md#onlayerclick)
* [onLayerHover](_vis_state_actions_.md#onlayerhover)
* [onMapClick](_vis_state_actions_.md#onmapclick)
* [onMouseMove](_vis_state_actions_.md#onmousemove)
* [pinTableColumn](_vis_state_actions_.md#pintablecolumn)
* [removeDataset](_vis_state_actions_.md#removedataset)
* [removeFilter](_vis_state_actions_.md#removefilter)
* [removeLayer](_vis_state_actions_.md#removelayer)
* [reorderLayer](_vis_state_actions_.md#reorderlayer)
* [setEditorMode](_vis_state_actions_.md#seteditormode)
* [setFeatures](_vis_state_actions_.md#setfeatures)
* [setFilter](_vis_state_actions_.md#setfilter)
* [setFilterPlot](_vis_state_actions_.md#setfilterplot)
* [setMapInfo](_vis_state_actions_.md#setmapinfo)
* [setPolygonFilterLayer](_vis_state_actions_.md#setpolygonfilterlayer)
* [setSelectedFeature](_vis_state_actions_.md#setselectedfeature)
* [showDatasetTable](_vis_state_actions_.md#showdatasettable)
* [sortTableColumn](_vis_state_actions_.md#sorttablecolumn)
* [toggleEditorVisibility](_vis_state_actions_.md#toggleeditorvisibility)
* [toggleFilterAnimation](_vis_state_actions_.md#togglefilteranimation)
* [toggleFilterFeature](_vis_state_actions_.md#togglefilterfeature)
* [toggleLayerForMap](_vis_state_actions_.md#togglelayerformap)
* [updateAnimationTime](_vis_state_actions_.md#updateanimationtime)
* [updateFilterAnimationSpeed](_vis_state_actions_.md#updatefilteranimationspeed)
* [updateLayerAnimationSpeed](_vis_state_actions_.md#updatelayeranimationspeed)
* [updateLayerBlending](_vis_state_actions_.md#updatelayerblending)
* [updateVisData](_vis_state_actions_.md#updatevisdata)

## Variables

### `Const` visStateActions

• **visStateActions**: *any* = null

*Defined in [actions/vis-state-actions.js:755](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L755)*

Actions handled mostly by `visState` reducer.
They manage how data is processed, filtered and displayed on the map by operates on layers,
filters and interaction settings.

## Functions

###  addFilter

▸ **addFilter**(`dataId`: string): *object*

*Defined in [actions/vis-state-actions.js:190](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L190)*

Add a new filter

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dataId` | string | dataset `id` this new filter is associated with |

**Returns:** *object*

action

* **dataId**: *string*

* **type**: *ActionTypes.ADD_FILTER*

___

###  addLayer

▸ **addLayer**(`props`: object): *object*

*Defined in [actions/vis-state-actions.js:205](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L205)*

Add a new layer

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | object | new layer props |

**Returns:** *object*

action

* **props**: *object*

* **type**: *ActionTypes.ADD_LAYER*

___

###  applyCPUFilter

▸ **applyCPUFilter**(`dataId`: string | string[]): *object*

*Defined in [actions/vis-state-actions.js:723](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L723)*

Trigger CPU filter of selected dataset

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dataId` | string &#124; string[] | single dataId or an array of dataIds |

**Returns:** *object*

action

* **dataId**: *string | string[]*

* **type**: *ActionTypes.APPLY_CPU_FILTER*

___

###  copyTableColumn

▸ **copyTableColumn**(`dataId`: string, `column`: string): *object*

*Defined in [actions/vis-state-actions.js:335](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L335)*

Copy column, for table display

**Parameters:**

Name | Type |
------ | ------ |
`dataId` | string |
`column` | string |

**Returns:** *object*

action

* **column**: *string*

* **dataId**: *string*

* **type**: *ActionTypes.COPY_TABLE_COLUMN*

___

###  deleteFeature

▸ **deleteFeature**(`feature`: object): *object*

*Defined in [actions/vis-state-actions.js:689](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L689)*

Delete the given feature

**`memberof`** visStateActions

**Parameters:**

▪ **feature**: *object*

Name | Type |
------ | ------ |
`geometry` | object |
`id` | string |
`properties` | any |

**Returns:** *object*

action

* **feature**: *Feature*

* **type**: *ActionTypes.DELETE_FEATURE*

___

###  enlargeFilter

▸ **enlargeFilter**(`idx`: number): *object*

*Defined in [actions/vis-state-actions.js:444](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L444)*

Show larger time filter at bottom for time playback (apply to time filter only)

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idx` | number | index of filter to enlarge |

**Returns:** *object*

action

* **idx**: *number*

* **type**: *ActionTypes.ENLARGE_FILTER*

___

###  interactionConfigChange

▸ **interactionConfigChange**(`config`: object): *object*

*Defined in [actions/vis-state-actions.js:154](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L154)*

Update `interactionConfig`

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | object | new config as key value map: `{tooltip: {enabled: true}}` |

**Returns:** *object*

action

* **config**: *object*

* **type**: *ActionTypes.INTERACTION_CONFIG_CHANGE*

___

###  layerColorUIChange

▸ **layerColorUIChange**(`oldLayer`: object, `prop`: string, `newConfig`: object): *object*

*Defined in [actions/vis-state-actions.js:122](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L122)*

Set the color palette ui for layer color

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`oldLayer` | object | layer to be updated |
`prop` | string | which color prop |
`newConfig` | object | to be merged |

**Returns:** *object*

action

* **newConfig**: *object*

* **oldLayer**: *object*

* **prop**: *string*

* **type**: *ActionTypes.LAYER_COLOR_UI_CHANGE*

___

###  layerConfigChange

▸ **layerConfigChange**(`oldLayer`: object, `newConfig`: object): *object*

*Defined in [actions/vis-state-actions.js:32](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L32)*

Update layer base config: dataId, label, column, isVisible

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`oldLayer` | object | layer to be updated |
`newConfig` | object | new config to be merged with old config |

**Returns:** *object*

action

* **newConfig**: *object*

* **oldLayer**: *object*

* **type**: *ActionTypes.LAYER_CONFIG_CHANGE*

___

###  layerTextLabelChange

▸ **layerTextLabelChange**(`oldLayer`: object, `idx`: number, `prop`: string, `value`: any): *object*

*Defined in [actions/vis-state-actions.js:50](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L50)*

Update layer text label

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`oldLayer` | object | layer to be updated |
`idx` | number | -`idx` of text label to be updated |
`prop` | string | `prop` of text label, e,g, `anchor`, `alignment`, `color`, `size`, `field` |
`value` | any | new value |

**Returns:** *object*

action

* **idx**: *number*

* **oldLayer**: *object*

* **prop**: *string*

* **type**: *ActionTypes.LAYER_TEXT_LABEL_CHANGE*

* **value**: *any*

___

###  layerTypeChange

▸ **layerTypeChange**(`oldLayer`: object, `newType`: string): *object*

*Defined in [actions/vis-state-actions.js:68](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L68)*

Update layer type. Previews layer config will be copied if applicable.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`oldLayer` | object | layer to be updated |
`newType` | string | new type |

**Returns:** *object*

action

* **newType**: *string*

* **oldLayer**: *object*

* **type**: *ActionTypes.LAYER_TYPE_CHANGE*

___

###  layerVisConfigChange

▸ **layerVisConfigChange**(`oldLayer`: any, `newVisConfig`: any): *object*

*Defined in [actions/vis-state-actions.js:104](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L104)*

Update layer `visConfig`

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`oldLayer` | any | layer to be updated |
`newVisConfig` | any | new visConfig as a key value map: e.g. `{opacity: 0.8}` |

**Returns:** *object*

action

* **newVisConfig**: *object*

* **oldLayer**: *object*

* **type**: *ActionTypes.LAYER_VIS_CONFIG_CHANGE*

___

###  layerVisualChannelConfigChange

▸ **layerVisualChannelConfigChange**(`oldLayer`: object, `newConfig`: object, `channel`: string): *object*

*Defined in [actions/vis-state-actions.js:86](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L86)*

Update layer visual channel

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`oldLayer` | object | layer to be updated |
`newConfig` | object | new visual channel config |
`channel` | string | channel to be updated |

**Returns:** *object*

action

* **channel**: *string*

* **newConfig**: *object*

* **oldLayer**: *object*

* **type**: *ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE*

___

###  loadFileSuccess

▸ **loadFileSuccess**(`result`: object[]): *object*

*Defined in [actions/vis-state-actions.js:615](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L615)*

called when all files are processed and loaded

**`memberof`** visStateActions

**Parameters:**

Name | Type |
------ | ------ |
`result` | object[] |

**Returns:** *object*

action

* **result**: *AddDataToMaoPayload[]*

* **type**: *ActionTypes.LOAD_FILES_SUCCESS*

___

###  loadFiles

▸ **loadFiles**(`files`: FileList): *object*

*Defined in [actions/vis-state-actions.js:583](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L583)*

Trigger file loading dispatch `addDataToMap` if succeed, or `loadFilesErr` if failed

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`files` | FileList | array of fileblob |

**Returns:** *object*

action

* **files**: *FileList*

* **type**: *ActionTypes.LOAD_FILES*

___

###  loadFilesErr

▸ **loadFilesErr**(`error`: any): *object*

*Defined in [actions/vis-state-actions.js:630](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L630)*

Trigger loading file error

**`memberof`** visStateActions

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *object*

action

* **error**: *any*

* **type**: *ActionTypes.LOAD_FILES_ERR*

___

###  loadNextFile

▸ **loadNextFile**(`__namedParameters`: object): *object*

*Defined in [actions/vis-state-actions.js:598](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L598)*

Called with next file to load

**`memberof`** visStateActions

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`fileCache` | object[] |
`filesToLoad` | FileList[] |
`onFinish` | any |
`totalCount` | number |

**Returns:** *object*

action

* **fileCache**: *FileCacheItem[]*

* **filesToLoad**: *FileList[]*

* **onFinish**: *function*

* **totalCount**: *number*

* **type**: *ActionTypes.LOAD_NEXT_FILE*

___

###  onLayerClick

▸ **onLayerClick**(`info`: object): *object*

*Defined in [actions/vis-state-actions.js:488](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L488)*

Trigger layer click event with clicked object

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`info` | object | Object clicked, returned by deck.gl |

**Returns:** *object*

action

* **info**: *object*

* **type**: *ActionTypes.LAYER_CLICK*

___

###  onLayerHover

▸ **onLayerHover**(`info`: object): *object*

*Defined in [actions/vis-state-actions.js:473](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L473)*

Trigger layer hover event with hovered object

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`info` | object | Object hovered, returned by deck.gl |

**Returns:** *object*

action

* **info**: *object*

* **type**: *ActionTypes.LAYER_HOVER*

___

###  onMapClick

▸ **onMapClick**(): *any*

*Defined in [actions/vis-state-actions.js:502](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L502)*

Trigger map click event, unselect clicked object

**`memberof`** visStateActions

**Returns:** *any*

action

___

###  onMouseMove

▸ **onMouseMove**(`evt`: any): *object*

*Defined in [actions/vis-state-actions.js:519](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L519)*

Trigger map mouse moveevent, payload would be
React-map-gl PointerEvent
https://uber.github.io/react-map-gl/#/documentation/api-reference/pointer-event

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`evt` | any | PointerEvent |

**Returns:** *object*

action

* **evt**: *any*

* **type**: *ActionTypes.MOUSE_MOVE*

___

###  pinTableColumn

▸ **pinTableColumn**(`dataId`: string, `column`: string): *object*

*Defined in [actions/vis-state-actions.js:319](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L319)*

Pin dataset column, for table display

**Parameters:**

Name | Type |
------ | ------ |
`dataId` | string |
`column` | string |

**Returns:** *object*

action

* **column**: *string*

* **dataId**: *string*

* **type**: *ActionTypes.PIN_TABLE_COLUMN*

___

###  removeDataset

▸ **removeDataset**(`dataId`: string): *object*

*Defined in [actions/vis-state-actions.js:270](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L270)*

Remove a dataset and all layers, filters, tooltip configs that based on it

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dataId` | string | dataset id |

**Returns:** *object*

action

* **dataId**: *string*

* **type**: *ActionTypes.REMOVE_DATASET*

___

###  removeFilter

▸ **removeFilter**(`idx`: number): *object*

*Defined in [actions/vis-state-actions.js:240](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L240)*

Remove a filter from `visState.filters`, once a filter is removed, data will be re-filtered and layer will be updated

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idx` | number | idx of filter to be removed |

**Returns:** *object*

action

* **idx**: *number*

* **type**: *ActionTypes.REMOVE_FILTER*

___

###  removeLayer

▸ **removeLayer**(`idx`: number): *object*

*Defined in [actions/vis-state-actions.js:255](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L255)*

Remove a layer

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idx` | number | idx of layer to be removed |

**Returns:** *object*

action

* **idx**: *number*

* **type**: *ActionTypes.REMOVE_LAYER*

___

###  reorderLayer

▸ **reorderLayer**(`order`: number[]): *object*

*Defined in [actions/vis-state-actions.js:225](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L225)*

Reorder layer, order is an array of layer indexes, index 0 will be the one at the bottom

**`memberof`** visStateActions

**`example`** 

// bring `layers[1]` below `layers[0]`, the sequence layers will be rendered is `1`, `0`, `2`, `3`.
// `1` will be at the bottom, `3` will be at the top.
this.props.dispatch(reorderLayer([1, 0, 2, 3]));

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`order` | number[] | an array of layer indexes |

**Returns:** *object*

action

* **order**: *number[]*

* **type**: *ActionTypes.REORDER_LAYER*

___

###  setEditorMode

▸ **setEditorMode**(`mode`: string): *object*

*Defined in [actions/vis-state-actions.js:708](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L708)*

Set the map mode

**`memberof`** visStateActions

**`example`** 
import {setMapMode} from 'kepler.gl/actions';
import {EDITOR_MODES} from 'kepler.gl/constants';

this.props.dispatch(setMapMode(EDITOR_MODES.DRAW_POLYGON));

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mode` | string | one of EDITOR_MODES |

**Returns:** *object*

action

* **mode**: *string*

* **type**: *ActionTypes.SET_EDITOR_MODE*

___

###  setFeatures

▸ **setFeatures**(`features`: object[]): *object*

*Defined in [actions/vis-state-actions.js:644](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L644)*

Store features to state

**`memberof`** visStateActions

**Parameters:**

Name | Type |
------ | ------ |
`features` | object[] |

**Returns:** *object*

action

* **features**: *Feature[]*

* **type**: *ActionTypes.SET_FEATURES*

___

###  setFilter

▸ **setFilter**(`idx`: number, `prop`: string, `value`: any, `valueIndex`: number): *object*

*Defined in [actions/vis-state-actions.js:172](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L172)*

Update filter property

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idx` | number | -`idx` of filter to be updated |
`prop` | string | `prop` of filter, e,g, `dataId`, `name`, `value` |
`value` | any | new value |
`valueIndex` | number | array properties like dataset require index in order to improve performance |

**Returns:** *object*

action

* **idx**: *number*

* **prop**: *string*

* **type**: *ActionTypes.SET_FILTER*

* **value**: *any*

* **valueIndex**: *number*

___

###  setFilterPlot

▸ **setFilterPlot**(`idx`: number, `newProp`: any): *object*

*Defined in [actions/vis-state-actions.js:552](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L552)*

Set the property of a filter plot

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idx` | number | - |
`newProp` | any | key value mapping of new prop `{yAxis: 'histogram'}` |

**Returns:** *object*

action

* **idx**: *number*

* **newProp**: *object*

* **type**: *ActionTypes.SET_FILTER_PLOT*

___

###  setMapInfo

▸ **setMapInfo**(`info`: any): *object*

*Defined in [actions/vis-state-actions.js:568](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L568)*

Set the property of a filter plot

**`memberof`** visStateActions

**Parameters:**

Name | Type |
------ | ------ |
`info` | any |

**Returns:** *object*

action

* **info**: *any*

* **type**: *ActionTypes.SET_MAP_INFO*

___

###  setPolygonFilterLayer

▸ **setPolygonFilterLayer**(`layer`: Layer‹›, `feature`: object): *object*

*Defined in [actions/vis-state-actions.js:660](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L660)*

It will apply the provide feature as filter to the given layer.
If the given feature is already applied as filter to the layer, it will remove the layer from the filter

**`memberof`** visStateActions

**Parameters:**

▪ **layer**: *Layer‹›*

▪ **feature**: *object*

Name | Type |
------ | ------ |
`geometry` | object |
`id` | string |
`properties` | any |

**Returns:** *object*

action

* **feature**: *Feature*

* **layer**: *Layer*

* **type**: *ActionTypes.SET_POLYGON_FILTER_LAYER*

___

###  setSelectedFeature

▸ **setSelectedFeature**(`feature`: object): *object*

*Defined in [actions/vis-state-actions.js:675](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L675)*

Set the current feature to be edited/deleted

**`memberof`** visStateActions

**Parameters:**

▪ **feature**: *object*

Name | Type |
------ | ------ |
`geometry` | object |
`id` | string |
`properties` | any |

**Returns:** *object*

action

* **feature**: *Feature*

* **type**: *ActionTypes.SET_SELECTED_FEATURE*

___

###  showDatasetTable

▸ **showDatasetTable**(`dataId`: string): *object*

*Defined in [actions/vis-state-actions.js:285](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L285)*

Display dataset table in a modal

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dataId` | string | dataset id to show in table |

**Returns:** *object*

action

* **dataId**: *string*

* **type**: *ActionTypes.SHOW_DATASET_TABLE*

___

###  sortTableColumn

▸ **sortTableColumn**(`dataId`: string, `column`: string, `mode`: string): *object*

*Defined in [actions/vis-state-actions.js:302](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L302)*

Sort dataset column, for table display

**`memberof`** visStateActions

**Parameters:**

Name | Type |
------ | ------ |
`dataId` | string |
`column` | string |
`mode` | string |

**Returns:** *object*

action

* **column**: *string*

* **dataId**: *string*

* **mode**: *string*

* **type**: *ActionTypes.SORT_TABLE_COLUMN*

___

###  toggleEditorVisibility

▸ **toggleEditorVisibility**(): *object*

*Defined in [actions/vis-state-actions.js:737](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L737)*

Toggle editor layer visibility

**`memberof`** visStateActions

**Returns:** *object*

action

* **type**: *ActionTypes.TOGGLE_EDITOR_VISIBILITY*

___

###  toggleFilterAnimation

▸ **toggleFilterAnimation**(`idx`: number): *object*

*Defined in [actions/vis-state-actions.js:382](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L382)*

Start and end filter animation

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idx` | number | of filter |

**Returns:** *object*

action

* **idx**: *any*

* **type**: *ActionTypes.TOGGLE_FILTER_ANIMATION*

___

###  toggleFilterFeature

▸ **toggleFilterFeature**(`idx`: number): *object*

*Defined in [actions/vis-state-actions.js:458](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L458)*

Show/hide filter feature on map

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idx` | number | index of filter feature to show/hide |

**Returns:** *object*

action

* **idx**: *number*

* **type**: *ActionTypes.TOGGLE_FILTER_FEATURE*

___

###  toggleLayerForMap

▸ **toggleLayerForMap**(`mapIndex`: number, `layerId`: string): *object*

*Defined in [actions/vis-state-actions.js:535](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L535)*

Toggle visibility of a layer in a split map

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mapIndex` | number | index of the split map |
`layerId` | string | id of the layer |

**Returns:** *object*

action

* **layerId**: *string*

* **mapIndex**: *number*

* **type**: *ActionTypes.TOGGLE_LAYER_FOR_MAP*

___

###  updateAnimationTime

▸ **updateAnimationTime**(`value`: number): *object*

*Defined in [actions/vis-state-actions.js:414](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L414)*

Reset animation

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | number | Current value of the slider |

**Returns:** *object*

action

* **type**: *ActionTypes.UPDATE_ANIMATION_TIME*

* **value**: *number*

___

###  updateFilterAnimationSpeed

▸ **updateFilterAnimationSpeed**(`idx`: number, `speed`: number): *object*

*Defined in [actions/vis-state-actions.js:398](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L398)*

Change filter animation speed

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`idx` | number | `idx` of filter |
`speed` | number | `speed` to change it to. `speed` is a multiplier |

**Returns:** *object*

action

* **idx**: *number*

* **speed**: *number*

* **type**: *ActionTypes.UPDATE_FILTER_ANIMATION_SPEED*

___

###  updateLayerAnimationSpeed

▸ **updateLayerAnimationSpeed**(`speed`: number): *object*

*Defined in [actions/vis-state-actions.js:429](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L429)*

update trip layer animation speed

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`speed` | number | `speed` to change it to. `speed` is a multiplier |

**Returns:** *object*

action

* **speed**: *number*

* **type**: *ActionTypes.UPDATE_LAYER_ANIMATION_SPEED*

___

###  updateLayerBlending

▸ **updateLayerBlending**(`mode`: "additive" | "normal" | "subtractive"): *object*

*Defined in [actions/vis-state-actions.js:139](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L139)*

Update layer blending mode

**`memberof`** visStateActions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mode` | "additive" &#124; "normal" &#124; "subtractive" | one of `additive`, `normal` and `subtractive` |

**Returns:** *object*

action

* **mode**: *string*

* **type**: *ActionTypes.UPDATE_LAYER_BLENDING*

___

###  updateVisData

▸ **updateVisData**(`datasets`: KeplerProtoDataset[], `options`: object, `config`: object): *object & object*

*Defined in [actions/vis-state-actions.js:365](https://github.com/keplergl/kepler.gl/blob/c21f0e57/src/actions/vis-state-actions.js#L365)*

Add new dataset to `visState`, with option to load a map config along with the datasets

**`memberof`** visStateActions

**Parameters:**

▪ **datasets**: *KeplerProtoDataset[]*

***required** datasets can be a dataset or an array of datasets
Each dataset object needs to have `info` and `data` property.

▪ **options**: *object*

▪ **config**: *object*

this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}

Name | Type |
------ | ------ |
`mapState?` | undefined &#124; object |
`mapStyle?` | undefined &#124; object |
`visState?` | undefined &#124; object |

**Returns:** *object & object*

action
