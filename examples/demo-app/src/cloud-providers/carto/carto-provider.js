// Copyright (c) 2022 Uber Technologies, Inc.
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

import {OAuthApp} from '@carto/toolkit';
import Console from 'global/console';
import CartoIcon from './carto-icon';
import {Provider} from 'kepler.gl/cloud-providers';
import {createDataContainer, formatCsv} from 'kepler.gl/reducers/table-utils';

const NAME = 'carto';
const DISPLAY_NAME = 'CARTO';
const NAMESPACE = 'keplergl';
const DOMAIN = 'carto.com';
const PRIVATE_STORAGE_ENABLED = true;
const SHARING_ENABLED = true;

export default class CartoProvider extends Provider {
  constructor(clientId) {
    super({name: NAME, displayName: DISPLAY_NAME, icon: CartoIcon});

    this.clientId = clientId;
    this.thumbnail = {width: 300, height: 200};
    this.currentMap = null;

    this._folderLink = `https://{user}.${DOMAIN}/dashboard/maps/external`;

    // Initialize CARTO API
    this._carto = new OAuthApp(
      {
        authorization: `https://${DOMAIN}/oauth2`,
        scopes: 'schemas:c datasets:rw:*'
      },
      {
        serverUrlTemplate: `https://{user}.${DOMAIN}/`,
        namespace: NAMESPACE
      }
    );

    this._carto.setClientID(clientId);
  }

  /**
   * The CARTO toolkit library takes care of the login process.
   */
  login(onCloudLoginSuccess) {
    try {
      this._carto.login().then(() => {
        onCloudLoginSuccess && onCloudLoginSuccess(this.name);
      });
    } catch (error) {
      this._manageErrors(error);
    }
  }

  logout(onCloudLogoutSuccess) {
    try {
      this._carto.oauth.clear();
      this._carto.oauth._carto.sync();
      onCloudLogoutSuccess();
    } catch (error) {
      this._manageErrors(error);
    }
  }

  isEnabled() {
    return this.clientId !== null;
  }

  hasPrivateStorage() {
    return PRIVATE_STORAGE_ENABLED;
  }

  hasSharingUrl() {
    return SHARING_ENABLED;
  }

  async uploadMap({mapData = {}, options = {}}) {
    try {
      const {isPublic = true, overwrite = true} = options;
      const {map: {config, datasets, info} = {}, thumbnail} = mapData;

      const cartoDatasets = datasets.map(this._convertDataset);

      const cs = await this._carto.getCustomStorage();

      const {title, description} = info;
      const name = title;

      const thumbnailBase64 =
        mapData && thumbnail ? await this._blobToBase64(mapData.thumbnail) : null;

      let result;
      if (overwrite) {
        result = await cs.updateVisualization(
          {
            id: this.currentMap.id,
            name,
            description,
            thumbnail: thumbnailBase64,
            config: JSON.stringify(config),
            isprivate: this.currentMap.isprivate
          },
          cartoDatasets
        );
      } else {
        // TODO: Ask for changing current shared map generation because of being too oriented to file based clouds
        // Check public name generation and replace
        const regex = /(?:^keplergl_)([a-z0-9]+)(?:.json$)/;
        const capturedName = name.match(regex);
        const visName = capturedName ? `sharedmap_${capturedName[1]}` : name;

        result = await cs.createVisualization(
          {
            name: visName,
            description,
            thumbnail: thumbnailBase64,
            config: JSON.stringify(config),
            isprivate: !isPublic
          },
          cartoDatasets,
          true
        );
      }

      if (result) {
        this.currentMap = result;
      }

      return {
        shareUrl: this._getMapPermalinkFromParams(
          {
            mapId: result.id,
            owner: this._carto.username,
            privateMap: !isPublic
          },
          true
        ),
        folderLink: this._folderLink.replace('{user}', this._carto.username)
      };
    } catch (error) {
      this._manageErrors(error);
    }
  }

  /**
   * Returns the access token. If it has expired returns null. The toolkit library loads it
   * from localStorage automatically
   */
  getAccessToken() {
    let accessToken = null;
    try {
      accessToken = this._carto.oauth.expired ? null : this._carto.oauth.token;
    } catch (error) {
      this._manageErrors(error, false);
    }

    return accessToken;
  }

  getUserName() {
    let username = null;
    try {
      username = this._carto.oauth.expired ? null : this._carto.username;
    } catch (error) {
      this._manageErrors(error, false);
    }

    return username;
  }

  /**
   * The CARTO cloud provider polls the created window internally to parse the URL
   * @param {*} location
   */
  getAccessTokenFromLocation(location) {
    return;
  }

