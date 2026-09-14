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
result table. SQLRooms owns one DuckDB-Wasm 1.32.0 database shared by map imports,
the SQL panel, and the assistant. Apache Arrow is pinned to SQLRooms' 17.0.0 peer.
The app's room borrows the connector; closing a panel does not destroy the database.
Layout, the SQL panel, and the assistant all use that room and its database slice.

- Run the selection or full query with **⌘/Ctrl+Enter** or **Run query**.
- Use **Add to Map** to load all rows of the last query result from its existing
  DuckDB table, without re-importing Arrow.
- Previews transfer at most 1,000 rows. **Export CSV** downloads the full result.
- Cancel a running query with the stop button. SQLRooms handles cancellation.
- Import files through the existing **Add Data** dialog; the schema tree refreshes automatically.
- Editor text and results survive closing/reopening the panel; `?sql=` links retain the SQL text.

For example, open `/demo/earthquakes?sql=SELECT%20*%20FROM%20%22California%20Earthquakes%22%20LIMIT%20100`.

From the repository root, run the query execution and CSV export checks with:

```sh
node --test examples/demo-app-sqlrooms/test/*.test.cjs
```

The query runner keeps a database snapshot so mapping and exporting never rerun
preceding SQL writes. Unmapped snapshots are dropped on the next query or app
unmount. Mapped snapshots are retained as `query_result_*` tables for the page's
lifetime. Kepler datasets are Arrow snapshots; subsequent SQL edits do not
implicitly update an already-loaded map. The assistant's spatial analysis tools
still create transformed `tbl_*` tables when they need their legacy geometry
shape. Ordinary AI SQL queries read the existing tables directly.

## AI assistant

The demo composes `createAiSlice`, `createAiSettingsSlice`, and
`createCommandSlice` into its layout room, following SQLRooms' AI example.
`src/components/assistant.tsx` supplies standard `Chat` and `AiSettingsPanel`
components, Kepler instructions, skill tools, and chart renderers. Kepler map
commands still access the existing Redux store through explicit accessors.
Closing the assistant unmounts its UI without destroying the room or interrupting
its database. Sessions and provider settings retain the existing
`kepler-ai-assistant-state` storage key and settings migration.

The stock SQLRooms query tool shares five result rows with the model and accepts
read-only queries. It no longer materializes every map dataset into `tbl_*`
copies before a query. Table discovery uses the shared SQLRooms catalog. Use the
SQL panel or the existing map/data commands for writes and derived datasets.
Only model-output formatting is customized: the existing roughly 1,000-character
preview cap prevents large geometry/object values from flooding model context.
Map, geographic, GeoDa, skill, and chart capabilities remain provided by
`@openassistant/kepler-assistant`.

### Temporary assistant package patch

The pinned `@openassistant/kepler-assistant@0.0.15` root entry creates a private
room as an import side effect and exposes no host-store factory. The versioned
Yarn patch in `.yarn/patches/` removes that construction and its standalone
`AiAssistantPanel`, `roomStore`, and `useRoomStore` exports from the root entry.
It exposes `AI_SETTINGS`, `createKeplerAssistantTools(store)`, and
`createKeplerAssistantInstructions()` using the package's existing implementation.
The demo owns persistence, slice composition, command registration, connector
binding, and the chat UI. The package's single-map Redux/analysis bridge remains
page-scoped; this is not a multi-room assistant API.

This patch applies only to this example's dependency installation. It replaces
the esbuild DuckDB import interception without copying the analysis or map tools.
Remove it when the assistant publishes an equivalent host integration API. When
upgrading the assistant, review the patch against the new version and run the
browser test below; do not silently drop it or import the standalone panel from
another package entry point.

The browser integration test exercises the actual WASM engine, shared assistant
lifecycle, stock chat and chart rendering, session/settings persistence across
reloads, table discovery, bounded previews, full map/export results, spatial
metadata, and query cancellation. Skill discovery uses a mocked model response;
live provider requests require manual verification with credentials.
It needs Chromium (or `PUPPETEER_EXECUTABLE_PATH`) and network access
to the versioned DuckDB CDN assets:

```sh
node --test examples/demo-app-sqlrooms/test/duckdb.browser.cjs
```
