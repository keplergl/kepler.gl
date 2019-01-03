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
import MapIcon from '../icons/map-icon';

const containerSize = 128;
const spinnerBorderSize = 10;
const tileWrapperSize = containerSize - 2 * spinnerBorderSize;
const tileSize = containerSize * 0.6;

const spinnerBorderColor = 'rgba(128, 128, 128, 0.2)';

const StyledWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #3A414C;
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  
  .title {
    margin-bottom: 12px;
  }
  
  .subtitle {
    font-size: 12px;
  }
`;

const StyledTileWrapper = styled.div`
  position: relative;
  width: ${containerSize}px;
  height: ${containerSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  
  .loader,
  .loader:after {
    border-radius: 50%;
    width: ${tileWrapperSize}px;
    height: ${tileWrapperSize}px;
  }
  .loader {
    margin: 0 auto;
    font-size: 10px;
    position: absolute;
    text-indent: -9999em;
    border: ${spinnerBorderSize}px solid ${spinnerBorderColor};
    border-left: ${spinnerBorderSize}px solid #D6D6D6;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 2.0s infinite linear;
    animation: load8 2.0s infinite linear;
  }
  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

const StyledTile = styled.div`
  overflow: hidden;
  opacity: 0.9;
  transition: opacity 0.4s ease;
  line-height: 0;
  text-align: center;
  width: ${tileSize}px;
  height: ${tileSize}px;
`;

const StatusPanel = ({filename, isLoading, status, metadata}) => (
  <StyledWrapper>
    <div className="title">
      {`${isLoading ? 'Loading' : status} ${filename} onto your cloud account`}
    </div>
    <StyledTileWrapper>
      <div className="loader" />
      <StyledTile>
        <MapIcon width="100%" height="100%" />
      </StyledTile>
    </StyledTileWrapper>
    <div className="subtitle">
      {metadata && metadata.url}
    </div>

  </StyledWrapper>
);

export default StatusPanel;
