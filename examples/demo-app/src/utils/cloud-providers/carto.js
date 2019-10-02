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

const NAME = 'carto';
let carto;

/**
 * Set the auth toke to be used with carto client
 * @param authToken
 */
function setAuthToken(authToken) {
  if (carto) {
    return;
  }

  carto = new OAuthApp({
    clientID: authToken,
    scopes: 'schemas:c'
  });
}

/**
 * The CARTO cloud provider polls the created window internally to parse the URL
 * @param {*} location 
 */
function getAccessTokenFromLocation(location) {
  return;
}

function uploadFile({blob, name, isPublic = true}) {
  // eslint-disable-next-line no-console
  console.log('Not implemented', arguments);
}

/**
 * The CARTO toolkit library takes care of the login process.
 */
function handleLogin(onCloudLoginSuccess) {
  carto.login.then(() => {
    onCloudLoginSuccess();
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

export default {
  name: NAME,
  getAccessToken,
  getAccessTokenFromLocation,
  handleLogin,
  icon: DropboxIcon,
  setAuthToken,
  uploadFile
};
