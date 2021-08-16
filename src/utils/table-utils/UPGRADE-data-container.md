# Upgrade Guide (Data Containers)

### Major changes
- `KeplerTable.allData: any[][]` is substituted with `KeplerTable.dataContainer: DataContainerInterface`.

### Step by step upgrade
| File | Function | Change |
| ---- | --- | --- |
| base-layer.js & extended layers | accessors | Accessors in default Kepler layers now expect a data container as one of parameters: ```const pointPosAccessor = config => dc => d => {return ...}``` where `dc` is an instance of `DataContainerInterface`, and `d` is an object that is expected to contain an index of a row in the data container. | 
|            | updateLayerMeta() | 1st parameter has to be an instance of `DataContainerInterface`. |
|            | getPointsBounds() | 1st parameter has to be an instance of `DataContainerInterface`. |
|            | calculateDataAttribute() | 1st parameter has to be an instance of `KeplerTable`. |
|            | getAttributeAccessors() | 1st parameter is now an object that to contains `dataContainer: : DataContainerInterface`. |
|            | getHoverData() |  New 2nd parameter, an instance of `DataContainerInterface`. |
|            | getPositionAccessor() | 1st parameter has to be an instance of `DataContainerInterface`. |
|            | setInitialLayerConfig() | 1st parameter is now object expected to contain `dataContainer: : DataContainerInterface`.  |
|            | findDefaultLayerProps() | 2nd parameter has to be an instance of `DataContainerInterface`.  |
| cell-size.js | renderedSize() | `text.rows` is substituted with `text.dataContainer: DataContainerInterface`. |
| data-table/index.js |  | `DataTable.props.rows` is substituted with `DataTable.props.dataContainer: DataContainerInterface`. |
| layer-text-label.js | formatTextLabelData() | `dataContainer: DataContainerInterface` is expected as part of the 1st parameter. |
| geojson-utils.js | getGeojsonDataMaps() | 1st parameter has to be an instance of `DataContainerInterface`. |
| h3-utils.js | isHexField() | 3rd parameter has to be an instance of `DataContainerInterface`. |
|             | getHexFields() | 2nd parameter has to be an instance of `DataContainerInterface`. |
| mapbox-utils.js | geoJsonFromData() | `allData` is removed from the parameter list. `getGeometry`, `getProperties` parameters expect `{index}` object as input parameter. |
| trip-utils.js | isTripGeoJsonField() | 1st parameter has to be an instance of `DataContainerInterface`. |
| data-processor.js | formatCsv() | `data` parameter has to be an instance of `DataContainerInterface`. |
| data-scale-utils.js | getOrdinalDomain() | 1st parameter has to be an instance of `DataContainerInterface`. |
| filter-utils.js | getFilterFunction() | New 5th parameter, an instance of `DataContainerInterface`. Returned function expects `{index}` object as 1st parameter.  |
|                 | filterDataByFilterTypes() | 2nd parameter has to be an instance of `DataContainerInterface`. |	
|                 | getTimestampFieldDomain() | 1st parameter has to be an instance of `DataContainerInterface`. valueAccessor parameter expects a function that accepts `{index}` object as 1st parameter. |		
|                 | getNumericFieldDomain() |	1st parameter has to be an instance of `DataContainerInterface`. valueAccessor parameter expects a function that accepts `{index}` object as 1st parameter. |
|                 | getPolygonFilterFunctor() | New 3rd parameter, an instance of `DataContainerInterface`. |
| interaction-utils.js | getTooltipDisplayDeltaValue() | data and primaryData parameters are now of `DataRow` type. |
|                      | getTooltipDisplayValue() | data parameter is now of `DataRow` type. |
| comparison-utils.js |	cmpGpuFilterProp() | New 4th parameter, an instance of `DataContainerInterface`. |
| gpu-filter-utils.js | getGpuFilterProps() | Returned function now expects a data container. ```dc => (getIndex, getData) => d => {...}``` as parameter to the first call. |
| data-utils.js | maybeToDate() | New 4th parameter, an instance of `DataContainerInterface`. |
| kepler-table.js | Field.valueAccessor() | 1st parameter is expected to be an object that contain index property. | 