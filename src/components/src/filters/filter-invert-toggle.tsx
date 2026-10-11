// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {Filter} from '@kepler.gl/types';

import Switch from '../common/switch';
import {Help} from '../common/icons';
import {Tooltip} from '../common/styled-components';

const FilterOutRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const FilterOutHelp = styled.div`
  display: flex;
  align-items: center;
  margin-left: 6px;
  color: ${props => props.theme.labelColor};
  cursor: help;

  &:hover {
    color: ${props => props.theme.textColorHl};
  }
`;

const FilterOutHelpContent = styled.div`
  width: 220px;
`;

type FilterInvertToggleProps = {
  filter: Filter;
  idx: number;
  setFilter: (idx: number, prop: string, value: boolean) => void;
};

const FilterInvertToggle: React.FC<FilterInvertToggleProps> = ({filter, idx, setFilter}) => {
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(idx, 'inverted', event.target.checked);
    },
    [idx, setFilter]
  );

  if (!filter.type) {
    return null;
  }

  const tooltipId = `filter-out-hint-${filter.id}`;

  return (
    <FilterOutRow className="filter-panel__filter-out">
      <Switch
        checked={Boolean(filter.inverted)}
        id={`filter-out-${filter.id}`}
        secondary
        label={<FormattedMessage id="filterManager.filterOut" />}
        onChange={onChange}
      />
      <FilterOutHelp data-testid="filter-out-help" data-tip data-for={tooltipId}>
        <Help height="14px" />
        <Tooltip id={tooltipId} effect="solid" place="top">
          <FilterOutHelpContent>
            <FormattedMessage id="filterManager.filterOutHint" />
          </FilterOutHelpContent>
        </Tooltip>
      </FilterOutHelp>
    </FilterOutRow>
  );
};

export default FilterInvertToggle;
