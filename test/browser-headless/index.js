// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const configure = require('enzyme').configure;
const Adapter = require('@cfaester/enzyme-adapter-react-18').default;
configure({adapter: new Adapter()});

// test components
import './component/map-container-test';
