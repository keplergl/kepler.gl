// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {generateHashId} from '@kepler.gl/common-utils';
import {
  defaultAggregationsForFields,
  groupByDataset,
  isTabularDatasetForOps,
  joinDatasets,
  spatialJoinDatasets,
  suggestSpatialGeo,
  GroupByOp,
  JoinOp
} from '@kepler.gl/table';
import {ProtoDataset} from '@kepler.gl/types';
import {VisStateActions} from '@kepler.gl/actions';
import {VisState} from '@kepler.gl/schemas';

export type DerivedDatasetOpResult = {
  state: VisState;
  proto?: ProtoDataset;
};

function deactivateOps<T extends {isConfigActive?: boolean}>(ops: T[]): T[] {
  return ops.map(op => ({...op, isConfigActive: false}));
}

function defaultGroupByLabel(datasetLabel: string, fieldName?: string | null): string {
  return fieldName ? `${datasetLabel} grouped by ${fieldName}` : `${datasetLabel} grouped`;
}

function defaultJoinLabel(leftLabel: string, rightLabel?: string | null): string {
  return rightLabel ? `${leftLabel} join ${rightLabel}` : `${leftLabel} join`;
}

function defaultSpatialJoinLabel(resultId: string): string {
  return `spatial-join-${resultId}`;
}

export function addGroupByUpdater(
  state: VisState,
  action: VisStateActions.AddGroupByUpdaterAction
): VisState {
  const dataset = state.datasets[action.dataId];
  if (!isTabularDatasetForOps(dataset)) {
    return state;
  }
  const id = generateHashId(6);
  const resultId = generateHashId(6);
  const op: GroupByOp = {
    id,
    dataId: action.dataId,
    fieldName: null,
    aggregations: defaultAggregationsForFields(dataset.fields),
    resultId,
    resultLabel: defaultGroupByLabel(dataset.label),
    isConfigActive: true,
    error: null
  };
  return {
    ...state,
    groupBys: [...deactivateOps(state.groupBys), op],
    joins: deactivateOps(state.joins)
  };
}

export function setGroupByConfigUpdater(
  state: VisState,
  action: VisStateActions.SetGroupByConfigUpdaterAction
): VisState {
  return {
    ...state,
    groupBys: state.groupBys.map(op =>
      op.id === action.id ? {...op, ...action.config, error: action.config.error ?? null} : op
    )
  };
}

export function executeGroupBy(
  state: VisState,
  action: VisStateActions.RunGroupByUpdaterAction
): DerivedDatasetOpResult {
  const op = state.groupBys.find(item => item.id === action.id);
  const dataset = op ? state.datasets[op.dataId] : undefined;
  if (!op || !dataset || !op.fieldName) {
    return {
      state: setGroupByConfigUpdater(state, {
        id: action.id,
        config: {error: 'Select a grouping field'}
      })
    };
  }

  try {
    const proto = groupByDataset(dataset, {
      fieldName: op.fieldName,
      aggregations: op.aggregations,
      label: op.resultLabel,
      resultId: op.resultId,
      operationId: op.id
    });
    return {
      state: {
        ...state,
        groupBys: state.groupBys.map(item =>
          item.id === op.id ? {...item, isConfigActive: false, error: null} : item
        )
      },
      proto
    };
  } catch (error) {
    return {
      state: setGroupByConfigUpdater(state, {
        id: action.id,
        config: {error: error instanceof Error ? error.message : String(error)}
      })
    };
  }
}

export function addJoinUpdater(
  state: VisState,
  action: VisStateActions.AddJoinUpdaterAction
): VisState {
  const dataset = state.datasets[action.dataId];
  if (!isTabularDatasetForOps(dataset)) {
    return state;
  }
  const implementation = action.implementation || 'simple';
  const id = generateHashId(6);
  const resultId = generateHashId(6);
  const op: JoinOp = {
    id,
    implementation,
    leftDataId: action.dataId,
    rightDataId: null,
    leftField: null,
    rightField: null,
    type: 'LEFT',
    aggregations: {},
    leftGeo: implementation === 'spatial' ? suggestSpatialGeo(dataset.fields) : null,
    rightGeo: null,
    predicate: implementation === 'spatial' ? 'intersects' : undefined,
    resultId,
    resultLabel:
      implementation === 'spatial'
        ? defaultSpatialJoinLabel(resultId)
        : defaultJoinLabel(dataset.label),
    isConfigActive: true,
    error: null
  };
  return {
    ...state,
    joins: [...deactivateOps(state.joins), op],
    groupBys: deactivateOps(state.groupBys)
  };
}

