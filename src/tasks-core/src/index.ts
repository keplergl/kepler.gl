// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Lightweight framework-neutral task runtime for kepler.gl reducers.
 *
 * Tasks are plain descriptors that encode async side effects. They are
 * collected by `withTask()` inside reducer updaters and drained by
 * `taskMiddleware` after each Redux dispatch, keeping reducers pure.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ResolveFn = (value: any) => any;
type RejectFn = (reason: any) => any;
type ProgressCtx = {onProgress: ResolveFn};

/**
 * The function that actually performs an effect when a task is executed.
 * Called by the middleware with resolve/reject continuations.
 */
type EffectFn = (
  resolve: ResolveFn,
  reject: RejectFn,
  ctx?: ProgressCtx
) => any;

type RunnerFn = (
  effect: EffectFn & {payload?: any; label?: string},
  resolve: ResolveFn,
  reject: RejectFn,
  ctx?: ProgressCtx
) => any;

export type TaskDescriptor = {
  /** Human-readable name used in error messages and devtools */
  label: string;
  /** Mirrors the `type` field — kept for backwards compatibility with existing task consumers */
  type: string;
  payload: any;
  run: (runner: RunnerFn, resolve: ResolveFn, reject: RejectFn, ctx?: ProgressCtx) => any;
  /** Transform the success value */
  map: (fn: ResolveFn) => TaskDescriptor;
  /** Transform both success and failure branches */
  bimap: (onResolve: ResolveFn, onReject: RejectFn) => TaskDescriptor;
  /** Chain another task on success */
  chain: (fn: (value: any) => TaskDescriptor) => TaskDescriptor;
};

/** A factory function that creates a TaskDescriptor from an optional argument */
export type TaskFactory = ((arg?: any) => TaskDescriptor) & {label?: string; type?: string};

type InstrumentHook = (
  event: 'start' | 'success' | 'error',
  task: TaskDescriptor,
  value: any
) => void;

// ---------------------------------------------------------------------------
// Instrumentation (test hook)
// ---------------------------------------------------------------------------

let instrumentHook: InstrumentHook = () => {};

/**
 * Override the instrumentation hook — used in tests to observe task
 * lifecycle events without running the middleware.
 */
export function reportTasksForTesting(hook: InstrumentHook): void {
  instrumentHook = hook;
}

// ---------------------------------------------------------------------------
// Core task construction
// ---------------------------------------------------------------------------

function buildTask(payload: any, runFn: TaskDescriptor['run'], label: string): TaskDescriptor {
  const descriptor: TaskDescriptor = {
    label,
    type: label,
    payload,
    run: runFn,
    map(transform) {
      return buildTask(
        payload,
        (runner, resolve, reject, ctx) =>
          runFn(runner, value => resolve(transform(value)), reject, ctx),
        label
      );
    },
    bimap(onResolve, onReject) {
      return buildTask(
        payload,
        (runner, resolve, reject, ctx) =>
          runFn(
            runner,
            value => resolve(onResolve(value)),
            reason => reject(onReject(reason)),
            ctx
          ),
        label
      );
    },
    chain(next) {
      return buildTask(
        payload,
        (runner, resolve, reject, ctx) =>
          runFn(
            runner,
            value => next(value).run(runner, resolve, reject, ctx),
            reject,
            ctx
          ),
        `Chain(${label})`
      );
    }
  };
  return descriptor;
}

/**
 * Wrap an EffectFn so calls are routed through the instrumentation hook.
 */
function wrapWithInstrumentation(
  effect: EffectFn,
  payload: any,
  label: string
): TaskDescriptor {
  let self: TaskDescriptor;
  const traced = Object.assign(
    (resolve: ResolveFn, reject: RejectFn, ctx?: ProgressCtx) => {
      instrumentHook('start', self, payload);
      return effect(
        value => {
          instrumentHook('success', self, value);
          return resolve(value);
        },
        reason => {
          instrumentHook('error', self, reason);
          return reject(reason);
        },
        ctx
      );
    },
    {payload, label}
  );
  self = buildTask(
    payload,
    (runner, resolve, reject, ctx) => runner(traced, resolve, reject, ctx),
    label
  );
  return self;
}

// ---------------------------------------------------------------------------
// Public task factory helpers
// ---------------------------------------------------------------------------

/**
 * Create a task factory from a function that returns a Promise.
 *
 * @example
 * const FETCH_DATA = fromPromise(url => fetch(url).then(r => r.json()), 'FETCH_DATA');
 * // in a reducer:
 * return withTask(newState, FETCH_DATA(url).bimap(onSuccess, onError));
 */
