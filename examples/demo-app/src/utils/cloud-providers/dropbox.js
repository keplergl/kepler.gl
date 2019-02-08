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
import {Dropbox} from 'dropbox';
import {parseQueryString} from '../url';
import window from 'global/window'
import DropboxIcon from '../../components/icons/dropbox-icon';

const DROPBOX_CLIEND_ID = process.env.DropboxClientId;
const NAME = 'dropbox';
const DOMAIN = 'www.dropbox.com';
const CORS_FREE_DOMAIN = 'dl.dropboxusercontent.com';
const dropbox = new Dropbox({clientId: DROPBOX_CLIEND_ID});

/**
 * Generate auth link url to open to be used to handle OAuth2
 * @param {string} path
 */
function authLink(path = 'auth') {
  return dropbox.getAuthenticationUrl(
    `${window.location.origin}/${path}`,
    btoa(JSON.stringify({handler: 'dropbox', origin: window.location.origin}))
  )
}

/**
 * This method will extract the atuch token from the third party service callback url. Default: Dropbox
 * @param {object} location the window location provided by react router
 * @returns {?string} the token extracted from the oauth 2 callback URL
 */
function getAccessTokenFromLocation(location) {
  if (!(location && location.hash.length)) {
    return null;
  }
  // dropbox token usually start with # therefore we want to remore the '#'
  const query = window.location.hash.substring(1);

  return parseQueryString(query).access_token;
}

/**
 *
 * @param blob to upload
 * @param name if blob doesn't contain a file name, this field is used
 * @param isPublic define whether the file will be available pubblicaly once uploaded
 * @returns {Promise<DropboxTypes.files.FileMetadata>}
 */
function uploadFile({blob, name, isPublic = true}) {
  const promise = dropbox.filesUpload({
    path: `/keplergl/${blob.name || name}`,
    contents: blob
  });

  return !isPublic ? promise : promise.then(shareFile);
}

/**
 * It will set access to file to public
 * @param {Object} metadata metadata response from uploading the file
 * @returns {Promise<DropboxTypes.sharing.FileLinkMetadataReference | DropboxTypes.sharing.FolderLinkMetadataReference | DropboxTypes.sharing.SharedLinkMetadataReference>}
 */
function shareFile(metadata) {
  return dropbox.sharingCreateSharedLinkWithSettings({
    path: metadata.path_display || metadata.path_lower
  }).then(
    // Update URL to avoid CORS issue
    // Unfortunately this is not the ideal scenario but it will make sure people
    // can share dropbox urls with users without the dropbox account (publish on twitter, facebook)
    result => ({
      ...result,
      url: overrideUrl(result.url)
    })
  );
}

/**
 * Override dropbox cloud-providers url
 * https://www.dropbox.com/s/bxwwdb81z0jg7pb/keplergl_2018-11-01T23%3A22%3A43.940Z.json?dl=0
 * ->
 * https://dl.dropboxusercontent.com/s/bxwwdb81z0jg7pb/keplergl_2018-11-01T23%3A22%3A43.940Z.json
 * @param metadata
 * @returns {DropboxTypes.sharing.FileLinkMetadataReference}
 */
function overrideUrl(url) {
  return url ? url.slice(0, url.indexOf('?')).replace(DOMAIN, CORS_FREE_DOMAIN) : null;
}

/**
 * This method will handle the oauth flow by performing the following steps:
 * - Opening a new window
 * - Subscribe to message channel
 * - Receive the token when ready
 * - Close the opened tab
 */
function handleLogin(onCloudLoginSuccess) {
  const link = authLink();
  const authWindow = window.open(link, '_blank', 'width=800,height=600');
  const handleToken = e => {
    // TODO: add security step to validate which domain the message is coming from
    authWindow.close();
    window.removeEventListener('message', handleToken);
    dropbox.setAccessToken(e.data.token);
    if (window.localStorage) {
      window.localStorage.setItem('dropbox', JSON.stringify({
        // dropbox token doesn't expire unless revoked by the user
        token: e.data.token,
        timetamp: new Date()
      }));
    }
    onCloudLoginSuccess();
  };
  window.addEventListener('message', handleToken);
}

/**
 * Provides the current dropbox auth token. If stored in localStorage is set onto dropbox handler and returned
 * @returns {any}
 */
function getAccessToken() {
  let token = dropbox.getAccessToken();
  if (!token && window.localStorage) {
    const jsonString = window.localStorage.getItem('dropbox');
    token = jsonString && JSON.parse(jsonString).token;
    if (token) {
      dropbox.setAccessToken(token);
    }
  }

  return (token || '') !== '' ? token : null;
}

// All cloud-providers providers must implement the following properties
export default {
  name: NAME,
  getAccessTokenFromLocation,
  handleLogin,
  uploadFile,
  getAccessToken,
  icon: DropboxIcon
};
