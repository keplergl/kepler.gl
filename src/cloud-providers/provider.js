// Copyright (c) 2021 Uber Technologies, Inc.
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

import {Upload} from 'components/common/icons';

const NAME = 'cloud-provider';
const DISPLAY_NAME = 'Cloud Provider';
const THUMBNAIL = {width: 300, height: 200};
const ICON = Upload;
export const FILE_CONFLICT_MSG = 'file_conflict';
/**
 * The default provider class
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.displayName
 * @param {React.Component} props.icon - React element
 * @param {object} props.thumbnail - thumbnail size object
 * @param {number} props.thumbnail.width - thumbnail width in pixels
 * @param {number} props.thumbnail.height - thumbnail height in pixels
 * @public
 * @example
 *
 * const myProvider = new Provider({
 *  name: 'foo',
 *  displayName: 'Foo Storage'
 *  icon: Icon,
 *  thumbnail: {width: 300, height: 200}
 * })
 */
export default class Provider {
  constructor(props) {
    this.name = props.name || NAME;
    this.displayName = props.displayName || DISPLAY_NAME;
    this.icon = props.icon || ICON;
    this.thumbnail = props.thumbnail || THUMBNAIL;
  }

  /**
   * Whether this provider support upload map to a private storage. If truthy, user will be displayed with the storage save icon on the top right of the side bar.
   * @returns {boolean}
   * @public
   */
  hasPrivateStorage() {
    return true;
  }

  /**
   * Whether this provider support share map via a public url, if truthy, user will be displayed with a share map via url under the export map option on the top right of the side bar
   * @returns {boolean}
   * @public
   */
  hasSharingUrl() {
    return true;
  }

  /**
   * This method is called after user share a map, to display the share url.
   * @param {boolean} fullUrl - Whether to return the full url with domain, or just the location
   * @returns {string} shareUrl
   * @public
   */
  getShareUrl(fullUrl = false) {
    return '';
  }

  /**
   * This method is called by kepler.gl demo app to pushes a new location to history, becoming the current location.
   * @param {boolean} fullURL - Whether to return the full url with domain, or just the location
   * @returns {string} mapUrl
   * @public
   */
  getMapUrl(fullURL = true) {
    return '';
  }

  /**
   * This method is called to determine whether user already logged in to this provider
   * @public
   * @returns {boolean} true if a user already logged in
   */
  getAccessToken() {
    return true;
  }

  /**
   * This method is called to get the user name of the current user. It will be displayed in the cloud provider tile.
   * @public
   * @returns {string} true if a user already logged in
   */
  getUserName() {
    return '';
  }

  /**
   * This return a standard error that will trigger the overwrite map modal
   */
  getFileConflictError() {
    return new Error(FILE_CONFLICT_MSG);
  }

  /**
   * This method will be called when user click the login button in the cloud provider tile.
   * Upon login success, `onCloudLoginSuccess` has to be called to notify kepler.gl UI
   * @param {function} onCloudLoginSuccess - callbacks to be called after login success
   * @public
   */
  async login(onCloudLoginSuccess) {
    onCloudLoginSuccess();
    return;
  }

  /**
   * This method will be called when user click the logout button under the cloud provider tile.
   * Upon login success, `onCloudLoginSuccess` has to be called to notify kepler.gl UI
   * @param {function} onCloudLogoutSuccess - callbacks to be called after logout success
   * @public
   */
  async logout(onCloudLogoutSuccess) {
    onCloudLogoutSuccess();
    return;
  }

  /**
   * This method will be called to upload map for saving and sharing. Kepler.gl will package map data, config, title, description and thumbnail for upload to storage.
   * With the option to overwrite already saved map, and upload as private or public map.
   *
   * @param {Object} param
   * @param {Object} param.mapData - the map object
   * @param {Object} param.mapData.map - {datasets. config, info: {title, description}}
   * @param {Blob} param.mapData.thumbnail - A thumbnail of current map. thumbnail size can be defined by provider by this.thumbnail
   * @param {object} [param.options]
   * @param {boolean} [param.options.overwrite] - whether user choose to overwrite already saved map under the same name
   * @param {boolean} [param.options.isPublic] - whether user wish to share the map with others. if isPublic is truthy, kepler will call this.getShareUrl() to display an URL they can share with others
   * @public
   */
  async uploadMap({mapData, options = {}}) {
    return;
  }

  /**
   * This method is called to get a list of maps saved by the current logged in user.
   * @returns visualizations an array of Viz objects
   * @public
   * @example
   *  async listMaps() {
   *    return [
   *      {
   *        id: 'a',
   *        title: 'My map',
   *        description: 'My first kepler map',
   *        imageUrl: 'http://',
   *        lastModification: 1582677787000,
   *        privateMap: false,
   *        loadParams: {}
   *      }
   *    ];
   *  }
   */
  async listMaps() {
    return [];
  }

  /**
   * This method will be called when user select a map to load from the storage map viewer
   * @param {*} loadParams - the loadParams property of each visualization object
   * @returns mapResponse - the map object containing dataset config info and format option
   * @public
   * @example
   * async downloadMap(loadParams) {
   *  const mockResponse = {
   *    map: {
   *      datasets: [],
   *      config: {},
   *      info: {
   *        app: 'kepler.gl',
   *        created_at: ''
   *        title: 'test map',
   *        description: 'Hello this is my test dropbox map'
   *      }
   *    },
   *    // pass csv here if your provider currently only support save / load file as csv
   *    format: 'keplergl'
   *  };
   *
   *  return downloadMap;
   * }
   */
  async downloadMap(loadParams) {
    return;
  }

  /**
   * @typedef {Object} Viz
   * @property {string} id - An unique id
   * @property {string} title - The title of the map
   * @property {string} description - The description of the map
   * @property {string} imageUrl - The imageUrl of the map
   * @property {number} lastModification - An epoch timestamp in milliseconds
   * @property {boolean} privateMap - Optional, whether if this map is private to the user, or can be accessed by others via URL
   * @property {*} loadParams - A property to be passed to `downloadMap`
   * @public
   */

  /**
   * The returned object of `downloadMap`. The response object should contain: datasets: [], config: {}, and info: {}
   * each dataset object should be {info: {id, label}, data: {...}}
   * to inform how kepler should process your data object, pass in `format`
   * @typedef {Object} MapResponse
   * @property {Object} map
   * @property {Array<Object>} map.datasets
   * @property {Object} map.config
   * @property {Object} map.info
   * @property {string} format - one of 'csv': csv file string, 'geojson': geojson object, 'row': row object, 'keplergl': datasets array saved using KeplerGlSchema.save
   * @public
   */
}
