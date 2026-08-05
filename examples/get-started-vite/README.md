# Get Started with Kepler.gl + Vite

A minimal example showing how to integrate [Kepler.gl](https://kepler.gl/) into a React/Redux app using [Vite](https://vite.dev/) as the build tool.

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the detailed [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the `examples/get-started-vite` directory and run:

```sh
touch yarn.lock && yarn
```

> `touch yarn.lock` is required once to mark this directory as a standalone Yarn project,
> independent of the monorepo root.

## 2. Start the App

```sh
yarn dev
```

The app will be available at [http://localhost:8081](http://localhost:8081).

## Production Build

```sh
yarn build
yarn preview
```

## Notes

### `@turf/rewind` interop shim

`vite.config.ts` contains a small plugin that patches `@turf/rewind` to expose
a named `rewind` export. The package's ESM entry only has `export default rewind`
(no named export), but `@deck.gl-community/editable-layers` imports it as
`import { rewind } from '@turf/rewind'`. Without the patch, Rollup/Vite silently
resolves the named import to `undefined`, throwing `... is not a function` at
runtime when finishing a polygon draw. Remove the plugin once `@turf/rewind`
adds a named export.

[yarn-install]: https://yarnpkg.com/getting-started/install
