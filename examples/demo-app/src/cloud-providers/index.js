// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
