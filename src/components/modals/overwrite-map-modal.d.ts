import React from 'react';
import {Provider} from '../../cloud-providers';
import {setExportImageSetting, cleanupExportImage} from '../../actions';

export type OverwriteMapModalProps = {
  mapSaved: string;
  title: string;
  cloudProviders: Provider[];
  isProviderLoading: boolean;
  currentProvider: string;

  // callbacks
  onUpdateImageSetting: typeof setExportImageSetting;
  cleanupExportImage: typeof cleanupExportImage;
};

function OverwriteMapModalFactory(): React.FunctionComponent<OverwriteMapModal>;
export default OverwriteMapModalFactory;
