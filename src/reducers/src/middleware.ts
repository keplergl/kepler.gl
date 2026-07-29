// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Extra helpers for redux
import {taskMiddleware} from '@kepler.gl/tasks';
import {Middleware} from 'redux';

/**
 * This method is used to enhance redux middleware and provide
 * functionality to support the kepler.gl task system
 * @param middlewares current redux middlewares
 * @returns {*[]} the original list of middlewares plus the task middleware
 */
export function enhanceReduxMiddleware(middlewares: Middleware[] = []): Middleware[] {
  return [...middlewares, taskMiddleware];
}
