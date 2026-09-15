// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {
  addDataToMap,
  addFilter as addFilterAction,
  addLayer as addLayerAction,
  deleteEntry,
  interactionConfigChange,
  ActionTypes as KeplerActionTypes,
  registerEntry,
  removeDataset,
  requestMapStyles,
  setFilter as setFilterAction,
  setFilterAnimationTime as setFilterAnimationTimeAction,
  setFilterAnimationWindow as setFilterAnimationWindowAction,
  setFilterView as setFilterViewAction,
  toggleLayerForMap as toggleLayerForMapAction,
  toggleSplitMap as toggleSplitMapAction,
  wrapTo
} from '@kepler.gl/actions';
import {ALL_FIELD_TYPES, VectorTileDatasetMetadata} from '@kepler.gl/constants';
import {
  castDuckDBTypesForKepler,
  getDuckDBColumnTypes,
  getDuckDBColumnTypesMap,
  restoreGeoarrowMetadata,
  setGeoArrowWKBExtension
} from '@kepler.gl/duckdb';
import {arrowSchemaToFields} from '@kepler.gl/processors';
import {INITIAL_UI_STATE, keplerGlReducer, KeplerGlState, MapStyle} from '@kepler.gl/reducers';
import {KeplerGLSchemaClass} from '@kepler.gl/schemas';
import {KeplerTable} from '@kepler.gl/table';
import {AddDataToMapPayload, MinSavedLayer, ParsedLayer} from '@kepler.gl/types';
import {DatabaseConnection, initApplicationConfig, KeplerApplicationConfig} from '@kepler.gl/utils';
import {createId} from '@paralleldrive/cuid2';
import {KeplerMapSchema, KeplerSliceConfig} from './config';
import {
  BaseRoomStoreState,
  createSlice,
  DbSliceState,
  RoomShellSliceState,
  useBaseRoomShellStore,
  type StateCreator
} from '@sqlrooms/room-shell';
import {getTheme, type ResolvedTheme} from '@sqlrooms/ui';
import * as arrow from 'apache-arrow';
import {produce, setAutoFreeze} from 'immer';
import {taskMiddleware} from '@kepler.gl/tasks-core';
import type {Action, AnyAction, MiddlewareAPI, Store as ReduxStore} from 'redux';
import {compose, Dispatch, Middleware} from 'redux';
import {createLogger, ReduxLoggerOptions} from 'redux-logger';
import type {DefaultTheme} from 'styled-components';
import {getTableIdentity, getUnqualifiedSqlIdentifier} from '@sqlrooms/duckdb-core';
import {
  findKeplerTableForDatasetId,
  getKeplerDatasetIdForTable,
  getKeplerTableLabel,
  type KeplerDbSchemaReference,
  type KeplerTableSelectionOptions
} from './keplerTableSelection';

setAutoFreeze(false); // Kepler attempts to mutate redux state, so we need to disable immer's auto freeze to avoid errors

const KeplerGLSchemaManager = new KeplerGLSchemaClass();

class DesktopKeplerTable extends KeplerTable {
  static getInputDataValidator = function () {
    // Default validator accepts only string timestamps
    return (d: any) => d;
  };
}

export type KeplerGLBasicProps = {
  mapboxApiAccessToken?: string;
};

export type KeplerModalPortalTarget = 'body' | 'container';

export type CreateInitialMapKeplerStateContext = {
  reason: 'initialize' | 'create-map' | 'duplicate-map' | 'register-map' | 'sync-config';
  defaultInitialMapKeplerState: Partial<KeplerGlState>;
  mapId?: string;
  name?: string;
};

export type CreateKeplerSliceOptions = {
  config?: Partial<KeplerSliceConfig>;
  createInitialMapKeplerState?: (
    context: CreateInitialMapKeplerStateContext
  ) => Partial<KeplerGlState>;
  basicKeplerProps?: Partial<KeplerGLBasicProps>;
  /**
   * Theme passed to Kepler's ThemeProvider.
   * Use createKeplerTheme() to merge app-level overrides into the default theme.
   */
  keplerTheme?: DefaultTheme;
  /**
   * Where the Kepler modal (Add Map Style, Export, etc.) should be portaled.
   * - 'body': portals to document.body (escapes stacking contexts)
   * - 'container': portals inside the kepler map container element
   * @default 'container'
   */
  modalPortalTarget?: KeplerModalPortalTarget;
  actionLogging?: boolean | ReduxLoggerOptions;
  middlewares?: Middleware[];
  applicationConfig?: KeplerApplicationConfig;
  /**
   * Controls which DuckDB tables appear in Kepler's Add Layer menu and how
   * those tables are represented in saved Kepler dataset ids.
   */
  tableSelection?: KeplerTableSelectionOptions;
  /**
   * Called when a kepler action is dispatched
   * @param mapId - The map id
   * @param action - The action
   */
  onAction?: (mapId: string, action: KeplerAction) => void;
};

