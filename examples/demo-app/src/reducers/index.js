// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers} from 'redux';
import {ActionTypes, ProviderActionTypes, unwrap} from '@kepler.gl/actions';
import Task, {withTask} from '@kepler.gl/tasks';

import {aiAssistantReducer} from '@openassistant/kepler-assistant';
import {EXPORT_MAP_FORMATS} from '@kepler.gl/constants';
import {processGeojson, processRowObject, processArrowTable} from '@kepler.gl/processors';
import keplerGlReducer, {combinedUpdaters, uiStateUpdaters} from '@kepler.gl/reducers';
import KeplerGlSchema from '@kepler.gl/schemas';
import {KeplerTable} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

// DuckDB / applicationConfig defaults: see utils/runtime-config.js (applied on
// import, and overlaid from /config.json in demo-app main.js). To enable DuckDB
// locally, call initApplicationConfig from runtime-config or pass
// applicationConfig via /config.json — plugins still need a source build that
// bundles them.

import {
  INIT,
  LOAD_MAP_SAMPLE_FILE,
  LOAD_REMOTE_RESOURCE_SUCCESS,
  LOAD_REMOTE_DATASET_PROCESSED_SUCCESS,
  LOAD_REMOTE_RESOURCE_ERROR,
  SET_SAMPLE_LOADING_STATUS,
  loadRemoteDatasetProcessedSuccessAction,
  loadRemoteResourceError as loadRemoteResourceErrorAction
} from '../actions';

import {CLOUD_PROVIDERS_CONFIGURATION} from '../constants/default-settings';
import {generateHashId} from '../utils/strings';
import {getRuntimeConfig} from '../utils/runtime-config';

const {DEFAULT_MAP_CONTROLS} = uiStateUpdaters;

const runtimeConfig = getRuntimeConfig();
const runtimeMapStyle =
  runtimeConfig.mapStyle && (runtimeConfig.mapStyle.mapStyles || runtimeConfig.mapStyle.styleType)
    ? runtimeConfig.mapStyle
    : null;

// INITIAL_APP_STATE
const initialAppState = {
  appName: 'example',
  loaded: false,
  sampleMaps: [], // this is used to store sample maps fetch from a remote json file
  isMapLoading: false, // determine whether we are loading a sample map,
  cloudMapPendingInstall: false,
  progressiveContinuationPending: false,
  projectLoadFailed: false,
  error: null // contains error when loading/retrieving data/configuration
  // {
  //   status: null,
  //   message: null
  // }
};

// App reducer
export const appReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case INIT:
      return {...state, loaded: true};
    case LOAD_MAP_SAMPLE_FILE:
      return {...state, sampleMaps: action.samples};
    case ProviderActionTypes.LOAD_CLOUD_MAP:
      return {
        ...state,
        cloudMapPendingInstall: false,
        projectLoadFailed: false,
        progressiveContinuationPending: false
      };
    case ProviderActionTypes.LOAD_CLOUD_MAP_SUCCESS_2:
      // Core clears its download flag before the queued add-data action runs.
      return {...state, cloudMapPendingInstall: true};
    case ActionTypes.ADD_DATA_TO_MAP:
      // The core loading indicator covers installation from this transition on.
      // MCP imports also start here, so a retry must clear the previous failure.
      return {...state, cloudMapPendingInstall: false, projectLoadFailed: false};
    case ActionTypes.LOAD_FILES:
      return {...state, projectLoadFailed: false, progressiveContinuationPending: false};
    case ActionTypes.CLEAR_STAGED_LOADED_FILES:
      return {...state, progressiveContinuationPending: false};
    case ActionTypes.LOAD_FILES_SUCCESS:
      // This continuation now installs its next snapshot; the core loading
      // indicator covers that work until another continuation is scheduled.
      return Object.prototype.hasOwnProperty.call(unwrap(action), 'progressiveSteps')
        ? {...state, progressiveContinuationPending: false}
        : state;
    case ActionTypes.CREATE_NEW_DATASET_SUCCESS: {
      const {results, replacement, onFinish} = unwrap(action).payload;
      if (!replacement && results?.some(result => result.status === 'rejected')) {
        return {
          ...state,
          isMapLoading: false,
          projectLoadFailed: true,
          progressiveContinuationPending: false
        };
      }
      // Arrow replay yields between snapshots. The table's loading indicator
      // is already cleared while this explicit next-snapshot action is queued.
      return onFinish?.type === ActionTypes.LOAD_FILES_SUCCESS &&
        Array.isArray(onFinish.progressiveSteps)
        ? {...state, progressiveContinuationPending: true}
        : state;
    }
    case ProviderActionTypes.LOAD_CLOUD_MAP_ERROR:
      return {
        ...state,
        cloudMapPendingInstall: false,
        projectLoadFailed: true,
        progressiveContinuationPending: false
      };
    case SET_SAMPLE_LOADING_STATUS:
      return {
        ...state,
        isMapLoading: action.isMapLoading,
        ...(action.isMapLoading
          ? {projectLoadFailed: false, progressiveContinuationPending: false}
          : {})
      };
    default:
      return state;
  }
};

