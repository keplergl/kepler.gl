# ui-state

### Table of Contents

* [uiStateUpdaters](ui-state.md#uistateupdaters)
  * [addNotificationUpdater](ui-state.md#addnotificationupdater)
  * [cleanupExportImage](ui-state.md#cleanupexportimage)
  * [DEFAULT\_EXPORT\_DATA](ui-state.md#default_export_data)
  * [DEFAULT\_EXPORT\_IMAGE](ui-state.md#default_export_image)
  * [DEFAULT\_MAP\_CONTROLS\_FEATURES](ui-state.md#default_map_controls_features)
  * [hideExportDropdownUpdater](ui-state.md#hideexportdropdownupdater)
  * [INITIAL\_UI\_STATE](ui-state.md#initial_ui_state)
  * [loadFilesErrUpdater](ui-state.md#loadfileserrupdater)
  * [loadFilesUpdater](ui-state.md#loadfilesupdater)
  * [openDeleteModalUpdater](ui-state.md#opendeletemodalupdater)
  * [removeNotificationUpdater](ui-state.md#removenotificationupdater)
  * [setExportDataTypeUpdater](ui-state.md#setexportdatatypeupdater)
  * [setExportDataUpdater](ui-state.md#setexportdataupdater)
  * [setExportFilteredUpdater](ui-state.md#setexportfilteredupdater)
  * [setExportImageDataUri](ui-state.md#setexportimagedatauri)
  * [setExportImageSetting](ui-state.md#setexportimagesetting)
  * [setExportSelectedDatasetUpdater](ui-state.md#setexportselecteddatasetupdater)
  * [showExportDropdownUpdater](ui-state.md#showexportdropdownupdater)
  * [startExportingImage](ui-state.md#startexportingimage)
  * [toggleMapControlUpdater](ui-state.md#togglemapcontrolupdater)
  * [toggleModalUpdater](ui-state.md#togglemodalupdater)
  * [toggleSidePanelUpdater](ui-state.md#togglesidepanelupdater)
  * [toggleSplitMapUpdater](ui-state.md#togglesplitmapupdater)
* [DEFAULT\_EXPORT\_HTML](ui-state.md#default_export_html)
* [setUserMapboxAccessTokenUpdater](ui-state.md#setusermapboxaccesstokenupdater)

## uiStateUpdaters

Updaters for `uiState` reducer. Can be used in your root reducer to directly modify kepler.gl's state. Read more about [Using updaters](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/advanced-usage/using-updaters.md)

**Examples**

```javascript
import keplerGlReducer, {uiStateUpdaters} from 'kepler.gl/reducers';
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
            uiState: uiStateUpdaters.toggleSidePanelUpdater(
              uiState, {payload: null}
            )
         }
       }
     };
 }
 return reducers(state, action);
};

export default composedReducer;
```

### addNotificationUpdater

Add a notification to be displayed

* **Action**: [`addNotification`](../actions/actions.md#addnotification)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### cleanupExportImage

Delete cached export image

* **Action**: [`cleanupExportImage`](../actions/actions.md#cleanupexportimage)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### DEFAULT\_EXPORT\_DATA

Default initial `exportData` settings

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

* `selectedDataset` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: `''`,
* `dataType` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: `'csv'`,
* `filtered` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Default: `true`,
* `config` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) deprecated
* `data` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) used in modal config export. Default: `false`

### DEFAULT\_EXPORT\_IMAGE

Default image export config

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

* `ratio` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: `'SCREEN'`,
* `resolution` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: `'ONE_X'`,
* `legend` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Default: `false`,
* `imageDataUri` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: `''`,
* `exporting` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Default: `false`
* `error` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Default: `false`

### DEFAULT\_MAP\_CONTROLS\_FEATURES

A list of map control visibility and whether is it active.

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

* `visibleLayers` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: `{show: true, active: false}`
* `mapLegend` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: `{show: true, active: false}`
* `toggle3d` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: `{show: true}`
* `splitMap` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: `{show: true}`

### hideExportDropdownUpdater

Hide side panel header dropdown, activated by clicking the share link on top of the side panel

* **Action**: [`hideExportDropdown`](../actions/actions.md#hideexportdropdown)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### INITIAL\_UI\_STATE

Default initial `uiState`

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

* `readOnly` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Default: `false`
* `activeSidePanel` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: `'layer'`
* `currentModal` **\(**[**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\| null\)** Default: `'addData'`
* `datasetKeyToRemove` **\(**[**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\| null\)** Default: `null`
* `visibleDropdown` **\(**[**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\| null\)** Default: `null`
* `exportImage` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: [`DEFAULT_EXPORT_IMAGE`](ui-state.md#default_export_image)
* `exportData` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: [`DEFAULT_EXPORT_DATA`](ui-state.md#default_export_data)
* `mapControls` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Default: [`DEFAULT_MAP_CONTROLS`](ui-state.md#default_map_controls)
* `activeMapIndex` [**number**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) defines which map the user clicked on. Default: 0

### loadFilesErrUpdater

Handles load file error and set fileLoading property to false

* **Action**: [`loadFilesErr`](../actions/actions.md#loadfileserr)

**Parameters**

* `state`  
* `error` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `error.error`  

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### loadFilesUpdater

Fired when file loading begin

* **Action**: [`loadFiles`](../actions/actions.md#loadfiles)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### openDeleteModalUpdater

Toggle active map control panel

* **Action**: [`openDeleteModal`](../actions/actions.md#opendeletemodal)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset id

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### removeNotificationUpdater

Remove a notification

* **Action**: [`removeNotification`](../actions/actions.md#removenotification)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**String**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of the notification to be removed

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setExportDataTypeUpdater

Set data format for exporting data

* **Action**: [`setExportDataType`](../actions/actions.md#setexportdatatype)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) one of `'text/csv'`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setExportDataUpdater

Whether to including data in map config, toggle between `true` or `false`

* **Action**: [`setExportData`](../actions/actions.md#setexportdata)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setExportFilteredUpdater

Whether to export filtered data, `true` or `false`

* **Action**: [`setExportFiltered`](../actions/actions.md#setexportfiltered)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**boolean**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setExportImageDataUri

Set `exportImage.setExportImageDataUri` to a image dataUri

* **Action**: [`setExportImageDataUri`](../actions/actions.md#setexportimagedatauri)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) export image data uri

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setExportImageSetting

Set `exportImage.legend` to `true` or `false`

* **Action**: [`setExportImageSetting`](../actions/actions.md#setexportimagesetting)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `$1` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `$1.payload`  

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### setExportSelectedDatasetUpdater

Set selected dataset for export

* **Action**: [`setExportSelectedDataset`](../actions/actions.md#setexportselecteddataset)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) dataset id

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### showExportDropdownUpdater

Hide and show side panel header dropdown, activated by clicking the share link on top of the side panel

* **Action**: [`showExportDropdown`](../actions/actions.md#showexportdropdown)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of the dropdown

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### startExportingImage

Set `exportImage.exporting` to `true`

* **Action**: [`startExportingImage`](../actions/actions.md#startexportingimage)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### toggleMapControlUpdater

Toggle active map control panel

* **Action**: [`toggleMapControl`](../actions/actions.md#togglemapcontrol)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) action
  * `action.payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) map control panel id, one of the keys of: [`DEFAULT_MAP_CONTROLS`](ui-state.md#default_map_controls)
  * `action.payload.panelId`  
  * `action.payload.index`   \(optional, default `0`\)

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### toggleModalUpdater

Show and hide modal dialog

* **Action**: [`toggleModal`](../actions/actions.md#togglemodal)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` **\(**[**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\| null\)** id of modal to be shown, null to hide modals. One of:-   [`DATA_TABLE_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#data_table_id)
    * [`DELETE_DATA_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#delete_data_id)
    * [`ADD_DATA_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#add_data_id)
    * [`EXPORT_IMAGE_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#export_image_id)
    * [`EXPORT_DATA_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#export_data_id)
    * [`ADD_MAP_STYLE_ID`](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/constants/default-settings.md#add_map_style_id)

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### toggleSidePanelUpdater

Toggle active side panel

* **Action**: [`toggleSidePanel`](../actions/actions.md#togglesidepanel)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` **\(**[**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\| null\)** id of side panel to be shown, one of `layer`, `filter`, `interaction`, `map`. close side panel if `null`

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

### toggleSplitMapUpdater

Handles toggle map split and reset all map control index to 0

* **Action**: [`toggleSplitMap`](../actions/actions.md#togglesplitmap)

**Parameters**

* `state`  

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

## DEFAULT\_EXPORT\_HTML

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

### Properties

* `exportMapboxAccessToken` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: null, this is used when we provide a default mapbox token for users to take advantage of
* `userMapboxToken` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) Default: '', mapbox token provided by user through input field

## setUserMapboxAccessTokenUpdater

whether to export a mapbox access to HTML single page

* **Action**: [`setUserMapboxAccessToken`](../actions/actions.md#setusermapboxaccesstoken)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `uiState`
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) 

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

