// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  toggleModalUpdater,
  loadFilesSuccessUpdater as uiStateLoadFilesSuccessUpdater,
  toggleMapControlUpdater,
  toggleSplitMapUpdater as uiStateToggleSplitMapUpdater,
  receiveMapConfigUpdater as uiStateReceiveMapConfigUpdater
} from './ui-state-updaters';
import {
  updateVisDataUpdater as visStateUpdateVisDataUpdater,
  setMapInfoUpdater,
  layerTypeChangeUpdater,
  toggleSplitMapUpdater as visStateToggleSplitMapUpdater,
  prepareStateForDatasetReplace
} from './vis-state-updaters';
import {
  receiveMapConfigUpdater as stateMapConfigUpdater,
  toggleSplitMapUpdater as mapStateToggleSplitMapUpdater,
  setMapSplitModeUpdater as mapStateSetMapSplitModeUpdater,
  setMapViewModeUpdater
} from './map-state-updaters';
import {
  mapStyleChangeUpdater,
  receiveMapConfigUpdater as styleMapConfigUpdater
} from './map-style-updaters';
import {filesToDataPayload} from '@kepler.gl/processors';
import {payload_, apply_, with_, if_, compose_, merge_, pick_} from './composer-helpers';
import {MapState, UiState, AddDataToMapPayload, ParsedConfig, ProtoDataset} from '@kepler.gl/types';
import {MapStyle} from './map-style-updaters';
import {ProviderState} from './provider-state-updaters';
import {
  loadFilesSuccessUpdaterAction,
  ConfirmReplaceDatasetUpdaterAction,
  StageLoadedFilesUpdaterAction,
  MapStyleChangeUpdaterAction,
  LayerTypeChangeUpdaterAction,
  ToggleSplitMapUpdaterAction,
  ReplaceDataInMapPayload,
  MapStateActions
} from '@kepler.gl/actions';
import {VisState} from '@kepler.gl/schemas';
import {Layer} from '@kepler.gl/layers';
import {isPlainObject, computeSplitMapLayers} from '@kepler.gl/utils';
import {findMapBounds} from './data-utils';
import {
  BASE_MAP_COLOR_MODES,
  OVERLAY_BLENDINGS,
  NO_MAP_ID,
  MapSplitMode,
  ADD_DATA_ID
} from '@kepler.gl/constants';
import {getBasemapColorsForStyle, DEFAULT_BASEMAP_COLOR} from '@kepler.gl/deckgl-layers';

export type KeplerGlState = {
  visState: VisState;
  mapState: MapState;
  mapStyle: MapStyle;
  uiState: UiState;
  providerState: ProviderState;
};

// compose action to apply result multiple reducers, with the output of one

/**
 * Some actions will affect the entire kepler.lg instance state.
 * The updaters for these actions is exported as `combinedUpdaters`. These updater take the entire instance state
 * as the first argument. Read more about [Using updaters](../advanced-usage/using-updaters.md)
 * @public
 * @example
 *
 * import keplerGlReducer, {combinedUpdaters} from '@kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    // add data to map after receiving data from remote sources
 *    case 'LOAD_REMOTE_RESOURCE_SUCCESS':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          // pass in kepler.gl instance state to combinedUpdaters
 *          map:  combinedUpdaters.addDataToMapUpdater(
 *           state.keplerGl.map,
 *           {
 *             payload: {
 *               datasets: action.datasets,
 *               options: {readOnly: true},
 *               config: action.config
 *              }
 *            }
 *          )
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
const combinedUpdaters = null;
/* eslint-enable @typescript-eslint/no-unused-vars */

export const isValidConfig = config =>
  isPlainObject(config) && isPlainObject(config.config) && config.version;

export const defaultAddDataToMapOptions = {
  centerMap: true,
  keepExistingConfig: false,
  autoCreateLayers: true,
  autoCreateTooltips: true
};

