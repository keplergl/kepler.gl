// Copyright (c) 2018 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import styled from 'styled-components';
import AuthHandlerTile from './auth-handler-tile';
import StatusPanel from './status-panel';
import DropboxHandler from '../../utils/dropbox';
import { KEPLER_DISCLAIMER } from "../../constants/default-settings";

const StyledWrapper = styled.div`
  flex-grow: 1;
  font-family: ff-clan-web-pro,'Helvetica Neue',Helvetica,sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;
`;

const StyledDescription = styled.div`
  margin-bottom: 24px;
  
  .title {
    font-size: 24px;
    color: #3A414C;
    margin-bottom: 10px;
    position: relative;
    z-index: 10003;
  }
  .subtitle {
    color: ${props => props.theme.textColor};
    font-size: 11px;
  }
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class CloudStorage extends Component {
  render() {
    const {authTokens, isLoading, info, onExportToDropbox} = this.props;

    return (
      <StyledWrapper>
        <StyledDescription>
          {KEPLER_DISCLAIMER}
        </StyledDescription>
        <StyledList>
          {!isLoading && [DropboxHandler].map((handler, index) => (
            <AuthHandlerTile
              key={index}
              token={authTokens && authTokens[handler.name]}
              isLoading={isLoading}
              metadata={info && info.metadata}
              onExportToDropbox={onExportToDropbox}
            />
          ))}
        </StyledList>
        {isLoading && (<StatusPanel isLoading={isLoading} {...info} />)}
      </StyledWrapper>
    );
  }
};

export default CloudStorage;
