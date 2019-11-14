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

import {KeplerGlLayers} from 'layers';
const {H3Layer} = KeplerGlLayers;
import {DEFAULT_COLOR_UI} from 'layers/layer-factory';

export default `hex_id,value
89283082c2fffff,64
8928308288fffff,73
89283082c07ffff,65
89283082817ffff,74
89283082c3bffff,66
89283082883ffff,76
89283082c03ffff,60
89283082807ffff,68
8928308289bffff,49
89283082c0fffff,41
89283082c87ffff,50
89283082d4fffff,45
89283082c77ffff,41
89283082c2bffff,53
89283082803ffff,41
89283082813ffff,43
89283082d5bffff,45
89283082897ffff,40
89283082c67ffff,42
89283082d47ffff,51
89283082dc3ffff,52
89283082c33ffff,43
89283082c23ffff,40
89283082887ffff,36
89283082d4bffff,36
892830828bbffff,48
892830828b7ffff,28
89283082c17ffff,34
89283082c6fffff,21
8928308288bffff,25
892830828abffff,26
89283082c27ffff,27
89283082c8fffff,33
89283082cafffff,29
89283082c13ffff,27
89283082cabffff,22
89283082c63ffff,26
89283082d43ffff,30
89283082d53ffff,19
892830828a3ffff,28
89283082d1bffff,20
89283095367ffff,17
8928309536bffff,26
89283082c37ffff,16
89283082c73ffff,17
89283082c8bffff,15
89283082ca7ffff,27
89283082cb3ffff,32
89283082c0bffff,26
89283082ca3ffff,19
89283082dcfffff,18
89283082c1bffff,20
89283082ddbffff,18
8928309534fffff,16
89283082d03ffff,15
89283082cbbffff,21
89283082cd7ffff,9
8928309534bffff,9
892830828c7ffff,13
89283082cc7ffff,12
89283082d0bffff,19
89283082dcbffff,19
89283082dd3ffff,15
89283082dd7ffff,15
892830828d7ffff,13
89283082d17ffff,5
8928309536fffff,8
89283095373ffff,6
89283082cb7ffff,15
89283082d83ffff,9
89283082d07ffff,4
89283082d0fffff,3
89283082d13ffff,6
89283082d9bffff,5
89283082c83ffff,11
89283082d8bffff,4
89283082dc7ffff,5
89283095377ffff,5
89283082c97ffff,4
89283082d7bffff,2
89283082d8fffff,1
89283095347ffff,3
89283095363ffff,2
8928309537bffff,4
89283082d93ffff,6
89283082d73ffff,1
8928309530bffff,1
8928309532bffff,1`;

export const dataId = 'h3-hex-id';

export const hexIdDataConfig = {
  dataId,
  config: {
    version: 'v1',
    config: {
      visState: {
        filters: [
          {
            dataId: [dataId],
            id: 'byjasfp0u',
            name: 'value',
            type: 'range',
            value: [11.2, 18],
            enlarged: false,
            plotType: 'histogram',
            yAxis: null
          }
        ],
        layers: [
          {
            id: 'avlgol',
            type: 'hexagonId',
            config: {
              dataId,
              label: 'H3 Hexagon',
              color: [241, 92, 23],
              columns: {
                hex_id: 'hex_id'
              },
              isVisible: true,
              visConfig: {
                opacity: 0.8,
                colorRange: {
                  name: 'Global Warming',
                  type: 'sequential',
                  category: 'Uber',
                  colors: [
                    '#5A1846',
                    '#900C3F',
                    '#C70039',
                    '#E3611C',
                    '#F1920E',
                    '#FFC300'
                  ]
                },
                coverage: 1,
                sizeRange: [0, 500],
                coverageRange: [0, 1],
                elevationScale: 5
              },
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
              colorField: {
                name: 'value',
                type: 'integer'
              },
              colorScale: 'quantile',
              sizeField: null,
              sizeScale: 'linear',
              coverageField: null,
              coverageScale: 'linear'
            }
          }
        ],
        interactionConfig: {
          tooltip: {
            fieldsToShow: {
              [dataId]: ['hex_id', 'value']
            },
            enabled: true
          },
          brush: {
            size: 0.5,
            enabled: false
          }
        },
        layerBlending: 'normal',
        splitMaps: []
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
        mapStyles: {}
      }
    }
  }
};

