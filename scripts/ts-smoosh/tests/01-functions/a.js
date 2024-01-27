// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * A function with a JSDoc type import that matches its name
 * @type {typeof import('./a').foo}
 */
 export function foo(
  bar,
  baz
)  {
  return {boo: baz}
}

// A function with no type import
export function typeParams(a, b) {
  return a + b;
}
