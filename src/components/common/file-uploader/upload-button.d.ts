import React from 'react';

export type UploadButtonProps = {
  onUpload: (files: FileList, event: any) => void;
};

export const UploadButton: React.ElementType<UploadButtonProps>;
export default UploadButton;
