// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// test reducers (no enzyme dependency, most stable)
require('./reducers');

// test processors
require('./file-handler-test');

// test layers
require('./layer-tests');

// component tests (uses enzyme adapter)
require('./components');
