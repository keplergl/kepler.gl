// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
