# @kepler.gl/sqlrooms

Kepler.gl integration for SQLRooms.

Use this package when you want a **map-first analytics experience** in a SQLRooms app, backed by DuckDB tables and SQL.

## What this package provides

- `createKeplerSlice()` to add Kepler state/actions to your Room store
- `KeplerMapContainer` and `KeplerPlotContainer` for rendering maps/overlays
- `KeplerSidePanels` for layer/filter/interaction UI
- utilities for map config persistence, dataset synchronization, and migration
  from legacy Kepler-owned tabs to artifact-backed tabs

## Selection model

- `createKeplerSlice()` manages Kepler map documents and runtime state keyed by
  map id, but it does not own host-level map selection.
- Render maps with explicit ids, for example `<KeplerMapContainer mapId={id} />`.
- Use `@sqlrooms/artifacts` when an app needs multiple user-managed map tabs;
  artifact state should own the selected map artifact.

## Installation

```bash
npm install @kepler.gl/sqlrooms @sqlrooms/room-shell @sqlrooms/duckdb @sqlrooms/ui
```

## Quick start

```tsx
import {useEffect} from 'react';
import {createKeplerSlice, KeplerMapContainer, KeplerSliceState} from '@kepler.gl/sqlrooms';
import {
  createRoomShellSlice,
  createRoomStore,
  RoomShell,
  RoomShellSliceState
} from '@sqlrooms/room-shell';

type RoomState = RoomShellSliceState & KeplerSliceState;

export const {roomStore, useRoomStore} = createRoomStore<RoomState>((set, get, store) => ({
  ...createRoomShellSlice({
    config: {
      dataSources: [
        {
          type: 'url',
          tableName: 'earthquakes',
          url: 'https://huggingface.co/datasets/sqlrooms/earthquakes/resolve/main/earthquakes.parquet'
        }
      ]
    }
  })(set, get, store),
  ...createKeplerSlice()(set, get, store)
}));

function MapPanel() {
  const mapId = useRoomStore(state => state.kepler.config.maps[0]?.id);
  const addTableToMap = useRoomStore(state => state.kepler.addTableToMap);
  const isTableReady = useRoomStore(state => Boolean(state.db.findTable('earthquakes')));

  useEffect(() => {
    if (!isTableReady || !mapId) return;
    void addTableToMap({
      mapId,
      tableName: 'earthquakes',
      options: {
        autoCreateLayers: true,
        centerMap: true
      }
    });
  }, [isTableReady, mapId, addTableToMap]);

  if (!mapId) return null;

  return <KeplerMapContainer mapId={mapId} />;
}

export function App() {
  return (
    <RoomShell roomStore={roomStore} className="h-screen">
      <MapPanel />
    </RoomShell>
  );
}
```

## Adding tables to maps

Use `state.kepler.addTableToMap()` to load a DuckDB table into a Kepler map. The
preferred API is an object parameter:

```ts
await state.kepler.addTableToMap({
  mapId,
  tableName: 'earthquakes',
  options: {
    autoCreateLayers: true,
    centerMap: true
  }
});
```

`tableName` is the SQL table reference to load. It can also be a saved Kepler
dataset id when the configured table-selection policy can resolve that id back
to a DuckDB table.

For normal add-table flows, omit `datasetId`. SQLRooms derives the persisted
Kepler dataset id from the table-selection policy:

```ts
await state.kepler.addTableToMap({
  mapId,
  tableName: 'main.places'
});
```

Only pass `datasetId` when you need to load a table under an existing Kepler
`dataId`, such as when restoring a saved map config:

```ts
await state.kepler.addTableToMap({
  mapId,
  tableName: savedDataId,
  options: {
    autoCreateLayers: false,
    centerMap: false
  },
  datasetId: savedDataId
});
```

The older positional signature is still accepted for compatibility, but new code
should use the object form so the table reference, Kepler options, config, and
dataset-id override remain clear at the call site.

## Common customization

Pass options to `createKeplerSlice()`:

```ts
import {createKeplerTheme, type KeplerThemeOverrides} from '@kepler.gl/sqlrooms';

createKeplerSlice({
  basicKeplerProps: {
    mapboxApiAccessToken: import.meta.env.VITE_MAPBOX_TOKEN
  },
  keplerTheme: createKeplerTheme({
    modalOverLayZ: 40
  } satisfies KeplerThemeOverrides),
  modalPortalTarget: 'body',
  actionLogging: false
});
```

Notes:

- `basicKeplerProps` is for base Kepler registration/component props.
- `keplerTheme` (optional) sets the theme passed to Kepler `ThemeProvider`.
- `modalPortalTarget` controls modal portal placement: `'container'` (default)
  or `'body'`.

### Table selection and dataset ids

`tableSelection` controls which DuckDB tables Kepler exposes and how those
tables are represented in persisted Kepler layer and filter config.

```ts
createKeplerSlice({
  tableSelection: {
    defaultDbSchema: {
      database: 'project',
      schema: 'main'
    },
    includeTable: table => table.table.database === 'project'
  }
});
```

