// Copyright (c) 2021 Uber Technologies, Inc.
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

export const savedConfigV0 = {
  version: 'v0',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: '5em',
          dataId: 'something',
          label: 'trip arc',
          color: [18, 147, 154],
          columns: {
            lat0: {
              value: 'begintrip_lat',
              fieldIdx: 3
            },
            lng0: {
              value: 'begintrip_lng',
              fieldIdx: 4
            },
            lat1: {
              value: 'dropoff_lat',
              fieldIdx: 27
            },
            lng1: {
              value: 'dropoff_lng',
              fieldIdx: 28
            }
          },
          isVisible: false,
          isAggregated: false,
          type: 'arc',
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            opacity: 0.8,
            targetColor: null,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            sizeRange: [0, 10],
            'hi-precision': false
          }
        },
        {
          id: 'gtyf',
          dataId: 'something',
          label: 'begintrip cluster',
          color: [241, 92, 23],
          columns: {
            lat: {
              value: 'begintrip_lat',
              fieldIdx: 3
            },
            lng: {
              value: 'begintrip_lng',
              fieldIdx: 4
            }
          },
          isVisible: false,
          isAggregated: true,
          type: 'cluster',
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            clusterRadius: 40,
            opacity: 0.8,
            outline: false,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            radiusRange: [1, 40],
            'hi-precision': false
          },
          enable3d: false,
          colorAggregation: 'average',
          sizeAggregation: 'average'
        },
        {
          id: 'rj',
          dataId: 'something',
          label: 'begintrip',
          color: [218, 112, 191],
          columns: {
            lat: {
              value: 'begintrip_lat',
              fieldIdx: 3
            },
            lng: {
              value: 'begintrip_lng',
              fieldIdx: 4
            },
            altitude: {
              value: null,
              fieldIdx: -1,
              optional: true
            }
          },
          isVisible: true,
          isAggregated: false,
          type: 'point',
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            radius: 10,
            fixedRadius: false,
            opacity: 0.8,
            outline: false,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            radiusRange: [0, 50],
            'hi-precision': false
          }
        },
        {
          id: '9e7',
          dataId: 'something',
          label: 'dropoff',
          color: [255, 153, 31],
          columns: {
            lat: {
              value: 'dropoff_lat',
              fieldIdx: 27
            },
            lng: {
              value: 'dropoff_lng',
              fieldIdx: 28
            },
            altitude: {
              value: null,
              fieldIdx: -1,
              optional: true
            }
          },
          isVisible: false,
          isAggregated: false,
          type: 'point',
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            radius: 10,
            fixedRadius: false,
            opacity: 0.8,
            outline: false,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            radiusRange: [0, 50],
            'hi-precision': false
          }
        },
        {
          id: 'ej4',
          dataId: 'something',
          label: 'request',
          color: [130, 154, 227],
          columns: {
            lat: {
              value: 'request_lat',
              fieldIdx: 60
            },
            lng: {
              value: 'request_lng',
              fieldIdx: 61
            },
            altitude: {
              value: null,
              fieldIdx: -1,
              optional: true
            }
          },
          isVisible: false,
          isAggregated: false,
          type: 'point',
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            radius: 10,
            fixedRadius: false,
            opacity: 0.8,
            outline: false,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            radiusRange: [0, 50],
            'hi-precision': false
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            something: ['begintrip_timestamp_local', 'dropoff_timestamp_local']
          }
        }
      },
      layerBlending: 'normal'
    },
    mapStyle: {
      styleType: 'dark',
      topLayerGroups: {},
      visibleLayerGroups: {
        label: true,
        places: true,
        road: true,
        border: false,
        building: true,
        water: true,
        land: true
      },
      buildingLayer: {
        isVisible: false,
        color: [32, 32, 37],
        opacity: 0.7
      }
    },
    mapState: {
      bearing: 0,
      dragRotate: false,
      latitude: 37.785337133852245,
      longitude: -122.31216420269313,
      pitch: 0,
      zoom: 10.007195441591573
    }
  }
};

