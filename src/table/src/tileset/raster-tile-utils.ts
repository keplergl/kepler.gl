// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {JsonObjectOrArray, StacTypes} from '@kepler.gl/types';

// Define these as regex to allow any semver major version 1
const EO_EXT_ID = /https:\/\/stac-extensions.github.io\/eo\/v1[\d.]+\/schema.json/;
const RASTER_EXT_ID = /https:\/\/stac-extensions.github.io\/raster\/v1[\d.]+\/schema.json/;
const ITEM_ASSETS_EXT_ID =
  /https:\/\/stac-extensions.github.io\/item-assets\/v1[\d.]+\/schema.json/;

export function parseRasterMetadata(
  metadata: JsonObjectOrArray,
  options: {allowCollections: boolean}
): StacTypes.CompleteSTACObject | Error | null {
  if (!metadata || typeof metadata !== 'object') {
    return null;
  }

  const error = validateSTAC(metadata, options);
  if (error !== null) {
    return error;
  }

  return metadata as StacTypes.CompleteSTACObject;
}

// eslint-disable-next-line complexity
function validateSTAC(stac: JsonObjectOrArray, options: {allowCollections: boolean}): Error | null {
  const {allowCollections = false} = options;

  // Note: If a STAC object fails validation, it will silently fail
  if (
    typeof stac === 'string' ||
    typeof stac === 'boolean' ||
    typeof stac === 'number' ||
    Array.isArray(stac) ||
    !stac
  ) {
    return Error('Metadata must be an object.');
  }

  if ((!allowCollections && stac?.type === 'Collection') || stac?.type === 'Catalog') {
    return Error('Custom STAC Collections and Catalogs are not supported.');
  }

  if (stac?.stac_version?.[0] !== '1') {
    return Error('STAC versions before 1.0.0 not supported.');
  }

  if (stac?.type !== 'Feature' && stac?.type !== 'Collection') {
    return Error('Not a STAC Item or Collection.');
  }

  const isCollection = stac?.type === 'Collection';

  const required_extensions = [EO_EXT_ID, RASTER_EXT_ID];
  if (isCollection) {
    required_extensions.push(ITEM_ASSETS_EXT_ID);
  }

  if (
    !Array.isArray(stac.stac_extensions) ||
    !stac.stac_extensions.some(ext => typeof ext === 'string' && EO_EXT_ID.exec(ext)) ||
    !stac.stac_extensions.some(ext => typeof ext === 'string' && RASTER_EXT_ID.exec(ext))
  ) {
    return Error('EO and Raster STAC extensions are required.');
  }

  if (
    isCollection &&
    !stac.stac_extensions.some(ext => typeof ext === 'string' && EO_EXT_ID.exec(ext))
  ) {
    return Error('item-assets STAC extension is required.');
  }

  const assets = isCollection ? stac?.item_assets : stac?.assets;
  if (!assets || typeof assets !== 'object') {
    return Error('STAC object is missing asset information.');
  }

  if (
    !Object.values(assets).some(
      asset => Array.isArray(asset?.['eo:bands']) && Array.isArray(asset?.['raster:bands'])
    )
  ) {
    return Error('At least one STAC asset must have both eo:bands and raster:bands data.');
  }

  return null;
}
