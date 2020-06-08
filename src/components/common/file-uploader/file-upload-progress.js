import React from 'react';
import styled, {withTheme} from 'styled-components';
import ProgressBar from '../progress-bar';
import {TrancatedTitleText} from 'components/common/styled-components';
import {getError} from 'utils/utils';

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
const UploadProgress = ({message, fileName, percent, error, theme}) => {
  const percentStr = formatPercent(percent);
  const barColor = error ? theme.errorColor : theme.activeColorLT;

  return (
    <StyledFileProgress>
      <div className="top-row">
        <TrancatedTitleText className="file-name" title={fileName}>{fileName}</TrancatedTitleText>
        <div className="percent">{percentStr}</div>
      </div>
      <div className="middle-row">
        <ProgressBar percent={percentStr} barColor={barColor} isLoading/>
      </div>
      <div className="bottom-row" style={{color: error ? theme.errorColor : theme.textColorLT}}>
        {error ? getError(error) : message}
      </div>
    </StyledFileProgress>
  );
};

const FileUploadProgress = ({fileLoadingProgress, theme}) => (
  <StyledContainer>
    <StyledProgressWrapper>
      {Object.values(fileLoadingProgress).map(item => (
        <UploadProgress {...item} key={item.fileName} theme={theme}/>
      ))}
    </StyledProgressWrapper>
  </StyledContainer>
);

export default withTheme(FileUploadProgress);
