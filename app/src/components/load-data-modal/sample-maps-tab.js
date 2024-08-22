// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {Icons} from '@kepler.gl/components';
import {media} from '@kepler.gl/styles';
import {FormattedMessage} from 'react-intl';

import {ASSETS_URL} from '../../constants/default-settings';

const StyledMapIcon = styled.div`
  background-image: url('${ASSETS_URL}icon-demo-map.jpg');
  background-repeat: no-repeat;
  background-size: 64px 48px;
  width: 64px;
  height: 48px;
  border-radius: 2px;

  ${media.portable`
    width: 48px;
    height: 32px;
  `};
`;

const StyledTrySampleData = styled.div`
  display: flex;
  margin-bottom: 12px;
  flex-grow: 1;
  justify-content: flex-end;
  color: ${props => props.theme.subtextColorLT};

  .demo-map-title {
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .demo-map-label {
    font-size: 11px;

    ${media.portable`
      font-size: 10px;
    `};
  }

  .demo-map-action {
    display: flex;
    font-size: 14px;
    align-items: center;
    color: ${props => props.theme.subtextColorLT};
    cursor: pointer;

    ${media.portable`
      font-size: 12px;
    `};

    :hover {
      color: ${props => props.theme.textColorLT};
    }

    span {
      white-space: nowrap;
    }

    svg {
      margin-left: 10px;
    }
  }
`;

const SampleMapsTab = ({onClick}) => {
  return (
    <StyledTrySampleData className="try-sample-data">
      <StyledMapIcon className="demo-map-icon" />
      <div className="demo-map-title">
        <div className="demo-map-label">
          <FormattedMessage id={'sampleMapsTab.noData'} defaultMessage="No Data" />
        </div>
        <div className="demo-map-action" onClick={onClick}>
          <FormattedMessage id={'sampleMapsTab.trySampleData'} defaultMessage="Sample Maps" />
          <Icons.ArrowRight height="16px" />
        </div>
      </div>
    </StyledTrySampleData>
  );
};

export default SampleMapsTab;