export function setJoinConfigUpdater(
  state: VisState,
  action: VisStateActions.SetJoinConfigUpdaterAction
): VisState {
  return {
    ...state,
    joins: state.joins.map(op =>
      op.id === action.id ? {...op, ...action.config, error: action.config.error ?? null} : op
    )
  };
}

export function executeJoin(
  state: VisState,
  action: VisStateActions.RunJoinUpdaterAction
): DerivedDatasetOpResult {
  const op = state.joins.find(item => item.id === action.id && item.implementation !== 'spatial');
  const left = op ? state.datasets[op.leftDataId] : undefined;
  const right = op?.rightDataId ? state.datasets[op.rightDataId] : undefined;
  if (!op || !left || !right || !op.leftField || !op.rightField) {
    return {
      state: setJoinConfigUpdater(state, {
        id: action.id,
        config: {error: 'Select datasets and join keys'}
      })
    };
  }

  try {
    const proto = joinDatasets(left, right, {
      leftField: op.leftField,
      rightField: op.rightField,
      type: op.type,
      leftColumns: op.leftColumns,
      rightColumns: op.rightColumns,
      label: op.resultLabel,
      resultId: op.resultId,
      operationId: op.id
    });
    return {
      state: {
        ...state,
        joins: state.joins.map(item =>
          item.id === op.id ? {...item, isConfigActive: false, error: null} : item
        )
      },
      proto
    };
  } catch (error) {
    return {
      state: setJoinConfigUpdater(state, {
        id: action.id,
        config: {error: error instanceof Error ? error.message : String(error)}
      })
    };
  }
}

export function addSpatialJoinUpdater(
  state: VisState,
  action: VisStateActions.AddSpatialJoinUpdaterAction
): VisState {
  return addJoinUpdater(state, {dataId: action.dataId, implementation: 'spatial'});
}

export function setSpatialJoinConfigUpdater(
  state: VisState,
  action: VisStateActions.SetSpatialJoinConfigUpdaterAction
): VisState {
  return setJoinConfigUpdater(state, action);
}

export function executeSpatialJoin(
  state: VisState,
  action: VisStateActions.RunSpatialJoinUpdaterAction
): DerivedDatasetOpResult {
  const op = state.joins.find(item => item.id === action.id && item.implementation === 'spatial');
  const left = op ? state.datasets[op.leftDataId] : undefined;
  const right = op?.rightDataId ? state.datasets[op.rightDataId] : undefined;
  if (!op || !left || !right || !op.leftGeo || !op.rightGeo) {
    return {
      state: setJoinConfigUpdater(state, {
        id: action.id,
        config: {error: 'Select datasets and geometry fields'}
      })
    };
  }

  try {
    const proto = spatialJoinDatasets(left, right, {
      leftGeo: op.leftGeo,
      rightGeo: op.rightGeo,
      aggregations: op.aggregations,
      leftColumns: op.leftColumns,
      predicate: op.predicate || 'intersects',
      label: op.resultLabel,
      resultId: op.resultId,
      operationId: op.id
    });
    return {
      state: {
        ...state,
        joins: state.joins.map(item =>
          item.id === op.id ? {...item, isConfigActive: false, error: null} : item
        )
      },
      proto
    };
  } catch (error) {
    return {
      state: setJoinConfigUpdater(state, {
        id: action.id,
        config: {error: error instanceof Error ? error.message : String(error)}
      })
    };
  }
}

export function removeDatasetOpUpdater(
  state: VisState,
  action: VisStateActions.RemoveDatasetOpUpdaterAction
): VisState {
  return {
    ...state,
    groupBys: state.groupBys.filter(op => op.id !== action.id),
    joins: state.joins.filter(op => op.id !== action.id)
  };
}

export function removeOpsForDatasets(state: VisState, dataIds: string[]): VisState {
  const ids = new Set(dataIds);
  return {
    ...state,
    groupBys: state.groupBys.filter(op => !ids.has(op.dataId) && !ids.has(op.resultId)),
    joins: state.joins.filter(
      op =>
        !ids.has(op.leftDataId) &&
        !(op.rightDataId && ids.has(op.rightDataId)) &&
        !ids.has(op.resultId)
    )
  };
}
