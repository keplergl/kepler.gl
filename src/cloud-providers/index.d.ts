import {ComponentType} from 'prop-types';
import {MapData, ExportFileOptions} from 'actions/provider-actions';

export type Millisecond = number;

export type MapListItem = {
  id: string;
  title: string;
  description: string;
  loadParams: any;
  imageUrl?: string;
  lastModification?: Millisecond;
  privateMap?: boolean;
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

interface IconProps {
  height?: number | string;
  width?: number | string;
}

export class Provider {
  constructor(p: ProviderProps);
  name: string;
  displayName: string;
  icon: ComponentType<IconProps>;
  thumbnail: Thumbnail;
  getManagementUrl?: () => string;
  hasPrivateStorage(): boolean;
  hasSharingUrl(): boolean;
  getShareUrl(fullUrl?: boolean): string;
  getMapUrl(fullUrl?: boolean): string;
  getAccessToken(): boolean;
  getUserName(): boolean;
  login(Fn?: any): Promise<any>;
  logout(Fn?: any): Promise<any>;
  uploadMap(p: {mapData: MapData; options: ExportFileOptions}): Promise<any>;
  listMaps(): Promise<MapListItem>;
  downloadMap(param: any): Promose<{map: MapData; format: string}>;
}

export const FILE_CONFLICT_MSG: string;
