// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* different option share same query type e.g. events,
and segments both use queryRunner */
import keyMirror from 'keymirror';

export const ASSETS_URL = 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/';
export const DATA_URL = 'https://raw.githubusercontent.com/keplergl/kepler.gl-data/master/';
export const MAP_URI = 'demo/map?mapUrl=';
/*
 * If you want to add more samples, feel free to edit the json file on github kepler.gl data repo
 */
export const MAP_CONFIG_URL = `${DATA_URL}samples.json?nocache=${new Date().getTime()}`;

/**
 * I know this is already defined in Kepler core but it should be defined here
 * because it belongs to the demo app
 * @type {string}
 */
export const KEPLER_GL_WEBSITE = 'http://kepler.gl/';

export const QUERY_TYPES = keyMirror({
  file: null,
  sample: null
});

export const QUERY_OPTIONS = keyMirror({
  csv: null,
  geojson: null
});

export const LOADING_METHODS = keyMirror({
  remote: null,
  sample: null
});

export const LOADING_SAMPLE_LIST_ERROR_MESSAGE = 'Not able to load sample gallery';
export const LOADING_SAMPLE_ERROR_MESSAGE = 'Not able to load sample';
export const CORS_LINK = 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS';

export const DEFAULT_FEATURE_FLAGS = {
  cloudStorage: true
};

export const CLOUD_PROVIDERS_CONFIGURATION = {
  MAPBOX_TOKEN: process.env.MapboxAccessToken, // eslint-disable-line
  DROPBOX_CLIENT_ID: process.env.DropboxClientId, // eslint-disable-line
  EXPORT_MAPBOX_TOKEN: process.env.MapboxExportToken, // eslint-disable-line
  CARTO_CLIENT_ID: process.env.CartoClientId, // eslint-disable-line
  FOURSQUARE_CLIENT_ID: process.env.FoursquareClientId, // eslint-disable-line
  FOURSQUARE_DOMAIN: process.env.FoursquareDomain, // eslint-disable-line
  FOURSQUARE_API_URL: process.env.FoursquareAPIURL, // eslint-disable-line
  FOURSQUARE_USER_MAPS_URL: process.env.FoursquareUserMapsURL // eslint-disable-line
};
