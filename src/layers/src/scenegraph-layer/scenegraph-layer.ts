// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ScenegraphLayer as DeckScenegraphLayer} from '@deck.gl/mesh-layers';
import {load} from '@loaders.gl/core';
import {GLTFLoader, postProcessGLTF} from '@loaders.gl/gltf';

import Layer, {LayerBaseConfig} from '../base-layer';
import ScenegraphLayerIcon from './scenegraph-layer-icon';
import ScenegraphInfoModalFactory from './scenegraph-info-modal';
import {
  CUSTOM_SCENEGRAPH_MODEL_ID,
  DEFAULT_SCENEGRAPH_MODEL,
  DEFAULT_SCENEGRAPH_MODEL_ID,
  GEOARROW_METADATA_KEY,
  GEOJSON_FIELDS,
  LAYER_VIS_CONFIGS,
  SCENEGRAPH_LAYER_MODELS
} from '@kepler.gl/constants';
import type {ScenegraphModel} from '@kepler.gl/constants';
import {
  ColorRange,
  Merge,
  RGBColor,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigInput,
  VisConfigNumber,
  LayerColumn
} from '@kepler.gl/types';
import {default as KeplerTable} from '@kepler.gl/table';
import {DataContainerInterface} from '@kepler.gl/utils';
import {DATA_TYPES} from 'type-analyzer';

import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import {
  getAllPositions,
  getCentroidFromGeometry,
  parseGeoJsonRawFeature
} from '../geojson-layer/geojson-utils';

export type ScenegraphLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  sizeScale: VisConfigNumber;
  angleX: VisConfigNumber;
  angleY: VisConfigNumber;
  angleZ: VisConfigNumber;
  scenegraph: VisConfigInput;
  scenegraphColorEnabled: VisConfigBoolean;
  scenegraphColor: VisConfigColorSelect;
  scenegraphCustomModelUrl: VisConfigInput;
};

export type ScenegraphLayerColumnsConfig = {
  lat: LayerColumn;
  lng: LayerColumn;
  altitude?: LayerColumn;
  geojson?: LayerColumn;
};

export type ScenegraphLayerVisConfig = {
  opacity: number;
  colorRange: ColorRange;
  sizeScale: number;
  angleX: number;
  angleY: number;
  angleZ: number;
  scenegraph: string | null;
  scenegraphColorEnabled: boolean;
  scenegraphColor: RGBColor | null;
  scenegraphCustomModelUrl: string;
};

export type ScenegraphLayerConfig = Merge<
  LayerBaseConfig,
  {columns: ScenegraphLayerColumnsConfig; visConfig: ScenegraphLayerVisConfig}
>;

export type ScenegraphLayerData = {position: number[]; index: number};

export const scenegraphRequiredColumns: ['lat', 'lng'] = ['lat', 'lng'];
export const scenegraphOptionalColumns: ['altitude'] = ['altitude'];
export const scenegraphGeojsonRequiredColumns: ['geojson'] = ['geojson'];

export const COLUMN_MODE_POINTS = 'points';
export const COLUMN_MODE_GEOJSON = 'geojson';

const SUPPORTED_ANALYZER_TYPES = {
  [DATA_TYPES.GEOMETRY]: true,
  [DATA_TYPES.GEOMETRY_FROM_STRING]: true,
  [DATA_TYPES.PAIR_GEOMETRY_FROM_STRING]: true
};

const SUPPORTED_COLUMN_MODES = [
  {
    key: COLUMN_MODE_POINTS,
    label: 'Point Columns',
    requiredColumns: scenegraphRequiredColumns,
    optionalColumns: scenegraphOptionalColumns
  },
  {
    key: COLUMN_MODE_GEOJSON,
    label: 'GeoJSON',
    requiredColumns: scenegraphGeojsonRequiredColumns
  }
];
const DEFAULT_COLUMN_MODE = COLUMN_MODE_POINTS;

/**
 * Public GCS object URLs do not send Access-Control-Allow-Origin.
 * The JSON API download of the same object does, and echoes the page origin.
 */
