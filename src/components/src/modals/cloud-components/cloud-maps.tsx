// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';
import LoadingDialog from '../loading-dialog';
import {FormattedMessage} from '@kepler.gl/localization';
import {CloudItem} from './cloud-item';
import {InputLight} from '../../common/styled-components';
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
  const [search, setSearch] = useState('');
  const intl = useIntl();

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

  const query = search.trim().toLowerCase();
  const visibleMaps = query ? maps?.filter(vis => vis.title?.toLowerCase().includes(query)) : maps;
  const searchLabel = intl.formatMessage({
    id: 'modal.loadStorageMap.searchMaps',
    defaultMessage: 'Search saved maps by title'
  });

  return (
    <>
      {maps?.length > 0 && (
        <InputLight
          type="search"
          aria-label={searchLabel}
          placeholder={searchLabel}
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
      )}
      <StyledFlexContainer>
        {visibleMaps?.length ? (
          visibleMaps.map(vis => (
            <CloudItem
              key={vis.id}
              onClick={() => onSelectMap(provider, vis)}
              provider={provider}
              vis={vis}
            />
          ))
        ) : maps?.length ? (
          <div className="visualization-list__message" role="status">
            <FormattedMessage id="modal.loadStorageMap.noMatchingMaps" />
          </div>
        ) : (
          <div className="visualization-list__message">
            <FormattedMessage id="modal.loadStorageMap.noSavedMaps" />
          </div>
        )}
      </StyledFlexContainer>
    </>
  );
};
