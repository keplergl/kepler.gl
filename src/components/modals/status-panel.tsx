// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {ComponentType} from 'react';
import styled from 'styled-components';
import {MapIcon} from 'components/common/icons';
import {StyledExportSection} from 'components/common/styled-components';
import ErrorDisplay from './error-display';
import {FormattedMessage} from '@kepler.gl/localization';
import {IconProps} from '@kepler.gl/cloud-providers';

const StyledUploader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const StyledMapIcon = styled.div`
  color: ${props => props.theme.textColorLT};
  margin-right: 16px;
  margin-top: 4px;
`;

const StyledSvg = styled.svg`
  margin-right: 16px;

  line {
    stroke: ${props => props.theme.selectBorderColorLT};
    stroke-width: 4;
    stroke-linecap: square;
    stroke-dasharray: 5 12;
    animation: dash-animation 25s infinite linear;
  }
  circle {
    fill: ${props => props.theme.selectBorderColorLT};
  }

  @keyframes dash-animation {
    to {
      stroke-dashoffset: -1000;
    }
  }
`;

const Line = () => (
  <StyledSvg height="5px" width="150px">
    <line x1="0" y1="4" x2="150" y2="4" />
  </StyledSvg>
);

interface UploadAnimationProps {
  icon?: ComponentType<IconProps> | null;
}

export const UploadAnimation: React.FC<UploadAnimationProps> = props => (
  <StyledUploader>
    <StyledMapIcon>
      <MapIcon height="48px" />
    </StyledMapIcon>
    <Line />
    {props.icon && <props.icon height="64px" />}
  </StyledUploader>
);

interface StatusPanelProps {
  error?: string | null;
  isLoading?: boolean;
  providerIcon?: ComponentType<IconProps> | null;
}

const StatusPanel: React.FC<StatusPanelProps> = ({error, isLoading, providerIcon}) => (
  <StyledExportSection>
    <div className="description">
      <div className="title">
        {isLoading ? (
          <FormattedMessage id={'modal.statusPanel.mapUploading'} />
        ) : error ? (
          <FormattedMessage id={'modal.statusPanel.error'} />
        ) : null}
      </div>
    </div>
    <div className="selection">
      {isLoading && <UploadAnimation icon={providerIcon} />}
      {error && <ErrorDisplay error={error} />}
    </div>
  </StyledExportSection>
);

export default StatusPanel;
