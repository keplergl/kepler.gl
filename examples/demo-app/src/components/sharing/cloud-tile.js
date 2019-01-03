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

import React from 'react';
import styled from 'styled-components';

const StyledTileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  color: ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  cursor: pointer;
  font-weight: 500;
  width: 120px;
  height: 120px;
  background-color: #ffffff;

  :hover {
    color: ${props => props.available && props.theme.primaryBtnBgd};
    border: 1px solid ${props => props.available && props.theme.primaryBtnBgd};
  }
`;

const StyledLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
  text-align: center;
  ul {
    padding-left: 12px;
  }
`;

const StyledTile = styled.div`
  width: 64px;
  margin: 12px;
`;

const TileButton = styled.button`
  background-color: transparent;
  border-width: 0;
  cursor: pointer;
  padding: 0;
  outline: 0;
`;

const CloudTile = ({token, onExport, onLogin, Icon}) => {
  return (
    <StyledTileWrapper>
      <StyledTile>
        <div>
          <TileButton onClick={token ? onExport : onLogin}>
            <Icon height="64px" />
            <StyledLabel>{token ? 'Upload' : 'Login'}</StyledLabel>
          </TileButton>
        </div>
      </StyledTile>
    </StyledTileWrapper>
  );
};

export default CloudTile;