function createDefaultMapKeplerState(resolvedTheme: ResolvedTheme): Partial<KeplerGlState> {
  return {
    mapStyle: {
      styleType: resolvedTheme === 'dark' ? 'dark-matter' : 'positron'
    } as MapStyle,
    uiState: {
      ...INITIAL_UI_STATE,
      activeSidePanel: null,
      currentModal: null,
      mapControls: {
        visibleLayers: INITIAL_UI_STATE.mapControls.visibleLayers,
        splitMap: {
          show: true,
          active: false
        },
        mapLegend: {
          show: true,
          active: false
        },
        toggle3d: {
          show: true,
          active: false
        },
        mapDraw: {
          show: true,
          active: false
        }
      }
    }
  };
}

export function createDefaultKeplerConfig(props?: Partial<KeplerSliceConfig>): KeplerSliceConfig {
  const mapId = createId();
  const config: KeplerSliceConfig = {
    maps: [
      {
        id: mapId,
        name: 'Untitled Map',
        config: undefined,
        lastOpenedAt: Date.now()
      }
    ],
    ...props
  };
  return KeplerSliceConfig.parse(config);
}

export type KeplerAction = {
  type: string;
  payload?: unknown;
};

export function hasMapId(action: unknown): action is KeplerAction & {
  payload: {meta: {_id_: string}};
} {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof action.type === 'string' &&
    'payload' in action &&
    typeof action.payload === 'object' &&
    action.payload !== null &&
    'meta' in action.payload &&
    typeof action.payload.meta === 'object' &&
    action.payload.meta !== null &&
    '_id_' in action.payload.meta &&
    typeof action.payload.meta._id_ === 'string'
  );
}

// support multiple kepler maps
export type KeplerGlReduxState = {[id: string]: KeplerGlState};
export type AddTableToMapLoadOptions = {
  /**
   * Load the table under an explicit Kepler dataset id.
   *
   * Normal callers should omit this so the table-selection policy decides the
   * id. Restore uses it to satisfy already-saved layer/filter dataIds.
   */
  datasetId?: string;
};
export type AddTableToMapParams = {
  mapId: string;
  /**
   * Table reference to load. This can also be an existing/saved Kepler dataset
   * id when the table-selection policy can resolve it back to a table.
   */
  tableName: string;
  options?: AddDataToMapPayload['options'];
  config?: AddDataToMapPayload['config'];
  /**
   * Explicit Kepler dataset id to write into `datasets.info.id`.
   *
   * Most callers should omit this so `tableSelection.getDatasetIdForTable`
   * controls new ids. Restore passes it to preserve saved layer/filter dataIds.
   */
  datasetId?: string;
};
export type AddTableToMapFn = {
  (params: AddTableToMapParams): Promise<void>;
  (
    mapId: string,
    tableName: string,
    options?: AddDataToMapPayload['options'],
    config?: AddDataToMapPayload['config'],
    loadOptions?: AddTableToMapLoadOptions
  ): Promise<void>;
};

function normalizeAddTableToMapParams(
  paramsOrMapId: AddTableToMapParams | string,
  tableName?: string,
  options: AddDataToMapPayload['options'] = {},
  config: AddDataToMapPayload['config'] = {},
  loadOptions: AddTableToMapLoadOptions = {}
): AddTableToMapParams {
  if (typeof paramsOrMapId === 'object') {
    return {
      options: {},
      config: {},
      ...paramsOrMapId
    };
  }

  if (!tableName) {
    throw new Error('addTableToMap requires a tableName.');
  }

  return {
    mapId: paramsOrMapId,
    tableName,
    options,
    config,
    datasetId: loadOptions.datasetId
  };
}

