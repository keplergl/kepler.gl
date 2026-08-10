# Examples

A list of examples demonstrating how to add `kepler.gl` to your app. Each example is a standalone project that can be run locally.

## Getting started

Each example has its own `package.json`. To run one, `cd` into its folder and install dependencies:

```sh
touch yarn.lock && yarn
```

> `touch yarn.lock` is required the first time so Yarn treats the folder as a
> standalone project, independent from the kepler.gl monorepo.

Then start the dev server:

```sh
yarn start
```

## Examples

- ### [Get Started][get-started]
  Minimal kepler.gl setup with esbuild.

- ### [Get Started (Vite)][get-started-vite]
  Minimal kepler.gl setup with Vite.

- ### [DuckDB (Vite)][duckdb-vite]
  Minimal kepler.gl setup with the DuckDB plugin and Vite.

- ### [Demo App][demo-app]
  kepler.gl as a full single-page app — loads sample maps from remote URLs and saves map data to Dropbox. This is also the source code of kepler.gl/#/demo.

- ### [AWS S3 Provider][aws-s3-provider]
  Bring-your-own-AWS example: Cognito Hosted UI + private S3 map storage. Not enabled on kepler.gl/demo (operator-owned bucket).

- ### [Open Modal][open-modal]
  Embed kepler.gl inside a `react-modal` dialog, demonstrating both fresh-state and saved-state lifecycle behaviors.

- ### [Custom Reducer][custom-reducer]
  Customize the kepler.gl reducer's initial state and extend it with additional actions using the plugin system.

- ### [Replace UI Component][replace-component]
  Replace kepler.gl's default UI components using the `injectComponents` method.

- ### [Custom Theme][custom-theme]
  Customize the kepler.gl theme by overriding default style properties.

- ### [Custom Layer][custom-layer]
  Add a custom deck.gl layer (`ContourLayer`) to kepler.gl's layer type selector, so it can be picked from the dropdown, configured with dataset columns, and rendered on the map.

- ### [Custom Map Style][custom-map-style]
  Use kepler.gl with basemap services other than Mapbox (e.g. MapLibre / Carto).

- ### [Node App][node-app]
  Embed kepler.gl in a Node.js/Express application — builds the bundle with esbuild and serves it as static files.

- ### [UMD Client][umd-client]
  A single HTML file that loads kepler.gl from CDN — no build tool or `npm install` required. Works when opened directly from disk.

[get-started]: get-started/README.md
[get-started-vite]: get-started-vite/README.md
[duckdb-vite]: duckdb-vite/README.md
[demo-app]: demo-app/README.md
[aws-s3-provider]: aws-s3-provider/README.md
[open-modal]: open-modal/README.md
[custom-reducer]: custom-reducer/README.md
[replace-component]: replace-component/README.md
[custom-theme]: custom-theme/README.md
[custom-layer]: custom-layer/README.md
[custom-map-style]: custom-map-style/README.md
[node-app]: node-app/README.md
[umd-client]: umd-client/README.md

## Mapbox token

All examples default to a **MapLibre / Carto basemap** so they work without any token.

If you want to use **Mapbox basemaps**, set the `MapboxAccessToken` environment variable before starting an example:

```sh
export MapboxAccessToken=<your_mapbox_token>
yarn start
```

For `umd-client` (no build step), edit `index.html` and set `window.MAPBOX_TOKEN` near the top of the file instead.

For `demo-app`, create a `.env` file from `.env.template` at the repo root and fill in `MAPBOX_ACCESS_TOKEN` and other optional cloud integration tokens.
