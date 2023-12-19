// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const configure = require('enzyme').configure;
const Adapter = require('@cfaester/enzyme-adapter-react-18').default;
configure({adapter: new Adapter()});

// component tests
require('./components');

// test layers
require('./layer-tests');

// test reducers
require('./reducers');

// test processors
require('./file-handler-test');
