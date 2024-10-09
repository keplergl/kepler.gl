// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {console as Console} from 'global/window';

import {Datasets} from '@kepler.gl/table';
import datasetSchema from './dataset-schema';
import mapStyleSchema from './map-style-schema';
import mapStateSchema from './map-state-schema';
import {SavedDatasetV1, ParsedDataset} from './dataset-schema';
import {visStateSchema} from './vis-state-schema';

import {CURRENT_VERSION, VERSIONS} from './versions';
import {isPlainObject} from '@kepler.gl/utils';

import {MapInfo, SavedVisState, SavedMapStyle, ParsedConfig, BaseMapStyle} from '@kepler.gl/types';

export type SavedMapState = {
  bearing: number;
  dragRotate: boolean;
  latitude: number;
  longitude: number;
  pitch: number;
  zoom: number;
  isSplit: boolean;
  isViewportSynced?: true;
  isZoomLocked?: false;
  splitMapViewports?: [];
};

export type SavedLayerGroups = {
  [key: string]: boolean;
};

export type SavedCustomMapStyle = {
  [key: string]: {
    accessToken?: string;
    custom: BaseMapStyle['custom'];
    icon: string;
    id: string;
    label: string;
    url: string;
  };
};

/** Schema for v1 saved configuration */
export type SavedConfigV1 = {
  version: 'v1';
  config: {
    visState: SavedVisState;
    mapState: SavedMapState;
    mapStyle: SavedMapStyle;
  };
};

export type SavedMap = {
  datasets: SavedDatasetV1[];
  config: SavedConfigV1;
  info: {
    app: string;
    created_at: string;
    title: string;
    description: string;
  };
};

export type LoadedMap = {datasets?: ParsedDataset[] | null; config?: ParsedConfig | null};

export const reducerSchema: {
  [key: string]: typeof mapStateSchema | typeof visStateSchema | typeof mapStyleSchema;
} = {
  visState: visStateSchema,
  mapState: mapStateSchema,
  mapStyle: mapStyleSchema
};

export class KeplerGLSchema {
  _validVersions: typeof VERSIONS;
  _version: 'v1';
  _reducerSchemas: typeof reducerSchema;
  _datasetSchema: typeof datasetSchema;
  _datasetLastSaved: SavedDatasetV1[] | null;
  _savedDataset: SavedDatasetV1[] | null;

  constructor({
    reducers = reducerSchema,
    datasets = datasetSchema,
    validVersions = VERSIONS,
    version = CURRENT_VERSION
  }: {
    reducers?: typeof reducerSchema;
    datasets?: typeof datasetSchema;
    validVersions?: typeof VERSIONS;
    version?: 'v1';
  } = {}) {
    this._validVersions = validVersions;
    this._version = version;
    this._reducerSchemas = reducers;
    this._datasetSchema = datasets;

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
   * @param state
   * @returns app state to save
   */
  save(state: any): SavedMap {
    return {
      datasets: this.getDatasetToSave(state),
      config: this.getConfigToSave(state),
      info: {
        app: 'kepler.gl',
        created_at: new Date().toString(),
        ...this.getMapInfo(state)
      }
    };
  }

  getMapInfo(state: any): MapInfo {
    return state.visState.mapInfo;
  }
  /**
   *  Load saved map, argument can be (datasets, config) or ({datasets, config})
   * @param savedDatasets
   * @param savedConfig
   */
  load(
    ...args:
      | [
          savedDatasets: SavedMap | SavedMap['datasets'] | any,
          savedConfig: SavedMap['config'] | any
        ]
      | [{datasets: SavedMap['datasets'] | any; config: SavedMap['config'] | any}]
  ): LoadedMap {
    // if pass dataset and config in as a single object
    if (
      args.length === 1 &&
      isPlainObject(args[0]) &&
      (Array.isArray(args[0].datasets) || isPlainObject(args[0].config))
    ) {
      return this.load(args[0].datasets, args[0].config);
    }

    return {
      ...(Array.isArray(args[0]) ? {datasets: this.parseSavedData(args[0])} : {}),
      ...(args[1] ? {config: this.parseSavedConfig(args[1])} : {})
    };
  }

  /**
   * Get data to save
   * @param state - app state
   * @returns - dataset to save
   */
  getDatasetToSave(state: any): SavedDatasetV1[] {
    const dataChangedSinceLastSave = this.hasDataChanged(state);
    if (!dataChangedSinceLastSave) {
      // @ts-expect-error
      return this._savedDataset;
    }

    const {visState} = state;

    const datasets = Object.values(visState.datasets as Datasets).map(ds => ({
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
  getConfigToSave(state: any): SavedConfigV1 {
    const config = Object.keys(this._reducerSchemas).reduce(
      (accu, key) => ({
        ...accu,
        ...(state[key] ? this._reducerSchemas[key][this._version].save(state[key]) : {})
      }),
      {}
    );

    return {
      version: this._version,
      // @ts-expect-error
      config
    };
  }

  /**
   * Parse saved data
   * @param datasets
   * @returns - dataset to pass to addDataToMap
   */
  parseSavedData(datasets: any): ParsedDataset[] | null {
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
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parseSavedConfig({version, config}, state = {}): ParsedConfig | null {
    const validVersion = this.validateVersion(version);
    if (!validVersion) {
      return null;
    }

    return Object.keys(config).reduce(
      (accu, key) => ({
        ...accu,
        ...(key in this._reducerSchemas
          ? this._reducerSchemas[key][validVersion].load(config[key])
          : {})
      }),
      {}
    );
  }

  /**
   * Validate version
   * @param version
   * @returns validVersion
   */
  validateVersion(version: any): string | null {
    if (!version) {
      Console.error('There is no version number associated with this saved map');
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
   * @param state
   * @returns - whether data has changed or not
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasDataChanged(state: any): boolean {
    return true;
  }
}

const KeplerGLSchemaManager = new KeplerGLSchema();

export default KeplerGLSchemaManager;
