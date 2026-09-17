// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import '@testing-library/jest-dom';

// jsdom / Jest's node environment omit some Web/Node globals that Node 20+ has.
const {TextDecoder, TextEncoder} = require('node:util');
const {deserialize, serialize} = require('node:v8');
Object.defineProperties(globalThis, {
  TextDecoder: {value: TextDecoder},
  TextEncoder: {value: TextEncoder},
  ...(typeof globalThis.structuredClone === 'function'
    ? {}
    : {structuredClone: {value: value => deserialize(serialize(value))}})
});

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}));

jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('@kepler.gl/utils'),
  hasPortableWidth: jest.fn(),
  hasMobileWidth: jest.fn()
}));

// @loaders.gl/parquet isn't tested in jest atm, and is generating errors
jest.mock('@loaders.gl/parquet', () => ({}));

global.URL.createObjectURL = jest.fn();
