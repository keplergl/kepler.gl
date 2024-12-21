// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DATA_TYPES} from 'type-analyzer';

import {ALL_FIELD_TYPES, FILTER_TYPES} from '@kepler.gl/constants';

import {getTileUrl, getMetaUrl, parseVectorMetadata as parseMetadata} from './vector-tile-utils';
import {
  tileMetadata,
  parsedMetadata,
  TIPPECANOE_PIPELINE_METADATA
} from '../../../../../test/fixtures/tile-metadata';

describe('getTileUrl', () => {
  [
    {name: 'empty string', input: '', expected: null},
    {name: 'invalid URL', input: '/foo/bar/baz.mvt', expected: null},
    {
      name: 'Valid URL, no placeholders',
      input: 'http://www.example.com',
      expected: 'http://www.example.com/{z}/{x}/{y}.pbf'
    },
    {
      name: 'Valid URL, no placeholders, trailing slash',
      input: 'http://www.example.com/',
      expected: 'http://www.example.com/{z}/{x}/{y}.pbf'
    },
    {
      name: 'Valid URL, placeholders',
      input: 'http://www.example.com/{z}/{x}/{y}.pbf',
      expected: 'http://www.example.com/{z}/{x}/{y}.pbf'
    },
    {
      name: 'Valid URL, placeholders, mvt',
      input: 'http://www.example.com/{z}/{x}/{y}.mvt',
      expected: 'http://www.example.com/{z}/{x}/{y}.mvt'
    },
    {
      name: 'Valid URL, placeholders, mvt, access token',
      input: 'https://api.mapbox.com/v4/spam/{z}/{x}/{y}.mvt?access_token=sk.fobar.baz',
      expected: 'https://api.mapbox.com/v4/spam/{z}/{x}/{y}.mvt?access_token=sk.fobar.baz'
    }
  ].forEach(({name, input, expected}) => {
    test(name, () => {
      expect(getTileUrl(input)).toBe(expected);
    });
  });
});

describe('getMetaUrl', () => {
  [
    {name: 'empty string', input: '', expected: null},
    {name: 'invalid URL', input: '/foo/bar/baz.mvt', expected: null},
    {
      name: 'Valid URL, unknown domain',
      input: 'http://www.example.com/some_tiles',
      expected: 'http://www.example.com/some_tiles/metadata.json'
    },
    {
      name: 'Valid URL, unknown domain, trailing slash',
      input: 'http://www.example.com/some_tiles/',
      expected: 'http://www.example.com/some_tiles/metadata.json'
    },
    {
      name: 'Valid URL, Mapbox domain',
      input: 'https://api.mapbox.com/v4/spam/{z}/{x}/{y}.mvt',
      expected: 'https://api.mapbox.com/v4/spam.json'
    },
    {
      name: 'Valid URL, placeholders, mvt, access token',
      input: 'https://api.mapbox.com/v4/spam/{z}/{x}/{y}.mvt?access_token=sk.fobar.baz',
      expected: 'https://api.mapbox.com/v4/spam.json?access_token=sk.fobar.baz'
    },
    {
      name: 'Valid URL, placeholders, mvt, access token, published style version',
      input:
        'https://api.mapbox.com/v4/spam/{z}/{x}/{y}.mvt?style=mapbox://styles/user/styleId@00&access_token=pk.xxx.zzz',
      expected:
        'https://api.mapbox.com/v4/spam.json?style=mapbox://styles/user/styleId@00&access_token=pk.xxx.zzz'
    }
  ].forEach(({name, input, expected}) => {
    test(name, () => {
      expect(getMetaUrl(input)).toBe(expected);
    });
  });
});