export const mergedFilters = [
  {
    dataId: [dataId],
    id: 'value',
    name: ['value'],
    type: 'range',
    value: [11.2, 18],
    enlarged: false,
    freeze: true,
    plotType: 'histogram',
    yAxis: null,
    isAnimating: false,
    fieldIdx: [1],
    domain: [1, 76],
    step: 0.1,
    interval: null,
    histogram: ['Not tested'],
    enlargedHistogram: ['Not tested'],
    speed: 1,
    fieldType: 'integer',
    typeOptions: ['range'],
    fixedDomain: false
  }
];

const allData = [
  ['89283082c2fffff', 64],
  ['8928308288fffff', 73],
  ['89283082c07ffff', 65],
  ['89283082817ffff', 74],
  ['89283082c3bffff', 66],
  ['89283082883ffff', 76],
  ['89283082c03ffff', 60],
  ['89283082807ffff', 68],
  ['8928308289bffff', 49],
  ['89283082c0fffff', 41],
  ['89283082c87ffff', 50],
  ['89283082d4fffff', 45],
  ['89283082c77ffff', 41],
  ['89283082c2bffff', 53],
  ['89283082803ffff', 41],
  ['89283082813ffff', 43],
  ['89283082d5bffff', 45],
  ['89283082897ffff', 40],
  ['89283082c67ffff', 42],
  ['89283082d47ffff', 51],
  ['89283082dc3ffff', 52],
  ['89283082c33ffff', 43],
  ['89283082c23ffff', 40],
  ['89283082887ffff', 36],
  ['89283082d4bffff', 36],
  ['892830828bbffff', 48],
  ['892830828b7ffff', 28],
  ['89283082c17ffff', 34],
  ['89283082c6fffff', 21],
  ['8928308288bffff', 25],
  ['892830828abffff', 26],
  ['89283082c27ffff', 27],
  ['89283082c8fffff', 33],
  ['89283082cafffff', 29],
  ['89283082c13ffff', 27],
  ['89283082cabffff', 22],
  ['89283082c63ffff', 26],
  ['89283082d43ffff', 30],
  ['89283082d53ffff', 19],
  ['892830828a3ffff', 28],
  ['89283082d1bffff', 20],
  ['89283095367ffff', 17],
  ['8928309536bffff', 26],
  ['89283082c37ffff', 16],
  ['89283082c73ffff', 17],
  ['89283082c8bffff', 15],
  ['89283082ca7ffff', 27],
  ['89283082cb3ffff', 32],
  ['89283082c0bffff', 26],
  ['89283082ca3ffff', 19],
  ['89283082dcfffff', 18],
  ['89283082c1bffff', 20],
  ['89283082ddbffff', 18],
  ['8928309534fffff', 16],
  ['89283082d03ffff', 15],
  ['89283082cbbffff', 21],
  ['89283082cd7ffff', 9],
  ['8928309534bffff', 9],
  ['892830828c7ffff', 13],
  ['89283082cc7ffff', 12],
  ['89283082d0bffff', 19],
  ['89283082dcbffff', 19],
  ['89283082dd3ffff', 15],
  ['89283082dd7ffff', 15],
  ['892830828d7ffff', 13],
  ['89283082d17ffff', 5],
  ['8928309536fffff', 8],
  ['89283095373ffff', 6],
  ['89283082cb7ffff', 15],
  ['89283082d83ffff', 9],
  ['89283082d07ffff', 4],
  ['89283082d0fffff', 3],
  ['89283082d13ffff', 6],
  ['89283082d9bffff', 5],
  ['89283082c83ffff', 11],
  ['89283082d8bffff', 4],
  ['89283082dc7ffff', 5],
  ['89283095377ffff', 5],
  ['89283082c97ffff', 4],
  ['89283082d7bffff', 2],
  ['89283082d8fffff', 1],
  ['89283095347ffff', 3],
  ['89283095363ffff', 2],
  ['8928309537bffff', 4],
  ['89283082d93ffff', 6],
  ['89283082d73ffff', 1],
  ['8928309530bffff', 1],
  ['8928309532bffff', 1]
];

