// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';

import ItemSelector from '../../common/item-selector/item-selector';
import DatasetTagFactory from './dataset-tag';
import {SourceDataSelectorProps} from './types';

SourceDataSelectorContentFactory.deps = [DatasetTagFactory];

function SourceDataSelectorContentFactory(DatasetTag) {
  const DatasetItem = ({value}) => <DatasetTag dataset={value} />;

  const SourceDataSelectorContent = ({
    className,
    datasets,
    dataId,
    inputTheme,
    onSelect,
    defaultValue,
    disabled
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
      <ItemSelector
        className={className}
        inputTheme={inputTheme}
        selectedItems={selectedItems}
        options={dsOptions}
        getOptionValue={'value'}
        filterOption={'label'}
        multiSelect={false}
        onChange={onSelect}
        placeholder={defaultValue}
        disabled={disabled}
        displayOption={'label'}
        DropDownLineItemRenderComponent={DatasetItem}
      />
    );
  };

  return SourceDataSelectorContent;
}

export default SourceDataSelectorContentFactory;
