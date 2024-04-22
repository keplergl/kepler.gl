// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import keplerGlReducer, {combinedUpdaters, uiStateUpdaters} from '@kepler.gl/reducers';
import {processGeojson, processRowObject, processArrowTable} from '@kepler.gl/processors';
import KeplerGlSchema from '@kepler.gl/schemas';
import {EXPORT_MAP_FORMATS} from '@kepler.gl/constants';

import {
  INIT,
  LOAD_MAP_SAMPLE_FILE,
  LOAD_REMOTE_RESOURCE_SUCCESS,
  LOAD_REMOTE_RESOURCE_ERROR,
  SET_SAMPLE_LOADING_STATUS
} from '../actions';

import {CLOUD_PROVIDERS_CONFIGURATION} from '../constants/default-settings';
import {generateHashId} from '../utils/strings';

// INITIAL_APP_STATE
const initialAppState = {
  appName: 'example',
  loaded: false,
  sampleMaps: [], // this is used to store sample maps fetch from a remote json file
  isMapLoading: false, // determine whether we are loading a sample map,
  error: null // contains error when loading/retrieving data/configuration
  // {
  //   status: null,
  //   message: null
  // }
};

// App reducer
export const appReducer = handleActions(
  {
    [INIT]: state => ({
      ...state,
      loaded: true
    }),
    [LOAD_MAP_SAMPLE_FILE]: (state, action) => ({
      ...state,
      sampleMaps: action.samples
    }),
    [SET_SAMPLE_LOADING_STATUS]: (state, action) => ({
      ...state,
      isMapLoading: action.isMapLoading
    })
  },
  initialAppState
);

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
          ...DEFAULT_EXPORT_MAP[[EXPORT_MAP_FORMATS.HTML]],
          exportMapboxAccessToken: CLOUD_PROVIDERS_CONFIGURATION.EXPORT_MAPBOX_TOKEN
        }
      }
    },
    visState: {
      loaders: [], // Add additional loaders.gl loaders here
      loadOptions: {} // Add additional loaders.gl loader options here
    }
  }),
  app: appReducer
});

// this can be moved into a action and call kepler.gl action
/**
 *
 * @param state
 * @param action {map: resultset, config, map}
 * @returns {{app: {isMapLoading: boolean}, keplerGl: {map: (state|*)}}}
 */
export const loadRemoteResourceSuccess = (state, action) => {
  // TODO: replace generate with a different function
  const datasetId = action.options.id || generateHashId(6);
  const {dataUrl} = action.options;

  const {shape} = action.response;
  let processorMethod = processRowObject;
  let unprocessedData = action.response;
  if (shape === 'arrow-table') {
    processorMethod = processArrowTable;
  } else if (shape === 'object-row-table') {
    processorMethod = processRowObject;
    unprocessedData = action.response.data;
  } else if (dataUrl.includes('.json') || dataUrl.includes('.geojson')) {
    processorMethod = processGeojson;
  } else {
    throw new Error('Failed to select data processor');
  }

  const datasets = {
    info: {
      id: datasetId
    },
    data: processorMethod(unprocessedData)
  };

  const config = action.config ? KeplerGlSchema.parseSavedConfig(action.config) : null;

  const keplerGlInstance = combinedUpdaters.addDataToMapUpdater(
    state.keplerGl.map, // "map" is the id of your kepler.gl instance
    {
      payload: {
        datasets,
        config,
        options: {
          centerMap: Boolean(!action.config)
        }
      }
    }
  );

  return {
    ...state,
    app: {
      ...state.app,
      currentSample: action.options,
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
  [LOAD_REMOTE_RESOURCE_ERROR]: loadRemoteResourceError
};

const composedReducer = (state, action) => {
  if (composedUpdaters[action.type]) {
    return composedUpdaters[action.type](state, action);
  }
  return demoReducer(state, action);
};

// export demoReducer to be combined in website app
export default composedReducer;
