// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import keplerGlReducer, {combinedUpdaters, uiStateUpdaters} from 'kepler.gl/reducers';
import {processGeojson, processCsvData} from 'kepler.gl/processors';
import KeplerGlSchema from 'kepler.gl/schemas';
import {EXPORT_MAP_FORMATS} from 'kepler.gl/constants';

import sharingReducer from './sharing';

import {
  INIT,
  SET_LOADING_METHOD,
  LOAD_MAP_SAMPLE_FILE,
  LOAD_REMOTE_RESOURCE_SUCCESS,
  SET_SAMPLE_LOADING_STATUS
} from '../actions';

import {
  AUTH_TOKENS,
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_LOADING_METHOD,
  LOADING_METHODS
} from '../constants/default-settings';
import {generateHashId} from '../utils/strings';

// INITIAL_APP_STATE
const initialAppState = {
  appName: 'example',
  loaded: false,
  loadingMethod: DEFAULT_LOADING_METHOD,
  currentOption: DEFAULT_LOADING_METHOD.options[0],
  previousMethod: null,
  sampleMaps: [], // this is used to store sample maps fetch from a remote json file
  isMapLoading: false, // determine whether we are loading a sample map,
  error: null, // contains error when loading/retrieving data/configuration
    // {
    //   status: null,
    //   message: null
    // }
  // eventually we may have an async process to fetch these from a remote location
  featureFlags: DEFAULT_FEATURE_FLAGS
};

// App reducer
export const appReducer = handleActions({
  [INIT]: (state) => ({
    ...state,
    loaded: true
  }),
  [SET_LOADING_METHOD]: (state, action) => ({
    ...state,
    previousMethod: state.loadingMethod,
    loadingMethod: LOADING_METHODS.find(({id}) => id === action.method),
    error: null
  }),
  [LOAD_MAP_SAMPLE_FILE]: (state, action) => ({
    ...state,
    sampleMaps: action.samples
  }),
  [SET_SAMPLE_LOADING_STATUS]: (state, action) => ({
    ...state,
    isMapLoading: action.isMapLoading
  })
}, initialAppState);

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
          exportMapboxAccessToken: AUTH_TOKENS.EXPORT_MAPBOX_TOKEN
        }
      }
    }
  }),
  app: appReducer,
  sharing: sharingReducer
});

function arrayify(thing) {
  return Array.isArray(thing) ? thing : [thing];
}

function getSampleFromOptions(options) {
  return options.length
    ? options[0]
    : options;
}

// this can be moved into a action and call kepler.gl action
/**
 *
 * @param state
 * @param action {map: resultset, config, map}
 * @returns {{app: {isMapLoading: boolean}, keplerGl: {map: (state|*)}}}
 */
export const loadRemoteResourceSuccess = (state, action) => {
  const responses = arrayify(action.response);
  const options = arrayify(action.options);
  const currentSample = getSampleFromOptions(action.options);

  const datasets = options.map((opt, i) => {
    const datasetId = opt.id || generateHashId(6);
    const { dataUrl } = opt;

    let processorMethod = processCsvData;
    if (dataUrl.includes('.json') || dataUrl.includes('.geojson')) {
      processorMethod = processGeojson;
    }

    return {
      info: {
        id: datasetId
      },

      data: processorMethod(responses[i])
    }
  });

  const config = action.config ?
    KeplerGlSchema.parseSavedConfig(action.config) : null;

  const keplerGlInstance = combinedUpdaters.addDataToMapUpdater(
    state.keplerGl.map, // "map" is the id of your kepler.gl instance
    {
      payload: {
        datasets,
        config
      }
    }
  );

  return {
    ...state,
    app: {
      ...state.app,
      currentSample,
      isMapLoading: false // we turn off the spinner
    },
    keplerGl: {
      ...state.keplerGl, // in case you keep multiple instances
      map: keplerGlInstance
    }
  };
};

const composedUpdaters = {
  [LOAD_REMOTE_RESOURCE_SUCCESS]: loadRemoteResourceSuccess
};

const composedReducer = (state, action) => {
  if (composedUpdaters[action.type]) {
    return composedUpdaters[action.type](state, action);
  }
  return demoReducer(state, action);
};

// export demoReducer to be combined in website app
export default composedReducer;
