import React from 'react';
import {FileLoading, FileLoadingProgress} from '../../../reducers/vis-state-updaters';

export type FileUploadProps = {
  onFileUpload: (files: File[]) => void;
  validFileExt: string[];
  fileLoading: FileLoading | false;
  fileLoadingProgress: FileLoadingProgress;
  intl: any;
  theme: object;
};

export const WarningMsg: React.Component;

export const FileUpload: React.Component<FileUploadProps>;

export default function FileUploadFactory(): React.Component<FileUploadProps>;
