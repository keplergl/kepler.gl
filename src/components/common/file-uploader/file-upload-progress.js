import React from 'react';
import styled from 'styled-components';
import ProgressBar from '../progress-bar';

const StyledFileProgress = styled.div`
  color: ${props => props.theme.textColorLT};
  font-size: 12px;

  .file-progress {
    display: flex;
    justify-content: space-between;
  }

  .file-name {
    font-weight: 500;
  }

  .percent {
    color: ${props => props.theme.subtextColorLT};
  }

  .progress {
    margin-top: 12px;
  }
`;
const UploadProgress = ({message, fileName, percent, error}) => (
  <StyledFileProgress>
    <div className="file-progress">
      <div className="file-name">{fileName}</div>
      <div className="percent">{percent}</div>
    </div>
    <ProgressBar percent={percent} isLoading />
  </StyledFileProgress>
);

const FileUploadProgress = ({fileLoadingProgress}) =>
  Object.values(fileLoadingProgress).map(item => <UploadProgress {...item} key={item.fileName} />);

export default FileUploadProgress;
