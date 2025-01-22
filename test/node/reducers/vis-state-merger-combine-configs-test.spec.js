// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VIS_STATE_MERGERS} from '@kepler.gl/reducers';

const TEST_CASES = [
  {
    testMessage:
      "interactionConfig (with input configs' tooltips.fieldsToShow with no repeated fields)",
    propName: 'interactionConfig',
    configsToMerge: [
      {
        tooltip: {
          enabled: true,
          fieldsToShow: {
            'point-dataset': [
              {name: 'DateTime', format: null},
              {name: 'Latitude', format: null},
              {name: 'Longitude', format: null}
            ],
            'trip-dataset': [{name: 'vendor', format: null}]
          },
          compareMode: true,
          compareType: 'absolute'
        },
        geocoder: {enabled: true},
        brush: {enabled: true, size: 0.5},
        coordinate: {enabled: false}
      },
      {
        tooltip: {
          enabled: true,
          fieldsToShow: {
            'trip-dataset': [{name: 'customer', format: null}]
          },
          compareMode: true,
          compareType: 'relative'
        },
        geocoder: {enabled: true},
        brush: {enabled: true, size: 2},
        coordinate: {enabled: false}
      },
      {
        tooltip: {
          enabled: true,
          fieldsToShow: {},
          compareMode: true,
          compareType: 'relative'
        },
        geocoder: {enabled: false},
        brush: {enabled: true, size: 3},
        coordinate: {enabled: false}
      }
    ],
    expected: {
      tooltip: {
        enabled: true,
        fieldsToShow: {
          'point-dataset': [
            {name: 'DateTime', format: null},
            {name: 'Latitude', format: null},
            {name: 'Longitude', format: null}
          ],
          'trip-dataset': [
            {name: 'vendor', format: null},
            {name: 'customer', format: null}
          ]
        },
        compareMode: true,
        compareType: 'relative'
      },
      geocoder: {enabled: true},
      brush: {enabled: true, size: 3},
      coordinate: {enabled: false}
    }
  },
  {
    testMessage:
      "interactionConfig (with input configs' tooltips.fieldsToShow with some repeated fields)",
    propName: 'interactionConfig',
    configsToMerge: [
      {
        tooltip: {
          enabled: true,
          fieldsToShow: {
            'point-dataset': [
              {name: 'DateTime', format: null},
              {name: 'Latitude', format: null},
              {name: 'Longitude', format: null}
            ],
            'trip-dataset': [{name: 'vendor', format: null}]
          },
          compareMode: true,
          compareType: 'absolute'
        },
        geocoder: {enabled: true},
        brush: {enabled: true, size: 0.5},
        coordinate: {enabled: false}
      },
      {
        tooltip: {
          enabled: true,
          fieldsToShow: {
            'trip-dataset': [
              {name: 'customer', format: null},
              {name: 'vendor', format: null}
            ],
            'point-dataset': [
              {name: 'DateTime', format: null},
              {name: 'Latitude', format: null},
              {name: 'Longitude', format: null}
            ]
          },
          compareMode: true,
          compareType: 'relative'
        },
        geocoder: {enabled: true},
        brush: {enabled: true, size: 2},
        coordinate: {enabled: false}
      },
      {
        tooltip: {
          enabled: true,
          fieldsToShow: {},
          compareMode: true,
          compareType: 'relative'
        },
        geocoder: {enabled: false},
        brush: {enabled: true, size: 3},
        coordinate: {enabled: false}
      }
    ],
    expected: {
      tooltip: {
        enabled: true,
        fieldsToShow: {
          'point-dataset': [
            {name: 'DateTime', format: null},
            {name: 'Latitude', format: null},
            {name: 'Longitude', format: null}
          ],
          'trip-dataset': [
            {name: 'vendor', format: null},
            {name: 'customer', format: null}
          ]
        },
        compareMode: true,
        compareType: 'relative'
      },
      geocoder: {enabled: true},
      brush: {enabled: true, size: 3},
      coordinate: {enabled: false}
    }
  },
  {
    testMessage: 'layerBlending (with a majority of "additive" values)',
    propName: 'layerBlending',
    configsToMerge: ['normal', 'additive', 'additive'],
    expected: 'additive'
  },
  {
    testMessage: 'layerBlending (with all undefined or null values)',
    propName: 'layerBlending',
    configsToMerge: [undefined, null, undefined],
    expected: null
  },
  {
    testMessage: 'overlayBlending (with 3 unique values)',
    propName: 'overlayBlending',
    configsToMerge: ['normal', 'screen', 'darken'],
    expected: 'normal'
  },
  {
    testMessage: 'overlayBlending (with some undefined values)',
    propName: 'overlayBlending',
    configsToMerge: [undefined, 'darken', undefined, 'darken', 'screen', undefined],
    expected: 'darken'
  },
  {
    testMessage: 'animationConfig',
    propName: 'animationConfig',
    configsToMerge: [
      {currentTime: 500, speed: 1},
      {currentTime: 100, speed: 5}
    ],
    expected: {currentTime: 100, speed: 1}
  },
  {
    testMessage: 'editor',
    propName: 'editor',
    configsToMerge: [
      {features: [], visible: undefined},
      {features: [{foo: 'bar'}], visible: true},
      {features: [{foo: 'bar'}, {abc: 'def'}], visible: false}
    ],
    expected: {
      features: [{foo: 'bar'}, {foo: 'bar'}, {abc: 'def'}],
      visible: true
    }
  }
];

describe('VisStateMergers: combineConfigs', () => {
  test.each(TEST_CASES)('$testMessage', ({propName, configsToMerge, expected}) => {
    const {combineConfigs} = VIS_STATE_MERGERS.find(
      m => m.prop === propName && typeof m.combineConfigs === 'function'
    );

    expect(combineConfigs(configsToMerge)).toEqual(expected);
  });
});
