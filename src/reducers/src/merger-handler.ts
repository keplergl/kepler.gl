// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
function callFunctionGetTask(fn) {
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
      // check if asyncTask was created
      if (newTasks.length && merger.waitToFinish) {
        // skip rest
        return {mergedState, allMerged: false};
      }
    }
  }

  // if we merged all mergers in the queue we can call post merger
  return {mergedState, allMerged: true};
}

export function hasPropsToMerge<State extends VisState>(
  state: State,
  mergerProps: string | string[]
): boolean {
  return Array.isArray(mergerProps)
    ? Boolean(mergerProps.some(p => state.hasOwnProperty(p)))
    : typeof mergerProps === 'string' && state.hasOwnProperty(mergerProps);
}

export function getPropValueToMerger<State extends VisState>(
  state: State,
  mergerProps: string | string[],
  toMergeProps: string | string[]
): Partial<State> | ValueOf<State> {
  return Array.isArray(mergerProps)
    ? mergerProps.reduce((accu, p, i) => ({...accu, [toMergeProps[i]]: state[p]}), {})
    : state[mergerProps];
}

export function resetStateToMergeProps(state, initialState, mergerProps) {
  return toArray(mergerProps).reduce(
    (accu, prop) => ({
      ...accu,
      [prop]: initialState[prop]
    }),
    state
  );
}
