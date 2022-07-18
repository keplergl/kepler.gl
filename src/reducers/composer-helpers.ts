// Copyright (c) 2022 Uber Technologies, Inc.
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

export function with_<State>(
  fn: (state: State) => (nextState: State) => State
): (state: State) => State {
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

export function findById<X extends {id: string}>(id: string): (arr: X[]) => X | undefined {
  return arr => arr.find(a => a.id === id);
}

export function map_<X>(fn: (state: X) => X): (arr: X[]) => X[] {
  return arr => arr.map(e => fn(e));
}