export function fromPromise(fn: (arg?: any) => Promise<any>, label: string): TaskFactory {
  return Object.assign(
    (arg?: any) =>
      wrapWithInstrumentation(
        (resolve, reject) => fn(arg).then(resolve, reject),
        arg,
        label
      ),
    {type: label, label}
  );
}

/**
 * Create a task factory from a Node-style callback function.
 * The callback receives `(error, result)`.
 */
export function fromCallback(
  fn: (arg: any, done: (err?: any, result?: any) => void) => any,
  label: string
): TaskFactory {
  return Object.assign(
    (arg?: any) =>
      wrapWithInstrumentation(
        (resolve, reject) => fn(arg, (err, result) => (err ? reject(err) : resolve(result))),
        arg,
        label
      ),
    {type: label, label}
  );
}

/**
 * Create a task factory from a function that accepts explicit
 * `(arg, resolve, reject)` parameters.
 */
export function taskCreator(fn: Function, label: string): TaskFactory {
  return Object.assign(
    (arg?: any) =>
      wrapWithInstrumentation(
        (resolve, reject) => fn(arg, resolve, reject),
        arg,
        label
      ),
    {type: label, label}
  );
}

// ---------------------------------------------------------------------------
// Parallel task combinators
// ---------------------------------------------------------------------------

function combineParallel(tasks: TaskDescriptor[], settled: boolean): TaskDescriptor {
  const label = `Task.${settled ? 'allSettled' : 'all'}(${tasks.map(t => t.label).join(', ')})`;
  return buildTask(
    tasks.map(t => t.payload),
    (runner, resolve, reject, ctx) => {
      if (tasks.length === 0) {
        return resolve([]);
      }
      const results = new Array(tasks.length);
      let remaining = tasks.length;
      let aborted = false;

      const onResolved = (idx: number) => (value: any) => {
        if (aborted) return;
        results[idx] = settled ? {status: 'fulfilled', value} : value;
        remaining -= 1;
        if (remaining === 0) resolve(results);
      };

      const onRejected = (idx: number) => (reason: any) => {
        if (aborted) return;
        if (!settled) {
          aborted = true;
          return reject(reason);
        }
        results[idx] = {status: 'rejected', value: reason};
        remaining -= 1;
        if (remaining === 0) resolve(results);
      };

      return Promise.allSettled(
        tasks.map((task, i) =>
          task.run(runner, onResolved(i), onRejected(i), ctx)
        )
      );
    },
    label
  );
}

/** Run all tasks in parallel; reject as soon as any one fails */
export const all = (tasks: TaskDescriptor[]): TaskDescriptor => combineParallel(tasks, false);

/** Run all tasks in parallel; always resolve with `{status, value}` records */
export const allSettled = (tasks: TaskDescriptor[]): TaskDescriptor =>
  combineParallel(tasks, true);

// ---------------------------------------------------------------------------
// Global task queue
// ---------------------------------------------------------------------------

// Stored on globalThis so the same queue is shared even when multiple
// bundled copies of this module coexist (e.g. app + library both bundle kepler).
const QUEUE_KEY = '___KEPLER_TASK_QUEUE_3a4f9c1d';
const g = globalThis as typeof globalThis & Record<string, any>;
g[QUEUE_KEY] ??= {pending: [] as TaskDescriptor[], lastOrigin: null as Error | null};

const getQueue = (): TaskDescriptor[] => g[QUEUE_KEY].pending;
const setQueue = (tasks: TaskDescriptor[]) => {
  g[QUEUE_KEY].pending = tasks;
};

// ---------------------------------------------------------------------------
// Stack capture (dev ergonomic — helps locate misplaced withTask() calls)
// ---------------------------------------------------------------------------

let captureEnabled = true;

/**
 * Disable the stack-trace guard that detects `withTask()` calls outside
 * of reducers. Safe to call in production builds for a minor perf gain.
 */
export const disableStackCapturing = (): void => {
  captureEnabled = false;
};

// ---------------------------------------------------------------------------
// withTask — attach tasks to reducer state
// ---------------------------------------------------------------------------

/**
 * Attach one or more tasks to a reducer state snapshot.
 * The tasks are queued and executed by `taskMiddleware` after the dispatch
 * completes, keeping the reducer itself synchronous.
 *
 * @example
 * function myUpdater(state, action) {
 *   const nextState = { ...state, loading: true };
 *   const task = LOAD_DATA(action.payload).bimap(loadSuccess, loadError);
 *   return withTask(nextState, task);
 * }
 */
