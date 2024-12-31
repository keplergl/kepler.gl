// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const MVT_METADATA = {
  name: 'Mapbox Streets v8',
  description: '',
  boundingBox: [
    [-180, -85],
    [180, 85]
  ] as [[number, number], [number, number]],
  center: [0, 0, 0],
  maxZoom: 16,
  minZoom: 0,
  layers: [
    {
      name: 'landuse',
      description: '',
      id: 'landuse',
      minzoom: 5,
      source: 'mapbox.mapbox-streets-v8',
      source_name: 'Mapbox Streets v8',
      fields: [
        {
          name: 'class',
          type: 'string'
        }
      ]
    }
  ]
};

export const PMTILES_METADATA = {
  name: 'My Custom Tiles',
  format: 'pmtiles' as const,
  formatVersion: 3,
  attributions: [],
  tileMIMEType: 'application/vnd.mapbox-vector-tile' as const,
  minZoom: 0,
  maxZoom: 6,
  boundingBox: [
    [-150.1122219, -51.8952777],
    [179.3577783, 69.6043747]
  ] as [[number, number], [number, number]],
  center: [14.0625, 50.7026397],
  centerZoom: 6,
  tilejson: {
    name: 'My Custom Tiles',
    description: 'My Custom Tiles Description',
    generator: 'tippecanoe v2.37.1',
    generatorOptions:
      'tippecanoe -zg -o output.pmtiles --drop-densest-as-needed ne_10m_railroads.geojson',
    boundingBox: [
      [-150.112222, -51.895278],
      [179.357778, 69.604375]
    ],
    center: null,
    maxZoom: null,
    minZoom: null,
    layers: [
      {
        name: 'ne_10m_railroads',
        id: 'ne_10m_railroads',
        description: '',
        minzoom: 0,
        maxzoom: 6,
        dominantGeometry: 'LineString',
        fields: [
          {
            name: 'metric',
            type: 'float32',
            min: -1,
            max: 10,
            uniqueValueCount: 2,
            values: [-1, 10]
          },
          {
            name: 'continent',
            type: 'utf8',
            uniqueValueCount: 6,
            values: ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
          }
        ]
      }
    ]
  }
};
