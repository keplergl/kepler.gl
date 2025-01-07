// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MapLib, MapRef} from 'react-map-gl';

import type {BaseMapLibraryType} from '@kepler.gl/constants';

export type MapLibInstance = MapLib<any>;
export type GetMapRef = ReturnType<MapRef['getMap']>;

export type BaseMapLibraryConfig = {
  getMapLib: () => Promise<MapLibInstance>;
  mapLibAttributionCssClass: string;
  mapLibCssClass: string;
  mapLibName: string;
  mapLibUrl: string;
};

/**
 * A mechanism to override default Kepler values/settings so that we
 * without having to make application-specific changes to the kepler repo.
 */
export type KeplerApplicationConfig<Map> = {
  /** Default name of export HTML file, can be overridden by user */
  defaultHtmlName?: string;
  defaultImageName?: string;
  defaultJsonName?: string;
  defaultDataName?: string;
  defaultExportJsonSettings?: {
    hasData?: boolean;
  };
  baseMapLibraryConfig?: Record<BaseMapLibraryType, BaseMapLibraryConfig>;
  plugins?: any[];
  // KeplerTable alternative
  // TODO improve typing by exporting KeplerTable interface to @kepler.gl/types
  table?: any;
};

const DEFAULT_APPLICATION_CONFIG: Required<KeplerApplicationConfig<mapboxgl.Map>> = {
  defaultHtmlName: 'kepler.gl.html',
  defaultImageName: 'kepler.gl.png',
  defaultJsonName: 'kepler.gl.json',
  defaultDataName: 'kepler.gl',
  defaultExportJsonSettings: {
    hasData: true
  },

  baseMapLibraryConfig: {
    maplibre: {
      getMapLib: () => import('maplibre-gl'),
      mapLibCssClass: 'maplibregl',
      mapLibAttributionCssClass: 'maplibre-attribution-container',
      mapLibName: 'MapLibre',
      mapLibUrl: 'https://www.maplibre.org/'
    },
    mapbox: {
      getMapLib: () => import('mapbox-gl'),
      mapLibCssClass: 'mapboxgl',
      mapLibAttributionCssClass: 'mapbox-attribution-container',
      mapLibName: 'Mapbox',
      mapLibUrl: 'https://www.mapbox.com/'
    }
  },

  plugins: [],
  // The default table class is KeplerTable.
  // TODO include KeplerTable here when the circular dependency with @kepler.gl/table and @kepler.gl/utils are resolved.
  table: null
};

const applicationConfig: Required<KeplerApplicationConfig<mapboxgl.Map>> =
  DEFAULT_APPLICATION_CONFIG;

export const getApplicationConfig = (): Required<KeplerApplicationConfig<mapboxgl.Map>> =>
  applicationConfig;

export function initApplicationConfig<M>(appConfig: KeplerApplicationConfig<M> = {}) {
  Object.assign(applicationConfig, appConfig);
}
