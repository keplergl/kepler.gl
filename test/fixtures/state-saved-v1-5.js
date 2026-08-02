// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import tripGeojson, {
  timeStampDomain,
  tripBounds,
  dataToTimeStamp
} from 'test/fixtures/trip-geojson';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {DEFAULT_LAYER_OPACITY, DEFAULT_TEXT_LABEL, DEFAULT_COLOR_UI} from '@kepler.gl/constants';
const {TripLayer} = KeplerGlLayers;

export const savedStateV1TripGeoJson = {
  datasets: [
    {
      version: 'v1',
      data: {
        id: 'trip_data',
        label: 'Trip Data',
        color: [162, 212, 171],
        allData: [
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'A',
                index: 0
              },
              geometry: tripGeojson.features[0].geometry
            },
            'A'
          ],
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'B',
                index: 1
              },
              geometry: tripGeojson.features[1].geometry
            },
            'B'
          ],
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'A',
                index: 2
              },
              geometry: tripGeojson.features[2].geometry
            },
            'A'
          ],
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'A',
                index: 3
              },
              geometry: tripGeojson.features[3].geometry
            },
            'A'
          ],
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'A',
                index: 4
              },
              geometry: tripGeojson.features[4].geometry
            },
            'A'
          ],
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'A',
                index: 5
              },
              geometry: tripGeojson.features[5].geometry
            },
            'A'
          ],
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'B',
                index: 6
              },
              geometry: tripGeojson.features[6].geometry
            },
            'B'
          ],
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'A',
                index: 7
              },
              geometry: tripGeojson.features[7].geometry
            },
            'A'
          ],
          [
            {
              type: 'Feature',
              properties: {
                vendor: 'A',
                index: 8
              },
              geometry: tripGeojson.features[8].geometry
            },
            'A'
          ]
        ],
        fields: [
          {
            name: '_geojson',
            type: 'geojson',
            format: ''
          },
          {
            name: 'vendor',
            type: 'string',
            format: ''
          }
        ]
      }
    }
  ],
  config: {
    version: 'v1',
    config: {
      visState: {
        filters: [],
        layers: [
          {
            id: 'trip-0',
            type: 'trip',
            config: {
              dataId: 'trip_data',
              columnMode: 'geojson',
              label: 'Trip Data',
              color: [0, 0, 0],
              highlightColor: [252, 242, 26, 255],
              columns: {
                geojson: '_geojson'
              },
              isVisible: true,
              visConfig: {
                opacity: 0.8,
                thickness: 0.5,
                colorRange: {
                  name: 'Global Warming',
                  type: 'sequential',
                  category: 'Uber',
                  colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                },
                trailLength: 180,
                fadeTrail: true,
                billboard: false,
                sizeRange: [0, 10],
                sizeScale: 1,
                scenegraph: null,
                scenegraphEnabled: false,
                scenegraphColorEnabled: false,
                scenegraphUseTrailColor: false,
                scenegraphColor: null,
                scenegraphCustomModelUrl: '',
                adjustRoll: 0,
                adjustPitch: 0,
                adjustYaw: 0,
                invertRoll: false,
                invertPitch: false,
                invertYaw: false,
                fixedRoll: true,
                fixedPitch: true,
                fixedYaw: true
              },
              hidden: false,
              textLabel: [
                {
                  field: null,
                  color: [255, 255, 255],
                  size: 18,
                  weight: 400,
                  offset: [0, 0],
                  anchor: 'start',
                  alignment: 'center',
                  outlineWidth: 0,
                  outlineColor: [255, 0, 0, 255],
                  background: false,
                  backgroundColor: null
                }
              ]
            },
            visualChannels: {
              colorField: null,
              colorScale: 'quantile',
              sizeField: null,
              sizeScale: 'linear',
              rollField: null,
              rollScale: 'linear',
              pitchField: null,
              pitchScale: 'linear',
              yawField: null,
              yawScale: 'linear'
            }
          }
        ],
        interactionConfig: {
          tooltip: {
            fieldsToShow: {
              trip_data: ['vendor']
            },
            enabled: true
          },
          brush: {
            size: 0.5,
            enabled: false
          }
        },
        layerBlending: 'normal',
        splitMaps: [],
        animationConfig: {
          currentTime: 1565577261000
        }
      },
      mapState: {
        bearing: 0,
        dragRotate: false,
        latitude: 37.75043,
        longitude: -122.34679,
        pitch: 0,
        zoom: 9,
        isSplit: false
      },
      mapStyle: {
        styleType: 'dark',
        topLayerGroups: {},
        visibleLayerGroups: {},
        threeDBuildingColor: [209, 206, 199],
        mapStyles: {}
      }
    }
  },
  info: {
    app: 'kepler.gl',
    created_at: 'Sun Sep 15 2019 18:49:29 GMT-0700 (PDT)'
  }
};

