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
import window from 'global/window';
import {parseQueryString} from '../utils/url';
import DropboxIcon from '../components/icons/dropbox-icon';

const NAME = 'dropbox';
const DOMAIN = 'www.dropbox.com';
const KEPLER_DROPBOX_FOLDER_LINK = `//${DOMAIN}/home/Apps`;
const CORS_FREE_DOMAIN = 'dl.dropboxusercontent.com';

export default class DropboxProvider {
  constructor(clientId, appName, icon = DropboxIcon) {
    // All cloud-providers providers must implement the following properties
    this.name = NAME;
    this.clientId = clientId;
    this.appName = appName;
    this.icon = icon;

    this._folderLink = `${KEPLER_DROPBOX_FOLDER_LINK}/${appName}`;

    // Initialize Dropbox API
    this._dropbox = new Dropbox({fetch: window.fetch});
    this._dropbox.setClientId(clientId);
  }

  /**
   * This method will handle the oauth flow by performing the following steps:
   * - Opening a new window
   * - Subscribe to message channel
   * - Receive the token when ready
   * - Close the opened tab
   */
  login(onCloudLoginSuccess) {
    const link = this._authLink();
    const authWindow = window.open(link, '_blank', 'width=1024,height=716');
    const handleToken = e => {
      // TODO: add security step to validate which domain the message is coming from
      authWindow.close();
      window.removeEventListener('message', handleToken);
      this._dropbox.setAccessToken(e.data.token);
      if (window.localStorage) {
        window.localStorage.setItem('dropbox', JSON.stringify({
          // dropbox token doesn't expire unless revoked by the user
          token: e.data.token,
          timestamp: new Date()
        }));
      }
      onCloudLoginSuccess(this.name);
    };
    window.addEventListener('message', handleToken);
  }

  /**
   *
   * @param blob to upload
   * @param name if blob doesn't contain a file name, this field is used
   * @param isPublic define whether the file will be available pubblicaly once uploaded
   * @returns {Promise<DropboxTypes.files.FileMetadata>}
   */
  async uploadFile({blob, name, isPublic = true}) {
    const metadata = await this._dropbox.filesUpload({
      path: name || blob.name,
      contents: blob
    });

    return isPublic ? await this.shareFile(metadata) : metadata;
  }

  /**
   * It will set access to file to public
   * @param {Object} metadata metadata response from uploading the file
   * @returns {Promise<DropboxTypes.sharing.FileLinkMetadataReference | DropboxTypes.sharing.FolderLinkMetadataReference | DropboxTypes.sharing.SharedLinkMetadataReference>}
   */
  shareFile(metadata) {
    return this._dropbox.sharingCreateSharedLinkWithSettings({
      path: metadata.path_display || metadata.path_lower
    }).then(
      // Update URL to avoid CORS issue
      // Unfortunately this is not the ideal scenario but it will make sure people
      // can share dropbox urls with users without the dropbox account (publish on twitter, facebook)
      result => ({
        ...result,
        folder_link: this._folderLink,
        url: this._overrideUrl(result.url)
      })
    );
  }

  /**
   * Provides the current dropbox auth token. If stored in localStorage is set onto dropbox handler and returned
   * @returns {any}
   */
  getAccessToken() {
    let token = this._dropbox.getAccessToken();
    if (!token && window.localStorage) {
      const jsonString = window.localStorage.getItem('dropbox');
      token = jsonString && JSON.parse(jsonString).token;
      if (token) {
        this._dropbox.setAccessToken(token);
      }
    }
    return (token || '') !== '' ? token : null;
  }

  getUserName(){
    // TODO usersGetCurrentAccount()
    return null;
  }

  /**
   * This method will extract the auth token from the third party service callback url.
   * @param {object} location the window location provided by react router
   * @returns {?string} the token extracted from the oauth 2 callback URL
   */
  getAccessTokenFromLocation(location) {
    if (!(location && location.hash.length)) {
      return null;
    }
    // dropbox token usually start with # therefore we want to remore the '#'
    const query = window.location.hash.substring(1);
    return parseQueryString(query).access_token;
  }

  // PRIVATE

  /**
   * Generate auth link url to open to be used to handle OAuth2
   * @param {string} path
   */
  _authLink(path = 'auth') {
    return this._dropbox.getAuthenticationUrl(
      `${window.location.origin}/${path}`,
      btoa(JSON.stringify({handler: 'dropbox', origin: window.location.origin}))
    )
  }

  /**
   * Override dropbox cloud-providers url
   * https://www.dropbox.com/s/bxwwdb81z0jg7pb/keplergl_2018-11-01T23%3A22%3A43.940Z.json?dl=0
   * ->
   * https://dl.dropboxusercontent.com/s/bxwwdb81z0jg7pb/keplergl_2018-11-01T23%3A22%3A43.940Z.json
   * @param metadata
   * @returns {DropboxTypes.sharing.FileLinkMetadataReference}
   */
  _overrideUrl(url) {
    return url ? url.slice(0, url.indexOf('?')).replace(DOMAIN, CORS_FREE_DOMAIN) : null;
  }
}
