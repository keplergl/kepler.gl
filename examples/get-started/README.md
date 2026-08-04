# Get Started with Kepler.gl

A minimal example showing how to integrate [Kepler.gl](https://kepler.gl/) into a React/Redux app using esbuild as the bundler.

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the detailed [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the `examples/get-started` directory and run:

```sh
touch yarn.lock && yarn
```

> `touch yarn.lock` is required once to mark this directory as a standalone Yarn project,
> independent of the monorepo root.

## 2. Start the App

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
