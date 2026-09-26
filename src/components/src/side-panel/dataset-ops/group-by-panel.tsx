// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  DatasetOpAggregation,
  GroupByOp,
  aggregationOptionsForField,
  defaultAggregationForField,
  defaultAggregationsForFields,
  isDatasetOpsAggregationField
} from '@kepler.gl/table';
import {Datasets} from '@kepler.gl/table';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';

import FieldSelectorFactory from '../../common/field-selector';
import ItemSelector from '../../common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import {Grouping} from '../../common/icons';
import DatasetOpPanel, {
  AggregationSelector,
  CollapsibleSection,
  DatasetOpHelp,
  DatasetOpsAggRow,
  DatasetOpsFieldName,
  DatasetOpsFieldRow,
  DatasetOpsSection,
  ResultNameInput,
  ScrollableColumnList,
  fieldNameFromSelector
} from './dataset-op-panel';

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

    const aggregationFields = dataset.fields.filter(
      field => field.name !== op.fieldName && isDatasetOpsAggregationField(field)
    );
    const allAggregationsSelected = Boolean(
      aggregationFields.length && aggregationFields.every(field => op.aggregations[field.name])
    );

    const onSelectField = (value: unknown) => {
      const fieldName = fieldNameFromSelector(value);
      const aggregations = {...op.aggregations};
      if (fieldName) {
        delete aggregations[fieldName];
      }
      setGroupByConfig(op.id, {fieldName, aggregations});
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
        titleIcon={<Grouping height="20px" />}
        descriptionId="datasetOps.groupByHelp"
        error={op.error}
        onClose={() => removeDatasetOp(op.id)}
        onRun={() => runGroupBy(op.id)}
        canRun={Boolean(op.fieldName)}
      >
        <DatasetOpsSection sectionColor={dataset.color}>
          <SidePanelSection>
            <PanelLabel>
              <FormattedMessage id="datasetOps.groupByField" />
            </PanelLabel>
            <DatasetOpsFieldRow>
              <FieldSelector
                fields={dataset.fields}
                value={op.fieldName}
                onSelect={onSelectField}
                erasable={false}
              />
              <DatasetOpHelp helpId="datasetOps.groupByFieldHelp" />
            </DatasetOpsFieldRow>
          </SidePanelSection>
          <CollapsibleSection
            titleId="datasetOps.aggregationRules"
            helpId="datasetOps.aggregationRulesHelp"
            selectAll={allAggregationsSelected}
            onToggleSelectAll={() =>
              setGroupByConfig(op.id, {
                aggregations: allAggregationsSelected
                  ? {}
                  : defaultAggregationsForFields(dataset.fields, op.fieldName ? [op.fieldName] : [])
              })
            }
          >
            <ScrollableColumnList>
              {aggregationFields.map(field => {
                const options = aggregationOptionsForField(field);
                const selected = op.aggregations[field.name];
                const selectedOption =
                  options.find(option => option.id === selected) ||
                  options.find(option => option.id === defaultAggregationForField(field)) ||
                  options[0] ||
                  null;
                return (
                  <DatasetOpsAggRow key={field.name}>
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
                    <DatasetOpsFieldName>{field.displayName || field.name}</DatasetOpsFieldName>
                    <AggregationSelector>
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
                        size="small"
                      />
                    </AggregationSelector>
                  </DatasetOpsAggRow>
                );
              })}
            </ScrollableColumnList>
          </CollapsibleSection>
        </DatasetOpsSection>
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
