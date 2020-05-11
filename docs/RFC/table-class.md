Replace kepler.gl dataset with table class

## Current Dataset structure
```js
export type KeplerDataset = {
  id: string;
  label: string;
  color: number[]; // rgb

  // fields and row
  fields: KeplerField[];
  allData: any[][];

  // for Filter
  allIndexes: number[];
  filteredIndex: number[];
  filteredIndexForDomain: number[];

  gpuFilter: {
    filterRange: number[][];
    filterValueUpdateTriggers: any;
    filterValueAccessor: any;
  };
  filterRecord: {
    dynamicDomain: any;
    fixedDomain: any;
    cpu: any;
    gpu: any;
  };
  changedFilters: any;

  // for suggest lat + lng column pairs, and can be extend to also support auto assign visuals
  fieldPairs: {
    defaultName: string;
    pair: any;
    suffix: string[];
  }[];

  // table-injected metadata
  metadata?: object;
};

export type KeplerField = {
  analyzerType: string;
  id: string;
  name: string;
  format: string;
  tableFieldIndex: numberstring;
  type: string;

  // meta data, storing domain and mappedValues
  filterProps?: any;
};

```




### Table class should handle:

#### Add and remove columns (partially supported)

Missing features
  - Copy over column meta, if replacing an existing column
  - Recompute fieldPairs


#### Current kepler.gl methods:

1. `initalize`

to replace utils/dataset-utils `createNewDataEntry` This table method takes a `ProtoTable` and return a `Table` to be saved in kepler state.

```js
table.initalize(protoTable)

// following meta data should be initialized 
table.allIndexes,
table.filteredIndex,
table.filteredIndexForDomain,
table.fieldPairs,
table.gpuFilter
```

3. `getValue(columnName, rowIdx)`
Should be a curried function
getValue(columName) = idx => value

2. `getColumnDomain(columnName)`

to replace `filter-utils.js` `getFieldDomain`
Get the field domain used in filter

3. `getColumnScaleDomain(columnName, scaleType)`
to replace `base-layer.js` `layer.calculateLayerDomain`
Get the domain of this column based on scale type

4. `getSampleData(rows)`
Get a sample of rows to calculate layer boundaries

5. `parseFieldValue(value, type) => string`

Parse field value and type and return a string representation
@param {string} value the field value
@param {string} type the field type

6. `sortDatasetByColumn`