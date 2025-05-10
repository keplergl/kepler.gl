// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DATA_TYPES as ANALYZER_DATA_TYPES} from 'type-analyzer';
import {ascending} from 'd3-array';
import Console from 'global/console';
import uniq from 'lodash/uniq';
import {DATA_TYPES} from 'type-analyzer';

import {MVTSource, TileJSON} from '@loaders.gl/mvt';
import {PMTilesSource, PMTilesMetadata} from '@loaders.gl/pmtiles';

import {
  analyzerTypeToFieldType,
  containValidTime,
  notNullorUndefined as notNullOrUndefined,
  parseUri,
  getFieldsFromData
} from '@kepler.gl/common-utils';
import {
  DatasetType,
  ALL_FIELD_TYPES,
  FILTER_TYPES,
  PMTilesType,
  RemoteTileFormat
} from '@kepler.gl/constants';

import {Feature, Field as KeplerField, KeplerLayer} from '@kepler.gl/types';
import {clamp, formatNumberByStep, getNumericStepSize, timeToUnixMilli} from '@kepler.gl/utils';

import {
  FilterProps,
  NumericFieldFilterProps,
  BooleanFieldFilterProps,
  StringFieldFilterProps,
  default as KeplerDataset
} from '../kepler-table';

export function isTileDataset(dataset: KeplerDataset | {type: string}): boolean {
  return Boolean(dataset?.type === DatasetType.VECTOR_TILE);
}

type VectorTileField = {
  analyzerType: string;
  name: string;
  id: string;
  format: string;
  type: string;
  filterProps?: FilterProps;
};

export type VectorTileMetadata = {
  attributions?: unknown[];
  metaJson: any | null;
  bounds: number[] | null;
  center: number[] | null;
  maxZoom: number | null;
  minZoom: number | null;
  name?: string;
  description?: string;
  fields: VectorTileField[];

  // if the tileset is of pmtiles format then include info about type of pmtiles
  pmtilesType?: PMTilesType;
};

type TilesetMetadata = VectorTileMetadata;

export type TippecanoeLayerAttribute = {
  attribute?: string;
  type?: string;
  min?: number;
  max?: number;
  values: string[] | number[];
};

type TippecanoeLayer = {
  attributes?: TippecanoeLayerAttribute[];
};
type TilesetFunction = {
  getMetaUrl: (s: string) => string | null;
  parseMetadata: (d: any, options?: any) => TilesetMetadata | null;
};
// https://github.com/mapbox/tilejson-spec/tree/master/2.2.0
function isLat(num: any): boolean {
  return Number.isFinite(num) && num <= 90 && num >= -90;
}
function isLng(num: any): boolean {
  return Number.isFinite(num) && num <= 180 && num >= -180;
}
function isZoom(num: any): boolean {
  return Number.isFinite(num) && num >= 0 && num <= 22;
}
function fromArrayOrString(data: string | number[]): number[] | null {
  if (typeof data === 'string') {
    return data.split(',').map(parseFloat);
  } else if (Array.isArray(data)) {
    return data;
  }
  return null;
}

function parseCenter(center: string | number[]): number[] | null {
  // supported formats
  // string: "-96.657715,40.126127,-90.140061,43.516689",
  // array: [-91.505127,41.615442,14]
  const result = fromArrayOrString(center);
  if (
    Array.isArray(result) &&
    result.length === 3 &&
    isLng(result[0]) &&
    isLat(result[1]) &&
    isZoom(result[2])
  ) {
    return result;
  }
  return null;
}

/**
 * bounds should be [minLng, minLat, maxLng, maxLat]
 * @param {*} bounds
 */
function parseBounds(bounds: string | number[]): number[] | null {
  // supported formats
  // string: "-96.657715,40.126127,-90.140061,43.516689",
  // array: [ -180, -85.05112877980659, 180, 85.0511287798066 ]
  const result = fromArrayOrString(bounds);
  // validate bounds
  if (
    Array.isArray(result) &&
    result.length === 4 &&
    [result[0], result[2]].every(isLng) &&
    [result[1], result[3]].every(isLat)
  ) {
    return result;
  }
  return null;
}

const X_PATT = /\{x\}/;
const Y_PATT = /\{y\}/;
const Z_PATT = /\{z\}/;

