# Demo App

This is the src code of kepler.gl demo app. You can copy this folder out and run it locally.

> The AI assistant (panel, control, reducer) comes from the published
> **`@openassistant/kepler-assistant`** package (`^0.0.12`), which temporarily
> vendors the `@kepler.gl/mcp` map surface. kepler.gl is a **static website**:
> it exposes the map surface *interface* (`@kepler.gl/mcp`) and registers those
> commands with the browser's WebMCP API — it never runs an MCP server.

#### Agent surfaces

The demo exposes the DuckDB-free `map.*` command catalog to agents two ways.
Both are silent — there is no status chip — and share
`kepler-mcp-shared.ts`, which builds the catalog and the redux-backed command
context.

- **WebMCP** (`kepler-webmcp.tsx`) — registers the tools with the browser's
  native [WebMCP](https://webmachinelearning.github.io/webmcp/) API
  (`document.modelContext`, with a `navigator.modelContext` fallback) for
  harnesses that have a built-in browser with WebMCP enabled: Chrome 149+ with
  the origin trial, or `chrome://flags/#enable-webmcp-testing`. Without it the
  surface is inert. Tool names fold `map.load-data` → `map_load_data` (dots are
  common MCP-tool-name poison); the original command id is kept in the
  description and every result string.
- **MCP bridge** (`kepler-mcp-bridge.tsx`) — for harnesses without WebMCP
  (Codex Desktop, the Codex CLI, Claude Code). Build and run the server that
  ships with `@kepler.gl/mcp`:

  ```bash
  yarn workspace @kepler.gl/mcp build
  node src/mcp/dist/cjs/server/stdio.js --map-url http://localhost:8080
  ```

  It listens on a loopback WebSocket and prints a URL carrying a one-time
  token; open that URL and the page connects back. Register the same command as
  a stdio MCP server in your harness, for example
  `codex mcp add kepler -- node src/mcp/dist/cjs/server/stdio.js`.
  Nothing connects unless the page was opened with `?mcp=<token>`.

#### Pre requirement
- [Node.js ^20.x](http://nodejs.org): We use Node to generate the documentation, run a
  development web server, run tests, and generate distributable files. Depending on your system,
  you can install Node either from source or as a pre-packaged bundle.
- [Yarn 4.4.0](https://yarnpkg.com): We use Yarn to install our Node.js module dependencies
  (rather than using npm). See the detailed [installation instructions][yarn-install].

#### 1. Install Dependencies

Go to the root directory and install the dependencies using yarn:

```sh
yarn bootstrap
```

If install fails while building the `gl` package, use Node 24.21.0 from the repo root `.nvmrc` (`nvm install` / `nvm use`), or see [Troubleshooting: gl package install](../../contributing/DEVELOPERS.md#troubleshooting-gl-package-install).

If `yarn start` errors with missing `@kepler.gl/duckdb/components` (or other workspace `dist/` files), from the repo root run `yarn workspaces foreach -At run stab` or run full `yarn bootstrap` (not only `yarn install`).

Then, go to the `examples/demo-app` directory and install the dependencies using yarn:

```sh
yarn install
```

#### 2. Environment Variables
Create a `.env` file at the root directory by copying from `.env.template`:

```sh
cp .env.template .env
```

Then update the following environment variables in your `.env` file:

```sh
MAPBOX_ACCESS_TOKEN=<your_mapbox_token>
DROPBOX_CLIENT_ID=<your_dropbox_client_id>
MAPBOX_EXPORT_TOKEN=<your_mapbox_export_token>
CARTO_CLIENT_ID=<your_carto_client_id>
FOURSQUARE_CLIENT_ID=<your_foursquare_client_id>
FOURSQUARE_DOMAIN=<your_foursquare_domain>
FOURSQUARE_USER_MAPS_URL=<your_foursquare_user_map_url>
GoogleDriveClientId=<your_google_oauth_web_client_id>
```

For Google Drive, create an OAuth 2.0 **Web application** client in [Google Cloud Console](https://console.cloud.google.com/), enable the **Google Drive API**, and add your demo-app origin (e.g. `http://localhost:8080`) to Authorized JavaScript origins. Only the client ID is required (no API key).

#### 3. Start the app

```sh
yarn start:local
```

#### Optional: runtime `/config.json`

After a production build (`yarn build`), you can override tokens and demo-app settings without rebuilding by placing a `config.json` next to `dist/index.html` (i.e. `examples/demo-app/dist/config.json`). The app fetches origin-root `/config.json` so SPA routes like `/demo/:id` still find it. To read the config from another location, set `window.__KEPLER_CONFIG_HREF__` (Docker: `KEPLER_CONFIG_HREF`) before `bundle.js` loads, or add a `<base href>` and `config.json` resolves against that base. Neither option hosts the app at a browser-visible sub-path — assets and router routes are root-absolute (see `docker/README.md`). Copy `docker/config.example.json` as a starter; see `docker/config.full-example.json` and `docker/README.md` for the full schema, Compose mounts, and `KEPLER_*` env overrides. `mapConfigUrl` only replaces the `samples.json` catalogue — sample rows still need absolute data/config URLs (see `docker/samples.example.json`). `ASSETS_URL` is the gallery tab thumbnail CDN and is not runtime-configurable.

[yarn-install]: https://yarnpkg.com/getting-started/install

#### Zarr layer

The demo app enables the experimental Zarr layer by default. To hide Zarr from **Add Data → Tilesets** and the layer type pickers, set this in `config.json`:

```json
{
  "applicationConfig": {
    "enableZarrLayer": false
  }
}
```

Runtime configuration overrides the demo defaults before the app starts. Existing Zarr layers in saved maps can still render; this flag controls the UI for adding layers. See the [Zarr layer guide](../../docs/user-guides/c-types-of-layers/s-zarr-layer.md) for usage and library configuration.
