# UMD Client

A single HTML file that loads kepler.gl and all its dependencies via CDN — no build tool, no `npm install`. You can open it directly in a browser or embed it in a blog post.

### How it works

React 19 no longer ships UMD builds. This example uses [es-module-shims](https://github.com/guybedford/es-module-shims) in shim mode to load React/Redux as ES modules from [esm.sh](https://esm.sh) and re-expose them as globals (`window.React`, `window.Redux`, etc.) that the kepler.gl UMD bundle expects. The shim mode also makes import maps work when the file is opened from disk via `file://`.

### Usage

Open `index.html` directly in a browser — an internet connection is required to load scripts from unpkg.com and esm.sh.

By default the map uses a **MapLibre / Carto basemap** (no token needed). To switch to a Mapbox basemap, set `window.MAPBOX_TOKEN` near the top of `index.html` — see [Mapbox token](#mapbox-token) in `examples/README.md`.

### Loading data

To load data and configure the map on startup, add your dispatch calls inside the `customize` function at the bottom of the bootstrap script:

```js
(function customize(keplerGl, store) {
  store.dispatch(keplerGl.addDataToMap({
    datasets: { /* ... */ },
    config:   { /* ... */ }
  }));
})(KeplerGl, store);
```