function isFullyQualifiedTileUrl(tileUrl: string): boolean {
  return X_PATT.test(tileUrl) && Y_PATT.test(tileUrl) && Z_PATT.test(tileUrl);
}

/**
 * Normalize tile URL
 * @param  {string} tileUrl Initial tile URL, which may be either the root URL for the
 *                          tileset or a fully qualified template
 * @param  {function} validateUrl function to validate tile URL
 * @return {string|null}    Fully qualified tile URL template, or null if input does not
 *                          appear to be a valid URL
 */
export function getTileUrl(
  tileUrl: string,
  validateUrl: (s: string) => boolean = isFullyQualifiedTileUrl
): string | null {
  // Check for a valid URL. Ideally we'd have a simple method here.
  const uriParts = parseUri(tileUrl);
  if (!uriParts.protocol || !uriParts.host) {
    return null;
  }
  if (validateUrl(tileUrl)) {
    return tileUrl;
  }
  return `${tileUrl.replace(/\/$/, '')}/{z}/{x}/{y}.pbf`;
}

/**
 * Map of util functions for different tileset types, keyed by host
 */
const TILESET_FUNCTIONS: {[key: string]: TilesetFunction} = {
  'api.mapbox.com': {
    getMetaUrl: getMetaUrlMapbox,
    parseMetadata: parseMetadataTileJSON
  },
  default: {
    getMetaUrl: getMetaUrlTippecanoe,
    parseMetadata: parseMetadataTileJSON
  }
};

function getTilesetFunctions(tileUrl: string | null): TilesetFunction {
  let host = '';
  try {
    host = new URL(tileUrl || '').hostname;
  } catch (error) {
    // do nothing
  }

  return TILESET_FUNCTIONS[host] || TILESET_FUNCTIONS.default;
}

/**
 * Get the metadata URL for a given tileset
 */
export function getMetaUrl(tileUrl: string): string | null {
  return getTilesetFunctions(tileUrl).getMetaUrl(tileUrl);
}
type ParseMetadataOption = {
  tileUrl?: string | null;
};
/**
 * Parse the metadata for a given tileset
 */
export function parseVectorMetadata(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  metadata: PMTilesMetadata | TileJSON,
  option?: ParseMetadataOption
): TilesetMetadata | null {
  const {tileUrl = ''} = option || {};
  return getTilesetFunctions(tileUrl).parseMetadata(metadata);
}

const MAPBOX_URL_PATT = /\/\{z\}\/\{x\}\/\{y\}\.mvt/;

function getMetaUrlMapbox(tileUrl = ''): string {
  return tileUrl.replace(MAPBOX_URL_PATT, '.json');
}

function parseMetadataTileJSON(metadata: PMTilesMetadata | TileJSON): TilesetMetadata | null {
  const parsed = parseMetadataTippecanoeFromDataSource(metadata);
  if (!parsed) return null;

  // PMTiles can potentially be in RasterTile format
  const mimeType = (metadata as PMTilesMetadata).tileMIMEType;
  if (mimeType) {
    parsed.pmtilesType =
      mimeType === 'application/vnd.mapbox-vector-tile' ? PMTilesType.MVT : PMTilesType.RASTER;
  }

  // Fields already parsed from `json` property
  if (parsed.fields?.length) {
    return parsed;
  }

  return parsed;
}

function getMetaUrlTippecanoe(tileUrl) {
  const url = getTileUrl(tileUrl);
  if (!url) return null;
  // assumes the structure <url_base>/{z}...
  const baseUrl = url.split(Z_PATT)[0].replace(/\/$/, '');
  return `${baseUrl}/metadata.json`;
}

/**
 * Special parsing for metadata returned by MVTSource and PMTilesSource.
 * @param metadata Tileset metadata parsed by a DataSouce
 * @returns Metadata in Kepler-friendly format.
 */
