// Copyright (c) 2018 Uber Technologies, Inc.
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

export const QUERY_TYPES = keyMirror({
  file: null,
  sample: null
});

export const QUERY_OPTIONS = keyMirror({
  csv: null,
  geojson: null
});

export const LOADING_METHODS = [
  {
    id: 'upload',
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
    id: 'sample',
    label: 'Sample Data',
    options: [
      // Dynamically populated
    ]
  },
  {
    id: 'sharedstreets',
    label: 'Load SharedStreets Data'
  }
];

export const DEFAULT_LOADING_METHOD = LOADING_METHODS[0];

export const SHAREDSTREETS_DATASETS = [
  {
    id: 'pickup-dropoff',
    configUrl: "https://s3.amazonaws.com/sharedstreets-samples/pickup-dropoff-config.json",
    // sample data url
    dataUrl: "https://d2sn2dqnporv7a.cloudfront.net/12-1171-1566-decoded",
    // Sharedstreets layer will replace placeholder ${z} ${x} ${y} with the real value.
    // eslint-disable-next-line no-template-curly-in-string
    dataTemplateUrl: "https://d2sn2dqnporv7a.cloudfront.net/${z}-${x}-${y}-decoded",
    description: "Pick up and drop off data",
    imageUrl: "https://s3.amazonaws.com/sharedstreets-samples/pickup-dropoff.jpg",
    label: "Pick Up / Drop Off",
    queryType: QUERY_TYPES.sample,
    visible: true,
    isTiled: true
  }
]
