// Copyright (c) 2022 Uber Technologies, Inc.
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
import {isPlainObject} from '@kepler.gl/utils';

import {
  InteractionConfig,
  Filter,
  TooltipInfo,
  SplitMap,
  AnimationConfig,
  VisState
} from '../reducers';

import {RGBColor, Merge, RGBAColor} from '@kepler.gl/types';

import {LayerTextLabel} from '../layers/layer-factory';

export type SavedFilter = {
  dataId: Filter['dataId'];
  id: Filter['id'];
  name: Filter['name'];
  type: Filter['type'];
  value: Filter['value'];
  enlarged: Filter['enlarged'];
  plotType: Filter['plotType'];
  yAxis: {
    name: string;
    type: string;
  } | null;
  speed: Filter['speed'];
  layerId: Filter['layerId'];
};

export type ParsedFilter = Partial<SavedFilter>;

export type SavedInteractionConfig = {
  tooltip: TooltipInfo['config'] & {
    enabled: boolean;
  };
  geocoder: InteractionConfig['geocoder'] & {
    enabled: boolean;
  };
  brush: InteractionConfig['brush'] & {
    enabled: boolean;
  };
  coordinate: InteractionConfig['coordinate'] & {
    enabled: boolean;
  };
};

export type SavedScale = string;
export type SavedVisualChannels = {
  [key: string]: SavedField | SavedScale;
};

export type SavedLayer = {
  id: string;
  type: string;
  config: {
    dataId: string;
    label: string;
    color: RGBColor;
    highlightColor: RGBAColor;
    columns: {
      [key: string]: string;
    };
    isVisible: boolean;
    visConfig: object;
    hidden: boolean;
    textLabel: Merge<LayerTextLabel, {field: {name: string; type: string} | null}>;
  };
  visualChannels: SavedVisualChannels;
};

export type ParsedLayer = {
  id?: string;
  type?: string;
  config?: Partial<SavedLayer['config']>;
};

export type SavedAnimationConfig = {
  currentTime: AnimationConfig['currentTime'];
  speed: AnimationConfig['speed'];
};

export type SavedVisState = {
  filters: SavedFilter[];
  layers: SavedLayer[];
  interactionConfig: SavedInteractionConfig;
  layerBlending: string;
  splitMaps: SplitMap[];
  animationConfig: SavedAnimationConfig;
};

export type SavedMapState = {
  bearing: number;
  dragRotate: boolean;
  latitude: number;
  longitude: number;
  pitch: number;
  zoom: number;
  isSplit: boolean;
};

export type SavedLayerGroups = {
  [key: string]: boolean;
};

export type SavedCustomMapStyle = {
  [key: string]: {
    accessToken: string;
    custom: boolean;
    icon: string;
    id: string;
    label: string;
    url: string;
  };
};

export type SavedMapStyle = {
  styleType: string;
  topLayerGroups: SavedLayerGroups;
  visibleLayerGroups: SavedLayerGroups;
  threeDBuildingColor: RGBColor;
  mapStyles: SavedCustomMapStyle;
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

/** Schema for a parsed configuration ("normalized" across versions) */
export type ParsedConfig = {
  version: string;
  visState?: {
    layers?: ParsedLayer[];
    filters?: ParsedFilter[];
    interactionConfig?: Partial<SavedInteractionConfig>;
    layerBlending?: string;
    splitMaps?: SplitMap[];
    animationConfig?: Partial<SavedAnimationConfig>;
  };
  mapState?: Partial<SavedMapState>;
  mapStyle?: Partial<SavedMapStyle>;
};

export type SavedField = {
  name: string;
  type: string;
  format?: string;
  analyzerType?: string;
};

export type ParsedField = {
  name: string;
  type: string;
  format: string;
  analyzerType: string;
};

export type SavedDatasetV1 = {
  version: 'v1';
  data: {
    id: string;
    label: string;
    color: RGBColor;
    allData: any[][];
    fields: SavedField[];
  };
};

export type ParsedDataset = {
  data: {
    fields: ParsedField[];
    rows: any[][];
  };
  info: {
    id?: string;
    label?: string;
    color?: RGBColor;
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

  getMapInfo(state: any): VisState['mapInfo'] {
    return state.visState.mapInfo;
  }
  /**
   *  Load saved map, argument can be (datasets, config) or ({datasets, config})
   * @param savedDatasets
   * @param savedConfig
   */
  load(
    savedDatasets: SavedMap | SavedMap['datasets'] | any,
    savedConfig: SavedMap['config'] | any
  ): LoadedMap {
    // if pass dataset and config in as a single object
    if (
      arguments.length === 1 &&
      isPlainObject(arguments[0]) &&
      (Array.isArray(arguments[0].datasets) || isPlainObject(arguments[0].config))
    ) {
      return this.load(arguments[0].datasets, arguments[0].config);
    }

    return {
      ...(Array.isArray(savedDatasets) ? {datasets: this.parseSavedData(savedDatasets)} : {}),
      ...(savedConfig ? {config: this.parseSavedConfig(savedConfig)} : {})
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
  parseSavedConfig({version, config}, state = {}): ParsedConfig | null {
    const validVersion = this.validateVersion(version);
    if (!validVersion) {
      return null;
    }

    // @ts-expect-error
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
  hasDataChanged(state: any): boolean {
    return this._datasetLastSaved !== state.visState.datasets;
  }
}

const KeplerGLSchemaManager = new KeplerGLSchema();

export default KeplerGLSchemaManager;