  async downloadMap(queryParams) {
    try {
      const {owner: username, mapId, privateMap} = queryParams;

      if (!username || !mapId) {
        return;
      }

      let visualization;

      if (privateMap.trim().toLowerCase() === 'true') {
        await this._carto.login();
        const currentUsername = this.getUserName();
        if (currentUsername && currentUsername === username) {
          const cs = await this._carto.getCustomStorage();
          visualization = await cs.getVisualization(mapId);
        }
      } else {
        visualization = await this._carto.PublicStorageReader.getVisualization(username, mapId);
      }

      if (!visualization) {
        throw new Error(`Can't find map with ID: ${mapId}`);
      }

      // These are the options required for the action. For now, all datasets that come from CARTO are CSV
      const datasets = visualization.datasets.map(dataset => {
        const datasetId = dataset.name;

        return {
          info: {
            id: datasetId,
            label: datasetId,
            description: dataset.description,
            dataUrl: '',
            configUrl: '',
            panelDisabled: true
          },
          data: dataset.file
        };
      });

      // const datasets = visualization.datasets.map(dataset => dataset.file);

      this.currentMap = visualization.vis;

      return {
        map: {
          datasets,
          config: visualization.vis.config,
          info: {title: visualization.vis.name, description: visualization.vis.description}
        },
        format: 'csv'
      };
    } catch (error) {
      this._manageErrors(error);
    }
  }

  async listMaps() {
    // TODO: Implement pagination using {type='all', pageOffset=0, pageSize=-1}
    try {
      await this._carto.login();
      const username = this.getUserName();
      const cs = await this._carto.getCustomStorage();

      const visualizations = await cs.getVisualizations();
      let formattedVis = [];

      // Format visualization object
      for (const vis of visualizations) {
        formattedVis.push({
          id: vis.id,
          title: vis.name,
          description: vis.description,
          privateMap: vis.isprivate,
          thumbnail: vis.thumbnail === 'undefined' ? null : vis.thumbnail,
          lastModification: new Date(Date.parse(vis.lastmodified)),
          loadParams: {
            owner: username,
            mapId: vis.id,
            privateMap: vis.isprivate.toString()
          }
        });
      }

      formattedVis = formattedVis.sort((a, b) => b.lastModification - a.lastModification);

      return formattedVis;
    } catch (error) {
      this._manageErrors(error);
    }
  }

  getShareUrl(fullUrl = false) {
    return this.getMapUrl(fullUrl);
  }

  getMapUrl(fullUrl = true, mapParams = null) {
    if (mapParams) {
      return this._getMapPermalinkFromParams(mapParams, fullUrl);
    } else if (this.currentMap) {
      return this._getMapPermalinkFromParams(
        {
          mapId: this.currentMap.id,
          owner: this.getUserName(),
          privateMap: this.currentMap.isPrivate
        },
        fullUrl
      );
    }
  }

  getManagementUrl() {
    return this._folderLink.replace('{user}', this._carto.username);
  }

  getCurrentVisualization() {
    return this.currentMap
      ? {title: this.currentMap.name, description: this.currentMap.description}
      : null;
  }

  // PRIVATE

  _getMapPermalinkFromParams({mapId, owner, privateMap}, fullURL = true) {
    const mapLink = this._composeURL({mapId, owner, privateMap});
    return fullURL
      ? `${window.location.protocol}//${window.location.host}/${mapLink}`
      : `/${mapLink}`;
  }

  _convertDataset({data: dataset}) {
    const {allData, fields, id} = dataset;
    const columns = fields.map(field => ({
      name: field.name,
      type: field.type
    }));

    const dataContainer = createDataContainer([...allData]);

    const file = formatCsv(dataContainer, fields);

    return {
      name: id,
      columns,
      file
    };
  }

  // eslint-disable-next-line complexity
  _manageErrors(error, throwException = true) {
    let message;
    if (error && error.message) {
      message = error.message;

      switch (error.message) {
        case 'No client ID has been specified':
          Console.error('No ClientID set for CARTO provider');
          break;
        case 'Cannot set the client ID more than once':
          Console.error('CARTO provider already initialized');
          break;
        case (error.message.match(/relation "[a-zA-Z0-9_]+" does not exist/) || {}).input:
          Console.error('CARTO custom storage is not properly initialized');
          message = 'Custom storage is not properly initialized';
          break;
        case (
          error.message.match(/Failed to copy to keplergl_[a-zA-Z0-9_]+: Too many retries/) || {}
        ).input:
          Console.error('CARTO Rate limit exceeded');
          message =
            "Failed to upload. You've exceeded the number of datasets allowed with your plan. Consider upgrading your plan.";
          break;
        case (error.message.match(/[a-zA-Z0-9_\s:]+: DB Quota exceeded/) || {}).input:
          Console.error('CARTO DB Quota exceeded');
          message =
            "Failed to upload. You've exceeded your account's disk storage limit. Consider upgrading your plan.";
          break;
        default:
          Console.error(`CARTO provider: ${message}`);
      }
    } else {
      message = 'General error in CARTO provider';
      Console.error(message);
    }

    // Use 'CARTO' as error code in order to show provider in notifications
    if (throwException) {
      throw new Error(message);
    }
  }

  _composeURL({mapId, owner, privateMap}) {
    return `demo/map/carto?mapId=${mapId}&owner=${owner}&privateMap=${privateMap}`;
  }

  _blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!reader.error) {
          resolve(reader.result);
        } else {
          reject(reader.error);
        }
      };
      reader.readAsDataURL(blob);
    });
  }
}
