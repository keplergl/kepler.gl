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
  /** A list of names of supported formats suitable to present to user */
  fileFormatNames: string[];
  /** A list of typically 3 letter extensions (without '.') for file matching */
  fileExtensions: string[];
  isCloudMapLoading: boolean;
  /** Set to true if app wants to do its own file filtering */
  disableExtensionFilter?: boolean;
};

export function LoadDataModalFactory(
  ModalTabs: React.Component,
  FileUpload: React.Component,
  LoadStorageMap: React.Component
): React.Component<LoadDataModalProps>;

export default LoadDataModalFactory;
