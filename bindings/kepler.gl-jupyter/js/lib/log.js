// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import console from 'global/console';

function log(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

export default log;