export type KeplerSliceState = {
  kepler: {
    config: KeplerSliceConfig;
    map: KeplerGlReduxState;
    basicKeplerProps?: Partial<KeplerGLBasicProps>;
    keplerTheme?: DefaultTheme;
    modalPortalTarget: KeplerModalPortalTarget;
    tableSelection: KeplerTableSelectionOptions;
    forwardDispatch: {
      [mapId: string]: Dispatch;
    };
    initialize: () => Promise<void>;
    destroy: () => Promise<void>;
    setConfig: (config: KeplerSliceConfig) => void;
    /**
     * Update the datasets in all the kepler map so that they correspond to
     * the latest table schemas in the database
     */
    syncKeplerDatasets: () => Promise<void>;
    addLayer: (
      mapId: string,
      layer: ParsedLayer | MinSavedLayer | undefined,
      datasetId: string
    ) => void;
    addFilter: (mapId: string, datasetId: string) => void;
    setFilter: (
      mapId: string,
      filterIdx: number,
      prop: string | string[],
      value: any,
      valueIndex?: number
    ) => void;
    setFilterAnimationTime: (mapId: string, filterIdx: number, prop: string, value: any) => void;
    setFilterAnimationWindow: (mapId: string, filterId: string, animationWindow: string) => void;
    setFilterView: (
      mapId: string,
      filterIdx: number,
      view: 'side' | 'enlarged' | 'minified'
    ) => void;
    updateTooltipFields: (mapId: string, datasetId: string, fieldNames: string[]) => void;
    toggleSplitMap: (mapId: string, index?: number) => void;
    toggleLayerForMap: (mapId: string, mapIndex: number, layerId: string) => void;
    addTableToMap: AddTableToMapFn;
    addTileSetToMap: (
      mapId: string,
      tableName: string,
      tileset: {
        name: string;
        type: string;
        metadata: VectorTileDatasetMetadata;
      },
      tileMetadata: Record<string, any>,
      autoCreateLayers: boolean
    ) => void;
    addConfigToMap: (mapId: string, config: KeplerMapSchema) => void;
    isRestoringConfig: boolean;
    withConfigPersistencePaused: <TResult>(
      fn: () => TResult | Promise<TResult>
    ) => Promise<TResult>;
    waitForConfigRestore: () => Promise<void>;
    removeDatasetFromMaps: (datasetId: string) => void;
    /**
     * Returns the middleware result. The task middleware returns a Promise
     * that settles after its tasks and their follow-up actions complete.
     * Returns undefined when the requested map has not been registered.
     */
    dispatchAction: (mapId: string, action: KeplerAction) => unknown;
    ensureMap: (mapId: string, name?: string) => void;
    /**
     * Create a new map and return the map id
     * @param name - The name of the map
     * @returns The map id
     */
    createMap: (name?: string, options?: {id?: string}) => string;
    deleteMap: (mapId: string) => void;
    duplicateMap: (mapId: string) => Promise<{success: boolean; message?: string; code?: string}>;
    renameMap: (mapId: string, name: string) => void;
    registerKeplerMapIfNotExists: (mapId: string) => void;
    __reduxProviderStore: ReduxStore<KeplerGlReduxState, AnyAction> | undefined;
  };
};

// Auto save will be triggered in middleware on every kepler action
// skip these actions to avoid unnecessary save
const SKIP_AUTO_SAVE_ACTIONS: string[] = [
  KeplerActionTypes.LAYER_HOVER,
  KeplerActionTypes.UPDATE_MAP,
  KeplerActionTypes.MOUSE_MOVE
];

