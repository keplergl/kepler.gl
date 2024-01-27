// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Extra helpers for redux
// We are exposing this secause react-palm has no UMD module and
// users need taskMiddleware to initiate their redux middle ware
import {taskMiddleware} from 'react-palm/tasks';
import {Middleware} from 'redux';

/**
 * This method is used to enhance redux middleware and provide
 * functionality to support react-palm
 * @param middlewares current redux middlewares
 * @returns {*[]} the original list of middlewares plus the react-palm middleware
 */
export function enhanceReduxMiddleware(middlewares: Middleware[] = []): Middleware[] {
  return [...middlewares, taskMiddleware];
}
