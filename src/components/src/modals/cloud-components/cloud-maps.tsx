// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import LoadingDialog from '../loading-dialog';
import {FormattedMessage} from '@kepler.gl/localization';
import {CloudItem} from './cloud-item';
import {FlexContainer} from '../../common/flex-container';

const StyledSpinner = styled.div`
  text-align: center;
  span {
    margin: 0 auto;
  }
`;

const StyledFlexContainer = styled(FlexContainer)`
  justify-content: flex-start;
  flex-wrap: wrap;
`;

export const CloudMaps = ({provider, onSelectMap, isLoading, maps, error}) => {
  if (error) {
    return <div>Error while fetching maps: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <StyledSpinner>
        <LoadingDialog size={64} />
      </StyledSpinner>
    );
  }

  return (
    <StyledFlexContainer>
      {(maps ?? []).length ? (
        maps.map(vis => (
          <CloudItem key={vis.id} onClick={() => onSelectMap(provider, vis)} vis={vis} />
        ))
      ) : (
        <div className="visualization-list__message">
          <FormattedMessage id={'modal.loadStorageMap.noSavedMaps'} />
        </div>
      )}
    </StyledFlexContainer>
  );
};