function parseMetadataTippecanoeFromDataSource(
  metadata: PMTilesMetadata | TileJSON | null
): TilesetMetadata | null {
  if (!metadata || typeof metadata !== 'object') {
    return null;
  }

  let result: TilesetMetadata = {
    attributions: [],
    metaJson: null,
    bounds: null,
    center: null,
    maxZoom: null,
    minZoom: null,
    fields: []
  };

  const mvtMetadata = metadata as TileJSON;
  const pmTileMetadata = metadata as PMTilesMetadata;

  // try to parse metaJson
  if (typeof mvtMetadata.metaJson === 'string') {
    try {
      result.metaJson = JSON.parse(mvtMetadata.metaJson);
    } catch (err) {
      // do nothing
    }
  } else if (typeof mvtMetadata.metaJson === 'object') {
    result.metaJson = mvtMetadata.metaJson;
  }

  result.bounds = parseBounds(
    Array.isArray(metadata.boundingBox) ? metadata.boundingBox.flat() : ''
  );

  // PMTileSource has centerZoom and center [lon, lat], MVTSource - [lon, lat, zoom]
  const center =
    pmTileMetadata.centerZoom !== undefined && Array.isArray(metadata.center)
      ? [...metadata.center, pmTileMetadata.centerZoom]
      : metadata.center;
  result.center = parseCenter(center || '');

  result.maxZoom = safeParseFloat(metadata.maxZoom);
  result.minZoom = safeParseFloat(metadata.minZoom);
  result.name = metadata.name || '';
  result.description = mvtMetadata.description || pmTileMetadata.tilejson?.description || '';

  if (Array.isArray(pmTileMetadata.tilejson?.layers)) {
    const layers = pmTilesLayerToTippecanoeLayer(pmTileMetadata.tilejson?.layers);
    result.fields = collectAttributes(layers);
  } else if (Array.isArray(mvtMetadata.layers)) {
    const layers = pmTilesLayerToTippecanoeLayer(mvtMetadata.layers);
    result.fields = collectAttributes(layers);
  }

  result = {
    ...result,
    attributions:
      pmTileMetadata.attributions ||
      (mvtMetadata.htmlAttribution ? [mvtMetadata.htmlAttribution] : undefined) ||
      [],
    ...parseMetaJson(result.metaJson)
  };

  return result;
}

function safeParseFloat(input: unknown): number | null {
  const result =
    typeof input === 'string' ? parseFloat(input) : typeof input === 'number' ? input : null;
  return result === null || isNaN(result) ? null : result;
}

function parseMetaJson(metaJson: any): {fields: VectorTileField[]} | null {
  if (!metaJson || typeof metaJson !== 'object') {
    return null;
  }

  if (metaJson.tilestats && Array.isArray(metaJson.tilestats.layers)) {
    // we are in luck!
    return {fields: collectAttributes(metaJson.tilestats.layers)};
  }
  return null;
}

function getTimeAnimationDomain(mappedValue: number[]): {
  domain: number[];
  timeSteps: number[];
  mappedValue: number[];
  duration: number;
} {
  const timeSteps = uniq(mappedValue).sort(ascending).filter(notNullOrUndefined);

  const domain = [timeSteps[0], timeSteps[timeSteps.length - 1]];

  // if taks 10 * 1000 ms to finish the entire animation
  const duration = 10000 / timeSteps.length;
  const clamped = clamp([100, 2000], duration);

  return {domain, timeSteps, duration: clamped, mappedValue};
}

const pmTileTypeToAttrMap = {
  float32: 'number',
  string: 'string',
  utf8: 'string',
  int: 'int',
  boolean: 'boolean'
};

/**
 * Transform TileJSON['layers'] back to TippecanoeLayer
 */
function pmTilesLayerToTippecanoeLayer(layers: TileJSON['layers']): TippecanoeLayer[] {
  if (!layers) return [];

  const outLayers: TippecanoeLayer[] = [];
  for (const layer of layers) {
    const {fields = []} = layer || {};
    for (const pmField of fields) {
      const attribute = {
        attribute: pmField.name,
        type: pmTileTypeToAttrMap[pmField.type],
        count: pmField.uniqueValueCount,
        values: (pmField.values ?? []) as number[] | string[],
        min: pmField.min,
        max: pmField.max
      };

      outLayers.push({
        attributes: [attribute]
      });
    }
  }
  return outLayers;
}

