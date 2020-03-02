# combine

### Table of Contents

* [combinedUpdaters](combine.md#combinedupdaters)
  * [addDataToMapUpdater](combine.md#adddatatomapupdater)

## combinedUpdaters

Some actions will affect the entire kepler.lg instance state. The updaters for these actions is exported as `combinedUpdaters`. These updater take the entire instance state as the first argument. Read more about [Using updaters](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/api-reference/advanced-usage/using-updaters.md)

**Examples**

```javascript
import keplerGlReducer, {combinedUpdaters} from 'kepler.gl/reducers';
// Root Reducer
const reducers = combineReducers({
 keplerGl: keplerGlReducer,
 app: appReducer
});

const composedReducer = (state, action) => {
 switch (action.type) {
   // add data to map after receiving data from remote sources
   case 'LOAD_REMOTE_RESOURCE_SUCCESS':
     return {
       ...state,
       keplerGl: {
         ...state.keplerGl,
         // pass in kepler.gl instance state to combinedUpdaters
         map:  combinedUpdaters.addDataToMapUpdater(
          state.keplerGl.map,
          {
            payload: {
              datasets: action.datasets,
              options: {readOnly: true},
              config: action.config
             }
           }
         )
       }
     };
 }
 return reducers(state, action);
};

export default composedReducer;
```

### addDataToMapUpdater

Combine data and full configuration update in a single action

* **Action**: [`addDataToMap`](../actions/actions.md#adddatatomap)

**Parameters**

* `state` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) kepler.gl instance state, containing all subreducer state
* `action` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) 
  * `action.payload` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `{datasets, options, config}`
    * `action.payload.datasets` **\(**[**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt; \|** [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**\)** **\*required** datasets can be a dataset or an array of datasets

      Each dataset object needs to have `info` and `data` property.

      * `action.payload.datasets.info` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) -info of a dataset
        * `action.payload.datasets.info.id` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) id of this dataset. If config is defined, `id` should matches the `dataId` in config.
        * `action.payload.datasets.info.label` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) A display name of this dataset
      * `action.payload.datasets.data` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) **\*required** The data object, in a tabular format with 2 properties `fields` and `rows`
        * `action.payload.datasets.data.fields` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&gt;** **\*required** Array of fields,
          * `action.payload.datasets.data.fields.name` [**string**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) **\*required** Name of the field,
        * `action.payload.datasets.data.rows` [**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&lt;**[**Array**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&gt;** **\*required** Array of rows, in a tabular format with `fields` and `rows`

    * `action.payload.options` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) option object `{centerMap: true}`
    * `action.payload.config` [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) map config

Returns [**Object**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) nextState

