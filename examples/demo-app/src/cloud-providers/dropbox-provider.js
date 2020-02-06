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
import console from 'global/console';
import {parseQueryString} from '../utils/url';
import DropboxIcon from '../components/icons/dropbox-icon';

const NAME = 'dropbox';
const DISPLAY_NAME = 'Dropbox';
const DOMAIN = 'www.dropbox.com';
const KEPLER_DROPBOX_FOLDER_LINK = `//${DOMAIN}/home/Apps`;
const CORS_FREE_DOMAIN = 'dl.dropboxusercontent.com';
const PRIVATE_STORAGE_ENABLED = false;
const SHARING_ENABLED = true;

const stateSavedV1 = {
  datasets: [
    {
      version: 'v1',
      data: {
        id: '8ppj5gfrs',
        label: 'eats_res_radius.csv',
        color: [143, 47, 191],
        allData: [
          [1000, 38.4163786, -121.7922809, false, true, 1, false, 'Hello'],
          [1000, 37.75159991, -122.4761712, false, false, 2, false, 'Smoothie'],
          [2000, 37.8323825, -122.2736475, false, true, 3, false, 'Milkshake'],
          [2000, 37.77565501, -122.4403984, false, true, 4, false, 'Amsterdam'],
          [3000, 37.79659543, -122.4219072, false, true, 0, false, 'Smoothie'],
          [3000, 37.7980847, -122.4050548, false, false, 1, false, 'Smoothie'],
          [3000, 37.79242329, -122.3986584, false, false, 0, false, 'World'],
          [3000, 37.79669585, -122.4219416, false, false, 1, false, 'yo'],
          [2000, 37.6169644, -122.384047, false, false, 0, false, 'really']
        ],
        fields: [
          {
            name: 'radius',
            type: 'integer',
            format: ''
          },
          {
            name: 'point_lat',
            type: 'real',
            format: ''
          },
          {
            name: 'point_lng',
            type: 'real',
            format: ''
          },
          {
            name: 'boolean',
            type: 'boolean',
            format: ''
          },
          {
            name: 'num_boolean',
            type: 'boolean',
            format: ''
          },
          {
            name: 'int_num',
            type: 'integer',
            format: ''
          },
          {
            name: 'boolean_1',
            type: 'boolean',
            format: ''
          },
          {
            name: 'name',
            type: 'string',
            format: ''
          }
        ]
      }
    }
  ],
  config: {
    version: 'v1',
    config: {
      visState: {
        filters: [],
        layers: [
          {
            id: 'k2ghkng',
            type: 'point',
            config: {
              dataId: '8ppj5gfrs',
              label: 'point',
              color: [23, 184, 190, 255],
              columns: {
                lat: 'point_lat',
                lng: 'point_lng',
                altitude: null
              },
              isVisible: true,
              visConfig: {
                radius: 12.5,
                fixedRadius: false,
                opacity: 0.8,
                outline: false,
                thickness: 2,
                colorRange: {
                  name: 'Global Warming',
                  type: 'sequential',
                  category: 'Uber',
                  colors: [
                    '#5A1846',
                    '#900C3F',
                    '#C70039',
                    '#E3611C',
                    '#F1920E',
                    '#FFC300'
                  ]
                },
                radiusRange: [0, 50],
                'hi-precision': false
              },
              textLabel: {
                field: {
                  name: 'name',
                  type: 'string'
                },
                color: [184, 15, 135, 255],
                size: 27,
                offset: [-10, 0],
                anchor: 'end'
              }
            },
            visualChannels: {
              colorField: null,
              colorScale: 'quantile',
              sizeField: null,
              sizeScale: 'linear'
            }
          }
        ],
        interactionConfig: {
          tooltip: {
            fieldsToShow: {
              '8ppj5gfrs': [
                'radius',
                'boolean',
                'num_boolean',
                'int_num',
                'boolean_1'
              ]
            },
            enabled: true
          },
          brush: {
            size: 0.5,
            enabled: false
          }
        },
        layerBlending: 'normal',
        splitMaps: []
      },
      mapState: {
        bearing: 0,
        dragRotate: false,
        latitude: 37.871422572545065,
        longitude: -122.32925002428057,
        pitch: 0,
        zoom: 10.386420916638542,
        isSplit: false
      },
      mapStyle: {
        styleType: 'dark',
        topLayerGroups: {},
        visibleLayerGroups: {
          label: true,
          road: true,
          border: false,
          building: true,
          water: true,
          land: true
        },
        mapStyles: {}
      }
    }
  },
  info: {
    app: 'kepler.gl',
    created_at: 'Tue Oct 02 2018 16:11:32 GMT-0700 (Pacific Daylight Time)'
  }
};

