// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {DatasetType, ZarrDatasetMetadata} from '@kepler.gl/constants';
import {LayerClasses} from '@kepler.gl/layers';
import KeplerTable, {getZarrAxis, getZarrVariable} from '@kepler.gl/table';

export const contourOptions = z.object({
  weightColumn: z.string().min(1).optional(),
  gridResolution: z.number().int().min(32).max(256).optional(),
  smoothing: z.number().min(0).max(6).optional(),
  levels: z.number().int().min(2).max(20).optional(),
  filled: z.boolean().optional(),
  stroked: z.boolean().optional(),
  colorByLevel: z.boolean().optional(),
  fillOpacity: z.number().min(0).max(1).optional()
});

export const voronoiOptions = z.object({
  boundsPadding: z.number().min(0).max(100).optional(),
  filled: z.boolean().optional(),
  stroked: z.boolean().optional(),
  opacity: z.number().min(0).max(1).optional()
});

export const zarrOptions = z.object({
  variable: z.string().optional().describe('Variable path from the Zarr dataset metadata.'),
  dimensionIndexes: z.record(z.string(), z.number().int().nonnegative()).optional(),
  axis: z
    .discriminatedUnion('kind', [
      z.object({kind: z.literal('auto')}),
      z.object({kind: z.literal('off')}),
      z.object({kind: z.literal('dimension'), dimension: z.string().min(1)}),
      z.object({
        kind: z.literal('forecast'),
        referenceTime: z.string().min(1),
        leadTime: z.string().min(1)
      })
    ])
    .optional(),
  frame: z.number().int().nonnegative().optional(),
  rescale: z.tuple([z.number(), z.number()]).optional(),
  opacity: z.number().min(0).max(1).optional()
});

const positionOptions = z.object({
  latitudeColumn: z.string().min(1).optional(),
  longitudeColumn: z.string().min(1).optional(),
  geometryColumn: z.string().min(1).optional()
});

/** These layers deliberately do not auto-create on import; resolve their columns explicitly. */
export function buildSurfaceLayer(
  dataset: KeplerTable,
  type: 'contour' | 'voronoi',
  input: unknown
) {
  const position = positionOptions.parse(input);
  const args = input as {contour?: unknown; voronoi?: unknown};
  const column = (name: string, geometry = false) => {
    const fieldIdx = dataset.getColumnFieldIdx(name);
    const field = dataset.fields[fieldIdx];
    const types = geometry ? ['geojson', 'geoarrow'] : ['integer', 'real'];
    if (!field || !types.includes(field.type)) {
      throw new Error(`Column "${name}" must be a ${geometry ? 'geometry' : 'numeric'} field.`);
    }
    return {value: name, fieldIdx};
  };
  const {latitudeColumn, longitudeColumn, geometryColumn} = position;
  if (Boolean(latitudeColumn) !== Boolean(longitudeColumn)) {
    throw new Error('Provide both latitudeColumn and longitudeColumn.');
  }
  if (geometryColumn && latitudeColumn) {
    throw new Error('Choose either geometryColumn or latitudeColumn/longitudeColumn.');
  }
  let columns;
  if (geometryColumn) {
    columns = {geojson: column(geometryColumn, true)};
  } else if (latitudeColumn && longitudeColumn) {
    columns = {lat: column(latitudeColumn), lng: column(longitudeColumn)};
  } else {
    const pair = dataset.fieldPairs?.[0]?.pair;
    const geometry = dataset.fields.find(f => ['geojson', 'geoarrow'].includes(f.type));
    if (pair) {
      columns = {lat: column(pair.lat.value), lng: column(pair.lng.value)};
    } else if (geometry) {
      columns = {geojson: column(geometry.name, true)};
    } else {
      throw new Error(`${type} requires numeric latitude/longitude columns or a geometry field.`);
    }
  }
  const {weightColumn, ...visConfig} =
    type === 'contour'
      ? contourOptions.parse(args.contour ?? {})
      : {weightColumn: undefined, ...voronoiOptions.parse(args.voronoi ?? {})};
  const layer = new LayerClasses[type]({
    columns: {...columns, ...(weightColumn ? {value: column(weightColumn)} : {})},
    columnMode: columns.geojson ? 'geojson' : type === 'contour' ? 'grid' : 'points'
  });
  layer.config.visConfig = {...layer.config.visConfig, ...visConfig};
  return layer;
}

export function buildZarrLayer(dataset: KeplerTable, input: unknown) {
  if (dataset.type !== DatasetType.ZARR) {
    throw new Error('A Zarr layer requires a Zarr dataset. Load the store with map.load-zarr.');
  }
  const options = zarrOptions.parse(input ?? {});
  const metadata = dataset.metadata as ZarrDatasetMetadata;
  const variable =
    options.variable === undefined
      ? getZarrVariable(metadata)
      : metadata.variables?.find(v => v.path === options.variable);
  if (!variable) throw new Error('Zarr variable not found in this dataset.');
  for (const [name, index] of Object.entries(options.dimensionIndexes ?? {})) {
    const dimension = variable.nonSpatialDims.find(d => d.name === name);
    if (!dimension || index >= dimension.size) {
      throw new Error(`Invalid Zarr dimension index: ${name}=${index}.`);
    }
  }
  const axis = getZarrAxis(variable, options.axis, options.dimensionIndexes);
  if (axis.error) throw new Error(axis.error);
  if (options.frame !== undefined && options.frame >= axis.frames.length) {
    throw new Error('frame requires an explicit dimension/forecast axis and an in-range index.');
  }
  const range = options.rescale ?? variable.dataRange ?? metadata.dataRange;
  const rescale =
    range && Number.isFinite(range[0]) && Number.isFinite(range[1]) && range[0] < range[1]
      ? range
      : undefined;
  if (options.rescale && !rescale) {
    throw new Error('Zarr rescale must contain two finite values with minimum < maximum.');
  }
  const layer = new LayerClasses.zarr({dataId: dataset.id});
  layer.config.visConfig = {
    ...layer.config.visConfig,
    zarrVariable: variable.path,
    ...(options.dimensionIndexes ? {dimensionIndexes: options.dimensionIndexes} : {}),
    ...(options.axis ? {zarrAxis: options.axis} : {}),
    ...(options.frame !== undefined ? {zarrFrame: options.frame} : {}),
    ...(rescale ? {rescale} : {}),
    ...(options.opacity !== undefined ? {opacity: options.opacity} : {})
  };
  return layer;
}
