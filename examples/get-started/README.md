# Get Started with Kepler.gl

A minimal example showing how to integrate [Kepler.gl](https://kepler.gl/) into a React/Redux app using esbuild as the bundler.

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the detailed [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the root directory and install the dependencies:

```sh
yarn bootstrap
```

If install fails while building the `gl` package, use Node 20.19.3 from the repo root `.nvmrc` (`nvm install` / `nvm use`), or see [Troubleshooting: gl package install](../../contributing/DEVELOPERS.md#troubleshooting-gl-package-install).

Then, go to the `examples/get-started` directory and install the dependencies:

```sh
yarn install
```

## 2. MapBox Token

Replace the placeholder Mapbox token in `src/app.tsx` with your own:

```tsx
mapboxApiAccessToken="<your_mapbox_token>"
```

You can get a free token at [mapbox.com](https://www.mapbox.com/).

## 3. Start the App

```sh
yarn start
```

The app will be available at [http://localhost:8080](http://localhost:8080).

## Production Build

To create a minified production build:

```sh
yarn build
```

The output will be in the `dist/` directory.

## Notes

### `@turf/*` interop shim

`esbuild.config.mjs` contains a plugin that normalizes ESM/CJS interop for every
`@turf/*` module. `@deck.gl-community/editable-layers@9.3.7` default-imports many
turf modules (`import turfX from '@turf/x'`) but depends on turf v7. When
editable-layers is pulled in through kepler.gl's CJS dist, esbuild's ESM/CJS
interop double-wraps these modules so a default import resolves to an object
instead of the function, and calls like `(0, import_bbox_polygon.default)(...)`
or `(0, import_rewind.default)(...)` throw `... .default is not a function`
(breaking polygon/rectangle drawing, feature rewinding, etc.). The plugin
requires turf's real build for each module and re-exports it so single-function
modules resolve their `default` to the function while multi-export utilities
(e.g. `@turf/helpers`) keep all named exports. Remove the plugin once
editable-layers ships a build that imports the named exports.

[yarn-install]: https://yarnpkg.com/getting-started/install