/**
 * Combine data and full configuration update in a single action
 *
 * @memberof combinedUpdaters
 * @param {Object} state kepler.gl instance state, containing all subreducer state
 * @param {Object} action
 * @param {Object} action.payload `{datasets, options, config}`
 * @param action.payload.datasets - ***required** datasets can be a dataset or an array of datasets
 * Each dataset object needs to have `info` and `data` property.
 * @param [action.payload.options] option object `{centerMap: true, padding: {left: 300}}`
 * @param [action.payload.config] map config
 * @param [action.payload.info] map info contains title and description
 * @returns nextState
 *
 * @typedef {Object} Dataset
 * @property info -info of a dataset
 * @property info.id - id of this dataset. If config is defined, `id` should matches the `dataId` in config.
 * @property info.label - A display name of this dataset
 * @property data - ***required** The data object, in a tabular format with 2 properties `fields` and `rows`
 * @property data.fields - ***required** Array of fields,
 * @property data.fields.name - ***required** Name of the field,
 * @property data.rows - ***required** Array of rows, in a tabular format with `fields` and `rows`
 *
 * @public
 */
export const addDataToMapUpdater = (
  state: KeplerGlState,
  {payload}: {payload: AddDataToMapPayload}
): KeplerGlState => {
  const {datasets, config, info} = payload;

  const options = {
    ...defaultAddDataToMapOptions,
    ...payload.options
  };

  // check if progressive loading dataset by batches, and update visState directly
  const isProgressiveLoading =
    Array.isArray(datasets) &&
    datasets[0]?.info.format === 'arrow' &&
    datasets[0]?.info.id &&
    datasets[0]?.info.id in state.visState.datasets;
  if (isProgressiveLoading) {
    return compose_<KeplerGlState>([
      pick_('visState')(
        apply_<VisState, any>(visStateUpdateVisDataUpdater, {
          datasets,
          options,
          config
        })
      )
    ])(state);
  }

  // @ts-expect-error
  let parsedConfig: ParsedConfig = config;

  if (isValidConfig(config)) {
    // if passed in saved config
    // @ts-expect-error
    parsedConfig = state.visState.schema.parseSavedConfig(config);
  }
  const oldLayers = state.visState.layers;
  const filterNewlyAddedLayers = (layers: Layer[]) =>
    layers.filter(nl => !oldLayers.find(ol => ol === nl));

  // Returns undefined if not found, to make typescript happy
  const findMapBoundsIfCentered = (layers: Layer[]) => {
    const bounds = options.centerMap && findMapBounds(layers);
    return bounds ? bounds : undefined;
  };

  return compose_<KeplerGlState>([
    pick_('visState')(
      // this part can be async
      apply_<VisState, any>(visStateUpdateVisDataUpdater, {
        datasets,
        options,
        config: parsedConfig
      })
    ),

    if_(Boolean(info), pick_('visState')(apply_<VisState, any>(setMapInfoUpdater, {info}))),
    // Note that fit bounds here won't be called in case datasets are created in Tasks.
    // A separate Task to update bounds is created once the datasets are ready.
    with_(({visState}) =>
      pick_('mapState')(
        apply_(
          stateMapConfigUpdater,
          payload_({
            config: parsedConfig,
            options,
            bounds: findMapBoundsIfCentered(filterNewlyAddedLayers(visState.layers))
          })
        )
      )
    ),
    pick_('mapStyle')(apply_(styleMapConfigUpdater, payload_({config: parsedConfig, options}))),
    pick_('uiState')(
      apply_(uiStateReceiveMapConfigUpdater, payload_({config: parsedConfig, options}))
    ),
    pick_('uiState')(apply_(uiStateLoadFilesSuccessUpdater, payload_(null))),

    pick_('uiState')(apply_(toggleModalUpdater, payload_(null))),
    pick_('uiState')(
      merge_(
        Object.prototype.hasOwnProperty.call(options, 'readOnly')
          ? {readOnly: options.readOnly}
          : {}
      )
    )
  ])(state);
};

export const loadFilesSuccessUpdater = (
  state: KeplerGlState,
  action: loadFilesSuccessUpdaterAction
): KeplerGlState => {
  if (isStaleFileLoadFinish(state.visState.fileLoading, action.loadId)) {
    return state;
  }
  // still more to load
  const payloads = filesToDataPayload(action.result, action.options);
  const nextState = compose_([
    pick_('visState')(
      merge_({
        fileLoading: false,
        fileLoadingProgress: {},
        stagedToAdd: null
      })
    )
  ])(state);
  // make multiple add data to map calls
  const stateWithData = compose_(payloads.map(p => apply_(addDataToMapUpdater, payload_(p))))(
    nextState
  );
  return stateWithData as KeplerGlState;
};

