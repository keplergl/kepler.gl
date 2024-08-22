// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CLOUD_PROVIDERS_CONFIGURATION} from '../constants/default-settings';

import DropboxProvider from './dropbox/dropbox-provider';
import CartoProvider from './carto/carto-provider';
import FoursquareProvider from './foursquare/foursquare-provider';

const {
  DROPBOX_CLIENT_ID,
  CARTO_CLIENT_ID,
  FOURSQUARE_CLIENT_ID,
  FOURSQUARE_DOMAIN,
  FOURSQUARE_API_URL,
  FOURSQUARE_USER_MAPS_URL
} = CLOUD_PROVIDERS_CONFIGURATION;

const DROPBOX_CLIENT_NAME = 'Kepler.gl Demo App';

export const DEFAULT_CLOUD_PROVIDER = 'dropbox';

export const CLOUD_PROVIDERS = [
  new FoursquareProvider({
    clientId: FOURSQUARE_CLIENT_ID,
    authDomain: FOURSQUARE_DOMAIN,
    apiURL: FOURSQUARE_API_URL,
    userMapsURL: FOURSQUARE_USER_MAPS_URL
  }),
  new DropboxProvider(DROPBOX_CLIENT_ID, DROPBOX_CLIENT_NAME),
  new CartoProvider(CARTO_CLIENT_ID)
];

export function getCloudProvider(providerName) {
  const cloudProvider = CLOUD_PROVIDERS.find(provider => provider.name === providerName);
  if (!cloudProvider) {
    throw new Error(`Unknown cloud provider ${providerName}`);
  }
  return cloudProvider;
}
