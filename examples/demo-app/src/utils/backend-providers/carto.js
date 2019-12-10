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

import {OAuthApp} from '@carto/toolkit';
import CARTOIcon from '../../components/icons/carto-icon';
import {formatCsv} from 'processors/data-processor';

const NAME = 'carto';
const NAMESPACE = 'keplergl';

const carto = new OAuthApp(
  { scopes: 'schemas:c' },
  { namespace: NAMESPACE }
);

window.cartoClient = carto;

const connect = function connect(callback) {
  return carto.login().then(callback);
};

const isConnected = function isConnected() {
  return Boolean(carto.oauth.token);
};

const setAuthToken = function setAuthToken(authToken) {
  if (!carto || !authToken) {
    return;
  }

  carto.setClientID(authToken);
};

const uploadFile = async function uploadFile({blob, name: fileName, isPublic = false}) {
  if (isConnected) {
    const payload = JSON.parse(await new Response(blob).text());

    const { config, datasets } = payload;

    const cartoDatasets = datasets.map(_convertDataset);

    const cs = await carto.getCustomStorage();

    const result = await cs.createVisualization({
      name: fileName,
      config: JSON.stringify(config),
      isPrivate: !isPublic
    }, cartoDatasets, true);

    return ({
      url: `demo/map/carto?mapId=${result.id}&owner=${carto.username}`
    });
  }
}

const logout = function logout(callback) {
  carto.oauth.clear();
  carto.oauth._carto.sync();
  callback();
};

const _convertDataset = function _convertDataset({ data: dataset }) {
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

export default {
  name: NAME,
  icon: CARTOIcon,
  setAuthToken,
  connect,
  isConnected,
  uploadFile,
  logout
};
