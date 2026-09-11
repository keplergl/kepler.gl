# Kepler SQLRooms Example

A map workspace using `@kepler.gl/sqlrooms`, SQLRooms artifacts, a data catalog,
and a SQL editor. It starts with the public earthquakes Parquet dataset and a
point layer colored by depth and sized by magnitude. Imported files stay in the
browser's DuckDB instance. Basemaps and the initial sample require network access.

From the repository root:

```sh
yarn install --immutable
yarn workspaces foreach -At run stab
yarn start:sqlrooms
```

Open http://127.0.0.1:8083. The example always resolves Kepler from this checkout.
It uses published SQLRooms packages and does not require `~/Workspace/sqlrooms`.
The original `examples/demo-app` remains available through `yarn start`.

## Try the integration

1. Open Layers and change the earthquakes layer's visibility or styling.
2. Open Data to inspect the table or import a CSV/Parquet file.
3. Open the SQL editor and run `SELECT count(*) FROM earthquakes`.
4. Create another map with the + button and add a layer using an existing table.
5. Switch between map tabs; check that layer edits stay scoped to their map.
6. Use the layer/filter panels and map controls to exercise the reused Kepler UI.

To build the example, run `yarn workspace kepler-sqlrooms-example build`.
The example demonstrates composition; it does not configure persistent project
storage, so reloading resets this demo workspace.

The source is adapted from SQLRooms' Kepler example at commit
`26d8e78e086cebdfc4eb6b4047c9035c5704a068` (MIT); see the adapter's LICENSE.
