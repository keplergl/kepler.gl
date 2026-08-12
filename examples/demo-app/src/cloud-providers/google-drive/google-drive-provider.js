// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {KEPLER_FORMAT, Provider} from '@kepler.gl/cloud-providers';
import {loadScript} from '../../utils/load-script';
import GoogleDriveIcon from './google-drive-icon';

const NAME = 'google-drive';
const DISPLAY_NAME = 'Google Drive';
const STORAGE_KEY = 'google-drive';
const APP_FOLDER_NAME = 'Kepler.gl';
const MIME_JSON = 'application/json';
const MIME_PNG = 'image/png';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const USERINFO_API = 'https://www.googleapis.com/oauth2/v3/userinfo';
const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const SCOPES = [DRIVE_SCOPE, 'openid', 'profile', 'email'].join(' ');

const PRIVATE_STORAGE_ENABLED = true;
const SHARING_ENABLED = false;
const MANAGEMENT_URL = 'https://drive.google.com/drive/my-drive';

/**
 * Google Drive cloud provider using Google Identity Services (token model)
 * and Drive API v3 REST. Only Client ID is required (no API key).
 *
 * Create an OAuth 2.0 Web client in Google Cloud Console, enable Drive API,
 * and authorize your demo-app origin (e.g. http://localhost:8080).
 */
export default class GoogleDriveProvider extends Provider {
  constructor({clientId, appName = APP_FOLDER_NAME} = {}) {
    super({name: NAME, displayName: DISPLAY_NAME, icon: GoogleDriveIcon});
    this.clientId = clientId || null;
    this.appName = appName;
    this._accessToken = null;
    this._tokenClient = null;
    this._folderId = null;
    this._shareUrl = null;
    // Serialize GIS token requests — TokenClient exposes a single callback pair.
    this._tokenRequestChain = Promise.resolve();
    this._thumbnailCache = new Map();
  }

  isEnabled() {
    return Boolean(this.clientId);
  }

  hasPrivateStorage() {
    return PRIVATE_STORAGE_ENABLED;
  }

  hasSharingUrl() {
    return SHARING_ENABLED;
  }

  hasLazyThumbnails() {
    return true;
  }

  getManagementUrl() {
    return MANAGEMENT_URL;
  }

  getShareUrl(fullUrl = true) {
    if (!this._shareUrl) {
      return '';
    }
    return fullUrl
      ? `${window.location.protocol}//${window.location.host}${this._shareUrl}`
      : this._shareUrl;
  }

  getMapUrl(loadParams = {}) {
    const {id} = loadParams;
    return id || '';
  }

  async getAccessToken() {
    const stored = this._readStorage();

    // Reuse cached token only while expiresAt says it is still valid
    if (stored?.token && !this._isExpired(stored)) {
      const scope = stored.scope || '';
      if (scope && !scope.split(/\s+/).includes(DRIVE_SCOPE)) {
        this._clearStorage();
        this._accessToken = null;
        return null;
      }
      this._accessToken = stored.token;
      return this._accessToken;
    }

    const hadToken = Boolean(this._accessToken || stored?.token);
    this._accessToken = null;

    // Silent refresh after expiry (or if memory still held a stale token)
    if (hadToken && this.clientId) {
      try {
        await this._ensureTokenClient();
        const tokenResponse = await this._requestAccessToken({prompt: ''});
        if (!this._hasDriveScope(tokenResponse)) {
          this._clearStorage();
          this._accessToken = null;
          return null;
        }
        return tokenResponse.access_token;
      } catch (err) {
        this._clearStorage();
        this._accessToken = null;
        return null;
      }
    }

    return null;
  }

  async getUser() {
    const token = await this.getAccessToken();
    if (!token) {
      return null;
    }

    const stored = this._readStorage();
    if (stored?.user && !this._isExpired(stored)) {
      return stored.user;
    }

    try {
      const user = await this._fetchUser(token);
      this._writeStorage({token, user});
      return user;
    } catch (err) {
      this._clearStorage();
      this._accessToken = null;
      return null;
    }
  }

  getUserName() {
    const stored = this._readStorage();
    return stored?.user?.name || '';
  }

  async login() {
    if (!this.clientId) {
      throw new Error(
        'Google Drive Client ID is not configured. Set GoogleDriveClientId in your .env file.'
      );
    }

    await this._ensureTokenClient();
    // Must be called from a user gesture so the consent popup is not blocked.
    // Google may grant Sign-In scopes but not Drive (granular consent) — verify and re-ask.
    let tokenResponse = await this._requestAccessToken({prompt: 'select_account'});
    if (!this._hasDriveScope(tokenResponse)) {
      tokenResponse = await this._requestAccessToken({
        prompt: 'consent',
        scope: DRIVE_SCOPE
      });
    }
    if (!this._hasDriveScope(tokenResponse)) {
      throw new Error(
        'Google Drive access was not granted. On the consent screen, allow Google Drive / See, edit, create, and delete only the specific Google Drive files you use with this app.'
      );
    }

    const user = await this._fetchUser(tokenResponse.access_token);
    this._writeStorage({
      token: tokenResponse.access_token,
      user,
      scope: tokenResponse.scope
    });
    return user;
  }

