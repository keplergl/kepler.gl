// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useRef} from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-block;
  color: ${props => props.theme.textColorLT};
  font-size: 12px;
  text-decoration: underline;

  :hover {
    cursor: pointer;
    font-weight: 500;
  }
`;
const inputStyle = {display: 'none'};

interface UploadButtonProps {
  onUpload: (files: FileList, event: any) => void;
  children?: React.ReactNode;
}

/*
Inspired by https://github.com/okonet/react-dropzone/blob/master/src/index.js
*/
/** @type {typeof import('./upload-button').UploadButton} */
const UploadButton: React.FC<UploadButtonProps> = ({onUpload, children}) => {
  const _fileInput = useRef(null);

  const _onClick = useCallback(() => {
    if (_fileInput.current) {
      // @ts-ignore create ref with useRef<HTMLInputElement>
      _fileInput.current.value = null;
      // @ts-ignore create ref with useRef<HTMLInputElement>
      _fileInput.current.click();
    }
  }, [_fileInput]);

  const _onChange = useCallback(
    event => {
      const {
        target: {files}
      } = event;

      if (!files) {
        return;
      }

      onUpload(files, event);
    },
    [onUpload]
  );

  return (
    <Wrapper className="upload-button">
      <input
        type="file"
        ref={_fileInput}
        style={inputStyle}
        onChange={_onChange}
        className="upload-button-input"
      />
      <span className="file-upload__upload-button-span" onClick={_onClick}>
        {children}
      </span>
    </Wrapper>
  );
};

export default UploadButton;
