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

import DropboxHandler from './dropbox';

export const AUTH_HANDLERS = {
  [DropboxHandler.name]: DropboxHandler
};

/**
 * This method will validate and store the auth token received by the third party service
 * @param {Object} [handler=DropboxHandler] Handler to collect and set authorization tokens.
 * @returns {?string} The auth token
 */
export function validateAndStoreAuth(handler = DropboxHandler) {
  return handler && handler.validateAndStoreAuth ?
    handler.validateAndStoreAuth() : null;
}

/**
 * This method handle uploading file to the cloud by providing the third party service handler
 * @param {FileBloc} fileBlob File Blob to upload
 * @param {string} name Name of the file
 * @param {Object} handler
 * @returns {Promise}
 */
export function uploadFile(fileBlob, name, handler = DropboxHandler) {
  return handler && handler.uploadFile ?
    handler.uploadFile(fileBlob, name)
    : Promise.reject('No auth handler');
}

/**
 *
 * @param {Object} metadata
 * @param {Object} [handler=DropboxHandler] Handler to collect and set authorization tokens.
 * @returns {*}
 */
export function shareFile(metadata, handler = DropboxHandler) {
  if (!handler) {
    return null;
  }

  if (handler.shareFile) {
    return handler.shareFile(metadata);
  }

  return Promise.reject('No auth handler');
}
