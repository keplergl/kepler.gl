// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * A function with a JSDoc type import that is different from its name
 * @type {typeof import('./b').MyFn}
 */
function c(a, b) {
  console.log('haha hi')
  return a + b;
}
