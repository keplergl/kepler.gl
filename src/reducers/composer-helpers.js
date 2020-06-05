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