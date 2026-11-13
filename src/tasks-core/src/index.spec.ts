// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  all,
  allSettled,
  drainTasksForTesting,
  fromCallback,
  fromPromiseWithProgress,
  taskMiddleware,
  withTask,
  TaskDescriptor
} from './index';

const runEffect: Parameters<TaskDescriptor['run']>[0] = (effect, resolve, reject, ctx) =>
  effect(resolve, reject, ctx);

function controlledTask(label: string) {
  let complete: (error?: Error | null, value?: string) => void;
  const task = fromCallback((_arg, done) => {
    complete = done;
  }, label)();
  return {
    task,
    finish: (value: string) => complete(null, value),
    fail: (error: Error) => complete(error)
  };
}

describe('parallel task completion', () => {
  it.each([all, allSettled])('resolves an empty batch without running effects', combine => {
    const runner = jest.fn();
    const resolve = jest.fn();
    const reject = jest.fn();
    combine([]).run(runner, resolve, reject);
    expect(runner).not.toHaveBeenCalled();
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledWith([]);
    expect(reject).not.toHaveBeenCalled();
  });

  it('starts all effects and returns results in input order, not completion order', () => {
    const first = controlledTask('FIRST');
    const second = controlledTask('SECOND');
    const resolve = jest.fn();
    const reject = jest.fn();
    all([first.task, second.task]).run(runEffect, resolve, reject);

    second.finish('second');
    expect(resolve).not.toHaveBeenCalled();
    first.finish('first');
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledWith(['first', 'second']);
    expect(reject).not.toHaveBeenCalled();
  });

  it('rejects immediately on the first failure and ignores remaining outcomes', () => {
    const tasks = ['FIRST', 'SECOND', 'THIRD'].map(controlledTask);
    const resolve = jest.fn();
    const reject = jest.fn();
    const error = new Error('Dataset unavailable');
    all(tasks.map(item => item.task)).run(runEffect, resolve, reject);

    tasks[1].fail(error);
    expect(reject).toHaveBeenCalledWith(error);
    tasks[0].finish('first');
    tasks[2].fail(new Error('Later failure'));
    expect(reject).toHaveBeenCalledTimes(1);
    expect(resolve).not.toHaveBeenCalled();
  });

  it('waits for every settled task and preserves mixed outcomes in input order', () => {
    const tasks = ['FIRST', 'SECOND', 'THIRD'].map(controlledTask);
    const resolve = jest.fn();
    const reject = jest.fn();
    const error = new Error('Dataset unavailable');
    allSettled(tasks.map(item => item.task)).run(runEffect, resolve, reject);

    tasks[2].finish('third');
    tasks[0].fail(error);
    expect(resolve).not.toHaveBeenCalled();
    tasks[1].finish('second');
    expect(resolve).toHaveBeenCalledTimes(1);
    // Task.allSettled intentionally exposes rejected reasons as `value`.
    expect(resolve).toHaveBeenCalledWith([
      {status: 'rejected', value: error},
      {status: 'fulfilled', value: 'second'},
      {status: 'fulfilled', value: 'third'}
    ]);
    expect(reject).not.toHaveBeenCalled();
  });
});

describe('progress tasks', () => {
  it('maps progress independently of the final result and forwards the effect argument', async () => {
    const onProgress = jest.fn();
    const resolve = jest.fn();
    const reject = jest.fn();
    const task = fromPromiseWithProgress(async ({arg, onProgress: emit}) => {
      emit(0);
      emit(50);
      return arg;
    }, 'LOAD')({arg: 'dataset', onProgress: (value: number) => ({type: 'PROGRESS', value})}).map(
      value => ({
        type: 'DONE',
        value
      })
    );

    await task.run(runEffect, resolve, reject, {onProgress});
    expect(onProgress.mock.calls).toEqual([
      [{type: 'PROGRESS', value: 0}],
      [{type: 'PROGRESS', value: 50}]
    ]);
    expect(resolve).toHaveBeenCalledWith({type: 'DONE', value: 'dataset'});
    expect(reject).not.toHaveBeenCalled();
  });

  it('forwards raw progress when there is no mapper', async () => {
    const onProgress = jest.fn();
    const task = fromPromiseWithProgress(async ({onProgress: emit}) => {
      emit({loaded: 12});
    }, 'LOAD')();
    await task.run(runEffect, jest.fn(), jest.fn(), {onProgress});
    expect(onProgress).toHaveBeenCalledWith({loaded: 12});
  });

  it('drops progress without evaluating its mapper when there is no dispatch context', async () => {
    const mapper = jest.fn(() => {
      throw new Error('Progress mapper must not run without context');
    });
    const resolve = jest.fn();
    const task = fromPromiseWithProgress(async ({onProgress}) => {
      onProgress(1);
      return 'complete';
    }, 'LOAD')({onProgress: mapper});
    await task.run(runEffect, resolve, jest.fn());
    expect(mapper).not.toHaveBeenCalled();
    expect(resolve).toHaveBeenCalledWith('complete');
  });

  it('preserves emitted progress when the effect rejects and maps the failure', async () => {
    const onProgress = jest.fn();
    const reject = jest.fn();
    const resolve = jest.fn();
    const error = new Error('Download interrupted');
    const task = fromPromiseWithProgress(async ({onProgress: emit}) => {
      emit(25);
      throw error;
    }, 'LOAD')().bimap(
      value => value,
      reason => ({type: 'FAILED', reason})
    );
    await task.run(runEffect, resolve, reject, {onProgress});
    expect(onProgress).toHaveBeenCalledWith(25);
    expect(reject).toHaveBeenCalledWith({type: 'FAILED', reason: error});
    expect(resolve).not.toHaveBeenCalled();
  });
});

describe('middleware progress through task composition', () => {
  beforeEach(() => drainTasksForTesting());
  afterEach(() => drainTasksForTesting());

  it('dispatches progress asynchronously through parallel and chained tasks before completion', async () => {
    const received: Array<{type: string; value?: unknown}> = [];
    const makeTask = fromPromiseWithProgress(async ({arg, onProgress}) => {
      onProgress({type: 'PROGRESS', value: arg});
      return arg;
    }, 'LOAD');
    const task = all([makeTask({arg: 'first'}), makeTask({arg: 'second'})])
      .chain(values => makeTask({arg: values.join(',')}))
      .map(value => ({type: 'DONE', value}));
    const dispatch = taskMiddleware({
      dispatch: (action: {type: string; value?: unknown}) => dispatch(action)
    })((action: {type: string; value?: unknown}) => {
      if (action.type === 'START') withTask({}, task);
      else received.push(action);
    });

    const completed = dispatch({type: 'START'});
    expect(received).toEqual([]);
    await completed;
    expect(received).toEqual([
      {type: 'PROGRESS', value: 'first'},
      {type: 'PROGRESS', value: 'second'},
      {type: 'PROGRESS', value: 'first,second'},
      {type: 'DONE', value: 'first,second'}
    ]);
  });
});
