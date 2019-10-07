// Copyright (c) 2019 Uber Technologies, Inc.
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

// DROPBOX
import {OAuthApp} from '@carto/toolkit';
import DropboxIcon from '../../components/icons/carto-icon';
import {formatCsv} from 'processors/data-processor';
import {loadRemoteResourceSuccess,setLoadingMapStatus} from '../../actions';

const NAME = 'carto';
const carto = new OAuthApp({
  scopes: 'schemas:c'
}, {
  namespace: 'keplergl'
});

/**
 * Set the auth toke to be used with carto client
 * @param authToken
 */
function setAuthToken(authToken) {
  if (!carto || !authToken) {
    return;
  }

  carto.setClientID(authToken);
}

/**
 * The CARTO cloud provider polls the created window internally to parse the URL
 * @param {*} location 
 */
function getAccessTokenFromLocation(location) {
  return;
}

async function uploadFile({blob, name: fileName, isPublic = true}) {
  const payload = JSON.parse(await new Response(blob).text());

  const { config, datasets } = payload;

  const cartoDatasets = datasets.map(convertDataset);

  const cs = await carto.CustomStorage;

  const result = await cs.createVisualization({
    name: fileName,
    config: JSON.stringify(config),
    isPrivate: !isPublic
  }, cartoDatasets, true);

  // eslint-disable-next-line no-console
  console.log(result);

  return result;
}

function convertDataset({ data: dataset }) {
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

/**
 * The CARTO toolkit library takes care of the login process.
 */
function handleLogin(onCloudLoginSuccess) {
  carto.login().then(() => {
    onCloudLoginSuccess(NAME);
  });
}

/**
 * Returns the access token. If it has expired returns null. The toolkit library loads it
 * from localStorage automatically
 */
function getAccessToken() {
  if (carto.oauth.expired) {
    return null;
  }

  return carto.oauth.expired ? null : carto.oauth.token;
}

function loadMap(mapId, queryParams) {
  return dispatch => {
    dispatch(setLoadingMapStatus(true));
    carto.PublicStorageReader.getVisualization('roman-carto', mapId).then((result) => {
      console.log(result);

      dispatch(loadRemoteResourceSuccess([], result.vis.config, []))
    });
  }
}

export default {
  name: NAME,
  getAccessToken,
  getAccessTokenFromLocation,
  handleLogin,
  icon: DropboxIcon,
  setAuthToken,
  loadMap,
  uploadFile
};
