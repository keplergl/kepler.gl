# Kepler.gl + DuckDB + Vite

A minimal example showing how to integrate [Kepler.gl](https://kepler.gl/) with
the DuckDB plugin using [Vite](https://vite.dev/) as the build tool.

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com): See the detailed [installation instructions][yarn-install].

## 1. Install Dependencies

Go to the `examples/duckdb-vite` directory and run:

```sh
touch yarn.lock && yarn
```

> `touch yarn.lock` is required once to mark this directory as a standalone Yarn project,
> independent of the monorepo root.

## 2. Start the App

```sh
yarn dev
```

The app will be available at [http://localhost:8082](http://localhost:8082).
Use the **SQL** button in the map controls (top-right) to open the DuckDB SQL editor.

## Production Build

```sh
yarn build
yarn preview
```

## Optional: local monorepo sources

```sh
USE_LOCAL_KEPLER=true yarn dev
```

Aliases `@kepler.gl/*` to `../../src/*/src` so changes in the monorepo are picked up
without publishing.

## Notes

Same Vite interop notes as `get-started-vite` (turf rewind shim, parquet-wasm
exclude, CJS pre-bundle includes). Port is `8082` so it can run alongside
`get-started-vite` on `8081`.

[yarn-install]: https://yarnpkg.com/getting-started/install
