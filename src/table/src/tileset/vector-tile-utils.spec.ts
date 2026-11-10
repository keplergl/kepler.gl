// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DATA_TYPES} from 'type-analyzer';

import {ALL_FIELD_TYPES, FILTER_TYPES} from '@kepler.gl/constants';

import {getTileUrl, getMetaUrl, parseVectorMetadata as parseMetadata} from './vector-tile-utils';
import {
  PMTILES_METADATA,
  PMTILES_METADATA_NUMERIC_TYPES,
  MVT_METADATA
} from '../../../../test/fixtures/tile-metadata';

describe('getTileUrl templates', () => {
  test.each([
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
  ])('$name', ({input, expected}) => {
    expect(getTileUrl(input)).toBe(expected);
  });
});

describe('getMetaUrl templates', () => {
  test.each([
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
  ])('$name', ({input, expected}) => {
    expect(getMetaUrl(input)).toBe(expected);
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
          fieldType: ALL_FIELD_TYPES.string,
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
          fieldType: ALL_FIELD_TYPES.real,
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
          fieldType: ALL_FIELD_TYPES.string,
          value: [],
          type: FILTER_TYPES.multiSelect,
          gpu: false
        }
      }
    ],
    pmtilesType: 'mvt'
  });
});

test.each([
  ['category', 'category'],
  ['category|2020-01-01', 'category|2021-01-01']
])(
  'parseMetadata merges categorical choices from %s and %s without selecting them',
  (first, second) => {
    const metadata = parseMetadata({
      tilejson: {
        layers: [
          {
            id: 'features',
            fields: [
              {name: first, type: 'utf8', values: ['A']},
              {name: second, type: 'utf8', values: ['B', 'A']}
            ]
          }
        ]
      }
    } as any);
    expect(metadata?.fields[0].filterProps).toEqual({
      fieldType: ALL_FIELD_TYPES.string,
      domain: ['A', 'B'],
      value: [],
      type: FILTER_TYPES.multiSelect,
      gpu: false
    });
  }
);

test.each(['air|quality', 'value|'])(
  'parseMetadata preserves the literal non-date field %s',
  name => {
    const metadata = parseMetadata({
      tilejson: {
        layers: [{id: 'features', fields: [{name, type: 'int', min: 0, max: 10}]}]
      }
    } as any);
    expect(metadata?.fields).toHaveLength(1);
    expect(metadata?.fields[0]).toMatchObject({
      name,
      id: name,
      type: ALL_FIELD_TYPES.integer
    });
    expect(metadata?.fields[0].filterProps?.domain?.slice()).toEqual([0, 10]);
    expect(metadata?.fields[0]).not.toHaveProperty('indexBy');
  }
);

test('parseMetadata keeps literal pipe fields alongside ordinary and dated fields', () => {
  const metadata = parseMetadata({
    tilejson: {
      layers: [
        {
          id: 'features',
          fields: [
            {name: 'ordinary', type: 'int', min: 0, max: 10},
            {name: 'value|', type: 'int', min: 1, max: 2},
            {name: 'value|quality', type: 'int', min: 3, max: 4},
            {name: 'value|2020-01-01', type: 'int', min: 5, max: 6},
            {name: 'value|2021-01-01', type: 'int', min: 7, max: 8}
          ]
        }
      ]
    }
  } as any);
  expect(metadata?.fields.map(field => field.name)).toEqual([
    'ordinary',
    'value',
    'value|',
    'value|quality'
  ]);
  expect(metadata?.fields.find(field => field.name === 'value')).toMatchObject({
    indexBy: {
      type: ALL_FIELD_TYPES.date,
      mappedValue: {
        [Date.UTC(2020, 0, 1)]: 'value|2020-01-01',
        [Date.UTC(2021, 0, 1)]: 'value|2021-01-01'
      }
    }
  });
});

test.each([
  ['int', [7]],
  ['int', ['7']],
  ['bool', [true]],
  ['utf8', [7, null, 'clinic']],
  ['utf8', undefined]
])('parseMetadata excludes incompatible %s values from string domains', (type, values) => {
  const metadata = parseMetadata({
    tilejson: {
      layers: [
        {id: 'strings', fields: [{name: 'class', type: 'utf8', values: ['clinic']}]},
        {id: 'mixed', fields: [{name: 'class', type, values}]},
        {id: 'later', fields: [{name: 'class', type: 'utf8', values: ['pharmacy', 'clinic']}]}
      ]
    }
  } as any);
  expect(metadata?.fields[0].filterProps).toMatchObject({
    domain: ['clinic', 'pharmacy'],
    value: [],
    fieldType: ALL_FIELD_TYPES.string,
    gpu: false
  });
});

