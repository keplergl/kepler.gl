// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MapLib, MapRef} from 'react-map-gl';

export type MapLibInstance = MapLib<any>;

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
  getMapLib?: () => Promise<MapLibInstance>;
  getMap?: (ref: any) => Map;
  mapLibCssClass?: string;
  mapLibName?: string;
  mapLibUrl?: string;
};

const DEFAULT_APPLICATION_CONFIG: Required<KeplerApplicationConfig<mapboxgl.Map>> = {
  defaultHtmlName: 'kepler.gl.html',
  defaultImageName: 'kepler.gl.png',
  defaultJsonName: 'kepler.gl.json',
  defaultDataName: 'kepler.gl',
  defaultExportJsonSettings: {
    hasData: true
  },
  getMapLib: () => import('maplibre-gl'),
  getMap: (mapRef: MapRef): mapboxgl.Map => mapRef?.getMap(),
  mapLibCssClass: 'maplibregl',
  mapLibName: 'MapLibre',
  mapLibUrl: 'https://www.maplibre.org/'
};

const applicationConfig: Required<KeplerApplicationConfig<mapboxgl.Map>> =
  DEFAULT_APPLICATION_CONFIG;

export const getApplicationConfig = (): Required<KeplerApplicationConfig<mapboxgl.Map>> =>
  applicationConfig;

export function initApplicationConfig<M>(appConfig: KeplerApplicationConfig<M> = {}) {
  Object.assign(applicationConfig, appConfig);
}
