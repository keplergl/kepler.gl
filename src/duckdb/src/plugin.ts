// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {initializeDuckDb} from './init';

export const keplerGlDuckDBPlugin = {
  async init() {
    await initializeDuckDb();
    console.log('kepler.gl DuckDB Plugin initialized');
  }
};
