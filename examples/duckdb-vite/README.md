# Kepler.gl + DuckDB + Vite

Minimal Vite example with the DuckDB plugin enabled. Use this to reproduce and
investigate DuckDB table-creation issues (see
[#3433](https://github.com/keplergl/kepler.gl/pull/3433)).

Working DuckDB integration reference:
[#2942](https://github.com/keplergl/kepler.gl/pull/2942) (`igr/duckdb-demo-branch`).

## Pre-requirements

- [Node.js ^20.x](http://nodejs.org)
- [Yarn 4.4.0](https://yarnpkg.com)

## 1. Install Dependencies

```sh
cd examples/duckdb-vite
touch yarn.lock && yarn
```

## 2. Start the App

```sh
yarn dev
```

The app opens at [http://localhost:8082](http://localhost:8082) with the Add Data
modal already open. Use the **SQL** button in the map controls (top-right) to open
the DuckDB SQL editor, same as on
[PR #2942](https://github.com/keplergl/kepler.gl/pull/2942).

## Reproducing #3433

1. Upload a GeoJSON file via the Add Data modal.
2. With published `@kepler.gl/duckdb` (and thus `@duckdb/duckdb-wasm@^1.28` →
   currently **1.32.x**), the console shows:

   `Parser Error: syntax error at or near "'wkb_geometry'"`

3. That comes from `importGeoJsonData` in `duckdb-table.ts`:

   ```sql
   ALTER TABLE '${label}' RENAME 'wkb_geometry' TO '_geojson';
   ```

### Root cause (not Vite-specific)

| DuckDB wasm | `ALTER ... RENAME 'col'` (single quotes) | Double-quoted identifiers |
|---|---|---|
| **1.29.0** (demo-app lockfile / PR #2942) | OK | OK |
| **1.32.0** (fresh Vite install via `^1.28.0`) | **Parser Error** | OK |

Vite apps tend to resolve a newer `@duckdb/duckdb-wasm` than the esbuild demo
lockfile, so the same Kepler SQL fails only in those environments. Identifiers
must use double quotes per
[DuckDB docs](https://duckdb.org/docs/current/sql/dialect/keywords_and_identifiers);
file-path arguments to `ST_READ` / `read_json` remain single-quoted string
literals.

### Probe scripts

```sh
# identifier / DROP / ALTER quoting
node scripts/probe-quotes.mjs

# full GeoJSON CREATE + ST_READ + ALTER (needs network for spatial once)
node scripts/probe-geojson.mjs
```

### Optional: point Vite at local monorepo sources

```sh
USE_LOCAL_KEPLER=true yarn dev
```

Aliases `@kepler.gl/*` to `../../src/*/src` so you can iterate on `src/duckdb`.

## Notes

Same Vite interop notes as `get-started-vite` (turf rewind shim, parquet-wasm
exclude, CJS pre-bundle includes). Port is `8082` so it can run alongside
`get-started-vite` on `8081`.