const filteredData = [
  ['89283095367ffff', 17],
  ['89283082c37ffff', 16],
  ['89283082c73ffff', 17],
  ['89283082c8bffff', 15],
  ['89283082dcfffff', 18],
  ['89283082ddbffff', 18],
  ['8928309534fffff', 16],
  ['89283082d03ffff', 15],
  ['892830828c7ffff', 13],
  ['89283082cc7ffff', 12],
  ['89283082dd3ffff', 15],
  ['89283082dd7ffff', 15],
  ['892830828d7ffff', 13],
  ['89283082cb7ffff', 15]
];

const filteredIndex = [41, 43, 44, 45, 50, 52, 53, 54, 58, 59, 62, 63, 64, 68];
const filteredIndexForDomain = [41, 43, 44, 45, 50, 52, 53, 54, 58, 59, 62, 63, 64, 68];

const fields = [
  {
    name: 'hex_id',
    format: '',
    tableFieldIndex: 1,
    type: 'string',
    id: 'hex_id'
  },
  {
    name: 'value',
    format: '',
    tableFieldIndex: 2,
    type: 'integer',
    id: 'value',
    filterProps: {
      domain: [1, 76],
      step: 0.1,
      histogram: [
        {count: 4, x0: 1, x1: 2},
        {count: 4, x0: 2, x1: 4},
        {count: 8, x0: 4, x1: 6},
        {count: 3, x0: 6, x1: 8},
        {count: 4, x0: 8, x1: 10},
        {count: 1, x0: 10, x1: 12},
        {count: 3, x0: 12, x1: 14},
        {count: 5, x0: 14, x1: 16},
        {count: 4, x0: 16, x1: 18},
        {count: 6, x0: 18, x1: 20},
        {count: 4, x0: 20, x1: 22},
        {count: 1, x0: 22, x1: 24},
        {count: 1, x0: 24, x1: 26},
        {count: 7, x0: 26, x1: 28},
        {count: 3, x0: 28, x1: 30},
        {count: 1, x0: 30, x1: 32},
        {count: 2, x0: 32, x1: 34},
        {count: 1, x0: 34, x1: 36},
        {count: 2, x0: 36, x1: 38},
        {count: 0, x0: 38, x1: 40},
        {count: 5, x0: 40, x1: 42},
        {count: 3, x0: 42, x1: 44},
        {count: 2, x0: 44, x1: 46},
        {count: 0, x0: 46, x1: 48},
        {count: 2, x0: 48, x1: 50},
        {count: 2, x0: 50, x1: 52},
        {count: 2, x0: 52, x1: 54},
        {count: 0, x0: 54, x1: 56},
        {count: 0, x0: 56, x1: 58},
        {count: 0, x0: 58, x1: 60},
        {count: 1, x0: 60, x1: 62},
        {count: 0, x0: 62, x1: 64},
        {count: 2, x0: 64, x1: 66},
        {count: 1, x0: 66, x1: 68},
        {count: 1, x0: 68, x1: 70},
        {count: 0, x0: 70, x1: 72},
        {count: 1, x0: 72, x1: 74},
        {count: 1, x0: 74, x1: 76},
        {count: 1, x0: 76, x1: 76}
      ],
      enlargedHistogram: [
        {count: 4, x0: 1, x1: 2},
        {count: 2, x0: 2, x1: 3},
        {count: 2, x0: 3, x1: 4},
        {count: 4, x0: 4, x1: 5},
        {count: 4, x0: 5, x1: 6},
        {count: 3, x0: 6, x1: 7},
        {count: 0, x0: 7, x1: 8},
        {count: 1, x0: 8, x1: 9},
        {count: 3, x0: 9, x1: 10},
        {count: 0, x0: 10, x1: 11},
        {count: 1, x0: 11, x1: 12},
        {count: 1, x0: 12, x1: 13},
        {count: 2, x0: 13, x1: 14},
        {count: 0, x0: 14, x1: 15},
        {count: 5, x0: 15, x1: 16},
        {count: 2, x0: 16, x1: 17},
        {count: 2, x0: 17, x1: 18},
        {count: 2, x0: 18, x1: 19},
        {count: 4, x0: 19, x1: 20},
        {count: 2, x0: 20, x1: 21},
        {count: 2, x0: 21, x1: 22},
        {count: 1, x0: 22, x1: 23},
        {count: 0, x0: 23, x1: 24},
        {count: 0, x0: 24, x1: 25},
        {count: 1, x0: 25, x1: 26},
        {count: 4, x0: 26, x1: 27},
        {count: 3, x0: 27, x1: 28},
        {count: 2, x0: 28, x1: 29},
        {count: 1, x0: 29, x1: 30},
        {count: 1, x0: 30, x1: 31},
        {count: 0, x0: 31, x1: 32},
        {count: 1, x0: 32, x1: 33},
        {count: 1, x0: 33, x1: 34},
        {count: 1, x0: 34, x1: 35},
        {count: 0, x0: 35, x1: 36},
        {count: 2, x0: 36, x1: 37},
        {count: 0, x0: 37, x1: 38},
        {count: 0, x0: 38, x1: 39},
        {count: 0, x0: 39, x1: 40},
        {count: 2, x0: 40, x1: 41},
        {count: 3, x0: 41, x1: 42},
        {count: 1, x0: 42, x1: 43},
        {count: 2, x0: 43, x1: 44},
        {count: 0, x0: 44, x1: 45},
        {count: 2, x0: 45, x1: 46},
        {count: 0, x0: 46, x1: 47},
        {count: 0, x0: 47, x1: 48},
        {count: 1, x0: 48, x1: 49},
        {count: 1, x0: 49, x1: 50},
        {count: 1, x0: 50, x1: 51},
        {count: 1, x0: 51, x1: 52},
        {count: 1, x0: 52, x1: 53},
        {count: 1, x0: 53, x1: 54},
        {count: 0, x0: 54, x1: 55},
        {count: 0, x0: 55, x1: 56},
        {count: 0, x0: 56, x1: 57},
        {count: 0, x0: 57, x1: 58},
        {count: 0, x0: 58, x1: 59},
        {count: 0, x0: 59, x1: 60},
        {count: 1, x0: 60, x1: 61},
        {count: 0, x0: 61, x1: 62},
        {count: 0, x0: 62, x1: 63},
        {count: 0, x0: 63, x1: 64},
        {count: 1, x0: 64, x1: 65},
        {count: 1, x0: 65, x1: 66},
        {count: 1, x0: 66, x1: 67},
        {count: 0, x0: 67, x1: 68},
        {count: 1, x0: 68, x1: 69},
        {count: 0, x0: 69, x1: 70},
        {count: 0, x0: 70, x1: 71},
        {count: 0, x0: 71, x1: 72},
        {count: 0, x0: 72, x1: 73},
        {count: 1, x0: 73, x1: 74},
        {count: 1, x0: 74, x1: 75},
        {count: 0, x0: 75, x1: 76},
        {count: 1, x0: 76, x1: 76}
      ],
      fieldType: 'integer',
      value: [1, 76],
      type: 'range',
      typeOptions: ['range']
    }
  }
];

