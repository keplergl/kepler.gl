// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VisState} from '@kepler.gl/schemas';
import {Dispatch} from 'redux';

/**
 * KeplerContext provides access to kepler.gl state and dispatch.
 * This is passed into tool factories instead of using Redux directly.
 */
export type KeplerContext = {
  getVisState: () => VisState;
  getMapBoundary: () =>
    | {
        nw: [number, number];
        se: [number, number];
      }
    | undefined;
  getMapboxToken: () => string | undefined;
  dispatch: Dispatch;
};
