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

import React from 'react';
import styled from 'styled-components';
import LoadingSpinner from 'components/common/loading-spinner';
import {FormattedMessage} from 'localization';

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

const LoadingDialog = ({size = 64, message = 'modal.loadingDialog.loading'}) => (
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