By default, tables in `defaultDbSchema` use bare dataset ids such as `places`.
Tables outside that database/schema use qualified SQL table references. This
keeps common main-schema project tables readable while preserving enough
identity for tables from other schemas.

Use `includeTable` to hide tables from Kepler's Add Layer UI and to skip matching
saved dataset ids during dataset synchronization. Host apps commonly use this to
hide attached databases that will not be available when a project is reopened.

If the default dataset-id policy is not right for your app, provide both
`getDatasetIdForTable` and `findTableForDatasetId` so new layers and restored
layers agree on the same identity scheme:

```ts
createKeplerSlice({
  tableSelection: {
    getDatasetIdForTable: table => `${table.table.schema}:${table.table.table}`,
    findTableForDatasetId: (tables, datasetId) => {
      const [schema, tableName] = datasetId.split(':');
      return tables.find(table => table.table.schema === schema && table.table.table === tableName);
    },
    getTableLabel: table => [table.table.schema, table.table.table].filter(Boolean).join('.')
  }
});
```

`getTableLabel` only affects display labels in Kepler table selectors. It does
not change persisted dataset ids.

## Related packages

- `@sqlrooms/artifacts` for artifact-backed map tabs
- `@kepler.gl/sqlrooms/config` is a lightweight entry point in this package for persisted config schemas and migrations
- `@sqlrooms/room-shell` for Room store composition and UI shell
- `@sqlrooms/duckdb` for DuckDB-backed table loading/querying

## Examples

- Main demo and deployed `/demo` application: [examples/demo-app](../../examples/demo-app)

## Migration and package boundaries

This package incorporates the implementation of `@sqlrooms/kepler` and
`@sqlrooms/kepler-config` from SQLRooms commit
`26d8e78e086cebdfc4eb6b4047c9035c5704a068` under its MIT license. The original
license is included in `LICENSE`.

Replace runtime imports from `@sqlrooms/kepler` with `@kepler.gl/sqlrooms`.
Replace schema-only imports from `@sqlrooms/kepler-config` with:

```ts
import {
  KeplerMapSchema,
  KeplerSliceConfig,
  migrateKeplerTabsToArtifacts
} from '@kepler.gl/sqlrooms/config';
```

The `/config` entry point does not import React, Kepler rendering, or the
SQLRooms runtime. The same schemas remain re-exported from the main entry point.
The serialized map envelope and legacy tab migration retain their original
format; moving the package does not require rewriting saved maps.

The adapter depends on Kepler and SQLRooms. Kepler's foundational packages must
not depend on this adapter. SQLRooms packages are pinned to the tested release
`0.29.0`; Kepler packages follow this repository's version. Keep React,
React Redux, React Intl, styled-components, and the deck.gl/luma.gl stack shared
within the host application. SQLRooms room-store, room-shell, and UI contexts must
also resolve to one copy (see the main demo and website esbuild aliases).
Do not force all third-party versions of Immer to
one version; older Redux Toolkit dependencies require their own supported copy.

Use the SQLRooms connector as the application's database owner. Do not also
initialize a separate Kepler DuckDB adapter for the same project. This adapter
loads Arrow results into Kepler datasets; it does not promise SQL filter
pushdown or automatic refresh of datasets already loaded in a map.

Factory recipes and Kepler application configuration currently have global
scope. Configure them before rendering. Host storage, project save/reopen, and
locale policy are separate from the config schemas. The main demo retains its
existing implementations of these features while migrating its shell.

The SQLRooms repository's old packages are intentionally not removed by this
Kepler PR. After this package is published, a coordinated SQLRooms change can
update consumers and deprecate or re-export the old package names.

## Development

From the repository root:

```sh
yarn install --immutable
yarn workspaces foreach -At run stab
yarn workspace @kepler.gl/sqlrooms build
yarn workspace @kepler.gl/sqlrooms test
yarn start
```

`build` produces CommonJS and ESM output. Run `build:types` after building the
workspace dependencies and their declarations, as in the repository release workflow.
`test` includes config entry-point checks and adapter/task runtime regressions.
The main demo uses local Kepler sources and published SQLRooms packages, so no
sibling SQLRooms checkout is required. Its website build imports the same app.

## Main application shell

`@kepler.gl/sqlrooms/shell` exports `KeplerAppShell` and `SqlroomsSidebarFactory`.
Pair the shell with the original injected Kepler application and `sidePanelWidth={0}`.
The shell reserves sidebar space; the recipe portals the original sidebar content
into it, preserving provider, localization, Redux, and drag-and-drop contexts.
The existing logo/version, data and layer panels, and export/storage menus remain
Kepler components. The main demo uses SQLRooms `LayoutRenderer` and a room layout
slice for map, SQL, and assistant panels, with a ChordShell-style sidebar toggle.

This migrates application composition first. The main demo keeps its existing
Redux map store, data loading, saved-map format, URLs, cloud providers, and query
integration. It does not convert all maps to `KeplerSlice` or to DuckDB tables.
Applications designed around SQLRooms-owned maps can still compose `KeplerSlice`
and the smaller map/panel components exported from the package root.