  async logout() {
    const token = this._accessToken || this._readStorage()?.token;
    if (token && window.google?.accounts?.oauth2?.revoke) {
      await new Promise(resolve => {
        window.google.accounts.oauth2.revoke(token, resolve);
      });
    }
    this._accessToken = null;
    this._folderId = null;
    this._shareUrl = null;
    this._thumbnailCache = new Map();
    this._clearStorage();
  }

  async listMaps() {
    const token = await this._requireToken();
    const folderId = await this._ensureAppFolder(token);
    const q = [`'${folderId}' in parents`, `mimeType = '${MIME_JSON}'`, 'trashed = false'].join(
      ' and '
    );

    const data = await this._driveFetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(
        q
      )}&fields=files(id,name,modifiedTime,description)&orderBy=modifiedTime desc&pageSize=100`,
      {token}
    );

    // One metadata list for PNGs — CloudItem lazy-loads bytes via getMapThumbnail.
    const pngQ = [`'${folderId}' in parents`, `mimeType = '${MIME_PNG}'`, 'trashed = false'].join(
      ' and '
    );
    const pngData = await this._driveFetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(pngQ)}&fields=files(id,name)&pageSize=100`,
      {token}
    );
    const thumbnailIdByTitle = {};
    (pngData.files || []).forEach(png => {
      const title = png.name.replace(/\.png$/i, '');
      if (!thumbnailIdByTitle[title]) {
        thumbnailIdByTitle[title] = png.id;
      }
    });

    return (data.files || []).map(file => {
      const title = file.name.replace(/\.json$/i, '');
      return {
        id: file.id,
        title,
        description: file.description || '',
        updatedAt: file.modifiedTime ? new Date(file.modifiedTime).getTime() : undefined,
        privateMap: true,
        loadParams: {
          id: file.id,
          path: file.name,
          thumbnailId: thumbnailIdByTitle[title]
        }
      };
    });
  }

  async getMapThumbnail(map) {
    if (map?.thumbnail) {
      return map.thumbnail;
    }
    const thumbnailId = map?.loadParams?.thumbnailId;
    if (!thumbnailId) {
      return undefined;
    }
    if (this._thumbnailCache.has(thumbnailId)) {
      return this._thumbnailCache.get(thumbnailId);
    }

    try {
      const token = await this._requireToken();
      const response = await fetch(`${DRIVE_API}/files/${thumbnailId}?alt=media`, {
        headers: {Authorization: `Bearer ${token}`}
      });
      if (!response.ok) {
        return undefined;
      }
      const blob = await response.blob();
      const dataUrl = await this._blobToDataUrl(blob);
      this._thumbnailCache.set(thumbnailId, dataUrl);
      return dataUrl;
    } catch (err) {
      return undefined;
    }
  }

  async uploadMap({mapData, options = {}}) {
    const token = await this._requireToken();
    const {map, thumbnail} = mapData;
    const title = (map.info && map.info.title) || 'Untitled Map';
    const description = (map.info && map.info.description) || '';
    const fileName = `${title}.json`;
    const folderId = await this._ensureAppFolder(token);

    const existing = await this._findFileByName(token, folderId, fileName);
    if (existing && !options.overwrite) {
      throw this.getFileConflictError();
    }

    let fileMeta;
    if (existing && options.overwrite) {
      fileMeta = await this._updateJsonFile(token, existing.id, map, description);
    } else {
      fileMeta = await this._createMultipartFile({
        token,
        name: fileName,
        description,
        parents: [folderId],
        mimeType: MIME_JSON,
        body: JSON.stringify(map)
      });
    }

    if (thumbnail) {
      const pngName = `${title}.png`;
      const existingPng = await this._findFileByName(token, folderId, pngName);
      if (existingPng) {
        await this._updateBinaryFile(token, existingPng.id, thumbnail, MIME_PNG);
      } else {
        await this._createMultipartFile({
          token,
          name: pngName,
          parents: [folderId],
          mimeType: MIME_PNG,
          body: thumbnail
        });
      }
    }

    if (options.isPublic) {
      await this._makePublic(token, fileMeta.id);
      this._shareUrl = `/demo/map/${NAME}?id=${fileMeta.id}`;
      return {
        id: fileMeta.id,
        title,
        description,
        privateMap: false,
        loadParams: {id: fileMeta.id, path: fileName},
        shareUrl: this.getShareUrl(true),
        folderLink: MANAGEMENT_URL
      };
    }

    return {
      id: fileMeta.id,
      title,
      description,
      privateMap: true,
      loadParams: {id: fileMeta.id, path: fileName}
    };
  }

  async downloadMap(loadParams = {}) {
    // listMaps sets {id, path: fileName}; URL loads may pass ?path=<fileId>
    const id = loadParams.id || loadParams.path;
    if (!id || String(id).endsWith('.json')) {
      throw new Error('Google Drive: no file id provided in loadParams');
    }

    const token = await this._requireToken();
    const response = await fetch(`${DRIVE_API}/files/${id}?alt=media`, {
      headers: {Authorization: `Bearer ${token}`}
    });

    if (!response.ok) {
      if (response.status === 401) {
        this._accessToken = null;
        this._clearStorage();
      }
      const errText = await response.text();
      throw new Error(`Google Drive download failed: ${response.status} ${errText}`);
    }

    const map = await response.json();
    return {map, format: KEPLER_FORMAT};
  }

  // —— private helpers ——

  async _requireToken() {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('Not logged in to Google Drive');
    }
    return token;
  }

  async _ensureTokenClient() {
    if (!window.google?.accounts?.oauth2) {
      await loadScript(GIS_SCRIPT_URL);
    }
    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google Identity Services failed to load');
    }
    if (!this._tokenClient) {
      // callback is set per request in _requestAccessToken
      this._tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: SCOPES,
        callback: () => {}
      });
    }
  }

  _hasDriveScope(tokenResponse) {
    if (!tokenResponse?.access_token) {
      return false;
    }
    if (window.google?.accounts?.oauth2?.hasGrantedAllScopes) {
      return window.google.accounts.oauth2.hasGrantedAllScopes(tokenResponse, DRIVE_SCOPE);
    }
    const granted = tokenResponse.scope || '';
    return granted.split(' ').includes(DRIVE_SCOPE);
  }

  _requestAccessToken({prompt, scope} = {}) {
    const run = () =>
      new Promise((resolve, reject) => {
        this._tokenClient.callback = response => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          this._accessToken = response.access_token;
          const expiresIn = Number(response.expires_in) || 3600;
          this._writeStorage({
            token: response.access_token,
            expiresAt: Date.now() + expiresIn * 1000,
            scope: response.scope,
            user: this._readStorage()?.user
          });
          resolve(response);
        };
        this._tokenClient.error_callback = error => {
          reject(new Error(error?.type || 'Google OAuth error'));
        };
        const overrides = {};
        if (prompt !== undefined) {
          overrides.prompt = prompt;
        }
        if (scope) {
          overrides.scope = scope;
        }
        this._tokenClient.requestAccessToken(overrides);
      });

    // Queue so overlapping silent refresh + login cannot overwrite callbacks.
    const next = this._tokenRequestChain.then(run, run);
    this._tokenRequestChain = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }

  async _fetchUser(token) {
    const response = await fetch(USERINFO_API, {
      headers: {Authorization: `Bearer ${token}`}
    });
    if (!response.ok) {
      throw new Error('Failed to fetch Google user profile');
    }
    const profile = await response.json();
    return {
      name: profile.name || profile.email || 'Google User',
      email: profile.email || '',
      thumbnail: profile.picture
    };
  }

  async _ensureAppFolder(token) {
    if (this._folderId) {
      return this._folderId;
    }

    // Only My Drive root — avoids picking a same-named folder elsewhere in Drive.
    // If duplicates exist at root, prefer the oldest (original app folder).
    const escapedName = this.appName.replace(/'/g, "\\'");
    const q = [
      `name = '${escapedName}'`,
      `'root' in parents`,
      `mimeType = 'application/vnd.google-apps.folder'`,
      'trashed = false'
    ].join(' and ');

    const listed = await this._driveFetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(
        q
      )}&fields=files(id,name,createdTime)&orderBy=createdTime&pageSize=10`,
      {token}
    );

    if (listed.files && listed.files.length) {
      this._folderId = listed.files[0].id;
      return this._folderId;
    }

    const created = await this._driveFetch(`${DRIVE_API}/files?fields=id,name`, {
      token,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: this.appName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['root']
      })
    });

    this._folderId = created.id;
    return this._folderId;
  }

  async _findFileByName(token, folderId, name) {
    const q = [
      `'${folderId}' in parents`,
      `name = '${name.replace(/'/g, "\\'")}'`,
      'trashed = false'
    ].join(' and ');

    const data = await this._driveFetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)&pageSize=1`,
      {token}
    );
    return data.files && data.files[0] ? data.files[0] : null;
  }

  async _createMultipartFile({token, name, parents, mimeType, body, description}) {
    const metadataPayload = {name, mimeType, parents};
    if (description !== undefined) {
      metadataPayload.description = description;
    }
    const metadata = JSON.stringify(metadataPayload);
    const boundary = 'keplergl_google_drive_boundary';
    const delimiter = `--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    let filePart;
    if (body instanceof Blob) {
      const buffer = await body.arrayBuffer();
      filePart = new Uint8Array(buffer);
    } else {
      filePart = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const preamble =
      `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${metadata}\r\n` +
      `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

    const preambleBytes = new TextEncoder().encode(preamble);
    const closingBytes = new TextEncoder().encode(closeDelimiter);
    const contentBytes =
      typeof filePart === 'string' ? new TextEncoder().encode(filePart) : filePart;

    const requestBody = new Uint8Array(
      preambleBytes.length + contentBytes.length + closingBytes.length
    );
    requestBody.set(preambleBytes, 0);
    requestBody.set(contentBytes, preambleBytes.length);
    requestBody.set(closingBytes, preambleBytes.length + contentBytes.length);

    return this._driveFetch(
      `${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id,name,description`,
      {
        token,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: requestBody
      }
    );
  }

  async _updateJsonFile(token, fileId, map, description = '') {
    const fileMeta = await this._driveFetch(
      `${DRIVE_UPLOAD_API}/files/${fileId}?uploadType=media&fields=id,name`,
      {
        token,
        method: 'PATCH',
        headers: {'Content-Type': MIME_JSON},
        body: JSON.stringify(map)
      }
    );

    // Media upload does not update metadata; patch description separately.
    await this._driveFetch(`${DRIVE_API}/files/${fileId}?fields=id,name,description`, {
      token,
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({description})
    });

    return {...fileMeta, description};
  }

  _updateBinaryFile(token, fileId, blob, mimeType) {
    return this._driveFetch(`${DRIVE_UPLOAD_API}/files/${fileId}?uploadType=media&fields=id,name`, {
      token,
      method: 'PATCH',
      headers: {'Content-Type': mimeType},
      body: blob
    });
  }

  async _makePublic(token, fileId) {
    try {
      await this._driveFetch(`${DRIVE_API}/files/${fileId}/permissions`, {
        token,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({role: 'reader', type: 'anyone'})
      });
    } catch (err) {
      const msg = String(err.message || err);
      // Drive returns 409 / alreadyExists when the permission is already set
      if (/alreadyExists|already exists|409|conflict/i.test(msg)) {
        return;
      }
      throw err;
    }
  }

  async _driveFetch(url, {token, method = 'GET', headers = {}, body} = {}) {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers
      },
      body
    });

    if (!response.ok) {
      let message = response.statusText || 'Request failed';
      let reason = '';
      try {
        const errJson = await response.json();
        message = errJson.error?.message || message;
        reason = errJson.error?.errors?.[0]?.reason || errJson.error?.status || '';
      } catch (e) {
        // ignore parse errors
      }
      const detail = [response.status, reason, message].filter(Boolean).join(' ');
      if (response.status === 401) {
        this._accessToken = null;
        this._clearStorage();
        throw new Error('Google Drive session expired. Log in again.');
      }
      if (
        response.status === 403 &&
        /insufficient.*(scope|authentication)/i.test(`${message} ${reason}`)
      ) {
        this._accessToken = null;
        this._clearStorage();
        throw new Error(
          'Google Drive permission is missing. Log out of Google Drive in Kepler, then log in again and allow Drive access (do not uncheck it on the consent screen).'
        );
      }
      throw new Error(`Google Drive API error: ${detail}`);
    }

    if (response.status === 204) {
      return null;
    }
    return response.json();
  }

  _blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  _readStorage() {
    if (!window.localStorage) {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  _writeStorage({token, user, expiresAt, scope}) {
    if (!window.localStorage) {
      return;
    }
    const prev = this._readStorage() || {};
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: token !== undefined ? token : prev.token,
        user: user !== undefined ? user : prev.user,
        expiresAt: expiresAt !== undefined ? expiresAt : prev.expiresAt,
        scope: scope !== undefined ? scope : prev.scope,
        timestamp: new Date().toISOString()
      })
    );
  }

  _clearStorage() {
    if (window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  _isExpired(stored) {
    if (!stored?.expiresAt) {
      // Unknown expiry — treat as still usable until a request fails
      return false;
    }
    // Refresh a minute early
    return Date.now() > stored.expiresAt - 60 * 1000;
  }
}
