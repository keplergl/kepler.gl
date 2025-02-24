// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// import {isMapboxURL, transformMapboxUrl} from 'maplibregl-mapbox-request-transformer';

import {MAP_LIB_OPTIONS, BaseMapLibraryType} from '@kepler.gl/constants';

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

export function isStyleUsingOpenStreetMapTiles(mapStyle: any) {
  const sources = mapStyle?.stylesheet?.sources || {};
  return Object.keys(sources).some(sourceId => {
    const {attribution} = sources[sourceId] || {};
    if (typeof attribution?.attribution === 'string') {
      return attribution.attribution.includes('openstreetmap.org');
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
  _mapboxKey: string
): ((url: string, resourceType: string) => {url: string}) => {
  return (url: string, _resourceType: string) => {
    /*
    if (isMapboxURL(url)) {
      // ! TODO - use MapBox directly?
      return transformMapboxUrl(url, resourceType, mapboxKey);
    }
    */

    return {url};
  };
};

type StyleWithSources = {
  sources?: Record<string, any>;
};

export const getBaseMapLibrary = (baseMapStyle?: {
  url?: string | null;
  style?: any;
}): BaseMapLibraryType => {
  if (baseMapStyle) {
    if (baseMapStyle.url?.startsWith('mapbox://') || baseMapStyle.url?.includes('mapbox.com')) {
      return MAP_LIB_OPTIONS.MAPBOX;
    }

    if ((baseMapStyle.style as StyleWithSources)?.sources?.['mapbox'])
      return MAP_LIB_OPTIONS.MAPBOX;
  }

  return MAP_LIB_OPTIONS.MAPLIBRE;
};
