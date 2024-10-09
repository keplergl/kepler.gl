// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Upload from './upload';
import {MapData, ExportFileOptions, Millisecond, SavedMap} from '@kepler.gl/types';
import {ComponentType} from 'react';

export type MapItemLoadParams = {
  id: string;
  path: string;
};

export type MapListItem = {
  id: string;
  title: string;
  description: string;
  loadParams: any;
  imageUrl?: string;
  updatedAt?: Millisecond;
  privateMap?: boolean;
};

export type CloudUser = {
  name: string;
  email: string;
  thumbnail?: string;
};

export type Thumbnail = {
  width: number;
  height: number;
};

export type ProviderProps = {
  name?: string;
  displayName?: string;
  icon?: ComponentType<IconProps>;
  thumbnail?: Thumbnail;
};

export interface IconProps {
  height?: string;
  width?: string;
}

const NAME = 'cloud-provider';
const DISPLAY_NAME = 'Cloud Provider';
const THUMBNAIL = {width: 300, height: 200};
const ICON = Upload;
export const KEPLER_FORMAT = 'keplergl';
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
  name: string;
  displayName: string;
  icon: ComponentType<IconProps>;
  thumbnail: Thumbnail;
  isNew = false;

  constructor(props: ProviderProps) {
    this.name = props.name || NAME;
    this.displayName = props.displayName || DISPLAY_NAME;
    this.icon = props.icon || ICON;
    this.thumbnail = props.thumbnail || THUMBNAIL;
  }

  /**
   * Whether this provider support upload map to a private storage. If truthy, user will be displayed with the storage save icon on the top right of the side bar.
   * @returns
   * @public
   */
  hasPrivateStorage(): boolean {
    return true;
  }

  /**
   * Whether this provider support share map via a public url, if truthy, user will be displayed with a share map via url under the export map option on the top right of the side bar
   * @returns
   * @public
   */
  hasSharingUrl(): boolean {
    return false;
  }

  /**
   * This method is called after user share a map, to display the share url.
   * @param fullUrl - Whether to return the full url with domain, or just the location
   * @returns shareUrl
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getShareUrl(fullUrl = false): string {
    return '';
  }

  /**
   * This method is called by kepler.gl demo app to pushes a new location to history, becoming the current location.
   * @returns mapUrl
   * @public
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMapUrl(loadParams: MapItemLoadParams): string {
    return '';
  }

  /**
   * This method is called to determine whether user already logged in to this provider
   * @public
   * @returns {Promise<string>} return the access token if a user already logged in
   */
  async getAccessToken(): Promise<string | null> {
    return Promise.reject('You must implement getAccessToken');
  }

  /**
   * This method is called to get the user name of the current user. It will be displayed in the cloud provider tile.
   * @public
   * @deprecated please use getUser
   * @returns true if a user already logged in
   */
  getUserName(): string {
    return '';
  }

  /**
   * return a Promise with the user object
   */
  async getUser(): Promise<CloudUser | null> {
    return Promise.reject('You must implement getUser');
  }

  /**
   * This return a standard error that will trigger the overwrite map modal
   */
  getFileConflictError() {
    return new Error(FILE_CONFLICT_MSG);
  }

  /**
   * This method will be called when user click the login button in the cloud provider tile.
   * Upon login success and return the user Object {name, email, abbreviated}
   * @public
   */
  async login() {
    return Promise.reject(new Error('you must implement the `login` method'));
  }

  /**
   * This method will be called when user click the logout button under the cloud provider tile.
   * Upon login success
   * @public
   */
  async logout(): Promise<void> {
    return Promise.reject(new Error('you must implement the `logout` method'));
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
  async uploadMap({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mapData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options = {}
  }: {
    mapData: MapData;
    options: ExportFileOptions;
  }): Promise<MapListItem> {
    return Promise.reject('You must implement uploadMap');
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
   *        updatedAt: 1582677787000,
   *        privateMap: false,
   *        loadParams: {}
   *      }
   *    ];
   *  }
   */
  async listMaps(): Promise<MapListItem[]> {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async downloadMap(loadParams): Promise<{map: SavedMap; format: string}> {
    return Promise.reject('You must implement downloadMap');
  }

  /**
   * @return {string} return the storage location url for the current provider
   * @public
   */
  getManagementUrl(): string {
    throw new Error('You must implement getManagementUrl');
  }

  /**
   * @typedef {Object} Viz
   * @property {string} id - An unique id
   * @property {string} title - The title of the map
   * @property {string} description - The description of the map
   * @property {string} imageUrl - The imageUrl of the map
   * @property {number} updatedAt - An epoch timestamp in milliseconds
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
