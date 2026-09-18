// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import {AttributeJoinType, JoinOp, isTabularDatasetForOps} from '@kepler.gl/table';
import {Datasets} from '@kepler.gl/table';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';

import FieldSelectorFactory from '../../common/field-selector';
import SourceDataSelectorFactory from '../common/source-data-selector';
import ItemSelector from '../../common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import DatasetOpPanel, {ResultNameInput, fieldNameFromSelector} from './dataset-op-panel';

const JOIN_TYPES: {id: AttributeJoinType; labelId: string}[] = [
  {id: 'LEFT', labelId: 'datasetOps.joinType.left'},
  {id: 'INNER', labelId: 'datasetOps.joinType.inner'},
  {id: 'FULL', labelId: 'datasetOps.joinType.full'}
];

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
    const rightDatasets = Object.fromEntries(
      Object.entries(datasets).filter(
        ([id, dataset]) => id !== op.leftDataId && isTabularDatasetForOps(dataset)
      )
    );

    if (!left) {
      return null;
    }

    return (
      <DatasetOpPanel
        titleId="datasetOps.join"
        error={op.error}
        onClose={() => removeDatasetOp(op.id)}
        onRun={() => runJoin(op.id)}
        canRun={Boolean(op.rightDataId && op.leftField && op.rightField)}
      >
        <SourceDataSelector
          datasets={rightDatasets}
          dataId={op.rightDataId || undefined}
          onSelect={value => {
            const dataId = typeof value === 'string' ? value : null;
            if (!dataId) {
              return;
            }
            const nextRight = datasets[dataId];
            setJoinConfig(op.id, {
              rightDataId: dataId,
              resultLabel: `${left.label} join ${nextRight?.label || dataId}`
            });
          }}
          defaultValue="Select a dataset"
        />
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id="datasetOps.leftKey" />
          </PanelLabel>
          <FieldSelector
            fields={left.fields}
            value={op.leftField}
            onSelect={value => setJoinConfig(op.id, {leftField: fieldNameFromSelector(value)})}
            erasable={false}
          />
        </SidePanelSection>
        {right ? (
          <SidePanelSection>
            <PanelLabel>
              <FormattedMessage id="datasetOps.rightKey" />
            </PanelLabel>
            <FieldSelector
              fields={right.fields}
              value={op.rightField}
              onSelect={value => setJoinConfig(op.id, {rightField: fieldNameFromSelector(value)})}
              erasable={false}
            />
          </SidePanelSection>
        ) : null}
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id="datasetOps.joinTypeLabel" />
          </PanelLabel>
          <ItemSelector
            options={JOIN_TYPES}
            selectedItems={JOIN_TYPES.find(option => option.id === op.type) || JOIN_TYPES[0]}
            displayOption={option => option.id}
            getOptionValue={option => option.id}
            onChange={value => setJoinConfig(op.id, {type: String(value) as AttributeJoinType})}
            searchable={false}
          />
        </SidePanelSection>
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