function collectAttributes(layers: TippecanoeLayer[] = []): VectorTileField[] {
  const fields = {};
  const indexedAttributes: {[key: string]: TippecanoeLayerAttribute[]} = {};

  for (const layer of layers) {
    const {attributes = []} = layer || {};
    for (const attr of attributes) {
      const name = attr.attribute;
      if (typeof name === 'string') {
        // eslint-disable-next-line max-depth
        if (name.split('|').length > 1) {
          // indexed field
          const fname = name.split('|')[0];
          indexedAttributes[fname] = indexedAttributes[fname] || [];
          indexedAttributes[fname].push(attr);
        } else if (!fields[name]) {
          fields[name] = attributeToField(attr);
        } else {
          mergeAttributeDomain(fields[name], attr);
        }
      }
    }
  }

  // parse indexed attribute, and put index key unidentified back as normal field
  for (const [name, attrs] of Object.entries(indexedAttributes)) {
    const {indexedField, unidentified} = parseIndexedField(name, attrs);
    fields[indexedField.name] = indexedField;
    for (const unidentifiedAttr of unidentified) {
      if (unidentifiedAttr.attribute) {
        fields[unidentifiedAttr.attribute] =
          fields[unidentifiedAttr.attribute] || attributeToField(unidentifiedAttr);
        mergeAttributeDomain(fields[unidentifiedAttr.attribute], unidentifiedAttr);
      }
    }
  }

  return Object.values(fields);
}

function getIndexKeyFromFieldName(name: string): string | null {
  return name && name.split('|').length > 1 ? name.split('|')[1] : null;
}

export type FieldIndexBy = {
  format: string;
  type: string;
  mappedValue: {
    [key: string]: string;
  };
};

function parseIndexedField(
  name: string,
  attrs: TippecanoeLayerAttribute[]
): {
  unidentified: TippecanoeLayerAttribute[];
  indexedField: VectorTileField;
} {
  const unidentified: TippecanoeLayerAttribute[] = [];
  // analyze time format
  let field;

  for (const attr of attrs) {
    const fieldName = attr.attribute;
    const indexKey = getIndexKeyFromFieldName(fieldName || '');
    const analyzedType = indexKey && containValidTime([indexKey]);
    if (analyzedType) {
      field = field || {
        ...attributeToField(attr),
        // overide name and id to truncated name
        name,
        id: name,
        indexBy: {
          format: analyzedType.format,
          type: analyzerTypeToFieldType(analyzedType.type),
          mappedValue: {}
        }
      };
      mergeAttributeDomain(field, attr);
      // save epoch time in mappedValue
      let fieldTs: string | number | null = indexKey;
      if (analyzedType.format === 'x' || analyzedType.format === 'X') {
        fieldTs = Number(indexKey);
      }
      const epoch = timeToUnixMilli(fieldTs, analyzedType.format);
      if (epoch) {
        field.indexBy.mappedValue[epoch] = fieldName;
      }
    } else {
      // key is not valid timestamp
      unidentified.push(attr);
    }
  }

  if (field.indexBy && field.indexBy.type === ALL_FIELD_TYPES.timestamp) {
    field.indexBy.timeDomain = getTimeAnimationDomain(
      Object.keys(field.indexBy.mappedValue).map(Number)
    );
  }

  return {unidentified, indexedField: field};
}

function compare(num1: number | undefined, num2: number | undefined, operator: string): number {
  return Number.isFinite(num1) && Number.isFinite(num2)
    ? Math[operator](num1 as number, num2 as number)
    : Number.isFinite(num1)
    ? (num1 as number)
    : Number.isFinite(num2)
    ? (num2 as number)
    : NaN;
}

export function getFilterProps(
  fieldType: string,
  attribute: TippecanoeLayerAttribute
): FilterProps {
  switch (fieldType) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer: {
      const [min, max] = getAttributeDomain(fieldType, attribute);
      const diff = max - min;
      const step = getNumericStepSize(diff) || 0.1;
      const domain = [
        formatNumberByStep(min, step, 'floor'),
        formatNumberByStep(max, step, 'ceil')
      ];
      const filterProps: NumericFieldFilterProps = {
        domain,
        value: domain as [number, number],
        type: FILTER_TYPES.range,
        typeOptions: [FILTER_TYPES.range],
        gpu: true,
        step
      };
      return filterProps;
    }

    case ALL_FIELD_TYPES.boolean: {
      const filterProps: BooleanFieldFilterProps = {
        domain: [true, false],
        value: true,
        type: FILTER_TYPES.select,
        gpu: true
      };
      return filterProps;
    }

    default: {
      // Assume string for all other fields
      const filterProps: StringFieldFilterProps = {
        domain: attribute.values as string[],
        value: attribute.values as string[],
        type: FILTER_TYPES.multiSelect,
        gpu: false
      };
      return filterProps;
    }
  }
}

