import React from 'react';
import styled from 'styled-components';
import ProgressBar from '../progress-bar';

const StyledFileProgress = styled.div.attrs({
  className: 'file-upload__progress'
})`
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

  .percent {
    color: ${props => props.theme.subtextColorLT};
  }

  .bottone-row {
    margin-top: 6px;
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
const UploadProgress = ({message, fileName, percent, error}) => {
  const percentStr = formatPercent(percent);
  return (
    <StyledFileProgress>
      <div className="top-row">
        <div className="file-name">{fileName}</div>
        <div className="percent">{percentStr}</div>
      </div>
      <div className="bottone-row">
        <ProgressBar percent={percentStr} isLoading />
      </div>
    </StyledFileProgress>
  );
};

const FileUploadProgress = ({fileLoadingProgress}) => (
  <StyledContainer>
    <StyledProgressWrapper>
      {Object.values(fileLoadingProgress).map(item => (
        <UploadProgress {...item} key={item.fileName} />
      ))}
    </StyledProgressWrapper>
  </StyledContainer>
);

export default FileUploadProgress;
