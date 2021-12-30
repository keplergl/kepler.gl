import React from 'react';

export type UploadButtonProps = {
  onUpload: (files: FileList, event: any) => void;
};

export const UploadButton: React.FC<UploadButtonProps>;
export default UploadButton;
