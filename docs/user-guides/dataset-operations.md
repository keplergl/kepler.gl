# Dataset operations

Use dataset operations to create a new table from data already on the map. Results are added as regular datasets (with automatic layers when geometry is present). Parent tables are not modified.

Open the **⋯** menu on a local dataset in the Layers catalog to:

- **Group by** one column and aggregate the rest
- **Join** two tables on a shared key (left, inner, or full)
- **Spatial join** left geometries to right geometries with a **contains** predicate

Operations run entirely in the browser. They are available for local (and remote file) tables, and are hidden for vector tiles, raster tiles, WMS, and 3D tiles.

## Group by

1. Choose the grouping column.
2. Pick an aggregation per remaining column (`COUNT`, `SUM`, `MEAN`, `MIN`, `MAX`, `MEDIAN`, `UNIQUE`). Numeric fields default to **MEAN**, strings to **UNIQUE**, others to **COUNT**.
3. Name the result and click **Run**.

## Attribute join

Join two datasets on matching key values.

- **Left** keeps every row from the left table and fills unmatched right columns with empty values.
- **Inner** keeps only rows with a match.
- **Full** keeps unmatched rows from both tables.

Null keys never match. Duplicate keys produce one output row per match.

## Spatial join

Each left feature becomes one output row. Matching right features are aggregated onto that row (including a `count` of matches).

Supported **contains** cases:

| Left | Right | How |
| --- | --- | --- |
| Polygon / MultiPolygon | Point (lat/lng, GeoJSON Point) | Point in polygon |
| H3 index | Point | Point’s cell equals the stored index |
| Polygon | Polygon | Right centroid inside left polygon |

Distance joins, topology predicates (touches, overlaps, crosses), and geometry merge are not included. For SQL predicates, use the [SQL/DuckDB Data Explorer](./sql-data-explorer.md).

## Saving maps

Result tables are saved like any other dataset. Draft operation panels are stored in the map config so you can reopen them. Re-running an operation with the same result name replaces that table so existing layers keep their bindings.

Disable the UI with `enableDatasetOps: false` in `initApplicationConfig`.