export function createKeplerSlice({
  basicKeplerProps = {},
  keplerTheme,
  modalPortalTarget = 'container',
  config: initialConfigProps,
  createInitialMapKeplerState,
  actionLogging = false,
  middlewares: additionalMiddlewares = [],
  applicationConfig,
  tableSelection = {},
  onAction
}: CreateKeplerSliceOptions = {}): StateCreator<KeplerSliceState> {
  const initialConfig = createDefaultKeplerConfig(initialConfigProps);
  initApplicationConfig({
    table: DesktopKeplerTable,
    ...applicationConfig
  });
  let syncKeplerPromise: Promise<void> | null = null;
  let configRestoreDepth = 0;
  const configRestorePromises = new Set<Promise<unknown>>();
  // When a caller arrives while a sync is already in-flight, the in-flight run
  // may have captured a stale snapshot of db.tables/kepler.map (missing maps or
  // tables added by createMap, duplicateMap, etc.). Setting this flag tells the
  // active run to loop once more with a fresh snapshot after it finishes, so
  // late mutations are never silently dropped.
  let pendingKeplerSync = false;
  return createSlice<KeplerSliceState, BaseRoomStoreState & KeplerSliceState & DbSliceState>(
    (set, get, store) => {
      function getDefaultDbSchema(): KeplerDbSchemaReference | undefined {
        const currentDatabase = get().db.currentDatabase;
        const currentSchema = get().db.currentSchema;

        if (!currentDatabase || !currentSchema) {
          return undefined;
        }

        return {
          database: currentDatabase,
          schema: currentSchema
        };
      }

      const resolvedTableSelection: KeplerTableSelectionOptions = {
        ...tableSelection
      };

      if (!resolvedTableSelection.defaultDbSchema) {
        resolvedTableSelection.defaultDbSchema = getDefaultDbSchema;
      }

      function resolveInitialMapKeplerState(
        context: Omit<CreateInitialMapKeplerStateContext, 'defaultInitialMapKeplerState'>
      ): Partial<KeplerGlState> {
        const resolvedTheme = getTheme();
        const defaultInitialMapKeplerState = createDefaultMapKeplerState(resolvedTheme);
        return (
          createInitialMapKeplerState?.({
            ...context,
            defaultInitialMapKeplerState
          }) ?? defaultInitialMapKeplerState
        );
      }

      function createKeplerReducer(
        context: Omit<CreateInitialMapKeplerStateContext, 'defaultInitialMapKeplerState'>
      ) {
        return keplerGlReducer.initialState(resolveInitialMapKeplerState(context));
      }

      function registerMapEntry(id: string) {
        return registerEntry({id, ...basicKeplerProps});
      }

      const keplerReducer = createKeplerReducer({reason: 'initialize'});
      const middlewares: Middleware[] = [
        taskMiddleware,
        saveKeplerConfigMiddleware,
        ...additionalMiddlewares
      ];

      if (actionLogging) {
        const logger = createLogger(
          actionLogging === true ? {collapsed: true} : actionLogging
        ) as Middleware;
        middlewares.push(logger);
      }

      const storeDispatch: Dispatch<KeplerAction> = action => {
        set((state: KeplerSliceState) => ({
          ...state,
          kepler: {
            ...state.kepler,
            map: keplerReducer(state.kepler.map, action)
          }
        }));

        // Call onAction if it's defined
        const mapId = hasMapId(action) ? action.payload.meta._id_ : undefined;
        if (!mapId) throw new Error('Map ID not found in action payload');
        onAction?.(mapId, action);
        return action;
      };
      // const forwardDispatch: {[id: string]: Dispatch} = {};
      return {
        kepler: {
          config: initialConfig,
          basicKeplerProps,
          keplerTheme,
          modalPortalTarget,
          tableSelection: resolvedTableSelection,
          map: {},
          isRestoringConfig: false,
          // Artifact views can ensure maps before room initialization completes.
          // initialize() registers those maps and requests their styles.
          dispatchAction: () => undefined,
          __reduxProviderStore: undefined,
          forwardDispatch: {},

          setConfig: (config: KeplerSliceConfig) => {
            void get()
              .kepler.withConfigPersistencePaused(async () => {
                const nextConfig = KeplerSliceConfig.parse(config);
                set(state =>
                  produce(state, draft => {
                    draft.kepler.config = nextConfig;
                  })
                );
                updateMapReduxStates();
                updateForwardDispatch();
                updateMapConfigs();
                await get().kepler.syncKeplerDatasets();
              })
              .catch(error => {
                console.error('setConfig: failed to restore Kepler config', error);
              });
          },

          async initialize() {
            const config = get().kepler.config;
            const keplerInitialState = config.maps.reduce<KeplerGlReduxState>(
              (mapState, map) =>
                createKeplerReducer({
                  reason: 'initialize',
                  mapId: map.id,
                  name: map.name
                })(mapState, registerMapEntry(map.id)),
              {}
            );
            set({
              kepler: {
                ...get().kepler,
                map: keplerInitialState,
                dispatchAction: (mid, action) => {
                  // wrapDispatch(wrapTo(mapId)(action));
                  const dispatchToMap = get().kepler.forwardDispatch[mid];
                  if (dispatchToMap) {
                    return dispatchToMap(wrapTo(mid, action));
                  } else {
                    console.error('dispatchAction: mapId not found', mid);
                    return undefined;
                  }
                },
                __reduxProviderStore: {
                  // Keep Redux's generic dispatch signature for its Provider;
                  // middleware may replace the action return value at runtime.
                  dispatch: <T extends AnyAction>(action: T) => {
                    if (!hasMapId(action)) {
                      throw new Error('Map ID not found in action payload');
                    }
                    return get().kepler.forwardDispatch[action.payload.meta._id_](action);
                  },
                  getState: () => get().kepler.map || {},
                  subscribe: (listener: () => void) =>
                    store.subscribe((state, previousState) => {
                      if (state.kepler.map !== previousState.kepler.map) listener();
                    }),
                  replaceReducer: () => {
                    throw new Error('The Kepler room adapter owns its reducer.');
                  },
                  // @ts-expect-error - Symbol.observable is not defined in the Redux type definitions
                  [Symbol.observable]: () => undefined
                },
                isRestoringConfig: get().kepler.isRestoringConfig
              }
            });
            updateForwardDispatch();
            await get().kepler.withConfigPersistencePaused(async () => {
              updateMapConfigs();
              await get().kepler.syncKeplerDatasets();
            });
            for (const mapId of Object.keys(get().kepler.map)) {
              requestMapStyle(mapId);
            }
          },

          async destroy() {
            // no-op
          },

          addLayer: (mapId, layer, datasetId) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(mapId, addLayerAction(layer, datasetId));
          },

          addFilter: (mapId, datasetId) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(mapId, addFilterAction(datasetId));
          },

          setFilter: (mapId, filterIdx, prop, value, valueIndex) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(mapId, setFilterAction(filterIdx, prop, value, valueIndex));
          },

          setFilterAnimationTime: (mapId, filterIdx, prop, value) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(
              mapId,
              setFilterAnimationTimeAction(filterIdx, prop, value)
            );
          },

          setFilterAnimationWindow: (mapId, filterId, animationWindow) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(
              mapId,
              setFilterAnimationWindowAction({id: filterId, animationWindow})
            );
          },

          setFilterView: (mapId, filterIdx, view) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(mapId, setFilterViewAction(filterIdx, view));
          },

          updateTooltipFields: (mapId, datasetId, fieldNames) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            const mapState = get().kepler.map[mapId];
            const tooltipConfig = mapState?.visState?.interactionConfig?.tooltip;
            if (!tooltipConfig) return;
            const currentFieldsToShow = tooltipConfig.config?.fieldsToShow || {};
            const existingFields = currentFieldsToShow[datasetId] || [];
            const existingByName = new Map(
              existingFields.map((field: {name: string; format: string | null}) => [
                field.name,
                field
              ])
            );
            const nextFields = Array.from(new Set(fieldNames)).map(
              name => existingByName.get(name) ?? {name, format: null}
            );
            if (
              nextFields.length === existingFields.length &&
              nextFields.every(
                (field, index) =>
                  field.name === existingFields[index]?.name &&
                  field.format === existingFields[index]?.format
              )
            ) {
              return;
            }
            get().kepler.dispatchAction(
              mapId,
              interactionConfigChange({
                ...tooltipConfig,
                config: {
                  ...tooltipConfig.config,
                  fieldsToShow: {
                    ...currentFieldsToShow,
                    [datasetId]: nextFields
                  }
                }
              })
            );
          },

          toggleSplitMap: (mapId, index) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(mapId, toggleSplitMapAction(index as number));
          },

          toggleLayerForMap: (mapId, mapIndex, layerId) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(mapId, toggleLayerForMapAction(mapIndex, layerId));
          },

          addTableToMap: (async (
            paramsOrMapId: AddTableToMapParams | string,
            legacyTableName?: string,
            legacyOptions?: AddDataToMapPayload['options'],
            legacyConfig?: AddDataToMapPayload['config'],
            legacyLoadOptions?: AddTableToMapLoadOptions
          ) => {
            const {
              mapId,
              tableName,
              options,
              config,
              datasetId: explicitDatasetId
            } = normalizeAddTableToMapParams(
              paramsOrMapId,
              legacyTableName,
              legacyOptions,
              legacyConfig,
              legacyLoadOptions
            );
            const tableSelection = get().kepler.tableSelection;
            const table = findKeplerTableForDatasetId(get().db.tables, tableName, tableSelection);
            const sqlTableName = table ? getTableIdentity(table.table) : tableName;
            let datasetId = explicitDatasetId;
            if (!datasetId && table) {
              datasetId = getKeplerDatasetIdForTable(table, tableSelection);
            }
            if (!datasetId) {
              datasetId = getUnqualifiedSqlIdentifier(String(sqlTableName)) ?? tableName;
            }
            const connector = await get().db.getConnector();
            const duckDbColumns = await getDuckDBColumnTypes(
              {
                query: (query: string) => connector.query(query).result
              } as DatabaseConnection,
              sqlTableName
            );
            const tableDuckDBTypes = getDuckDBColumnTypesMap(duckDbColumns);
            const adjustedQuery = castDuckDBTypesForKepler(sqlTableName, duckDbColumns);
            const arrowResult = await connector.query(adjustedQuery).result;
            setGeoArrowWKBExtension(arrowResult, duckDbColumns);
            // TODO remove once DuckDB doesn't drop geoarrow metadata
            restoreGeoarrowMetadata(arrowResult, {});
            const fields = arrowSchemaToFields(arrowResult, tableDuckDBTypes);
            const cols = Array.from({length: arrowResult.numCols}, (_, i) =>
              arrowResult.getChildAt(i)
            ).filter(col => col) as arrow.Vector[];

            if (fields && cols) {
              let label = tableName;
              if (table) {
                label = getKeplerTableLabel(table, tableSelection);
              } else {
                label = getUnqualifiedSqlIdentifier(String(sqlTableName)) ?? tableName;
              }
              const datasets: AddDataToMapPayload['datasets'] = {
                data: {fields, cols, rows: [], arrowTable: arrowResult},
                info: {label, id: datasetId},
                metadata: {tableName: sqlTableName}
              };
              await get().kepler.dispatchAction(mapId, addDataToMap({datasets, options, config}));
            }
          }) as AddTableToMapFn,

          ensureMap: (mapId, name) => {
            const now = Date.now();
            set(state =>
              produce(state, draft => {
                const existing = draft.kepler.config.maps.find(map => map.id === mapId);
                if (existing) {
                  if (name && existing.name !== name) {
                    existing.name = name;
                  }
                  return;
                }
                draft.kepler.config.maps.push({
                  id: mapId,
                  name: name ?? 'Untitled Map',
                  lastOpenedAt: now
                });
                draft.kepler.map = createKeplerReducer({
                  reason: 'create-map',
                  mapId,
                  name
                })(draft.kepler.map, registerMapEntry(mapId));
                draft.kepler.forwardDispatch[mapId] = getForwardDispatch(mapId);
              })
            );
            if (!get().kepler.map[mapId]) {
              get().kepler.registerKeplerMapIfNotExists(mapId);
            }
            requestMapStyle(mapId);
            get().kepler.syncKeplerDatasets();
          },

          createMap: (name, options) => {
            const mapId = options?.id ?? createId();
            get().kepler.ensureMap(mapId, name);
            return mapId;
          },

          async syncKeplerDatasets() {
            if (syncKeplerPromise) {
              pendingKeplerSync = true;
              return syncKeplerPromise;
            }
            syncKeplerPromise = (async () => {
              // Loop until no new sync was requested during the current pass.
              // Each iteration reads a fresh snapshot of db.tables and kepler.map,
              // so tables/maps added concurrently are picked up on the next pass.
              do {
                pendingKeplerSync = false;
                for (const mapId of Object.keys(get().kepler.map)) {
                  const mapState = get().kepler.map[mapId];
                  if (!mapState) continue;
                  const keplerDatasets = mapState.visState.datasets;

                  // Only sync tables that are referenced by existing layers or filters
                  const referencedDataIds = new Set<string>();
                  for (const layer of [
                    ...(mapState.visState.layers ?? []),
                    ...(mapState.visState.layerToBeMerged ?? [])
                  ]) {
                    if (layer.config.dataId) {
                      referencedDataIds.add(layer.config.dataId);
                    }
                  }
                  for (const filter of [
                    ...(mapState.visState.filters ?? []),
                    ...(mapState.visState.filterToBeMerged ?? [])
                  ]) {
                    for (const dataId of filter.dataId ?? []) {
                      referencedDataIds.add(dataId);
                    }
                  }

                  const availableTables = get().db.tables;

                  for (const dataId of referencedDataIds) {
                    if (keplerDatasets?.[dataId]) {
                      continue;
                    }
                    const table = findKeplerTableForDatasetId(
                      availableTables,
                      dataId,
                      get().kepler.tableSelection
                    );
                    if (!table) {
                      continue;
                    }
                    try {
                      await get().kepler.addTableToMap({
                        mapId,
                        tableName: dataId,
                        options: {
                          autoCreateLayers: false,
                          centerMap: false
                        },
                        datasetId: dataId
                      });
                    } catch (e) {
                      console.error('syncKeplerDatasets: addTableToMap failed', {
                        dataId,
                        e
                      });
                    }
                  }
                }
              } while (pendingKeplerSync);
            })();
            try {
              await syncKeplerPromise;
            } finally {
              syncKeplerPromise = null;
            }
          },

          deleteMap: mapId => {
            set(state =>
              produce(state, draft => {
                const maps = draft.kepler.config.maps;

                draft.kepler.config.maps = maps.filter(map => map.id !== mapId);

                draft.kepler.map = keplerReducer(draft.kepler.map, deleteEntry(mapId));

                delete draft.kepler.forwardDispatch[mapId];
              })
            );
          },

          duplicateMap: async mapId => {
            // Ensure the map's redux state is registered, consistent with other kepler actions
            get().kepler.registerKeplerMapIfNotExists(mapId);

            const sourceMap = get().kepler.config.maps.find(m => m.id === mapId);
            const sourceMapState = get().kepler.map[mapId];
            if (!sourceMap || !sourceMapState) {
              return {
                success: false,
                message: 'Unable to duplicate map: source map or state not found',
                code: 'source-map-not-found'
              };
            }

            const newMapId = createId();
            const now = Date.now();

            // Save the source map state using Kepler's schema manager
            const savedConfig = KeplerGLSchemaManager.getConfigToSave(sourceMapState);

            set(state =>
              produce(state, draft => {
                draft.kepler.config.maps.push({
                  id: newMapId,
                  name: `Copy of ${sourceMap.name}`,
                  config: savedConfig as any,
                  lastOpenedAt: now
                });
                // Register the new map with empty state, then load the config
                draft.kepler.map = createKeplerReducer({
                  reason: 'duplicate-map',
                  mapId: newMapId,
                  name: `Copy of ${sourceMap.name}`
                })(draft.kepler.map, registerMapEntry(newMapId));
                draft.kepler.forwardDispatch[newMapId] = getForwardDispatch(newMapId);
              })
            );

            // Load the saved config into the new map
            get().kepler.addConfigToMap(newMapId, savedConfig as any);
            requestMapStyle(newMapId);
            get().kepler.syncKeplerDatasets();

            return {
              success: true,
              message: 'Map duplicated successfully'
            };
          },

          renameMap: (mapId, name) => {
            set(state =>
              produce(state, draft => {
                const map = draft.kepler.config.maps.find(map => map.id === mapId);
                if (map) {
                  map.name = name;
                }
              })
            );
          },

          addDataToMap: (mapId: string, data: any) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            get().kepler.dispatchAction(mapId, addDataToMap(data));
          },

          addTileSetToMap: (mapId, tableName, tileset, tileMetadata, autoCreateLayers = true) => {
            get().kepler.registerKeplerMapIfNotExists(mapId);
            const dataset = {
              info: {
                label: tileset.name,
                type: tileset.type,
                format: 'rows',
                // important for kepler to reload this tileset
                id: tableName
              },
              data: {
                fields: tileMetadata?.fields || [],
                rows: []
              },
              metadata: {
                // duckdb table name
                tableName,
                ...tileMetadata,
                ...tileset.metadata
              },
              // vector tile layer only supports gpu filtering for now
              supportedFilterTypes: [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer],
              disableDataOperation: true
            };
            get().kepler.dispatchAction(
              mapId,
              addDataToMap({
                datasets: dataset,
                options: {
                  autoCreateLayers,
                  centerMap: true
                }
              })
            );
          },

          addConfigToMap: (mapId: string, config: any) => {
            // if map not registered, register it
            get().kepler.registerKeplerMapIfNotExists(mapId);
            const parsedConfig = KeplerGLSchemaManager.parseSavedConfig(config);
            if (!parsedConfig) {
              throw new Error('Failed to parse config');
            }
            get().kepler.dispatchAction(mapId, addDataToMap({config: parsedConfig, datasets: []}));
          },

          withConfigPersistencePaused: async fn => {
            configRestoreDepth += 1;
            if (configRestoreDepth === 1) {
              set(state =>
                produce(state, draft => {
                  draft.kepler.isRestoringConfig = true;
                })
              );
            }

            const restorePromise = (async () => {
              try {
                return await fn();
              } finally {
                // Kepler restore actions can enqueue follow-up work through
                // the task middleware; let those actions settle before persisted config
                // writes are allowed again.
                await new Promise(resolve => setTimeout(resolve, 0));
                await new Promise(resolve => setTimeout(resolve, 0));
                configRestoreDepth -= 1;
                if (configRestoreDepth === 0) {
                  set(state =>
                    produce(state, draft => {
                      draft.kepler.isRestoringConfig = false;
                    })
                  );
                }
              }
            })();

            configRestorePromises.add(restorePromise);
            try {
              return await restorePromise;
            } finally {
              configRestorePromises.delete(restorePromise);
            }
          },

          waitForConfigRestore: async () => {
            while (configRestorePromises.size > 0) {
              await Promise.allSettled(Array.from(configRestorePromises));
            }
          },

          registerKeplerMapIfNotExists(mapId: string) {
            if (!get().kepler.map[mapId]) {
              set({
                kepler: {
                  ...get().kepler,
                  map: createKeplerReducer({
                    reason: 'register-map',
                    mapId
                  })(get().kepler.map, registerMapEntry(mapId)),
                  forwardDispatch: {
                    ...get().kepler.forwardDispatch,
                    [mapId]: getForwardDispatch(mapId)
                  }
                }
              });
              requestMapStyle(mapId);
            }
          },

          removeDatasetFromMaps: (datasetId: string) => {
            for (const mapId of Object.keys(get().kepler.map)) {
              const map = get().kepler.map[mapId];
              if (map) {
                get().kepler.dispatchAction(mapId, removeDataset(datasetId));
              }
            }
          }
        }
      };

      function requestMapStyle(mapId: string) {
        const {mapStyle} = get().kepler.map[mapId] || {};
        const style = mapStyle?.mapStyles[mapStyle.styleType];
        if (style) {
          get().kepler.dispatchAction(mapId, requestMapStyles({[style.id]: style}));
        }
      }

      function saveKeplerConfigMiddleware(): ReturnType<Middleware> {
        return next => action => {
          // get id from kepler action payload meta
          if (!hasMapId(action) || !action.payload.meta._id_) {
            throw new Error('Map ID not found in action payload');
          }
          const mapId = action.payload.meta._id_;
          const result = next(action);
          if (
            configRestoreDepth === 0 &&
            !get().kepler.isRestoringConfig &&
            !SKIP_AUTO_SAVE_ACTIONS.includes(action.type) &&
            mapId
          ) {
            // save kepler config to store
            set(state =>
              produce(state, draft => {
                const mapToSave = draft.kepler.config.maps.find(map => map.id === mapId);
                if (mapToSave && state.kepler.map?.[mapId]) {
                  mapToSave.config = KeplerGLSchemaManager.getConfigToSave(
                    state.kepler.map[mapId]
                  ) as any;
                }
              })
            );
          }
          // save kepler config to local storage
          return result;
        };
      }

      function updateMapConfigs() {
        const config = get().kepler.config;
        const keplerMaps = config.maps;
        for (const {id, config} of keplerMaps) {
          if (config) {
            get().kepler.addConfigToMap(id, config as unknown as KeplerMapSchema);
          }
        }
      }

      function updateMapReduxStates() {
        set(state =>
          produce(state, draft => {
            // Delete redux state of maps that are not in the config
            for (const mapId of Object.keys(draft.kepler.map)) {
              if (!draft.kepler.config.maps.some(map => map.id === mapId)) {
                draft.kepler.map = keplerReducer(draft.kepler.map, deleteEntry(mapId));
              }
            }
            // Register redux state of maps that are not in the config
            for (const map of draft.kepler.config.maps) {
              if (!draft.kepler.map[map.id]) {
                draft.kepler.map = createKeplerReducer({
                  reason: 'sync-config',
                  mapId: map.id,
                  name: map.name
                })(draft.kepler.map, registerMapEntry(map.id));
                draft.kepler.forwardDispatch[map.id] = getForwardDispatch(map.id);
              }
            }
          })
        );
      }

      function updateForwardDispatch() {
        const config = get().kepler.config;
        const forwardDispatch: Record<string, Dispatch<KeplerAction>> = {};
        if (config) {
          for (const {id} of config.maps) {
            forwardDispatch[id] = getForwardDispatch(id);
          }
        }
        set(state =>
          produce(state, draft => {
            draft.kepler.forwardDispatch = forwardDispatch;
          })
        );
      }

      function getForwardDispatch(mapId: string): Dispatch<KeplerAction> {
        /** Adapted from  applyMiddleware in redux */
        let wrapDispatch: (action: KeplerAction, ...args: any) => KeplerAction = () => {
          throw new Error(
            'Dispatching while constructing your middleware is not allowed. ' +
              'Other middleware would not be applied to this dispatch.'
          );
        };
        const wrapToMap = wrapTo(mapId);
        const middlewareAPI: MiddlewareAPI<any, any> = {
          getState: get,
          dispatch: (action: Action, ...args: any) => {
            // need to forward here as well
            return wrapDispatch(wrapToMap(action), ...args);
          }
        };

        const chain = middlewares.map(middleware => middleware(middlewareAPI));
        wrapDispatch = compose<Dispatch>(...chain)(storeDispatch);
        return wrapDispatch as Dispatch<KeplerAction>;
      }
    }
  );
}

type RoomStateWithDiscuss = RoomShellSliceState & KeplerSliceState;

export function useStoreWithKepler<T>(selector: (state: RoomStateWithDiscuss) => T): T {
  return useBaseRoomShellStore<RoomStateWithDiscuss, T>(state =>
    selector(state as RoomStateWithDiscuss)
  );
}