function keptLoadErrors(progress: Record<string, {error?: unknown}> = {}) {
  return Object.fromEntries(Object.entries(progress).filter(([, value]) => value?.error));
}

/** A finish from the 200ms pause is stale once that load was canceled or replaced. */
function isStaleFileLoadFinish(fileLoading: {loadId?: number} | false, loadId?: number): boolean {
  if (loadId == null) {
    return false;
  }
  return !fileLoading || fileLoading.loadId !== loadId;
}

/**
 * Finish a deferred file load: keep the parsed cache, clear the loading flag,
 * and leave the Add Data modal open until the user confirms.
 * @memberof combinedUpdaters
 * @public
 */
export const stageLoadedFilesUpdater = (
  state: KeplerGlState,
  action: StageLoadedFilesUpdaterAction
): KeplerGlState => {
  if (isStaleFileLoadFinish(state.visState.fileLoading, action.loadId)) {
    return state;
  }
  const modalOpen = state.uiState.currentModal === ADD_DATA_ID;
  const result = action.result || [];
  const previous =
    modalOpen && Array.isArray(state.visState.stagedToAdd) ? state.visState.stagedToAdd : [];
  const stagedToAdd = [...previous, ...result];

  return compose_<KeplerGlState>([
    pick_('visState')(
      merge_({
        fileLoading: false,
        fileLoadingProgress: modalOpen ? keptLoadErrors(state.visState.fileLoadingProgress) : {},
        stagedToAdd: modalOpen && stagedToAdd.length ? stagedToAdd : null
      })
    ),
    pick_('uiState')(apply_(uiStateLoadFilesSuccessUpdater, payload_(null)))
  ])(state);
};

function stagedItemKey(item): string {
  return item?.metadata?.source || item?.info?.id || '';
}

/**
 * Add datasets to the Add Data list without interrupting a file that is still parsing.
 * @memberof combinedUpdaters
 * @public
 */
