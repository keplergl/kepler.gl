// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * A function with a JSDoc type import that matches its name
 * @type {typeof import('./a').foo}
 */
export function foo(bar: string, baz: number): {
    boo: number;
} {
    return { boo: baz };
}
// A function with no type import
export function typeParams<A, B>(a: A, b: B): B {
    return a + b;
}
