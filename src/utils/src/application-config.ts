// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MapLib, MapRef} from 'react-map-gl';

import type {BaseMapLibraryType} from '@kepler.gl/constants';

import type {DatabaseAdapter} from './application-config-types';

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
export type KeplerApplicationConfig = {
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
  database?: DatabaseAdapter | null;

  // Disable progressive loading for arrow files
  useArrowProgressiveLoading?: boolean;
  // Show built-in banner associated with the current version of Kepler.gl
  showReleaseBanner?: boolean;
  // Use the onFilteredItemsChange callback for DataFilterExtension.
  // Enabling this option may cause performance issues when dealing with a large number of layers or sublayers,
  // especially if large Arrow files are split into relatively small batches (should be fixed in the future).
  useOnFilteredItemsChange?: boolean;
};

const DEFAULT_APPLICATION_CONFIG: Required<KeplerApplicationConfig> = {
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
  table: null,
  database: null,

  useArrowProgressiveLoading: true,
  showReleaseBanner: true,
  useOnFilteredItemsChange: false
};

const applicationConfig: Required<KeplerApplicationConfig> = DEFAULT_APPLICATION_CONFIG;

export const getApplicationConfig = (): Required<KeplerApplicationConfig> => applicationConfig;

export function initApplicationConfig(appConfig: KeplerApplicationConfig = {}) {
  Object.assign(applicationConfig, appConfig);
}
