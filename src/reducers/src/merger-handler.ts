// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {getGlobalTaskQueue} from 'react-palm/tasks';
import {isObject, toArray} from '@kepler.gl/utils';
import {ValueOf} from '@kepler.gl/types';
import {VisState, Merger, PostMergerPayload} from '@kepler.gl/schemas';

export function isValidMerger(merger: Merger<any>): boolean {
  return (
    isObject(merger) &&
    typeof merger.merge === 'function' &&
    (typeof merger.prop === 'string' || Array.isArray(merger.prop))
  );
}

/**
 * Call state updater, return the tasks created by the state update with withTask()
 */
function callFunctionGetTask(fn: () => any): [any, any] {
  const before = getGlobalTaskQueue();
  const ret = fn();
  const after = getGlobalTaskQueue();
  const diff = after.filter(t => !before.includes(t));
  return [ret, diff];
}

export function mergeStateFromMergers<State extends VisState>(
  state: State,
  initialState: State,
  mergers: Merger<any>[],
  postMergerPayload: PostMergerPayload
): {
  mergedState: State;
  allMerged: boolean;
} {
  // const newDataIds = Object.keys(postMergerPayload.newDataEntries);
  let mergedState = state;
  // merge state with config to be merged
  const mergerQueue = [...mergers];

  while (mergerQueue.length) {
    const merger = mergerQueue.shift();

    if (
      merger &&
      isValidMerger(merger) &&
      merger.toMergeProp &&
      hasPropsToMerge(state, merger.toMergeProp)
    ) {
      // put the rest of mergers and payload for postMergeUpdater in mergerActionPayload
      // and pass it to current merger, which (if async) knows to continue merging
      const mergerActionPayload = {
        mergers: mergerQueue,
        postMergerPayload
      };
      // reset toMerge
      const toMerge = getPropValueToMerger(mergedState, merger.toMergeProp, merger.toMergeProp);

      mergedState = resetStateToMergeProps(mergedState, initialState, merger.toMergeProp);
      // call merger
      // eslint-disable-next-line no-loop-func
      const mergeFunc = () => merger.merge(mergedState, toMerge, false, mergerActionPayload);
      const [updatedState, newTasks] = callFunctionGetTask(mergeFunc);

      mergedState = updatedState;

      // check if asyncTask was created (time consuming tasks)
      if (newTasks.length && merger.waitToFinish) {
        // skip rest, the async merger will call applyMergerupdater() to continue
        return {mergedState, allMerged: false};
      }
    }
  }

  // we merged all mergers in the queue, and we can call post merger now
  return {mergedState, allMerged: true};
}

export function hasPropsToMerge<State extends object>(
  state: State,
  mergerProps: string | string[]
): boolean {
  return Array.isArray(mergerProps)
    ? Boolean(mergerProps.some(p => Object.prototype.hasOwnProperty.call(state, p)))
    : typeof mergerProps === 'string' && Object.prototype.hasOwnProperty.call(state, mergerProps);
}

export function getPropValueToMerger<State extends object>(
  state: State,
  mergerProps: string | string[],
  toMergeProps?: string | string[]
): Partial<State> | ValueOf<State> {
  return Array.isArray(mergerProps)
    ? mergerProps.reduce((accu, p, i) => {
        if (!toMergeProps) return accu;
        return {...accu, [toMergeProps[i]]: state[p]};
      }, {})
    : state[mergerProps];
}

export function resetStateToMergeProps<State extends VisState>(
  state: State,
  initialState: State,
  mergerProps: string | string[]
) {
  return toArray(mergerProps).reduce(
    (accu, prop) => ({
      ...accu,
      [prop]: initialState[prop]
    }),
    state
  );
}