const {DEFAULT_EXPORT_MAP} = uiStateUpdaters;

// combine app reducer and keplerGl reducer
// to mimic the reducer state of kepler.gl website
const demoReducer = combineReducers({
  // mount keplerGl reducer
  keplerGl: keplerGlReducer.initialState({
    // In order to provide single file export functionality
    // we are going to set the mapbox access token to be used
    // in the exported file
    uiState: {
      exportMap: {
        ...DEFAULT_EXPORT_MAP,
        [EXPORT_MAP_FORMATS.HTML]: {
          ...DEFAULT_EXPORT_MAP[EXPORT_MAP_FORMATS.HTML],
          exportMapboxAccessToken: CLOUD_PROVIDERS_CONFIGURATION.EXPORT_MAPBOX_TOKEN
        }
      },
      mapControls: {
        ...DEFAULT_MAP_CONTROLS,
        // TODO find a better way not to add extra controls optionally - from plugin?
        ...((getApplicationConfig().plugins || []).some(p => p.name === 'duckdb')
          ? {
              sqlPanel: {
                active: false,
                activeMapIndex: 0,
                disableClose: false,
                show: true
              }
            }
          : {}),
        aiAssistant: {
          active: false,
          show: true
        }
      }
    },
    visState: {
      loaders: [], // Add additional loaders.gl loaders here
      loadOptions: {} // Add additional loaders.gl loader options here
    },
    // Optional custom base maps from /config.json (see docs/custom-map-styles.md option 2)
    ...(runtimeMapStyle
      ? {
          mapStyle: {
            ...(runtimeMapStyle.mapStyles ? {mapStyles: runtimeMapStyle.mapStyles} : {}),
            ...(runtimeMapStyle.styleType ? {styleType: runtimeMapStyle.styleType} : {})
          }
        }
      : {})
  }),
  app: appReducer,
  aiAssistant: aiAssistantReducer
});

async function loadRemoteResourceSuccessTask({
  dataUrl,
  datasetId,
  processorMethod,
  remoteDatasetConfig,
  unprocessedData
}) {
  if (dataUrl) {
    const data = await processorMethod(unprocessedData);
    if (!data) throw new Error('Data processing failed.');
    return {
      info: {
        id: datasetId
      },
      data
    };
  }

  // remote datasets like vector tile datasets
  return remoteDatasetConfig;
}

const LOAD_REMOTE_RESOURCE_SUCCESS_TASK = Task.fromPromise(
  loadRemoteResourceSuccessTask,
  'LOAD_REMOTE_RESOURCE_SUCCESS_TASK'
);

// this can be moved into a action and call kepler.gl action
/**
 * Used to load Kepler.gl demo examples
 * @param state
 * @param action {map: resultset, config, map}
 * @returns {{app: {isMapLoading: boolean}, keplerGl: {map: (state|*)}}}
 */
