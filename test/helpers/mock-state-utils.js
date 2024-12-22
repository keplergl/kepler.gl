// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {drainTasksForTesting, succeedTaskWithValues} from 'react-palm/tasks';

import {KeplerTable} from '@kepler.gl/table';

/**
 * Applies actions one by one using the reducer.
 * After each action drain Tasks and automarically resolve tasks
 * of type CREATE_TABLE_TASK in order to create datasets.
 * @param {Reducer} reducer A reducer to use.
 * @param {State} initialState Initial state.
 * @param {Action | Action[]}actions An array of actions.
 * @returns
 */
export function applyActions(reducer, initialState, actions) {
  const actionQ = Array.isArray(actions) ? actions : [actions];

  // remove any existing tasks before actions
  drainTasksForTesting();

  let updatedState = actionQ.reduce((updatedState, {action, payload}) => {
    let newState = reducer(updatedState, action(...payload));
    const tasks = drainTasksForTesting();
    newState = applyCreateTableTasks(tasks, reducer, newState);
    return newState;
  }, initialState);

  return updatedState;
}

/**
 * Execute existing tasts and mock CREATE_TABLE_TASK with success.
 * @param {VisStateReducer} reducer
 * @param {VisState} initialState
 * @returns
 */
export function applyExistingDatasetTasks(reducer, initialState) {
  const tasks = drainTasksForTesting();
  return applyCreateTableTasks(tasks, reducer, initialState);
}

/**
 * Execute tasks and mock CREATE_TABLE_TASK with success.
 * @param {Task[]} tasks
 * @param {Reducer} reducer
 * @param {VisState} initialState
 * @returns
 */
export const applyCreateTableTasks = (tasks, reducer, initialState) => {
  return tasks.reduce((updatedState, task) => {
    if (!task.label.includes('CREATE_TABLE_TASK')) return updatedState;
    const tables = task.payload.map(payload => mockCreateNewDataEntry(payload));
    return reducer(updatedState, succeedTaskWithValues(task, tables));
  }, initialState);
};

/**
 * Mock instant sync result of createNewDataEntry.
 */
const mockCreateNewDataEntry = ({info, color, opts, data}) => {
  const table = new KeplerTable({info, color, ...opts});
  table.importData({data});
  return table;
};