test('parseMetadata, unknown URL', () => {
  const metaJson = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    vector_layers: [
      // eslint-disable-next-line @typescript-eslint/naming-convention
      {id: 'Test', description: '', minzoom: 0, maxzoom: 14, fields: {some_field: 'Number'}}
    ],
    tilestats: {
      layerCount: 1,
      layers: [
        {
          layer: 'Test',
          attributes: [{attribute: 'some_field', type: 'number', min: 0.3, max: 33.5}]
        }
      ]
    }
  };

  expect(
    parseMetadata(
      {
        name: 'Test',
        description: 'vector tiles',
        minzoom: '0',
        maxzoom: '14',
        center: '-87.088623,30.382353,14',
        bounds: '-87.271471,30.344584,-86.789198,30.999259',
        generator: 'tippecanoe v2.24.0',
        json: JSON.stringify(metaJson)
      },
      {tileUrl: 'http://example.com/tiles'}
    )
  ).toEqual({
    name: 'Test',
    description: 'vector tiles',
    metaJson,
    bounds: [-87.271471, 30.344584, -86.789198, 30.999259],
    center: [-87.088623, 30.382353, 14],
    maxZoom: 14,
    minZoom: 0,
    fields: [
      {
        id: 'some_field',
        name: 'some_field',
        format: '',
        type: ALL_FIELD_TYPES.real,
        analyzerType: DATA_TYPES.FLOAT,
        filterProps: {
          domain: [0.3, 33.5],
          value: [0.3, 33.5],
          type: 'range',
          typeOptions: ['range'],
          gpu: true,
          step: 0.01
        }
      }
    ]
  });

  // Check fixture
  expect(parseMetadata(tileMetadata)).toMatchObject(parsedMetadata);
});

test('parseMetadata, Mapbox URL', () => {
  expect(
    parseMetadata(
      {
        name: 'Test',
        description: 'vector tiles',
        minzoom: '0',
        maxzoom: '14',
        center: '-87.088623,30.382353,14',
        bounds: '-87.271471,30.344584,-86.789198,30.999259',
        generator: 'tippecanoe v2.24.0',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vector_layers: [
          // eslint-disable-next-line @typescript-eslint/naming-convention
          {id: 'Test', description: '', minzoom: 0, maxzoom: 14, fields: {some_field: 'Number'}}
        ]
      },
      {tileUrl: 'https://api.mapbox.com/v4/spam/{z}/{x}/{y}.mvt'}
    )
  ).toEqual({
    name: 'Test',
    description: 'vector tiles',
    metaJson: null,
    bounds: [-87.271471, 30.344584, -86.789198, 30.999259],
    center: [-87.088623, 30.382353, 14],
    maxZoom: 14,
    minZoom: 0,
    fields: [
      {
        id: 'some_field',
        name: 'some_field',
        format: '',
        type: ALL_FIELD_TYPES.real,
        analyzerType: DATA_TYPES.FLOAT
      }
    ]
  });
});

test('parseMetadata, pipeline PMTiles', () => {
  expect(
    parseMetadata(TIPPECANOE_PIPELINE_METADATA, {
      tileUrl:
        'https://4sq-studio-data-staging.s3.us-west-2.amazonaws.com/some_path/some_file.pmtiles',
      isDataSourceMetadata: true
    })
  ).toEqual({
    name: 'My Custom Tiles',
    description: 'My Custom Tiles Description',
    metaJson: null,
    bounds: [-150.1122219, -51.8952777, 179.3577783, 69.6043747],
    center: [14.0625, 50.7026397, 6],
    maxZoom: 6,
    minZoom: 0,
    fields: [
      {
        id: 'metric',
        name: 'metric',
        format: '',
        type: ALL_FIELD_TYPES.real,
        analyzerType: DATA_TYPES.FLOAT,
        filterProps: {
          domain: [-1, 10],
          value: [-1, 10],
          type: FILTER_TYPES.range,
          typeOptions: [FILTER_TYPES.range],
          gpu: true,
          step: 0.01
        }
      },
      {
        id: 'continent',
        name: 'continent',
        format: '',
        type: ALL_FIELD_TYPES.string,
        analyzerType: DATA_TYPES.STRING,
        filterProps: {
          domain: ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'],
          value: ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'],
          type: FILTER_TYPES.multiSelect,
          gpu: false
        }
      }
    ]
  });
});

