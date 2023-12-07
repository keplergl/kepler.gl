// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import ItemSelector from '../common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from '../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {SingleSelectFilterProps} from './types';

export default function SingleSelectFilterFactory() {
  const SingleSelectFilter: React.FC<SingleSelectFilterProps> = ({filter, setFilter}) => (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage id={'misc.valueEquals'} />
      </PanelLabel>
      <ItemSelector
        selectedItems={filter.value}
        placeholder="placeholder.selectValue"
        options={filter.domain}
        multiSelect={false}
        searchable={false}
        displayOption={d => String(d)}
        getOptionValue={d => d}
        onChange={setFilter}
        inputTheme="secondary"
      />
    </SidePanelSection>
  );

  SingleSelectFilter.displayName = 'SingleSelectFilter';

  return SingleSelectFilter;
}
