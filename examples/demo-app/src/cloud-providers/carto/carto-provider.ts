// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {OAuthApp} from '@carto/toolkit';
import Console from 'global/console';
import CartoIcon from './carto-icon';
import {Provider} from '@kepler.gl/cloud-providers';
import {createDataContainer} from '@kepler.gl/utils';
import {formatCsv} from '@kepler.gl/reducers';

const NAME = 'carto';
const DISPLAY_NAME = 'CARTO';
const NAMESPACE = 'keplergl';
const DOMAIN = 'carto.com';
const PRIVATE_STORAGE_ENABLED = true;
const SHARING_ENABLED = true;

export default class CartoProvider extends Provider {
  clientId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentMap: any;
  _folderLink: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _carto: any;

  constructor(clientId: string) {
    super({name: NAME, displayName: DISPLAY_NAME, icon: CartoIcon});

    this.clientId = clientId;
    this.thumbnail = {width: 300, height: 200};
    this.currentMap = null;

    this._folderLink = `https://{user}.${DOMAIN}/dashboard/maps/external`;

    // Initialize CARTO API
    this._carto = new OAuthApp(
      {
        authorization: `https://${DOMAIN}/oauth2`,
        clientID: clientId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scopes: 'schemas:c datasets:rw:*' as any
      } as any,
      {
        serverUrlTemplate: `https://{user}.${DOMAIN}/`,
        namespace: NAMESPACE
      } as any
    );

    this._carto.setClientID(clientId);
  }

  /**
   * The CARTO toolkit library takes care of the login process.
   */
  // @ts-expect-error base Provider.login() return type will be widened to Promise<CloudUser | void> in a future @kepler.gl/cloud-providers release
  async login(onCloudLoginSuccess?: (name: string) => void): Promise<void> {
    try {
      await this._carto.login().then(() => {
        onCloudLoginSuccess && onCloudLoginSuccess(this.name);
      });
    } catch (error) {
      this._manageErrors(error);
    }
  }

  async logout(onCloudLogoutSuccess?: () => void): Promise<void> {
    try {
      this._carto.oauth.clear();
      this._carto.oauth._carto.sync();
      onCloudLogoutSuccess && onCloudLogoutSuccess();
    } catch (error) {
      this._manageErrors(error);
    }
  }

  isEnabled(): boolean {
    return Boolean(this.clientId);
  }

  hasPrivateStorage(): boolean {
    return PRIVATE_STORAGE_ENABLED;
  }

  hasSharingUrl(): boolean {
    return SHARING_ENABLED;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadMap({mapData, options = {}}: {mapData: any; options?: any}): Promise<any> {
    try {
      const {isPublic = true, overwrite = true} = options;
      const {map: {config, datasets, info} = {} as any, thumbnail} = mapData;

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
  async getAccessToken(): Promise<string | null> {
    let accessToken = null;
    try {
      accessToken = this._carto.oauth.expired ? null : this._carto.oauth.token;
    } catch (error) {
      this._manageErrors(error, false);
    }

    return accessToken;
  }

  getUserName(): string {
    let username = null;
    try {
      username = this._carto.oauth.expired ? null : this._carto.username;
    } catch (error) {
      this._manageErrors(error, false);
    }

    return username || '';
  }

  /**
   * The CARTO cloud provider polls the created window internally to parse the URL
   * @param {*} location
   */
  getAccessTokenFromLocation(): void {
    return;
  }

  async getUser(): Promise<{name: string; abbreviated: string; email: string}> {
    return {
      name: this.getUserName(),
      abbreviated: '',
      email: ''
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async downloadMap(queryParams: any): Promise<any> {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const datasets = visualization.datasets.map((dataset: any) => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async listMaps(): Promise<any[]> {
    // TODO: Implement pagination using {type='all', pageOffset=0, pageSize=-1}
    try {
      await this._carto.login();
      const username = this.getUserName();
      const cs = await this._carto.getCustomStorage();

      const visualizations = await cs.getVisualizations();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let formattedVis: any[] = [];

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
      return [];
    }
  }

  getShareUrl(fullUrl = false): string {
    return this.getMapUrl(fullUrl) || '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // @ts-expect-error base Provider.getMapUrl() will accept `MapItemLoadParams | boolean` in a future @kepler.gl/cloud-providers release
  getMapUrl(fullUrl = true, mapParams: any = null): string {
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
    return '';
  }

  getManagementUrl(): string {
    return this._folderLink.replace('{user}', this._carto.username);
  }

  getCurrentVisualization(): {title: string; description: string} | null {
    return this.currentMap
      ? {title: this.currentMap.name, description: this.currentMap.description}
      : null;
  }

  // PRIVATE

  _getMapPermalinkFromParams(
    {mapId, owner, privateMap}: {mapId: string; owner: string; privateMap: boolean | string},
    fullURL = true
  ): string {
    const mapLink = this._composeURL({mapId, owner, privateMap});
    return fullURL
      ? `${window.location.protocol}//${window.location.host}/${mapLink}`
      : `/${mapLink}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _convertDataset({data: dataset}: {data: any}) {
    const {allData, fields, id} = dataset;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = fields.map((field: any) => ({
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

  // eslint-disable-next-line complexity, @typescript-eslint/no-explicit-any
  _manageErrors(error: any, throwException = true): void {
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

  _composeURL({
    mapId,
    owner,
    privateMap
  }: {
    mapId: string;
    owner: string;
    privateMap: boolean | string;
  }): string {
    return `demo/map/carto?mapId=${mapId}&owner=${owner}&privateMap=${privateMap}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _blobToBase64(blob: Blob): Promise<any> {
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
