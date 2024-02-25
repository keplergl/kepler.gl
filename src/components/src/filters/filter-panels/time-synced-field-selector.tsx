// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import FieldTokenFactory from '../../common/field-token';

const StyledSyncTimeHeader = styled.div`
  color: ${props => props.theme.subtextColor};
  flex: 1;
  cursor: auto;
  display: grid;
  align-items: center;
  grid-column-gap: 8px;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
`;

TimeSyncedFieldSelectorFactory.deps = [FieldTokenFactory];

function TimeSyncedFieldSelectorFactory(FieldToken) {
  const TimeSyncedFieldSelector = () => (
    <StyledSyncTimeHeader>
      <FieldToken type={ALL_FIELD_TYPES.timestamp} />
      <span>Synced</span>
    </StyledSyncTimeHeader>
  );

  return TimeSyncedFieldSelector;
}

export default TimeSyncedFieldSelectorFactory;
