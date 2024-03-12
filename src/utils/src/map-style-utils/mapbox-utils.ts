// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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

export const transformRequest = (url: string): {url: string} => {
  return {
    url
  };
};
