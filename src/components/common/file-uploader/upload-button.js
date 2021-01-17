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

import React, {Component, createRef} from 'react';
import styled from 'styled-components';

/**
@typedef {{
  onUpload: (files: FileList, event: any) => void;
}} UploadButtonProps
*/

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
/*
Inspired by https://github.com/okonet/react-dropzone/blob/master/src/index.js
*/
/** @augments React.Component<UploadButtonProps> */
export class UploadButton extends Component {
  _fileInput = createRef();

  _onClick = () => {
    this._fileInput.current.value = null;
    this._fileInput.current.click();
  };

  _onChange = event => {
    const {
      target: {files}
    } = event;

    if (!files) {
      return;
    }

    this.props.onUpload(files, event);
  };

  render() {
    return (
      <Wrapper className="upload-button">
        <input
          type="file"
          ref={this._fileInput}
          style={{display: 'none'}}
          onChange={this._onChange}
          className="upload-button-input"
        />
        <span className="file-upload__upload-button-span" onClick={this._onClick}>
          {this.props.children}
        </span>
      </Wrapper>
    );
  }
}

export default UploadButton;
