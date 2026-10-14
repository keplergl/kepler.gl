// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {EXPORT_DATA_TYPE} from '@kepler.gl/constants';
import {Field, FieldPair} from '@kepler.gl/types';
import {DataContainerInterface} from '@kepler.gl/utils';
import {ZipWriter} from '@loaders.gl/zip';
import type {FeatureCollection} from 'geojson';

import {datasetToFeatureCollection} from './dataset-to-geojson';
import {writeGeoPackage} from './geopackage-writer';
import {writeGeoParquet} from './geoparquet-writer';
import {writeKml} from './kml-writer';
import {writeShapefile} from './shapefile-writer';

export {datasetToFeatureCollection} from './dataset-to-geojson';

export type EncodedDatasetExport = {
  data: BlobPart;
  extension: string;
  mimeType: string;
};

/** Turn a dataset label into a filesystem-safe export base name. */
export function sanitizeExportName(name: string): string {
  let sanitized = '';
  for (const char of name.trim()) {
    const code = char.charCodeAt(0);
    sanitized += code <= 0x1f || '<>:"/\\|?*'.includes(char) ? '-' : char;
  }
  sanitized = sanitized.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return sanitized || 'dataset';
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

async function zipEntries(entries: Record<string, Uint8Array>): Promise<Uint8Array> {
  const files = Object.fromEntries(
    Object.entries(entries).map(([name, bytes]) => [name, toArrayBuffer(bytes)])
  );
  return new Uint8Array(await ZipWriter.encode(files));
}

/**
 * Encode a dataset for download. Hidden attribute-table columns are omitted.
 * Geometry columns that are hidden are still used to build the feature geometry.
 */
export async function encodeDatasetExport(options: {
  data: DataContainerInterface;
  fields: Field[];
  fieldPairs?: FieldPair[];
  hiddenColumns?: string[];
  dataType: string;
  layerName: string;
}): Promise<EncodedDatasetExport> {
  const layerName = sanitizeExportName(options.layerName);
  const geojson = datasetToFeatureCollection(options.data, options.fields, {
    hiddenColumns: options.hiddenColumns,
    fieldPairs: options.fieldPairs
  });

  switch (options.dataType) {
    case EXPORT_DATA_TYPE.GEOJSON:
      return {
        data: JSON.stringify(geojson),
        extension: 'geojson',
        mimeType: 'application/geo+json'
      };
    case EXPORT_DATA_TYPE.KML:
      return {
        data: writeKml(geojson, layerName),
        extension: 'kml',
        mimeType: 'application/vnd.google-earth.kml+xml'
      };
    case EXPORT_DATA_TYPE.KMZ:
      return {
        data: await zipEntries({
          'doc.kml': new TextEncoder().encode(writeKml(geojson, layerName))
        }),
        extension: 'kmz',
        mimeType: 'application/vnd.google-earth.kmz'
      };
    case EXPORT_DATA_TYPE.SHAPEFILE:
      return {
        data: await zipShapefile(geojson, layerName),
        extension: 'zip',
        mimeType: 'application/zip'
      };
    case EXPORT_DATA_TYPE.GEOPACKAGE:
      return {
        data: await writeGeoPackage(geojson, layerName),
        extension: 'gpkg',
        mimeType: 'application/geopackage+sqlite3'
      };
    case EXPORT_DATA_TYPE.GEOPARQUET:
      return {
        data: await writeGeoParquet(geojson),
        extension: 'parquet',
        mimeType: 'application/vnd.apache.parquet'
      };
    default:
      throw new Error(`Unsupported export format ${options.dataType}`);
  }
}

async function zipShapefile(geojson: FeatureCollection, baseName: string): Promise<Uint8Array> {
  const parts = writeShapefile(geojson);
  return zipEntries({
    [`${baseName}.shp`]: parts.shp,
    [`${baseName}.shx`]: parts.shx,
    [`${baseName}.dbf`]: parts.dbf,
    [`${baseName}.prj`]: parts.prj,
    [`${baseName}.cpg`]: parts.cpg
  });
}
