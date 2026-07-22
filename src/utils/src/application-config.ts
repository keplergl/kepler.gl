// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {MapLib, MapRef} from 'react-map-gl/mapbox-legacy';

import {KEPLER_UNFOLDED_BUCKET} from '@kepler.gl/constants';
import type {BaseMapLibraryType} from '@kepler.gl/constants';

import type {DatabaseAdapter} from './application-config-types';

/**
 * Represents a custom SVG icon that can be used in the icon layer.
 * The mesh describes the icon's geometry as triangulated SVG paths.
 *
 * Important: Triangle cells must use counter-clockwise (CCW) winding order.
 * Positions should be in the range [-1, 1] on both axes.
 */
export type SvgIcon = {
  /** Unique identifier for the icon, used as the value in the data's icon column */
  id: string;
  /** Triangulated SVG path geometry */
  mesh: {
    /** Triangle cell indices referencing positions (CCW winding order) */
    cells: [number, number, number][];
    /** Vertex positions [x, y, z] in range [-1, 1] */
    positions: [number, number, number][];
  };
};

/**
 * Detect if running with webpack build tool
 */
function isWebpackBuild(): boolean {
  // @ts-ignore - __webpack_require__ is injected by webpack at runtime
  return typeof __webpack_require__ !== 'undefined';
}

export type MapLibInstance = MapLib;
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

  // A URL to the CDN where the kepler.gl assets are hosted.
  cdnUrl?: string;

  // Raster Tile layer config
  // Raster Tile layer is under development and not ready for production use. Disabled by default.
  enableRasterTileLayer?: boolean;
  /** Whether to use Titiler v0.21 API endpoints instead of v0.11 */
  rasterServerUseLatestTitiler?: boolean;
  /** An array of URLs to shards of the raster tile server to be used by the raster tile layer. */
  rasterServerUrls?: string[];
  /** If true then try to fetch quantized elevation meshes from raster servers */
  rasterServerSupportsElevation?: boolean;
  /** How many times to retry a request if case of rasterServerServerErrorsToRetry errors */
  rasterServerMaxRetries?: number;
  /** How long between retries */
  rasterServerRetryDelay?: number;
  /** An array of HTTP status codes that should be retried when encountered. */
  rasterServerServerErrorsToRetry?: number[];
  /** Maximum number of simultaneous requests per raster server. 0 - no limit */
  rasterServerMaxPerServerRequests?: number;
  /** Whether to show the server input field in the raster tile layer setup form */
  rasterServerShowServerInput?: boolean;

  // WMS layer config -- Experimental
  // WMS layer is under development and not ready for production use. Disabled by default.
  enableWMSLayer?: boolean;

  // Flow layer config
  enableFlowLayer?: boolean;

  // Bitmap layer config
  enableBitmapLayer?: boolean;

  /** Whether to show example URLs in tileset setup forms (vector tile, raster tile, WMS, 3D tile) */
  showInlineTilesetExamples?: boolean;

  // Image export config
  /** Whether to apply fix for uglify error in dom-to-image (should be true for webpack builds, false for Vite) */
  escapeXhtmlForWebpack?: boolean;

  /** Maximum pitch angle in degrees. deck.gl defaults to 60; set higher (up to 85) for elevated perspectives.
   *  Note: values above 60 may cause rendering artifacts with some basemap tile providers. */
  maxPitch?: number;

  /** Whether to enable the annotations feature. Enabled by default. */
  enableAnnotations?: boolean;

  /** Whether to show the map navigation control (zoom buttons and compass). Enabled by default. */
  enableMapNavigationControl?: boolean;

  /** Whether to enable the swipe compare mode in split map view. Enabled by default. */
  enableSwipeMode?: boolean;

  /** Whether to show the option to switch to the globe view. Enabled by default. */
  enableGlobeView?: boolean;

  /** Whether to enable the layer groups feature. Enabled by default. */
  enableLayerGroups?: boolean;
  
  /**
   * Custom SVG icons to be made available in the icon layer.
   * These icons will be merged with the default icons fetched from CDN.
   * Each icon must have a unique `id` and a `mesh` describing its triangulated geometry.
   *
   * @example
   * ```
   * initApplicationConfig({
   *   customIcons: [
   *     {
   *       id: 'my-custom-marker',
   *       mesh: {
   *         cells: [[0, 1, 2], [2, 3, 0]],
   *         positions: [[0, 1, 0], [1, -1, 0], [-1, -1, 0], [0, 0, 0]]
   *       }
   *     }
   *   ]
   * });
   * ```
   */
  customIcons?: SvgIcon[];

  /**
   * URL to a remote JSON file containing custom SVG icons.
   * The JSON file should have the format: `{ "svgIcons": [{ id, mesh: { cells, positions } }, ...] }`
   * Icons from this URL will be merged with default CDN icons and inline `customIcons`.
   *
   * @example
   * ```
   * initApplicationConfig({
   *   customIconUrl: 'https://my-server.com/my-icons.json'
   * });
   * ```
   */
  customIconUrl?: string;
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
      getMapLib: () => import('maplibre-gl') as unknown as Promise<MapLibInstance>,
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

  cdnUrl: KEPLER_UNFOLDED_BUCKET,

  plugins: [],
  // The default table class is KeplerTable.
  // TODO include KeplerTable here when the circular dependency with @kepler.gl/table and @kepler.gl/utils are resolved.
  table: null,
  database: null,

  useArrowProgressiveLoading: true,
  showReleaseBanner: true,
  useOnFilteredItemsChange: false,

  // Raster Tile layer config
  enableRasterTileLayer: true,
  rasterServerUseLatestTitiler: true,
  rasterServerShowServerInput: true,
  rasterServerUrls: [], // TODO: provide a default free server or leave blank
  rasterServerSupportsElevation: true,
  rasterServerMaxRetries: 1,
  rasterServerRetryDelay: 10000,
  rasterServerServerErrorsToRetry: [503],
  rasterServerMaxPerServerRequests: 0,

  // WMS layer config
  enableWMSLayer: true,

  // Flow layer config
  enableFlowLayer: true,

  // Bitmap layer config
  enableBitmapLayer: true,

  showInlineTilesetExamples: true,

  // Image export config
  // Default to true for webpack builds, false for other build tools (e.g., Vite)
  escapeXhtmlForWebpack: isWebpackBuild(),

  maxPitch: 60,

  enableAnnotations: true,

  enableMapNavigationControl: true,

  enableSwipeMode: true,

  enableGlobeView: true,

  enableLayerGroups: true,

  customIcons: [],

  customIconUrl: ''
};

const applicationConfig: Required<KeplerApplicationConfig> = DEFAULT_APPLICATION_CONFIG;

export const getApplicationConfig = (): Required<KeplerApplicationConfig> => applicationConfig;

export function initApplicationConfig(appConfig: KeplerApplicationConfig = {}) {
  Object.assign(applicationConfig, appConfig);
}
