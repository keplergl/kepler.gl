import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {Button} from 'components/common/styled-components';
import FieldSelector from 'components/common/field-selector';
import SourceDataSelectorFactory from 'components/side-panel/common/source-data-selector';

const StyledDatasetSelector = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
`;

SourcePairSelectorFactory.deps = [SourceDataSelectorFactory];

function SourcePairSelectorFactory(SourceDataSelector) {
  const SourcePairSelector = ({idx, filter, datasets, allAvailableFields, setFilter}) => {
    const onFieldSelector = useCallback(field => setFilter(idx, 'name', field.name), [
      idx,
      setFilter
    ]);

    const onSourceDataSelector = useCallback(value => setFilter(idx, 'dataId', value), [
      idx,
      setFilter
    ]);

    const fieldValue = useMemo(() => (Array.isArray(filter.name) ? filter.name[0] : filter.name), [
      filter.name
    ]);

    const hasMultidatasets = useMemo(() => Object.keys(datasets).length > 1, [datasets]);

    return (
      <StyledDatasetSelector>
        <FieldSelector
          inputTheme="secondary"
          fields={allAvailableFields}
          value={fieldValue}
          erasable={false}
          onSelect={onFieldSelector}
        />
        {hasMultidatasets ? (
          <SourceDataSelector
            inputTheme="secondary"
            datasets={datasets}
            dataId={filter.dataId}
            onSelect={onSourceDataSelector}
          />
        ) : null}
        {hasMultidatasets ? (
          <Button className="add-data-source-button" link>
            + Add data source
          </Button>
        ) : null}
      </StyledDatasetSelector>
    );
  };

  SourcePairSelector.displayName = 'SourcePairSelector';

  return React.memo(SourcePairSelector);
}

export default SourcePairSelectorFactory;
