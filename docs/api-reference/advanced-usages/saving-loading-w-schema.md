# Saving and Loading Maps with Schema Manager

![Processor and Schema][processor-schema]

Kelper.gl provides a schema manager to save and load maps. It converts current map data and configuration into a smaller JSON blob. You can then load that JSON blob into an empty map by passing it to `addDataToMap`.

The reason kepler.gl provides a Schema manager is to make it easy for users to connect the kepler.gl client app to any database, saving map data / config and later load it back. With the schema manager, a map saved in an older version can still be parsed and loaded with the latest kepler.gl library.

### Save map

Pass the **instanceState** to `SchemaManager.save()`

- `SchemaManager.save()` will output a JSON blob including data and config.

Under the hood, `SchemaManager.save()` calls `SchemaManager.getDatasetToSave()` and `SchemaManager.getConfigToSave()`
- `SchemaManager.getDatasetToSave()` will output an array of dataset.
- `SchemaManager.getConfigToSave()` will output a JSON blob of the current config.

In the example blow, `foo` is the id of the KeplerGl instance to be save.

```js
import KeplerGlSchema from 'kepler.gl/schemas';

const mapToSave = KeplerGlSchema.save(state.keplerGl.foo);
// mapToSave = {datasets: [], config: {}, info: {}};

const dataToSave = KeplerGlSchema.getDatasetToSave(state.keplerGl.foo);
// dataToSave = [{version: '', data: {id, label, color, allData, fields}}]

const configToSave = KeplerGlSchema.getConfigToSave(state.keplerGl.foo);
// configToSave = {version: '', config: {}}
```

### Load map
Pass saved data and config to `SchemaManager.load()`
- `SchemaManager.load()` will parsed saved config and data, apply version control, the output can then be passed to `addDataToMap` directly.

Under the hood, `SchemaManager.load()` calls `SchemaManager.parseSavedData()` and `SchemaManager.parseSavedConfig()`

- `SchemaManager.parseSavedData()` will output an array of parsed dataset.
- `SchemaManager.parseSavedConfig()` will output a JSON blob of the parsed config.

```js
import KeplerGlSchema from 'kepler.gl/schemas';
import {addDataToMap} from 'kepler.gl/actions';

const mapToLoad = KeplerGlSchema.load(savedDatasets, savedConfig);
// mapToLoad = {datasets: [], config: {}};

this.props.dispatch(addDataToMap(mapToLoad));
```

### Match config with another dataset

Often times, people want to keep a map config as template, then load it with different datasets. To match a config with a different dataset, you need to make sure `data.id` in the new dataset matches the old one.

```js
import KeplerGlSchema from 'kepler.gl/schemas';
import {addDataToMap} from 'kepler.gl/actions';

// save current map data and config
const {datasets, config} = KeplerGlSchema.save(state.keplerGl.foo);
// mapToLoad = {datasets: [], config: {}};

// receive some new data
const newData = someNewData;
// newData = [{rows, fields}]

// match id with old datasets
const newDatasets = newData.map((d, i) => ({
  version: datasets[i].version,
  data: {
    ...datasets[i].data,
    allData: d.rows,
    fields: d.fields
  }
}));

// load config with new datasets
const mapToLoad = KeplerGlSchema.load(newDatasets, config);

this.props.dispatch(addDataToMap(mapToLoad));
```

[processor-schema]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/api_load-save.png
