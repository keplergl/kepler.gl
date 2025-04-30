// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {processKeplerglJSON} from '@kepler.gl/processors';
import CloneDeep from 'lodash/cloneDeep';
import {keplerGlReducerCore as coreReducer} from '@kepler.gl/reducers';
import {addDataToMap} from '@kepler.gl/actions';
import {InitialState, applyActions} from '../helpers/mock-state';

export const syncedFilterWithTripLayerMap = {
  datasets: [
    {
      version: 'v1',
      data: {
        id: 'points-dataset',
        label: 'few-points.csv',
        color: [143, 47, 191],
        allData: [
          [
            '2019/07/26 21:32:28.23',
            34.5585,
            -117.13116,
            5.358,
            3.67,
            'Md',
            13,
            255,
            65,
            0.05,
            'NCSN',
            330724
          ],
          [
            '2019/07/26 21:41:00.22',
            35.99,
            -120.12033,
            12.058,
            2.98,
            'Md',
            41,
            127,
            8,
            0.08,
            'NCSN',
            330782
          ],
          [
            '2019/07/26 22:04:22.72',
            40.50533,
            -123.50616,
            10.046,
            2.74,
            'Md',
            20,
            49,
            4,
            0.14,
            'NCSN',
            330793
          ],
          [
            '2019/07/26 22:05:35.14',
            38.80083,
            -122.8005,
            0.577,
            2.66,
            'Md',
            27,
            58,
            1,
            0.04,
            'NCSN',
            331469
          ],
          [
            '2019/07/26 23:04:44.55',
            40.15017,
            -123.81734,
            19.269,
            2.88,
            'Md',
            21,
            160,
            6,
            0.1,
            'NCSN',
            331395
          ],
          [
            '2019/07/26 23:30:11.18',
            38.03183,
            -118.73933,
            1.896,
            2.62,
            'Md',
            40,
            206,
            25,
            0.07,
            'NCSN',
            331581
          ],
          [
            '2019/07/26 23:37:25.34',
            38.04317,
            -118.72916,
            6.125,
            2.89,
            'Md',
            37,
            209,
            26,
            0.07,
            'NCSN',
            331585
          ],
          [
            '2019/07/26 23:38:51.29',
            37.13117,
            -121.529,
            7.697,
            2.7,
            'Md',
            80,
            89,
            2,
            0.06,
            'NCSN',
            331584
          ],
          [
            '2019/07/26 23:38:56.37',
            36.55633,
            -121.149,
            7.151,
            3.36,
            'Md',
            64,
            33,
            4,
            0.06,
            'NCSN',
            331636
          ],
          [null, null, null, null, null, null, null, null, null, null, null, null]
        ],
        fields: [
          {
            name: 'DateTime',
            type: 'timestamp',
            format: 'YYYY/M/D HH:mm:ss.SSSS',
            analyzerType: 'DATETIME'
          },
          {name: 'Latitude', type: 'real', format: '', analyzerType: 'FLOAT'},
          {name: 'Longitude', type: 'real', format: '', analyzerType: 'FLOAT'},
          {name: 'Depth', type: 'real', format: '', analyzerType: 'FLOAT'},
          {name: 'Magnitude', type: 'real', format: '', analyzerType: 'FLOAT'},
          {name: 'MagType', type: 'string', format: '', analyzerType: 'STRING'},
          {name: 'NbStations', type: 'integer', format: '', analyzerType: 'INT'},
          {name: 'Gap', type: 'integer', format: '', analyzerType: 'INT'},
          {name: 'Distance', type: 'integer', format: '', analyzerType: 'INT'},
          {name: 'RMS', type: 'real', format: '', analyzerType: 'FLOAT'},
          {name: 'Source', type: 'string', format: '', analyzerType: 'STRING'},
          {name: 'EventID', type: 'integer', format: '', analyzerType: 'INT'}
        ]
      }
    },
    {
      version: 'v1',
      data: {
        id: 'trip-dataset',
        label: 'trips.json',
        color: [0, 92, 255],
        allData: [
          [
            {
              type: 'Feature',
              properties: {vendor: 'A'},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [-74.20986, 40.81743, 0, 1564174363],
                  [-74.20987, 40.81755, 0, 1564174596],
                  [-74.20998, 40.81766, 0, 1564174709],
                  [-74.20986, 40.81773, 0, 1564174963],
                  [-74.20987, 40.81785, 0, 1564175196],
                  [-74.20998, 40.81806, 0, 1564175309],
                  [-74.20986, 40.81813, 0, 1564175563],
                  [-74.20987, 40.81825, 0, 1564175796],
                  [-74.20998, 40.81846, 0, 1564175909],
                  [-74.20986, 40.81853, 0, 1564176163],
                  [-74.20987, 40.81865, 0, 1564176396],
                  [-74.20998, 40.81876, 0, 1564176509],
                  [-74.20986, 40.81883, 0, 1564176763],
                  [-74.20987, 40.81895, 0, 1564176996],
                  [-74.20998, 40.81906, 0, 1564177109],
                  [-74.20986, 40.81913, 0, 1564177363],
                  [-74.20987, 40.81925, 0, 1564177596],
                  [-74.20998, 40.81936, 0, 1564177709],
                  [-74.20986, 40.81943, 0, 1564177963],
                  [-74.20987, 40.81955, 0, 1564178196],
                  [-74.20998, 40.81966, 0, 1564178309],
                  [-74.20986, 40.81973, 0, 1564178563],
                  [-74.20987, 40.81985, 0, 1564178796],
                  [-74.20998, 40.81996, 0, 1564179109]
                ]
              }
            },
            'A'
          ]
        ],
        fields: [
          {name: '_geojson', type: 'geojson', format: '', analyzerType: 'GEOMETRY'},
          {name: 'vendor', type: 'string', format: '', analyzerType: 'STRING'}
        ]
      }
    }
  ],
  config: {
    version: 'v1',
    config: {
      visState: {
        filters: [
          {
            dataId: ['points-dataset'],
            id: 'vxwjjz1sf',
            name: ['DateTime'],
            type: 'timeRange',
            value: [1564176748230, 1564184336370],
            enlarged: true,
            plotType: 'histogram',
            animationWindow: 'free',
            yAxis: null,
            speed: 1
          }
        ],
        layers: [
          {
            id: 'proypi',
            type: 'point',
            config: {
              dataId: 'points-dataset',
              label: 'Point',
              color: [255, 203, 153],
              highlightColor: [252, 242, 26, 255],
              columns: {lat: 'Latitude', lng: 'Longitude', altitude: null},
              isVisible: true,
              visConfig: {
                radius: 10,
                fixedRadius: false,
                opacity: 0.8,
                outline: false,
                thickness: 2,
                strokeColor: null,
                colorRange: {
                  name: 'Global Warming',
                  type: 'sequential',
                  category: 'Uber',
                  colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                },
                strokeColorRange: {
                  name: 'Global Warming',
                  type: 'sequential',
                  category: 'Uber',
                  colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                },
                radiusRange: [0, 50],
                filled: true
              },
              hidden: false,
              textLabel: [
                {
                  field: null,
                  color: [255, 255, 255],
                  size: 18,
                  offset: [0, 0],
                  anchor: 'start',
                  alignment: 'center'
                }
              ]
            },
            visualChannels: {
              colorField: {name: 'Depth', type: 'real'},
              colorScale: 'quantile',
              strokeColorField: null,
              strokeColorScale: 'quantile',
              sizeField: null,
              sizeScale: 'linear'
            }
          },
          {
            id: 'p4jyzm7',
            type: 'trip',
            config: {
              dataId: 'trip-dataset',
              label: 'un_2573-trips',
              color: [248, 149, 112],
              highlightColor: [252, 242, 26, 255],
              columns: {geojson: '_geojson'},
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
                sizeRange: [0, 10]
              },
              hidden: false,
              textLabel: [
                {
                  field: null,
                  color: [255, 255, 255],
                  size: 18,
                  offset: [0, 0],
                  anchor: 'start',
                  alignment: 'center'
                }
              ]
            },
            visualChannels: {
              colorField: null,
              colorScale: 'quantile',
              sizeField: null,
              sizeScale: 'linear'
            }
          }
        ],
        interactionConfig: {
          tooltip: {
            fieldsToShow: {
              'point-dataset': [
                {name: 'DateTime', format: null},
                {name: 'Latitude', format: null},
                {name: 'Longitude', format: null},
                {name: 'Depth', format: null},
                {name: 'Magnitude', format: null}
              ],
              'trip-dataset': [{name: 'vendor', format: null}]
            },
            compareMode: false,
            compareType: 'absolute',
            enabled: true
          },
          brush: {size: 0.5, enabled: false},
          geocoder: {enabled: false},
          coordinate: {enabled: false}
        },
        layerBlending: 'normal',
        splitMaps: [],
        animationConfig: {currentTime: 1564174363000, speed: 1}
      },
      mapState: {
        bearing: 0,
        dragRotate: false,
        latitude: 37.68923,
        longitude: -99.0136,
        pitch: 0,
        zoom: 4,
        isSplit: false
      },
      mapStyle: {
        styleType: 'dark',
        topLayerGroups: {},
        visibleLayerGroups: {
          label: true,
          road: true,
          border: false,
          building: true,
          water: true,
          land: true,
          '3d building': false
        },
        threeDBuildingColor: [9.665468314072013, 17.18305478057247, 31.1442867897876],
        mapStyles: {}
      }
    }
  },
  info: {
    app: 'kepler.gl',
    created_at: 'Wed Oct 20 2021 16:38:55 GMT-0400 (Eastern Daylight Time)',
    title: 'keplergl_acitcdlh',
    description: ''
  }
};

export const mockStateWithSyncedFilterAndTripLayer = () => {
  const initialState = CloneDeep(InitialState);
  const result = processKeplerglJSON(syncedFilterWithTripLayerMap);

  const newState = applyActions(coreReducer, initialState, [
    {
      action: addDataToMap,
      payload: [result]
    }
  ]);

  return newState;
};
