# GeoDa spatial analysis

Run statistical spatial analysis (spatial weights, LISA, global Moran, spatial regression, data classification, rate calculation, standardization, thiessen polygons, MST, cartogram) and geometry operations (area, length, perimeter, buffer, centroid, dissolve, spatial join) on geographic datasets.

## When to use

Use this skill when the user wants to:
- Find spatial clusters / hot spots / cold spots / spatial outliers (LISA, global Moran).
- Build a spatial weights matrix for a dataset.
- Run a spatial regression (classic OLS, spatial-lag, spatial-error).
- Classify a numeric variable into bins (quantile, natural breaks, equal interval, etc.).
- Compute rates (excess risk, empirical Bayes) or standardize variables.
- Generate thiessen polygons, a minimum spanning tree, or a Dorling cartogram.
- Compute geometry measures (area, length, perimeter) or run geometry operations (buffer, centroid, dissolve, spatial join).

## Workflow

### 1. Statistical operations — `geoda.analysis`

All statistical GeoDa operations go through the single `geoda.analysis` command. Pick the operation with the `analysis` field:

```json
{
  "call": {
    "apiName": "executeCommand",
    "args": {
      "commandId": "geoda.analysis",
      "input": { "analysis": "lisa", "datasetName": "counties", "variableName": "income", "method": "localMoran", "weightsId": "w-counties-queen-1-0" }
    }
  },
  "reasoning": "Run LISA on the income variable."
}
```

Operations:
- `spatial-weights` — `{ datasetName, type: queen|rook|knn|threshold, k?, orderOfContiguity?, includeLowerOrder?, precisionThreshold?, distanceThreshold?, isMile?, useCentroids? }` → `{ weightsId }`. **Create weights FIRST** — LISA, global Moran, and spatial regression need a `weightsId`.
- `lisa` — `{ datasetName, variableName, method: localMoran|localGeary|localG|localGStar|quantileLisa, weightsId, permutation?, significanceThreshold?, k?, quantile? }` → `{ clusterColorAndLabels, totalObservations }`.
- `global-moran` — `{ datasetName, variableName, weightsId }` → `{ globalMoranI }`.
- `regression` — `{ datasetName, dependentVariable, independentVariables, modelType: classic|spatial-lag|spatial-error, weightsId? }` → `{ result }`.
- `classify` — `{ datasetName, variableName, method, k?, hinge? }` → `{ breaks? }` or `{ uniqueValues? }`. Feed `breaks` into `map.add-layer`'s `colorMap` to visualize.
- `rate` — `{ datasetName, eventVariable, baseVariable, method?: excessRisk|empiricalBayes, outputDatasetName }` → `{ outputDatasetName, outputVariableName }`.
- `standardize` — `{ datasetName, variableName, method: deviationFromMean|standardizeMAD|rangeAdjust|rangeStandardize|standardize, outputDatasetName }` → `{ outputDatasetName, outputVariableName }`. Use this only when the user wants a SEPARATE analysis-result dataset. When the user asks to add a derived/standardized variable (e.g. a z-score) as a NEW column in the EXISTING dataset, do NOT create a new dataset — use `map.add-column` with an `expression` instead, e.g. `{ datasetName, newColumnName: "HR60_Z", expression: "(HR60 - AVG(HR60) OVER()) / STDDEV(HR60) OVER()" }`.
- `thiessen-polygons` — `{ datasetName, outputDatasetName }`.
- `mst` — `{ datasetName, outputDatasetName }`.
- `cartogram` — `{ datasetName, weightVariable, iterations?, outputDatasetName }`.

### 2. Geometry operations — `geo.spatial-query` (DuckDB spatial SQL)

Geometry operations are NOT separate commands — write the DuckDB spatial SQL yourself and run it via `geo.spatial-query` with `input: { datasetNames, outputDatasetName, sqlQuery, reasoning }`. Use `__tbl0__`, `__tbl1__`, ... as table placeholders. The geometry column stores GeoJSON strings — wrap with `ST_GeomFromGeoJSON(geometry)`. Each query must return a `geometry` column (GeoJSON string); scalar ops include `geometry` in the SELECT so the values land in the result's properties. After saving, call `data.load-to-map` to load the result onto the map, then `map.add-layer` to create a layer (neither command auto-creates one).

SQL patterns (verified for DuckDB spatial):
- **area** — `SELECT ST_Area_Spheroid(ST_GeomFromGeoJSON(geometry)) AS area, geometry FROM __tbl0__` → m² (÷1e6 → km², ÷2.59e6 → mi²).
- **length** — `SELECT ST_Length_Spheroid(ST_GeomFromGeoJSON(geometry)) AS length, geometry FROM __tbl0__` → meters (÷1000 → km, ÷1609.344 → mi).
- **perimeter** — `SELECT ST_Perimeter_Spheroid(ST_GeomFromGeoJSON(geometry)) AS perimeter, geometry FROM __tbl0__` → meters.
- **centroid** — `SELECT ST_AsGeoJSON(ST_Centroid(ST_GeomFromGeoJSON(geometry))) AS geometry, <props> FROM __tbl0__` → point features.
- **dissolve** — `SELECT ST_AsGeoJSON(ST_Union_Agg(ST_GeomFromGeoJSON(geometry))) AS geometry FROM __tbl0__`; with `dissolveBy`: add `GROUP BY "<col>"` + `SUM/AVG/MIN/MAX/MEDIAN(CAST("<var>" AS DOUBLE))` per aggregate variable (count → `COUNT(*)`).
- **buffer** — no spheroid buffer, so transform to Web Mercator, `ST_Buffer`, transform back: `ST_Transform(ST_Buffer(ST_Transform(ST_GeomFromGeoJSON(geometry), 'EPSG:4326','EPSG:3857', always_xy := true), <meters>), 'EPSG:3857','EPSG:4326', always_xy := true) AS geometry`.
- **spatial-join** — `SELECT l.*, (SELECT COUNT(*) FROM __tbl1__ r WHERE ST_Intersects(ST_GeomFromGeoJSON(l.geometry), ST_GeomFromGeoJSON(r.geometry))) AS Count FROM __tbl0__ l`; per join variable add a correlated subquery aggregate (`SUM/AVG/MIN/MAX/MEDIAN(CAST(r."<var>" AS DOUBLE))`, `unique` → `FIRST(r."<var>")`).

## Rules

- STRICT RULE: Never use datasets generated from previous LISA runs (dataset name with a "lisa_" prefix) as input for a new LISA analysis.
- For clustering analysis, always perform a spatial statistical test (e.g. Local Moran's I) rather than relying on visual inspection.
- If the input is a road or line dataset, buffer it by 1 meter first (via `geo.spatial-query`), save the buffered road as a new dataset, and use that for the LISA analysis.
- When a new dataset has been generated by any tool, save it as a new dataset in kepler.gl first, then use that new dataset for the spatial analysis.
- Prefer `map.add-column` (with `copyFromColumn` or `expression`) to add a column to an EXISTING dataset in place. Only reach for `geoda.analysis` (which produces a new `outputDatasetName`) when the user wants a separate analysis result.
- When classifying data into bins using break values, the lower bound is inclusive and the upper bound is exclusive for all bins except the last bin, which is inclusive of both bounds.
- For `map.add-layer` colorMap from `breaks`: `[{value: <break>, color: "<hex>"}, ..., {value: null, color: "<hex>"}]` (the last `value: null` entry is the color for the highest bin).
