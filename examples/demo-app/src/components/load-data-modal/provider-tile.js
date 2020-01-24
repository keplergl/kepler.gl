// Copyright (c) 2020 Uber Technologies, Inc.
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
import LogoutIcon from '../icons/logout-icon';

const StyledLabel = styled.div`
  font-weight: 600;
  color: ${props => props.theme.primaryBtnBgd};
`;

const StyledTile = styled.div`
  margin: 0 12px 12px 0;
`;

const StyledTileButton = styled.button`
  width: 124px;
  height: 124px;
  margin-bottom: 12px;
  border: 1px solid ${props => props.isConnected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  background-color: #fff;
  cursor: pointer;
  padding: 0;
  outline: 0;

  :hover {
    border-color: ${props => props.theme.primaryBtnBgd};
  }
`;

const StyledManageOption = styled.a`
  display: block;
  cursor: pointer;
  margin-bottom: 6px;
  color: ${props => props.theme.textColorLT};
  font-size: 11px;
  font-weight: 600;
`;

const StyledLogoutIconOption = styled(LogoutIcon)`
  margin-right: 6px;
  vertical-align: text-top;
`;

const ProviderTile = ({
  Icon,
  isConnected,
  onConnect,
  onLogout
}) => (
  <StyledTile>
    <StyledTileButton onClick={onConnect} isConnected={isConnected()}>
      <Icon height="88px" />
      {isConnected() && <StyledLabel>Connected</StyledLabel>}
    </StyledTileButton>

    {isConnected() &&
      <StyledManageOption onClick={onLogout}>
        <StyledLogoutIconOption />
        Logout
      </StyledManageOption>
    }
  </StyledTile>
);

export default ProviderTile;
