import React from 'react';
 // TODO - this seems too coupled, better define a type here and adapt FileLoadingProgress to it in the app?
import {FileLoadingProgress} from 'reducers/vis-state-updaters';

export type FileUploadProgressProps = {
  fileLoadingProgress: FileLoadingProgress;
  theme: object;
};

const FileUploadProgress: React.FunctionComponent<FileUploadProgressProps>;
export default FileUploadProgress;
