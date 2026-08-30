# Demo App

This is the src code of kepler.gl demo app. You can copy this folder out and run it locally.

> The AI assistant (panel, control, reducer) comes from the published
> **`@openassistant/kepler-assistant`** package (`^0.0.12`), which temporarily
> vendors the `@kepler.gl/mcp` map surface (this repo's `src/mcp/` module is
> removed for now). kepler.gl is a **static website**: it only provides the map
> surface *interface* (`@kepler.gl/mcp`) plus a WebSocket listener — it never
> runs an MCP server. Any MCP server (kepler-assistant's own, or any harness
> like Claude Code / Codex driving the map) is **user-provided** and follows the
> `@kepler.gl/mcp` interface, while the command registry executes on the
> in-browser map. See [`docs/NEXT_PLAN.md`](docs/NEXT_PLAN.md) for the permanent
> separation back into a kepler.gl `src/mcp/` module.

#### Agent surfaces

The demo exposes the same DuckDB-free `map.*` command catalog through two
transports (`kepler-mcp-shared.ts` holds the common glue):

- **`kepler-mcp-bridge.tsx`** — WebSocket reverse-connect to a local
  kepler-mcp-demo process (opt-in via `?mcp=<token>` or the bottom-left chip).
- **`kepler-webmcp.tsx`** — native [WebMCP](https://webmachinelearning.github.io/webmcp/)
  registration on `document.modelContext` (fallback `navigator.modelContext`),
  for harnesses with a built-in browser (Chrome's agent, Claude Desktop's
  browser, ...). Needs Chrome 149+ with the WebMCP origin trial or
  `chrome://flags/#enable-webmcp-testing`; the chip is hidden when the API is
  not available. Tool names fold `map.load-data` → `map_load_data` (dots are
  common MCP-tool-name poison); the original command id is kept in the
  description and every result string.

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

If install fails while building the `gl` package, use Node 20.19.3 from the repo root `.nvmrc` (`nvm install` / `nvm use`), or see [Troubleshooting: gl package install](../../contributing/DEVELOPERS.md#troubleshooting-gl-package-install).

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

[yarn-install]: https://yarnpkg.com/getting-started/install
