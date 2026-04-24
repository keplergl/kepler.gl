// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import '@testing-library/jest-dom';

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
