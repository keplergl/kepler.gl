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

import React from 'react';
import styled from 'styled-components';
import DropboxHandler from '../../utils/dropbox';
import DropboxIcon from '../icons/dropbox-icon';
import {getMapSharingLink} from '../../utils/share';

const StyledTileWrapper = styled.div`
  display: flex;
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

const StyledTileMeta = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #3A414C;
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  margin: 12px;
  
  .title {
    margin-bottom: 12px;
  }
`;

const TileButton = styled.button`
  background-color: transparent;
  border-width: 0;
  cursor: pointer;
  padding: 0;
`;

const AuthHandlerTile = ({token, onExportToDropbox, isLoading, metadata}) => {

  const logo = (<DropboxIcon height="64px" />);
  const showMeta = isLoading || (metadata && metadata.url);
  const sharingLink = metadata && metadata.url ?
    getMapSharingLink(metadata.url) : null;

  return (
    <StyledTileWrapper>
      <StyledTile>
        {token ?
          (
            <TileButton onClick={onExportToDropbox}>
              {logo}
            </TileButton>
          ) : (
            <a href={DropboxHandler.authLink()} target="_blank" rel="noopener noreferrer">
              {logo}
            </a>
          )
        }
        <StyledLabel>Dropbox</StyledLabel>
      </StyledTile>
      <StyledTileMeta>
        {showMeta && (
          <div>
            <div className="title">
              <a href={sharingLink} target="_blank" rel="noopener noreferrer">Share your map with other users</a>
            </div>
            <div className="title">
              <a href={metadata.url} target="_blank" rel="noopener noreferrer">Your new saved configuration</a>
            </div>
          </div>
        )}
      </StyledTileMeta>
    </StyledTileWrapper>

  );
};

export default AuthHandlerTile;
