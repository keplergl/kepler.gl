import React from 'react';
import {OAuthApp} from '@carto/toolkit';
import CartoIcon from '../components/icons/carto-icon';
import SharingUrl from '../components/sharing/sharing-url';
import {formatCsv} from 'processors/data-processor';
import {getMapPermalink} from '../utils/url';
import get from 'lodash.get';
import {loadRemoteResourceSuccess,setLoadingMapStatus} from '../actions';
import {push} from 'react-router-redux';

const NAME = 'carto';
const NAMESPACE = 'keplergl';
const DEFAULT_URL = '/demo';

export default class CartoProvider {
  constructor(clientId){
    this.name = NAME;
    this.clientId = clientId;
    this.icon = CartoIcon;

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
    this._carto.login().then(() => {
      onCloudLoginSuccess(this.name);
    });
  }

  async uploadFile({blob, name: fileName, isPublic = true}) {
    const payload = JSON.parse(await new Response(blob).text());

    const { config, datasets } = payload;

    const cartoDatasets = datasets.map(this._convertDataset);

    const cs = await this._carto.getCustomStorage();

    const result = await cs.createVisualization({
      name: fileName,
      config: JSON.stringify(config),
      isPrivate: !isPublic
    }, cartoDatasets, true);

    return ({
      url: `demo/map/carto?mapId=${result.id}&owner=${this._carto.username}`
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
    return this._carto.oauth.expired ? null : this._carto.oauth.token;
  }

  getUserName(){
    return this._carto.oauth.expired ? null : this._carto.username;
  }

  /**
   * The CARTO cloud provider polls the created window internally to parse the URL
   * @param {*} location
   */
  getAccessTokenFromLocation(location) {
    return;
  }

  loadMap(queryParams) {
    const { owner: username, mapId } = queryParams;

    return dispatch => {
      if (!username || !mapId) {
        dispatch(push(DEFAULT_URL));
        return;
      }

      dispatch(setLoadingMapStatus(true));
      this._carto.PublicStorageReader.getVisualization(username, mapId).then((result) => {
        // These are the options required for the action. For now, all datasets that come from CARTO are CSV
        const options = result.datasets.map((dataset) => {
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

        const datasets = result.datasets.map((dataset) => dataset.file);

        dispatch(loadRemoteResourceSuccess(datasets, result.vis.config, options))
      });
    }
  }

  // renderMeta(meta) {
  //   const metaUrl = get(meta, 'url');
  //   const sharingLink = metaUrl ? getMapPermalink(metaUrl) : null;

  //   // TODO: link to CARTO dashboard below
  //   return (<SharingUrl url={sharingLink} message={'Share your map with other users'} />);
  // }

  getMapPermalink(mapLink, fullURL = true) {
    return (fullURL)
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

}
