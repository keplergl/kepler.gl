// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Console from 'global/console';

const identity = state => state;

/** Returns a function that logs a value with a given message */
export function log(text: string): (value: any) => void {
  return value => Console.log(text, value);
}
/** Wraps a value in an object and stores it the `payload` field */
export function payload_<P>(payload: P) {
  return {payload};
}
/** Wraps a value in an object and stores it the `payload` field */
export function apply_<State, P>(
  updater: (state: State, nextPayload: P) => State,
  payload: P
): (state: State) => State {
  return state => updater(state, payload);
}

type Arg<State> = (state: State) => (nextState: State) => State;
export function with_<State>(fn: Arg<State>): (state: State) => State {
  return state => fn(state)(state);
}

export function if_<State>(pred: boolean, fn: (state: State) => State): (state: State) => State {
  return pred ? fn : identity;
}

export function compose_<State>(fns: Array<(s: State) => State>): (s: State) => State {
  return state => fns.reduce((state2, fn) => fn(state2), state);
}
/** Returns a reducer function that merges props with state */
export function merge_<Props>(obj: Props): <State>(state: State) => State {
  return state => ({...state, ...obj});
}

export function pick_<Prop extends string>(
  prop: Prop
): <Value>(fn: (p: Value) => Value) => <State extends Record<Prop, Value>>(state: State) => State {
  return fn => state => ({...state, [prop]: fn(state[prop])});
}

export function swap_<X extends {id: string}>(item: X): (arr: X[]) => X[] {
  return arr => arr.map(a => (a.id === item.id ? item : a));
}

export function map_<X, T>(fn: (state: X) => T): (arr: X[]) => T[] {
  return arr => arr.map(e => fn(e));
}

export function filterOutById<X extends {id: string}>(id: string): (arr: X[]) => X[] {
  return arr => arr.filter(e => e.id !== id);
}

export function removeElementAtIndex<X>(index: number): (arr: X[]) => X[] {
  return arr => [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)];
}
