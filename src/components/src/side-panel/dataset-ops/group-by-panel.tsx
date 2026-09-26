// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  DatasetOpAggregation,
  GroupByOp,
  aggregationOptionsForField,
  defaultAggregationForField,
  isDatasetOpsAggregationField
} from '@kepler.gl/table';
import {Datasets} from '@kepler.gl/table';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';

import FieldSelectorFactory from '../../common/field-selector';
import ItemSelector from '../../common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import DatasetOpPanel, {
  ResultNameInput,
  ScrollableColumnList,
  fieldNameFromSelector
} from './dataset-op-panel';

const AggRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const FieldName = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
`;

GroupByPanelFactory.deps = [FieldSelectorFactory];

function GroupByPanelFactory(FieldSelector: ReturnType<typeof FieldSelectorFactory>) {
  const GroupByPanel: React.FC<{
    op: GroupByOp;
    datasets: Datasets;
    setGroupByConfig: ActionHandler<typeof VisStateActions.setGroupByConfig>;
    runGroupBy: ActionHandler<typeof VisStateActions.runGroupBy>;
    removeDatasetOp: ActionHandler<typeof VisStateActions.removeDatasetOp>;
  }> = ({op, datasets, setGroupByConfig, runGroupBy, removeDatasetOp}) => {
    const dataset = datasets[op.dataId];
    if (!dataset) {
      return null;
    }

    const onSelectField = (value: unknown) => {
      const fieldName = fieldNameFromSelector(value);
      setGroupByConfig(op.id, {fieldName, resultLabel: `${dataset.label} grouped by ${fieldName}`});
    };

    const onToggleAgg = (fieldName: string, enabled: boolean, technique: DatasetOpAggregation) => {
      const aggregations = {...op.aggregations};
      if (enabled) {
        aggregations[fieldName] = technique;
      } else {
        delete aggregations[fieldName];
      }
      setGroupByConfig(op.id, {aggregations});
    };

    return (
      <DatasetOpPanel
        titleId="datasetOps.groupBy"
        error={op.error}
        onClose={() => removeDatasetOp(op.id)}
        onRun={() => runGroupBy(op.id)}
        canRun={Boolean(op.fieldName)}
      >
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id="datasetOps.groupByField" />
          </PanelLabel>
          <FieldSelector
            fields={dataset.fields}
            value={op.fieldName}
            onSelect={onSelectField}
            erasable={false}
          />
        </SidePanelSection>
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id="datasetOps.aggregations" />
          </PanelLabel>
          <ScrollableColumnList>
            {dataset.fields
              .filter(field => field.name !== op.fieldName && isDatasetOpsAggregationField(field))
              .map(field => {
                const options = aggregationOptionsForField(field);
                const selected = op.aggregations[field.name];
                const selectedOption =
                  options.find(option => option.id === selected) ||
                  options.find(option => option.id === defaultAggregationForField(field)) ||
                  options[0] ||
                  null;
                return (
                  <AggRow key={field.name}>
                    <input
                      type="checkbox"
                      checked={Boolean(selected)}
                      onChange={e =>
                        onToggleAgg(
                          field.name,
                          e.target.checked,
                          selected || defaultAggregationForField(field)
                        )
                      }
                    />
                    <FieldName>{field.displayName || field.name}</FieldName>
                    <ItemSelector
                      options={options}
                      selectedItems={selectedOption}
                      displayOption={option => option.id}
                      getOptionValue={option => option.id}
                      onChange={value =>
                        onToggleAgg(field.name, true, String(value) as DatasetOpAggregation)
                      }
                      disabled={!selected}
                      searchable={false}
                      multiSelect={false}
                    />
                  </AggRow>
                );
              })}
          </ScrollableColumnList>
        </SidePanelSection>
        <ResultNameInput
          value={op.resultLabel}
          onChange={resultLabel => setGroupByConfig(op.id, {resultLabel})}
        />
      </DatasetOpPanel>
    );
  };

  return GroupByPanel;
}

export default GroupByPanelFactory;
