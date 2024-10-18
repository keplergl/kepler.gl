// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {isMapboxURL, transformMapboxUrl} from 'maplibregl-mapbox-request-transformer';

/**
 * Determines whether a Map Style is using Mapbox Tiles
 * @param {any} mapStyle the mapStyle to check
 * @returns true if the style is using Mapbox tiles
 */
export function isStyleUsingMapboxTiles(mapStyle) {
  const sources = mapStyle.stylesheet?.sources || {};

  return Object.keys(sources).some(sourceId => {
    const {url, tiles} = sources[sourceId] || {};

    if (url) {
      return url.toLowerCase().startsWith('mapbox://');
    }

    if (tiles) {
      return tiles.some(tileUrl => tileUrl.toLowerCase().startsWith('mapbox://'));
    }

    return false;
  });
}

/**
 * Transform mapbox protocol so can be used with maplibre
 * @param mapboxKey mapbox api key
 * @returns transformed url
 */
export const transformRequest = (
  mapboxKey: string
): ((url: string, resourceType: string) => {url: string}) => {
  return (url: string, resourceType: string) => {
    if (isMapboxURL(url)) {
      return transformMapboxUrl(url, resourceType, mapboxKey);
    }

    return {url};
  };
};