export function toCorsSafeGcsUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (parsed.protocol !== 'https:') {
    return url;
  }

  let bucket: string | undefined;
  let objectName: string | undefined;
  if (parsed.hostname === 'storage.googleapis.com') {
    if (
      parsed.pathname.startsWith('/storage/v1/') ||
      parsed.pathname.startsWith('/download/storage/')
    ) {
      return url;
    }
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length < 2) {
      return url;
    }
    bucket = decodeURIComponent(segments[0]);
    objectName = decodeURIComponent(segments.slice(1).join('/'));
  } else if (parsed.hostname.endsWith('.storage.googleapis.com')) {
    bucket = parsed.hostname.slice(0, -'.storage.googleapis.com'.length);
    objectName = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  }

  if (!bucket || !objectName) {
    return url;
  }
  return `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(
    bucket
  )}/o/${encodeURIComponent(objectName)}?alt=media`;
}

function fetchModel(url: string, init?: RequestInit): Promise<Response> {
  return fetch(toCorsSafeGcsUrl(url), init);
}

export function fetchGltf(url, {propName, layer}: {propName?: string; layer?: any} = {}) {
  if (propName === 'scenegraph') {
    const loadOptions = layer.getLoadOptions() || {};
    return load(url, GLTFLoader, {...loadOptions, fetch: fetchModel}).then(gltfWithBuffers =>
      postProcessGLTF(gltfWithBuffers)
    );
  }

  return fetch(toCorsSafeGcsUrl(url)).then(response => response.json());
}

