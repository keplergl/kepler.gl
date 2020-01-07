import {OAuthApp} from '@carto/toolkit';
import CartoIcon from '../components/icons/carto-icon';
import {formatCsv} from 'processors/data-processor';
const NAME = 'carto';
const NAMESPACE = 'keplergl';
const PRIVATE_STORAGE_ENABLED = true;

export default class CartoProvider {
  constructor(clientId){
    this.name = NAME;
    this.clientId = clientId;
    this.icon = CartoIcon;
    this.currentMap = null;

    // Initialize CARTO API
    this._carto = new OAuthApp({
      scopes: 'schemas:c'
    }, {
      namespace: NAMESPACE
    });

    this._carto.setClientID(clientId);
  }

  /**
   * The CARTO toolkit library takes care of the login process.
   */
  login(onCloudLoginSuccess) {
    try {
      this._carto.login().then(() => {
        onCloudLoginSuccess(this.name);
      });
    } catch (error) {
      this._manageErrors(error);
    }
  }

  logout(onCloudLogoutSuccess) {
    this._carto.oauth.clear();
    this._carto.oauth._carto.sync();
    onCloudLogoutSuccess();
  };

  hasPrivateStorage() {
    return PRIVATE_STORAGE_ENABLED;
  }

  async uploadFile({blob, name, description, isPublic = true}) {
    const payload = JSON.parse(await new Response(blob).text());

    const { config, datasets } = payload;

    const cartoDatasets = datasets.map(this._convertDataset);

    const cs = await this._carto.getCustomStorage();

    let result;
    if (this.currentMap && this.currentMap.name === name) {
      result = await cs.updateVisualization({
        id: this.currentMap.id,
        name,
        description,
        config: JSON.stringify(config),
        isPrivate: this.currentMap.isPrivate
      }, cartoDatasets)
    } else {
      result = await cs.createVisualization({
        name,
        description,
        config: JSON.stringify(config),
        isPrivate: !isPublic
      }, cartoDatasets, true);
    }

    if (result) {
      this.currentMap = result;
    }

    return ({
      url: `demo/map/carto?mapId=${result.id}&owner=${this._carto.username}&privateMap=${!isPublic}`
    });
  }

  /**
   * The CARTO cloud provider sets by the default the privacity to public
   * @param {*} metadata
   */
  shareFile(metadata) {
    return;
  }

  /**
   * Returns the access token. If it has expired returns null. The toolkit library loads it
   * from localStorage automatically
   */
  getAccessToken() {
    try {
      return this._carto.oauth.expired ? null : this._carto.oauth.token;
    } catch (error) {
      this._manageErrors(error);
    }
  }

  getUserName(){
    try {
      return this._carto.oauth.expired ? null : this._carto.username;
    } catch (error) {
      this._manageErrors(error);
    }
  }

  /**
   * The CARTO cloud provider polls the created window internally to parse the URL
   * @param {*} location
   */
  getAccessTokenFromLocation(location) {
    return;
  }

  async loadMap(queryParams) {
    const { owner: username, mapId, privateMap } = queryParams;

    if (!username || !mapId) {
      return;
    }

    let visualization;

    if (privateMap.trim().toLowerCase() === 'true') {
      await this._carto.login();
      const currentUsername = this.getUserName();
      if (currentUsername && currentUsername===username) {
        const cs = await this._carto.getCustomStorage();
        visualization = await cs.getVisualization(mapId);
      }
    } else {
      visualization = await this._carto.PublicStorageReader.getVisualization(username, mapId);
    }

    if (!visualization) {
      throw {target: {status: 404, responseText: `Can't find map with ID: ${mapId}`}};
    }

    // These are the options required for the action. For now, all datasets that come from CARTO are CSV
    const options = visualization.datasets.map((dataset) => {
      const datasetId = dataset.name;

      return {
        id: datasetId,
        label: datasetId,
        description: dataset.description,
        dataUrl: '',
        configUrl: '',
        panelDisabled: true
      };
    });

    const datasets = visualization.datasets.map((dataset) => dataset.file);

    this.currentMap = visualization.vis;

    return {datasets, vis: visualization.vis, options};
  }

  getMapPermalink(mapLink, fullURL = true) {
    return fullURL
      ? `${window.location.protocol}//${window.location.host}/${mapLink}`
      : `/${mapLink}`;
  }

  // PRIVATE

  _convertDataset({ data: dataset }) {
    const {allData, fields, id} = dataset;
    const columns = fields.map((field) => ({
      name: field.name,
      type: field.type
    }));

    const file = formatCsv(allData, fields);

    return {
      name: id,
      columns,
      file
    }
  }

  _manageErrors(error) {
    if (error && error.message) {
      switch (error.message) {
        case 'No client ID has been specified':
          console.error('No ClientID set for CARTO provider'); break;
        case 'Cannot set the client ID more than once':
          console.error('CARTO provider already initialized'); break;
        default:
          console.error(`CARTO provider: ${error.message}`);
      }
    } else {
      console.error(`General error in CARTO provider`);
    }
  }

}
