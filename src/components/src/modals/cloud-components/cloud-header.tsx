// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import {Button} from '../../common/styled-components';
import {ArrowLeft} from '../../common/icons';
import {FormattedMessage} from '@kepler.gl/localization';
import styled from 'styled-components';
import {dataTestIds} from '@kepler.gl/constants';
import {Provider} from '@kepler.gl/cloud-providers';

const StyledStorageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 14px;
`;

const StyledBackBtn = styled.a`
  margin-bottom: 16px;
  color: #3a414c;
  cursor: pointer;

  &:hover {
    font-weight: 500;
  }
`;

const LINK_STYLE = {textDecoration: 'underline'};

const Title = styled.span`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  margin-bottom: 16px;

  span {
    text-transform: capitalize;
  }
`;

type CloudHeaderProps = {
  provider: Provider;
  onBack: () => void;
};

export const CloudHeader: React.FC<CloudHeaderProps> = ({provider, onBack}) => {
  const managementUrl = useMemo(() => provider.getManagementUrl(), [provider]);
  return (
    <div data-testid={dataTestIds.cloudHeader}>
      <StyledStorageHeader>
        <StyledBackBtn>
          <Button link onClick={onBack}>
            <ArrowLeft height="14px" />
            <FormattedMessage id={'modal.loadStorageMap.back'} />
          </Button>
        </StyledBackBtn>
        {managementUrl && (
          <a
            key={1}
            href={managementUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={LINK_STYLE}
          >
            {provider.displayName}
          </a>
        )}
      </StyledStorageHeader>
      <Title>
        <span>{provider.displayName}</span>
        <FormattedMessage id={'modal.loadStorageMap.storageMaps'} />
      </Title>
    </div>
  );
};
