# SQLRooms Demo App

An experimental version of the Kepler demo for testing SQLRooms 0.29.0. It runs
beside the original `examples/demo-app`. The website serves the original app at
`/demo` and this app at `/demo-next` as separate bundles.

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

In standalone development, both apps support `/demo` and sample routes such as
`/demo/earthquakes`. On the website, the SQLRooms preview uses `/demo-next` and
`/demo-next/earthquakes`. Different local ports keep browser storage separate.
Provider credentials use the same repository environment configuration as the
original demo. Cloud login and AI requests require credentials; local OAuth testing also requires registering
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

Use this preview to establish feature parity before replacing the main app.

## Website deployment

The root `yarn install:web` installs both examples and the website, including this
example's locked dependencies via `yarn install:sqlrooms`. The root `yarn deploy`
runs that install step followed by the website's `yarn build`, which builds both
apps and copies this example's `--demo-next` output into `website/dist/demo-next/`.
To build locally, first run `yarn install:web` from the repository root, then
`cd website && yarn build`. The website's `yarn esbuild` only rebuilds the original
website bundle; `yarn build:demo-next` builds and copies the preview without
installing dependencies. Netlify continues publishing the same
`website/dist` directory. No dashboard, domain, or new environment variable
configuration is required for this addition to an existing deployment.

The website's `_redirects` routes `/demo-next` and its child routes to the new
entry point before the website catch-all. Assets use `/demo-next/` URLs, and
sample and cloud-share links stay under `/demo-next`. This example's regular
`yarn build` and local development retain `/demo` routes and root asset URLs. To try the deployed
paths locally, run `yarn start:local --demo-next` from this directory.
The flag controls both routing and asset paths through a dedicated build
identifier; setting `DEMO_BASE_PATH` in the environment or `.env` does not change
the route. The preview remains unlisted in the marketing site's navigation.

Assistant sessions/settings use `kepler-sqlrooms-ai-assistant-state`, separate
from the original demo. Provider login storage remains shared on the same
origin. Existing OAuth callback URLs are retained, including the website's
`/auth` popup handler for Dropbox; no new callback registration is introduced.
Live login still depends on the existing provider configuration, and preview
origins must already be allowed by the provider to support login.

After building the website, run the deployment browser check from the repository
root with `node --test website/test/demo-next.browser.cjs`. It serves the combined
publish directory using its SPA rewrites and checks both entry points, nested
sample routes, asset URLs, and assistant storage isolation. It requires Chromium
(or `PUPPETEER_EXECUTABLE_PATH`) and access to public sample data and DuckDB assets.

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

On the website, open `/demo-next/earthquakes?sql=SELECT%20*%20FROM%20%22California%20Earthquakes%22%20LIMIT%20100`.
For standalone development, use `/demo/earthquakes?sql=SELECT%20*%20FROM%20%22California%20Earthquakes%22%20LIMIT%20100`.

From the repository root, run the query execution and CSV export checks with:

```sh
node --test examples/demo-app-sqlrooms/test/*.test.cjs
```

The SQLRooms demo CI workflow runs these unit tests for PRs targeting `master`
or `feat/sqlrooms-integration`. Browser checks remain manual.

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
its database. Sessions and provider settings use the demo-owned
`kepler-sqlrooms-ai-assistant-state` storage key, preserving settings migration
while keeping the original demo's state separate.

The stock SQLRooms query tool shares five result rows with the model and accepts
read-only queries. It no longer materializes every map dataset into `tbl_*`
copies before a query. Table discovery uses the shared SQLRooms catalog. Use the
SQL panel or the existing map/data commands for writes and derived datasets.
Only model-output formatting is customized: the existing roughly 1,000-character
preview cap prevents large geometry/object values from flooding model context.
Map, geographic, GeoDa, skill, and chart capabilities remain provided by
`@openassistant/kepler-assistant`.

### Assistant integration package

The demo uses the published `@openassistant/kepler-assistant@0.0.17` integration
API. The `/integration`, `/chat`, and `/tool-surface` entry points expose the
map bridge, command catalog, skill factories, and chart renderers without
constructing a standalone room. The demo owns persistence, slice
composition, command registration, connector binding, and the chat UI.

No Yarn patch or DuckDB import interception is needed. Keep all assistant
imports on these headless subpaths: importing the root initializes the
standalone room. The package's single-map Redux/analysis bridge remains
page-scoped; this is not a multi-room assistant API. Run the browser test below
when upgrading the package.

OpenAI models use the native AI SDK Responses provider for chat, skill discovery,
and skill subagents, so reasoning models can call tools. The resolver reads the
current model, API key, and base URL at request time. It disables server-side
response storage; the room retains conversation history and the SDK carries
encrypted reasoning between tool steps. Other providers keep their existing
resolution. The demo uses AI SDK 6 to match SQLRooms 0.29's model interface.
The skill factories accept the same resolver without a dependency patch.

The model tests exercise Responses requests, tool-result and reasoning replay,
model/settings changes, and the fallback for other providers with mocked HTTP.
Run them alongside the SQL/export tests using the unit-test command above.

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