function attributeToField(attribute: TippecanoeLayerAttribute = {values: []}): VectorTileField {
  // attribute: "_season_peaks_color"
  // count: 1000
  // max: 0.95
  // min: 0.24375
  // type: "number"
  const fieldTypes = attributeTypeToFieldType(attribute.type);
  return {
    name: attribute.attribute as string,
    id: attribute.attribute as string,
    format: '',
    filterProps: getFilterProps(fieldTypes.type, attribute),
    ...fieldTypes
  };
}

function getAttributeDomain(type: string | null, attribute: TippecanoeLayerAttribute): number[] {
  switch (type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
      return [
        Number.isFinite(attribute.min) ? (attribute.min as number) : NaN,
        Number.isFinite(attribute.max) ? (attribute.max as number) : NaN
      ];

    case ALL_FIELD_TYPES.boolean:
      return [0, 1];
    default:
      return [0, 1];
  }
}

/**
 * @param field This function mutates the field parameter
 */
function mergeAttributeDomain(field: KeplerField, attribute: TippecanoeLayerAttribute): void {
  switch (field.type) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer: {
      const domain = field.metadata?.domain || field.filterProps?.domain;
      if (domain) {
        domain.min = compare(attribute.min, domain[0], 'min');
        domain.max = compare(attribute.max, domain[1], 'max');
      }
      return;
    }
    default:
      return;
  }
}

// possible types https://github.com/mapbox/tippecanoe#modifying-feature-attributes
const attrTypeMap = {
  number: {
    type: ALL_FIELD_TYPES.real,
    analyzerType: DATA_TYPES.FLOAT
  },
  numeric: {
    type: ALL_FIELD_TYPES.real,
    analyzerType: DATA_TYPES.FLOAT
  },
  string: {
    type: ALL_FIELD_TYPES.string,
    analyzerType: DATA_TYPES.STRING
  },
  vachar: {
    type: ALL_FIELD_TYPES.string,
    analyzerType: DATA_TYPES.STRING
  },
  float: {
    type: ALL_FIELD_TYPES.real,
    analyzerType: DATA_TYPES.FLOAT
  },
  int: {
    type: ALL_FIELD_TYPES.integer,
    analyzerType: DATA_TYPES.INT
  },
  int4: {
    type: ALL_FIELD_TYPES.integer,
    analyzerType: DATA_TYPES.INT
  },
  boolean: {
    type: ALL_FIELD_TYPES.boolean,
    analyzerType: DATA_TYPES.BOOLEAN
  },
  bool: {
    type: ALL_FIELD_TYPES.boolean,
    analyzerType: DATA_TYPES.BOOLEAN
  }
};

function attributeTypeToFieldType(aType?: string): {type: string; analyzerType: string} {
  const type = aType?.toLowerCase();
  if (!type || !attrTypeMap[type]) {
    Console.warn(
      `cannot convert attribute type ${type} to kepler.gl data type, use string by default`
    );
    return attrTypeMap.string;
  }

  return attrTypeMap[type];
}

/**
 * Returns true if a dataset can be used as source data for a layer.
 * @param dataset A dataset.
 * @param layer A layer.
 * @returns Returns true if a dataset can be used as source data for a layer.
 */
export function matchDatasetType(dataset: KeplerDataset, layer: KeplerLayer): boolean {
  // allow selection if type is not assigned yet
  if (!layer.type) {
    return true;
  }
  // allow selection if is current selected dataset
  if (layer.config.dataId === dataset.id) {
    return true;
  }
  // allow selection if layer doesn't have supportedDatasetTypes
  if (!layer.supportedDatasetTypes) {
    return true;
  }

  return (
    Array.isArray(layer.supportedDatasetTypes) &&
    layer.supportedDatasetTypes.includes(dataset.type || '')
  );
}

