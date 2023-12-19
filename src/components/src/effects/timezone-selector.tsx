// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import moment from 'moment-timezone';
import styled, {withTheme} from 'styled-components';

import {DEFAULT_TIMEZONE} from '@kepler.gl/constants';

import ItemSelector from '../common/item-selector/item-selector';

const getValue = op => op?.name || DEFAULT_TIMEZONE;

export type TimezoneSelectorProps = {
  selected?: string;
  options?: {name: string}[];
  onSelect: (string) => void;
  theme?: any;
};

const StyledItemSelector = styled(ItemSelector)`
  .item-selector__dropdown {
    padding-left: 30px;
    border-radius: 4px;
  }
  .active {
    border-color: ${props => props.theme.activeColor};
    border-radius: 4px 4px 0px 0px !important;
  }
`;

const defaultTimezones = moment.tz.names().map(name => {
  return {
    name
  };
});

function TimezoneSelectorFactory() {
  const TimezoneTypeSelector: React.FC<TimezoneSelectorProps> = ({
    selected,
    options = defaultTimezones,
    onSelect
  }: TimezoneSelectorProps) => {
    const selectedItems = useMemo(() => {
      return selected ? [{name: selected}] : [];
    }, [selected]);

    return (
      <StyledItemSelector
        selectedItems={selectedItems}
        options={options}
        multiSelect={false}
        disabled={false}
        placeholder="effectManager.timezone"
        onChange={onSelect}
        filterOption="name"
        getOptionValue={getValue}
        displayOption={getValue}
        searchable={true}
        showArrow={true}
      />
    );
  };

  return withTheme(TimezoneTypeSelector);
}

export default TimezoneSelectorFactory;
