// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import {FormattedMessage} from '@kepler.gl/localization';

import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import SourceDataSelectorContentFactory from './source-data-selector-content';
import {SourceDataSelectorProps} from './types';

SourceDataSelectorFactory.deps = [SourceDataSelectorContentFactory];

export default function SourceDataSelectorFactory(
  DataSourceSelectorContent: ReturnType<typeof SourceDataSelectorContentFactory>
): React.FC<SourceDataSelectorProps> {
  const SourceDataSelector: React.FC<SourceDataSelectorProps> = React.memo(
    ({
      dataId,
      datasets,
      disabled,
      onSelect,
      defaultValue = 'Select A Dataset',
      inputTheme
    }: SourceDataSelectorProps) => (
      <SidePanelSection className="data-source-selector">
        <PanelLabel>
          <FormattedMessage id={'misc.dataSource'} />
        </PanelLabel>
        <DataSourceSelectorContent
          inputTheme={inputTheme}
          datasets={datasets}
          dataId={dataId}
          onSelect={onSelect}
          defaultValue={defaultValue}
          disabled={disabled}
        />
      </SidePanelSection>
    )
  );

  SourceDataSelector.displayName = 'SourceDataSelector';
  return SourceDataSelector;
}