export const loadRemoteResourceSuccess = (state, action) => {
  // TODO: replace generate with a different function
  const datasetId = action.options.id || generateHashId(6);
  const {dataUrl} = action.options;

  const {shape} = dataUrl ? action.response : {};
  let processorMethod = processRowObject;
  let unprocessedData = action.response;
  unprocessedData = shape === 'object-row-table' ? action.response.data : unprocessedData;

  if (dataUrl) {
    const table = getApplicationConfig().table ?? KeplerTable;
    if (typeof table.getFileProcessor === 'function') {
      if (shape === 'arrow-table') {
        // arrow processor from table plugin expects batches
        unprocessedData = action.response.data.batches;
      }
      // use custom processors from table class
      const processorResult = table.getFileProcessor(unprocessedData);
      // TODO save processorResult.format here with the dataset
      processorMethod = processorResult.processor;
    } else {
      if (shape === 'arrow-table') {
        processorMethod = processArrowTable;
      } else if (shape === 'object-row-table') {
        processorMethod = processRowObject;
      } else if (dataUrl.includes('.json') || dataUrl.includes('.geojson')) {
        processorMethod = processGeojson;
      } else {
        throw new Error('Failed to select data processor');
      }
    }
  }

  // processorMethod can be async so create a task
  const task = LOAD_REMOTE_RESOURCE_SUCCESS_TASK({
    dataUrl,
    datasetId,
    processorMethod,
    remoteDatasetConfig: action.remoteDatasetConfig,
    unprocessedData
  }).bimap(
    datasets => loadRemoteDatasetProcessedSuccessAction({...action, datasets}),
    error => loadRemoteResourceErrorAction(error || {message: 'Data processing failed.'}, dataUrl)
  );

  return withTask(state, task);
};

const loadRemoteDatasetProcessedSuccess = (state, action) => {
  const {config, datasets, options} = action.payload;

  const parsedConfig = config ? KeplerGlSchema.parseSavedConfig(config) : undefined;

  // a hack to use minZoom and maxZoom from examples
  if (parsedConfig?.mapState) {
    if (typeof config?.config?.mapState?.maxZoom === 'number') {
      parsedConfig.mapState.maxZoom = config.config.mapState.maxZoom;
    }
    if (typeof config?.config?.mapState?.minZoom === 'number') {
      parsedConfig.mapState.minZoom = config.config.mapState.minZoom;
    }
  }

  const keplerGlInstance = combinedUpdaters.addDataToMapUpdater(
    state.keplerGl.map, // "map" is the id of your kepler.gl instance
    {
      payload: {
        datasets,
        config: parsedConfig,
        options: {
          centerMap: Boolean(!config)
        }
      }
    }
  );

  return {
    ...state,
    app: {
      ...state.app,
      currentSample: options,
      projectLoadFailed: false,
      isMapLoading: false // we turn off the spinner
    },
    keplerGl: {
      ...state.keplerGl, // in case you keep multiple instances
      map: keplerGlInstance
    }
  };
};

export const loadRemoteResourceError = (state, action) => {
  const {error, url} = action;

  const errorNote = {
    type: 'error',
    message: error.message || `Error loading ${url}`
  };

  return {
    ...state,
    app: {
      ...state.app,
      projectLoadFailed: true, // Keep readiness separate from the gallery's error object.
      isMapLoading: false // we turn of the spinner
    },
    keplerGl: {
      ...state.keplerGl, // in case you keep multiple instances
      map: {
        ...state.keplerGl.map,
        uiState: uiStateUpdaters.addNotificationUpdater(state.keplerGl.map.uiState, {
          payload: errorNote
        })
      }
    }
  };
};

const composedUpdaters = {
  [LOAD_REMOTE_RESOURCE_SUCCESS]: loadRemoteResourceSuccess,
  [LOAD_REMOTE_DATASET_PROCESSED_SUCCESS]: loadRemoteDatasetProcessedSuccess,
  [LOAD_REMOTE_RESOURCE_ERROR]: loadRemoteResourceError
};

const composedReducer = (state, action) => {
  if (composedUpdaters[action.type]) {
    return composedUpdaters[action.type](state, action);
  }
  const nextState = demoReducer(state, action);
  if (action.type === ActionTypes.LOAD_FILES_ERR) {
    const {loadId, meta} = unwrap(action);
    const loading = state?.keplerGl?.map?.visState?.fileLoading;
    // Core ignores late errors from a replaced file load. Retain accepted
    // failures after its transient progress entries are cleared.
    if (
      (!meta?._id_ || meta._id_ === 'map') &&
      loading &&
      (loadId == null || loadId === loading.loadId)
    ) {
      return {
        ...nextState,
        app: {...nextState.app, projectLoadFailed: true, progressiveContinuationPending: false}
      };
    }
  }
  return nextState;
};

// export demoReducer to be combined in website app
export default composedReducer;
