#!/usr/bin/env node

// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
 *   KEPLER_CONFIG_HREF   browser fetch URL; injected into index.html
 */
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = process.env.KEPLER_CONFIG_PATH || path.join(__dirname, 'dist', 'config.json');
// Anchored to the directory `entrypoint.sh` serves, not to CONFIG_PATH: a custom
// KEPLER_CONFIG_PATH does not move the served index.html.
const INDEX_PATH = process.env.KEPLER_INDEX_PATH || path.join(__dirname, 'dist', 'index.html');
const CONFIG_HREF_SNIPPET_RE = /\s*<script>window\.__KEPLER_CONFIG_HREF__=.*?<\/script>/g;

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
      if (!changed) {
        // Nothing to persist (no env overrides), so a read-only root filesystem is
        // fine: the client treats a missing config.json as a no-op.
        console.warn(
          `[kepler-entrypoint] Could not create ${CONFIG_PATH} (${err.message}). ` +
            'No KEPLER_* overrides were set; serving with build-time defaults.'
        );
        return;
      }
      console.error(
        `[kepler-entrypoint] Could not write ${CONFIG_PATH} (${err.message}). ` +
          'KEPLER_* env overrides were set but could not be written (read-only mount?). ' +
          'Use a writable volume, or drop the env overrides and rely on the mounted file.'
      );
      process.exit(1);
    }
  }
}

function getConfigHrefFromEnv() {
  const href = process.env.KEPLER_CONFIG_HREF;
  return typeof href === 'string' && href.trim() ? href.trim() : '';
}

/**
 * `JSON.stringify` leaves `<` and the JS line separators as-is, so a value containing
 * `</script>` would close this inline script and corrupt index.html for every client.
 */
function toInlineScriptLiteral(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function injectConfigHrefSnippet(html, href) {
  const snippet = `<script>window.__KEPLER_CONFIG_HREF__=${toInlineScriptLiteral(href)};</script>`;
  const withoutPrev = html.replace(CONFIG_HREF_SNIPPET_RE, '');
  if (!/<head[^>]*>/i.test(withoutPrev)) {
    throw new Error('index.html has no <head> to inject config href');
  }
  return withoutPrev.replace(/<head([^>]*)>/i, `<head$1>\n    ${snippet}`);
}

function injectConfigHref() {
  const href = getConfigHrefFromEnv();
  if (!href) {
    return;
  }

  let html;
  try {
    html = fs.readFileSync(INDEX_PATH, 'utf8');
  } catch (err) {
    console.error(
      `[kepler-entrypoint] KEPLER_CONFIG_HREF is set but could not read ${INDEX_PATH} (${err.message}).`
    );
    process.exit(1);
  }

  let next;
  try {
    next = injectConfigHrefSnippet(html, href);
  } catch (err) {
    console.error(`[kepler-entrypoint] ${err.message}.`);
    process.exit(1);
  }

  try {
    fs.writeFileSync(INDEX_PATH, next, 'utf8');
    console.log(`[kepler-entrypoint] Injected KEPLER_CONFIG_HREF into ${INDEX_PATH}`);
  } catch (err) {
    console.error(
      `[kepler-entrypoint] Could not write ${INDEX_PATH} (${err.message}). ` +
        'KEPLER_CONFIG_HREF requires a writable index.html.'
    );
    process.exit(1);
  }
}

mergeRuntimeConfig();
injectConfigHref();
