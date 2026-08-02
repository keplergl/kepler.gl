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
`@turf/*` module. `@deck.gl-community/editable-layers@9.3.8` mixes default and
named imports of turf v7 modules (e.g. `import { rewind } from '@turf/rewind'`,
`import bboxPolygon from '@turf/bbox-polygon'`). The turf v7 CJS builds ship as
`module.exports = fn` (no named properties) so esbuild's ESM/CJS interop leaves
named imports like `import_rewind.rewind` undefined, throwing
`... is not a function` errors when finishing a polygon draw or performing any
boolean edit. The plugin requires each turf module's real CJS build, then:

- For single-function modules: sets `module.exports = fn` and exposes the
  function under both `.default` and its own module name (e.g. `.rewind`),
  so both default and named imports resolve to the function.
- For multi-export utilities (e.g. `@turf/helpers`): preserves all named
  exports and sets `.default` to the module itself.

Remove the plugin once editable-layers ships a build that aligns its import
style with the turf v7 CJS exports.

[yarn-install]: https://yarnpkg.com/getting-started/install
