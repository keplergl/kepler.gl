import React from 'react';

export type FileDropProps = {
  dropEffect?: 'copy' | 'move' | 'link' | 'none';
  frame?: typeof document | typeof window | HTMLElement;
  className?: string;
  targetClassName?: string;
  draggingOverFrameClassName?: string;
  draggingOverTargetClassName?: string;
  onDragOver?: (event: any) => void;
  onDragLeave?: (event: any) => void;
  onDrop?: (fileList: FileList, event: any) => void;
  onFrameDragEnter?: (event: any) => void;
  onFrameDragLeave?: (event: any) => void;
  onFrameDrop?: (event: any) => void;
};

const FileDrop: React.FunctionComponent<FileDropProps>;
export default FileDrop;
