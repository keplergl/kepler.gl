// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import '@testing-library/jest-dom';

// ReferenceError: ReadableStream is not defined in @loaders.gl/polyfills
const {ReadableStream} = require('node:stream/web');
globalThis.ReadableStream = ReadableStream;

import {installFilePolyfills} from '@loaders.gl/polyfills';
installFilePolyfills();

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}));

jest.mock('@kepler.gl/utils', () => ({
  ...jest.requireActual('@kepler.gl/utils'),
  hasPortableWidth: jest.fn(),
  hasMobileWidth: jest.fn()
}));

global.URL.createObjectURL = jest.fn();
