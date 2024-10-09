// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import '@testing-library/jest-dom';
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
