# SQLRooms Demo App

An experimental version of the Kepler demo for testing SQLRooms 0.29.0. It runs
beside the original `examples/demo-app`; the website still uses the original app.

## Run both apps

Install the root workspace dependencies and initialize the workspace packages
with `yarn bootstrap` as described in the [development guide](../../contributing/DEVELOPERS.md).
Then run these commands from the repository root in separate terminals:

```sh
yarn start           # original demo: http://localhost:8080
yarn start:sqlrooms  # SQLRooms demo: http://localhost:8083
```

The launcher installs each example's dependencies if needed. To install or build
this app directly:

```sh
cd examples/demo-app-sqlrooms
yarn install --immutable
yarn start:local
# Or generate the production bundle:
yarn build
```

Both apps support `/demo` and sample routes such as `/demo/earthquakes`.
Different ports keep their browser storage separate. Provider credentials use the
same repository environment configuration as the original demo. Cloud login and
AI requests require credentials; local OAuth testing also requires registering
this app's origin with the provider.

## What to compare

- Initial Add Data dialog, file/tileset/URL/storage loading, and sample gallery.
- Logo/version, data/layer/filter/style panels, and export/storage actions.
- Map controls: split view, 3D, drawing, annotations, locale, legend, effects,
  assistant, and zoom.
- Sidebar collapse/reopen without losing edits, map resizing, and SQL/assistant
  panel resizing and visibility.

The SQLRooms version retains the existing Kepler Redux store, loaders, saved-map
format, and provider integrations. Its application shell uses
`@kepler.gl/sqlrooms/shell`, and `src/components/sqlrooms-demo-layout.tsx` owns the
SQLRooms layout and panel registry. New features can register panels there.
It keeps Kepler's colors and font stack and removes the obsolete DuckDB preview
callout. Sample fixtures are imported from the original demo to avoid duplicating
the datasets; application code and dependency installation are separate.

This example is a test harness for the migration, not the website's deployment
entry point. Use it to establish feature parity before replacing the main app.

## SQL panel

Use the map's bottom-left **SQL panel** button to open the full-width bottom panel. It uses SQLRooms' standard schema tree and
`SqlCodeMirrorEditor` from `@sqlrooms/sql-editor` and SQLRooms' paginated Arrow
result table. Map imports and queries share Kepler's DuckDB connection.

- Run the selection or full query with **⌘/Ctrl+Enter** or **Run query**.
- Use **Add to Map** to create a dataset from the last query result.
- Use **Export CSV** in the results footer to download the displayed result.
- Import files through the existing **Add Data** dialog; the schema tree refreshes automatically.
- Editor text and results survive closing/reopening the panel; `?sql=` links retain the SQL text.

For example, open `/demo/earthquakes?sql=SELECT%20*%20FROM%20%22California%20Earthquakes%22%20LIMIT%20100`.

From the repository root, run the query execution and CSV export checks with:

```sh
node --test examples/demo-app-sqlrooms/test/*.test.cjs
```
