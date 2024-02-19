// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {KeplerGlLayers} from '@kepler.gl/layers';
import {createDataContainer, histogramFromDomain} from '@kepler.gl/utils';
import {DEFAULT_COLOR_UI, BINS} from '@kepler.gl/constants';
const {H3Layer} = KeplerGlLayers;

export default `hex_id,value
89283082c2fffff,64
8928308288fffff,73
89283082c07ffff,65
89283082817ffff,74
89283082c3bffff,66
89283082883ffff,76
89283082c33ffff,43
89283082c23ffff,40
89283082887ffff,36
89283082ca7ffff,27
89283082cb3ffff,32
89283082c0bffff,26
89283082ca3ffff,19
89283082dcfffff,18
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
            value: [11.2, 28],
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
              hidden: false,
              isVisible: true,
              visConfig: {
                opacity: 0.8,
                colorRange: {
                  name: 'Global Warming',
                  type: 'sequential',
                  category: 'Uber',
                  colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
                },
                coverage: 1,
                enable3d: false,
                sizeRange: [0, 500],
                coverageRange: [0, 1],
                elevationScale: 5,
                enableElevationZoomFactor: true
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
              coverageScale: 'linear',
              strokeColorDomain: [0, 1],
              strokeColorField: 'something',
              strokeColorScale: 'something'
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
          },
          geocoder: {
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
    id: 'byjasfp0u',
    enabled: true,
    name: ['value'],
    type: 'range',
    value: [11.2, 28],
    view: 'side',
    plotType: {type: 'histogram'},
    yAxis: null,
    isAnimating: false,
    animationWindow: 'free',
    fieldIdx: [1],
    domain: [1, 76],
    step: 0.01,
    speed: 1,
    fieldType: 'integer',
    typeOptions: ['range'],
    fixedDomain: false,
    gpuChannel: [0],
    gpu: true,
    bins: {
      'h3-hex-id': histogramFromDomain(
        [1, 76],
        [64, 73, 65, 74, 66, 76, 43, 40, 36, 27, 32, 26, 19, 18, 1, 3, 2, 4, 6, 1, 1, 1],
        BINS
      )
    }
  }
];

const mergedFields = [
  {
    name: 'hex_id',
    id: 'hex_id',
    displayName: 'hex_id',
    format: '',
    fieldIdx: 0,
    type: 'string',
    analyzerType: 'STRING',
    valueAccessor: values => values[0]
  },
  {
    name: 'value',
    id: 'value',
    displayName: 'value',
    format: '',
    fieldIdx: 1,
    type: 'integer',
    analyzerType: 'INT',
    valueAccessor: values => values[1],
    filterProps: {
      domain: [1, 76],
      step: 0.01,
      fieldType: 'integer',
      value: [1, 76],
      type: 'range',
      typeOptions: ['range'],
      gpu: true,
      view: 'side'
    }
  }
];

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
  hidden: false,
  isVisible: true,
  highlightColor: [252, 242, 26, 255],
  isConfigActive: false,
  colorField: {
    name: 'value',
    id: 'value',
    displayName: 'value',
    format: '',
    fieldIdx: 1,
    type: 'integer',
    analyzerType: 'INT',
    valueAccessor: values => values[1]
  },
  colorScale: 'quantile',
  colorDomain: [18, 19, 26, 27],
  sizeField: null,
  sizeDomain: [0, 1],
  sizeScale: 'linear',
  coverageField: null,
  coverageScale: 'linear',
  coverageDomain: [0, 1],
  strokeColorDomain: [0, 1],
  strokeColorField: null,
  strokeColorScale: 'quantile',
  visConfig: {
    opacity: 0.8,
    colorRange: {
      name: 'Global Warming',
      type: 'sequential',
      category: 'Uber',
      colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
    },
    filled: true,
    outline: false,
    strokeColor: null,
    strokeColorRange: {
      name: 'Global Warming',
      type: 'sequential',
      category: 'Uber',
      colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
    },
    strokeOpacity: 0.8,
    thickness: 2,
    coverage: 1,
    sizeRange: [0, 500],
    coverageRange: [0, 1],
    enable3d: false,
    elevationScale: 5,
    enableElevationZoomFactor: true
  },
  textLabel: [
    {
      field: null,
      color: [255, 255, 255],
      size: 18,
      offset: [0, 0],
      anchor: 'start',
      alignment: 'center',
      outlineWidth: 0,
      outlineColor: [255, 0, 0, 255],
      background: false,
      backgroundColor: [0, 0, 200, 255]
    }
  ],
  colorUI: {
    color: DEFAULT_COLOR_UI,
    colorRange: DEFAULT_COLOR_UI,
    strokeColorRange: DEFAULT_COLOR_UI
  },
  animation: {
    enabled: false
  }
};

const expectedMergedDatasetData = [
  ['89283082c2fffff', 64],
  ['8928308288fffff', 73],
  ['89283082c07ffff', 65],
  ['89283082817ffff', 74],
  ['89283082c3bffff', 66],
  ['89283082883ffff', 76],
  ['89283082c33ffff', 43],
  ['89283082c23ffff', 40],
  ['89283082887ffff', 36],
  ['89283082ca7ffff', 27],
  ['89283082cb3ffff', 32],
  ['89283082c0bffff', 26],
  ['89283082ca3ffff', 19],
  ['89283082dcfffff', 18],
  ['89283082d8fffff', 1],
  ['89283095347ffff', 3],
  ['89283095363ffff', 2],
  ['8928309537bffff', 4],
  ['89283082d93ffff', 6],
  ['89283082d73ffff', 1],
  ['8928309530bffff', 1],
  ['8928309532bffff', 1]
];

const dataContainer = createDataContainer(expectedMergedDatasetData, {fields: mergedFields});
const indices = dataContainer.getPlainIndex();

export const expectedMergedDataset = {
  id: 'h3-hex-id',
  label: 'new dataset',
  color: 'dont test me',
  metadata: {
    id: 'h3-hex-id',
    label: 'new dataset',
    format: ''
  },
  type: '',
  supportedFilterTypes: null,
  disableDataOperation: false,
  dataContainer,
  allIndexes: indices,
  filteredIndex: indices,
  filteredIndexForDomain: [9, 11, 12, 13],
  fieldPairs: [],
  fields: mergedFields,
  gpuFilter: {
    filterRange: [
      [10.2, 27],
      [0, 0],
      [0, 0],
      [0, 0]
    ],
    filterValueUpdateTriggers: {
      gpuFilter_0: {name: 'value', domain0: 1},
      gpuFilter_1: null,
      gpuFilter_2: null,
      gpuFilter_3: null
    },
    filterValueAccessor: {
      inputs: [{index: 6}],
      result: [42, 0, 0, 0]
    }
  },
  filterRecord: {
    dynamicDomain: [mergedFilters[0]],
    fixedDomain: [],
    cpu: [],
    gpu: [mergedFilters[0]]
  },
  changedFilters: {
    dynamicDomain: {byjasfp0u: 'added'},
    fixedDomain: null,
    cpu: null,
    gpu: {byjasfp0u: 'added'}
  }
};
