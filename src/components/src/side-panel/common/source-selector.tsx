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
  const StyledSourceDataSelectorContent = styled.div`
    margin-bottom: 2px;

    .item-selector__dropdown {
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  `;

  const StyledFieldSelector = styled.div`
    .item-selector__dropdown {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
    }
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
        <StyledSourceDataSelectorContent>
          <SourceDataSelectorContent
            inputTheme={inputTheme}
            datasets={datasets}
            disabled={disabled}
            dataId={dataId}
            onSelect={onSelectDataset}
          />
        </StyledSourceDataSelectorContent>
        {dataId && (
          <StyledFieldSelector>
            <FieldSelector
              inputTheme={inputTheme}
              fields={datasetFields}
              value={fieldValue}
              erasable={false}
              onSelect={onFieldSelector}
            />
          </StyledFieldSelector>
        )}
      </StyledSourceContainer>
    );
  };

  SourceSelector.displayName = 'SourceSelector';

  return SourceSelector;
}

export default SourceSelectorFactory;
