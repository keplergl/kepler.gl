// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React from 'react';
import {ChangeEvent, MouseEvent, useCallback, useRef} from 'react';

import {Button, cn} from '@sqlrooms/ui';
import {FolderUp} from 'lucide-react';

const inputStyle = {display: 'none'};

type FileDropInputProps = {
  onFileDrop: (files: FileList) => void;
  children?: React.ReactNode;
  className?: string;
};
export const FileDropInput: React.FC<FileDropInputProps> = ({onFileDrop, children, className}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const onClick = useCallback(
    (event: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      event.stopPropagation();

      if (fileInput.current) {
        fileInput.current.value = '';
        fileInput.current.click();
      }
    },
    [fileInput]
  );

  const onChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        onFileDrop(event.target.files);
      }
    },
    [onFileDrop]
  );

  return (
    <div
      className={cn(
        'text-muted-foreground hover:text-foreground flex h-full w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-700 p-5 transition-colors duration-200 hover:border-gray-500',
        className
      )}
      onClick={onClick}
      onDrop={event => {
        event.preventDefault();
        onFileDrop(event.dataTransfer.files);
      }}
      onDragOver={event => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('border-gray-500');
        event.currentTarget.classList.add('text-foreground');
      }}
      onDragLeave={event => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('border-gray-500');
        event.currentTarget.classList.remove('text-foreground');
      }}
    >
      <div className="relative flex h-full flex-col">
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <div className="bg-muted flex h-[36px] w-[36px] items-center justify-center rounded-[18px]">
            <FolderUp height={'18px'} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInput}
              style={inputStyle}
              onChange={onChangeInput}
              className="upload-button-input"
            />
            <p className="text-sm">Drag &amp; Drop your files or </p>
            <Button variant="link" className="h-8 px-0 py-0" onClick={onClick}>
              browse
            </Button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
