// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {initApplicationConfig} from '@kepler.gl/utils';

import {CLOUD_PROVIDERS_CONFIGURATION, setMapConfigUrl} from '../constants/default-settings';

/**
 * Demo-app-only runtime config loaded from `/config.json` (volume mount or
 * Docker entrypoint). Kept separate from library {@link KeplerApplicationConfig}
 * so tokens, sample gallery URL, boot map, and branding stay out of the core type.
 *
 * @typedef {object} DemoAppRuntimeConfig
 * @property {object} [credentials]
 * @property {string} [credentials.MapboxAccessToken]
 * @property {string} [credentials.MapboxExportToken]
 * @property {string} [credentials.DropboxClientId]
 * @property {string} [credentials.CartoClientId]
 * @property {string} [credentials.FoursquareClientId]
 * @property {string} [credentials.FoursquareDomain]
 * @property {string} [credentials.FoursquareAPIURL]
 * @property {string} [credentials.FoursquareUserMapsURL]
 * @property {string} [credentials.GoogleDriveClientId]
 * @property {import('@kepler.gl/utils').KeplerApplicationConfig} [applicationConfig]
 * @property {{mapStyles?: object, styleType?: string}} [mapStyle]
 * @property {Array<object>} [mapStyles] KeplerGl prop form (array of styles)
 * @property {boolean} [mapStylesReplaceDefault]
 * @property {string} [mapConfigUrl] Sample gallery `samples.json` URL
 * @property {string} [mapUrl] Map JSON to load on boot when `?mapUrl=` is absent
 * @property {string} [pageTitle]
 */

/** @type {DemoAppRuntimeConfig} */
let runtimeConfig = {};

const CREDENTIAL_TO_CLOUD_KEY = {
  MapboxAccessToken: 'MAPBOX_TOKEN',
  MapboxExportToken: 'EXPORT_MAPBOX_TOKEN',
  DropboxClientId: 'DROPBOX_CLIENT_ID',
  CartoClientId: 'CARTO_CLIENT_ID',
  FoursquareClientId: 'FOURSQUARE_CLIENT_ID',
  FoursquareDomain: 'FOURSQUARE_DOMAIN',
  FoursquareAPIURL: 'FOURSQUARE_API_URL',
  FoursquareUserMapsURL: 'FOURSQUARE_USER_MAPS_URL',
  GoogleDriveClientId: 'GOOGLE_DRIVE_CLIENT_ID'
};

/**
 * Built-in demo-app applicationConfig defaults (previously set in reducers/index.js).
 * Applied on first import so kepler.gl.com (website store/app) keeps the same
 * icons/flags, and again from {@link loadAndApplyRuntimeConfig} before any
 * `/config.json` overlay so Docker/source builds can still override them.
 *
 * To enable DuckDB in a source build, also register the plugin here (or via a custom
 * bootstrap), e.g.:
 *   initApplicationConfig({
 *     plugins: [keplerGlDuckdbPlugin],
 *     table: KeplerGlDuckDbTable,
 *     database: new DuckDBWasmAdapter(...),
 *     useArrowProgressiveLoading: false
 *   });
 * Plugins cannot be loaded from JSON alone — they must be bundled.
 */
export function applyDemoApplicationDefaults() {
  initApplicationConfig({
    enableA5Layer: true,
    enableGeohashLayer: true,
    customIcons: [
      {
        id: 'custom-star',
        mesh: {
          cells: [
            [5, 1, 0],
            [5, 2, 1],
            [5, 3, 2],
            [5, 4, 3],
            [5, 0, 4]
          ],
          positions: [
            [0, 1, 0],
            [0.95, 0.31, 0],
            [0.59, -0.81, 0],
            [-0.59, -0.81, 0],
            [-0.95, 0.31, 0],
            [0, 0, 0]
          ]
        }
      }
    ],
    customIconUrl:
      'https://raw.githubusercontent.com/keplergl/kepler.gl-data/refs/heads/master/layers/icon/custom-icons.json'
  });
}

// Website imports demo-app reducers/app without going through demo-app main.js.
applyDemoApplicationDefaults();

/**
 * @param {DemoAppRuntimeConfig['credentials']} credentials
 */
export function applyCredentials(credentials = {}) {
  const safeCredentials =
    credentials && typeof credentials === 'object' && !Array.isArray(credentials)
      ? credentials
      : {};

  Object.entries(CREDENTIAL_TO_CLOUD_KEY).forEach(([fromKey, toKey]) => {
    const value = safeCredentials[fromKey];
    if (typeof value === 'string' && value.length > 0) {
      CLOUD_PROVIDERS_CONFIGURATION[toKey] = value;
    }
  });
}

/**
 * @param {DemoAppRuntimeConfig} config
 */
export function applyRuntimeConfig(config = {}) {
  runtimeConfig = config;

  applyCredentials(config.credentials);

  if (config.applicationConfig && typeof config.applicationConfig === 'object') {
    initApplicationConfig(config.applicationConfig);
  }

  if (typeof config.mapConfigUrl === 'string' && config.mapConfigUrl.length > 0) {
    setMapConfigUrl(config.mapConfigUrl);
  }

  if (typeof config.pageTitle === 'string' && config.pageTitle.length > 0) {
    document.title = config.pageTitle;
  }
}

/** @returns {DemoAppRuntimeConfig} */
export function getRuntimeConfig() {
  return runtimeConfig;
}

/**
 * Fetch `/config.json` when present. Missing or invalid files are a no-op so
 * local source builds and static hosting without a mount keep working.
 * @returns {Promise<DemoAppRuntimeConfig>}
 */
export async function loadRuntimeConfigJson() {
  try {
    const response = await fetch('/config.json', {cache: 'no-store'});
    if (!response.ok) {
      return {};
    }
    const json = await response.json();
    return json && typeof json === 'object' ? json : {};
  } catch {
    return {};
  }
}

/**
 * Apply demo defaults, then overlay `/config.json` when available.
 * Must run before dynamic import of the Redux store so reducer initial state
 * and cloud providers see runtime credentials / mapStyle.
 * @returns {Promise<DemoAppRuntimeConfig>}
 */
export async function loadAndApplyRuntimeConfig() {
  applyDemoApplicationDefaults();
  const remote = await loadRuntimeConfigJson();
  applyRuntimeConfig(remote);
  return remote;
}
