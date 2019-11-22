// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {useCallback} from 'react';
import styled from 'styled-components';

const StyledTileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  border: 1px solid ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  color: ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  cursor: pointer;
  font-weight: 500;
  width: 120px;
  height: 168px;
  background-color: #ffffff;
  margin-right: 12px;

  :hover {
    color: ${props => props.available && props.theme.primaryBtnBgd};
    border: 1px solid ${props => props.available && props.theme.primaryBtnBgd};
  }
`;

const StyledCloudName = styled.div`
  font-size: 12px;
  margin-top: 12px;
  margin-bottom: 4px;
`;

const StyledTile = styled.div`
  width: 64px;
  height: 92px;
`;

const TileButton = styled.button`
  background-color: transparent;
  border-width: 0;
  cursor: pointer;
  padding: 0;
  outline: 0;
`;

const StyledAction = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
  text-align: center;
  ul {
    padding-left: 12px;
  }
`;

const StyledUserName = styled.div`
  font-size: 11px;
  margin-top: 8px;
  text-align: center;
  color: ${props => props.theme.primaryBtnActBgd};
  overflow: hidden;
  width: 100px;
  text-overflow: ellipsis;
`;

const CloudTile = ({token, onExport, onLogin, Icon, name, userName}) => {
  const onExportCallback = useCallback(() => onExport(name), [onExport, name]);

  return (
    <StyledTileWrapper onClick={token ? onExportCallback : onLogin}>
      <StyledCloudName>{name}</StyledCloudName>
      <StyledTile>
          <TileButton>
            <Icon height="64px" />
            <StyledAction>{token ? 'Upload' : 'Login'}</StyledAction>
          </TileButton>
      </StyledTile>
      {userName && (
        <StyledUserName>{userName}</StyledUserName>
      )}
    </StyledTileWrapper>
  );
};

export default CloudTile;
