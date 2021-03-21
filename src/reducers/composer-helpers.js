// Copyright (c) 2021 Uber Technologies, Inc.
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

/* eslint-disable no-unused-vars */
// @ts-ignore
export function log(text) {
  return value => Console.log(text, value);
}
/* eslint-enable no-unused-vars */

export function payload_(p) {
  return {payload: p};
}

export function apply_(updater, payload) {
  return state => updater(state, payload);
}

export function with_(fn) {
  return state => fn(state)(state);
}

export function if_(pred, fn) {
  return pred ? fn : identity;
}

export function compose_(fns) {
  return state => fns.reduce((state2, fn) => fn(state2), state);
}

export function merge_(obj) {
  return state => ({...state, ...obj});
}

export function pick_(prop) {
  return fn => state => ({...state, [prop]: fn(state[prop])});
}

export function swap_(item) {
  return arr => arr.map(a => (a.id === item.id ? item : a));
}

export function findById(id) {
  return arr => arr.find(a => a.id === id);
}

export function map_(fn) {
  return arr => arr.map(e => fn(e));
}
