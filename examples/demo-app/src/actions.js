// Copyright (c) 2018 Uber Technologies, Inc.
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

import {push} from 'react-router-redux';
import {request, text as requestText, json as requestJson} from 'd3-request';
import {loadFiles, toggleModal} from 'kepler.gl/actions';
import {console as Console} from 'global/window';
import {MAP_CONFIG_URL} from './constants/sample-maps';

// CONSTANTS
export const INIT = 'INIT';
export const SET_LOADING_METHOD = 'SET_LOADING_METHOD';
export const LOAD_REMOTE_FILE_DATA_SUCCESS = 'LOAD_DATA_SUCCESS';
export const LOAD_MAP_SAMPLE_FILE = 'LOAD_MAP_SAMPLE_FILE';
export const SET_SAMPLE_LOADING_STATUS = 'SET_SAMPLE_LOADING_STATUS';

// ACTIONS
export function setLoadingMethod(method) {
  return {
    type: SET_LOADING_METHOD,
    method
  };
}

export function loadResponseFromRemoteFile(response, config, options) {
  return {
    type: LOAD_REMOTE_FILE_DATA_SUCCESS,
    response,
    config,
    options
  };
}

export function loadMapSampleFile(samples) {
  return {
    type: LOAD_MAP_SAMPLE_FILE,
    samples
  };
}

export function setLoadingMapStatus(isMapLoading) {
  return {
    type: SET_SAMPLE_LOADING_STATUS,
    isMapLoading
  };
}

// This can be moved into Kepler.gl to provide ability to load data from remote URLs
/**
 * The method is able to load both data and kepler.gl files.
 * It uses loadFile action to dispatcha and add new datasets/configs
 * to the kepler.gl instance
 * @param options
 * @returns {Function}
 */
export function loadRemoteMap(options) {
  return dispatch => {
    loadRemoteRawData(options.dataUrl).then(
      file => {
        dispatch(loadFiles([
          // In this part we turn the response into a FileBlob
          // so we can use it to call loadFiles
          new File([file], options.dataUrl)
        ]));
      }
    );
    dispatch(setLoadingMapStatus(true));
  }
}

/**
 * Load a file from a remote URL
 * @param url
 * @returns {Promise<any>}
 */
function loadRemoteRawData(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null)
  }

  return new Promise((resolve, reject) => {
    request(url, (error, result) => {
        error ? reject(error) : resolve(result.response)
    })
  });
}

// The following methods are only used to load SAMPLES
/**
 *
 * @param options {
    required "dataUrl": "https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/earthquakes/data.csv",
    optional "configUrl": "https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/earthquakes/config.json"
    optional "id": "earthquakes",
    optional "label": "California Earthquakes",
    optional "queryType": "sample",
    optional "imageUrl": "https://s3.amazonaws.com/uber-static/kepler.gl/sample/earthquakes.png",
    optional "description": "Location, maginitude and magtype of 2.5+ magnitude earthquakes in california.",
    optional "size": 54936
  },
 * @returns {Function}
 */
export function loadSample(options) {
  return (dispatch, getState) => {
    const {routing} = getState();
    if (options.id) {
      dispatch(push(`/demo/${options.id}${routing.locationBeforeTransitions.search}`));
    }
    dispatch(loadRemoteSampleMap(options));
    dispatch(setLoadingMapStatus(true));
  };
}

/**
 * Load remote map with config and data
 * @param options {configUrl, dataUrl}
 * @returns {Function}
 */
function loadRemoteSampleMap(options) {
  return (dispatch) => {
    // Load configuration first
    const {configUrl, dataUrl} = options;

    Promise
      .all([loadRemoteConfig(configUrl), loadRemoteData(dataUrl)])
      .then(
        ([config, data]) => loadMapCallback(dispatch, null, data, options, config),
        error => {
          if (error) {
            Console.warn(`Error loading map data`);
            Console.warn(options);
            Console.warn(error)
          }
        }
      );
  }
}

/**
 *
 * @param url
 * @returns {Promise<any>}
 */
function loadRemoteConfig(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null)
  }

  return new Promise((resolve, reject) => {
    requestJson(url, (error, config) => {
      error ? reject(error) : resolve(config)
    })
  })
}

/**
 *
 * @param url to fetch data from (csv, json, geojson)
 * @returns {Promise<any>}
 */
function loadRemoteData(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null)
  }

  let requestMethod = requestText;
  if (url.includes('.json') || url.includes('.geojson')) {
    requestMethod = requestJson;
  }

  // Load data
  return new Promise((resolve, reject) => {
    requestMethod(url, (error, result) => {
      // TODO: we need to let users know about CORS issues
      error ? reject(error) : resolve(result)
    })
  });
}

/**
 *
 * @param dispatch
 * @param error
 * @param result
 * @param options
 * @param config
 */
function loadMapCallback(dispatch, error, result, options, config) {
  if (error) {
    Console.warn(`Error loading datafile ${options.dataUrl}`);
  } else {
    dispatch(loadResponseFromRemoteFile(result, config, options));
    dispatch(toggleModal(null));
  }
}

/**
 *
 * @param sampleMapId optional if we pass the sampleMapId, after fetching
 * map sample configurations we are going to load the actual map data if it exists
 * @returns {function(*)}
 */
export function loadSampleConfigurations(sampleMapId = null) {
  return dispatch => {
    requestJson(MAP_CONFIG_URL, (error, samples) => {
      if (error) {
        Console.warn(`Error loading sample configuration file ${MAP_CONFIG_URL}`);
      } else {
        dispatch(loadMapSampleFile(samples));
        // Load the specified map
        const map = sampleMapId && samples.find(s => s.id === sampleMapId);
        if (map) {
          dispatch(loadSample(map));
        }
      }
    });
  }
}

