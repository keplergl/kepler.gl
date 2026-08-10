# Spatial filter (points in polygons)

Filter the points of a dataset so that only the points that fall within a polygon dataset are kept.

## When to use

Use this skill when the user wants to keep only the points that lie inside a set of polygons (e.g. "points within this county boundary").

## Workflow

1. Run a spatial query using `executeApi` with `commandId: "geo.spatial-query"` and `input: { datasetNames: [pointsDataset, polygonsDataset], outputDatasetName, sqlQuery, reasoning }`. The query joins the points dataset (left) with the polygon dataset (right) and keeps the points where the geometry intersects:
   - Use `__tbl0__` for the points dataset and `__tbl1__` for the polygons dataset.
   - The geometry column stores GeoJSON strings — wrap with `ST_GeomFromGeoJSON(geometry)` for spatial ops.
   - Save the result (the matching points).
2. Filter the result to keep only rows where the intersection count is greater than zero, using `executeApi` with `commandId: "data.filter"` and `input: { datasetName, variableNames, sql, resultDatasetName }` (or an equivalent SQL transform via `data.create-table`).
3. Save the filtered result as the final answer and visualize it on the map using `executeApi` with `commandId: "map.add-layer"` — `data.filter` does NOT auto-create a layer.

## Rules

- The points dataset must be on the left, the polygon dataset on the right.
- Use `__TABLE__` (or `__tbl0__`, `__tbl1__` for spatial queries) as table-name placeholders in SQL; they are replaced with real DuckDB table names at runtime.
- Save each intermediate result as a new dataset before using it in the next step.