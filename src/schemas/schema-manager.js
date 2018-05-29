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

import {console as Console} from 'global/window';

import visStateSchema from './vis-state-schema';
import datasetSchema from './dataset-schema';
import mapStyleSchema from './map-style-schema';
import mapStateSchema from './map-state-schema';

import {CURRENT_VERSION, VERSIONS} from './versions';

const REDUCER_SCHEMAS = {
  visState: visStateSchema,
  mapState: mapStateSchema,
  mapStyle: mapStyleSchema
};

class KeplerGLSchema {
  constructor() {
    this._validVersions = VERSIONS;
    this._version = CURRENT_VERSION;
    this._reducerSchemas = REDUCER_SCHEMAS;
    this._datasetSchema = datasetSchema;

    this._datasetLastSaved = null;
    this._savedDataset = null;
  }

  /**
   * stateToSave = {
   *   datasets: [
   *     {
   *       version: 'v0',
   *       data: {id, label, color, allData, fields}
   *     },
   *     {
   *       version: 'v0',
   *       data: {id, label, color, allData, fields}
   *     }
   *   ],
   *   config: {
   *     version: 'v0',
   *     config: {}
   *   },
   *   info: {
   *     app: 'kepler.gl',
   *     create_at: 'Mon May 28 2018 21:04:46 GMT-0700 (PDT)'
   *   }
   * }
   *
   * Get config and data of current map to save
   * @param {Object} state
   * @returns {Object | null} app state to save
   */
  save(state) {
    return {
      datasets: this.getDatasetToSave(state),
      config: this.getConfigToSave(state),
      info: {
        app: 'kepler.gl',
        created_at: new Date().toString()
      }
    };
  }

  load(savedDatasets, savedConfig) {
    return {
      datasets: this.parseSavedData(savedDatasets),
      config: savedConfig ? this.parseSavedConfig(savedConfig) : undefined
    };
  }

  /**
   * Get data to save
   * @param {Object} state - app state
   * @returns {{version: String, data: Object}} - dataset to save
   */
  getDatasetToSave(state) {
    const dataChangedSinceLastSave = this.hasDataChanged(state);
    if (!dataChangedSinceLastSave) {
      return this._savedDataset;
    }

    const {visState} = state;

    const datasets = Object.values(visState.datasets).map(ds => ({
      version: this._version,
      data: this._datasetSchema[this._version].save(ds)
    }));

    // keep a copy of formatted datasets to save
    this._datasetLastSaved = visState.datasets;
    this._savedDataset = datasets;

    return datasets;
  }

  /**
   * Get App config to save
   * @param {Object} state - app state
   * @returns {{version: String, config: Object}} - config to save
   */
  getConfigToSave(state) {
    const config = Object.keys(this._reducerSchemas).reduce(
      (accu, key) => ({
        ...accu,
        ...this._reducerSchemas[key][this._version].save(state[key])
      }),
      {}
    );

    return {
      version: this._version,
      config
    };
  }

  /**
   * Parse saved data
   * @param {Array} datasets
   * @returns {Object | null} - data to save
   */
  parseSavedData(datasets) {
    return datasets.reduce((accu, ds) => {
      const validVersion = this.validateVersion(ds.version);
      if (!validVersion) {
        return accu;
      }
      accu.push(this._datasetSchema[validVersion].load(ds.data));
      return accu;
    }, []);
  }

  /**
   * Parse saved App config
   * @param {String} opt.version - config version
   * @param {Object} opt.config - saved config
   * @param {Object} state - current App State
   * @returns {Object | null} - parsed config
   */
  parseSavedConfig({version, config}, state = {}) {
    const validVersion = this.validateVersion(version);
    if (!validVersion) {
      return null;
    }

    return Object.keys(config).reduce(
      (accu, key) => ({
          ...accu,
          ...(key in this._reducerSchemas
            ? this._reducerSchemas[key][validVersion].load(
                config[key],
                state[key]
              )
            : {})
        }),
      {}
    );
  }

  /**
   * Validate version
   * @param {String} version
   * @returns {String | null} validVersion
   */
  validateVersion(version) {
    if (!version) {
      Console.error(
        'There is no version number associated with this saved map'
      );
      return null;
    }

    if (!this._validVersions[version]) {
      Console.error(`${version} is not a valid version`);
      return null;
    }

    return version;
  }

  /**
   * Check if data has changed since last save
   * @param {Object} state
   * @returns {boolean} - whether data has changed or not
   */
  hasDataChanged(state) {
    return this._datasetLastSaved !== state.visState.datasets;
  }
}

const KeplerGLSchemaManager = new KeplerGLSchema();

export default KeplerGLSchemaManager;
