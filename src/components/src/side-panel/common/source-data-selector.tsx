// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import ItemSelector from '../../common/item-selector/item-selector';
import DatasetTagFactory from './dataset-tag';
import {FormattedMessage} from '@kepler.gl/localization';
import {DatasetItemProps, SourceDataSelectorProps} from './types';

const defaultPlaceHolder = 'Select A Dataset';

SourceDataSelectorFactory.deps = [DatasetTagFactory];

export default function SourceDataSelectorFactory(
  DatasetTag: ReturnType<typeof DatasetTagFactory>
): React.FC<SourceDataSelectorProps> {
  const DatasetItem = ({value}: DatasetItemProps) => <DatasetTag dataset={value} />;

  const SourceDataSelector: React.FC<SourceDataSelectorProps> = ({
    dataId,
    datasets,
    disabled,
    onSelect,
    defaultValue,
    inputTheme
  }: SourceDataSelectorProps) => {
    const dsOptions = useMemo(
      () =>
        Object.values(datasets).map(ds => ({
          label: ds.label,
          value: ds.id,
          color: ds.color
        })),
      [datasets]
    );

    const selectedItems = useMemo(
      () => (dataId ? ((Array.isArray(dataId) && dataId) || [dataId]).map(id => datasets[id]) : []),
      [dataId, datasets]
    );

    return (
      <SidePanelSection className="data-source-selector">
        <PanelLabel>
          <FormattedMessage id={'misc.dataSource'} />
        </PanelLabel>
        <ItemSelector
          inputTheme={inputTheme}
          selectedItems={selectedItems}
          options={dsOptions}
          getOptionValue={'value'}
          filterOption={'label'}
          multiSelect={false}
          onChange={onSelect}
          placeholder={defaultValue}
          disabled={Boolean(disabled)}
          displayOption={'label'}
          DropDownLineItemRenderComponent={DatasetItem}
        />
      </SidePanelSection>
    );
  };

  SourceDataSelector.defaultProps = {
    defaultValue: defaultPlaceHolder
  };
  return SourceDataSelector;
}
