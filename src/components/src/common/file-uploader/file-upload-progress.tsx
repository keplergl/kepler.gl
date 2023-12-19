// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled, {withTheme} from 'styled-components';
import classnames from 'classnames';
import ProgressBar from '../progress-bar';
import {TruncatedTitleText} from '../styled-components';
import {getError} from '@kepler.gl/utils';
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
