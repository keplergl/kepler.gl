# Saving and Loading Maps with Schema Manager

![Processor and Schema][processor-schema]

Kepler.gl provides a schema manager to save and load maps. It converts current map data and configuration into a smaller JSON blob. You can then load that JSON blob into an empty map by passing it to `addDataToMap`.

The reason kepler.gl provides a Schema manager is to make it easy for users to connect the kepler.gl client app to any database, saving map data / config and later load it back. With the schema manager, a map saved in an older version can still be parsed and loaded with the latest kepler.gl library.

### Save map

Pass the **instanceState** to `SchemaManager.save()`

- `SchemaManager.save()` will output a JSON blob including data and config.

Under the hood, `SchemaManager.save()` calls `SchemaManager.getDatasetToSave()` and `SchemaManager.getConfigToSave()`
- `SchemaManager.getDatasetToSave()` will output an array of dataset.
- `SchemaManager.getConfigToSave()` will output a JSON blob of the current config.

In the example below, `foo` is the id of the KeplerGl instance to be save.

```js
import KeplerGlSchema from '@kepler.gl/schemas';

const mapToSave = KeplerGlSchema.save(state.keplerGl.foo);
// mapToSave = {datasets: [], config: {}, info: {}};

const dataToSave = KeplerGlSchema.getDatasetToSave(state.keplerGl.foo);
// dataToSave = [{version: '', data: {id, label, color, allData, fields}}]

const configToSave = KeplerGlSchema.getConfigToSave(state.keplerGl.foo);
// configToSave = {version: '', config: {}}
```

### Observe saved configuration changes

To react to changes such as hiding a layer or changing its color, subscribe to your embedding app's Redux store. Read the Kepler instance by its component ID and compare snapshots from `getConfigToSave()`, rather than checking whether the whole Redux state or a layer object changed.

```js
import KeplerGlSchema from '@kepler.gl/schemas';

function observeSavedConfig(store, mapId, onChange) {
  const readConfig = () => {
    const map = store.getState().keplerGl?.[mapId];
    return map ? JSON.stringify(KeplerGlSchema.getConfigToSave(map)) : undefined;
  };

  let previous = readConfig();
  let timer;

  const unsubscribe = store.subscribe(() => {
    if (timer !== undefined) return;

    // Read the latest state once per burst, not after every dispatched action.
    timer = setTimeout(() => {
      timer = undefined;
      const next = readConfig();
      if (next === previous) return;

      const wasMounted = previous !== undefined;
      previous = next;
      if (wasMounted && next !== undefined) onChange(JSON.parse(next));
    }, 100);
  });

  return () => {
    unsubscribe();
    clearTimeout(timer);
  };
}

// Use the same ID as <KeplerGl id="foo" />.
const stopObserving = observeSavedConfig(store, 'foo', config => {
  // For example, a layer's visibility or color changed.
  console.log('Saved map configuration changed', config);
});

// Call stopObserving() when the host no longer needs updates.
```

The first snapshot establishes a baseline. The callback reports the latest saved configuration, so it also sees programmatic edits and saved camera changes, not just gestures in the layer panel. If you only care about layer settings, compare `getConfigToSave(map).config.visState.layers` instead. The comparison does not serialize dataset rows; use `save()` separately when you need to persist datasets as well.

### Load map
Pass saved data and config to `SchemaManager.load()`
- `SchemaManager.load()` will parsed saved config and data, apply version control, the output can then be passed to `addDataToMap` directly.

Under the hood, `SchemaManager.load()` calls `SchemaManager.parseSavedData()` and `SchemaManager.parseSavedConfig()`

- `SchemaManager.parseSavedData()` will output an array of parsed dataset.
- `SchemaManager.parseSavedConfig()` will output a JSON blob of the parsed config.

```js
import KeplerGlSchema from '@kepler.gl/schemas';
import {addDataToMap} from '@kepler.gl/actions';

const mapToLoad = KeplerGlSchema.load(savedDatasets, savedConfig);
// mapToLoad = {datasets: [], config: {}};

this.props.dispatch(addDataToMap(mapToLoad));
```

### Match config with another dataset

Often times, people want to keep a map config as template, then load it with different datasets. To match a config with a different dataset, you need to make sure `data.id` in the new dataset matches the old one.

```js
import KeplerGlSchema from '@kepler.gl/schemas';
import {addDataToMap} from '@kepler.gl/actions';

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
