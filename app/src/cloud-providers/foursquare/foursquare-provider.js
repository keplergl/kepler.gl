// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import FSQIcon from './foursquare-icon';
import {Provider, KEPLER_FORMAT} from '@kepler.gl/cloud-providers';
import {Auth0Client} from '@auth0/auth0-spa-js';

const NAME = 'foursquare';
const DISPLAY_NAME = 'Foursquare';
const APP_NAME = 'Kepler.gl';

const FOURSQUARE_PRIVATE_STORAGE_ENABLED = true;
const FOURSQUARE_AUTH_AUDIENCE = 'https://foursquare.com/api/';
const FOURSQUARE_AUTH_SCOPE = 'openid profile email';

// Foursquare stores kepler maps using kepler.gl-raw as ImportSource
const FOURSQUARE_KEPLER_GL_IMPORT_SOURCE = 'kepler.gl-raw';

/**
 * Converts a FSQ map model to cloud provider map item
 * @param model Foursquare Map
 * @return {MapItem} Map
 */
function convertFSQModelToMapItem(model, baseApi) {
  return {
    id: model.id,
    title: model.name,
    thumbnail: model.previewReadPath,
    updatedAt: model.updatedAt,
    description: model.description,
    loadParams: {
      id: model.id,
      path: `${baseApi}/${model.id}`
    }
  };
}

function extractMapFromFSQResponse(response) {
  const {
    latestState: {data}
  } = response;
  return data;
}

export default class FoursquareProvider extends Provider {
  constructor({clientId, authDomain, apiURL, userMapsURL}) {
    super({name: NAME, displayName: DISPLAY_NAME, icon: FSQIcon});
    this.icon = FSQIcon;
    this.appName = APP_NAME;
    this.apiURL = apiURL;

    this._auth0 = new Auth0Client({
      domain: authDomain,
      clientId,
      scope: FOURSQUARE_AUTH_SCOPE,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: FOURSQUARE_AUTH_AUDIENCE
      },
      cacheLocation: 'localstorage'
    });

    // the domain needs to be passed as input param
    this._folderLink = userMapsURL;
    this.isNew = true;
  }

  hasPrivateStorage() {
    return FOURSQUARE_PRIVATE_STORAGE_ENABLED;
  }

  async getUser() {
    return this._auth0.getUser();
  }

  async login() {
    return this._auth0.loginWithPopup();
  }

  async logout() {
    return this._auth0.logout({
      // this make sure after logging out the sdk will not redirect the user
      openUrl: false
    });
  }

  async uploadMap({mapData, options = {}}) {
    // TODO: handle replace
    const mode = options.overwrite ? 'overwrite' : 'add';
    const method = options.overwrite ? 'PUT' : 'POST';
    const {map, thumbnail} = mapData;

    const {title = '', description = '', id} = map.info;
    const headers = await this.getHeaders();
    const payload = {
      name: title,
      description,
      importSource: FOURSQUARE_KEPLER_GL_IMPORT_SOURCE,
      latestState: {
        data: map
      }
    };

    const mapResponse = await fetch(
      `${this.apiURL}/v1/maps${mode === 'overwrite' ? `/${id}` : ''}`,
      {
        method,
        headers,
        body: JSON.stringify(payload)
      }
    );

    const createMap = await mapResponse.json();

    await fetch(`${this.apiURL}/v1/maps/${createMap.id}/thumbnail`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'image/png'
      },
      body: thumbnail
    });

    return map;
  }

  async listMaps() {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.apiURL}/v1/maps?importSource=${FOURSQUARE_KEPLER_GL_IMPORT_SOURCE}`,
      {
        method: 'GET',
        mode: 'cors',
        headers
      }
    );
    const data = await response.json();
    return data.items.map(map => convertFSQModelToMapItem(map, `${this.apiURL}/v1/maps`));
  }

  async downloadMap(loadParams) {
    const {id} = loadParams;
    if (!id) {
      return Promise.reject('No Map is was provider as part of loadParams');
    }
    const headers = await this.getHeaders();

    const response = await fetch(`${this.apiURL}/v1/maps/${id}`, {
      method: 'GET',
      headers
    });

    const map = await response.json();

    return Promise.resolve({
      map: extractMapFromFSQResponse(map),
      format: KEPLER_FORMAT
    });
  }

  getMapUrl(loadParams) {
    const {id} = loadParams;
    return `${this.apiURL}/v1/maps/${id}`;
  }

  getManagementUrl() {
    return this._folderLink;
  }

  async getAccessToken() {
    return this._auth0.getTokenSilently();
  }

  async getHeaders() {
    const accessToken = await this.getAccessToken();
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }
}
