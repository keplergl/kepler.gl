// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {GroupByOp, JoinOp} from '@kepler.gl/table';
import {Datasets} from '@kepler.gl/table';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {getApplicationConfig} from '@kepler.gl/utils';

import Portaled from '../../common/portaled';
import GroupByPanelFactory from './group-by-panel';
import JoinPanelFactory from './join-panel';
import SpatialJoinPanelFactory from './spatial-join-panel';

const Panels = styled.div`
  pointer-events: auto;
`;

DatasetOpsPanelsFactory.deps = [GroupByPanelFactory, JoinPanelFactory, SpatialJoinPanelFactory];

export type DatasetOpsPanelsProps = {
  datasets: Datasets;
  groupBys?: GroupByOp[];
  joins?: JoinOp[];
  visStateActions: typeof VisStateActions;
};

function DatasetOpsPanelsFactory(
  GroupByPanel: ReturnType<typeof GroupByPanelFactory>,
  JoinPanel: ReturnType<typeof JoinPanelFactory>,
  SpatialJoinPanel: ReturnType<typeof SpatialJoinPanelFactory>
) {
  const DatasetOpsPanels: React.FC<DatasetOpsPanelsProps> = ({
    datasets,
    groupBys = [],
    joins = [],
    visStateActions
  }) => {
    if (getApplicationConfig().enableDatasetOps === false) {
      return null;
    }

    const activeGroupBy = groupBys.find(op => op.isConfigActive);
    const activeJoin = joins.find(op => op.isConfigActive && op.implementation !== 'spatial');
    const activeSpatial = joins.find(op => op.isConfigActive && op.implementation === 'spatial');
    const isOpened = Boolean(activeGroupBy || activeJoin || activeSpatial);

    const onClose = () => {
      if (activeGroupBy) {
        visStateActions.removeDatasetOp(activeGroupBy.id);
      }
      if (activeJoin) {
        visStateActions.removeDatasetOp(activeJoin.id);
      }
      if (activeSpatial) {
        visStateActions.removeDatasetOp(activeSpatial.id);
      }
    };

    return (
      <Portaled isOpened={isOpened} left={330} top={80} onClose={onClose}>
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
        </Panels>
      </Portaled>
    );
  };

  return DatasetOpsPanels;
}

export default DatasetOpsPanelsFactory;
