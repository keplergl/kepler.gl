// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createSelector} from 'reselect';

// NOTE: default formats must match file-handler-test.js
const DEFAULT_FILE_EXTENSIONS = ['csv', 'json', 'geojson', 'arrow'];
const DEFAULT_FILE_FORMATS = ['CSV', 'Json', 'GeoJSON', 'Arrow'];

export const getFileFormatNames = createSelector(
  state => state.loaders,
  // @ts-ignore loaders is unknonwn type
  loaders => [...DEFAULT_FILE_FORMATS, ...loaders.map(loader => loader.name)]
);

export const getFileExtensions = createSelector(
  state => state.loaders,
  // @ts-ignore loaders is unknonwn type
  loaders => [...DEFAULT_FILE_EXTENSIONS, ...loaders.flatMap(loader => loader.extensions)]
);
