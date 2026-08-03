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

### `@turf/rewind` interop shim

`esbuild.config.mjs` contains a small plugin that patches `@turf/rewind` to
expose a named `rewind` export. The package ships as `module.exports = fn`
(no named property), but `@deck.gl-community/editable-layers` imports it as
`import { rewind } from '@turf/rewind'`. Without the patch, esbuild's CJS
interop leaves `rewind` undefined at runtime. Remove the plugin once
`@turf/rewind` adds a proper `exports` field.

[yarn-install]: https://yarnpkg.com/getting-started/install
