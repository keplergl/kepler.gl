// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {GroupByOp, JoinOp, SuitabilityOp} from '@kepler.gl/table';
import {Datasets} from '@kepler.gl/table';
import {VisStateActions} from '@kepler.gl/actions';
import {getApplicationConfig} from '@kepler.gl/utils';

import GroupByPanelFactory from './group-by-panel';
import JoinPanelFactory from './join-panel';
import SpatialJoinPanelFactory from './spatial-join-panel';
import SuitabilityPanelFactory from './suitability-panel';

const Panels = styled.div.attrs({
  className: 'dataset-ops-panels'
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
`;

DatasetOpsPanelsFactory.deps = [
  GroupByPanelFactory,
  JoinPanelFactory,
  SpatialJoinPanelFactory,
  SuitabilityPanelFactory
];

export type DatasetOpsPanelsProps = {
  datasets: Datasets;
  groupBys?: GroupByOp[];
  joins?: JoinOp[];
  suitabilities?: SuitabilityOp[];
  visStateActions: typeof VisStateActions;
};

export function hasActiveDatasetOp(
  groupBys: GroupByOp[] = [],
  joins: JoinOp[] = [],
  suitabilities: SuitabilityOp[] = []
): boolean {
  return Boolean(
    groupBys.some(op => op.isConfigActive) ||
      joins.some(op => op.isConfigActive) ||
      suitabilities.some(op => op.isConfigActive)
  );
}

function DatasetOpsPanelsFactory(
  GroupByPanel: ReturnType<typeof GroupByPanelFactory>,
  JoinPanel: ReturnType<typeof JoinPanelFactory>,
  SpatialJoinPanel: ReturnType<typeof SpatialJoinPanelFactory>,
  SuitabilityPanel: ReturnType<typeof SuitabilityPanelFactory>
) {
  const DatasetOpsPanels: React.FC<DatasetOpsPanelsProps> = ({
    datasets,
    groupBys = [],
    joins = [],
    suitabilities = [],
    visStateActions
  }) => {
    if (getApplicationConfig().enableDatasetOps === false) {
      return null;
    }

    const activeGroupBy = groupBys.find(op => op.isConfigActive);
    const activeJoin = joins.find(op => op.isConfigActive && op.implementation !== 'spatial');
    const activeSpatial = joins.find(op => op.isConfigActive && op.implementation === 'spatial');
    const activeSuitability = suitabilities.find(op => op.isConfigActive);
    if (!activeGroupBy && !activeJoin && !activeSpatial && !activeSuitability) {
      return null;
    }

    return (
      <Panels>
        {activeGroupBy ? (
          <GroupByPanel
            op={activeGroupBy}
            datasets={datasets}
            setGroupByConfig={visStateActions.setGroupByConfig}
            runGroupBy={visStateActions.runGroupBy}
            removeDatasetOp={visStateActions.removeDatasetOp}
          />
        ) : null}
        {activeJoin ? (
          <JoinPanel
            op={activeJoin}
            datasets={datasets}
            setJoinConfig={visStateActions.setJoinConfig}
            runJoin={visStateActions.runJoin}
            removeDatasetOp={visStateActions.removeDatasetOp}
          />
        ) : null}
        {activeSpatial ? (
          <SpatialJoinPanel
            op={activeSpatial}
            datasets={datasets}
            setSpatialJoinConfig={visStateActions.setSpatialJoinConfig}
            runSpatialJoin={visStateActions.runSpatialJoin}
            removeDatasetOp={visStateActions.removeDatasetOp}
          />
        ) : null}
        {activeSuitability ? (
          <SuitabilityPanel
            op={activeSuitability}
            datasets={datasets}
            setSuitabilityConfig={visStateActions.setSuitabilityConfig}
            runSuitability={visStateActions.runSuitability}
            removeDatasetOp={visStateActions.removeDatasetOp}
          />
        ) : null}
      </Panels>
    );
  };

  return DatasetOpsPanels;
}

export default DatasetOpsPanelsFactory;
