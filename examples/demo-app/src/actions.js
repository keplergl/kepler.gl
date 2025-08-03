// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {fetch} from 'global';

import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import {GeoArrowLoader} from '@loaders.gl/arrow';
import {_GeoJSONLoader as GeoJSONLoader} from '@loaders.gl/json';
import {ParquetWasmLoader} from '@loaders.gl/parquet';

// CONSTANTS
export const INIT = 'INIT';
export const LOAD_REMOTE_RESOURCE_SUCCESS = 'LOAD_REMOTE_RESOURCE_SUCCESS';
export const LOAD_REMOTE_DATASET_PROCESSED_SUCCESS = 'LOAD_REMOTE_DATASET_PROCESSED_SUCCESS';
export const LOAD_REMOTE_RESOURCE_ERROR = 'LOAD_REMOTE_RESOURCE_ERROR';
export const SET_SAMPLE_LOADING_STATUS = 'SET_SAMPLE_LOADING_STATUS';
export const NAVIGATE_TO = 'NAVIGATE_TO';

// Sharing
export const PUSHING_FILE = 'PUSHING_FILE';
export const CLOUD_LOGIN_SUCCESS = 'CLOUD_LOGIN_SUCCESS';

// ACTIONS
export function initApp() {
  return {
    type: INIT
  };
}

export function loadRemoteResourceSuccess(response, config, options, remoteDatasetConfig) {
  return {
    type: LOAD_REMOTE_RESOURCE_SUCCESS,
    response,
    config,
    options,
    remoteDatasetConfig
  };
}

export function loadRemoteDatasetProcessedSuccessAction(result) {
  return {
    type: LOAD_REMOTE_DATASET_PROCESSED_SUCCESS,
    payload: result
  };
}

export function loadRemoteResourceError(error, url) {
  return {
    type: LOAD_REMOTE_RESOURCE_ERROR,
    error,
    url
  };
}

// export function loadMapSampleFile(samples) {
//   return {
//     type: LOAD_MAP_SAMPLE_FILE,
//     samples
//   };
// }

// export function setLoadingMapStatus(isMapLoading) {
//   return {
//     type: SET_SAMPLE_LOADING_STATUS,
//     isMapLoading
//   };
// }

/**
 * Actions passed to kepler.gl, called
 *
 * Note: exportFile is called on both saving and sharing
 *
 * @param {Object} param0
 * @param {Object} param0.provider - provider object with getShareUrl and getMapUrl methods
 * @param {Object} param0.options - options object containing isPublic flag
 */
export function onExportFileSuccess({provider, options}) {
  return dispatch => {
    let url = null;

    // if isPublic is true, use share Url
    if (options.isPublic && provider.getShareUrl) {
      url = provider.getShareUrl(false);
    } else if (!options.isPublic && provider.getMapUrl) {
      // if save private map to storage, use map url
      url = provider.getMapUrl(false);
    }

    if (url) {
      // Dispatch a navigation action that components can listen for
      dispatch({
        type: NAVIGATE_TO,
        payload: url
      });
    }
  };
}

/**
 * Handle cloud map loading success
 * @param {Object} param0
 * @param {Object} param0.provider - provider object with getMapUrl method
 * @param {Object} param0.loadParams - parameters for loading the map
 */
export function onLoadCloudMapSuccess({provider, loadParams}) {
  return dispatch => {
    const mapUrl = provider?.getMapUrl(loadParams);
    if (mapUrl) {
      const url = `/demo/map/${provider.name}?path=${mapUrl}`;
      dispatch({
        type: NAVIGATE_TO,
        payload: url
      });
    }
  };
}

/**
 * Load a file from a remote URL
 * @param url
 * @returns {Promise<[Blob, string]>}
 */
export async function loadRemoteRawData(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return Promise.resolve(null);
  }

  const resp = await fetch(url);

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text);
  }

  const data = await resp.blob();
  return [data, url];
}

/**
 *
 * @param url
 * @returns {Promise<any>}
 */
export async function loadRemoteData(url) {
  if (!url) {
    return null;
  }

  // Load data
  // return new Promise(resolve => {
  const loaders = [CSVLoader, GeoArrowLoader, ParquetWasmLoader, GeoJSONLoader];
  const loadOptions = {
    csv: {
      shape: 'object-row-table'
    },
    arrow: {
      shape: 'arrow-table'
    },
    parquet: {
      shape: 'arrow-table'
    },
    metadata: true
  };
  const data = await load(url, loaders, loadOptions);
  return data;
}

