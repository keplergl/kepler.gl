// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {SavedMap, ParsedConfig, SavedConfigV1, MinSavedConfigV1} from './schemas';

/** EXPORT_FILE_TO_CLOUD */
export type MapData = {
  map: SavedMap;
  thumbnail: Blob | null;
};
export type ExportFileOptions = {
  isPublic?: boolean;
  overwrite?: boolean;
};
export type OnErrorCallBack = (error: Error) => any;
export type OnSuccessCallBack = (p: {
  response: any;
  provider: Provider;
  options: ExportFileOptions;
}) => any;

export type ExportFileToCloudPayload = {
  mapData: MapData;
  provider: Provider;
  options: ExportFileOptions;
  onSuccess?: OnSuccessCallBack;
  onError?: OnErrorCallBack;
  closeModal?: boolean;
};

/**
 * Input dataset parsed to addDataToMap
 */
export type ProtoDataset = {
  info: {
    id?: string;
    label?: string;
    format?: string;
    color?: RGBColor;
    type?: string;
    hidden?: boolean;
  };
  data: {
    fields: {
      name: string;
      type?: string;
      format?: string;
      displayName?: string;
      analyzerType?: string;
      id?: string;
    }[];
    rows: any[][];
    cols?: any[];
  };

  // table-injected metadata
  metadata?: any;
  supportedFilterTypes?: string[] | null;
  disableDataOperation?: boolean;
};

export type AddDataToMapOptions = {
  centerMap?: boolean;
  readOnly?: boolean;
  keepExistingConfig?: boolean;
  autoCreateLayers?: boolean;
  autoCreateTooltips?: boolean;
};

export type AddDataToMapPayload = {
  // TODO/ib - internally the code calls `toArray` a couple of layers deep
  // so this function can actually accept both an array and an object
  // recommend dropping such "sloppy typing" and enforcing array type
  // as the field is called `datasets`
  datasets: ProtoDataset[] | ProtoDataset;
  options?: AddDataToMapOptions;
  config?: ParsedConfig | SavedConfigV1 | MinSavedConfigV1;
  info?: Partial<MapInfo>;
};
