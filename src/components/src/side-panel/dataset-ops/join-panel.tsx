// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {AttributeJoinType, JoinOp, isTabularDatasetForOps} from '@kepler.gl/table';
import {Datasets} from '@kepler.gl/table';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {Field} from '@kepler.gl/types';

import FieldSelectorFactory from '../../common/field-selector';
import SourceDataSelectorFactory from '../common/source-data-selector';
import {PanelLabel, SidePanelSection, Tooltip} from '../../common/styled-components';
import {Join} from '../../common/icons';
import DatasetOpPanel, {
  CollapsibleSection,
  DATASET_OPS_ACCENT,
  DatasetOpHelp,
  DatasetOpsAggRow,
  DatasetOpsFieldName,
  DatasetOpsFieldRow,
  DatasetOpsSection,
  DatasetOpsSectionTitle,
  ResultNameInput,
  ScrollableColumnList,
  fieldNameFromSelector
} from './dataset-op-panel';
import {JOIN_TYPE_ICONS} from './join-type-icons';

const JOIN_TYPES: {id: AttributeJoinType; helpId: string}[] = [
  {id: 'LEFT', helpId: 'datasetOps.joinType.leftHelp'},
  {id: 'INNER', helpId: 'datasetOps.joinType.innerHelp'},
  {id: 'FULL', helpId: 'datasetOps.joinType.fullHelp'}
];

const JoinTypeRow = styled.div`
  display: flex;
  align-items: center;

  ${DatasetOpsSectionTitle} {
    margin-bottom: 0;
  }
`;

const JoinTypeTiles = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const JoinTypeTile = styled.button.attrs({
  type: 'button',
  className: 'dataset-ops-join-type-tile'
})<{$selected?: boolean}>`
  width: 40px;
  height: 28px;
  padding: 0;
  margin-left: 8px;
  border-radius: 4px;
  border: 1px solid ${props => (props.$selected ? props.theme.activeColor : 'transparent')};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.textColor};

  .join-type-tooltip {
    max-width: 180px;
    text-align: left;
    white-space: normal;
  }
`;

function selectedColumnNames(fields: Field[], selected?: string[]): string[] {
  return selected ?? fields.map(field => field.name);
}

function ColumnsToInclude({
  fields,
  selected,
  onChange
}: {
  fields: Field[];
  selected?: string[];
  onChange: (columns: string[]) => void;
}) {
  const selectedNames = new Set(selectedColumnNames(fields, selected));
  const allSelected = fields.every(field => selectedNames.has(field.name));
  return (
    <CollapsibleSection
      titleId="datasetOps.columnsToInclude"
      helpId="datasetOps.columnsToIncludeHelp"
      selectAll={allSelected}
      onToggleSelectAll={() => onChange(allSelected ? [] : fields.map(field => field.name))}
    >
      <ScrollableColumnList>
        {fields.map(field => {
          const checked = selectedNames.has(field.name);
          return (
            <DatasetOpsAggRow key={field.name}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  onChange(
                    fields
                      .map(item => item.name)
                      .filter(name => (name === field.name ? !checked : selectedNames.has(name)))
                  )
                }
              />
              <DatasetOpsFieldName>{field.displayName || field.name}</DatasetOpsFieldName>
            </DatasetOpsAggRow>
          );
        })}
      </ScrollableColumnList>
    </CollapsibleSection>
  );
}

JoinPanelFactory.deps = [FieldSelectorFactory, SourceDataSelectorFactory];

