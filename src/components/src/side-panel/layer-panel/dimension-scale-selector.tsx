// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import ItemSelector from '../../common/item-selector/item-selector';
import {FormattedMessage} from '@kepler.gl/localization';
import {camelize} from '@kepler.gl/utils';

type DimensionScaleSelectorProps = {
  label: string;
  onSelect: (
    val: readonly (string | number | boolean | object)[] | string | number | boolean | object | null
  ) => void;
  options: string[];
  scaleType?: string;
  disabled?: boolean;
};

const DimensionScaleSelector: React.FC<DimensionScaleSelectorProps> = ({
  label,
  onSelect,
  options,
  scaleType,
  disabled = false
}) => {
  return (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage
          id={label ? `scale.${camelize(label)}` : 'misc.scale'}
          defaultMessage={label}
        />
      </PanelLabel>
      <ItemSelector
        disabled={disabled}
        selectedItems={scaleType}
        options={options}
        multiSelect={false}
        searchable={false}
        onChange={onSelect}
      />
    </SidePanelSection>
  );
};

export default DimensionScaleSelector;