export default class DropboxProvider {
  constructor(clientId, appName, icon = DropboxIcon) {
    // All cloud-providers providers must implement the following properties
    this.name = NAME;
    this.displayName = DISPLAY_NAME;
    this.clientId = clientId;
    this.appName = appName;
    this.icon = icon;
    this.thumbnail = {width: 300, height: 200};

    this._folderLink = `${KEPLER_DROPBOX_FOLDER_LINK}/${appName}`;
    this._path = `/Apps/${window.decodeURIComponent(this.appName)}`;

    // Initialize Dropbox API
    this._initializeDropbox();
  }

  _initializeDropbox() {
    this._dropbox = new Dropbox({fetch: window.fetch});
    this._dropbox.setClientId(this.clientId);
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

    const handleToken = async e => {
      // TODO: add security step to validate which domain the message is coming from
      authWindow.close();
      window.removeEventListener('message', handleToken);
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

      onCloudLoginSuccess();
    };

    window.addEventListener('message', handleToken);
  }

  async loadMap(map) {
    // TODO: implement
    function mockResult() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            map: stateSavedV1,
            mapInfo: {
              title: 'test map',
              description: 'Hello this is my test dropbox map'
            },
            format: 'keplergl'
          });
        }, 100);
      });
    }

    const result =  await mockResult();

    return result;
  }

  async getVisualizations() {
    // list files
    try {
      // https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesListFolder__anchor
      const response = await this._dropbox.filesListFolder({
        path: this._path
      });
      const {pngs, visualizations} = this._parseEntries(response);

      // https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesGetThumbnailBatch__anchor
      const thumbnails = await this._dropbox.filesGetThumbnailBatch({
        entries: Object.values(pngs).map(img => ({
          path: img.path_lower,
          format: 'png',
          size: 'w128h128'
        }))
      });

      // append to visualizations
      thumbnails &&
        thumbnails.entries.forEach(thb => {
          if (thb['.tag'] === 'success') {
            visualizations[
              pngs[thb.metadata.id].title
            ].thumbnail = `data:image/gif;base64,${thb.thumbnail}`;
          }
        });

      // dropbox returns

      return Object.values(visualizations).reverse();
    } catch (error) {
      console.warn(error);
    }
  }

  async _getUser() {
    let response;
    try {
      response = await this._dropbox.usersGetCurrentAccount();
    } catch (error) {
      console.warn(error);
    }

    return this._getUserFromAccount(response);
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

  isConnected() {
    // TODO: Implement
  }

  hasPrivateStorage() {
    // return PRIVATE_STORAGE_ENABLED;
    return true;
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
  async uploadFile({mapData, blob, fileName, isPublic = true}) {

    const metadata = await this._dropbox.filesUpload({
      path: `${this._path}/${fileName || blob.name}`,
      contents: blob
    });

    // save a thumbnail image
    mapData.thumbnail &&
      (await this._dropbox.filesUpload({
        path: `${this._path}/${fileName || blob.name}`.replace('.json', '.png'),
        contents: mapData.thumbnail
      }));

    return isPublic ? await this._shareFile(metadata) : metadata;
  }

  /**
   * It will set access to file to public
   * @param {Object} metadata metadata response from uploading the file
   * @returns {Promise<DropboxTypes.sharing.FileLinkMetadataReference | DropboxTypes.sharing.FolderLinkMetadataReference | DropboxTypes.sharing.SharedLinkMetadataReference>}
   */
  _shareFile(metadata) {
    return this._dropbox
      .sharingCreateSharedLinkWithSettings({
        path: metadata.path_display || metadata.path_lower
      })
      .then(
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
    return url
      ? url.slice(0, url.indexOf('?')).replace(DOMAIN, CORS_FREE_DOMAIN)
      : null;
  }

  _getUserFromAccount(response) {
    return response
      ? (response.name && response.name.abbreviated_name) || response.email
      : null;
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
        const title = name.replace('.json', '');
        const viz = {
          name,
          title,
          path_lower,
          id,
          lastModification: new Date(client_modified).getTime()
        };

        visualizations[title] = viz;
      } else if (name && name.endsWith('.png')) {
        const title = name.replace('.png', '');

        pngs[id] = {
          title,
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
