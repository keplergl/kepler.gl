// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createSelector} from 'reselect';
import {isKeplerFileFormatAccepted} from '@kepler.gl/processors';
import {getApplicationConfig} from '@kepler.gl/utils';

// NOTE: default formats must match file-handler-test.js
const DEFAULT_FILE_EXTENSIONS = [
  'csv',
  'tsv',
  'dsv',
  'json',
  'geojson',
  'arrow',
  'parquet',
  'ndjson',
  'jsonl',
  'ndgeojson',
  'geojsonl',
  'ldgeojson',
  'kml',
  'gpx',
  'tcx'
];
// One chip per format family. Aliases (tsv, jsonl, ndgeojson, …) stay accepted
// via DEFAULT_FILE_EXTENSIONS but are not shown as separate icons/labels.
const DISPLAY_FILE_EXTENSIONS = [
  'csv',
  'json',
  'geojson',
  'arrow',
  'parquet',
  'geojsonl',
  'kml',
  'gpx',
  'tcx'
];
const DISPLAY_FILE_FORMATS = [
  'CSV',
  'Json',
  'GeoJSON',
  'Arrow',
  'Parquet',
  'GeoJSONL',
  'KML',
  'GPX',
  'TCX'
];

interface LoaderInfo {
  name: string;
  extensions: string[];
}

export const getFileFormatNames = createSelector(
  (state: {loaders: LoaderInfo[]}) => state.loaders,
  () => getApplicationConfig().acceptedFileFormats,
  (loaders, _acceptedFileFormats) => [
    ...DISPLAY_FILE_FORMATS.filter(isKeplerFileFormatAccepted),
    ...loaders.map(loader => loader.name)
  ]
);

export const getFileExtensions = createSelector(
  (state: {loaders: LoaderInfo[]}) => state.loaders,
  () => getApplicationConfig().acceptedFileFormats,
  (loaders, _acceptedFileFormats) => [
    ...DEFAULT_FILE_EXTENSIONS.filter(isKeplerFileFormatAccepted),
    ...loaders.flatMap(loader => loader.extensions)
  ]
);

export const getDisplayedFileExtensions = createSelector(getFileExtensions, extensions => {
  const shown = DISPLAY_FILE_EXTENSIONS.filter(ext => extensions.includes(ext));
  const custom = extensions.filter(ext => !DEFAULT_FILE_EXTENSIONS.includes(ext));
  return [...shown, ...custom];
});
