// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType} from 'react';
import styled from 'styled-components';
import {MapIcon} from '../common/icons';
import {StyledExportSection} from '../common/styled-components';
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