export const mergedLayer0 = new TripLayer({
  id: 'trip-0'
});

mergedLayer0.config = {
  dataId: 'trip_data',
  label: 'Trip Data',
  columnMode: 'geojson',
  color: [0, 0, 0],
  columns: {
    altitude: {value: null, fieldIdx: -1, optional: true},
    geojson: {value: '_geojson', fieldIdx: 0, optional: false},
    id: {value: null, fieldIdx: -1, optional: true},
    lat: {value: null, fieldIdx: -1, optional: true},
    lng: {value: null, fieldIdx: -1, optional: true},
    timestamp: {value: null, fieldIdx: -1, optional: true}
  },
  hidden: false,
  isVisible: true,
  isConfigActive: false,
  highlightColor: [252, 242, 26, 255],
  colorField: null,
  colorDomain: [0, 1],
  colorScale: 'quantile',
  sizeDomain: [0, 1],
  sizeScale: 'linear',
  sizeField: null,
  rollField: null,
  rollDomain: [0, 1],
  rollScale: 'linear',
  pitchField: null,
  pitchDomain: [0, 1],
  pitchScale: 'linear',
  yawField: null,
  yawDomain: [0, 1],
  yawScale: 'linear',
  colorUI: {
    color: DEFAULT_COLOR_UI,
    colorRange: DEFAULT_COLOR_UI
  },
  visConfig: {
    opacity: DEFAULT_LAYER_OPACITY,
    thickness: 0.5,
    colorRange: {
      name: 'Global Warming',
      type: 'sequential',
      category: 'Uber',
      colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
    },
    trailLength: 180,
    fadeTrail: true,
    billboard: false,
    sizeRange: [0, 10],
    sizeScale: 1,
    scenegraph: null,
    scenegraphEnabled: false,
    scenegraphColorEnabled: false,
    scenegraphUseTrailColor: false,
    scenegraphColor: null,
    scenegraphCustomModelUrl: '',
    adjustRoll: 0,
    adjustPitch: 0,
    adjustYaw: 0,
    invertRoll: false,
    invertPitch: false,
    invertYaw: false,
    fixedRoll: true,
    fixedPitch: true,
    fixedYaw: true
  },
  textLabel: [{...DEFAULT_TEXT_LABEL, backgroundColor: null}],
  animation: {enabled: true, domain: timeStampDomain}
};

mergedLayer0.dataToFeature = [
  {
    type: 'Feature',
    properties: {
      vendor: 'A',
      index: 0
    },
    geometry: tripGeojson.features[0].geometry
  },
  {
    type: 'Feature',
    properties: {
      vendor: 'B',
      index: 1
    },
    geometry: tripGeojson.features[1].geometry
  },
  {
    type: 'Feature',
    properties: {
      vendor: 'A',
      index: 2
    },
    geometry: tripGeojson.features[2].geometry
  },
  {
    type: 'Feature',
    properties: {
      vendor: 'A',
      index: 3
    },
    geometry: tripGeojson.features[3].geometry
  },
  {
    type: 'Feature',
    properties: {
      vendor: 'A',
      index: 4
    },
    geometry: tripGeojson.features[4].geometry
  },
  {
    type: 'Feature',
    properties: {
      vendor: 'A',
      index: 5
    },
    geometry: tripGeojson.features[5].geometry
  },
  {
    type: 'Feature',
    properties: {
      vendor: 'B',
      index: 6
    },
    geometry: tripGeojson.features[6].geometry
  },
  {
    type: 'Feature',
    properties: {
      vendor: 'A',
      index: 7
    },
    geometry: tripGeojson.features[7].geometry
  },
  {
    type: 'Feature',
    properties: {
      vendor: 'A',
      index: 8
    },
    geometry: tripGeojson.features[8].geometry
  }
];
mergedLayer0.dataToTimeStamp = dataToTimeStamp;
mergedLayer0.meta.bounds = tripBounds;
mergedLayer0.meta.featureTypes = {line: true};
