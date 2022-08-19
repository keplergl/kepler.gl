// Copyright (c) 2022 Uber Technologies, Inc.
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

import React from 'react';
import styled, {withTheme} from 'styled-components';
import classnames from 'classnames';
import ProgressBar from '../progress-bar';
import {TruncatedTitleText} from 'components/common/styled-components';
import {getError} from '../../../utils';
import {FileLoadingProgress} from '@kepler.gl/types';

const StyledFileProgress = styled.div.attrs(props => ({
  className: classnames('file-upload__progress', props.className)
}))`
  color: ${props => props.theme.textColorLT};
  font-size: 12px;
  margin-top: 12px;
  border-image: initial;
  padding: 8px 12px;

  .top-row {
    display: flex;
    justify-content: space-between;
  }

  .file-name {
    font-weight: 500;
  }
  .middle-row {
    margin-top: 6px;
  }
  .bottom-row {
    margin-top: 6px;
    text-align: start;
  }
`;

const StyledProgressWrapper = styled.div.attrs({
  className: 'file-upload__progress__wrapper'
})`
  width: 400px;
`;

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const formatPercent = percent => `${Math.floor(percent * 100)}%`;

interface UploadProgressProps {
  message?: string;
  fileName?: string;
  percent: number;
  error?: any;
  theme: any;
}

/**
 * @param {object} params
 * @param {string} params.message
 * @param {string} params.fileName
 * @param {number} params.percent
 * @param {any} params.error
 * @param {object} params.theme
 */
const UploadProgress = ({message, fileName, percent, error, theme}: UploadProgressProps) => {
  const percentStr = formatPercent(percent);
  const barColor = error ? theme.errorColor : theme.activeColorLT;

  return (
    <StyledFileProgress className="file-upload-progress__message">
      <div className="top-row">
        <TruncatedTitleText className="file-name" title={fileName}>
          {fileName}
        </TruncatedTitleText>
        <div className="percent">{percentStr}</div>
      </div>
      <div className="middle-row">
        <ProgressBar percent={percentStr} barColor={barColor} isLoading theme={theme} />
      </div>
      <div className="bottom-row" style={{color: error ? theme.errorColor : theme.textColorLT}}>
        {error ? getError(error) : message}
      </div>
    </StyledFileProgress>
  );
};

interface FileUploadProgressProps {
  fileLoadingProgress: FileLoadingProgress;
  theme: any;
}

/** @type {React.FunctionComponent<FileUploadProgressProps>} */
const FileUploadProgress = ({fileLoadingProgress, theme}: FileUploadProgressProps) => (
  <StyledContainer>
    <StyledProgressWrapper>
      {Object.values(fileLoadingProgress).map(item => (
        <UploadProgress {...item} key={item.fileName} theme={theme} />
      ))}
    </StyledProgressWrapper>
  </StyledContainer>
);

export default withTheme(FileUploadProgress);
