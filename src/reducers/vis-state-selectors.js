import {createSelector} from 'reselect';

// NOTE: default formats must match file-handler.js
const DEFAULT_FILE_EXTENSIONS = ['csv', 'json', 'geojson'];
const DEFAULT_FILE_FORMATS = ['CSV', 'Json', 'GeoJSON'];

export const getFileFormatNames = createSelector(
  state => state.loaders,
  loaders => [...DEFAULT_FILE_FORMATS, ...loaders.map(loader => loader.name)]
);

export const getFileExtensions = createSelector(
  state => state.loaders,
  loaders => [...DEFAULT_FILE_EXTENSIONS, ...loaders.flatMap(loader => loader.extensions)]
);
