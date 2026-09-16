#!/usr/bin/env node
/**
 * Merge KEPLER_* environment variables into dist/config.json before serve.
 * Existing config.json (e.g. volume mount) wins for keys not set via env;
 * env overrides matching keys.
 *
 * Supported env vars:
 *   KEPLER_MAPBOX_ACCESS_TOKEN
 *   KEPLER_MAPBOX_EXPORT_TOKEN
 *   KEPLER_DROPBOX_CLIENT_ID
 *   KEPLER_CARTO_CLIENT_ID
 *   KEPLER_FOURSQUARE_CLIENT_ID
 *   KEPLER_FOURSQUARE_DOMAIN
 *   KEPLER_FOURSQUARE_API_URL
 *   KEPLER_FOURSQUARE_USER_MAPS_URL
 *   KEPLER_GOOGLE_DRIVE_CLIENT_ID
 *   KEPLER_MAP_CONFIG_URL
 *   KEPLER_MAP_URL
 *   KEPLER_PAGE_TITLE
 */
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = process.env.KEPLER_CONFIG_PATH || path.join(__dirname, 'dist', 'config.json');

const ENV_CREDENTIALS = {
  KEPLER_MAPBOX_ACCESS_TOKEN: 'MapboxAccessToken',
  KEPLER_MAPBOX_EXPORT_TOKEN: 'MapboxExportToken',
  KEPLER_DROPBOX_CLIENT_ID: 'DropboxClientId',
  KEPLER_CARTO_CLIENT_ID: 'CartoClientId',
  KEPLER_FOURSQUARE_CLIENT_ID: 'FoursquareClientId',
  KEPLER_FOURSQUARE_DOMAIN: 'FoursquareDomain',
  KEPLER_FOURSQUARE_API_URL: 'FoursquareAPIURL',
  KEPLER_FOURSQUARE_USER_MAPS_URL: 'FoursquareUserMapsURL',
  KEPLER_GOOGLE_DRIVE_CLIENT_ID: 'GoogleDriveClientId'
};

const ENV_TOP_LEVEL = {
  KEPLER_MAP_CONFIG_URL: 'mapConfigUrl',
  KEPLER_MAP_URL: 'mapUrl',
  KEPLER_PAGE_TITLE: 'pageTitle'
};

function readExistingConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return {};
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.warn(`[kepler-entrypoint] Could not read ${CONFIG_PATH}: ${err.message}`);
    return {};
  }
}

function mergeRuntimeConfig() {
  const config = readExistingConfig();
  config.credentials =
    config.credentials && typeof config.credentials === 'object' ? config.credentials : {};

  let changed = false;

  for (const [envKey, credKey] of Object.entries(ENV_CREDENTIALS)) {
    const value = process.env[envKey];
    if (typeof value === 'string' && value.length > 0) {
      config.credentials[credKey] = value;
      changed = true;
    }
  }

  for (const [envKey, configKey] of Object.entries(ENV_TOP_LEVEL)) {
    const value = process.env[envKey];
    if (typeof value === 'string' && value.length > 0) {
      config[configKey] = value;
      changed = true;
    }
  }

  // Always write when env set, or when no file exists yet (so volume-less deploys get {}).
  if (changed || !fs.existsSync(CONFIG_PATH)) {
    try {
      fs.mkdirSync(path.dirname(CONFIG_PATH), {recursive: true});
      fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
      console.log(`[kepler-entrypoint] Wrote runtime config to ${CONFIG_PATH}`);
    } catch (err) {
      // Read-only volume mounts are expected; keep serving the mounted file.
      console.warn(
        `[kepler-entrypoint] Could not write ${CONFIG_PATH} (${err.message}). ` +
          'Using existing config as-is; KEPLER_* env overrides were not applied.'
      );
    }
  }
}

mergeRuntimeConfig();