test.each([
  ['int', ALL_FIELD_TYPES.integer, [0, 100]],
  ['bool', ALL_FIELD_TYPES.boolean, [0, 1]]
])(
  'parseMetadata retains %s ranges when later fields contain strings',
  (type, fieldType, domain) => {
    const metadata = parseMetadata({
      tilejson: {
        layers: [
          {id: 'ranges', fields: [{name: 'value', type, min: 0, max: 100}]},
          {id: 'strings', fields: [{name: 'value', type: 'utf8', values: ['clinic']}]}
        ]
      }
    } as any);
    expect(metadata?.fields[0].filterProps).toMatchObject({
      fieldType,
      type: FILTER_TYPES.range,
      gpu: true
    });
    expect(metadata?.fields[0].filterProps?.domain?.slice()).toEqual(domain);
  }
);

test('parseMetadata, PMTiles with numeric type aliases (float64, int32, uint64, bool)', () => {
  const result = parseMetadata(PMTILES_METADATA_NUMERIC_TYPES, {
    tileUrl: 'https://example.com/numeric_types.pmtiles'
  });

  expect(result).toEqual({
    attributions: [],
    name: 'Numeric Types Tiles',
    description: 'Tiles with various numeric type aliases',
    metaJson: null,
    bounds: [-180, -90, 180, 90],
    center: [0, 0, 3],
    maxZoom: 10,
    minZoom: 0,
    fields: [
      {
        id: 'score',
        name: 'score',
        format: '',
        type: ALL_FIELD_TYPES.real,
        analyzerType: DATA_TYPES.FLOAT,
        filterProps: {
          fieldType: ALL_FIELD_TYPES.real,
          domain: [0, 100],
          value: [0, 100],
          type: FILTER_TYPES.range,
          typeOptions: [FILTER_TYPES.range],
          gpu: true,
          step: 0.01
        }
      },
      {
        id: 'count',
        name: 'count',
        format: '',
        type: ALL_FIELD_TYPES.integer,
        analyzerType: DATA_TYPES.INT,
        filterProps: {
          fieldType: ALL_FIELD_TYPES.integer,
          domain: [1, 999],
          value: [1, 999],
          type: FILTER_TYPES.range,
          typeOptions: [FILTER_TYPES.range],
          gpu: true,
          step: 1
        }
      },
      {
        id: 'big_id',
        name: 'big_id',
        format: '',
        type: ALL_FIELD_TYPES.integer,
        analyzerType: DATA_TYPES.INT,
        filterProps: {
          fieldType: ALL_FIELD_TYPES.integer,
          domain: [0, 1000000],
          value: [0, 1000000],
          type: FILTER_TYPES.range,
          typeOptions: [FILTER_TYPES.range],
          gpu: true,
          step: 1
        }
      },
      {
        id: 'active',
        name: 'active',
        format: '',
        type: ALL_FIELD_TYPES.boolean,
        analyzerType: DATA_TYPES.BOOLEAN,
        filterProps: {
          fieldType: ALL_FIELD_TYPES.boolean,
          domain: [0, 1],
          value: [0, 1],
          type: FILTER_TYPES.range,
          typeOptions: [FILTER_TYPES.range],
          gpu: true,
          step: 1
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
  test.each([
    {name: 'empty string', input: '', expected: null},
    {name: 'null', input: null, expected: null},
    {name: 'undefined', input: undefined, expected: null},
    {name: 'string', input: 'spam', expected: null}
  ])('$name', ({input, expected}) => {
    expect(parseMetadata(input as any)).toBe(expected);
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

test.each(['1970-01-01', '1970-01-01T00:00:00Z'])(
  'retains the epoch time step indexed by %s',
  epoch => {
    const metadata = parseMetadata({
      tilejson: {
        layers: [
          {
            id: 'features',
            fields: [
              {name: `value|${epoch}`, type: 'float64', min: 1, max: 2},
              {name: 'value|1970-01-02', type: 'float64', min: 3, max: 4}
            ]
          }
        ]
      }
    } as any);
    expect(metadata?.fields).toHaveLength(1);
    expect(metadata?.fields[0]).toMatchObject({
      name: 'value',
      indexBy: {
        mappedValue: {'0': `value|${epoch}`, '86400000': 'value|1970-01-02'},
        ...(epoch.includes('T')
          ? {timeDomain: {domain: [0, 86400000], mappedValue: [0, 86400000]}}
          : {})
      }
    });
  }
);
