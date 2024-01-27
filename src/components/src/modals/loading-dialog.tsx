// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import LoadingSpinner from '../common/loading-spinner';
import {FormattedMessage} from '@kepler.gl/localization';

const StyledSpinner = styled.div`
  text-align: center;

  span {
    margin: 0 auto;
  }
`;

const StyledLoadingDialog = styled.div.attrs({
  className: 'data-loading-dialog'
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  .loading-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading-message {
    margin-left: 32px;
    color: ${props => props.theme.titleColorLT};
    font-weight: 500;
    font-size: 14px;
  }
`;

interface LoadingDialogProps {
  size?: number;
  message?: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({
  size = 64,
  message = 'modal.loadingDialog.loading'
}) => (
  <StyledLoadingDialog>
    <div className="loading-content">
      <StyledSpinner>
        <LoadingSpinner size={size} />
      </StyledSpinner>
      <div className="loading-message">
        <FormattedMessage id={message} />
      </div>
    </div>
  </StyledLoadingDialog>
);

export default LoadingDialog;