type GetFieldsFromTileProps = {
  remoteTileFormat: RemoteTileFormat;
  tilesetUrl: string | null;
  metadataUrl: string | null;
  metadata: VectorTileMetadata | null;
};

/**
 * Extracts fields from a tile and updates the metadata object with found fields.
 * Note: this function is for tilesets that don't include fields in metadata (most likely saved with older spec.).
 * @param params.remoteTileFormat The format of the remote tile (MVT or PMTiles).
 * @param params.tilesetUrl The URL of the tileset.
 * @param params.metadataUrl The URL of the metadata.
 * @param params.metadata The metadata object containing fields and tile properties.
 */
export const getFieldsFromTile = async ({
  remoteTileFormat,
  tilesetUrl,
  metadataUrl,
  metadata
}: GetFieldsFromTileProps) => {
  try {
    if (
      tilesetUrl &&
      metadataUrl &&
      metadata &&
      metadata.fields?.length === 0 &&
      metadata.minZoom &&
      metadata.bounds?.length === 4 &&
      (!metadata.pmtilesType || metadata.pmtilesType === PMTilesType.MVT)
    ) {
      const lon = (metadata.bounds[0] + metadata.bounds[2]) / 2;
      const lat = (metadata.bounds[1] + metadata.bounds[3]) / 2;
      const tileIndices = lonLatToTileIndex(lon, lat, metadata.minZoom);

      const tileSource =
        remoteTileFormat === RemoteTileFormat.MVT
          ? MVTSource.createDataSource(decodeURIComponent(tilesetUrl), {
              mvt: {
                metadataUrl: decodeURIComponent(metadataUrl)
              }
            })
          : PMTilesSource.createDataSource(tilesetUrl, {});
      const tile = await tileSource.getTileData({index: tileIndices} as any);
      const updatedFields = tileToFields(tile).map(f => {
        return {
          ...f,
          analyzerType: f.analyzerType || ALL_FIELD_TYPES.string,
          id: f.id || f.name
        };
      });

      metadata.fields = updatedFields;
    }
  } catch {
    // ignore, as this is experimental fallback
  }
};

/**
 * Converts tile features into Kepler fields.
 * @param tile The tile object containing features.
 * @returns An array of Kepler fields derived from the tile's features.
 */
const tileToFields = (tile: {features: Feature[]}): KeplerField[] => {
  if (tile?.features?.length > 0) {
    const header = Object.keys(tile.features[0].properties);
    const output = tile.features.map(f => {
      const obj = {};
      header.forEach(columnName => {
        obj[columnName] = f.properties[columnName];
      });
      return obj;
    });

    const fields = getFieldsFromData(output, header);
    // extra transformation of strings to numbers for tiles isn't implemented, so use string, not computed types
    return fields.map(f => {
      const forceString =
        (f.type === 'integer' || f.type === 'float') &&
        typeof tile.features[0].properties[f.name] === 'string';

      return {
        ...f,
        analyzerType: forceString ? ANALYZER_DATA_TYPES.STRING : f.analyzerType,
        type: forceString ? 'string' : f.type
      };
    });
  }
  return [];
};

/**
 * Converts longitude, latitude, and zoom level into vector tile indices (x, y, z).
 * @param lon Longitude in degrees, ranging from -180 to 180.
 * @param lat Latitude in degrees, ranging from -90 to 90.
 * @param zoom Zoom level (integer), where higher values provide more detail.
 * @returns Tile indices with x and y coordinates and zoom level z.
 */
function lonLatToTileIndex(lon: number, lat: number, zoom: number) {
  if (lat < -85.0511 || lat > 85.0511) {
    throw new Error('Latitude out of range. Must be between -85.0511 and 85.0511.');
  }
  if (zoom < 0) {
    throw new Error('Zoom level must be a non-negative integer.');
  }

  // 2^zoom (number of tiles per axis at given zoom level)
  const scale = 1 << zoom;
  // Convert longitude to tile X
  const x = Math.floor(((lon + 180) / 360) * scale);
  // Convert latitude to tile Y
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale
  );

  return {x, y, z: zoom};
}