// The following methods are only used to load SAMPLES
// /**
//  *
//  * @param {Object} options
//  * @param {string} [options.dataUrl] the URL to fetch data from, e.g. https://raw.githubusercontent.com/keplergl/kepler.gl-data/master/earthquakes/data.csv
//  * @param {string} [options.configUrl] the URL string to fetch kepler config from, e.g. https://raw.githubusercontent.com/keplergl/kepler.gl-data/master/earthquakes/config.json
//  * @param {string} [options.id] the id used as dataset unique identifier, e.g. earthquakes
//  * @param {string} [options.label] the label used to describe the new dataset, e.g. California Earthquakes
//  * @param {string} [options.queryType] the type of query to execute to load data/config, e.g. sample
//  * @param {string} [options.imageUrl] the URL to fetch the dataset image to use in sample gallery
//  * @param {string} [options.description] the description used in sample galley to define the current example
//  * @param {string} [options.size] the number of entries displayed in the current sample
//  * @param {string} [keplergl] url to fetch the full data/config generated by kepler
//  * @returns {Function}
//  */
// export function loadSample(options, pushRoute = true) {
//   return (dispatch, getState) => {
//     // Navigation is now handled by React Router in the component
//     if (options.keplergl) {
//       dispatch(loadRemoteMap({dataUrl: options.keplergl}));
//     } else {
//       dispatch(loadRemoteSampleMap(options));
//     }
//     dispatch(setLoadingMapStatus(true));
//   };
// }

// /**
//  * Load remote map with config and data
//  * @param options {configUrl, dataUrl}
//  * @returns {Function}
//  */
// function loadRemoteSampleMap(options) {
//   return dispatch => {
//     // Load configuration first
//     const {configUrl, dataUrl, remoteDatasetConfigUrl} = options;
//     const toLoad = [loadRemoteConfig(configUrl)];
//     toLoad.push(dataUrl ? loadRemoteData(dataUrl) : null);
//     // Load remote dataset config for tiled layers
//     toLoad.push(remoteDatasetConfigUrl ? loadRemoteConfig(remoteDatasetConfigUrl) : null);

//     Promise.all(toLoad).then(
//       ([config, data, remoteDatasetConfig]) => {
//         // TODO: these two actions can be merged
//         dispatch(loadRemoteResourceSuccess(data, config, options, remoteDatasetConfig));
//         // TODO: toggleModal when async dataset task is done, show the spinner until then
//         dispatch(toggleModal(null));
//       },
//       error => {
//         if (error) {
//           const {target = {}} = error;
//           const {status, responseText} = target;
//           dispatch(
//             loadRemoteResourceError(
//               {
//                 status,
//                 message: `${responseText} - ${LOADING_SAMPLE_ERROR_MESSAGE} ${options.id} (${configUrl})`
//               },
//               configUrl
//             )
//           );
//         }
//       }
//     );
//   };
// }

/**
 *
 * @param url
 * @returns {Promise<any>}
 */
export async function loadRemoteConfig(url) {
  if (!url) {
    // TODO: we should return reject with an appropriate error
    return null;
  }

  const response = await fetch(url);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  } else {
    return response.json();
  }
}

// /**
//  *
//  * @param sampleMapId optional if we pass the sampleMapId, after fetching
//  * map sample configurations we are going to load the actual map data if it exists
//  * @returns {function(*)}
//  */
// export function loadSampleConfigurations(sampleMapId = null) {
//   return dispatch => {
//     fetch(MAP_CONFIG_URL)
//       .then(response => {
//         if (!response.ok) {
//           return response.text().then(text => {
//             throw new Error(text);
//           });
//         } else {
//           return response.json();
//         }
//       })
//       .then(samples => {
//         dispatch(loadMapSampleFile(samples));
//         // Load the specified map
//         const map = sampleMapId && samples.find(s => s.id === sampleMapId);
//         if (map) {
//           dispatch(loadSample(map, false));
//         }
//       })
//       .catch(error => {
//         dispatch(
//           loadRemoteResourceError(
//             {message: `${error} - ${LOADING_SAMPLE_LIST_ERROR_MESSAGE}`},
//             MAP_CONFIG_URL
//           )
//         );
//       });
//   };
// }
