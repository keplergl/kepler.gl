// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import ItemSelector from '../common/item-selector/item-selector';
import {PanelLabel} from '../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {MultiSelectFilterProps} from './types';

export default function MultiSelectFilterFactory() {
  const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
    filter,
    setFilter,
    allowCustomValues = false
  }) => (
    <div>
      <PanelLabel htmlFor={`filter-${filter.id}`}>
        <FormattedMessage id={'misc.valuesIn'} />
      </PanelLabel>
      <ItemSelector
        options={
          allowCustomValues
            ? Array.from(new Set([...filter.domain, ...filter.value]))
            : filter.domain
        }
        allowCustomValues={allowCustomValues ? 1 : 0}
        selectedItems={filter.value}
        onChange={setFilter}
        closeOnSelect={false}
        toggleSelectedOptions
      />
    </div>
  );
  return MultiSelectFilter;
}
