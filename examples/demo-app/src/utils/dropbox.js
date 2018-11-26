// Copyright (c) 2018 Uber Technologies, Inc.
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
import {parseQueryString} from './url';

// const DROPBOX_CLIEND_ID = process.env.DropboxClientId;
const DROPBOX_CLIEND_ID = 'jx7ipiwmfen88a2';
const NAME = 'dropbox';
const DOMAIN = 'www.dropbox.com';
const CORS_FREE_DOMAIN = 'dl.dropboxusercontent.com';
const dropbox = new Dropbox({clientId: DROPBOX_CLIEND_ID});

function authLink(path = 'auth') {
  return dropbox.getAuthenticationUrl(
    `${window.location.origin}/${path}`,
    JSON.stringify({handler: 'dropbox'})
  )
}

/**
 * This method will extract the atuch token from the third party service callback url. Default: Dropbox
 * @returns {?string} the token extracted from the oauth 2 callback URL
 */
function getAccessTokenFromUrl() {
  if (!window.location.hash.length) {
    return null;
  }
  // dropbox token usually start with # therefore we want to remore the '#'
  const query = window.location.hash.substring(1);

  const token = parseQueryString(query).access_token;
  dropbox.setAccessToken(token);
  return token;
}

/**
 * This method will extract the token from the auth provider callback URL
 * and store it onto localstorage
 * @returns {?string} the stored token
 */
function validateAndStoreAuth() {
  const token = getAccessTokenFromUrl();

  if (!token || !localStorage) {
    return null;
  }

  localStorage.setItem(NAME, token);

  return token;
}

/**
 * This method will retrieve the auth token
 * @returns {?string} The auth token
 */
function retrieveAuthToken() {
  if (!localStorage) {
    return null
  }

  // retrieve token mapped against this auth handler from local storage
  const token = localStorage.getItem(NAME);

  dropbox.setAccessToken(token);

  return token;
}

/**
 *
 * @param blob
 * @param name
 * @returns {Promise<DropboxTypes.files.FileMetadata>}
 */
function uploadFile(blob, name) {
  return dropbox.filesUpload({
    path: `/keplergl/${blob.name || name}`,
    contents: blob
  })
}

/**
 * It will set access to file to public
 * @param metadata
 * @returns {Promise<DropboxTypes.sharing.FileLinkMetadataReference | DropboxTypes.sharing.FolderLinkMetadataReference | DropboxTypes.sharing.SharedLinkMetadataReference>}
 */
function shareFile(metadata) {
  return dropbox.sharingCreateSharedLinkWithSettings({
    path: metadata.path_display || metadata.path_lower
  }).then(
    // Update URL to avoid CORS issue
    // Unfortunately this is not the ideal scenario but it will make sure people
    // can share dropbox urls with users without the dropbox account (publish on twitter, facebook)
    result => overrideUrl(result)
  );
}

/**
 * Override dropbox sharing url
 * https://www.dropbox.com/s/bxwwdb81z0jg7pb/keplergl_2018-11-01T23%3A22%3A43.940Z.json?dl=0
 * ->
 * https://dl.dropboxusercontent.com/s/bxwwdb81z0jg7pb/keplergl_2018-11-01T23%3A22%3A43.940Z.json
 * @param metadata
 * @returns {{url: string}}
 */
function overrideUrl(metadata) {
  const url = (metadata.url || '');
  return {
    ...metadata,
    url: url.slice(0, url.indexOf('?')).replace(DOMAIN, CORS_FREE_DOMAIN)
  };
}

export default {
  name: NAME,
  authLink,
  retrieveAuthToken,
  shareFile,
  uploadFile,
  validateAndStoreAuth
};
