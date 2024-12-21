// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const tileMetadata = {
  name: 'hextile_combo_v3',
  description: 'hextile_combo_v3_2020-07-18',
  version: '2',
  minzoom: '0',
  maxzoom: '11',
  center: '-88.066406,38.959277,10',
  bounds: '-105.060597,-0.001809,-0.002710,49.004284',
  type: 'overlay',
  format: 'pbf',
  generator: 'tippecanoe v1.35.0',
  generator_options:
    "tippecanoe '--minimum-zoom=7' -z 10 --no-feature-limit --no-tile-size-limit -r1 '--include=till_class' '--include=cover_crop_class' '--include=rotation' '--include=season_means' '--include=croptype' '--attribute-type=till_class:bool' '--attribute-type=rotation:bool' '--attribute-type=croptype:int' '--attribute-type=season_means:float' '--attribute-type=cover_crop_class:int' -P ./_DELX8//parcel_point.geojsonl -e ./_DELX8//parcel_tiles",
  json: '{"vector_layers": [ { "id": "parcel_pointgeojsonl", "description": "", "minzoom": 7, "maxzoom": 10, "fields": {"cover_crop_class": "Number", "croptype": "Number", "rotation": "Boolean", "season_means": "Number", "till_class": "Boolean"} } ],"tilestats": {"layerCount": 1,"layers": [{"layer": "parcel_pointgeojsonl","count": 1543446,"geometry": "Point","attributeCount": 5,"attributes": [{"attribute": "cover_crop_class","count": 2,"type": "number","values": [0,1],"min": 0,"max": 1},{"attribute": "croptype","count": 5,"type": "number","values": [0,1,2,3,4],"min": 0,"max": 4},{"attribute": "rotation","count": 2,"type": "boolean","values": [false,true]},{"attribute": "season_means","count": 67,"type": "number","values": [0,0.2,0.21,0.22],"min": 0,"max": 0.87},{"attribute": "till_class","count": 2,"type": "boolean","values": [false,true]}]}]}}'
};

export const parsedMetadata = {
  metaJson: {
    vector_layers: [
      {
        id: 'parcel_pointgeojsonl',
        description: '',
        minzoom: 7,
        maxzoom: 10,
        fields: {
          cover_crop_class: 'Number',
          croptype: 'Number',
          rotation: 'Boolean',
          season_means: 'Number',
          till_class: 'Boolean'
        }
      }
    ],
    tilestats: {
      layerCount: 1,
      layers: [
        {
          layer: 'parcel_pointgeojsonl',
          count: 1543446,
          geometry: 'Point',
          attributeCount: 5,
          attributes: [
            {
              attribute: 'cover_crop_class',
              count: 2,
              type: 'number',
              values: [0, 1],
              min: 0,
              max: 1
            },
            {
              attribute: 'croptype',
              count: 5,
              type: 'number',
              values: [0, 1, 2, 3, 4],
              min: 0,
              max: 4
            },
            {
              attribute: 'rotation',
              count: 2,
              type: 'boolean',
              values: [false, true]
            },
            {
              attribute: 'season_means',
              count: 67,
              type: 'number',
              values: [0, 0.2, 0.21, 0.22],
              min: 0,
              max: 0.87
            },
            {
              attribute: 'till_class',
              count: 2,
              type: 'boolean',
              values: [false, true]
            }
          ]
        }
      ]
    }
  },
  bounds: [-105.060597, -0.001809, -0.00271, 49.004284],
  center: [-88.066406, 38.959277, 10],
  maxZoom: 11,
  minZoom: 0,
  name: 'hextile_combo_v3',
  description: 'hextile_combo_v3_2020-07-18',
  fields: [
    {
      name: 'cover_crop_class',
      id: 'cover_crop_class',
      format: '',
      filterProps: {
        domain: [0, 1],
        value: [0, 1],
        type: 'range',
        typeOptions: ['range'],
        gpu: true,
        step: 0.001
      },
      type: 'real',
      analyzerType: 'FLOAT'
    },
    {
      name: 'croptype',
      id: 'croptype',
      format: '',
      filterProps: {
        domain: [0, 4],
        value: [0, 4],
        type: 'range',
        typeOptions: ['range'],
        gpu: true,
        step: 0.01
      },
      type: 'real',
      analyzerType: 'FLOAT'
    },
    {
      name: 'rotation',
      id: 'rotation',
      format: '',
      type: 'boolean',
      analyzerType: 'BOOLEAN',
      filterProps: {
        domain: [true, false],
        gpu: true,
        type: 'select',
        value: true
      }
    },
    {
      name: 'season_means',
      id: 'season_means',
      format: '',
      filterProps: {
        domain: [0, 0.87],
        value: [0, 0.87],
        type: 'range',
        typeOptions: ['range'],
        gpu: true,
        step: 0.0001
      },
      type: 'real',
      analyzerType: 'FLOAT'
    },
    {
      name: 'till_class',
      id: 'till_class',
      format: '',
      filterProps: {
        domain: [true, false],
        gpu: true,
        type: 'select',
        value: true
      },
      type: 'boolean',
      analyzerType: 'BOOLEAN'
    }
  ]
};

export const TIPPECANOE_PIPELINE_METADATA = {
  name: 'My Custom Tiles',
  format: 'pmtiles',
  formatVersion: 3,
  attributions: [],
  tileMIMEType: 'application/vnd.mapbox-vector-tile',
  minZoom: 0,
  maxZoom: 6,
  boundingBox: [
    [-150.1122219, -51.8952777],
    [179.3577783, 69.6043747]
  ],
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
