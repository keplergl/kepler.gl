// Copyright (c) 2020 Uber Technologies, Inc.
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
import Console from 'global/console';
import DropboxIcon from './dropbox-icon';
import {MAP_URI} from '../../constants/default-settings';
import {Provider} from 'kepler.gl/cloud-providers';

const NAME = 'dropbox';
const DISPLAY_NAME = 'Dropbox';
const DOMAIN = 'www.dropbox.com';
const KEPLER_DROPBOX_FOLDER_LINK = `//${DOMAIN}/home/Apps`;
const CORS_FREE_DOMAIN = 'dl.dropboxusercontent.com';
const PRIVATE_STORAGE_ENABLED = true;
const SHARING_ENABLED = true;
const MAX_THUMBNAIL_BATCH = 25;
const IMAGE_URL_PREFIX = 'data:image/gif;base64,';

function parseQueryString(query) {
  const searchParams = new URLSearchParams(query);
  const params = {};
  for (const p of searchParams) {
    if (p && p.length === 2 && p[0]) params[p[0]] = p[1];
  }

  return params;
}

function isConfigFile(err) {
  const summary = err.error && err.error.error_summary;
  return typeof summary === 'string' && Boolean(summary.match(/path\/conflict\/file\//g));
}

export default class DropboxProvider extends Provider {
  constructor(clientId, appName) {
    super({name: NAME, displayName: DISPLAY_NAME, icon: DropboxIcon});
    // All cloud-providers providers must implement the following properties

    this.clientId = clientId;
    this.appName = appName;

    this._folderLink = `${KEPLER_DROPBOX_FOLDER_LINK}/${appName}`;
    this._path = `/Apps/${window.decodeURIComponent(this.appName)}`;

    // Initialize Dropbox API
    this._initializeDropbox();
  }

  /**
   * This method will handle the oauth flow by performing the following steps:
   * - Opening a new window
   * - Subscribe to message channel
   * - Receive the token when ready
   * - Close the opened tab
   */
  async login(onCloudLoginSuccess) {
    const link = this._authLink();

    const authWindow = window.open(link, '_blank', 'width=1024,height=716');

    const handleToken = async e => {
      // TODO: add security step to validate which domain the message is coming from
      if (authWindow) {
        authWindow.close();
      }

      window.removeEventListener('message', handleToken);

      if (!e.data.token) {
        Console.warn('Failed to login to Dropbox');
        return;
      }

      this._dropbox.setAccessToken(e.data.token);
      // save user name
      const user = await this._getUser();

      if (window.localStorage) {
        window.localStorage.setItem(
          'dropbox',
          JSON.stringify({
            // dropbox token doesn't expire unless revoked by the user
            token: e.data.token,
            user,
            timestamp: new Date()
          })
        );
      }

      if (typeof onCloudLoginSuccess === 'function') {
        onCloudLoginSuccess();
      }
    };

    window.addEventListener('message', handleToken);
  }

  async downloadMap(loadParams) {
    const token = this.getAccessToken();
    if (!token) {
      this.login(() => this.downloadMap(loadParams));
    }
    const result = await this._dropbox.filesDownload(loadParams);
    const json = await this._readFile(result.fileBlob);

    const response = {
      map: json,
      format: 'keplergl'
    };

    this._loadParam = loadParams;
    return response;
  }

  async listMaps() {
    // list files
    try {
      // https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesListFolder__anchor
      const response = await this._dropbox.filesListFolder({
        path: this._path
      });
      const {pngs, visualizations} = this._parseEntries(response);
      // https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesGetThumbnailBatch__anchor
      // up to 25 per request
      // TODO: implement pagination, so we don't need to get all the thumbs all at once
      const thumbnails = await Promise.all(this._getThumbnailRequests(pngs)).then(results =>
        results.reduce((accu, r) => [...accu, ...(r.entries || [])], [])
      );

      // append to visualizations
      thumbnails &&
        thumbnails.forEach(thb => {
          if (thb['.tag'] === 'success' && thb.thumbnail) {
            const matchViz = visualizations[pngs[thb.metadata.id] && pngs[thb.metadata.id].name];
            if (matchViz) {
              matchViz.thumbnail = `${IMAGE_URL_PREFIX}${thb.thumbnail}`;
            }
          }
        });

      // dropbox returns
      return Object.values(visualizations).reverse();
    } catch (error) {
      // made the error message human readable for provider updater
      throw this._handleDropboxError(error);
    }
  }

  getUserName() {
    // load user from
    if (window.localStorage) {
      const jsonString = window.localStorage.getItem('dropbox');
      const user = jsonString && JSON.parse(jsonString).user;
      return user;
    }
    return null;
  }

  async logout(onCloudLogoutSuccess) {
    const token = this._dropbox.getAccessToken();

    if (token) {
      await this._dropbox.authTokenRevoke();
      if (window.localStorage) {
        window.localStorage.removeItem('dropbox');
      }
      // re instantiate dropbox
      this._initializeDropbox();
      onCloudLogoutSuccess();
    }
  }

  isEnabled() {
    return this.clientId !== null;
  }

  hasPrivateStorage() {
    return PRIVATE_STORAGE_ENABLED;
  }

  hasSharingUrl() {
    return SHARING_ENABLED;
  }

  /**
   *
   * @param mapData map data and config in one json object {map: {datasets: Array<Object>, config: Object, info: Object}
   * @param blob json file blob to upload
   * @param fileName if blob doesn't contain a file name, this field is used
   * @param isPublic define whether the file will be available publicly once uploaded
   * @returns {Promise<DropboxTypes.files.FileMetadata>}
   */
  async uploadMap({mapData, options = {}}) {
    const {isPublic} = options;
    const {map, thumbnail} = mapData;

    // generate file name if is not provided
    const name = map.info && map.info.title;
    const fileName = `${name}.json`;
    const fileContent = map;
    // FileWriteMode: Selects what to do if the file already exists.
    // Always overwrite if sharing
    const mode = options.overwrite || isPublic ? 'overwrite' : 'add';
    let metadata;
    try {
      metadata = await this._dropbox.filesUpload({
        path: `${this._path}/${fileName}`,
        contents: JSON.stringify(fileContent),
        mode
      });
    } catch (err) {
      if (isConfigFile(err)) {
        throw this.getFileConflictError();
      }
    }
    // save a thumbnail image
    thumbnail &&
      (await this._dropbox.filesUpload({
        path: `${this._path}/${fileName}`.replace(/\.json$/, '.png'),
        contents: thumbnail,
        mode
      }));

    // keep on create shareUrl
    if (isPublic) {
      return await this._shareFile(metadata);
    }

    // save private map save map url
    this._loadParam = {path: metadata.path_lower};

    return this._loadParam;
  }

  /**
   * Get the share url of current map, this url can be accessed by anyone
   * @param {boolean} fullUrl
   */
  getShareUrl(fullUrl = true) {
    return fullUrl
      ? `${window.location.protocol}//${window.location.host}/${MAP_URI}${this._shareUrl}`
      : `/${MAP_URI}${this._shareUrl}`;
  }

  /**
   * Get the map url of current map, this url can only be accessed by current logged in user
   * @param {boolean} fullUrl
   */
  getMapUrl(fullURL = true) {
    const {path} = this._loadParam;
    const mapLink = `demo/map/dropbox?path=${path}`;
    return fullURL
      ? `${window.location.protocol}//${window.location.host}/${mapLink}`
      : `/${mapLink}`;
  }

  getManagementUrl() {
    return this._folderLink;
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

  /**
   * This method will extract the auth token from the third party service callback url.
   * @param {object} location the window location provided by react router
   * @returns {?string} the token extracted from the oauth 2 callback URL
   */
  getAccessTokenFromLocation(location) {
    if (!(location && location.hash.length)) {
      return null;
    }
    // dropbox token usually start with # therefore we want to remove the '#'
    const query = window.location.hash.substring(1);
    return parseQueryString(query).access_token;
  }

  // PRIVATE
  _initializeDropbox() {
    this._dropbox = new Dropbox({fetch: window.fetch});
    this._dropbox.setClientId(this.clientId);
  }

  async _getUser() {
    let response;
    try {
      response = await this._dropbox.usersGetCurrentAccount();
    } catch (error) {
      Console.warn(error);
      return null;
    }

    return this._getUserFromAccount(response);
  }

  _handleDropboxError(error) {
    // dropbox list_folder error
    if (error && error.error && error.error.error_summary) {
      return `Dropbox Error: ${error.error.error_summary}`;
    }

    return error;
  }

  _readFile(fileBlob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader(fileBlob);
      fileReader.onload = ({target: {result}}) => {
        try {
          const json = JSON.parse(result);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };

      fileReader.readAsText(fileBlob, 'utf-8');
    });
  }

  // append url after map sharing
  _getMapPermalink(mapLink, fullUrl = true) {
    return fullUrl
      ? `${window.location.protocol}//${window.location.host}/${MAP_URI}${mapLink}`
      : `/${MAP_URI}${mapLink}`;
  }

  // append map url after load map from storage, this url is not meant
  // to be directly shared with others
  _getMapPermalinkFromParams({path}, fullURL = true) {
    const mapLink = `demo/map/dropbox?path=${path}`;
    return fullURL
      ? `${window.location.protocol}//${window.location.host}/${mapLink}`
      : `/${mapLink}`;
  }
  /**
   * It will set access to file to public
   * @param {Object} metadata metadata response from uploading the file
   * @returns {Promise<DropboxTypes.sharing.FileLinkMetadataReference | DropboxTypes.sharing.FolderLinkMetadataReference | DropboxTypes.sharing.SharedLinkMetadataReference>}
   */
  _shareFile(metadata) {
    const shareArgs = {
      path: metadata.path_display || metadata.path_lower
    };

    return this._dropbox
      .sharingListSharedLinks(shareArgs)
      .then(({links} = {}) => {
        if (links && links.length) {
          return links[0];
        }
        return this._dropbox.sharingCreateSharedLinkWithSettings(shareArgs);
      })
      .then(result => {
        // Update URL to avoid CORS issue
        // Unfortunately this is not the ideal scenario but it will make sure people
        // can share dropbox urls with users without the dropbox account (publish on twitter, facebook)
        this._shareUrl = this._overrideUrl(result.url);

        return {
          // the full url to be displayed
          shareUrl: this.getShareUrl(true),
          folderLink: this._folderLink
        };
      });
  }

  /**
   * Generate auth link url to open to be used to handle OAuth2
   * @param {string} path
   */
  _authLink(path = 'auth') {
    return this._dropbox.getAuthenticationUrl(
      `${window.location.origin}/${path}`,
      btoa(JSON.stringify({handler: 'dropbox', origin: window.location.origin}))
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
  _overrideUrl(url) {
    return url ? url.slice(0, url.indexOf('?')).replace(DOMAIN, CORS_FREE_DOMAIN) : null;
  }

  _getUserFromAccount(response) {
    return response ? (response.name && response.name.abbreviated_name) || response.email : null;
  }

  _getThumbnailRequests(pngs) {
    const batches = Object.values(pngs).reduce((accu, c) => {
      const lastBatch = accu.length && accu[accu.length - 1];
      if (!lastBatch || lastBatch.length >= MAX_THUMBNAIL_BATCH) {
        // add new batch
        accu.push([c]);
      } else {
        lastBatch.push(c);
      }
      return accu;
    }, []);

    return batches.map(batch =>
      this._dropbox.filesGetThumbnailBatch({
        entries: batch.map(img => ({
          path: img.path_lower,
          format: 'png',
          size: 'w128h128'
        }))
      })
    );
  }

  /**
   * Parse fileListFolder result as visualizations to be shown in load storage map modal
   * @param {*} response
   */
  _parseEntries(response) {
    const {entries, cursor, has_more} = response;

    if (has_more) {
      this._cursor = cursor;
    }
    const pngs = {};
    const visualizations = {};

    entries.forEach(entry => {
      const {name, path_lower, id, client_modified} = entry;
      if (name && name.endsWith('.json')) {
        // find json
        const title = name.replace(/\.json$/, '');
        const viz = {
          name,
          title,
          id,
          lastModification: new Date(client_modified).getTime(),
          loadParams: {
            path: path_lower
          }
        };

        visualizations[title] = viz;
      } else if (name && name.endsWith('.png')) {
        const title = name.replace(/\.png$/, '');

        pngs[id] = {
          name: title,
          path_lower,
          id
        };
      }
    });

    return {
      visualizations,
      pngs
    };
  }
}
