import React from 'react';
import {FileLoading} from '../../reducers/vis-state-updaters';

export type LoadDataModalProps = {
  // call backs
  onFileUpload: (files: File[]) => void;
  onLoadCloudMap: (provider: any, vis: any) => void;
  fileLoading: FileLoading | false,
  loadingMethods: {
    id: string;
    label: string;
    elementType: React.Component;
    tabElementType?: React.Component;
  }[];
};

export function LoadDataModalFactory(
  ModalTabs: React.Component,
  FileUpload: React.Component,
  LoadStorageMap: React.Component
): React.Component<LoadDataModalProps>;

export default LoadDataModalFactory;
