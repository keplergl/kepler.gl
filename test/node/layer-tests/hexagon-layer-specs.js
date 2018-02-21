import test from 'tape';
import {
  testCreateCases,
  testFormatLayerDataCases
} from '../test-utils/layer-utils';
import {HexagonLayer} from 'keplergl-layers';

import {processCsvData} from 'processor/data-processor';
import csvData, {testFields} from '../../fixtures/test-csv-data';

test('#HexagonLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test hexagon layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'HexagonLayer dataId should be correct'
          );
          t.ok(layer.type === 'hexagon', 'type should be hexagon');
          t.ok(layer.isAggregated === true, 'HexagonLayer is aggregated');
        }
      }
    ]
  };

  testCreateCases(t, HexagonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#HexagonLayer -> formatLayerData', async t => {
  const {rows} = await processCsvData(csvData);

  const filteredIndex = [0, 2, 4];
  const data = [rows[0], rows[2], rows[4]];

  const dataWithNull = [[null, null, '12']].concat(data);
  const allDataWithNull = [[null, null, '12']].concat(rows);

  const expectedLayerMeta = {
    bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122],
    lightSettings: {
      lightsPosition: [
        31.2148748,
        29.9870074,
        8000,
        31.2590542,
        30.0614122,
        8000
      ],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.3,
      lightsStrength: [0.9, 0, 0.8, 0],
      numberOfLights: 2
    }
  };

  const TEST_CASES = [
    {
      props: {
        dataId: '0dj3h',
        label: 'some geometry file',
        columns: {
          lat: {
            value: 'gps_data.lat',
            fieldIdx: 1
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          }
        }
      },
      data: [data, rows, filteredIndex, undefined],
      test: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [rows[0], rows[2], rows[4]],
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData),
          ['data', 'getPosition'],
          'layerData should have 2 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct hexagon layerData'
        );
        t.ok(
          typeof layerData.getPosition === 'function',
          'should have getPosition'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2590542, 29.9900937],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct grid layerData'
        );
      }
    },
    {
      props: {
        dataId: '0dj3h',
        label: 'some geometry file',
        columns: {
          lat: {
            value: 'gps_data.lat',
            fieldIdx: 1
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          }
        }
      },
      updates: [
        {method: 'layerConfigChangeUpdater', args: [{colorField: testFields[6]}]},
        {
          method: 'updateLayerVisualChannel',
          args: [{data: dataWithNull, allData: allDataWithNull}, 'color']
        }
      ],
      data: [dataWithNull, allDataWithNull, filteredIndex, undefined],
      test: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [[null, null, '12'], rows[1], rows[3]],
          getPosition: () => {},
          getColorValue: () => {}
        };

        t.deepEqual(
          Object.keys(layerData),
          ['data', 'getPosition', 'getColorValue'],
          'layerData should have 2 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should not filter out nulls, format correct hexagon layerData'
        );
        t.ok(
          typeof layerData.getPosition === 'function',
          'should have getPosition'
        );
        t.ok(
          typeof layerData.getColorValue === 'function',
          'should have getColorValue'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          ['12', null],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct grid layerData'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, HexagonLayer, TEST_CASES);
  t.end();
});
