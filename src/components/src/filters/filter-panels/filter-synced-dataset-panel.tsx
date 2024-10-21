// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

import {Button} from '../../common/styled-components';
import {Add} from '../../common/icons';
import TippyTooltip from '../../common/tippy-tooltip';
import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import SourceSelectorFactory from '../../side-panel/common/source-selector';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';

const TIME_FIELD_ANALYZER_TYPES = ['DATE', 'TIME', 'DATETIME'];

const SyncedDatasetsArea = styled.div`
  display: grid;
  align-items: center;
  grid-auto-rows: min-content;
  grid-auto-flow: row;
`;

const StyledContentTitle = styled.div`
  color: ${props => props.theme.subtextColor};
  margin-bottom: 8px;
`;

const StyledSeparator = styled.div`
  border-left: 1px dashed ${props => props.theme.subtextColor};
  height: 16px;
  margin-left: 8px;
`;

const StyledButton = styled(Button)`
  padding: 2px;
`;

function getDatasetsWithTimeField(datasets) {
  const rv = {};
  for (const id of Object.keys(datasets)) {
    // TODO: change to
    if (datasets[id].fields.some(f => f.type === ALL_FIELD_TYPES.timestamp)) {
      rv[id] = datasets[id];
    }
  }
  return rv;
}

function getTimeFields(dataset) {
  return dataset.fields.filter(f => TIME_FIELD_ANALYZER_TYPES.includes(f.analyzerType));
}

FilterSyncedDatasetPanelFactory.deps = [
  SourceSelectorFactory,
  FilterPanelHeaderFactory,
  SourceDataSelectorFactory
];

function FilterSyncedDatasetPanelFactory(SourceSelector, FilterPanelHeader, SourceDataSelector) {
  const StyledFilterPanelHeader = styled(FilterPanelHeader)`
    display: flex;
    border: none;
    height: unset;
    padding: 2px 0;
    background: none;
    align-items: baseline;
  `;

  const StyledSourceSelector = styled(SourceSelector)`
    flex: 1;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background-color: transparent;
  `;

  const FilterSyncedDatasetPanel = ({
    datasets,
    filter,
    setFilter,
    idx,
    supportedFields,
    onFieldSelector,
    onSourceDataSelector
  }) => {
    const datasetsWithTime = useMemo(() => getDatasetsWithTimeField(datasets), [datasets]);
    const filterDatasetsNum = useMemo(() => filter.dataId.length, [filter.dataId]);
    const datasetsWithTimeNum = useMemo(() => Object.keys(datasetsWithTime).length, [
      datasetsWithTime
    ]);

    const onRemoveSyncedFilter = useCallback(
      valueIndex => {
        setFilter(idx, 'dataId', null, valueIndex);
      },
      [idx, setFilter]
    );

    const onSelectSyncedDataset = useCallback(
      (datasetId, valueIndex) => {
        setFilter(idx, 'dataId', datasetId, valueIndex);
      },
      [setFilter, idx]
    );

    const onAddSyncedFilter = useCallback(() => {
      const nextId = Object.keys(datasetsWithTime).find(id => !filter.dataId.includes(id));
      if (!nextId) return;
      const timeFieldNames = getTimeFields(datasets[nextId])?.map(f => f.name);
      if (!timeFieldNames || timeFieldNames.length < 1) return;
      const nextName = timeFieldNames.includes(filter.name[0]) ? filter.name[0] : timeFieldNames[0];
      setFilter(idx, ['dataId', 'name'], [nextId, nextName], filter.dataId.length);
    }, [setFilter, idx, datasetsWithTime, datasets, filter.dataId, filter.name]);

    return (
      <SyncedDatasetsArea>
        {filter.dataId.length > 1 ? (
          <>
            <StyledContentTitle>Datasets</StyledContentTitle>
            {filter.dataId.map((dataId, index, list) => {
              return (
                <div key={dataId}>
                  <StyledFilterPanelHeader
                    datasets={[datasets[dataId]]}
                    allAvailableFields={supportedFields}
                    idx={idx}
                    filter={filter}
                    removeFilter={() => onRemoveSyncedFilter(index)}
                  >
                    <StyledSourceSelector
                      datasets={datasets}
                      disabled={filterDatasetsNum >= datasetsWithTimeNum}
                      dataId={dataId}
                      onSelectDataset={datasetId => onSelectSyncedDataset(datasetId, index)}
                      fields={getTimeFields(datasets[dataId])}
                      fieldValue={filter.name[index]}
                      onFieldSelector={field => onFieldSelector(field, index)}
                    />
                  </StyledFilterPanelHeader>
                  {index + 1 < list.length && <StyledSeparator />}
                </div>
              );
            })}
          </>
        ) : (
          <>
            <SourceDataSelector
              inputTheme="secondary"
              datasets={datasets}
              dataId={Array.isArray(filter.dataId) ? filter.dataId[0] : filter.dataId}
              onSelect={onSourceDataSelector}
            />
            <StyledSeparator />
          </>
        )}
        {filterDatasetsNum < datasetsWithTimeNum && (
          <div>
            <TippyTooltip
              delay={[500, 0]}
              placement="top"
              render={() => (
                <div>
                  <FormattedMessage id={'tooltip.timeFilterSync'} />
                </div>
              )}
            >
              <StyledButton
                className="add-sync-dataset"
                secondary={true}
                onClick={onAddSyncedFilter}
              >
                <Add height="12px" />
                <FormattedMessage id={'filterManager.timeFilterSync'} />
              </StyledButton>
            </TippyTooltip>
          </div>
        )}
      </SyncedDatasetsArea>
    );
  };

  return FilterSyncedDatasetPanel;
}

export default FilterSyncedDatasetPanelFactory;
