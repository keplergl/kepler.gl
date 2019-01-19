// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* different option share same query type e.g. events,
and segments both use queryRunner */
import keyMirror from 'keymirror';

export const ASSETS_URL = 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/';
export const DATA_URL = 'https://raw.githubusercontent.com/uber-web/kepler.gl-data/master/';
export const MAP_URI = 'demo/map?mapUrl=';
/*
 * If you want to add more samples, feel free to edit the json file on github kepler.gl data repo
 */
export const MAP_CONFIG_URL = `${DATA_URL}samples.json?nocache=${(new Date()).getTime()}`;

/**
 * I know this is already defined in Kepler core but it should be defined here
 * because it belongs to the demo app
 * @type {string}
 */
export const KEPLER_GL_WEBSITE = 'http://kepler.gl/';

export const QUERY_TYPES = keyMirror({
  file: null,
  sample: null
});

export const QUERY_OPTIONS = keyMirror({
  csv: null,
  geojson: null
});

export const LOADING_METHODS_NAMES = keyMirror({
  upload: null,
  remote: null,
  sample: null
});

export const LOADING_METHODS = [
  {
    id: LOADING_METHODS_NAMES.upload,
    label: 'Load Your Data',
    options: [
      {
        id: QUERY_OPTIONS.csv,
        queryType: QUERY_TYPES.file,
        label: 'Csv',
        icon: 'note',
        description:
        'Upload a csv file where each row contains one feature and its meta data. ' +
        'Columns with name xxx_lat and xxx_lng will be automatically detected as points.'
      },
      {
        id: QUERY_OPTIONS.geojson,
        queryType: QUERY_TYPES.file,
        label: 'Geojson',
        icon: 'note',
        description:
          'Upload a gpx, kml, or zipped Shapefile and we will convert each layer to GeoJSON.'
      }
    ]
  },
  {
    id: LOADING_METHODS_NAMES.remote,
    label: 'Load Map using URL'
  },
  {
    id: LOADING_METHODS_NAMES.sample,
    label: 'Sample Data',
    options: [
      // Dynamically populated
    ]
  }
];

export const LOADING_SAMPLE_LIST_ERROR_MESSAGE = 'Not able to load sample gallery';
export const LOADING_SAMPLE_ERROR_MESSAGE = 'Not able to load sample';
export const LOADING_URL_MESSAGE = 'You can use the following formats: CSV | JSON | Kepler.gl config json. Make sure the url contains the file extension.';
export const CORS_LINK = 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS';
export const KEPLER_DISCLAIMER = '* Kepler.gl will save your map data to your personal cloud storage, only people with the URL can access your map and data.';

export const DEFAULT_LOADING_METHOD = LOADING_METHODS[0];

export const DEFAULT_CLOUD_PROVIDER = 'dropbox';

export const DEFAULT_FEATURE_FLAGS = {
  cloudStorage: false
};