export const scenegraphPosAccessor =
  ({lat, lng, altitude}: ScenegraphLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d =>
    [
      dc.valueAt(d.index, lng.fieldIdx),
      dc.valueAt(d.index, lat.fieldIdx),
      altitude && altitude.fieldIdx > -1 ? dc.valueAt(d.index, altitude.fieldIdx) : 0
    ];

export const scenegraphGeojsonAccessor =
  ({geojson}: ScenegraphLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  (d: {index: number}) =>
    geojson ? dc.valueAt(d.index, geojson.fieldIdx) : null;

export const scenegraphVisConfigs: {
  opacity: 'opacity';
  colorRange: 'colorRange';
  sizeScale: VisConfigNumber;
  angleX: VisConfigNumber;
  angleY: VisConfigNumber;
  angleZ: VisConfigNumber;
  scenegraph: VisConfigInput;
  scenegraphColorEnabled: 'scenegraphColorEnabled';
  scenegraphColor: 'scenegraphColor';
  scenegraphCustomModelUrl: 'scenegraphCustomModelUrl';
} = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  sizeScale: {
    ...LAYER_VIS_CONFIGS.sizeScale,
    range: [0, 100]
  },
  angleX: {
    ...LAYER_VIS_CONFIGS.angle,
    property: 'angleX',
    label: 'angle X'
  },
  angleY: {
    ...LAYER_VIS_CONFIGS.angle,
    property: 'angleY',
    label: 'angle Y'
  },
  angleZ: {
    ...LAYER_VIS_CONFIGS.angle,
    property: 'angleZ',
    defaultValue: 0,
    label: 'angle Z'
  },
  scenegraph: {
    ...LAYER_VIS_CONFIGS.scenegraph,
    defaultValue: DEFAULT_SCENEGRAPH_MODEL_ID
  },
  scenegraphColorEnabled: 'scenegraphColorEnabled',
  scenegraphColor: 'scenegraphColor',
  scenegraphCustomModelUrl: 'scenegraphCustomModelUrl'
};

const DEFAULT_TRANSITION: [0, 0, 0] = [0, 0, 0];
const DEFAULT_SCALE: [1, 1, 1] = [1, 1, 1];
const DEFAULT_COLOR: RGBColor = [255, 255, 255];
// https://deck.gl/docs/api-reference/mesh-layers/scenegraph-layer#_animations
const DEFAULT_ANIMATIONS = {
  '*': {speed: 5}
};

function isScenegraphAssetUrl(value: unknown): value is string {
  return typeof value === 'string' && value.includes('/');
}

export default class ScenegraphLayer extends Layer {
  declare visConfigSettings: ScenegraphLayerVisConfigSettings;
  declare config: ScenegraphLayerConfig;

  _layerInfoModal: () => JSX.Element;
  dataToFeature: any[] = [];
  centroids: Array<number[] | null> = [];
  private _geojsonFieldIdx = -1;
  private _geojsonBounds: [number, number, number, number] | null = null;

  constructor(props) {
    super(props);

    this.registerVisConfig(scenegraphVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) => {
      if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
        return scenegraphGeojsonAccessor(this.config.columns)(dataContainer);
      }
      return scenegraphPosAccessor(this.config.columns)(dataContainer);
    };

    // prepare layer info modal
    this._layerInfoModal = ScenegraphInfoModalFactory();
  }

  get type(): '3D' {
    return '3D';
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get layerIcon() {
    return ScenegraphLayerIcon;
  }

  // Mesh appearance comes from the GLTF, not layer fill/stroke encoding
  getLegendVisualChannels() {
    return {};
  }

  get layerInfoModal() {
    const modal = {
      id: 'scenegraphInfo',
      template: this._layerInfoModal,
      modalProps: {
        title: 'How to use Scenegraph'
      }
    };
    return {
      [COLUMN_MODE_POINTS]: modal,
      [COLUMN_MODE_GEOJSON]: modal
    };
  }

  getDefaultLayerConfig(props) {
    return {
      ...super.getDefaultLayerConfig(props),
      columnMode: props?.columnMode ?? DEFAULT_COLUMN_MODE
    };
  }

  static findDefaultLayerProps(dataset: KeplerTable): FindDefaultLayerPropsReturnValue {
    const geojsonColumns = dataset.fields
      .filter(
        f =>
          (f.type === 'geojson' || f.type === 'geoarrow') &&
          f.analyzerType &&
          SUPPORTED_ANALYZER_TYPES[f.analyzerType]
      )
      .map(f => f.name);

    const defaultColumns = {
      geojson: [...(GEOJSON_FIELDS.geojson || []), ...geojsonColumns]
    };
    const foundColumns = this.findDefaultColumnField(defaultColumns, dataset.fields);
    const altProps = foundColumns?.length
      ? foundColumns.map(columns => ({
          label:
            (typeof dataset.label === 'string' && dataset.label.replace(/\.[^/.]+$/, '')) || '3D',
          columns,
          columnMode: COLUMN_MODE_GEOJSON
        }))
      : [];

    return {props: [], altProps};
  }

  getDataUpdateTriggers(dataset: KeplerTable): any {
    const triggers = super.getDataUpdateTriggers(dataset);
    const {columnMode} = this.config;
    return {
      ...triggers,
      getData: {...triggers.getData, columnMode},
      getMeta: {...triggers.getMeta, columnMode}
    };
  }

  calculateDataAttribute({filteredIndex}: KeplerTable, getPosition) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      return this._calculateGeojsonDataAttribute(filteredIndex);
    }

    const data: ScenegraphLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos: number[] = getPosition({index});

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite)) {
        data.push({
          position: pos,
          index
        });
      }
    }
    return data;
  }

  /**
   * Place one model per GeoJSON feature at its centroid.
   * Points use their coordinate; lines and polygons use the vertex average.
   */
  private _calculateGeojsonDataAttribute(filteredIndex: number[]) {
    const data: ScenegraphLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const centroid =
        this.centroids[index] ||
        (this.dataToFeature[index]?.geometry
          ? getCentroidFromGeometry(this.dataToFeature[index].geometry)
          : null);
      if (centroid && Number.isFinite(centroid[0]) && Number.isFinite(centroid[1])) {
        data.push({
          position: [centroid[0], centroid[1], 0],
          index
        });
      }
    }

    return data;
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);
    const isGeojsonMode = this.config.columnMode === COLUMN_MODE_GEOJSON;
    const getPosition = isGeojsonMode
      ? (d: {position: number[]}) => d.position
      : this.getPositionAccessor(dataContainer);
    return {
      data,
      getPosition,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)()
    };
  }

  updateLayerMeta(dataset: KeplerTable, getPosition) {
    const {dataContainer} = dataset;

    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      const getFeature = this.getPositionAccessor(dataContainer);
      const geoField = dataset.fields?.[this.config.columns.geojson?.fieldIdx ?? -1];
      const encoding =
        geoField?.metadata && typeof (geoField.metadata as Map<string, string>).get === 'function'
          ? (geoField.metadata as Map<string, string>).get(GEOARROW_METADATA_KEY)
          : (geoField?.metadata as Record<string, string> | undefined)?.[GEOARROW_METADATA_KEY];
      this._buildGeojsonDataToFeature(dataContainer, getFeature, encoding);
      this.updateMeta({bounds: this._geojsonBounds});
      return;
    }

    this.dataToFeature = [];
    this.centroids = [];
    const bounds = this.getPointsBounds(dataContainer, getPosition);
    this.updateMeta({bounds});
  }

  private _buildGeojsonDataToFeature(
    dataContainer: DataContainerInterface,
    getFeature: (d: {index: number}) => unknown,
    geoArrowEncoding?: string | null
  ) {
    const fieldIdx = this.config.columns.geojson?.fieldIdx ?? -1;
    if (
      this.dataToFeature.length === dataContainer.numRows() &&
      this._geojsonFieldIdx === fieldIdx
    ) {
      return;
    }
    this._geojsonFieldIdx = fieldIdx;
    this.dataToFeature = [];
    this.centroids = [];

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    let hasValid = false;

    for (let i = 0; i < dataContainer.numRows(); i++) {
      const feature = parseGeoJsonRawFeature(getFeature({index: i}), geoArrowEncoding);
      this.dataToFeature[i] = feature;
      this.centroids[i] = feature?.geometry ? getCentroidFromGeometry(feature.geometry) : null;

      if (feature?.geometry) {
        const positions = getAllPositions(feature.geometry);
        for (const pos of positions) {
          const lng = pos[0];
          const lat = pos[1];
          if (Number.isFinite(lng) && Number.isFinite(lat)) {
            hasValid = true;
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          }
        }
      }
    }

    this._geojsonBounds = hasValid ? [minLng, minLat, maxLng, maxLat] : null;
  }

  getScenegraph(): ScenegraphModel {
    const {visConfig} = this.config;
    const scenegraph = SCENEGRAPH_LAYER_MODELS.find(model => model.id === visConfig.scenegraph);
    if (scenegraph?.id === CUSTOM_SCENEGRAPH_MODEL_ID) {
      return {...scenegraph, url: visConfig.scenegraphCustomModelUrl || null};
    }
    if (scenegraph) {
      return scenegraph;
    }
    // Older maps stored a glTF URL from the file picker in visConfig.scenegraph.
    if (isScenegraphAssetUrl(visConfig.scenegraph)) {
      return {
        id: visConfig.scenegraph,
        label: 'Custom',
        icon: null,
        url: visConfig.scenegraph,
        angles: [0, 0, 0],
        scale: 1
      };
    }
    return DEFAULT_SCENEGRAPH_MODEL;
  }

  getOrientation(scenegraph: ScenegraphModel, globeMode: boolean): [number, number, number] {
    const {angleX = 0, angleY = 0, angleZ = 0} = this.config.visConfig;
    const adjustedAngleY = angleY + (globeMode ? 180 : 0);
    return [
      angleX + scenegraph.angles[0],
      adjustedAngleY + scenegraph.angles[1],
      angleZ + scenegraph.angles[2]
    ];
  }

  getColor(): RGBColor {
    const {scenegraphColorEnabled, scenegraphColor} = this.config.visConfig;
    return scenegraphColorEnabled && scenegraphColor ? scenegraphColor : DEFAULT_COLOR;
  }

  renderLayer(opts) {
    const scenegraph = this.getScenegraph();
    if (!scenegraph.url) {
      return [];
    }

    const {data, gpuFilter, mapState} = opts;
    const {sizeScale = 1} = this.config.visConfig;
    const globeMode = Boolean(mapState?.globe?.enabled);
    const orientation = this.getOrientation(scenegraph, globeMode);
    const color = this.getColor();

    return [
      new DeckScenegraphLayer({
        ...this.getDefaultDeckLayerProps(opts),
        // gpu data filtering is not supported at the moment in scenegraphLayer https://github.com/visgl/deck.gl/issues/8099
        extensions: [],
        ...data,
        fetch: fetchGltf,
        scenegraph: scenegraph.url,
        sizeScale: sizeScale * scenegraph.scale,
        getTranslation: DEFAULT_TRANSITION,
        getScale: DEFAULT_SCALE,
        getOrientation: orientation,
        getColor: color,
        _lighting: 'pbr',
        _animations: DEFAULT_ANIMATIONS,
        // parameters
        parameters: {depthTest: true, blend: false, ...(mapState?.layerParameters ?? {})},
        // update triggers
        updateTriggers: {
          getOrientation: orientation.join(','),
          getPosition: {columns: this.config.columns, columnMode: this.config.columnMode},
          getFilterValue: gpuFilter.filterValueUpdateTriggers,
          getColor: color
        }
      })
    ];
  }
}
