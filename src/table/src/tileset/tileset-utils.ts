// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {TileJSONLoader, TileJSON} from '@loaders.gl/mvt';

/**
 * MVTSource in current loaders ignores attribution
 * TODO: remove once MVTSource is ready
 */
export async function getMVTMetadata(metadataURL: string | null): Promise<TileJSON | null> {
  if (!metadataURL) return null;

  let response: Response;
  try {
    // Annoyingly, on CORS errors, fetch doesn't use the response status/ok mechanism but instead throws
    // CORS errors are common when requesting an unavailable sub resource such as a metadata file or an unavailable tile)
    response = await fetch(metadataURL);
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error((error as TypeError).message);
    return null;
  }
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(response.statusText);
    return null;
  }
  const tileJSON = await response.text();
  const metadata = TileJSONLoader.parseTextSync?.(tileJSON) || null;

  const rawMetadata = JSON.parse(tileJSON);
  if (rawMetadata?.attribution) {
    metadata.attributions = [rawMetadata.attribution];
  }

  return metadata;
}
