// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DATA_TYPES} from 'type-analyzer';

import {ALL_FIELD_TYPES, FILTER_TYPES} from '@kepler.gl/constants';

import {getTileUrl, getMetaUrl, parseVectorMetadata as parseMetadata} from './vector-tile-utils';
import {PMTILES_METADATA, MVT_METADATA} from '../../../../test/fixtures/tile-metadata';

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

test('parseMetadata, metadata from MVTSource and Mapbox URL', () => {
  expect(
    parseMetadata(MVT_METADATA, {tileUrl: 'https://api.mapbox.com/v4/spam/{z}/{x}/{y}.mvt'})
  ).toEqual({
    attributions: [],
    metaJson: null,
    bounds: [-180, -85, 180, 85],
    center: [0, 0, 0],
    maxZoom: 16,
    minZoom: 0,
    fields: [
      {
        name: 'class',
        id: 'class',
        format: '',
        filterProps: {
          domain: [],
          value: [],
          type: 'multiSelect',
          gpu: false
        },
        type: 'string',
        analyzerType: 'STRING'
      }
    ],
    name: 'Mapbox Streets v8',
    description: ''
  });
});

test('parseMetadata, PMTiles from PMTileSource', () => {
  expect(
    parseMetadata(PMTILES_METADATA, {
      tileUrl:
        'https://4sq-studio-data-staging.s3.us-west-2.amazonaws.com/some_path/some_file.pmtiles'
    })
  ).toEqual({
    attributions: [],
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
    ],
    pmtilesType: 'mvt'
  });
});

test('parseMetadata, empty input', () => {
  expect(parseMetadata({})).toEqual({
    attributions: [],
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
    attributions: [],
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
    attributions: [],
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
      expect(parseMetadata(input as any)).toBe(expected);
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
