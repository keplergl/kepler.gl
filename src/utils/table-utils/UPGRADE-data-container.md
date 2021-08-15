# Upgrade Guide for Data Containers

### Major changes
- `KeplerTable.allData: any[][]` is substituted with `KeplerTable.dataContainer: DataContainerInterface`.
- Accessor in default Kepler layers now expect a data container as one of parameters, for example:
```const pointPosAccessor = config => dc => d => {return ...}```
where `dc` is an instance of `DataContainerInterface`, and `d` is an object that is expected to contain an index of a row in the data container.

### Step by step upgrade to dataContainer
| File | Function | Change |
| ---- | --- | --- |
| base-layer | accessors | dc is expected | 
|            | updateLayerMeta() | 1nd parameter has to be an instance of `DataContainerInterface` |
|            | getPointsBounds() | 1nd parameter has to be an instance of `DataContainerInterface` |
|            | calculateDataAttribute() | 1nd parameter has to be an instance of `KeplerTable` |
|            | getAttributeAccessors() | 1st parameter is now object expected to contain `dataContainer` |
|            | getHoverData() |  New 2nd parameter, an instance of `DataContainerInterface` |
|            | getPositionAccessor() | 1nd parameter has to be an instance of `DataContainerInterface` |
|            | setInitialLayerConfig() | 1st parameter is now object expected to contain `dataContainer`  |
|            | findDefaultLayerProps() | 2nd parameter has to be an instance of `DataContainerInterface`  |
| cell-size.js | renderedSize() | `text.rows` is substituted with `text.dataContainer` |
| data-table/index.js |  | `DataTable.props.rows` is substituted with `DataTable.props.dataContainer` |
| layer-text-label.js | formatTextLabelData() | `dataContainer` is expected as part of the first argument |
| geojson-utils.js | getGeojsonDataMaps() | First argument is changed from `allData` to `dataContainer` |
| h3-utils.js | isHexField() | Third argument is changed from `allData` to `dataContainer` |
|             | getHexFields() | Second argument is changed from `allData` to `dataContainer` |
| mapbox-utils.js | geoJsonFromData() | `allData` is removed from the argument list. `getGeometry`, `getProperties` arguments expect `{index}` object. |
| trip-utils.js | isTripGeoJsonField() | First argument is changed from `allData` to `dataContainer` |
| data-processor.js | formatCsv() | `data` parameter has to be an instance of `DataContainerInterface` |
| data-scale-utils.js | getOrdinalDomain() | First parameter has to be an instance of `DataContainerInterface` |
| filter-utils.js | getFilterFunction() | New 5th parameter, an instance of `DataContainerInterface`. Returned function expects `{index}` object as first parameter.  |
|                 | filterDataByFilterTypes() | 2nd parameter has to be an instance of `DataContainerInterface` |	
|                 | getTimestampFieldDomain() | 1st parameter has to be an instance of `DataContainerInterface`. valueAccessor parameter expects a function that accepts `{index}` object as first parameter. |		
|                 | getNumericFieldDomain() |	1st parameter has to be an instance of `DataContainerInterface`. valueAccessor parameter expects a function that accepts `{index}` object as first parameter. |
|                 | getPolygonFilterFunctor() | New 3rd parameter, an instance of `DataContainerInterface` |
| interaction-utils.js | getTooltipDisplayDeltaValue() | data and primaryData parameters are now of `DataRow` type |
|                      | getTooltipDisplayValue() | data parameter is now of `DataRow` type |
| comparison-utils.js |	cmpGpuFilterProp() | New 4th parameter, an instance of `DataContainerInterface` |
| gpu-filter-utils.js | getGpuFilterProps() | Returned function now expects a data container. ```dc => (getIndex, getData) => d => {...}``` |
| data-utils.js | maybeToDate() | New 4th parameter, an instance of `DataContainerInterface` |
| kepler-table.js | Field.valueAccessor() | 1st parameter is expected to be an object that contain an index property | 