import React from 'react';
import {Provider} from '../../cloud-providers';
import {MapInfo, ExportImage} from '../../reducers';
import {
  setMapInfo
} from '../../actions';
import {ImageModalContainerProps} from './image-modal-container';
import {ProviderModalContainerProps} from './provider-modal-container';

type CharacterLimits = {
  title: number;
  description: number;
};

export type SaveMapModalProps = {
  mapInfo: MapInfo;
  exportImage: ExportImage;
  cloudProviders: Provider[];
  isProviderLoading: boolean;
  currentProvider?: string;
  providerError?: any;
  characterLimits?: CharacterLimits;

  // callbacks
  onSetCloudProvider: ProviderModalContainerProps['onSetCloudProvider'];
  onUpdateImageSetting: ImageModalContainerProps['onUpdateImageSetting'];
  cleanupExportImage: onUpdateImageSetting['cleanupExportImage'];
  onSetMapInfo: typeof setMapInfo;
};

function LoadDataModalFactory(): React.FunctionComponent<SaveMapModalProps>;
export default LoadDataModalFactory;
