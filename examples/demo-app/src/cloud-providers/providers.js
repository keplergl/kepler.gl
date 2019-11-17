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

// Pure cloud storage providers
import DropboxProvider from './dropbox-provider';
import GoogleDriveProvider from './google-drive-provider';

import {AUTH_TOKENS} from '../constants/default-settings';

const DROPBOX_CLIENT_NAME = AUTH_TOKENS.DROPBOX_CLIENT_NAME;
const DROPBOX_CLIENT_ID = AUTH_TOKENS.DROPBOX_CLIENT_ID;

const GOOGLE_DRIVE_CLIENT_NAME = AUTH_TOKENS.GOOGLE_DRIVE_CLIENT_NAME; 
const GOOGLE_DRIVE_CLIENT_ID = AUTH_TOKENS.GOOGLE_DRIVE_CLIENT_ID;
const GOOGLE_DRIVE_APPKEY = AUTH_TOKENS.GOOGLE_DRIVE_APPKEY;

export const CLOUD_PROVIDERS = [
  new GoogleDriveProvider(GOOGLE_DRIVE_CLIENT_NAME, GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_APPKEY),
  new DropboxProvider(DROPBOX_CLIENT_NAME, DROPBOX_CLIENT_ID)
];
