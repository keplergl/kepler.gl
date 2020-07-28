import React from 'react';
import {FileLoading, FileLoadingProgress} from '../../../reducers/vis-state-updaters';

export type FileUploadProps = {
  onFileUpload: (files: File[]) => void;
  fileLoading: FileLoading | false;
  fileLoadingProgress: FileLoadingProgress;
  intl: any;
  theme: object;
  /** A list of names of supported formats suitable to present to user */
  fileFormatNames?: string[];
  /** A list of typically 3 letter extensions (without '.') for file matching */
  fileExtensions?: string[];
  /** Set to true if app wants to do its own file filtering */
  disableExtensionFilter?: boolean;
};

export const WarningMsg: React.Component;

export const FileUpload: React.Component<FileUploadProps>;

export default function FileUploadFactory(): React.Component<FileUploadProps>;
