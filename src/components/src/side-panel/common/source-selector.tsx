// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';

import SourceDataSelectorContentFactory from './source-data-selector-content';
import FieldSelectorFactory from '../../common/field-selector';

const StyledSourceContainer = styled.div`
  background-color: #1c2233;
`;

SourceSelectorFactory.deps = [SourceDataSelectorContentFactory, FieldSelectorFactory];

function SourceSelectorFactory(SourceDataSelectorContent, FieldSelector) {
  const StyledFieldSelector = styled(FieldSelector)`
    -webkit-border-bottom-right-radius: 4px;
    -webkit-border-bottom-left-radius: 4px;
    -moz-border-radius-bottomright: 4px;
    -moz-border-radius-bottomleft: 4px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  `;

  const StyledSourceDataSelectorContent = styled(SourceDataSelectorContent)`
    -webkit-border-top-left-radius: 4px;
    -webkit-border-top-right-radius: 4px;
    -moz-border-radius-topleft: 4px;
    -moz-border-radius-topright: 4px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  `;

  const SourceSelector = ({
    className,
    datasets,
    dataId,
    disabled,
    onSelectDataset,
    fields,
    fieldValue,
    onFieldSelector,
    inputTheme
  }) => {
    const datasetFields = useMemo(() => {
      return fields || datasets[dataId]?.fields;
    }, [dataId, datasets, fields]);

    return (
      <StyledSourceContainer className={className}>
        <StyledSourceDataSelectorContent
          inputTheme={inputTheme}
          datasets={datasets}
          disabled={disabled}
          dataId={dataId}
          onSelect={onSelectDataset}
        />
        {dataId && (
          <StyledFieldSelector
            inputTheme={inputTheme}
            fields={datasetFields}
            value={fieldValue}
            erasable={false}
            onSelect={onFieldSelector}
          />
        )}
      </StyledSourceContainer>
    );
  };

  SourceSelector.displayName = 'SourceSelector';

  return SourceSelector;
}

export default SourceSelectorFactory;