function JoinPanelFactory(
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>
) {
  const JoinPanel: React.FC<{
    op: JoinOp;
    datasets: Datasets;
    setJoinConfig: ActionHandler<typeof VisStateActions.setJoinConfig>;
    runJoin: ActionHandler<typeof VisStateActions.runJoin>;
    removeDatasetOp: ActionHandler<typeof VisStateActions.removeDatasetOp>;
  }> = ({op, datasets, setJoinConfig, runJoin, removeDatasetOp}) => {
    const left = datasets[op.leftDataId];
    const right = op.rightDataId ? datasets[op.rightDataId] : undefined;
    const tabularDatasets = Object.fromEntries(
      Object.entries(datasets).filter(([, dataset]) => isTabularDatasetForOps(dataset))
    );
    const leftDatasets = Object.fromEntries(
      Object.entries(tabularDatasets).filter(([id]) => id !== op.rightDataId)
    );
    const rightDatasets = Object.fromEntries(
      Object.entries(tabularDatasets).filter(([id]) => id !== op.leftDataId)
    );

    if (!left) {
      return null;
    }

    const onSelectLeftDataset = (value: unknown) => {
      const dataId = typeof value === 'string' ? value : null;
      if (!dataId || dataId === op.leftDataId) {
        return;
      }
      const nextLeft = datasets[dataId];
      if (!nextLeft) {
        return;
      }
      setJoinConfig(op.id, {
        leftDataId: dataId,
        leftField: null,
        leftColumns: undefined
      });
    };

    return (
      <DatasetOpPanel
        titleId="datasetOps.join"
        titleIcon={<Join height="20px" />}
        descriptionId="datasetOps.joinHelp"
        error={op.error}
        onClose={() => removeDatasetOp(op.id)}
        onRun={() => runJoin(op.id)}
        canRun={Boolean(op.rightDataId && op.leftField && op.rightField)}
      >
        <DatasetOpsSection sectionColor={left.color}>
          <DatasetOpsSectionTitle>
            <FormattedMessage id="datasetOps.leftDataset" />
            <DatasetOpHelp helpId="datasetOps.leftDatasetHelp" />
          </DatasetOpsSectionTitle>
          <SourceDataSelector
            datasets={leftDatasets}
            dataId={op.leftDataId}
            onSelect={onSelectLeftDataset}
            defaultValue="Select a dataset"
          />
          {right ? (
            <>
              <SidePanelSection>
                <PanelLabel>
                  <FormattedMessage id="datasetOps.leftKey" />
                </PanelLabel>
                <DatasetOpsFieldRow>
                  <FieldSelector
                    fields={left.fields}
                    value={op.leftField}
                    onSelect={value =>
                      setJoinConfig(op.id, {leftField: fieldNameFromSelector(value)})
                    }
                    erasable={false}
                  />
                  <DatasetOpHelp helpId="datasetOps.leftFieldHelp" />
                </DatasetOpsFieldRow>
              </SidePanelSection>
              <ColumnsToInclude
                fields={left.fields}
                selected={op.leftColumns}
                onChange={leftColumns => setJoinConfig(op.id, {leftColumns})}
              />
            </>
          ) : null}
        </DatasetOpsSection>

        <DatasetOpsSection sectionColor={DATASET_OPS_ACCENT}>
          <JoinTypeRow>
            <DatasetOpsSectionTitle>
              <FormattedMessage id="datasetOps.joinTypeLabel" />
            </DatasetOpsSectionTitle>
            <JoinTypeTiles>
              {JOIN_TYPES.map(option => {
                const Icon = JOIN_TYPE_ICONS[option.id];
                const tooltipId = `dataset-ops-join-type-${op.id}-${option.id}`;
                return (
                  <JoinTypeTile
                    key={option.id}
                    $selected={op.type === option.id}
                    data-tip
                    data-for={tooltipId}
                    aria-label={option.id}
                    onClick={() => setJoinConfig(op.id, {type: option.id})}
                  >
                    <Icon height="20px" />
                    <Tooltip id={tooltipId} effect="solid">
                      <div className="join-type-tooltip">
                        <FormattedMessage id={option.helpId} />
                      </div>
                    </Tooltip>
                  </JoinTypeTile>
                );
              })}
            </JoinTypeTiles>
          </JoinTypeRow>
        </DatasetOpsSection>

        <DatasetOpsSection sectionColor={right?.color}>
          <DatasetOpsSectionTitle>
            <FormattedMessage id="datasetOps.rightDataset" />
            <DatasetOpHelp helpId="datasetOps.rightDatasetHelp" />
          </DatasetOpsSectionTitle>
          <SourceDataSelector
            datasets={rightDatasets}
            dataId={op.rightDataId || undefined}
            onSelect={value => {
              const dataId = typeof value === 'string' ? value : null;
              if (!dataId || !datasets[dataId]) {
                return;
              }
              setJoinConfig(op.id, {
                rightDataId: dataId,
                rightField: null,
                rightColumns: undefined
              });
            }}
            defaultValue="Select a dataset"
          />
          {right ? (
            <>
              <SidePanelSection>
                <PanelLabel>
                  <FormattedMessage id="datasetOps.rightKey" />
                </PanelLabel>
                <DatasetOpsFieldRow>
                  <FieldSelector
                    fields={right.fields}
                    value={op.rightField}
                    onSelect={value =>
                      setJoinConfig(op.id, {rightField: fieldNameFromSelector(value)})
                    }
                    erasable={false}
                  />
                  <DatasetOpHelp helpId="datasetOps.rightFieldHelp" />
                </DatasetOpsFieldRow>
              </SidePanelSection>
              <ColumnsToInclude
                fields={right.fields}
                selected={op.rightColumns}
                onChange={rightColumns => setJoinConfig(op.id, {rightColumns})}
              />
            </>
          ) : null}
        </DatasetOpsSection>

        <ResultNameInput
          value={op.resultLabel}
          onChange={resultLabel => setJoinConfig(op.id, {resultLabel})}
        />
      </DatasetOpPanel>
    );
  };

  return JoinPanel;
}

export default JoinPanelFactory;