test('parseMetadata, empty input', () => {
  expect(parseMetadata({})).toEqual({
    name: '',
    description: '',
    metaJson: null,
    bounds: null,
    center: null,
    maxZoom: null,
    minZoom: null,
    fields: []
  });

  expect(
    parseMetadata({}, {tileUrl: 'http://xyz.api.here.com/some_id/tile/web/{z}_{x}_{y}.pbf'})
  ).toEqual({
    name: '',
    description: '',
    metaJson: null,
    bounds: null,
    center: null,
    maxZoom: null,
    minZoom: null,
    fields: []
  });

  expect(parseMetadata({}, {tileUrl: 'https://api.mapbox.com/v4/spam/{z}/{x}/{y}.mvt'})).toEqual({
    name: '',
    description: '',
    metaJson: null,
    bounds: null,
    center: null,
    maxZoom: null,
    minZoom: null,
    fields: []
  });
});

describe('parseMetadata, bad cases', () => {
  [
    {name: 'empty string', input: '', expected: null},
    {name: 'null', input: null, expected: null},
    {name: 'undefined', input: undefined, expected: null},
    {name: 'string', input: 'spam', expected: null}
  ].forEach(({name, input, expected}) => {
    test(name, () => {
      expect(parseMetadata(input)).toBe(expected);
    });
  });
});

describe('getTileUrl', () => {
  test.each([
    ['', null],
    ['foo', null],
    ['http', null],
    ['http://', null],
    ['https://', null],
    ['http://mytiles.com', 'http://mytiles.com/{z}/{x}/{y}.pbf'],
    ['https://mytiles.com', 'https://mytiles.com/{z}/{x}/{y}.pbf'],
    ['http://mytiles.com/', 'http://mytiles.com/{z}/{x}/{y}.pbf'],
    ['http://mytiles.com/foo', 'http://mytiles.com/foo/{z}/{x}/{y}.pbf'],
    ['http://mytiles.com/foo/', 'http://mytiles.com/foo/{z}/{x}/{y}.pbf'],
    ['https://mytiles.com/foo/bar.baz', 'https://mytiles.com/foo/bar.baz/{z}/{x}/{y}.pbf'],
    ['http://localhost', 'http://localhost/{z}/{x}/{y}.pbf'],
    ['http://localhost/', 'http://localhost/{z}/{x}/{y}.pbf'],
    ['http://localhost:8080', 'http://localhost:8080/{z}/{x}/{y}.pbf'],
    ['http://localhost:8080/', 'http://localhost:8080/{z}/{x}/{y}.pbf'],
    ['http://mytiles.com/foo/{z}/{x}/{y}.mvt', 'http://mytiles.com/foo/{z}/{x}/{y}.mvt']
  ])('%s', (input, expected) => {
    expect(getTileUrl(input)).toEqual(expected);
  });
});

describe('getMetaUrl', () => {
  test.each([
    ['', null],
    ['foo', null],
    ['http', null],
    ['http://', null],
    ['https://', null],
    ['http://mytiles.com', 'http://mytiles.com/metadata.json'],
    ['https://mytiles.com', 'https://mytiles.com/metadata.json'],
    ['http://mytiles.com/', 'http://mytiles.com/metadata.json'],
    ['http://mytiles.com/foo', 'http://mytiles.com/foo/metadata.json'],
    ['http://mytiles.com/foo/', 'http://mytiles.com/foo/metadata.json'],
    ['https://mytiles.com/foo/bar.baz', 'https://mytiles.com/foo/bar.baz/metadata.json'],
    ['http://localhost', 'http://localhost/metadata.json'],
    ['http://localhost/', 'http://localhost/metadata.json'],
    ['http://localhost:8080', 'http://localhost:8080/metadata.json'],
    ['http://localhost:8080/', 'http://localhost:8080/metadata.json'],
    ['http://mytiles.com/foo/{z}/{x}/{y}.mvt', 'http://mytiles.com/foo/metadata.json']
  ])('%s', (input, expected) => {
    expect(getMetaUrl(input)).toEqual(expected);
  });
});
