// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  toggleModalUpdater,
  loadFilesSuccessUpdater as uiStateLoadFilesSuccessUpdater,
  toggleMapControlUpdater,
  toggleSplitMapUpdater as uiStateToggleSplitMapUpdater
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
  toggleSplitMapUpdater as mapStateToggleSplitMapUpdater
} from './map-state-updaters';
import {
  mapStyleChangeUpdater,
  receiveMapConfigUpdater as styleMapConfigUpdater
} from './map-style-updaters';
import {filesToDataPayload} from '@kepler.gl/processors';
import {payload_, apply_, with_, if_, compose_, merge_, pick_} from './composer-helpers';
import {MapState, UiState, AddDataToMapPayload, ParsedConfig} from '@kepler.gl/types';
import {MapStyle} from './map-style-updaters';
import {ProviderState} from './provider-state-updaters';
import {
  loadFilesSuccessUpdaterAction,
  MapStyleChangeUpdaterAction,
  LayerTypeChangeUpdaterAction,
  ToggleSplitMapUpdaterAction,
  ReplaceDataInMapPayload
} from '@kepler.gl/actions';
import {VisState} from '@kepler.gl/schemas';
import {Layer} from '@kepler.gl/layers';
import {isPlainObject} from '@kepler.gl/utils';
import {findMapBounds} from './data-utils';
import {BASE_MAP_COLOR_MODES, OVERLAY_BLENDINGS} from '@kepler.gl/constants';

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
 * import keplerGlReducer, {combinedUpdaters} from 'kepler.gl/reducers';
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
 * @param [action.payload.options] option object `{centerMap: true}`
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

  // check if progresive loading dataset by bataches, and update visState directly
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
      apply_<VisState, any>(visStateUpdateVisDataUpdater, {
        datasets,
        options,
        config: parsedConfig
      })
    ),

    if_(Boolean(info), pick_('visState')(apply_<VisState, any>(setMapInfoUpdater, {info}))),
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
  // still more to load
  const payloads = filesToDataPayload(action.result);
  const nextState = compose_([
    pick_('visState')(
      merge_({
        fileLoading: false,
        fileLoadingProgress: {}
      })
    )
  ])(state);
  // make multiple add data to map calls
  const stateWithData = compose_(payloads.map(p => apply_(addDataToMapUpdater, payload_(p))))(
    nextState
  );
  return stateWithData as KeplerGlState;
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
  let {visState} = state;
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
  return {
    ...state,
    visState,
    mapStyle: mapStyleChangeUpdater(mapStyle, {payload: {...payload}})
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
  const addDataToMapOptions = {...defaultReplaceDataToMapOptions, ...options};

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
    visState: prepareStateForDatasetReplace(state.visState, datasetToReplaceId, dataIdToUse)
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
