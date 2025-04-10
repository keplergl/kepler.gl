// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import FSQIcon from './foursquare-icon';
import {Provider, KEPLER_FORMAT} from '@kepler.gl/cloud-providers';
import {Auth0Client} from '@auth0/auth0-spa-js';

const NAME = 'foursquare';
const DISPLAY_NAME = 'Foursquare';
const STORAGE_MESSAGE = 'modal.loadStorageMap.foursquareStorageMessage';

const APP_NAME = 'Kepler.gl';

const FOURSQUARE_PRIVATE_STORAGE_ENABLED = true;
const FOURSQUARE_SHARING_ENABLED = false;
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

/**
 * Custom Auth0 popup window to change window height to fit FSQ auth window.
 */
export const openPopup = url => {
  const width = 400;
  const height = 765;
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;

  return window.open(
    url,
    'auth0:authorize:popup',
    `left=${left},top=${top},width=${width},height=${height},resizable,scrollbars=yes,status=1`
  );
};

function extractMapFromFSQResponse(response) {
  const {
    latestState: {data}
  } = response;
  return data;
}

export default class FoursquareProvider extends Provider {
  constructor({clientId, authDomain, apiURL, userMapsURL}) {
    super({name: NAME, displayName: DISPLAY_NAME, storageMessage: STORAGE_MESSAGE, icon: FSQIcon});
    this.icon = FSQIcon;
    this.appName = APP_NAME;
    this.apiURL = apiURL;

    this._auth0 = new Auth0Client({
      domain: authDomain,
      clientId,
      scope: FOURSQUARE_AUTH_SCOPE,
      authorizationParams: {
        prompt: 'login',
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

  hasSharingUrl() {
    return FOURSQUARE_SHARING_ENABLED;
  }

  async getUser() {
    return this._auth0.getUser();
  }

  async login() {
    return this._auth0.loginWithPopup(undefined, {popup: openPopup()});
  }

  async logout() {
    return this._auth0.logout({
      // this make sure after logging out the sdk will not redirect the user
      openUrl: false
    });
  }

  async uploadMap({mapData, options = {}}) {
    const method = options.overwrite ? 'PUT' : 'POST';
    const {map, thumbnail} = mapData;

    const {title = '', description = '', loadParams} = map.info;

    const mapIdToOverwrite = options.mapIdToOverwrite || loadParams?.id;
    if (options.overwrite && !mapIdToOverwrite) {
      throw new Error('Foursquare storage provider: no map id to overwrite');
    }

    const headers = await this.getHeaders();
    const payload = {
      name: title,
      description,
      importSource: FOURSQUARE_KEPLER_GL_IMPORT_SOURCE,
      latestState: {
        data: map
      }
    };

    // To overwrite map.latestState we have to fetch the map first
    if (options.overwrite) {
      const response = await fetch(`${this.apiURL}/v1/maps/${mapIdToOverwrite}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      payload.latestState = data.latestState;
      payload.latestState.data = map;
    }

    const mapResponse = await fetch(
      `${this.apiURL}/v1/maps${options.overwrite ? `/${mapIdToOverwrite}` : ''}`,
      {
        method,
        headers,
        body: JSON.stringify(payload)
      }
    );

    const createdMap = await mapResponse.json();

    if (!options.overwrite) {
      await fetch(`${this.apiURL}/v1/maps/${createdMap.id}/thumbnail`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'image/png'
        },
        body: thumbnail
      });
    }

    // pass through fsq map id
    const newMapData = extractMapFromFSQResponse(createdMap);
    return {...newMapData, info: {...newMapData.info, id: createdMap.id}};
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
    return (data?.items || []).map(map => convertFSQModelToMapItem(map, `${this.apiURL}/v1/maps`));
  }

  async downloadMap(loadParams) {
    let {id, path} = loadParams;
    if (!id) {
      // try to get map id from foursquare map path
      if (typeof path === 'string') {
        const pathId = /((\w{4,12}-?)){5}/.exec(path)[0];
        if (pathId) {
          id = pathId;
        }
      }
    }

    if (!id) {
      return Promise.reject('No Map id was provider as part of loadParams');
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
    return id ? `${this.apiURL}/v1/maps/${id}` : null;
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
