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
    if (typeof attribution === 'string') {
      return attribution.includes('openstreetmap.org');
    }
    return false;
  });
}

/**
 * Minimal structural contract for the MapLibre/Mapbox map instance used by the
 * attribution helpers below. Only the members actually read are declared;
 * everything is optional because these helpers may be called before the map is
 * fully initialized (guarded by optional chaining + try/catch at runtime).
 *
 * `getSource` returns `any` on purpose: the concrete MapLibre/Mapbox source
 * union (GeoJSONSource, VectorSource, …) is not structurally assignable to a
 * `{attribution?}` shape, and we only ever read an optional `attribution`
 * string off it. Declaring the two getters still catches passing a non-map.
 */
export interface AttributionMapLike {
  getStyle?: () => {sources?: Record<string, unknown>} | undefined | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSource?: (id: string) => any;
}

/**
 * Checks resolved map sources for OpenStreetMap attribution.
 * CARTO basemaps don't have attribution in the raw style JSON;
 * it only appears after MapLibre resolves the TileJSON.
 * Uses map.getSource() to access the resolved source with TileJSON metadata.
 */
export function mapHasOpenStreetMapAttribution(map?: AttributionMapLike | null): boolean {
  try {
    const style = map?.getStyle?.();
    if (!style?.sources) return false;
    return Object.keys(style.sources).some(sourceId => {
      const source = map?.getSource?.(sourceId);
      const attribution = source?.attribution;
      if (typeof attribution === 'string') {
        return attribution.toLowerCase().includes('openstreetmap');
      }
      return false;
    });
  } catch {
    return false;
  }
}

/**
 * Collects the attribution strings declared by the resolved map sources.
 * Custom basemap styles (e.g. OpenFreeMap, OpenMapTiles) declare their own
 * attribution in the source's TileJSON, which only becomes available after
 * MapLibre resolves it. Unlike {@link mapHasOpenStreetMapAttribution}, this
 * preserves the full attribution text instead of collapsing it to a boolean,
 * so custom attributions are not lost.
 * @param map the resolved MapLibre/Mapbox map instance
 * @returns de-duplicated list of attribution HTML strings, order preserved
 */
export function getBaseMapAttributions(map?: AttributionMapLike | null): string[] {
  try {
    const style = map?.getStyle?.();
    if (!style?.sources) return [];
    const seen = new Set<string>();
    Object.keys(style.sources).forEach(sourceId => {
      const source = map?.getSource?.(sourceId);
      const attribution = source?.attribution;
      if (typeof attribution === 'string') {
        const trimmed = attribution.trim();
        if (trimmed) {
          seen.add(trimmed);
        }
      }
    });
    return [...seen];
  } catch {
    return [];
  }
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
