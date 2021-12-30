// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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

/*
Inspired by https://github.com/okonet/react-dropzone/blob/master/src/index.js
*/
/** @type {typeof import('./upload-button').UploadButton} */
const UploadButton = ({onUpload, children}) => {
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