export const appendStagedLoadedFilesUpdater = (
  state: KeplerGlState,
  action: StageLoadedFilesUpdaterAction
): KeplerGlState => {
  if (state.uiState.currentModal !== ADD_DATA_ID) {
    return state;
  }
  const previous = Array.isArray(state.visState.stagedToAdd) ? state.visState.stagedToAdd : [];
  const seen = new Set(previous.map(stagedItemKey).filter(Boolean));
  const next = (action.result || []).filter(item => {
    const key = stagedItemKey(item);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  if (!next.length) {
    return state;
  }
  return compose_<KeplerGlState>([
    pick_('visState')(merge_({stagedToAdd: [...previous, ...next]}))
  ])(state);
};

/**
 * The first plain dataset in a confirmed upload replaces the selected table.
 * A kepler.gl map json is added as a map. Further tables are added after the replacement.
 */
function splitReplacementUpload(payloads: AddDataToMapPayload[]): {
  datasetToUse: ProtoDataset | null;
  remainder: AddDataToMapPayload[];
} {
  const datasets: ProtoDataset[] = [];
  const maps: AddDataToMapPayload[] = [];
  payloads.forEach(payload => {
    if (payload.config) {
      maps.push(payload);
      return;
    }
    const list = (Array.isArray(payload.datasets) ? payload.datasets : [payload.datasets]).filter(
      (dataset): dataset is ProtoDataset => Boolean(dataset)
    );
    datasets.push(...list);
  });
  const [datasetToUse, ...more] = datasets;
  return {
    datasetToUse: datasetToUse ?? null,
    remainder: [
      ...maps,
      ...(more.length
        ? [
            {
              datasets: more,
              options: {keepExistingConfig: true, centerMap: false, autoCreateLayers: false}
            }
          ]
        : [])
    ]
  };
}

/**
 * Turn a confirmed Add Data selection into a dataset replacement.
 * Layers and filters move onto the new table. The original table is dropped unless asked to stay.
 * @memberof combinedUpdaters
 * @public
 */
export const confirmReplaceDatasetUpdater = (
  state: KeplerGlState,
  action: ConfirmReplaceDatasetUpdaterAction
): KeplerGlState => {
  const payloads = filesToDataPayload(action.result, {
    keepExistingConfig: true,
    centerMap: true,
    autoCreateLayers: false
  });
  const cleared = compose_([
    pick_('visState')(
      merge_({
        fileLoading: false,
        fileLoadingProgress: {},
        stagedToAdd: null
      })
    )
  ])(state);

  const {datasetToUse, remainder} = splitReplacementUpload(payloads);
  if (datasetToUse?.info?.id && action.datasetToReplaceId) {
    const replaced = replaceDataInMapUpdater(cleared, {
      payload: {
        datasetToReplaceId: action.datasetToReplaceId,
        datasetToUse,
        options: {deleteOriginalDataset: action.deleteOriginalDataset !== false}
      }
    });
    if (replaced !== cleared) {
      if (!remainder.length) {
        return replaced;
      }
      return compose_(remainder.map(p => apply_(addDataToMapUpdater, payload_(p))))(
        replaced
      ) as KeplerGlState;
    }
  }

  return compose_(payloads.map(p => apply_(addDataToMapUpdater, payload_(p))))(
    cleared
  ) as KeplerGlState;
};

export const addDataToMapComposed = addDataToMapUpdater;

/**
 * Helper which updates map overlay blending mode in visState,
 * but only if it's not currently in the `normal` mode.
 */
const updateOverlayBlending = overlayBlending => visState => {
  if (visState.overlayBlending !== OVERLAY_BLENDINGS.normal.value) {
    return {
      ...visState,
      overlayBlending
    };
  }
  return visState;
};

/**
 * Helper which updates `darkBaseMapEnabled` in all the layers in visState which
 * have this config setting (or in one specific layer if the `layerId` param is provided).
 */
const updateDarkBaseMapLayers =
  (darkBaseMapEnabled: boolean, layerId: string | null = null) =>
  visState => ({
    ...visState,
    layers: visState.layers.map(layer => {
      if (!layerId || layer.id === layerId) {
        if (Object.prototype.hasOwnProperty.call(layer.visConfigSettings, 'darkBaseMapEnabled')) {
          const {visConfig} = layer.config;
          return layer.updateLayerConfig({
            visConfig: {...visConfig, darkBaseMapEnabled}
          });
        }
      }
      return layer;
    })
  });

/**
 * Updater that changes the map style by calling mapStyleChangeUpdater on visState.
 * In addition to that, it does the following:
 *
 *   1. Update map overlay blending mode in accordance with the colorMode of the
 *      base map, but only if it's not in the `normal` mode.
 *
 *   2. Update all the layers which have the `darkBaseMapEnabled` config setting
 *      adjusting it in accordance with the colorMode of the base map.
 *
 */
export const combinedMapStyleChangeUpdater = (
  state: KeplerGlState,
  action: MapStyleChangeUpdaterAction
): KeplerGlState => {
  const {payload} = action;
  const {mapStyle} = state;
  const getColorMode = key => mapStyle.mapStyles[key]?.colorMode;
  const prevColorMode = getColorMode(mapStyle.styleType);
  const nextColorMode = getColorMode(payload.styleType);
  let {visState, mapState} = state;
  if (nextColorMode !== prevColorMode) {
    switch (nextColorMode) {
      case BASE_MAP_COLOR_MODES.DARK:
        visState = compose_([
          updateOverlayBlending(OVERLAY_BLENDINGS.screen.value),
          updateDarkBaseMapLayers(true)
        ])(visState);
        break;
      case BASE_MAP_COLOR_MODES.LIGHT:
        visState = compose_([
          updateOverlayBlending(OVERLAY_BLENDINGS.darken.value),
          updateDarkBaseMapLayers(false)
        ])(visState);
        break;
      default:
      // do nothing
    }
  }

  // Update globe config colors when style changes and globe is enabled
  if (mapState.globe?.enabled) {
    // Switching from "No Basemap" to a basemap - restore basemap sub-toggles
    if (payload.styleType !== NO_MAP_ID && mapStyle.styleType === NO_MAP_ID) {
      mapState = {
        ...mapState,
        globe: {
          ...mapState.globe,
          config: {
            ...mapState.globe.config,
            basemap: true,
            labels: true,
            adminLines: true,
            water: true
          }
        }
      };
    }
    mapState = syncGlobeConfigColorsToStyle(mapState, mapStyle, payload.styleType);
  }

  return {
    ...state,
    visState,
    mapState,
    mapStyle: mapStyleChangeUpdater(mapStyle, {payload: {...payload}})
  };
};

/**
 * Derive globe basemap colors (surface / water / admin lines) from a map style and
 * return an updated mapState with those colors written into `globe.config`. Used both
 * when the base map style changes and when entering globe mode, so the globe always
 * reflects the currently selected basemap instead of the static DEFAULT_GLOBE_CONFIG.
 */
export function syncGlobeConfigColorsToStyle(
  mapState: MapState,
  mapStyle: MapStyle,
  styleType: string
): MapState {
  if (!mapState.globe?.enabled) {
    return mapState;
  }

  const nextStyleObj = mapStyle.mapStyles[styleType];
  const nextGlobeConfig = {...mapState.globe.config};

  if (styleType === NO_MAP_ID) {
    nextGlobeConfig.basemap = false;
    nextGlobeConfig.labels = false;
    nextGlobeConfig.adminLines = false;
    nextGlobeConfig.water = false;
    nextGlobeConfig.surfaceColor = DEFAULT_BASEMAP_COLOR.backgroundFillColor;
    nextGlobeConfig.waterColor = DEFAULT_BASEMAP_COLOR.basemapWaterFillColor;
    nextGlobeConfig.adminLinesColor = DEFAULT_BASEMAP_COLOR.basemapAdminLineColor;
  } else {
    const basemapColors = nextStyleObj
      ? getBasemapColorsForStyle(styleType, {
          style: nextStyleObj.style,
          layerGroups: nextStyleObj.layerGroups
        })
      : // Style object not yet loaded - use known presets by style type
        getBasemapColorsForStyle(styleType);
    nextGlobeConfig.surfaceColor = basemapColors.backgroundFillColor;
    nextGlobeConfig.waterColor = basemapColors.basemapWaterFillColor;
    nextGlobeConfig.adminLinesColor = basemapColors.basemapAdminLineColor;
  }

  return {
    ...mapState,
    globe: {
      ...mapState.globe,
      config: nextGlobeConfig
    }
  };
}

/**
 * Updater that switches the map view mode (2D / 3D / Globe). Runs the base map-state
 * updater and, when entering globe mode, syncs the globe basemap colors to the
 * currently selected map style so the globe doesn't show stale default colors.
 */
export const combinedSetMapViewModeUpdater = (
  state: KeplerGlState,
  action: MapStateActions.SetMapViewModeUpdaterAction
): KeplerGlState => {
  let mapState = setMapViewModeUpdater(state.mapState, action);

  if (mapState.globe?.enabled) {
    mapState = syncGlobeConfigColorsToStyle(mapState, state.mapStyle, state.mapStyle.styleType);
  }

  return {
    ...state,
    mapState
  };
};

/**
 * Updater that changes the layer type by calling `layerTypeChangeUpdater` on visState.
 * In addition to that, if the new layer type has the `darkBaseMapEnabled` config
 * setting, we adjust it in accordance with the colorMode of the base map.s
 */
export const combinedLayerTypeChangeUpdater = (
  state: KeplerGlState,
  action: LayerTypeChangeUpdaterAction
): KeplerGlState => {
  let {visState} = state;
  const oldLayerIndex = visState.layers.findIndex(layer => layer === action.oldLayer);
  visState = layerTypeChangeUpdater(visState, action);
  const newLayer = visState.layers[oldLayerIndex];
  if (Object.prototype.hasOwnProperty.call(newLayer?.visConfigSettings, 'darkBaseMapEnabled')) {
    const {mapStyle} = state;
    const {colorMode} = mapStyle.mapStyles[mapStyle.styleType];
    const {darkBaseMapEnabled} = newLayer.config.visConfig;
    switch (colorMode) {
      case BASE_MAP_COLOR_MODES.DARK:
        if (!darkBaseMapEnabled) {
          visState = updateDarkBaseMapLayers(true, newLayer.id)(visState);
        }
        break;
      case BASE_MAP_COLOR_MODES.LIGHT:
        if (darkBaseMapEnabled) {
          visState = updateDarkBaseMapLayers(false, newLayer.id)(visState);
        }
        break;
      default:
      // do nothing
    }
  }
  return {
    ...state,
    visState
  };
};

/**
 * Make mapLegend active when toggleSplitMap action is called
 */
export const toggleSplitMapUpdater = (
  state: KeplerGlState,
  action: ToggleSplitMapUpdaterAction
): KeplerGlState => {
  const newState = {
    ...state,
    visState: visStateToggleSplitMapUpdater(state.visState, action),
    uiState: uiStateToggleSplitMapUpdater(state.uiState),
    mapState: mapStateToggleSplitMapUpdater(state.mapState)
  };

  const isSplit = newState.visState.splitMaps.length !== 0;
  const isLegendActive = newState.uiState.mapControls?.mapLegend?.active;
  if (isSplit && !isLegendActive) {
    newState.uiState = toggleMapControlUpdater(newState.uiState, {
      payload: {panelId: 'mapLegend', index: action.payload}
    });
  }

  return newState;
};

/**
 * Set map split mode updater - coordinates state changes across visState, mapState, and uiState
 */
export const setMapSplitModeUpdater = (
  state: KeplerGlState,
  action: MapStateActions.SetMapSplitModeUpdaterAction
): KeplerGlState => {
  const {mapSplitMode} = action.payload;
  const prevMode = state.mapState.mapSplitMode;

  if (mapSplitMode === prevMode) {
    return state;
  }

  const newMapState = mapStateSetMapSplitModeUpdater(state.mapState, action);

  let newVisState = {...state.visState};

  switch (mapSplitMode) {
    case MapSplitMode.SINGLE_MAP:
      newVisState = {
        ...newVisState,
        splitMaps: []
      };
      break;
    case MapSplitMode.DUAL_MAP:
    case MapSplitMode.SWIPE_COMPARE:
      if (prevMode === MapSplitMode.SINGLE_MAP) {
        newVisState = {
          ...newVisState,
          splitMaps: computeSplitMapLayers(newVisState.layers, {
            duplicate: mapSplitMode === MapSplitMode.SWIPE_COMPARE
          })
        };
      }
      break;
    default:
      break;
  }

  let newUiState = uiStateToggleSplitMapUpdater(state.uiState);

  const isSplit = newVisState.splitMaps.length !== 0;
  const isLegendActive = newUiState.mapControls?.mapLegend?.active;
  if (isSplit && !isLegendActive) {
    newUiState = toggleMapControlUpdater(newUiState, {
      payload: {panelId: 'mapLegend', index: 0}
    });
  }

  return {
    ...state,
    mapState: newMapState,
    visState: newVisState,
    uiState: newUiState
  };
};

const defaultReplaceDataToMapOptions = {
  keepExistingConfig: true,
  centerMap: true,
  autoCreateLayers: false
};

/**
 * Updater replace a dataset in state
 */
export const replaceDataInMapUpdater = (
  state: KeplerGlState,
  {payload}: {payload: ReplaceDataInMapPayload}
): KeplerGlState => {
  const {datasetToReplaceId, datasetToUse, options = {}} = payload;
  const {deleteOriginalDataset = true, ...replaceOptions} = options;
  const addDataToMapOptions = {...defaultReplaceDataToMapOptions, ...replaceOptions};

  // check if dataset is there
  if (!state.visState.datasets[datasetToReplaceId]) {
    return state;
  }
  // datasetToUse is ProtoDataset
  const dataIdToUse = datasetToUse.info.id;
  if (!dataIdToUse) {
    return state;
  }
  // remove dataset and put dependencies in toBeMerged
  const preparedState = {
    ...state,
    visState: prepareStateForDatasetReplace(state.visState, datasetToReplaceId, dataIdToUse, {
      deleteOriginalDataset
    })
  };

  const nextState = addDataToMapUpdater(
    preparedState,
    payload_({
      datasets: datasetToUse,
      // should zoom to new dataset
      options: addDataToMapOptions
    })
  );

  return nextState;
};
