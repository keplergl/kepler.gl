// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {
  findFieldsToShow,
  getTooltipDisplayValue,
  getTooltipDisplayDeltaValue,
  TOOLTIP_MINUS_SIGN
} from '@kepler.gl/reducers';
import {DEFAULT_TOOLTIP_FIELDS, COMPARE_TYPES} from '@kepler.gl/constants';
import {StateWTooltipFormat, testGeoJsonDataId} from 'test/helpers/mock-state';

const fields = [
  {
    name: 'lat'
  },
  {
    name: '_lat'
  },
  {
    name: 'se.longitude'
  },
  {
    name: 'p longitude'
  },
  {
    name: 'hex_id'
  },
  {
    name: 'all_points',
    type: 'geojson'
  },
  {
    name: 'a'
  },
  {
    name: 'b'
  },
  {
    name: 'c'
  },
  {
    name: 'd'
  },
  {
    name: 'e'
  },
  {
    name: 'f'
  }
];

test('interactionUtil -> findFieldsToShow', t => {
  const dataId = 'random_stuff';

  const someFields = [
    ...DEFAULT_TOOLTIP_FIELDS.slice(0, 2).map(d => ({name: d})),
    ...[
      {
        name: 'random'
      },
      {
        name: 'something_else'
      }
    ]
  ];

  const expectedFields = [
    {
      name: 'random',
      format: null
    },
    {
      name: 'something_else',
      format: null
    }
  ];

  t.deepEqual(
    findFieldsToShow({fields: someFields, id: dataId}),
    {random_stuff: expectedFields},
    'should find 2 default trip layers'
  );

  t.end();
});

test('interactionUtil -> autoFindTooltipFields', t => {
  const expectedFields = {
    test: [
      {
        name: 'hex_id',
        format: null
      },
      {
        name: 'a',
        format: null
      },
      {
        name: 'b',
        format: null
      }
    ]
  };

  t.deepEqual(
    findFieldsToShow({fields, id: 'test', maxDefaultTooltips: 3}),
    expectedFields,
    'should filter out all default geometry fields and return first 3'
  );

  t.end();
});

test('interactionUtil -> getTooltipDisplayDeltaValue', t => {
  const tooltipConfig = StateWTooltipFormat.visState.interactionConfig.tooltip.config;
  const dataset = StateWTooltipFormat.visState.datasets[testGeoJsonDataId];
  const testFieldIdx = dataset.fields.findIndex(f => f.name === 'TRIPS');
  const item = tooltipConfig.fieldsToShow[testGeoJsonDataId].find(fs => fs.name === 'TRIPS');

  const TEST_CASES = [
    {
      input: {
        primaryData: dataset.dataContainer.row(0),
        // field.displayFormat has been used to replace tooltipConfig.format
        field: {...dataset.fields[testFieldIdx], displayFormat: item.format},
        compareType: COMPARE_TYPES.ABSOLUTE,
        data: dataset.dataContainer.row(1),
        fieldIdx: testFieldIdx,
        item
      },
      output: `${TOOLTIP_MINUS_SIGN}7.000`,
      message: 'should display absolute delta value'
    },
    {
      input: {
        primaryData: dataset.dataContainer.row(0),
        field: {...dataset.fields[testFieldIdx], displayFormat: item.format},
        compareType: COMPARE_TYPES.RELATIVE,
        data: dataset.dataContainer.row(1),
        fieldIdx: testFieldIdx,
        item
      },
      output: `${TOOLTIP_MINUS_SIGN}63.64%`,
      message: 'should display relative delta value'
    },
    {
      input: {
        primaryData: dataset.dataContainer.row(3),
        field: {...dataset.fields[testFieldIdx], displayFormat: item.format},
        compareType: COMPARE_TYPES.ABSOLUTE,
        data: dataset.dataContainer.row(1),
        fieldIdx: testFieldIdx,
        item
      },
      output: TOOLTIP_MINUS_SIGN,
      message: 'should display - when primary is null'
    },
    {
      input: {
        primaryData: dataset.dataContainer.row(0),
        field: {...dataset.fields[testFieldIdx], displayFormat: item.format},
        compareType: COMPARE_TYPES.ABSOLUTE,
        data: dataset.dataContainer.row(3),
        fieldIdx: testFieldIdx,
        item
      },
      output: TOOLTIP_MINUS_SIGN,
      message: 'should display - when data is null'
    },
    {
      input: {
        primaryData: dataset.dataContainer.row(4),
        field: {...dataset.fields[testFieldIdx], displayFormat: item.format},
        compareType: COMPARE_TYPES.ABSOLUTE,
        data: dataset.dataContainer.row(3),
        fieldIdx: testFieldIdx,
        item
      },
      output: TOOLTIP_MINUS_SIGN,
      message: 'should display - when both are null'
    }
  ];

  TEST_CASES.forEach(tc => {
    t.equal(getTooltipDisplayDeltaValue(tc.input), tc.output, tc.message);
  });

  t.end();
});

test('interactionUtil -> getTooltipDisplayValue', t => {
  const tooltipConfig = StateWTooltipFormat.visState.interactionConfig.tooltip.config;
  const dataset = StateWTooltipFormat.visState.datasets[testGeoJsonDataId];
  const items = tooltipConfig.fieldsToShow[testGeoJsonDataId];

  const TEST_CASES = [
    {
      input: items[0], // OBJECTID
      output: ['1', '2', '3', '4', '5'],
      message: `should display correct tooltip value for ${items[0].name}`
    },
    {
      input: items[3], // ID
      output: ['11.000', '4.000', '20.000', '', ''],
      message: `should display correct tooltip value for ${items[3].name}`
    },
    {
      input: {name: 'OBJ', format: null}, // ID
      output: ['{"id":1}', '{"id":2}', '{"id":3}', '{"id":4}', '{"id":5}'],
      message: 'should display correct tooltip value for OBJ'
    }
  ];

  TEST_CASES.forEach(tc => {
    // field.displayFormat has been used to replace tooltipConfig.format
    const field = {
      ...dataset.fields.find(f => f.name === tc.input.name),
      displayFormat: tc.input.format
    };
    const fieldIdx = dataset.fields.findIndex(f => f.name === tc.input.name);

    t.deepEqual(
      dataset.dataContainer.map(data =>
        getTooltipDisplayValue({
          field,
          value: data.valueAt(fieldIdx),
          item: tc.input
        })
      ),
      tc.output,
      tc.message
    );
  });
  t.end();
});
