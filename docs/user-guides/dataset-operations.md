# Dataset operations

Use dataset operations to create a new table from data already on the map. Results are added as regular datasets (with automatic layers when geometry is present). Parent tables are not modified.

Open the **⋯** menu on a local dataset in the Layers catalog to:

- **Group by** one column and aggregate the rest
- **Join** two tables on a shared key (left, inner, or full)
- **Spatial join** a **target dataset** to a **join dataset** with a spatial join operation (intersects, equals, crosses, overlaps, within, touches)

Operations run entirely in the browser. They are available for local (and remote file) tables, and are hidden for vector tiles, raster tiles, WMS, and 3D tiles.

## Group by

Create one output row per unique value in the grouping column. Remaining columns are aggregated.

The panel is arranged like this:

1. **Group by field** — column that defines the groups
2. **Aggregation Rules** — aggregation per remaining column (`COUNT`, `SUM`, `MEAN`, `MIN`, `MAX`, `MEDIAN`, `UNIQUE`, `MERGE`)

Numeric fields default to **MEAN**, strings to **UNIQUE**, geometry (`geojson` / `point`) to **MERGE**, others to **COUNT**. **MERGE** keeps location by combining features in each group into a MultiPolygon, MultiPoint, or GeometryCollection. Name the result and click **Run**.

## Attribute join

Join two datasets on matching key values. The panel is arranged like this:

1. **Left** — left dataset, join key, and columns to include
2. **Join Type** — left, inner, or full
3. **Right** — right dataset, join key, and columns to include

- **Left** keeps every row from the left table and fills unmatched right columns with empty values.
- **Inner** keeps only rows with a match.
- **Full** keeps unmatched rows from both tables.

Null keys never match. Duplicate keys produce one output row per match. Right-side columns are prefixed with the right dataset name when names collide.

## Spatial join

Each **target** feature becomes one output row. Matching **join** features are aggregated onto that row (including a `count` of matches).

The panel is arranged like this:

1. **Target Dataset** — output rows and target geometry
2. **Join Operation** — spatial predicate
3. **Join Dataset** — features to match and aggregate

Choose a **Join Operation**:

| Predicate | Match when |
| --- | --- |
| Intersects | Geometries share any interior or boundary |
| Equals | Geometries occupy the same space |
| Crosses | Geometries share interior space but neither contains the other (typically a line vs polygon/line) |
| Overlaps | Same-dimension geometries share interior space and neither contains the other |
| Within | Target is completely inside join |
| Touches | Geometries share a boundary but not their interiors |

Distance joins and geometry merge are not included. For SQL predicates, use the [SQL/DuckDB Data Explorer](./sql-data-explorer.md).

## Saving maps

Result tables are snapshots. Deleting a source dataset does not remove the result. Re-running an operation with the same result name replaces that table so existing layers keep their bindings.

Disable the UI with `enableDatasetOps: false` in `initApplicationConfig`.