export function withTask<S>(state: S, tasks: TaskDescriptor | TaskDescriptor[]): S {
  if (captureEnabled && !g[QUEUE_KEY].lastOrigin) {
    g[QUEUE_KEY].lastOrigin = new Error(
      '[kepler.gl] withTask() was called outside of a reducer. ' +
        'Tasks must be attached inside reducer updater functions.'
    );
  }
  const incoming = Array.isArray(tasks) ? tasks : [tasks];
  setQueue(getQueue().concat(incoming));
  return state;
}

/** Alias — accepts an array of tasks directly (same as withTask with an array) */
export const withTasks = withTask;

// ---------------------------------------------------------------------------
// Redux middleware
// ---------------------------------------------------------------------------

const microtask = Promise.resolve();

/**
 * Redux middleware that drains the task queue after every dispatched action.
 * Add this to your store's middleware chain.
 *
 * @example
 * import { taskMiddleware } from '@kepler.gl/tasks';
 * const store = createStore(reducer, applyMiddleware(taskMiddleware));
 */
export const taskMiddleware =
  (store: any) => (next: any) => (action: any): any => {
    if (captureEnabled && getQueue().length) {
      const err = g[QUEUE_KEY].lastOrigin;
      g[QUEUE_KEY].lastOrigin = null;
      throw err;
    }

    next(action);

    const tasks = getQueue();
    if (tasks.length === 0) return microtask;

    setQueue([]);
    g[QUEUE_KEY].lastOrigin = null;

    // Dispatch task results asynchronously to avoid re-entrancy issues.
    const dispatch = (nextAction: any) =>
      microtask.then(() => store.dispatch(nextAction));

    const runEffect: RunnerFn = (effect, resolve, reject, ctx) =>
      effect(resolve, reject, ctx);

    return Promise.all(
      tasks.map(task =>
        task.run(runEffect, dispatch, dispatch, {onProgress: dispatch})
      )
    );
  };

// ---------------------------------------------------------------------------
// Test utilities
// ---------------------------------------------------------------------------

/**
 * @internal
 * Execute a task synchronously using a simulator function.
 * Throws if neither the resolve nor reject branch is called.
 */
function runSync(task: TaskDescriptor, simulator: RunnerFn): any {
  let outcome: any;
  let settled = false;
  task.run(
    simulator,
    value => {
      outcome = value;
      settled = true;
    },
    reason => {
      outcome = reason;
      settled = true;
    }
  );
  if (!settled) {
    throw new Error(
      `[kepler.gl] Task "${task.label}" did not call resolve or reject synchronously. ` +
        'Use drainTasksForTesting() for async tasks.'
    );
  }
  return outcome;
}

/** Simulate a task succeeding with a given value */
export const succeedTaskInTest = (task: TaskDescriptor, value: any): any =>
  runSync(task, (_effect, resolve) => resolve(value));

/** Simulate a task failing with a given reason */
export const errorTaskInTest = (task: TaskDescriptor, reason: any): any =>
  runSync(task, (_effect, _resolve, reject) => reject(reason));

/** Simulate a task with a custom runner (for complex scenarios) */
export const simulateTask = (task: TaskDescriptor, runner: RunnerFn): any =>
  runSync(task, runner);

/**
 * Simulate a task that resolves multiple times (e.g. a chained sequence),
 * consuming values from the provided array in order.
 */
export const succeedTaskWithValues = (task: TaskDescriptor, values: any[]): any => {
  let cursor = 0;
  return runSync(task, (_effect, resolve) => {
    if (cursor >= values.length) {
      throw new Error(
        `[kepler.gl] succeedTaskWithValues: ran out of values at index ${cursor}`
      );
    }
    return resolve(values[cursor++]);
  });
};

/**
 * Drain the task queue and return all pending tasks.
 * Call this in tests instead of running the full middleware.
 */
export const drainTasksForTesting = (): TaskDescriptor[] => {
  const tasks = getQueue();
  setQueue([]);
  g[QUEUE_KEY].lastOrigin = null;
  return tasks;
};

/**
 * Return the current task queue without clearing it.
 * Used by merger-handler to detect tasks scheduled during a merge step.
 */
export const getGlobalTaskQueue = getQueue;

// ---------------------------------------------------------------------------
// Default export — Task static API surface
// ---------------------------------------------------------------------------

const Task = {all, allSettled, fromCallback, fromPromise};
export {Task};
export default Task;