export const parsedConfigV0 = {
  visState: {
    filters: [],
    layers: [
      {
        id: '5em',
        type: 'arc',
        config: {
          dataId: 'something',
          label: 'trip arc',
          color: [18, 147, 154],
          columns: {
            lat0: 'begintrip_lat',
            lng0: 'begintrip_lng',
            lat1: 'dropoff_lat',
            lng1: 'dropoff_lng'
          },
          isVisible: false,
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            opacity: 0.8,
            targetColor: null,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            sizeRange: [0, 10],
            'hi-precision': false
          }
        }
      },
      {
        id: 'gtyf',
        type: 'cluster',
        config: {
          dataId: 'something',
          label: 'begintrip cluster',
          color: [241, 92, 23],
          columns: {
            lat: 'begintrip_lat',
            lng: 'begintrip_lng'
          },
          isVisible: false,
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            clusterRadius: 40,
            opacity: 0.8,
            outline: false,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            radiusRange: [1, 40],
            'hi-precision': false,
            enable3d: false,
            colorAggregation: 'average',
            sizeAggregation: 'average'
          }
        }
      },
      {
        id: 'rj',
        type: 'point',
        config: {
          dataId: 'something',
          label: 'begintrip',
          color: [218, 112, 191],
          columns: {
            lat: 'begintrip_lat',
            lng: 'begintrip_lng',
            altitude: null
          },
          isVisible: true,
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            radius: 10,
            fixedRadius: false,
            opacity: 0.8,
            outline: false,
            thickness: 2,
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
            strokeColor: [218, 112, 191],
            radiusRange: [0, 50],
            'hi-precision': false
          }
        }
      },
      {
        id: '9e7',
        type: 'point',
        config: {
          dataId: 'something',
          label: 'dropoff',
          color: [255, 153, 31],
          columns: {
            lat: 'dropoff_lat',
            lng: 'dropoff_lng',
            altitude: null
          },
          isVisible: false,
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            radius: 10,
            fixedRadius: false,
            opacity: 0.8,
            outline: false,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            strokeColor: [255, 153, 31],
            strokeColorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            radiusRange: [0, 50],
            'hi-precision': false
          }
        }
      },
      {
        id: 'ej4',
        type: 'point',
        config: {
          dataId: 'something',
          label: 'request',
          color: [130, 154, 227],
          columns: {
            lat: 'request_lat',
            lng: 'request_lng',
            altitude: null
          },
          isVisible: false,
          colorField: null,
          colorScale: 'quantile',
          sizeField: null,
          sizeScale: 'linear',
          visConfig: {
            radius: 10,
            fixedRadius: false,
            opacity: 0.8,
            outline: false,
            thickness: 2,
            colorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            strokeColor: [130, 154, 227],
            strokeColorRange: {
              name: 'Global Warming',
              type: 'sequential',
              category: 'Uber',
              colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
            },
            radiusRange: [0, 50],
            'hi-precision': false
          }
        }
      }
    ],
    interactionConfig: {
      tooltip: {
        enabled: true,
        fieldsToShow: {
          something: [
            {
              name: 'begintrip_timestamp_local',
              format: null
            },
            {
              name: 'dropoff_timestamp_local',
              format: null
            }
          ]
        }
      },
      brush: {
        enabled: false
      }
    },
    layerBlending: 'normal'
  },
  mapStyle: {
    styleType: 'dark',
    topLayerGroups: {},
    visibleLayerGroups: {
      label: true,
      places: true,
      road: true,
      border: false,
      building: true,
      water: true,
      land: true
    },
    buildingLayer: {
      isVisible: false,
      color: [32, 32, 37],
      opacity: 0.7
    }
  },
  mapState: {
    bearing: 0,
    dragRotate: false,
    latitude: 37.785337133852245,
    longitude: -122.31216420269313,
    pitch: 0,
    zoom: 10.007195441591573
  }
};