export const expectedHexDataset = {
  id: dataId,
  fields,
  allData,
  data: filteredData,
  filteredIndex,
  filteredIndexForDomain,
  fieldPairs: [],
  label: 'new dataset',
  color: 'dont test me'
};

export const mergedH3Layer = new H3Layer({
  id: 'avlgol'
});

mergedH3Layer.config = {
  dataId,
  label: 'H3 Hexagon',
  color: [241, 92, 23],
  columns: {
    hex_id: {
      value: 'hex_id',
      fieldIdx: 0
    }
  },
  isVisible: true,
  highlightColor: [252, 242, 26, 255],
  isConfigActive: false,
  colorField: fields[1],
  colorScale: 'quantile',
  colorDomain: [12, 13, 13, 15, 15, 15, 15, 15, 16, 16, 17, 17, 18, 18],
  sizeField: null,
  sizeDomain: [0, 1],
  sizeScale: 'linear',
  coverageField: null,
  coverageScale: 'linear',
  coverageDomain: [0, 1],
  visConfig: {
    opacity: 0.8,
    colorRange: {
      name: 'Global Warming',
      type: 'sequential',
      category: 'Uber',
      colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
    },
    coverage: 1,
    sizeRange: [0, 500],
    coverageRange: [0, 1],
    elevationScale: 5
  },
  textLabel: [
    {
      field: null,
      color: [255, 255, 255],
      size: 18,
      offset: [0, 0],
      anchor: 'start',
      alignment: 'center'
    }
  ],
  colorUI: {
    color: DEFAULT_COLOR_UI,
    colorRange: DEFAULT_COLOR_UI
  },
  animation: {
    enabled: false
  }
};
