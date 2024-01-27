// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ReactNode} from 'react';
import styled from 'styled-components';

import {File} from './';

interface FileNameTagProps {
  fontSize: string;
}

const FileNameTag = styled.div<FileNameTagProps>`
  background-color: currentColor;
  border-radius: 1px;
  display: inline-block;
  padding: 0 4px;
  position: absolute;
  top: 45%;
  left: 10%;

  .text {
    color: white;
    font-size: ${props => props.fontSize};
  }
`;

interface FileTypeIconWrapperProps {
  height: string;
}

const FileTypeIconWrapper = styled.div<FileTypeIconWrapperProps>`
  display: inline-block;
  position: relative;
  color: currentColor;
  height: ${props => props.height};
`;

interface FileTypeIconProps {
  ext?: ReactNode;
  height: string;
  fontSize: string;
}

const FileTypeIcon = ({ext, height, fontSize}: FileTypeIconProps) => (
  <FileTypeIconWrapper height={height}>
    <File height={height} />
    <FileNameTag fontSize={fontSize}>
      <div className="text">{ext}</div>
    </FileNameTag>
  </FileTypeIconWrapper>
);

export default FileTypeIcon;
